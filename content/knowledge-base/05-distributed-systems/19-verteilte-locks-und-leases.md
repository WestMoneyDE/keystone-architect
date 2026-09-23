---
{"id": "KB-0119", "title": "Verteilte Locks und Leases", "domain": "05", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0105", "concepts": ["Leader Election", "Fencing"], "needed_for": "both"}], "related": ["KB-0104", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Lease-basierten verteilten Lock mit Fencing lokal implementieren und einen Pausen-Fall erzeugen.", "rationale": "Kein Lock-Service nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für eine exklusive Ressource Lease-Dauer, Renewal und Fencing als Vertrag entwerfen.", "rationale": "Ein verteilter Lock ohne Fencing schützt nicht vor doppelter Verarbeitung nach Pausen."}, "STAFF-TARGET": {"active": true, "scope": "Doppelte Verarbeitung nach einer Prozesspause auf fehlendes Fencing zurückführen.", "rationale": "Das ist die zentrale, bekannte Schwäche naiver verteilter Locks."}, "CHIEF-TARGET": {"active": true, "scope": "Fencing als Pflichtanforderung für jeden verteilten Lock mit exklusivem Ressourcenzugriff festlegen.", "rationale": "Ohne Fencing führt ein Lock zu falscher Sicherheit statt echter Exklusivität."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Redlock-Debatte, Lock-Service-Implementierungen (Zookeeper/etcd) im Detail sind Vertiefung.", "rationale": "Kern ist das Zusammenspiel von Lease, Renewal und ressourcenseitigem Fencing."}}, "lab_validation": [{"lab_id": "KB-0119-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Lease-Lock mit Fencing-Token an geschützter Ressource", "evidence": "Nach simulierter Pause und Lease-Ablauf übernimmt ein zweiter Worker den Lock; der erste Worker kann nach dem Aufwachen dank ressourcenseitiger Token-Prüfung nicht mehr schreiben.", "limitations": "Kein echter Lock-Service, keine Produktion."}]}
---
# Verteilte Locks und Leases

> **Ziel:** Ein verteilter Lock gewährt exklusiven Zugriff auf eine Ressource über mehrere Knoten hinweg, meist über eine zeitlich begrenzte Lease statt eines dauerhaften Locks. Ohne Fencing schützt ein solcher Lock nicht zuverlässig vor doppelter Verarbeitung, wenn der Lock-Inhaber pausiert oder das Netzwerk stört — das ist dasselbe Grundproblem wie bei Leader Election ([KB-0105](05-leader-election-und-fencing.md)).

## Zweck, Mental Model und Dependencies

Ein verteilter Lock über einen Lock-Service (Zookeeper, etcd, Consul o. ä.) gewährt einem Worker für begrenzte Zeit (Lease) exklusiven Zugriff auf eine logische Ressource (z. B. „Job X wird gerade verarbeitet“). Läuft die Lease ab, ohne rechtzeitig erneuert zu werden (z. B. wegen einer Pause des Workers), kann ein anderer Worker den Lock übernehmen — der ursprüngliche Worker weiß das aber möglicherweise nicht sofort und könnte nach dem Aufwachen weiterarbeiten, als hätte er noch den Lock. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0105](05-leader-election-und-fencing.md).

~~~text
Worker1 acquires lock, token=5 -> [GC pause] -> lease expires -> Worker2 acquires lock, token=6
Worker1 wakes up, writes with token=5 -> resource rejects: token=5 < last_seen_token=6
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Lease-Dauer | ausreichend Puffer für normale Verarbeitungsdauer? | zu kurz: unnötige Lock-Wechsel; zu lang: verzögerte Übernahme bei echtem Ausfall |
| Renewal | aktives Erneuern vor Ablauf implementiert? | fehlendes Renewal lässt Lease unnötig ablaufen |
| Fencing-Token | wird an der geschützten Ressource selbst geprüft? | ohne ressourcenseitige Prüfung schützt der Lock nicht wirklich |
| Lock-Service-Verfügbarkeit | was passiert, wenn der Lock-Service selbst nicht erreichbar ist? | Worker weiß nicht, ob er noch Lock-Inhaber ist |

Implementierung: dieselbe Fencing-Logik wie bei Leader Election ([KB-0105](05-leader-election-und-fencing.md)) — die geschützte Ressource selbst muss den monoton steigenden Fencing-Token prüfen und veraltete Tokens ablehnen, nicht nur der Lock-Inhaber selbst „glauben“, er halte noch den Lock. Renewal deutlich vor Ablauf der Lease auslösen, mit Puffer für Netzwerklatenz. Bei Nichterreichbarkeit des Lock-Service muss der Worker konservativ annehmen, den Lock verloren zu haben, statt optimistisch weiterzuarbeiten.

## Scalability, Reliability, Security und Observability

Verteilte Locks eignen sich für seltene, klar abgegrenzte exklusive Operationen (z. B. „nur ein Worker führt diesen Batch-Job aus“) — sie skalieren schlecht als generelles Synchronisationsprimitiv für hochfrequente Operationen, da jede Lock-Operation Latenz gegenüber dem Lock-Service kostet. Reliability-Grenze: ohne Fencing ist ein verteilter Lock eine falsche Sicherheitsgarantie — er verhindert konkurrierenden Zugriff nur, solange keine Pause/Verzögerung auftritt, was in Produktionssystemen regelmäßig vorkommt (GC, Swap, Netzwerk-Jitter).

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Job wird doppelt verarbeitet | fehlendes Fencing, Lock-Inhaber nach Pause weiter aktiv | prüfen, ob geschützte Ressource Fencing-Token tatsächlich validiert |
| Lock wechselt häufig zwischen Workern | Lease-Dauer zu kurz für normale Verarbeitungszeit | Verarbeitungsdauer gegen Lease-Dauer/Renewal-Intervall vergleichen |
| Worker hält Lock „für immer“ | fehlgeschlagenes Renewal wird nicht erkannt, Prozess läuft weiter ohne gültige Lease | Lease-Status versus tatsächliche Aktivität des Workers prüfen |
| System blockiert komplett bei Lock-Service-Ausfall | keine Fallback-Strategie bei Nichterreichbarkeit | Verhalten bei simuliertem Lock-Service-Ausfall testen |

