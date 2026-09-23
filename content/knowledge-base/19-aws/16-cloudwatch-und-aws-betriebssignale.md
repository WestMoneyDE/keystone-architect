---
{"id": "KB-0478", "title": "CloudWatch und AWS-Betriebssignale", "domain": "19", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0468", "concepts": ["EC2 und Auto Scaling"], "needed_for": "understanding"}, {"id": "KB-0472", "concepts": ["AWS Lambda"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine CloudWatch-Alarm-Konfiguration mit einem Metrik-Schwellenwert anhand offizieller Dokumentation erstellen können und erklären, warum CloudWatch standardmäßig pro AWS-Account/-Region isoliert ist.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Observability-Strategie gestalten, die entscheidet, wann native CloudWatch-Integration gegenüber herstellerneutraler OpenTelemetry-Instrumentierung angemessen ist, basierend auf tatsächlichem Bedarf an Multi-Cloud-Portabilität oder AWS-nativer Tiefenintegration.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Beobachtbarkeitslücke bei einer Multi-Account-Architektur auf fehlende, kontenübergreifende CloudWatch-Aggregation zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Observability-Richtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von AWS-nativer Integrationstiefe zu herstellerneutraler Portabilität statt anhand einer pauschalen Werkzeugpräferenz festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der CloudWatch-Metrik-Speicherarchitektur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Accountgrenzen, Kostenmodell und der Abwägung gegenüber OpenTelemetry als Entscheidungsgrundlage, nicht die Speicher-Interna."}}, "lab_validation": [{"lab_id": "KB-0478-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-CloudWatch-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie CloudWatch Logs, Metriken und Alarme für AWS-Ressourcen bereitstellt, warum CloudWatch standardmäßig pro Account und Region isoliert ist (kontenübergreifende Aggregation erfordert explizite Konfiguration), und wie sich diese AWS-native Integrationstiefe gegenüber herstellerneutraler OpenTelemetry-Instrumentierung hinsichtlich Portabilität und Vendor-Lock-in unterscheidet.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale CloudWatch-Konfiguration erstellt."}]}
---
# CloudWatch und AWS-Betriebssignale

> **Ziel:** Amazon CloudWatch sammelt Logs, Metriken und Alarme für AWS-Ressourcen (z. B. EC2-Instanzen, siehe [KB-0468](06-ec2-und-auto-scaling.md), oder Lambda-Funktionen, siehe [KB-0472](10-aws-lambda.md)) und korreliert diese mit den jeweiligen Ressourcen — ein zentraler struktureller Aspekt ist, dass CloudWatch standardmäßig pro AWS-Account und -Region isoliert ist, was bedeutet, dass eine kontenübergreifende Aggregation von Metriken und Logs (relevant für Organisationen mit mehreren AWS-Accounts, siehe AWS-Organisationen und Landing Zones, [KB-0463](01-aws-organisationen-und-landing-zones.md)) explizite, zusätzliche Konfiguration erfordert, statt automatisch gegeben zu sein. Der zentrale Punkt dieses Kapitels ist, dass die Wahl zwischen nativer CloudWatch-Integration und herstellerneutraler OpenTelemetry-Instrumentierung eine bewusste Abwägung zwischen AWS-nativer Integrationstiefe (engere, oft einfachere Integration mit AWS-Diensten, jedoch potenzieller Vendor-Lock-in) und Portabilität (Fähigkeit, dieselbe Instrumentierung auch außerhalb von AWS oder in einer Multi-Cloud-Umgebung zu nutzen) erfordert, die anhand des tatsächlichen, strategischen Bedarfs an Cloud-Portabilität getroffen werden muss.

## Zweck, Mental Model und Dependencies

