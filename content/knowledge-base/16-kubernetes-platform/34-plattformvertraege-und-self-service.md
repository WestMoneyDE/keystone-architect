---
{"id": "KB-0412", "title": "Plattformverträge und Self-Service", "domain": "16", "sequence": 34, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0409", "concepts": ["Golden Paths und Paved Roads"], "needed_for": "understanding"}, {"id": "KB-0411", "concepts": ["Platform Scorecards und Produktwirkung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein einfaches Plattformangebot mit definierten Supportgrenzen und einer versionierten API-Schnittstelle dokumentieren, das ein Anwendungsteam eigenständig nutzen kann.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Mandantenisolation und Plattform-Ownership so organisieren, dass sie über reine Kubernetes-Clusterfunktionen hinausgeht und als eigenständige Produktverantwortung behandelt wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Plattform ohne definierte Supportgrenzen oder API-Versionierung betrieben wird, und die daraus resultierenden, unklaren Erwartungen zwischen Plattform- und Anwendungsteams diagnostizieren.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Interne Plattformen als Produkte mit expliziten Verträgen (Angebot, Supportgrenzen, API-Stabilität) statt als unverbindliche, informelle Infrastrukturbereitstellung im Unternehmen positionieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die formale Vertragsgestaltung interner Service-Level-Agreements im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Plattform als Produkt mit klaren Verträgen, nicht die juristische SLA-Detailausarbeitung."}}, "lab_validation": [{"lab_id": "KB-0412-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Szenario mit einer Plattform ohne definierte Supportgrenzen gegenüber einer Plattform mit explizitem Vertrag", "evidence": "Eine simulierte Plattform ohne dokumentierte Supportgrenzen führt zu wiederholten, unklaren Erwartungskonflikten zwischen Plattform- und Anwendungsteams über den Umfang der Unterstützung; eine Plattform mit explizit dokumentiertem Angebot, Supportgrenzen und API-Versionsgarantien reduziert diese Konflikte, da beide Seiten dieselbe, klare Erwartungsgrundlage teilen.", "limitations": "Kein produktives Plattformsystem, kein realer Geschäftsdatensatz, künstlich konstruiertes Erwartungskonfliktszenario."}]}
---
# Plattformverträge und Self-Service

> **Ziel:** Eine interne Plattform funktioniert als Produkt mit einem expliziten Vertrag gegenüber ihren nutzenden Anwendungsteams: einem klar definierten Angebot (was genau bietet die Plattform), Supportgrenzen (was wird unterstützt, was liegt explizit außerhalb der Verantwortung der Plattform), und API-Versionen (welche Stabilitätsgarantien gelten für die von der Plattform bereitgestellten Schnittstellen), aufbauend auf Golden Paths (siehe [KB-0409](31-golden-paths-und-paved-roads.md)) und Scorecards (siehe [KB-0411](33-platform-scorecards-und-produktwirkung.md)). Der zentrale Punkt dieses Kapitels ist, dass Developer Experience (DevEx), Mandantenisolation und Plattform-Ownership als eigenständige, bewusst organisierte Produktverantwortung behandelt werden müssen, die deutlich über die reinen technischen Clusterfunktionen hinausgeht.

## Zweck, Mental Model und Dependencies

Eine Plattform ohne expliziten Vertrag erzeugt ein grundlegendes organisatorisches Problem: Anwendungsteams wissen nicht mit Sicherheit, was sie von der Plattform erwarten können, und Plattformteams wissen nicht mit Sicherheit, wofür sie tatsächlich verantwortlich sind — dies führt zu wiederkehrenden, informellen Aushandlungen und Konflikten bei jedem konkreten Vorfall, statt auf einer gemeinsam geteilten, klaren Grundlage zu operieren. Ein Plattformvertrag macht drei Dinge explizit: das Angebot (welche konkreten Fähigkeiten, z. B. Deployment-Automatisierung, Observability-Integration, tatsächlich bereitgestellt werden), Supportgrenzen (welche Probleme das Plattformteam aktiv behebt, und welche explizit in der Verantwortung des Anwendungsteams liegen, z. B. anwendungsspezifische Logikfehler), und API-Versionen (welche Stabilitätsgarantien für von der Plattform bereitgestellte Schnittstellen gelten, damit Anwendungsteams verlässlich planen können, wann und wie sich diese Schnittstellen ändern dürfen). Der zentrale methodische Punkt ist, dass Developer Experience, Mandantenisolation und Plattform-Ownership nicht als Nebenprodukt reiner Kubernetes-Cluster-Bereitstellung entstehen, sondern eine eigenständige, bewusste Produktverantwortung erfordern: ein technisch korrekt konfigurierter Cluster allein garantiert weder eine gute Entwicklererfahrung (die zusätzliche, bewusst gestaltete Self-Service-Werkzeuge und Dokumentation erfordert) noch robuste Mandantenisolation (die über reine Namespace-Trennung hinaus explizite Governance-Entscheidungen erfordert, siehe die entsprechenden Multi-Mandanten-Grundlagen in vorherigen Kapiteln) noch klare Ownership (die eine aktiv gepflegte, nicht nur einmalig dokumentierte organisatorische Struktur voraussetzt).

~~~text
Platform WITHOUT explicit contract: fundamental organizational problem
  app teams don't reliably know what to expect; platform teams don't reliably know what they're responsible for
  -> repeated, informal negotiation and conflict at each incident, instead of a shared, clear baseline
Platform contract makes THREE things explicit:
  Offering: which concrete capabilities are actually provided
  Support boundaries: which problems the platform team actively fixes vs. explicitly the app team's responsibility
  API versions: stability guarantees for platform-provided interfaces -> app teams can plan reliably
KEY METHODOLOGICAL POINT: DevEx, tenant isolation, platform ownership are NOT byproducts of pure cluster provisioning
  -> require DELIBERATE, dedicated product responsibility
  a technically correct cluster alone guarantees NEITHER good DevEx (needs deliberate self-service tooling/docs)
  NOR robust tenant isolation (needs explicit governance beyond namespace separation)
  NOR clear ownership (needs actively maintained, not one-time-documented, org structure)
~~~

## Core Concepts, Architektur und Implementierung

| Vertragsbestandteil | Klärt | Risiko ohne diesen Bestandteil |
|---|---|---|
| Angebot | welche konkreten Fähigkeiten die Plattform bereitstellt | Anwendungsteams erwarten Fähigkeiten, die tatsächlich nicht angeboten werden |
| Supportgrenzen | wer für welche Art von Problem verantwortlich ist | wiederholte, informelle Aushandlung bei jedem Vorfall |
| API-Versionen | welche Stabilitätsgarantien für Plattform-Schnittstellen gelten | Anwendungsteams können nicht verlässlich planen, wann sich Schnittstellen ändern |
| DevEx/Isolation/Ownership als Produktverantwortung | organisiert bewusst über reine Clusterfunktionen hinaus | technisch korrekte Cluster garantieren keine gute Entwicklererfahrung oder klare Verantwortlichkeiten |

Implementierung: Jede interne Plattform dokumentiert explizit ihr Angebot, ihre Supportgrenzen und die Stabilitätsgarantien ihrer bereitgestellten Schnittstellen, und macht diese Dokumentation für alle nutzenden Anwendungsteams zugänglich (z. B. über den Servicekatalog, siehe [KB-0408](30-backstage-und-internal-developer-platforms.md)). Developer Experience wird als eigenständiges Ziel behandelt, mit bewusst gestalteten Self-Service-Werkzeugen, verständlicher Dokumentation und aktiv eingeholtem Entwicklerfeedback, statt sich implizit aus der reinen technischen Cluster-Bereitstellung zu ergeben. Mandantenisolation wird explizit über Governance-Entscheidungen (siehe die entsprechenden Multi-Mandanten-Grundlagen) statt nur über technische Namespace-Trennung hergestellt. Plattform-Ownership wird als aktiv gepflegte, regelmäßig überprüfte organisatorische Struktur behandelt, nicht als einmalige Dokumentation.

## Scalability, Reliability, Security und Observability

Ein expliziter Plattformvertrag skaliert verlässliche Erwartungen zwischen Plattform- und Anwendungsteams proportional zur Vollständigkeit und Aktualität der dokumentierten Angebots-, Support- und Versionierungsgrenzen; die Reliability-Grenze liegt darin, dass eine Plattform ohne diesen expliziten Vertrag proportional zur Anzahl der nutzenden Teams zunehmend häufige, ressourcenintensive informelle Konflikte über Zuständigkeiten erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Anwendungsteams und Plattformteam streiten wiederholt darüber, wer für ein bestimmtes Problem verantwortlich ist | keine expliziten, dokumentierten Supportgrenzen wurden definiert | einen expliziten Plattformvertrag mit klaren Supportgrenzen dokumentieren und für alle Teams zugänglich machen |
| eine Änderung an einer Plattform-Schnittstelle bricht unerwartet Anwendungen mehrerer Teams | keine expliziten API-Versionsgarantien wurden kommuniziert | ein explizites API-Versionierungsschema mit dokumentierten Stabilitätsgarantien einführen |
| Entwicklerteams empfinden die Plattform trotz technisch korrekter Cluster-Konfiguration als schwer nutzbar | Developer Experience wurde nicht als eigenständiges, bewusst gestaltetes Ziel behandelt | gezieltes Entwicklerfeedback einholen und Self-Service-Werkzeuge sowie Dokumentation entsprechend verbessern |

Security: Mandantenisolation, die nur implizit über technische Cluster-Standardkonfiguration statt über bewusste Governance-Entscheidungen entsteht, kann unentdeckte Sicherheitslücken zwischen Mandanten hinterlassen; explizite, dokumentierte Isolationsgarantien sind Teil eines vollständigen Plattformvertrags. Observability: Die Vollständigkeit dokumentierter Plattformverträge über alle angebotenen Fähigkeiten, die Häufigkeit von Zuständigkeitskonflikten zwischen Plattform- und Anwendungsteams, und gemessene Developer-Experience-Zufriedenheit sind zentrale Plattform-Produktmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert dokumentierte Plattformverträge mit explizitem Angebot, Supportgrenzen und API-Versionierung. **Principal** macht Zuständigkeitsgrenzen und Stabilitätsgarantien für das Team nachvollziehbar. **Chief** positioniert interne Plattformen als Produkte mit expliziten Verträgen statt als unverbindliche, informelle Infrastrukturbereitstellung im Unternehmen.

Anti-Patterns: eine Plattform ohne dokumentierte Supportgrenzen betreiben, was zu wiederholten informellen Zuständigkeitskonflikten führt; Plattform-Schnittstellen ohne explizite Versionsstabilitätsgarantien ändern; Developer Experience als impliziten Nebeneffekt technischer Cluster-Bereitstellung statt als eigenständiges Produktziel behandeln.

## Production Checklist

- [ ] Ein expliziter Plattformvertrag mit Angebot, Supportgrenzen und API-Versionsgarantien ist dokumentiert und zugänglich.
- [ ] Developer Experience wird als eigenständiges, aktiv gemessenes Ziel behandelt.
- [ ] Mandantenisolation basiert auf expliziten Governance-Entscheidungen, nicht nur technischer Standardkonfiguration.
- [ ] Plattform-Ownership ist eine aktiv gepflegte, regelmäßig überprüfte organisatorische Struktur.

## Interviewfragen

### 1. Was macht ein expliziter Plattformvertrag transparent?

**Antwort:** Das konkrete Angebot der Plattform, die Supportgrenzen (wer für welche Art von Problem verantwortlich ist), und die API-Versionsstabilitätsgarantien für bereitgestellte Schnittstellen.

### 2. Warum führt eine Plattform ohne expliziten Vertrag zu wiederkehrenden Konflikten?

**Antwort:** Ohne dokumentierte Erwartungsgrundlage wissen weder Anwendungsteams noch das Plattformteam mit Sicherheit, was erwartet werden kann bzw. wofür sie verantwortlich sind, was zu informeller Aushandlung bei jedem konkreten Vorfall führt.

### 3. Warum garantiert ein technisch korrekt konfigurierter Kubernetes-Cluster allein keine gute Developer Experience?

**Antwort:** Gute Developer Experience erfordert bewusst gestaltete Self-Service-Werkzeuge, verständliche Dokumentation und aktiv eingeholtes Entwicklerfeedback, die nicht implizit aus reiner technischer Cluster-Bereitstellung entstehen.

### 4. Warum reicht technische Namespace-Trennung allein nicht für robuste Mandantenisolation aus?

**Antwort:** Robuste Mandantenisolation erfordert explizite Governance-Entscheidungen (z. B. RBAC-Grenzen, NetworkPolicies, ressourcenspezifische Regeln) über die reine technische Standardkonfiguration hinaus.

### 5. Wie gehst du vor, wenn Anwendungsteams und Plattformteam wiederholt über Zuständigkeiten streiten?

**Antwort:** Ich dokumentiere einen expliziten Plattformvertrag mit klaren Supportgrenzen, der für alle beteiligten Teams zugänglich ist, um zukünftige informelle Aushandlungen durch eine gemeinsam geteilte, klare Grundlage zu ersetzen.

### 6. Widersprüchliche Anforderung: Plattformteam will maximale Flexibilität bei der Weiterentwicklung der Plattform-Schnittstellen UND garantiert keine überraschenden Breaking Changes für Anwendungsteams — wie gehst du vor?

**Antwort:** Ich würde ein explizites API-Versionierungsschema mit dokumentierten Stabilitätsgarantien und angekündigten Deprecation-Zeiträumen einführen, sodass das Plattformteam weiterhin Schnittstellen weiterentwickeln kann, während Anwendungsteams durch vorhersehbare, kommunizierte Übergangsfristen verlässlich planen können.

## Praktische Labs

~~~python
class PlatformContract:
    def __init__(self, offering, support_boundaries, api_version_policy):
        self.offering = offering  # list of provided capabilities
        self.support_boundaries = support_boundaries  # dict: category -> "platform_team" or "app_team"
        self.api_version_policy = api_version_policy  # e.g. "stable APIs guaranteed for 12 months after deprecation notice"

    def resolve_responsibility(self, issue_category):
        return self.support_boundaries.get(issue_category, "UNDEFINED -- contract gap, needs clarification")

contract = PlatformContract(
    offering=["automated deployment", "observability integration", "self-service scaffolding"],
    support_boundaries={
        "cluster_networking_issue": "platform_team",
        "application_business_logic_bug": "app_team",
        "resource_quota_exceeded": "platform_team",
    },
    api_version_policy="stable APIs guaranteed for 12 months after deprecation notice",
)

incidents = ["cluster_networking_issue", "application_business_logic_bug", "unexpected_billing_spike"]

for incident in incidents:
    responsible = contract.resolve_responsibility(incident)
    print(f"Incident: '{incident}' -> Responsible: {responsible}")
~~~

## Dependencies, Cross-References und Quellen

1. Team Topologies: [Platform as a Product](https://teamtopologies.com/key-concepts), abgerufen 2026-09-17.
2. Humanitec: [Platform Engineering — What, Why, How](https://humanitec.com/platform-engineering), abgerufen 2026-09-17.

Golden Paths und Paved Roads sind kanonisch in [KB-0409](31-golden-paths-und-paved-roads.md) behandelt; Platform Scorecards und Produktwirkung in [KB-0411](33-platform-scorecards-und-produktwirkung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Formalisierte interne Service-Level-Agreements (SLAs) zwischen Plattform- und Anwendungsteams als Standardpraxis im Platform Engineering | Adopting | Gegenüber informellen Erwartungen für verlässlichere, messbare Zuständigkeitsklärung bevorzugen. |
| Kontinuierliche Developer-Experience-Umfragen als fester Bestandteil der Plattform-Produktentwicklung | Adopting | Gegenüber gelegentlichem, unsystematischem Feedback für systematischere DevEx-Verbesserung bevorzugen. |

Ein Team akzeptiert eine interne Plattform als produktionsreif erst, wenn ein expliziter, dokumentierter Plattformvertrag mit Angebot, Supportgrenzen und API-Versionsgarantien vorliegt.
