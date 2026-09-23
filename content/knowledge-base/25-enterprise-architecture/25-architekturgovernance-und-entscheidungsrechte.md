---
{"id": "KB-0613", "title": "Architekturgovernance und Entscheidungsrechte", "domain": "25", "sequence": 25, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0612", "concepts": ["Architecture Review Boards"], "needed_for": "understanding"}, {"id": "KB-0599", "concepts": ["Technologiestandards und Kataloge"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Standards, Reviews und Ausnahmeprozesse für einen konkreten Geltungsbereich anhand etablierter Praxis korrekt verbinden und föderierte Verantwortung gegenüber zentraler Kontrolle angemessen abgrenzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Architekturgovernance föderierte Verantwortung mit zentraler Auditierbarkeit verbindet, ohne in zentrale Kontrollüberlastung zu münden, aufbauend auf den bereits in KB-0612 und KB-0599 behandelten Bausteinen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Governance-Struktur zentrale Kontrollüberlastung erzeugt (jede Detailentscheidung muss zentral geprüft werden), statt föderierte Verantwortung mit stichprobenartiger, auditierbarer Kontrolle zu verbinden.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Architekturgovernance festlegen, die föderierte Verantwortung und zentrale Auditierbarkeit balancieren, ohne zentrale Kontrollüberlastung zu erzeugen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale ArchiMate-Notation für Governance-Artefakte im Detail ist Vertiefung.", "rationale": "Kern ist die Balance zwischen föderierter Verantwortung und zentraler Auditierbarkeit, nicht eine bestimmte formale Notation."}}, "lab_validation": [{"lab_id": "KB-0613-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Balance von föderierter Verantwortung und zentraler Auditierbarkeit, kein produktives Governance-Tool verwendet", "evidence": "Ein lokales Skript simuliert eine Governance-Struktur, bei der lokale Teams innerhalb dokumentierter Standards eigenständig entscheiden dürfen, während eine zentrale, stichprobenartige Auditierung die tatsächliche Einhaltung nachträglich prüft, statt jede Einzelentscheidung vorab zentral zu genehmigen.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Governance-Tool."}]}
---
# Architekturgovernance und Entscheidungsrechte

> **Ziel:** Dieses Kapitel führt die zuvor in Domain 25 behandelten Governance-Bausteine — Technologiestandards und Kataloge ([KB-0599](11-technologiestandards-und-kataloge.md)), Architecture Review Boards ([KB-0612](24-architecture-review-boards.md)) — zu einer vollständigen Architekturgovernance-Struktur zusammen. Der zentrale Punkt dieses Kapitels ist die bewusste Balance zwischen **föderierter Verantwortung** (lokale Teams treffen eigenständige Entscheidungen innerhalb dokumentierter Grenzen) und **zentraler Auditierbarkeit** (die Organisation kann tatsächlich nachvollziehen und überprüfen, ob diese Grenzen eingehalten werden) — eine Governance-Struktur, die jede Einzelentscheidung zentral vorab genehmigen lässt, erzeugt **zentrale Kontrollüberlastung** (die zentrale Instanz wird zum Flaschenhals für praktisch jede Entscheidung) und ist damit ebenso dysfunktional wie eine Governance-Struktur ohne jede zentrale Überprüfbarkeit, bei der lokale Abweichungen von Standards unentdeckt bleiben.

## Zweck, Mental Model und Dependencies