CloudWatch-Metriken werden automatisch für viele AWS-Dienste bereitgestellt (z. B. CPU-Auslastung einer EC2-Instanz, Invocation-Anzahl einer Lambda-Funktion), ohne dass eine zusätzliche Instrumentierung durch den Kunden notwendig ist — dies stellt einen erheblichen Vorteil gegenüber einer vollständig manuell instrumentierten Lösung dar, da grundlegende Betriebssignale bereits verfügbar sind. CloudWatch-Alarme überwachen diese Metriken gegen definierte Schwellenwerte und können automatisierte Reaktionen auslösen (z. B. eine Benachrichtigung, eine Auto-Scaling-Aktion). Diese Metriken und Logs sind jedoch standardmäßig auf den AWS-Account und die Region beschränkt, in der die zugrunde liegende Ressource läuft — eine Organisation mit mehreren AWS-Accounts (z. B. getrennte Accounts pro Team oder Umgebung, siehe [KB-0463](01-aws-organisationen-und-landing-zones.md)) benötigt eine explizite, zusätzliche Konfiguration (z. B. CloudWatch Cross-Account Observability), um Metriken und Logs kontenübergreifend zu aggregieren und zu korrelieren — ohne diese Konfiguration entsteht eine faktische Beobachtbarkeitslücke, bei der Betriebsprobleme, die mehrere Accounts betreffen, nicht ganzheitlich sichtbar sind, obwohl die zugrunde liegenden Daten in jedem einzelnen Account tatsächlich vorhanden wären. OpenTelemetry stellt demgegenüber einen herstellerneutralen Standard für Instrumentierung dar, der es ermöglicht, dieselbe Instrumentierungslogik unabhängig vom zugrunde liegenden Cloud-Anbieter oder Observability-Backend zu nutzen, mit dem Vorteil größerer Portabilität (z. B. bei einer späteren Multi-Cloud-Strategie oder einem Anbieterwechsel), jedoch typischerweise mit größerem initialem Instrumentierungsaufwand gegenüber der automatisch verfügbaren, AWS-nativen CloudWatch-Integration. Der zentrale methodische Punkt ist, dass diese Entscheidung nicht pauschal zugunsten einer der beiden Optionen getroffen werden sollte, sondern anhand des tatsächlichen, strategischen Bedarfs an Cloud-Portabilität — für Organisationen mit einer klaren, langfristigen Festlegung auf AWS kann die einfachere, automatisch verfügbare CloudWatch-Integration überwiegen, während Organisationen mit tatsächlichem Multi-Cloud-Bedarf oder einer bewussten Anti-Lock-in-Strategie den zusätzlichen Instrumentierungsaufwand von OpenTelemetry investieren sollten.

~~~text
CloudWatch metrics: AUTOMATICALLY available for many AWS services (EC2 CPU, Lambda invocations)
  -> no extra customer instrumentation needed for basic operational signals
CloudWatch alarms: monitor metrics against thresholds, trigger automated responses
BUT: metrics/logs scoped to ONE account + region by DEFAULT
  multi-account org (see KB-0463) -> cross-account aggregation requires EXPLICIT extra config
    (CloudWatch Cross-Account Observability)
  -> without it: REAL observability gap for cross-account issues
     even though underlying data EXISTS in each individual account
OpenTelemetry: vendor-neutral instrumentation standard
  -> same instrumentation logic PORTABLE regardless of cloud provider/observability backend
  -> greater portability (multi-cloud strategy, later vendor switch)
     BUT typically HIGHER initial instrumentation effort vs. auto-available CloudWatch
KEY METHODOLOGICAL POINT: NOT a blanket choice
  -> based on ACTUAL strategic need for cloud portability
  clear long-term AWS commitment -> simpler, auto-available CloudWatch may dominate
  real multi-cloud need / deliberate anti-lock-in strategy -> OpenTelemetry effort justified
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Automatische CloudWatch-Metriken | grundlegende Betriebssignale ohne Zusatzaufwand | Umfang variiert je nach AWS-Dienst, nicht alle Signale automatisch verfügbar |
| CloudWatch-Alarme | überwachen Metriken gegen Schwellenwerte | können automatisierte Reaktionen auslösen |
| Accountgrenzen | Metriken/Logs standardmäßig auf einen Account/Region beschränkt | kontenübergreifende Aggregation erfordert explizite Konfiguration |
| OpenTelemetry | herstellerneutrale Instrumentierung | Portabilitätsvorteil gegen höheren initialen Aufwand abwägen |

