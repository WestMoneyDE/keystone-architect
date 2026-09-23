---
{"id": "KB-0244", "title": "Prompt Design und Anweisungsstruktur", "domain": "11", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0243", "concepts": ["Kontextfenster", "Positionsabhängigkeit"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein reproduzierbares Vergleichsfall-Set zur Prompt-Robustheitsprüfung lokal implementieren.", "rationale": "Robustheit einer Anweisungsformulierung wird erst durch systematischen Vergleich unterschiedlicher Formulierungsvarianten messbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Rollen-, Beispiel- und Constraint-Struktur für einen konkreten Anwendungsfall begründet gestalten, mit expliziter Prioritätsordnung bei Konflikten.", "rationale": "Unklare Priorität zwischen mehreren Anweisungsteilen erzeugt bei Konflikten unvorhersehbares Modellverhalten."}, "STAFF-TARGET": {"active": true, "scope": "Inkonsistentes Modellverhalten bei leicht unterschiedlichen Formulierungen auf fehlende Robustheitsprüfung statt auf Modellinstabilität zurückführen können.", "rationale": "Ohne systematische Vergleichsfälle wird Formulierungs-Sensitivität oft fälschlich als grundsätzliche Modellunzuverlässigkeit interpretiert."}, "CHIEF-TARGET": {"active": true, "scope": "Prompt Design als überprüfbare, reproduzierbare Ingenieursdisziplin positionieren, nicht als informelles Ausprobieren einzelner Formulierungen.", "rationale": "Ohne reproduzierbare Vergleichsfälle bleibt Prompt-Qualität eine subjektive, nicht validierbare Einschätzung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Anbieterspezifische Prompt-Formatierungsempfehlungen (z. B. XML-Tags, spezielle Systemrollen-Syntax) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Rollen, Beispielen, Constraints und Prioritätsordnung, nicht die anbieterspezifische Syntax."}}, "lab_validation": [{"lab_id": "KB-0244-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für reproduzierbare Vergleichsfälle zur Prompt-Robustheitsprüfung", "evidence": "Ein Set reproduzierbarer Testfälle mit leicht variierten Formulierungen erlaubt, Formulierungs-Sensitivität systematisch zu messen, statt sie anekdotisch zu vermuten.", "limitations": "Kein echtes trainiertes Modell, keine reale Nutzerinteraktion, keine Produktion."}]}
---
# Prompt Design und Anweisungsstruktur

> **Ziel:** Prompt Design ist eine überprüfbare, reproduzierbare Ingenieursdisziplin — Rollen, Beispiele und Constraints werden strukturiert kombiniert, mit expliziter Priorität bei Konflikten, und Robustheit wird durch reproduzierbare Vergleichsfälle systematisch validiert, statt Formulierungen informell auszuprobieren und subjektiv zu bewerten.

## Zweck, Mental Model und Dependencies

Rollen definieren, in welcher Funktion oder Perspektive ein Modell antworten soll (z. B. "du bist ein technischer Reviewer, der auf Sicherheitslücken fokussiert") — sie setzen einen interpretativen Rahmen, der beeinflusst, welche Aspekte einer Aufgabe das Modell priorisiert. Beispiele (Few-Shot-Demonstrationen) zeigen dem Modell konkrete Ein-/Ausgabe-Paare, die das gewünschte Format und Verhalten demonstrieren, oft wirksamer als rein abstrakte Beschreibung, weil sie implizite Erwartungen explizit machen. Constraints sind explizite Einschränkungen (Formatvorgaben, Längenlimits, verbotene Inhalte), die den Lösungsraum des Modells begrenzen. Der zentrale Risikofaktor ist Priorität bei Konflikten: wenn Rollenbeschreibung, Beispiele und Constraints widersprüchliche Signale senden (z. B. ein Beispiel zeigt ein Verhalten, das einer expliziten Regel widerspricht), ist das resultierende Modellverhalten unvorhersehbar, wenn keine explizite Priorisierung kommuniziert wird. Robuste Aufgabenformulierung bedeutet, dass eine Anweisung bei leicht unterschiedlicher, aber semantisch äquivalenter Formulierung konsistente Ergebnisse liefert — diese Robustheit ist nicht selbstverständlich und muss durch reproduzierbare Vergleichsfälle (dieselbe Aufgabe, mehrere Formulierungsvarianten, systematischer Ergebnisvergleich) aktiv geprüft werden, statt informell anhand einzelner Testeingaben angenommen zu werden. Lies [KB-0243](03-kontextfenster-und-informationsgrenzen.md).

