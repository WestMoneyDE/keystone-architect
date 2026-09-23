---
{"id": "KB-0702", "title": "Technische Risikoregister", "domain": "30", "sequence": 26, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0670", "concepts": ["Explizite Ownership"], "needed_for": "Ein Risikoregister nutzt dasselbe explizite Ownership-Prinzip wie die in KB-0670 beschriebene Fachereignis-Ownership, hier auf Risiken angewendet"}], "related": ["KB-0693"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes technisches Risiko einen Registereintrag mit Ursache, Wirkung, Owner und Restexposition tatsächlich vollständig erfassen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Vorhaben mehrere Risiken anhand von Eintrittsunsicherheit und Restexposition priorisieren und begründen, welche Risiken eskaliert werden müssen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein dokumentiertes Risiko ohne zugeordneten Owner oder ohne tatsächliche Bewertung der Restexposition im Register verbleibt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein unternehmensweites, technisches Risikoregister mit klarer Priorisierung und Eskalationslogik führen und für die tatsächliche Risikosteuerung der Organisation verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, formale Threat-Modeling-Methodik im Detail ist Vertiefung und wird als etabliert referenziert.", "rationale": "Kern ist die strukturierte Register-Führung mit Ownership und Priorisierung, nicht die formale Threat-Modeling-Detailtiefe."}}, "lab_validation": [{"lab_id": "KB-0702-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung von Restexpositionsbewertung mit vorhandenen Kontrollen, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Risiko mit tatsächlich implementierten Kontrollen eine niedrigere Restexposition aufweist als ein formal gleich eingestuftes Risiko ohne Kontrollen, und wie diese Unterscheidung die Priorisierung tatsächlich beeinflusst.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Technische Risikoregister

> **Ziel:** Ein technisches Risikoregister erfasst jedes identifizierte Risiko strukturiert mit **Ursache** (was tatsächlich zu dem Risiko führen könnte), **Wirkung** (was tatsächlich passiert, wenn das Risiko eintritt) und **Owner** (wer tatsächlich für die Beobachtung und Behandlung des Risikos verantwortlich ist, entsprechend dem in KB-0670 beschriebenen Prinzip expliziter Ownership). Der zentrale Punkt dieses Kapitels ist, dass ein Risiko nicht allein anhand seiner theoretischen Schwere priorisiert werden darf, sondern anhand seiner tatsächlichen **Restexposition** — der tatsächlich verbleibenden Gefährdung, nachdem bereits implementierte Kontrollen berücksichtigt wurden. Zwei formal gleich schwer eingestufte Risiken können tatsächlich sehr unterschiedliche Priorität haben, wenn eines bereits durch wirksame Kontrollen tatsächlich eingedämmt ist, während das andere tatsächlich ungeschützt bleibt.

## Zweck, Mental Model und Dependencies

Ursache und Wirkung getrennt zu erfassen bedeutet, tatsächlich zu unterscheiden, was ein Risiko auslösen könnte (etwa eine veraltete, nicht mehr gepatchte Komponente, siehe die in Domain 28 behandelten Prinzipien eingeschränkter Patchfähigkeit) von dem, was tatsächlich passiert, wenn das Risiko eintritt (etwa ein Datenverlust oder ein Sicherheitsvorfall) — diese Trennung ist notwendig, da dieselbe Ursache tatsächlich unterschiedliche Wirkungen in unterschiedlichen Kontexten haben kann, und dieselbe Wirkung tatsächlich unterschiedliche Ursachen haben kann. Owner explizit zuzuordnen bedeutet, tatsächlich sicherzustellen, dass ein dokumentiertes Risiko nicht ohne konkrete Verantwortlichkeit im Register verbleibt — ein Risiko ohne Owner wird tatsächlich häufig nie tatsächlich beobachtet oder behandelt, selbst wenn es formal korrekt dokumentiert ist, entsprechend dem in KB-0670 eingeführten Prinzip, dass fehlende Ownership zu tatsächlich unbearbeiteten Zuständen führt. Eintrittsunsicherheit zu bewerten bedeutet, tatsächlich einzuschätzen, wie wahrscheinlich ein Risiko innerhalb eines relevanten Zeitraums tatsächlich eintritt — diese Einschätzung ist zwangsläufig unsicher, muss aber tatsächlich explizit vorgenommen werden, statt implizit unbewertet zu bleiben, da ein Risiko mit tatsächlich hoher Eintrittswahrscheinlichkeit tatsächlich anders priorisiert werden muss als ein tatsächlich unwahrscheinliches, aber schwerwiegendes Risiko. Kontrollen zu erfassen bedeutet, tatsächlich zu dokumentieren, welche Maßnahmen bereits implementiert sind, um das Risiko zu mindern (etwa Netzwerksegmentierung als Kompensationskontrolle für nicht patchbare Geräte, siehe Domain 28) — diese Kontrollen sind der entscheidende Faktor, um von der theoretischen Schwere eines Risikos zu dessen tatsächlicher Restexposition zu gelangen. Restexposition zu bewerten bedeutet, tatsächlich die verbleibende Gefährdung nach Berücksichtigung vorhandener Kontrollen zu bestimmen — diese Restexposition, nicht die theoretische Schwere, ist tatsächlich das entscheidende Kriterium für Priorisierung und Eskalation: Ein Risiko mit hoher theoretischer Schwere, aber tatsächlich wirksamen Kontrollen kann tatsächlich niedrigere Priorität haben als ein Risiko mit geringerer theoretischer Schwere, aber tatsächlich fehlenden Kontrollen.

~~~text
Technical Risk Register captures every identified risk structured w/ CAUSE (what could
  ACTUALLY lead to the risk), EFFECT (what ACTUALLY happens if risk materializes), OWNER
  (who's ACTUALLY responsible for monitoring+handling the risk, per KB-0670's explicit
  ownership principle)
KEY POINT: risk must NOT be prioritized solely by its theoretical severity but by its
  ACTUAL RESIDUAL EXPOSURE -- ACTUALLY remaining exposure after already-implemented
  controls accounted for
  two formally equally-severe risks CAN ACTUALLY have very different priority when one
  is ACTUALLY already contained by effective controls, while other ACTUALLY remains
  unprotected
SEPARATELY CAPTURING CAUSE + EFFECT means ACTUALLY distinguishing what could trigger a
  risk (outdated, unpatched component, see Domain 28's limited-patchability principles)
  from what ACTUALLY happens on materialization (data loss, security incident) --
  necessary since same cause CAN ACTUALLY have different effects in different contexts,
  same effect CAN ACTUALLY have different causes
EXPLICITLY ASSIGNING OWNER means ACTUALLY ensuring a documented risk doesn't remain in
  register w/o concrete responsibility -- risk w/o owner ACTUALLY frequently never gets
  ACTUALLY monitored or handled even if formally correctly documented, per KB-0670's
  principle that missing ownership leads to ACTUALLY unaddressed states
ASSESSING LIKELIHOOD OF OCCURRENCE means ACTUALLY estimating how probable a risk
  ACTUALLY materializes within a relevant timeframe -- inevitably uncertain but must
  ACTUALLY be explicitly made instead of implicitly unassessed, since risk w/ ACTUALLY
  high likelihood must ACTUALLY be prioritized differently than an ACTUALLY unlikely but
  severe risk
CAPTURING CONTROLS means ACTUALLY documenting which measures already implemented to
  mitigate risk (network segmentation as compensating control for non-patchable devices,
  see Domain 28) -- these controls = decisive factor getting from theoretical severity
  to ACTUAL residual exposure
ASSESSING RESIDUAL EXPOSURE means ACTUALLY determining remaining exposure after existing
  controls accounted for -- this residual exposure, not theoretical severity, is
  ACTUALLY the decisive criterion for prioritization+escalation: risk w/ high
  theoretical severity but ACTUALLY effective controls CAN ACTUALLY have lower priority
  than a risk w/ lower theoretical severity but ACTUALLY missing controls
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Getrennte Ursache-/Wirkung-Erfassung | unterscheidet Auslöser von Konsequenz | ermöglicht präzise Risikobeschreibung |
| Explizite Owner-Zuordnung | sichert tatsächliche Verantwortlichkeit | verhindert unbearbeitete, dokumentierte Risiken |
| Bewertete Eintrittsunsicherheit | schätzt tatsächliche Materialisierungswahrscheinlichkeit | notwendig für angemessene Priorisierung |
| Dokumentierte Kontrollen | erfasst bereits implementierte Minderungsmaßnahmen | Grundlage der Restexpositionsbewertung |
| Restexposition statt theoretischer Schwere | zentrales Priorisierungs-/Eskalationskriterium | verhindert Fehlpriorisierung bei bereits kontrollierten Risiken |

Implementierung: Jeder Registereintrag erfasst Ursache, Wirkung, Owner, Eintrittsunsicherheit, vorhandene Kontrollen und die daraus resultierende Restexposition. Priorisierung und Eskalation erfolgen anhand der Restexposition, nicht der theoretischen Schwere.

## Scalability, Reliability, Security und Observability

Eine Risikoregister-Praxis skaliert über die Anzahl der erfassten, parallel verfolgten Risiken; die Reliability-Grenze liegt darin, dass ein Risiko ohne zugeordneten Owner tatsächlich unbearbeitet im Register verbleiben kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein dokumentiertes Risiko wird tatsächlich nie behandelt oder aktualisiert | kein konkreter Owner wurde dem Risiko zugeordnet | einen konkreten, verantwortlichen Owner für das Risiko nachträglich zuordnen |
| ein Risiko mit hoher theoretischer Schwere wird priorisiert, obwohl es bereits wirksam kontrolliert ist | die Priorisierung erfolgte nach theoretischer Schwere statt Restexposition | die Priorisierung explizit auf Restexposition unter Berücksichtigung vorhandener Kontrollen umstellen |
| ein tatsächlich eingetretenes Risiko war im Register nicht mit einer realistischen Eintrittsunsicherheit versehen | die Eintrittsunsicherheit wurde nicht explizit bewertet oder war unrealistisch niedrig eingeschätzt | die Eintrittsunsicherheitsbewertung für ähnliche Risiken künftig realistischer und explizit vornehmen |

Security: Sicherheitsrelevante Risiken sollten mit einer formalen Threat-Modeling-Methodik ergänzt werden, um systematisch Ursachen zu identifizieren. Observability: Die tatsächliche Rate an Risiken mit vollständig ausgefülltem Owner, Kontrollen und Restexposition ist ein zentrales Signal zur Bewertung der Registerqualität.

## Trade-offs und Entscheidungen

**Staff** erfasst einen einzelnen, gegebenen Risikoeintrag vollständig mit Ursache, Wirkung und Owner. **Principal** entwirft die vollständige Risikoregisterstruktur mit Priorisierungslogik für ein komplexes Vorhaben. **Chief** führt das unternehmensweite technische Risikoregister und verantwortet die tatsächliche Risikosteuerung.

Anti-Patterns: ein Risiko ohne zugeordneten Owner im Register belassen; Risiken nach theoretischer Schwere statt tatsächlicher Restexposition priorisieren; vorhandene Kontrollen nicht dokumentieren, sodass die Restexposition nicht tatsächlich bewertbar ist.

## Production Checklist

- [ ] Jeder Registereintrag erfasst Ursache, Wirkung und einen konkreten Owner.
- [ ] Die Eintrittsunsicherheit ist explizit bewertet.
- [ ] Vorhandene Kontrollen sind dokumentiert.
- [ ] Priorisierung und Eskalation erfolgen anhand der Restexposition.

## Interviewfragen

### 1. Warum ist die Restexposition ein besseres Priorisierungskriterium als die theoretische Schwere eines Risikos?

**Antwort:** Weil ein Risiko mit hoher theoretischer Schwere, aber wirksamen, bereits implementierten Kontrollen tatsächlich eine niedrigere, tatsächliche Gefährdung darstellt als ein weniger schwerwiegendes, aber ungeschütztes Risiko.

### 2. Warum ist die explizite Owner-Zuordnung für ein Risikoregister notwendig?

**Antwort:** Weil ein Risiko ohne konkrete Verantwortlichkeit häufig nie tatsächlich beobachtet oder behandelt wird, selbst wenn es formal korrekt dokumentiert ist.

### 3. Warum sollten Ursache und Wirkung eines Risikos getrennt erfasst werden?

**Antwort:** Weil dieselbe Ursache unterschiedliche Wirkungen in unterschiedlichen Kontexten haben kann, und dieselbe Wirkung unterschiedliche Ursachen haben kann.

### 4. Was ist der Unterschied zwischen theoretischer Schwere und Restexposition eines Risikos?

**Antwort:** Die theoretische Schwere bewertet das Risiko unabhängig von vorhandenen Maßnahmen, während die Restexposition die tatsächlich verbleibende Gefährdung nach Berücksichtigung bereits implementierter Kontrollen darstellt.

### 5. Wie gehst du vor, wenn ein dokumentiertes Risiko tatsächlich nie behandelt oder aktualisiert wird?

**Antwort:** Ich prüfe, ob dem Risiko ein konkreter Owner zugeordnet ist, und ordne einen verantwortlichen Owner nachträglich zu, falls dieser fehlt.

### 6. Widersprüchliche Anforderung: Das Sicherheitsteam will jedes theoretisch schwerwiegende Risiko sofort eskalieren UND die Organisation will begrenzte Eskalationskapazität nur für tatsächlich kritische Risiken nutzen — wie gehst du vor?

**Antwort:** Ich würde die Eskalation an die tatsächliche Restexposition statt an die theoretische Schwere koppeln, sodass nur Risiken mit tatsächlich hoher, ungeschützter Gefährdung eskaliert werden, während bereits wirksam kontrollierte, theoretisch schwerwiegende Risiken im Register verfolgt, aber nicht sofort eskaliert werden.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Risikoregister enthält zwei formal gleich als "hoch" eingestufte Risiken: ein veraltetes IoT-Gerät ohne Patchfähigkeit (angelehnt an Domain 28) und ein ähnliches Gerät, das jedoch bereits durch Netzwerksegmentierung isoliert ist.

~~~python
# Local, deterministic illustration of residual exposure vs. theoretical severity (fictional lab example, no real risk register):

risks = [
    {"id": "risk-1", "theoretical_severity": "high", "controls": []},
    {"id": "risk-2", "theoretical_severity": "high", "controls": ["network_segmentation"]},
]

def compute_residual_exposure(risk):
    if risk["controls"]:
        return "medium"  # effective control reduces residual exposure
    return risk["theoretical_severity"]

for r in risks:
    print(r["id"], "residual_exposure:", compute_residual_exposure(r))
~~~

Erwartete Beobachtung: Trotz identischer theoretischer Schwere zeigt die Bewertung unterschiedliche Restexposition, da eines der beiden Risiken bereits durch eine wirksame Kontrolle gemindert ist. Auswertung: Eine Priorisierung allein nach theoretischer Schwere hätte beide Risiken fälschlich gleich behandelt, obwohl die tatsächliche Gefährdung unterschiedlich ist.

## Dependencies, Cross-References und Quellen

1. National Institute of Standards and Technology (NIST): [NIST SP 800-30 — Guide for Conducting Risk Assessments](https://csrc.nist.gov/pubs/sp/800/30/r1/final), abgerufen 2026-09-18.
2. ISO: [ISO 31000 — Risk Management Guidelines](https://www.iso.org/standard/65694.html), abgerufen 2026-09-18.

Dieses Kapitel nutzt das in KB-0670 (Event-Driven Commerce) eingeführte Ownership-Prinzip und ergänzt die in KB-0693 (Wertbeiträge von Architektur belegen) beschriebene, evidenzbasierte Bewertungspraxis um die Risikodimension.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Kontrollwirksamkeitsmessung zur datengestützten Aktualisierung der Restexposition ohne manuelle Neubewertung | Emerging | Bei künftigen, umfangreichen Risikoregistern evaluieren, jedoch die finale Restexpositionsbewertung weiterhin durch menschliche Experten mit fachlichem Kontext verifizieren lassen. |

Ein Team akzeptiert ein technisches Risikoregister erst, wenn jedes Risiko Ursache, Wirkung, Owner, Kontrollen und eine daraus abgeleitete Restexposition nachweislich vollständig erfasst.
