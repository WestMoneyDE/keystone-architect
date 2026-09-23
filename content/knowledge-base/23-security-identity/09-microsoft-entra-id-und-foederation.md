---
{"id": "KB-0545", "title": "Microsoft Entra ID und Föderation", "domain": "23", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0541", "concepts": ["OpenID Connect"], "needed_for": "understanding"}, {"id": "KB-0544", "concepts": ["Active Directory"], "needed_for": "understanding"}, {"id": "KB-0482", "concepts": ["Entra-Tenant-Design für Azure"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Anwendungsregistrierung, Enterprise Apps und Conditional-Access-Richtlinien anhand offizieller Dokumentation korrekt konfigurieren können, mit klarem Verständnis von Tokenflüssen und hybrider Identitätsanbindung.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Anwendungsregistrierungen, Conditional-Access-Richtlinien und hybride Identitätssynchronisation zwischen On-Premises-Active-Directory und Entra ID konsistent zusammenwirken.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet erfolgreiche Anmeldung trotz vermeintlich strikter Conditional-Access-Richtlinie auf eine Richtlinienlücke (z. B. eine nicht abgedeckte Anwendung oder Bedingung) statt einen grundlegenden Richtlinienfehler zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für vollständige Conditional-Access-Abdeckung und bewusste hybride Identitätsföderation statt lückenhafter, ad hoc konfigurierter Richtlinien festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Entra-ID-Token-Ausstellungsinfrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Anwendungsregistrierung, Conditional Access und Tokenflüssen als Entscheidungsgrundlage, nicht die Token-Ausstellungs-Interna."}}, "lab_validation": [{"lab_id": "KB-0545-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Microsoft-Dokumentation zu Anwendungsregistrierung, Enterprise Apps, Conditional Access und hybrider Identität, kein aktives Entra-ID-System verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie eine App-Registrierung die Identität einer Anwendung gegenüber Entra ID definiert, wie ein Enterprise-App-Objekt die konkrete, tenant-spezifische Instanz dieser Anwendung mit zugewiesenen Berechtigungen darstellt, wie Conditional-Access-Richtlinien basierend auf Signalen (Gerät, Standort, Risikostufe) den Zugriff steuern, und wie eine Richtlinienlücke (eine nicht von einer Richtlinie abgedeckte Anwendung oder Bedingung) zu einer unerwartet erfolgreichen Anmeldung führen kann, obwohl andere Richtlinien vermeintlich strikt konfiguriert sind.", "limitations": "Kein aktives Entra-ID-System verwendet, keine reale Konfiguration erstellt."}]}
---
# Microsoft Entra ID und Föderation

> **Ziel:** Dieses Kapitel behandelt Microsoft Entra ID aus der Föderations- und Anwendungsintegrationsperspektive — **Anwendungsregistrierung** (definiert die Identität einer Anwendung gegenüber Entra ID, inklusive unterstützter Tokenflüsse und angeforderter Berechtigungen), **Enterprise Apps** (die konkrete, tenant-spezifische Instanz einer registrierten Anwendung mit tatsächlich zugewiesenen Nutzern und Berechtigungen), und **Conditional Access** (Richtlinien, die den Zugriff basierend auf Signalen wie Gerätezustand, Standort oder Risikobewertung steuern), während die organisatorische Tenant-Struktur bereits kanonisch in [KB-0482](../20-azure/02-entra-tenant-design-fuer-azure.md) behandelt ist. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartet erfolgreiche Anmeldung trotz vermeintlich strikter Conditional-Access-Konfiguration typischerweise nicht auf einen grundlegenden Fehler in einer einzelnen Richtlinie hindeutet, sondern auf eine Richtlinienlücke — eine Anwendung, ein Anmeldeszenario, oder eine Bedingung, die von keiner der konfigurierten Richtlinien tatsächlich abgedeckt wird, wodurch der Zugriff standardmäßig ohne die beabsichtigten zusätzlichen Kontrollen erfolgt.

## Zweck, Mental Model und Dependencies