~~~text
Role:        sets interpretive frame -> which aspects of a task get prioritized
Examples:     concrete input/output pairs -> make implicit expectations explicit, often more effective than abstract description
Constraints:  explicit limits (format, length, forbidden content) -> bound the solution space
Conflict between role/examples/constraints -> UNPREDICTABLE behavior without explicit priority ordering
Robustness: same task, varied phrasing -> consistent results? Must be TESTED via reproducible comparison cases, not assumed
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Prioritätsordnung | ist bei möglichen Konflikten zwischen Rolle, Beispielen und Constraints eine Priorität kommuniziert? | widersprüchliche Anweisungsteile ohne Priorität erzeugen unvorhersehbares Verhalten |
| Beispielqualität und -repräsentativität | sind Beispiele repräsentativ für die tatsächliche Aufgabenverteilung, nicht nur Idealfälle? | unrepräsentative Beispiele erzeugen systematische Verzerrung Richtung der gezeigten Fälle |
| Reproduzierbare Vergleichsfälle | wird Formulierungsrobustheit durch systematischen Vergleich getestet? | ohne systematischen Test bleibt Formulierungs-Sensitivität unentdeckt bis zu einem Produktionsproblem |
| Mehrdeutigkeitsvermeidung | ist die Aufgabenformulierung auf implizite Mehrdeutigkeit geprüft? | mehrdeutige Formulierungen erlauben mehrere valide Interpretationen mit unterschiedlichem Ergebnis |

Implementierung: bei der Gestaltung eines Prompts wird explizit dokumentiert, welche Anweisungsquelle (Rollenbeschreibung, Beispiele, Constraints) im Konfliktfall Vorrang hat, statt implizit zu hoffen, dass das Modell "richtig" interpretiert. Beispiele werden bewusst repräsentativ für die tatsächliche Verteilung erwarteter Aufgaben ausgewählt, inklusive Grenzfällen, nicht nur einfacher Idealfälle. Robustheit wird durch ein Set reproduzierbarer Vergleichsfälle geprüft — dieselbe fachliche Aufgabe wird in mehreren, leicht unterschiedlichen Formulierungen getestet, mit systematischem Vergleich der Ergebniskonsistenz, bevor ein Prompt als produktionsreif gilt. Aufgabenformulierungen werden explizit auf potenzielle Mehrdeutigkeit geprüft (könnte diese Anweisung auf mehr als eine plausible Weise interpretiert werden?), mit Präzisierung, wo Mehrdeutigkeit identifiziert wird.

## Scalability, Reliability, Security und Observability

Gut strukturiertes Prompt Design skaliert konsistentes Modellverhalten über viele Nutzer und Eingabevarianten, wenn Robustheit systematisch getestet statt informell angenommen wurde. Reliability-Grenze: ein Prompt, der nur gegen wenige informelle Testeingaben geprüft wurde, kann in Produktion bei bisher ungetesteten, aber semantisch ähnlichen Formulierungen unerwartet inkonsistent reagieren, was ohne systematische Vergleichsfälle erst nach Produktivsetzung auffällt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Modell reagiert bei leicht unterschiedlichen, aber äquivalenten Formulierungen inkonsistent | fehlende Robustheitsprüfung, Formulierungs-Sensitivität wurde nicht systematisch getestet | reproduzierbares Vergleichsfall-Set mit variierten Formulierungen der Aufgabe erstellen und Ergebniskonsistenz messen |
| Modellverhalten widerspricht einer expliziten Constraint, obwohl diese klar formuliert war | ein Beispiel oder die Rollenbeschreibung sendet ein widersprüchliches Signal ohne geklärte Priorität | Prompt auf widersprüchliche Signale zwischen Rolle, Beispielen und Constraints prüfen |
| unterschiedliche Nutzer erhalten für dieselbe fachliche Anfrage qualitativ unterschiedliche Antworten | Aufgabenformulierung ist mehrdeutig, erlaubt mehrere valide Interpretationen | Formulierung auf alternative plausible Interpretationen prüfen |
| bereitgestellte Beispiele scheinen das Modell in eine unerwünschte Richtung zu lenken | Beispiele sind nicht repräsentativ für die tatsächliche Aufgabenverteilung | Beispielauswahl gegen die tatsächliche Verteilung realer Anfragen prüfen |

