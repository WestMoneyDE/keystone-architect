---
{"id": "KB-0526", "title": "Release-Strategien", "domain": "22", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0525", "concepts": ["Argo CD und Releasekontrolle"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Rolling-, Blue-Green- und Canary-Deployments anhand ihrer jeweiligen Trafficumschaltungs- und Abbruchmechanik korrekt für einen gegebenen Anwendungsfall auswählen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit entscheiden, wie Datenmigration mit der gewählten Release-Strategie kompatibel gestaltet wird, und welche messbaren Abbruchkriterien vor der Einführung einer riskanten Änderung definiert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen fehlgeschlagenen Rollback nach einer inkompatiblen Datenmigration auf eine fehlende Abstimmung zwischen Schemaänderung und Release-Strategie zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Release-Strategien anhand messbarer, vorab definierter Abbruchkriterien statt subjektiver Ad-hoc-Entscheidungen während eines Rollouts festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailkonfiguration spezifischer Werkzeuge zur automatisierten Canary-Analyse im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der drei Release-Strategien, ihrer Trafficumschaltungsmechanik und der Kompatibilität mit Datenmigration, nicht die werkzeugspezifische Automatisierung."}}, "lab_validation": [{"lab_id": "KB-0526-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Rollback-Inkompatibilität bei nicht abwärtskompatibler Schemaänderung, kein produktives Deployment-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine nicht abwärtskompatible Datenbankschemaänderung (z. B. eine gelöschte Spalte) einen Rollback zur vorherigen Anwendungsversion unmöglich macht, da diese Version auf die nun fehlende Spalte angewiesen ist, und zeigt, warum Datenmigration und Release-Strategie gemeinsam geplant werden müssen, statt Datenmigration als unabhängigen, rollback-neutralen Schritt zu behandeln.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Deployment-System mit tatsächlicher Trafficdynamik."}]}
---
# Release-Strategien

> **Ziel:** Die drei etablierten Release-Strategien unterscheiden sich in ihrer Trafficumschaltungs- und Abbruchmechanik: **Rolling** ersetzt Instanzen der alten Version schrittweise durch die neue Version, wobei zu jedem Zeitpunkt beide Versionen gleichzeitig Traffic bedienen (geringer Ressourcenbedarf, aber während der Umstellung sind beide Versionen gleichzeitig aktiv, was Kompatibilitätsanforderungen stellt). **Blue-Green** hält zwei vollständige, parallele Umgebungen (alte "Blue" und neue "Green" Version) und schaltet den gesamten Traffic mit einem einzigen Schritt von Blue auf Green um (sofortiger, vollständiger Rollback durch Zurückschalten möglich, aber doppelter Ressourcenbedarf während der Umstellung). **Canary** leitet zunächst nur einen kleinen, kontrollierten Anteil des Traffics zur neuen Version, beobachtet messbare Kriterien, und erhöht den Anteil schrittweise nur bei Erfüllung dieser Kriterien (geringstes Risiko, aber komplexeste Steuerung). Der zentrale Punkt dieses Kapitels ist, dass ein fehlgeschlagener Rollback häufig nicht auf ein Problem der Release-Strategie selbst zurückzuführen ist, sondern auf eine nicht abwärtskompatible Datenmigration, die gleichzeitig mit dem Anwendungs-Deployment erfolgte — wenn eine Datenbankschemaänderung (etwa das Löschen einer Spalte) nicht mit der vorherigen Anwendungsversion kompatibel ist, macht ein Rollback zur vorherigen Version die Anwendung unbrauchbar, unabhängig davon, wie gut die gewählte Release-Strategie selbst funktioniert.

## Zweck, Mental Model und Dependencies

