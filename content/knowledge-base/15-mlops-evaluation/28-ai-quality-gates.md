---
{"id": "KB-0378", "title": "AI Quality Gates", "domain": "15", "sequence": 28, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0367", "concepts": ["AI-Regressionsprüfungen"], "needed_for": "understanding"}, {"id": "KB-0376", "concepts": ["Approval Workflows für AI-Releases"], "needed_for": "understanding"}], "related": ["KB-0369"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Quality Gate implementieren, das Qualitäts-, Sicherheits- und Betriebsprüfungen kombiniert und bei unklarem Prüfergebnis fail-closed statt fail-open reagiert.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Quality-Gate-Architektur gestalten, die fail-closed als Standardverhalten etabliert und begründete Ausnahmen explizit nachweispflichtig macht statt sie stillschweigend zuzulassen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Quality Gate fälschlich fail-open statt fail-closed konfiguriert ist, wodurch ein Prüffehler ein Release nicht blockiert, sondern durchlässt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Fail-closed als nicht verhandelbaren Standard für AI Quality Gates im Unternehmen etablieren, mit Ausnahmen nur bei explizit dokumentierter, nachvollziehbarer Begründung.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Integration von Quality Gates in komplexe, mehrstufige CI/CD-Orchestrierungssysteme ist Vertiefung.", "rationale": "Kern ist das fail-closed-Prinzip und die Ausnahmebegründung, nicht die konkrete CI/CD-Integration."}}, "lab_validation": [{"lab_id": "KB-0378-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Quality Gate mit einem absichtlich fehlschlagenden Prüfschritt (z. B. Timeout einer Sicherheitsprüfung)", "evidence": "Ein simuliertes Quality Gate, bei dem eine Sicherheitsprüfung aufgrund eines Timeouts kein eindeutiges Ergebnis liefert, blockiert das Release korrekt (fail-closed), während eine fälschlich fail-open konfigurierte Variante das Release trotz unklarem Prüfergebnis fälschlich durchlässt.", "limitations": "Kein produktives Quality-Gate-System, kein realer Geschäftsdatensatz, künstlich konstruiertes Timeout-Szenario."}]}
---
# AI Quality Gates

> **Ziel:** Ein AI Quality Gate kombiniert Qualitäts- (siehe [KB-0367](17-ai-regressionspruefungen.md)), Sicherheits- und Betriebsprüfungen (siehe [KB-0369](19-drift-und-qualitaetsaenderung.md)) zu einem einzigen, verbindlichen Freigabepunkt vor einem Release und nach erkanntem Drift. Der zentrale Punkt dieses Kapitels ist das fail-closed-Prinzip: wenn eine Prüfung nicht eindeutig als bestanden bewertet werden kann (z. B. wegen eines Timeouts, eines Systemfehlers oder unvollständiger Daten), muss das Gate das Release standardmäßig blockieren, nicht durchlassen — begründete Ausnahmen von dieser Regel müssen explizit nachgewiesen und dokumentiert werden, statt stillschweigend zugelassen zu werden.

## Zweck, Mental Model und Dependencies

Ein Quality Gate ist ein verbindlicher Kontrollpunkt, der ein Release nur dann zulässt, wenn alle definierten Prüfungen (Qualität, Sicherheit, Betrieb) erfolgreich bestanden wurden. Fail-closed bedeutet: bei jedem unklaren oder fehlerhaften Prüfergebnis (ein Timeout, ein Systemabsturz während der Prüfung, fehlende Daten für eine vollständige Bewertung) wird das Release standardmäßig blockiert — die Abwesenheit eines eindeutig positiven Ergebnisses wird als "nicht bestanden" behandelt, nicht als "vermutlich in Ordnung". Das Gegenteil, fail-open, würde bei einem unklaren Prüfergebnis das Release trotzdem durchlassen, was ein erhebliches Sicherheitsrisiko darstellt: ein Angreifer oder ein zufälliger Systemfehler könnte dann gezielt oder versehentlich eine Prüfung zum Scheitern bringen, um ein eigentlich zu blockierendes Release durchzulassen. Begründete Ausnahmen von der fail-closed-Regel (z. B. ein dringender Sicherheitspatch, bei dem eine bestimmte, nicht sicherheitskritische Prüfung aus Zeitgründen übersprungen wird) müssen explizit nachgewiesen werden — wer hat die Ausnahme genehmigt, warum, und mit welcher Kompensationsmaßnahme —, statt als informeller, unbelegter "Sonderfall" durchzurutschen.

~~~text
Quality Gate: binding checkpoint -- release proceeds ONLY if ALL defined checks (quality, security, operations) pass
FAIL-CLOSED (the correct default): any UNCLEAR or ERRORED check result (timeout, crash, incomplete data)
  -> BLOCKS the release by default -- absence of a clear PASS is treated as "not passed", not "probably fine"
