---
{"id": "KB-0681", "title": "Whiteboarding unter Unsicherheit", "domain": "30", "sequence": 5, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0677", "concepts": ["Fakten-/Annahmen-Trennung"], "needed_for": "Whiteboarding macht die in KB-0677 beschriebene Trennung von Fakten und Annahmen visuell während der gemeinsamen Designarbeit sichtbar"}], "related": ["KB-0678"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes, unsicheres Architekturproblem einen Problemrahmen und Datenflüsse visuell entwickeln und dabei Annahmen explizit von gesicherten Fakten unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Whiteboarding-Szenario die tatsächlich angemessene Detailtiefe steuern und widersprüchliche Anforderungen während der gemeinsamen Designarbeit nachvollziehbar visuell auflösen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Whiteboarding-Sitzung in unangemessene Detailtiefe abdriftet, sodass der eigentliche Problemrahmen tatsächlich aus dem Blick gerät.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für gemeinsame Designarbeit festlegen, die eine sichtbare Trennung von Annahmen und Fakten sowie nachvollziehbare Auflösung von Zielkonflikten vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale C4-Notation im Detail ist Vertiefung.", "rationale": "Kern ist die Moderationspraxis unter Unsicherheit, nicht die formale Notationsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0681-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung visueller Fakten-/Annahmen-Trennung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine Whiteboarding-Sitzung ohne visuelle Kennzeichnung Annahmen implizit als Fakten behandelt, während eine explizite visuelle Markierung (etwa Farbcodierung) diese Unterscheidung für alle Beteiligten sichtbar macht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Whiteboarding unter Unsicherheit

> **Ziel:** Whiteboarding unter Unsicherheit ist die gemeinsame, visuelle Entwicklung eines Problemrahmens (die Abgrenzung, was tatsächlich zum betrachteten Problem gehört und was nicht) und der zugehörigen Datenflüsse, während zugleich tatsächlich vorhandene Unsicherheit — fehlendes Wissen, ungeklärte Annahmen — explizit sichtbar bleibt, statt in der visuellen Darstellung implizit als Gewissheit dargestellt zu werden. Der zentrale Punkt dieses Kapitels ist die Steuerung der Detailtiefe: Eine Whiteboarding-Sitzung, die zu früh in technisches Detail abdriftet, verliert tatsächlich den Überblick über den eigentlichen Problemrahmen, während eine Sitzung, die zu abstrakt bleibt, tatsächlich keine konkrete, umsetzbare Klärung liefert — die Fähigkeit, diese Detailtiefe während der laufenden, gemeinsamen Arbeit tatsächlich aktiv zu steuern, ist die zentrale Moderationsfähigkeit dieses Kapitels.

## Zweck, Mental Model und Dependencies

Den Problemrahmen visuell zu entwickeln bedeutet, gemeinsam mit den Beteiligten tatsächlich sichtbar zu machen, was zum betrachteten Problem gehört und was explizit außerhalb des Rahmens liegt — ohne diese explizite Abgrenzung driftet eine Whiteboarding-Sitzung tatsächlich häufig in benachbarte, aber nicht eigentlich relevante Themen ab, was die verfügbare Zeit für die tatsächlich entscheidende Klärung reduziert. Datenflüsse visuell zu entwickeln bedeutet, tatsächlich sichtbar zu machen, wie Information oder Kontrolle zwischen den beteiligten Komponenten fließt — diese visuelle Darstellung macht implizite Annahmen über Systemverhalten tatsächlich explizit diskutierbar, da eine bloß mündlich beschriebene Interaktion tatsächlich leichter unterschiedlich verstanden wird als eine gemeinsam gezeichnete, für alle sichtbare Darstellung. Annahmen visuell von Fakten zu unterscheiden (etwa durch Farbcodierung, unterschiedliche Linienstile oder explizite Kennzeichnung) macht die in KB-0677 beschriebene Trennung während der laufenden Designarbeit tatsächlich für alle Beteiligten gleichzeitig sichtbar — ohne diese visuelle Kennzeichnung behandelt eine Gruppe eine gemeinsam gezeichnete Annahme tatsächlich implizit als bereits bestätigten Fakt, was zu denselben Risiken führt wie die in KB-0677 beschriebene, unstrukturierte Discovery. Detailtiefe zu steuern bedeutet, aktiv zu erkennen, wann eine Diskussion tatsächlich zu tief in technisches Detail abgleitet, das für die aktuelle Klärungsphase tatsächlich noch nicht relevant ist, und die Gruppe gezielt auf die tatsächlich entscheidende Abstraktionsebene zurückzuführen — dies entspricht strukturell dem in mehrstufigen Architekturnotationen (etwa C4) etablierten Prinzip, unterschiedliche Abstraktionsebenen (Kontext, Container, Komponente, Code) explizit zu trennen, statt sie in einer einzigen, überladenen Darstellung zu vermischen. Widersprüchliche Anforderungen nachvollziehbar visuell aufzulösen bedeutet, einen erkannten Konflikt (etwa zwischen zwei Beteiligten mit unterschiedlichen Erwartungen an denselben Datenfluss) tatsächlich sichtbar im Whiteboard zu markieren und gemeinsam zu einer expliziten, nachvollziehbaren Auflösung zu führen, statt den Konflikt informell und unsichtbar für spätere Beteiligte zu lösen.

~~~text
Whiteboarding Under Uncertainty = joint, visual development of problem frame (what
  ACTUALLY belongs to considered problem vs not) + associated data flows, while ACTUAL
  present uncertainty (missing knowledge, unclarified assumptions) stays explicitly
  visible instead of implicitly depicted as certainty in visual representation
KEY POINT: managing detail depth -- session drifting too early into technical detail
  ACTUALLY loses overview of actual problem frame; session staying too abstract
  ACTUALLY delivers no concrete, actionable clarification -- ability to ACTUALLY
  actively manage this detail depth during ongoing, joint work = central moderation
  skill of this chapter
VISUALLY DEVELOPING PROBLEM FRAME means jointly making ACTUALLY visible what belongs to
  considered problem vs explicitly lies outside frame -- w/o this explicit delineation,
  session ACTUALLY frequently drifts into adjacent but not actually relevant topics,
  reducing available time for ACTUALLY decisive clarification
VISUALLY DEVELOPING DATA FLOWS means ACTUALLY making visible how info/control flows
  between involved components -- visual representation ACTUALLY makes implicit
  assumptions about system behavior explicitly discussable, since merely verbally
  described interaction is ACTUALLY more easily understood differently than a jointly
  drawn, visible-to-all representation
VISUALLY DISTINGUISHING ASSUMPTIONS FROM FACTS (color coding, different line styles,
  explicit marking) makes KB-0677's separation ACTUALLY visible to all involved
  simultaneously during ongoing design work
  w/o this visual marking, a group ACTUALLY implicitly treats a jointly drawn assumption
  as already-confirmed fact -> same risks as KB-0677's unstructured discovery
MANAGING DETAIL DEPTH means actively recognizing when discussion ACTUALLY drifts too
  deep into technical detail not yet relevant for current clarification phase,
  redirecting group to ACTUALLY decisive abstraction level
  structurally corresponds to multi-level architecture notation (C4) principle of
  explicitly separating abstraction levels (context, container, component, code)
  instead of mixing them in single, overloaded representation
RESOLVING CONFLICTING REQUIREMENTS VISUALLY+TRACEABLY means ACTUALLY visibly marking a
  detected conflict (two participants w/ different expectations of same data flow) in
  whiteboard, jointly reaching explicit, traceable resolution instead of resolving
  informally+invisibly for later participants
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Visueller Problemrahmen | grenzt tatsächlich relevantes Thema ab | verhindert Abdriften in benachbarte, irrelevante Themen |
| Visuelle Datenflüsse | macht implizite Interaktionsannahmen explizit diskutierbar | reduziert unterschiedliches Verständnis derselben Interaktion |
| Visuelle Fakten-/Annahmen-Kennzeichnung | macht KB-0677-Trennung während der Arbeit sichtbar | verhindert implizite Behandlung von Annahmen als Fakten |
| Aktive Detailtiefensteuerung | hält Diskussion auf der jeweils relevanten Abstraktionsebene | verhindert sowohl Detailabdriften als auch übermäßige Abstraktion |
| Sichtbare Konfliktauflösung | markiert und löst widersprüchliche Anforderungen nachvollziehbar | verhindert unsichtbare, für spätere Beteiligte unklare Lösung |

Implementierung: Vor Beginn der Whiteboarding-Sitzung wird der Problemrahmen explizit visuell abgegrenzt. Annahmen werden während der Sitzung visuell (etwa farblich) von Fakten unterschieden. Die Moderation steuert aktiv die Detailtiefe und markiert erkannte, widersprüchliche Anforderungen explizit zur gemeinsamen Auflösung.

## Scalability, Reliability, Security und Observability

Eine Whiteboarding-Praxis skaliert über die Anzahl der beteiligten Perspektiven in einer Sitzung; die Reliability-Grenze liegt darin, dass eine nicht visuell gekennzeichnete Annahme später implizit als gesicherter Fakt behandelt werden kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine im Whiteboard entwickelte Annahme wird später fälschlich als gesicherter Fakt behandelt | keine visuelle Kennzeichnung zur Unterscheidung von Fakten und Annahmen wurde genutzt | eine explizite, visuelle Kennzeichnung (Farbcodierung) für künftige Sitzungen einführen |
| eine Whiteboarding-Sitzung verliert den Überblick über das eigentliche Problem | kein expliziter Problemrahmen wurde zu Beginn abgegrenzt | den Problemrahmen zu Beginn jeder Sitzung explizit visuell festlegen |
| ein widersprüchliches Verständnis zwischen zwei Beteiligten bleibt für spätere Teilnehmer unklar | der Konflikt wurde informell, nicht sichtbar im Whiteboard gelöst | erkannte Konflikte explizit im Whiteboard markieren und die Auflösung sichtbar dokumentieren |

Security: Bei Whiteboarding-Sitzungen mit sensiblen Architekturdetails sollten physische oder digitale Whiteboards nach der Sitzung angemessen gesichert oder entfernt werden. Observability: Die tatsächliche Anzahl unaufgelöster, am Ende der Sitzung noch offener Konflikte ist ein zentrales Signal zur Bewertung, ob die Sitzung ihr Ziel tatsächlich erreicht hat.

## Trade-offs und Entscheidungen

**Staff** entwickelt für einen begrenzten Problembereich einen visuellen Datenfluss mit klarer Fakten-/Annahmen-Kennzeichnung. **Principal** moderiert eine vollständige Whiteboarding-Sitzung mit mehreren Beteiligten und steuert aktiv Detailtiefe sowie Konfliktauflösung. **Chief** legt unternehmensweite Standards für gemeinsame Designarbeit fest, die visuelle Fakten-/Annahmen-Trennung vorschreiben.

Anti-Patterns: eine Whiteboarding-Sitzung ohne expliziten Problemrahmen beginnen; Annahmen ohne visuelle Kennzeichnung wie Fakten behandeln; eine Sitzung ohne aktive Steuerung in unangemessenes technisches Detail abdriften lassen.

## Production Checklist

- [ ] Der Problemrahmen ist zu Beginn der Sitzung explizit visuell abgegrenzt.
- [ ] Annahmen sind während der Sitzung visuell von Fakten unterschieden.
- [ ] Die Detailtiefe wird aktiv auf die jeweils relevante Abstraktionsebene gesteuert.
- [ ] Erkannte, widersprüchliche Anforderungen sind explizit markiert und nachvollziehbar aufgelöst.

## Interviewfragen

### 1. Warum ist die visuelle Kennzeichnung von Annahmen während einer Whiteboarding-Sitzung wichtig?

**Antwort:** Weil eine Gruppe ohne diese Kennzeichnung eine gemeinsam gezeichnete Annahme implizit als bereits bestätigten Fakt behandelt, was zu denselben Risiken führt wie unstrukturierte Discovery.

### 2. Warum sollte der Problemrahmen zu Beginn einer Sitzung explizit abgegrenzt werden?

**Antwort:** Weil eine Sitzung ohne diese Abgrenzung häufig in benachbarte, nicht eigentlich relevante Themen abdriftet und dadurch Zeit für die tatsächlich entscheidende Klärung verliert.

### 3. Was passiert, wenn eine Whiteboarding-Sitzung zu früh in technisches Detail abdriftet?

**Antwort:** Der eigentliche Problemrahmen gerät aus dem Blick, und die Gruppe verliert den Überblick über die tatsächlich entscheidende Klärung.

### 4. Wie entspricht die Detailtiefensteuerung dem Prinzip mehrstufiger Architekturnotationen wie C4?

**Antwort:** Beide trennen explizit unterschiedliche Abstraktionsebenen, statt sie in einer einzigen, überladenen Darstellung zu vermischen, sodass jede Ebene für sich verständlich bleibt.

### 5. Wie gehst du vor, wenn eine im Whiteboard entwickelte Annahme später fälschlich als gesicherter Fakt behandelt wird?

**Antwort:** Ich führe für künftige Sitzungen eine explizite, visuelle Kennzeichnung zur Unterscheidung von Fakten und Annahmen ein, etwa über Farbcodierung.

### 6. Widersprüchliche Anforderung: Zwei Beteiligte haben während der Whiteboarding-Sitzung unterschiedliche Erwartungen an denselben Datenfluss, und die Sitzung soll dennoch fristgerecht abgeschlossen werden — wie gehst du vor?

**Antwort:** Ich würde den Konflikt explizit im Whiteboard markieren, kurz die jeweilige Erwartung beider Seiten festhalten, und entweder eine sofortige, gemeinsame Klärung anstoßen oder den Konflikt als explizit offene Frage mit zugeordnetem Verantwortlichen für eine Nachbearbeitung dokumentieren, statt ihn stillschweigend zu übergehen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team entwickelt in einer Whiteboarding-Sitzung den Datenfluss für eine neue Integration (angelehnt an das in Domain 29 behandelte Commerce-Umfeld). Ein Beteiligter zeichnet eine Verbindung zwischen zwei Systemen ein, die er für gesichert hält, während ein anderer Beteiligter diese tatsächlich als noch ungeklärt einschätzt.

~~~python
# Local, deterministic illustration of visually distinguishing facts from assumptions on a whiteboard (fictional lab example, no real system):

whiteboard_elements = [
    {"element": "Order Service -> Payment Service connection", "marked_as": "assumption", "confirmed_by": 1},
    {"element": "Order Service -> Inventory Service connection", "marked_as": "fact", "confirmed_by": 2},
]

def check_readiness(elements):
    unresolved = [e for e in elements if e["marked_as"] == "assumption" and e["confirmed_by"] < 2]
    return {"ready_to_proceed": len(unresolved) == 0, "unresolved": unresolved}

print(check_readiness(whiteboard_elements))
~~~

Erwartete Beobachtung: Die Payment-Service-Verbindung bleibt als unbestätigte Annahme markiert, da nur eine Person sie bestätigt hat. Auswertung: Ohne die visuelle Kennzeichnung hätte das Team die Verbindung möglicherweise als gesichert in die weitere Architekturplanung übernommen, obwohl sie tatsächlich noch ungeklärt war.

## Dependencies, Cross-References und Quellen

1. Simon Brown: [The C4 Model for Visualising Software Architecture](https://c4model.com/), abgerufen 2026-09-18.
2. Gamestorming (Dave Gray, Sunni Brown, James Macanufo): [Gamestorming — A Playbook for Innovators, Rulebreakers, and Changemakers](https://gamestorming.com/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0677 (Architektur-Discovery in der Praxis) beschriebenen Fakten-/Annahmen-Trennung auf und macht sie während gemeinsamer, visueller Designarbeit sichtbar.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, digitale Whiteboarding-Werkzeuge zur automatisierten Erkennung unmarkierter Annahmen anhand der verwendeten Sprache während der Sitzung | Emerging | Bei künftigen Sitzungen mit digitalen Werkzeugen evaluieren, jedoch die finale, explizite Fakten-/Annahmen-Kennzeichnung weiterhin durch die Moderation und die Beteiligten selbst sicherstellen. |

Ein Team akzeptiert eine Whiteboarding-Sitzung erst abgeschlossen, wenn der Problemrahmen dokumentiert, Annahmen visuell von Fakten unterschieden und erkannte Konflikte nachvollziehbar aufgelöst sind.
