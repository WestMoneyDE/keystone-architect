---
{"id": "KB-0714", "title": "GenAI-Architekturfall", "domain": "30", "sequence": 38, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0713", "concepts": ["Vollständiger, durchgearbeiteter Übungsfall"], "needed_for": "Dieser Fall folgt derselben, vollständigen Fallstruktur wie der in KB-0713 beschriebene Cloud-Architekturfall"}], "related": ["KB-0685"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für das gegebene, sichere Unternehmensassistenz-Szenario eine konkrete RAG-Architektur mit cite-or-decline und kontrollierten Aktionen entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für den GenAI-Architekturfall mehrere Evaluationsansätze und UX-Optionen mit fairer Trade-off-Darstellung gegeneinander abwägen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine GenAI-Architektur eine kritische Dimension (Evaluation, Ownership, kontrollierte Aktionen) unadressiert lässt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine vollständige GenAI-Architekturentscheidung mit Sicherheits-, Evaluations- und Ownership-Anforderungen treffen und vor Entscheidern begründen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische RAG-Implementierung eines konkreten Frameworks im Detail ist Vertiefung.", "rationale": "Kern ist die konzeptionelle Fallbearbeitung mit überprüfbaren Anforderungen, nicht die produktspezifische Implementierungsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0714-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur vollständigen Bearbeitung eines GenAI-Architekturfalls, keine reale Organisation involviert", "evidence": "Ein vollständig durchgearbeitetes Fallbeispiel zeigt, wie cite-or-decline, Evaluation, UX und Ownership mit expliziten, klar als Annahmen gekennzeichneten Randbedingungen zu einer kohärenten Architekturentscheidung zusammengeführt werden.", "limitations": "Vollständig fiktives Fallbeispiel; alle Zahlen, Lasten und Randbedingungen sind Beispielannahmen, keine realen Projektergebnisse."}]}
---
# GenAI-Architekturfall

> **Ziel:** Dieses Kapitel ist ein vollständiger, durchgearbeiteter Übungsfall, strukturell analog zu KB-0713: Ein fiktives Unternehmen benötigt eine sichere, interne Assistenzanwendung für Mitarbeiter, basierend auf Retrieval-Augmented Generation (RAG) mit kontrollierten Aktionen (etwa das Auslösen bestimmter, vordefinierter Geschäftsprozesse). Der Fall verbindet **cite-or-decline** (die Anwendung antwortet nur mit tatsächlich belegbaren Quellen oder lehnt tatsächlich ab, siehe die in Domain 12/13 etablierten Prinzipien), **Evaluation**, **UX** und **Ownership** zu einer kohärenten, überprüfbaren Architekturentscheidung. Jede Annahme in diesem Fall ist explizit als Beispielannahme gekennzeichnet, keine reale Projekterfahrung.

## Fallbeschreibung und explizite Annahmen

**Hinweis:** Alle folgenden Annahmen sind explizit als Beispielannahmen gekennzeichnet, keine realen Projektdaten.

Das fiktive Unternehmen "Beispiel AG" möchte eine interne Assistenzanwendung einführen, die Mitarbeitern Fragen zu internen Richtlinien beantwortet und angenommen bestimmte, klar abgegrenzte Aktionen (etwa das Anlegen eines Urlaubsantrags) auslösen kann. Angenommene Randbedingungen: 2.000 interne Nutzer, eine Wissensbasis mit angenommen 15.000 internen Dokumenten, und eine regulatorische Anforderung (angenommen: keine automatisierte, endgültige Entscheidung ohne menschliche Bestätigung bei personalrelevanten Aktionen).

## cite-or-decline

