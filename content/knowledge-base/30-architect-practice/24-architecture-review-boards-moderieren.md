---
{"id": "KB-0700", "title": "Architecture Review Boards moderieren", "domain": "30", "sequence": 24, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0612", "concepts": ["Architecture Review Boards"], "needed_for": "Dieses Kapitel referenziert den in KB-0612 beschriebenen, kanonischen Governanceprozess und konzentriert sich auf die praktische Moderation"}, {"id": "KB-0699", "concepts": ["Konfliktlösung über Review Boards"], "needed_for": "Dieses Kapitel vertieft die in KB-0699 skizzierte Review-Board-Konfliktlösung um konkrete Moderationstechniken"}], "related": ["KB-0684"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Reviewagenda mit Evidenz und Entscheidungsvorlagen für ein gegebenes Architecture Review Board vorbereiten und eine Sitzung mit Dissens tatsächlich moderieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe, kontroverse Reviewsitzung mehrere Moderationsstrategien für Dissens und Eskalation entwerfen und begründen, welche Strategie die tatsächliche Entscheidungsqualität am besten sichert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Reviewsitzung ohne strukturierte Agenda und vorbereitete Evidenz tatsächlich zu einer unproduktiven, meinungsbasierten Diskussion statt einer fundierten Entscheidung wird.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein Architecture Review Board als wirksames Entscheidungsgremium führen, das Dissens und Eskalationen tatsächlich produktiv statt destruktiv moderiert.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, kanonische Governanceprozessdefinition selbst (siehe KB-0612) ist Vertiefung und wird hier bewusst nicht erneut definiert.", "rationale": "Kern ist die praktische Moderation einer konkreten Sitzung, nicht die erneute Definition des zugrunde liegenden Governanceprozesses."}}, "lab_validation": [{"lab_id": "KB-0700-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung strukturierter Dissens-Moderation, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine vorbereitete Agenda mit expliziter Evidenzanforderung einen Dissens zwischen zwei Board-Mitgliedern zu einer begründeten, nachvollziehbaren Entscheidung führt, statt in einer unproduktiven Meinungsdiskussion zu enden.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Architecture Review Boards moderieren

> **Ziel:** Dieses Kapitel referenziert den in KB-0612 beschriebenen, kanonischen Governanceprozess von Architecture Review Boards als bereits etabliert und definiert ihn hier bewusst nicht erneut — der Fokus liegt auf der praktischen Moderation einer konkreten Sitzung: eine strukturierte **Reviewagenda** (die vorab festlegt, welche Fälle tatsächlich besprochen werden und in welcher Reihenfolge), vorbereitete **Evidenz** (die tatsächlich benötigten Belege, die vor der Sitzung bereitgestellt werden, statt während der Sitzung erst zusammengetragen zu werden) und strukturierte **Entscheidungsvorlagen** (entsprechend dem in KB-0684 beschriebenen Prinzip evidenzbasierter, priorisierter Feststellungen). Der zentrale Punkt dieses Kapitels ist die Moderation von Dissens, Ausnahmen und Eskalationen — eine Reviewsitzung ohne strukturierte Moderation dieser drei Situationen wird tatsächlich häufig zu einer unproduktiven, meinungsbasierten Diskussion statt einer fundierten, nachvollziehbaren Entscheidung.

## Zweck, Mental Model und Dependencies

Eine strukturierte Reviewagenda vorab bereitzustellen bedeutet, tatsächlich vor der Sitzung festzulegen, welche konkreten Fälle besprochen werden, mit welcher tatsächlich veranschlagten Zeit pro Fall — eine unstrukturierte Sitzung ohne vorab kommunizierte Agenda führt tatsächlich dazu, dass Teilnehmer unvorbereitet erscheinen und die verfügbare Zeit ineffizient auf zu viele oder zu wenig relevante Fälle verteilt wird. Evidenz vorab bereitzustellen bedeutet, tatsächlich zu verlangen, dass die zur Bewertung notwendigen Belege (Design Docs, siehe KB-0682, Testergebnisse, Risikoanalysen) vor der Sitzung tatsächlich vorliegen, statt sie während der Sitzung erst zu erfragen — eine Sitzung, die Evidenz erst während des Meetings zusammenträgt, verschwendet tatsächlich die begrenzte, gemeinsame Zeit der Board-Mitglieder für eine Aufgabe, die tatsächlich vorab hätte erledigt werden können. Dissens zwischen Board-Mitgliedern strukturiert zu moderieren bedeutet, tatsächlich beide Positionen mit ihrer jeweiligen Evidenz vollständig darzustellen (entsprechend dem in KB-0685 beschriebenen Prinzip fairer Gegenargumentbehandlung), bevor eine Entscheidung getroffen wird, statt den Dissens durch eine unstrukturierte, sich wiederholende Diskussion tatsächlich zu verlängern — eine strukturierte Moderation stellt tatsächlich sicher, dass jede Position vollständig gehört wird, bevor die Sitzung zu einer begründeten Entscheidung kommt. Ausnahmen zu moderieren bedeutet, tatsächlich den in KB-0699 beschriebenen Ausnahmeprozess innerhalb der Sitzung konkret anzuwenden — ein Board, das Ausnahmeanträge ad hoc statt anhand definierter Kriterien behandelt, riskiert tatsächlich inkonsistente Entscheidungen zwischen ähnlichen Fällen. Eskalationen zu moderieren bedeutet, tatsächlich zu erkennen, wann eine Entscheidung innerhalb des Boards tatsächlich nicht getroffen werden kann (etwa weil sie tatsächlich außerhalb der Befugnis des Boards liegt oder eine unternehmensweite, strategische Dimension hat) und den Fall tatsächlich strukturiert an die nächsthöhere Entscheidungsinstanz weiterzugeben, statt eine Entscheidung zu erzwingen, die tatsächlich nicht in der Befugnis des Boards liegt.

~~~text
This chapter references KB-0612's canonical governance process for architecture review
  boards as already established, deliberately doesn't redefine it here -- focus on
  practical moderation of a concrete session: structured REVIEW AGENDA (fixes in
  advance which cases ACTUALLY discussed, in what order), prepared EVIDENCE (ACTUALLY
  needed evidence provided before session instead of assembled during it), structured
  DECISION BRIEFS (per KB-0684's evidence-based, prioritized finding principle)
KEY POINT: moderating dissent, exceptions, escalations -- review session w/o structured
  moderation of these 3 situations ACTUALLY frequently becomes unproductive, opinion-
  based discussion instead of a substantiated, traceable decision
PROVIDING STRUCTURED REVIEW AGENDA IN ADVANCE means ACTUALLY fixing before session which
  concrete cases discussed, w/ ACTUALLY budgeted time per case -- unstructured session
  w/o advance-communicated agenda ACTUALLY leads to participants appearing unprepared,
  available time ACTUALLY inefficiently distributed across too many/too few relevant
  cases
PROVIDING EVIDENCE IN ADVANCE means ACTUALLY requiring evidence needed for assessment
  (design docs, see KB-0682, test results, risk analyses) ACTUALLY present before
  session instead of first requested during it -- session assembling evidence only
  during meeting ACTUALLY wastes board members' limited, joint time on task ACTUALLY
  completable beforehand
STRUCTURALLY MODERATING DISSENT between board members means ACTUALLY fully presenting
  both positions w/ their respective evidence (per KB-0685's fair-counterargument
  principle) before a decision made, instead of ACTUALLY prolonging dissent through
  unstructured, repetitive discussion -- structured moderation ACTUALLY ensures every
  position fully heard before session reaches a substantiated decision
MODERATING EXCEPTIONS means ACTUALLY concretely applying KB-0699's exception process
  within the session -- board handling exception requests ad hoc instead of by defined
  criteria ACTUALLY risks inconsistent decisions between similar cases
MODERATING ESCALATIONS means ACTUALLY recognizing when a decision ACTUALLY can't be made
  within the board (ACTUALLY outside board's authority, or has org-wide, strategic
  dimension), ACTUALLY structurally forwarding case to next-higher decision instance
  instead of forcing a decision ACTUALLY outside the board's authority
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Vorab kommunizierte Reviewagenda | strukturiert Zeit und Vorbereitung der Teilnehmer | verhindert ineffiziente Zeitverteilung |
| Vorab bereitgestellte Evidenz | vermeidet Zusammentragen während der Sitzung | schont begrenzte, gemeinsame Board-Zeit |
| Strukturierte Dissens-Moderation | stellt vollständige Positionsdarstellung sicher | verhindert unstrukturierte, verlängerte Diskussion |
| Konkrete Ausnahmeprozess-Anwendung | nutzt definierte Kriterien statt Ad-hoc-Entscheidung | verhindert Inkonsistenz zwischen ähnlichen Fällen |
| Strukturierte Eskalation | erkennt Grenzen der Board-Befugnis | verhindert erzwungene, unbefugte Entscheidungen |

Implementierung: Die Agenda wird vorab kommuniziert, mit veranschlagter Zeit pro Fall. Evidenz wird als Voraussetzung für die Aufnahme eines Falls in die Agenda verlangt. Dissens wird strukturiert moderiert, mit vollständiger Darstellung beider Positionen vor der Entscheidung. Ausnahmen werden anhand definierter Kriterien, Eskalationen strukturiert an die nächsthöhere Instanz weitergegeben.

## Scalability, Reliability, Security und Observability

Eine Review-Board-Moderationspraxis skaliert über die Anzahl der pro Sitzung behandelten Fälle; die Reliability-Grenze liegt darin, dass eine unstrukturierte Dissens-Moderation tatsächlich zu einer unproduktiven, nicht abgeschlossenen Sitzung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Sitzung schließt ohne tatsächliche Entscheidung zu einem strittigen Fall ab | der Dissens wurde nicht strukturiert moderiert, beide Positionen wurden nicht vollständig dargestellt | für künftige Fälle eine strukturierte Dissens-Moderation mit vollständiger Positionsdarstellung einführen |
| Teilnehmer erscheinen unvorbereitet zur Sitzung | die Agenda oder benötigte Evidenz wurde nicht rechtzeitig vorab kommuniziert | Agenda und Evidenzanforderung künftig verbindlich vor der Sitzung bereitstellen |
| ähnliche Ausnahmefälle werden in unterschiedlichen Sitzungen unterschiedlich entschieden | Ausnahmen wurden ad hoc statt anhand definierter, dokumentierter Kriterien behandelt | frühere Ausnahmeentscheidungen als Präzedenz dokumentieren und konsistent anwenden |

Security: Sicherheitsrelevante Reviewfälle sollten mit ausreichender Vorlaufzeit für eine gründliche Evidenzprüfung durch Sicherheitsexperten geplant werden. Observability: Die tatsächliche Rate von Sitzungen, die ohne abschließende Entscheidung enden, ist ein zentrales Signal zur Bewertung der Moderationsqualität.

## Trade-offs und Entscheidungen

**Staff** bereitet die Evidenz für einen begrenzten Reviewfall vor. **Principal** moderiert eine komplexe Reviewsitzung mit mehreren, potenziell strittigen Fällen. **Chief** führt das Architecture Review Board als wirksames Entscheidungsgremium und verantwortet dessen tatsächliche Entscheidungsqualität.

Anti-Patterns: eine Reviewsitzung ohne vorab kommunizierte Agenda oder Evidenzanforderung abhalten; Dissens durch unstrukturierte, wiederholte Diskussion statt strukturierte Positionsdarstellung behandeln; Ausnahmen ad hoc statt anhand dokumentierter Kriterien entscheiden.

## Production Checklist

- [ ] Die Reviewagenda ist vorab kommuniziert, mit veranschlagter Zeit pro Fall.
- [ ] Benötigte Evidenz ist vor der Sitzung bereitgestellt.
- [ ] Dissens wird strukturiert mit vollständiger Positionsdarstellung moderiert.
- [ ] Ausnahmen werden anhand dokumentierter Kriterien, Eskalationen strukturiert weitergegeben.

## Interviewfragen

### 1. Warum sollte die Reviewagenda vorab kommuniziert werden?

**Antwort:** Damit Teilnehmer vorbereitet erscheinen und die verfügbare Zeit effizient auf die tatsächlich relevanten Fälle verteilt wird.

### 2. Warum sollte Evidenz vor der Sitzung statt während der Sitzung bereitgestellt werden?

**Antwort:** Weil das Zusammentragen von Evidenz während der Sitzung die begrenzte, gemeinsame Zeit der Board-Mitglieder für eine Aufgabe verschwendet, die vorab hätte erledigt werden können.

### 3. Wie sollte Dissens zwischen Board-Mitgliedern strukturiert moderiert werden?

**Antwort:** Indem beide Positionen mit ihrer jeweiligen Evidenz vollständig dargestellt werden, bevor eine Entscheidung getroffen wird, statt den Dissens durch unstrukturierte, wiederholte Diskussion zu verlängern.

### 4. Warum sollte ein Ausnahmeantrag anhand definierter Kriterien statt ad hoc entschieden werden?

**Antwort:** Um konsistente Entscheidungen zwischen ähnlichen Fällen sicherzustellen, statt das Risiko inkonsistenter Behandlung einzugehen.

### 5. Wie gehst du vor, wenn eine Sitzung ohne tatsächliche Entscheidung zu einem strittigen Fall abschließt?

**Antwort:** Ich prüfe, ob der Dissens strukturiert moderiert und beide Positionen vollständig dargestellt wurden, und führe für künftige Fälle eine strukturierte Dissens-Moderation ein.

### 6. Widersprüchliche Anforderung: Board-Mitglieder wollen ausreichend Zeit für gründliche Diskussion jedes Falls UND die Organisation will kurze, effiziente Sitzungen mit vielen behandelten Fällen — wie gehst du vor?

**Antwort:** Ich würde die Evidenzvorbereitung vor der Sitzung verpflichtend machen, sodass die eigentliche Sitzungszeit auf die tatsächlich strittigen Punkte statt auf Grundlagenerklärung fokussiert werden kann, wodurch mehr Fälle gründlich in derselben Zeit behandelt werden können.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Architecture Review Board diskutiert einen Fall zur Wahl eines Nachrichtenbrokers für ein neues Event-Driven-Commerce-Vorhaben (angelehnt an KB-0670). Zwei Board-Mitglieder vertreten unterschiedliche, jeweils begründete Positionen.

~~~python
# Local, deterministic illustration of structured dissent moderation before a decision (fictional lab example, no real board):

def moderate_dissent(position_a, position_b):
    if not position_a.get("evidence") or not position_b.get("evidence"):
        return "cannot decide: both positions must present evidence first"
    return {
        "position_a_presented": position_a,
        "position_b_presented": position_b,
        "decision": "pending review of both fully presented positions",
    }

position_a = {"choice": "Kafka", "evidence": "throughput benchmark at expected load"}
position_b = {"choice": "managed message queue", "evidence": "lower operational overhead analysis"}

print(moderate_dissent(position_a, position_b))
~~~

Erwartete Beobachtung: Beide Positionen werden mit ihrer jeweiligen Evidenz vollständig dargestellt, bevor eine Entscheidung getroffen wird. Auswertung: Eine unstrukturierte Diskussion ohne vorherige, vollständige Evidenzdarstellung beider Seiten hätte vermutlich zu einer wiederholten, unproduktiven Debatte statt einer nachvollziehbaren Entscheidung geführt.

## Dependencies, Cross-References und Quellen

1. Software Engineering Institute (SEI), Carnegie Mellon University: [Architecture Review Board Best Practices](https://insights.sei.cmu.edu/library/), abgerufen 2026-09-18.
2. The Open Group: [TOGAF Standard — Architecture Governance and Review Processes](https://www.opengroup.org/togaf), abgerufen 2026-09-18.

Dieses Kapitel referenziert den in KB-0612 (Architecture Review Boards) beschriebenen Governanceprozess und vertieft die in KB-0699 (Architekturgovernance praktisch führen) skizzierte Konfliktlösung um konkrete Moderationstechniken.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Vorbereitung von Reviewagenda und Evidenzzusammenfassungen zur Beschleunigung der Sitzungsvorbereitung | Emerging | Bei künftigen, umfangreichen Review-Programmen als Ergänzung evaluieren, jedoch die finale Moderation von Dissens und Eskalationen weiterhin durch menschliche Board-Mitglieder mit fachlicher Erfahrung durchführen. |

Ein Team akzeptiert eine Review-Board-Sitzung erst als wirksam, wenn Agenda und Evidenz vorab bereitstanden und Dissens, Ausnahmen sowie Eskalationen nachweislich strukturiert moderiert wurden.
