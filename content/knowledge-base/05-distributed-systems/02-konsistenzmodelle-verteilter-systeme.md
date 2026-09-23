---
{"id": "KB-0102", "title": "Konsistenzmodelle verteilter Systeme", "domain": "05", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0101", "concepts": ["CAP", "PACELC"], "needed_for": "both"}], "related": ["KB-0103", "KB-0104", "KB-0562", "KB-0720"], "applies": ["KB-0103", "KB-0104", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ereignisfolgen lokal simulieren und Linearizability-, Causal- und Eventual-Consistency-Verletzungen selbst erzeugen und erkennen.", "rationale": "Kein Cluster nötig, um Anomalien an einem deterministischen Modell zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein System begründen, welches Konsistenzmodell pro Datenpfad ausreicht, statt pauschal 'stark' oder 'schwach' zu wählen.", "rationale": "Überstarke Konsistenz kostet Latenz; zu schwache erzeugt sichtbare Anomalien."}, "STAFF-TARGET": {"active": true, "scope": "Eine beobachtete Nutzeranomalie (z. B. 'mein Kommentar ist verschwunden') einem konkreten Konsistenzmodellverstoß zuordnen.", "rationale": "Debugging verteilter Datenpfade erfordert das richtige mentale Modell der Garantie."}, "CHIEF-TARGET": {"active": true, "scope": "Konsistenzmodell-Mindestanforderungen pro Produktklasse als Standard festlegen und Ausnahmefreigaben verantworten.", "rationale": "Inkonsistente Modellwahl über Produkte hinweg erzeugt unvorhersehbares Nutzerverhalten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Formale Konsistenzmodell-Hierarchien (session guarantees, sequential consistency) und Jepsen-Analysen sind Vertiefung.", "rationale": "Kern ist die praktische Unterscheidung der drei Hauptmodelle und ihrer Anomalien."}}, "lab_validation": [{"lab_id": "KB-0102-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Ereignismodell, keine echte Datenbank", "evidence": "Eine kausal verletzte Leseanordnung (Antwort vor Frage sichtbar) wird durch fehlende Kausalitätsspur erkannt.", "limitations": "Kein reales verteiltes System, keine Netzwerklatenz, keine Produktion."}]}
---
# Konsistenzmodelle verteilter Systeme

> **Ziel:** Konsistenzmodelle definieren, welche Reihenfolge und Aktualität von Lese-/Schreiboperationen ein verteiltes System garantiert. Linearizability, Causal Consistency und Eventual Consistency sind keine Qualitätsstufen, sondern unterschiedliche, präzise definierte Verträge mit unterschiedlichen Anomalien und Kosten.

## Zweck, Mental Model und Dependencies

Linearizability garantiert, dass alle Operationen so erscheinen, als liefen sie nacheinander in Echtzeitreihenfolge auf einer einzigen Kopie. Causal Consistency garantiert nur, dass kausal abhängige Operationen (z. B. Antwort nach Frage) in korrekter Reihenfolge sichtbar sind — unabhängige Operationen können in unterschiedlicher Reihenfolge erscheinen. Eventual Consistency garantiert nur, dass ohne neue Schreibvorgänge irgendwann alle Kopien konvergieren — ohne Reihenfolgegarantie dazwischen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0101](01-cap-und-pacelc.md).

~~~text
strength:  Linearizable > Sequential > Causal > Eventual
cost:      highest latency/coordination -----------------> lowest latency/coordination
~~~

## Core Concepts, Architektur und Implementierung

| Modell | Garantie | typische Anomalie wenn schwächer gewählt |
|---|---|---|
| Linearizability | Echtzeit-Gesamtordnung, wie eine einzige Kopie | — (stärkstes Modell) |
| Sequential Consistency | globale Ordnung, aber nicht zwingend Echtzeit-treu | Operation erscheint „zu früh“ oder „zu spät“ relativ zur Wanduhr |
| Causal Consistency | kausal abhängige Operationen in korrekter Reihenfolge | Antwort ohne sichtbare Frage, unabhängige Updates in beliebiger Reihenfolge |
| Eventual Consistency | Konvergenz ohne Reihenfolgegarantie | stale read, verschwundene/zurückgesetzte Werte, Reordering |

Implementierung: Linearizability erfordert Koordination (Konsens/Quorum, siehe [KB-0104](04-konsens-und-quoren.md)) und kostet Latenz proportional zur Koordinationsdistanz. Causal Consistency erfordert das Mitführen von Abhängigkeitsmetadaten (z. B. Vektoruhren oder Versionsvektoren), um kausale Reihenfolge durchzusetzen, ohne globale Koordination zu benötigen. Eventual Consistency erfordert nur einen Konvergenzmechanismus (Last-Write-Wins, CRDT, Anwendungs-Merge).

## Scalability, Reliability, Security und Observability

Schwächere Modelle skalieren besser über Regionen, weil sie weniger oder keine Cross-Region-Koordination pro Operation benötigen. Reliability-Grenze: Eventual Consistency ohne definierten Konvergenzmechanismus kann bei konkurrierenden Schreibvorgängen stillschweigend Daten verlieren (Last-Write-Wins überschreibt) statt zu konvergieren.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzer sieht eigene Änderung nicht sofort | Read-your-writes nicht garantiert, Read von anderer Replik | Session-Affinität/Read-Konsistenz-Level prüfen |
| Kommentar erscheint vor der Frage, auf die er antwortet | Causal Consistency verletzt oder gar nicht implementiert | Kausalitätsmetadaten (Vektoruhr) im Log prüfen |
| zwei gleichzeitige Edits, einer „verschwindet“ | Last-Write-Wins ohne Merge-Logik | Write-Timestamps beider Seiten vergleichen |
| Lesen liefert unterschiedliche Werte bei wiederholter Anfrage kurz hintereinander | Lastverteilung auf inkonsistente Repliken | Replik-ID pro Antwort loggen und korrelieren |

