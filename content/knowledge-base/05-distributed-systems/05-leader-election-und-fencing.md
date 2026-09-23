---
{"id": "KB-0105", "title": "Leader Election und Fencing", "domain": "05", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0104", "concepts": ["Konsens", "Quorum", "Term"], "needed_for": "both"}], "related": ["KB-0103", "KB-0106", "KB-0562", "KB-0720"], "applies": ["KB-0106", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lease-basierte Leaderwahl und einen Fencing-Token-Verstoß lokal simulieren.", "rationale": "Kein Cluster nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein System mit exklusivem Schreibzugriff (Singleton-Worker, Lock) Lease-Dauer, Renewal und Fencing als Vertrag entwerfen.", "rationale": "Leader Election ohne Fencing schützt nicht vor Split Brain."}, "STAFF-TARGET": {"active": true, "scope": "Einen Fall diagnostizieren, in dem ein alter Leader nach GC-Pause oder Netzwerkverzögerung noch schreibt.", "rationale": "Das ist die klassische, gefährlichste Fehlerklasse bei Leader-Election-Systemen."}, "CHIEF-TARGET": {"active": true, "scope": "Fencing als Pflichtanforderung für jedes System mit exklusivem Ressourcenzugriff über Leader Election festlegen.", "rationale": "Fehlendes Fencing führt zu Datenkorruption, die erst spät sichtbar wird."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Lease-Implementierungen über Zookeeper/etcd/Consul und Clock-Skew-Grenzen sind Vertiefung.", "rationale": "Kern ist das Fencing-Prinzip, nicht jede konkrete Lease-API."}}, "lab_validation": [{"lab_id": "KB-0105-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Lease und Fencing-Token", "evidence": "Ein Schreibvorgang mit veraltetem Fencing-Token wird von der Ressource abgelehnt, obwohl der Absender sich noch für den Leader hält.", "limitations": "Kein echtes Lease-System, kein GC-Pause-Szenario, keine Produktion."}]}
---
# Leader Election und Fencing

> **Ziel:** Leader Election bestimmt, welcher Knoten exklusiv eine Aufgabe ausführt (z. B. Schreibzugriff, Job-Scheduling). Eine Wahl allein garantiert aber nicht, dass der alte Leader wirklich aufhört zu handeln — GC-Pausen, Netzwerkverzögerungen oder Prozess-Hänger können einen „abgewählten“ Leader weiter aktiv lassen. Fencing verhindert, dass ein solcher veralteter Leader Schaden anrichtet.

## Zweck, Mental Model und Dependencies

Eine Leaderwahl mit Lease bedeutet: ein Knoten hält für begrenzte Zeit exklusive Berechtigung und muss sie aktiv erneuern (Renewal). Läuft die Lease ab, kann ein anderer Knoten Leader werden. Das Problem: der alte Knoten weiß eventuell nicht sofort, dass seine Lease abgelaufen ist (z. B. wegen einer Pause), und versucht trotzdem weiter zu schreiben. Fencing löst das über einen monoton steigenden Token (Epoche), den die geschützte Ressource selbst prüft — nicht der Leader-Kandidat. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0104](04-konsens-und-quoren.md).

~~~text
LeaderA gets lease, token=5 -> [long GC pause] -> lease expires -> LeaderB elected, token=6
LeaderA wakes up, writes with token=5 -> storage rejects: token=5 < last_seen_token=6
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko bei Fehlannahme |
|---|---|---|
| Lease | Dauer, Renewal-Intervall, Clock-Skew-Toleranz? | zu kurze Lease erzeugt unnötige Wahlen, zu lange verzögert Failover |
| Fencing-Token | monoton steigend, von Ressource geprüft? | Prüfung nur beim Leader selbst schützt nicht |
| „Ich glaube, ich bin Leader“ | ausreichend für exklusive Aktion? | reicht nie allein; nur die Ressource kann es verbindlich entscheiden |
| Clock-Skew | Annahme synchroner Uhren zwischen Knoten? | Lease-basierte Systeme ohne Pufferzeit sind anfällig |

Implementierung: Jede Ressource, die exklusiven Zugriff schützt (Datenbank, Dateisystem, Message-Queue), muss den Fencing-Token selbst prüfen und niedrigere Tokens ablehnen — die Prüfung darf nicht dem Leader-Kandidaten überlassen werden, da genau dessen Urteilsvermögen durch Pausen/Verzögerung unzuverlässig sein kann. Lease-Renewal-Intervall deutlich kürzer als Lease-Dauer wählen, mit Puffer für Netzwerklatenz und Uhrenabweichung.

## Scalability, Reliability, Security und Observability

Kürzere Leases verbessern Failover-Geschwindigkeit, erhöhen aber die Häufigkeit von Wahlen unter Last/Jitter. Reliability-Grenze: ohne Fencing ist jedes Lease-basierte Leader-System anfällig für „Zombie-Leader“ nach Pausen (GC, Swap, Hypervisor-Stall) — das ist kein exotischer Randfall, sondern ein bekanntes, wiederkehrendes Muster in Produktionssystemen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| zwei Knoten schreiben gleichzeitig auf dieselbe Ressource | fehlendes oder falsch platziertes Fencing | prüfen, ob Ressource Tokens tatsächlich validiert |
| Failover dauert lange | Lease-Dauer zu lang für SLO | Lease-Dauer gegen Failover-Zeitziel abgleichen |
| häufige unnötige Neuwahlen | Renewal-Intervall zu knapp an Lease-Dauer | Puffer für Latenz/Jitter erhöhen |
| alter Leader schreibt nach langer Pause noch | kein Fencing-Token-Check an der Ressource | Token-Vergleichslogik am Speicherpfad verifizieren |

