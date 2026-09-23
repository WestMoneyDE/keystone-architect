---
{"id": "KB-0254", "title": "LLM-Response-Caching", "domain": "11", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0245", "concepts": ["Context Engineering"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein exaktes Cache-Schlüssel-Modell mit Promptversion und Mandantenkontext lokal implementieren.", "rationale": "Der Unterschied zwischen sicherem exaktem Caching und riskantem Cross-Mandanten-Caching wird erst durch konkrete Schlüsselkonstruktion greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Cache-Schlüssel-Struktur für einen konkreten Multi-Mandanten-Anwendungsfall begründet gestalten, mit expliziter Promptversion-Einbindung.", "rationale": "Ein unvollständiger Cache-Schlüssel kann versehentlich Antworten über Mandantengrenzen oder Promptversionen hinweg vermischen."}, "STAFF-TARGET": {"active": true, "scope": "Eine falsch ausgelieferte, veraltete oder mandantenfremde Antwort auf einen unzureichenden Cache-Schlüssel statt auf einen Modellfehler zurückführen können.", "rationale": "Ein Cache-Schlüssel ohne Promptversion oder Mandantenkontext kann veraltete oder falsch zugeordnete Antworten aus dem Cache liefern."}, "CHIEF-TARGET": {"active": true, "scope": "LLM-Response-Caching als exaktes, sicherheitskritisches Caching-Problem positionieren, das strikt von semantischem Caching (Domain 13) abzugrenzen ist.", "rationale": "Exaktes Caching (identische Anfrage -> identische Antwort) hat andere Sicherheits- und Konsistenzanforderungen als semantisches Caching (ähnliche Anfrage -> wiederverwendete Antwort)."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Cache-Infrastruktur-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist die Cache-Schlüssel-Konstruktion mit Promptversion und Mandantenkontext, nicht die Infrastrukturimplementierung."}}, "lab_validation": [{"lab_id": "KB-0254-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für exakten Cache-Schlüssel mit Promptversion und Mandantenkontext", "evidence": "Ein Cache-Schlüssel, der Mandanten-ID und Promptversion einschließt, verhindert, dass eine für Mandant A und Promptversion 1 berechnete Antwort fälschlich an Mandant B oder für Promptversion 2 ausgeliefert wird.", "limitations": "Kein echtes Cache-System, keine reale Multi-Mandanten-Umgebung, keine Produktion."}]}
---
# LLM-Response-Caching

> **Ziel:** LLM-Response-Caching (exaktes Caching: identische Anfrage liefert identische, zwischengespeicherte Antwort) erfordert Cache-Schlüssel, die Promptversion und Mandantenkontext explizit einschließen — sonst können veraltete oder mandantenfremde Antworten ausgeliefert werden. Dieses exakte Caching hat andere Sicherheits- und Konsistenzanforderungen als semantisches Caching (ähnliche, nicht identische Anfragen), das in Domain 13 separat behandelt wird.

## Zweck, Mental Model und Dependencies

Exaktes LLM-Response-Caching speichert die Antwort auf eine spezifische Anfrage und liefert diese gespeicherte Antwort bei einer identischen Folgeanfrage aus, ohne erneut das Modell aufzurufen — das spart Latenz und Kosten für wiederholte, identische Anfragen. Der zentrale Risikofaktor liegt in der Cache-Schlüssel-Konstruktion: ein Cache-Schlüssel muss alle Faktoren einschließen, die die Antwort tatsächlich beeinflussen, sonst können zwei Anfragen, die sich in einem relevanten, aber nicht im Cache-Schlüssel erfassten Faktor unterscheiden, fälschlich dieselbe zwischengespeicherte Antwort erhalten. Promptversion ist ein kritischer Faktor: wenn ein System-Prompt oder eine Anweisungsvorlage aktualisiert wird, muss der Cache-Schlüssel diese Version widerspiegeln, sonst können nach einem Prompt-Update weiterhin veraltete Antworten aus dem Cache ausgeliefert werden, die auf der alten Prompt-Version basieren. Mandantenkontext ist bei Multi-Mandanten-Systemen (mehrere Kunden oder Organisationen, die dieselbe Infrastruktur teilen) ebenfalls kritisch: ohne Mandanten-ID im Cache-Schlüssel könnte eine für Mandant A berechnete Antwort fälschlich an Mandant B ausgeliefert werden, was sowohl ein Datenschutz- als auch ein Korrektheitsproblem darstellt. Dieser Artikel behandelt bewusst nur exaktes Caching (identische Anfrage); semantisches Caching (ähnliche, aber nicht identische Anfragen werden als Cache-Treffer behandelt) wird separat in Domain 13 behandelt, da es fundamental andere Risiken (semantische Fehlinterpretation von "ähnlich genug") mit sich bringt.

~~~text
Exact cache key MUST include:  request content + PROMPT VERSION + TENANT CONTEXT
Missing prompt version:  cache serves STALE responses after prompt update, undetected
Missing tenant context:   cache can leak Tenant A's response to Tenant B -> privacy AND correctness failure
Exact caching (identical request) != semantic caching (similar request) - different risk profiles, covered separately in Domain 13
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Vollständige Cache-Schlüssel-Faktoren | umfasst der Cache-Schlüssel alle tatsächlich antwortrelevanten Faktoren? | fehlende Faktoren erzeugen falsche Cache-Treffer, die eigentlich unterschiedliche Anfragen als identisch behandeln |
| Promptversion-Einbindung | wird der Cache-Schlüssel bei jeder Prompt-Aktualisierung automatisch invalidiert? | veraltete Cache-Einträge werden nach Prompt-Updates weiterhin ausgeliefert, unbemerkt inkonsistent |
| Mandantentrennung | ist Mandanten-ID zwingender Bestandteil jedes Cache-Schlüssels in Multi-Mandanten-Systemen? | fehlende Mandantentrennung ermöglicht Cross-Mandanten-Datenleck über zwischengespeicherte Antworten |
| Sensible-Inhalte-Behandlung | ist geprüft, ob Antworten mit sensiblen Inhalten überhaupt gecacht werden sollten? | sensible, personenbezogene Antworten im Cache erhöhen die Angriffsfläche und Compliance-Risiken |

Implementierung: Cache-Schlüssel werden als Hash oder strukturierte Kombination aus dem vollständigen Anfrageinhalt, der aktuellen Promptversion (z. B. einer Versionsnummer oder einem Hash des System-Prompts) und der Mandanten-ID konstruiert, sodass jede Änderung eines dieser Faktoren automatisch zu einem Cache-Miss (und damit einer frischen Modellanfrage) statt eines fälschlichen Cache-Treffers führt. Promptversion wird bei jeder Aktualisierung des System-Prompts oder der Anweisungsvorlage explizit erhöht, mit automatischer Invalidierung aller Cache-Einträge der alten Version. Mandanten-ID ist ein zwingender, nicht optionaler Bestandteil jedes Cache-Schlüssels in Multi-Mandanten-Systemen, ohne Ausnahme. Für Antworten, die potenziell sensible oder personenbezogene Inhalte enthalten, wird explizit geprüft, ob Caching überhaupt angemessen ist, oder ob solche Antworten grundsätzlich vom Caching ausgeschlossen werden sollten.

## Scalability, Reliability, Security und Observability

Exaktes Response-Caching skaliert Latenz- und Kostenreduktion gut für Anwendungsfälle mit hoher Wiederholungsrate identischer Anfragen (z. B. häufig gestellte FAQ-artige Fragen). Reliability-Grenze: ein unvollständiger Cache-Schlüssel ist ein besonders tückisches Risiko, weil das System scheinbar korrekt funktioniert (Antworten werden geliefert, Latenz ist niedrig), aber stillschweigend veraltete oder falsch zugeordnete Antworten ausliefert, was ohne gezielte Prüfung unentdeckt bleiben kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einem Prompt-Update werden weiterhin Antworten geliefert, die dem alten Prompt-Verhalten entsprechen | Cache-Schlüssel schließt Promptversion nicht ein, veraltete Einträge wurden nicht invalidiert | Cache-Schlüssel-Konstruktion auf Einbindung der aktuellen Promptversion prüfen |
| ein Mandant erhält eine Antwort, die für einen anderen Mandanten bestimmt oder berechnet war | Cache-Schlüssel schließt Mandanten-ID nicht ein oder unzureichend | Cache-Schlüssel-Konstruktion auf zwingende Mandanten-ID-Einbindung prüfen |
| zwei fachlich unterschiedliche Anfragen erhalten identische, aber für eine der beiden falsche Antworten | Cache-Schlüssel erfasst nicht alle tatsächlich antwortrelevanten Unterscheidungsfaktoren | die beiden Anfragen auf tatsächliche inhaltliche Unterschiede prüfen, die im Cache-Schlüssel fehlen |
| sensible Inhalte tauchen unerwartet in Cache-Infrastruktur-Logs oder -Speichern auf | fehlende Prüfung, ob sensible Antworten überhaupt gecacht werden sollten | Cache-Konfiguration auf Ausschlussregeln für sensible Inhaltskategorien prüfen |

Security: Cache-Infrastruktur, die potenziell sensible Antworten speichert, sollte denselben Zugriffskontroll- und Verschlüsselungsstandards wie die primäre Datenverarbeitung unterliegen, nicht als "nur Performance-Optimierung" mit laxeren Standards behandelt werden. Observability: Cache-Trefferrate, Cache-Miss-Rate nach Promptversion-Wechsel und Häufigkeit erkannter Cross-Mandanten-Anomalien (sollte strukturell null sein) sind zentrale Metriken für Cache-Sicherheit und -Effizienz.

## Trade-offs und Entscheidungen

**Staff** konstruiert Cache-Schlüssel mit zwingender Einbindung von Promptversion und Mandanten-ID. **Principal** macht Cache-Invalidierung bei Prompt-Updates für das Team als automatisierten, nicht manuellen Prozess nachvollziehbar. **Chief** positioniert exaktes LLM-Response-Caching als sicherheitskritisches Problem mit eigenen Anforderungen, strikt getrennt von semantischem Caching.

Anti-Patterns: Cache-Schlüssel ohne Promptversion konstruieren, wodurch Prompt-Updates nicht automatisch Cache-Invalidierung auslösen; Mandanten-ID als optionalen statt zwingenden Bestandteil des Cache-Schlüssels behandeln; sensible Antworten ohne Prüfung genauso wie unkritische Antworten cachen.

## Production Checklist

- [ ] Cache-Schlüssel schließt Promptversion zwingend ein, mit automatischer Invalidierung bei Updates.
- [ ] Cache-Schlüssel schließt Mandanten-ID zwingend ein in Multi-Mandanten-Systemen.
- [ ] Alle tatsächlich antwortrelevanten Faktoren sind im Cache-Schlüssel erfasst.
- [ ] Sensible Inhaltskategorien sind explizit auf Cache-Eignung geprüft.

## Interviewfragen

### 1. Warum muss die Promptversion Teil des Cache-Schlüssels sein?

**Antwort:** Wenn ein System-Prompt aktualisiert wird, ändert sich potenziell die erwartete Antwort auf dieselbe Nutzeranfrage; ohne Promptversion im Cache-Schlüssel würden nach einem Update weiterhin veraltete, auf dem alten Prompt basierende Antworten aus dem Cache ausgeliefert.

### 2. Warum ist Mandanten-ID im Cache-Schlüssel bei Multi-Mandanten-Systemen zwingend, nicht optional?

**Antwort:** Ohne Mandanten-ID könnte eine für einen Mandanten berechnete Antwort fälschlich an einen anderen Mandanten ausgeliefert werden — das ist sowohl ein Datenschutz- als auch ein fachliches Korrektheitsproblem, das strukturell durch fehlende Mandantentrennung im Schlüssel entsteht.

### 3. Was unterscheidet exaktes LLM-Response-Caching von semantischem Caching?

**Antwort:** Exaktes Caching liefert eine gespeicherte Antwort nur bei identischer Anfrage aus, während semantisches Caching auch ähnliche, aber nicht identische Anfragen als Cache-Treffer behandelt — semantisches Caching hat zusätzliche Risiken durch die Interpretation von "ausreichend ähnlich", die exaktes Caching nicht hat.

### 4. Wie diagnostizierst du, dass ein Mandant eine für einen anderen Mandanten bestimmte Antwort erhalten hat?

**Antwort:** Ich prüfe die Cache-Schlüssel-Konstruktion auf tatsächliche Einbindung der Mandanten-ID — ein solches Symptom deutet stark auf eine fehlende oder unzureichende Mandantentrennung im Cache-Schlüssel hin.

### 5. Warum kann ein unvollständiger Cache-Schlüssel besonders lange unentdeckt bleiben?

**Antwort:** Das System liefert weiterhin scheinbar funktionsfähige Antworten mit niedriger Latenz — es gibt keinen offensichtlichen Fehler, nur stillschweigend falsch zugeordnete oder veraltete Antworten, die erst durch gezielte Prüfung der Cache-Schlüssel-Logik oder durch aufmerksame Nutzer auffallen.

### 6. Widersprüchliche Anforderung: Team will maximale Cache-Trefferrate für beste Latenz-/Kostenreduktion UND garantiert niemals veraltete oder mandantenfremde Antworten ausliefern — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein vollständiger, korrekter Cache-Schlüssel (mit Promptversion und Mandanten-ID) die Trefferrate strukturell reduziert, da mehr eindeutige Schlüssel-Kombinationen entstehen; ich würde erklären, dass dies kein akzeptabler Kompromiss ist — Korrektheit darf nicht für höhere Trefferrate geopfert werden, und stattdessen an anderen Stellen (z. B. Cache-Größe, Retention) auf Effizienz optimiert werden sollte, statt die Sicherheits-/Korrektheitsgarantien des Schlüssels zu schwächen.

## Praktische Labs

~~~python
import hashlib

# Correct cache key: includes tenant + prompt version
def cache_key_correct(request_content, tenant_id, prompt_version):
    combined = f"{tenant_id}:{prompt_version}:{request_content}"
    return hashlib.sha256(combined.encode()).hexdigest()

# Incorrect cache key: missing tenant and prompt version
def cache_key_incorrect(request_content):
    return hashlib.sha256(request_content.encode()).hexdigest()

request = "What is our refund policy?"

# Same request, different tenants, different prompt versions
key_tenant_a_v1 = cache_key_correct(request, tenant_id="tenant_a", prompt_version="v1")
key_tenant_b_v1 = cache_key_correct(request, tenant_id="tenant_b", prompt_version="v1")
key_tenant_a_v2 = cache_key_correct(request, tenant_id="tenant_a", prompt_version="v2")

assert key_tenant_a_v1 != key_tenant_b_v1  # different tenants -> different cache entries
assert key_tenant_a_v1 != key_tenant_a_v2  # prompt update -> different cache entry, no stale response

# The incorrect version would collapse all of these into the SAME key
incorrect_key_always_same = cache_key_incorrect(request)
print(f"Correct keys are all distinct: {len({key_tenant_a_v1, key_tenant_b_v1, key_tenant_a_v2})} unique keys for 3 different contexts")
print(f"Incorrect key ignores tenant/version - would incorrectly collapse all contexts into ONE cache entry.")
~~~

## Dependencies, Cross-References und Quellen

1. Redis: [Caching Best Practices for LLM Applications](https://redis.io/docs/latest/develop/get-started/vector-database/), abgerufen 2026-09-17.
2. OWASP: [Multi-Tenancy Data Isolation Risks](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-17.
3. Anthropic: [Prompt Caching Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching), abgerufen 2026-09-17.

Context-Engineering-Grundlagen sind kanonisch in [KB-0245](05-context-engineering.md) behandelt. Semantisches Caching wird in Domain 13 separat behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Native, anbieterseitige Prompt-Caching-Mechanismen für wiederholte Kontextteile innerhalb einer Konversation | Established | Gegenüber selbstgebautem Caching für wiederholte Kontextpräfixe standardmäßig nutzen, wo verfügbar. |
| Automatisierte Cache-Invalidierungs-Pipelines, die Promptversion-Änderungen aus Versionskontrolle direkt ableiten | Adopting | Für Teams mit häufigen Prompt-Iterationen gegenüber manueller Versionsverwaltung bevorzugen. |

Ein Team akzeptiert ein LLM-Response-Caching-Design erst, wenn Cache-Schlüssel nachweisbar Promptversion und Mandantenkontext einschließen und sensible Inhalte explizit geprüft sind.