Die Anwendung wird so entworfen, dass sie tatsächlich nur antwortet, wenn eine Antwort tatsächlich durch mindestens ein konkretes, abrufbares Quelldokument belegt werden kann — andernfalls lehnt sie die Beantwortung explizit ab, statt eine unbelegte, potenziell falsche Antwort zu generieren. Dieses Prinzip entspricht direkt der in KB-0677 beschriebenen Fakten-/Annahmen-Trennung, hier jedoch auf die generierte Antwort eines Sprachmodells angewendet: Eine Antwort ohne tatsächliche Quellenbelegung wird tatsächlich als Annahme, nicht als Fakt behandelt und daher nicht ausgegeben.

## Kontrollierte Aktionen

Aktionen, die die Anwendung tatsächlich auslösen kann, sind explizit auf eine vordefinierte, begrenzte Liste beschränkt (angenommen: Urlaubsantrag anlegen, IT-Ticket erstellen) — die Anwendung kann tatsächlich keine beliebigen, offenen Aktionen ausführen, entsprechend dem Prinzip, dass modellgenerierte Auswahl von deterministisch erzwungenen Berechtigungen getrennt werden muss (siehe Artikelvertrag Abschnitt 4). Für die angenommene, personalrelevante Aktion (Urlaubsantrag) ist eine explizite, menschliche Bestätigung vor der tatsächlichen Ausführung vorgeschrieben, entsprechend der angenommenen regulatorischen Anforderung.

## Evaluation

Die Anwendung wird vor Produktivsetzung gegen einen angenommenen, kuratierten Testdatensatz mit 200 repräsentativen Fragen evaluiert, mit expliziten Metriken für Antwortgenauigkeit (stimmt die Antwort tatsächlich mit dem Quelldokument überein) und Ablehnungsrate (löst die Anwendung tatsächlich korrekt cite-or-decline aus, wenn keine Quelle existiert) — diese Evaluation folgt strukturell dem in KB-0692 beschriebenen PoC-Prinzip mit vorab definierten Erfolgs- und Abbruchkriterien.

## UX

Die Nutzeroberfläche zeigt tatsächlich immer die verwendete Quelle neben der Antwort an, sodass ein Nutzer tatsächlich selbst überprüfen kann, ob die Antwort korrekt aus der Quelle abgeleitet wurde — diese Transparenz entspricht dem in KB-0677 etablierten Prinzip, Annahmen nicht implizit als Fakten darzustellen. Eine explizite Ablehnung wird tatsächlich sichtbar als solche gekennzeichnet, statt eine Antwortverweigerung fälschlich wie einen technischen Fehler wirken zu lassen.

## Ownership

Die Anwendung wird gemäß dem in KB-0706 beschriebenen Operating-Model-Prinzip geführt: Das zentrale Plattformteam ist für die zugrunde liegende RAG-Infrastruktur verantwortlich, während die fachliche Wissensbasis (die zugrunde liegenden Dokumente) von den jeweiligen Fachbereichen tatsächlich gepflegt wird — eine veraltete oder falsche Wissensbasis würde sonst tatsächlich zu falschen, aber formal belegten Antworten führen, was das cite-or-decline-Prinzip allein nicht verhindern kann.

~~~text
FALL-STRUKTUR (Zusammenfassung):
  CITE-OR-DECLINE: Antwort nur mit tatsächlicher Quellenbelegung, sonst explizite
    Ablehnung statt unbelegter Antwort
  KONTROLLIERTE AKTIONEN: begrenzte, vordefinierte Aktionsliste, menschliche Bestätigung
    bei personalrelevanten Aktionen
  EVALUATION: kuratierter Testdatensatz mit Genauigkeits- und Ablehnungsratenmetrik,
    vorab definierte Kriterien
  UX: sichtbare Quellenangabe, klar gekennzeichnete Ablehnung statt Fehlerdarstellung
  OWNERSHIP: Plattformteam für Infrastruktur, Fachbereiche für Wissensbasis-Pflege
