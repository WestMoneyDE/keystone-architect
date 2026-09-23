---
{"id": "KB-0263", "title": "Mandantenisolation für GenAI", "domain": "11", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0261", "concepts": ["Datenabfluss und Privacy"], "needed_for": "understanding"}, {"id": "KB-0254", "concepts": ["LLM-Response-Caching"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Negativtests implementieren, die Cross-Tenant-Leaks in Retrieval-, Trace- und Toolaufruf-Pfaden gezielt aufzudecken versuchen.", "rationale": "Mandantenisolation wird erst durch aktive Negativtests (Versuch, die Isolation zu brechen) verifizierbar, nicht durch reine Konfigurationsprüfung."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Daten-, Cache-, Quoten- und Identity-Grenzen für eine konkrete Multi-Tenant-GenAI-Anwendung begründet modellieren.", "rationale": "Mandantenisolation in GenAI-Anwendungen betrifft mehrere unabhängige Grenzen, die jeweils separat durchgesetzt werden müssen."}, "STAFF-TARGET": {"active": true, "scope": "Einen Cross-Tenant-Datenleck in Retrieval-Ergebnissen auf eine fehlende Mandantenfilterung im Retrieval-Pfad statt auf ein allgemeines Datenproblem zurückführen können.", "rationale": "Retrieval-Systeme (Vektordatenbanken) benötigen explizite Mandantenfilterung, die leicht übersehen wird, wenn nur die primäre Anwendungsebene geprüft wird."}, "CHIEF-TARGET": {"active": true, "scope": "Mandantenisolation als mehrdimensionales Problem (Daten, Cache, Quoten, Identity) mit aktiver Verifikation durch Negativtests positionieren, nicht als einmalige Konfigurationsannahme.", "rationale": "Isolation, die nur konfiguriert, aber nie aktiv gegen Umgehung getestet wurde, ist eine unverifizierte Annahme, kein nachgewiesener Schutz."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Multi-Tenant-Infrastrukturimplementierungen sind Vertiefung.", "rationale": "Kern ist das Prinzip mehrdimensionaler Isolation mit aktiver Negativtest-Verifikation, nicht die Infrastrukturimplementierung."}}, "lab_validation": [{"lab_id": "KB-0263-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Negativtests gegen Cross-Tenant-Leaks in Retrieval- und Cache-Pfaden", "evidence": "Ein Negativtest, der gezielt versucht, mit den Zugangsdaten eines Mandanten auf Daten eines anderen Mandanten zuzugreifen, deckt eine fehlende Mandantenfilterung auf, die eine reine Konfigurationsprüfung möglicherweise nicht erkannt hätte.", "limitations": "Kein echtes produktives Multi-Tenant-System, keine reale Retrieval-Infrastruktur, keine Produktion."}]}
---
# Mandantenisolation für GenAI

> **Ziel:** Mandantenisolation in GenAI-Anwendungen umfasst mehrere unabhängige Grenzen — Daten, Cache (siehe [KB-0254](14-llm-response-caching.md)), Quoten und Identity — die jeweils separat durchgesetzt und aktiv durch Negativtests verifiziert werden müssen, nicht nur konfiguriert und als funktionierend angenommen. Cross-Tenant-Leaks können in Retrieval-Ergebnissen, Traces und Toolaufrufen auftreten, nicht nur im primären Anfrage-/Antwortpfad.

## Zweck, Mental Model und Dependencies

Datengrenzen stellen sicher, dass die Daten eines Mandanten (Dokumente, Kontext, historische Interaktionen) nur für diesen Mandanten zugänglich sind — dies betrifft nicht nur die primäre Datenbank, sondern insbesondere auch Retrieval-Systeme (Vektordatenbanken), bei denen eine fehlende Mandantenfilterung dazu führen kann, dass eine Ähnlichkeitssuche versehentlich Dokumente eines anderen Mandanten zurückliefert. Cache-Grenzen (siehe [KB-0254](14-llm-response-caching.md)) verhindern, dass eine für Mandant A berechnete, zwischengespeicherte Antwort an Mandant B ausgeliefert wird — dies erfordert zwingend Mandanten-ID im Cache-Schlüssel. Quotengrenzen stellen sicher, dass die Ressourcennutzung eines Mandanten (Tokenverbrauch, Anfragerate) nicht die Verfügbarkeit für andere Mandanten beeinträchtigt (verwandt mit Quotendurchsetzung bei Model Gateways). Identity-Grenzen stellen sicher, dass Authentifizierungs- und Autorisierungskontext korrekt und konsistent über die gesamte Verarbeitungskette hinweg dem richtigen Mandanten zugeordnet bleibt. Der zentrale, oft übersehene Punkt ist, dass Cross-Tenant-Leaks nicht nur im offensichtlichen primären Anfrage-/Antwortpfad auftreten können, sondern auch in weniger offensichtlichen Nebenpfaden: Retrieval-Ergebnisse (falsche Dokumente aus der Ähnlichkeitssuche), Traces/Logs (Debugging-Informationen, die mandantenübergreifend gespeichert werden), und Toolaufrufe (ein Werkzeug, das im Kontext eines Mandanten aufgerufen wird, aber versehentlich auf Daten eines anderen zugreift). Isolation, die nur konfiguriert, aber nie aktiv durch Negativtests (gezielte Versuche, die Isolation zu brechen) verifiziert wurde, ist eine unverifizierte Annahme.

