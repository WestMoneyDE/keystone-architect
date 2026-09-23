---
{"id": "KB-0324", "title": "Semantischer Cache", "domain": "13", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0308", "concepts": ["Semantische Suche"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen semantischen Cache implementieren, der eine Anfrage mit einer bedeutungsähnlichen, aber mandantenfremden zwischengespeicherten Antwort fälschlich wiederverwendet, und dies durch Mandantenfilterung korrigieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine semantische Cache-Architektur gestalten, die Mandantenkontext und Quellenalter als explizite, vom reinen Ähnlichkeitswert unabhängige Gültigkeitsbedingungen behandelt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte oder veraltete Antwort aus einem semantischen Cache auf eine fehlende Mandanten- oder Aktualitätsprüfung statt auf ein allgemeines Cache-Problem zurückführen können.", "rationale": "Ein semantischer Cache, der nur Bedeutungsähnlichkeit prüft, kann eine für einen anderen Mandanten bestimmte oder inzwischen veraltete Antwort fälschlich wiederverwenden."}, "CHIEF-TARGET": {"active": true, "scope": "Semantisches Caching als Effizienzmaßnahme mit spezifischen Korrektheitsrisiken (Bedeutungsabweichung, Mandantenvermischung, Veraltung) positionieren, die zusätzliche Sicherungen gegenüber exaktem Caching erfordert.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Ähnlichkeitsschwellenwert-Kalibrierung ist Vertiefung.", "rationale": "Kern ist das Prinzip zusätzlicher Gültigkeitsbedingungen neben reiner Ähnlichkeit, nicht die konkrete Schwellenwert-Feinabstimmung."}}, "lab_validation": [{"lab_id": "KB-0324-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines semantischen Caches mit und ohne Mandanten- und Aktualitätsprüfung", "evidence": "Ein semantischer Cache, der nur nach Bedeutungsähnlichkeit sucht, liefert für eine Anfrage eines Mandanten fälschlich die zwischengespeicherte Antwort eines anderen Mandanten mit ähnlicher, aber nicht identischer Anfrage; eine zusätzliche Mandantenfilterung verhindert dies.", "limitations": "Kein echtes Cache-System, kein echtes Embedding-Modell, kein produktives System."}]}
---
# Semantischer Cache

> **Ziel:** Ein semantischer Cache erkennt bedeutungsähnliche Anfragen (aufbauend auf semantischer Suche, siehe [KB-0308](04-semantische-suche.md)) und liefert eine zuvor berechnete Antwort wieder, statt die Anfrage erneut vollständig zu verarbeiten. Der zentrale Punkt ist, dass Bedeutungsabweichungen (zwei Anfragen sind semantisch ähnlich, aber nicht identisch in ihrer tatsächlichen Bedeutung), Mandantenkontext (eine zwischengespeicherte Antwort für Mandant A darf nicht für Mandant B wiederverwendet werden) und Quellenalter (eine zwischengespeicherte Antwort kann durch inzwischen aktualisierte Quellen veraltet sein) als zusätzliche, vom reinen Ähnlichkeitswert unabhängige Gültigkeitsbedingungen geprüft werden müssen — dies unterscheidet sich fundamental von einem exakten Cache, der nur bei identischer Anfrage trifft.

## Zweck, Mental Model und Dependencies

Ein exakter Cache liefert eine zwischengespeicherte Antwort nur bei exakt identischer Anfrage zurück — dies ist sicher, aber ineffizient, da bereits geringfügige Formulierungsunterschiede (z. B. "Was kostet der Standard-Tarif?" versus "Wie viel kostet Standard?") einen Cache-Treffer verhindern, obwohl beide Anfragen dieselbe Antwort erwarten. Ein semantischer Cache adressiert dies, indem er Anfragen anhand semantischer Ähnlichkeit statt exakter Übereinstimmung vergleicht — dies erhöht die Trefferquote erheblich, birgt aber ein spezifisches Korrektheitsrisiko: Bedeutungsabweichung bedeutet, dass zwei Anfragen semantisch ähnlich erscheinen können, obwohl sie tatsächlich unterschiedliche Antworten erfordern (z. B. "Wie kündige ich meinen Vertrag?" versus "Wie kann ich meinen Vertrag pausieren?" — semantisch verwandt, aber mit unterschiedlicher korrekter Antwort). Mandantenkontext ist eine zusätzliche, vom semantischen Ähnlichkeitswert unabhängige Gültigkeitsbedingung: eine zwischengespeicherte Antwort, die für die spezifischen Daten oder Berechtigungen eines Mandanten berechnet wurde, darf nicht für einen anderen Mandanten mit einer semantisch ähnlichen Anfrage wiederverwendet werden, selbst wenn die Ähnlichkeit hoch ist. Quellenalter ist die dritte zusätzliche Bedingung: eine zwischengespeicherte Antwort basiert auf dem Stand der zugrunde liegenden Quellen zum Zeitpunkt der ursprünglichen Berechnung — wurden diese Quellen seitdem aktualisiert, ist die zwischengespeicherte Antwort möglicherweise veraltet, unabhängig davon, wie ähnlich die neue Anfrage der ursprünglichen ist.

