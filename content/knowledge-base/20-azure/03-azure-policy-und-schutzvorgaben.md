---
{"id": "KB-0483", "title": "Azure Policy und Schutzvorgaben", "domain": "20", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0481", "concepts": ["Azure-Organisation und Enterprise Landing Zones"], "needed_for": "understanding"}, {"id": "KB-0392", "concepts": ["RBAC und Service Accounts"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Azure-Policy-Definition mit einem Assignment und einem Remediation-Task anhand offizieller Dokumentation erstellen können und den Unterschied zwischen präventiver (Deny) und reaktiver (Audit/Remediate) Policy-Wirkung erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Schutzvorgaben-Konzept gestalten, das Azure Policy und RBAC als komplementäre, nicht austauschbare Kontrollebenen kombiniert und explizit klärt, welche Anforderungen präventiv durch Policy und welche durch RBAC-Zugriffsbeschränkung durchgesetzt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, nicht-konforme Ressourcenkonfiguration auf eine Policy mit reinem Audit-Effekt statt einer präventiven Deny-Wirkung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Azure-Governance-Richtlinien im Unternehmen anhand einer expliziten Unterscheidung zwischen präventiver Policy-Durchsetzung und nachgelagerter RBAC-Zugriffskontrolle statt anhand einer undifferenzierten Vermischung beider Mechanismen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Azure-Policy-Evaluierungs-Engine im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Assignments, Initiatives, Remediation und der Abgrenzung zu RBAC als Entscheidungsgrundlage, nicht die Evaluierungs-Engine-Interna."}}, "lab_validation": [{"lab_id": "KB-0483-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-Policy-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Azure-Policy-Assignments Definitionen auf einen bestimmten Scope anwenden, wie Initiatives mehrere Policy-Definitionen zu einer Gruppe zusammenfassen, wie Remediation-Tasks bereits bestehende, nicht-konforme Ressourcen nachträglich korrigieren, und warum Azure Policy (Konfigurationskonformität) und RBAC (Zugriffskontrolle) unterschiedliche, komplementäre Schutzebenen darstellen, die nicht gegeneinander austauschbar sind.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Policy-Konfiguration erstellt."}]}
---
# Azure Policy und Schutzvorgaben

> **Ziel:** Azure Policy setzt Konfigurationsrichtlinien für Ressourcen durch — ein Assignment wendet eine Policy-Definition auf einen bestimmten Scope an (siehe Azure-Organisation und Enterprise Landing Zones, [KB-0481](01-azure-organisation-und-enterprise-landing-zones.md)), eine Initiative fasst mehrere zusammengehörige Policy-Definitionen zu einer Gruppe zusammen (z. B. alle Policies für eine bestimmte Compliance-Anforderung), und Remediation-Tasks korrigieren nachträglich bereits bestehende, nicht-konforme Ressourcen, die vor der Policy-Einführung erstellt wurden. Der zentrale Punkt dieses Kapitels ist, dass Azure Policy und RBAC (siehe RBAC und Service Accounts, [KB-0392](../16-kubernetes-platform/14-rbac-und-service-accounts.md)) zwei fundamental unterschiedliche, komplementäre Schutzebenen darstellen — RBAC regelt, wer welche Aktionen ausführen darf, während Policy regelt, welche Konfigurationszustände einer Ressource überhaupt zulässig sind, unabhängig davon, wer die Ressource erstellt oder ändert; eine unerwartete, nicht-konforme Ressourcenkonfiguration ist häufig darauf zurückzuführen, dass eine Policy nur im Audit-Modus (protokolliert Verstöße, verhindert sie aber nicht) statt im Deny-Modus (verhindert die Erstellung nicht-konformer Ressourcen präventiv) konfiguriert wurde.

## Zweck, Mental Model und Dependencies

