---
{"id": "KB-0363", "title": "Promptfoo und Konfigurationstests", "domain": "15", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0244", "concepts": ["Prompt Design und Anweisungsstruktur"], "needed_for": "understanding"}, {"id": "KB-0359", "concepts": ["Daten-, Modell- und Promptversionen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Prompt-/Provider-/Testfallmatrix mit Promptfoo konfigurieren, Assertions definieren und einen reproduzierbaren Vergleichslauf ausführen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Testsuite mit Assertions und Red-Team-Testfällen gestalten, die in den regulären Entwicklungsablauf integriert wird und fehlgeschlagene Assertions nachvollziehbar priorisiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Bei mehreren gleichzeitig fehlgeschlagenen Assertions entscheiden, welche zuerst behoben werden müssen, basierend auf Schweregrad statt Reihenfolge im Testlauf.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Konfigurationstests mit Prompt-/Provider-/Testfallmatrizen als verpflichtenden Bestandteil jeder Prompt- oder Provideränderung im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene, automatisierte Red-Team-Testfallgenerierung ist Vertiefung.", "rationale": "Kern ist das Verständnis von Matrixtests, Assertions und Priorisierung, nicht die automatisierte Generierung neuer Red-Team-Fälle."}}, "lab_validation": [{"lab_id": "KB-0363-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simulierte Promptfoo-Matrix mit mehreren Prompt-Varianten, Testfällen und Assertions", "evidence": "Eine simulierte Matrix aus mehreren Prompt-Varianten und Testfällen mit Assertions identifiziert eine Prompt-Variante, die bei einem sicherheitsrelevanten Red-Team-Testfall fehlschlägt, während sie bei allgemeinen Funktionstestfällen besteht; die fehlgeschlagene Assertion wird aufgrund ihres sicherheitsrelevanten Charakters vor rein stilistischen Fehlschlägen priorisiert.", "limitations": "Kein produktives Promptfoo-System, kein realer Geschäftsdatensatz, kleine simulierte Testmatrix."}]}
---
# Promptfoo und Konfigurationstests

> **Ziel:** Promptfoo führt Prompt-, Provider- und Testfallmatrizen aus — jede Kombination aus Prompt-Variante, LLM-Provider und Testfall wird systematisch gegen definierte Assertions (automatisierte Erfolgskriterien) geprüft, aufbauend auf den Grundlagen des Prompt Designs (siehe [KB-0244](../11-genai-architecture/04-prompt-design-und-anweisungsstruktur.md)) und der Release-Set-Versionierung (siehe [KB-0359](09-daten-modell-und-promptversionen.md)). Der zentrale Punkt dieses Kapitels ist die Integration solcher Tests, einschließlich Red-Team-Fällen (gezielt konstruierte, potenziell problematische Eingaben), in den regulären Entwicklungsablauf und die nachvollziehbare Priorisierung fehlgeschlagener Assertions nach Schweregrad statt nach zufälliger Reihenfolge.

## Zweck, Mental Model und Dependencies

Eine Prompt-/Provider-/Testfallmatrix testet systematisch alle relevanten Kombinationen: mehrere Prompt-Varianten (z. B. unterschiedliche Formulierungen derselben Anweisung) gegen mehrere Provider (z. B. unterschiedliche LLM-Anbieter oder -Modelle) gegen mehrere Testfälle (konkrete Eingaben mit erwartetem Verhalten). Eine Assertion ist ein automatisiertes, überprüfbares Erfolgskriterium für einen Testfall (z. B. "die Antwort muss ein bestimmtes Schlüsselwort enthalten", "die Antwort darf keine bestimmten verbotenen Inhalte enthalten"), das nach jedem Lauf automatisch als bestanden oder fehlgeschlagen bewertet wird. Red-Team-Fälle sind gezielt konstruierte Testfälle, die versuchen, unerwünschtes Verhalten hervorzurufen (z. B. Umgehung von Sicherheitsrichtlinien, Preisgabe sensibler Informationen), und werden wie reguläre Testfälle in dieselbe Matrix integriert, statt als separater, seltener Prozess behandelt zu werden. Der zentrale methodische Punkt bei mehreren gleichzeitig fehlgeschlagenen Assertions ist die Priorisierung nach Schweregrad: eine fehlgeschlagene sicherheitsrelevante Red-Team-Assertion (z. B. eine umgangene Sicherheitsrichtlinie) ist grundsätzlich schwerwiegender als eine fehlgeschlagene rein stilistische Assertion (z. B. eine leicht abweichende Formatierung) und muss entsprechend vor dieser behoben werden, unabhängig von der Reihenfolge, in der die Fehlschläge im Testlauf erscheinen.

~~~text
Prompt/provider/test-case MATRIX: every combination systematically tested
  prompt variant A/B/C x provider X/Y x test case 1/2/3 -> all combinations checked
Assertion: automated, checkable success criterion per test case (must contain X / must NOT contain Y)
  -> automatically PASS/FAIL after each run
Red-team case: deliberately constructed test case trying to elicit undesired behavior (policy bypass, sensitive disclosure)
  -> integrated into the SAME matrix as regular test cases, not a rare separate process
PRIORITIZATION RULE: failed assertions ranked by SEVERITY, not run-order
  failed SECURITY-relevant red-team assertion > failed purely stylistic assertion, ALWAYS, regardless of listing order
~~~

## Core Concepts, Architektur und Implementierung

| Element | Funktion | Priorisierungsrelevanz |
|---|---|---|
| Prompt-/Provider-/Testfallmatrix | testet systematisch alle relevanten Kombinationen | macht sichtbar, ob ein Problem prompt-, provider- oder testfallspezifisch ist |
| Assertion | automatisiertes, überprüfbares Erfolgskriterium | Grundlage für die automatisierte Bewertung bestanden/fehlgeschlagen |
| Red-Team-Fall | gezielt konstruierter, potenziell problematischer Testfall | fehlgeschlagene Assertions hier erhalten grundsätzlich höchste Priorität |

Implementierung: Für jede Prompt-Änderung wird die vollständige Matrix aus relevanten Prompt-Varianten, unterstützten Providern und definierten Testfällen (einschließlich Red-Team-Fällen) automatisiert ausgeführt. Jeder Testfall ist mit mindestens einer Assertion versehen, die automatisch bestanden oder fehlgeschlagen bewertet wird. Bei mehreren gleichzeitig fehlgeschlagenen Assertions wird zunächst geprüft, ob sicherheitsrelevante Red-Team-Assertions betroffen sind — diese werden vor allen anderen Fehlschlägen (funktional, stilistisch) priorisiert behoben, unabhängig von ihrer Position im Testbericht.

## Scalability, Reliability, Security und Observability

Matrixtests skalieren Testabdeckung proportional zur Anzahl der Prompt-Varianten, Provider und Testfälle; die Reliability-Grenze liegt darin, dass eine fehlende Priorisierung bei vielen gleichzeitig fehlgeschlagenen Assertions dazu führen kann, dass sicherheitsrelevante Fehlschläge in der Masse funktionaler oder stilistischer Fehlschläge untergehen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine sicherheitsrelevante Sicherheitslücke in einer Prompt-Variante wird trotz bestehender Tests erst spät entdeckt | kein Red-Team-Testfall für dieses spezifische Umgehungsszenario war in der Matrix enthalten | die Matrix um den entdeckten Red-Team-Fall erweitern und alle Prompt-Varianten erneut dagegen testen |
| ein Team behebt bei vielen gleichzeitig fehlgeschlagenen Assertions zuerst einfache, stilistische Probleme statt sicherheitsrelevanter Fehlschläge | keine explizite Priorisierung nach Schweregrad wurde vor der Fehlerbehebung durchgeführt | die fehlgeschlagenen Assertions nach Schweregrad (sicherheitsrelevant vor funktional vor stilistisch) neu sortieren |
| ein Prompt funktioniert bei einem Provider, aber nicht bei einem anderen | die Matrix hat providerspezifische Unterschiede aufgedeckt, die bei nur einem getesteten Provider unentdeckt geblieben wären | die providerspezifischen Testergebnisse der Matrix vergleichen, um die Ursache des Unterschieds zu isolieren |

Security: Die Integration von Red-Team-Fällen in die reguläre Testmatrix stellt sicher, dass sicherheitsrelevante Testfälle bei jeder Prompt-Änderung automatisch mitgeprüft werden, statt nur gelegentlich oder manuell. Observability: Die Bestehensrate pro Prompt-Variante/Provider-Kombination, die Anzahl fehlgeschlagener Red-Team-Assertions und die durchschnittliche Zeit bis zur Behebung priorisierter (sicherheitsrelevanter) Fehlschläge sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine vollständige Prompt-/Provider-/Testfallmatrix inklusive Red-Team-Fällen für jede Prompt-Änderung. **Principal** macht die Priorisierung fehlgeschlagener Assertions nach Schweregrad für das Team nachvollziehbar. **Chief** etabliert Konfigurationstests mit Matrizen als verpflichtenden Bestandteil jeder Prompt- oder Provideränderung im Unternehmen.

Anti-Patterns: Red-Team-Fälle nur gelegentlich manuell statt als fester Bestandteil der regulären Testmatrix prüfen; fehlgeschlagene Assertions in der Reihenfolge des Testberichts statt nach Schweregrad beheben; eine Prompt-Änderung ohne vollständigen Matrixlauf über alle unterstützten Provider freigeben.

## Production Checklist

- [ ] Jede Prompt-Änderung durchläuft die vollständige Prompt-/Provider-/Testfallmatrix.
- [ ] Red-Team-Fälle sind fester Bestandteil der regulären Testmatrix, nicht ein separater, seltener Prozess.
- [ ] Fehlgeschlagene Assertions werden nach Schweregrad, nicht nach Reihenfolge im Testbericht priorisiert.
- [ ] Sicherheitsrelevante Red-Team-Assertions werden vor funktionalen und stilistischen Fehlschlägen behoben.

## Interviewfragen

### 1. Was testet eine Prompt-/Provider-/Testfallmatrix systematisch?

**Antwort:** Alle relevanten Kombinationen aus Prompt-Varianten, unterstützten LLM-Providern und definierten Testfällen, um sichtbar zu machen, ob ein Problem prompt-, provider- oder testfallspezifisch ist.

### 2. Was ist eine Assertion in diesem Kontext?

**Antwort:** Ein automatisiertes, überprüfbares Erfolgskriterium für einen Testfall, das nach jedem Lauf automatisch als bestanden oder fehlgeschlagen bewertet wird.

### 3. Warum sollten Red-Team-Fälle Teil der regulären Testmatrix statt eines separaten Prozesses sein?

**Antwort:** Damit sicherheitsrelevante Testfälle bei jeder Prompt-Änderung automatisch mitgeprüft werden, statt nur gelegentlich oder manuell, was das Risiko unentdeckter Sicherheitslücken reduziert.

### 4. Nach welchem Kriterium priorisierst du mehrere gleichzeitig fehlgeschlagene Assertions?

**Antwort:** Nach Schweregrad — eine fehlgeschlagene sicherheitsrelevante Red-Team-Assertion wird grundsätzlich vor funktionalen oder stilistischen Fehlschlägen behoben, unabhängig von der Reihenfolge im Testbericht.

### 5. Wie gehst du vor, wenn ein Team bei vielen Fehlschlägen zuerst einfache, stilistische Probleme behebt?

**Antwort:** Ich führe eine explizite Priorisierung nach Schweregrad ein, die sicherheitsrelevante Fehlschläge unabhängig von ihrer Position im Testbericht an erste Stelle setzt.

### 6. Widersprüchliche Anforderung: Team will schnelle Prompt-Iteration UND garantiert vollständige Sicherheitstestabdeckung bei jeder Änderung — wie gehst du vor?

**Antwort:** Ich würde die vollständige Prompt-/Provider-/Testfallmatrix inklusive Red-Team-Fällen automatisiert bei jeder Änderung ausführen lassen, sodass keine manuelle Zusatzarbeit die Iterationsgeschwindigkeit bremst, während eine automatische Priorisierung sicherstellt, dass sicherheitsrelevante Fehlschläge nie unentdeckt bleiben, bevor eine Änderung freigegeben wird.

## Praktische Labs

~~~python
test_matrix = [
    {"prompt_variant": "v1", "provider": "provider_a", "test_case": "basic_qa", "type": "functional", "passed": True},
    {"prompt_variant": "v1", "provider": "provider_a", "test_case": "formatting_check", "type": "stylistic", "passed": False},
    {"prompt_variant": "v1", "provider": "provider_b", "test_case": "policy_bypass_attempt", "type": "red_team", "passed": False},
    {"prompt_variant": "v2", "provider": "provider_a", "test_case": "policy_bypass_attempt", "type": "red_team", "passed": True},
]

severity_order = {"red_team": 0, "functional": 1, "stylistic": 2}

failures = [t for t in test_matrix if not t["passed"]]
failures_sorted = sorted(failures, key=lambda t: severity_order[t["type"]])

print("Failed assertions, prioritized by severity (not by run order):")
for f in failures_sorted:
    print(f"  [{f['type'].upper()}] prompt={f['prompt_variant']}, provider={f['provider']}, test={f['test_case']}")

if failures_sorted[0]["type"] == "red_team":
    print("\nACTION: fix the red-team (security-relevant) failure FIRST, before any stylistic fix.")
~~~

## Dependencies, Cross-References und Quellen

1. Promptfoo-Dokumentation: [Configuration Guide](https://www.promptfoo.dev/docs/configuration/guide/), abgerufen 2026-09-17.
2. Promptfoo-Dokumentation: [Red Teaming LLM Applications](https://www.promptfoo.dev/docs/red-team/), abgerufen 2026-09-17.

Prompt Design und Anweisungsstruktur sind kanonisch in [KB-0244](../11-genai-architecture/04-prompt-design-und-anweisungsstruktur.md) behandelt; Daten-, Modell- und Promptversionen in [KB-0359](09-daten-modell-und-promptversionen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, LLM-gestützte Generierung neuer Red-Team-Testfälle basierend auf beobachteten Angriffsmustern | Evaluating | Gegenüber rein manuell kuratierten Red-Team-Fällen abwägen, sobald die generierten Fälle nachweislich relevante neue Schwachstellen aufdecken. |
| Automatisierte Schweregrad-Klassifikation fehlgeschlagener Assertions basierend auf inhaltlicher Analyse statt fester Kategorien | Evaluating | Gegenüber fest kategorisierten Schweregraden abwägen, sobald die automatisierte Klassifikation nachweislich zuverlässig ist. |

Ein Team akzeptiert eine Prompt- oder Provideränderung erst, wenn die vollständige Testmatrix ausgeführt wurde und alle sicherheitsrelevanten Red-Team-Assertions bestehen.
