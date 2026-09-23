---
{"id": "KB-0479", "title": "Amazon Bedrock", "domain": "19", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0464", "concepts": ["AWS IAM und Rollenmodell"], "needed_for": "understanding"}, {"id": "KB-0268", "concepts": ["Verwaltete Modellplattformen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Bedrock-Modellzugriff mit einer dedizierten IAM-Rolle anhand offizieller Dokumentation konfigurieren können und erklären, welche Datenweitergabe-Einstellungen für Modellanbieter standardmäßig gelten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Unternehmensintegration prüfen, welche Modellanbieter-Fähigkeiten (Kontextlänge, Tool-Use, Feinabstimmung) über Bedrock tatsächlich verfügbar sind, statt allgemeine, anbieterübergreifende Modellversprechen ungeprüft zu übernehmen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Diskrepanz zwischen einer allgemein bekannten Modellfähigkeit und dem tatsächlich über Bedrock verfügbaren Funktionsumfang auf eine noch nicht integrierte oder eingeschränkte Provider-Anbindung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Managed-Model-Plattform-Richtlinien im Unternehmen anhand tatsächlich verifizierter, dokumentierter Provider-Fähigkeiten statt anhand allgemeiner Modell-Ankündigungen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Bedrock-Modell-Routing-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von IAM-Integration, Datenweitergabe und Provider-Fähigkeitsprüfung als Entscheidungsgrundlage, nicht die Bedrock-Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0479-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Amazon-Bedrock-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie Bedrock einheitlichen API-Zugriff auf mehrere Foundation-Model-Anbieter innerhalb der AWS-Infrastruktur bereitstellt, wie IAM-basierte Zugriffskontrolle den Modellzugang regelt, welche Datenweitergabe-Einstellungen standardmäßig gelten, und warum die tatsächlich über Bedrock verfügbaren Modellfähigkeiten explizit gegen allgemeine, anbieterübergreifende Modellversprechen geprüft werden müssen.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale Bedrock-Integration erstellt."}]}
---
# Amazon Bedrock

> **Ziel:** Amazon Bedrock stellt einheitlichen, IAM-integrierten API-Zugriff (siehe AWS IAM und Rollenmodell, [KB-0464](02-aws-iam-und-rollenmodell.md)) auf mehrere Foundation-Model-Anbieter innerhalb der AWS-Infrastruktur bereit, ohne dass der Kunde mit jedem Modellanbieter separate Verträge oder Infrastruktur-Integrationen aufbauen muss. Der zentrale Punkt dieses Kapitels ist, dass die tatsächlich über Bedrock verfügbaren Modellfähigkeiten (Kontextlänge, Tool-Use-Unterstützung, Feinabstimmungsmöglichkeiten, unterstützte Modellversionen) für jeden Anbieter separat und explizit gegen die offizielle, aktuelle Bedrock-Dokumentation geprüft werden müssen, statt allgemeine, aus anderen Kontexten bekannte Modellversprechen des jeweiligen Anbieters ungeprüft auf die Bedrock-Integration zu übertragen — die Integration eines Modellanbieters in Bedrock kann zeitlich verzögert gegenüber dessen allgemeiner Verfügbarkeit erfolgen und muss nicht notwendigerweise den vollständigen Funktionsumfang der ursprünglichen Anbieter-API abdecken.

## Zweck, Mental Model und Dependencies

Bedrock abstrahiert den Zugriff auf unterschiedliche Foundation-Model-Anbieter hinter einer gemeinsamen AWS-API und einem gemeinsamen IAM-basierten Zugriffskontrollmodell — dies bedeutet, dass ein Kunde, der bereits AWS-IAM-Rollen (siehe [KB-0464](02-aws-iam-und-rollenmodell.md)) für andere AWS-Dienste nutzt, dieselbe Berechtigungsstruktur auch für den Modellzugriff verwenden kann, statt separate Authentifizierungsmechanismen für jeden einzelnen Modellanbieter zu pflegen. Datenweitergabe-Einstellungen (ob und wie Anfragen und Antworten an den zugrunde liegenden Modellanbieter zur Verbesserung von dessen Modellen genutzt werden dürfen) sind ein zentraler Aspekt, der explizit geprüft und konfiguriert werden muss, da Standardeinstellungen je nach Anbieter und vertraglicher Vereinbarung unterschiedlich ausfallen können — eine unternehmensweite Nutzung sollte diese Einstellungen explizit gegen die tatsächlichen Datenschutz- und Compliance-Anforderungen der Organisation prüfen, statt Standardwerte unreflektiert zu übernehmen. Der zentrale methodische Punkt ist, dass die Integration eines bestimmten Modellanbieters oder einer bestimmten Modellversion in Bedrock ein eigenständiger, von der allgemeinen Verfügbarkeit dieses Modells unabhängiger Prozess ist — ein neues, allgemein angekündigtes Modell eines Anbieters ist nicht automatisch und nicht notwendigerweise mit vollem Funktionsumfang sofort über Bedrock verfügbar, und selbst wenn ein Modell über Bedrock verfügbar ist, kann der dort zugängliche Funktionsumfang (z. B. bestimmte erweiterte API-Parameter, Tool-Use-Fähigkeiten, oder Feinabstimmungsoptionen) von der direkten, nativen API des Anbieters abweichen. Diese Prüfung muss für jeden konkreten Anwendungsfall gegen die zum jeweiligen Zeitpunkt aktuelle, offizielle Bedrock-Dokumentation erfolgen, statt allgemeine, möglicherweise veraltete oder anbieterseitig (nicht Bedrock-seitig) gültige Aussagen über Modellfähigkeiten ungeprüft zu übernehmen.

~~~text
Bedrock: unified, IAM-integrated API access to MULTIPLE foundation model providers within AWS infra
  -> customer reuses EXISTING IAM roles (see KB-0464) instead of separate auth per provider
Data-sharing settings: whether/how requests-responses may be used by the provider to improve models
  -> DEFAULTS vary by provider/contract -- must be EXPLICITLY checked against actual compliance needs
KEY METHODOLOGICAL POINT: provider/model integration into Bedrock is a SEPARATE process
  from that model's GENERAL availability
  -> newly announced model NOT automatically/immediately available via Bedrock with FULL feature parity
  -> even when available: feature scope (advanced params, tool-use, fine-tuning)
     CAN differ from the provider's NATIVE, direct API
  -> MUST check against CURRENT official Bedrock docs for the SPECIFIC use case
     never assume general, possibly-outdated or provider-native (non-Bedrock) capability claims apply
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Einheitlicher API-Zugriff | vereinfacht Zugriff auf mehrere Modellanbieter | Funktionsumfang pro Anbieter kann dennoch variieren |
| IAM-Integration | nutzt bestehende AWS-Berechtigungsstruktur | vermeidet separate Authentifizierung pro Modellanbieter |
| Datenweitergabe-Einstellungen | regeln Nutzung von Anfragen/Antworten durch Anbieter | müssen explizit gegen Datenschutz-/Compliance-Anforderungen geprüft werden |
| Provider-Feature-Parität | Bedrock-Funktionsumfang versus nativer Anbieter-API | muss für jeden konkreten Anwendungsfall aktuell verifiziert werden |

Implementierung: Vor dem produktiven Einsatz eines über Bedrock zugänglichen Modells wird der tatsächliche, aktuell verfügbare Funktionsumfang (Kontextlänge, Tool-Use, unterstützte Parameter) explizit gegen die offizielle, aktuelle Bedrock-Dokumentation geprüft, statt allgemeine Modellversprechen des Anbieters zu übernehmen. Datenweitergabe-Einstellungen werden für jeden genutzten Modellanbieter explizit konfiguriert und gegen die tatsächlichen Datenschutz-Anforderungen der Organisation geprüft. IAM-Rollen für Bedrock-Zugriff werden nach dem Prinzip geringster Berechtigung konfiguriert, konsistent mit der allgemeinen AWS-IAM-Praxis.

## Scalability, Reliability, Security und Observability

Amazon Bedrock skaliert die organisatorische Integrationseinfachheit über mehrere Modellanbieter proportional zur bereits etablierten AWS-IAM-Infrastruktur; die Reliability-Grenze liegt darin, dass eine ungeprüfte Annahme über Feature-Parität zwischen einem Modellanbieter und dessen Bedrock-Integration proportional zur Diskrepanz zu unerwarteten, fehlenden Funktionen im produktiven Einsatz führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine allgemein bekannte Modellfähigkeit ist über Bedrock nicht wie erwartet verfügbar | die Bedrock-Integration dieses Anbieters/Modells deckt diese spezifische Fähigkeit noch nicht oder mit Einschränkungen ab | die aktuelle, offizielle Bedrock-Dokumentation für den spezifischen Anbieter und die konkrete Fähigkeit prüfen |
| Datenweitergabe an einen Modellanbieter erfolgt entgegen der tatsächlichen Compliance-Anforderung | die Datenweitergabe-Einstellungen wurden nicht explizit geprüft und auf Standardwerten belassen | die Datenweitergabe-Einstellungen für jeden genutzten Anbieter explizit gegen die Compliance-Anforderungen prüfen und anpassen |
| ein neu angekündigtes Modell ist nicht sofort über Bedrock nutzbar | die Bedrock-Integration dieses Modells ist noch nicht abgeschlossen, unabhängig von dessen allgemeiner Verfügbarkeit | den tatsächlichen Integrationsstatus in der aktuellen Bedrock-Dokumentation prüfen, statt allgemeine Verfügbarkeit anzunehmen |

Security: IAM-Rollen für Bedrock-Zugriff sollten dediziert und eng gefasst konfiguriert werden, mit expliziter Prüfung, welche Anwendungen tatsächlich Zugriff auf welche Modellanbieter benötigen. Observability: Die tatsächliche Nutzung pro Modellanbieter, die Konsistenz der Datenweitergabe-Einstellungen über alle genutzten Anbieter hinweg, und Abweichungen zwischen erwartetem und tatsächlich verfügbarem Funktionsumfang sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** prüft den tatsächlichen, aktuellen Funktionsumfang jedes über Bedrock genutzten Modells gegen die offizielle Dokumentation. **Principal** macht Datenweitergabe-Einstellungen und Provider-Feature-Unterschiede für das Team nachvollziehbar. **Chief** legt Managed-Model-Plattform-Richtlinien im Unternehmen anhand tatsächlich verifizierter Provider-Fähigkeiten fest.

Anti-Patterns: allgemeine, anbieterseitige Modellversprechen ungeprüft auf die Bedrock-Integration übertragen; Datenweitergabe-Einstellungen ohne explizite Prüfung gegen tatsächliche Compliance-Anforderungen auf Standardwerten belassen; annehmen, dass ein neu angekündigtes Modell automatisch und mit vollem Funktionsumfang sofort über Bedrock verfügbar ist.

## Production Checklist

- [ ] Der tatsächliche Funktionsumfang jedes genutzten Bedrock-Modells ist gegen die aktuelle, offizielle Dokumentation geprüft.
- [ ] Datenweitergabe-Einstellungen sind für jeden genutzten Modellanbieter explizit konfiguriert und geprüft.
- [ ] IAM-Rollen für Bedrock-Zugriff sind nach dem Prinzip geringster Berechtigung konfiguriert.
- [ ] Abweichungen zwischen erwartetem und tatsächlich verfügbarem Funktionsumfang werden dokumentiert.

## Interviewfragen

### 1. Was ist der zentrale Vorteil von Amazon Bedrock gegenüber der direkten Integration mehrerer Modellanbieter-APIs?

**Antwort:** Einheitlicher, IAM-integrierter Zugriff auf mehrere Foundation-Model-Anbieter innerhalb der AWS-Infrastruktur, wodurch bestehende AWS-Berechtigungsstrukturen wiederverwendet werden können, statt separate Authentifizierung pro Anbieter zu pflegen.

### 2. Warum sollte der über Bedrock verfügbare Funktionsumfang eines Modells nicht automatisch als vollständig gegenüber der nativen Anbieter-API angenommen werden?

**Antwort:** Weil die Integration eines Modellanbieters oder einer Modellversion in Bedrock ein eigenständiger Prozess ist, der zeitlich verzögert und mit potenziell eingeschränktem Funktionsumfang gegenüber der allgemeinen, nativen API-Verfügbarkeit erfolgen kann.

### 3. Warum müssen Datenweitergabe-Einstellungen bei Bedrock explizit geprüft werden?

**Antwort:** Weil Standardeinstellungen je nach Modellanbieter und vertraglicher Vereinbarung unterschiedlich ausfallen können und explizit gegen die tatsächlichen Datenschutz- und Compliance-Anforderungen der Organisation geprüft werden müssen.

### 4. Was bedeutet es, dass Bedrock IAM-integriert ist?

**Antwort:** Bestehende AWS-IAM-Rollen können für die Zugriffskontrolle auf Modellanbieter genutzt werden, statt separate Authentifizierungsmechanismen für jeden einzelnen Anbieter einzurichten.

### 5. Wie gehst du vor, wenn eine allgemein bekannte Modellfähigkeit über Bedrock nicht wie erwartet verfügbar ist?

**Antwort:** Ich prüfe die aktuelle, offizielle Bedrock-Dokumentation für den spezifischen Anbieter und die konkrete Fähigkeit, da die Bedrock-Integration diese Fähigkeit möglicherweise noch nicht oder nur eingeschränkt abdeckt.

### 6. Widersprüchliche Anforderung: Team will sofort das neueste, extern angekündigte Modell eines Anbieters über Bedrock nutzen UND verlässliche, produktionsreife Funktionalität — wie gehst du vor?

**Antwort:** Ich würde den tatsächlichen Integrationsstatus dieses Modells in der aktuellen Bedrock-Dokumentation prüfen, statt von sofortiger, vollständiger Verfügbarkeit auszugehen, und gegebenenfalls empfehlen, mit einem bereits vollständig integrierten, verifizierten Modell zu beginnen, bis die Integration des neuen Modells offiziell abgeschlossen und dokumentiert ist.

## Praktische Labs

~~~python
# Conceptual Bedrock feature-parity verification checklist (not executed against a real AWS account):

def check_bedrock_feature_availability(claimed_features, verified_bedrock_features):
    unverified = [f for f in claimed_features if f not in verified_bedrock_features]
    return {
        "fully_verified": len(unverified) == 0,
        "unverified_features": unverified,
        "recommendation": "check current official Bedrock docs for these features" if unverified else "proceed",
    }

claimed_by_provider = ["128k_context", "tool_use", "fine_tuning", "vision_input"]
verified_via_bedrock_docs = ["128k_context", "tool_use"]  # fine_tuning and vision_input not yet confirmed

result = check_bedrock_feature_availability(claimed_by_provider, verified_via_bedrock_docs)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon Bedrock — Supported Foundation Models](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Amazon Bedrock — Data Protection and Privacy](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html), abgerufen 2026-09-18.

AWS IAM und Rollenmodell sind kanonisch in [KB-0464](02-aws-iam-und-rollenmodell.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Modell-Feature-Vergleichswerkzeuge, die Bedrock-Funktionsumfang gegen native Anbieter-APIs automatisch abgleichen | Evaluating | Gegenüber manueller Dokumentationsprüfung erst nach Verifikation der tatsächlichen Genauigkeit für die eigenen Anwendungsfälle bevorzugen. |

Ein Team akzeptiert die produktive Nutzung eines Bedrock-Modells erst, wenn dessen tatsächlicher Funktionsumfang und die Datenweitergabe-Einstellungen explizit gegen die aktuelle, offizielle Dokumentation verifiziert sind.
