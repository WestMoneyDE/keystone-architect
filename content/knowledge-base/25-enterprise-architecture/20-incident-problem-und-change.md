---
{"id": "KB-0608", "title": "Incident, Problem und Change", "domain": "25", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0607", "concepts": ["ITIL und Service Management"], "needed_for": "understanding"}, {"id": "KB-0605", "concepts": ["Configuration Items und Beziehungen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Incidents, Probleme und Changes anhand etablierter ITIL-Praxis korrekt unterscheiden und mit Servicekontext sowie CMDB-Informationen sinnvoll verknüpfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Incident-, Problem- und Change-Prozesse mit Servicekontext (KB-0607) und CMDB-Beziehungen (KB-0605) verbunden werden, um tatsächlich informierte statt isolierte Entscheidungen zu ermöglichen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein wiederkehrender Incident fälschlich wiederholt als Einzelvorfall statt als Symptom eines zugrunde liegenden Problems behandelt wird, und die Ursache auf eine fehlende Incident-zu-Problem-Verknüpfung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für die Verknüpfung von Incident-, Problem- und Change-Prozessen mit Servicekontext und CMDB festlegen, die informierte statt isolierte Entscheidungen sicherstellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Implementierung von Incident-/Problem-/Change-Workflows in einem bestimmten ITSM-Tool ist Vertiefung.", "rationale": "Kern ist das konzeptionelle Verständnis der Unterscheidung und Verknüpfung von Incident, Problem und Change, nicht die produktspezifische Workflow-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0608-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung eines wiederkehrenden Incidents ohne Problem-Verknüpfung, kein produktives ITSM-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von Incidents auf wiederholte, ähnliche Vorfälle für dasselbe Configuration Item und markiert diese als Kandidat für eine explizite Problem-Verknüpfung, sofern noch keine besteht.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales ITSM-Tool."}]}
---
# Incident, Problem und Change

> **Ziel:** Die bereits in [KB-0607](19-itil-und-service-management.md) angesprochenen operativen ITIL-Praktiken unterscheiden drei grundlegend unterschiedliche Vorgangstypen: Ein **Incident** ist eine ungeplante Unterbrechung oder Qualitätsminderung eines Service, die schnellstmöglich behoben werden muss; ein **Problem** ist die zugrunde liegende Ursache eines oder mehrerer Incidents, deren Behebung wiederholtes Auftreten künftig verhindert; und ein **Change** ist eine kontrollierte, geplante Änderung an einem System, die eine bewusste Freigabeentscheidung erfordert. Der zentrale Punkt dieses Kapitels ist, dass diese drei Vorgangstypen nur dann tatsächlich wirksam sind, wenn sie explizit mit **Servicekontext** und **CMDB-Informationen** (siehe die bereits in [KB-0605](17-configuration-items-und-beziehungen.md) behandelten Configuration Items) verknüpft werden — ein Incident ohne Verknüpfung zum betroffenen Service und den zugrunde liegenden Configuration Items lässt sich weder schnell priorisieren noch mit anderen, verwandten Incidents zu einem gemeinsamen Problem zusammenführen.

## Zweck, Mental Model und Dependencies

Die Unterscheidung zwischen Incident und Problem ist methodisch zentral, weil sie unterschiedliche Zeithorizonte und Ziele verfolgt: Ein Incident-Prozess zielt auf schnelle Wiederherstellung des Service ab (etwa durch einen Workaround, der das Symptom behebt, ohne notwendigerweise die tatsächliche Ursache zu beseitigen), während ein Problem-Prozess auf die systematische Ursachenanalyse und dauerhafte Behebung abzielt — ein Incident kann formal geschlossen werden, sobald der Service wiederhergestellt ist, auch wenn die zugrunde liegende Ursache noch nicht behoben wurde, während ein Problem erst geschlossen wird, wenn die zugrunde liegende Ursache tatsächlich beseitigt ist. Die Verknüpfung mehrerer, ähnlicher Incidents zu einem gemeinsamen Problem ist ein zentraler, praktischer Mechanismus: Ohne diese Verknüpfung erscheint jeder wiederkehrende Vorfall als isoliertes, neues Ereignis, das jeweils erneut mit einem kurzfristigen Workaround behandelt wird, statt als wiederholtes Symptom eines einzigen, zugrunde liegenden Problems erkannt zu werden, dessen systematische Behebung das wiederholte Auftreten tatsächlich verhindern würde — die bereits in [KB-0605](17-configuration-items-und-beziehungen.md) behandelte, konsistente CI-Identität ist hierfür die technische Voraussetzung, da nur eine stabile Identität des betroffenen Configuration Items zuverlässig erkennen lässt, dass mehrere Incidents tatsächlich dasselbe zugrunde liegende System betreffen. Change-Management ergänzt diese Struktur um die kontrollierte, geplante Seite: Eine Änderung, die zur Behebung eines Problems oder aus anderen Gründen an einem System durchgeführt werden soll, wird nicht unkontrolliert umgesetzt, sondern durchläuft eine explizite Freigabeentscheidung, die auf Basis des Servicekontexts (welche Services und wie viele Nutzer sind von diesem System tatsächlich abhängig, siehe die bereits in [KB-0606](18-dependency-und-service-mapping.md) behandelte Service-Mapping-Sicht) das tatsächliche Risiko der Änderung bewertet — eine Änderung an einem für viele Services kritischen System sollte eine sorgfältigere Freigabeprüfung durchlaufen als eine Änderung an einem isolierten, wenig genutzten System.

~~~text
KB-0607's operational ITIL practices distinguish THREE fundamentally different item types:
  INCIDENT: unplanned interruption/quality degradation of a service, needs fastest possible fix
  PROBLEM: underlying cause of one/more incidents, fixing it prevents future recurrence
  CHANGE: controlled, planned system modification, requires deliberate approval decision
KEY POINT: these three item types only actually effective when explicitly linked to
  SERVICE CONTEXT and CMDB information (KB-0605 configuration items)
  incident w/o link to affected service + underlying CIs
    -> cannot be quickly prioritized, cannot be merged with related incidents into a shared problem
INCIDENT vs PROBLEM distinction methodically central: different time horizons + goals
  incident process: aims at fast service restoration (e.g. workaround fixing symptom,
    not necessarily removing actual cause)
  problem process: aims at systematic root cause analysis + lasting fix
  incident CAN be formally closed once service restored, even if underlying cause not yet fixed
  problem only closed once underlying cause is ACTUALLY removed
LINKING multiple similar incidents to a shared problem = central, practical mechanism
  w/o this link -> every recurring incident looks like isolated, new event
    each handled again w/ short-term workaround
    instead of recognized as REPEATED SYMPTOM of a single underlying problem
    whose systematic fix would actually prevent recurrence
  KB-0605's consistent CI identity = technical PREREQUISITE here
    only a stable identity of the affected CI reliably shows multiple incidents
    actually concern the SAME underlying system
CHANGE MANAGEMENT adds controlled, planned side to this structure
  change (to fix a problem or other reasons) not implemented uncontrolled
  goes through explicit APPROVAL decision, based on SERVICE CONTEXT
    (which services + how many users ACTUALLY depend on this system, per KB-0606 service mapping)
    -> assesses ACTUAL risk of the change
  change to a system critical for many services -> should go through more careful approval scrutiny
    than change to an isolated, little-used system
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Incident | ungeplante Störung, Ziel: schnelle Wiederherstellung | kann mit Workaround geschlossen werden, ohne Ursache zu beheben |
| Problem | zugrunde liegende Ursache mehrerer Incidents | Ziel: dauerhafte Behebung zur Verhinderung von Wiederholung |
| Change | kontrollierte, geplante Änderung | erfordert Freigabeentscheidung basierend auf Servicekontext |
| Incident-Problem-Verknüpfung | verbindet ähnliche Incidents mit gemeinsamem Problem | verhindert wiederholte, isolierte Symptombehandlung |

Implementierung: Jeder Incident wird explizit mit dem betroffenen Service und den zugrunde liegenden Configuration Items verknüpft. Wiederkehrende, ähnliche Incidents werden systematisch zu einem gemeinsamen Problem zusammengeführt. Changes durchlaufen eine Freigabeentscheidung, die den tatsächlichen Servicekontext und die Anzahl abhängiger Systeme berücksichtigt, statt pauschal für alle Änderungen denselben Freigabeprozess anzuwenden.

## Scalability, Reliability, Security und Observability

Incident-, Problem- und Change-Management skalieren die tatsächliche Servicezuverlässigkeit proportional zur konsequenten Verknüpfung mit Servicekontext und CMDB-Informationen; die Reliability-Grenze liegt darin, dass eine fehlende Incident-Problem-Verknüpfung wiederkehrende Störungen als isolierte Einzelereignisse erscheinen lässt und dadurch deren systematische Behebung verhindert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Vorfall tritt wiederholt auf, jedes Mal mit einem kurzfristigen Workaround behandelt | die wiederkehrenden Incidents sind nicht mit einem gemeinsamen Problem verknüpft | die ähnlichen Incidents systematisch zu einem gemeinsamen Problem zusammenführen und dessen Ursache analysieren |
| eine Änderung an einem kritischen System wird ohne angemessene Prüfung freigegeben | die Freigabeentscheidung berücksichtigte den tatsächlichen Servicekontext nicht | die Freigabeprüfung explizit anhand der Service-Mapping-Sicht auf tatsächliche Kritikalität ausrichten |
| ein Incident lässt sich nicht schnell priorisieren | die Verknüpfung zum betroffenen Service und den zugrunde liegenden CIs fehlt | die Incident-Erfassung um verpflichtende Service- und CI-Verknüpfung ergänzen |

Security: Changes an sicherheitskritischen Systemen sollten eine besonders sorgfältige, dokumentierte Freigabeprüfung durchlaufen. Observability: Die tatsächliche Quote erfolgreich zu Problemen verknüpfter, wiederkehrender Incidents ist ein zentrales Signal zur Bewertung, ob die Organisation systematisch statt nur symptomatisch auf Störungen reagiert.

## Trade-offs und Entscheidungen

**Staff** verknüpft einen gegebenen Incident korrekt mit Service und CMDB und erkennt Kandidaten für eine Problem-Verknüpfung. **Principal** entwirft den vollständigen Incident-Problem-Change-Prozess mit Servicekontext-Integration für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für die Verknüpfung dieser Prozesse mit Servicekontext und CMDB fest.

Anti-Patterns: wiederkehrende Incidents wiederholt isoliert mit Workarounds behandeln, ohne sie zu einem gemeinsamen Problem zu verknüpfen; Changes ohne Berücksichtigung des tatsächlichen Servicekontexts pauschal freigeben; Incidents ohne Verknüpfung zu Service und Configuration Item erfassen.

## Production Checklist

- [ ] Jeder Incident ist mit dem betroffenen Service und den zugrunde liegenden Configuration Items verknüpft.
- [ ] Wiederkehrende, ähnliche Incidents werden systematisch zu einem gemeinsamen Problem zusammengeführt.
- [ ] Changes durchlaufen eine Freigabeprüfung, die den tatsächlichen Servicekontext berücksichtigt.
- [ ] Ein Incident wird formal geschlossen, sobald der Service wiederhergestellt ist; ein Problem erst, wenn die Ursache tatsächlich behoben ist.

## Interviewfragen

### 1. Was unterscheidet einen Incident von einem Problem?

**Antwort:** Ein Incident ist eine ungeplante Störung mit dem Ziel schneller Wiederherstellung, während ein Problem die zugrunde liegende Ursache mehrerer Incidents ist, deren dauerhafte Behebung wiederholtes Auftreten verhindert.

### 2. Warum ist die Verknüpfung mehrerer, ähnlicher Incidents zu einem gemeinsamen Problem wichtig?

**Antwort:** Ohne diese Verknüpfung erscheint jeder wiederkehrende Vorfall als isoliertes, neues Ereignis, das jeweils nur symptomatisch mit einem Workaround behandelt wird, statt die zugrunde liegende Ursache systematisch zu beheben.

### 3. Warum ist eine stabile CI-Identität die technische Voraussetzung für Incident-Problem-Verknüpfung?

**Antwort:** Nur eine stabile Identität des betroffenen Configuration Items lässt zuverlässig erkennen, dass mehrere Incidents tatsächlich dasselbe zugrunde liegende System betreffen.

### 4. Warum sollte eine Change-Freigabeentscheidung den Servicekontext berücksichtigen?

**Antwort:** Weil eine Änderung an einem für viele Services kritischen System eine sorgfältigere Freigabeprüfung erfordert als eine Änderung an einem isolierten, wenig genutzten System.

### 5. Wie gehst du vor, wenn ein Vorfall wiederholt mit jeweils kurzfristigen Workarounds behandelt wird?

**Antwort:** Ich prüfe, ob die wiederkehrenden Incidents mit einem gemeinsamen Problem verknüpft sind, und führe sie andernfalls zusammen, um eine systematische Ursachenanalyse zu ermöglichen.

### 6. Widersprüchliche Anforderung: Das Team will Incidents so schnell wie möglich schließen UND die Organisation will systematisch wiederkehrende Ursachen beheben — wie gehst du vor?

**Antwort:** Ich würde Incidents weiterhin schnell mit einem Workaround schließen, dabei aber konsequent auf Muster wiederkehrender, ähnlicher Vorfälle prüfen und diese explizit zu einem gemeinsamen Problem verknüpfen, statt entweder die Wiederherstellungsgeschwindigkeit zu opfern oder systematische Ursachenbehebung zu vernachlässigen.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting recurring incidents needing a problem link (executed locally, no real ITSM tool):

def find_problem_candidates(incidents, min_occurrences=3):
    counts = {}
    for i in incidents:
        counts[i["ci_id"]] = counts.get(i["ci_id"], 0) + 1
    return {ci: count for ci, count in counts.items() if count >= min_occurrences}

incidents = [
    {"id": "INC001", "ci_id": "server-042"},
    {"id": "INC014", "ci_id": "server-042"},
    {"id": "INC027", "ci_id": "server-042"},
    {"id": "INC031", "ci_id": "server-099"},
]

print("problem candidates (recurring, unlinked):", find_problem_candidates(incidents))
~~~

## Dependencies, Cross-References und Quellen

1. AXELOS: [ITIL 4 — Incident Management Practice](https://www.axelos.com/resource-hub/practice/itil-incident-management-itil-4-practice-guide), abgerufen 2026-09-18.
2. AXELOS: [ITIL 4 — Problem Management and Change Enablement Practices](https://www.axelos.com/resource-hub/practice/itil-problem-management-itil-4-practice-guide), abgerufen 2026-09-18.

ITIL und Service Management sind kanonisch in [KB-0607](19-itil-und-service-management.md) behandelt; Configuration Items und Beziehungen in [KB-0605](17-configuration-items-und-beziehungen.md); Dependency und Service Mapping in [KB-0606](18-dependency-und-service-mapping.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Ähnlichkeitserkennung zur Vorschlagsgenerierung für Incident-Problem-Verknüpfungen | Evaluating | Als Vorschlagswerkzeug für die verantwortliche Problem-Management-Rolle einsetzen, jedoch die abschließende Verknüpfungsentscheidung weiterhin menschlich prüfen, um fehlerhafte Zusammenführungen zu vermeiden. |

Ein Team akzeptiert eine Incident-Problem-Change-Praxis erst, wenn jeder Vorgang nachweislich mit Servicekontext und CMDB-Informationen verknüpft ist und wiederkehrende Incidents systematisch zu Problemen zusammengeführt werden.
