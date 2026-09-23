---
{"id": "KB-0586", "title": "Disaster Recovery und Übungen", "domain": "24", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0584", "concepts": ["RTO und RPO"], "needed_for": "understanding"}, {"id": "KB-0585", "concepts": ["Backup-Betrieb und Wiederherstellungsnachweise"], "needed_for": "understanding"}, {"id": "KB-0583", "concepts": ["Chaos Engineering"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Disaster-Recovery-Runbook mit klaren Verantwortlichkeiten und Wiederanlaufreihenfolge anhand offizieller Referenzen korrekt ausführen und eine Tabletop- oder technische DR-Übung mit dokumentierten, gemessenen Ergebnissen durchführen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Runbooks, RTO/RPO-Ziele (siehe KB-0584) und Backup-Wiederherstellungsnachweise (siehe KB-0585) zu einer vollständigen, übbaren Disaster-Recovery-Fähigkeit zusammengeführt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Aus dem Ergebnis einer DR-Übung eine korrigierte, tatsächlich zutreffende Abhängigkeitsreihenfolge ableiten können, statt eine ursprünglich angenommene, aber durch die Übung widerlegte Reihenfolge unverändert beizubehalten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für regelmäßige Tabletop- und technische DR-Übungen festlegen, die Runbooks und Abhängigkeitsannahmen nachweislich anhand tatsächlich gemessener Übungsergebnisse aktuell halten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale Zertifizierung spezifischer Disaster-Recovery-Standards im Detail ist Vertiefung.", "rationale": "Kern ist die praktische Ausführung und regelmäßige Übung von Runbooks mit gemessenen, korrigierten Ergebnissen, nicht die formale Zertifizierung eines bestimmten Standards."}}, "lab_validation": [{"lab_id": "KB-0586-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer DR-Übung mit widerlegter Abhängigkeitsannahme, kein produktives DR-System verwendet", "evidence": "Ein lokales Skript simuliert eine DR-Übung, bei der eine ursprünglich angenommene Wiederherstellungsreihenfolge tatsächlich zu einem Fehler führt, weil eine bislang unbekannte Abhängigkeit übersehen wurde, und zeigt, wie das Runbook auf Basis dieses gemessenen Ergebnisses korrigiert wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales DR-System."}]}
---
# Disaster Recovery und Übungen

> **Ziel:** Dieses Kapitel führt die bereits behandelten Bausteine — RTO/RPO-Ziele ([KB-0584](20-rto-und-rpo.md)), belegte Backup-Wiederherstellbarkeit ([KB-0585](21-backup-betrieb-und-wiederherstellungsnachweise.md)) und die methodische Disziplin kontrollierter Übungen (verwandt mit den bereits in [KB-0583](19-chaos-engineering.md) behandelten Chaos-Engineering-Prinzipien) — zu einer vollständigen, tatsächlich geübten Disaster-Recovery-Fähigkeit zusammen. Ein **Runbook** (die dokumentierte, schrittweise Anleitung zur Wiederherstellung mit klaren Verantwortlichkeiten und Reihenfolge) ist nur so verlässlich wie seine letzte tatsächliche Ausführung — der zentrale Punkt dieses Kapitels ist, dass sowohl **Tabletop-Übungen** (eine besprochene, nicht technisch ausgeführte Durchsprache des Runbooks) als auch **technische DR-Übungen** (die tatsächliche, technische Ausführung der Wiederherstellung) regelmäßig durchgeführt und ihre **gemessenen Ergebnisse** genutzt werden müssen, um **korrigierte Abhängigkeiten** in das Runbook zurückzuführen — ein Runbook, das nie tatsächlich geübt wurde, enthält mit hoher Wahrscheinlichkeit unentdeckte, falsche Annahmen über Abhängigkeiten oder Reihenfolge, die erst im echten Ernstfall sichtbar werden, wenn eine Korrektur zu spät kommt.

## Zweck, Mental Model und Dependencies

