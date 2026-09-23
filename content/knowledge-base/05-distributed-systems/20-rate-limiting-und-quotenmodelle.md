---
{"id": "KB-0120", "title": "Rate Limiting und Quotenmodelle", "domain": "05", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0117", "concepts": ["Backpressure", "Admission Control"], "needed_for": "both"}], "related": ["KB-0107", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Token Bucket und Sliding Window lokal implementieren und ihr Verhalten bei Burst-Last vergleichen.", "rationale": "Kein echter Rate-Limiter-Dienst nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Rate-Limiting-Algorithmus und Quotengranularität (global/pro Mandant) für ein konkretes API begründet wählen.", "rationale": "Falsches Modell erzeugt entweder unfaire Mandantenverteilung oder unnötige Ablehnungen bei legitimen Bursts."}, "STAFF-TARGET": {"active": true, "scope": "Ungleiche Mandantenfairness auf ein globales statt mandantenbasiertes Quotenmodell zurückführen.", "rationale": "Ein einzelner aggressiver Mandant kann bei globalem Limit alle anderen verdrängen."}, "CHIEF-TARGET": {"active": true, "scope": "Rate-Limiting als Pflichtschutz für alle öffentlich erreichbaren APIs mit Mandantenfairness-Anforderung festlegen.", "rationale": "Fehlendes Rate Limiting gefährdet Verfügbarkeit für alle Nutzer durch einzelne Übernutzer."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Verteiltes, konsistentes Rate Limiting über mehrere Knoten (koordinierte Zähler) ist Vertiefung.", "rationale": "Kern ist das Verständnis der Algorithmen und Fairness-Trade-offs."}}, "lab_validation": [{"lab_id": "KB-0120-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Token Bucket versus festes Fenster", "evidence": "Ein festes Fenster lässt an der Fenstergrenze einen doppelt so hohen kurzzeitigen Burst durch wie beabsichtigt; Token Bucket begrenzt Bursts konsistent.", "limitations": "Kein reales verteiltes Rate-Limiting, keine Produktion."}]}
---
# Rate Limiting und Quotenmodelle

> **Ziel:** Rate Limiting begrenzt, wie viele Anfragen ein Akteur in einem Zeitraum stellen darf, um Fairness zwischen Mandanten und Schutz vor Überlast sicherzustellen. Token Bucket, Sliding Window und globale Quoten unterscheiden sich in Burst-Toleranz, Genauigkeit und Konsistenzkosten bei koordinierter, verteilter Durchsetzung.

## Zweck, Mental Model und Dependencies

Ein Token Bucket füllt sich mit konstanter Rate mit Tokens (bis zu einer Kapazitätsgrenze); jede Anfrage verbraucht einen Token, und ist der Bucket leer, wird die Anfrage abgelehnt oder verzögert — das erlaubt kontrollierte Bursts bis zur Bucket-Kapazität. Ein Sliding Window zählt Anfragen über ein gleitendes Zeitfenster und vermeidet die Ungenauigkeit fester Fenster (bei denen ein Burst genau an der Fenstergrenze doppelt so viele Anfragen durchlassen kann wie beabsichtigt). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0117](17-backpressure-und-ueberlast.md).

~~~text
token bucket: capacity=10, refill=2/s -> burst up to 10 allowed, then throttled to 2/s
fixed window:  limit=10/min -> 10 requests at 0:59 + 10 at 1:00 = 20 requests in 2 seconds (boundary flaw)
sliding window: counts requests in the trailing 60s at any point in time -> no boundary burst
~~~

## Core Concepts, Architektur und Implementierung

| Algorithmus | Burst-Verhalten | Genauigkeit | Implementierungsaufwand |
|---|---|---|---|
| Fixed Window | erlaubt Doppel-Burst an Fenstergrenze | niedrig | gering |
| Sliding Window | glättet Fenstergrenzeneffekt | hoch | moderat |
| Token Bucket | kontrollierter Burst bis Kapazität | hoch | moderat |

Implementierung: Quotengranularität explizit wählen — global (schützt Backend, aber ein Mandant kann alle anderen verdrängen) versus pro Mandant/API-Key (schützt Fairness, braucht mehr Zustand). In verteilten Systemen (mehrere Rate-Limiter-Instanzen) muss der Zähler entweder zentral koordiniert (z. B. über eine gemeinsame Zählquelle) oder mit akzeptierter Ungenauigkeit lokal pro Instanz geführt werden — echte globale Exaktheit kostet Koordinationslatenz.

## Scalability, Reliability, Security und Observability

Rate Limiting selbst darf nicht zum Engpass werden: der Zählmechanismus muss schneller sein als die geschützte Operation, sonst verlagert sich der Flaschenhals nur. Reliability-Grenze: ein rein globales Limit ohne Mandantengranularität lässt einen einzelnen aggressiven Mandanten das gesamte Kontingent für alle anderen verbrauchen (Noisy-Neighbor-Effekt, vergleichbar mit [KB-0107](07-sharding-und-mandantenplatzierung.md)).

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Bursts an Minutengrenze doppelt so hoch wie erwartet | Fixed-Window-Algorithmus statt Sliding Window/Token Bucket | Anfragen exakt um die Fenstergrenze zählen |
| ein Mandant blockiert effektiv alle anderen | globales statt mandantenbasiertes Limit | Anteil eines einzelnen Mandanten am Gesamtkontingent messen |
| verteilte Instanzen lassen insgesamt mehr Traffic durch als das Limit erlaubt | unkoordinierte lokale Zähler ohne Sync | Summe der tatsächlich durchgelassenen Anfragen über alle Instanzen prüfen |
| Rate-Limiter selbst wird zum Latenz-Flaschenhals | Zählmechanismus zu langsam/nicht lokal genug | Latenz des Zählschritts gegen Gesamtanfrage-Latenz vergleichen |

