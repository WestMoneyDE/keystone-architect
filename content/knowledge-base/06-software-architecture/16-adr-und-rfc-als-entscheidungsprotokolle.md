---
{"id": "KB-0144", "title": "ADR und RFC als Entscheidungsprotokolle", "domain": "06", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0128", "concepts": ["Trade-off-Modelle"], "needed_for": "both"}], "related": ["KB-0145", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein ADR für eine Beispielentscheidung mit Problem, Alternativen, Konsequenzen und Status schreiben.", "rationale": "Kein reales Projekt nötig, um das Dokumentformat zu üben."}, "ARCHITECT-TARGET": {"active": true, "scope": "Entscheidungsprotokolle so strukturieren, dass spätere Leser die Begründung ohne Rückfrage nachvollziehen können.", "rationale": "Eine unbegründete Entscheidung kann später nicht sinnvoll neu bewertet werden."}, "STAFF-TARGET": {"active": true, "scope": "Anhand eines veralteten ADRs erkennen, welche zugrunde liegende Annahme sich geändert hat.", "rationale": "ADRs sind auch ein Werkzeug, um zu erkennen, wann eine Entscheidung überholt ist."}, "CHIEF-TARGET": {"active": true, "scope": "ADR-/RFC-Prozess als organisationsweiten Standard für wesentliche Architekturentscheidungen etablieren.", "rationale": "Ohne dokumentierte Entscheidungshistorie gehen Begründungen bei Teamwechseln verloren."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "RFC-Prozesse mit formeller Kommentierungsphase (wie bei großen Open-Source-Projekten) sind Vertiefung.", "rationale": "Kern ist Struktur und Nachvollziehbarkeit, nicht ein spezifisches Reviewverfahren."}}, "lab_validation": [{"lab_id": "KB-0144-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für ein strukturiertes ADR mit Statuswechsel", "evidence": "Ein ADR mit Status 'accepted' wird korrekt von einem später erstellten ADR mit Status 'supersedes' abgelöst, wobei beide nachvollziehbar bleiben.", "limitations": "Kein reales Projekt, rein methodische Übung."}]}
---
# ADR und RFC als Entscheidungsprotokolle

> **Ziel:** Ein Architecture Decision Record (ADR) dokumentiert eine getroffene Architekturentscheidung mit Problem, erwogenen Alternativen, Konsequenzen und Status — so, dass ein späterer Leser die Begründung versteht, ohne die ursprünglichen Beteiligten fragen zu müssen. Ein RFC (Request for Comments) ist der vorgelagerte Diskussionsentwurf, aus dem ggf. ein ADR entsteht. Die Trennung zwischen „Entwurf zur Diskussion" und „beschlossene Entscheidung" ist entscheidend für Nachvollziehbarkeit.

## Zweck, Mental Model und Dependencies

Ein RFC ist ein Vorschlag zur Diskussion — er kann sich noch ändern, abgelehnt werden oder in mehreren Runden überarbeitet werden. Ein ADR dokumentiert die tatsächlich getroffene Entscheidung als abgeschlossenes, versioniertes Artefakt mit einem klaren Status (proposed, accepted, deprecated, superseded). Diese Trennung verhindert, dass ein früher Diskussionsentwurf fälschlich als finale Entscheidung missverstanden wird, und macht sichtbar, wenn eine ältere Entscheidung durch eine neuere abgelöst wurde, statt sie stillschweigend zu ignorieren. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0128](28-trade-off-modelle-fuer-systementscheidungen.md).

~~~text
RFC-012: "Should we migrate to event sourcing?" -> discussion, revisions -> either rejected or promoted
ADR-005: "We use event sourcing for the Orders module" (status: accepted, date, context, alternatives, consequences)
ADR-019: "We stop using event sourcing for Orders" (status: supersedes ADR-005, reason: operational cost exceeded benefit)
~~~

## Core Concepts, Architektur und Implementierung

| Bestandteil | Frage | Häufiger Fehler |
|---|---|---|
| Problem/Kontext | welches konkrete Problem wird gelöst? | zu abstrakt formuliert, spätere Leser verstehen die Motivation nicht |
| Erwogene Alternativen | welche anderen Optionen wurden geprüft und warum verworfen? | nur die gewählte Lösung dokumentiert, keine Alternativen |
| Konsequenzen | welche positiven und negativen Folgen wurden akzeptiert? | nur Vorteile genannt, negative Konsequenzen verschwiegen |
| Status | proposed/accepted/deprecated/superseded klar markiert? | Status fehlt oder wird nie aktualisiert, ADR wirkt ewig gültig |