FAIL-OPEN (the dangerous alternative): unclear result -> release proceeds anyway
  -> SECURITY RISK: an attacker or a random system fault could deliberately/accidentally break a check
     to let a release that SHOULD be blocked through
JUSTIFIED EXCEPTIONS to fail-closed: must be EXPLICITLY documented (who approved, why, what compensating measure)
  -> never an informal, unrecorded "special case"
~~~

## Core Concepts, Architektur und Implementierung

| Prüfkategorie | Beispiel | Fail-closed-Verhalten bei unklarem Ergebnis |
|---|---|---|
| Qualität | Regressionstest-Ergebnis (siehe [KB-0367](17-ai-regressionspruefungen.md)) | Timeout/Fehler bei der Testausführung blockiert das Release |
| Sicherheit | Red-Team-Testfall-Ergebnis | fehlgeschlagene oder unvollständige Sicherheitsprüfung blockiert das Release |
| Betrieb | Drift-/Kostensignal (siehe [KB-0369](19-drift-und-qualitaetsaenderung.md)) | fehlende oder unklare Betriebsmetrik blockiert das Release |

Implementierung: Jedes Quality Gate definiert für jede Prüfkategorie ein klares Erfolgskriterium; jede Prüfung, die nicht eindeutig dieses Kriterium erfüllt (einschließlich Timeout, Systemfehler oder unvollständiger Ausführung), wird als "nicht bestanden" gewertet und blockiert das Release standardmäßig. Ausnahmen vom fail-closed-Verhalten sind technisch möglich, erfordern jedoch eine explizite, dokumentierte Genehmigung (analog zu den Approval-Workflows aus [KB-0376](26-approval-workflows-fuer-ai-releases.md)) mit Begründung und gegebenenfalls einer Kompensationsmaßnahme, bevor das Release trotz unklarer Prüfung fortgesetzt werden darf.

## Scalability, Reliability, Security und Observability

Fail-closed Quality Gates skalieren Sicherheit proportional zur Konsequenz, mit der jede unklare Prüfung tatsächlich blockiert wird; die Reliability-Grenze liegt darin, dass eine fälschlich fail-open konfigurierte Prüfung proportional zur Häufigkeit von Timeouts oder Systemfehlern das Risiko unbemerkt durchgelassener, eigentlich zu blockierender Releases erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Release wird trotz eines Timeouts bei der Sicherheitsprüfung fortgesetzt | das Gate ist fälschlich fail-open statt fail-closed konfiguriert | die Gate-Konfiguration prüfen und auf fail-closed als Standardverhalten umstellen |
| ein Team meldet häufige, informelle "Ausnahmen" vom Quality Gate ohne dokumentierte Begründung | kein verpflichtender Genehmigungsprozess für Ausnahmen vom fail-closed-Verhalten existiert | einen expliziten, dokumentierten Approval-Prozess für jede Ausnahme einführen |
| ein Release, das eine Prüfung eigentlich nicht bestanden hat, gelangt dennoch in Produktion | eine unklare oder fehlerhafte Prüfung wurde fälschlich als "bestanden" statt als "blockierend" interpretiert | das Auswertungslogik des Gates prüfen und sicherstellen, dass nur ein eindeutig positives Ergebnis als "bestanden" zählt |

Security: Fail-closed ist ein fundamentales Sicherheitsprinzip, da es verhindert, dass ein gezielt oder versehentlich herbeigeführter Prüffehler zu einem durchgelassenen, eigentlich zu blockierenden Release führt. Observability: Die Anzahl blockierter Releases aufgrund unklarer Prüfergebnisse, die Anzahl dokumentierter Ausnahmen vom fail-closed-Verhalten mit ihrer jeweiligen Begründung, und die Häufigkeit von Timeouts oder Systemfehlern bei Prüfungen sind zentrale Governance-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert fail-closed als Standardverhalten für jedes Quality Gate. **Principal** macht dokumentierte Ausnahmen und deren Begründung für das Team nachvollziehbar. **Chief** etabliert fail-closed als nicht verhandelbaren Standard für AI Quality Gates im Unternehmen, mit Ausnahmen nur bei explizit dokumentierter, nachvollziehbarer Begründung.

Anti-Patterns: ein Quality Gate fail-open konfigurieren, sodass unklare Prüfergebnisse ein Release nicht blockieren; informelle, undokumentierte Ausnahmen vom fail-closed-Verhalten zulassen; ein unvollständiges oder fehlgeschlagenes Prüfergebnis fälschlich als "bestanden" interpretieren.

## Production Checklist