Security: Rate Limiting ist eine grundlegende Schutzmaßnahme gegen Missbrauch und einfache Denial-of-Service-Versuche; es muss vor teuren Backend-Operationen ansetzen, nicht erst danach. Observability korreliert Limit-Auslastung pro Mandant, Ablehnungsrate und Verteilung der Ablehnungen über Zeit/Mandanten.

## Trade-offs und Entscheidungen

**Staff** wählt den Algorithmus anhand des tatsächlichen Traffic-Musters (Burst-Toleranz nötig? Fairness zwischen Mandanten wichtig?) statt eines Standardwerts. **Principal** definiert Standard-Quotengranularität (mandantenbasiert als Default) und akzeptierte Ungenauigkeit bei verteilter Durchsetzung. **Chief** verlangt Rate Limiting als Pflichtschutz für alle öffentlich erreichbaren APIs mit expliziter Mandantenfairness-Anforderung.

Anti-Patterns: Fixed-Window-Limits ohne Bewusstsein für den Grenzeffekt einsetzen; rein globale Limits ohne Mandantengranularität bei Multi-Tenant-APIs; Rate-Limiting-Zustand zentral synchron über jede Anfrage koordinieren, wenn eine akzeptierte Ungenauigkeit ausgereicht hätte und dadurch unnötig Latenz kostet.

## Production Checklist

- [ ] Algorithmus (Token Bucket/Sliding Window) anhand tatsächlicher Traffic-Muster begründet gewählt.
- [ ] Quotengranularität (global vs. pro Mandant) an Fairness-Anforderung ausgerichtet.
- [ ] Verteiltes Zählverhalten über mehrere Instanzen getestet und akzeptierte Ungenauigkeit dokumentiert.
- [ ] Rate-Limiter selbst nicht zum Latenz-Flaschenhals gemessen.

## Interviewfragen

### 1. Was ist der Nachteil eines Fixed-Window-Rate-Limits?

**Antwort:** An der Fenstergrenze können bis zu doppelt so viele Anfragen wie beabsichtigt durchgelassen werden, weil das alte und neue Fenster jeweils die volle Kapazität erlauben.

### 2. Wie funktioniert Token Bucket?

**Antwort:** Ein Bucket füllt sich mit konstanter Rate bis zu einer Kapazitätsgrenze; jede Anfrage verbraucht einen Token, wodurch kontrollierte Bursts bis zur Bucket-Kapazität möglich sind, danach wird auf die Füllrate gedrosselt.

### 3. Warum ist mandantenbasierte Granularität oft wichtiger als ein globales Limit?

**Antwort:** Ein globales Limit lässt einen einzelnen aggressiven Mandanten das gesamte Kontingent für alle anderen verbrauchen; mandantenbasierte Limits garantieren Fairness zwischen Nutzern.

### 4. Warum ist exaktes verteiltes Rate Limiting teuer?

**Antwort:** Eine wirklich globale, exakte Zählung über mehrere Instanzen erfordert Koordination bei jeder Anfrage, was Latenz kostet; viele Systeme akzeptieren stattdessen eine gewisse Ungenauigkeit für bessere Performance.

### 5. Wo sollte Rate Limiting ansetzen?

**Antwort:** Möglichst früh, vor teuren Backend-Operationen, damit abgelehnte Anfragen nicht bereits kostspielige Ressourcen verbraucht haben.

### 6. Widersprüchliche Anforderung: Produkt will exakte globale Fairness über alle Regionen UND minimale Latenz pro Anfrage — wie gehst du vor?

**Antwort:** Ich würde eine akzeptierte Ungenauigkeit vorschlagen: lokale Limits pro Region mit periodischer, asynchroner Abstimmung des Gesamtkontingents, statt jede Anfrage synchron global zu koordinieren, und diesen Kompromiss explizit mit dem Produkt abstimmen.

## Praktische Labs

~~~python
def fixed_window_burst(requests_at_0_59, requests_at_1_00, limit):
    return requests_at_0_59 <= limit and requests_at_1_00 <= limit

# 10 requests just before minute boundary, 10 more just after: both individually within limit
allowed = fixed_window_burst(10, 10, limit=10)
total_in_2_seconds = 10 + 10
assert allowed and total_in_2_seconds == 2 * 10
print(f"Fixed window allowed {total_in_2_seconds} requests in ~2 seconds despite a 10/minute limit.")
~~~

## Dependencies, Cross-References und Quellen

1. Cloudflare Blog: [How we built rate limiting capable of scaling to millions of domains](https://blog.cloudflare.com/counting-things-a-lot-of-different-things/), abgerufen 2026-09-17.

Produktspezifische Rate-Limiter-Implementierungsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Verteilte, approximative Zählalgorithmen (z. B. sliding-window-log-Approximationen) | Established bei großen Anbietern | Genauigkeits-/Latenz-Trade-off gegen Anforderung prüfen. |
| Adaptive, verhaltensbasierte Ratenlimits statt statischer Quoten | Adopting | Erklärbarkeit und Falsch-Positiv-Rate vor Einsatz validieren. |

Ein Team akzeptiert eine Rate-Limiting-Implementierung erst, wenn Algorithmusverhalten bei Burst-Last, Mandantenfairness und verteiltes Zählverhalten über mehrere Instanzen getestet sind.
