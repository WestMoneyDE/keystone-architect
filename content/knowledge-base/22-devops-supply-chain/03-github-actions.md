---
{"id": "KB-0515", "title": "GitHub Actions", "domain": "22", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0514", "concepts": ["Branching und Integrationsmodelle"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "GitHub-Actions-Workflows, Runner-Konfiguration und Berechtigungen anhand offizieller Dokumentation korrekt für nachvollziehbare Pipelines konfigurieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes Repository explizit entscheiden, wie wiederverwendbare Jobs, Secrets-Zugriff und die Behandlung von Pull Requests aus nicht vertrauenswürdigen Forks sicher gestaltet werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Secret-Exfiltration oder Berechtigungseskalation auf einen Workflow zurückführen können, der Secrets für nicht vertrauenswürdige Pull-Request-Trigger ohne angemessene Einschränkung bereitstellt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "CI/CD-Sicherheitsstandards im Unternehmen anhand einer klaren Trennung zwischen vertrauenswürdigen und nicht vertrauenswürdigen Workflow-Triggern festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der GitHub-Actions-Runner-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Berechtigungsmodell und Secrets-Handhabung bei untrusted Pull Requests als Sicherheitsgrundlage, nicht die Runner-Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0515-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller GitHub-Dokumentation zu Actions-Workflows, Berechtigungen und Secrets, kein aktives GitHub-Repository verwendet", "evidence": "Anhand offizieller GitHub-Dokumentation wird nachvollzogen, wie der pull_request-Trigger Secrets standardmäßig nicht an Workflows aus Forks weitergibt (Schutzmechanismus), während der gefährlichere pull_request_target-Trigger im Kontext des Basis-Repositorys mit vollem Secret-Zugriff ausgeführt wird, wodurch eine unsachgemäße Kombination mit Checkout von Fork-Code zu Secret-Exfiltration führen kann, sowie wie wiederverwendbare Workflows und granulare GITHUB_TOKEN-Berechtigungen das Prinzip der geringsten Berechtigung unterstützen.", "limitations": "Kein aktives GitHub-Repository verwendet, keine reale Pipeline konfiguriert."}]}
---
# GitHub Actions

> **Ziel:** GitHub Actions führt **Workflows** (in YAML definierte Automatisierungssequenzen, ausgelöst durch Ereignisse wie Push oder Pull Request) auf **Runnern** (gehostete oder selbst verwaltete Ausführungsumgebungen) aus, mit **Berechtigungen**, die granular über das `GITHUB_TOKEN` gesteuert werden. Der zentrale Sicherheitspunkt dieses Kapitels betrifft die Behandlung von Pull Requests aus nicht vertrauenswürdigen Forks: Der Standard-`pull_request`-Trigger führt Workflow-Code im Kontext des Fork-Repositorys aus und gewährt standardmäßig **keinen** Zugriff auf Repository-Secrets — dies ist ein bewusster Schutzmechanismus. Der `pull_request_target`-Trigger dagegen führt den Workflow im Kontext des **Basis-Repositorys** mit vollem Secret-Zugriff aus, selbst wenn der Pull Request von einem nicht vertrauenswürdigen Fork stammt — eine unsachgemäße Kombination (etwa: `pull_request_target` nutzen, aber dann explizit den nicht vertrauenswürdigen Fork-Code auschecken und mit den verfügbaren Secrets ausführen) öffnet einen direkten Weg zur Secret-Exfiltration durch böswillige externe Beitragende.

## Zweck, Mental Model und Dependencies