Security: Prompt-Strukturen, die Nutzereingaben direkt in privilegierte Anweisungsteile einbetten, ohne klare Trennung zwischen vertrauenswürdigen Systemanweisungen und potenziell manipulativen Nutzereingaben, erhöhen das Risiko von Prompt-Injection-Angriffen — strukturelle Trennung zwischen Anweisungsebenen ist eine wichtige Sicherheitsmaßnahme. Observability: Ergebniskonsistenz über Formulierungsvarianten (Robustheitsmetrik), Häufigkeit widersprüchlicher Interpretationen und Nutzerfeedback-Muster sind zentrale Metriken für Prompt-Design-Qualität.

## Trade-offs und Entscheidungen

**Staff** testet Formulierungsrobustheit systematisch mit reproduzierbaren Vergleichsfällen vor Produktivsetzung. **Principal** macht Prioritätsordnung zwischen Rolle, Beispielen und Constraints für das Team explizit dokumentiert. **Chief** positioniert Prompt Design als überprüfbare Ingenieursdisziplin mit reproduzierbaren Validierungsmethoden, nicht als informelles Ausprobieren.

Anti-Patterns: Prompts nur gegen wenige informelle Testeingaben prüfen, ohne systematische Vergleichsfälle; widersprüchliche Signale zwischen Rolle, Beispielen und Constraints ohne geklärte Priorität belassen; unrepräsentative, nur idealtypische Beispiele verwenden, die die tatsächliche Aufgabenverteilung nicht widerspiegeln.

## Production Checklist

- [ ] Priorität zwischen Rolle, Beispielen und Constraints ist bei möglichen Konflikten explizit dokumentiert.
- [ ] Beispiele sind repräsentativ für die tatsächliche Aufgabenverteilung, inklusive Grenzfälle.
- [ ] Formulierungsrobustheit ist durch ein reproduzierbares Vergleichsfall-Set systematisch getestet.
- [ ] Aufgabenformulierung ist auf potenzielle Mehrdeutigkeit geprüft.

## Interviewfragen

### 1. Warum ist explizite Priorität zwischen Rolle, Beispielen und Constraints wichtig?

**Antwort:** Wenn diese Anweisungsteile widersprüchliche Signale senden (z. B. ein Beispiel widerspricht einer expliziten Regel), ist das resultierende Modellverhalten ohne geklärte Priorität unvorhersehbar — explizite Priorisierung reduziert diese Unsicherheit.

### 2. Warum reicht informelles Testen weniger Eingaben nicht aus, um Prompt-Robustheit zu validieren?

**Antwort:** Einzelne Testeingaben decken nicht die Bandbreite semantisch äquivalenter, aber sprachlich unterschiedlicher Formulierungen ab, die in Produktion tatsächlich auftreten; nur ein systematisches Vergleichsfall-Set macht Formulierungs-Sensitivität messbar, statt sie unentdeckt zu lassen.

### 3. Warum sind Beispiele oft wirksamer als rein abstrakte Beschreibung?

**Antwort:** Beispiele demonstrieren konkrete Ein-/Ausgabe-Paare, die implizite Erwartungen (Format, Detailgrad, Tonfall) explizit machen, die eine rein abstrakte Beschreibung oft nicht vollständig vermitteln kann.

