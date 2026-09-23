---
{"id": "KB-0516", "title": "GitLab CI", "domain": "22", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0515", "concepts": ["GitHub Actions"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "GitLab-CI-Stages, Jobs und Runner-Konfiguration anhand offizieller Dokumentation korrekt strukturieren und Cache von Artefakten funktional unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes Projekt explizit entscheiden, wie geschützte Umgebungen (Protected Environments) und Deployment-Genehmigungen gestaltet werden, und ob GitLab CI oder GitHub Actions für den tatsächlichen Anwendungsfall geeigneter ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlgeschlagene Pipeline aufgrund veralteter Abhängigkeiten auf eine Verwechslung von Cache (Leistungsoptimierung, keine Garantie) und Artefakten (garantierte Weitergabe zwischen Jobs) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "CI/CD-Werkzeugstandards im Unternehmen anhand einer expliziten Bewertung von GitLab CI gegenüber GitHub Actions basierend auf tatsächlichen Anforderungen (Selbstverwaltung, Integrationstiefe, geschützte Umgebungen) statt einer pauschalen Präferenz festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der GitLab-Runner-Executor-Typen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Cache-versus-Artefakt-Unterscheidung und geschützten Umgebungen als Entscheidungsgrundlage, nicht die Executor-Interna."}}, "lab_validation": [{"lab_id": "KB-0516-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller GitLab-Dokumentation zu Stages, Jobs, Cache, Artefakten und geschützten Umgebungen, kein aktives GitLab-Projekt verwendet", "evidence": "Anhand offizieller GitLab-Dokumentation wird nachvollzogen, wie Stages die sequenzielle Ausführungsreihenfolge von Jobs definieren, wie Cache eine reine Leistungsoptimierung ohne Zustellungsgarantie darstellt (ein Cache-Miss führt zu erneuter, aber korrekter Berechnung), während Artefakte eine garantierte Weitergabe von Build-Ergebnissen zwischen Jobs derselben Pipeline sicherstellen, und wie geschützte Umgebungen (Protected Environments) Deployment-Genehmigungen für kritische Umgebungen erzwingen.", "limitations": "Kein aktives GitLab-Projekt verwendet, keine reale Pipeline konfiguriert."}]}
---
# GitLab CI

> **Ziel:** GitLab CI strukturiert Pipelines über **Stages** (sequenzielle Ausführungsphasen wie Build, Test, Deploy, wobei Jobs innerhalb derselben Stage standardmäßig parallel laufen) und **Jobs** (einzelne, in `.gitlab-ci.yml` definierte Ausführungseinheiten), ausgeführt auf **Runnern** (gehostete oder selbst verwaltete Ausführungsumgebungen, analog zu GitHub-Actions-Runnern, siehe [KB-0515](03-github-actions.md)). Der zentrale Unterscheidungspunkt dieses Kapitels ist **Cache versus Artefakte**: Cache ist eine reine Leistungsoptimierung ohne Zustellungsgarantie — bei einem Cache-Miss wird einfach neu berechnet, was zu Verzögerung, aber keinem Fehler führt. Artefakte garantieren dagegen die Weitergabe von Build-Ergebnissen zwischen Jobs derselben Pipeline — ein Job, der auf ein Artefakt eines vorherigen Jobs angewiesen ist, schlägt fehl, wenn dieses Artefakt fehlt. Eine fehlgeschlagene Pipeline mit veralteten oder fehlenden Abhängigkeiten deutet häufig auf eine Verwechslung dieser beiden Mechanismen hin — Daten, die für die Korrektheit eines nachfolgenden Jobs garantiert benötigt werden, gehören als Artefakt, nicht als Cache übergeben.

## Zweck, Mental Model und Dependencies

GitLab CI adressiert dieselbe grundlegende Problemstellung wie GitHub Actions (siehe [KB-0515](03-github-actions.md)) — automatisierte Build-, Test- und Deployment-Pipelines direkt im Kontext eines Versionskontroll-Repositorys — mit einer strukturell etwas anderen Organisation: Stages definieren die sequenzielle Reihenfolge, in der Gruppen von Jobs ausgeführt werden (etwa: erst alle Build-Jobs, dann alle Test-Jobs, dann Deploy-Jobs), wobei Jobs innerhalb derselben Stage standardmäßig parallel laufen, sofern keine expliziten Abhängigkeiten definiert sind. Die Unterscheidung zwischen Cache und Artefakten ist konzeptionell zentral und wird häufig verwechselt: Ein Cache (etwa heruntergeladene Paketabhängigkeiten) beschleunigt nachfolgende Pipeline-Läufe, indem wiederholtes Herunterladen vermieden wird — geht der Cache verloren oder ist inkonsistent, wird einfach neu heruntergeladen, was langsamer, aber nicht fehlerhaft ist. Ein Artefakt (etwa eine kompilierte Binärdatei aus einem Build-Job, die ein nachfolgender Test- oder Deploy-Job tatsächlich benötigt) muss dagegen garantiert zwischen Jobs weitergegeben werden — fehlt es, schlägt der abhängige Job fehl, da er ohne dieses Artefakt seine Aufgabe nicht korrekt ausführen kann. Diese Unterscheidung bestimmt, welcher Mechanismus für welche Daten geeignet ist: Optimierungsdaten (die bei Verlust nur zu Verlangsamung führen) gehören in den Cache, während funktional notwendige Daten (deren Fehlen zu einem fehlerhaften oder unmöglichen nachfolgenden Schritt führt) als Artefakte übergeben werden müssen. Geschützte Umgebungen (Protected Environments) erzwingen Deployment-Genehmigungen für kritische Umgebungen (etwa Produktion) — ein Deployment-Job kann erst ausgeführt werden, nachdem eine autorisierte Person die Genehmigung erteilt hat, was eine explizite menschliche Kontrolle vor kritischen Änderungen sicherstellt.