GitHub Actions adressiert die Automatisierung von Build-, Test- und Deployment-Pipelines direkt im Kontext eines GitHub-Repositorys, mit Workflows, die auf verschiedene Ereignisse (Push, Pull Request, Zeitplan, manueller Trigger) reagieren. Das Berechtigungsmodell basiert auf dem automatisch bereitgestellten `GITHUB_TOKEN`, dessen Berechtigungen granular pro Workflow oder Job eingeschränkt werden sollten (Prinzip der geringsten Berechtigung), statt die volle Standardberechtigung unreflektiert zu übernehmen. Der zentrale, häufig missverstandene Sicherheitsaspekt betrifft die beiden Pull-Request-bezogenen Trigger: `pull_request` führt den Workflow-Code aus dem Kontext des Forks aus und stellt aus Sicherheitsgründen standardmäßig keine Repository-Secrets bereit, da der Code eines externen, nicht vertrauenswürdigen Beitragenden stammen könnte, der andernfalls Secrets exfiltrieren könnte. `pull_request_target` wurde eingeführt, um bestimmte legitime Anwendungsfälle zu ermöglichen (etwa: einen Kommentar zu einem Pull Request von einem Fork hinzuzufügen, was Schreibzugriff auf das Basis-Repository erfordert) — dieser Trigger führt den Workflow jedoch im Kontext des Basis-Repositorys mit dessen vollen Berechtigungen und Secret-Zugriff aus, unabhängig davon, aus welchem Fork der Pull Request stammt. Die gefährliche Kombination entsteht, wenn ein Workflow mit `pull_request_target` explizit den (nicht vertrauenswürdigen) Code aus dem Pull-Request-Fork auscheckt und diesen Code dann im Kontext des Basis-Repositorys mit vollem Secret-Zugriff ausführt — dies gewährt einem böswilligen externen Beitragenden effektiv die Möglichkeit, beliebigen Code mit Zugriff auf alle Repository-Secrets auszuführen, indem er lediglich einen Pull Request öffnet. Wiederverwendbare Workflows adressieren ein separates Problem: die Vermeidung duplizierter Pipeline-Logik über mehrere Repositories oder Jobs hinweg, indem eine zentrale Workflow-Definition mit expliziten Eingabeparametern von anderen Workflows aufgerufen wird.

~~~text
GitHub Actions: Workflows (YAML, event-triggered) run on Runners, permissions via GITHUB_TOKEN
CRITICAL SECURITY DISTINCTION: pull_request vs pull_request_target triggers
  pull_request: runs workflow code IN FORK's context
    -> NO repository secrets provided by default (deliberate protection)
  pull_request_target: runs workflow in BASE REPOSITORY's context, WITH full secret access
    -> regardless of which fork the PR came from
    -> exists for legitimate cases (e.g. commenting on a PR, needs write access to base repo)
DANGEROUS COMBINATION:
  pull_request_target workflow that explicitly checks out the UNTRUSTED fork's code
    + runs that code IN base repo context WITH secret access
    -> malicious external contributor can exfiltrate ALL repo secrets just by opening a PR
Reusable workflows: avoid duplicated pipeline logic across repos/jobs
  -> central workflow definition called with explicit input parameters
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| `pull_request`-Trigger | Ausführung im Fork-Kontext, kein Secret-Zugriff | Standard-Schutzmechanismus gegen nicht vertrauenswürdigen Code |
| `pull_request_target`-Trigger | Ausführung im Basis-Repository-Kontext mit vollem Secret-Zugriff | gefährlich bei Checkout und Ausführung von Fork-Code |
| `GITHUB_TOKEN`-Berechtigungen | granulare, pro Workflow/Job einschränkbare Berechtigungen | sollte auf das tatsächlich benötigte Minimum beschränkt werden |
| Wiederverwendbare Workflows | zentrale, parametrisierte Pipeline-Logik | vermeidet duplizierte, potenziell inkonsistente Pipelines |

