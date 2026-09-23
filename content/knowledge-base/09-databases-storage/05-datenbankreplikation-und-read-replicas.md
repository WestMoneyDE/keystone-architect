---
{"id": "KB-0199", "title": "Datenbankreplikation und Read Replicas", "domain": "09", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD", "STAFF"], "requires": [{"id": "KB-0195", "concepts": ["WAL"], "needed_for": "both"}, {"id": "KB-0103", "concepts": ["Replikation"], "needed_for": "both"}], "related": ["KB-0200", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Replikationsverzug zwischen Primary und Read Replica lokal simulieren und einen Read-after-write-Fehlerfall zeigen.", "rationale": "Kein echter Datenbankcluster nötig, um das Kernproblem zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "WAL-Shipping versus logische Replikation für einen konkreten Anwendungsfall begründet wählen und Read-after-write-Anforderungen entsprechend absichern.", "rationale": "Beide Replikationsarten haben unterschiedliche Granularität, Flexibilität und Verzugscharakteristik."}, "STAFF-TARGET": {"active": true, "scope": "Einen 'verschwundenen' gerade geschriebenen Datensatz auf eine Leseanfrage an eine verzögerte Replica zurückführen.", "rationale": "Das ist eine der häufigsten Read-Replica-bezogenen Support-Anfragen."}, "CHIEF-TARGET": {"active": true, "scope": "Read-Replica-Nutzung mit explizitem Replikationsverzug-Bewusstsein als Standard für Leseskalierung festlegen.", "rationale": "Unreflektierte Read-Replica-Nutzung für konsistenzkritische Lesevorgänge ist ein wiederkehrendes Produktionsproblem."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Multi-Master-Replikationskonflikte und Failover-Automatisierungsdetails sind Vertiefung.", "rationale": "Kern ist das Verständnis von Replikationsverzug und dessen Konsequenzen für Read-after-write."}}, "lab_validation": [{"lab_id": "KB-0199-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Replikationsverzug zwischen Primary und Replica", "evidence": "Ein unmittelbar nach dem Schreiben an die Primary gestellter Lesevorgang gegen die Replica liefert den alten Wert, da der Replikationsvorgang zum Lesezeitpunkt noch nicht abgeschlossen war.", "limitations": "Kein echter Datenbankcluster, keine Produktion."}]}
---
# Datenbankreplikation und Read Replicas

> **Ziel:** Read Replicas skalieren Leselast, indem sie replizierte Kopien der Primary-Datenbank für Leseanfragen bereitstellen — aber die Replikation ist typischerweise asynchron, was einen Replikationsverzug erzeugt. Ein Nutzer, der unmittelbar nach dem Schreiben liest und dabei an eine Replica geroutet wird, kann seine eigene, gerade geschriebene Änderung nicht sehen — ein häufiges, verwirrendes Symptom ohne echten Datenverlust.

## Zweck, Mental Model und Dependencies

WAL-Shipping-Replikation ([KB-0195](01-postgresql-und-interne-datenpfade.md)) überträgt das physische Write-Ahead-Log an Replicas, die es kontinuierlich replayen — einfach und effizient, aber die Replica muss dieselbe Datenbankversion und -struktur wie die Primary haben. Logische Replikation überträgt stattdessen logische Änderungsereignisse (ähnlich CDC, [KB-0190](../08-messaging-workflows/14-cdc-als-ereignisbruecke.md)), was mehr Flexibilität bietet (z. B. selektive Tabellenreplikation, Replikation über Versionsgrenzen hinweg), aber mit höherem Overhead. Beide Replikationsarten sind typischerweise asynchron: die Primary bestätigt einen Schreibvorgang, bevor er garantiert auf allen Replicas angekommen ist — dieselbe grundlegende Trade-off-Struktur wie generische asynchrone Replikation ([KB-0103](../05-distributed-systems/03-replikationsmodelle-und-konflikte.md)). Lies [KB-0195](01-postgresql-und-interne-datenpfade.md) und [KB-0103](../05-distributed-systems/03-replikationsmodelle-und-konflikte.md).

