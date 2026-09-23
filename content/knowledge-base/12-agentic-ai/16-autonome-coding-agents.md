---
{"id": "KB-0290", "title": "Autonome Coding Agents", "domain": "12", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0289", "concepts": ["Human Gates für Agentenaktionen"], "needed_for": "understanding"}, {"id": "KB-0286", "concepts": ["Agenten-Sandboxing"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Plan-Build-Verify-Review-Ablauf implementieren, bei dem Verify und Review unabhängig vom ausführenden Coding Agent erfolgen.", "rationale": "Der Wert unabhängiger Verifikation wird erst durch konkrete Implementierung getrennter Verify-/Review-Schritte greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Repository-Grenzen für einen autonomen Coding Agent gestalten, die den Zugriffs- und Änderungsumfang auf den beabsichtigten Aufgabenbereich beschränken.", "rationale": "Ohne explizite Repository-Grenzen kann ein autonomer Coding Agent Änderungen außerhalb des beabsichtigten Aufgabenbereichs vornehmen."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte automatisch gemergte Änderung auf eine fehlende unabhängige Verify-/Review-Instanz statt auf ein allgemeines Qualitätsproblem zurückführen können.", "rationale": "Wenn derselbe Agent, der eine Änderung erstellt hat, auch deren Korrektheit bestätigt, entfällt die unabhängige Kontrollinstanz, die Fehler eigentlich abfangen sollte."}, "CHIEF-TARGET": {"active": true, "scope": "Autonome Coding Agents als produktionstaugliche Praxis nur mit unabhängiger Verifikation, expliziten Repository-Grenzen und Diff-Prüfung positionieren, nicht als vollautomatisierte Ersetzung menschlicher Codeverantwortung.", "rationale": "Vollständige Autonomie ohne unabhängige Kontrolle widerspricht der etablierten Praxis von Plan-Build-Verify-Review mit spezialisierten Rollen und Human Gates."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete CI/CD-Integrationsdetails für Coding Agents sind Vertiefung.", "rationale": "Kern ist das Prinzip unabhängiger Verifikation und expliziter Repository-Grenzen, nicht die konkrete Pipeline-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0290-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Plan-Build-Verify-Review-Ablaufs mit unabhängiger Verify-Instanz und Repository-Grenzenprüfung", "evidence": "Eine Änderung, die vom selben Agenten sowohl erstellt als auch verifiziert wird, kann einen eingebauten Fehler unentdeckt lassen; eine unabhängige Verify-Instanz erkennt denselben Fehler zuverlässig.", "limitations": "Kein echtes Repository, kein echter Coding Agent, kein produktives System."}]}
---
# Autonome Coding Agents

> **Ziel:** Ein Plan-Build-Verify-Review-Ablauf strukturiert agentische Softwareentwicklung in getrennte Phasen, wobei Verify und Review unabhängig vom Build-Schritt erfolgen müssen, aufbauend auf Sandboxing (siehe [KB-0286](12-agenten-sandboxing.md)) und Human Gates (siehe [KB-0289](15-human-gates-fuer-agentenaktionen.md)). Repository-Grenzen beschränken den Änderungsumfang eines Coding Agents auf den beabsichtigten Aufgabenbereich; unabhängige Tests, Review und Diff-Prüfung sind notwendig, weil ein Agent, der seine eigene Arbeit prüft, systematische Fehler nicht zuverlässig selbst erkennt.

## Zweck, Mental Model und Dependencies