Ein Runbook dokumentiert die geplante Wiederherstellungsreihenfolge und die dafür verantwortlichen Personen oder Teams — doch diese Dokumentation basiert notwendigerweise auf Annahmen, die zum Zeitpunkt der Erstellung als korrekt galten, aber durch spätere Systemänderungen (neue Abhängigkeiten, geänderte Infrastruktur, ausgetauschte Verantwortlichkeiten) veralten können, ohne dass dies dem Runbook selbst anzumerken ist. Tabletop-Übungen und technische DR-Übungen adressieren diese Alterungsproblematik auf unterschiedliche, komplementäre Weise: Eine Tabletop-Übung (ein moderiertes Durchsprechen des Runbooks durch die beteiligten Verantwortlichen, ohne tatsächliche technische Ausführung) deckt vor allem Lücken in der Verantwortlichkeits- und Kommunikationsstruktur auf (etwa eine im Runbook genannte, aber inzwischen nicht mehr im Unternehmen tätige Person, oder eine unklare Eskalationsentscheidung) mit vergleichsweise geringem Aufwand, kann jedoch keine tatsächlich falsche technische Abhängigkeitsannahme aufdecken, da keine echte technische Ausführung stattfindet. Eine technische DR-Übung (die tatsächliche, technische Durchführung der Wiederherstellung, typischerweise in einer isolierten oder kontrollierten Umgebung, analog zur begrenzten Blast-Radius-Praxis aus [KB-0583](19-chaos-engineering.md)) deckt dagegen genau diese technischen Abhängigkeitslücken auf — etwa eine im Runbook nicht dokumentierte, aber tatsächlich notwendige Wiederherstellungsreihenfolge zwischen zwei Systemen, die erst sichtbar wird, wenn die Wiederherstellung tatsächlich in der falschen Reihenfolge versucht und dadurch ein Fehler beobachtet wird. Die entscheidende methodische Konsequenz ist, dass das Ergebnis jeder Übung — ob eine im Runbook angenommene Reihenfolge oder Verantwortlichkeit tatsächlich zutraf oder nicht — explizit zurück in eine korrigierte Version des Runbooks überführt werden muss; ein Runbook, das nach einer Übung mit entdeckten Lücken unverändert bleibt, hat den eigentlichen Zweck der Übung verfehlt.

~~~text
This chapter joins established building blocks into COMPLETE, actually-drilled DR capability:
  RTO/RPO targets (KB-0584) + proven backup restorability (KB-0585)
  + methodical discipline of controlled exercises (related to chaos engineering principles, KB-0583)
RUNBOOK: documented, step-by-step recovery guide w/ clear ownership + order
  only as reliable as its LAST ACTUAL execution
KEY POINT: both TABLETOP exercises (discussed, not technically executed walkthrough)
  AND TECHNICAL DR exercises (actual technical execution of recovery)
  must run REGULARLY, their MEASURED RESULTS used to feed CORRECTED dependencies back into runbook
  runbook never actually drilled -> high likelihood of undiscovered, wrong dependency/order assumptions
    only surfacing in a real disaster, too late to correct
WHY runbook assumptions age:
  documentation based on assumptions correct AT CREATION TIME
  later system changes (new dependencies, changed infra, swapped ownership) can make them stale
    without this being visible in the runbook itself
TABLETOP vs TECHNICAL exercises = complementary, address DIFFERENT gaps:
  tabletop (moderated walkthrough by responsible people, NO actual technical execution)
    -> uncovers gaps in OWNERSHIP/COMMUNICATION structure (person no longer at company, unclear escalation)
    -> comparatively LOW effort, but CANNOT uncover a wrong TECHNICAL dependency assumption
       (no real execution happens)
  technical DR exercise (actual technical execution, typically isolated/controlled env,
    analogous to limited blast-radius practice from KB-0583)
    -> uncovers exactly these TECHNICAL dependency gaps
       (undocumented-but-actually-necessary recovery order between two systems,
        only visible when attempted in wrong order and error observed)
CENTRAL METHODOLOGICAL CONSEQUENCE:
  result of EVERY exercise (assumed order/ownership actually held true, or not)
  must be explicitly fed back into a CORRECTED runbook version
  runbook left unchanged after exercise uncovered gaps -> exercise missed its actual purpose
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Runbook | dokumentierte Wiederherstellungsreihenfolge und Verantwortlichkeiten | Zuverlässigkeit hängt von letzter tatsächlicher Übung ab |
| Tabletop-Übung | besprochene Durchsprache ohne technische Ausführung | deckt Verantwortlichkeits-/Kommunikationslücken auf |
| Technische DR-Übung | tatsächliche technische Wiederherstellungsausführung | deckt tatsächliche technische Abhängigkeitslücken auf |
| Runbook-Korrektur | Rückführung gemessener Übungsergebnisse in das Runbook | verhindert veraltete, unentdeckte Annahmen |