~~~text
Data boundary:      tenant's documents/context accessible ONLY to that tenant - including RETRIEVAL results, not just primary DB
Cache boundary:      tenant ID mandatory in cache key (see KB-0254) - prevents cross-tenant cached response leaks
Quota boundary:      one tenant's usage cannot degrade availability for others
Identity boundary:   auth/authz context stays correctly attributed across the ENTIRE processing chain
Leak surfaces beyond the obvious: RETRIEVAL results, TRACES/logs, TOOL calls - not just the primary request/response
Configured isolation != VERIFIED isolation - active negative testing is required
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Retrieval-Mandantenfilterung | filtert die Vektordatenbank-Ähnlichkeitssuche explizit nach Mandanten-ID? | fehlende Filterung liefert Dokumente anderer Mandanten in Ähnlichkeitssuchergebnissen zurück |
| Cache-Mandantentrennung | ist Mandanten-ID zwingender Bestandteil jedes Cache-Schlüssels? | fehlende Trennung liefert für einen Mandanten berechnete Antworten an einen anderen aus |
| Trace-/Log-Mandantenkennzeichnung | sind Traces und Logs eindeutig einem Mandanten zugeordnet und entsprechend zugriffsbeschränkt? | mandantenübergreifend zugängliche Logs können versehentlich Daten eines anderen Mandanten offenlegen |
| Aktive Negativtest-Verifikation | wird Isolation durch gezielte Versuche, sie zu brechen, tatsächlich getestet? | reine Konfigurationsprüfung ohne aktiven Test lässt unentdeckte Isolationslücken bestehen |

Implementierung: jede Retrieval-Operation (Vektordatenbank-Ähnlichkeitssuche) wird mit expliziter Mandantenfilterung konfiguriert, sodass eine Suche strukturell nur Dokumente des anfragenden Mandanten zurückgeben kann, nicht nur durch nachträgliche Filterung der Ergebnisse. Cache-Schlüssel schließen zwingend die Mandanten-ID ein (siehe [KB-0254](14-llm-response-caching.md)). Traces und Logs werden mit eindeutiger Mandantenkennzeichnung versehen und mit entsprechenden Zugriffsbeschränkungen versehen, sodass ein Support- oder Debugging-Zugriff nicht versehentlich mandantenübergreifende Einsicht ermöglicht. Regelmäßige, aktive Negativtests werden durchgeführt, die gezielt versuchen, mit den Zugangsdaten eines Mandanten auf Daten, Cache-Einträge oder Traces eines anderen Mandanten zuzugreifen — nur ein erfolgreicher Negativtest (der die Isolation nicht brechen kann) verifiziert tatsächlich funktionierende Isolation, eine reine Konfigurationsprüfung reicht nicht aus.

## Scalability, Reliability, Security und Observability

Mehrdimensionale Mandantenisolation skaliert Vertrauen über wachsende Anzahl von Mandanten in einer geteilten GenAI-Infrastruktur, wenn jede Grenze (Daten, Cache, Quoten, Identity) konsistent und verifiziert durchgesetzt wird. Reliability-Grenze: eine nur konfigurierte, aber nie aktiv getestete Isolation ist ein besonders gefährliches Risiko, weil ein Cross-Tenant-Leak in einem Nebenpfad (Retrieval, Traces, Toolaufrufe) lange unentdeckt bleiben kann, bis ein tatsächlicher Vorfall oder ein gezielter Sicherheitstest ihn aufdeckt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Mandant erhält Dokumente oder Kontext, die einem anderen Mandanten gehören | fehlende oder unzureichende Mandantenfilterung im Retrieval-Pfad (Vektordatenbank-Suche) | Retrieval-Konfiguration auf explizite Mandanten-ID-Filterung in der Ähnlichkeitssuche prüfen |
| ein Support-Mitarbeiter kann in Logs/Traces Daten mehrerer Mandanten gleichzeitig einsehen | fehlende Mandantenkennzeichnung oder Zugriffsbeschränkung in Trace-/Log-Systemen | Trace-/Log-Zugriffskontrolle auf tatsächliche Mandantentrennung prüfen |
| ein Cross-Tenant-Leak wird erst durch einen tatsächlichen Vorfall entdeckt, nicht proaktiv | fehlende regelmäßige, aktive Negativtests zur Isolationsverifikation | Testplan auf Vorhandensein und Frequenz gezielter Cross-Tenant-Negativtests prüfen |
| ein Mandant erfährt Performance-Beeinträchtigung durch die Nutzung eines anderen Mandanten | fehlende oder unzureichende Quotengrenzen zwischen Mandanten | Ressourcennutzung des verursachenden Mandanten gegen konfigurierte Quotengrenzen prüfen |

