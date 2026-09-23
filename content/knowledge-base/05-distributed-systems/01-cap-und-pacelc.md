---
{"id": "KB-0101", "title": "CAP und PACELC", "domain": "05", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0056", "concepts": ["Verbindung", "Timeout"], "needed_for": "understanding"}], "related": ["KB-0102", "KB-0103", "KB-0104", "KB-0562", "KB-0720"], "applies": ["KB-0102", "KB-0103", "KB-0104", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales Zwei-Knoten-Modell mit simulierter Partition selbst bauen und beobachtbare Anomalien erzeugen.", "rationale": "Ohne Cluster reicht ein deterministisches lokales Modell, um C/A-Trade-offs sichtbar zu machen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein konkretes System begründen, welche Garantie bei Partition und welche bei Normalbetrieb (Latenz) gewählt wird.", "rationale": "CAP betrifft nur den Partitionsfall; PACELC ergänzt den Normalfall-Trade-off."}, "STAFF-TARGET": {"active": true, "scope": "Beobachtete Anomalien (stale read, lost update) auf die gewählte Konsistenzgarantie zurückführen und im Team erklären.", "rationale": "Falsche Erwartungen an Konsistenz erzeugen falsch diagnostizierte Incidents."}, "CHIEF-TARGET": {"active": true, "scope": "Als Portfolio-Standard festlegen, für welche Datenklassen welche Konsistenzgarantie mindestens verlangt wird.", "rationale": "Inkonsistente Konsistenzentscheidungen über Systeme hinweg erzeugen unklare Nutzererwartungen und Auditrisiken."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Formale Beweise von CAP, Jepsen-Testmethodik und quantitative Latenz-/Konsistenz-Messreihen sind Vertiefung.", "rationale": "Kern ist die begründete Trade-off-Entscheidung, nicht der formale Beweis."}}, "lab_validation": [{"lab_id": "KB-0101-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Zwei-Knoten-Simulationsmodell in Python, keine echte Datenbank", "evidence": "Bei simulierter Partition liefert der isolierte Knoten entweder eine Fehlermeldung (C bevorzugt) oder einen veralteten Wert (A bevorzugt); beides ist reproduzierbar.", "limitations": "Kein reales verteiltes System, kein Netzwerkausfall, keine Produktion. Ergebnis zeigt das Prinzip, nicht das Verhalten eines konkreten Produkts."}]}
---
# CAP und PACELC

> **Ziel:** CAP beschreibt, dass ein verteiltes System bei einer Netzwerkpartition nicht gleichzeitig Konsistenz und Verfügbarkeit garantieren kann. PACELC erweitert das: Auch ohne Partition erzwingt jedes System eine Wahl zwischen Latenz und Konsistenz. Beide Modelle sind Entscheidungswerkzeuge, keine Bewertung „gut“ versus „schlecht“.

## Zweck, Definition und Scope

Diese Datei klärt, was CAP tatsächlich aussagt (und was nicht), warum Partitionstoleranz in einem verteilten System keine optionale Eigenschaft ist, und wie PACELC den oft übersehenen Normalbetrieb-Trade-off ergänzt. Zielgruppe sind alle, die Datenbank-, Cache- oder Replikationsentscheidungen treffen oder deren Konsequenzen erklären müssen. Abgrenzung: konkrete Replikationsmechanik steht in [KB-0103](03-replikationsmodelle-und-konflikte.md), Konsensalgorithmen in [KB-0104](04-konsens-und-quoren.md).

**Lernziele:**
1. CAP präzise formulieren: welche drei Eigenschaften, welcher Fall (Partition) erzwingt die Wahl.
2. Erklären, warum „CA ohne P“ für ein echtes verteiltes System keine sinnvolle Option ist.
3. PACELC anwenden: den Latenz/Konsistenz-Trade-off im Normalbetrieb von der C/A-Wahl bei Partition trennen.
4. Für ein konkretes Szenario (z. B. Warenkorb, Kontostand, Feature-Flag) begründen, welche Garantie nötig ist.
5. Eine beobachtbare Anomalie (stale read) auf eine konkrete Konsistenzentscheidung zurückführen.

## Kompetenzmarker und Evidenz

| Marker | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv — lokales Simulationsmodell für Partition und Anomalie. |
| ARCHITECT-TARGET | aktiv — Garantie pro Datenklasse begründet wählen. |
| STAFF-TARGET | aktiv — Anomalien auf Konsistenzentscheidung zurückführen. |
| CHIEF-TARGET | aktiv — Mindestgarantie pro Datenklasse als Standard festlegen. |
| SPECIALIST-OPTIONAL | aktiv — formale Beweise und Jepsen-Testmethodik als Vertiefung. |

## Mental Model

Stell dir zwei Knoten vor, die denselben Wert halten und durch ein Kabel verbunden sind, das reißen kann. Solange das Kabel hält, ist alles einfach. Reißt es, muss jeder Knoten, der weiterhin Anfragen bedient, eine Wahl treffen: entweder ablehnen/warten (Konsistenz bewahren, Verfügbarkeit für diese Anfrage aufgeben) oder mit dem letzten bekannten Wert antworten (Verfügbarkeit bewahren, Konsistenz für diese Anfrage aufgeben). Die Analogiegrenze: CAP behandelt nur den Partitionsfall binär; reale Systeme haben Abstufungen (z. B. Quorum-basierte Teilverfügbarkeit) und der Normalbetrieb hat einen eigenen, kontinuierlichen Latenz/Konsistenz-Trade-off, den PACELC beschreibt.

**Zentrale Invariante:** Partitionstoleranz ist für ein System mit mehr als einem Knoten über ein unzuverlässiges Netzwerk keine Designoption, sondern eine physikalische Tatsache. Die eigentliche Entscheidung liegt zwischen C und A während der Partition, und zwischen Latenz und Konsistenz (PACELC „else“) im Normalbetrieb.

## Prerequisites und Dependencies

Hilfreich, nicht zwingend: [KB-0056](../03-network-foundations/08-tcp-verbindungen-und-ueberlastkontrolle.md) für das Verständnis, dass Timeouts eine Partition nicht sicher von einem langsamen Knoten unterscheiden können. [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) für Hypothese/Gegenprobe-Methodik, die im Lab verwendet wird.

## Core Concepts und Mechanismen

**Consistency (im CAP-Sinn)** meint hier Linearizability: jede Leseoperation sieht das Ergebnis der zuletzt abgeschlossenen Schreiboperation, als gäbe es nur eine Kopie der Daten. **Availability** meint, dass jeder nicht ausgefallene Knoten auf jede Anfrage in endlicher Zeit antwortet — auch während der Partition. **Partition Tolerance** meint, dass das System trotz beliebigem Nachrichtenverlust zwischen Knoten weiterarbeitet (in irgendeiner Form).

Der Beweis (Gilbert/Lynch, 2002) zeigt: Bei tatsächlicher Partition zwischen zwei Knotengruppen, die beide Schreibzugriffe akzeptieren könnten, kann keine der beiden Gruppen gleichzeitig linearizable Antworten geben UND innerhalb endlicher Zeit antworten, ohne die andere Gruppe zu konsultieren — was während der Partition unmöglich ist. Die Wahl ist also nicht „CAP: wähle zwei von drei“, sondern „P ist gegeben; wähle C oder A während der Partition“.

**PACELC** formalisiert einen zweiten Trade-off: „If Partition, choose Availability or Consistency; Else (Normalbetrieb), choose Latency or Consistency.“ Ein System kann während Partition A wählen und im Normalbetrieb dennoch niedrige Latenz über strikte Konsistenz stellen (z. B. asynchrone Replikation), oder im Normalbetrieb höhere Latenz für stärkere Konsistenz akzeptieren (z. B. synchrones Quorum).

## Architecture / Data Flow

Durchgängiges Beispiel: ein Warenkorb-Service mit zwei Regionen (EU, US), jede mit einer Kopie des Warenkorbs.

~~~text
Client(EU) -> write cart -> Node(EU) -> [sync replicate?] -> Node(US)
                                  |
                          partition occurs
                                  |
              Node(EU): reject write (C)   or   accept write, diverge (A)
~~~

Bei synchroner Replikation: Node(EU) wartet auf Bestätigung von Node(US), bevor es dem Client antwortet — hohe Latenz im Normalbetrieb, aber während Partition entweder Blockade (C) oder Timeout/Fehler. Bei asynchroner Replikation: Node(EU) antwortet sofort — niedrige Latenz im Normalbetrieb (PACELC „L“), aber während Partition kann Node(US) veraltete Daten ausliefern (A gewählt, C aufgegeben) und nach Partitionsende müssen divergierende Schreibvorgänge aufgelöst werden (siehe [KB-0103](03-replikationsmodelle-und-konflikte.md)).

## Protocols / Standards und Tools

Es gibt keinen normativen RFC für CAP; die Referenz ist der formale Beweis von Gilbert und Lynch (2002, „Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services“). PACELC stammt von Daniel Abadi (2010/2012). Produkte positionieren sich unterschiedlich: Systeme mit Konsens-basierten Schreibpfaden (z. B. etcd, ZooKeeper) wählen bei Partition typischerweise C; viele Multi-Region-Key-Value-Stores mit konfigurierbarem Konsistenzlevel erlauben pro Operation eine Wahl zwischen stärkerer Konsistenz (höhere Latenz) und schwächerer Konsistenz (niedrigere Latenz).

| Kriterium | Konsistenzorientiert | Verfügbarkeitsorientiert |
|---|---|---|
| Verhalten bei Partition | Minderheitspartition lehnt Schreiben/Lesen ab | jede erreichbare Kopie antwortet, ggf. veraltet |
| Normalbetrieb-Latenz | tendenziell höher (Quorum/Sync) | tendenziell niedriger (lokal/async) |
| Konfliktbehandlung | meist vermieden durch Quorum | nötig nach Partitionsende |
| typische Eignung | Kontostand, Inventar-Reservierung | Feature-Flags, Präsenzanzeige, Warenkorb-Entwurf |

## Konfiguration / Implementierung

Ein minimales lokales Modell (siehe Lab) simuliert zwei Knoten mit einem gemeinsamen Wert und einem Partitionsflag. Bei Partition entscheidet eine Konfigurationsvariable `mode = "cp" | "ap"`, ob eine Leseanfrage am isolierten Knoten einen Fehler wirft (cp) oder den zuletzt bekannten Wert liefert (ap). Dieses Modell hat keine Netzwerkabhängigkeit, keine echten Timeouts und keine echte Datenbank — es macht ausschließlich das Entscheidungsprinzip sichtbar, nicht das Verhalten eines konkreten Produkts.

## Scalability und Performance

Der PACELC-„Else“-Zweig ist ein Skalierungsthema: Mehr Knoten oder größere geografische Distanz erhöhen die Latenz eines Sync-Quorums proportional zur langsamsten benötigten Bestätigung (oft dominiert durch die höchste Inter-Region-Latenz). Asynchrone Ansätze skalieren Latenz besser, verschieben die Kosten aber auf Konfliktauflösung und Nutzerüberraschung durch stale reads.

## Reliability / Failure Modes

Ein Timeout kann eine echte Partition nicht sicher von einem langsamen, aber verbundenen Knoten unterscheiden ([KB-0056](../03-network-foundations/08-tcp-verbindungen-und-ueberlastkontrolle.md)). Das führt zu einer echten Gefahr: ein System, das „C“ wählen will, kann bei einem False-Positive-Partitionsverdacht unnötig Verfügbarkeit opfern; ein System, das „A“ wählt, kann bei einer echten Partition unbemerkt divergieren. Recovery nach Partitionsende erfordert eine explizite Versöhnungsstrategie (Last-Write-Wins, CRDT, anwendungsspezifische Merge-Logik) — sonst wird der A-Trade-off stillschweigend zum Datenverlust.

## Security und Governance

CAP/PACELC-Entscheidungen haben Compliance-Relevanz: Ein System, das bei Partition Verfügbarkeit über Konsistenz stellt, kann während einer Störung fehlerhafte Bestände, doppelte Buchungen oder widersprüchliche Berechtigungsstände ausliefern. Für sicherheitsrelevante Daten (Berechtigungen, Zahlungsstatus) ist die C-Wahl bei Partition häufig ein Governance-Erfordernis, nicht nur eine technische Präferenz.

## Observability und Troubleshooting

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzer sieht veralteten Wert nach eigenem Schreiben | asynchrone Replikation, read von anderer Region | Replikationslatenz-Metrik plus Read-Region-Log |
| Fehler „unavailable“ bei einem Knoten, andere ok | C-Modus, Minderheitspartition | Netzwerk-/Quorum-Status des betroffenen Knotens |
| zwei widersprüchliche Werte nach Incident | A-Modus während Partition, fehlende Merge-Logik | Write-Log beider Seiten während des Zeitfensters vergleichen |
| hohe P99-Latenz nur bei Schreibvorgängen | synchrones Quorum über Regionen | Latenzaufschlüsselung nach beteiligten Knoten |

## Cost / FinOps

Synchrone Multi-Region-Konsistenz kostet Latenz und häufig auch Infrastruktur (mehr Kapazität für Quorum-Wartezeiten, teurere Inter-Region-Bandbreite). Die Kostenfrage ist nicht abstrakt: pro zusätzlicher 10 ms Quorum-Latenz bei hoher Schreibrate steigt entweder die nötige Client-Timeout-Toleranz oder die gefühlte Systemlangsamkeit — beides mit Geschäftsfolgen, die gegen das Risiko einer A-Wahl (Konfliktkosten) abzuwägen sind.

## Trade-offs, Alternativen und Anti-Patterns

Anti-Pattern: CAP als „wähle zwei von drei“ ohne den Partitionsbezug zu nennen — das führt zu falschen Designentscheidungen im Normalbetrieb, wo PACELC gilt. Anti-Pattern: eine einzige globale Konsistenzentscheidung für ein ganzes System statt pro Datenklasse (Kontostand versus UI-Präferenz haben unterschiedliche Anforderungen). Alternative: hybride Systeme, die für kritische Schreibpfade C wählen (über Konsens, siehe [KB-0104](04-konsens-und-quoren.md)) und für nicht-kritische Lesepfade A/niedrige Latenz.

## Staff-, Principal- und Chief-Entscheidungen

**Staff** identifiziert für ein konkretes Feature die tatsächlich benötigte Konsistenzgarantie anhand eines Nutzerszenarios, nicht anhand der Standardkonfiguration der gewählten Datenbank. **Principal** definiert eine Datenklassen-Taxonomie (z. B. „financial“, „presence“, „preference“) mit je einer Mindestkonsistenzanforderung, die über mehrere Systeme hinweg gilt. **Chief** entscheidet, ob und wann Ausnahmen von dieser Taxonomie zulässig sind, mit welcher Genehmigung, und trägt das Risiko widersprüchlicher Nutzererwartungen im Produktportfolio.

## Production Checklist

- [ ] Für jede kritische Datenklasse ist die geforderte Konsistenzgarantie explizit dokumentiert (nicht implizit durch Standardkonfiguration).
- [ ] Verhalten bei simulierter Partition wurde getestet und entspricht der dokumentierten Wahl.
- [ ] Eine Versöhnungsstrategie für divergierte Daten nach Partitionsende ist definiert, wenn A gewählt wurde.
- [ ] Latenzbudget für Sync-Quorum-Pfade ist gemessen und gegen SLO geprüft, wenn C gewählt wurde.

## Interviewfragen mit Antwortleitfäden

### 1. Was sagt CAP wirklich aus?

**Antwort:** Bei tatsächlicher Netzwerkpartition kann ein verteiltes System nicht gleichzeitig Linearizability und Antwortgarantie für jeden erreichbaren Knoten liefern. Partitionstoleranz selbst ist keine Wahloption.

### 2. Warum ist „CA ohne P“ meist keine sinnvolle Option?

**Antwort:** Weil ein System mit mehreren Knoten über ein reales Netzwerk Partitionen nicht ausschließen kann; „CA“ setzt eine Garantie voraus, die physikalisch nicht haltbar ist, sobald mehr als ein Knoten beteiligt ist.

### 3. Was fügt PACELC gegenüber CAP hinzu?

**Antwort:** Den Trade-off im Normalbetrieb ohne Partition: Latenz gegen Konsistenz, der bei vielen Systemen den größeren praktischen Effekt hat, weil Partitionen selten, aber Latenzentscheidungen ständig relevant sind.

### 4. Nenne ein Beispiel, wo A gegenüber C bevorzugt werden sollte.

**Antwort:** Eine Präsenzanzeige oder ein Feature-Flag, wo ein kurzzeitig veralteter Wert unkritisch ist und Nichtverfügbarkeit den Nutzer stärker stört als eine falsche Anzeige.

### 5. Wie erkennst du im Incident, dass die A-Wahl zu Datenverlust geführt hat?

**Antwort:** Durch Vergleich der Write-Logs beider Partitionsseiten im betroffenen Zeitfenster; wenn widersprüchliche Schreibvorgänge ohne dokumentierte Merge-Regel überschrieben wurden, ist das ein stiller Datenverlust, kein reiner Verfügbarkeitsgewinn.

### 6. Warum kann ein Timeout eine Partition nicht sicher erkennen?

**Antwort:** Ein Timeout unterscheidet nicht zwischen „Knoten unerreichbar“ und „Knoten langsam, aber verbunden“; ein System, das auf Timeout hin C erzwingt, kann bei bloßer Langsamkeit unnötig Verfügbarkeit opfern.

### 7. Widersprüchliche Anforderung: Produkt will „immer verfügbar“ UND „nie falsche Kontostände“ — wie gehst du vor?

**Antwort:** Diese Anforderungen sind bei echter Partition nicht gleichzeitig erfüllbar für denselben Schreibpfad; ich würde die Anforderung in Teilsysteme aufteilen (z. B. Reservierung synchron/konsistent, Anzeige asynchron/verfügbar) und die verbleibende Partitionsgefahr explizit als akzeptiertes Restrisiko dokumentieren.

## Praktische Labs / Fallarbeit

**Aufgabe:** Zwei-Knoten-Modell mit Partitionssimulation bauen und beide Modi (cp, ap) beobachten.

~~~python
class Node:
    def __init__(self, mode):
        self.mode = mode
        self.value = None
        self.partitioned = False

    def write(self, v, peer):
        self.value = v
        if not self.partitioned:
            peer.value = v  # synchronous replication when connected

    def read(self):
        if self.partitioned and self.mode == "cp":
            raise RuntimeError("unavailable during partition (C chosen)")
        return self.value  # may be stale if mode == "ap"

a = Node(mode="ap")
b = Node(mode="ap")
a.write("cart:1item", b)
a.partitioned = True
b.partitioned = True
a.write("cart:2items", b)  # only a updates; b diverges
assert b.read() == "cart:1item"
print("Diverged read during partition, availability-mode:", b.read())

c = Node(mode="cp")
c.partitioned = True
try:
    c.read()
    raise AssertionError("expected unavailability")
except RuntimeError as e:
    print("Consistency-mode correctly refused stale read:", e)
~~~

**Erwartete Beobachtung:** Im ap-Modus liefert der isolierte Knoten einen veralteten Wert ohne Fehler; im cp-Modus verweigert er die Antwort. **Gegenprobe:** Setze `partitioned = False` nach dem Write und prüfe, dass beide Knoten wieder denselben Wert liefern — das zeigt, dass die Divergenz eine Folge der Partition ist, nicht ein Programmierfehler. **Cleanup:** kein externer Zustand, reines In-Memory-Skript.

## Dependencies, Cross-References und Quellen

1. Gilbert, Lynch: [Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services](https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf), ACM SIGACT News 2002, abgerufen 2026-09-17.
2. Abadi: [Consistency Tradeoffs in Modern Distributed Database System Design (PACELC)](https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf), IEEE Computer 2012, abgerufen 2026-09-17.

Produktspezifische Konsistenzgarantien und Standardkonfigurationen vor jeder konkreten Systementscheidung an aktueller Herstellerdokumentation prüfen; dieses Kapitel behandelt das zeitstabile Prinzip, nicht produktspezifische Defaults.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Konfigurierbare Konsistenzlevel pro Operation (statt Systemweit) | Established in vielen Multi-Region-Datenbanken | Pro Operation prüfen, welches Level tatsächlich gewählt wurde, nicht den Systemnamen als Garantie nehmen. |
| CRDTs zur automatischen Konfliktauflösung nach A-Wahl | Adopting | Nur für Datentypen mit definierter Merge-Semantik einsetzen; Anwendungslogik-Konflikte bleiben ungelöst. |
| Jepsen-artige automatisierte Partitionstests in CI | Adopting | Vor Vertrauen in eine Konsistenzaussage: reale Partitionssimulation gegen die dokumentierte Garantie fahren. |

Ein Team akzeptiert eine neue Konsistenz-/Verfügbarkeitsimplementierung erst, wenn das tatsächliche Verhalten unter simulierter Partition getestet, die Versöhnungsstrategie für Divergenz definiert und die gewählte Garantie explizit gegen die Datenklassen-Taxonomie geprüft ist.