Föderierte Verantwortung bedeutet, dass lokale Teams innerhalb klar dokumentierter Grenzen (etwa der bereits in [KB-0599](11-technologiestandards-und-kataloge.md) behandelten Technologiestandards, mit ihren dokumentierten, zulässigen Technologien und Versionsvorgaben) eigenständig entscheiden dürfen, ohne für jede einzelne Entscheidung eine zentrale Genehmigung einholen zu müssen — diese Delegation ist notwendig, weil eine zentrale Instanz strukturell nicht in der Lage ist, jede lokale, detaillierte Entscheidung mit derselben Geschwindigkeit und demselben Kontextverständnis wie das lokale Team selbst zu treffen. Zentrale Kontrollüberlastung entsteht, wenn diese Delegation nicht tatsächlich stattfindet: Wenn jede noch so kleine Architekturentscheidung durch dasselbe zentrale Gremium (etwa das bereits in [KB-0612](24-architecture-review-boards.md) behandelte Architecture Review Board) vorab genehmigt werden muss, wird dieses Gremium unweigerlich zum Flaschenhals, der die Entscheidungsgeschwindigkeit der gesamten Organisation begrenzt — dies ist derselbe strukturelle Fehler, der bereits bei der pragmatischen ADM-Anwendung (siehe [KB-0596](08-togaf-und-architekturentwicklung.md)) und bei angemessenen ARB-Durchlaufzeiten (siehe [KB-0612](24-architecture-review-boards.md)) thematisiert wurde, hier jedoch auf der Ebene der gesamten Governance-Struktur. Zentrale Auditierbarkeit ist der komplementäre Mechanismus, der föderierte Verantwortung tatsächlich verantwortbar macht, ohne in zentrale Kontrollüberlastung zu münden: Statt jede Einzelentscheidung vorab zu genehmigen, prüft eine zentrale Instanz stichprobenartig oder anhand automatisierter Kontrollen (etwa Compliance-Scans gegen dokumentierte Technologiestandards), ob lokale Entscheidungen tatsächlich innerhalb der dokumentierten Grenzen liegen — diese nachträgliche, stichprobenartige Prüfung erhält die Entscheidungsgeschwindigkeit der föderierten Teams, während sie gleichzeitig eine tatsächliche, nachvollziehbare Kontrolle über die Einhaltung der Standards ermöglicht. Die praktische Konsequenz ist, dass eine wirksame Architekturgovernance explizit definiert, welche Entscheidungen tatsächlich föderiert (innerhalb dokumentierter Grenzen, mit nachträglicher Auditierung) und welche tatsächlich zentral vorab geprüft werden müssen (etwa organisationsweit kritische, hochriskante Entscheidungen, die über das ARB laufen) — diese explizite Aufteilung verhindert sowohl zentrale Kontrollüberlastung als auch unkontrollierte, unauditierte Abweichung.

~~~text
This chapter joins prior Domain 25 governance blocks (tech standards KB-0599, ARB KB-0612)
  into a COMPLETE architecture governance structure
KEY POINT: deliberate BALANCE between FEDERATED RESPONSIBILITY
  (local teams make own decisions WITHIN documented boundaries)
  and CENTRAL AUDITABILITY (org can actually trace+verify these boundaries are honored)
  governance requiring EVERY single decision pre-approved centrally
    -> CENTRAL CONTROL OVERLOAD (central instance becomes bottleneck for virtually every decision)
    -> equally dysfunctional as governance w/o ANY central verifiability
       (local deviations from standards go undetected)
FEDERATED RESPONSIBILITY: local teams decide independently within clearly documented boundaries
  (e.g. KB-0599 tech standards w/ documented allowed technologies + version requirements)
  w/o needing central approval for every single decision
  this delegation necessary: central instance structurally CANNOT make every local, detailed decision
    at same speed+context-understanding as local team itself
CENTRAL CONTROL OVERLOAD arises when this delegation does NOT actually happen:
  every, however small, architecture decision requiring same central body (ARB, KB-0612) pre-approval
  -> body inevitably becomes bottleneck limiting decision speed of WHOLE org
  same structural error already addressed at pragmatic ADM application (KB-0596)
    and appropriate ARB turnaround times (KB-0612), here at WHOLE governance structure level
CENTRAL AUDITABILITY = complementary mechanism making federated responsibility actually accountable
  w/o causing central control overload
  instead of pre-approving every single decision
  central instance checks via SAMPLING or automated controls
    (compliance scans against documented tech standards)
  whether local decisions actually stay within documented boundaries
  this after-the-fact, sample-based check -> preserves federated teams' decision speed
    while still enabling actual, traceable control over standards compliance
PRACTICAL CONSEQUENCE: effective architecture governance explicitly defines
  which decisions ARE ACTUALLY federated (within documented boundaries, w/ after-the-fact audit)
  vs which MUST ACTUALLY be pre-reviewed centrally
    (org-wide-critical, high-risk decisions going through ARB)
  this explicit split prevents BOTH central control overload AND uncontrolled, unaudited deviation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Föderierte Verantwortung | lokale Entscheidungsfreiheit innerhalb dokumentierter Grenzen | erhält lokale Entscheidungsgeschwindigkeit |