Implementierung: `pull_request_target` wird nur genutzt, wenn tatsächlich Zugriff auf das Basis-Repository nötig ist, und niemals in Kombination mit dem direkten Checkout und der Ausführung von nicht vertrauenswürdigem Fork-Code mit vollem Secret-Zugriff. `GITHUB_TOKEN`-Berechtigungen werden explizit auf das für den jeweiligen Job tatsächlich benötigte Minimum eingeschränkt, statt die volle Standardberechtigung zu übernehmen. Wiederkehrende Pipeline-Logik wird als wiederverwendbarer Workflow zentralisiert, statt in jedem Repository dupliziert zu werden.

## Scalability, Reliability, Security und Observability

GitHub-Actions-Workflows skalieren die Pipeline-Konsistenz proportional zur Nutzung wiederverwendbarer Workflows; die Reliability-Grenze liegt bei der Sicherheit darin, dass eine unsachgemäße Kombination aus `pull_request_target` und Fork-Code-Checkout proportional zur Anzahl externer Beitragender das Risiko einer Secret-Exfiltration erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Repository-Secrets werden unerwartet in Pull-Request-Workflows offengelegt | ein Workflow nutzt `pull_request_target` und checkt explizit nicht vertrauenswürdigen Fork-Code aus | den Workflow-Trigger und Checkout-Konfiguration auf diese gefährliche Kombination prüfen und beheben |
| ein Job hat mehr Berechtigungen als tatsächlich nötig | `GITHUB_TOKEN`-Berechtigungen wurden nicht explizit eingeschränkt | die Berechtigungen explizit auf das tatsächlich benötigte Minimum pro Job einschränken |
| dieselbe Pipeline-Logik ist in mehreren Repositories inkonsistent dupliziert | keine wiederverwendbaren Workflows werden genutzt | die duplizierte Logik in einen zentralen, wiederverwendbaren Workflow überführen |

Security: `pull_request_target` sollte niemals mit direktem Checkout und Ausführung von Fork-Code kombiniert werden, wenn der Job Zugriff auf Secrets hat; wo Interaktion mit Fork-Code nötig ist (z. B. Linting), sollte dies in einem separaten Job ohne Secret-Zugriff erfolgen. Observability: Die tatsächliche Nutzung von `pull_request_target` über alle Workflows hinweg, sowie die granulare Berechtigungskonfiguration jedes Workflows, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert einen Workflow mit korrekten, minimalen `GITHUB_TOKEN`-Berechtigungen. **Principal** entwirft die Pull-Request-Trigger-Strategie eines Repositorys so, dass Secret-Exfiltration durch nicht vertrauenswürdige Forks ausgeschlossen ist. **Chief** legt unternehmensweite CI/CD-Sicherheitsstandards für die Trennung vertrauenswürdiger und nicht vertrauenswürdiger Trigger fest.

Anti-Patterns: `pull_request_target` mit direktem Checkout und Ausführung von Fork-Code in Kombination mit Secret-Zugriff nutzen; `GITHUB_TOKEN`-Berechtigungen ohne explizite Einschränkung auf der vollen Standardberechtigung belassen; wiederkehrende Pipeline-Logik in mehreren Repositories unabhängig duplizieren, statt wiederverwendbare Workflows zu nutzen.

## Production Checklist

- [ ] `pull_request_target` wird niemals mit Checkout und Ausführung von nicht vertrauenswürdigem Fork-Code bei Secret-Zugriff kombiniert.
- [ ] `GITHUB_TOKEN`-Berechtigungen sind explizit auf das tatsächlich benötigte Minimum pro Job eingeschränkt.
- [ ] Wiederkehrende Pipeline-Logik ist als wiederverwendbarer Workflow zentralisiert.
- [ ] Die Nutzung von `pull_request_target` über alle Workflows hinweg wird regelmäßig überprüft.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen den Triggern `pull_request` und `pull_request_target`?

**Antwort:** `pull_request` führt den Workflow im Kontext des Forks ohne Secret-Zugriff aus; `pull_request_target` führt den Workflow im Kontext des Basis-Repositorys mit vollem Secret-Zugriff aus, unabhängig von der Herkunft des Pull Requests.