Plan-Build-Verify-Review teilt agentische Softwareentwicklung in vier Phasen: Plan (was soll geändert werden und warum), Build (die eigentliche Codeänderung), Verify (unabhängige Prüfung, ob die Änderung korrekt und vollständig ist) und Review (eine weitere, oft menschliche oder spezialisierte Instanz, die die Gesamtänderung freigibt). Der zentrale, sicherheitsrelevante Punkt ist, dass Verify und Review unabhängig vom Build-Schritt erfolgen müssen — wenn derselbe Agent, der eine Änderung erstellt hat, auch deren Korrektheit bestätigt, entfällt die Kontrollfunktion, die eigentlich systematische Fehler oder blinde Flecken des Build-Schritts abfangen soll (ähnlich wie ein Mensch die eigene Arbeit oft schlechter prüft als eine unabhängige Instanz). Repository-Grenzen definieren, welche Teile eines Repositorys ein Coding Agent überhaupt verändern darf — ohne diese Grenzen könnte ein Agent bei der Bearbeitung einer eng umrissenen Aufgabe versehentlich oder als Nebenwirkung Änderungen an unabhängigen Teilen des Repositorys vornehmen. Diff-Prüfung bedeutet, dass die tatsächlichen Codeänderungen (nicht nur eine Zusammenfassung der Absicht) explizit gegen die beabsichtigte Aufgabe geprüft werden, bevor sie übernommen werden — eine Zusammenfassung kann Details verbergen, die erst im tatsächlichen Diff sichtbar werden.

~~~text
Plan: what to change and why
Build: actual code change
Verify: INDEPENDENT check that build is correct/complete
Review: further (often human/specialized) instance approving the whole change
CRITICAL: Verify/Review must NOT be done by the SAME agent that did Build
  -> same agent checking own work misses its own systematic errors/blind spots
Repository boundaries: scope of files/paths the coding agent may actually modify
Diff review: check ACTUAL changes (not just intent summary) against intended task
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Unabhängigkeit von Build und Verify | wird die Korrektheit einer Änderung von einer anderen Instanz geprüft als der, die sie erstellt hat? | ein Agent, der die eigene Arbeit prüft, erkennt eigene systematische Fehler oder blinde Flecken oft nicht |
| Explizite Repository-Grenzen | ist der Änderungsumfang eines Coding Agents auf den für die Aufgabe beabsichtigten Bereich des Repositorys beschränkt? | ohne Grenzen können versehentliche oder unbeabsichtigte Änderungen an unabhängigen Teilen des Repositorys entstehen |
| Diff-basierte statt zusammenfassungsbasierte Prüfung | wird der tatsächliche Diff geprüft, nicht nur eine textuelle Zusammenfassung der beabsichtigten Änderung? | eine Zusammenfassung kann relevante Details verbergen, die nur im tatsächlichen Diff sichtbar sind |
| Unabhängige Testausführung | werden Tests von einer unabhängigen Instanz oder Pipeline ausgeführt, statt sich auf die Selbstauskunft des Build-Agenten zu verlassen | eine vom Build-Agenten selbst berichtete Testausführung kann unvollständig oder manipuliert sein |

Implementierung: Verify- und Review-Schritte werden strukturell von einer anderen Instanz durchgeführt als der Build-Schritt — entweder ein separater, spezialisierter Agent oder ein menschlicher Reviewer (analog zu Human Gates, siehe [KB-0289](15-human-gates-fuer-agentenaktionen.md)). Jeder Coding Agent erhält explizite, technisch durchgesetzte Repository-Grenzen (z. B. beschränkter Dateisystemzugriff, siehe [KB-0286](12-agenten-sandboxing.md)), die den Änderungsumfang auf den beabsichtigten Aufgabenbereich begrenzen. Die Review-Phase prüft den tatsächlichen Diff der Änderung, nicht nur eine vom Build-Agenten gelieferte Zusammenfassung der Absicht. Tests werden in einer unabhängigen Pipeline oder von einer separaten Instanz ausgeführt, deren Ergebnis nicht von der Selbstauskunft des Build-Agenten abhängt.

## Scalability, Reliability, Security und Observability