| Zentrale Auditierbarkeit | stichprobenartige, nachträgliche Kontrolle der Einhaltung | macht föderierte Verantwortung tatsächlich verantwortbar |
| Zentrale Kontrollüberlastung | Dysfunktion bei zwingender Vorabgenehmigung jeder Entscheidung | zentrale Instanz wird zum Flaschenhals |
| Explizite Entscheidungsaufteilung | benennt föderierte vs. zentral zu prüfende Entscheidungstypen | verhindert sowohl Überlastung als auch unkontrollierte Abweichung |

Implementierung: Entscheidungstypen werden explizit klassifiziert als "föderiert, innerhalb dokumentierter Grenzen" oder "zentral vorab zu prüfen (ARB)". Föderierte Entscheidungen werden durch stichprobenartige, idealerweise automatisierte Compliance-Prüfungen nachträglich auditiert. Zentral zu prüfende Entscheidungen durchlaufen den bereits in [KB-0612](24-architecture-review-boards.md) behandelten ARB-Prozess mit angemessener Durchlaufzeit.

## Scalability, Reliability, Security und Observability

Architekturgovernance skaliert die organisationsweite Konsistenz proportional zur expliziten Balance zwischen föderierter Verantwortung und zentraler Auditierbarkeit; die Reliability-Grenze liegt darin, dass eine Governance-Struktur ohne diese Balance entweder zu zentraler Kontrollüberlastung oder zu unkontrollierter, unauditierter Abweichung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| das zentrale Architecture Review Board wird zum Flaschenhals für nahezu jede Entscheidung | zu viele Entscheidungstypen sind fälschlich als "zentral zu prüfen" statt als "föderiert" klassifiziert | die Entscheidungsklassifikation überprüfen und mehr Entscheidungstypen innerhalb dokumentierter Grenzen föderieren |
| lokale Teams weichen unentdeckt von dokumentierten Standards ab | keine zentrale, stichprobenartige Auditierung prüft die tatsächliche Einhaltung föderierter Entscheidungen | eine automatisierte oder stichprobenartige Compliance-Prüfung für föderierte Entscheidungen einführen |
| die Organisation kann nicht nachvollziehen, ob tatsächlich Governance-konform gearbeitet wird | keine explizite Auditierbarkeit ist für föderierte Entscheidungen etabliert | eine nachvollziehbare, dokumentierte Audit-Spur für föderierte Entscheidungen einrichten |

Security: Sicherheitsrelevante Entscheidungen sollten explizit als zentral zu prüfen klassifiziert werden, unabhängig davon, wie viele andere Entscheidungstypen föderiert werden. Observability: Das Verhältnis zwischen tatsächlich föderiert getroffenen und zentral geprüften Entscheidungen sowie die tatsächliche Compliance-Rate föderierter Entscheidungen sind zentrale Signale zur Bewertung der Governance-Balance.

## Trade-offs und Entscheidungen

**Staff** trifft eine gegebene, föderierte Entscheidung korrekt innerhalb dokumentierter Grenzen. **Principal** entwirft die vollständige Governance-Struktur mit expliziter Entscheidungsaufteilung und Auditierungsmechanismus für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards fest, die föderierte Verantwortung und zentrale Auditierbarkeit balancieren.

Anti-Patterns: jede Architekturentscheidung unabhängig von Umfang und Risiko zentral vorab genehmigen lassen; föderierte Entscheidungen ohne jede nachträgliche Auditierung treffen lassen; keine explizite Klassifikation zwischen föderierten und zentral zu prüfenden Entscheidungstypen vornehmen.

## Production Checklist

- [ ] Entscheidungstypen sind explizit als "föderiert" oder "zentral zu prüfen" klassifiziert.
- [ ] Föderierte Entscheidungen werden durch stichprobenartige oder automatisierte Compliance-Prüfungen nachträglich auditiert.
- [ ] Zentral zu prüfende Entscheidungen durchlaufen den ARB-Prozess mit angemessener Durchlaufzeit.
- [ ] Das Verhältnis föderierter zu zentral geprüfter Entscheidungen wird regelmäßig überprüft.