Security-Bezug: Berechtigungsänderungen (z. B. Zugriffsentzug) benötigen mindestens Read-your-writes oder stärker für den ändernden Akteur, sonst kann ein entzogener Zugriff kurzzeitig noch über eine veraltete Replik funktionieren. Observability korreliert Konsistenzlevel pro Operation, Replik-Herkunft der Antwort und Zeitversatz zur letzten bestätigten Schreiboperation.

## Trade-offs und Entscheidungen

**Staff** ordnet eine gemeldete Anomalie einem konkreten Modellverstoß zu, statt „Datenbankbug“ zu vermuten. **Principal** definiert pro Datenpfad das minimal ausreichende Modell (nicht pauschal das stärkste) und macht die Wahl im Code/API-Vertrag sichtbar. **Chief** legt Mindestanforderungen pro Produktklasse fest (z. B. Zahlungsstatus mindestens linearizable, UI-Präferenz eventual ausreichend) und verantwortet Ausnahmen.

Anti-Patterns: überall Linearizability erzwingen „zur Sicherheit“ und damit unnötig Latenz/Kosten verursachen; Eventual Consistency ohne definierten Konvergenzmechanismus einsetzen; Konsistenzlevel implizit durch Datenbank-Default statt explizite Entscheidung festlegen.

## Production Checklist

- [ ] Konsistenzmodell pro kritischem Datenpfad explizit dokumentiert und begründet.
- [ ] Konvergenzmechanismus für jeden Pfad mit Eventual Consistency definiert (LWW, CRDT oder Anwendungs-Merge).
- [ ] Read-your-writes für berechtigungsrelevante Änderungen sichergestellt oder als Risiko akzeptiert dokumentiert.
- [ ] Anomalie-Monitoring (Replik-Herkunft, Zeitversatz) für schwächere Modelle vorhanden.

## Interviewfragen

### 1. Was unterscheidet Causal Consistency von Eventual Consistency?

**Antwort:** Causal Consistency garantiert, dass kausal abhängige Operationen in korrekter Reihenfolge sichtbar sind; Eventual Consistency garantiert nur Konvergenz ohne jede Reihenfolgegarantie dazwischen.

### 2. Warum ist Linearizability teuer?

**Antwort:** Sie erfordert, dass jede Operation global koordiniert wird, um eine Echtzeit-treue Gesamtordnung zu garantieren — das kostet Latenz proportional zur Koordinationsdistanz.

### 3. Was bedeutet „Read-your-writes“?

**Antwort:** Ein Akteur sieht garantiert seine eigenen vorherigen Schreibvorgänge bei nachfolgenden Lesevorgängen, auch wenn andere Nutzer schwächere Garantien haben.

### 4. Wie erkennst du eine Verletzung von Causal Consistency im Log?

**Antwort:** Eine Operation, die kausal von einer anderen abhängt (referenziert sie), erscheint in Logs/Repliken vor ihrer Ursache, oder Kausalitätsmetadaten fehlen ganz.

### 5. Wann ist Eventual Consistency akzeptabel?

**Antwort:** Wenn kurzzeitig veraltete oder scheinbar zurückgesetzte Werte für Nutzer und Geschäftslogik tolerierbar sind und ein klar definierter Konvergenzmechanismus existiert.

### 6. Widersprüchliche Anforderung: Produkt will globale niedrige Latenz UND garantiert korrekte Reihenfolge für alle Nutzer — wie gehst du vor?

**Antwort:** Ich würde prüfen, ob „alle Nutzer“ wirklich nötig ist oder ob Causal Consistency pro Nutzer/Session ausreicht; globale Linearizability bei niedriger Latenz über Regionen ist physikalisch nicht ohne Kompromiss erreichbar.

## Praktische Labs

~~~python
events = []
def write(actor, value, causes=None):
    events.append({"actor": actor, "value": value, "causes": causes})

write("u1", "question: why fail?")
write("u2", "answer: timeout", causes=0)  # depends on event index 0

order_violated = any(e["causes"] is not None and e["causes"] >= i for i, e in enumerate(events))
assert not order_violated
print("Causal order preserved: cause appears before its dependent event.")
~~~

## Dependencies, Cross-References und Quellen

1. Herlihy, Wing: [Linearizability: A Correctness Condition for Concurrent Objects](https://cs.brown.edu/~mph/HerlihyW90/p463-herlihy.pdf), ACM TOPLAS 1990, abgerufen 2026-09-17.
2. Lamport: [Time, Clocks, and the Ordering of Events in a Distributed System](https://lamport.azurewebsites.net/pubs/time-clocks.pdf), Communications of the ACM 1978, abgerufen 2026-09-17.

Produktspezifische Konsistenzlevel-Bezeichnungen und Defaults vor konkretem Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| CRDTs als Standard-Konvergenzmechanismus | Adopting | Nur für Datentypen mit definierter, verlustfreier Merge-Semantik einsetzen. |
| Session-Consistency-APIs (konfigurierbar pro Request) | Established in vielen Multi-Region-Datenbanken | Pro Operation prüfen, welches Level tatsächlich angefordert wird. |
| automatisierte Anomalieerkennung (Jepsen-artig) in CI | Adopting | Vor Vertrauen in ein Konsistenzversprechen: reale Testreihe gegen dokumentiertes Modell fahren. |

Ein Team akzeptiert ein schwächeres Konsistenzmodell erst, wenn die konkrete Anomalieklasse, der Konvergenzmechanismus und die Nutzer-/Geschäftsauswirkung explizit geprüft und dokumentiert sind.