### 2. Warum ist `pull_request_target` in Kombination mit Checkout von Fork-Code gefährlich?

**Antwort:** Weil dies einem böswilligen externen Beitragenden ermöglicht, beliebigen Code mit vollem Zugriff auf alle Repository-Secrets auszuführen, indem er lediglich einen Pull Request öffnet.

### 3. Wofür wird `GITHUB_TOKEN` genutzt, und wie sollte es konfiguriert werden?

**Antwort:** Es stellt automatisch bereitgestellte Berechtigungen für einen Workflow bereit und sollte granular auf das tatsächlich für den jeweiligen Job benötigte Minimum eingeschränkt werden.

### 4. Wofür werden wiederverwendbare Workflows genutzt?

**Antwort:** Um duplizierte Pipeline-Logik über mehrere Repositories oder Jobs hinweg zu vermeiden, indem eine zentrale Workflow-Definition mit expliziten Eingabeparametern aufgerufen wird.

### 5. Wie gehst du vor, wenn du prüfen sollst, ob ein Repository für Secret-Exfiltration durch Pull Requests anfällig ist?

**Antwort:** Ich prüfe gezielt, ob Workflows mit `pull_request_target` Fork-Code direkt auschecken und im selben Job mit Secret-Zugriff ausführen, da dies die klassische, gefährliche Kombination ist.

### 6. Widersprüchliche Anforderung: Team will automatisierte Kommentare/Labels auf Pull Requests von externen Beitragenden UND garantiert keinen Secret-Zugriff für Code aus nicht vertrauenswürdigen Forks — wie gehst du vor?

**Antwort:** Ich würde die Kommentar-/Label-Logik als separaten Job mit `pull_request_target` (der nur mit den PR-Metadaten arbeitet, ohne Fork-Code auszuchecken oder auszuführen) implementieren, während jegliche Ausführung des tatsächlichen Fork-Codes (z. B. Tests) über den sicheren `pull_request`-Trigger ohne Secret-Zugriff erfolgt — beide Anforderungen lassen sich durch strikte Trennung der Trigger-Verantwortlichkeiten erfüllen.

## Praktische Labs

~~~python
# Conceptual workflow-trigger risk check (not executed against a real GitHub repository):

def check_workflow_risk(trigger, checks_out_fork_code, has_secret_access):
    if trigger == "pull_request_target" and checks_out_fork_code and has_secret_access:
        return "HIGH RISK: fork code executed with base-repo secret access -- secret exfiltration possible"
    if trigger == "pull_request" and has_secret_access:
        return "SAFE: pull_request trigger does not provide secrets by default"
    return "acceptable configuration"

workflows = [
    {"trigger": "pull_request_target", "checks_out_fork_code": True, "has_secret_access": True},
    {"trigger": "pull_request_target", "checks_out_fork_code": False, "has_secret_access": True},
]

for w in workflows:
    print(check_workflow_risk(**w))
~~~

## Dependencies, Cross-References und Quellen

1. GitHub-Dokumentation: [Keeping Your GitHub Actions and Workflows Secure — Preventing pwn requests](https://securitylab.github.com/resources/github-actions-preventing-pwn-requests/), abgerufen 2026-09-18.
2. GitHub-Dokumentation: [Reusing Workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows), abgerufen 2026-09-18.

Branching und Integrationsmodelle sind kanonisch in [KB-0514](02-branching-und-integrationsmodelle.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, native Erkennung riskanter `pull_request_target`-Konfigurationen direkt in der GitHub-Oberfläche | Evaluating | Gegenüber manueller Code-Review-basierter Erkennung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für komplexe Workflow-Kombinationen bevorzugen. |

Ein Team akzeptiert eine GitHub-Actions-Pipeline erst, wenn nachweislich keine gefährliche Kombination aus `pull_request_target` und Ausführung nicht vertrauenswürdigen Fork-Codes mit Secret-Zugriff existiert.
