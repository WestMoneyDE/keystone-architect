---
{"id": "KB-0481", "title": "Azure-Organisation und Enterprise Landing Zones", "domain": "20", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0450", "concepts": ["Landing Zones"], "needed_for": "understanding"}, {"id": "KB-0463", "concepts": ["AWS-Organisationen und Landing Zones"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Azure-Ressourcenhierarchie mit Management Groups und Subscriptions anhand offizieller Dokumentation strukturieren können und den strukturellen Unterschied zu AWS Organizations (siehe KB-0463) erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Enterprise-Landing-Zone-Architektur mit Management Groups, Subscriptions und klaren Entscheidungsrechten gestalten, die Plattform- und Workload-Verantwortung explizit trennt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Richtliniendurchsetzungslücke auf eine fehlerhaft platzierte Azure Policy innerhalb der Management-Group-Hierarchie zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Azure-Organisationsrichtlinien im Unternehmen anhand klarer Subscription-Trennungsprinzipien und dokumentierter Entscheidungsrechte statt anhand einer gewachsenen, undifferenzierten Subscription-Landschaft festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Azure-Resource-Manager-Backends im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Management Groups, Subscriptions und Entscheidungsrechten als Entscheidungsgrundlage für Landing-Zone-Architektur, nicht die Resource-Manager-Interna."}}, "lab_validation": [{"lab_id": "KB-0481-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-Dokumentation zu Management Groups und Enterprise-Scale-Landing-Zones, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Azure Management Groups Subscriptions hierarchisch organisieren, wie Azure Policy auf jeder Ebene dieser Hierarchie durchgesetzt wird und dabei von untergeordneten Ebenen geerbt wird, und wie das Azure-Enterprise-Scale-Landing-Zone-Referenzmodell Plattform- und Workload-Subscriptions strukturell trennt, analog zur AWS-Organizations-SCP-Struktur (siehe KB-0463).", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Management-Group-Struktur erstellt."}]}
---
# Azure-Organisation und Enterprise Landing Zones

> **Ziel:** Azure organisiert Ressourcen über eine Hierarchie aus Management Groups (Gruppierungsebenen oberhalb einzelner Subscriptions, die eine strukturierte Vererbung von Richtlinien ermöglichen) und Subscriptions (der grundlegenden Abrechnungs- und Zugriffsisolationseinheit, vergleichbar mit einem AWS-Account, siehe AWS-Organisationen und Landing Zones, [KB-0463](../19-aws/01-aws-organisationen-und-landing-zones.md)) — Azure Policy wird auf jeder Ebene dieser Hierarchie zugewiesen und von untergeordneten Ebenen geerbt, analog zur Wirkungsweise von Service Control Policies in AWS Organizations. Der zentrale Punkt dieses Kapitels ist, dass das Azure-Enterprise-Scale-Landing-Zone-Referenzmodell explizit zwischen Plattform-Subscriptions (zentrale, gemeinsam genutzte Dienste wie Identität, Konnektivität, Management) und Workload-Subscriptions (in denen Anwendungsteams tatsächlich operieren) trennt — eine unerwartete Richtliniendurchsetzungslücke ist typischerweise auf eine Azure Policy zurückzuführen, die auf einer falschen Ebene dieser Management-Group-Hierarchie zugewiesen wurde, statt auf eine allgemeine Fehlfunktion des Policy-Mechanismus selbst.

## Zweck, Mental Model und Dependencies

Eine Azure-Subscription ist die grundlegende Einheit für Abrechnung und Zugriffsisolation, innerhalb derer Ressourcen (virtuelle Maschinen, Speicher, Netzwerke) erstellt werden — strukturell vergleichbar mit einem AWS-Account, jedoch mit einer wichtigen konzeptionellen Nuance: Während AWS-Accounts primär über AWS Organizations in einer Baumstruktur organisiert werden, nutzt Azure Management Groups als eigenständige, flexiblere Hierarchieebene oberhalb der Subscriptions, die eine beliebige Verschachtelungstiefe erlaubt und primär der Richtlinienvererbung dient, nicht notwendigerweise der Abrechnungsstruktur. Azure Policy definiert Regeln, die auf einer beliebigen Ebene der Management-Group-Hierarchie zugewiesen werden können, wobei jede zugewiesene Policy auf alle untergeordneten Management Groups und Subscriptions vererbt wird — konzeptionell vergleichbar mit der Vererbungslogik von Service Control Policies in AWS Organizations (siehe [KB-0463](../19-aws/01-aws-organisationen-und-landing-zones.md)), jedoch mit einem flexibleren, mehrstufigen Hierarchiemodell. Das Azure-Enterprise-Scale-Landing-Zone-Referenzmodell strukturiert diese Hierarchie in charakteristische Bereiche — eine "Platform"-Management-Group für zentrale, gemeinsam genutzte Dienste (Identitätsmanagement, zentrale Netzwerkkonnektivität, Management- und Überwachungsinfrastruktur) und eine "Landing Zones"-Management-Group für die eigentlichen Workload-Subscriptions, in denen Anwendungsteams operieren, oft weiter unterteilt nach Kritikalität oder Compliance-Anforderung (z. B. "Corp" für interne, unternehmenskritische Anwendungen, "Online" für internetseitig exponierte Anwendungen). Der zentrale methodische Punkt ist, dass eine Azure-Policy-Zuweisung auf der falschen Ebene dieser Hierarchie entweder zu unbeabsichtigt breiter Durchsetzung (eine Policy, die versehentlich auf einer zu hohen Ebene zugewiesen wird, betrifft mehr Subscriptions als beabsichtigt) oder zu einer Durchsetzungslücke (eine Policy, die auf einer zu niedrigen, spezifischen Ebene zugewiesen wird, deckt neue, später hinzugefügte Subscriptions nicht automatisch ab) führen kann — eine unerwartete Richtliniendurchsetzungslücke sollte daher primär durch Prüfung der tatsächlichen Zuweisungsebene innerhalb der Management-Group-Hierarchie diagnostiziert werden, nicht durch die Annahme eines allgemeinen Fehlers im Policy-Mechanismus.

~~~text
Azure Subscription: fundamental billing/access-isolation unit (like an AWS account, see KB-0463)
Management Groups: SEPARATE, more flexible hierarchy ABOVE subscriptions
  arbitrary nesting depth, PRIMARILY for policy inheritance, not necessarily billing structure
Azure Policy: assigned at ANY level of the management-group hierarchy
  -> INHERITED by all child management groups and subscriptions
     (conceptually parallel to AWS SCP inheritance, but a more flexible, multi-tier hierarchy)
Enterprise-Scale Landing Zone reference model:
  "Platform" management group: central shared services (identity, connectivity, management)
  "Landing Zones" management group: actual WORKLOAD subscriptions (further split by criticality/compliance,
    e.g. "Corp" internal, "Online" internet-facing)
KEY METHODOLOGICAL POINT: policy assigned at the WRONG hierarchy level ->
  EITHER unintended broad enforcement (too high) OR an enforcement GAP (too low/specific,
    doesn't automatically cover NEW subscriptions added later)
  -> diagnose enforcement gaps by checking ACTUAL assignment level FIRST
     not by assuming a general policy-mechanism failure
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Subscription | Abrechnungs-/Zugriffsisolationseinheit | Grundlage für Ressourcenerstellung, vergleichbar mit AWS-Account |
| Management Group | flexible Hierarchieebene für Richtlinienvererbung | Zuweisungsebene entscheidet über Reichweite der Durchsetzung |
| Azure Policy | durchsetzt Regeln über die Hierarchie hinweg | vererbt von übergeordneten an untergeordnete Ebenen |
| Enterprise-Scale-Referenzmodell | trennt Platform- und Landing-Zone-Subscriptions | strukturiert zentrale Dienste von Workload-Betrieb |

Implementierung: Vor der Einrichtung einer Management-Group-Hierarchie wird explizit geklärt, welche Richtlinien tatsächlich unternehmensweit (auf oberster Ebene) und welche nur für bestimmte Subscription-Gruppen (auf niedrigerer Ebene) gelten sollen, um Policy-Zuweisungen gezielt auf der jeweils passenden Ebene vorzunehmen. Platform-Subscriptions (zentrale Identität, Konnektivität, Management) werden explizit von Workload-Subscriptions getrennt, konsistent mit dem Enterprise-Scale-Referenzmodell. Bei neuen Subscriptions wird geprüft, ob sie automatisch die relevanten, vererbten Richtlinien der übergeordneten Management-Group-Ebene erhalten, statt anzunehmen, dass neue Subscriptions automatisch vollständig abgedeckt sind.

## Scalability, Reliability, Security und Observability

Azure-Organisationsstrukturen skalieren die Governance-Konsistenz proportional zur korrekten Platzierung von Azure-Policy-Zuweisungen innerhalb der Management-Group-Hierarchie; die Reliability-Grenze liegt darin, dass eine Policy-Zuweisung auf einer falschen Hierarchieebene proportional zur betroffenen Subscription-Anzahl entweder zu unbeabsichtigt breiter Durchsetzung oder zu einer unbemerkten Durchsetzungslücke führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine neu erstellte Subscription unterliegt nicht den erwarteten unternehmensweiten Richtlinien | die Subscription wurde nicht der korrekten Management-Group zugeordnet, die die relevanten Policies vererbt | die Management-Group-Zuordnung der neuen Subscription prüfen und korrigieren |
| eine Richtlinie wirkt sich unerwartet breit auf Subscriptions aus, die davon nicht betroffen sein sollten | die Policy wurde auf einer zu hohen Ebene der Management-Group-Hierarchie zugewiesen | die Zuweisungsebene prüfen und die Policy auf eine spezifischere, passendere Ebene verschieben |
| zentrale Dienste (Identität, Konnektivität) sind nicht konsistent über alle Workload-Subscriptions hinweg verfügbar | die Trennung zwischen Platform- und Landing-Zone-Subscriptions folgt nicht dem Enterprise-Scale-Referenzmodell | die Subscription-Struktur gegen das Referenzmodell prüfen und gegebenenfalls neu strukturieren |

Security: Zugriffskontrolle für Management Groups und Subscriptions sollte über Azure-RBAC mit dediziert zugewiesenen Rollen erfolgen, mit besonders restriktivem Zugriff auf höhere Hierarchieebenen, deren Änderungen sich auf viele untergeordnete Subscriptions auswirken können. Observability: Die tatsächliche Policy-Zuweisungsebene relativ zur beabsichtigten Reichweite, die Compliance-Abdeckung neuer Subscriptions, und die Konsistenz der Platform-/Landing-Zone-Trennung sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** platziert Azure-Policy-Zuweisungen explizit auf der für ihre beabsichtigte Reichweite passenden Management-Group-Ebene. **Principal** macht die Management-Group-Hierarchie und Policy-Vererbung für das Team nachvollziehbar. **Chief** legt Azure-Organisationsrichtlinien im Unternehmen anhand klarer Subscription-Trennungsprinzipien fest.

Anti-Patterns: Azure-Policy-Zuweisungen ohne Prüfung der tatsächlichen Vererbungsreichweite auf einer beliebigen Hierarchieebene vornehmen; Platform- und Workload-Subscriptions ohne strukturelle Trennung gemeinsam verwalten; neue Subscriptions erstellen, ohne deren korrekte Management-Group-Zuordnung zu verifizieren.

## Production Checklist

- [ ] Die Management-Group-Hierarchie folgt dem Enterprise-Scale-Referenzmodell mit klarer Platform-/Landing-Zone-Trennung.
- [ ] Azure-Policy-Zuweisungen sind explizit auf der für ihre beabsichtigte Reichweite passenden Ebene platziert.
- [ ] Neue Subscriptions werden korrekt der zugehörigen Management-Group zugeordnet und auf vererbte Policies geprüft.
- [ ] Zugriffskontrolle für höhere Hierarchieebenen ist besonders restriktiv konfiguriert.

## Interviewfragen

### 1. Was ist der strukturelle Unterschied zwischen einer Azure-Subscription und einer Management Group?

**Antwort:** Eine Subscription ist die grundlegende Abrechnungs- und Zugriffsisolationseinheit (vergleichbar mit einem AWS-Account); eine Management Group ist eine flexible, darüberliegende Hierarchieebene, die primär der Vererbung von Richtlinien dient.

### 2. Wie wird eine Azure Policy über die Management-Group-Hierarchie durchgesetzt?

**Antwort:** Eine auf einer bestimmten Ebene zugewiesene Policy wird an alle untergeordneten Management Groups und Subscriptions vererbt, konzeptionell vergleichbar mit der Vererbungslogik von AWS Service Control Policies.

### 3. Was trennt das Azure-Enterprise-Scale-Landing-Zone-Referenzmodell strukturell?

**Antwort:** Platform-Subscriptions für zentrale, gemeinsam genutzte Dienste (Identität, Konnektivität, Management) von Landing-Zone-Subscriptions, in denen Anwendungsteams tatsächlich operieren.

### 4. Was passiert, wenn eine Azure Policy auf einer zu hohen Hierarchieebene zugewiesen wird?

**Antwort:** Sie kann sich unbeabsichtigt breit auf mehr Subscriptions auswirken als eigentlich beabsichtigt, da sie an alle untergeordneten Ebenen vererbt wird.

### 5. Wie gehst du vor, wenn eine neu erstellte Subscription nicht den erwarteten unternehmensweiten Richtlinien unterliegt?

**Antwort:** Ich prüfe, ob die Subscription korrekt der Management-Group zugeordnet ist, die die relevanten Policies vererbt, und korrigiere die Zuordnung gegebenenfalls.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Erstellung neuer Subscriptions UND garantierte, konsistente Richtliniendurchsetzung für alle neuen Subscriptions — wie gehst du vor?

**Antwort:** Ich würde einen automatisierten Subscription-Bereitstellungsprozess einrichten, der neue Subscriptions standardmäßig der korrekten Management-Group zuordnet, sodass sie automatisch die vererbten Richtlinien erhalten, ohne dass ein manueller, fehleranfälliger Zusatzschritt nötig ist.

## Praktische Labs

~~~python
# Conceptual Azure Policy inheritance simulation (not executed against a real Azure tenant):

def resolve_effective_policies(subscription_mg_path, policy_assignments):
    """subscription_mg_path: list of management group IDs from root to the subscription's direct parent.
    policy_assignments: {management_group_id: [policy_names]}"""
    effective_policies = []
    for mg_id in subscription_mg_path:
        effective_policies.extend(policy_assignments.get(mg_id, []))
    return effective_policies

policy_assignments = {
    "root": ["require-tagging"],
    "platform": ["restrict-locations"],
    "landing-zones-corp": ["require-encryption"],
}

subscription_path = ["root", "landing-zones-corp"]
print(f"Effective policies for subscription: {resolve_effective_policies(subscription_path, policy_assignments)}")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure — Organize Your Resources with Management Groups](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure Enterprise-Scale Landing Zone — Architecture](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/enterprise-scale/architecture), abgerufen 2026-09-18.

Landing Zones sind kanonisch in [KB-0450](../18-cloud-foundations/10-landing-zones.md) behandelt; AWS-Organisationen und Landing Zones in [KB-0463](../19-aws/01-aws-organisationen-und-landing-zones.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Azure-Landing-Zone-Bereitstellungsvorlagen (Bicep/Terraform-basiert) mit integrierter Compliance-Prüfung | Adopting | Gegenüber manuell konfigurierten Management-Group-Hierarchien bevorzugen, sobald die Abdeckung der eigenen Governance-Anforderungen geprüft ist. |

Ein Team akzeptiert eine Azure-Management-Group-Struktur erst, wenn Policy-Zuweisungen nachweislich auf den korrekten Hierarchieebenen platziert sind und die Platform-/Landing-Zone-Trennung dem Referenzmodell entspricht.
