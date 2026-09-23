---
{"id": "KB-0129", "title": "Domain-Driven Design und Fachmodelle", "domain": "06", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0126", "concepts": ["Systemdesign-Methodik"], "needed_for": "understanding"}], "related": ["KB-0130", "KB-0562", "KB-0720"], "applies": ["KB-0130", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Ubiquitous Language für ein Beispieldomänenproblem entwickeln und Begriffsinkonsistenzen im Code identifizieren.", "rationale": "Kein reales Projekt nötig, um die Modellierungsmethodik zu üben."}, "ARCHITECT-TARGET": {"active": true, "scope": "Fachliche Modelle gemeinsam mit Domänenexperten entwickeln und von rein technischen Datenstrukturen unterscheiden.", "rationale": "Ein technisch sauberes Modell ohne fachliche Übereinstimmung löst das falsche Problem."}, "STAFF-TARGET": {"active": true, "scope": "Eine Begriffsinkonsistenz zwischen Code und Fachsprache als Ursache für Missverständnisse im Team identifizieren.", "rationale": "Uneinheitliche Sprache zwischen Fachbereich und Code ist eine häufige, unterschätzte Fehlerquelle."}, "CHIEF-TARGET": {"active": true, "scope": "Strategisches DDD (Bounded Contexts, Kernsubdomänen) als Rahmen für Portfolio-Priorisierung nutzen.", "rationale": "Nicht jede Subdomäne verdient dieselbe Modellierungstiefe und Investition."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Event Storming und formale DDD-Musterkataloge (Aggregate, Value Objects im Detail) sind Vertiefung.", "rationale": "Kern ist Ubiquitous Language und die Unterscheidung fachlich/technisch, nicht jedes taktische Muster."}}, "lab_validation": [{"lab_id": "KB-0129-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Begriffsinkonsistenz zwischen Fachsprache und Code", "evidence": "Der Fachbegriff 'Stornierung' wird im Code an drei Stellen unterschiedlich als 'cancel', 'delete' und 'void' verwendet, was als Modellinkonsistenz identifiziert wird.", "limitations": "Kein reales Projekt, rein methodische Übung."}]}
---
# Domain-Driven Design und Fachmodelle

> **Ziel:** Domain-Driven Design (DDD) stellt sicher, dass das Softwaremodell die tatsächliche Fachlichkeit widerspiegelt, statt eine technisch bequeme, aber fachlich verzerrte Struktur zu sein. Die Ubiquitous Language (einheitliche Sprache zwischen Fachexperten und Code) und strategisches DDD (welche Subdomäne verdient welche Modellierungstiefe) sind die Grundlage dafür.

## Zweck, Mental Model und Dependencies

Ein häufiges Muster in gewachsenen Systemen: der Code verwendet unterschiedliche Begriffe für dasselbe fachliche Konzept (z. B. „Kunde" in einem Modul, „Account" in einem anderen, „User" in einem dritten, obwohl fachlich dasselbe gemeint ist), oder denselben Begriff für unterschiedliche fachliche Konzepte. Die Ubiquitous Language erzwingt, dass Fachexperten und Entwickler dieselben Begriffe im selben Sinn verwenden — im Gespräch, in Dokumentation und im Code selbst (Klassennamen, Methodennamen). Strategisches DDD identifiziert zusätzlich, welche Subdomänen „Kern" (wettbewerbsdifferenzierend, verdient tiefe Modellierung) versus „unterstützend" oder „generisch" (Standardlösung reicht) sind. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0126](../05-distributed-systems/26-methodik-fuer-systemdesign.md).

~~~text
Fachexperte sagt "Stornierung" -> Code muss "cancellation" (nicht delete/void/remove) durchgängig nutzen
Core subdomain (differenzierend) -> tiefe Modellierung, eigenes Team
Generic subdomain (Standard) -> Standardlösung/Kaufsoftware statt Eigenentwicklung
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Häufiger Fehler |
|---|---|---|
| Ubiquitous Language | verwenden Fachexperten und Code denselben Begriff im selben Sinn? | technische Synonyme (delete/cancel/void) für einen fachlichen Begriff |
| Kern- vs. unterstützende Subdomäne | verdient dieser Bereich tiefe Eigenmodellierung oder Standardlösung? | jede Subdomäne wird gleich intensiv modelliert, unabhängig vom Differenzierungswert |
| Modell vs. Datenstruktur | bildet die Struktur fachliche Regeln ab oder nur Speicherbequemlichkeit? | ein reines CRUD-Datenmodell wird fälschlich als Domänenmodell bezeichnet |
| Gemeinsame Entwicklung | wird das Modell mit Fachexperten iterativ entwickelt? | Entwickler modellieren allein basierend auf angenommenem Fachwissen |

Implementierung: die Ubiquitous Language wird aktiv gepflegt (z. B. als Glossar) und bei jeder Begriffsänderung im Fachgespräch auch im Code nachgezogen — nicht nur dokumentiert, sondern durchgesetzt. Strategisches DDD beginnt mit einer Subdomänen-Landkarte (Kern, unterstützend, generisch), die Investitionsentscheidungen leitet. Ein Domänenmodell unterscheidet sich von einer reinen Datenstruktur dadurch, dass es fachliche Invarianten und Verhalten kapselt, nicht nur Felder hält.

## Scalability, Reliability, Security und Observability

DDD skaliert als Organisationswerkzeug: Bounded Contexts (siehe [KB-0130](02-bounded-contexts-und-context-maps.md)) erlauben, dass unterschiedliche Teams mit ihrer eigenen, lokal konsistenten Sprache arbeiten, ohne einen einzigen globalen Begriffskonsens erzwingen zu müssen. Reliability-Grenze: ein Modell, das fachliche Invarianten nicht korrekt abbildet, kann technisch fehlerfrei laufen und trotzdem fachlich falsche Ergebnisse produzieren — das ist kein Bug im klassischen Sinn, sondern ein Modellierungsfehler.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| wiederkehrende Missverständnisse zwischen Fachbereich und Entwicklung | fehlende oder inkonsistente Ubiquitous Language | Begriffe aus Fachgesprächen gegen Code-Bezeichnungen abgleichen |
| dieselbe fachliche Regel ist an mehreren Stellen unterschiedlich implementiert | fehlendes zentrales Domänenmodell, Logik verstreut | Vorkommen derselben fachlichen Regel im Code suchen und vergleichen |
| ein Bereich wird stark investiert, obwohl er keine Differenzierung bringt | fehlende strategische Einordnung (Kern vs. generisch) | Subdomäne gegen Wettbewerbsdifferenzierungswert bewerten |
| Entwickler modellieren ohne Rückfrage an Fachexperten | fehlende gemeinsame, iterative Modellentwicklung | Häufigkeit und Format der Fachexperten-Einbindung prüfen |

Security: fachliche Autorisierungsregeln (wer darf was stornieren) sollten Teil des Domänenmodells sein, nicht als nachträgliche technische Prüfung außerhalb der fachlichen Logik. Observability: eine konsistente Ubiquitous Language erleichtert auch das Lesen von Logs und Metriken, da technische und fachliche Bezeichnungen übereinstimmen.

## Trade-offs und Entscheidungen

**Staff** pflegt aktiv ein Glossar und hinterfragt Begriffsinkonsistenzen zwischen Fachgesprächen und Code. **Principal** identifiziert Kern- versus unterstützende Subdomänen und lenkt Modellierungstiefe entsprechend. **Chief** trifft Build-vs-Buy-Entscheidungen basierend auf der strategischen DDD-Einordnung (generische Subdomänen eher einkaufen, Kernsubdomänen eigen entwickeln).

Anti-Patterns: DDD nur als technisches Muster (Aggregate, Repositories) ohne die eigentliche Ubiquitous-Language-Arbeit anwenden; jede Subdomäne mit gleicher Tiefe modellieren unabhängig vom Differenzierungswert; ein reines Datenmodell (CRUD-Felder) als „Domänenmodell" bezeichnen, ohne fachliches Verhalten und Invarianten zu kapseln.

## Production Checklist

- [ ] Ubiquitous Language dokumentiert (Glossar) und im Code konsistent verwendet.
- [ ] Subdomänen als Kern/unterstützend/generisch eingeordnet, Investition entsprechend priorisiert.
- [ ] Fachliche Invarianten und Verhalten im Domänenmodell gekapselt, nicht nur Datenfelder gehalten.
- [ ] Modell iterativ gemeinsam mit Fachexperten entwickelt und validiert.

## Interviewfragen

### 1. Was ist die Ubiquitous Language und warum ist sie wichtig?

**Antwort:** Eine einheitliche Sprache, die Fachexperten und Entwickler in Gesprächen, Dokumentation und Code gleichermaßen verwenden; sie verhindert Missverständnisse, die aus unterschiedlichen Begriffen für dasselbe fachliche Konzept entstehen.

### 2. Was unterscheidet ein Domänenmodell von einer reinen Datenstruktur?

**Antwort:** Ein Domänenmodell kapselt fachliche Invarianten und Verhalten, nicht nur Datenfelder — es weiß, welche Zustandsänderungen fachlich gültig sind, statt nur Daten zu speichern.

### 3. Was ist eine Kern-Subdomäne im Gegensatz zu einer generischen Subdomäne?

**Antwort:** Eine Kern-Subdomäne ist wettbewerbsdifferenzierend und verdient tiefe Eigenmodellierung; eine generische Subdomäne (z. B. Authentifizierung) kann oft durch Standardlösungen abgedeckt werden.

### 4. Warum sollte ein Domänenmodell gemeinsam mit Fachexperten entwickelt werden?

**Antwort:** Weil Entwickler allein oft fachliche Nuancen und Ausnahmefälle nicht kennen, die für ein korrektes Modell entscheidend sind; iterative gemeinsame Entwicklung deckt solche Lücken früh auf.

### 5. Wie erkennst du eine fehlende Ubiquitous Language im Code?

**Antwort:** Durch Abgleich der in Fachgesprächen verwendeten Begriffe mit den Bezeichnungen im Code — unterschiedliche technische Synonyme für denselben fachlichen Begriff sind ein klares Signal.

### 6. Widersprüchliche Anforderung: Team will schnell liefern UND ein sauberes, fachlich korrektes Domänenmodell entwickeln — wie gehst du vor?

**Antwort:** Ich würde die Modellierungstiefe an der strategischen Einordnung ausrichten: für die Kern-Subdomäne, die den Geschäftswert trägt, investiere ich in sorgfältige gemeinsame Modellierung, während generische Randbereiche pragmatisch und schnell mit einfacheren Strukturen umgesetzt werden.

## Praktische Labs

~~~python
codebase_terms = {"module_a": "cancel", "module_b": "delete", "module_c": "void"}
business_term = "Stornierung"

inconsistent = len(set(codebase_terms.values())) > 1
assert inconsistent
print(f"Business term '{business_term}' maps to {len(set(codebase_terms.values()))} different code terms - a Ubiquitous Language violation.")
~~~

## Dependencies, Cross-References und Quellen

1. Evans: [Domain-Driven Design: Tackling Complexity in the Heart of Software](https://www.domainlanguage.com/ddd/), Addison-Wesley 2003, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Tooling-Unterstützung (Event-Storming-Plattformen o. ä.) sollte dennoch gegen aktuelle Angebote geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Extraktion von Domänenbegriffen aus Fachdokumenten/Transkripten | Emerging | Vorschläge immer mit Fachexperten validieren, nie ungeprüft als Modell übernehmen. |
| Event Storming als kollaborative Workshop-Methode zur Modellentwicklung | Established | Als ergänzende Praxis zur klassischen DDD-Modellierung einsetzen. |

Diese Methodik selbst ist ein etabliertes, stabiles Fundament; der Bonus betrifft primär, wie Tooling die Modellentwicklung unterstützen kann, ohne die gemeinsame fachliche Validierung zu ersetzen.
