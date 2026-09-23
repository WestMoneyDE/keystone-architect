---
{"id": "KB-0540", "title": "OAuth2 und delegierter Zugriff", "domain": "23", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0539", "concepts": ["RBAC und ABAC"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "OAuth2-Flows, Scopes und Tokenendpunkte anhand offizieller Spezifikation korrekt implementieren und Authorization Code mit PKCE technisch von Client Credentials unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit entscheiden, welcher OAuth2-Flow der tatsächlichen Delegationsanforderung entspricht — menschliche Nutzerautorisierung versus maschinelle Dienst-zu-Dienst-Kommunikation ohne menschlichen Nutzer.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartetes Sicherheitsrisiko auf die Verwendung des Client-Credentials-Flows für einen Anwendungsfall zurückführen können, der tatsächlich menschliche Nutzerautorisierung mit Authorization Code und PKCE benötigt hätte, oder umgekehrt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für die korrekte Flow-Wahl anhand der tatsächlichen Delegationsart (menschlich versus maschinell) statt einer pauschalen OAuth2-Nutzung ohne Flow-Differenzierung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Token-Introspection- oder Revocation-Endpunkte im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Flow-Unterscheidung und Scope-basierten Delegationsgrenzen, nicht die Endpunkt-Detailimplementierung."}}, "lab_validation": [{"lab_id": "KB-0540-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller OAuth2- und PKCE-Spezifikation zu Flows, Scopes und Tokenendpunkten, kein aktives OAuth2-System verwendet", "evidence": "Anhand offizieller Spezifikation wird nachvollzogen, wie der Authorization-Code-Flow mit PKCE (Proof Key for Code Exchange) eine menschliche Nutzerautorisierung delegiert und dabei Autorisierungscode-Abfangangriffe durch einen kryptographischen Verifier-Challenge-Mechanismus verhindert, während der Client-Credentials-Flow ohne Nutzerinteraktion eine Maschine-zu-Maschine-Autorisierung direkt zwischen Client und Autorisierungsserver durchführt, sowie wie Scopes die Delegationsgrenze eines ausgestellten Tokens explizit begrenzen.", "limitations": "Kein aktives OAuth2-System verwendet, kein realer Flow implementiert."}]}
---
# OAuth2 und delegierter Zugriff

> **Ziel:** OAuth2 ermöglicht **delegierten Zugriff** — eine Anwendung erhält, im Namen eines Nutzers oder als eigenständiger Dienst, begrenzten Zugriff auf eine Ressource, ohne dass die eigentlichen Zugangsdaten (Passwort) direkt an die zugreifende Anwendung weitergegeben werden. Verschiedene **Flows** adressieren unterschiedliche Delegationsszenarien: Der **Authorization-Code-Flow mit PKCE** (Proof Key for Code Exchange) ist für Szenarien mit einem menschlichen Nutzer geeignet, der explizit autorisiert (etwa: "Diese App darf auf meine Kalenderdaten zugreifen"), während der **Client-Credentials-Flow** für reine Maschine-zu-Maschine-Kommunikation ohne beteiligten menschlichen Nutzer geeignet ist (etwa ein Backend-Dienst, der auf eine API eines anderen Dienstes zugreift). **Scopes** begrenzen explizit, wofür ein ausgestelltes Token tatsächlich verwendet werden darf (etwa "nur Lesezugriff auf Kalenderdaten", nicht "voller Kontozugriff"). Der zentrale Punkt dieses Kapitels ist, dass eine falsche Flow-Wahl ein konkretes Sicherheitsrisiko darstellt: Der Client-Credentials-Flow für einen Anwendungsfall zu nutzen, der tatsächlich eine explizite, überprüfbare menschliche Autorisierung erfordert, umgeht die Zustimmung des Nutzers vollständig, während die Nutzung des komplexeren Authorization-Code-Flows für reine Maschine-zu-Maschine-Kommunikation unnötige Komplexität ohne entsprechenden Sicherheitsgewinn einführt.

## Zweck, Mental Model und Dependencies

Der Authorization-Code-Flow adressiert das grundlegende Delegationsproblem, dass ein Nutzer einer Drittanbieter-Anwendung Zugriff auf seine Daten bei einem anderen Dienst gewähren möchte, ohne dieser Anwendung sein Passwort für den anderen Dienst direkt mitzuteilen — stattdessen authentifiziert sich der Nutzer direkt beim Autorisierungsserver (nicht bei der zugreifenden Anwendung), erteilt dort explizit seine Zustimmung, und der Autorisierungsserver stellt daraufhin einen kurzlebigen Autorisierungscode aus, den die Anwendung gegen ein tatsächliches Zugriffstoken eintauscht. PKCE ergänzt diesen Flow um einen kryptographischen Schutzmechanismus: Die Anwendung erzeugt vor dem Autorisierungsschritt einen zufälligen Verifier-Wert und übermittelt dessen kryptographischen Hash (Challenge) an den Autorisierungsserver; beim späteren Token-Austausch muss die Anwendung den ursprünglichen Verifier-Wert vorlegen, den der Server gegen die zuvor übermittelte Challenge prüft — dies verhindert, dass ein Angreifer, der den Autorisierungscode abfängt (etwa über eine unsichere Redirect-URI), diesen Code selbst gegen ein Token eintauschen kann, da ihm der ursprüngliche Verifier-Wert fehlt. Der Client-Credentials-Flow löst ein anderes, strukturell einfacheres Problem: Wenn kein menschlicher Nutzer beteiligt ist, sondern ein Dienst im eigenen Namen (nicht im Namen eines Nutzers) auf eine Ressource zugreifen möchte, authentifiziert sich dieser Dienst direkt beim Autorisierungsserver mit seinen eigenen Credentials und erhält unmittelbar ein Token, ohne den Umweg über eine Nutzerautorisierung — dieser Flow ist strukturell für Server-zu-Server-Kommunikation vorgesehen, nicht für Szenarien, in denen tatsächlich im Namen eines spezifischen Nutzers gehandelt wird. Scopes sind der Mechanismus, über den die Delegationsgrenze eines Tokens explizit begrenzt wird — ein Token, das für "nur Lesezugriff auf Kalenderdaten" ausgestellt wurde, sollte von der Ressource, die es konsumiert, strikt gegen genau diesen Scope geprüft werden, statt implizit vollen Zugriff zu gewähren, sobald irgendein gültiges Token vorliegt.

~~~text
OAuth2: DELEGATED access -- app gets limited access on behalf of user/service, WITHOUT direct password sharing
Authorization Code + PKCE: for HUMAN USER explicitly authorizing
  user authenticates DIRECTLY at auth server (not at the requesting app), grants consent explicitly
  auth server issues short-lived auth code -> app exchanges it for access token
  PKCE: app generates random VERIFIER, sends its hash (CHALLENGE) before auth step
    -> at token exchange, must present original verifier, checked against challenge
    -> prevents attacker who intercepts auth code (e.g. via insecure redirect URI) from exchanging it
       (attacker lacks the original verifier)
Client Credentials: for MACHINE-TO-MACHINE, NO human user involved
  service authenticates directly at auth server with ITS OWN credentials -> immediate token
  -> structurally for server-to-server, NOT for acting on behalf of a specific user
Scopes: explicitly BOUND delegation extent of an issued token
  e.g. "read-only calendar access" -- resource MUST strictly check against this scope,
       not implicitly grant full access on ANY valid token
WRONG FLOW CHOICE = concrete security risk:
  client credentials for a case needing EXPLICIT human authorization -> bypasses user consent entirely
  auth-code-flow for pure M2M -> unnecessary complexity without corresponding security benefit
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Authorization Code mit PKCE | delegierter Zugriff mit expliziter menschlicher Autorisierung | Schutz gegen Autorisierungscode-Abfangangriffe |
| Client Credentials | Maschine-zu-Maschine-Zugriff ohne Nutzerbeteiligung | für reine Server-zu-Server-Kommunikation geeignet |
| Scopes | explizite Begrenzung der Token-Delegationsreichweite | muss von Ressource strikt geprüft werden |
| Flow-Wahl nach Delegationsart | menschlich versus maschinell | falsche Wahl umgeht Nutzerzustimmung oder erzeugt unnötige Komplexität |

Implementierung: Für jeden Anwendungsfall wird explizit geprüft, ob ein menschlicher Nutzer tatsächlich explizit autorisieren muss (Authorization Code mit PKCE) oder ob reine Maschine-zu-Maschine-Kommunikation ohne Nutzerbeteiligung vorliegt (Client Credentials), bevor ein Flow gewählt wird. Scopes werden granular und zweckgebunden vergeben, und Ressourcen prüfen eingehende Tokens strikt gegen den tatsächlich benötigten Scope. PKCE wird konsequent für den Authorization-Code-Flow genutzt, insbesondere für Clients ohne sicheren Speicher für ein Client-Secret.

## Scalability, Reliability, Security und Observability

OAuth2-Delegation skaliert die tatsächliche Sicherheit proportional zur korrekten Zuordnung von Flow zu Delegationsart; die Reliability-Grenze liegt darin, dass eine falsche Flow-Wahl proportional zur tatsächlichen Diskrepanz zwischen Delegationsanforderung und genutztem Flow zu umgangener Nutzerzustimmung oder unnötiger Komplexität führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung greift ohne erkennbare Nutzerzustimmung im Namen eines Nutzers auf dessen Daten zu | der Client-Credentials-Flow wird fälschlich für einen Anwendungsfall genutzt, der tatsächlich explizite Nutzerautorisierung erfordert | den Anwendungsfall auf einen Wechsel zu Authorization Code mit PKCE prüfen |
| eine Server-zu-Server-Integration hat unnötig hohe Implementierungskomplexität | der Authorization-Code-Flow wird für reine Maschine-zu-Maschine-Kommunikation ohne Nutzerbeteiligung genutzt | einen Wechsel zum einfacheren Client-Credentials-Flow prüfen |
| ein Token gewährt unerwartet breiteren Zugriff als beabsichtigt | die Ressource prüft eingehende Tokens nicht strikt gegen den tatsächlich vergebenen Scope | die Scope-Prüfung in der Ressource explizit auf den tatsächlich benötigten, granularen Scope umstellen |

Security: PKCE sollte für den Authorization-Code-Flow konsequent genutzt werden, insbesondere für öffentliche Clients (mobile Apps, Single-Page-Applications) ohne sicheren Speicher für ein Client-Secret. Observability: Die tatsächliche Nutzung des korrekten Flows pro Anwendungsfall, die Konsistenz der Scope-Prüfung in Ressourcen, und die Häufigkeit fehlgeschlagener Autorisierungsversuche sind relevante Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert einen gegebenen OAuth2-Flow korrekt für eine Anwendung. **Principal** entscheidet, welcher Flow für eine konkrete Delegationsanforderung geeignet ist, und gestaltet die Scope-Struktur. **Chief** legt unternehmensweite Standards für die korrekte Flow-Wahl anhand tatsächlicher Delegationsart fest.

Anti-Patterns: Client Credentials für Anwendungsfälle nutzen, die tatsächlich explizite menschliche Autorisierung erfordern; den Authorization-Code-Flow ohne PKCE für Clients ohne sicheren Secret-Speicher nutzen; Ressourcen implizit vollen Zugriff bei jedem gültigen Token gewähren, ohne den Scope explizit zu prüfen.

## Production Checklist

- [ ] Die Flow-Wahl entspricht der tatsächlichen Delegationsart (menschlich versus maschinell).
- [ ] PKCE ist für den Authorization-Code-Flow konsequent aktiviert, besonders für öffentliche Clients.
- [ ] Scopes sind granular und zweckgebunden vergeben.
- [ ] Ressourcen prüfen eingehende Tokens strikt gegen den tatsächlich benötigten Scope.

## Interviewfragen

### 1. Wofür ist der Authorization-Code-Flow mit PKCE geeignet?

**Antwort:** Für Szenarien mit einem menschlichen Nutzer, der explizit einer Anwendung Zugriff auf seine Daten bei einem anderen Dienst autorisiert.

### 2. Was schützt PKCE konkret?

**Antwort:** Es verhindert, dass ein Angreifer, der den Autorisierungscode abfängt, diesen selbst gegen ein Token eintauschen kann, da ihm der ursprüngliche, nur der legitimen Anwendung bekannte Verifier-Wert fehlt.

### 3. Wofür ist der Client-Credentials-Flow geeignet, und wofür nicht?

**Antwort:** Für reine Maschine-zu-Maschine-Kommunikation ohne beteiligten Nutzer; nicht geeignet für Szenarien, die tatsächlich eine explizite, überprüfbare menschliche Autorisierung erfordern.

### 4. Wofür dienen Scopes in OAuth2?

**Antwort:** Sie begrenzen explizit die Delegationsreichweite eines ausgestellten Tokens, sodass eine Ressource nur die tatsächlich autorisierten Aktionen zulassen sollte, nicht implizit vollen Zugriff bei jedem gültigen Token.

### 5. Wie gehst du vor, wenn eine Anwendung ohne erkennbare Nutzerzustimmung im Namen eines Nutzers auf dessen Daten zugreift?

**Antwort:** Ich prüfe, ob der Client-Credentials-Flow fälschlich für einen Anwendungsfall genutzt wird, der tatsächlich explizite Nutzerautorisierung erfordert, und wechsle bei Bedarf zum Authorization-Code-Flow mit PKCE.

### 6. Widersprüchliche Anforderung: Team will minimale Implementierungskomplexität für eine Server-Integration UND garantiert, dass jeder Zugriff im Namen eines spezifischen, zustimmenden Nutzers erfolgt — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Komplexität (Client Credentials) und garantierte nutzerbezogene Zustimmung sich strukturell widersprechen, da Client Credentials keinen Nutzer im Delegationsprozess vorsieht, und für den tatsächlichen Bedarf an nutzerbezogener Zustimmung den Authorization-Code-Flow mit PKCE vorschlagen, auch wenn dieser höhere initiale Implementierungskomplexität mit sich bringt.

## Praktische Labs

~~~python
# Conceptual flow-selection logic based on delegation type (not executed against a real OAuth2 server):

def recommend_oauth_flow(has_human_user, needs_explicit_consent):
    if has_human_user and needs_explicit_consent:
        return "Authorization Code Flow with PKCE"
    if not has_human_user:
        return "Client Credentials Flow"
    return "review requirements -- unclear delegation type"

cases = [
    {"has_human_user": True, "needs_explicit_consent": True},
    {"has_human_user": False, "needs_explicit_consent": False},
]

for case in cases:
    print(recommend_oauth_flow(**case))
~~~

## Dependencies, Cross-References und Quellen

1. IETF-Dokumentation: [RFC 6749 — The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749), abgerufen 2026-09-18.
2. IETF-Dokumentation: [RFC 7636 — Proof Key for Code Exchange (PKCE)](https://datatracker.ietf.org/doc/html/rfc7636), abgerufen 2026-09-18.

RBAC und ABAC sind kanonisch in [KB-0539](03-rbac-und-abac.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte Token-Binding- und DPoP-Mechanismen (Demonstrating Proof-of-Possession), die gestohlene Tokens für einen Angreifer ohne den zugehörigen privaten Schlüssel unbrauchbar machen | Evaluating | Gegenüber klassischen Bearer-Tokens erst nach Prüfung der tatsächlichen Toolchain-Unterstützung und des Integrationsaufwands für den konkreten Anwendungsfall bevorzugen. |

Ein Team akzeptiert eine OAuth2-Implementierung erst, wenn der gewählte Flow nachweislich der tatsächlichen Delegationsart entspricht und Scopes strikt geprüft werden.
