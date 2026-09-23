---
{"id": "KB-0215", "title": "Datenbank-Hochverfügbarkeit", "domain": "09", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0203", "concepts": ["Konsistenzmodelle", "CAP"], "needed_for": "understanding"}, {"id": "KB-0214", "concepts": ["Datenhaltbarkeit"], "needed_for": "understanding"}], "related": ["KB-0207"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Quorum-basiertes Modell zur Split-Brain-Vermeidung bei Netzwerkpartitionierung lokal implementieren.", "rationale": "Das Prinzip, warum eine Mehrheitsentscheidung Split Brain strukturell verhindert, wird erst durch Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Promotion- und Failover-Strategie für einen konkreten Datenbank-Hochverfügbarkeitsaufbau begründet gestalten.", "rationale": "Falsches Failover-Design kann Split Brain oder unnötigen Datenverlust erzeugen."}, "STAFF-TARGET": {"active": true, "scope": "Scheinbar widersprüchliche Datenzustände nach einem Failover auf Split Brain statt auf einen Anwendungsfehler zurückführen können.", "rationale": "Split Brain erzeugt divergierende, gleichzeitig 'gültige' Datenzustände, die ohne dieses Wissen als Anwendungsbug fehldiagnostiziert werden."}, "CHIEF-TARGET": {"active": true, "scope": "Datenbank-Hochverfügbarkeit als systematische Prüfung konkreter Ausfallszenarien positionieren, nicht als automatische Eigenschaft von Replikation.", "rationale": "Replikation allein garantiert keine sichere Hochverfügbarkeit — Failover-Logik muss explizit gegen Split Brain und Datenverlust geprüft sein."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Orchestrierungstools (z. B. Patroni, Orchestrator) sind Vertiefung.", "rationale": "Kern ist das Verständnis von Quorum, Split Brain und Clientumschaltung, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0215-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Quorum-basierte Split-Brain-Vermeidung bei simulierter Netzwerkpartitionierung", "evidence": "Bei einer Netzwerkpartitionierung, die den Knotencluster in zwei Gruppen teilt, kann nur die Gruppe mit Mehrheit (Quorum) einen neuen primären Knoten wählen; die Minderheitsgruppe darf keinen eigenen primären Knoten wählen.", "limitations": "Kein echtes Datenbanksystem, keine reale Netzwerkpartitionierung, keine Produktion."}]}
---
# Datenbank-Hochverfügbarkeit

> **Ziel:** Datenbank-Hochverfügbarkeit erfordert mehr als Replikation — Promotion-Logik, Quorum-Entscheidungen und Clientumschaltung müssen explizit gegen konkrete Ausfallszenarien (insbesondere Netzwerkpartitionierung) geprüft sein, sonst entsteht Split Brain: zwei gleichzeitig aktive primäre Knoten mit divergierenden, gleichzeitig "gültigen" Datenzuständen.

## Zweck, Mental Model und Dependencies

Bei einem Ausfall des primären Datenbankknotens muss ein Replikat zum neuen primären Knoten befördert werden (Promotion) — die kritische Frage ist, wie diese Entscheidung getroffen wird, wenn Knoten sich gegenseitig nicht mehr erreichen können (Netzwerkpartitionierung statt echtem Knotenausfall). Split Brain entsteht, wenn beide Seiten einer Netzwerkpartitionierung unabhängig voneinander einen primären Knoten wählen oder behalten — beide akzeptieren dann Schreibvorgänge, was zu divergierenden Datenzuständen führt, die bei Wiederherstellung der Netzwerkverbindung nicht automatisch und verlustfrei zusammengeführt werden können. Quorum-basierte Entscheidungsfindung verhindert Split Brain strukturell: eine Promotion-Entscheidung erfordert Zustimmung einer Mehrheit der Knoten, sodass bei einer Netzwerkpartitionierung höchstens eine Seite (die mit der Mehrheit) einen neuen primären Knoten wählen kann — die Minderheitsseite muss sich als nicht-autoritativ zurückziehen, auch wenn sie den alten primären Knoten noch "sieht". Clientumschaltung (wie Clients den neuen primären Knoten finden) muss ebenfalls robust gegen Netzwerkpartitionierung sein, sonst verbinden sich Clients weiterhin fälschlich mit einem inzwischen degradierten oder isolierten Knoten. Lies [KB-0203](07-konsistenzmodelle-und-cap-theorem-praxis.md) und [KB-0214](20-datenhaltbarkeit-und-korruptionsschutz.md).

~~~text
Node failure (node is truly down):        clear signal, safe to promote a replica
Network partition (node is unreachable):  ambiguous signal, node may still be alive and serving writes
Without quorum: both sides could promote -> SPLIT BRAIN -> two "primary" nodes, diverging writes
With quorum: only the majority side can promote -> minority side must step back, no split brain
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Quorum-Design | erfordert die Promotion-Entscheidung nachweisbar eine Mehrheit der Knoten? | ohne Quorum können beide Seiten einer Netzwerkpartitionierung unabhängig promoten, Split Brain |
| Failover-Verifikation | wurde der Failover-Prozess tatsächlich unter simulierter Netzwerkpartitionierung getestet? | ungetesteter Failover-Prozess versagt oder erzeugt Split Brain im echten Vorfall |
| Clientumschaltung | finden Clients den neuen primären Knoten zuverlässig, auch bei Netzwerkpartitionierung? | Clients verbinden sich weiterhin mit einem degradierten oder isolierten Knoten |
| Failback-Strategie | ist der Prozess, den alten primären Knoten nach Wiederherstellung sicher wieder einzugliedern, definiert? | alter primärer Knoten kehrt mit veralteten oder divergierenden Daten zurück und überschreibt neuere Daten |

Implementierung: Promotion-Entscheidungen werden ausschließlich über einen Quorum-Mechanismus getroffen, der eine Mehrheit der Knoten für eine gültige Entscheidung erfordert — ein Knoten oder eine Minderheitsgruppe darf sich niemals selbst zum primären Knoten befördern, ohne diese Mehrheitsbestätigung. Der Failover-Prozess wird explizit unter simulierter Netzwerkpartitionierung getestet (nicht nur unter simuliertem Prozessabsturz), da Netzwerkpartitionierung das schwierigere und gefährlichere Szenario für Split Brain ist. Clientumschaltung erfolgt über einen Mechanismus, der ebenfalls konsistent mit der Quorum-Entscheidung ist (z. B. ein Service-Discovery-Layer, der nur den quorum-bestätigten primären Knoten meldet), statt über Clientseitiges Caching einer möglicherweise veralteten Knotenadresse. Failback des alten primären Knotens erfolgt nur nach expliziter Datenabgleichsprüfung, niemals automatisch ohne Prüfung auf Datenkonflikte.

## Scalability, Reliability, Security und Observability

Hochverfügbarkeitsdesign mit korrektem Quorum-Mechanismus skaliert mit der Anzahl der Knoten, solange eine klare Mehrheitsdefinition erhalten bleibt (typischerweise eine ungerade Knotenzahl, um Patt-Situationen zu vermeiden). Reliability-Grenze: ein Hochverfügbarkeitsaufbau ohne getesteten Failover unter Netzwerkpartitionierung ist ein latentes Risiko, das erst im echten Partitionierungsvorfall sichtbar wird — oft genau dann, wenn die Datenbank am dringendsten verfügbar sein muss.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einem Netzwerkvorfall zeigen zwei Knoten widersprüchliche, gleichzeitig "aktuelle" Daten | Split Brain durch fehlenden oder fehlerhaften Quorum-Mechanismus | prüfen, ob beide Knoten während der Partitionierung gleichzeitig Schreibvorgänge akzeptiert haben |
| Clients erreichen nach einem Failover weiterhin den alten, degradierten Knoten | Clientumschaltungsmechanismus ist nicht konsistent mit der Quorum-Entscheidung | Client-Service-Discovery-Konfiguration auf tatsächliche Konsistenz mit dem quorum-bestätigten primären Knoten prüfen |
| alter primärer Knoten überschreibt nach Wiederherstellung neuere Daten | Failback erfolgte ohne Datenabgleichsprüfung | Failback-Prozess auf explizite Konfliktprüfung vor Wiedereingliederung prüfen |
| Hochverfügbarkeitsaufbau hat im echten Vorfall anders reagiert als erwartet | Failover wurde nie unter simulierter Netzwerkpartitionierung getestet, nur unter Prozessabsturz | letzten Test-Termin und Testart (Partitionierung vs. Absturz) für den Failover-Prozess prüfen |

Security: der Quorum-Mechanismus selbst muss gegen Manipulation geschützt sein — ein Angreifer, der genügend Knoten kompromittiert, um ein künstliches Quorum zu erzwingen, könnte eine unautorisierte Promotion auslösen. Observability: Quorum-Status, Knotenerreichbarkeit aus Sicht jedes einzelnen Knotens (nicht nur eines zentralen Monitors) und die Historie von Promotion-Ereignissen sind zentrale Diagnosewerkzeuge für Hochverfügbarkeitsprobleme.

## Trade-offs und Entscheidungen

**Staff** stellt sicher, dass Promotion-Entscheidungen nachweisbar einen Quorum-Mechanismus durchlaufen. **Principal** testet Failover explizit unter simulierter Netzwerkpartitionierung, nicht nur unter Prozessabsturz. **Chief** positioniert Hochverfügbarkeit als systematisch gegen konkrete Ausfallszenarien geprüfte Eigenschaft, nicht als automatische Folge von Replikation.

Anti-Patterns: Failover-Logik nur unter simuliertem Prozessabsturz testen, nie unter Netzwerkpartitionierung; Promotion-Entscheidungen ohne Quorum-Mechanismus einem einzelnen Beobachter überlassen; Failback des alten primären Knotens automatisch ohne Datenabgleichsprüfung durchführen.

## Production Checklist

- [ ] Promotion-Entscheidungen erfordern nachweisbar einen Quorum-Mechanismus.
- [ ] Failover ist explizit unter simulierter Netzwerkpartitionierung getestet, nicht nur unter Prozessabsturz.
- [ ] Clientumschaltung ist konsistent mit der Quorum-Entscheidung, nicht clientseitig gecacht.
- [ ] Failback erfolgt nur nach expliziter Datenabgleichsprüfung.

## Interviewfragen

### 1. Was ist Split Brain, und warum ist es gefährlicher als ein einfacher Knotenausfall?

**Antwort:** Split Brain entsteht, wenn zwei Seiten einer Netzwerkpartitionierung unabhängig voneinander einen primären Knoten wählen oder behalten und beide Schreibvorgänge akzeptieren — im Gegensatz zu einem klaren Knotenausfall entstehen dabei divergierende, gleichzeitig "gültige" Datenzustände, die nicht automatisch verlustfrei zusammengeführt werden können.

### 2. Wie verhindert ein Quorum-Mechanismus Split Brain?

**Antwort:** Eine Promotion-Entscheidung erfordert Zustimmung einer Mehrheit der Knoten; bei einer Netzwerkpartitionierung kann höchstens eine Seite (die mit der Mehrheit) diese Zustimmung erhalten, die Minderheitsseite muss sich zurückziehen, auch wenn sie den alten primären Knoten noch erreicht.

### 3. Warum reicht es nicht aus, Failover nur unter simuliertem Prozessabsturz zu testen?

**Antwort:** Netzwerkpartitionierung ist ein deutlich schwierigeres Szenario als ein klarer Prozessabsturz, weil das Signal mehrdeutig ist — ein Knoten kann noch aktiv sein, aber unerreichbar; nur ein Test unter simulierter Partitionierung deckt Split-Brain-Risiken auf, die ein Absturztest nicht zeigt.

### 4. Wie diagnostizierst du widersprüchliche Datenzustände nach einem Netzwerkvorfall?

**Antwort:** Ich prüfe, ob beide beteiligten Knoten während der Partitionierung gleichzeitig Schreibvorgänge akzeptiert haben — das ist das charakteristische Muster von Split Brain, nicht eines gewöhnlichen Anwendungsfehlers.

### 5. Warum darf ein alter primärer Knoten nach Wiederherstellung nicht automatisch wieder als primär eingegliedert werden?

**Antwort:** Er könnte während der Partitionierung isoliert weitergelaufen sein und veraltete oder divergierende Daten enthalten; ohne explizite Datenabgleichsprüfung würde ein automatisches Failback neuere Daten des zwischenzeitlich beförderten Knotens überschreiben.

### 6. Widersprüchliche Anforderung: Team will Hochverfügbarkeit mit nur zwei Knoten UND garantierten Schutz vor Split Brain — wie gehst du vor?

**Antwort:** Ich würde erklären, dass zwei Knoten allein keine zuverlässige Mehrheitsentscheidung ermöglichen (ein Patt bei genau zwei gleich großen Partitionshälften ist nicht auflösbar); ich würde einen dritten Knoten oder eine externe Tiebreaker-Instanz (z. B. einen Witness-/Arbiter-Knoten) vorschlagen, um eine echte Mehrheitsentscheidung zu ermöglichen, statt Split-Brain-Schutz ohne ausreichende Knotenzahl zu versprechen.

## Praktische Labs

~~~python
# Quorum-based promotion decision under simulated network partition
nodes = {"n1", "n2", "n3", "n4", "n5"}
QUORUM_SIZE = len(nodes) // 2 + 1  # majority required

def can_promote(reachable_nodes):
    return len(reachable_nodes) >= QUORUM_SIZE

# Simulate a network partition splitting the cluster into two groups
partition_a = {"n1", "n2"}          # minority - 2 nodes
partition_b = {"n3", "n4", "n5"}    # majority - 3 nodes

assert can_promote(partition_a) is False   # minority CANNOT promote - split brain avoided
assert can_promote(partition_b) is True    # majority CAN promote safely

print(f"Quorum size: {QUORUM_SIZE}. Partition A (minority, {len(partition_a)} nodes): promote={can_promote(partition_a)}")
print(f"Partition B (majority, {len(partition_b)} nodes): promote={can_promote(partition_b)}")
print("Only the majority side is authorized to promote a new primary - split brain is structurally prevented.")
~~~

## Dependencies, Cross-References und Quellen

1. PostgreSQL: [Patroni High Availability Documentation](https://patroni.readthedocs.io/en/latest/), abgerufen 2026-09-17.
2. etcd: [Understanding Failure Modes and Quorum](https://etcd.io/docs/v3.5/learning/design-learner/), abgerufen 2026-09-17.
3. Kleppmann: [Designing Data-Intensive Applications, Kapitel 5 (Replication) und 8 (Trouble with Distributed Systems)](https://dataintensive.net/), abgerufen 2026-09-17.

Produktspezifische Orchestrierungswerkzeuge (Patroni, Orchestrator, Consul) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Raft-basierte Konsens-Bibliotheken als Standardgrundlage für Quorum-Entscheidungen in neuen HA-Tools | Established | Etablierte Konsens-Implementierungen gegenüber selbstgebauter Quorum-Logik bevorzugen. |
| Chaos-Engineering-Praktiken zur regelmäßigen, automatisierten Netzwerkpartitionierungs-Simulation | Adopting | Manuelle, seltene Failover-Tests durch automatisierte, regelmäßige Chaos-Experimente ergänzen. |

Ein Team akzeptiert einen Datenbank-Hochverfügbarkeitsaufbau erst, wenn Failover unter simulierter Netzwerkpartitionierung nachweisbar ohne Split Brain getestet wurde.