Eine App-Registrierung definiert die technische Identität einer Anwendung innerhalb von Entra ID — sie legt fest, über welche OAuth2/OIDC-Flows (siehe [KB-0540](04-oauth2-und-delegierter-zugriff.md) und [KB-0541](05-openid-connect.md)) sich die Anwendung authentifizieren kann, welche Redirect-URIs für den Token-Rückkanal zulässig sind, und welche Berechtigungen (API-Zugriffsrechte) sie potenziell anfordern kann. Ein Enterprise-App-Objekt ist die konkrete, tenant-spezifische Manifestation dieser Registrierung — während eine App-Registrierung die generische Definition einer Anwendung ist (die auch mehreren Tenants zugänglich gemacht werden kann), repräsentiert das Enterprise-App-Objekt die tatsächliche Instanz innerhalb eines spezifischen Tenants, mit den dort tatsächlich zugewiesenen Nutzern, gewährten Berechtigungen, und angewendeten Zugriffsrichtlinien. Conditional Access ist der zentrale Mechanismus, über den zusätzliche, kontextabhängige Zugriffskontrollen durchgesetzt werden — eine Richtlinie kombiniert Bedingungen (etwa: Zugriff von einem nicht verwalteten Gerät, von einem unerwarteten geografischen Standort, oder mit erhöhter, durch Verhaltensanalyse ermittelter Risikobewertung) mit Aktionen (etwa: zusätzliche Multi-Faktor-Authentifizierung verlangen, Zugriff vollständig blockieren, oder nur eingeschränkten Zugriff gewähren). Die entscheidende operative Herausforderung ist die vollständige Abdeckung: Conditional-Access-Richtlinien wirken nur für die explizit in ihrem Geltungsbereich definierten Anwendungen, Nutzergruppen und Bedingungen — eine neu registrierte Anwendung, die nicht in den Geltungsbereich bestehender Richtlinien aufgenommen wird, oder ein Anmeldeszenario (etwa ein bestimmter Legacy-Authentifizierungsprotokoll-Pfad), das von den konfigurierten Bedingungen nicht erfasst wird, bleibt ohne die beabsichtigten zusätzlichen Kontrollen zugänglich, obwohl andere, vermeintlich vergleichbare Zugriffe strikt reguliert sind. Für hybride Umgebungen synchronisiert Entra ID typischerweise mit einem On-Premises-Active-Directory (siehe [KB-0544](08-active-directory.md)) — die Konsistenz zwischen den dort geltenden Vertrauensgrenzen und der Cloud-seitigen Conditional-Access-Konfiguration muss bewusst modelliert werden, da eine On-Premises-Berechtigung, die nicht korrekt auf die Cloud-Seite abgebildet wird, zu Diskrepanzen zwischen der beabsichtigten und der tatsächlichen, effektiven Zugriffskontrolle führen kann.

~~~text
Microsoft Entra ID: FEDERATION + APP INTEGRATION perspective (org tenant structure -> canonical KB-0482)
  App Registration: defines app's technical identity -- supported OAuth2/OIDC flows (KB-0540/KB-0541),
                     allowed redirect URIs, potentially requestable API permissions
  Enterprise App: CONCRETE, TENANT-SPECIFIC instance of that registration
    -> actually assigned users, granted permissions, applied access policies (vs generic registration)
Conditional Access: context-dependent access control
  CONDITIONS (unmanaged device, unexpected location, elevated risk score) + ACTIONS (require MFA, block, limit)
CRITICAL OPERATIONAL CHALLENGE: COMPLETE COVERAGE
  policies apply ONLY to apps/user groups/conditions EXPLICITLY within their scope
  -> newly registered app NOT added to existing policy scope
     OR sign-in scenario (e.g. legacy auth protocol path) NOT captured by configured conditions
     -> remains accessible WITHOUT intended extra controls, even while comparable access is strictly regulated
HYBRID environments: Entra ID synced with on-prem Active Directory (KB-0544)
  -> on-prem trust boundary consistency with cloud-side Conditional Access MUST be consciously modeled
     -> unmapped on-prem permission -> discrepancy between intended vs actual effective access control
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| App-Registrierung | technische Anwendungsidentität, Flows, Redirect-URIs | Grundlage jeder Anwendungsintegration mit Entra ID |
| Enterprise App | tenant-spezifische Instanz mit tatsächlichen Zuweisungen | trägt die tatsächlich wirksamen Berechtigungen |
| Conditional Access | kontextabhängige Zugriffssteuerung | vollständige Abdeckung über alle Apps/Bedingungen kritisch |
| Hybride Konsistenz | On-Premises-Vertrauensgrenzen versus Cloud-Richtlinien | Diskrepanz bei fehlender bewusster Abbildung |

