---
{"id": "KB-0408", "title": "Backstage und Internal Developer Platforms", "domain": "16", "sequence": 30, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0405", "concepts": ["Argo CD im Plattformbetrieb"], "needed_for": "understanding"}, {"id": "KB-0407", "concepts": ["Crossplane und Infrastruktur-APIs"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Service im Backstage-Servicekatalog registrieren, dessen Ownership-Metadaten pflegen, und ein Software-Template für eine neue Anwendung ausführen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Backstage als Fassade/Nutzeroberfläche einer Internal Developer Platform von der eigentlichen, zugrunde liegenden IDP-Infrastruktur (z. B. Argo CD, Crossplane) begrifflich und architektonisch klar unterscheiden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Team Backstage selbst mit der vollständigen Plattformfunktionalität verwechselt, obwohl Backstage lediglich die Nutzeroberfläche für dahinterliegende Systeme darstellt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine IDP-Strategie etablieren, die tatsächliche Entwicklerbedürfnisse (nachvollziehbare Ownership, einfache Self-Service-Bereitstellung) in den Mittelpunkt stellt, statt Backstage als Selbstzweck einzuführen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Entwicklung eigener Backstage-Plugins im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Servicekatalog, Templates und der Abgrenzung von Backstage zur gesamten IDP, nicht die Plugin-Entwicklung selbst."}}, "lab_validation": [{"lab_id": "KB-0408-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal beschriebener Backstage-Workflow anhand offizieller Dokumentation, kein aktiver Cluster verwendet", "evidence": "Anhand der offiziellen Backstage-Dokumentation wird der Ablauf von Servicekatalog-Registrierung mit Ownership-Metadaten und Software-Template-Ausführung nachvollzogen, sowie die architektonische Trennung zwischen Backstage als Nutzeroberfläche und den dahinterliegenden Systemen (z. B. Argo CD für Deployment, Crossplane für Infrastruktur) beschrieben.", "limitations": "Keine reale Ausführung gegen eine produktive Backstage-Installation."}]}
---
# Backstage und Internal Developer Platforms

> **Ziel:** Backstage stellt einen Servicekatalog (eine zentrale, durchsuchbare Übersicht aller Services mit Metadaten wie Ownership), Software-Templates (standardisierte, self-service-fähige Vorlagen zur Erstellung neuer Services) und Plugins (Erweiterungen für Integrationen mit anderen Systemen, z. B. Argo CD, siehe [KB-0405](27-argo-cd-im-plattformbetrieb.md)) bereit. Der zentrale Punkt dieses Kapitels ist die klare begriffliche und architektonische Unterscheidung: Backstage selbst ist die Nutzeroberfläche und der Katalog, nicht die vollständige Internal Developer Platform (IDP) — die eigentliche Plattformfunktionalität (Deployment über Argo CD, Infrastrukturbereitstellung über Crossplane, siehe [KB-0407](29-crossplane-und-infrastruktur-apis.md)) liegt in den dahinterliegenden Systemen, mit denen Backstage über Plugins integriert.

## Zweck, Mental Model und Dependencies