~~~text
Exact cache: hit only on IDENTICAL query -> safe, but low hit rate (minor phrasing differences prevent hits)
Semantic cache: hit on SEMANTICALLY SIMILAR query -> higher hit rate, but specific correctness risk
CRITICAL RISKS beyond similarity score alone:
  Meaning drift: similar queries CAN require different answers ("cancel contract" vs "pause contract")
  Tenant context: cached answer for tenant A must NOT be reused for tenant B, regardless of similarity
  Source staleness: cached answer based on sources AT TIME of original computation
    -> sources updated since -> cached answer potentially stale, independent of query similarity
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Konservativer Ähnlichkeitsschwellenwert mit Bedeutungsprüfung | ist der Ähnlichkeitsschwellenwert für Cache-Treffer konservativ genug gewählt, um Bedeutungsabweichungen zu vermeiden, oder wird zusätzlich eine feinere Bedeutungsprüfung durchgeführt? | ein zu niedriger Schwellenwert kann semantisch ähnliche, aber inhaltlich unterschiedliche Anfragen fälschlich als Treffer behandeln |
| Mandantenfilterung unabhängig von Ähnlichkeit | wird die Mandantenzugehörigkeit als eigenständige, vom Ähnlichkeitswert unabhängige Bedingung geprüft? | ohne diese Filterung kann eine für einen Mandanten berechnete Antwort fälschlich für einen anderen Mandanten wiederverwendet werden |
| Explizite Gültigkeitsdauer basierend auf Quellenalter | ist eine Gültigkeitsdauer definiert, nach der ein Cache-Eintrag unabhängig von der Anfrageähnlichkeit als potenziell veraltet gilt? | ohne diese Gültigkeitsdauer kann eine Antwort auf Basis inzwischen veralteter Quellen unbegrenzt weiterverwendet werden |
| Explizite Invalidierung bei Quellenaktualisierung | wird ein Cache-Eintrag aktiv invalidiert, wenn die zugrunde liegende Quelle sich ändert, statt nur auf Ablauf der Gültigkeitsdauer zu warten? | eine rein zeitbasierte Invalidierung kann eine Änderung an der Quelle erst nach Ablauf der vollen Gültigkeitsdauer berücksichtigen |

Implementierung: Der Ähnlichkeitsschwellenwert für Cache-Treffer wird konservativ gewählt, ergänzt um eine zusätzliche Prüfung, die bekannte Muster von Bedeutungsabweichung (z. B. gegensätzliche Handlungsverben wie "kündigen" versus "pausieren") gezielt ausschließt. Jeder Cache-Eintrag wird mit dem Mandantenkontext versehen, unter dem er berechnet wurde, und eine Abfrage berücksichtigt ausschließlich Cache-Einträge desselben Mandanten, unabhängig von der semantischen Ähnlichkeit zu Einträgen anderer Mandanten. Jeder Cache-Eintrag erhält eine explizite Gültigkeitsdauer basierend auf der erwarteten Änderungsfrequenz der zugrunde liegenden Quellen, und wird zusätzlich aktiv invalidiert, wenn eine Änderung an der zugrunde liegenden Quelle erkannt wird, statt ausschließlich auf den Ablauf der Gültigkeitsdauer zu warten.

## Scalability, Reliability, Security und Observability