Implementierung: Für jede neu registrierte Anwendung wird explizit geprüft, ob sie in den Geltungsbereich bestehender Conditional-Access-Richtlinien aufgenommen werden muss, statt implizit ungedeckt zu bleiben. Der Geltungsbereich jeder Conditional-Access-Richtlinie wird regelmäßig gegen die tatsächlich genutzten Anwendungen und Anmeldeszenarien geprüft, um Lücken zu identifizieren. Für hybride Umgebungen wird die Konsistenz zwischen On-Premises-Vertrauensgrenzen und Cloud-seitiger Conditional-Access-Konfiguration explizit modelliert und geprüft.

## Scalability, Reliability, Security und Observability

Microsoft Entra ID skaliert die tatsächliche Zugriffskontrolle proportional zur vollständigen Conditional-Access-Abdeckung über alle Anwendungen und Anmeldeszenarien; die Reliability-Grenze liegt darin, dass eine Richtlinienlücke proportional zu ihrer Reichweite unerwartet ungeschützten Zugriff ermöglicht, obwohl vergleichbare Zugriffe durch andere Richtlinien strikt reguliert sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anmeldung gelingt trotz vermeintlich strikter Conditional-Access-Konfiguration unerwartet erfolgreich | die betroffene Anwendung oder das Anmeldeszenario liegt außerhalb des Geltungsbereichs aller konfigurierten Richtlinien | den Geltungsbereich aller Conditional-Access-Richtlinien explizit gegen die betroffene Anwendung/das Szenario prüfen |
| eine neu registrierte Anwendung wird ohne die erwarteten Zugriffskontrollen genutzt | die neue Anwendung wurde nicht in den Geltungsbereich bestehender Richtlinien aufgenommen | einen verbindlichen Prozess einführen, der neue Anwendungen automatisch oder explizit in relevante Richtlinien einbezieht |
| effektive Zugriffsrechte weichen zwischen On-Premises und Cloud ab | die On-Premises-Vertrauensgrenze wurde nicht bewusst auf die Cloud-seitige Konfiguration abgebildet | die Synchronisations- und Richtlinienkonfiguration explizit auf Konsistenz prüfen |

Security: Conditional-Access-Richtlinien sollten mit einer expliziten "Deny-by-Default"-Grundhaltung für neue Anwendungen konfiguriert werden, statt neue Anwendungen implizit ungedeckt zu lassen. Observability: Die tatsächliche Abdeckung aller registrierten Anwendungen durch Conditional-Access-Richtlinien, die Häufigkeit von Anmeldungen außerhalb des Richtliniengeltungsbereichs, und die Konsistenz zwischen On-Premises- und Cloud-Berechtigungen sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** registriert eine Anwendung und konfiguriert eine einzelne Conditional-Access-Regel korrekt. **Principal** entwirft die vollständige Conditional-Access-Abdeckungsstrategie und hybride Identitätskonsistenz für eine Organisation. **Chief** legt unternehmensweite Standards für vollständige, lückenlose Conditional-Access-Abdeckung fest.

Anti-Patterns: neu registrierte Anwendungen implizit außerhalb des Geltungsbereichs bestehender Conditional-Access-Richtlinien belassen; Conditional-Access-Richtlinien ohne regelmäßige Prüfung auf tatsächliche Abdeckungslücken betreiben; On-Premises-Vertrauensgrenzen ohne bewusste Abbildung auf Cloud-seitige Richtlinien synchronisieren.

## Production Checklist

- [ ] Jede neu registrierte Anwendung wird explizit in den Geltungsbereich relevanter Conditional-Access-Richtlinien aufgenommen.
- [ ] Der Geltungsbereich aller Conditional-Access-Richtlinien wird regelmäßig auf Lücken geprüft.
- [ ] Hybride Identitätskonsistenz zwischen On-Premises und Cloud ist explizit modelliert.
- [ ] Eine "Deny-by-Default"-Grundhaltung gilt für neue, noch nicht explizit abgedeckte Anwendungen.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einer App-Registrierung und einem Enterprise-App-Objekt?