Jede Annahme (Nutzerzahl, Dokumentenanzahl, regulatorische Anforderung) ist EXPLIZIT als
  Beispielannahme markiert, keine reale Projektangabe.
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| cite-or-decline als Fakten-/Annahmen-Trennung | verhindert unbelegte, potenziell falsche Antworten | wendet KB-0677-Prinzip auf generierte Antworten an |
| Vordefinierte, begrenzte Aktionsliste | trennt Modellauswahl von erzwungener Berechtigung | verhindert beliebige, offene Aktionsausführung |
| Menschliche Bestätigung bei personalrelevanten Aktionen | erfüllt regulatorische Anforderung | verhindert vollautomatisierte, folgenreiche Entscheidung |
| Vorab definierte Evaluationskriterien | strukturiert Erfolgsbewertung wie PoC-Prinzip | verhindert nachträglich angepasste Erfolgskriterien |
| Föderierte Ownership (Infrastruktur vs. Wissensbasis) | trennt technische von fachlicher Verantwortung | verhindert veraltete, aber formal belegte Antworten |

## Scalability, Reliability, Security und Observability

Der Fall skaliert über die angenommene Anzahl interner Dokumente und Nutzer; die Reliability-Grenze liegt darin, dass eine veraltete Wissensbasis trotz korrekt funktionierendem cite-or-decline-Mechanismus tatsächlich zu formal belegten, aber inhaltlich falschen Antworten führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Anwendung liefert eine formal belegte, aber tatsächlich veraltete Antwort | die zugrunde liegende Wissensbasis wurde nicht aktuell gehalten | die Fachbereichs-Ownership für die Wissensbasis-Pflege gemäß KB-0706 nachschärfen |
| die Anwendung löst eine Aktion ohne die vorgeschriebene, menschliche Bestätigung aus | die kontrollierte Aktionsliste wurde nicht korrekt mit der Bestätigungspflicht verknüpft | die Aktionsausführung gegen die Bestätigungspflicht erneut prüfen |
| die Ablehnungsrate in der Produktion weicht deutlich von der Evaluation ab | der Testdatensatz war nicht repräsentativ für tatsächliche Nutzerfragen | den Testdatensatz um tatsächlich beobachtete, repräsentative Produktionsfragen erweitern |

## Trade-offs und Entscheidungen

Dieser Fall demonstriert auf **Staff**-Ebene die korrekte technische Umsetzung des cite-or-decline-Mechanismus. Auf **Principal**-Ebene demonstriert er die Verbindung von cite-or-decline, kontrollierten Aktionen und Evaluation zu einem kohärenten Gesamtentwurf. Auf **Chief**-Ebene demonstriert er die organisatorische Einbettung (föderierte Ownership) der technischen Entscheidung.

## Production Checklist

- [ ] Die Anwendung antwortet nur mit tatsächlicher Quellenbelegung oder lehnt explizit ab.
- [ ] Aktionen sind auf eine vordefinierte, begrenzte Liste beschränkt.
- [ ] Personalrelevante Aktionen erfordern explizite, menschliche Bestätigung.
- [ ] Evaluationskriterien sind vor Produktivsetzung definiert.
- [ ] Die UX zeigt Quellen sichtbar an und kennzeichnet Ablehnungen klar.
- [ ] Ownership für Infrastruktur und Wissensbasis ist föderiert und explizit zugeordnet.

## Interviewfragen

### 1. Warum ist cite-or-decline für eine interne Assistenzanwendung wichtig?

**Antwort:** Weil es verhindert, dass die Anwendung eine unbelegte, potenziell falsche Antwort generiert, indem sie nur mit tatsächlich belegbaren Quellen antwortet oder explizit ablehnt.

### 2. Warum sind die auslösbaren Aktionen auf eine vordefinierte Liste beschränkt?

**Antwort:** Um die modellgenerierte Auswahl von deterministisch erzwungenen Berechtigungen zu trennen und zu verhindern, dass die Anwendung beliebige, offene Aktionen ausführt.

### 3. Warum ist menschliche Bestätigung bei personalrelevanten Aktionen vorgeschrieben?