Rolling Deployments minimieren den Ressourcenbedarf während einer Umstellung, indem Instanzen schrittweise ersetzt werden, statt eine vollständige parallele Umgebung vorzuhalten — dies bedeutet jedoch zwangsläufig, dass für die Dauer des Rollouts sowohl alte als auch neue Version gleichzeitig Traffic bedienen, was die neue Version dazu zwingt, mit denselben Datenstrukturen und APIs kompatibel zu sein wie die alte Version, solange der Rollout nicht abgeschlossen ist. Blue-Green vermeidet dieses Kompatibilitätsproblem während der Umstellungsphase, indem stets nur eine der beiden vollständigen Umgebungen tatsächlich Traffic bedient — der Umschaltpunkt ist ein einzelner, gut definierter Moment, was einen schnellen, vollständigen Rollback durch einfaches Zurückschalten des Traffics ermöglicht, jedoch auf Kosten doppelter Infrastrukturkosten während der Umstellungsphase. Canary Deployments minimieren das Risiko am stärksten, indem sie den Rollout in kleine, messbare Schritte unterteilen — ein kleiner Prozentsatz des Traffics wird zunächst zur neuen Version geleitet, und explizit definierte, messbare Kriterien (Fehlerrate, Latenz, Geschäftsmetriken) werden beobachtet, bevor der Traffic-Anteil weiter erhöht wird; werden die Kriterien nicht erfüllt, wird der Rollout automatisch oder manuell abgebrochen, bevor die neue Version den gesamten Traffic erhält. Unabhängig von der gewählten Release-Strategie ist die kritischste, häufig übersehene Herausforderung die Kompatibilität von Datenmigrationen mit dem Release-Prozess: Eine Datenbankschemaänderung, die gleichzeitig mit einem Anwendungs-Deployment erfolgt, muss abwärtskompatibel mit der vorherigen Anwendungsversion sein, solange diese noch aktiv ist (bei Rolling und Canary) oder solange ein Rollback zu ihr noch möglich sein soll (bei allen drei Strategien) — eine Spalte destruktiv zu löschen, bevor sichergestellt ist, dass kein Rollback mehr zu einer Version erfolgen wird, die diese Spalte benötigt, macht jeden Rollback-Versuch technisch unmöglich, unabhängig von der gewählten Release-Strategie.

~~~text
3 release strategies, differ in TRAFFIC SWITCHING + ABORT mechanics:
  Rolling: instances replaced INCREMENTALLY, OLD + NEW versions serve traffic SIMULTANEOUSLY during rollout
    -> low resource cost, BUT forces backward compatibility of new version during transition
  Blue-Green: 2 FULL parallel envs, traffic switches in ONE step (blue -> green)
    -> instant full rollback via switch-back, BUT double infra cost during transition
  Canary: small, controlled % of traffic to new version FIRST, observe MEASURABLE criteria
    -> increase % only if criteria met, ABORT if not
    -> lowest risk, most complex control
CRITICAL, OFTEN-OVERLOOKED cross-cutting issue: DATA MIGRATION compatibility
  schema change concurrent with deployment MUST be backward-compatible with previous app version
    AS LONG AS: previous version still serves traffic (rolling/canary) OR rollback to it still possible (all 3)
  destructively dropping a column BEFORE certain no rollback will need it
    -> makes EVERY rollback attempt technically impossible, REGARDLESS of release strategy quality
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Rolling | schrittweiser Ersatz, geringer Ressourcenbedarf | erfordert Kompatibilität alter/neuer Version während Rollout |
| Blue-Green | zwei vollständige Umgebungen, Ein-Schritt-Umschaltung | schneller Rollback, doppelter Ressourcenbedarf |
| Canary | schrittweise Traffic-Erhöhung mit messbaren Kriterien | geringstes Risiko, komplexeste Steuerung |
| Datenmigrations-Kompatibilität | Schemaänderung muss mit Rollback-Fähigkeit vereinbar sein | unabhängig von der gewählten Release-Strategie kritisch |

