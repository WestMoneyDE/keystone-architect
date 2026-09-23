---
{"id": "KB-0682", "title": "Design Docs als Arbeitsinstrument", "domain": "30", "sequence": 6, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0681", "concepts": ["Visueller Problemrahmen", "Widersprüchliche Anforderungen sichtbar auflösen"], "needed_for": "Das Design Doc dokumentiert verbindlich, was in der in KB-0681 beschriebenen Whiteboarding-Sitzung entwickelt und aufgelöst wurde"}], "related": ["KB-0679"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes Vorhaben ein Design Doc mit Kontext, Optionen und Implementierungsfolgen erstellen, das Reviewfeedback und ungelöste Risiken verbindlich dokumentiert.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Vorhaben mehrere Optionen mit nachvollziehbaren Implementierungsfolgen gegenüberstellen und begründen, welche Option unter welchen Randbedingungen gewählt wurde.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Vorhaben ohne dokumentiertes Reviewfeedback oder ohne explizit dokumentierte, ungelöste Risiken in die Umsetzung geht.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Design Docs festlegen, die verbindliche Dokumentation von Reviewfeedback und ungelösten Risiken vor Delivery-Beginn vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale ADR-/RFC-Notation im Detail ist Vertiefung.", "rationale": "Kern ist die praktische Nutzung als Arbeitsinstrument über den gesamten Vorhabenlebenszyklus, nicht die formale Notationsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0682-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung eines Design Docs mit dokumentiertem, ungelöstem Risiko, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Design Doc mit explizit dokumentiertem, ungelöstem Risiko dazu führt, dass dieses Risiko während der Umsetzung tatsächlich rechtzeitig adressiert wird, im Gegensatz zu einem Vorhaben ohne diese Dokumentation.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Design Docs als Arbeitsinstrument

> **Ziel:** Ein Design Doc ist kein einmalig erstelltes, dann archiviertes Dokument, sondern ein tatsächlich lebendiges Arbeitsinstrument über den gesamten Vorhabenlebenszyklus, das drei Elemente zusammenführt: **Kontext** (warum das Vorhaben tatsächlich notwendig ist und welche Randbedingungen gelten), **Optionen** (mehrere tatsächlich erwogene Lösungswege mit ihren jeweiligen Vor- und Nachteilen, nicht nur die letztlich gewählte Option) und **Implementierungsfolgen** (was die gewählte Option tatsächlich für Umsetzung, Betrieb und angrenzende Systeme bedeutet). Der zentrale Punkt dieses Kapitels ist, dass Reviewfeedback und ungelöste Risiken verbindlich dokumentiert werden müssen, bevor die Umsetzung (Delivery) tatsächlich beginnt — ein Vorhaben, das mit unadressiertem Reviewfeedback oder unausgesprochenen, ungelösten Risiken in die Umsetzung startet, trägt diese Probleme tatsächlich unsichtbar in die Implementierung, wo ihre spätere Entdeckung tatsächlich erheblich teurer ist als eine frühzeitige, dokumentierte Klärung.

## Zweck, Mental Model und Dependencies

Kontext zu dokumentieren bedeutet, tatsächlich nachvollziehbar zu machen, warum ein Vorhaben notwendig ist und welche Randbedingungen (technische Altlasten, organisatorische Zwänge, zeitliche Fristen) tatsächlich gelten — ohne diesen Kontext kann ein späterer Leser des Design Docs (etwa ein neues Teammitglied oder ein Reviewer Monate später) die getroffenen Entscheidungen tatsächlich nicht nachvollziehen, selbst wenn die Entscheidung selbst zum damaligen Zeitpunkt vollständig sinnvoll war. Optionen zu dokumentieren, nicht nur die gewählte Lösung, bedeutet tatsächlich sichtbar zu machen, welche Alternativen erwogen und aus welchem Grund verworfen wurden — dies dient nicht nur der Nachvollziehbarkeit, sondern zwingt den Autor tatsächlich dazu, die gewählte Option gegen echte Alternativen zu rechtfertigen, statt sie unhinterfragt als einzig mögliche Lösung darzustellen; ein Design Doc, das nur eine einzige Option beschreibt, hat diese kritische Prüfung tatsächlich nicht durchlaufen. Implementierungsfolgen zu dokumentieren bedeutet, konkret zu benennen, was die gewählte Option tatsächlich für die Umsetzung bedeutet — welche Systeme betroffen sind, welche Migrationsschritte notwendig sind, welche Betriebsänderungen entstehen — diese Konkretisierung macht ein Design Doc tatsächlich zu einem Arbeitsinstrument statt zu einer abstrakten Absichtserklärung. Reviewfeedback verbindlich zu dokumentieren bedeutet, dass Rückmeldungen aus dem Review-Prozess tatsächlich im Dokument selbst festgehalten werden, mit sichtbarer Kennzeichnung, ob und wie sie adressiert wurden — ein Reviewkommentar, der mündlich gegeben, aber nicht schriftlich im Dokument festgehalten wird, geht tatsächlich verloren, sobald die Umsetzung beginnt und der ursprüngliche Kontext verblasst. Ungelöste Risiken verbindlich zu dokumentieren bedeutet, dass ein Risiko, das zum Zeitpunkt der Design-Doc-Finalisierung tatsächlich noch nicht vollständig geklärt ist, explizit als solches benannt wird, statt stillschweigend übergangen zu werden — dies entspricht strukturell der in KB-0677 beschriebenen Trennung von Fakten und offenen Fragen, hier jedoch verbindlich im finalen Arbeitsdokument verankert, sodass das Team während der Umsetzung tatsächlich weiß, worauf besonders zu achten ist.

~~~text
Design Doc = not a one-time-created, then archived document, but ACTUALLY a living work
  instrument across entire project lifecycle, bringing together 3 elements
  CONTEXT: why project is ACTUALLY necessary + what constraints ACTUALLY apply
  OPTIONS: multiple ACTUALLY considered solution paths w/ respective pros/cons, not just
  finally chosen option
  IMPLEMENTATION CONSEQUENCES: what chosen option ACTUALLY means for implementation,
  operations, adjacent systems
KEY POINT: review feedback + unresolved risks must be bindingly documented before
  delivery ACTUALLY begins -- project starting delivery w/ unaddressed review feedback
  or unspoken, unresolved risks ACTUALLY carries these problems invisibly into
  implementation, where later discovery is ACTUALLY substantially more expensive than
  early, documented clarification
DOCUMENTING CONTEXT means ACTUALLY making traceable why a project is necessary + what
  constraints (technical debt, organizational constraints, deadlines) ACTUALLY apply --
  w/o this context, a later reader (new team member, reviewer months later) ACTUALLY
  can't trace decisions made, even if decision itself was fully sensible at the time
DOCUMENTING OPTIONS, not just chosen solution, means ACTUALLY making visible which
  alternatives were considered + for what reason discarded -- serves not just
  traceability but ACTUALLY forces author to justify chosen option against real
  alternatives instead of presenting it unquestioned as only possible solution
  design doc describing only single option has ACTUALLY not undergone this critical
  scrutiny
DOCUMENTING IMPLEMENTATION CONSEQUENCES means concretely naming what chosen option
  ACTUALLY means for implementation -- which systems affected, which migration steps
  necessary, which operational changes arise -- this concretization ACTUALLY makes a
  design doc a work instrument instead of an abstract statement of intent
BINDINGLY DOCUMENTING REVIEW FEEDBACK means feedback from review process ACTUALLY
  captured in document itself, w/ visible marking whether+how addressed -- review
  comment given verbally but not written into document ACTUALLY gets lost once
  implementation begins + original context fades
BINDINGLY DOCUMENTING UNRESOLVED RISKS means a risk ACTUALLY not fully clarified at
  design-doc-finalization time is explicitly named as such, instead of silently glossed
  over -- structurally corresponds to KB-0677's fact/open-question separation, here
  bindingly anchored in final work document so team ACTUALLY knows what to watch for
  during implementation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Dokumentierter Kontext | macht Entscheidungen für spätere Leser nachvollziehbar | verhindert Verlust des Entscheidungsgrunds über die Zeit |
| Dokumentierte Optionen (nicht nur Lösung) | zwingt zur Rechtfertigung gegen echte Alternativen | verhindert unhinterfragte Darstellung als einzig mögliche Lösung |
| Konkrete Implementierungsfolgen | macht das Dokument zum Arbeitsinstrument | verhindert abstrakte Absichtserklärung ohne Umsetzungsbezug |
| Verbindlich dokumentiertes Reviewfeedback | Rückmeldung bleibt über Delivery hinaus sichtbar | verhindert Verlust mündlich gegebener Kommentare |
| Explizit dokumentierte, ungelöste Risiken | Team weiß während Umsetzung, worauf zu achten ist | verhindert stillschweigendes Übergehen offener Punkte |

Implementierung: Das Design Doc wird als lebendes Dokument über den gesamten Vorhabenlebenszyklus geführt, nicht nur einmalig erstellt. Alle erwogenen Optionen sind mit Begründung für Auswahl oder Verwerfung dokumentiert. Reviewfeedback wird schriftlich im Dokument mit Adressierungsstatus festgehalten. Vor Delivery-Beginn werden alle noch ungelösten Risiken explizit als solche benannt.

## Scalability, Reliability, Security und Observability

Eine Design-Doc-Praxis skaliert über die Anzahl der parallel laufenden, dokumentierten Vorhaben; die Reliability-Grenze liegt darin, dass ein unadressiertes, mündlich gegebenes Reviewfeedback oder ein stillschweigend übergangenes Risiko tatsächlich erst während der Umsetzung sichtbar wird, wenn die Korrektur teurer ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| während der Umsetzung taucht ein Problem auf, das im Review bereits angesprochen wurde | das Reviewfeedback wurde mündlich gegeben, aber nicht im Design Doc dokumentiert | einen Prozess einführen, der verpflichtend jedes Reviewfeedback schriftlich im Dokument festhält |
| eine spätere Prüfung kann eine getroffene Entscheidung nicht nachvollziehen | der Kontext und die verworfenen Alternativen wurden nicht dokumentiert | das Design Doc um den ursprünglichen Kontext und die erwogenen, verworfenen Optionen ergänzen |
| ein bekanntes, aber ungelöstes Risiko führt während der Umsetzung zu einem unerwarteten Problem | das Risiko wurde vor Delivery-Beginn nicht explizit dokumentiert | für künftige Vorhaben ungelöste Risiken verpflichtend vor Delivery-Beginn explizit dokumentieren |

Security: Design Docs mit sensiblen, sicherheitsrelevanten Details sollten entsprechend ihrer Vertraulichkeitsstufe zugriffsbeschränkt geführt werden. Observability: Die tatsächliche Anzahl von Design Docs mit vollständig dokumentiertem Reviewfeedback und explizit benannten Risiken vor Delivery-Beginn ist ein zentrales Signal zur Bewertung der Prozessreife.

## Trade-offs und Entscheidungen

**Staff** dokumentiert Kontext und Optionen für ein begrenztes technisches Vorhaben. **Principal** führt ein vollständiges Design Doc mit Implementierungsfolgen, Reviewfeedback und dokumentierten Risiken über den gesamten Vorhabenlebenszyklus. **Chief** legt unternehmensweite Standards fest, die verbindliche Dokumentation von Reviewfeedback und ungelösten Risiken vor Delivery-Beginn vorschreiben.

Anti-Patterns: ein Design Doc erstellen, das nur die gewählte Lösung ohne erwogene Alternativen beschreibt; Reviewfeedback nur mündlich geben, ohne es im Dokument festzuhalten; mit stillschweigend übergangenen, ungelösten Risiken in die Umsetzung starten.

## Production Checklist

- [ ] Kontext und Randbedingungen des Vorhabens sind dokumentiert.
- [ ] Erwogene Optionen mit Begründung für Auswahl oder Verwerfung sind dokumentiert, nicht nur die gewählte Lösung.
- [ ] Implementierungsfolgen sind konkret benannt.
- [ ] Reviewfeedback und ungelöste Risiken sind vor Delivery-Beginn verbindlich dokumentiert.

## Interviewfragen

### 1. Warum sollte ein Design Doc mehrere Optionen dokumentieren, nicht nur die letztlich gewählte Lösung?

**Antwort:** Weil dies den Autor zwingt, die gewählte Option gegen echte Alternativen zu rechtfertigen, statt sie unhinterfragt als einzig mögliche Lösung darzustellen, und die Nachvollziehbarkeit für spätere Leser erhöht.

### 2. Warum ist der dokumentierte Kontext für spätere Leser eines Design Docs wichtig?

**Antwort:** Weil ohne diesen Kontext ein späterer Leser die getroffenen Entscheidungen nicht nachvollziehen kann, selbst wenn die Entscheidung zum damaligen Zeitpunkt vollständig sinnvoll war.

### 3. Was passiert, wenn Reviewfeedback nur mündlich gegeben, aber nicht im Design Doc dokumentiert wird?

**Antwort:** Das Feedback geht tatsächlich verloren, sobald die Umsetzung beginnt und der ursprüngliche Kontext verblasst.

### 4. Warum müssen ungelöste Risiken vor Delivery-Beginn explizit dokumentiert werden?

**Antwort:** Damit das Team während der Umsetzung tatsächlich weiß, worauf besonders zu achten ist, statt das Risiko stillschweigend zu übergehen und es erst später, teurer, zu entdecken.

### 5. Wie gehst du vor, wenn während der Umsetzung ein Problem auftaucht, das im Review bereits angesprochen wurde?

**Antwort:** Ich prüfe, ob das Reviewfeedback schriftlich im Design Doc dokumentiert war, und etabliere für künftige Vorhaben einen Prozess, der verpflichtend jedes Reviewfeedback schriftlich festhält.

### 6. Widersprüchliche Anforderung: Das Team will schnellen Umsetzungsbeginn ohne ausgedehnte Dokumentationsarbeit UND die Organisation will vollständige Nachvollziehbarkeit von Kontext, Optionen und Risiken — wie gehst du vor?

**Antwort:** Ich würde die Dokumentation auf die tatsächlich entscheidungsrelevanten Elemente (Kontext, erwogene Alternativen, ungelöste Risiken) fokussieren und auf ausführliche, aber wenig relevante Details verzichten, sodass die Dokumentationsarbeit begrenzt bleibt, ohne die tatsächlich kritische Nachvollziehbarkeit zu verlieren.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team erstellt ein Design Doc für die Einführung von Event-Driven Commerce (angelehnt an KB-0670). Im Review äußert ein Reviewer mündlich Bedenken zur Ownership-Klärung eines bestimmten Fachereignisses, die jedoch zunächst nicht schriftlich im Dokument festgehalten wird.

~~~python
# Local, deterministic illustration of tracking review feedback and unresolved risks in a design doc (fictional lab example, no real project):

design_doc = {
    "context": "Migration to event-driven order processing",
    "options": ["Option A: Full event-driven", "Option B: Hybrid with sync fallback"],
    "review_feedback": [],
    "unresolved_risks": [],
}

def add_review_feedback(doc, feedback, addressed=False):
    doc["review_feedback"].append({"feedback": feedback, "addressed": addressed})

def check_delivery_readiness(doc):
    unaddressed = [f for f in doc["review_feedback"] if not f["addressed"]]
    return {"ready": len(unaddressed) == 0 and len(doc["unresolved_risks"]) == 0, "unaddressed_feedback": unaddressed}

add_review_feedback(design_doc, "Ownership for 'stock.reserved' event unclear", addressed=False)
print(check_delivery_readiness(design_doc))
~~~

Erwartete Beobachtung: Die Delivery-Bereitschaftsprüfung zeigt korrekt an, dass das Reviewfeedback zur Ownership-Klärung noch nicht adressiert ist. Auswertung: Ohne diese explizite, dokumentierte Prüfung hätte das Team möglicherweise mit dem ungeklärten Ownership-Punkt in die Umsetzung gestartet, was später zu genau dem in KB-0670 beschriebenen Ownership-Problem geführt hätte.

## Dependencies, Cross-References und Quellen

1. Google: [Google Engineering Practices — Design Docs](https://google.github.io/eng-practices/), abgerufen 2026-09-18.
2. Michael Nygard: [Documenting Architecture Decisions — ADR Format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0681 (Whiteboarding unter Unsicherheit) beschriebenen visuellen Konfliktauflösung auf, deren Ergebnis im Design Doc verbindlich dokumentiert wird.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Vollständigkeitsprüfung von Design Docs zur automatisierten Erkennung fehlender Alternativen oder unadressierten Reviewfeedbacks | Emerging | Bei künftigen Vorhaben als Ergänzung zur menschlichen Review-Praxis evaluieren, jedoch die finale Entscheidung über Vollständigkeit und Delivery-Bereitschaft weiterhin durch den verantwortlichen Reviewer treffen lassen. |

Ein Team akzeptiert ein Design Doc erst delivery-bereit, wenn Kontext, Optionen und Implementierungsfolgen dokumentiert sind und Reviewfeedback sowie ungelöste Risiken vollständig, verbindlich adressiert oder explizit benannt sind.