Implementierung: Runbooks werden mit expliziter Verantwortlichkeit und Wiederherstellungsreihenfolge dokumentiert. Tabletop-Übungen werden regelmäßig, mit geringerem Aufwand, zur Prüfung der Verantwortlichkeitsstruktur durchgeführt. Technische DR-Übungen werden in kontrollierter Umgebung mit begrenztem Risiko regelmäßig durchgeführt, um technische Abhängigkeitsannahmen tatsächlich zu prüfen. Jedes Übungsergebnis wird explizit als Runbook-Korrektur dokumentiert und übernommen.

## Scalability, Reliability, Security und Observability

Disaster Recovery skaliert die tatsächliche Wiederherstellungsfähigkeit proportional zur Regelmäßigkeit und Konsequenz, mit der Übungsergebnisse tatsächlich in korrigierte Runbooks zurückgeführt werden; die Reliability-Grenze liegt darin, dass ein nie tatsächlich geprobtes Runbook mit hoher Wahrscheinlichkeit veraltete oder falsche Annahmen enthält, die erst im echten Ernstfall sichtbar werden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine technische DR-Übung deckt eine im Runbook nicht dokumentierte Abhängigkeit auf | das Runbook wurde seit der letzten Systemänderung nicht aktualisiert | das Runbook explizit um die neu entdeckte Abhängigkeit korrigieren |
| eine Tabletop-Übung zeigt Unklarheit über Verantwortlichkeiten | eine im Runbook genannte Person oder Rolle ist nicht mehr zutreffend | die Verantwortlichkeitszuordnung im Runbook aktualisieren |
| ein Runbook bleibt trotz mehrfacher Übungen mit entdeckten Lücken unverändert | Übungsergebnisse werden nicht konsequent in das Runbook zurückgeführt | einen expliziten Prozess zur Runbook-Korrektur nach jeder Übung etablieren |

Security: Technische DR-Übungen sollten mit begrenztem, kontrolliertem Risiko durchgeführt werden, analog zur bereits in [KB-0583](19-chaos-engineering.md) behandelten Blast-Radius-Begrenzung. Observability: Die tatsächliche Häufigkeit durchgeführter Tabletop- und technischer DR-Übungen sowie der Anteil tatsächlich in Runbooks zurückgeführter Korrekturen sind zentrale Signale zur Bewertung der Disaster-Recovery-Reife einer Organisation.

## Trade-offs und Entscheidungen

**Staff** führt eine Tabletop- oder technische DR-Übung für ein gegebenes Runbook korrekt durch und dokumentiert die Ergebnisse. **Principal** entwirft die vollständige DR-Übungsstrategie (Tabletop und technisch) für eine Organisation mit systematischer Runbook-Korrektur. **Chief** legt unternehmensweite Standards für regelmäßige DR-Übungen fest, die Runbooks nachweislich aktuell halten.

Anti-Patterns: ein Runbook erstellen und nie tatsächlich üben; ausschließlich Tabletop-Übungen durchführen und dadurch technische Abhängigkeitslücken nie tatsächlich aufdecken; Übungsergebnisse dokumentieren, ohne sie tatsächlich als Korrektur in das Runbook zurückzuführen.

## Production Checklist

- [ ] Ein Runbook mit expliziter Verantwortlichkeit und Wiederherstellungsreihenfolge existiert für jedes kritische System.
- [ ] Tabletop-Übungen werden regelmäßig zur Prüfung der Verantwortlichkeitsstruktur durchgeführt.
- [ ] Technische DR-Übungen werden regelmäßig in kontrollierter Umgebung durchgeführt.
- [ ] Jedes Übungsergebnis wird explizit als Runbook-Korrektur dokumentiert und übernommen.

## Interviewfragen

### 1. Warum ist ein Runbook nur so verlässlich wie seine letzte tatsächliche Übung?

