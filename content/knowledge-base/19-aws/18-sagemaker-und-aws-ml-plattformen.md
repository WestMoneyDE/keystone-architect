---
{"id": "KB-0480", "title": "SageMaker und AWS-ML-Plattformen", "domain": "19", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0356", "concepts": ["Model Registries und Freigabestatus"], "needed_for": "understanding"}, {"id": "KB-0479", "concepts": ["Amazon Bedrock"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein SageMaker-Trainingsjob mit Registrierung des resultierenden Modells in einer Model Registry und anschließender Endpunktbereitstellung anhand offizieller Dokumentation konzeptionell nachvollziehen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete ML-Plattform-Entscheidung begründet zwischen SageMaker (AWS-natives, integriertes Training/Deployment) und einer portableren, werkzeugbasierten Kombination (z. B. MLflow, siehe KB-0351) entscheiden, basierend auf tatsächlichem Portabilitäts- und Integrationstiefe-Bedarf.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Einschränkung bei einer Migration weg von SageMaker auf eine tatsächliche Abhängigkeit von SageMaker-spezifischen Funktionen zurückführen können, die in der ursprünglichen Architekturentscheidung nicht ausreichend berücksichtigt wurde.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "ML-Plattform-Richtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von AWS-nativer Integrationstiefe zu Portabilität statt anhand einer pauschalen Präferenz für eine bestimmte Plattform festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der SageMaker-Trainingsinfrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Training, Registry-Integration und Endpunktbereitstellung als Entscheidungsgrundlage, nicht die Trainingsinfrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0480-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Amazon-SageMaker-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie SageMaker Trainingsjobs, eine integrierte Model Registry und automatisierte Endpunktbereitstellung als zusammenhängenden, AWS-nativen ML-Lebenszyklus bereitstellt, und wie diese enge, integrierte Kopplung gegen die Portabilität einer werkzeugbasierten, anbieterunabhängigen Kombination (z. B. MLflow für Tracking/Registry mit separater Serving-Infrastruktur) abgewogen werden muss.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale SageMaker-Pipeline erstellt. Da sich AWS-ML-Dienste aktiv weiterentwickeln, sollten konkrete Funktionsdetails vor produktivem Einsatz gegen aktuelle Primärquellen geprüft werden."}]}
---
# SageMaker und AWS-ML-Plattformen

> **Ziel:** Amazon SageMaker bietet einen integrierten, AWS-nativen ML-Lebenszyklus — Trainingsjobs, eine Model Registry (die Modellversionen mit Metadaten verwaltet, konzeptionell vergleichbar mit werkzeugbasierten Ansätzen wie MLflow, siehe Model Registries und Freigabestatus, [KB-0356](../15-mlops-evaluation/06-model-registries-und-freigabestatus.md)), und automatisierte Endpunktbereitstellung sind eng miteinander verzahnt und über dieselbe AWS-Infrastruktur und IAM-Berechtigungsstruktur (siehe [KB-0464](02-aws-iam-und-rollenmodell.md)) integriert. Der zentrale Punkt dieses Kapitels ist, dass diese enge Integration einen erheblichen Betriebsvorteil bietet (weniger Integrationsaufwand zwischen einzelnen Werkzeugen, konsistente AWS-native Berechtigungsverwaltung über den gesamten ML-Lebenszyklus hinweg), gleichzeitig jedoch eine engere Kopplung an AWS bedeutet als eine werkzeugbasierte, anbieterunabhängige Kombination (z. B. MLflow für Tracking und Registry mit einer separaten, portablen Serving-Infrastruktur) — diese Abwägung zwischen Integrationstiefe und Portabilität muss anhand des tatsächlichen, strategischen Bedarfs der Organisation getroffen werden, nicht anhand einer pauschalen Präferenz für die eine oder andere Option.

## Zweck, Mental Model und Dependencies

Ein SageMaker-Trainingsjob führt Trainingscode in einer verwalteten, für das Training optimierten Infrastruktur aus, wobei Ressourcenzuweisung, Skalierung und grundlegende Infrastrukturverwaltung von AWS übernommen werden — dies reduziert den betrieblichen Aufwand gegenüber einer selbst verwalteten Trainingsinfrastruktur erheblich. Das resultierende, trainierte Modell kann direkt in der SageMaker Model Registry registriert werden, die Modellversionen mit Metadaten, Freigabestatus und Abstammungsinformationen verwaltet — konzeptionell vergleichbar mit werkzeugbasierten Model Registries wie MLflow, jedoch nativ in die AWS-Infrastruktur integriert, was bedeutet, dass Zugriffskontrolle, Versionsverwaltung und nachgelagerte Bereitstellung ohne zusätzliche Integrationsschicht zwischen unterschiedlichen Werkzeugen erfolgen. Ein registriertes Modell kann anschließend über SageMaker Endpoints automatisiert als produktiver Inferenzdienst bereitgestellt werden, wobei Skalierung und Betrieb wiederum von AWS verwaltet werden. Der zentrale methodische Punkt ist, dass diese enge Integration zwischen Training, Registry und Bereitstellung zwar den Integrationsaufwand innerhalb der AWS-Umgebung erheblich reduziert, gleichzeitig jedoch eine Abhängigkeit von SageMaker-spezifischen Konzepten und APIs erzeugt, die eine spätere Migration zu einer anderen Plattform oder einem Multi-Cloud-Ansatz erschweren kann — eine Organisation mit tatsächlichem, strategischem Bedarf an Portabilität (z. B. eine bewusste Multi-Cloud-Strategie oder eine Anti-Lock-in-Politik) sollte diese Abhängigkeit explizit gegen den Integrationsvorteil abwägen, bevor eine unternehmensweite Festlegung auf SageMaker als zentrale ML-Plattform erfolgt, analog zur Abwägung zwischen AWS-nativer CloudWatch-Integration und herstellerneutraler OpenTelemetry-Instrumentierung (siehe [KB-0478](16-cloudwatch-und-aws-betriebssignale.md)).

~~~text
SageMaker: TIGHTLY integrated AWS-native ML lifecycle
  training job: managed, training-optimized infra, AWS handles resource allocation/scaling
  Model Registry: native AWS integration, versions + metadata + lineage
    conceptually similar to tool-based registries (MLflow, see KB-0356)
    but WITHOUT an extra integration layer between different tools
  Endpoint: automated deployment as a production inference service, AWS manages scaling/ops
KEY METHODOLOGICAL POINT: tight integration = SIGNIFICANTLY less integration overhead WITHIN AWS
  BUT creates dependency on SageMaker-SPECIFIC concepts/APIs
  -> harder LATER MIGRATION to another platform or multi-cloud approach
  -> org with ACTUAL strategic portability need (deliberate multi-cloud, anti-lock-in policy)
     must WEIGH this dependency against the integration benefit BEFORE committing org-wide
     (parallel to CloudWatch vs. OpenTelemetry trade-off, see KB-0478)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| SageMaker-Trainingsjob | verwaltete, für Training optimierte Infrastruktur | reduziert Betriebsaufwand, erzeugt SageMaker-spezifische Konfigurationsabhängigkeit |
| SageMaker Model Registry | nativ integrierte Versions-/Metadatenverwaltung | konzeptionell vergleichbar mit MLflow, aber AWS-gebunden |
| SageMaker Endpoints | automatisierte, verwaltete Endpunktbereitstellung | reduziert Deployment-Aufwand, erhöht Plattformabhängigkeit |
| Integrationstiefe versus Portabilität | zentraler strategischer Trade-off | muss anhand tatsächlichen Multi-Cloud-/Portabilitätsbedarfs entschieden werden |

Implementierung: Vor einer unternehmensweiten Festlegung auf SageMaker als zentrale ML-Plattform wird der tatsächliche, strategische Bedarf an Portabilität und Multi-Cloud-Fähigkeit explizit geprüft, um die Abwägung zwischen Integrationstiefe und Anbieterbindung bewusst zu treffen. Für Organisationen mit klarer, langfristiger AWS-Festlegung wird die enge SageMaker-Integration genutzt, um den Integrationsaufwand zwischen Training, Registry und Bereitstellung zu minimieren. Für Organisationen mit tatsächlichem Portabilitätsbedarf wird eine werkzeugbasierte, anbieterunabhängigere Kombination (z. B. MLflow für Tracking/Registry mit einer separaten, portablen Serving-Infrastruktur) evaluiert, auch wenn dies zusätzlichen Integrationsaufwand innerhalb der AWS-Umgebung bedeutet.

## Scalability, Reliability, Security und Observability

SageMaker skaliert die Betriebseffizienz des gesamten ML-Lebenszyklus proportional zur Nutzung seiner nativen Integration zwischen Training, Registry und Bereitstellung; die Reliability-Grenze liegt darin, dass eine ungeprüfte, unternehmensweite Festlegung auf SageMaker-spezifische Konzepte proportional zum tatsächlichen, später auftretenden Portabilitätsbedarf zu einer aufwendigen, unerwarteten Migrationsherausforderung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine geplante Migration weg von SageMaker erweist sich als deutlich aufwendiger als erwartet | die Architektur nutzt SageMaker-spezifische Funktionen, deren Abhängigkeit bei der ursprünglichen Entscheidung nicht ausreichend berücksichtigt wurde | die tatsächliche Abhängigkeit von SageMaker-spezifischen Konzepten dokumentieren und Migrationsschritte entsprechend planen |
| die Integration zwischen Training, Registry und Bereitstellung erfordert unerwartet viel manuellen Zusatzaufwand | eine werkzeugbasierte, nicht vollständig SageMaker-native Kombination wird genutzt, ohne die zusätzliche Integrationsebene bewusst in Kauf zu nehmen | prüfen, ob eine vollständigere SageMaker-Integration den zusätzlichen Aufwand reduzieren würde, oder ob die Portabilität diesen Mehraufwand rechtfertigt |
| ein Team benötigt tatsächlich Multi-Cloud-Fähigkeit, die durch SageMaker-spezifische Abhängigkeiten eingeschränkt ist | die ursprüngliche Plattformentscheidung hat den tatsächlichen Portabilitätsbedarf nicht ausreichend berücksichtigt | den tatsächlichen Portabilitätsbedarf neu bewerten und eine Migration zu einer werkzeugbasierten, anbieterunabhängigeren Lösung evaluieren |

Security: SageMaker-Zugriff sollte über dedizierte, eng gefasste IAM-Rollen für jede Phase des ML-Lebenszyklus (Training, Registry, Bereitstellung) getrennt konfiguriert werden, konsistent mit der allgemeinen AWS-IAM-Praxis. Observability: Die tatsächliche Nutzung SageMaker-spezifischer Funktionen (als Indikator für die tatsächliche Portabilitätseinschränkung), sowie der Betriebsaufwand für Training, Registry-Integration und Bereitstellung, sind zentrale Metriken zur Bewertung der Plattformentscheidung.

## Trade-offs und Entscheidungen

**Staff** dokumentiert die tatsächliche Abhängigkeit von SageMaker-spezifischen Funktionen, bevor eine Architektur unternehmensweit darauf festgelegt wird. **Principal** macht die Abwägung zwischen Integrationstiefe und Portabilität für das Team nachvollziehbar. **Chief** legt ML-Plattform-Richtlinien im Unternehmen anhand des tatsächlichen Verhältnisses von AWS-nativer Integrationstiefe zu Portabilität fest.

Anti-Patterns: eine unternehmensweite Festlegung auf SageMaker treffen, ohne den tatsächlichen, strategischen Portabilitätsbedarf zu prüfen; eine werkzeugbasierte, teilweise SageMaker-native Kombination nutzen, ohne die zusätzliche Integrationsebene bewusst gegen die Portabilität abzuwägen; die tatsächliche Abhängigkeit von SageMaker-spezifischen Funktionen nicht dokumentieren, bevor eine spätere Migration geplant wird.

## Production Checklist

- [ ] Der tatsächliche, strategische Bedarf an Portabilität und Multi-Cloud-Fähigkeit ist vor der Plattformentscheidung geprüft.
- [ ] Die Abhängigkeit von SageMaker-spezifischen Funktionen ist dokumentiert.
- [ ] IAM-Rollen sind für jede Phase des ML-Lebenszyklus dediziert und eng gefasst konfiguriert.
- [ ] Der Betriebsaufwand für Training, Registry-Integration und Bereitstellung wird regelmäßig gegen den erwarteten Nutzen der Integrationstiefe geprüft.

## Interviewfragen

### 1. Welchen zentralen Betriebsvorteil bietet die enge Integration von SageMaker?

**Antwort:** Reduzierter Integrationsaufwand zwischen Training, Registry und Bereitstellung sowie konsistente, AWS-native Berechtigungsverwaltung über den gesamten ML-Lebenszyklus hinweg.

### 2. Welchen strategischen Nachteil kann diese enge Integration mit sich bringen?

**Antwort:** Eine engere Kopplung an AWS-spezifische Konzepte und APIs, die eine spätere Migration zu einer anderen Plattform oder einem Multi-Cloud-Ansatz erschweren kann.

### 3. Womit ist die Trade-off-Entscheidung zwischen SageMaker und einer werkzeugbasierten Kombination vergleichbar?

**Antwort:** Mit der Abwägung zwischen AWS-nativer CloudWatch-Integration und herstellerneutraler OpenTelemetry-Instrumentierung — beide erfordern eine bewusste Entscheidung zwischen Integrationstiefe und Portabilität.

### 4. Wann ist eine unternehmensweite Festlegung auf SageMaker angemessen?

**Antwort:** Wenn eine Organisation eine klare, langfristige AWS-Festlegung hat und der Integrationsvorteil den tatsächlich fehlenden Bedarf an Multi-Cloud-Portabilität überwiegt.

### 5. Wie gehst du vor, wenn eine geplante Migration weg von SageMaker sich als deutlich aufwendiger als erwartet erweist?

**Antwort:** Ich dokumentiere die tatsächliche Abhängigkeit von SageMaker-spezifischen Funktionen, die bei der ursprünglichen Architekturentscheidung nicht ausreichend berücksichtigt wurde, und plane die Migrationsschritte entsprechend dieser dokumentierten Abhängigkeiten.

### 6. Widersprüchliche Anforderung: Team will maximale Betriebseffizienz (volle SageMaker-Integration) UND langfristige Flexibilität für einen möglichen Anbieterwechsel — wie gehst du vor?

**Antwort:** Ich würde den tatsächlichen Zeithorizont und die Wahrscheinlichkeit eines Anbieterwechsels klären und, falls real und absehbar, gezielt Abstraktionsschichten (z. B. werkzeugbasiertes Tracking) für kritische, langfristig relevante Komponenten einführen, während weniger kritische Komponenten von der vollen SageMaker-Integration profitieren.

## Praktische Labs

~~~python
# Conceptual SageMaker-specific dependency documentation check (not executed against a real AWS account):

def check_platform_dependency(uses_sagemaker_training, uses_sagemaker_registry, uses_sagemaker_endpoints, portability_need):
    dependency_score = sum([uses_sagemaker_training, uses_sagemaker_registry, uses_sagemaker_endpoints])
    risk = "HIGH" if dependency_score >= 2 and portability_need == "high" else "acceptable"
    return {"dependency_score": dependency_score, "portability_risk": risk}

case_high_lockin_high_need = check_platform_dependency(True, True, True, portability_need="high")
case_low_lockin_high_need = check_platform_dependency(True, False, False, portability_need="high")

print(case_high_lockin_high_need)
print(case_low_lockin_high_need)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon SageMaker — Model Registry](https://docs.aws.amazon.com/sagemaker/latest/dg/model-registry.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Amazon SageMaker — Deploying Models to Endpoints](https://docs.aws.amazon.com/sagemaker/latest/dg/deploy-model.html), abgerufen 2026-09-18.

Model Registries und Freigabestatus sind kanonisch in [KB-0356](../15-mlops-evaluation/06-model-registries-und-freigabestatus.md) behandelt; Amazon Bedrock in [KB-0479](17-amazon-bedrock.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte SageMaker-Unterstützung für offene, portable Modellformate und Werkzeug-Interoperabilität (z. B. MLflow-Integration innerhalb von SageMaker) | Evaluating | Gegenüber vollständig proprietären SageMaker-Workflows bevorzugen, sobald die tatsächliche Interoperabilitätstiefe für die eigene Portabilitätsanforderung geprüft ist. |

Ein Team akzeptiert eine unternehmensweite SageMaker-Festlegung erst, wenn der tatsächliche, strategische Portabilitätsbedarf geprüft und die resultierende Abhängigkeit von SageMaker-spezifischen Funktionen dokumentiert ist.