~~~text
GitLab CI: Stages (sequential phases: build/test/deploy) + Jobs (parallel within same stage by default)
  runs on Runners (analog to GitHub Actions runners, KB-0515)
CRITICAL DISTINCTION: Cache vs Artifacts
  Cache: PURE performance optimization, NO delivery guarantee
    -> cache miss = re-download/re-compute, SLOWER but NOT an error
    -> fits: optimization data (downloaded package deps)
  Artifacts: GUARANTEED handoff of build results between jobs in same pipeline
    -> missing artifact = dependent job FAILS
    -> fits: functionally necessary data (compiled binary a test job actually needs)
FAILED pipeline with stale/missing dependencies
  -> often = CACHE used where ARTIFACT was actually needed
Protected Environments: enforce deployment APPROVAL for critical environments (e.g. production)
  -> deployment job cannot run until authorized person grants approval -> explicit human control gate
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Stages | sequenzielle Ausführungsphasen | bestimmen Reihenfolge, Jobs innerhalb einer Stage laufen parallel |
| Cache | Leistungsoptimierung ohne Garantie | Verlust führt zu Verlangsamung, nicht zu Fehler |
| Artefakte | garantierte Weitergabe zwischen Jobs | Fehlen führt zu Fehlschlag des abhängigen Jobs |
| Geschützte Umgebungen | erzwungene Deployment-Genehmigung | menschliche Kontrolle vor kritischen Deployments |

Implementierung: Für jede Pipeline-Datenweitergabe wird explizit geprüft, ob ein nachfolgender Job funktional auf die Daten angewiesen ist (Artefakt nötig) oder ob die Daten nur eine Leistungsoptimierung darstellen (Cache ausreichend), statt beide Mechanismen unreflektiert austauschbar zu verwenden. Kritische Umgebungen (Produktion) werden mit geschützten Umgebungen und expliziten Genehmigungsprozessen konfiguriert, statt automatisiertes Deployment ohne menschliche Kontrolle zuzulassen. Die Wahl zwischen GitLab CI und GitHub Actions erfolgt anhand tatsächlicher Anforderungen (Selbstverwaltungsbedarf, bestehende Plattformintegration), nicht pauschal.

## Scalability, Reliability, Security und Observability

GitLab-CI-Pipelines skalieren die Zuverlässigkeit proportional zur korrekten Nutzung von Cache versus Artefakten; die Reliability-Grenze liegt darin, dass eine Nutzung von Cache für funktional notwendige Daten proportional zur Cache-Volatilität zu nicht deterministischen, schwer reproduzierbaren Pipeline-Fehlern führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein nachfolgender Job schlägt sporadisch mit fehlenden Daten fehl | funktional notwendige Daten wurden als Cache statt als Artefakt übergeben | die betroffenen Daten von Cache auf Artefakt umstellen |
| Pipelines laufen unerwartet langsam | benötigte Optimierungsdaten (z. B. Paketabhängigkeiten) werden nicht konsistent gecacht | die Cache-Konfiguration und Cache-Key-Strategie überprüfen |
| ein Deployment auf eine kritische Umgebung erfolgt ohne menschliche Prüfung | keine geschützte Umgebung mit Genehmigungsprozess ist für die betroffene Umgebung konfiguriert | eine geschützte Umgebung mit expliziter Genehmigungspflicht für die kritische Umgebung einrichten |

Security: Geschützte Umgebungen sollten für alle kritischen Deployment-Ziele konfiguriert werden, mit klar definierten, autorisierten Genehmigenden. Observability: Die tatsächliche Cache-Trefferquote, die Häufigkeit von durch fehlende Artefakte verursachten Job-Fehlschlägen, und die Genehmigungsdurchlaufzeit für geschützte Umgebungen sind relevante Prozesssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Stages, Jobs, Cache und Artefakte für eine gegebene Pipeline korrekt. **Principal** entscheidet, welche Daten als Cache versus Artefakt übergeben werden, und gestaltet geschützte Umgebungen für kritische Deployments. **Chief** legt CI/CD-Werkzeugstandards fest, die GitLab CI und GitHub Actions anhand tatsächlicher Anforderungen statt pauschaler Präferenz bewerten.

