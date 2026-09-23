---
{"id": "KB-0114", "title": "Retries und Wiederholungsstürme", "domain": "05", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0113", "concepts": ["Idempotenz"], "needed_for": "both"}], "related": ["KB-0115", "KB-0562", "KB-0720"], "applies": ["KB-0115", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Exponential Backoff mit Jitter lokal implementieren und einen Retry-Sturm ohne Jitter reproduzieren.", "rationale": "Kein verteiltes System nötig, um das Muster zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Retry-Budget, Backoff-Parameter und Fehlerklassifikation (temporär vs. permanent) für einen Dienstaufruf entwerfen.", "rationale": "Unkontrollierte Retries können einen bereits überlasteten Dienst weiter destabilisieren."}, "STAFF-TARGET": {"active": true, "scope": "Eine Lastspitze nach einem kurzen Ausfall auf synchronisierte Retries ohne Jitter zurückführen.", "rationale": "Das ist ein klassisches, wiederkehrendes Incident-Muster."}, "CHIEF-TARGET": {"active": true, "scope": "Retry-Budgets und Jitter-Pflicht als Standard für alle Client-Bibliotheken/Service-Aufrufe festlegen.", "rationale": "Unkoordinierte Retry-Policies über viele Services erhöhen das Risiko kaskadierender Ausfälle."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Retry-Budgets mit adaptivem Circuit Breaker und serverseitige Retry-Storm-Erkennung sind Vertiefung.", "rationale": "Kern ist Backoff mit Jitter und die Unterscheidung temporär/permanent."}}, "lab_validation": [{"lab_id": "KB-0114-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für synchronisierte versus gejitterte Retries", "evidence": "Ohne Jitter konzentrieren sich alle simulierten Client-Retries im selben Zeitfenster; mit Jitter streuen sie sich messbar.", "limitations": "Kein reales Netzwerk, keine echte Serverlast, keine Produktion."}]}
---
# Retries und Wiederholungsstürme

> **Ziel:** Retries machen Aufrufe robuster gegen temporäre Fehler, können aber bei falscher Implementierung einen bereits gestressten Dienst durch einen synchronisierten Wiederholungssturm zusätzlich überlasten. Exponential Backoff mit Jitter und ein begrenztes Retry-Budget verhindern das.

## Zweck, Mental Model und Dependencies

Ein naiver Retry („bei Fehler sofort erneut versuchen“) verstärkt Last genau dann, wenn der Zieldienst bereits überlastet ist — und wenn viele Clients gleichzeitig denselben Fehler erleben, retryen sie synchron und erzeugen eine Lastspitze im gleichen Moment. Exponential Backoff verlängert die Wartezeit zwischen Versuchen exponentiell; Jitter (zufällige Streuung) verhindert, dass viele Clients trotz Backoff im selben Moment erneut anfragen. Retries setzen Idempotenz ([KB-0113](13-idempotenz-als-systemgarantie.md)) voraus, sonst erzeugen sie Duplikate statt Robustheit. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0113](13-idempotenz-als-systemgarantie.md).

~~~text
attempt1 fails -> wait(base * 2^0 + jitter) -> attempt2 fails -> wait(base * 2^1 + jitter) -> attempt3
without jitter: 1000 clients all wait exactly base*2^n -> synchronized retry spike
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Fehlerklassifikation | temporär (Timeout, 503) vs. permanent (400, 404)? | Retry auf permanenten Fehler verschwendet nur Last |
| Backoff | exponentiell mit Obergrenze? | linearer/kein Backoff erhöht Last bei anhaltendem Problem |
| Jitter | zufällige Streuung der Wartezeit? | ohne Jitter retryen viele Clients synchron |
| Retry-Budget | maximale Anzahl/Gesamtdauer begrenzt? | unbegrenzte Retries verzögern Fehlererkennung und binden Ressourcen |

Implementierung: Fehler explizit klassifizieren — nur temporäre Fehler (Timeouts, 5xx, Verbindungsfehler) retryen, permanente Fehler (4xx außer 429) sofort durchreichen. Backoff exponentiell mit Obergrenze und vollem Jitter (zufälliger Wert zwischen 0 und dem berechneten Maximum) implementieren. Retry-Budget pro Aufrufkette begrenzen (Anzahl Versuche und/oder Gesamtzeit), damit ein fehlerhafter Downstream-Dienst nicht durch endlose Retries verdeckt bleibt.

## Scalability, Reliability, Security und Observability

Retries ohne Jitter sind eine bekannte Ursache für „Thundering Herd“-Effekte nach kurzen Ausfällen: der Dienst erholt sich gerade, wird aber sofort durch die synchronisierte Retry-Welle erneut überlastet. Reliability-Grenze: Retries erhöhen die effektive Last auf einen bereits gestressten Dienst — ohne Budget-Begrenzung können sie einen kurzen, lokalen Fehler in einen kaskadierenden Ausfall verwandeln.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Lastspitze kurz nach einem kurzen Ausfall | synchronisierte Retries ohne Jitter | zeitliche Verteilung der Retry-Anfragen analysieren |
| Fehlerquote steigt trotz Retry-Logik | Retry auf permanenten statt temporären Fehler | Fehlercode-Verteilung der retryten Anfragen prüfen |
| Antwortzeit einer Kette explodiert bei Downstream-Fehler | fehlendes Retry-Budget, Retries kaskadieren über mehrere Ebenen | Gesamtzahl Versuche über die gesamte Aufrufkette zählen |
| doppelte Effekte trotz Retry-Logik | Retry ohne Idempotenzschlüssel | Idempotenzschlüssel-Nutzung im Retry-Pfad prüfen |

