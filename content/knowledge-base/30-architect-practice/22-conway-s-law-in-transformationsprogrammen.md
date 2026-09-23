---
{"id": "KB-0698", "title": "Conway's Law in Transformationsprogrammen", "domain": "30", "sequence": 22, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0696", "concepts": ["Conway's Law", "Inverse Conway Maneuver"], "needed_for": "Dieses Kapitel referenziert die in KB-0696 eingeführte Conway's-Law-Erklärung und wendet sie auf vollständige Transformationsprogramme an"}, {"id": "KB-0694", "concepts": ["Programmabschnitte mit Zwischenzuständen"], "needed_for": "Die gemeinsame Veränderung von Kommunikationsmustern und Systemgrenzen erfolgt über dieselben Programmabschnitte wie in KB-0694 beschrieben"}], "related": ["KB-0697"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes Transformationsprogramm Kommunikationsmuster und gewünschte Systemgrenzen gemeinsam als Veränderungsvorhaben planen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Transformationsprogramm mehrere Zielarchitekturen gegen die tatsächliche, organisatorische Umsetzbarkeit prüfen und begründen, welches Architekturziel tatsächlich erreichbar ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein angestrebtes Architekturziel der tatsächlichen Kommunikationsstruktur der Organisation widerspricht und deshalb tatsächlich nicht erreichbar ist, ohne diese Struktur mitzuverändern.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein Transformationsprogramm leiten, das Kommunikationsmuster und Systemgrenzen gemeinsam verändert, und die organisatorische Umsetzbarkeit des Architekturziels verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, akademische Weiterentwicklung der Conway's-Law-Forschung im Detail ist Vertiefung.", "rationale": "Kern ist die praktische Anwendung auf Transformationsprogramme, nicht die akademische Forschungsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0698-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung eines an der Kommunikationsstruktur scheiternden Architekturziels, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein angestrebtes, entkoppeltes Microservices-Zielbild trotz technisch korrekter Planung scheitert, solange die zugrunde liegende Kommunikationsstruktur der Organisation unverändert eng gekoppelt bleibt, und wie eine gemeinsame Veränderung beider Dimensionen das Ziel tatsächlich erreichbar macht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Conway's Law in Transformationsprogrammen

> **Ziel:** Dieses Kapitel referenziert die in KB-0696 eingeführte, kanonische Erklärung von Conway's Law (Systeme spiegeln tatsächlich die Kommunikationsstruktur der bauenden Organisation wider) als bereits etabliert und wendet sie auf vollständige Transformationsprogramme an: Ein angestrebtes Architekturziel (etwa eine entkoppelte Microservices-Landschaft) kann tatsächlich nicht allein durch technische Umsetzung erreicht werden, wenn die zugrunde liegende Kommunikationsstruktur der Organisation tatsächlich unverändert eng gekoppelt bleibt. Der zentrale Punkt dieses Kapitels ist, dass Kommunikationsmuster und gewünschte Systemgrenzen gemeinsam, als ein einziges Veränderungsvorhaben, verändert werden müssen — ein Transformationsprogramm, das nur die technische Architektur, aber nicht die zugrunde liegende Organisationsstruktur verändert, wird tatsächlich, entsprechend Conway's Law, dazu tendieren, die alte, gekoppelte Struktur in der neuen Technologie zu reproduzieren.

## Zweck, Mental Model und Dependencies

Kommunikationsmuster und Systemgrenzen gemeinsam zu verändern bedeutet, tatsächlich anzuerkennen, dass eine rein technische Architekturvorgabe (etwa "wir bauen jetzt Microservices") ohne eine begleitende, tatsächliche Veränderung der Teamstruktur und Kommunikationswege tatsächlich zum Scheitern neigt — Entwickler, die weiterhin tatsächlich eng, häufig und informell miteinander kommunizieren (weil sie tatsächlich im selben Team sitzen und an derselben, ungetrennten fachlichen Aufgabe arbeiten), werden tatsächlich dazu tendieren, Code zu produzieren, der diese enge Kopplung widerspiegelt, unabhängig davon, wie die formale, technische Zielarchitektur aussieht. Organisatorische Umsetzbarkeit zu bewerten bedeutet, tatsächlich zu prüfen, ob ein angestrebtes Architekturziel innerhalb der tatsächlichen, aktuellen oder geplanten Organisationsstruktur tatsächlich erreichbar ist, bevor es als technisches Ziel festgelegt wird — ein Architekturziel, das eine bestimmte Entkopplung erfordert, aber tatsächlich keine begleitende Teamstrukturänderung vorsieht, sollte tatsächlich als organisatorisch nicht umsetzbar eingestuft werden, bis diese begleitende Veränderung tatsächlich geplant ist. Diese gemeinsame Veränderung erfolgt praktisch über dieselben Programmabschnitte, die in KB-0694 für technische Modernisierung beschrieben wurden — jeder Programmabschnitt sollte tatsächlich sowohl einen technischen Fortschritt (etwa die Extraktion eines Services) als auch einen organisatorischen Fortschritt (etwa die entsprechende Anpassung der Teamverantwortung) tatsächlich gemeinsam umfassen, statt die technische und organisatorische Dimension getrennt und unkoordiniert zu planen. Der Inverse Conway Maneuver (bereits in KB-0696 eingeführt) wird hier zur zentralen Steuerungsstrategie eines Transformationsprogramms: Statt zu warten, bis eine neue Systemarchitektur die Teamstruktur organisch beeinflusst, wird die Teamstruktur tatsächlich bewusst und vorausschauend verändert, um die gewünschte Systemarchitektur aktiv zu fördern — diese vorausschauende Veränderung ist tatsächlich effektiver als eine rein reaktive, spätere Anpassung der Organisationsstruktur an eine bereits (fehlgeschlagen) umgesetzte technische Architektur.

~~~text
This chapter references KB-0696's canonical explanation of Conway's Law (systems
  ACTUALLY mirror communication structure of building org) as already established,
  applies it to complete transformation programs: intended architecture goal
  (decoupled microservices landscape) can ACTUALLY not be achieved through technical
  implementation alone, when underlying org communication structure ACTUALLY stays
  unchanged, tightly coupled
KEY POINT: communication patterns + intended system boundaries must be changed jointly,
  as a single change initiative -- transformation program changing only technical
  architecture but not underlying org structure will ACTUALLY, per Conway's Law, tend to
  reproduce old, coupled structure in new technology
JOINTLY CHANGING COMMUNICATION PATTERNS + SYSTEM BOUNDARIES means ACTUALLY acknowledging
  a purely technical architecture directive ("we're now building microservices") w/o
  accompanying, ACTUAL team structure/communication-path change ACTUALLY tends to fail
  -- developers ACTUALLY still communicating closely, frequently, informally (same team,
  same undivided business task) will ACTUALLY tend to produce code reflecting this close
  coupling, regardless of formal, technical target architecture
ASSESSING ORGANIZATIONAL FEASIBILITY means ACTUALLY checking whether an intended
  architecture goal is ACTUALLY achievable within ACTUAL, current or planned org
  structure before it's fixed as technical goal -- architecture goal requiring certain
  decoupling but ACTUALLY not foreseeing accompanying team structure change should
  ACTUALLY be classified organizationally infeasible until that accompanying change is
  ACTUALLY planned
this joint change practically happens via same program segments described in KB-0694
  for technical modernization -- every program segment should ACTUALLY jointly comprise
  both technical progress (service extraction) AND organizational progress (matching
  team-responsibility adjustment), instead of planning technical+organizational
  dimensions separately+uncoordinated
INVERSE CONWAY MANEUVER (already introduced KB-0696) becomes central steering strategy
  of a transformation program here: instead of waiting for new system architecture to
  organically influence team structure, team structure ACTUALLY deliberately+proactively
  changed to actively foster desired system architecture -- this proactive change is
  ACTUALLY more effective than purely reactive, later adaptation of org structure to an
  already-(failed-)implemented technical architecture
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Gemeinsame Veränderung von Kommunikation und Systemgrenzen | verhindert Reproduktion alter Kopplung in neuer Technologie | zentrale Voraussetzung für tatsächlichen Transformationserfolg |
| Organisatorische Umsetzbarkeitsprüfung | prüft Architekturziel gegen tatsächliche Organisationsstruktur | verhindert Festlegung organisatorisch unerreichbarer Ziele |
| Gemeinsame Programmabschnitte (technisch + organisatorisch) | koordiniert beide Veränderungsdimensionen | verhindert getrennte, unkoordinierte Planung |
| Inverse Conway Maneuver als Steuerungsstrategie | proaktive statt reaktive Teamstrukturveränderung | effektiver als spätere Anpassung an fehlgeschlagene Architektur |

Implementierung: Jedes angestrebte Architekturziel wird explizit gegen die organisatorische Umsetzbarkeit geprüft, bevor es festgelegt wird. Programmabschnitte umfassen gemeinsam technische und organisatorische Veränderungsschritte. Die Teamstruktur wird proaktiv, nicht erst reaktiv, an die gewünschte Systemarchitektur angepasst.

## Scalability, Reliability, Security und Observability

Eine Conway's-Law-bewusste Transformationspraxis skaliert über die Anzahl der gemeinsam zu verändernden Team- und Systemgrenzen; die Reliability-Grenze liegt darin, dass eine rein technische Transformation ohne begleitende Organisationsänderung tatsächlich zur Reproduktion der alten, gekoppelten Struktur führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine angestrebte Microservices-Entkopplung scheitert trotz technisch korrekter Implementierung | die zugrunde liegende Teamstruktur wurde nicht entsprechend verändert | die Teamstruktur explizit an die gewünschte technische Entkopplung anpassen |
| ein Transformationsprogramm zeigt technischen Fortschritt, aber keine tatsächliche organisatorische Veränderung | technische und organisatorische Programmabschnitte wurden getrennt statt gemeinsam geplant | künftige Programmabschnitte um explizite, gemeinsame technisch-organisatorische Ziele ergänzen |
| ein Architekturziel wird trotz mehrfacher Versuche nie tatsächlich erreicht | das Ziel wurde nie gegen die tatsächliche organisatorische Umsetzbarkeit geprüft | eine explizite Umsetzbarkeitsprüfung nachholen und das Ziel gegebenenfalls anpassen |

Security: Sicherheitsrelevante Verantwortungsgrenzen sollten bei einer Teamstrukturveränderung besonders sorgfältig geprüft werden, um keine unklaren Sicherheitszuständigkeiten zu erzeugen. Observability: Die tatsächliche Übereinstimmung zwischen geplanter technischer Architektur und tatsächlich beobachteter Kommunikationsstruktur ist ein zentrales Signal zur Bewertung des Transformationsfortschritts.

## Trade-offs und Entscheidungen

**Staff** setzt einen gegebenen, gemeinsamen technisch-organisatorischen Programmabschnitt um. **Principal** entwirft die vollständige Transformationsstrategie mit gemeinsamer Veränderung von Kommunikation und Systemgrenzen. **Chief** leitet das Transformationsprogramm und verantwortet die organisatorische Umsetzbarkeit des Architekturziels.

Anti-Patterns: eine technische Zielarchitektur festlegen, ohne die organisatorische Umsetzbarkeit zu prüfen; technische und organisatorische Veränderung getrennt und unkoordiniert planen; auf eine organische, spätere Anpassung der Organisationsstruktur warten, statt proaktiv den Inverse Conway Maneuver zu nutzen.

## Production Checklist

- [ ] Jedes Architekturziel ist gegen die tatsächliche, organisatorische Umsetzbarkeit geprüft.
- [ ] Programmabschnitte umfassen gemeinsam technische und organisatorische Veränderungsschritte.
- [ ] Die Teamstruktur wird proaktiv an die gewünschte Systemarchitektur angepasst.
- [ ] Die tatsächliche Kommunikationsstruktur wird während des Programms gegen die geplante technische Architektur geprüft.

## Interviewfragen

### 1. Warum reicht eine rein technische Architekturvorgabe für eine erfolgreiche Transformation nicht aus?

**Antwort:** Weil Entwickler, die weiterhin eng und informell kommunizieren, tendenziell Code produzieren, der diese enge Kopplung widerspiegelt, unabhängig von der formalen, technischen Zielarchitektur.

### 2. Was bedeutet organisatorische Umsetzbarkeitsprüfung eines Architekturziels?

**Antwort:** Zu prüfen, ob ein angestrebtes Architekturziel innerhalb der tatsächlichen, aktuellen oder geplanten Organisationsstruktur tatsächlich erreichbar ist, bevor es als technisches Ziel festgelegt wird.

### 3. Warum sollten technische und organisatorische Veränderung in gemeinsamen Programmabschnitten statt getrennt geplant werden?

**Antwort:** Damit beide Dimensionen koordiniert vorangehen, statt dass eine technische Veränderung ohne begleitende organisatorische Anpassung ins Leere läuft.

### 4. Was ist der Vorteil des Inverse Conway Maneuvers gegenüber einer reaktiven Organisationsanpassung?

**Antwort:** Eine proaktive, vorausschauende Veränderung der Teamstruktur fördert aktiv die gewünschte Systemarchitektur, statt erst nach einer bereits fehlgeschlagenen technischen Umsetzung reaktiv angepasst zu werden.

### 5. Wie gehst du vor, wenn eine angestrebte Microservices-Entkopplung trotz technisch korrekter Implementierung scheitert?

**Antwort:** Ich prüfe, ob die zugrunde liegende Teamstruktur entsprechend verändert wurde, und passe sie explizit an die gewünschte technische Entkopplung an, statt die Ursache allein in der technischen Umsetzung zu suchen.

### 6. Widersprüchliche Anforderung: Die Geschäftsführung will eine schnelle, rein technische Migration ohne organisatorische Umstrukturierung UND die Organisation will eine nachhaltig entkoppelte Zielarchitektur — wie gehst du vor?

**Antwort:** Ich würde explizit aufzeigen, dass die angestrebte, nachhaltige Entkopplung ohne begleitende organisatorische Veränderung gemäß Conway's Law tatsächlich nicht erreichbar ist, und eine minimal notwendige, aber tatsächlich ausreichende organisatorische Anpassung vorschlagen, statt entweder die organisatorische Dimension vollständig zu ignorieren oder eine unnötig umfassende Reorganisation durchzuführen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Unternehmen migriert einen Monolithen zu Microservices (angelehnt an Domain 16), behält aber ein einziges, großes Entwicklerteam bei, das weiterhin alle Services gemeinsam entwickelt und eng abstimmt.

~~~python
# Local, deterministic illustration of technical architecture goal vs. organizational feasibility (fictional lab example, no real organization):

def check_transformation_feasibility(target_architecture, current_team_structure):
    if target_architecture == "decoupled_microservices" and current_team_structure == "single_monolithic_team":
        return {"feasible": False, "reason": "team structure mirrors monolith, will reproduce coupling per Conway's Law"}
    return {"feasible": True}

result = check_transformation_feasibility("decoupled_microservices", "single_monolithic_team")
print(result)
~~~

Erwartete Beobachtung: Die Prüfung zeigt korrekt an, dass das technische Entkopplungsziel mit der aktuellen, unveränderten Teamstruktur tatsächlich nicht erreichbar ist. Auswertung: Erst eine begleitende Aufteilung des Entwicklerteams entlang der gewünschten Service-Grenzen würde die tatsächliche organisatorische Umsetzbarkeit des Architekturziels herstellen.

## Dependencies, Cross-References und Quellen

1. Melvin Conway: [How Do Committees Invent?](http://www.melconway.com/Home/Committees_Paper.html), abgerufen 2026-09-18.
2. James Lewis, Martin Fowler: [Microservices — A Definition of This New Architectural Term](https://martinfowler.com/articles/microservices.html), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0696 (Organisationsdesign) eingeführten Conway's-Law-Erklärung und der in KB-0694 (Modernisierungsprogramme) beschriebenen Programmabschnittsstruktur auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Kommunikationsmuster-Analyse (Code-Ownership-Overlap, Cross-Team-Pull-Request-Häufigkeit) zur frühzeitigen Erkennung von Conway's-Law-Konflikten während laufender Transformationsprogramme | Emerging | Bei künftigen, umfangreichen Transformationsprogrammen als Ergänzung evaluieren, jedoch die finale Bewertung organisatorischer Umsetzbarkeit weiterhin durch menschliches, strukturelles Urteilsvermögen treffen. |

Ein Team akzeptiert ein Transformationsprogramm erst, wenn technische und organisatorische Veränderung nachweislich gemeinsam geplant und die organisatorische Umsetzbarkeit des Architekturziels explizit geprüft ist.