Semantisches Caching skaliert Effizienz proportional zur Sorgfalt der zusätzlichen Gültigkeitsbedingungen; die Reliability-Grenze liegt in einem Cache, der nur reine Ähnlichkeit prüft, ohne Mandanten- und Aktualitätsvalidierung, was mit wachsendem Cache-Volumen proportional mehr fehlerhafte oder veraltete Antworten ausliefern kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Antwort passt nicht zur tatsächlich gestellten Anfrage, obwohl eine semantisch ähnliche Anfrage im Cache existiert | eine Bedeutungsabweichung zwischen der ursprünglichen Cache-Anfrage und der neuen Anfrage wurde nicht erkannt | prüfen, ob die beiden Anfragen trotz semantischer Ähnlichkeit tatsächlich unterschiedliche korrekte Antworten erfordern |
| ein Nutzer erhält eine Antwort, die für einen anderen Mandanten berechnet wurde | fehlende Mandantenfilterung im semantischen Cache | prüfen, ob der zurückgegebene Cache-Eintrag ursprünglich für denselben Mandanten berechnet wurde |
| eine zurückgegebene Antwort basiert auf einer inzwischen veralteten Quelle | fehlende oder unzureichende Gültigkeitsdauer beziehungsweise Invalidierung bei Quellenänderung | prüfen, ob die zugrunde liegende Quelle seit der Cache-Berechnung aktualisiert wurde und ob dies eine Invalidierung ausgelöst hat |

Security: Mandantenfilterung im semantischen Cache ist eine kritische Sicherheitsmaßnahme — ohne sie kann ein semantischer Cache versehentlich zu einem Kanal für mandantenübergreifende Datenpreisgabe werden, ähnlich der Mandantenisolation bei Vektorspeichern (siehe [KB-0309](05-vektorspeicher-fuer-retrieval-pipelines.md)). Observability: Cache-Trefferquote nach Ähnlichkeitsschwellenwert, Häufigkeit erkannter Bedeutungsabweichungen bei Cache-Treffern und Häufigkeit ausgelöster Invalidierungen bei Quellenänderungen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Mandantenfilterung und Gültigkeitsdauer als eigenständige, vom Ähnlichkeitswert unabhängige Bedingungen im semantischen Cache. **Principal** macht den gewählten Ähnlichkeitsschwellenwert und dessen Kalibrierung für das Team nachvollziehbar dokumentiert. **Chief** positioniert semantisches Caching als Effizienzmaßnahme mit spezifischen Korrektheitsrisiken, die zusätzliche Sicherungen gegenüber exaktem Caching erfordert.

Anti-Patterns: einen semantischen Cache ohne Mandantenfilterung über mehrere Mandanten hinweg betreiben; Cache-Einträge ohne Gültigkeitsdauer oder Invalidierungsmechanismus unbegrenzt weiterverwenden; den Ähnlichkeitsschwellenwert so niedrig wählen, dass Bedeutungsabweichungen unentdeckt bleiben.

## Production Checklist

- [ ] Der Ähnlichkeitsschwellenwert ist konservativ kalibriert und um Bedeutungsabweichungsprüfung ergänzt.
- [ ] Mandantenfilterung ist als eigenständige, vom Ähnlichkeitswert unabhängige Bedingung implementiert.
- [ ] Jeder Cache-Eintrag hat eine explizite Gültigkeitsdauer basierend auf der Quellenänderungsfrequenz.
- [ ] Cache-Einträge werden bei erkannter Quellenänderung aktiv invalidiert.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen einem exakten und einem semantischen Cache?

**Antwort:** Ein exakter Cache trifft nur bei identischer Anfrage; ein semantischer Cache trifft bei bedeutungsähnlichen Anfragen, was die Trefferquote erhöht, aber zusätzliche Korrektheitsrisiken einführt.

### 2. Was ist Bedeutungsabweichung, und warum ist sie ein Risiko beim semantischen Caching?

**Antwort:** Zwei Anfragen können semantisch ähnlich erscheinen, aber tatsächlich unterschiedliche korrekte Antworten erfordern; ein zu niedriger Ähnlichkeitsschwellenwert kann solche Fälle fälschlich als Cache-Treffer behandeln.

### 3. Warum muss Mandantenkontext unabhängig von der semantischen Ähnlichkeit geprüft werden?