### 4. Wie diagnostizierst du inkonsistentes Modellverhalten bei leicht unterschiedlichen, aber äquivalenten Formulierungen?

**Antwort:** Ich erstelle ein reproduzierbares Vergleichsfall-Set mit systematisch variierten Formulierungen derselben Aufgabe und messe die Ergebniskonsistenz — das trennt echte Formulierungs-Sensitivität von zufälligen Einzelbeobachtungen.

### 5. Warum können unrepräsentative Beispiele das Modellverhalten systematisch verzerren?

**Antwort:** Wenn Beispiele nur idealtypische Fälle zeigen, ohne die tatsächliche Verteilung realer Anfragen (inklusive Grenzfälle) widerzuspiegeln, kann das Modell dazu neigen, alle Eingaben in Richtung der gezeigten Idealfälle zu interpretieren, auch wenn die tatsächliche Anfrage abweicht.

### 6. Widersprüchliche Anforderung: Team will einen möglichst kurzen, knappen Prompt für minimalen Tokenverbrauch UND maximale Robustheit über eine breite Bandbreite an Formulierungsvarianten der Nutzeranfragen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Robustheit über breite Formulierungsvarianten oft explizitere Constraints und mehr repräsentative Beispiele erfordert, was dem Ziel minimaler Länge entgegensteht; ich würde vorschlagen, systematisch zu testen, welche minimale Konstrukt-Kombination (Rolle, Beispiele, Constraints) die geforderte Robustheit noch erreicht, statt Kürze oder Robustheit isoliert zu optimieren, und einen dokumentierten Kompromiss basierend auf den Testergebnissen zu wählen.

## Praktische Labs

~~~python
# Reproducible comparison cases for prompt robustness testing
def simulate_model_response(prompt_variant, task_keywords):
    # simplified simulation: response quality depends on keyword coverage
    matched = sum(1 for kw in task_keywords if kw.lower() in prompt_variant.lower())
    return matched / len(task_keywords)

task_keywords = ["summarize", "three", "bullet", "points"]

phrasing_variants = [
    "Summarize this document in three bullet points.",
    "Please provide a summary using three bullet points.",
    "Give me a three-point bullet summary.",
    "Can you condense this into some bullets?",  # missing "three", "summarize" explicit
]

results = []
for variant in phrasing_variants:
    quality = simulate_model_response(variant, task_keywords)
    results.append((variant, quality))
    print(f"'{variant}' -> coverage score: {quality:.2f}")

quality_scores = [q for _, q in results]
variance = max(quality_scores) - min(quality_scores)
print(f"\nQuality variance across phrasing: {variance:.2f}")
assert variance > 0.2
print("Significant variance detected - this phrasing set is NOT robust and needs refinement before production use.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview), abgerufen 2026-09-17.
2. OpenAI: [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering), abgerufen 2026-09-17.
3. Brown et al.: [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165), NeurIPS 2020, abgerufen 2026-09-17.

Kontextfenster- und Transformer-Grundlagen sind kanonisch in [KB-0243](03-kontextfenster-und-informationsgrenzen.md) behandelt. Anbieterspezifische Formatierungsempfehlungen vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Prompt-Optimierungswerkzeuge, die Formulierungsvarianten systematisch gegen definierte Metriken testen | Adopting | Für kritische, häufig genutzte Prompts gegenüber rein manueller Iteration bevorzugen. |
| Strukturierte Prompt-Formate mit expliziten Trennzeichen (z. B. XML-Tags) zur Reduktion von Mehrdeutigkeit | Established | Für komplexe, mehrteilige Anweisungen standardmäßig gegenüber unstrukturiertem Fließtext nutzen. |

Ein Team akzeptiert ein Prompt-Design erst, wenn Formulierungsrobustheit durch reproduzierbare Vergleichsfälle nachweisbar getestet und Prioritätsordnung bei Konflikten dokumentiert sind.
