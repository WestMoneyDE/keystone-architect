---
{"id": "KB-0104", "title": "Konsens und Quoren", "domain": "05", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0103", "concepts": ["Replikation", "Leader"], "needed_for": "both"}], "related": ["KB-0105", "KB-0108", "KB-0562", "KB-0720"], "applies": ["KB-0105", "KB-0108", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Mehrheitsquorum und Log-Fortschritt an einem lokalen Modell nachvollziehen und einen Split-Vote-Fall erzeugen.", "rationale": "Kein echter Raft-Cluster nötig, um das Mehrheitsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Clustergröße und Quorum so wählen, dass Ausfalltoleranz und Verfügbarkeitsanforderung zusammenpassen.", "rationale": "Quorum-Größe bestimmt direkt, wie viele gleichzeitige Ausfälle tolerierbar sind."}, "STAFF-TARGET": {"active": true, "scope": "Leaderwechsel, Split-Vote und Minderheitspartition anhand von Log-/Term-Zuständen diagnostizieren.", "rationale": "Konsensfehler äußern sich als scheinbar zufällige Verfügbarkeitseinbrüche."}, "CHIEF-TARGET": {"active": true, "scope": "Für kritische Koordinationsdienste (Config, Locking) eine konsensbasierte statt eventual-consistent Lösung als Standard verlangen.", "rationale": "Falsche Koordinationsprimitive erzeugen organisationsweite Zuverlässigkeitsrisiken."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Paxos-Varianten, Multi-Raft-Sharding und Byzantine Fault Tolerance sind Vertiefung.", "rationale": "Kern ist das Mehrheitsprinzip und seine Verfügbarkeitsgrenzen, nicht jede Algorithmusvariante."}}, "lab_validation": [{"lab_id": "KB-0104-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Mehrheitsquorum", "evidence": "Ein Cluster mit 5 Knoten toleriert den Ausfall von 2 Knoten und bleibt schreibfähig; bei 3 ausgefallenen Knoten wird korrekt keine Mehrheit mehr erreicht.", "limitations": "Kein echter Raft/Paxos-Cluster, kein Netzwerk, keine Produktion."}]}
---
# Konsens und Quoren

> **Ziel:** Konsensalgorithmen wie Raft lassen einen Cluster trotz Ausfällen eine einzige, geordnete Entscheidung treffen (z. B. welcher Log-Eintrag als nächstes committed wird). Das Mehrheitsquorum-Prinzip bestimmt, wie viele gleichzeitige Ausfälle toleriert werden, ohne Fortschritt oder Sicherheit zu verlieren.

## Zweck, Mental Model und Dependencies

Ein Konsenscluster aus N Knoten braucht eine Mehrheit (⌊N/2⌋+1) für jede verbindliche Entscheidung. Das garantiert, dass sich zwei Mehrheiten niemals gleichzeitig bilden können (sie würden sich überschneiden), womit widersprüchliche gleichzeitige Entscheidungen strukturell ausgeschlossen sind. Raft modelliert das über Terms (Epochen), einen gewählten Leader pro Term und ein repliziertes Log, das erst nach Mehrheitsbestätigung als committed gilt. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0103](03-replikationsmodelle-und-konflikte.md).

~~~text
N=5 nodes, majority=3
leader proposes log[i] -> replicate to followers -> 3 acks (incl. leader) -> committed
                                   ^ 2 nodes down: still 3 reachable -> progress continues
                                   ^ 3 nodes down: only 2 reachable -> no majority -> no progress (safe)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Bedeutung | Risiko bei Fehlannahme |
|---|---|---|
| Majority Quorum | ⌊N/2⌋+1 Knoten müssen zustimmen | falsche Clustergröße reduziert Ausfalltoleranz unerwartet |
| Term/Epoche | monoton steigende Wahlperiode | veralteter Leader nach Netzsplit ohne Term-Check |
| Log-Commit | Eintrag erst nach Mehrheitsbestätigung gültig | ungesicherter Eintrag als „gespeichert“ behandelt |
| Election Timeout | zufällig gestreut gegen Split-Vote | zu synchron gewählte Timeouts erzeugen wiederholte Split-Votes |

Implementierung: Clustergröße als ungerade Zahl (3, 5, 7) wählen, da eine gerade Zahl keine bessere Ausfalltoleranz bei höherer Koordinationskosten bringt (z. B. toleriert N=4 nur 1 Ausfall, genauso wie N=3). Election-Timeouts zufällig streuen, um Split-Votes zu reduzieren. Nur committed Log-Einträge (Mehrheitsbestätigung) an die Anwendung als „persistiert“ melden, nicht bereits beim lokalen Schreiben des Leaders.

## Scalability, Reliability, Security und Observability

Mehr Knoten erhöhen Ausfalltoleranz, aber auch Koordinationskosten pro Commit (mehr Bestätigungen nötig) — Skalierung erfolgt meist über Sharding/Multi-Raft statt über beliebig große Einzelcluster. Reliability-Grenze: bei Verlust der Mehrheit stoppt das System sicher (kein Fortschritt), statt unsicher fortzufahren — das ist beabsichtigtes Verhalten, keine „Störung, die repariert werden muss“, sondern der CP-Trade-off aus [KB-0101](01-cap-und-pacelc.md).

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Cluster akzeptiert keine Schreibvorgänge mehr | Mehrheit nicht erreichbar | erreichbare Knotenzahl gegen Clustergröße/2+1 prüfen |
| wiederholte Leaderwahlen ohne stabilen Leader | Split-Vote durch synchrone Timeouts | Election-Timeout-Streuung und Netzwerklatenz prüfen |
| alter Leader nimmt nach Netzsplit weiter Schreibvorgänge an | fehlender Term-Check beim Re-Join | Term-Nummer des wiederverbundenen Knotens prüfen |
| Client erhält „erfolgreich“ für nicht committed Eintrag | Anwendung meldet Erfolg vor Mehrheitsbestätigung | Commit-Index versus gemeldeten Erfolg vergleichen |