**Antwort:** Eine für einen Mandanten berechnete Antwort darf niemals für einen anderen Mandanten wiederverwendet werden, unabhängig davon, wie ähnlich dessen Anfrage der ursprünglichen ist — dies ist eine Sicherheitsanforderung, keine reine Ähnlichkeitsfrage.

### 4. Warum benötigt ein semantischer Cache eine explizite Gültigkeitsdauer basierend auf Quellenalter?

**Antwort:** Eine zwischengespeicherte Antwort basiert auf dem Stand der Quellen zum Berechnungszeitpunkt; ohne Gültigkeitsdauer oder Invalidierung kann sie nach einer Quellenaktualisierung veraltet, aber weiterhin ausgeliefert werden.

### 5. Wie diagnostizierst du eine Antwort, die nicht zur tatsächlich gestellten Anfrage passt?

**Antwort:** Ich prüfe, ob eine Bedeutungsabweichung zwischen der Cache-Anfrage und der neuen Anfrage vorliegt — beide könnten semantisch ähnlich, aber inhaltlich unterschiedlich in ihrer korrekten Antwort sein.

### 6. Widersprüchliche Anforderung: Team will maximale Cache-Trefferquote durch einen möglichst niedrigen Ähnlichkeitsschwellenwert UND garantiert keine Antworten mit Bedeutungsabweichung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein zu niedriger Schwellenwert die Bedeutungsabweichungsrate proportional erhöht; ich würde vorschlagen, den Schwellenwert konservativ zu halten und stattdessen die Trefferquote durch ergänzende Techniken wie Query-Normalisierung (siehe Query Rewriting, KB-0313) zu erhöhen, statt die Sicherheit gegen Bedeutungsabweichung durch einen niedrigeren Schwellenwert zu opfern.

## Praktische Labs

~~~python
# Semantic cache with tenant filtering and source-age-based invalidation
semantic_cache = []

def cache_answer(query_embedding_similarity_group, answer, tenant, source_version, ttl_seconds=3600):
    semantic_cache.append({
        "group": query_embedding_similarity_group, "answer": answer,
        "tenant": tenant, "source_version": source_version, "ttl_seconds": ttl_seconds,
    })

def lookup_cache(query_group, tenant, current_source_version, similarity_threshold_met=True):
    for entry in semantic_cache:
        if entry["group"] != query_group or not similarity_threshold_met:
            continue
        if entry["tenant"] != tenant:
            continue  # tenant filter independent of similarity
        if entry["source_version"] != current_source_version:
            return None  # source updated since caching -> invalidated
        return entry["answer"]
    return None

cache_answer("pricing_query", "Standard tier is $10/month.", tenant="tenant_a", source_version="v1")

result_same_tenant = lookup_cache("pricing_query", tenant="tenant_a", current_source_version="v1")
print(f"Same tenant, same source version: {result_same_tenant}")

result_diff_tenant = lookup_cache("pricing_query", tenant="tenant_b", current_source_version="v1")
print(f"Different tenant (correctly blocked): {result_diff_tenant}")

result_stale_source = lookup_cache("pricing_query", tenant="tenant_a", current_source_version="v2")
print(f"Source updated since caching (correctly invalidated): {result_stale_source}")
~~~

## Dependencies, Cross-References und Quellen

1. Redis: [Semantic Caching for LLM Applications](https://redis.io/blog/what-is-semantic-caching/), abgerufen 2026-09-17.
2. GPTCache: [GPTCache Documentation](https://github.com/zilliztech/GPTCache), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/), abgerufen 2026-09-17.

Semantische Suche ist kanonisch in [KB-0308](04-semantische-suche.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Ereignisgesteuerte Cache-Invalidierung, bei der Quellenänderungen aktiv Invalidierungssignale an den semantischen Cache senden, statt auf TTL-Ablauf zu warten | Adopting | Gegenüber reiner zeitbasierter Invalidierung für aktuellere Cache-Konsistenz bevorzugen. |
| Feinere Bedeutungsklassifikationsmodelle, die gezielt gegensätzliche Handlungsabsichten (z. B. "kündigen" vs. "pausieren") trotz semantischer Nähe unterscheiden | Emerging | Beobachten; würde Bedeutungsabweichungsrisiko gezielt reduzieren, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine semantische Cache-Architektur erst, wenn Mandantenfilterung, Gültigkeitsdauer und Bedeutungsabweichungsprüfung dokumentiert und getestet sind.