Security: Mandantenisolation ist eine der kritischsten Sicherheitsanforderungen für Multi-Tenant-GenAI-Systeme, da ein Cross-Tenant-Leak sowohl Vertrauens- als auch Compliance-Konsequenzen (z. B. Datenschutzverletzungen) haben kann; regelmäßige, unabhängige Sicherheitsaudits sollten diese Isolation gezielt prüfen. Observability: Ergebnisse regelmäßiger Negativtests, Anzahl erkannter (und verhinderter) Cross-Tenant-Zugriffsversuche und Abdeckung der Isolationsprüfung über alle identifizierten Pfade (primär und Nebenpfade) sind zentrale Metriken für Mandantenisolations-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** implementiert explizite Mandantenfilterung im Retrieval-Pfad, nicht nur nachträgliche Ergebnisfilterung. **Principal** macht regelmäßige Negativtests für das Team als verpflichtenden, nicht optionalen Verifikationsschritt nachvollziehbar. **Chief** positioniert Mandantenisolation als mehrdimensionales Problem mit aktiver Verifikation, nicht als einmalige Konfigurationsannahme.

Anti-Patterns: Mandantenfilterung nur nachträglich auf Ergebnisse anwenden statt strukturell in der Retrieval-Abfrage selbst zu verankern; Isolation nur konfigurieren, aber nie aktiv durch Negativtests verifizieren; Traces und Logs ohne Mandantenkennzeichnung und entsprechende Zugriffsbeschränkung führen.

## Production Checklist

- [ ] Retrieval-Operationen filtern strukturell nach Mandanten-ID, nicht nur nachträglich.
- [ ] Cache-Schlüssel schließen zwingend Mandanten-ID ein.
- [ ] Traces und Logs sind eindeutig mandantengekennzeichnet und entsprechend zugriffsbeschränkt.
- [ ] Regelmäßige, aktive Negativtests verifizieren Isolation über alle identifizierten Pfade.

## Interviewfragen

### 1. Warum reicht Mandantenfilterung auf der primären Datenbankebene allein nicht aus?

**Antwort:** Cross-Tenant-Leaks können auch in Nebenpfaden wie Retrieval-Ergebnissen (Vektordatenbank-Ähnlichkeitssuche), Traces/Logs und Toolaufrufen auftreten, die eine separate, explizite Mandantenfilterung benötigen, unabhängig von der primären Datenbank-Zugriffskontrolle.

### 2. Warum muss Mandantenfilterung strukturell in der Retrieval-Abfrage verankert sein, statt nur nachträglich auf Ergebnisse angewendet zu werden?

**Antwort:** Eine strukturelle Filterung in der Abfrage selbst garantiert, dass die Suche von vornherein nur relevante, mandanteneigene Dokumente durchsucht; eine nachträgliche Filterung riskiert, dass mandantenfremde Daten zumindest kurzzeitig verarbeitet oder in Zwischenschritten exponiert werden, bevor sie herausgefiltert werden.

### 3. Warum ist eine konfigurierte Isolation nicht dasselbe wie eine verifizierte Isolation?

**Antwort:** Eine Konfiguration kann fehlerhaft, unvollständig oder durch spätere Änderungen kompromittiert sein, ohne dass dies ohne aktiven Test sichtbar wird; nur ein tatsächlicher Negativtest, der gezielt versucht, die Isolation zu brechen, verifiziert, dass der Schutz tatsächlich funktioniert.

### 4. Wie diagnostizierst du, dass ein Mandant Dokumente eines anderen Mandanten erhalten hat?

