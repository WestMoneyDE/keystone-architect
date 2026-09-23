---
{"id": "KB-0695", "title": "Migrationsstrategie und Cutover", "domain": "30", "sequence": 19, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0694", "concepts": ["Explizite Zwischenzustände", "Stilllegungskriterium"], "needed_for": "Ein Cutover ist der konkrete, technische Übergabemoment innerhalb der in KB-0694 beschriebenen Programmabschnitte"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene Systemmigration Daten-, Traffic- und Verantwortungsübergaben planen und einen Probelauf mit klaren Rollbackgrenzen und Abnahmekriterien durchführen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Migration mehrere Cutover-Strategien (Big-Bang versus schrittweise Verkehrsverlagerung) gegeneinander abwägen und die jeweiligen Rollbackgrenzen explizit definieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein geplanter Cutover keine klare Rollbackgrenze hat, sodass bei einem tatsächlichen Problem unklar bleibt, ob und wie zurückgerollt werden kann.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Cutover-Planung festlegen, die verpflichtende Probeläufe, Rollbackgrenzen und gemeinsam festgelegte Abnahmekriterien vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Implementierung spezifischer Datenmigrationswerkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist die strukturierte Cutover-Planung mit Rollbackgrenzen und Abnahmekriterien, nicht die werkzeugspezifische Datenmigrationsimplementierung."}}, "lab_validation": [{"lab_id": "KB-0695-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung einer Rollbackgrenze bei einem Cutover, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Cutover mit definierter Rollbackgrenze bei einem während des Probelaufs erkannten, kritischen Problem korrekt zurückgerollt wird, während ein Cutover ohne definierte Grenze in einem unklaren Zwischenzustand verharrt.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Migrationsstrategie und Cutover

> **Ziel:** Ein Cutover ist der konkrete, technische Übergabemoment innerhalb eines Modernisierungsprogramms (siehe KB-0694), an dem tatsächlich drei Dinge übergehen: **Daten** (der tatsächliche Datenbestand wird vom Alt- in das Neusystem migriert oder synchronisiert), **Traffic** (tatsächliche Anfragen werden vom Alt- auf das Neusystem umgeleitet) und **Verantwortung** (welches Team ab dem Cutover-Zeitpunkt tatsächlich für den Betrieb verantwortlich ist). Der zentrale Punkt dieses Kapitels ist, dass ein Cutover einen tatsächlich durchgeführten Probelauf, eine explizit definierte Rollbackgrenze (bis zu welchem Zeitpunkt oder unter welchen Bedingungen der Cutover tatsächlich noch rückgängig gemacht werden kann) und gemeinsam festgelegte Abnahmekriterien erfordert — ein Cutover ohne diese Struktur riskiert tatsächlich, bei einem unerwarteten Problem in einem unklaren Zwischenzustand zu verharren, in dem weder ein vollständiger Rollback noch ein tatsächlich erfolgreicher Abschluss möglich ist.

## Zweck, Mental Model und Dependencies

Datenübergabe zu planen bedeutet, tatsächlich zu klären, wie der Datenbestand vom Alt- in das Neusystem gelangt — bei einer einmaligen Migration muss tatsächlich sichergestellt sein, dass während der Migration entstehende, neue Daten nicht verloren gehen; bei einer kontinuierlichen Synchronisation muss tatsächlich geklärt sein, wie Konflikte zwischen parallel im Alt- und Neusystem entstehenden Änderungen behandelt werden. Traffic-Übergabe zu planen bedeutet, tatsächlich zu entscheiden, wie Anfragen vom Alt- auf das Neusystem umgeleitet werden — ein Big-Bang-Cutover leitet tatsächlich den gesamten Traffic auf einmal um, was ein höheres, konzentriertes Risiko birgt, aber eine kurze Übergangsphase ermöglicht, während eine schrittweise Verkehrsverlagerung (etwa zunächst 5%, dann 50%, dann 100% des Traffics) das Risiko tatsächlich über die Zeit verteilt, aber eine längere Phase paralleler Systeme erfordert. Verantwortungsübergabe zu planen bedeutet, tatsächlich explizit festzulegen, ab welchem Zeitpunkt welches Team tatsächlich für den Betrieb verantwortlich ist — eine unklare Verantwortungsübergabe während des Cutovers kann tatsächlich dazu führen, dass bei einem auftretenden Problem beide Teams tatsächlich glauben, das jeweils andere sei zuständig, was die Reaktionszeit tatsächlich verzögert. Ein Probelauf vor dem tatsächlichen Cutover bedeutet, den Migrationsprozess tatsächlich unter möglichst realistischen Bedingungen zu testen, bevor er tatsächlich produktiv ausgeführt wird — dieser Probelauf deckt tatsächliche, unerwartete Probleme (etwa eine unerwartet lange Migrationsdauer bei tatsächlichem Datenvolumen) auf, bevor sie tatsächlich während des echten Cutovers zu einem kritischen Problem werden. Eine Rollbackgrenze explizit zu definieren bedeutet, tatsächlich vorab festzulegen, bis zu welchem Zeitpunkt oder unter welchen Bedingungen ein begonnener Cutover tatsächlich noch zurückgerollt werden kann — nach dieser Grenze (etwa weil das Altsystem bereits tatsächlich abgeschaltet wurde, oder weil im Neusystem bereits tatsächlich neue, im Altsystem nicht mehr abbildbare Daten entstanden sind) ist ein Rollback tatsächlich nicht mehr oder nur mit erheblichem, zusätzlichem Aufwand möglich; diese Grenze muss vor Beginn des Cutovers tatsächlich allen Beteiligten bekannt sein. Gemeinsam festgelegte Abnahmekriterien bedeuten, dass vor dem Cutover tatsächlich definiert wird, anhand welcher konkreten, überprüfbaren Kriterien der Cutover als tatsächlich erfolgreich gilt — ohne diese Kriterien bleibt tatsächlich unklar, wann der Cutover als abgeschlossen betrachtet werden kann, was zu einer verlängerten Unsicherheitsphase führt.

~~~text
Cutover = concrete, technical handover moment within a modernization program (see
  KB-0694) where 3 things ACTUALLY transition
  DATA: ACTUAL data set migrated/synced from old to new system
  TRAFFIC: ACTUAL requests redirected from old to new system
  RESPONSIBILITY: which team ACTUALLY responsible for operations from cutover point on
KEY POINT: cutover requires ACTUALLY conducted dry run, explicitly defined ROLLBACK
  BOUNDARY (up to what point/under what conditions cutover CAN ACTUALLY still be
  reversed), jointly fixed acceptance criteria -- cutover w/o this structure ACTUALLY
  risks getting stuck in unclear intermediate state on unexpected problem, where neither
  full rollback nor ACTUALLY successful completion possible
PLANNING DATA HANDOVER means ACTUALLY clarifying how data set gets from old to new
  system -- one-time migration must ACTUALLY ensure new data arising during migration
  isn't lost; continuous sync must ACTUALLY clarify how conflicts between parallel
  changes in old+new system handled
PLANNING TRAFFIC HANDOVER means ACTUALLY deciding how requests redirected from old to
  new system -- big-bang cutover ACTUALLY redirects all traffic at once, higher
  concentrated risk but short transition phase; gradual traffic shift (5%, then 50%,
  then 100%) ACTUALLY spreads risk over time but requires longer parallel-systems phase
PLANNING RESPONSIBILITY HANDOVER means ACTUALLY explicitly fixing from what point which
  team ACTUALLY responsible for operations -- unclear responsibility handover during
  cutover CAN ACTUALLY lead both teams to ACTUALLY believe the other is responsible on
  an arising problem, ACTUALLY delaying response time
DRY RUN before ACTUAL cutover means ACTUALLY testing migration process under as-
  realistic-as-possible conditions before ACTUALLY executed in production -- uncovers
  ACTUAL, unexpected problems (unexpectedly long migration duration at ACTUAL data
  volume) before they ACTUALLY become a critical problem during real cutover
EXPLICITLY DEFINING ROLLBACK BOUNDARY means ACTUALLY fixing in advance up to what point/
  under what conditions a begun cutover CAN ACTUALLY still be rolled back -- past this
  boundary (old system ACTUALLY already shut down, or new data ACTUALLY already arose
  in new system not representable in old system) rollback ACTUALLY no longer possible or
  only w/ substantial, additional effort -- boundary must ACTUALLY be known to all
  involved before cutover begins
JOINTLY FIXED ACCEPTANCE CRITERIA mean before cutover ACTUALLY defining by what
  concrete, checkable criteria cutover counts as ACTUALLY successful -- w/o these
  criteria, ACTUALLY unclear when cutover can be considered complete, leading to
  extended uncertainty phase
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Datenübergabestrategie (Einmalmigration vs. Synchronisation) | klärt Konfliktbehandlung bei parallelen Änderungen | verhindert Datenverlust während Übergangsphase |
| Traffic-Übergabestrategie (Big-Bang vs. schrittweise) | balanciert Übergangsdauer gegen konzentriertes Risiko | Wahl abhängig von Risikotoleranz und Systemkritikalität |
| Explizite Verantwortungsübergabe | klärt Betriebsverantwortung ab konkretem Zeitpunkt | verhindert Verzögerung bei Problemreaktion durch Unklarheit |
| Tatsächlich durchgeführter Probelauf | deckt unerwartete Probleme vor Produktivausführung auf | verhindert, dass Probleme erst beim echten Cutover auftreten |
| Explizite Rollbackgrenze | definiert Punkt ohne oder mit erheblichem Rückrollaufwand | muss allen Beteiligten vor Cutover-Beginn bekannt sein |
| Gemeinsam festgelegte Abnahmekriterien | definiert konkreten Erfolgsnachweis | verhindert verlängerte Unsicherheitsphase |

Implementierung: Vor dem Cutover wird ein realistischer Probelauf durchgeführt. Eine explizite Rollbackgrenze wird vorab dokumentiert und allen Beteiligten kommuniziert. Abnahmekriterien werden gemeinsam mit den betroffenen Teams vor dem Cutover festgelegt.

## Scalability, Reliability, Security und Observability

Eine Migrations- und Cutover-Praxis skaliert über die Anzahl parallel geplanter Migrationen; die Reliability-Grenze liegt darin, dass ein Cutover ohne definierte Rollbackgrenze bei einem tatsächlichen Problem in einem unklaren, nicht behebbaren Zwischenzustand verharren kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Cutover verharrt bei einem Problem in einem unklaren Zwischenzustand | keine explizite Rollbackgrenze wurde vorab definiert und kommuniziert | für künftige Cutover eine explizite, vorab kommunizierte Rollbackgrenze festlegen |
| ein während des Cutovers auftretendes Problem wird verzögert adressiert | die Verantwortungsübergabe zwischen den Teams war nicht klar definiert | eine explizite, zeitpunktgenaue Verantwortungsübergabe für künftige Cutover festlegen |
| ein Cutover-Problem tritt erst in der Produktion auf, obwohl es vermeidbar gewesen wäre | kein realistischer Probelauf wurde vor dem tatsächlichen Cutover durchgeführt | einen realistischen Probelauf unter produktionsnahen Bedingungen vor künftigen Cutover-Vorhaben verpflichtend durchführen |

Security: Während der Traffic-Übergabe sollten Zugriffskontrollen konsistent zwischen Alt- und Neusystem gelten, um keine Sicherheitslücke im Übergangszeitraum zu erzeugen. Observability: Die tatsächliche Dauer bis zur Erfüllung aller Abnahmekriterien nach einem Cutover ist ein zentrales Signal zur Bewertung der Cutover-Planungsqualität.

## Trade-offs und Entscheidungen

**Staff** führt einen Probelauf für einen begrenzten Migrationsabschnitt durch. **Principal** entwirft die vollständige Cutover-Strategie mit Rollbackgrenze und Abnahmekriterien für eine komplexe Migration. **Chief** legt unternehmensweite Standards für Cutover-Planung fest, die verpflichtende Probeläufe und Rollbackgrenzen vorschreiben.

Anti-Patterns: einen Cutover ohne vorherigen, realistischen Probelauf durchführen; keine explizite Rollbackgrenze definieren; Abnahmekriterien erst nach dem Cutover statt vorab gemeinsam festlegen.

## Production Checklist

- [ ] Ein realistischer Probelauf wurde vor dem tatsächlichen Cutover durchgeführt.
- [ ] Eine explizite Rollbackgrenze ist definiert und allen Beteiligten kommuniziert.
- [ ] Abnahmekriterien sind vor dem Cutover gemeinsam festgelegt.
- [ ] Die Verantwortungsübergabe zwischen den Teams ist zeitpunktgenau definiert.

## Interviewfragen

### 1. Welche drei Dinge gehen bei einem Cutover tatsächlich über?

**Antwort:** Daten (Migration/Synchronisation), Traffic (Umleitung von Anfragen) und Verantwortung (Betriebszuständigkeit).

### 2. Warum ist eine explizite Rollbackgrenze vor einem Cutover notwendig?

**Antwort:** Weil nach dieser Grenze ein Rollback nicht mehr oder nur mit erheblichem, zusätzlichem Aufwand möglich ist, und alle Beteiligten diese Grenze vorab kennen müssen, um bei einem Problem korrekt zu reagieren.

### 3. Was ist der Unterschied zwischen einem Big-Bang-Cutover und einer schrittweisen Traffic-Verlagerung?

**Antwort:** Ein Big-Bang-Cutover leitet den gesamten Traffic auf einmal um mit höherem, konzentriertem Risiko aber kurzer Übergangsphase, während eine schrittweise Verlagerung das Risiko über die Zeit verteilt, aber eine längere Phase paralleler Systeme erfordert.

### 4. Warum ist ein Probelauf vor dem tatsächlichen Cutover wichtig?

**Antwort:** Weil er tatsächliche, unerwartete Probleme unter realistischen Bedingungen aufdeckt, bevor sie während des echten Cutovers zu einem kritischen Problem werden.

### 5. Wie gehst du vor, wenn ein Cutover bei einem Problem in einem unklaren Zwischenzustand verharrt?

**Antwort:** Ich prüfe, ob eine explizite Rollbackgrenze vorab definiert und kommuniziert war, und lege für künftige Cutover eine solche Grenze verbindlich fest.

### 6. Widersprüchliche Anforderung: Das Geschäftsteam will minimale Ausfallzeit durch einen schnellen Big-Bang-Cutover UND die Organisation will minimales Risiko durch eine schrittweise, über Wochen verteilte Verkehrsverlagerung — wie gehst du vor?

**Antwort:** Ich würde eine schrittweise Verkehrsverlagerung mit kurzen, klar definierten Zwischenschritten wählen, sodass das Risiko begrenzt bleibt, ohne die Übergangsphase unnötig über Wochen zu strecken, statt entweder das volle Big-Bang-Risiko oder eine unnötig lange Übergangsphase zu akzeptieren.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Team plant den Cutover einer Order-Service-Datenbank (angelehnt an Domain 29, Commerce Integration) auf eine neue Infrastruktur. Ein Probelauf zeigt, dass die Migration bei tatsächlichem Produktionsdatenvolumen deutlich länger dauert als ursprünglich angenommen.

~~~python
# Local, deterministic illustration of a rollback boundary decision based on dry-run findings (fictional lab example, no real system):

def evaluate_cutover_readiness(dry_run_duration_minutes, max_acceptable_downtime_minutes, rollback_boundary_minutes):
    if dry_run_duration_minutes > max_acceptable_downtime_minutes:
        if dry_run_duration_minutes <= rollback_boundary_minutes:
            return "proceed with caution: within rollback boundary, but exceeds target downtime"
        return "do not proceed: exceeds rollback boundary, revise strategy"
    return "proceed: within acceptable parameters"

result = evaluate_cutover_readiness(dry_run_duration_minutes=45, max_acceptable_downtime_minutes=30, rollback_boundary_minutes=60)
print(result)
~~~

Erwartete Beobachtung: Der Probelauf zeigt eine Migrationsdauer, die die ursprünglich akzeptierte Ausfallzeit überschreitet, aber noch innerhalb der Rollbackgrenze liegt. Auswertung: Ohne diesen Probelauf hätte das Team den tatsächlichen Cutover möglicherweise ohne diese wichtige Erkenntnis begonnen und wäre während der Produktionsmigration von der unerwartet langen Dauer überrascht worden.

## Dependencies, Cross-References und Quellen

1. Amazon Web Services: [AWS Prescriptive Guidance — Migration Strategies (6 Rs) and Cutover Planning](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-database-migration/), abgerufen 2026-09-18.
2. Google Cloud: [Database Migration — Cutover Best Practices](https://cloud.google.com/architecture/database-migration-concepts-principles-part-1), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0694 (Modernisierungsprogramme leiten) beschriebenen Zwischenzustände auf den konkreten, technischen Cutover-Moment.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Datenreplikations- und Konfliktlösungswerkzeuge zur Verkürzung notwendiger Parallelbetriebsphasen bei schrittweisen Cutover-Strategien | Growing Adoption | Bei künftigen, umfangreichen Migrationen evaluieren, jedoch die Konfliktlösungslogik vor Produktivsetzung durch einen realistischen Probelauf verifizieren. |

Ein Team akzeptiert einen Cutover erst als abgeschlossen, wenn alle vorab gemeinsam festgelegten Abnahmekriterien nachweislich erfüllt sind und ein Probelauf sowie eine dokumentierte Rollbackgrenze vorlagen.