RBAC beantwortet die Frage "wer darf was tun" — eine Identität mit ausreichenden RBAC-Berechtigungen kann eine Ressource erstellen oder ändern, unabhängig davon, welche konkrete Konfiguration diese Ressource hat. Azure Policy beantwortet eine andere Frage: "welche Konfigurationszustände sind überhaupt zulässig" — selbst eine Identität mit vollständigen RBAC-Berechtigungen kann durch eine Policy daran gehindert werden, eine Ressource mit einer bestimmten, unzulässigen Konfiguration zu erstellen (z. B. eine Ressource ohne Verschlüsselung, oder in einer nicht zulässigen Region). Der Effekt einer Policy-Definition kann unterschiedlich konfiguriert sein: "Deny" verhindert präventiv die Erstellung oder Änderung einer nicht-konformen Ressource, während "Audit" eine nicht-konforme Konfiguration lediglich protokolliert, ohne sie tatsächlich zu verhindern — eine Policy im Audit-Modus bietet also Sichtbarkeit über Compliance-Verstöße, aber keinen tatsächlichen, präventiven Schutz. Ein Assignment verknüpft eine Policy-Definition (oder eine Initiative, eine Gruppierung mehrerer Definitionen) mit einem konkreten Scope (Management Group, Subscription, oder Resource Group) — der Scope bestimmt, welche Ressourcen tatsächlich von der Policy betroffen sind, wobei Ausnahmen (Exemptions) es ermöglichen, bestimmte Ressourcen gezielt von einer sonst geltenden Policy auszunehmen, wenn ein dokumentierter, begründeter Ausnahmefall vorliegt. Remediation-Tasks adressieren das Problem bereits bestehender, nicht-konformer Ressourcen — eine neu eingeführte Policy wirkt sich nur auf neue oder geänderte Ressourcen aus, weshalb Ressourcen, die bereits vor der Policy-Einführung existierten und deren Konfiguration nicht den neuen Anforderungen entspricht, weiterhin nicht-konform bleiben, bis ein expliziter Remediation-Task ausgeführt wird, der diese bestehenden Ressourcen nachträglich korrigiert (sofern die Policy-Definition eine automatische Korrektur unterstützt). Der zentrale methodische Punkt ist, dass eine unerwartete, tatsächlich vorhandene, nicht-konforme Ressourcenkonfiguration trotz einer scheinbar zutreffenden Policy häufig darauf zurückzuführen ist, dass die Policy im Audit- statt im Deny-Modus konfiguriert ist (die Verletzung wird protokolliert, aber nicht verhindert), oder dass die betroffene Ressource bereits vor der Policy-Einführung existierte und noch kein Remediation-Task ausgeführt wurde.

~~~text
RBAC: answers "WHO can do WHAT" -- identity with sufficient RBAC perms CAN create/modify a resource
  regardless of its specific configuration
Azure Policy: answers "WHICH configuration STATES are even ALLOWED"
  -> even a FULLY-PERMITTED identity can be BLOCKED from creating a non-compliant configuration
Policy effect:
  "Deny": PREVENTIVELY blocks creation/modification of a non-compliant resource
  "Audit": ONLY logs the non-compliant config, does NOT actually prevent it
    -> visibility, but NO actual preventive protection
Assignment: links a definition (or Initiative -- grouped definitions) to a SCOPE
  (management group, subscription, resource group) -- Exemptions carve out documented exceptions
Remediation Task: corrects EXISTING, already-created non-compliant resources
  -> new policy only affects NEW/CHANGED resources by default
  -> pre-existing resources stay non-compliant until an EXPLICIT remediation task runs
KEY METHODOLOGICAL POINT: unexpected non-compliant configuration DESPITE a seemingly matching policy
  often traceable to: policy in AUDIT (not Deny) mode, OR
  resource pre-dates the policy and NO remediation task has run yet
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Policy-Definition | beschreibt eine konkrete Konfigurationsregel | Effekt (Deny/Audit) bestimmt tatsächliche Schutzwirkung |
| Initiative | gruppiert mehrere Policy-Definitionen | erleichtert Verwaltung zusammengehöriger Compliance-Anforderungen |
| Assignment und Scope | wendet Policy/Initiative auf einen Bereich an | Scope bestimmt betroffene Ressourcen, Exemptions ermöglichen Ausnahmen |
| Remediation-Task | korrigiert bestehende, nicht-konforme Ressourcen | notwendig, da neue Policies nur neue/geänderte Ressourcen automatisch abdecken |