Security: aggressive, unbegrenzte Retries können unbeabsichtigt wie ein Denial-of-Service gegen den eigenen oder einen fremden Dienst wirken; Retry-Budgets sind auch eine Schutzmaßnahme für Drittanbieter-APIs. Observability korreliert Versuchsanzahl pro logischer Anfrage, Fehlerklasse pro Versuch und zeitliche Verteilung der Retries.

## Trade-offs und Entscheidungen

**Staff** prüft bei Lastspitzen nach kurzen Ausfällen zuerst die zeitliche Verteilung der Retries auf synchronisiertes Verhalten. **Principal** definiert Standard-Backoff-Parameter (Basis, Obergrenze, Jitter-Typ) und verpflichtende Fehlerklassifikation für alle Client-Bibliotheken. **Chief** verlangt Retry-Budgets als Pflichtanforderung, um kaskadierende Ausfälle über Service-Ketten zu begrenzen.

Anti-Patterns: sofortiger Retry ohne jede Wartezeit; Retry auf alle Fehlercodes ohne Klassifikation; Backoff ohne Jitter; unbegrenzte Retries ohne Budget über eine mehrstufige Aufrufkette hinweg, was die tatsächliche Gesamtlatenz und Last vervielfacht.

## Production Checklist

- [ ] Fehlerklassifikation (temporär vs. permanent) implementiert, nur temporäre Fehler werden retryt.
- [ ] Exponential Backoff mit Obergrenze und vollem Jitter implementiert.
- [ ] Retry-Budget (Anzahl/Gesamtzeit) pro logischer Anfrage begrenzt.
- [ ] Retries nutzen denselben Idempotenzschlüssel wie der Originalversuch.

## Interviewfragen

### 1. Warum reicht Backoff allein nicht, um einen Retry-Sturm zu verhindern?

**Antwort:** Viele Clients, die zur gleichen Zeit denselben Fehler erleben, würden ohne Jitter alle exakt zur gleichen berechneten Wartezeit erneut anfragen und so eine synchronisierte Lastspitze erzeugen.

### 2. Was ist der Unterschied zwischen temporären und permanenten Fehlern für Retry-Zwecke?

**Antwort:** Temporäre Fehler (Timeout, 503, Verbindungsabbruch) können bei erneutem Versuch erfolgreich sein; permanente Fehler (400, 404) ändern sich durch Wiederholung nicht und verschwenden nur Last und Zeit.

### 3. Warum braucht Retry ein Budget?

**Antwort:** Ohne Begrenzung von Versuchsanzahl oder Gesamtzeit können Retries über mehrere Ebenen einer Aufrufkette kaskadieren und die tatsächliche Last und Latenz massiv über den ursprünglichen Fehler hinaus vervielfachen.

### 4. Was ist „full jitter“ und warum ist er effektiver als „equal jitter“?

**Antwort:** Full Jitter wählt die Wartezeit zufällig zwischen 0 und dem berechneten Maximum, was die Retry-Zeitpunkte breiter streut als ein fixer Anteil plus kleinerer Zufallszuschlag (equal jitter).

### 5. Warum setzt Retry Idempotenz voraus?

**Antwort:** Ohne Idempotenzschutz erzeugt jeder wiederholte Versuch einen zusätzlichen Effekt (z. B. doppelte Buchung), statt sicher denselben Zustand zu erreichen wie der ursprüngliche Versuch.

### 6. Widersprüchliche Anforderung: Produkt will maximale Zuverlässigkeit (immer wieder versuchen) UND schnelle Fehlerrückmeldung an den Nutzer — wie gehst du vor?

**Antwort:** Ich würde ein begrenztes Retry-Budget mit kurzer Gesamtzeit für den nutzerseitigen Aufruf definieren (schnelle Rückmeldung), während ein separater, asynchroner Hintergrundprozess mit größerem Budget die eigentliche Zuverlässigkeit sicherstellt, ohne den Nutzer warten zu lassen.

## Praktische Labs

~~~python
import random

def backoff_no_jitter(attempt, base=1):
    return base * (2 ** attempt)

def backoff_full_jitter(attempt, base=1):
    return random.uniform(0, base * (2 ** attempt))

no_jitter_times = [backoff_no_jitter(2) for _ in range(5)]
jittered_times = [backoff_full_jitter(2) for _ in range(5)]
assert len(set(no_jitter_times)) == 1  # all identical -> synchronized retry
assert len(set(jittered_times)) > 1    # spread out -> no synchronized spike
print("Without jitter, retries synchronize; with full jitter, they spread out.")
~~~

## Dependencies, Cross-References und Quellen

1. AWS Architecture Blog: [Exponential Backoff And Jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/), abgerufen 2026-09-17.

Produktspezifische Retry-Bibliotheksdefaults vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Adaptive Retry-Budgets mit Circuit-Breaker-Integration | Established in vielen Service-Mesh-Implementierungen | Zusammenspiel von Retry-Budget und Circuit-Breaker-Schwelle testen. |
| Serverseitige Retry-Storm-Erkennung und adaptives Backpressure-Signaling | Adopting | Kompatibilität mit clientseitigem Backoff vor Einsatz prüfen. |

Ein Team akzeptiert eine Retry-Implementierung erst, wenn Fehlerklassifikation, Backoff-mit-Jitter-Verhalten und Budget-Begrenzung unter simulierter Lastspitze getestet sind.
