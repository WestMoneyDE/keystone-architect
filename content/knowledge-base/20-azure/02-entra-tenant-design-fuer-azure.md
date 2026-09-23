---
{"id": "KB-0482", "title": "Entra-Tenant-Design für Azure", "domain": "20", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0444", "concepts": ["Cloud-IAM-Grundarchitektur"], "needed_for": "understanding"}, {"id": "KB-0481", "concepts": ["Azure-Organisation und Enterprise Landing Zones"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Managed Identity für eine Azure-Ressource anhand offizieller Dokumentation konfigurieren können und erklären, warum Managed Identities gegenüber dauerhaften Zugangsschlüsseln vorzuziehen sind, konsistent mit der allgemeinen Cloud-IAM-Praxis.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Entra-Tenant-Design gestalten, das Gastzugriff (B2B-Kollaboration) explizit von regulären, tenant-internen Identitäten trennt und administrative Verantwortungsgrenzen zwischen Tenant- und Subscription-Ebene dokumentiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Zugriff eines externen Gastnutzers auf interne Ressourcen auf eine unzureichend eingeschränkte Gastzugriffs-Konfiguration zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Entra-Governance-Richtlinien im Unternehmen anhand expliziter Trennung von Gastzugriff, dedizierter Managed-Identity-Nutzung und dokumentierter administrativer Verantwortungsgrenzen statt anhand einer undifferenzierten Tenant-Konfiguration festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Entra-Authentifizierungsprotokolle (z. B. OIDC, SAML) im Detail sind Vertiefung und Gegenstand von Domain 23.", "rationale": "Kern dieses Kapitels ist das Tenant-Design (Gastzugriff, Managed Identities, Verantwortungsgrenzen) für den Cloudaufbau, nicht die konkreten Authentifizierungsprotokolle."}}, "lab_validation": [{"lab_id": "KB-0482-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Microsoft-Entra-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie ein Entra-Tenant als zentraler Identitätscontainer für eine Organisation fungiert, wie Gastzugriff (B2B-Kollaboration) externen Nutzern eingeschränkten Zugang gewährt, und wie Managed Identities es Azure-Ressourcen ermöglichen, ohne gespeicherte Zugangsschlüssel auf andere Ressourcen zuzugreifen, analog zu AWS IRSA/IAM-Rollen (siehe KB-0464, KB-0470).", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Entra-Tenant-Konfiguration erstellt."}]}
---
# Entra-Tenant-Design für Azure

> **Ziel:** Ein Microsoft-Entra-Tenant (früher Azure Active Directory) ist der zentrale Identitätscontainer, der Azure-Ressourcen zugrunde liegt (siehe Cloud-IAM-Grundarchitektur, [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md)) — er verwaltet sowohl reguläre, tenant-interne Identitäten als auch Gastzugriff (B2B-Kollaboration, bei der externen Nutzern eingeschränkter Zugang zu bestimmten Ressourcen gewährt wird, ohne dass diese eine vollständige, interne Identität im Tenant benötigen) sowie Managed Identities (Azure-Ressourcen erhalten automatisch verwaltete, temporäre Zugangsdaten für den Zugriff auf andere Ressourcen, ohne dass Zugangsschlüssel gespeichert werden müssen, konzeptionell vergleichbar mit AWS IAM-Rollen und IRSA, siehe [KB-0464](../19-aws/02-aws-iam-und-rollenmodell.md) und [KB-0470](../19-aws/08-amazon-eks.md)). Der zentrale Punkt dieses Kapitels ist, dass Gastzugriff explizit und eng eingeschränkt konfiguriert werden muss — eine zu weit gefasste Gastzugriffs-Konfiguration kann externen Nutzern unbeabsichtigt Zugriff auf interne Ressourcen gewähren, die eigentlich nur für tenant-interne Identitäten vorgesehen waren, weshalb eine unerwartete Zugriffsberechtigung eines externen Nutzers typischerweise auf eine unzureichend restriktive Gastzugriffs-Konfiguration zurückzuführen ist, nicht auf eine allgemeine Sicherheitslücke im Entra-Mechanismus selbst.

## Zweck, Mental Model und Dependencies

Ein Entra-Tenant repräsentiert eine Organisation als eigenständigen Identitäts-Namensraum, innerhalb dessen sowohl Mitarbeiteridentitäten als auch, über B2B-Kollaboration, externe Gastidentitäten (z. B. Partner, Auftragnehmer) verwaltet werden können — ein Gastnutzer erhält dabei eine eingeschränkte, im Tenant sichtbare Identität, deren tatsächlicher Zugriffsumfang jedoch explizit über Zuweisungen zu Ressourcen oder Gruppen konfiguriert werden muss, statt implizit denselben Zugriff wie eine reguläre, interne Identität zu erhalten. Managed Identities adressieren dasselbe grundlegende Problem wie AWS IAM-Rollen (siehe [KB-0464](../19-aws/02-aws-iam-und-rollenmodell.md)) — die Vermeidung dauerhafter, potenziell offenlegbarer Zugangsschlüssel für den Zugriff von Azure-Ressourcen (z. B. einer virtuellen Maschine oder einer Funktion) auf andere Azure-Ressourcen — indem eine Identität automatisch an die Ressource gebunden wird und temporäre, automatisch rotierte Zugangsdaten bereitstellt, ohne dass diese im Anwendungscode oder in einer Konfigurationsdatei gespeichert werden müssen. Es existieren zwei Varianten: System-Assigned Managed Identities sind an den Lebenszyklus einer spezifischen Ressource gebunden (werden mit der Ressource erstellt und gelöscht), während User-Assigned Managed Identities eigenständig existieren und mehreren Ressourcen zugeordnet werden können, was bei gemeinsam genutzten Berechtigungsanforderungen über mehrere Ressourcen hinweg relevant wird. Der zentrale methodische Punkt ist, dass Gastzugriff und Managed Identities zwei unterschiedliche, aber gleichermaßen sorgfältig zu konfigurierende Aspekte des Tenant-Designs darstellen — eine zu weit gefasste Gastzugriffs-Konfiguration (z. B. eine Standardeinstellung, die Gastnutzern automatisch breiten Zugriff auf das Verzeichnis gewährt) untergräbt die Isolation zwischen internen und externen Identitäten, während eine unzureichende Nutzung von Managed Identities (z. B. weiterhin dauerhafte Zugangsschlüssel für Azure-Ressourcen-Zugriffe verwenden) dieselben Risiken birgt wie bei fehlender IAM-Rollen-Nutzung in AWS.

~~~text
Entra Tenant: organization's own identity namespace
  regular employee identities + Guest access (B2B collaboration for external partners/contractors)
  guest identity: LIMITED, VISIBLE in tenant, but actual access scope must be EXPLICITLY assigned
    to resources/groups -- NOT implicitly equal to a regular internal identity's access
Managed Identity: solves the SAME problem as AWS IAM roles (see KB-0464)
  -> avoids permanent, potentially-exposed access keys for Azure-resource-to-resource access
  System-Assigned: bound to ONE resource's lifecycle (created/deleted WITH it)
  User-Assigned: STANDALONE, can be attached to MULTIPLE resources (shared permission needs)
KEY METHODOLOGICAL POINT: unexpected external guest access to internal resources
  typically NOT a general Entra security flaw
  -> traceable to an INSUFFICIENTLY RESTRICTIVE guest access configuration
     (e.g. default settings granting broad directory access to guests)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Entra-Tenant | zentraler Identitäts-Namensraum der Organisation | Grundlage für alle Azure-IAM-Entscheidungen |
| Gastzugriff (B2B) | eingeschränkter Zugang für externe Nutzer | Zugriffsumfang muss explizit konfiguriert werden, nicht implizit angenommen |
| System-Assigned Managed Identity | an Ressourcenlebenszyklus gebunden | automatisch erstellt/gelöscht mit der Ressource |
| User-Assigned Managed Identity | eigenständig, mehreren Ressourcen zuordenbar | relevant bei gemeinsam genutzten Berechtigungsanforderungen |

Implementierung: Gastzugriffs-Einstellungen werden explizit auf restriktive Standardwerte konfiguriert, statt Gastnutzern implizit breiten Verzeichniszugriff zu gewähren, und der tatsächliche Ressourcenzugriff jedes Gastnutzers wird gezielt über explizite Zuweisungen geregelt. Azure-Ressourcen, die auf andere Azure-Ressourcen zugreifen müssen, werden konsequent mit Managed Identities statt dauerhafter Zugangsschlüssel konfiguriert, mit System-Assigned Identities für ressourcenspezifische Zugriffe und User-Assigned Identities für über mehrere Ressourcen gemeinsam genutzte Berechtigungen. Administrative Verantwortungsgrenzen zwischen Tenant-Ebene (z. B. Global-Administrator-Rollen) und Subscription-Ebene (z. B. Subscription-Owner-Rollen) werden explizit dokumentiert, um Klarheit über Eskalations- und Entscheidungswege zu schaffen.

## Scalability, Reliability, Security und Observability

Entra-Tenant-Design skaliert die Sicherheit der Azure-Identitätsverwaltung proportional zur Restriktivität der Gastzugriffs-Konfiguration und dem Anteil der Zugriffe über Managed Identities statt dauerhafter Zugangsschlüssel; die Reliability-Grenze liegt darin, dass eine zu weit gefasste Gastzugriffs-Konfiguration proportional zur Anzahl externer Gastnutzer zu einer entsprechend großen, unbeabsichtigten Zugriffsfläche auf interne Ressourcen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein externer Gastnutzer hat unerwarteten Zugriff auf interne Ressourcen | die Gastzugriffs-Konfiguration ist zu weit gefasst und gewährt implizit breiteren Zugriff als beabsichtigt | die Gastzugriffs-Einstellungen und die tatsächlichen Ressourcenzuweisungen für den betroffenen Gastnutzer prüfen |
| eine Azure-Ressource zeigt eine unerwartet breite oder dauerhafte Berechtigung | die Ressource nutzt weiterhin dauerhafte Zugangsschlüssel statt einer Managed Identity | die Ressource auf eine System- oder User-Assigned Managed Identity umstellen |
| es ist unklar, wer für eine bestimmte administrative Entscheidung zuständig ist | die Verantwortungsgrenze zwischen Tenant- und Subscription-Ebene ist nicht dokumentiert | die administrativen Rollen und deren Zuständigkeitsbereiche explizit dokumentieren |

Security: Gastzugriffs-Konfigurationen sollten regelmäßig überprüft werden, insbesondere bei Organisationsänderungen (z. B. beendete Partnerschaften), um veraltete, nicht mehr benötigte Gastzugriffe zu entfernen. Observability: Die tatsächliche Anzahl aktiver Gastidentitäten und deren Zugriffsumfang, der Anteil der Azure-Ressourcen mit Managed-Identity-Nutzung gegenüber dauerhaften Zugangsschlüsseln, und die Dokumentation administrativer Verantwortungsgrenzen sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Gastzugriff restriktiv und stellt Azure-Ressourcen konsequent auf Managed Identities um. **Principal** macht die Trennung zwischen Gastzugriff und internen Identitäten sowie die Managed-Identity-Praxis für das Team nachvollziehbar. **Chief** legt Entra-Governance-Richtlinien im Unternehmen anhand expliziter Trennung und dokumentierter Verantwortungsgrenzen fest.

Anti-Patterns: Gastzugriffs-Einstellungen auf breiten Standardwerten belassen, ohne den tatsächlichen Zugriffsumfang jedes Gastnutzers explizit zu prüfen; Azure-Ressourcen mit dauerhaften Zugangsschlüsseln statt Managed Identities betreiben; administrative Verantwortungsgrenzen zwischen Tenant- und Subscription-Ebene ungeklärt lassen.

## Production Checklist

- [ ] Gastzugriffs-Einstellungen sind restriktiv konfiguriert, mit explizit geprüften Ressourcenzuweisungen pro Gastnutzer.
- [ ] Azure-Ressourcen nutzen konsequent Managed Identities statt dauerhafter Zugangsschlüssel.
- [ ] Administrative Verantwortungsgrenzen zwischen Tenant- und Subscription-Ebene sind dokumentiert.
- [ ] Aktive Gastidentitäten werden regelmäßig auf tatsächlichen, fortbestehenden Bedarf geprüft.

## Interviewfragen

### 1. Was ist ein Entra-Tenant, und welche Rolle spielt er für Azure-Ressourcen?

**Antwort:** Der zentrale Identitätscontainer einer Organisation, der sowohl reguläre, interne Identitäten als auch Gastzugriff verwaltet und die Grundlage für alle Azure-IAM-Entscheidungen bildet.

### 2. Was ist der Unterschied zwischen System-Assigned und User-Assigned Managed Identities?

**Antwort:** System-Assigned Identities sind an den Lebenszyklus einer spezifischen Ressource gebunden; User-Assigned Identities existieren eigenständig und können mehreren Ressourcen zugeordnet werden.

### 3. Warum sollten Azure-Ressourcen Managed Identities statt dauerhafter Zugangsschlüssel nutzen?

**Antwort:** Weil Managed Identities automatisch rotierte, temporäre Zugangsdaten bereitstellen, ohne dass Zugangsschlüssel im Code oder in Konfigurationsdateien gespeichert werden müssen, was das Risiko bei versehentlicher Offenlegung erheblich reduziert.

### 4. Warum kann eine unerwartete Zugriffsberechtigung eines externen Gastnutzers auftreten?

**Antwort:** Wenn die Gastzugriffs-Konfiguration zu weit gefasst ist und externen Nutzern implizit breiteren Zugriff auf das Verzeichnis oder interne Ressourcen gewährt, als tatsächlich beabsichtigt war.

### 5. Wie gehst du vor, wenn ein externer Gastnutzer unerwarteten Zugriff auf interne Ressourcen hat?

**Antwort:** Ich prüfe die Gastzugriffs-Konfiguration und die tatsächlichen Ressourcenzuweisungen für diesen Gastnutzer, da eine zu weit gefasste Konfiguration die wahrscheinlichste Ursache ist, nicht eine allgemeine Sicherheitslücke.

### 6. Widersprüchliche Anforderung: Team will einfache, unkomplizierte externe Zusammenarbeit (breiter Gastzugriff) UND garantierte Isolation interner Ressourcen — wie gehst du vor?

**Antwort:** Ich würde Gastzugriff gezielt und eng auf die tatsächlich benötigten Ressourcen und Gruppen beschränken, statt einen pauschal breiten Zugriff zu gewähren, sodass externe Zusammenarbeit für die konkret benötigten Zwecke möglich bleibt, ohne die Isolation der übrigen internen Ressourcen zu gefährden.

## Praktische Labs

~~~python
# Conceptual guest-access scope verification (not executed against a real Entra tenant):

def check_guest_access_scope(guest_id, explicit_resource_assignments, has_broad_directory_default):
    if has_broad_directory_default:
        return {"risk": "HIGH", "reason": "broad default directory access grants more than intended assignments"}
    if not explicit_resource_assignments:
        return {"risk": "LOW", "reason": "no explicit assignments, minimal access"}
    return {"risk": "acceptable", "assigned_resources": explicit_resource_assignments}

result = check_guest_access_scope(
    guest_id="partner-user-123",
    explicit_resource_assignments=["shared-project-storage"],
    has_broad_directory_default=True,  # misconfiguration
)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Microsoft Entra B2B Collaboration Overview](https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Managed Identities for Azure Resources](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview), abgerufen 2026-09-18.

Cloud-IAM-Grundarchitektur ist kanonisch in [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md) behandelt; Azure-Organisation und Enterprise Landing Zones in [KB-0481](01-azure-organisation-und-enterprise-landing-zones.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Gastzugriffs-Lifecycle-Verwaltung (Entra Entitlement Management), die den Zugriff externer Nutzer automatisch nach definierten Zeiträumen überprüft oder entfernt | Adopting | Gegenüber manueller Gastzugriffs-Verwaltung bevorzugen, sobald die tatsächliche Abdeckung für die eigene Organisation geprüft ist. |

Ein Team akzeptiert eine Entra-Tenant-Konfiguration erst, wenn Gastzugriff nachweislich restriktiv konfiguriert ist und Azure-Ressourcen konsequent Managed Identities statt dauerhafter Zugangsschlüssel nutzen.
