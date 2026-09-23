---
{"id": "KB-0118", "title": "Verteilte Cache-Muster", "domain": "05", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0102", "concepts": ["Konsistenzmodelle"], "needed_for": "both"}], "related": ["KB-0117", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Cache-Aside mit Invalidierung lokal implementieren und einen Cache-Stampede-Fall reproduzieren.", "rationale": "Kein echter Cache-Cluster nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Cache-Strategie (Aside/Write-Through), Invalidierung und Stampede-Schutz für einen konkreten Lesepfad entwerfen.", "rationale": "Falsche Invalidierungsstrategie erzeugt veraltete Daten oder Cache-Ausfälle mit Lastspitzen."}, "STAFF-TARGET": {"active": true, "scope": "Einen Cache-Stampede-Vorfall nach Ablauf eines populären Schlüssels diagnostizieren.", "rationale": "Das ist ein bekanntes, wiederkehrendes Incident-Muster bei Cache-Ausfällen."}, "CHIEF-TARGET": {"active": true, "scope": "Cache-Konsistenzanforderungen pro Datenklasse als Standard festlegen und Stampede-Schutz als Pflicht für populäre Schlüssel verlangen.", "rationale": "Cache-Fehlverhalten kann Backend-Systeme durch Lastspitzen destabilisieren."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Probabilistic Early Expiration, Cache-Warming und mehrstufige Cache-Hierarchien sind Vertiefung.", "rationale": "Kern ist das Zusammenspiel von Invalidierung, Konsistenz und Stampede-Schutz."}}, "lab_validation": [{"lab_id": "KB-0118-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Cache-Stampede bei gleichzeitigem Ablauf", "evidence": "Ohne Schutzmechanismus lösen 100 gleichzeitige Anfragen nach Cache-Miss 100 Backend-Aufrufe aus; mit Lock-basiertem Schutz nur einen.", "limitations": "Kein echter Cache-Cluster, kein echtes Backend, keine Produktion."}]}
---
# Verteilte Cache-Muster

> **Ziel:** Ein Cache beschleunigt Lesevorgänge, führt aber eine zweite, potenziell veraltete Kopie der Daten ein. Cache-Aside, Write-Through und Invalidierungsstrategie bestimmen, wie stark diese Kopie vom Backend abweichen kann — und ein fehlender Schutz gegen gleichzeitigen Cache-Ablauf (Stampede) kann das Backend mit einer plötzlichen Lastspitze überfordern.

## Zweck, Mental Model und Dependencies

Cache-Aside (Lazy Loading): die Anwendung prüft zuerst den Cache, lädt bei Miss aus dem Backend und schreibt das Ergebnis in den Cache — einfach, aber jeder Cache-Miss trifft direkt das Backend. Write-Through: jeder Schreibvorgang aktualisiert Cache und Backend gemeinsam — hält den Cache aktueller, erhöht aber Schreiblatenz. Ein Cache-Stampede entsteht, wenn ein populärer Schlüssel gleichzeitig für viele parallele Anfragen abläuft und alle gleichzeitig das Backend treffen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0102](02-konsistenzmodelle-verteilter-systeme.md).

~~~text
cache-aside: read -> cache miss -> read backend -> write cache -> return
                          ^ 100 concurrent misses on same key -> 100 backend hits (stampede)
with lock:   read -> cache miss -> acquire per-key lock -> only first caller hits backend, others wait/reuse result
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Cache-Strategie | Aside vs. Write-Through, je nach Lese-/Schreibverhältnis? | falsche Wahl erzeugt unnötige Latenz oder Backend-Last |
| Invalidierung | Ablaufzeit, aktive Invalidierung bei Änderung? | TTL zu lang: veraltete Daten; zu kurz: hohe Backend-Last |
| Stampede-Schutz | Lock, probabilistisches Early-Expiry, Request-Coalescing? | fehlender Schutz erzeugt Lastspitzen bei populären Schlüsseln |
| Cache-Ausfall | Verhalten bei komplettem Cache-Verlust? | plötzlicher Totalausfall trifft Backend ungebremst |

Implementierung: Cache-Aside für lesehäufige, änderungsseltene Daten; Write-Through, wenn Aktualität wichtiger als Schreiblatenz ist. Stampede-Schutz über Per-Key-Locking (nur ein Aufrufer lädt bei Miss, andere warten oder erhalten kurzzeitig den alten Wert) oder probabilistisches Early-Expiry (Werte laufen mit zufälligem Vorlauf ab, um synchronen Ablauf zu vermeiden). Bei komplettem Cache-Neustart/-Ausfall: Cache-Warming oder Rate-Begrenzung auf das Backend einplanen, statt den vollen Traffic ungebremst durchzulassen.

## Scalability, Reliability, Security und Observability

Ein Cache verschiebt Last vom Backend, kann aber selbst zum Single Point of Failure werden, wenn das Backend nicht für den vollen ungecachten Traffic dimensioniert ist. Reliability-Grenze: ein Cache-Stampede kann ein Backend, das für gecachten Traffic ausgelegt ist, innerhalb von Sekunden überlasten — das ist kein exotischer Randfall, sondern ein bekanntes Muster bei populären Schlüsseln mit synchronem Ablauf.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Backend-Lastspitze exakt bei TTL-Ablauf eines populären Schlüssels | Cache-Stampede ohne Schutz | Anzahl gleichzeitiger Backend-Aufrufe für denselben Schlüssel messen |
| Nutzer sieht veraltete Daten nach Änderung | fehlende aktive Invalidierung, nur TTL-basiert | Zeit zwischen Änderung und Cache-Aktualisierung messen |
| Backend überlastet nach Cache-Neustart | fehlendes Cache-Warming/Rate-Limiting beim Kaltstart | Traffic-Verlauf direkt nach Cache-Neustart prüfen |
| inkonsistente Werte zwischen Cache-Knoten | fehlende oder fehlerhafte Invalidierungs-Propagation im Cache-Cluster | Invalidierungs-Nachrichten über alle Cache-Knoten verfolgen |