Der Servicekatalog ist das Herzstück von Backstage: jeder Service, jede Komponente, jede API im Unternehmen wird als Katalogeintrag mit strukturierten Metadaten erfasst, insbesondere Ownership (welches Team ist für diesen Service verantwortlich) — diese Nachvollziehbarkeit löst ein konkretes organisatorisches Problem, das in wachsenden Organisationen häufig auftritt: die Frage "wer ist für diesen Service verantwortlich?" wird beantwortbar, statt informell über Slack-Nachrichten oder veraltete Wikis geklärt werden zu müssen. Software-Templates ermöglichen Self-Service: ein Entwicklerteam kann einen neuen Service basierend auf einer standardisierten, vom Plattformteam gepflegten Vorlage erstellen, ohne jeden Konfigurationsschritt manuell durchzuführen — dies reduziert sowohl den Aufwand für das Entwicklerteam als auch die Wahrscheinlichkeit inkonsistenter, von Plattformstandards abweichender Konfigurationen. Plugins integrieren Backstage mit den tatsächlichen, dahinterliegenden Plattformsystemen: ein Argo-CD-Plugin zeigt den Deployment-Status eines Services direkt im Backstage-Katalog an, statt dass Entwickler separat zur Argo-CD-Oberfläche wechseln müssen. Der zentrale, häufig missverstandene architektonische Punkt ist: Backstage selbst führt keine Deployments durch, provisioniert keine Infrastruktur, und verwaltet keine Kubernetes-Ressourcen direkt — es ist die vereinheitlichende Nutzeroberfläche und der Katalog über diese Fähigkeiten, die tatsächlich von anderen Systemen (Argo CD, Crossplane, CI/CD-Pipelines) bereitgestellt werden. Ein Team, das Backstage einführt, ohne diese dahinterliegenden Systeme tatsächlich zu betreiben oder zu integrieren, erhält lediglich einen Katalog ohne tatsächliche Self-Service-Funktionalität.

~~~text
Service catalog: EVERY service/component/API registered with structured metadata, especially OWNERSHIP
  -> solves a real organizational problem: "who owns this service?" becomes answerable, not informal Slack/wiki lookup
Software Templates: enable SELF-SERVICE -- dev team creates a new service from a platform-team-maintained standard template
  -> reduces effort AND reduces inconsistent, off-standard configurations
Plugins: integrate Backstage WITH the actual underlying platform systems (e.g. Argo CD deployment status shown in-catalog)
CRITICAL, OFTEN MISUNDERSTOOD ARCHITECTURAL POINT:
  Backstage itself does NOT deploy, does NOT provision infrastructure, does NOT manage K8s resources directly
  -> it's the UNIFYING UI/catalog OVER capabilities actually provided by other systems (Argo CD, Crossplane, CI/CD)
  -> adopting Backstage WITHOUT actually operating/integrating those underlying systems = a catalog with no real self-service functionality
~~~

## Core Concepts, Architektur und Implementierung

| Element | Zweck | Häufiges Missverständnis |
|---|---|---|
| Servicekatalog | zentrale, durchsuchbare Übersicht mit Ownership-Metadaten | wird ohne aktive Pflege schnell veraltet und verliert seinen Nutzen |
| Software-Templates | standardisierte Self-Service-Erstellung neuer Services | ohne dahinterliegende Automatisierung nur eine leere Formularvorlage |
| Plugins | Integration mit tatsächlichen Plattformsystemen | Backstage selbst wird fälschlich für die gesamte Plattformfunktionalität gehalten |

Implementierung: Für jeden Service im Unternehmen wird ein Katalogeintrag mit vollständigen, aktuell gehaltenen Ownership-Metadaten erstellt und gepflegt — die Pflege dieser Metadaten wird als aktive, verpflichtende Aufgabe jedes Teams etabliert, nicht als einmalige, danach vernachlässigte Registrierung. Software-Templates werden mit tatsächlich funktionierender, automatisierter Bereitstellungslogik (die letztlich Argo CD, Crossplane oder vergleichbare Systeme aufruft) hinterlegt, statt nur eine Formularoberfläche ohne echte Automatisierung bereitzustellen. Plugins werden gezielt für die tatsächlich im Unternehmen eingesetzten Plattformsysteme integriert, um Entwicklern relevante Informationen (Deployment-Status, Infrastruktur-Status) direkt im Katalog zugänglich zu machen, statt einen zusätzlichen, unnötigen Kontextwechsel zu erfordern.

## Scalability, Reliability, Security und Observability