## Interviewfragen

### 1. Was ist zentrale Kontrollüberlastung und wie entsteht sie?

**Antwort:** Ein Zustand, in dem eine zentrale Governance-Instanz zum Flaschenhast wird, weil sie jede noch so kleine Architekturentscheidung vorab genehmigen muss, statt Entscheidungen innerhalb dokumentierter Grenzen zu föderieren.

### 2. Wie macht zentrale Auditierbarkeit föderierte Verantwortung tatsächlich verantwortbar?

**Antwort:** Durch stichprobenartige oder automatisierte, nachträgliche Compliance-Prüfungen, die die tatsächliche Einhaltung dokumentierter Grenzen kontrollieren, ohne jede Einzelentscheidung vorab zu genehmigen.

### 3. Warum ist eine explizite Klassifikation von Entscheidungstypen notwendig?

**Antwort:** Um klar zu unterscheiden, welche Entscheidungen tatsächlich föderiert (mit nachträglicher Auditierung) und welche zentral vorab geprüft werden müssen, und dadurch sowohl Kontrollüberlastung als auch unkontrollierte Abweichung zu verhindern.

### 4. Was ist der strukturelle Nachteil einer Governance-Struktur ohne zentrale Auditierbarkeit?

**Antwort:** Lokale Abweichungen von dokumentierten Standards bleiben unentdeckt, da keine Instanz die tatsächliche Einhaltung überprüft.

### 5. Wie gehst du vor, wenn ein Architecture Review Board zum Flaschenhals für nahezu jede Entscheidung wird?

**Antwort:** Ich prüfe, ob zu viele Entscheidungstypen fälschlich als zentral zu prüfen klassifiziert sind, und föderiere mehr Entscheidungstypen innerhalb dokumentierter Grenzen mit nachträglicher Auditierung.

### 6. Widersprüchliche Anforderung: Die Organisation will vollständige Kontrolle über jede Architekturentscheidung UND Teams wollen maximale lokale Entscheidungsgeschwindigkeit — wie gehst du vor?

**Antwort:** Ich würde die meisten Entscheidungstypen innerhalb klar dokumentierter Grenzen föderieren und durch stichprobenartige, automatisierte Compliance-Prüfungen nachträglich kontrollieren, während nur organisationsweit kritische, hochriskante Entscheidungen tatsächlich zentral vorab geprüft werden, statt entweder vollständige Kontrolle oder vollständige lokale Autonomie zu erzwingen.

## Praktische Labs

~~~python
# Local, deterministic simulation of federated decisions with sample-based central auditing (executed locally, no real governance tool):

def audit_federated_decisions(decisions, allowed_standards):
    results = []
    for d in decisions:
        compliant = d["technology"] in allowed_standards
        results.append({"team": d["team"], "technology": d["technology"], "compliant": compliant})
    return results

decisions = [
    {"team": "Team A", "technology": "PostgreSQL"},
    {"team": "Team B", "technology": "UnapprovedDB"},
]

for r in audit_federated_decisions(decisions, allowed_standards={"PostgreSQL", "MySQL"}):
    print(r)
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Architecture Governance Framework](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [Federated IT Governance Models](https://www.gartner.com/en/information-technology/glossary/it-governance), abgerufen 2026-09-18.

Technologiestandards und Kataloge sind kanonisch in [KB-0599](11-technologiestandards-und-kataloge.md) behandelt; Architecture Review Boards in [KB-0612](24-architecture-review-boards.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Policy-as-Code-Prüfung föderierter Entscheidungen direkt in CI/CD-Pipelines statt periodischer, manueller Audits | Evaluating | Für klar formalisierbare Standards (Technologieklassifikation, Konfigurationsregeln) einführen, jedoch komplexere, kontextabhängige Governance-Fragen weiterhin über stichprobenartige, menschliche Auditierung behandeln. |

Ein Team akzeptiert eine Architekturgovernance-Struktur erst, wenn Entscheidungstypen nachweislich explizit zwischen föderiert und zentral zu prüfen klassifiziert sind und föderierte Entscheidungen tatsächlich auditiert werden.
