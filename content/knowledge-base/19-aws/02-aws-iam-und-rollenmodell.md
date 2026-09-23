---
{"id": "KB-0464", "title": "AWS IAM und Rollenmodell", "domain": "19", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0444", "concepts": ["Cloud-IAM-Grundarchitektur"], "needed_for": "understanding"}, {"id": "KB-0463", "concepts": ["AWS-Organisationen und Landing Zones"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine AWS-IAM-Rolle mit zeitlich begrenzten, temporären Credentials anhand offizieler Dokumentation konfigurieren können und erklären, warum diese gegenüber dauerhaften Zugangsschlüsseln vorzuziehen sind.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein organisationsweites Zugriffsmodell gestalten, das menschliche Identitäten (über föderierte, temporäre Rollenübernahme) und maschinelle Identitäten (über dedizierte Service-Rollen) explizit voneinander trennt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, breite Berechtigung auf eine dauerhaft gültige Zugangsschlüssel-basierte Identität statt einer zeitlich begrenzten Rollenübernahme zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "AWS-IAM-Governance-Richtlinien im Unternehmen anhand konsequenter Nutzung temporärer Credentials und getrennter Rollenmodelle für Mensch und Maschine statt anhand dauerhafter Zugangsschlüssel festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des STS-Token-Ausstellungsprotokolls im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Rollen, temporären Credentials und der Trennung menschlicher/maschineller Identitäten als Entscheidungsgrundlage, nicht die STS-Protokoll-Interna."}}, "lab_validation": [{"lab_id": "KB-0464-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-IAM-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie AWS-IAM-Rollen zeitlich begrenzte, temporäre Credentials über den Security Token Service (STS) ausstellen, warum diese gegenüber dauerhaften Zugangsschlüsseln (Access Keys) ein deutlich geringeres Risiko bei Kompromittierung darstellen, und wie ein organisationsweites Modell menschliche Identitäten (föderierte Rollenübernahme) von maschinellen Identitäten (dedizierte Service-Rollen) trennt.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale IAM-Konfiguration erstellt."}]}
---
# AWS IAM und Rollenmodell

> **Ziel:** AWS IAM kombiniert Policies (die konkreten Berechtigungsregeln, siehe Cloud-IAM-Grundarchitektur, [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md)), Rollen (Identitäten, die temporär übernommen werden, statt dauerhaft an eine Person oder ein System gebunden zu sein) und temporäre Credentials (zeitlich begrenzt gültige Zugangsdaten, ausgestellt über den Security Token Service, STS, bei Übernahme einer Rolle) zu einem Zugriffsmodell, das dauerhafte, statische Zugangsschlüssel (Access Keys) möglichst vollständig vermeidet. Der zentrale Punkt dieses Kapitels ist, dass organisationsweite Zugriffspfade explizit zwischen menschlichen Identitäten (die typischerweise über eine föderierte Anmeldung, z. B. via Single Sign-On, temporär eine Rolle übernehmen) und maschinellen Identitäten (die über dedizierte Service-Rollen agieren, z. B. eine EC2-Instanz oder eine Lambda-Funktion, die eine an die Ressource gebundene Rolle übernimmt, ohne dass Zugangsschlüssel im Code oder in der Konfiguration hinterlegt werden müssen) getrennt gestaltet werden müssen, da beide Identitätstypen fundamental unterschiedliche Lebenszyklen und Risikoprofile haben.

## Zweck, Mental Model und Dependencies

Eine AWS-IAM-Rolle unterscheidet sich von einem IAM-Nutzer grundlegend dadurch, dass sie nicht dauerhaft an eine bestimmte Person oder ein System gebunden ist, sondern temporär von einer berechtigten Identität "übernommen" wird — bei dieser Übernahme stellt der Security Token Service zeitlich begrenzte, temporäre Credentials aus (typischerweise gültig für eine begrenzte Anzahl von Stunden), die nach Ablauf automatisch ungültig werden, ohne dass eine explizite Widerrufsaktion notwendig ist. Dies steht im Gegensatz zu dauerhaften Zugangsschlüsseln (Access Keys), die bis zu ihrer expliziten Rotation oder Löschung unbegrenzt gültig bleiben und bei versehentlicher Offenlegung (z. B. durch versehentliches Einchecken in ein Code-Repository) ein erhebliches, lang anhaltendes Risiko darstellen, da ein Angreifer sie potenzial unbegrenzt lange nutzen kann, bis die Offenlegung bemerkt und der Schlüssel widerrufen wird. Für menschliche Identitäten wird typischerweise eine föderierte Anmeldung eingesetzt (z. B. über ein zentrales Single-Sign-On-System, siehe AWS-Organisationen, [KB-0463](01-aws-organisationen-und-landing-zones.md)), bei der sich ein Nutzer bei einem zentralen Identitätsanbieter authentifiziert und anschließend temporär eine AWS-Rolle übernimmt, statt einen dauerhaften, direkt in AWS verwalteten IAM-Nutzer mit eigenem Passwort und potenziell dauerhaften Zugangsschlüsseln zu besitzen. Für maschinelle Identitäten (Anwendungen, die auf AWS-Ressourcen laufen) wird eine dedizierte Service-Rolle an die jeweilige Ressource (z. B. eine EC2-Instanz oder eine Lambda-Funktion) gebunden, sodass die Anwendung automatisch temporäre Credentials über diese Rolle erhält, ohne dass Zugangsschlüssel jemals im Anwendungscode oder in einer Konfigurationsdatei gespeichert werden müssen — dies eliminiert eine der häufigsten Ursachen für versehentlich offengelegte, dauerhafte Zugangsschlüssel. Der zentrale methodische Punkt ist, dass eine unerwartet breite oder lang anhaltende Berechtigung häufig nicht auf eine fehlerhafte Policy zurückzuführen ist, sondern auf die grundsätzliche Verwendung einer dauerhaften, statischen Identität (IAM-Nutzer mit Access Keys) statt einer zeitlich begrenzten Rollenübernahme — die Umstellung von statischen Zugangsschlüsseln auf temporäre Rollenübernahme ist daher oft eine wirksamere Sicherheitsmaßnahme als eine reine Verschärfung einzelner Policy-Regeln.

~~~text
IAM Role: NOT permanently bound to a person/system, TEMPORARILY "assumed" by an authorized identity
  STS issues TIME-LIMITED temporary credentials on assumption (auto-expire, no explicit revocation needed)
vs. Access Keys: valid indefinitely until explicit rotation/deletion
  accidental exposure (e.g. committed to a code repo) -> SIGNIFICANT, LONG-LASTING risk
  attacker can use them potentially indefinitely until exposure is noticed
Human identities: federated login (central SSO, see KB-0463) -> temporary role assumption
  NOT a permanent, directly-managed IAM user with own password/potentially permanent keys
Machine identities: dedicated service role BOUND to the resource (EC2 instance, Lambda function)
  -> automatic temporary credentials, NO access keys EVER stored in code/config
     eliminates one of the MOST COMMON causes of accidentally exposed permanent keys
KEY METHODOLOGICAL POINT: unexpectedly broad/long-lasting permission
  often NOT a faulty policy, but the fundamental use of a STATIC identity (IAM user + access keys)
  instead of TIME-LIMITED role assumption
  -> switching from static keys to temporary role assumption often MORE effective than tightening individual policy rules
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| IAM-Rolle | temporär übernehmbare Identität | zeitlich begrenzte Gültigkeit reduziert Risiko bei Kompromittierung |
| Temporäre Credentials (STS) | automatisch ablaufende Zugangsdaten | ersetzen dauerhafte Zugangsschlüssel |
| Föderierte Anmeldung (menschlich) | zentrale Authentifizierung, temporäre Rollenübernahme | ersetzt dauerhafte, direkt in AWS verwaltete IAM-Nutzer |
| Service-Rolle (maschinell) | an Ressource gebundene Identität | eliminiert die Notwendigkeit, Zugangsschlüssel im Code zu speichern |

Implementierung: Menschliche Zugriffe werden über eine zentrale, föderierte Anmeldung mit temporärer Rollenübernahme gestaltet, statt dauerhafte IAM-Nutzer mit eigenen Zugangsschlüsseln anzulegen. Maschinelle Identitäten (Anwendungen auf EC2, Lambda, oder anderen AWS-Diensten) erhalten dedizierte Service-Rollen, die an die jeweilige Ressource gebunden sind, sodass niemals Zugangsschlüssel im Anwendungscode oder in Konfigurationsdateien hinterlegt werden müssen. Bestehende, dauerhafte Zugangsschlüssel werden systematisch identifiziert und durch temporäre Rollenübernahme ersetzt, wo dies technisch möglich ist, statt sie unbegrenzt weiterzuverwenden.

## Scalability, Reliability, Security und Observability

AWS IAM mit konsequenter Rollennutzung skaliert die Sicherheit einer Organisation proportional zum Anteil der Zugriffe, die über zeitlich begrenzte Rollenübernahme statt dauerhafter Zugangsschlüssel erfolgen; die Reliability-Grenze liegt darin, dass verbleibende, dauerhafte Zugangsschlüssel proportional zu ihrer Anzahl und ihrem Berechtigungsumfang ein anhaltendes, bei Kompromittierung schwer einzugrenzendes Sicherheitsrisiko darstellen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine unerwartet breite oder lang anhaltende Berechtigung wird entdeckt | die betroffene Identität nutzt dauerhafte Zugangsschlüssel statt temporärer Rollenübernahme | prüfen, ob eine Umstellung auf Rollenübernahme technisch möglich ist, und die dauerhaften Schlüssel entfernen |
| Zugangsschlüssel werden in einem Code-Repository oder Log entdeckt | eine Anwendung nutzt statische Zugangsschlüssel statt einer an die Ressource gebundenen Service-Rolle | die Anwendung auf eine dedizierte Service-Rolle umstellen und die offengelegten Schlüssel sofort widerrufen |
| es ist unklar, welcher tatsächliche Nutzer eine bestimmte Aktion ausgeführt hat | ein gemeinsam genutzter IAM-Nutzer statt individueller, föderierter Rollenübernahme wurde verwendet | föderierte Anmeldung mit individueller Rollenübernahme einführen, um Nachvollziehbarkeit sicherzustellen |

Security: Verbleibende, notwendige dauerhafte Zugangsschlüssel (z. B. für Systeme, die keine Rollenübernahme unterstützen) sollten regelmäßig rotiert und mit möglichst engem Berechtigungsumfang versehen werden, als letzte Verteidigungslinie gegen die höheren Risiken statischer Credentials. Observability: Der Anteil der Zugriffe über temporäre Rollenübernahme versus dauerhafte Zugangsschlüssel, die Anzahl noch bestehender, dauerhafter Access Keys, und deren tatsächliches Nutzungsalter sind zentrale Metriken zur Bewertung der IAM-Sicherheit.

## Trade-offs und Entscheidungen

**Staff** stellt Anwendungen auf dedizierte Service-Rollen statt statischer Zugangsschlüssel um. **Principal** macht die Trennung zwischen menschlichen und maschinellen Identitäten für das Team nachvollziehbar. **Chief** legt AWS-IAM-Governance-Richtlinien im Unternehmen anhand konsequenter Nutzung temporärer Credentials fest.

Anti-Patterns: dauerhafte IAM-Nutzer mit statischen Zugangsschlüsseln für menschliche oder maschinelle Zugriffe anlegen, wo temporäre Rollenübernahme technisch möglich wäre; Zugangsschlüssel im Anwendungscode oder in Konfigurationsdateien hinterlegen, statt eine an die Ressource gebundene Service-Rolle zu nutzen; gemeinsam genutzte IAM-Nutzer für mehrere Personen verwenden, statt individuelle, föderierte Rollenübernahme einzuführen.

## Production Checklist

- [ ] Menschliche Zugriffe erfolgen über föderierte Anmeldung mit temporärer Rollenübernahme.
- [ ] Maschinelle Identitäten nutzen dedizierte, an die Ressource gebundene Service-Rollen.
- [ ] Bestehende, dauerhafte Zugangsschlüssel sind systematisch identifiziert und wo möglich durch Rollenübernahme ersetzt.
- [ ] Verbleibende, notwendige Zugangsschlüssel werden regelmäßig rotiert und überwacht.

## Interviewfragen

### 1. Was unterscheidet eine AWS-IAM-Rolle von einem dauerhaften IAM-Nutzer mit Zugangsschlüsseln?

**Antwort:** Eine Rolle wird temporär übernommen und stellt zeitlich begrenzte, automatisch ablaufende Credentials aus, während Zugangsschlüssel eines IAM-Nutzers bis zur expliziten Rotation oder Löschung unbegrenzt gültig bleiben.

### 2. Warum stellen dauerhafte Zugangsschlüssel ein höheres Risiko dar als temporäre Rollenübernahme?

**Antwort:** Bei versehentlicher Offenlegung (z. B. in einem Code-Repository) können sie potenziell unbegrenzt lange von einem Angreifer genutzt werden, bis die Offenlegung bemerkt und der Schlüssel widerrufen wird, während temporäre Credentials automatisch nach kurzer Zeit ablaufen.

### 3. Wie sollten menschliche und maschinelle Identitäten in AWS jeweils typischerweise zugreifen?

**Antwort:** Menschliche Identitäten über föderierte Anmeldung mit temporärer Rollenübernahme; maschinelle Identitäten über dedizierte, an die jeweilige Ressource gebundene Service-Rollen, ohne im Code gespeicherte Zugangsschlüssel.

### 4. Welchen häufigen Sicherheitsvorfall verhindert die Nutzung von Service-Rollen für Anwendungen?

**Antwort:** Das versehentliche Einchecken oder Offenlegen dauerhafter Zugangsschlüssel im Anwendungscode oder in Konfigurationsdateien, da Service-Rollen automatisch temporäre Credentials bereitstellen, ohne dass Schlüssel gespeichert werden müssen.

### 5. Wie gehst du vor, wenn eine unerwartet breite oder lang anhaltende Berechtigung entdeckt wird?

**Antwort:** Ich prüfe, ob die betroffene Identität dauerhafte Zugangsschlüssel statt temporärer Rollenübernahme nutzt, und stelle sie, wo technisch möglich, auf eine zeitlich begrenzte Rollenübernahme um, statt nur die einzelne Policy zu verschärfen.

### 6. Widersprüchliche Anforderung: Ein Legacy-System unterstützt keine Rollenübernahme und benötigt dauerhafte Zugangsschlüssel UND die Organisation will maximale Sicherheit — wie gehst du vor?

**Antwort:** Ich würde für das Legacy-System die dauerhaften Zugangsschlüssel auf den minimal notwendigen Berechtigungsumfang beschränken, eine regelmäßige, automatisierte Rotation einführen, und parallel prüfen, ob eine technische Modernisierung des Systems eine spätere Umstellung auf Rollenübernahme ermöglichen würde.

## Praktische Labs

~~~python
# Conceptual static-vs-temporary credential risk assessment (not executed against a real AWS account):

def assess_credential_risk(identity_type, uses_static_keys, key_age_days):
    if not uses_static_keys:
        return {"risk": "LOW", "reason": "uses temporary, auto-expiring role credentials"}
    if key_age_days > 90:
        return {"risk": "HIGH", "reason": f"static access key not rotated for {key_age_days} days"}
    return {"risk": "MEDIUM", "reason": "uses static access keys, rotation recommended"}

identities = {
    "human_via_sso_role": {"identity_type": "human", "uses_static_keys": False, "key_age_days": 0},
    "legacy_app_static_key": {"identity_type": "machine", "uses_static_keys": True, "key_age_days": 400},
    "lambda_with_service_role": {"identity_type": "machine", "uses_static_keys": False, "key_age_days": 0},
}

for name, attrs in identities.items():
    print(f"{name}: {assess_credential_risk(**attrs)}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [IAM Roles — Temporary Security Credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [AWS Security Token Service (STS) — Overview](https://docs.aws.amazon.com/STS/latest/APIReference/welcome.html), abgerufen 2026-09-18.

Cloud-IAM-Grundarchitektur ist kanonisch in [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md) behandelt; AWS-Organisationen und Landing Zones in [KB-0463](01-aws-organisationen-und-landing-zones.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Erkennung und Warnung bei Nutzung dauerhafter Zugangsschlüssel mit automatischem Migrationsvorschlag zu Rollenübernahme | Adopting | Gegenüber manueller Identifikation dauerhafter Schlüssel bevorzugen, sobald die Abdeckung der Erkennung für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert ein AWS-IAM-Zugriffsmodell erst, wenn menschliche und maschinelle Identitäten nachweislich über temporäre Rollenübernahme statt dauerhafter Zugangsschlüssel zugreifen, mit klar dokumentierten Ausnahmen für technisch unvermeidbare Fälle.