Implementierung: Für jede riskante Änderung werden messbare Abbruchkriterien (Fehlerrate, Latenzschwellenwerte, Geschäftsmetriken) explizit vor Beginn des Rollouts definiert, statt subjektive Ad-hoc-Entscheidungen während des Rollouts zu treffen. Datenbankschemaänderungen werden explizit auf Abwärtskompatibilität mit der vorherigen Anwendungsversion geprüft, solange diese noch aktiv sein könnte oder ein Rollback zu ihr möglich sein soll. Destruktive Schemaänderungen (Löschen von Spalten/Tabellen) werden erst durchgeführt, nachdem sichergestellt ist, dass kein Rollback mehr zu einer davon abhängigen Version erfolgen wird.

## Scalability, Reliability, Security und Observability

Release-Strategien skalieren die Risikobegrenzung proportional zur Granularität der Trafficumschaltung (Canary am granularsten, Blue-Green am gröbsten); die Reliability-Grenze liegt darin, dass eine nicht abwärtskompatible Datenmigration proportional zur Zeit, in der ein Rollback noch möglich sein könnte, das Risiko eines technisch unmöglichen Rollbacks erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Rollback nach einem fehlgeschlagenen Deployment ist technisch nicht möglich oder führt zu Fehlern | eine nicht abwärtskompatible Datenmigration wurde gleichzeitig mit dem Deployment durchgeführt | prüfen, ob die Schemaänderung mit der vorherigen Anwendungsversion kompatibel war, und destruktive Änderungen künftig zeitlich entkoppeln |
| ein Canary-Rollout wird trotz erfüllter subjektiver Erwartungen fortgesetzt, obwohl Probleme auftreten | keine messbaren, vorab definierten Abbruchkriterien wurden festgelegt | explizite, messbare Abbruchkriterien vor jedem zukünftigen Rollout definieren |
| während eines Rolling-Deployments treten unerwartete Fehler durch inkompatible gleichzeitig aktive Versionen auf | die neue Version ist nicht abwärtskompatibel mit Daten/APIs der alten Version während des Rollouts | die neue Version explizit auf Abwärtskompatibilität während der Übergangsphase prüfen, oder zu Blue-Green wechseln |

Security: Abbruchkriterien sollten auch sicherheitsrelevante Signale (unerwartete Authentifizierungsfehler, Zugriffsverletzungen) einschließen, nicht nur Leistungs- und Geschäftsmetriken. Observability: Die tatsächliche Erfüllung messbarer Abbruchkriterien während eines Rollouts, die Häufigkeit erfolgreicher versus fehlgeschlagener Rollbacks, und die Kompatibilitätsprüfungsrate von Datenmigrationen sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert eine gegebene Release-Strategie korrekt für einen Deployment-Vorgang. **Principal** entscheidet, welche Release-Strategie für eine konkrete Anwendung geeignet ist, und stimmt Datenmigration explizit mit der gewählten Strategie ab. **Chief** legt unternehmensweite Standards für messbare, vorab definierte Abbruchkriterien statt subjektiver Ad-hoc-Entscheidungen fest.

Anti-Patterns: destruktive Datenbankschemaänderungen gleichzeitig mit einem Deployment durchführen, ohne Abwärtskompatibilität mit der vorherigen Version zu prüfen; einen Canary- oder anderen Rollout ohne vorab definierte, messbare Abbruchkriterien durchführen; Rollback-Fähigkeit als selbstverständlich annehmen, ohne sie explizit gegen tatsächliche Datenmigrationskompatibilität zu prüfen.

## Production Checklist

- [ ] Für jede riskante Änderung sind messbare Abbruchkriterien vor Beginn des Rollouts definiert.
- [ ] Datenbankschemaänderungen sind explizit auf Abwärtskompatibilität mit der vorherigen Anwendungsversion geprüft.
- [ ] Destruktive Schemaänderungen erfolgen erst, nachdem kein Rollback-Bedarf zur alten Version mehr besteht.
- [ ] Die gewählte Release-Strategie entspricht der tatsächlichen Risikotoleranz und Ressourcenverfügbarkeit der Anwendung.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen Rolling, Blue-Green und Canary in Bezug auf Trafficumschaltung?