Security: der Lock-Service selbst ist eine privilegierte Komponente; unautorisierter Zugriff darauf könnte Locks erschleichen oder Legitime blockieren, daher braucht er Authentifizierung/Zugriffskontrolle. Observability korreliert aktuellen Lock-Inhaber, Token-Historie, Renewal-Erfolge/-Fehler und abgelehnte Schreibversuche mit veraltetem Token.

## Trade-offs und Entscheidungen

**Staff** testet explizit das Pausen-Szenario und prüft, ob die geschützte Ressource veraltete Tokens tatsächlich ablehnt, nicht nur ob der Lock-Service korrekt reagiert. **Principal** definiert Fencing als verpflichtenden Bestandteil jeder verteilten Lock-Implementierung. **Chief** verlangt für jede Ressource mit exklusivem Zugriff über verteilte Locks einen dokumentierten Fencing-Nachweis vor Produktivfreigabe.

Anti-Patterns: verteilte Locks als generelles Synchronisationsprimitiv für hochfrequente Operationen einsetzen; Fencing-Check nur im Anwendungscode des Lock-Inhabers statt an der Ressource; Lease-Dauer ohne Bezug zur realen Verarbeitungsdauer und realistischen Pausenszenarien wählen.

## Production Checklist

- [ ] Fencing-Token-Prüfung liegt an der geschützten Ressource selbst.
- [ ] Lease-Dauer und Renewal-Intervall gegen reale Verarbeitungsdauer und Pausenszenarien getestet.
- [ ] Verhalten bei Lock-Service-Nichterreichbarkeit definiert (konservativ, nicht optimistisch).
- [ ] Pausen-/GC-Simulation als expliziter Testfall vor Produktivfreigabe durchgeführt.

## Interviewfragen

### 1. Warum reicht ein verteilter Lock ohne Fencing nicht aus?

**Antwort:** Ein Worker, der nach einer Pause aufwacht, kann fälschlich annehmen, noch den Lock zu halten, und weiterarbeiten, obwohl die Lease längst abgelaufen und der Lock an einen anderen Worker vergeben ist.

### 2. Wo muss der Fencing-Token geprüft werden?

**Antwort:** An der geschützten Ressource selbst, nicht nur im Entscheidungscode des Lock-Inhabers, da dessen Urteilsvermögen genau nach einer Pause unzuverlässig sein kann.

### 3. Wann sind verteilte Locks die richtige Wahl?

**Antwort:** Für seltene, klar abgegrenzte exklusive Operationen wie einen Batch-Job, nicht als generelles Synchronisationsprimitiv für hochfrequente Zugriffe, wegen der Latenzkosten jeder Lock-Operation.

### 4. Wie sollte sich ein Worker verhalten, wenn der Lock-Service nicht erreichbar ist?

**Antwort:** Konservativ: er sollte annehmen, den Lock verloren zu haben, und die Arbeit stoppen, statt optimistisch weiterzuarbeiten und dadurch das Fencing-Prinzip zu umgehen.

### 5. Wie wählst du eine sinnvolle Lease-Dauer?

**Antwort:** Basierend auf der realen Verarbeitungsdauer der geschützten Operation plus Puffer für Netzwerklatenz, mit einem Renewal-Intervall deutlich vor Ablauf der Lease.

### 6. Widersprüchliche Anforderung: Produkt will sofortige Übernahme bei Worker-Ausfall UND garantiert keine doppelte Verarbeitung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine sehr kurze Lease die Erkennungszeit für Ausfälle verkürzt, aber ohne Fencing das Risiko doppelter Verarbeitung bei bloßen Pausen erhöht; die Lösung ist Fencing an der Ressource selbst, sodass auch bei schneller Übernahme keine doppelte Verarbeitung möglich ist, unabhängig von der gewählten Lease-Dauer.

## Praktische Labs

~~~python
last_seen_token = 5

def write_to_resource(token, value):
    global last_seen_token
    if token < last_seen_token:
        raise PermissionError(f"stale lock token {token} < {last_seen_token}")
    last_seen_token = token
    return value

write_to_resource(6, "worker2-write")  # new lock holder after lease expiry
try:
    write_to_resource(5, "worker1-write-after-pause")
    raise AssertionError("expected rejection")
except PermissionError as e:
    print("Paused worker with stale lock token correctly rejected:", e)
~~~

## Dependencies, Cross-References und Quellen

1. Kleppmann: [How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html), 2016, abgerufen 2026-09-17.

Produktspezifische Lock-Service-API-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Verwaltete Lock-/Lease-Dienste mit eingebauter Fencing-Token-Unterstützung | Established | Clock-Skew-Annahmen und Token-Semantik der konkreten API prüfen. |
| Lease-freie, versionsbasierte optimistische Concurrency-Kontrolle als Alternative | Adopting | Für Fälle mit geringer Kontention statt Lock prüfen. |

Ein Team akzeptiert eine verteilte Lock-Implementierung erst, wenn ein simuliertes Pausenszenario zeigt, dass die geschützte Ressource veraltete Tokens tatsächlich ablehnt.