Backstage skaliert Entwickler-Self-Service und Ownership-Nachvollziehbarkeit proportional zur Vollständigkeit und Aktualität der Katalogmetadaten sowie der tatsächlichen Integrationstiefe mit den dahinterliegenden Plattformsystemen; die Reliability-Grenze liegt darin, dass ein veralteter oder unvollständig gepflegter Servicekatalog proportional zur Anzahl der Services das Vertrauen der Entwickler in die Katalogdaten untergräbt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Entwickler nutzen Backstage kaum und fragen weiterhin informell nach Service-Ownership | die Katalogmetadaten sind veraltet oder unvollständig gepflegt | einen verpflichtenden Pflegeprozess für Ownership-Metadaten pro Team etablieren |
| ein neu erstellter Service über ein Software-Template entspricht nicht den tatsächlichen Plattformstandards | das Template ruft keine echte, automatisierte Bereitstellungslogik auf, sondern nur eine unvollständige Formularvorlage | die tatsächliche Automatisierungslogik hinter dem Template prüfen und mit den echten Plattformsystemen verbinden |
| ein Team erwartet, dass Backstage selbst Deployments durchführt oder Infrastruktur bereitstellt | Backstage wird fälschlich mit der vollständigen IDP-Funktionalität verwechselt, statt als Nutzeroberfläche über dahinterliegende Systeme verstanden zu werden | die architektonische Trennung zwischen Backstage als Katalog/UI und den tatsächlich ausführenden Systemen (Argo CD, Crossplane) explizit kommunizieren |

Security: Der Servicekatalog kann sensible Informationen über die interne Systemlandschaft enthalten; Zugriffskontrollen auf Katalogeinträge sollten entsprechend der Sensitivität der jeweiligen Service-Informationen konfiguriert werden. Observability: Der Anteil der Services mit vollständigen, aktuellen Ownership-Metadaten, die Nutzungsrate der Software-Templates gegenüber manuellen Service-Erstellungen, und die Integrationsvollständigkeit relevanter Plattform-Plugins sind zentrale IDP-Erfolgsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert vollständig gepflegte Ownership-Metadaten und funktionierende, automatisierte Software-Templates. **Principal** macht die Trennung zwischen Backstage-Katalog und dahinterliegenden Plattformsystemen für das Team nachvollziehbar. **Chief** etabliert eine IDP-Strategie, die tatsächliche Entwicklerbedürfnisse in den Mittelpunkt stellt, statt Backstage als Selbstzweck einzuführen.

Anti-Patterns: Backstage einführen, ohne die dahinterliegenden Plattformsysteme (Deployment, Infrastruktur) tatsächlich zu betreiben oder zu integrieren; Katalogmetadaten einmalig erfassen und danach nicht mehr pflegen; Software-Templates ohne echte, funktionierende Automatisierungslogik als reine Formularvorlagen bereitstellen.

## Production Checklist

- [ ] Jeder Service im Katalog besitzt vollständige, aktuell gehaltene Ownership-Metadaten.
- [ ] Software-Templates rufen tatsächlich funktionierende, automatisierte Bereitstellungslogik auf.
- [ ] Relevante Plattform-Plugins (z. B. Deployment-Status) sind tatsächlich integriert und aktuell.
- [ ] Die Rolle von Backstage als Nutzeroberfläche gegenüber den ausführenden Plattformsystemen ist im Team klar kommuniziert.

## Interviewfragen

### 1. Was ist der zentrale Zweck des Backstage-Servicekatalogs?

**Antwort:** Eine zentrale, durchsuchbare Übersicht aller Services mit strukturierten Metadaten, insbesondere Ownership, die die organisatorische Frage "wer ist für diesen Service verantwortlich?" beantwortbar macht.

### 2. Was ermöglichen Software-Templates in Backstage?

**Antwort:** Self-Service-Erstellung neuer Services basierend auf standardisierten, vom Plattformteam gepflegten Vorlagen, was Aufwand reduziert und inkonsistente Konfigurationen vermeidet.

### 3. Warum ist die Unterscheidung zwischen Backstage und der gesamten Internal Developer Platform wichtig?

**Antwort:** Backstage selbst führt keine Deployments durch und provisioniert keine Infrastruktur; es ist die vereinheitlichende Nutzeroberfläche über Fähigkeiten, die tatsächlich von anderen Systemen wie Argo CD oder Crossplane bereitgestellt werden.

