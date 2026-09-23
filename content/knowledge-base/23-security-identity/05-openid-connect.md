---
{"id": "KB-0541", "title": "OpenID Connect", "domain": "23", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0540", "concepts": ["OAuth2 und delegierter Zugriff"], "needed_for": "understanding"}, {"id": "KB-0531", "concepts": ["Sigstore und Cosign"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "ID Tokens, Discovery und UserInfo-Endpunkte anhand offizieller OIDC-Spezifikation korrekt implementieren und dabei Authentifizierung von reiner OAuth-Autorisierung technisch trennen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit sicherstellen, dass ID-Token-Verifikation Issuer, Audience und Nonce prüft, statt sich auf reine OAuth-Access-Tokens als fälschlichen Identitätsnachweis zu verlassen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine Identitätsverwechslung oder einen Replay-Angriff auf eine fehlende Issuer-, Audience- oder Nonce-Prüfung bei der ID-Token-Verifikation zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für korrekte OIDC-Identitätsverifikation mit vollständiger Issuer-/Audience-/Nonce-Prüfung statt vereinfachter, unsicherer Token-Behandlung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne kryptographische Implementierung der ID-Token-Signaturverifikation im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Trennung von Authentifizierung und Autorisierung sowie der notwendigen Verifikationsschritte, nicht die kryptographische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0541-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller OpenID-Connect-Spezifikation zu ID Tokens, Discovery und UserInfo, kein aktives OIDC-System verwendet", "evidence": "Anhand offizieller Spezifikation wird nachvollzogen, wie OpenID Connect als Identitätsschicht über OAuth2 ein signiertes ID Token ausstellt, das explizit Authentifizierungsaussagen (wer ist der Nutzer, wann und wie authentifiziert) trägt, im Unterschied zum reinen OAuth-Access-Token, das nur Autorisierung, nicht Identität, ausdrückt, wie der Discovery-Endpunkt die Konfiguration eines Identitätsanbieters standardisiert auffindbar macht, und warum eine korrekte ID-Token-Verifikation Issuer (wer stellte das Token aus), Audience (für wen war es bestimmt) und Nonce (Schutz gegen Replay-Angriffe) explizit prüfen muss.", "limitations": "Kein aktives OIDC-System verwendet, kein realer Flow implementiert."}]}
---
# OpenID Connect

> **Ziel:** OpenID Connect (OIDC) erweitert OAuth2 (siehe [KB-0540](04-oauth2-und-delegierter-zugriff.md)) um eine explizite **Identitätsschicht** — während ein reines OAuth-Access-Token nur ausdrückt, wozu ein Client autorisiert ist (Autorisierung), trägt ein **ID Token** eine explizite, kryptographisch signierte Authentifizierungsaussage (wer der Nutzer ist, wann und wie er sich authentifiziert hat — Authentifizierung). **Discovery** standardisiert, wie die Konfiguration eines Identitätsanbieters (Endpunkte, unterstützte Signaturalgorithmen) auffindbar ist, und der **UserInfo**-Endpunkt liefert zusätzliche Profildaten zu einem authentifizierten Nutzer. Der zentrale Punkt dieses Kapitels ist die häufig übersehene Notwendigkeit vollständiger ID-Token-Verifikation: Ein ID Token muss explizit gegen **Issuer** (stammt das Token tatsächlich vom erwarteten, vertrauenswürdigen Identitätsanbieter?), **Audience** (war das Token tatsächlich für diese spezifische Anwendung bestimmt, oder könnte es für eine andere Anwendung ausgestellt und hierher umgeleitet worden sein?) und **Nonce** (ein bei der ursprünglichen Anfrage generierter, einmalig verwendbarer Wert, der Replay-Angriffe verhindert) geprüft werden — eine Anwendung, die lediglich die Signatur eines ID Tokens verifiziert, ohne diese drei zusätzlichen Prüfungen durchzuführen, ist anfällig für Identitätsverwechslung oder Replay-Angriffe, selbst wenn das Token kryptographisch korrekt signiert ist.

## Zweck, Mental Model und Dependencies

Die Unterscheidung zwischen Authentifizierung (wer ist dieser Nutzer tatsächlich?) und Autorisierung (wozu ist dieser Client berechtigt?) ist strukturell fundamental, aber in reinem OAuth2 nicht explizit adressiert — ein OAuth-Access-Token beweist lediglich, dass ein Client zu bestimmten Aktionen berechtigt wurde, sagt aber nichts Verbindliches über die Identität des Nutzers aus, in dessen Namen dieser Zugriff erfolgte (ein häufiger, fehlerhafter Praxis-Ansatz ist, ein Access-Token fälschlich als Identitätsnachweis zu missbrauchen). OpenID Connect schließt diese Lücke, indem es ein separates, strukturiertes ID Token einführt, das explizit Authentifizierungsaussagen trägt (Nutzer-Identifikator, Authentifizierungszeitpunkt, genutzte Authentifizierungsmethode), signiert vom Identitätsanbieter, sodass die konsumierende Anwendung diese Aussagen kryptographisch verifizieren kann. Discovery (typischerweise über einen standardisierten `.well-known`-Endpunkt) macht die Konfiguration eines Identitätsanbieters — welche Endpunkte für Autorisierung, Token-Austausch und Schlüsselabruf zuständig sind, welche Signaturalgorithmen unterstützt werden — programmatisch auffindbar, statt diese Informationen für jeden Identitätsanbieter manuell und statisch konfigurieren zu müssen. Die drei kritischen Verifikationsschritte adressieren jeweils unterschiedliche Angriffsszenarien: Die Issuer-Prüfung stellt sicher, dass das Token tatsächlich vom erwarteten, konfigurierten Identitätsanbieter stammt, nicht von einem beliebigen, möglicherweise kompromittierten oder böswilligen Aussteller; die Audience-Prüfung verhindert, dass ein für eine andere Anwendung ausgestelltes, aber möglicherweise abgefangenes Token bei dieser Anwendung fälschlich akzeptiert wird (ein Token-Verwechslungsangriff); die Nonce-Prüfung verhindert, dass ein zuvor beobachtetes, gültiges ID Token erneut (repliziert) zur Authentifizierung genutzt wird, indem der bei der ursprünglichen Anfrage generierte, einmalige Nonce-Wert im Token enthalten sein und gegen den ursprünglich gesendeten Wert geprüft werden muss.

~~~text
OpenID Connect: adds IDENTITY LAYER on top of OAuth2 (KB-0540)
  OAuth access token: expresses AUTHORIZATION only (what client CAN do) -- NOT a verified identity claim
  ID Token: explicit, SIGNED authentication assertion (who the user is, when/how authenticated)
    -> common ANTI-PATTERN: misusing access token AS identity proof (it isn't one)
Discovery (.well-known endpoint): standardized, programmatic IdP config lookup
  (which endpoints for auth/token/keys, supported signature algorithms)
UserInfo endpoint: additional profile data for authenticated user
3 CRITICAL ID Token verification steps (beyond signature check alone):
  Issuer: does token ACTUALLY come from the expected, configured, trusted IdP?
  Audience: was token ACTUALLY intended for THIS application (not intercepted from another)?
    -> prevents token-confusion attack
  Nonce: one-time value from ORIGINAL request, prevents REPLAY of a previously observed valid token
SKIPPING these 3 (signature check ALONE) -> vulnerable to identity confusion / replay
  even though the token IS cryptographically validly signed
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| ID Token | signierte Authentifizierungsaussage, trennt Authentifizierung von Autorisierung | darf nicht mit einem Access-Token verwechselt werden |
| Discovery | standardisierte, auffindbare IdP-Konfiguration | vermeidet manuelle, statische Konfiguration pro Anbieter |
| Issuer-Prüfung | Token stammt vom erwarteten, vertrauenswürdigen Anbieter | verhindert Akzeptanz von Tokens beliebiger Aussteller |
| Audience-Prüfung | Token war für diese spezifische Anwendung bestimmt | verhindert Token-Verwechslungsangriffe |
| Nonce-Prüfung | Token entspricht der ursprünglichen, einmaligen Anfrage | verhindert Replay-Angriffe |

Implementierung: Jede ID-Token-Verifikation prüft explizit Issuer, Audience und Nonce zusätzlich zur kryptographischen Signaturprüfung, statt sich ausschließlich auf die Signaturgültigkeit zu verlassen. Access-Tokens werden konsequent nur für Autorisierungsentscheidungen genutzt, niemals als Identitätsnachweis fehlinterpretiert. Discovery-Endpunkte werden genutzt, um Identitätsanbieter-Konfiguration programmatisch und aktuell zu halten, statt sie statisch zu hartcodieren.

## Scalability, Reliability, Security und Observability

OpenID Connect skaliert die tatsächliche Identitätssicherheit proportional zur Vollständigkeit der ID-Token-Verifikation; die Reliability-Grenze liegt darin, dass eine unvollständige Verifikation (nur Signaturprüfung ohne Issuer/Audience/Nonce) proportional zur Angriffsfläche zu Identitätsverwechslung oder Replay-Angriffen führt, selbst bei kryptographisch gültiger Signatur.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung akzeptiert fälschlich ein Token, das für eine andere Anwendung bestimmt war | die Audience-Prüfung fehlt oder ist nicht korrekt konfiguriert | die Audience-Prüfung explizit gegen die eigene, erwartete Client-ID einrichten |
| ein zuvor beobachtetes, gültiges Token wird erneut erfolgreich zur Authentifizierung genutzt | die Nonce-Prüfung fehlt, wodurch ein Replay-Angriff nicht erkannt wird | die Nonce-Prüfung explizit gegen den bei der ursprünglichen Anfrage generierten Wert einrichten |
| ein Access-Token wird fälschlich als Identitätsnachweis für einen Nutzer verwendet | Authentifizierung und Autorisierung werden nicht sauber getrennt, ein ID Token wird nicht genutzt | die Anwendung auf explizite ID-Token-Nutzung für Identitätsaussagen umstellen |

Security: Alle drei Verifikationsschritte (Issuer, Audience, Nonce) sollten zusätzlich zur Signaturprüfung verbindlich und automatisiert durchgesetzt werden, nicht optional oder manuell. Observability: Die tatsächliche Vollständigkeit der ID-Token-Verifikation über alle Integrationspunkte hinweg, sowie die Häufigkeit fehlgeschlagener Issuer-/Audience-/Nonce-Prüfungen, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert eine ID-Token-Verifikation mit vollständiger Issuer-/Audience-/Nonce-Prüfung korrekt. **Principal** entwirft die Trennung von Authentifizierung und Autorisierung für eine vollständige Anwendungsarchitektur. **Chief** legt unternehmensweite Standards für verbindliche, vollständige OIDC-Identitätsverifikation fest.

Anti-Patterns: ein OAuth-Access-Token fälschlich als Identitätsnachweis eines Nutzers behandeln; ID-Token-Verifikation nur auf Signaturprüfung beschränken, ohne Issuer, Audience und Nonce zu prüfen; Identitätsanbieter-Konfiguration statisch hartcodieren statt über Discovery aktuell zu halten.

## Production Checklist

- [ ] Jede ID-Token-Verifikation prüft Issuer, Audience und Nonce zusätzlich zur Signatur.
- [ ] Access-Tokens werden ausschließlich für Autorisierung, niemals als Identitätsnachweis, genutzt.
- [ ] Identitätsanbieter-Konfiguration wird über Discovery aktuell gehalten, nicht statisch hartcodiert.
- [ ] Fehlgeschlagene Verifikationsschritte werden protokolliert und überwacht.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen einem OAuth-Access-Token und einem OIDC-ID-Token?

**Antwort:** Ein Access-Token drückt nur Autorisierung aus (was der Client tun darf); ein ID Token trägt eine explizite, signierte Authentifizierungsaussage über die Identität des Nutzers.

### 2. Warum reicht die reine Signaturprüfung eines ID Tokens nicht aus?

**Antwort:** Weil ein kryptographisch korrekt signiertes Token dennoch von einem falschen Aussteller stammen, für eine andere Anwendung bestimmt gewesen, oder ein Replay eines zuvor beobachteten Tokens sein könnte — dies erfordert zusätzlich Issuer-, Audience- und Nonce-Prüfung.

### 3. Was verhindert die Audience-Prüfung konkret?

**Antwort:** Dass ein für eine andere Anwendung ausgestelltes, möglicherweise abgefangenes Token bei einer nicht dafür vorgesehenen Anwendung fälschlich akzeptiert wird.

### 4. Wofür dient der Nonce-Wert bei der ID-Token-Verifikation?

**Antwort:** Er verhindert Replay-Angriffe, indem er sicherstellt, dass das Token tatsächlich zur ursprünglichen, einmaligen Anfrage gehört, statt ein zuvor beobachtetes, gültiges Token erneut zu akzeptieren.

### 5. Wie gehst du vor, wenn eine Anwendung fälschlich ein für eine andere Anwendung bestimmtes Token akzeptiert?

**Antwort:** Ich prüfe, ob die Audience-Prüfung fehlt oder nicht korrekt gegen die eigene, erwartete Client-ID konfiguriert ist, und richte diese Prüfung explizit ein.

### 6. Widersprüchliche Anforderung: Team will minimale Implementierungskomplexität bei der Token-Verifikation UND garantiert robusten Schutz vor Identitätsverwechslung und Replay-Angriffen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass die drei zusätzlichen Verifikationsschritte (Issuer, Audience, Nonce) keine optionale Komplexität, sondern eine notwendige Grundvoraussetzung für tatsächliche Identitätssicherheit sind, und auf etablierte, gut getestete OIDC-Bibliotheken zurückgreifen, die diese Prüfungen standardmäßig und korrekt implementieren, statt die Verifikationslogik eigenständig und potenziell unvollständig zu implementieren — Einfachheit und Sicherheit lassen sich durch bewährte Bibliotheken statt durch verkürzte Eigenimplementierung vereinbaren.

## Praktische Labs

~~~python
# Conceptual ID token verification with issuer/audience/nonce checks (not executed against a real OIDC provider):

def verify_id_token(signature_valid, issuer, expected_issuer, audience, expected_audience, nonce, expected_nonce):
    if not signature_valid:
        return "REJECTED: invalid signature"
    if issuer != expected_issuer:
        return "REJECTED: unexpected issuer"
    if audience != expected_audience:
        return "REJECTED: token not intended for this application (audience mismatch)"
    if nonce != expected_nonce:
        return "REJECTED: nonce mismatch -- possible replay attack"
    return "ACCEPTED: token fully verified"

print(verify_id_token(True, "https://idp.example.com", "https://idp.example.com", "app-a", "app-b", "n1", "n1"))
print(verify_id_token(True, "https://idp.example.com", "https://idp.example.com", "app-a", "app-a", "n1", "n1"))
~~~

## Dependencies, Cross-References und Quellen

1. OpenID-Foundation-Dokumentation: [OpenID Connect Core 1.0 — ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken), abgerufen 2026-09-18.
2. OpenID-Foundation-Dokumentation: [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html), abgerufen 2026-09-18.

OAuth2 und delegierter Zugriff sind kanonisch in [KB-0540](04-oauth2-und-delegierter-zugriff.md) behandelt; Sigstore und Cosign (verwandtes OIDC-basiertes Identitätsmuster) in [KB-0531](../22-devops-supply-chain/19-sigstore-und-cosign.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte selbstverwaltete Identitätsansätze (Decentralized Identifiers, Verifiable Credentials) als Alternative zu zentralisierten OIDC-Identitätsanbietern | Evaluating | Gegenüber etabliertem, zentralisiertem OIDC erst nach Prüfung der tatsächlichen Standardisierungsreife und Interoperabilität für den konkreten Anwendungsfall bevorzugen. |

Ein Team akzeptiert eine OIDC-Integration erst, wenn die ID-Token-Verifikation nachweislich Issuer, Audience und Nonce vollständig prüft, nicht nur die kryptographische Signatur.