Security: Fencing schützt Datenintegrität, nicht Vertraulichkeit; die Lease-Vergabe selbst muss authentifiziert sein, sonst kann ein unautorisierter Akteur eine Lease erschleichen. Observability korreliert aktuellen Leader, Token-Historie, Lease-Renewal-Erfolge/-Fehler und abgelehnte Schreibversuche mit veraltetem Token.

## Trade-offs und Entscheidungen

**Staff** testet explizit das Pausen-Szenario (simulierte GC-Pause/Netzwerkverzögerung) und prüft, ob die Ressource veraltete Tokens tatsächlich ablehnt. **Principal** definiert Fencing als verpflichtenden Bestandteil jeder Leader-Election-Implementierung, nicht als optionale Härtung. **Chief** verlangt für jedes System mit exklusivem Ressourcenzugriff über Leader Election einen dokumentierten Fencing-Nachweis vor Produktivfreigabe.

Anti-Patterns: „Ich bin noch Leader laut meiner eigenen Uhr“ als ausreichende Berechtigung behandeln; Fencing-Check nur im Anwendungscode statt an der eigentlichen Ressource; Lease-Dauer ohne Berücksichtigung realistischer Pausen (GC, Swap) festlegen.

## Production Checklist

- [ ] Fencing-Token-Prüfung liegt an der geschützten Ressource selbst, nicht nur beim Leader-Kandidaten.
- [ ] Lease-Dauer und Renewal-Intervall gegen realistische Pausenszenarien und Failover-SLO geprüft.
- [ ] Pausen-/GC-Simulation als expliziter Testfall vor Produktivfreigabe durchgeführt.
- [ ] Monitoring für abgelehnte Schreibversuche mit veraltetem Token vorhanden.

## Interviewfragen

### 1. Warum reicht Leader Election ohne Fencing nicht aus?

**Antwort:** Weil ein als „abgewählt“ geltender Knoten durch eine Pause verzögert weiterhandeln kann, bevor er seinen Statusverlust bemerkt; ohne Prüfung an der Ressource selbst kann er trotzdem schreiben.

### 2. Wo muss der Fencing-Token geprüft werden?

**Antwort:** An der geschützten Ressource selbst (Storage, Queue), nicht im Entscheidungscode des Leader-Kandidaten, da dessen Urteilsvermögen genau in der Fehlersituation unzuverlässig ist.

### 3. Was ist ein typisches Szenario, das Fencing nötig macht?

**Antwort:** Eine lange GC-Pause oder ein Netzwerk-Hänger beim aktuellen Leader, während dessen Lease abläuft und ein neuer Leader gewählt wird; der alte Prozess wacht auf und versucht weiterzuschreiben.

### 4. Wie wählst du eine Lease-Dauer?

**Antwort:** Kurz genug für das gewünschte Failover-Zeitziel, aber lang genug mit Puffer, um normale Netzwerklatenz und Jitter nicht als Ausfall misszudeuten und unnötige Wahlen zu vermeiden.

### 5. Warum ist „ich glaube, ich bin noch Leader“ keine verlässliche Aussage?

**Antwort:** Weil die Einschätzung auf der eigenen, möglicherweise veralteten Sicht des Knotens beruht; nur eine externe, monoton geprüfte Quelle (Token an der Ressource) ist verbindlich.

### 6. Widersprüchliche Anforderung: Produkt will sofortigen Failover (0 ms Lücke) UND absolute Schreibsicherheit — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein Lease-Ablauf immer eine gewisse Erkennungszeit braucht, bevor sicher ein neuer Leader gewählt werden kann; „0 ms Lücke“ ist nicht mit sicherem Fencing vereinbar, daher würde ich ein realistisches Failover-Zeitfenster mit dem Produkt abstimmen und Fencing nicht zugunsten von Geschwindigkeit weglassen.

## Praktische Labs

~~~python
last_seen_token = 5

def write(resource_token, value):
    global last_seen_token
    if resource_token < last_seen_token:
        raise PermissionError(f"stale token {resource_token} < {last_seen_token}")
    last_seen_token = resource_token
    return value

write(6, "new-leader-write")  # new leader, higher token, accepted
try:
    write(5, "zombie-leader-write")  # old leader wakes up after pause
    raise AssertionError("expected rejection")
except PermissionError as e:
    print("Zombie leader correctly rejected by resource-side fencing:", e)
~~~

## Dependencies, Cross-References und Quellen

1. Kleppmann: [How to do distributed locking](https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html), 2016, abgerufen 2026-09-17.
2. Ongaro, Ousterhout: [In Search of an Understandable Consensus Algorithm (Raft)](https://raft.github.io/raft.pdf), USENIX ATC 2014, abgerufen 2026-09-17.

Produktspezifische Lease-/Lock-API-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Verwaltete Lease-/Lock-Dienste (etcd/Zookeeper/Consul als Managed Service) | Established | Fencing-Token-Unterstützung und Clock-Skew-Annahmen der konkreten API prüfen. |
| Anwendungsseitige Idempotenz als zusätzliche Absicherung neben Fencing | Adopting | Als Ergänzung, nicht als Ersatz für ressourcenseitiges Fencing verstehen. |

Ein Team akzeptiert eine Leader-Election-Implementierung erst, wenn ein simuliertes Pausenszenario zeigt, dass die geschützte Ressource veraltete Tokens tatsächlich ablehnt.
