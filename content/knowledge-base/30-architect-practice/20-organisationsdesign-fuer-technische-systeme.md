---
{"id": "KB-0696", "title": "Organisationsdesign für technische Systeme", "domain": "30", "sequence": 20, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0679", "concepts": ["Entscheidungsrechte-Kartierung"], "needed_for": "Organisationsdesign nutzt dieselbe Entscheidungsrechte-Kartierung wie das in KB-0679 beschriebene Stakeholder Mapping, hier auf die Teamstruktur selbst angewendet"}], "related": ["KB-0688"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes technisches System Entscheidungswege und Verantwortungsgrenzen an den tatsächlichen Veränderungsbedarf ausrichten und Teamlast sowie Abhängigkeiten explizit bewerten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Systemlandschaft mehrere Organisationsstrukturen gegeneinander abwägen und begründen, welche Struktur die tatsächlich benötigten Kommunikationswege am besten unterstützt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Teamstruktur der tatsächlichen technischen Systemarchitektur widerspricht, sodass Änderungen unnötig viele Teamgrenzen überschreiten müssen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein unternehmensweites Organisationsdesign für technische Systeme festlegen, das Entscheidungswege, Verantwortungsgrenzen und fachliche Ownership explizit an den tatsächlichen Veränderungsbedarf anpasst.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Team-Topologies-Musterklassifikation im Detail ist Vertiefung.", "rationale": "Kern ist die praktische Ausrichtung von Entscheidungswegen und Verantwortung, nicht die formale Musterklassifikationsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0696-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung von Conway's Law bei unpassender Teamstruktur, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine Teamstruktur, die nicht mit den tatsächlichen Systemgrenzen übereinstimmt, dazu führt, dass eine einzelne fachliche Änderung mehrere Teams koordinieren muss, während eine an die Systemarchitektur angepasste Teamstruktur dieselbe Änderung innerhalb eines Teams ermöglicht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Organisationsdesign für technische Systeme

> **Ziel:** Organisationsdesign für technische Systeme richtet **Entscheidungswege** (wer tatsächlich schnell genug entscheiden kann, um mit dem Veränderungstempo eines Systembereichs Schritt zu halten) und **Verantwortungsgrenzen** (welches Team tatsächlich für welchen Teil eines Systems zuständig ist) explizit am tatsächlichen Veränderungsbedarf aus, statt einer rein historisch gewachsenen oder rein hierarchisch begründeten Struktur zu folgen. Der zentrale Punkt dieses Kapitels ist die praktische Anwendung von Conway's Law (Systeme spiegeln tatsächlich die Kommunikationsstruktur der Organisation, die sie baut, wider) — eine Teamstruktur, die tatsächlich nicht mit den fachlichen Systemgrenzen übereinstimmt, zwingt eine einzelne, fachlich zusammenhängende Änderung tatsächlich dazu, mehrere Teamgrenzen zu überschreiten, was Koordinationsaufwand erzeugt, der bei einer tatsächlich passenden Teamstruktur vermeidbar wäre.

## Zweck, Mental Model und Dependencies

Entscheidungswege an Veränderungsbedarf auszurichten bedeutet, tatsächlich zu bewerten, wie schnell sich ein Systembereich tatsächlich ändert, und die Entscheidungsbefugnis entsprechend zu delegieren — ein Systembereich mit hoher, tatsächlicher Änderungsfrequenz (etwa eine sich schnell entwickelnde Kernfunktion) benötigt tatsächlich kurze, dezentrale Entscheidungswege, während ein stabiler, selten geänderter Bereich tatsächlich auch mit zentraleren, langsameren Entscheidungswegen funktionieren kann; eine einheitliche, undifferenzierte Entscheidungsstruktur für alle Systembereiche passt tatsächlich nicht zu deren unterschiedlichem, tatsächlichem Veränderungstempo. Verantwortungsgrenzen zu definieren bedeutet, tatsächlich zu klären, welches Team für welchen Teil des Systems zuständig ist, und diese Grenzen tatsächlich mit den fachlichen Systemgrenzen (etwa Domain-Grenzen, siehe die in vielen Commerce- und Enterprise-Architecture-Kapiteln dieses Curriculums etablierten Bounded-Context-Prinzipien) in Übereinstimmung zu bringen — Conway's Law beschreibt, dass die tatsächliche Systemarchitektur tendenziell die tatsächliche Kommunikationsstruktur der bauenden Organisation widerspiegelt; eine bewusste Nutzung dieses Prinzips (manchmal als "Inverse Conway Maneuver" bezeichnet) bedeutet, die Teamstruktur tatsächlich gezielt so zu gestalten, dass sie die gewünschte Systemarchitektur unterstützt, statt die Teamstruktur unreflektiert historisch fortzuführen. Teamlast zu bewerten bedeutet, tatsächlich zu prüfen, ob ein Team tatsächlich die kognitive Kapazität hat, seinen zugewiesenen Verantwortungsbereich tatsächlich zu verstehen und zu pflegen — ein Team, dem tatsächlich zu viele, fachlich unzusammenhängende Systembereiche zugewiesen sind, kann tatsächlich keinen davon tief genug verstehen, was zu tatsächlich niedrigerer Qualität in allen zugewiesenen Bereichen führt. Abhängigkeiten explizit zu bewerten bedeutet, tatsächlich zu erkennen, welche Teams tatsächlich voneinander abhängig sind, um eine gemeinsame Änderung durchzuführen — eine hohe Anzahl tatsächlicher, häufiger Cross-Team-Abhängigkeiten deutet tatsächlich darauf hin, dass die aktuelle Teamstruktur nicht mit der tatsächlichen Systemarchitektur übereinstimmt und tatsächlich überdacht werden sollte. Fachliche Ownership bei Strukturänderungen zu bewerten bedeutet, bei jeder Reorganisation tatsächlich zu prüfen, ob die neue Struktur die fachliche Verantwortung tatsächlich klarer statt unklarer macht — eine Strukturänderung, die primär aus organisatorischen (etwa hierarchischen) statt aus fachlichen Gründen erfolgt, riskiert tatsächlich, bestehende, funktionierende Verantwortungsgrenzen zu zerschneiden.

~~~text
Organizational design for technical systems aligns DECISION PATHS (who can ACTUALLY
  decide fast enough to keep pace w/ a system area's rate of change) + RESPONSIBILITY
  BOUNDARIES (which team ACTUALLY responsible for which system part) explicitly w/
  ACTUAL change need, instead of following a purely historically-grown or purely
  hierarchically-justified structure
KEY POINT: practical application of Conway's Law (systems ACTUALLY mirror communication
  structure of the org that builds them) -- team structure ACTUALLY not matching
  business system boundaries ACTUALLY forces a single, business-coherent change to cross
  multiple team boundaries, creating coordination overhead avoidable w/ an ACTUALLY
  fitting team structure
ALIGNING DECISION PATHS W/ CHANGE NEED means ACTUALLY assessing how fast a system area
  ACTUALLY changes, delegating decision authority accordingly -- high-actual-change-
  frequency system area (rapidly evolving core function) ACTUALLY needs short,
  decentralized decision paths, while a stable, rarely-changed area CAN ACTUALLY still
  function w/ more centralized, slower decision paths
  uniform, undifferentiated decision structure for all system areas ACTUALLY doesn't fit
  their different, ACTUAL change pace
DEFINING RESPONSIBILITY BOUNDARIES means ACTUALLY clarifying which team responsible for
  which system part, ACTUALLY bringing these boundaries in line w/ business system
  boundaries (domain boundaries, bounded-context principles established across many
  commerce/enterprise-architecture chapters of this curriculum)
  Conway's Law describes ACTUAL system architecture tends to mirror ACTUAL communication
  structure of building org -- deliberately using this principle (sometimes "Inverse
  Conway Maneuver") means ACTUALLY deliberately shaping team structure to support
  desired system architecture, instead of unreflectively continuing team structure
  historically
ASSESSING TEAM LOAD means ACTUALLY checking whether a team ACTUALLY has cognitive
  capacity to ACTUALLY understand+maintain its assigned responsibility area -- team
  ACTUALLY assigned too many, business-unrelated system areas can't ACTUALLY understand
  any of them deeply enough, leading to ACTUALLY lower quality across all assigned areas
EXPLICITLY ASSESSING DEPENDENCIES means ACTUALLY recognizing which teams ACTUALLY depend
  on each other to make a joint change -- high number of ACTUAL, frequent cross-team
  dependencies ACTUALLY indicates current team structure doesn't match ACTUAL system
  architecture, should ACTUALLY be reconsidered
ASSESSING BUSINESS OWNERSHIP ON STRUCTURE CHANGES means ACTUALLY checking, at every
  reorganization, whether new structure ACTUALLY makes business responsibility clearer
  instead of less clear -- structure change primarily for organizational (hierarchical)
  instead of business reasons ACTUALLY risks cutting through existing, functioning
  responsibility boundaries
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Entscheidungswege nach Veränderungstempo | delegiert Entscheidungsbefugnis passend zur Änderungsfrequenz | verhindert einheitliche, unpassende Entscheidungsstruktur für alle Bereiche |
| Conway's Law / Inverse Conway Maneuver | erkennt Wechselwirkung zwischen Teamstruktur und Systemarchitektur | ermöglicht bewusste Teamstrukturgestaltung für gewünschte Architektur |
| Teamlast-Bewertung | prüft kognitive Kapazität für zugewiesenen Verantwortungsbereich | verhindert oberflächliches Verständnis bei Überlastung |
| Explizite Abhängigkeitsbewertung | erfasst tatsächliche Cross-Team-Abhängigkeiten | zeigt Fehlpassung zwischen Teamstruktur und Systemarchitektur an |
| Fachliche Ownership-Prüfung bei Reorganisation | verifiziert, ob neue Struktur Verantwortung klärt statt verwischt | verhindert rein hierarchisch motivierte Strukturänderungen |

Implementierung: Entscheidungswege werden explizit gegen das tatsächliche Veränderungstempo jedes Systembereichs geprüft und angepasst. Teamgrenzen werden bewusst an fachliche Systemgrenzen ausgerichtet. Vor jeder Reorganisation wird explizit geprüft, ob die neue Struktur die fachliche Verantwortung tatsächlich klarer macht.

## Scalability, Reliability, Security und Observability

Eine Organisationsdesign-Praxis skaliert über die Anzahl der zu koordinierenden Teams und Systembereiche; die Reliability-Grenze liegt darin, dass eine der Systemarchitektur widersprechende Teamstruktur tatsächlich zu erhöhtem Koordinationsaufwand und verlangsamter Änderungsgeschwindigkeit führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine einzelne, fachlich zusammenhängende Änderung erfordert die Koordination mehrerer Teams | die Teamstruktur stimmt nicht mit den tatsächlichen Systemgrenzen überein | die Teamgrenzen an die tatsächlichen, fachlichen Systemgrenzen anpassen |
| ein Team liefert in mehreren zugewiesenen Bereichen niedrige Qualität | dem Team sind zu viele, fachlich unzusammenhängende Systembereiche zugewiesen | die Teamverantwortung auf einen fokussierteren, tatsächlich bewältigbaren Bereich reduzieren |
| eine Reorganisation führt zu mehr statt weniger Unklarheit über Verantwortlichkeiten | die Strukturänderung erfolgte aus hierarchischen statt fachlichen Gründen | die Reorganisation explizit gegen fachliche Klarheit statt organisatorische Bequemlichkeit prüfen |

Security: Sicherheitsrelevante Systembereiche sollten Teams mit expliziter, ausreichender Sicherheitskompetenz zugeordnet sein, nicht nur nach organisatorischer Verfügbarkeit. Observability: Die tatsächliche Häufigkeit und Dauer von Cross-Team-Koordinationsaufwänden pro fachlicher Änderung ist ein zentrales Signal zur Bewertung der Passung zwischen Team- und Systemstruktur.

## Trade-offs und Entscheidungen

**Staff** arbeitet innerhalb einer gegebenen Teamverantwortung an einem begrenzten Systembereich. **Principal** entwirft eine Teamstruktur für einen komplexen Systembereich, die Entscheidungswege und Abhängigkeiten explizit berücksichtigt. **Chief** legt das unternehmensweite Organisationsdesign fest und verantwortet dessen Ausrichtung an der tatsächlichen Systemarchitektur.

Anti-Patterns: eine Teamstruktur unreflektiert historisch fortführen, ohne sie gegen die tatsächliche Systemarchitektur zu prüfen; einem Team zu viele, fachlich unzusammenhängende Bereiche zuweisen; eine Reorganisation primär aus hierarchischen statt fachlichen Gründen durchführen.

## Production Checklist

- [ ] Entscheidungswege sind explizit an das tatsächliche Veränderungstempo jedes Systembereichs angepasst.
- [ ] Teamgrenzen sind an fachliche Systemgrenzen ausgerichtet.
- [ ] Die Teamlast ist gegen die tatsächliche kognitive Kapazität geprüft.
- [ ] Cross-Team-Abhängigkeiten sind explizit erfasst und bewertet.

## Interviewfragen

### 1. Was beschreibt Conway's Law?

**Antwort:** Dass die tatsächliche Systemarchitektur tendenziell die tatsächliche Kommunikationsstruktur der bauenden Organisation widerspiegelt.

### 2. Was ist ein Inverse Conway Maneuver?

**Antwort:** Die bewusste, gezielte Gestaltung der Teamstruktur, um eine gewünschte Systemarchitektur zu unterstützen, statt die Teamstruktur unreflektiert historisch fortzuführen.

### 3. Warum sollten Entscheidungswege nicht einheitlich für alle Systembereiche gestaltet sein?

**Antwort:** Weil unterschiedliche Systembereiche tatsächlich unterschiedliche Veränderungsgeschwindigkeiten haben, und eine einheitliche Entscheidungsstruktur nicht zu diesem unterschiedlichen Tempo passt.

### 4. Was zeigt eine hohe Anzahl häufiger Cross-Team-Abhängigkeiten typischerweise an?

**Antwort:** Dass die aktuelle Teamstruktur nicht mit der tatsächlichen Systemarchitektur übereinstimmt und überdacht werden sollte.

### 5. Wie gehst du vor, wenn eine einzelne, fachlich zusammenhängende Änderung die Koordination mehrerer Teams erfordert?

**Antwort:** Ich prüfe, ob die Teamstruktur mit den tatsächlichen Systemgrenzen übereinstimmt, und passe die Teamgrenzen an die fachlichen Systemgrenzen an, um künftige Koordinationsaufwände zu reduzieren.

### 6. Widersprüchliche Anforderung: Die Personalabteilung will eine einheitliche, hierarchisch klare Teamgrößenstruktur UND die Organisation will Teamgrenzen, die tatsächlich den fachlichen Systemgrenzen folgen — wie gehst du vor?

**Antwort:** Ich würde die fachlichen Systemgrenzen als primäres Kriterium für die Teamstruktur verwenden und innerhalb dieser fachlich sinnvollen Grenzen auf angemessene, konsistente Teamgrößen achten, statt eine rein hierarchisch einheitliche Struktur zu erzwingen, die tatsächliche fachliche Zusammenhänge zerschneiden würde.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Unternehmen hat eine Teamstruktur, bei der ein Team für "alle Backend-Services" und ein anderes Team für "alle Frontend-Anwendungen" zuständig ist, unabhängig von fachlichen Domain-Grenzen wie Bestellung, Zahlung oder Versand (angelehnt an Domain 29).

~~~python
# Local, deterministic illustration of cross-team coordination overhead from misaligned team structure (fictional lab example, no real organization):

def coordination_overhead(change_touches_domains, team_structure):
    teams_involved = set()
    for domain in change_touches_domains:
        teams_involved.add(team_structure.get(domain, "unknown"))
    return len(teams_involved)

layer_based_structure = {"order": "backend_team", "payment": "backend_team", "order_ui": "frontend_team"}
domain_based_structure = {"order": "order_team", "payment": "payment_team", "order_ui": "order_team"}

change = ["order", "order_ui"]  # a single, business-coherent change
print(coordination_overhead(change, layer_based_structure))
print(coordination_overhead(change, domain_based_structure))
~~~

Erwartete Beobachtung: Die layer-basierte Struktur erfordert die Koordination von zwei Teams für eine einzige, fachlich zusammenhängende Änderung, während die domain-basierte Struktur dieselbe Änderung innerhalb eines Teams ermöglicht. Auswertung: Die domain-basierte Teamstruktur reduziert den Koordinationsaufwand für fachlich zusammenhängende Änderungen erheblich, entsprechend Conway's Law.

## Dependencies, Cross-References und Quellen

1. Melvin Conway: [How Do Committees Invent? (Original Conway's Law Paper)](http://www.melconway.com/Home/Committees_Paper.html), abgerufen 2026-09-18.
2. Matthew Skelton, Manuel Pais: [Team Topologies — Organizing Business and Technology Teams for Fast Flow](https://teamtopologies.com/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0679 (Stakeholder Mapping) beschriebenen Entscheidungsrechte-Kartierung auf und der in KB-0688 (Plattformstrategie) beschriebenen Team-Ownership-Klärung.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Analyse von Codebasis-Abhängigkeiten und Commit-Mustern zur datengestützten Identifikation tatsächlicher Cross-Team-Kopplung | Growing Adoption | Bei künftigen, größeren Reorganisationen als Ergänzung evaluieren, jedoch die finale Entscheidung über Teamstruktur weiterhin unter Berücksichtigung fachlicher Domain-Grenzen und menschlichen Urteilsvermögens treffen. |

Ein Team akzeptiert ein Organisationsdesign erst, wenn Entscheidungswege, Verantwortungsgrenzen und Teamlast nachweislich explizit an den tatsächlichen Veränderungsbedarf und die tatsächliche Systemarchitektur angepasst sind.
