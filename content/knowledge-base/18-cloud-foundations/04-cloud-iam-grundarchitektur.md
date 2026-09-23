---
{"id": "KB-0444", "title": "Cloud-IAM-Grundarchitektur", "domain": "18", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0392", "concepts": ["RBAC und Service Accounts"], "needed_for": "understanding"}, {"id": "KB-0442", "concepts": ["Shared Responsibility"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine IAM-Policy anhand offizieller Cloud-Anbieter-Dokumentation erstellen können, die einem konkreten Principal (User- oder Service-Identität) genau die benötigten Berechtigungen zuweist, und erklären, warum User- und Service-Identitäten getrennt modelliert werden sollten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Organisationsstruktur mit IAM-Hierarchie (Organisation, Konten/Projekte, Ressourcengruppen) für ein konkretes Unternehmen begründet gestalten, basierend auf dessen tatsächlichem Team- und Verantwortungsschnitt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten, zu weitreichenden Zugriff auf eine IAM-Policy zurückführen können, die breiter als der tatsächliche Bedarf des jeweiligen Principals konfiguriert wurde.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "IAM-Governance-Richtlinien für Cloud-Organisationen im Unternehmen anhand des Prinzips geringster Berechtigung und getrennter User-/Service-Identitätsmodellierung statt anhand ad-hoc gewachsener Berechtigungen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die konkreten Authentifizierungsprotokolle (z. B. OAuth, SAML) im Detail sind Vertiefung und Gegenstand von Domain 23.", "rationale": "Kern dieses Kapitels ist die IAM-Grundarchitektur (Organisation, Principals, Policies), nicht die konkreten Authentifizierungsprotokolle."}}, "lab_validation": [{"lab_id": "KB-0444-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Cloud-IAM-Dokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie eine Cloud-Organisation Principals (User- und Service-Identitäten) über Policies mit Berechtigungen auf Ressourcen verbindet, warum eine getrennte Modellierung von User- und Service-Identitäten sinnvoll ist, und wie das Prinzip geringster Berechtigung bei der Policy-Gestaltung angewendet wird.", "limitations": "Kein aktives Cloud-Deployment getestet, keine realen IAM-Konfigurationen erstellt."}]}
---
# Cloud-IAM-Grundarchitektur

> **Ziel:** Cloud-IAM (Identity and Access Management) verbindet drei zentrale Bausteine: eine Organisationsstruktur (die Hierarchie aus Organisation, Konten/Projekten und Ressourcengruppen, über die Berechtigungen vererbt werden können), Principals (die Identitäten, denen Berechtigungen zugewiesen werden — User-Identitäten für Menschen und Service-Identitäten für automatisierte Prozesse/Anwendungen, siehe RBAC und Service Accounts, [KB-0392](../16-kubernetes-platform/14-rbac-und-service-accounts.md)), und Policies (die konkreten Regeln, die festlegen, welcher Principal welche Aktion auf welcher Ressource ausführen darf). Der zentrale Punkt dieses Kapitels ist, dass User- und Service-Identitäten bewusst getrennt modelliert werden müssen — eine Service-Identität (für automatisierte Prozesse) sollte niemals dieselbe, breite Berechtigungsstruktur wie eine menschliche User-Identität erben, da automatisierte Prozesse typischerweise einen viel engeren, klar definierbaren Aufgabenbereich haben, für den das Prinzip geringster Berechtigung deutlich strenger angewendet werden kann und muss als bei menschlichen Nutzern mit wechselnden Aufgaben.

## Zweck, Mental Model und Dependencies

Eine Cloud-Organisationsstruktur bildet typischerweise eine Hierarchie ab (Organisation an der Spitze, darunter Konten oder Projekte, darunter Ressourcengruppen), wobei Berechtigungen, die auf einer höheren Ebene der Hierarchie zugewiesen werden, üblicherweise auf untergeordnete Ebenen vererbt werden — dies ermöglicht eine effiziente Verwaltung großer Berechtigungsstrukturen, birgt jedoch das Risiko, dass eine zu breit auf einer hohen Hierarchieebene zugewiesene Berechtigung sich unbeabsichtigt auf viele untergeordnete Ressourcen auswirkt. Ein Principal ist die Entität, der eine Berechtigung zugewiesen wird — eine User-Identität repräsentiert einen menschlichen Nutzer mit typischerweise wechselnden, breiteren Aufgabenbereichen über die Zeit, während eine Service-Identität einen automatisierten Prozess oder eine Anwendung repräsentiert, deren Aufgabenbereich in der Regel eng, stabil und im Voraus klar definierbar ist. Eine Policy verbindet einen Principal mit einer konkreten, erlaubten Aktion auf einer bestimmten Ressource — das Prinzip geringster Berechtigung fordert, dass jede Policy nur genau die Berechtigungen gewährt, die für die tatsächliche Aufgabe des Principals notwendig sind, nicht mehr. Der zentrale methodische Punkt ist, dass dieses Prinzip für Service-Identitäten konsequenter durchsetzbar ist als für User-Identitäten, da der Aufgabenbereich eines automatisierten Prozesses im Voraus präzise bekannt ist (z. B. "dieser Dienst liest nur aus einem bestimmten Datenspeicher"), während ein menschlicher Nutzer im Zeitverlauf unterschiedliche, sich ändernde Aufgaben hat — eine Vermischung beider Identitätstypen in derselben Berechtigungsstruktur führt typischerweise dazu, dass Service-Identitäten breitere Berechtigungen erhalten als für ihre tatsächliche, eng definierte Aufgabe nötig wäre.

~~~text
Cloud org hierarchy: Organization -> Accounts/Projects -> Resource Groups
  permissions assigned HIGH in hierarchy -> typically INHERITED downward
  -> efficient at scale, BUT risk: overly broad permission at a high level -> unintended reach
Principal: entity a permission is assigned TO
  USER identity: human, typically BROADER, CHANGING task scope over time
  SERVICE identity: automated process/app, typically NARROW, STABLE, precisely definable scope UPFRONT
Policy: connects a Principal to an ALLOWED action on a specific resource
  Least-privilege principle: grant ONLY what's actually needed
KEY METHODOLOGICAL POINT: least-privilege is MORE CONSISTENTLY enforceable for SERVICE identities
  (scope known precisely upfront, e.g. "this service only reads from one specific data store")
  than for USER identities (task scope changes over time)
  -> mixing both identity types in the SAME permission structure
     typically results in service identities inheriting BROADER permissions than their actual task needs
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Organisationshierarchie | strukturiert Konten/Projekte, ermöglicht Berechtigungsvererbung | breit zugewiesene Berechtigungen auf hoher Ebene wirken auf viele untergeordnete Ressourcen |
| User-Identität | repräsentiert menschliche Nutzer | Aufgabenbereich ändert sich über Zeit, breitere Rechtestruktur oft nötig |
| Service-Identität | repräsentiert automatisierte Prozesse/Anwendungen | Aufgabenbereich ist eng und im Voraus definierbar, striktes Least-Privilege durchsetzbar |
| Policy | verbindet Principal mit erlaubter Aktion auf Ressource | muss auf tatsächlichen Bedarf begrenzt sein, nicht pauschal weit gefasst werden |

Implementierung: Für jede Service-Identität wird eine dedizierte, eng gefasste Policy erstellt, die ausschließlich die für die konkrete, automatisierte Aufgabe tatsächlich benötigten Berechtigungen enthält, statt eine bestehende, breitere User-Berechtigungsstruktur wiederzuverwenden. Die Organisationshierarchie wird so gestaltet, dass Berechtigungsvererbung bewusst und nachvollziehbar eingesetzt wird — breite Berechtigungen werden nur auf Ebenen zugewiesen, auf denen sie tatsächlich für alle untergeordneten Ressourcen gelten sollen, statt aus Bequemlichkeit auf einer zu hohen Ebene zugewiesen zu werden. Bei der Einführung neuer Service-Identitäten wird deren tatsächlicher, eng definierter Aufgabenbereich vor der Policy-Erstellung explizit dokumentiert, um eine präzise Zuordnung zu ermöglichen.

## Scalability, Reliability, Security und Observability

Cloud-IAM skaliert die Verwaltbarkeit großer Berechtigungsstrukturen proportional zur sinnvollen Nutzung der Organisationshierarchie und Berechtigungsvererbung; die Reliability-Grenze liegt darin, dass eine breite, auf hoher Hierarchieebene zugewiesene Berechtigung proportional zur Tiefe der darunterliegenden Ressourcenstruktur eine entsprechend große, oft unbeabsichtigte Angriffsfläche erzeugt, insbesondere wenn User- und Service-Identitäten dieselbe Berechtigungsstruktur teilen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Service-Identität hat Zugriff auf Ressourcen, die für ihre tatsächliche Aufgabe nicht benötigt werden | die Service-Identität wurde einer zu breiten, möglicherweise für User-Identitäten gedachten Policy zugeordnet | die Policy der Service-Identität gegen deren tatsächlichen, dokumentierten Aufgabenbereich prüfen und einschränken |
| eine Berechtigungsänderung auf hoher Organisationsebene wirkt sich unerwartet auf viele untergeordnete Ressourcen aus | die Berechtigungsvererbung wurde nicht ausreichend bedacht, bevor die Änderung auf hoher Ebene vorgenommen wurde | die Auswirkung einer Policy-Änderung auf allen betroffenen Vererbungsebenen vor der Anwendung prüfen |
| es ist unklar, welcher konkrete Principal eine bestimmte Aktion durchgeführt hat | User- und Service-Identitäten sind nicht klar getrennt oder dokumentiert, was die Nachvollziehbarkeit erschwert | die Trennung und Dokumentation von User- und Service-Identitäten für den betroffenen Bereich prüfen |

Security: Eine konsequente Trennung von User- und Service-Identitäten sowie striktes Least-Privilege für Service-Identitäten reduzieren die Angriffsfläche bei einer kompromittierten automatisierten Anwendung erheblich, da deren Berechtigungen von vornherein eng begrenzt sind. Observability: Eine regelmäßige Prüfung tatsächlich genutzter versus gewährter Berechtigungen (um übermäßig weit gefasste Policies zu identifizieren) und ein vollständiges Audit-Log aller IAM-Änderungen sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** erstellt für jede Service-Identität eine eng gefasste, dedizierte Policy statt eine bestehende, breitere Struktur wiederzuverwenden. **Principal** macht die Organisationshierarchie und Berechtigungsvererbung für das Team nachvollziehbar. **Chief** legt IAM-Governance-Richtlinien für Cloud-Organisationen im Unternehmen anhand des Prinzips geringster Berechtigung und getrennter User-/Service-Identitätsmodellierung fest.

Anti-Patterns: eine Service-Identität mit derselben, breiten Berechtigungsstruktur wie eine User-Identität konfigurieren; Berechtigungen aus Bequemlichkeit auf einer zu hohen Organisationsebene zuweisen, ohne die Auswirkung auf alle untergeordneten Ressourcen zu prüfen; User- und Service-Identitäten ohne klare, dokumentierte Trennung verwalten.

## Production Checklist

- [ ] Service-Identitäten haben dedizierte, eng gefasste Policies basierend auf ihrem tatsächlichen, dokumentierten Aufgabenbereich.
- [ ] Berechtigungen sind auf der jeweils niedrigsten sinnvollen Organisationsebene zugewiesen, nicht pauschal auf hoher Ebene.
- [ ] User- und Service-Identitäten sind klar getrennt und dokumentiert.
- [ ] Tatsächlich genutzte versus gewährte Berechtigungen werden regelmäßig geprüft.

## Interviewfragen

### 1. Was sind die drei zentralen Bausteine von Cloud-IAM?

**Antwort:** Eine Organisationsstruktur (Hierarchie mit Berechtigungsvererbung), Principals (User- und Service-Identitäten) und Policies (die konkreten Berechtigungsregeln).

### 2. Warum sollten User- und Service-Identitäten getrennt modelliert werden?

**Antwort:** Weil der Aufgabenbereich einer Service-Identität eng und im Voraus präzise bekannt ist, während sich der Aufgabenbereich einer User-Identität über die Zeit ändert — eine gemeinsame Berechtigungsstruktur führt typischerweise dazu, dass Service-Identitäten breitere Berechtigungen erhalten als für ihre tatsächliche Aufgabe nötig.

### 3. Was ist das Prinzip geringster Berechtigung, und wofür ist es besonders konsequent durchsetzbar?

**Antwort:** Jede Policy soll nur genau die tatsächlich benötigten Berechtigungen gewähren; es ist besonders konsequent für Service-Identitäten durchsetzbar, da deren Aufgabenbereich im Voraus präzise bekannt ist.

### 4. Welches Risiko birgt Berechtigungsvererbung in einer Cloud-Organisationshierarchie?

**Antwort:** Eine zu breit auf einer hohen Hierarchieebene zugewiesene Berechtigung wirkt sich unbeabsichtigt auf alle untergeordneten Ressourcen aus.

### 5. Wie gehst du vor, wenn eine Service-Identität Zugriff auf Ressourcen hat, die für ihre tatsächliche Aufgabe nicht benötigt werden?

**Antwort:** Ich prüfe die Policy dieser Service-Identität gegen ihren tatsächlichen, dokumentierten Aufgabenbereich und schränke sie entsprechend dem Prinzip geringster Berechtigung ein.

### 6. Widersprüchliche Anforderung: Team will schnelle Entwicklungsgeschwindigkeit (breite Berechtigungen für neue Service-Identitäten) UND strikte Least-Privilege-Durchsetzung — wie gehst du vor?

**Antwort:** Ich würde für neue Service-Identitäten zunächst deren tatsächlichen, engen Aufgabenbereich klären und eine entsprechend eng gefasste Policy erstellen, statt aus Zeitdruck eine breitere, bequemere Berechtigungsstruktur zu vergeben, da eine nachträgliche Einschränkung deutlich aufwendiger ist als eine von Beginn an präzise Zuordnung.

## Praktische Labs

~~~python
# Conceptual least-privilege policy scope check (not executed against a real cloud account):

def check_policy_scope(identity_type, granted_actions, actual_required_actions):
    excess_permissions = set(granted_actions) - set(actual_required_actions)
    risk_level = "HIGH" if identity_type == "service" and excess_permissions else "review"
    return {
        "identity_type": identity_type,
        "excess_permissions": list(excess_permissions),
        "risk_level": risk_level if excess_permissions else "acceptable",
    }

service_identity_check = check_policy_scope(
    identity_type="service",
    granted_actions=["read:data_store_a", "write:data_store_a", "delete:data_store_a", "read:data_store_b"],
    actual_required_actions=["read:data_store_a"],
)

print(service_identity_check)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [IAM — Identities (users, groups, and roles)](https://docs.aws.amazon.com/IAM/latest/UserGuide/id.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [IAM overview — Resource hierarchy](https://cloud.google.com/iam/docs/overview), abgerufen 2026-09-18.

RBAC und Service Accounts sind kanonisch in [KB-0392](../16-kubernetes-platform/14-rbac-und-service-accounts.md) behandelt; Shared Responsibility in [KB-0442](02-shared-responsibility.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, nutzungsbasierte Policy-Empfehlungswerkzeuge, die überprivilegierte Identitäten anhand tatsächlicher Nutzung identifizieren | Adopting | Gegenüber rein manueller Policy-Prüfung bevorzugen, sobald die Genauigkeit der Empfehlungen für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert eine neue Service-Identität erst, wenn deren Policy nachweislich auf den tatsächlichen, dokumentierten Aufgabenbereich begrenzt ist und keine ungenutzten, überschüssigen Berechtigungen enthält.
