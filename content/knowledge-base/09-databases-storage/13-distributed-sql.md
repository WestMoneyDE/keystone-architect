---
{"id": "KB-0207", "title": "Distributed SQL", "domain": "09", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0203", "concepts": ["Konsistenzmodelle", "CAP"], "needed_for": "understanding"}, {"id": "KB-0200", "concepts": ["Transaktionen", "Isolation"], "needed_for": "understanding"}], "related": ["KB-0206", "KB-0199"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Gedankenmodell für regionale Schreibpfad-Latenz gegenüber einer einzelnen primären Region durchrechnen.", "rationale": "Der Latenzeffekt globaler Konsens-Koordination wird erst durch konkrete Zahlen greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Datenlokalität (welche Daten wo primär geschrieben werden) für einen konkreten globalen Anwendungsfall begründet festlegen.", "rationale": "Falsche Datenlokalität erzeugt unnötige grenzüberschreitende Konsens-Latenz."}, "STAFF-TARGET": {"active": true, "scope": "Unerwartet hohe Schreiblatenz auf grenzüberschreitenden Konsens statt auf ein Anwendungsproblem zurückführen können.", "rationale": "Verteilte Konsens-Kosten sind für Teams ohne dieses Wissen oft unsichtbar."}, "CHIEF-TARGET": {"active": true, "scope": "Distributed SQL gegenüber klassischer primär-replizierter relationaler Datenbank als Antwort auf ein konkretes globales Konsistenz-/Verfügbarkeitsproblem positionieren, nicht als generelles Upgrade.", "rationale": "Distributed SQL löst ein spezifisches Problem (globale Konsistenz bei verteilten Schreibzugriffen) mit realen Latenzkosten, kein kostenloses Upgrade."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Konsens-Implementierungsdetails (Raft-Varianten, TrueTime) sind Vertiefung.", "rationale": "Kern ist das Verständnis von Datenlokalität und Konsens-Latenz-Trade-off, nicht die einzelne Produktimplementierung."}}, "lab_validation": [{"lab_id": "KB-0207-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für regionale Latenzsimulation bei verteiltem Konsens", "evidence": "Ein Schreibvorgang, der Konsens über mehrere geografisch verteilte Knoten benötigt, ist strukturell langsamer als ein Schreibvorgang gegen einen einzelnen lokalen Knoten.", "limitations": "Kein echtes Distributed-SQL-System, keine reale Netzwerklatenz, keine Produktion."}]}
---
# Distributed SQL

> **Ziel:** Distributed-SQL-Systeme bieten relationale Semantik (SQL, Transaktionen) über geografisch verteilte Knoten hinweg, indem sie verteilten Konsens für Schreibvorgänge nutzen — das löst ein konkretes Problem (globale Konsistenz ohne manuelles Sharding), kostet aber reale Latenz bei grenzüberschreitenden Schreibzugriffen. Es ist kein kostenloses Upgrade gegenüber klassischer Replikation.

## Zweck, Mental Model und Dependencies

Klassische relationale Replikation hat einen primären Knoten, der alle Schreibvorgänge verarbeitet, und Replikate, die asynchron oder synchron folgen — das begrenzt globale Schreibleistung, weil alle Schreibvorgänge zum primären Knoten reisen müssen. Distributed-SQL-Systeme verteilen Daten über mehrere Knoten (oft nach Zeilenbereich oder Schlüssel partitioniert) und nutzen Konsensprotokolle (z. B. Raft-Varianten), damit jede Partition unabhängig, aber konsistent Schreibvorgänge verarbeiten kann — Transaktionen über mehrere Partitionen hinweg erfordern dann verteilten Konsens zwischen den beteiligten Knoten, was Latenz proportional zur geografischen Entfernung zwischen den Konsens-Teilnehmern kostet. Der zentrale Trade-off: globale Konsistenz und horizontale Schreibskalierung gegen erhöhte Latenz bei Transaktionen, die mehrere geografisch verteilte Partitionen betreffen. Lies [KB-0203](07-konsistenzmodelle-und-cap-theorem-praxis.md) und [KB-0200](04-transaktionen-und-isolation-level.md).

~~~text
Classic replication:  all writes -> single primary -> replicas follow -> write throughput bounded by primary
Distributed SQL:      data partitioned across nodes -> each partition has local consensus group -> writes scale horizontally
                       BUT cross-partition transactions need distributed consensus -> latency grows with geographic distance
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Datenlokalität | sind häufig gemeinsam zugegriffene Daten in derselben Partition/Region? | schlechte Datenlokalität erzeugt unnötige grenzüberschreitende Konsens-Transaktionen |
| Konsens-Latenz | ist die reale Latenzkosten grenzüberschreitenden Konsenses im Kapazitätsplan berücksichtigt? | Latenz wird erst in Produktion unter globaler Last sichtbar |
| Partitionierungsstrategie | folgt die Partitionierung den tatsächlichen Zugriffsmustern? | falsche Partitionierung erzeugt Hotspots oder häufige Cross-Partition-Transaktionen |
| Regionaler Schreibpfad | welche Region ist für welche Daten primär schreibberechtigt? | unklare regionale Schreibverantwortung erzeugt Konflikte oder unnötige Koordination |

Implementierung: Datenlokalität wird explizit geplant, indem häufig gemeinsam benötigte Daten (z. B. alle Datensätze eines Kunden) in dieselbe Partition oder Region gelegt werden, um Cross-Partition-Transaktionen zu minimieren. Die Partitionierungsstrategie (Range- oder Hash-basiert) wird anhand des dominanten Zugriffsmusters gewählt, nicht nach Standardkonfiguration. Regionale Schreibpfade werden explizit definiert — bei global verteilten Anwendungen wird festgelegt, welche Region für welche Datenteilmenge primär schreibt, um unnötige globale Konsens-Koordination zu vermeiden.

## Scalability, Reliability, Security und Observability

Distributed SQL skaliert Schreiblast horizontal über Partitionen, im Gegensatz zu klassischer primär-replizierter Architektur, die durch die Kapazität eines einzelnen primären Knotens begrenzt ist. Reliability-Grenze: schlechte Datenlokalität führt nicht zu einem sichtbaren Ausfall, sondern zu einer schleichenden Latenzverschlechterung bei Transaktionen, die unnötig mehrere geografisch entfernte Partitionen involvieren.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Schreiblatenz ist deutlich höher als bei vergleichbarer klassischer Replikation | Transaktionen involvieren häufig mehrere geografisch entfernte Partitionen (schlechte Datenlokalität) | Anteil der Cross-Partition-Transaktionen an der Gesamtlast messen |
| Latenz variiert stark je nach Client-Standort | regionaler Schreibpfad ist nicht auf die Nähe zum primären Konsens-Teilnehmer optimiert | Latenz nach Client-Region gegen die Position der primären Partition vergleichen |
| bestimmte Datensätze zeigen deutlich höhere Latenz als andere | Partitionierungsstrategie erzeugt für diese Datensätze ungünstige Verteilung oder Hotspots | Partitionsverteilung für die betroffenen Datensätze gegen die Zugriffsverteilung prüfen |
| Team erwartet dieselbe Latenz wie bei lokaler Datenbank, ist aber enttäuscht | Latenzkosten verteilten Konsenses waren im Kapazitätsplan nicht berücksichtigt | erwartete versus gemessene Latenz für Cross-Region-Transaktionen dokumentieren und vergleichen |

Security: verteilte Knoten über mehrere Regionen erhöhen die Angriffsfläche und erfordern konsistente Verschlüsselung sowohl während der Übertragung zwischen Knoten als auch im Ruhezustand je Region, inklusive regionsspezifischer Compliance-Anforderungen (z. B. Datenresidenz). Observability: Latenzverteilung nach Transaktionstyp (lokal vs. Cross-Partition) und nach Region ist zentral, um Datenlokalitätsprobleme frühzeitig zu erkennen.

## Trade-offs und Entscheidungen

**Staff** plant Datenlokalität explizit, um unnötige Cross-Partition-Transaktionen zu vermeiden. **Principal** macht Latenzkosten verteilten Konsenses für das Team im Kapazitätsplan sichtbar. **Chief** positioniert Distributed SQL als Antwort auf ein konkretes globales Konsistenzproblem, nicht als generelles Skalierungs-Upgrade.

Anti-Patterns: Distributed SQL einführen, ohne Datenlokalität zu planen, und dann von unerwarteter Latenz überrascht sein; Cross-Partition-Transaktionen im Anwendungsdesign nicht bewusst minimieren; Latenzkosten verteilten Konsenses im Kapazitätsplan ignorieren.

## Production Checklist

- [ ] Datenlokalität ist explizit geplant, häufig gemeinsam benötigte Daten liegen in derselben Partition/Region.
- [ ] Partitionierungsstrategie folgt dokumentierten, dominanten Zugriffsmustern.
- [ ] Regionale Schreibverantwortung ist für globale Datenteilmengen explizit festgelegt.
- [ ] Latenzverteilung nach Transaktionstyp (lokal vs. Cross-Partition) wird überwacht.

## Interviewfragen

### 1. Was ist der zentrale Trade-off von Distributed SQL gegenüber klassischer Replikation?

**Antwort:** Globale Konsistenz und horizontale Schreibskalierung gegen erhöhte Latenz bei Transaktionen, die mehrere geografisch verteilte Partitionen betreffen — der Latenzkosten entsteht durch verteilten Konsens.

### 2. Warum ist Datenlokalität bei Distributed SQL eine kritische Planungsentscheidung?

**Antwort:** Häufig gemeinsam benötigte Daten in derselben Partition/Region zu halten minimiert Cross-Partition-Transaktionen, die den teuren, latenzintensiven verteilten Konsens auslösen.

### 3. Warum skaliert Distributed SQL Schreiblast besser als klassische primär-replizierte Systeme?

**Antwort:** Weil Schreibvorgänge über mehrere unabhängige Partitionen mit eigenen Konsens-Gruppen verteilt werden, statt alle Schreibvorgänge durch einen einzelnen primären Knoten zu leiten.

### 4. Wie diagnostizierst du eine unerwartet hohe Schreiblatenz in einem Distributed-SQL-System?

**Antwort:** Ich prüfe zuerst den Anteil der Cross-Partition-Transaktionen an der Gesamtlast — hohe Latenz korreliert meist mit Transaktionen, die mehrere geografisch entfernte Partitionen involvieren müssen.

### 5. Warum ist Distributed SQL kein generelles Upgrade gegenüber klassischer Replikation?

**Antwort:** Es löst ein spezifisches Problem (globale Konsistenz bei horizontal verteilten Schreibzugriffen), hat aber reale Latenzkosten bei Cross-Partition-Koordination — für Anwendungsfälle ohne globale Verteilungsanforderung ist klassische Replikation oft einfacher und schneller.

### 6. Widersprüchliche Anforderung: Team will globale Schreibverfügbarkeit in jeder Region UND minimale Schreiblatenz für alle Transaktionen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass beides ohne Einschränkung ein struktureller Zielkonflikt ist — echte globale Schreibverfügbarkeit mit Konsistenzgarantien erfordert Koordination, die Latenz kostet; ich würde vorschlagen, Datenlokalität so zu gestalten, dass die meisten Transaktionen lokal (schnell) bleiben, während nur die tatsächlich global konsistenzkritischen Daten die höhere Cross-Region-Latenz in Kauf nehmen.

## Praktische Labs

~~~python
# Simplified latency model: local vs cross-partition consensus
LOCAL_LATENCY_MS = 2
CROSS_REGION_LATENCY_MS = 80  # round trip to a distant consensus participant

def transaction_latency(is_cross_partition):
    if is_cross_partition:
        return LOCAL_LATENCY_MS + CROSS_REGION_LATENCY_MS
    return LOCAL_LATENCY_MS

transactions = [False, False, True, False, True, False, False, True]
latencies = [transaction_latency(t) for t in transactions]
avg_latency = sum(latencies) / len(latencies)
cross_partition_ratio = sum(transactions) / len(transactions)

print(f"Cross-partition ratio: {cross_partition_ratio:.0%}, avg latency: {avg_latency:.1f}ms")
assert avg_latency > LOCAL_LATENCY_MS
print("Even a modest cross-partition ratio dominates average latency - data locality planning matters.")
~~~

## Dependencies, Cross-References und Quellen

1. CockroachDB: [Architecture Overview](https://www.cockroachlabs.com/docs/stable/architecture/overview), abgerufen 2026-09-17.
2. Google Cloud: [Spanner: TrueTime and External Consistency](https://cloud.google.com/spanner/docs/true-time-external-consistency), abgerufen 2026-09-17.
3. Corbett et al.: [Spanner: Google's Globally Distributed Database](https://research.google/pubs/pub39966/), 2012, abgerufen 2026-09-17.

Produktspezifische Details (CockroachDB, Spanner, YugabyteDB) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Hardware-gestützte Zeitsynchronisation (z. B. TrueTime-artige Ansätze) für externe Konsistenz ohne Koordinationsoverhead | Established (bei wenigen Anbietern) | Verfügbarkeit und Kosten dieser Infrastruktur gegen den Nutzen externer Konsistenz abwägen. |
| Follower-Reads für latenzarme, leicht veraltete Lesevorgänge in Distributed SQL | Established | Für lesehäufige, latenzkritische Anwendungsfälle mit tolerierbarer Veraltung gezielt einsetzen. |

Ein Team akzeptiert eine Distributed-SQL-Einführung erst, wenn Datenlokalität geplant und Latenzkosten grenzüberschreitenden Konsenses im Kapazitätsplan dokumentiert sind.
