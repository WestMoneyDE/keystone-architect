---
{"id": "KB-0514", "title": "Branching und Integrationsmodelle", "domain": "22", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0513", "concepts": ["Git und nachvollziehbare Änderungen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Trunk-Based Development und langlebige Branch-Modelle anhand konkreter Teamabläufe korrekt einsetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes Team explizit entscheiden, ob Trunk-Based Development oder ein Modell mit langlebigen Branches der tatsächlichen Integrationshäufigkeit, Review-Kapazität und dem Releasebedarf entspricht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Wiederkehrende, aufwendige Merge-Konflikte auf ein Branching-Modell zurückführen können, dessen Integrationshäufigkeit nicht zur tatsächlichen Teamarbeitsweise passt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Branching-Standards anhand der tatsächlichen Team-Größe, Review-Kapazität und Release-Kadenz statt einer pauschalen Präferenz für ein einzelnes Modell festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailkonfiguration spezifischer Feature-Flag-Systeme zur Unterstützung von Trunk-Based Development im Detail ist Vertiefung.", "rationale": "Kern ist die Abwägung zwischen Integrationsmodellen anhand tatsächlicher Teamabläufe, nicht die Feature-Flag-Interna."}}, "lab_validation": [{"lab_id": "KB-0514-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Integrationskonflikt-Wahrscheinlichkeit bei unterschiedlicher Branch-Lebensdauer, kein produktives Repository verwendet", "evidence": "Ein lokales Skript simuliert, wie die Wahrscheinlichkeit und Größe von Merge-Konflikten mit der Lebensdauer eines Branches (Zeit seit Abzweigung vom Hauptzweig) korreliert, und zeigt, warum häufige Integration mit kurzlebigen Branches typischerweise kleinere, leichter auflösbare Konflikte erzeugt als seltene Integration mit langlebigen Branches.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Team-Repository mit tatsächlicher Entwicklungsdynamik."}]}
---
# Branching und Integrationsmodelle

> **Ziel:** Trunk-Based Development integriert Änderungen sehr häufig (typischerweise mindestens täglich) direkt in einen einzigen Hauptzweig, mit kurzlebigen Feature-Branches (wenn überhaupt) und Feature Flags zur Steuerung unfertiger Funktionalität in Produktion. Modelle mit langlebigen Branches (z. B. GitFlow-artige Ansätze mit separaten Develop-, Feature- und Release-Branches) verzögern die Integration bis eine Funktionalität vollständig fertiggestellt ist, was isoliertes Arbeiten ermöglicht, aber die Integrationskomplexität auf einen späteren Zeitpunkt verschiebt. Der zentrale Punkt dieses Kapitels ist, dass wiederkehrende, aufwendige Merge-Konflikte typischerweise nicht auf Git selbst zurückzuführen sind, sondern auf ein Branching-Modell, dessen Integrationshäufigkeit nicht zur tatsächlichen Teamarbeitsweise passt — ein Team mit hoher Entwicklungsgeschwindigkeit und häufigen, überlappenden Änderungen an denselben Codebereichen erzeugt bei langlebigen Branches exponentiell wachsende Konfliktkomplexität, während ein Team mit klar abgegrenzten, selten überlappenden Arbeitsbereichen von häufiger Integration möglicherweise wenig zusätzlichen Nutzen hat.

## Zweck, Mental Model und Dependencies

Trunk-Based Development basiert auf der Beobachtung, dass die Größe und Komplexität eines Merge-Konflikts typischerweise proportional zur Zeit wächst, die zwischen der Abzweigung eines Branches und seiner Integration in den Hauptzweig vergeht — je länger ein Branch isoliert existiert, desto mehr divergiert er vom sich weiterentwickelnden Hauptzweig, und desto größer und komplexer wird der eventuelle Integrationskonflikt. Durch sehr häufige Integration (mindestens täglich, oft mehrmals täglich) bleiben Divergenzen klein und Konflikte entsprechend überschaubar und leicht auflösbar. Da nicht jede Änderung sofort vollständig fertiggestellt und produktionsreif ist, nutzt Trunk-Based Development typischerweise Feature Flags — Code wird in den Hauptzweig integriert, aber die neue Funktionalität bleibt hinter einem Flag deaktiviert, bis sie vollständig fertig ist, was die Integration von der Aktivierung entkoppelt. Modelle mit langlebigen Branches (etwa ein Feature-Branch, der über mehrere Wochen isoliert entwickelt wird) ermöglichen ungestörtes, isoliertes Arbeiten an einer größeren Funktionalität, verschieben aber die Integrationskomplexität auf den Zeitpunkt des eventuellen Merges, wenn die Divergenz zwischen Branch und Hauptzweig bereits erheblich sein kann — dies kann sinnvoll sein, wenn Änderungen tatsächlich isoliert von anderer Teamarbeit sind (unterschiedliche, nicht überlappende Codebereiche) oder wenn ein Team eine geringe Integrationsfrequenz aus organisatorischen Gründen (z. B. sehr kleines Team, seltene, große Releases) bevorzugt. Die Entscheidung zwischen diesen Modellen sollte daher explizit anhand der tatsächlichen Überlappung der Teamarbeit, der Review-Kapazität (kann das Team die durch häufige Integration entstehende höhere Review-Frequenz tatsächlich bewältigen?) und des Releasebedarfs (erfordert die Anwendung kontinuierliche Bereitstellung oder seltene, kuratierte Releases?) getroffen werden.

~~~text
Trunk-Based Development: integrate VERY frequently (daily+) directly into main trunk
  short-lived feature branches (if any) + FEATURE FLAGS control unfinished functionality in prod
  -> conflict size/complexity grows PROPORTIONALLY to time-since-branch-divergence
  -> frequent integration = small divergence = small, easily resolvable conflicts
Long-lived branch models (GitFlow-style: develop/feature/release branches):
  isolated, undisturbed work on larger functionality
  -> integration complexity DEFERRED to eventual merge time, when divergence may be SIGNIFICANT already
  -> can make sense: truly isolated (non-overlapping) work, or org reasons (small team, rare large releases)
DECISION CRITERION -- explicit, not pauschal preference:
  1. actual overlap of team's concurrent work (overlapping code areas?)
  2. review capacity (can team actually handle HIGHER review frequency from frequent integration?)
  3. release cadence need (continuous delivery vs rare curated releases?)
RECURRING, EXPENSIVE merge conflicts usually != Git problem
  -> usually = branching model's integration frequency MISMATCHED to actual team work pattern
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Trunk-Based Development | sehr häufige Integration, kleine Divergenz | eignet sich für hohe Änderungsüberlappung, hohe Review-Kapazität |
| Feature Flags | entkoppeln Integration von Aktivierung | ermöglichen Integration unfertiger Funktionalität |
| Langlebige Branches | isoliertes Arbeiten, verzögerte Integration | eignet sich für tatsächlich isolierte Arbeitsbereiche |
| Konfliktgröße versus Branch-Lebensdauer | Konfliktkomplexität wächst mit Divergenzzeit | zentrales Entscheidungskriterium |

Implementierung: Für jedes Team wird explizit geprüft, wie stark die tatsächliche Arbeit verschiedener Teammitglieder in denselben Codebereichen überlappt, bevor ein Branching-Modell gewählt wird. Bei Trunk-Based Development werden Feature Flags konsequent genutzt, um unfertige Funktionalität von der Integration zu entkoppeln. Die Review-Kapazität des Teams wird gegen die durch das gewählte Modell tatsächlich entstehende Review-Frequenz geprüft, statt ein Modell unabhängig von der tatsächlichen Kapazität zu wählen.

## Scalability, Reliability, Security und Observability

Branching-Modelle skalieren die Integrationskomplexität proportional zur Passung zwischen Integrationshäufigkeit und tatsächlicher Arbeitsüberlappung; die Reliability-Grenze liegt darin, dass ein Mismatch zwischen gewähltem Modell und tatsächlicher Teamarbeitsweise proportional zur Überlappung zu wachsenden, schwer auflösbaren Konflikten führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Merge-Konflikte werden wiederkehrend groß und aufwendig | das Team nutzt langlebige Branches trotz hoher Überlappung der Arbeit an denselben Codebereichen | einen Wechsel zu häufigerer Integration oder Trunk-Based Development evaluieren |
| Reviews werden zur Belastung und verzögern die Entwicklung | das Team hat auf Trunk-Based Development mit hoher Integrationsfrequenz gewechselt, ohne die Review-Kapazität entsprechend anzupassen | die Review-Kapazität gegen die tatsächliche Integrationsfrequenz prüfen, ggf. Review-Prozess anpassen |
| unfertige Funktionalität gelangt unbeabsichtigt in Produktion | Feature Flags fehlen oder sind unvollständig für in den Hauptzweig integrierten, unfertigen Code konfiguriert | prüfen, ob jede unfertige Funktionalität konsequent hinter einem Feature Flag liegt |

Security: Feature Flags, die sicherheitsrelevante Funktionalität steuern, sollten mit besonderer Sorgfalt verwaltet werden, um versehentliche Aktivierung unvollständig geprüfter, sicherheitskritischer Funktionalität zu vermeiden. Observability: Die durchschnittliche Branch-Lebensdauer, die Häufigkeit und Größe von Merge-Konflikten, und die Review-Durchlaufzeit relativ zur Integrationsfrequenz sind relevante Prozesssignale.

## Trade-offs und Entscheidungen

**Staff** integriert Änderungen gemäß dem etablierten Branching-Modell des Teams korrekt. **Principal** entscheidet, ob Trunk-Based Development oder ein Modell mit langlebigen Branches für ein konkretes Team basierend auf tatsächlicher Arbeitsüberlappung geeignet ist. **Chief** legt unternehmensweite Branching-Standards anhand von Team-Größe, Review-Kapazität und Release-Kadenz statt einer pauschalen Präferenz fest.

Anti-Patterns: Trunk-Based Development einführen, ohne die dafür nötige Review-Kapazität sicherzustellen; langlebige Branches für Teams mit hoher, überlappender Arbeitsintensität beibehalten und dadurch wachsende Konfliktkomplexität in Kauf nehmen; unfertige Funktionalität ohne Feature Flags direkt in den Hauptzweig integrieren.

## Production Checklist

- [ ] Das Branching-Modell entspricht der tatsächlichen Überlappung der Teamarbeit.
- [ ] Die Review-Kapazität ist gegen die tatsächliche Integrationsfrequenz geprüft.
- [ ] Unfertige, in den Hauptzweig integrierte Funktionalität liegt konsequent hinter Feature Flags.
- [ ] Die durchschnittliche Branch-Lebensdauer wird regelmäßig überwacht.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen Trunk-Based Development und Modellen mit langlebigen Branches?

**Antwort:** Trunk-Based Development integriert Änderungen sehr häufig direkt in den Hauptzweig mit kurzlebigen oder keinen Feature-Branches; Modelle mit langlebigen Branches verzögern die Integration bis eine Funktionalität vollständig fertiggestellt ist.

### 2. Wie hängt Konfliktgröße mit der Branch-Lebensdauer zusammen?

**Antwort:** Die Größe und Komplexität eines Merge-Konflikts wächst typischerweise proportional zur Zeit, die zwischen Branch-Abzweigung und Integration vergeht, da sich Branch und Hauptzweig in dieser Zeit zunehmend voneinander entfernen.

### 3. Wofür werden Feature Flags bei Trunk-Based Development genutzt?

**Antwort:** Um die Integration von Code in den Hauptzweig von dessen Aktivierung in Produktion zu entkoppeln, sodass unfertige Funktionalität sicher integriert, aber deaktiviert bleiben kann.

### 4. Welche drei Kriterien sollten die Wahl zwischen Trunk-Based Development und langlebigen Branches bestimmen?

**Antwort:** Die tatsächliche Überlappung der Teamarbeit an denselben Codebereichen, die verfügbare Review-Kapazität, und der tatsächliche Releasebedarf (kontinuierliche versus seltene, kuratierte Releases).

### 5. Wie gehst du vor, wenn Merge-Konflikte wiederkehrend groß und aufwendig werden?

**Antwort:** Ich prüfe, ob das Team langlebige Branches trotz hoher Überlappung der Arbeit an denselben Codebereichen nutzt, und evaluiere einen Wechsel zu häufigerer Integration oder Trunk-Based Development.

### 6. Widersprüchliche Anforderung: Team will isoliertes, ungestörtes Arbeiten an größeren Funktionalitäten über mehrere Wochen UND minimale Merge-Konflikte bei der Integration — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, große Funktionalitäten in kleinere, unabhängig integrierbare Teilschritte zu zerlegen, die jeweils häufig in den Hauptzweig integriert werden (mit Feature Flags zur Steuerung der Sichtbarkeit), statt eine einzelne, wochenlange isolierte Entwicklung mit zwangsläufig größerem Integrationskonflikt beizubehalten — isoliertes Arbeiten und minimale Konflikte lassen sich durch kleinere, häufiger integrierte Einheiten statt durch längere Isolation vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of conflict size vs branch lifetime (executed locally, no real repository):

def estimate_conflict_size(branch_lifetime_days, daily_overlapping_changes_on_trunk):
    return branch_lifetime_days * daily_overlapping_changes_on_trunk

scenarios = [
    {"name": "trunk-based (daily integration)", "branch_lifetime_days": 1, "daily_overlapping_changes_on_trunk": 3},
    {"name": "long-lived feature branch (3 weeks)", "branch_lifetime_days": 21, "daily_overlapping_changes_on_trunk": 3},
]

for s in scenarios:
    size = estimate_conflict_size(s["branch_lifetime_days"], s["daily_overlapping_changes_on_trunk"])
    print(f"{s['name']}: estimated conflicting changes at merge time = {size}")
~~~

## Dependencies, Cross-References und Quellen

1. Google-Dokumentation: [Trunk-Based Development](https://cloud.google.com/architecture/devops/devops-tech-trunk-based-development), abgerufen 2026-09-18.
2. Atlassian-Dokumentation: [Comparing Workflows — Gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow), abgerufen 2026-09-18.

Git und nachvollziehbare Änderungen sind kanonisch in [KB-0513](01-git-und-nachvollziehbare-aenderungen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, KI-gestützte automatische Konfliktauflösungsvorschläge basierend auf semantischem Verständnis divergierender Änderungen | Evaluating | Gegenüber vollständig manueller Konfliktauflösung erst nach Prüfung der tatsächlichen Genauigkeit bei komplexen, semantisch überlappenden Änderungen bevorzugen. |

Ein Team akzeptiert ein Branching-Modell erst, wenn es nachweislich der tatsächlichen Arbeitsüberlappung, Review-Kapazität und dem Releasebedarf des Teams entspricht, statt einer pauschalen Präferenz zu folgen.