Autonome Coding Agents skalieren Entwicklungsdurchsatz proportional zur Robustheit der unabhängigen Verify-/Review-Instanz; die Reliability-Grenze liegt in einer Vermischung von Build und Verify in derselben Agenteninstanz, die systematische Fehler unentdeckt lässt, unabhängig davon, wie leistungsfähig das zugrunde liegende Modell ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine fehlerhafte Änderung wurde automatisch gemergt, obwohl sie offensichtliche Probleme enthält | Verify oder Review wurde von derselben Instanz durchgeführt, die die Änderung erstellt hat | prüfen, ob die Verify-/Review-Instanz strukturell unabhängig vom Build-Schritt war |
| eine Codeänderung betrifft Dateien außerhalb des beabsichtigten Aufgabenbereichs | fehlende oder unzureichende Repository-Grenzen für den betroffenen Coding Agent | prüfen, ob technisch durchgesetzte Repository-Grenzen für den Agent existierten |
| ein gemergter Fehler wurde durch eine Zusammenfassung der Änderung verborgen, ist aber im tatsächlichen Diff erkennbar | die Review-Phase hat sich auf eine Zusammenfassung statt auf den tatsächlichen Diff verlassen | prüfen, ob die Review-Phase den tatsächlichen Diff oder nur eine Zusammenfassung geprüft hat |

Security: Repository-Grenzen sind auch eine Sicherheitsmaßnahme — ein kompromittierter oder fehlerhaft handelnder Coding Agent mit unbeschränktem Repository-Zugriff könnte Änderungen weit über den beabsichtigten Aufgabenbereich hinaus vornehmen, einschließlich sicherheitsrelevanter Konfigurationsdateien. Observability: Häufigkeit von durch unabhängige Verify-Instanzen erkannten Fehlern, Häufigkeit von Änderungen außerhalb der erwarteten Repository-Grenzen und Verhältnis von diff-basierter zu zusammenfassungsbasierter Review-Abdeckung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** trennt Build und Verify/Review strukturell und implementiert explizite Repository-Grenzen für jeden Coding Agent. **Principal** macht Diff-Prüfungsergebnisse und Testausführungsberichte für das Team nachvollziehbar dokumentiert. **Chief** positioniert autonome Coding Agents als produktionstaugliche Praxis nur mit unabhängiger Verifikation, nicht als vollautomatisierte Ersetzung menschlicher Codeverantwortung.

Anti-Patterns: denselben Agenten Build und Verify/Review durchführen lassen; Coding Agents ohne technisch durchgesetzte Repository-Grenzen betreiben; Review-Entscheidungen auf Basis einer Zusammenfassung statt des tatsächlichen Diffs treffen.

## Production Checklist

- [ ] Verify und Review erfolgen strukturell unabhängig vom Build-Schritt.
- [ ] Jeder Coding Agent hat explizite, technisch durchgesetzte Repository-Grenzen.
- [ ] Die Review-Phase prüft den tatsächlichen Diff, nicht nur eine Zusammenfassung.
- [ ] Tests werden in einer unabhängigen Pipeline ausgeführt, nicht nur vom Build-Agenten selbst berichtet.

## Interviewfragen

### 1. Warum dürfen Build und Verify/Review nicht von derselben Agenteninstanz durchgeführt werden?

**Antwort:** Eine Instanz, die die eigene Arbeit prüft, erkennt eigene systematische Fehler oder blinde Flecken oft nicht; eine unabhängige Instanz kann diese Fehler zuverlässiger aufdecken.

### 2. Warum benötigt ein Coding Agent explizite Repository-Grenzen?

**Antwort:** Ohne Grenzen kann ein Agent bei der Bearbeitung einer eng umrissenen Aufgabe versehentlich oder als Nebenwirkung Änderungen an unabhängigen, potenziell sicherheitsrelevanten Teilen des Repositorys vornehmen.

### 3. Warum reicht eine Zusammenfassung der Änderung für die Review-Phase nicht aus?

**Antwort:** Eine Zusammenfassung kann relevante Details verbergen, die erst im tatsächlichen Diff sichtbar werden; die Review-Phase muss den tatsächlichen Diff prüfen, um verlässlich zu sein.

### 4. Warum sollten Tests in einer unabhängigen Pipeline statt vom Build-Agenten selbst ausgeführt werden?