Implementierung: jedes ADR folgt einer festen, minimalen Struktur (Titel, Datum, Status, Kontext, Entscheidung, Konsequenzen) und wird versioniert im Code-Repository abgelegt, nahe am betroffenen Code. Wird eine Entscheidung später revidiert, entsteht ein neues ADR mit Verweis auf das alte („supersedes ADR-005"), statt das alte zu löschen oder unkommentiert zu ändern — die Historie bleibt vollständig nachvollziehbar.

## Scalability, Reliability, Security und Observability

ADRs skalieren als Wissensmanagement-Werkzeug über Teamwechsel und Zeit hinweg — sie ersetzen mündliche Überlieferung, die bei Personalwechsel verloren geht. Reliability-Grenze der Methodik: ein ADR ohne aktualisierten Status wird fälschlich als weiterhin gültig gelesen, auch wenn sich die zugrunde liegenden Annahmen längst geändert haben — die Disziplin, Status aktiv zu pflegen, ist entscheidend.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Team trifft wiederholt dieselbe, bereits einmal verworfene Entscheidung | fehlendes oder nicht auffindbares ADR zur vorherigen Ablehnung | Repository nach relevanten ADRs zum Thema durchsuchen |
| neues Teammitglied versteht Architekturentscheidung nicht | ADR fehlt oder dokumentiert nur die Entscheidung ohne Begründung/Alternativen | prüfen, ob Kontext und Alternativen im ADR enthalten sind |
| eine offensichtlich überholte Entscheidung wird noch befolgt | ADR-Status wurde nie auf deprecated/superseded aktualisiert | Status des ADR gegen aktuelle Systemrealität prüfen |
| Diskussion wird fälschlich als finale Entscheidung behandelt | RFC und ADR nicht klar getrennt/gekennzeichnet | Dokumenttyp (RFC vs. ADR) und dessen Status prüfen |

Security: ADRs zu sicherheitsrelevanten Entscheidungen (z. B. Authentifizierungsstrategie) sind wichtige Audit-Artefakte, die die Begründung für Compliance-Nachweise liefern können. Observability: eine durchsuchbare ADR-Sammlung ist selbst ein Beobachtungswerkzeug für die Entscheidungsgeschichte eines Systems.

## Trade-offs und Entscheidungen

**Staff** schreibt ein ADR für jede nicht-triviale Architekturentscheidung, bevor sie umgesetzt wird, nicht nachträglich als Formalität. **Principal** etabliert eine einheitliche ADR-Vorlage und einen durchsuchbaren Ablageort nahe am Code. **Chief** verlangt ADR-Dokumentation als organisationsweiten Standard für wesentliche Architekturentscheidungen und regelmäßige Status-Reviews.

Anti-Patterns: Entscheidungen nur mündlich oder in flüchtigen Chat-Nachrichten treffen, ohne dauerhafte Dokumentation; ADRs ohne dokumentierte Alternativen und Konsequenzen, nur mit der gewählten Lösung; alte ADRs löschen statt sie mit Status „superseded" zu erhalten.

## Production Checklist

- [ ] Jede wesentliche Architekturentscheidung hat ein ADR mit Problem, Alternativen, Konsequenzen und Status.
- [ ] ADRs werden versioniert nahe am betroffenen Code abgelegt und sind durchsuchbar.
- [ ] Revidierte Entscheidungen erzeugen ein neues ADR mit Verweis auf das alte, statt es zu löschen.
- [ ] RFC (Diskussionsentwurf) und ADR (beschlossene Entscheidung) sind klar unterschieden.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem RFC und einem ADR?

**Antwort:** Ein RFC ist ein Diskussionsentwurf, der sich noch ändern oder abgelehnt werden kann; ein ADR dokumentiert die tatsächlich getroffene, abgeschlossene Entscheidung mit einem klaren Status.

### 2. Warum sollten erwogene, aber verworfene Alternativen im ADR dokumentiert werden?

**Antwort:** Damit spätere Leser verstehen, warum eine bestimmte Option nicht gewählt wurde, und nicht dieselbe bereits geprüfte und verworfene Alternative erneut vorschlagen.

### 3. Was passiert, wenn eine ADR-Entscheidung später revidiert wird?

**Antwort:** Ein neues ADR wird erstellt, das auf das alte verweist und es als „superseded" markiert — das alte ADR bleibt erhalten, damit die Entscheidungshistorie nachvollziehbar bleibt.

### 4. Warum ist ein fehlender oder veralteter Status ein Problem?

**Antwort:** Ohne aktualisierten Status wird ein ADR fälschlich als weiterhin gültig gelesen, auch wenn sich die zugrunde liegenden Annahmen längst geändert haben.

### 5. Wo sollten ADRs abgelegt werden?

**Antwort:** Versioniert, nahe am betroffenen Code (z. B. im selben Repository), durchsuchbar und dauerhaft, statt in flüchtigen Chat-Nachrichten oder mündlicher Überlieferung.

### 6. Widersprüchliche Anforderung: Team will schnelle Entscheidungsfindung UND vollständige ADR-Dokumentation für jede Entscheidung — wie gehst du vor?

**Antwort:** Ich würde eine minimale, aber vollständige ADR-Vorlage etablieren (wenige Sätze pro Abschnitt reichen), die schnell auszufüllen ist, statt vollständige Dokumentation gegen Geschwindigkeit auszuspielen — und ADRs nur für Entscheidungen mit echter langfristiger Tragweite verlangen, nicht für jede triviale Wahl.

## Praktische Labs

~~~python
adrs = {
    "ADR-005": {"status": "accepted", "topic": "event sourcing for Orders"},
}

def supersede(adrs, old_id, new_id, reason):
    adrs[old_id]["status"] = f"superseded by {new_id}"
    adrs[new_id] = {"status": "accepted", "topic": adrs[old_id]["topic"], "reason": reason}

supersede(adrs, "ADR-005", "ADR-019", "operational cost exceeded benefit")
assert adrs["ADR-005"]["status"] == "superseded by ADR-019"
assert adrs["ADR-019"]["status"] == "accepted"
print("Old decision preserved with clear superseded status, new decision documented with its reason.")
~~~

## Dependencies, Cross-References und Quellen

1. Nygard: [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions), 2011, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete ADR-Tooling-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte ADR-Erstellung aus PR-/Commit-Beschreibungen | Emerging | Vollständigkeit gegen manuell verfasste ADRs validieren. |

Diese Methodik ist ein etabliertes, stabiles Dokumentationsprinzip; der Bonus betrifft primär, wie Tooling die Erstellung erleichtern kann, ohne die inhaltliche Sorgfalt (Alternativen, Konsequenzen) zu ersetzen.