Implementierung: Für Multi-Account-Organisationen wird explizit geprüft, ob kontenübergreifende Observability-Aggregation benötigt wird, und die entsprechende CloudWatch-Cross-Account-Konfiguration wird eingerichtet, statt eine faktische Beobachtbarkeitslücke unbemerkt bestehen zu lassen. Die Entscheidung zwischen nativer CloudWatch-Instrumentierung und OpenTelemetry wird anhand des tatsächlichen, strategischen Bedarfs an Cloud-Portabilität getroffen, nicht anhand einer pauschalen Präferenz für Standardisierung oder AWS-native Integration. Bei der Wahl für OpenTelemetry wird der zusätzliche Instrumentierungsaufwand explizit gegen den tatsächlichen Portabilitätsnutzen abgewogen, bevor eine unternehmensweite Migration von automatisch verfügbaren CloudWatch-Signalen eingeleitet wird.

## Scalability, Reliability, Security und Observability

CloudWatch skaliert die Betriebssichtbarkeit proportional zur Vollständigkeit der kontenübergreifenden Konfiguration in Multi-Account-Organisationen; die Reliability-Grenze liegt darin, dass eine fehlende Cross-Account-Aggregation proportional zur Anzahl betroffener Accounts zu einer faktischen Beobachtbarkeitslücke für übergreifende Betriebsprobleme führt, obwohl die zugrunde liegenden Daten in jedem einzelnen Account tatsächlich vorhanden sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein übergreifendes Betriebsproblem über mehrere AWS-Accounts hinweg wird nicht ganzheitlich sichtbar | kontenübergreifende CloudWatch-Aggregation ist nicht konfiguriert | CloudWatch Cross-Account Observability einrichten und die kontenübergreifende Sichtbarkeit verifizieren |
| die Observability-Kosten sind höher als erwartet | zu viele, granulare benutzerdefinierte Metriken werden ohne tatsächlichen Bedarf erfasst | die tatsächlich genutzten Metriken gegen die konfigurierten prüfen und ungenutzte entfernen |
| ein Team investiert erheblichen Aufwand in OpenTelemetry-Instrumentierung ohne klaren Multi-Cloud-Bedarf | der tatsächliche strategische Bedarf an Portabilität wurde nicht vor der Entscheidung geprüft | den tatsächlichen, dokumentierten Bedarf an Cloud-Portabilität neu bewerten |

Security: CloudWatch-Zugriff sollte über dedizierte, eng gefasste IAM-Policies geregelt werden, da Logs potenziell sensible Informationen enthalten können, die nicht jedem Nutzer zugänglich sein sollten. Observability: Die tatsächliche Vollständigkeit der kontenübergreifenden Metrik-Aggregation, die Kosten pro erfasster Metrik-Kategorie, und die Abdeckung kritischer Betriebssignale sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** prüft den tatsächlichen Bedarf an kontenübergreifender Aggregation für Multi-Account-Organisationen. **Principal** macht die Abwägung zwischen CloudWatch und OpenTelemetry für das Team nachvollziehbar. **Chief** legt Observability-Richtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von AWS-nativer Integrationstiefe zu Portabilität fest.

Anti-Patterns: eine Multi-Account-Organisation ohne kontenübergreifende CloudWatch-Aggregation betreiben und dadurch eine unbemerkte Beobachtbarkeitslücke riskieren; OpenTelemetry ohne tatsächlichen, dokumentierten Bedarf an Cloud-Portabilität einführen und dadurch unnötigen Instrumentierungsaufwand verursachen; granulare, benutzerdefinierte Metriken ohne Prüfung des tatsächlichen Nutzens erfassen und dadurch unnötige Kosten verursachen.

## Production Checklist

- [ ] Kontenübergreifende CloudWatch-Aggregation ist für Multi-Account-Organisationen konfiguriert, sofern tatsächlich benötigt.
- [ ] Die Entscheidung zwischen CloudWatch und OpenTelemetry ist anhand des tatsächlichen Portabilitätsbedarfs begründet.
- [ ] Erfasste, benutzerdefinierte Metriken sind gegen tatsächlichen Nutzen geprüft.
- [ ] Zugriff auf CloudWatch-Logs ist über dedizierte IAM-Policies geregelt.

## Interviewfragen

### 1. Was ist der zentrale Nachteil der standardmäßigen CloudWatch-Kontengrenze?

**Antwort:** Metriken und Logs sind standardmäßig auf einen AWS-Account und eine Region beschränkt; kontenübergreifende Aggregation für Multi-Account-Organisationen erfordert explizite, zusätzliche Konfiguration.

