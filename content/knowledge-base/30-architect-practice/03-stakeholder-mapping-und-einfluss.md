---
{"id": "KB-0679", "title": "Stakeholder Mapping und Einfluss", "domain": "30", "sequence": 3, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0678", "concepts": ["Explizit sichtbare Zielkonflikte"], "needed_for": "Stakeholder Mapping identifiziert vorab, welche Stakeholder die in KB-0678 beschriebenen Zielkonflikte tatsächlich tragen"}], "related": ["KB-0677"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene Architekturveränderung Entscheidungsrechte, Interessen und Widerstände kartieren und daraus einen konkreten Kommunikationsplan ableiten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Architekturveränderung mehrere Kommunikationsstrategien entwerfen und anhand der kartierten Einflussstruktur bewerten, welche Koalitionen tatsächlich notwendig sind.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Architekturveränderung an tatsächlichem Widerstand scheitert, weil ein einflussreicher Stakeholder nicht identifiziert oder nicht eingebunden wurde.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Stakeholder-Einbindung bei größeren Architekturveränderungen festlegen, die systematisches Mapping vor Umsetzungsbeginn vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Power-Interest-Grid-Methodik im Detail ist Vertiefung.", "rationale": "Kern ist die praktische Kartierung und Kommunikationsplanung, nicht die formale Methodendetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0679-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung von Stakeholder-Mapping, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine geplante Architekturveränderung ohne vorheriges Mapping an einem nicht identifizierten, einflussreichen Widerstand scheitert, während ein systematisches Mapping diesen Widerstand vorab sichtbar macht und eine gezielte Kommunikationsstrategie ermöglicht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Stakeholder Mapping und Einfluss

> **Ziel:** Stakeholder Mapping kartiert für eine konkrete Architekturveränderung drei Dimensionen: **Entscheidungsrechte** (wer tatsächlich formal befugt ist, die Veränderung zu genehmigen oder zu blockieren), **Interessen** (was ein Stakeholder tatsächlich durch die Veränderung gewinnt oder verliert) und **Widerstände** (wer tatsächlich, aus welchem Grund, gegen die Veränderung sein könnte, unabhängig von formaler Entscheidungsbefugnis). Der zentrale Punkt dieses Kapitels ist, dass eine Architekturveränderung, die technisch korrekt geplant ist, tatsächlich an unadressiertem, informellem Widerstand scheitern kann — ein Stakeholder ohne formale Entscheidungsbefugnis, aber mit tatsächlich hohem informellem Einfluss (etwa durch fachliche Reputation oder Netzwerk), kann eine Veränderung tatsächlich erheblich verzögern oder verhindern, wenn er nicht identifiziert und eingebunden wird.

## Zweck, Mental Model und Dependencies

Entscheidungsrechte zu kartieren bedeutet, tatsächlich zu klären, wer formal befugt ist, eine Architekturveränderung zu genehmigen, zu blockieren oder zu eskalieren — diese formale Struktur ist oft in Organigrammen oder Governance-Dokumenten sichtbar, deckt jedoch tatsächlich nicht notwendigerweise den vollständigen Einfluss ab, der für den tatsächlichen Erfolg einer Veränderung relevant ist. Interessen zu kartieren bedeutet, für jeden identifizierten Stakeholder tatsächlich zu verstehen, was er durch die geplante Veränderung gewinnt oder verliert — ein Stakeholder, dessen bisherige Arbeitsweise durch die Veränderung tatsächlich erschwert wird, hat ein tatsächliches, nachvollziehbares Interesse an Widerstand, selbst wenn die Veränderung aus rein technischer Sicht tatsächlich vorteilhaft ist; dieses Verständnis ist die Grundlage dafür, Widerstand nicht als irrational abzutun, sondern als tatsächlich nachvollziehbare Reaktion auf einen echten Interessenkonflikt zu behandeln. Widerstände zu kartieren bedeutet, über die formale Entscheidungsstruktur hinaus zu erfassen, wer tatsächlich informellen Einfluss hat (etwa durch fachliche Reputation, langjährige Netzwerke oder informelle Autorität) und aus welchem Grund dieser Einfluss tatsächlich gegen die Veränderung eingesetzt werden könnte — diese informelle Dimension ist häufig entscheidender für den tatsächlichen Erfolg einer Veränderung als die formale Entscheidungsstruktur allein. Kommunikationswege und Koalitionen zu planen bedeutet, basierend auf der Kartierung tatsächlich gezielt zu entscheiden, wer wann, mit welcher Botschaft und über welchen Kanal informiert oder eingebunden werden muss — ein einflussreicher, aber zunächst skeptischer Stakeholder frühzeitig gezielt einzubinden, kann ihn tatsächlich zu einem Fürsprecher machen, während eine unstrukturierte, allgemeine Kommunikation an alle gleichermaßen diese gezielte Wirkung tatsächlich nicht erreicht. Nachvollziehbare Verantwortung bedeutet, dass für jede identifizierte Kommunikations- oder Einbindungsaufgabe tatsächlich ein konkreter Verantwortlicher benannt ist, statt die Umsetzung implizit dem Zufall zu überlassen.

~~~text
Stakeholder Mapping charts 3 dimensions for a concrete architecture change
  DECISION RIGHTS: who is ACTUALLY formally authorized to approve/block change
  INTERESTS: what a stakeholder ACTUALLY gains or loses from change
  RESISTANCE: who could ACTUALLY, for what reason, oppose change, independent of formal
  decision authority
KEY POINT: technically correctly planned architecture change CAN ACTUALLY fail from
  unaddressed, informal resistance -- stakeholder w/o formal decision authority but
  ACTUALLY high informal influence (professional reputation, network) CAN ACTUALLY
  substantially delay or prevent a change if not identified+engaged
MAPPING DECISION RIGHTS = ACTUALLY clarifying who's formally authorized to approve,
  block, or escalate an architecture change -- formal structure often visible in org
  charts/governance docs, but ACTUALLY doesn't necessarily cover full influence relevant
  to a change's actual success
MAPPING INTERESTS = ACTUALLY understanding, for every identified stakeholder, what they
  gain or lose from planned change
  stakeholder whose current workflow ACTUALLY gets harder from change has an ACTUAL,
  understandable interest in resistance, even if change is ACTUALLY advantageous from
  pure technical view -- basis for treating resistance not as irrational but as ACTUALLY
  understandable reaction to a real interest conflict
MAPPING RESISTANCE = capturing, beyond formal decision structure, who ACTUALLY has
  informal influence (professional reputation, long-standing networks, informal
  authority) and for what reason this influence could ACTUALLY be used against change
  this informal dimension often more decisive for ACTUAL change success than formal
  decision structure alone
PLANNING COMMUNICATION CHANNELS + COALITIONS means, based on mapping, ACTUALLY
  deliberately deciding who needs informing/engaging when, w/ what message, via what
  channel
  engaging influential but initially skeptical stakeholder early+targeted CAN ACTUALLY
  turn them into an advocate; unstructured, generic communication to everyone equally
  ACTUALLY doesn't achieve this targeted effect
TRACEABLE RESPONSIBILITY means every identified communication/engagement task ACTUALLY
  has a concrete owner instead of implementation being left to chance
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Entscheidungsrechte-Kartierung | zeigt formale Genehmigungs-/Blockierungsbefugnis | Grundlage, aber nicht vollständiger Einfluss |
| Interessen-Kartierung | erklärt Gewinn/Verlust je Stakeholder | macht Widerstand nachvollziehbar statt irrational |
| Widerstands-Kartierung (informeller Einfluss) | erfasst Einfluss jenseits formaler Struktur | oft entscheidender als formale Struktur allein |
| Gezielte Kommunikations-/Koalitionsplanung | wer wann mit welcher Botschaft eingebunden wird | verwandelt Skeptiker potenziell in Fürsprecher |
| Nachvollziehbare Verantwortungszuordnung | konkreter Owner je Kommunikationsaufgabe | verhindert Zufallsumsetzung |

Implementierung: Vor einer größeren Architekturveränderung wird eine explizite Kartierung von Entscheidungsrechten, Interessen und Widerständen erstellt. Basierend darauf wird ein Kommunikationsplan mit konkreten Verantwortlichen je Stakeholder-Einbindung erstellt.

## Scalability, Reliability, Security und Observability

Eine Stakeholder-Mapping-Praxis skaliert über die Anzahl der beteiligten Stakeholdergruppen bei einer Veränderung; die Reliability-Grenze liegt darin, dass ein nicht identifizierter, informell einflussreicher Widerstand die Veränderung tatsächlich trotz technisch korrekter Planung scheitern lassen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine technisch korrekt geplante Veränderung scheitert an unerwartetem Widerstand | ein informell einflussreicher Stakeholder wurde beim Mapping nicht identifiziert | ein nachträgliches, erweitertes Mapping zur Identifikation des tatsächlichen Widerstands durchführen |
| ein Stakeholder verhält sich unkooperativ, obwohl er formal zustimmt | sein tatsächliches Interesse (Gewinn/Verlust durch die Veränderung) wurde nicht verstanden | das tatsächliche Interesse des Stakeholders gezielt klären und adressieren |
| eine Kommunikationsmaßnahme wurde nicht tatsächlich durchgeführt | keine konkrete Verantwortung für die Maßnahme war zugeordnet | einen konkreten Verantwortlichen für die Kommunikationsmaßnahme benennen |

Security: Sensible Informationen über Stakeholder-Interessen und -Widerstände sollten vertraulich behandelt werden, um Vertrauen nicht zu untergraben. Observability: Die tatsächliche Entwicklung der Stakeholder-Haltung (Fürsprecher, neutral, Widerstand) über den Veränderungsprozess hinweg ist ein zentrales Signal zur Bewertung der Kommunikationswirksamkeit.

## Trade-offs und Entscheidungen

**Staff** kartiert Entscheidungsrechte und Interessen für einen begrenzten Änderungsbereich. **Principal** entwirft die vollständige Stakeholder-Mapping- und Kommunikationsstrategie für eine größere, organisationsübergreifende Architekturveränderung. **Chief** legt unternehmensweite Standards fest, die systematisches Stakeholder-Mapping vor größeren Veränderungen vorschreiben.

Anti-Patterns: eine Architekturveränderung ohne vorheriges Stakeholder-Mapping planen; Widerstand als irrational statt als nachvollziehbare Reaktion auf ein tatsächliches Interesse behandeln; Kommunikationsaufgaben ohne konkrete Verantwortungszuordnung planen.

## Production Checklist

- [ ] Entscheidungsrechte für die geplante Veränderung sind explizit kartiert.
- [ ] Interessen der betroffenen Stakeholder sind verstanden und dokumentiert.
- [ ] Informeller Einfluss und potenzieller Widerstand sind über die formale Struktur hinaus erfasst.
- [ ] Ein Kommunikationsplan mit konkreten Verantwortlichen je Aufgabe existiert.

## Interviewfragen

### 1. Warum reicht die formale Entscheidungsstruktur allein nicht aus, um den Erfolg einer Architekturveränderung sicherzustellen?

**Antwort:** Weil informell einflussreiche Stakeholder ohne formale Entscheidungsbefugnis eine Veränderung tatsächlich erheblich verzögern oder verhindern können, wenn sie nicht identifiziert und eingebunden werden.

### 2. Warum sollte Widerstand nicht als irrational abgetan werden?

**Antwort:** Weil er häufig eine nachvollziehbare Reaktion auf einen tatsächlichen Interessenkonflikt ist, etwa wenn die bisherige Arbeitsweise eines Stakeholders durch die Veränderung erschwert wird.

### 3. Was unterscheidet formale Entscheidungsrechte von informellem Einfluss?

**Antwort:** Formale Entscheidungsrechte sind meist in Organigrammen oder Governance-Dokumenten sichtbar, während informeller Einfluss (fachliche Reputation, Netzwerke) tatsächlich den vollständigen, entscheidungsrelevanten Einfluss nicht abdeckt und separat kartiert werden muss.

### 4. Wie kann gezielte Kommunikation einen skeptischen Stakeholder zum Fürsprecher machen?

**Antwort:** Durch frühzeitige, gezielte Einbindung mit einer auf seine tatsächlichen Interessen abgestimmten Botschaft, statt einer unstrukturierten, allgemeinen Kommunikation an alle gleichermaßen.

### 5. Wie gehst du vor, wenn eine technisch korrekt geplante Veränderung an unerwartetem Widerstand scheitert?

**Antwort:** Ich führe ein erweitertes Stakeholder-Mapping durch, um den tatsächlich einflussreichen, zuvor nicht identifizierten Widerstand aufzudecken, und entwickle eine gezielte Kommunikationsstrategie zur Adressierung.

### 6. Widersprüchliche Anforderung: Die Geschäftsführung will eine schnelle, geräuschlose Umsetzung ohne ausgedehnte Stakeholder-Kommunikation UND die Organisation will nachhaltige Akzeptanz ohne späteren Widerstand — wie gehst du vor?

**Antwort:** Ich würde die Stakeholder-Mapping-Aufwände gezielt auf die tatsächlich einflussreichsten, potenziell widerstehenden Stakeholder fokussieren, statt eine umfassende Kommunikation an alle Beteiligten durchzuführen, sodass eine schnelle Umsetzung möglich bleibt, ohne die entscheidenden Widerstandsrisiken unadressiert zu lassen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team plant die Migration einer Legacy-Komponente (angelehnt an das in Domain 25 behandelte Enterprise-Architecture-Umfeld) auf eine neue Plattform. Ein formal nicht entscheidungsbefugter, aber fachlich hoch angesehener Senior-Entwickler äußert informell Bedenken gegenüber Kollegen, ohne dass dies dem Projektteam bekannt wird.

~~~python
# Local, deterministic illustration of formal vs. informal influence mapping (fictional lab example, no real organization):

stakeholders = [
    {"name": "Head of Engineering", "formal_authority": True, "informal_influence": "medium", "interest": "supports migration"},
    {"name": "Senior Developer", "formal_authority": False, "informal_influence": "high", "interest": "concerned about migration risk"},
]

def identify_risk(stakeholders):
    return [s for s in stakeholders if not s["formal_authority"] and s["informal_influence"] == "high"]

print(identify_risk(stakeholders))
~~~

Erwartete Beobachtung: Der Senior-Entwickler wird durch das systematische Mapping als hoher, formal nicht abgedeckter Einflussrisikofaktor identifiziert. Auswertung: Ohne dieses Mapping hätte das Projektteam den informellen Widerstand des Senior-Entwicklers vermutlich erst bemerkt, nachdem er bereits Kollegen gegen die Migration mobilisiert hätte.

## Dependencies, Cross-References und Quellen

1. R. Edward Freeman: [Strategic Management — A Stakeholder Approach](https://www.cambridge.org/core/books/strategic-management/), abgerufen 2026-09-18.
2. Project Management Institute (PMI): [Stakeholder Engagement — Power/Interest Grid Methodology](https://www.pmi.org/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0678 (NFR-Workshops moderieren) beschriebenen Zielkonflikt-Sichtbarmachung auf und ordnet ihr die tatsächlich beteiligten Stakeholder zu.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Analyse organisatorischer Kommunikationsmuster (etwa Meeting-Teilnahme, Dokumentenbearbeitung) zur ergänzenden Identifikation informeller Einflussstrukturen | Emerging | Bei künftigen, größeren Veränderungsvorhaben evaluieren, jedoch weiterhin direkte, persönliche Gespräche als primäre Methode zur Interessenklärung nutzen, da automatisierte Muster tatsächliche Motive nicht vollständig erfassen. |

Ein Team akzeptiert ein Stakeholder Mapping erst abgeschlossen, wenn Entscheidungsrechte, Interessen und informeller Widerstand nachweislich kartiert und ein Kommunikationsplan mit konkreten Verantwortlichen erstellt ist.
