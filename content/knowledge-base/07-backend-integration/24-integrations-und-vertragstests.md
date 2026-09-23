---
{"id": "KB-0176", "title": "Integrations- und Vertragstests", "domain": "07", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF"], "requires": [{"id": "KB-0151", "concepts": ["Testportfolio"], "needed_for": "both"}, {"id": "KB-0162", "concepts": ["OpenAPI", "Contract Tests"], "needed_for": "both"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Contract-Test gegen eine OpenAPI-Spezifikation und einen instabilen Abhängigkeit-Mock lokal implementieren.", "rationale": "Kein reales verteiltes System nötig, um die Testebenen zu unterscheiden."}, "ARCHITECT-TARGET": {"active": true, "scope": "API-, Contract- und End-to-End-Tests gezielt für unterschiedliche Integrationsrisiken kombinieren, statt einer einzigen Testart zu vertrauen.", "rationale": "Jede Testebene deckt eine andere Klasse von Integrationsfehlern ab."}, "STAFF-TARGET": {"active": true, "scope": "Eine instabile, häufig fehlschlagende End-to-End-Testsuite auf fehlende Isolation instabiler externer Abhängigkeiten zurückführen.", "rationale": "Das ist eine häufige Ursache für 'flaky tests', die Vertrauen in die Testsuite untergraben."}, "CHIEF-TARGET": {"active": true, "scope": "Eine ausgewogene Teststrategie (viele Unit-/Contract-Tests, wenige End-to-End-Tests) als Standard etablieren.", "rationale": "Zu viele langsame, instabile End-to-End-Tests verlangsamen Entwicklung ohne proportionalen Sicherheitsgewinn."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Framework-spezifische Details (PyTest-Fixtures, Playwright-Selektoren) sind Vertiefung.", "rationale": "Kern ist die Wahl der richtigen Testebene für das jeweilige Integrationsrisiko."}}, "lab_validation": [{"lab_id": "KB-0176-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Contract-Test gegen ein Mock einer instabilen Abhängigkeit", "evidence": "Ein Contract-Test prüft die API-Antwortstruktur unabhängig von der realen, potenziell instabilen externen Abhängigkeit, indem ein kontrolliertes Mock verwendet wird.", "limitations": "Kein reales verteiltes System, keine Produktion."}]}
---
# Integrations- und Vertragstests

> **Ziel:** API-Tests (prüfen einen einzelnen Service isoliert), Contract-Tests (prüfen, ob ein Vertrag zwischen Producer und Consumer eingehalten wird, siehe [KB-0162](10-openapi-und-vertragswerkzeuge.md)) und End-to-End-Tests (prüfen den vollständigen Systemfluss über mehrere echte Services) decken unterschiedliche Integrationsrisiken ab. Eine ausgewogene Teststrategie kombiniert sie gezielt — zu viele instabile End-to-End-Tests verlangsamen Entwicklung, ohne proportionalen Sicherheitsgewinn zu bieten.

## Zweck, Mental Model und Dependencies

Ein API-Test prüft einen einzelnen Service isoliert, oft mit gemockten Abhängigkeiten — schnell und stabil, aber deckt keine echten Integrationsfehler zwischen Services auf. Ein Contract-Test prüft, ob ein Producer den dokumentierten Vertrag (z. B. OpenAPI-Spezifikation) tatsächlich einhält, ohne den vollständigen Consumer zu benötigen — ein guter Mittelweg zwischen Isolation und Integrationssicherheit. Ein End-to-End-Test durchläuft den vollständigen Systemfluss über echte (oder realistisch simulierte) Services — am aussagekräftigsten für reale Integrationsfehler, aber langsam und anfällig für Instabilität durch externe Abhängigkeiten. Lies [KB-0151](../06-software-architecture/23-architekturtests-und-testportfolios.md) und [KB-0162](10-openapi-und-vertragswerkzeuge.md).

~~~text
API Test:          Service A alone, mocked dependencies -- fast, stable, no real integration coverage
Contract Test:      Service A's actual response vs. documented spec -- catches drift without needing Consumer
End-to-End Test:    Client -> Service A -> Service B -> Service C (real flow) -- most realistic, slowest, most fragile
~~~

## Core Concepts, Architektur und Implementierung

| Testebene | Was sie abdeckt | Was sie NICHT abdeckt |
|---|---|---|
| API-Test | interne Logik eines einzelnen Service | Integrationsfehler zwischen Services |
| Contract-Test | Einhaltung des dokumentierten Vertrags | fachliche Korrektheit des vollständigen Flusses |
| End-to-End-Test | vollständiger realer Systemfluss | schnelle, stabile Rückmeldung; anfällig für Flakiness |

Implementierung: die Mehrheit der Tests sind schnelle, isolierte API-/Unit-Tests. Contract-Tests laufen zwischen Producer und Consumer für jede kritische API-Grenze, um Drift ([KB-0162](10-openapi-und-vertragswerkzeuge.md)) frühzeitig zu erkennen, ohne den vollständigen Consumer-Stack zu benötigen. Eine kleine, sorgfältig gewählte Anzahl von End-to-End-Tests deckt die kritischsten Geschäftsflüsse vollständig ab. Instabile externe Abhängigkeiten (Drittanbieter-APIs, Zahlungsanbieter) werden in Tests gezielt simuliert/kontrolliert (Mock oder Sandbox), statt echte, potenziell instabile externe Systeme in jedem Testlauf zu treffen.

## Scalability, Reliability, Security und Observability

Diese Testpyramide skaliert Entwicklungsgeschwindigkeit, indem sie schnelle Rückmeldung (viele API-Tests) mit gezielter Integrationssicherheit (wenige, fokussierte End-to-End-Tests) kombiniert. Reliability-Grenze: eine Testsuite mit zu vielen End-to-End-Tests wird „flaky" (inkonsistent fehlschlagend) durch instabile externe Abhängigkeiten oder Timing-Probleme, was das Vertrauen des Teams in die Testsuite untergräbt und dazu führt, dass Fehlschläge ignoriert statt untersucht werden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Testsuite dauert sehr lange und schlägt inkonsistent fehl | zu viele End-to-End-Tests statt fokussierter API-/Contract-Tests | Anzahl und Laufzeit der Testebenen gegen die Testpyramide vergleichen |
| Contract-Test schlägt fehl, obwohl der Service „funktioniert" | tatsächliche Implementierung weicht vom dokumentierten Vertrag ab (das ist der beabsichtigte Zweck) | Diff zwischen Contract-Test-Erwartung und realer Antwort im Detail prüfen |
| Test schlägt fehl wegen einer externen Drittanbieter-API-Instabilität | fehlende Isolation instabiler externer Abhängigkeiten im Test | prüfen, ob der Test gegen ein Mock/eine Sandbox statt der echten externen API läuft |
| Team ignoriert fehlschlagende Tests zunehmend | Testsuite-Instabilität hat Vertrauen untergraben | Fehlschlagrate und tatsächliche Fehlerursachen über Zeit analysieren |

Security: Contract-Tests können auch sicherheitsrelevante Vertragsaspekte prüfen (z. B. dass ein Endpunkt weiterhin Autorisierung erfordert), was Regressionen in der Sicherheitslogik frühzeitig aufdeckt. Observability: Testfehlerraten pro Testebene und -typ sind ein wichtiges Signal für die tatsächliche Gesundheit der Teststrategie, nicht nur eine binäre Bestehen/Scheitern-Momentaufnahme.

## Trade-offs und Entscheidungen

**Staff** wählt für jedes Integrationsrisiko bewusst die passende Testebene statt reflexhaft End-to-End-Tests hinzuzufügen. **Principal** definiert eine Testpyramide (viele Unit-/API-Tests, moderate Contract-Tests, wenige End-to-End-Tests) als Standard. **Chief** verlangt aktive Überwachung der Testsuite-Stabilität und greift ein, wenn Flakiness das Vertrauen des Teams untergräbt.

Anti-Patterns: primär auf End-to-End-Tests setzen statt schneller, fokussierter API-/Contract-Tests; Tests gegen echte, instabile externe Abhängigkeiten laufen lassen statt gegen kontrollierte Mocks/Sandboxes; fehlschlagende Tests ignorieren statt zu untersuchen.

## Production Checklist

- [ ] Testpyramide mit überwiegend schnellen API-/Unit-Tests, moderaten Contract-Tests, wenigen End-to-End-Tests umgesetzt.
- [ ] Contract-Tests laufen für alle kritischen API-Grenzen gegen die dokumentierte Spezifikation.
- [ ] Instabile externe Abhängigkeiten sind in Tests durch Mocks/Sandboxes isoliert.
- [ ] Testsuite-Stabilität (Flakiness-Rate) wird aktiv überwacht.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem API-Test und einem Contract-Test?

**Antwort:** Ein API-Test prüft die interne Logik eines Service isoliert; ein Contract-Test prüft, ob die tatsächliche Antwort eines Service dem dokumentierten Vertrag entspricht, unabhängig von der internen Implementierung.

### 2. Warum sollte die Mehrheit der Tests keine End-to-End-Tests sein?

**Antwort:** End-to-End-Tests sind langsam und anfällig für Instabilität durch echte externe Abhängigkeiten; eine Übergewichtung verlangsamt Entwicklung und untergräbt Vertrauen durch häufige, oft irrelevante Fehlschläge.

### 3. Was bedeutet es, wenn ein Contract-Test fehlschlägt, obwohl der Service „funktioniert"?

**Antwort:** Die tatsächliche Implementierung weicht vom dokumentierten Vertrag ab — das ist genau der Zweck des Contract-Tests: Drift zwischen Dokumentation und Realität aufzudecken, unabhängig davon, ob der Service selbst fehlerfrei läuft.

### 4. Warum sollten Tests gegen instabile externe Abhängigkeiten diese isolieren?

**Antwort:** Sonst wird die Testsuite selbst instabil durch Faktoren außerhalb der eigenen Kontrolle, was echte Fehler von externen Ausfällen nicht mehr unterscheidbar macht und Vertrauen in die Suite untergräbt.

### 5. Was ist ein „flaky test" und warum ist er gefährlich?

**Antwort:** Ein Test, der inkonsistent fehlschlägt, ohne dass sich der geprüfte Code geändert hat — er ist gefährlich, weil Teams beginnen, Fehlschläge zu ignorieren, wodurch auch echte Regressionen übersehen werden können.

### 6. Widersprüchliche Anforderung: Team will vollständige End-to-End-Abdeckung jedes Integrationspfads UND eine schnelle, stabile CI-Pipeline — wie gehst du vor?

**Antwort:** Ich würde die kritischsten Geschäftsflüsse mit gezielten End-to-End-Tests abdecken und die übrige Integrationsabsicherung über Contract-Tests zwischen den beteiligten Services verlagern — das erreicht hohe Integrationssicherheit bei deutlich geringerer Laufzeit und Instabilität als vollständige End-to-End-Abdeckung jedes Pfads.

## Praktische Labs

~~~python
def real_flaky_dependency():
    import random
    if random.random() < 0.3:
        raise ConnectionError("external service temporarily unavailable")
    return {"status": "ok"}

def mocked_dependency():
    return {"status": "ok"}  # deterministic, isolated from real instability

def contract_test(get_response):
    response = get_response()
    assert "status" in response  # validates the contract shape
    return True

result = contract_test(mocked_dependency)  # deterministic pass, isolated from real flakiness
assert result is True
print("Contract test validated the response shape without depending on the real, unstable external service.")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [TestPyramid](https://martinfowler.com/bliki/TestPyramid.html), martinfowler.com, abgerufen 2026-09-17.

Framework-spezifische Test-Tooling-Details (PyTest, Playwright, Selenium) vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Flakiness-Erkennung und -Quarantäne in CI-Systemen | Adopting | Quarantäne-Prozess gegen tatsächliche Root-Cause-Behebung statt dauerhaftes Ignorieren sicherstellen. |

Ein Team akzeptiert eine Integrationsteststrategie erst, wenn die Testpyramide ausgewogen ist und die Testsuite-Stabilität nachweisbar über Zeit überwacht wird.
