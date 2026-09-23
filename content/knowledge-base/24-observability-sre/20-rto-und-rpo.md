---
{"id": "KB-0584", "title": "RTO und RPO", "domain": "24", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0565", "concepts": ["SLI, SLO und SLA"], "needed_for": "understanding"}, {"id": "KB-0580", "concepts": ["SRE Incident Response"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "RTO- und RPO-Ziele für ein konkretes System anhand offizieller Referenzen korrekt definieren und in einer Wiederanlaufübung gegen die tatsächlich erreichte Wiederherstellungszeit und den tatsächlichen Datenverlust messen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes System explizit gestalten, wie Geschäftsabhängigkeiten die Wiederherstellungsreihenfolge bestimmen und wie Messbeginn-Definitionen konsistent für überprüfbare RTO/RPO-Ziele festgelegt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein formal vereinbartes RTO/RPO-Ziel in einer Wiederanlaufübung tatsächlich nicht erreicht wird, und die Ursache auf eine falsche Messbeginn-Annahme oder eine unzureichend geplante Wiederherstellungsreihenfolge zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für RTO/RPO-Definition und regelmäßige Wiederanlaufübungen festlegen, die formal vereinbarte Ziele nachweislich gegen tatsächlich erreichte Werte validieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Implementierung spezifischer Backup- und Replikationsmechanismen ist in den jeweiligen Cloud- und Datenbank-Domains vertieft.", "rationale": "Kern ist die Übersetzung von Wiederanlaufzeit und zulässigem Datenverlust in überprüfbare, gemessene Ziele, nicht die technische Implementierung einzelner Backup-Mechanismen."}}, "lab_validation": [{"lab_id": "KB-0584-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer Wiederanlaufübung mit Messbeginn-Diskrepanz, kein produktives Wiederherstellungssystem verwendet", "evidence": "Ein lokales Skript simuliert, wie ein RTO-Ziel formal erreicht erscheint, wenn der Messbeginn ab dem Start der technischen Wiederherstellung statt ab dem tatsächlichen Ausfallzeitpunkt gerechnet wird, und zeigt damit, wie eine inkonsistente Messbeginn-Definition ein RTO-Ziel fälschlich als erreicht ausweisen kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Wiederherstellungssystem."}]}
---
# RTO und RPO

> **Ziel:** RTO (Recovery Time Objective, maximal zulässige Wiederanlaufzeit) und RPO (Recovery Point Objective, maximal zulässiger Datenverlust) konkretisieren abstrakte Verfügbarkeits- und Datensicherheitsanforderungen (verwandt mit den bereits in [KB-0565](01-sli-slo-und-sla.md) behandelten SLO-Zielwerten) in überprüfbare, messbare Ziele. Der zentrale Punkt dieses Kapitels ist, dass diese Ziele nur dann tatsächlich belastbar sind, wenn drei Aspekte präzise definiert werden: der **Messbeginn** (ab wann die Wiederanlaufzeit tatsächlich zu zählen beginnt — ab dem Ausfallzeitpunkt oder erst ab dem Start der technischen Wiederherstellungsmaßnahme), die **Geschäftsabhängigkeiten** (welche Systeme in welcher Reihenfolge wiederhergestellt werden müssen, damit ein Geschäftsprozess tatsächlich wieder funktioniert), und die **tatsächliche Messung in Wiederanlaufübungen** — ein formal vereinbartes RTO/RPO-Ziel, das nie in einer echten Übung gemessen wurde, ist eine unbelegte Annahme, keine verifizierte Fähigkeit.

## Zweck, Mental Model und Dependencies

Der Messbeginn ist eine häufig übersehene, aber entscheidende Definitionsfrage: Wird die Wiederanlaufzeit ab dem tatsächlichen Ausfallzeitpunkt gerechnet (der oft erst mit Verzögerung erkannt wird, siehe die bereits in [KB-0580](16-sre-incident-response.md) behandelte Triage) oder erst ab dem Start der technischen Wiederherstellungsmaßnahme (nachdem Erkennung, Eskalation und Entscheidungsfindung bereits Zeit verbraucht haben)? Diese beiden Definitionen können zu erheblich unterschiedlichen, tatsächlich erlebten Ausfallzeiten führen, selbst wenn dieselbe technische Wiederherstellungsmaßnahme in derselben Zeit abgeschlossen wird — ein RTO-Ziel, das nur die reine technische Wiederherstellungszeit misst, kann formal erreicht erscheinen, während Nutzer tatsächlich eine deutlich längere Gesamtausfallzeit (inklusive Erkennung und Entscheidungsfindung) erleben. Geschäftsabhängigkeiten bestimmen die notwendige Wiederherstellungsreihenfolge: Ein Geschäftsprozess ist oft von mehreren, voneinander abhängigen technischen Systemen abhängig (etwa eine Datenbank, die vor dem Anwendungsdienst wiederhergestellt sein muss, der wiederum vor einem abhängigen Reporting-Dienst wiederhergestellt sein muss) — ein RTO-Ziel für den gesamten Geschäftsprozess ist nur erreichbar, wenn diese Reihenfolge explizit geplant und in der tatsächlichen Wiederherstellungspraxis eingehalten wird, nicht wenn jedes einzelne System isoliert und ohne Berücksichtigung der Abhängigkeitsreihenfolge wiederhergestellt wird. Die entscheidende methodische Konsequenz ist, dass RTO/RPO-Ziele regelmäßig in tatsächlichen Wiederanlaufübungen gemessen werden müssen: Eine formal vereinbarte Zahl in einem Dokument beweist nicht, dass diese Zahl tatsächlich erreichbar ist — nur eine durchgeführte, gemessene Übung zeigt, ob die tatsächliche Wiederherstellungszeit und der tatsächliche Datenverlust dem vereinbarten Ziel entsprechen oder ob eine bislang unentdeckte Lücke (etwa eine fehlende Dokumentation, ein nicht getesteter Backup-Wiederherstellungspfad, eine falsch angenommene Abhängigkeitsreihenfolge) besteht.

~~~text
RTO (Recovery Time Objective, max acceptable recovery time) + RPO (Recovery Point Objective, max acceptable data loss)
  concretize abstract availability/data-safety requirements (related to SLO from KB-0565) into MEASURABLE, verifiable targets
KEY POINT: only actually reliable when THREE aspects precisely defined:
  MEASUREMENT START: when does recovery time actually START counting
    from actual failure moment (often detected with delay, triage from KB-0580)
    OR only from start of technical recovery action (after detection+escalation+decision already consumed time)?
    these two definitions -> significantly different ACTUALLY-experienced outage durations
      even if same technical recovery action completes in same time
    RTO measuring only pure technical recovery time -> can appear formally met
      while users actually experience much longer TOTAL outage (incl. detection+decision time)
  BUSINESS DEPENDENCIES: determine necessary recovery ORDER
    business process often depends on multiple, INTERDEPENDENT technical systems
      (e.g. database must recover before app service, which must recover before dependent reporting service)
    RTO target for whole business process only achievable if this order is EXPLICITLY planned
      and followed in actual recovery practice
      NOT if each system recovered in isolation, ignoring dependency order
  ACTUAL MEASUREMENT IN RECOVERY DRILLS: RTO/RPO targets must be REGULARLY measured in actual drills
    formally agreed number in a document does NOT prove it's actually achievable
    only a conducted, measured drill shows whether actual recovery time/data loss matches agreed target
      or an undiscovered gap exists (missing docs, untested backup restore path, wrong assumed dependency order)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Messbeginn-Definition | legt fest, ab wann RTO gezählt wird | entscheidet über tatsächlich erlebte vs. gemessene Ausfallzeit |
| Geschäftsabhängigkeiten | bestimmt notwendige Wiederherstellungsreihenfolge | RTO für Gesamtprozess nur bei korrekter Reihenfolge erreichbar |
| RPO | begrenzt maximal zulässigen Datenverlust | bestimmt notwendige Backup-/Replikationsfrequenz |
| Wiederanlaufübung | misst tatsächlich erreichte Werte gegen vereinbarte Ziele | einzige Validierung, dass Ziele tatsächlich erreichbar sind |

Implementierung: Der Messbeginn für RTO wird explizit als "ab tatsächlichem Ausfallzeitpunkt" definiert, nicht als "ab Start der technischen Wiederherstellung". Die Wiederherstellungsreihenfolge für abhängige Systeme wird vorab dokumentiert und in Übungen geprobt. RTO/RPO-Ziele werden regelmäßig in tatsächlichen Wiederanlaufübungen gemessen, deren Ergebnisse mit den vereinbarten Zielen verglichen werden.

## Scalability, Reliability, Security und Observability

RTO/RPO-Ziele skalieren die tatsächliche Wiederherstellungsfähigkeit proportional zur Präzision der Messbeginn-Definition und der Planung der Wiederherstellungsreihenfolge; die Reliability-Grenze liegt darin, dass ein formal vereinbartes, aber nie tatsächlich gemessenes Ziel keine verlässliche Aussage über die tatsächliche Wiederherstellungsfähigkeit im Ernstfall erlaubt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Wiederanlaufübung zeigt eine deutlich längere Ausfallzeit als das vereinbarte RTO-Ziel | der Messbeginn wurde inkonsistent definiert oder die Wiederherstellungsreihenfolge war nicht korrekt geplant | die Messbeginn-Definition und die tatsächliche Reihenfolge der Wiederherstellungsschritte überprüfen |
| ein Geschäftsprozess bleibt trotz formal wiederhergestellter Einzelsysteme gestört | die Wiederherstellungsreihenfolge hat die tatsächlichen Geschäftsabhängigkeiten nicht berücksichtigt | die Abhängigkeitsreihenfolge explizit dokumentieren und in der nächsten Übung testen |
| ein RTO/RPO-Ziel gilt als erfüllt, obwohl es nie in einer echten Übung gemessen wurde | die Zielvereinbarung wurde nie durch eine tatsächliche Wiederanlaufübung validiert | eine reale Wiederanlaufübung planen und die tatsächlich erreichten Werte dokumentieren |

Security: Wiederanlaufübungen sollten kontrolliert und mit begrenztem Blast Radius durchgeführt werden (siehe die bereits in [KB-0583](19-chaos-engineering.md) behandelten Chaos-Engineering-Prinzipien), um nicht selbst einen echten Vorfall auszulösen. Observability: Die tatsächliche, in Übungen gemessene RTO/RPO-Erreichung über die Zeit ist ein zentrales Signal zur Bewertung, ob die Wiederherstellungsfähigkeit einer Organisation tatsächlich belastbar ist.

## Trade-offs und Entscheidungen

**Staff** definiert RTO/RPO-Ziele für ein gegebenes System korrekt und führt eine Wiederanlaufübung durch. **Principal** entwirft die vollständige Wiederherstellungsreihenfolge und Messbeginn-Definition für ein System mit mehreren Geschäftsabhängigkeiten. **Chief** legt unternehmensweite Standards für RTO/RPO-Definition und regelmäßige Wiederanlaufübungen fest.

Anti-Patterns: RTO ausschließlich ab Start der technischen Wiederherstellung statt ab tatsächlichem Ausfallzeitpunkt messen; ein RTO-Ziel für einen Geschäftsprozess ohne explizite Planung der Wiederherstellungsreihenfolge abhängiger Systeme vereinbaren; ein formal vereinbartes RTO/RPO-Ziel als erreicht betrachten, ohne es jemals in einer echten Übung gemessen zu haben.

## Production Checklist

- [ ] Der Messbeginn für RTO ist explizit als "ab tatsächlichem Ausfallzeitpunkt" definiert.
- [ ] Die Wiederherstellungsreihenfolge für abhängige Systeme ist dokumentiert und geprobt.
- [ ] RTO/RPO-Ziele werden regelmäßig in tatsächlichen Wiederanlaufübungen gemessen.
- [ ] Wiederanlaufübungen werden kontrolliert mit begrenztem Blast Radius durchgeführt.

## Interviewfragen

### 1. Warum ist die Definition des Messbeginns für ein RTO-Ziel entscheidend?

**Antwort:** Weil ein RTO, das erst ab Start der technischen Wiederherstellung gemessen wird, formal erreicht erscheinen kann, während Nutzer tatsächlich eine deutlich längere Gesamtausfallzeit inklusive Erkennung und Entscheidungsfindung erleben.

### 2. Wofür sind Geschäftsabhängigkeiten bei der RTO-Planung relevant?

**Antwort:** Sie bestimmen die notwendige Wiederherstellungsreihenfolge abhängiger Systeme, ohne die ein RTO-Ziel für den gesamten Geschäftsprozess nicht erreichbar ist.

### 3. Warum reicht eine formal vereinbarte RTO/RPO-Zahl allein nicht aus?

**Antwort:** Weil sie eine unbelegte Annahme bleibt, bis sie tatsächlich in einer echten Wiederanlaufübung gemessen und validiert wurde.

### 4. Was misst RPO im Unterschied zu RTO?

**Antwort:** RPO misst den maximal zulässigen Datenverlust, während RTO die maximal zulässige Wiederanlaufzeit misst.

### 5. Wie gehst du vor, wenn eine Wiederanlaufübung eine deutlich längere Ausfallzeit als das vereinbarte RTO-Ziel zeigt?

**Antwort:** Ich prüfe zuerst, ob die Messbeginn-Definition konsistent angewendet wurde, und anschließend, ob die Wiederherstellungsreihenfolge der abhängigen Systeme korrekt geplant war.

### 6. Widersprüchliche Anforderung: Geschäftsführung will ein sehr niedriges RTO-Ziel UND minimale Investition in Backup-/Replikationsinfrastruktur — wie gehst du vor?

**Antwort:** Ich würde die tatsächlich mit der vorhandenen Infrastruktur erreichbare Wiederanlaufzeit in einer echten Übung messen und diese belegte Zahl der Geschäftsführung als Entscheidungsgrundlage vorlegen, statt ein unbelegtes, niedriges RTO-Ziel formal zu vereinbaren, das ohne zusätzliche Investition tatsächlich nicht erreichbar ist.

## Praktische Labs

~~~python
# Local, deterministic simulation of measurement-start discrepancy in RTO calculation (executed locally, no real recovery system):

def calculate_rto(failure_time, detection_time, recovery_start_time, recovery_end_time):
    rto_from_failure = recovery_end_time - failure_time
    rto_from_recovery_start = recovery_end_time - recovery_start_time
    return {"rto_from_actual_failure": rto_from_failure, "rto_from_recovery_start_only": rto_from_recovery_start}

result = calculate_rto(failure_time=0, detection_time=12, recovery_start_time=18, recovery_end_time=30)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS Well-Architected Framework: [Disaster Recovery of Workloads on AWS: RTO and RPO](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Disaster Recovery Planning Guide](https://cloud.google.com/architecture/dr-scenarios-planning-guide), abgerufen 2026-09-18.

SLI/SLO-Grundlagen sind kanonisch in [KB-0565](01-sli-slo-und-sla.md) behandelt; kontrollierte Übungspraxis in [KB-0583](19-chaos-engineering.md); Incident-Erkennung und Triage in [KB-0580](16-sre-incident-response.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, regelmäßig geplante Wiederanlaufübungen mit automatischer Messbeginn-Erfassung statt manuell geplanter Einzelübungen | Evaluating | Vor flächendeckender Automatisierung gegen die bestehende, manuell durchgeführte Übungspraxis hinsichtlich Vollständigkeit der Abhängigkeitsabdeckung validieren. |

Ein Team akzeptiert RTO/RPO-Ziele erst, wenn Messbeginn und Wiederherstellungsreihenfolge präzise definiert sind und die Ziele nachweislich in tatsächlichen Wiederanlaufübungen gemessen wurden, statt eine unbelegte, formal vereinbarte Zahl als ausreichend zu betrachten.