Implementierung: Für jede sicherheitskritische Konfigurationsanforderung wird explizit geprüft, ob die zugehörige Policy im Deny-Modus (präventiver Schutz) oder nur im Audit-Modus (reine Protokollierung) konfiguriert ist, und der Effekt wird bewusst gegen die tatsächliche Kritikalität der Anforderung gewählt. Nach der Einführung einer neuen Policy wird ein Remediation-Task ausgeführt, um bereits bestehende, nicht-konforme Ressourcen nachträglich zu korrigieren, statt anzunehmen, dass die Policy automatisch auch für bereits existierende Ressourcen wirkt. RBAC und Policy werden bewusst komplementär eingesetzt — RBAC regelt, wer Ressourcen erstellen/ändern darf, während Policy unabhängig davon regelt, welche Konfigurationen dabei überhaupt zulässig sind.

## Scalability, Reliability, Security und Observability

Azure Policy skaliert die Konfigurationskonformität proportional zur Vollständigkeit der Deny-Modus-Abdeckung kritischer Anforderungen und der regelmäßigen Ausführung von Remediation-Tasks; die Reliability-Grenze liegt darin, dass eine Policy im Audit-Modus proportional zur Häufigkeit tatsächlicher Verstöße nur Sichtbarkeit, aber keinen tatsächlichen, präventiven Schutz bietet.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine nicht-konforme Ressourcenkonfiguration existiert trotz scheinbar zutreffender Policy | die Policy ist im Audit- statt im Deny-Modus konfiguriert, oder die Ressource existierte bereits vor der Policy-Einführung ohne nachfolgendes Remediation | den Policy-Effekt (Deny/Audit) und den Zeitpunkt der Ressourcenerstellung relativ zur Policy-Einführung prüfen |
| eine berechtigte Identität kann eine Ressource trotz ausreichender RBAC-Rechte nicht erstellen | eine Deny-Policy verhindert die Erstellung aufgrund einer unzulässigen Konfiguration, unabhängig von den RBAC-Rechten | die relevante Policy-Definition und deren Anforderungen gegen die geplante Ressourcenkonfiguration prüfen |
| eine begründete Ausnahme von einer Policy führt zu wiederholten, manuellen Umgehungsversuchen | keine formale Exemption wurde für den dokumentierten Ausnahmefall eingerichtet | eine explizite, dokumentierte Policy-Exemption für den begründeten Ausnahmefall einrichten |

Security: Deny-Policies sollten für alle sicherheitskritischen Konfigurationsanforderungen (z. B. verpflichtende Verschlüsselung, Netzwerkisolationsanforderungen) bevorzugt werden, da nur diese tatsächlich präventiven Schutz bieten, während Audit-Policies primär für weniger kritische, empfehlende Anforderungen geeignet sind. Observability: Der tatsächliche Compliance-Status aller betroffenen Ressourcen, die Häufigkeit ausgeführter Remediation-Tasks, und die Verteilung von Deny- versus Audit-Effekten über alle Policy-Zuweisungen sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** wählt den Policy-Effekt (Deny/Audit) bewusst anhand der tatsächlichen Kritikalität jeder Anforderung. **Principal** macht die Abgrenzung zwischen RBAC und Policy für das Team nachvollziehbar. **Chief** legt Azure-Governance-Richtlinien im Unternehmen anhand expliziter Unterscheidung zwischen präventiver Policy-Durchsetzung und RBAC-Zugriffskontrolle fest.

Anti-Patterns: kritische Sicherheitsanforderungen nur im Audit-Modus statt im Deny-Modus konfigurieren und dadurch tatsächlichen, präventiven Schutz verfehlen; nach Einführung einer neuen Policy keinen Remediation-Task für bestehende, nicht-konforme Ressourcen ausführen; RBAC und Policy als austauschbare statt komplementäre Kontrollebenen behandeln.

## Production Checklist

- [ ] Sicherheitskritische Anforderungen sind mit Deny-Effekt, nicht nur Audit, konfiguriert.
- [ ] Remediation-Tasks werden nach jeder neuen Policy-Einführung für bestehende Ressourcen ausgeführt.
- [ ] Policy-Exemptions sind explizit dokumentiert für begründete Ausnahmefälle.
- [ ] Der tatsächliche Compliance-Status wird regelmäßig über alle betroffenen Ressourcen überwacht.