**Antwort:** Um der angenommenen regulatorischen Anforderung zu entsprechen, dass keine automatisierte, endgültige Entscheidung ohne menschliche Bestätigung bei personalrelevanten Aktionen erfolgt.

### 4. Warum kann eine veraltete Wissensbasis trotz funktionierendem cite-or-decline-Mechanismus zu falschen Antworten führen?

**Antwort:** Weil cite-or-decline nur die formale Quellenbelegung prüft, nicht aber die inhaltliche Aktualität der zugrunde liegenden Wissensbasis, weshalb eine separate, fachbereichsbezogene Pflege notwendig ist.

### 5. Wie würdest du vorgehen, wenn die Ablehnungsrate in der Produktion deutlich von der Evaluation abweicht?

**Antwort:** Ich würde prüfen, ob der ursprüngliche Testdatensatz repräsentativ für tatsächliche Nutzerfragen war, und ihn um tatsächlich beobachtete Produktionsfragen erweitern.

### 6. Widersprüchliche Anforderung: Das Fachbereich will maximal hilfreiche, umfassende Antworten UND die Organisation will striktes cite-or-decline ohne jede unbelegte Ergänzung — wie würdest du diesen Fall lösen?

**Antwort:** Ich würde das strikte cite-or-decline-Prinzip als nicht verhandelbare Grundregel beibehalten, jedoch die Wissensbasis aktiv und umfassend pflegen lassen, sodass mehr tatsächlich belegbare Antworten möglich werden, statt das cite-or-decline-Prinzip zugunsten scheinbar hilfreicherer, aber unbelegter Antworten aufzuweichen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Lab ist Teil des im Kapitel beschriebenen, vollständig fiktiven Übungsfalls, keine reale Projekterfahrung.

~~~python
# Local, deterministic illustration of the cite-or-decline mechanism for this fictional case (fictional lab example, no real system):

def answer_or_decline(query, retrieved_sources):
    if not retrieved_sources:
        return {"status": "declined", "reason": "no supporting source found"}
    return {"status": "answered", "sources": retrieved_sources}

print(answer_or_decline("What is the remote work policy?", retrieved_sources=["policy_doc_v3.pdf"]))
print(answer_or_decline("What is the CEO's personal opinion on X?", retrieved_sources=[]))
~~~

Erwartete Beobachtung: Eine Anfrage mit tatsächlich gefundener Quelle wird beantwortet, während eine Anfrage ohne belegbare Quelle explizit abgelehnt wird. Auswertung: Diese strukturelle Trennung verhindert, dass die Anwendung eine unbelegte, potenziell falsche Antwort auf eine Frage ohne tatsächliche Quellengrundlage generiert.

## Dependencies, Cross-References und Quellen

1. Patrick Lewis et al.: [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401), abgerufen 2026-09-18.
2. National Institute of Standards and Technology (NIST): [AI Risk Management Framework — Trustworthy AI Characteristics](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-18.

Dieses Kapitel folgt der in KB-0713 (Cloud-Architekturfall) etablierten, vollständigen Fallstruktur und nutzt die in KB-0677 (Fakten-/Annahmen-Trennung), KB-0692 (PoCs) und KB-0706 (Operating Models) beschriebenen Prinzipien.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Evaluation gegen tatsächlich beobachtete Produktionsfragen zur Reduzierung des Abstands zwischen Testdatensatz und realer Nutzung | Growing Adoption | Bei künftigen, ähnlichen Fällen evaluieren, jedoch das grundlegende cite-or-decline-Prinzip unabhängig vom gewählten Evaluationswerkzeug zuerst konzeptionell festlegen. |

Ein Team akzeptiert diesen GenAI-Architekturfall als vollständig bearbeitet, wenn cite-or-decline, kontrollierte Aktionen, Evaluation, UX und Ownership nachweislich mit expliziten, klar gekennzeichneten Annahmen kohärent zusammengeführt sind.