Security: Konsenscluster sind privilegierte Koordinationsdienste (z. B. Config-Store, Distributed Lock); Zugriff auf die Cluster-Kommunikation muss authentifiziert/verschlüsselt sein, da ein kompromittierter Knoten Wahlen stören oder falsche Werte einspeisen kann. Observability korreliert Term-Nummer, aktueller Leader, Commit-Index pro Knoten und Zeit seit letztem erfolgreichen Heartbeat.

## Trade-offs und Entscheidungen

**Staff** testet Verhalten bei Minderheitspartition, Split-Vote-Häufigkeit und Leaderwechsel-Dauer unter Last. **Principal** definiert Standard-Clustergrößen (typisch 3 oder 5) und verlangt, dass Anwendungen nur committed Zustände als verbindlich behandeln. **Chief** entscheidet, für welche Koordinationsdienste (Locking, Config, Leader-Election für andere Systeme) ein konsensbasiertes System statt eines eventual-consistent Systems verpflichtend ist.

Anti-Patterns: gerade Clustergrößen ohne Grund; Anwendungserfolg vor Mehrheitsbestätigung melden; Konsenscluster über sehr hohe Netzwerklatenz strecken und dann Latenzprobleme als „Bug“ statt als Koordinationskosten missverstehen; Konsens für Daten mit hohem Schreibvolumen und ohne echten Koordinationsbedarf einsetzen.

## Production Checklist

- [ ] Clustergröße ungerade, Ausfalltoleranz explizit berechnet (⌊N/2⌋).
- [ ] Election-Timeout-Streuung konfiguriert und gegen Split-Vote-Häufigkeit beobachtet.
- [ ] Anwendungslogik meldet Erfolg erst nach Commit-Bestätigung, nicht nach lokalem Write.
- [ ] Term-Check beim Re-Join nach Partition getestet.

## Interviewfragen

### 1. Warum braucht Konsens eine Mehrheit statt Einstimmigkeit?

**Antwort:** Mehrheit garantiert, dass sich zwei gleichzeitige Mehrheiten überschneiden müssen, was widersprüchliche parallele Entscheidungen ausschließt; Einstimmigkeit würde bei jedem Ausfall den gesamten Fortschritt blockieren.

### 2. Warum ist eine ungerade Clustergröße sinnvoller als eine gerade?

**Antwort:** Eine gerade Zahl erhöht die Koordinationskosten, ohne die Ausfalltoleranz gegenüber der nächstkleineren ungeraden Zahl zu verbessern (N=4 toleriert wie N=3 nur einen Ausfall).

### 3. Was passiert, wenn die Mehrheit eines Clusters unerreichbar wird?

**Antwort:** Das System stoppt sicher, akzeptiert keine neuen Schreibvorgänge mehr; das ist der beabsichtigte CP-Trade-off, keine Fehlfunktion.

### 4. Wie verhindert ein Term/Epoche einen veralteten Leader?

**Antwort:** Jede Wahl erhöht die Term-Nummer; ein Knoten mit niedrigerer Term-Nummer erkennt beim Kontakt mit dem Cluster, dass er veraltet ist, und tritt zurück, bevor er widersprüchliche Entscheidungen treffen kann.

### 5. Warum reicht ein lokal geschriebener Log-Eintrag beim Leader nicht als „gespeichert“?

**Antwort:** Ohne Mehrheitsbestätigung kann der Eintrag bei einem Leaderausfall verloren gehen; erst der Commit nach Mehrheitsbestätigung ist eine belastbare Garantie.

### 6. Widersprüchliche Anforderung: Produkt will Koordination über fünf global verteilte Regionen mit niedriger Schreiblatenz — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein einzelner globaler Konsenscluster über fünf Regionen hohe Latenz pro Commit erzwingt (Mehrheit muss über die langsamste beteiligte Region hinweg bestätigen); Alternative wäre regionales Sharding mit lokalem Konsens pro Shard und expliziter, langsamerer Cross-Shard-Koordination nur wo nötig.

## Praktische Labs

~~~python
def has_majority(alive, total):
    return alive >= total // 2 + 1

assert has_majority(3, 5)   # 2 nodes down, still progresses
assert not has_majority(2, 5)  # 3 nodes down, correctly blocked
print("5-node cluster tolerates 2 failures and safely halts at 3.")
~~~

## Dependencies, Cross-References und Quellen

1. Ongaro, Ousterhout: [In Search of an Understandable Consensus Algorithm (Raft)](https://raft.github.io/raft.pdf), USENIX ATC 2014, abgerufen 2026-09-17.
2. Lamport: [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf), ACM SIGACT News 2001, abgerufen 2026-09-17.

Produktspezifische Cluster-Implementierungsdetails und Standardtimeouts vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Multi-Raft/Sharded-Konsens für horizontale Skalierung | Established | Shard-Grenzen und Cross-Shard-Transaktionskosten prüfen. |
| Flexible/verstärkte Quoren (Fast Paxos-Varianten) | Adopting | Latenzgewinn gegen erhöhte Konflikt-/Fallback-Komplexität abwägen. |
| Konsens als verwalteter Cloud-Dienst statt Eigenbetrieb | Established | Betriebskosteneinsparung gegen Vendor-Lock-in und Exit-Strategie prüfen. |

Ein Team akzeptiert einen neuen Konsensmechanismus erst, wenn Ausfalltoleranz, Split-Vote-Verhalten, Term-Sicherheit und Commit-Semantik nachweisbar getestet sind.