**Antwort:** Ich prüfe die Retrieval-Konfiguration auf explizite Mandanten-ID-Filterung in der Ähnlichkeitssuche — ein Cross-Tenant-Leak dieser Art deutet meist auf eine fehlende oder unzureichende strukturelle Filterung im Vektordatenbank-Zugriff hin, nicht auf ein Problem der primären Anwendungsebene.

### 5. Warum sind Traces und Logs ein oft übersehener Cross-Tenant-Leak-Vektor?

**Antwort:** Trace- und Log-Systeme dienen primär Debugging- und Betriebszwecken und werden oft weniger streng auf Mandantentrennung geprüft als die primäre Anwendungsfunktion; ohne explizite Mandantenkennzeichnung und Zugriffsbeschränkung können sie versehentlich mandantenübergreifende Einsicht ermöglichen.

### 6. Widersprüchliche Anforderung: Team will eine gemeinsame, geteilte Infrastruktur für maximale Kosteneffizienz über alle Mandanten UND garantiert lückenlose Mandantenisolation ohne jegliches Cross-Tenant-Risiko — wie gehst du vor?

**Antwort:** Ich würde erklären, dass geteilte Infrastruktur und Isolation kein grundsätzlicher Widerspruch sind, solange jede relevante Grenze (Daten, Cache, Quoten, Identity) explizit und strukturell durchgesetzt sowie regelmäßig durch Negativtests verifiziert wird; ich würde vorschlagen, in die Isolationsmechanismen und deren kontinuierliche Verifikation zu investieren, statt entweder die Kosteneffizienz geteilter Infrastruktur oder die Isolationsgarantie aufzugeben.

## Praktische Labs

~~~python
# Negative test: attempt to access another tenant's data via retrieval
documents = [
    {"id": "doc1", "tenant_id": "tenant_a", "content": "Tenant A confidential report"},
    {"id": "doc2", "tenant_id": "tenant_b", "content": "Tenant B confidential report"},
    {"id": "doc3", "tenant_id": "tenant_a", "content": "Tenant A public info"},
]

def retrieve_with_tenant_filter(query, tenant_id, docs):
    # CORRECT: structural filtering baked into the retrieval query itself
    return [d for d in docs if d["tenant_id"] == tenant_id]

def retrieve_without_filter(query, docs):
    # INCORRECT: no tenant filtering at all - simulates a vulnerable implementation
    return docs

def negative_test_cross_tenant_leak(retrieval_fn, requesting_tenant, docs):
    results = retrieval_fn("confidential", requesting_tenant, docs) if "tenant" in retrieval_fn.__code__.co_varnames else retrieval_fn("confidential", docs)
    leaked = [d for d in results if d["tenant_id"] != requesting_tenant]
    return leaked

# Test the CORRECT implementation
leaked_correct = negative_test_cross_tenant_leak(retrieve_with_tenant_filter, "tenant_a", documents)
print(f"Correct implementation - leaked documents: {leaked_correct}")
assert len(leaked_correct) == 0

# Test the VULNERABLE implementation
results_vulnerable = retrieve_without_filter("confidential", documents)
leaked_vulnerable = [d for d in results_vulnerable if d["tenant_id"] != "tenant_a"]
print(f"Vulnerable implementation - leaked documents: {leaked_vulnerable}")
assert len(leaked_vulnerable) > 0
print("\nThe negative test caught the vulnerable implementation's cross-tenant leak that configuration review alone might have missed.")
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [Multi-Tenancy Security Guidance](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-17.
2. Pinecone: [Namespace-based Multi-Tenancy](https://docs.pinecone.io/guides/indexes/implement-multitenancy), abgerufen 2026-09-17.
3. NIST: [Guide to General Server Security — Multi-Tenant Isolation](https://csrc.nist.gov/publications/detail/sp/800-123/final), abgerufen 2026-09-17.

Datenabfluss- und Response-Caching-Grundlagen sind kanonisch in [KB-0261](21-datenabfluss-und-privacy-in-ai-anwendungen.md) und [KB-0254](14-llm-response-caching.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Native Namespace-/Partition-basierte Multi-Tenancy in Vektordatenbanken | Established | Gegenüber selbstgebauter Filterlogik für strukturelle, vom Datenbanksystem garantierte Trennung bevorzugen. |
| Automatisierte, kontinuierliche Cross-Tenant-Penetrationstest-Pipelines | Adopting | Für Multi-Tenant-Systeme mit hoher Mandantenanzahl gegenüber seltenen manuellen Audits bevorzugen. |

Ein Team akzeptiert ein Mandantenisolations-Design erst, wenn alle vier Grenzen (Daten, Cache, Quoten, Identity) implementiert und durch regelmäßige Negativtests nachweisbar verifiziert sind.