~~~text
Client writes to Primary -> Primary commits, confirms to client -> WAL streamed to Replica (async, takes time)
Client immediately reads from Replica -> replica hasn't applied the WAL yet -> returns OLD value
"Read-after-write" failure: not data loss, just a timing gap in asynchronous replication
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| WAL-Shipping vs. logisch | passt die Replikationsart zum Anwendungsfall (identische DB-Version, selektive Tabellen)? | falsche Wahl erzeugt unnötige Betriebskomplexität oder fehlende Flexibilität |
| Replikationsverzug | wird er aktiv gemessen und gegen SLO geprüft? | unbekannter Verzug führt zu überraschenden Read-after-write-Problemen |
| Read-Routing | werden konsistenzkritische Lesevorgänge gezielt an die Primary geleitet? | pauschales Routing aller Lesevorgänge an Replicas ignoriert Konsistenzbedarf |
| Failover | wird eine Replica bei Primary-Ausfall korrekt und ohne Datenverlust befördert? | Failover ohne ausreichende Replikationsbestätigung riskiert Datenverlust |

Implementierung: konsistenzkritische Lesevorgänge (z. B. „zeige die Bestellung, die der Nutzer gerade selbst aufgegeben hat") werden gezielt an die Primary oder eine Replica mit garantiert ausreichend aktuellem Stand geroutet, während tolerantere Lesevorgänge (z. B. Reporting, Analytics) an Read Replicas verteilt werden. Replikationsverzug wird kontinuierlich gemessen und gegen ein definiertes SLO geprüft. Für Anwendungsfälle mit hartem Read-after-write-Bedarf werden Techniken wie „Read your own writes" (kurzzeitiges Routing des schreibenden Nutzers an die Primary) oder synchrone Replikationsbestätigung für kritische Schreibvorgänge eingesetzt.

## Scalability, Reliability, Security und Observability

Read Replicas skalieren Leselast horizontal sehr effektiv für tolerante Anwendungsfälle, lösen aber keine Schreibskalierung (alle Schreibvorgänge bleiben bei der Primary). Reliability-Grenze: ein Failover-Prozess, der eine Replica befördert, bevor deren Replikationsstand vollständig mit der ausgefallenen Primary synchronisiert war, kann zu stillem Datenverlust der zuletzt geschriebenen, aber noch nicht replizierten Änderungen führen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzer sieht eigene, gerade gespeicherte Änderung nicht | Leseanfrage wurde an eine verzögerte Replica geroutet | Replikationsverzug zum Lesezeitpunkt gegen Schreibzeitpunkt prüfen |
| Datenverlust nach Failover | Replica wurde befördert, bevor ihr Replikationsstand aktuell war | letzten replizierten Zeitpunkt der beförderten Replica vor Failover prüfen |
| Replikationsverzug wächst kontinuierlich | Replica kann mit der Schreiblast der Primary nicht Schritt halten | Replica-Ressourcen (CPU, I/O) gegen tatsächliche Replikationslast prüfen |
| logische Replikation bricht bei bestimmten Schema-Änderungen | Inkompatibilität zwischen logischer Replikation und bestimmten DDL-Operationen | betroffene Schema-Änderung gegen bekannte logische-Replikations-Einschränkungen prüfen |

Security: Replica-Zugriff sollte mit denselben oder granulareren Berechtigungen wie die Primary konfiguriert werden, da eine Replica dieselben sensiblen Daten vollständig enthält. Observability: Replikationsverzug (in Zeit und/oder Byte-Offset) ist die zentrale Metrik, um zu wissen, wie „alt" eine Antwort einer Replica maximal sein könnte.

## Trade-offs und Entscheidungen

**Staff** routet konsistenzkritische Lesevorgänge explizit an die Primary oder aktuelle Replicas, statt alle Lesevorgänge pauschal zu verteilen. **Principal** definiert Replikationsverzug-SLOs und überwacht sie aktiv. **Chief** verlangt bewusste Read-Replica-Nutzung mit dokumentiertem Konsistenzbewusstsein als Standard für Leseskalierung.

Anti-Patterns: alle Lesevorgänge unreflektiert an Read Replicas verteilen, unabhängig vom Konsistenzbedarf; Failover ohne Prüfung des tatsächlichen Replikationsstands der zu befördernden Replica durchführen; Replikationsverzug nicht aktiv überwachen.

## Production Checklist

- [ ] Konsistenzkritische Lesevorgänge sind explizit an Primary/aktuelle Replicas geroutet.
- [ ] Replikationsverzug wird kontinuierlich gemessen und gegen SLO geprüft.
- [ ] Failover-Prozess prüft tatsächlichen Replikationsstand vor Beförderung einer Replica.
- [ ] WAL-Shipping vs. logische Replikation ist bewusst nach Anwendungsfall gewählt.

## Interviewfragen

### 1. Warum kann ein Nutzer seine eigene, gerade geschriebene Änderung nicht sofort sehen?

**Antwort:** Bei asynchroner Replikation bestätigt die Primary den Schreibvorgang, bevor er garantiert auf allen Replicas angekommen ist; eine unmittelbar danach an eine Replica gestellte Leseanfrage kann den alten Stand liefern, da die Replikation noch nicht abgeschlossen war.

### 2. Was ist der Unterschied zwischen WAL-Shipping und logischer Replikation?

**Antwort:** WAL-Shipping überträgt das physische Transaktionslog und erfordert identische Datenbankversion/-struktur auf der Replica; logische Replikation überträgt logische Änderungsereignisse und bietet mehr Flexibilität (z. B. selektive Tabellenreplikation), mit höherem Overhead.

### 3. Wie verhinderst du Datenverlust bei einem Failover?

**Antwort:** Indem geprüft wird, dass die zu befördernde Replica tatsächlich den vollständigen Replikationsstand der ausgefallenen Primary erreicht hat, bevor sie als neue Primary übernimmt — sonst gehen die zuletzt geschriebenen, noch nicht replizierten Änderungen verloren.

### 4. Wie behandelst du Anwendungsfälle mit hartem Read-after-write-Bedarf?

**Antwort:** Durch gezieltes Routing des schreibenden Nutzers kurzzeitig an die Primary, synchrone Replikationsbestätigung für kritische Schreibvorgänge, oder Routing an eine Replica mit garantiert aktuellem Stand.

### 5. Warum lösen Read Replicas kein Schreibskalierungsproblem?

**Antwort:** Alle Schreibvorgänge müssen weiterhin über die Primary laufen; Replicas skalieren ausschließlich Leselast, nicht die Kapazität für Schreiboperationen.

### 6. Widersprüchliche Anforderung: Produkt will maximale Leseskalierung über viele Replicas UND garantiert konsistente Leseergebnisse für jeden Nutzer — wie gehst du vor?

**Antwort:** Ich würde eine differenzierte Routing-Strategie implementieren: konsistenzkritische Lesevorgänge (eigene, gerade geschriebene Daten) gehen gezielt an die Primary oder eine garantiert aktuelle Quelle, während tolerantere Lesevorgänge (allgemeine Inhalte, Reporting) über viele Replicas skaliert werden — vollständige Skalierung und vollständige Konsistenz für alle Lesevorgänge sind sonst nicht gleichzeitig erreichbar.

## Praktische Labs

~~~python
import time

class Primary:
    def __init__(self):
        self.data = {}
    def write(self, key, value, replica):
        self.data[key] = value
        # simulate async replication delay
        replica.pending_writes.append((key, value, time.monotonic() + 0.1))

class Replica:
    def __init__(self):
        self.data = {}
        self.pending_writes = []
    def apply_pending(self):
        now = time.monotonic()
        still_pending = []
        for key, value, ready_at in self.pending_writes:
            if now >= ready_at:
                self.data[key] = value
            else:
                still_pending.append((key, value, ready_at))
        self.pending_writes = still_pending

primary = Primary()
replica = Replica()
primary.write("order:1", "confirmed", replica)

immediate_read = replica.data.get("order:1")  # not yet replicated
assert immediate_read is None
time.sleep(0.15)
replica.apply_pending()
delayed_read = replica.data.get("order:1")
assert delayed_read == "confirmed"
print(f"Immediate read from replica: {immediate_read}. After replication lag passed: {delayed_read}")
~~~

## Dependencies, Cross-References und Quellen

1. PostgreSQL Global Development Group: [Log-Shipping Standby Servers](https://www.postgresql.org/docs/current/warm-standby.html), abgerufen 2026-09-17.
2. PostgreSQL: [Logical Replication](https://www.postgresql.org/docs/current/logical-replication.html), abgerufen 2026-09-17.

Datenbankspezifische Replikations- und Failover-Automatisierungsdetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Managed-Database-Dienste mit automatisiertem, geprüftem Failover | Established je Cloud-Anbieter | Tatsächliches Failover-Verhalten unter simuliertem Ausfall verifizieren, nicht nur der Dokumentation vertrauen. |

Ein Team akzeptiert eine Read-Replica-Architektur erst, wenn Replikationsverzug gemessen, konsistenzkritisches Routing implementiert und Failover-Datenverlustrisiko geprüft sind.