**Antwort:** Rolling ersetzt Instanzen schrittweise mit gleichzeitig aktiven alten und neuen Versionen; Blue-Green schaltet den gesamten Traffic in einem Schritt zwischen zwei vollständigen Umgebungen um; Canary erhöht den Traffic-Anteil zur neuen Version schrittweise basierend auf messbaren Kriterien.

### 2. Warum erfordert Rolling Deployment Abwärtskompatibilität der neuen Version?

**Antwort:** Weil während des Rollouts sowohl alte als auch neue Version gleichzeitig Traffic bedienen, wodurch die neue Version mit denselben Daten und APIs kompatibel sein muss wie die alte.

### 3. Warum kann ein Rollback trotz technisch korrekter Release-Strategie fehlschlagen?

**Antwort:** Weil eine gleichzeitig mit dem Deployment durchgeführte, nicht abwärtskompatible Datenmigration (z. B. eine gelöschte Spalte) die vorherige Anwendungsversion unbrauchbar macht, unabhängig von der gewählten Release-Strategie.

### 4. Was unterscheidet Canary von den anderen beiden Strategien bezüglich Risikobegrenzung?

**Antwort:** Canary leitet zunächst nur einen kleinen, kontrollierten Traffic-Anteil zur neuen Version und erhöht ihn nur bei Erfüllung messbarer Kriterien, was das geringste Risiko unter den drei Strategien bietet.

### 5. Wie gehst du vor, wenn ein Rollback nach einem fehlgeschlagenen Deployment technisch nicht möglich ist?

**Antwort:** Ich prüfe, ob eine gleichzeitig durchgeführte Datenmigration nicht abwärtskompatibel mit der vorherigen Anwendungsversion war, da dies die häufigste Ursache für technisch unmögliche Rollbacks ist, unabhängig von der Release-Strategie.

### 6. Widersprüchliche Anforderung: Team will minimale Infrastrukturkosten durch Rolling Deployment UND garantiert sofortigen, vollständigen Rollback bei Problemen wie bei Blue-Green — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Infrastrukturkosten und sofortiger, vollständiger Rollback bei Rolling Deployment strukturell im Widerspruch stehen, da während des Rollouts keine vollständige, unveränderte alte Umgebung parallel existiert, und vorschlagen, entweder Blue-Green für kritische Anwendungen mit hoher Rollback-Anforderung zu nutzen, oder bei Rolling Deployment die Abwärtskompatibilität der neuen Version so sicherzustellen, dass ein Zurücksetzen der Rollout-Richtung (statt eines vollständigen Blue-Green-Switch-Backs) technisch möglich bleibt.

## Praktische Labs

~~~python
# Local, deterministic simulation of rollback incompatibility due to non-backward-compatible schema change (executed locally, no real deployment system):

def can_rollback(old_version_requires_column, column_still_exists):
    if old_version_requires_column and not column_still_exists:
        return False, "rollback IMPOSSIBLE: old version requires a column that has been dropped"
    return True, "rollback possible"

print(can_rollback(old_version_requires_column=True, column_still_exists=False))
print(can_rollback(old_version_requires_column=True, column_still_exists=True))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Dokumentation: [DevOps Tech: Deployment Automation](https://cloud.google.com/architecture/devops/devops-tech-deployment-automation), abgerufen 2026-09-18.
2. Martin-Fowler-Dokumentation: [BlueGreenDeployment](https://martinfowler.com/bliki/BlueGreenDeployment.html), abgerufen 2026-09-18.

Argo CD und Releasekontrolle sind kanonisch in [KB-0525](13-argo-cd-und-releasekontrolle.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Canary-Analyse mit KI-gestützter Anomalieerkennung statt fest definierter statischer Schwellenwerte | Evaluating | Gegenüber statischen, manuell definierten Abbruchkriterien erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit und Nachvollziehbarkeit der automatisierten Analyse bevorzugen. |

Ein Team akzeptiert eine Release-Strategie erst, wenn messbare Abbruchkriterien vorab definiert sind und Datenmigrationen nachweislich mit der Rollback-Fähigkeit der gewählten Strategie kompatibel gestaltet wurden.