### 2. Was ist der zentrale Trade-off zwischen nativer CloudWatch-Instrumentierung und OpenTelemetry?

**Antwort:** CloudWatch bietet automatisch verfügbare Betriebssignale für AWS-Dienste mit geringerem initialem Aufwand, aber potenziellem Vendor-Lock-in; OpenTelemetry bietet herstellerneutrale Portabilität, erfordert jedoch typischerweise höheren Instrumentierungsaufwand.

### 3. Wann ist die Entscheidung für OpenTelemetry gegenüber nativer CloudWatch-Integration gerechtfertigt?

**Antwort:** Wenn ein tatsächlicher, strategischer Bedarf an Multi-Cloud-Portabilität oder eine bewusste Anti-Lock-in-Strategie besteht, der den höheren Instrumentierungsaufwand rechtfertigt.

### 4. Warum kann in einer Multi-Account-Organisation trotz vorhandener Daten eine Beobachtbarkeitslücke entstehen?

**Antwort:** Weil CloudWatch-Daten standardmäßig auf den jeweiligen Account beschränkt bleiben; ohne explizite, kontenübergreifende Aggregation sind übergreifende Betriebsprobleme nicht ganzheitlich sichtbar, obwohl die zugrunde liegenden Daten in jedem Account vorhanden sind.

### 5. Wie gehst du vor, wenn ein übergreifendes Betriebsproblem über mehrere AWS-Accounts hinweg nicht ganzheitlich sichtbar wird?

**Antwort:** Ich prüfe, ob kontenübergreifende CloudWatch-Aggregation konfiguriert ist, und richte diese gegebenenfalls ein, um die vorhandenen, aber isolierten Daten aus allen betroffenen Accounts sichtbar zu machen.

### 6. Widersprüchliche Anforderung: Team will minimalen Instrumentierungsaufwand (nur CloudWatch) UND langfristige Flexibilität für einen möglichen Multi-Cloud-Wechsel — wie gehst du vor?

**Antwort:** Ich würde den tatsächlichen Zeithorizont und die Wahrscheinlichkeit eines Multi-Cloud-Wechsels klären; ist dieser real und absehbar, würde ich gezielt für kritische, langfristig relevante Komponenten OpenTelemetry einführen, während für kurzfristig relevante, AWS-spezifische Komponenten die einfachere CloudWatch-Integration genutzt wird, statt eine pauschale Entscheidung für das gesamte System zu treffen.

## Praktische Labs

~~~python
# Conceptual cross-account observability gap check (not executed against a real AWS account):

def check_cross_account_observability(accounts, cross_account_aggregation_configured):
    if len(accounts) > 1 and not cross_account_aggregation_configured:
        return {"gap_detected": True, "affected_accounts": accounts, "recommendation": "configure CloudWatch Cross-Account Observability"}
    return {"gap_detected": False, "affected_accounts": [], "recommendation": "no action needed"}

result = check_cross_account_observability(
    accounts=["team-a-account", "team-b-account", "shared-services-account"],
    cross_account_aggregation_configured=False,
)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon CloudWatch — Cross-Account Observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Unified-Cross-Account.html), abgerufen 2026-09-18.
2. OpenTelemetry-Dokumentation: [OpenTelemetry — What Is OpenTelemetry?](https://opentelemetry.io/docs/what-is-opentelemetry/), abgerufen 2026-09-18.

EC2 und Auto Scaling sind kanonisch in [KB-0468](06-ec2-und-auto-scaling.md) behandelt; AWS Lambda in [KB-0472](10-aws-lambda.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Native, vereinfachte OpenTelemetry-Kompatibilität innerhalb von CloudWatch (AWS Distro for OpenTelemetry), die beide Ansätze kombiniert | Adopting | Gegenüber einer strikten Entweder-oder-Entscheidung bevorzugen, sobald die tatsächliche Funktionsäquivalenz für die eigenen Anforderungen geprüft ist. |

Ein Team akzeptiert eine Observability-Strategie erst, wenn kontenübergreifende Beobachtbarkeitslücken explizit geprüft und die Wahl zwischen CloudWatch und OpenTelemetry anhand des tatsächlichen, dokumentierten Portabilitätsbedarfs begründet ist.