Anti-Patterns: funktional notwendige Daten als Cache statt Artefakt übergeben und dadurch nicht deterministische Pipeline-Fehler riskieren; kritische Produktionsdeployments ohne geschützte Umgebung und Genehmigungsprozess automatisieren; GitLab CI oder GitHub Actions ohne Bewertung tatsächlicher Anforderungen pauschal wählen.

## Production Checklist

- [ ] Funktional notwendige Daten werden als Artefakte, nicht als Cache, zwischen Jobs übergeben.
- [ ] Kritische Umgebungen sind als geschützte Umgebungen mit explizitem Genehmigungsprozess konfiguriert.
- [ ] Die Cache-Key-Strategie ist auf tatsächliche Leistungsoptimierung ausgelegt, nicht auf funktionale Datenweitergabe.
- [ ] Die Wahl zwischen GitLab CI und GitHub Actions basiert auf einer expliziten Anforderungsbewertung.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen Cache und Artefakten in GitLab CI?

**Antwort:** Cache ist eine reine Leistungsoptimierung ohne Zustellungsgarantie; Artefakte garantieren die Weitergabe von Daten zwischen Jobs, und ihr Fehlen führt zum Fehlschlag des abhängigen Jobs.

### 2. Wie laufen Jobs innerhalb derselben Stage standardmäßig?

**Antwort:** Parallel, sofern keine expliziten Abhängigkeiten zwischen ihnen definiert sind.

### 3. Wofür werden geschützte Umgebungen (Protected Environments) genutzt?

**Antwort:** Um Deployment-Genehmigungen für kritische Umgebungen wie Produktion zu erzwingen, sodass ein Deployment erst nach expliziter Autorisierung erfolgt.

### 4. Warum führt die Verwechslung von Cache und Artefakten zu sporadischen Pipeline-Fehlern?

**Antwort:** Weil Cache keine Zustellungsgarantie bietet — wenn funktional notwendige Daten als Cache übergeben werden, kann ihr gelegentliches Fehlen (Cache-Miss) zu nicht deterministischen Fehlern in nachfolgenden Jobs führen, statt zuverlässig verfügbar zu sein.

### 5. Wie gehst du vor, wenn ein nachfolgender Job sporadisch mit fehlenden Daten fehlschlägt?

**Antwort:** Ich prüfe, ob die betroffenen Daten als Cache statt als Artefakt übergeben werden, da dies die häufigste Ursache für sporadische, nicht deterministische Fehler in dieser Situation ist, und stelle bei Bedarf auf Artefakte um.

### 6. Widersprüchliche Anforderung: Team will maximale Pipeline-Geschwindigkeit durch aggressives Caching UND garantiert zuverlässige, deterministische Job-Ergebnisse — wie gehst du vor?

**Antwort:** Ich würde die beiden Anforderungen trennen: reine Leistungsoptimierungsdaten (z. B. Paketabhängigkeiten) aggressiv cachen, um Geschwindigkeit zu maximieren, während funktional notwendige Daten für die Korrektheit nachfolgender Jobs konsequent als Artefakte übergeben werden — Geschwindigkeit und Zuverlässigkeit widersprechen sich nicht, solange der jeweils richtige Mechanismus für die jeweilige Datenart genutzt wird.

## Praktische Labs

~~~python
# Conceptual cache-vs-artifact suitability check (not executed against a real GitLab project):

def recommend_mechanism(is_functionally_required_by_downstream_job):
    return "artifact (guaranteed handoff required)" if is_functionally_required_by_downstream_job else "cache (performance optimization only)"

data_items = [
    {"name": "compiled-binary", "is_functionally_required_by_downstream_job": True},
    {"name": "downloaded-package-deps", "is_functionally_required_by_downstream_job": False},
]

for item in data_items:
    print(f"{item['name']}: {recommend_mechanism(item['is_functionally_required_by_downstream_job'])}")
~~~

## Dependencies, Cross-References und Quellen

1. GitLab-Dokumentation: [GitLab CI/CD Pipeline Configuration Reference](https://docs.gitlab.com/ee/ci/yaml/), abgerufen 2026-09-18.
2. GitLab-Dokumentation: [Protected Environments](https://docs.gitlab.com/ee/ci/environments/protected_environments.html), abgerufen 2026-09-18.

GitHub Actions ist kanonisch in [KB-0515](03-github-actions.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, integrierte Software-Supply-Chain-Sicherheitsfunktionen (Dependency Scanning, SAST) direkt in GitLab-CI-Pipelines | Evaluating | Gegenüber separaten, externen Sicherheits-Scanning-Werkzeugen erst nach Prüfung der tatsächlichen Erkennungsabdeckung und Integrationsqualität bevorzugen. |

Ein Team akzeptiert eine GitLab-CI-Pipeline erst, wenn Cache und Artefakte nachweislich korrekt für ihre jeweiligen Zwecke genutzt werden und kritische Deployments über geschützte Umgebungen mit expliziter Genehmigung abgesichert sind.