**Antwort:** Die App-Registrierung ist die generische, technische Definition einer Anwendung; das Enterprise-App-Objekt ist die konkrete, tenant-spezifische Instanz dieser Anwendung mit tatsächlich zugewiesenen Nutzern und Berechtigungen.

### 2. Was steuert Conditional Access?

**Antwort:** Den Zugriff basierend auf kontextabhängigen Signalen (Gerätezustand, Standort, Risikobewertung) durch die Kombination von Bedingungen mit Aktionen wie erforderlicher zusätzlicher Authentifizierung oder Zugriffsblockade.

### 3. Warum ist eine unerwartet erfolgreiche Anmeldung trotz vermeintlich strikter Conditional-Access-Konfiguration typischerweise keine grundlegende Richtlinienfehlkonfiguration?

**Antwort:** Weil sie häufig auf eine Richtlinienlücke zurückzuführen ist — eine Anwendung oder ein Anmeldeszenario, das von keiner konfigurierten Richtlinie tatsächlich abgedeckt wird, statt auf einen Fehler innerhalb einer bestehenden Richtlinie.

### 4. Warum ist die Konsistenz zwischen On-Premises-Vertrauensgrenzen und Cloud-seitiger Conditional-Access-Konfiguration in hybriden Umgebungen kritisch?

**Antwort:** Weil eine nicht bewusst auf die Cloud-Seite abgebildete On-Premises-Berechtigung zu Diskrepanzen zwischen beabsichtigter und tatsächlich effektiver Zugriffskontrolle führen kann.

### 5. Wie gehst du vor, wenn eine Anmeldung trotz vermeintlich strikter Conditional-Access-Konfiguration unerwartet erfolgreich gelingt?

**Antwort:** Ich prüfe, ob die betroffene Anwendung oder das Anmeldeszenario außerhalb des Geltungsbereichs aller konfigurierten Richtlinien liegt, da dies die häufigste Ursache für eine solche unerwartete Lücke ist.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Registrierung neuer Anwendungen ohne administrative Verzögerung UND garantiert vollständige Conditional-Access-Abdeckung für jede genutzte Anwendung — wie gehst du vor?

**Antwort:** Ich würde einen automatisierten Prozess vorschlagen, der jede neu registrierte Anwendung standardmäßig in eine restriktive Basis-Conditional-Access-Richtlinie einbezieht, statt sie implizit ungedeckt zu lassen, während spezifische, weniger restriktive Ausnahmen erst nach expliziter Prüfung gewährt werden — schnelle Registrierung und vollständige Abdeckung lassen sich durch einen sicheren Standardzustand statt durch manuelle, verzögerungsanfällige Einzelfallprüfung vor jeder Registrierung vereinbaren.

## Praktische Labs

~~~python
# Conceptual Conditional Access coverage gap check (not executed against a real Entra ID tenant):

def check_ca_coverage(registered_apps, policies):
    covered_apps = set()
    for policy in policies:
        covered_apps.update(policy["applies_to_apps"])
    gaps = [app for app in registered_apps if app not in covered_apps]
    return gaps if gaps else ["all registered apps are covered by at least one Conditional Access policy"]

registered_apps = ["app-a", "app-b", "app-c"]
policies = [{"name": "mfa-required", "applies_to_apps": ["app-a", "app-b"]}]

for gap in check_ca_coverage(registered_apps, policies):
    print(gap)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [App Registrations vs. Enterprise Applications](https://learn.microsoft.com/en-us/entra/identity-platform/app-objects-and-service-principals), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Conditional Access Overview](https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview), abgerufen 2026-09-18.

OpenID Connect ist kanonisch in [KB-0541](05-openid-connect.md) behandelt; Active Directory in [KB-0544](08-active-directory.md); Entra-Tenant-Design für Azure (organisatorische Tenant-Struktur) in [KB-0482](../20-azure/02-entra-tenant-design-fuer-azure.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Erkennung von Conditional-Access-Abdeckungslücken für neu registrierte Anwendungen direkt im Entra-ID-Portal | Evaluating | Gegenüber manueller, periodischer Abdeckungsprüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für komplexe, gewachsene Richtlinienlandschaften bevorzugen. |

Ein Team akzeptiert eine Entra-ID-Konfiguration erst, wenn Conditional-Access-Abdeckung nachweislich vollständig ist und hybride Identitätskonsistenz zwischen On-Premises und Cloud bewusst modelliert wurde.