Security: gecachte Daten können sensible Informationen über TTL-Fenster hinweg vorhalten, auch nachdem Zugriffsrechte im Backend entzogen wurden — Berechtigungsänderungen brauchen aktive Invalidierung statt reinem TTL-Verlass. Observability korreliert Cache-Hit-Rate, Backend-Last korreliert mit Cache-Miss-Rate und Stampede-Indikatoren (gleichzeitige Backend-Aufrufe pro Schlüssel).

## Trade-offs und Entscheidungen

**Staff** prüft bei Backend-Lastspitzen zuerst, ob sie mit Cache-TTL-Ablauf populärer Schlüssel korrelieren. **Principal** definiert Standard-TTL-Strategie und verpflichtenden Stampede-Schutz für Schlüssel über einer definierten Popularitätsschwelle. **Chief** legt Konsistenzanforderungen pro Datenklasse fest (welche Daten dürfen TTL-basiert veraltet sein, welche brauchen aktive Invalidierung).

Anti-Patterns: TTL ohne Bezug zu tatsächlicher Änderungshäufigkeit der Daten wählen; keinen Stampede-Schutz für populäre Schlüssel; Berechtigungsentzug ausschließlich über TTL-Ablauf statt aktiver Invalidierung behandeln; Backend nicht für den ungecachten Vollausfall-Traffic dimensionieren.

## Production Checklist

- [ ] Cache-Strategie (Aside/Write-Through) anhand Lese-/Schreibverhältnis begründet gewählt.
- [ ] Stampede-Schutz für populäre Schlüssel implementiert und getestet.
- [ ] Aktive Invalidierung für berechtigungsrelevante Daten statt reinem TTL-Verlass.
- [ ] Backend-Kapazität für Cache-Kaltstart/-Ausfall-Szenario geplant.

## Interviewfragen

### 1. Was ist ein Cache-Stampede und wie entsteht er?

**Antwort:** Wenn ein populärer Cache-Schlüssel abläuft und viele gleichzeitige Anfragen alle einen Cache-Miss erleben, treffen sie ohne Schutz gleichzeitig das Backend und erzeugen eine plötzliche Lastspitze.

### 2. Wie schützt du gegen Cache-Stampedes?

**Antwort:** Über Per-Key-Locking, sodass nur ein Aufrufer das Backend tatsächlich lädt, während andere warten oder kurzzeitig den alten Wert erhalten, oder über probabilistisches Early-Expiry, das synchronen Ablauf vermeidet.

### 3. Wann ist Write-Through gegenüber Cache-Aside vorzuziehen?

**Antwort:** Wenn Aktualität der gecachten Daten wichtiger ist als minimale Schreiblatenz, da Write-Through den Cache bei jedem Schreibvorgang sofort mitaktualisiert.

### 4. Warum reicht TTL allein für berechtigungsrelevante Daten nicht?

**Antwort:** Ein entzogener Zugriff könnte bis zum TTL-Ablauf weiterhin über den Cache gültig erscheinen; aktive Invalidierung bei Berechtigungsänderung ist notwendig.

### 5. Was passiert, wenn ein Cache-Cluster komplett neu startet?

**Antwort:** Ohne Cache-Warming oder Rate-Begrenzung trifft der volle Traffic ungebremst das Backend, das meist nicht für diese Last dimensioniert ist.

### 6. Widersprüchliche Anforderung: Produkt will maximale Cache-Trefferquote UND garantiert aktuelle Daten bei jeder Änderung — wie gehst du vor?

**Antwort:** Ich würde für änderungsrelevante Felder aktive Invalidierung statt reinem TTL einsetzen, während für stabile, selten geänderte Felder ein längerer TTL die Trefferquote maximiert — eine einheitliche Strategie für alle Daten würde einen der beiden Zielkonflikte ignorieren.

## Praktische Labs

~~~python
backend_calls = 0
lock_held = False

def get_with_lock(cache_miss):
    global backend_calls, lock_held
    if cache_miss:
        if lock_held:
            return "waiting/stale-value-served"
        lock_held = True
        backend_calls += 1
        lock_held = False
        return "fresh-value"
    return "cache-hit"

results = [get_with_lock(cache_miss=True) for _ in range(100)]
assert backend_calls == 1
print(f"100 concurrent misses on the same key produced only {backend_calls} backend call with locking.")
~~~

## Dependencies, Cross-References und Quellen

1. Vattani, Chierichetti, Lowenstein: [Optimal Probabilistic Cache Stampede Prevention](https://vldb.org/pvldb/vol8/p886-vattani.pdf), VLDB 2015, abgerufen 2026-09-17.

Produktspezifische Cache-Cluster-Implementierungsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Eingebauter Stampede-Schutz in verwalteten Cache-Diensten | Adopting je Anbieter | Tatsächliches Locking-/Coalescing-Verhalten vor Vertrauen prüfen. |
| Change-Data-Capture-basierte aktive Invalidierung statt TTL | Adopting | Latenz und Zuverlässigkeit der Invalidierungs-Propagation testen. |

Ein Team akzeptiert eine Cache-Strategie erst, wenn Stampede-Schutz für populäre Schlüssel, Invalidierungsverhalten für berechtigungsrelevante Daten und Backend-Kapazität für Kaltstart-Szenarien nachgewiesen sind.