## Interviewfragen

### 1. Was ist der zentrale konzeptionelle Unterschied zwischen RBAC und Azure Policy?

**Antwort:** RBAC regelt, wer welche Aktionen ausführen darf; Azure Policy regelt, welche Konfigurationszustände einer Ressource überhaupt zulässig sind, unabhängig davon, wer sie erstellt oder ändert.

### 2. Was ist der Unterschied zwischen dem Deny- und dem Audit-Effekt einer Policy?

**Antwort:** Deny verhindert präventiv die Erstellung oder Änderung einer nicht-konformen Ressource; Audit protokolliert die Nicht-Konformität lediglich, ohne sie zu verhindern.

### 3. Warum reicht die Einführung einer neuen Policy allein nicht aus, um alle betroffenen Ressourcen konform zu machen?

**Antwort:** Weil eine neue Policy standardmäßig nur neue oder geänderte Ressourcen betrifft; bereits bestehende, nicht-konforme Ressourcen bleiben nicht-konform, bis ein expliziter Remediation-Task ausgeführt wird.

### 4. Was ermöglicht eine Policy-Exemption?

**Antwort:** Sie nimmt eine bestimmte, dokumentiert begründete Ressource gezielt von einer sonst geltenden Policy aus, statt die Policy allgemein zu lockern.

### 5. Wie gehst du vor, wenn eine nicht-konforme Ressourcenkonfiguration trotz scheinbar zutreffender Policy existiert?

**Antwort:** Ich prüfe, ob die Policy im Audit- statt im Deny-Modus konfiguriert ist, oder ob die Ressource bereits vor der Policy-Einführung existierte, ohne dass ein Remediation-Task ausgeführt wurde.

### 6. Widersprüchliche Anforderung: Team will maximale Entwicklungsflexibilität (keine Deny-Policies) UND garantierte Compliance für kritische Sicherheitsanforderungen — wie gehst du vor?

**Antwort:** Ich würde Deny-Policies gezielt nur für tatsächlich kritische Sicherheitsanforderungen einsetzen (z. B. verpflichtende Verschlüsselung), während weniger kritische, empfehlende Anforderungen im Audit-Modus verbleiben, sodass Entwicklungsflexibilität für nicht-kritische Aspekte erhalten bleibt, ohne echte Compliance-Garantien für kritische Anforderungen zu opfern.

## Praktische Labs

~~~python
# Conceptual policy-effect coverage check (not executed against a real Azure tenant):

def check_policy_protection(policy_name, effect, criticality):
    if criticality == "critical" and effect != "Deny":
        return {"policy": policy_name, "risk": "HIGH", "reason": "critical requirement not enforced preventively"}
    return {"policy": policy_name, "risk": "acceptable", "effect": effect}

policies = [
    {"policy_name": "require-encryption-at-rest", "effect": "Audit", "criticality": "critical"},  # gap
    {"policy_name": "recommend-tagging", "effect": "Audit", "criticality": "low"},
]

for p in policies:
    print(check_policy_protection(**p))
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Policy — Overview](https://learn.microsoft.com/en-us/azure/governance/policy/overview), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure Policy — Remediate Non-Compliant Resources](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources), abgerufen 2026-09-18.

Azure-Organisation und Enterprise Landing Zones sind kanonisch in [KB-0481](01-azure-organisation-und-enterprise-landing-zones.md) behandelt; RBAC und Service Accounts in [KB-0392](../16-kubernetes-platform/14-rbac-und-service-accounts.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Compliance-Dashboards mit proaktiven Empfehlungen für den Wechsel von Audit- zu Deny-Effekten basierend auf beobachteten Verstößen | Adopting | Gegenüber manueller Effekt-Auswahl bevorzugen, sobald die tatsächliche Empfehlungsqualität für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert eine Azure-Policy-Konfiguration erst, wenn kritische Anforderungen nachweislich mit Deny-Effekt durchgesetzt sind und Remediation-Tasks für bestehende Ressourcen ausgeführt wurden.