### 4. Was passiert, wenn ein Team Backstage einführt, ohne die dahinterliegenden Plattformsysteme zu integrieren?

**Antwort:** Es entsteht lediglich ein Katalog ohne tatsächliche Self-Service-Funktionalität, da die eigentliche Automatisierung (Deployment, Infrastrukturbereitstellung) fehlt.

### 5. Wie gehst du vor, wenn Entwickler Backstage kaum nutzen und weiterhin informell nach Service-Ownership fragen?

**Antwort:** Ich prüfe, ob die Katalogmetadaten veraltet oder unvollständig gepflegt sind, und etabliere einen verpflichtenden Pflegeprozess für Ownership-Metadaten pro Team.

### 6. Widersprüchliche Anforderung: Team will schnelle Einführung eines Entwickler-Portals UND garantiert echte, funktionierende Self-Service-Fähigkeiten von Beginn an — wie gehst du vor?

**Antwort:** Ich würde zunächst die tatsächlich benötigten, dahinterliegenden Plattformsysteme (Deployment-Automatisierung, Infrastruktur-Provisionierung) identifizieren und deren Integration priorisieren, statt Backstage isoliert als reine Katalogoberfläche ohne echte Automatisierung einzuführen, sodass das Portal von Beginn an tatsächlich funktionierende Self-Service-Fähigkeiten bietet statt nur eine leere Fassade.

## Praktische Labs

~~~python
class ServiceCatalogEntry:
    def __init__(self, name, owner_team, last_metadata_update):
        self.name = name
        self.owner_team = owner_team
        self.last_metadata_update = last_metadata_update

class SoftwareTemplate:
    def __init__(self, name, automation_backend):
        self.name = name
        self.automation_backend = automation_backend  # e.g. "argo-cd", None means non-functional

    def execute(self, new_service_name):
        if self.automation_backend is None:
            return f"WARNING: template '{self.name}' has NO real automation backend -- just a form, no actual provisioning."
        return f"Service '{new_service_name}' created via '{self.name}', provisioned through '{self.automation_backend}'."

catalog = [
    ServiceCatalogEntry("payment-service", "team-payments", "2026-09-01"),
    ServiceCatalogEntry("legacy-inventory", "unknown", "2023-01-15"),  # stale ownership metadata
]

for entry in catalog:
    status = "OK" if entry.owner_team != "unknown" else "STALE -- ownership unknown, needs update"
    print(f"{entry.name}: owner={entry.owner_team}, status={status}")

functional_template = SoftwareTemplate("new-microservice", automation_backend="argo-cd")
broken_template = SoftwareTemplate("legacy-form-only", automation_backend=None)

print(f"\n{functional_template.execute('my-new-service')}")
print(f"{broken_template.execute('another-service')}")
~~~

## Dependencies, Cross-References und Quellen

1. Backstage-Dokumentation: [Software Catalog](https://backstage.io/docs/features/software-catalog/), abgerufen 2026-09-17.
2. Backstage-Dokumentation: [Software Templates](https://backstage.io/docs/features/software-templates/), abgerufen 2026-09-17.

Argo CD im Plattformbetrieb ist kanonisch in [KB-0405](27-argo-cd-im-plattformbetrieb.md) behandelt; Crossplane und Infrastruktur-APIs in [KB-0407](29-crossplane-und-infrastruktur-apis.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Katalog-Metadaten-Extraktion direkt aus Repository-Konfigurationsdateien statt manueller Registrierung | Adopting | Gegenüber manueller Katalogpflege für konsistentere, weniger veraltende Metadaten bevorzugen. |
| Scorecards/Tech-Health-Checks als Backstage-Plugin, die automatisiert Plattformstandard-Konformität pro Service bewerten | Adopting | Gegenüber manueller Compliance-Prüfung für skalierbarere, kontinuierliche Standarddurchsetzung bevorzugen. |

Ein Team akzeptiert eine Backstage-Einführung erst, wenn die dahinterliegenden Plattformsysteme tatsächlich integriert sind und echte Self-Service-Funktionalität bereitstellen.