**Antwort:** Eine vom Build-Agenten selbst berichtete Testausführung kann unvollständig oder fehlerhaft sein; eine unabhängige Pipeline liefert ein verlässlicheres Ergebnis über die tatsächliche Korrektheit.

### 5. Wie diagnostizierst du eine fehlerhaft automatisch gemergte Änderung?

**Antwort:** Ich prüfe, ob Verify und Review strukturell unabhängig vom Build-Schritt erfolgten und ob die Review-Entscheidung auf dem tatsächlichen Diff statt auf einer Zusammenfassung basierte — fehlt beides, ist das die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will maximale Entwicklungsgeschwindigkeit durch vollautomatisierte Coding Agents ohne Wartezeit auf unabhängige Verify-/Review-Schritte UND garantiert keine fehlerhaften Merges — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich direkt widersprechen, wenn Verify/Review vollständig entfällt; ich würde vorschlagen, die unabhängige Verify-Instanz ebenfalls als schnellen, automatisierten Agenten (statt eines langsamen menschlichen Reviews) zu implementieren, sodass Geschwindigkeit erhalten bleibt, ohne auf die strukturelle Unabhängigkeit von Build und Verify zu verzichten.

## Praktische Labs

~~~python
# Independent Build vs Verify, with repository-boundary and diff-based review
ALLOWED_PATHS = {"src/feature_x/"}

def build_change(task):
    # Simulated build step with an intentional bug for demonstration
    return {"file": "src/feature_x/handler.py", "diff": "if x = 1:  # bug: assignment instead of comparison"}

def check_repository_boundary(change, allowed_paths):
    if not any(change["file"].startswith(p) for p in allowed_paths):
        raise PermissionError(f"Repository boundary violation: '{change['file']}' outside allowed paths")

def independent_verify(change):
    # Independent instance actually inspects the diff, not a self-reported summary
    if "= 1" in change["diff"] and "if" in change["diff"]:
        return {"status": "failed", "reason": "assignment used where comparison expected"}
    return {"status": "passed"}

def self_reported_verify(change):
    # Anti-pattern: build agent reports its own change as correct
    return {"status": "passed", "reason": "reported by build agent itself"}

change = build_change("fix handler logic")
check_repository_boundary(change, ALLOWED_PATHS)

independent_result = independent_verify(change)
self_reported_result = self_reported_verify(change)

print(f"Independent verify result: {independent_result}")
print(f"Self-reported verify result (anti-pattern): {self_reported_result}")
assert independent_result["status"] == "failed"
assert self_reported_result["status"] == "passed"
print("Independent verification catches the bug that self-reported verification misses.")
~~~

## Dependencies, Cross-References und Quellen

1. Anthropic: [Claude Code — Best Practices for Agentic Coding](https://www.anthropic.com/engineering/claude-code-best-practices), abgerufen 2026-09-17.
2. GitHub: [About Code Owners and Required Reviews](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Excessive Agency](https://genai.owasp.org/llmrisk/llm08-excessive-agency/), abgerufen 2026-09-17.

Agenten-Sandboxing ist kanonisch in [KB-0286](12-agenten-sandboxing.md) behandelt; Human Gates in [KB-0289](15-human-gates-fuer-agentenaktionen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Spezialisierte Verify-Agenten, die ausschließlich auf Diff-Prüfung und Testverifikation trainiert sind, getrennt vom Build-Agenten | Adopting | Gegenüber einem einzigen generalistischen Agenten für Build und Verify für robustere Fehlererkennung bevorzugen. |
| Automatisierte Repository-Grenzendurchsetzung über Policy-as-Code direkt in der CI/CD-Pipeline | Adopting | Gegenüber manueller Konfiguration pro Agent für konsistente, auditierbare Durchsetzung bevorzugen. |

Ein Team akzeptiert eine Architektur für autonome Coding Agents erst, wenn strukturelle Unabhängigkeit von Build und Verify/Review, Repository-Grenzen und diff-basierte Prüfung dokumentiert und getestet sind.
