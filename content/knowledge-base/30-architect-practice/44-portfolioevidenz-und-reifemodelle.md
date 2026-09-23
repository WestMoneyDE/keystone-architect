---
{"id": "KB-0720", "title": "Portfolioevidenz und Reifemodelle", "domain": "30", "sequence": 44, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0712", "concepts": ["Grenzen eigener Erfahrung ohne unbelegte Zieltitel"], "needed_for": "Portfolioevidenz-Mapping wendet dasselbe Ehrlichkeitsprinzip aus KB-0712 systematisch auf die gesamte Karriereevidenz an"}, {"id": "KB-0710", "concepts": ["Persönliche Evidenz von Teamwissen getrennt"], "needed_for": "Reifemodelle nutzen dieselbe Trennung persönlicher Evidenz wie die in KB-0710 beschriebene Interviewpraxis"}], "related": ["KB-0719"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lernziel dieses Kapitels mit einem überprüfbaren Artefakt belegen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Karriereportfolio Ownership, Wirkung, Architekturmetriken und Reifegrad mehrerer Projekte nachvollziehbar und überprüfbar gegeneinander abgrenzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Portfoliozuordnung ein Artefakt oder eine Erfahrung einem Projekt zuschreibt, für das tatsächlich kein Beleg existiert.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein unternehmensweites oder persönliches Reifemodell führen, das Portfolioevidenz ausschließlich anhand tatsächlicher Artefakte, nicht anhand von Zielkompetenzen oder Wunschdarstellung, fortschreibt.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Capability-Maturity-Model-Zertifizierung im Detail ist Vertiefung.", "rationale": "Kern ist die praktische, ehrliche Artefaktzuordnung, nicht die formale Reifemodell-Zertifizierungsmethodik."}}, "lab_validation": [{"lab_id": "KB-0720-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung korrekter, artefaktbasierter Portfoliozuordnung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Reifemodell-Eintrag, der ohne tatsächliches Artefakt einem Projekt zugeschrieben wird, korrekt als unbelegt zurückgewiesen wird, während ein Eintrag mit tatsächlich vorhandenem Artefakt (etwa ein dokumentiertes Design, ein Code-Repository) korrekt aufgenommen wird.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Portfolioevidenz und Reifemodelle

> **Ziel:** Dieses abschließende Kapitel systematisiert eine Disziplin, die dieses gesamte Curriculum durchgängig angewendet hat: Karriereevidenz eines Lernenden (etwa aus eigenen Produkten oder Prototypen, umgesetzten Integrationen, Architekturkonzepten, Labs oder einem konkreten Untersuchungsprojekt) darf tatsächlich nur mit tatsächlich vorhandenen Artefakten zugeordnet werden — nicht mit Zielkompetenzen, nicht mit Wunschdarstellung, nicht mit plausibel klingender, aber tatsächlich unbelegter Behauptung. Der zentrale Punkt dieses Kapitels ist, dass **Ownership**, **Wirkung**, **Architekturmetriken** und **Reifegrad** eines Projekts jeweils tatsächlich nachvollziehbar belegt werden müssen, bevor sie in ein persönliches oder organisatorisches Reifemodell aufgenommen werden — ein Reifemodell, das unbelegte Einträge zulässt, verliert tatsächlich seine gesamte Aussagekraft, da ein Betrachter nicht mehr unterscheiden kann, welche Einträge tatsächlich belastbar sind.

## Zweck, Mental Model und Dependencies

Portfolioeinträge nur mit tatsächlichen Artefakten zuzuordnen bedeutet, tatsächlich für jede Kompetenzbehauptung zu prüfen, ob ein konkretes, nachvollziehbares Artefakt existiert (etwa ein dokumentiertes Design, ein Code-Repository, ein ADR, ein Review, eine tatsächlich durchgeführte Präsentation) — dies entspricht direkt der in diesem Curriculum durchgängig empfohlenen Praxis, jeden Nachweis mit Projekt, Zeitraum, Evidenzart, Umfang und Grenze exakt zu belegen, statt eine Kompetenz allgemein zu behaupten. Auch Architekturmuster, die in diesem Curriculum an anderer Stelle behandelt werden — etwa das Muster cite-or-decline (KB-0714: belegbare statt spekulative Antworten) oder das Phänomen green-but-blind (KB-0367: scheinbar erfolgreiche, aber tatsächlich nicht aussagekräftige Tests) —, dürfen in einem persönlichen Portfolio nur dann als Kompetenz erscheinen, wenn ihre Anwendung auf ein konkretes, nachweisbares Projekt oder Lab zurückführbar ist; das bloße Kennen des Musternamens ist kein Nachweis.

| Evidenzart | Beispielartefakt | typischer Reifegrad | Grenze, die explizit zu nennen ist |
|---|---|---|---|
| Eigenes Produkt/Prototyp | Repository, Deployment, Nutzungsdaten | gelebt (falls produktiv genutzt) | Nutzerzahl, Betriebsdauer, Teamgröße |
| Umgesetzte Integration | Schnittstellenspezifikation, Tests, Betriebsprotokoll | gelebt | welche Systeme real angebunden waren, welche simuliert |
| Architekturkonzept | ADR, Diagramm, Review-Kommentare | konzeptionell | nicht umgesetzt bzw. nicht in Produktion validiert |
| Lab/Übungsfall | lauffähiges Skript, Fallbearbeitung | konzeptionell | fiktive Annahmen, keine reale Organisation |
| Untersuchungsprojekt | Messprotokoll, Auswertung, Bericht | konzeptionell bis gelebt | Stichprobe, Zeitraum, Reproduzierbarkeit | Ownership nachvollziehbar zu belegen bedeutet, tatsächlich zu klären, wer für ein Artefakt tatsächlich verantwortlich war, entsprechend dem in KB-0710 beschriebenen Prinzip, persönliche Evidenz explizit von allgemeinem Teamwissen zu trennen — ein Portfolioeintrag, der Teamarbeit fälschlich als alleinigen, eigenen Beitrag darstellt, verletzt dieselbe Ehrlichkeitsregel, die in diesem Curriculum durchgängig für Interviewfälle gefordert wurde. Wirkung nachvollziehbar zu belegen bedeutet, tatsächlich eine messbare, konkrete Konsequenz darzustellen, entsprechend dem in KB-0693 beschriebenen Prinzip ehrlicher Wertbeitragsbelege, statt eine unbelegte Behauptung organisationsweiter Wirkung aufzustellen. Architekturmetriken nachvollziehbar zu belegen bedeutet, tatsächlich konkrete, überprüfbare Zahlen (etwa gemessene Änderungsreibung, siehe KB-0703) statt vager Qualitätsaussagen zu verwenden. Reifegrad nachvollziehbar zu belegen bedeutet, tatsächlich zu kennzeichnen, ob eine Kompetenz tatsächlich gelebt, konzeptionell verstanden oder rein theoretisch bekannt ist, entsprechend dem in KB-0712 explizit für Chief-Architect-Interviews etablierten Dreikategorien-Prinzip — dieses Prinzip gilt tatsächlich für jedes Reifemodell, nicht nur für die höchste Rollenebene: Ein Zielkompetenzmarker (wie in diesem gesamten Curriculum konsequent verwendet) ist tatsächlich kein gegenwärtiger Berufstitel und kein Nachweis bereits absolvierter Erfahrung, sondern eine explizit gekennzeichnete Zielrichtung.

~~~text
This concluding chapter systematizes a discipline this entire curriculum ACTUALLY
  applied throughout: a learner's career evidence (own products/prototypes, delivered
  integrations, architecture concepts, labs, a concrete investigation project) may
  ACTUALLY only be assigned to ACTUALLY existing artifacts -- not target
  competencies, not wishful presentation, not plausible-sounding but ACTUALLY unevidenced
  claim
KEY POINT: OWNERSHIP, IMPACT, ARCHITECTURE METRICS, MATURITY of a project must ACTUALLY
  each be traceably evidenced before entering a personal or organizational maturity
  model -- maturity model allowing unevidenced entries ACTUALLY loses its entire
  informative value, since an observer can no longer distinguish which entries are
  ACTUALLY substantive
ASSIGNING PORTFOLIO ENTRIES ONLY TO ACTUAL ARTIFACTS means ACTUALLY checking, for every
  competence claim, whether a concrete, traceable artifact exists (documented design,
  code repository, ADR, review, actually delivered presentation) -- directly corresponds
  to this curriculum's recommended practice of exactly evidencing every entry w/
  project, period, evidence type, scope, limitation, instead of generally claiming a
  competence
PATTERN NAMES (e.g. cite-or-decline from KB-0714, green-but-blind from KB-0367) are not
  evidence by themselves -- listing such a pattern as a personal competence must
  ACTUALLY be traceable to a concrete project or lab where it was applied
TRACEABLY EVIDENCING OWNERSHIP means ACTUALLY clarifying who was ACTUALLY responsible
  for an artifact, per KB-0710's principle of explicitly separating personal evidence
  from general team knowledge -- portfolio entry falsely presenting team work as sole,
  own contribution violates same honesty rule consistently required throughout this
  curriculum for interview cases
TRACEABLY EVIDENCING IMPACT means ACTUALLY presenting a measurable, concrete consequence,
  per KB-0693's honest value-contribution evidence principle, instead of making an
  unevidenced claim of org-wide impact
TRACEABLY EVIDENCING ARCHITECTURE METRICS means ACTUALLY using concrete, checkable
  numbers (measured change friction, see KB-0703) instead of vague quality claims
TRACEABLY EVIDENCING MATURITY means ACTUALLY marking whether a competence is ACTUALLY
  lived, conceptually understood, or purely theoretically known, per KB-0712's 3-category
  principle explicitly established for chief-architect interviews -- this principle
  ACTUALLY applies to every maturity model, not just the highest role level: a target-
  competence marker (as consistently used throughout this entire curriculum) is
  ACTUALLY not a current job title nor proof of already-completed experience, but an
  explicitly marked target direction
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Artefaktbasierte Portfoliozuordnung | verhindert unbelegte Kompetenzbehauptung | entspricht der curriculumsweit empfohlenen Evidenzdisziplin |
| Ownership-Trennung von Teamwissen | zeigt tatsächlichen, eigenen Beitrag | folgt KB-0710-Prinzip |
| Messbare, konkrete Wirkungsbelege | ersetzt unbelegte Wirkungsbehauptung | folgt KB-0693-Prinzip |
| Überprüfbare Architekturmetriken | ersetzt vage Qualitätsaussagen | folgt KB-0703-Prinzip |
| Dreikategorien-Reifegradkennzeichnung (gelebt/konzeptionell/theoretisch) | verhindert Verwechslung von Zielmarker und Berufstitel | folgt KB-0712-Prinzip, curriculumsweit gültig |

Implementierung: Jeder Portfolioeintrag wird ausschließlich mit einem tatsächlich vorhandenen, konkreten Artefakt verknüpft. Ownership, Wirkung und Architekturmetriken werden jeweils explizit und überprüfbar belegt. Der Reifegrad jeder Kompetenz wird explizit als gelebt, konzeptionell verstanden oder theoretisch bekannt gekennzeichnet.

## Scalability, Reliability, Security und Observability

Eine Portfolioevidenz- und Reifemodellpraxis skaliert über die Anzahl der dokumentierten Projekte und Kompetenzen; die Reliability-Grenze liegt darin, dass ein einziger, unbelegter Eintrag die Glaubwürdigkeit des gesamten Reifemodells nachträglich untergraben kann, sobald er tatsächlich entdeckt wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Reifemodell-Eintrag wird bei näherer Prüfung als unbelegt entlarvt | die Zuordnung erfolgte ohne tatsächlich vorhandenes Artefakt | den Eintrag entfernen oder auf ein tatsächlich vorhandenes Artefakt zurückführen |
| ein Portfolioeintrag stellt Teamarbeit fälschlich als alleinigen Beitrag dar | die Ownership-Trennung wurde nicht angewendet | den Eintrag um eine explizite, ehrliche Ownership-Kennzeichnung ergänzen |
| ein Zielkompetenzmarker wird fälschlich als bereits erreichter Berufstitel interpretiert | die Dreikategorien-Kennzeichnung (gelebt/konzeptionell/theoretisch) fehlte | den Eintrag explizit als Zielkompetenz statt gegenwärtigen Titel kennzeichnen |

Security: Portfolioeinträge zu sicherheitsrelevanten Projekten sollten keine tatsächlich vertraulichen, unternehmensspezifischen Details preisgeben. Observability: Die tatsächliche Rate an Portfolioeinträgen mit vollständig nachvollziehbarem Artefaktbezug ist ein zentrales Signal für die Glaubwürdigkeit des gesamten Reifemodells.

## Trade-offs und Entscheidungen

**Staff** dokumentiert einen einzelnen, artefaktbasierten Portfolioeintrag mit korrekter Ownership-Kennzeichnung. **Principal** führt ein vollständiges Reifemodell mit mehreren, artefaktbasierten Projekten und Reifegradkennzeichnung. **Chief** verantwortet ein unternehmensweites oder persönliches Reifemodell, das ausschließlich artefaktbasierte Evidenz zulässt.

Anti-Patterns: eine Kompetenz ohne tatsächlich vorhandenes Artefakt einem Projekt zuordnen; Teamarbeit als alleinigen, eigenen Beitrag darstellen; einen Zielkompetenzmarker als bereits erreichten Berufstitel präsentieren.

## Production Checklist

- [ ] Jeder Portfolioeintrag ist mit einem tatsächlich vorhandenen, konkreten Artefakt verknüpft.
- [ ] Ownership ist explizit von allgemeinem Teamwissen getrennt.
- [ ] Wirkung ist messbar und konkret, nicht als unbelegte, allgemeine Behauptung dargestellt.
- [ ] Der Reifegrad jeder Kompetenz ist explizit als gelebt, konzeptionell oder theoretisch gekennzeichnet.

## Interviewfragen

### 1. Warum dürfen Portfolioprojekte und genannte Architekturmuster (etwa cite-or-decline oder green-but-blind) nur mit tatsächlichen Artefakten zugeordnet werden?

**Antwort:** Weil ein Reifemodell mit unbelegten Einträgen seine gesamte Aussagekraft verliert, da nicht mehr unterscheidbar ist, welche Einträge tatsächlich belastbar sind — und weil das Kennen eines Musternamens noch nicht belegt, dass das Muster in einem konkreten Projekt oder Lab angewendet wurde.

### 2. Warum ist die Ownership-Trennung von Teamwissen auch im Reifemodell-Kontext wichtig?

**Antwort:** Weil ein Portfolioeintrag, der Teamarbeit fälschlich als alleinigen, eigenen Beitrag darstellt, dieselbe Ehrlichkeitsregel verletzt, die dieses Curriculum durchgängig für Interviewfälle fordert.

### 3. Was unterscheidet einen Zielkompetenzmarker von einem tatsächlich erreichten Berufstitel?

**Antwort:** Ein Zielkompetenzmarker ist eine explizit gekennzeichnete Zielrichtung, kein Nachweis bereits absolvierter, tatsächlicher Erfahrung — diese Unterscheidung gilt für jedes Reifemodell, nicht nur für die höchste Rollenebene.

### 4. Warum sollten Architekturmetriken statt vager Qualitätsaussagen im Reifemodell verwendet werden?

**Antwort:** Weil konkrete, überprüfbare Zahlen tatsächlich nachvollziehbar sind, während vage Aussagen wie "hohe Qualität" nicht tatsächlich überprüft werden können.

### 5. Wie gehst du vor, wenn ein Reifemodell-Eintrag bei näherer Prüfung als unbelegt entlarvt wird?

**Antwort:** Ich entferne den Eintrag oder führe ihn auf ein tatsächlich vorhandenes Artefakt zurück, um die Glaubwürdigkeit des gesamten Reifemodells zu erhalten.

### 6. Widersprüchliche Anforderung: Eine Person will ihr Portfolio möglichst beeindruckend und umfassend darstellen UND die Organisation will vollständige, artefaktbasierte Ehrlichkeit ohne jede unbelegte Behauptung — wie gehst du vor?

**Antwort:** Ich würde die tatsächlich vorhandenen, belegten Artefakte klar und überzeugend darstellen, gleichzeitig aber Zielkompetenzen explizit als solche kennzeichnen, statt sie als bereits erreichte Erfahrung zu präsentieren — diese Kombination aus überzeugender, tatsächlicher Substanz und ehrlicher Grenzziehung ist tatsächlich glaubwürdiger und nachhaltiger als eine unbelegte, beeindruckendere Gesamtdarstellung, die bei näherer Prüfung tatsächlich entlarvt werden könnte.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Reifemodell soll um einen neuen Eintrag zur Kompetenz "cite-or-decline-Architektur" ergänzt werden, basierend auf dem in KB-0714 demonstrierten, fiktiven GenAI-Architekturfall.

~~~python
# Local, deterministic illustration of artifact-based portfolio entry validation (fictional lab example, no real portfolio):

def validate_portfolio_entry(competence, artifact_reference, artifact_type, maturity_category):
    valid_categories = {"lived", "conceptual", "theoretical"}
    if not artifact_reference:
        return {"accepted": False, "reason": "no actual artifact reference"}
    if maturity_category not in valid_categories:
        return {"accepted": False, "reason": "maturity category must be explicitly categorized"}
    return {"accepted": True, "competence": competence, "artifact": artifact_reference, "maturity": maturity_category}

entry = validate_portfolio_entry(
    competence="cite-or-decline architecture",
    artifact_reference="KB-0714 fictional lab case (explicitly marked as exercise, not real project)",
    artifact_type="documented case study",
    maturity_category="conceptual",
)
print(entry)
~~~

Erwartete Beobachtung: Der Eintrag wird korrekt akzeptiert, jedoch explizit mit der Reifegradkategorie "conceptual" statt "lived" gekennzeichnet, da es sich tatsächlich um ein fiktives Übungsbeispiel handelt, nicht um eine reale Projekterfahrung. Auswertung: Diese ehrliche Kategorisierung verhindert, dass ein Übungsfall später fälschlich als tatsächlich gelebte, praktische Erfahrung dargestellt wird.

## Dependencies, Cross-References und Quellen

1. Software Engineering Institute (SEI), Carnegie Mellon University: [Capability Maturity Model Integration (CMMI) — Maturity Levels](https://cmmiinstitute.com/), abgerufen 2026-09-18.
2. Will Larson: [Staff Engineer — Building a Traceable Career Narrative](https://staffeng.com/), abgerufen 2026-09-18.

Dieses Kapitel schließt Domain 30 (Architect Practice) und damit das gesamte, 720 Dateien umfassende Curriculum ab. Es systematisiert die in KB-0710 (Staff-Interviewfälle), KB-0711 (Principal-Interviewfälle), KB-0712 (Chief-Architect-Interviewfälle) und KB-0693 (Wertbeiträge von Architektur belegen) durchgängig etablierte Evidenzdisziplin.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Portfolioevidenz-Verlinkung (etwa automatisiertes Cross-Referencing zwischen Reifemodell-Einträgen und tatsächlichen Code-/Dokumentrepositories) zur strukturellen Erzwingung artefaktbasierter Einträge | Emerging | Bei künftigen, umfangreichen Reifemodellen evaluieren, jedoch die finale, inhaltliche Bewertung der Artefaktqualität weiterhin durch menschliches Urteilsvermögen mit fachlichem Kontext treffen. |

Ein Team akzeptiert ein Reifemodell erst als vollständig glaubwürdig, wenn jeder Eintrag nachweislich mit einem tatsächlich vorhandenen Artefakt, klar getrennter Ownership, messbarer Wirkung und ehrlicher Reifegradkennzeichnung versehen ist.

Damit ist Domain 30 (Architect Practice) vollständig ausgearbeitet (44/44 Dateien), und alle 720 im Manifest geplanten Lehrdateien des Staff/Principal/Chief Technical Knowledge Base liegen in technischer Selbstprüfung vor. Wie im Fortschrittsledger dokumentiert, ersetzt Selbstprüfung keine unabhängige Prüfung — keine Datei gilt als fachlich angenommen, bis eine unabhängige Prüfung tatsächlich stattgefunden hat.