**Antwort:** Weil Systemänderungen (neue Abhängigkeiten, geänderte Infrastruktur, ausgetauschte Verantwortlichkeiten) die im Runbook dokumentierten Annahmen veralten lassen können, ohne dass dies dem Runbook selbst anzumerken ist.

### 2. Was ist der Unterschied zwischen einer Tabletop-Übung und einer technischen DR-Übung?

**Antwort:** Eine Tabletop-Übung ist eine besprochene Durchsprache ohne technische Ausführung, die Verantwortlichkeits- und Kommunikationslücken aufdeckt; eine technische DR-Übung ist die tatsächliche technische Ausführung, die tatsächliche technische Abhängigkeitslücken aufdeckt.

### 3. Warum kann eine Tabletop-Übung allein keine falsche technische Abhängigkeitsannahme aufdecken?

**Antwort:** Weil bei einer Tabletop-Übung keine echte technische Ausführung stattfindet, sodass ein tatsächlicher technischer Fehler in der Wiederherstellungsreihenfolge nicht beobachtet werden kann.

### 4. Was ist die zentrale methodische Konsequenz nach einer DR-Übung mit entdeckten Lücken?

**Antwort:** Das Ergebnis muss explizit als Korrektur in eine aktualisierte Version des Runbooks zurückgeführt werden, sonst hat die Übung ihren eigentlichen Zweck verfehlt.

### 5. Wie gehst du vor, wenn eine technische DR-Übung eine im Runbook nicht dokumentierte Abhängigkeit aufdeckt?

**Antwort:** Ich korrigiere das Runbook explizit um die neu entdeckte Abhängigkeit und dokumentiere das Übungsergebnis, damit die Korrektur bei der nächsten Wiederherstellung tatsächlich berücksichtigt wird.

### 6. Widersprüchliche Anforderung: Management will minimale Störung des Produktivbetriebs durch DR-Übungen UND vollständige Sicherheit über die tatsächliche technische Wiederherstellbarkeit — wie gehst du vor?

**Antwort:** Ich würde technische DR-Übungen in einer isolierten, kontrollierten Umgebung mit begrenztem Risiko durchführen, analog zur Blast-Radius-Begrenzung bei Chaos Engineering, und Tabletop-Übungen für häufigere, risikofreie Zwischenprüfungen ergänzend einsetzen, um vollständige Wiederherstellungssicherheit ohne Störung des Produktivbetriebs zu erreichen.

## Praktische Labs

~~~python
# Local, deterministic simulation of a DR exercise uncovering a wrong dependency assumption (executed locally, no real DR system):

def run_dr_exercise(runbook_order, actual_dependencies):
    for i, system in enumerate(runbook_order):
        deps = actual_dependencies.get(system, [])
        for dep in deps:
            if dep not in runbook_order[:i]:
                return {"success": False, "missing_dependency": dep, "before": system}
    return {"success": True}

runbook_order = ["app_service", "database", "reporting_service"]  # wrong: database should come first
actual_dependencies = {"app_service": ["database"], "reporting_service": ["app_service"]}

result = run_dr_exercise(runbook_order, actual_dependencies)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. NIST Special Publication 800-34: [Contingency Planning Guide for Federal Information Systems](https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final), abgerufen 2026-09-18.
2. Google SRE Workbook: [Disaster Recovery Testing](https://sre.google/workbook/disaster-recovery-testing/), abgerufen 2026-09-18.

RTO/RPO-Zielwerte sind kanonisch in [KB-0584](20-rto-und-rpo.md) behandelt; Backup-Wiederherstellungsnachweise in [KB-0585](21-backup-betrieb-und-wiederherstellungsnachweise.md); kontrollierte Übungsmethodik in [KB-0583](19-chaos-engineering.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche DR-Übungsorchestrierung mit automatischer Runbook-Aktualisierung aus Übungsergebnissen | Evaluating | Gegen die bestehende, manuell moderierte Tabletop- und technische Übungspraxis validieren, bevor automatische Runbook-Korrekturen ohne menschliche Überprüfung übernommen werden. |

Ein Team akzeptiert eine Disaster-Recovery-Fähigkeit erst, wenn Runbooks nachweislich regelmäßig durch Tabletop- und technische Übungen geprüft werden und Übungsergebnisse tatsächlich als Korrekturen in die Runbooks zurückgeführt wurden.