- [ ] Jedes Quality Gate ist standardmäßig fail-closed konfiguriert.
- [ ] Nur ein eindeutig positives Prüfergebnis zählt als "bestanden"; alles andere blockiert das Release.
- [ ] Ausnahmen vom fail-closed-Verhalten erfordern eine explizite, dokumentierte Genehmigung mit Begründung.
- [ ] Timeouts, Systemfehler und unvollständige Prüfungen werden systematisch als blockierend behandelt.

## Interviewfragen

### 1. Was bedeutet fail-closed bei einem AI Quality Gate?

**Antwort:** Bei jedem unklaren oder fehlerhaften Prüfergebnis (Timeout, Systemfehler, unvollständige Daten) wird das Release standardmäßig blockiert, statt es trotzdem durchzulassen.

### 2. Warum ist fail-open ein Sicherheitsrisiko?

**Antwort:** Ein Angreifer oder ein zufälliger Systemfehler könnte gezielt oder versehentlich eine Prüfung zum Scheitern bringen, um ein eigentlich zu blockierendes Release durchzulassen.

### 3. Wie sollten begründete Ausnahmen vom fail-closed-Verhalten behandelt werden?

**Antwort:** Sie müssen explizit dokumentiert werden — wer hat die Ausnahme genehmigt, warum, und mit welcher Kompensationsmaßnahme —, statt als informeller, unbelegter Sonderfall durchzurutschen.

### 4. Was zählt bei einem fail-closed Quality Gate als "bestanden"?

**Antwort:** Ausschließlich ein eindeutig positives Prüfergebnis; jedes andere Ergebnis, einschließlich Timeout oder Systemfehler, wird als "nicht bestanden" gewertet.

### 5. Wie gehst du vor, wenn ein Release trotz eines Timeouts bei der Sicherheitsprüfung fortgesetzt wurde?

**Antwort:** Ich prüfe die Gate-Konfiguration auf fälschlich fail-open eingestelltes Verhalten und stelle sicher, dass zukünftig fail-closed als Standardverhalten greift.

### 6. Widersprüchliche Anforderung: Team will schnelle, unterbrechungsfreie Releases UND garantiert fail-closed bei jeder unklaren Prüfung — wie gehst du vor?

**Antwort:** Ich würde die Prüfungen selbst so robust und zuverlässig wie möglich gestalten, um unklare Ergebnisse (Timeouts, Fehler) durch bessere Infrastruktur zu minimieren, dabei aber fail-closed als nicht verhandelbares Sicherheitsprinzip beibehalten und für den seltenen, tatsächlich dringenden Fall einen schnellen, aber dokumentationspflichtigen Ausnahmeprozess bereitstellen.

## Praktische Labs

~~~python
def run_check(check_name, result_status):
    # result_status: "passed", "failed", "timeout", "error"
    return {"check": check_name, "status": result_status}

def evaluate_gate(check_results, fail_closed=True):
    for result in check_results:
        if result["status"] != "passed":
            if fail_closed:
                return False, f"BLOCKED: check '{result['check']}' status='{result['status']}' (fail-closed: any non-pass blocks release)"
            else:
                print(f"WARNING (fail-open, dangerous): check '{result['check']}' status='{result['status']}' but proceeding anyway")
    return True, "ALLOWED: all checks passed"

checks = [
    run_check("regression_test", "passed"),
    run_check("security_redteam", "timeout"),  # unclear result -- should block under fail-closed
    run_check("cost_check", "passed"),
]

allowed_closed, message_closed = evaluate_gate(checks, fail_closed=True)
print(f"fail-closed result: allowed={allowed_closed}, {message_closed}")

allowed_open, message_open = evaluate_gate(checks, fail_closed=False)
print(f"fail-open result:   allowed={allowed_open}, {message_open}")
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-17.
2. OWASP: [Fail Securely](https://owasp.org/www-community/Fail_securely), abgerufen 2026-09-17.

AI-Regressionsprüfungen sind kanonisch in [KB-0367](17-ai-regressionspruefungen.md) behandelt; Approval Workflows für AI-Releases in [KB-0376](26-approval-workflows-fuer-ai-releases.md); Drift und Qualitätsänderung in [KB-0369](19-drift-und-qualitaetsaenderung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, policy-basierte Gate-Engines, die fail-closed-Regeln deklarativ statt in Anwendungscode durchsetzen | Adopting | Gegenüber fest im Anwendungscode verankerten Prüfungen für konsistentere, zentral pflegbare Gate-Regeln bevorzugen. |
| Automatisierte Ausnahmeprotokollierung, die jede fail-closed-Ausnahme mit Begründung und Genehmiger maschinenlesbar erfasst | Adopting | Gegenüber informeller, manueller Ausnahmedokumentation für lückenlose Nachvollziehbarkeit bevorzugen. |

Ein Team akzeptiert ein Release erst, wenn alle Quality-Gate-Prüfungen eindeutig bestanden wurden oder eine dokumentierte, genehmigte Ausnahme vorliegt.
