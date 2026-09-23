---
{"id": "KB-0164", "title": "Authentifizierung in Backend-Diensten", "domain": "07", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF"], "requires": [{"id": "KB-0067", "concepts": ["TLS"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0165", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Authentifizierungsmiddleware implementieren, die User Identity und Service Identity getrennt validiert.", "rationale": "Kein echtes IAM-System nötig, um die Trennung zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Token-Validierungspfad, Sitzungsmanagement und die Trennung von User- und Service-Identity für einen Backend-Dienst entwerfen.", "rationale": "Vermischte User-/Service-Identity ist eine häufige Ursache für falsche Autorisierungsannahmen."}, "STAFF-TARGET": {"active": true, "scope": "Einen Fehler diagnostizieren, bei dem eine Service-zu-Service-Anfrage fälschlich mit User-Berechtigungen behandelt wird.", "rationale": "Diese Vermischung ist ein wiederkehrendes, subtiles Sicherheitsproblem."}, "CHIEF-TARGET": {"active": true, "scope": "Klare Trennung von User- und Service-Identity als Architekturstandard für alle Backend-Dienste festlegen.", "rationale": "Vermischte Identitätsmodelle erschweren Audit und erhöhen das Risiko von Privilege Escalation."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Protokolltiefe (OAuth2/OIDC-Flows) wird in Domain 23 vertieft.", "rationale": "Diese Datei behandelt die Implementierungsgrundlagen; Protokolldetails folgen separat."}}, "lab_validation": [{"lab_id": "KB-0164-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für getrennte User- und Service-Token-Validierung", "evidence": "Ein Service-Token wird korrekt von einem User-Token unterschieden und erhält nicht automatisch Zugriff auf user-spezifische Ressourcen.", "limitations": "Kein echtes IAM-System, keine Produktion."}]}
---
# Authentifizierung in Backend-Diensten

> **Ziel:** Authentifizierung bestätigt, wer oder was eine Anfrage stellt. Der entscheidende Designfehler ist, User Identity (ein menschlicher Nutzer) und Service Identity (ein anderer Dienst, der im eigenen Namen oder im Auftrag eines Nutzers handelt) zu vermischen — eine Service-zu-Service-Anfrage sollte nicht automatisch dieselben Rechte wie der ursprüngliche Nutzer erhalten, ohne dass das explizit modelliert ist.

## Zweck, Mental Model und Dependencies

User Identity beantwortet „welcher Mensch hat diese Aktion ausgelöst"; Service Identity beantwortet „welcher Dienst führt diese Anfrage technisch aus". Ein Backend-Dienst, der eine Anfrage von einem anderen internen Dienst erhält, muss unterscheiden: handelt der aufrufende Dienst im eigenen Namen (Service-zu-Service, eigene Berechtigung) oder im Auftrag eines ursprünglichen Nutzers (delegierte Berechtigung, die die Nutzerrechte respektieren muss)? Diese Unterscheidung findet über TLS-gesicherte Kommunikation ([KB-0067](../03-network-foundations/19-tls-verbindungen-und-zertifikatspruefung.md)) statt und wird über unterschiedliche Tokentypen (User-Token versus Service-Token/mTLS-Zertifikat) durchgesetzt. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0067](../03-network-foundations/19-tls-verbindungen-und-zertifikatspruefung.md).

~~~text
User Identity:    Bearer <user_token> -> "this action was initiated by user X"
Service Identity: mTLS cert / service_token -> "this call comes from service Y, acting in its own capacity"
Delegated:        service_token + on_behalf_of=user_X -> "service Y, acting FOR user X, respecting X's rights"
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Tokentyp-Trennung | unterscheidet der Dienst User- von Service-Tokens? | Service-Token wird fälschlich mit User-Rechten behandelt |
| Delegation | ist bei „im Auftrag von" klar, wessen Rechte gelten? | Service-Rechte statt der schwächeren Nutzerrechte werden angewendet |
| Sitzungsmanagement | wird eine Session serverseitig invalidierbar gehalten? | abgelaufene/widerrufene Session bleibt clientseitig gültig |
| Middleware-Validierung | validiert jeder Dienst Tokens selbst oder vertraut blind einem Upstream? | fehlende Validierung an einer Stelle öffnet eine Umgehung |

Implementierung: eine Authentifizierungsmiddleware validiert bei jeder eingehenden Anfrage explizit den Tokentyp und extrahiert sowohl die aufrufende Service-Identity als auch (falls vorhanden) die delegierte User-Identity als getrennte, unabhängig geprüfte Felder. Für delegierte Anfragen wird explizit geprüft, dass die angewendeten Berechtigungen die des ursprünglichen Nutzers sind, nicht automatisch die (oft weiterreichenden) Rechte des aufrufenden Service. Sitzungen werden serverseitig widerrufbar gehalten (z. B. über eine Blacklist oder kurze Token-Lebensdauer mit Refresh), nicht rein clientseitig vertraut.

## Scalability, Reliability, Security und Observability

Klare Identitätstrennung skaliert über wachsende Dienstlandschaften, da jeder Dienst unabhängig prüfen kann, wessen Rechte tatsächlich gelten, ohne implizite Annahmen über vorgelagerte Prüfungen treffen zu müssen. Reliability-Grenze: eine vermischte Identität (Service-Token, der versehentlich volle User-Rechte erhält) ist ein Sicherheitsfehler, der oft erst durch einen konkreten Missbrauchsfall entdeckt wird, nicht durch normale funktionale Tests.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein interner Dienst kann auf Daten zugreifen, die eigentlich nutzerspezifisch geschützt sein sollten | Service-Identity wird fälschlich mit User-Rechten behandelt | Tokentyp der Anfrage gegen tatsächlich angewendete Berechtigungsprüfung vergleichen |
| widerrufene Nutzer-Session funktioniert noch | rein clientseitiges Token ohne serverseitige Widerrufsprüfung | Widerrufsmechanismus (Blacklist/kurze Lebensdauer) gegen tatsächliches Verhalten testen |
| Delegationskette unklar, wer die Anfrage ursprünglich ausgelöst hat | fehlende explizite „on behalf of"-Kennzeichnung in der Anfrage | Anfrage-Metadaten auf getrennte Service-/User-Identity-Felder prüfen |
| ein Dienst vertraut blind einem vorgelagerten Proxy ohne eigene Validierung | fehlende eigenständige Token-Validierung pro Dienst | prüfen, ob jeder Dienst Tokens selbst validiert oder nur Header vertraut |

Security: die Trennung von User- und Service-Identity ist selbst eine zentrale Sicherheitsmaßnahme gegen Privilege Escalation über interne Dienstketten; sie wird in Domain 23 um konkrete Protokolldetails (OAuth2/OIDC) vertieft. Observability: Audit-Logs sollten sowohl die Service-Identity (wer hat technisch aufgerufen) als auch die User-Identity (in wessen Auftrag) getrennt erfassen.

## Trade-offs und Entscheidungen

**Staff** implementiert Authentifizierungsmiddleware mit expliziter Trennung von User- und Service-Identity-Feldern. **Principal** definiert, wann Service-zu-Service-Anfragen eigene versus delegierte Berechtigungen tragen. **Chief** verlangt diese Trennung als Architekturstandard, um Privilege-Escalation-Risiken über interne Dienstketten zu begrenzen.

Anti-Patterns: Service-Tokens implizit mit vollen User-Rechten behandeln; einem vorgelagerten Proxy blind vertrauen, ohne selbst zu validieren; Sitzungen ohne serverseitige Widerrufsmöglichkeit rein clientseitig verwalten.

## Production Checklist

- [ ] User- und Service-Identity werden als getrennte, unabhängig geprüfte Felder behandelt.
- [ ] Delegierte Anfragen wenden explizit die Rechte des ursprünglichen Nutzers an, nicht die des aufrufenden Service.
- [ ] Sitzungen sind serverseitig widerrufbar.
- [ ] Jeder Dienst validiert Tokens selbst, vertraut nicht blind vorgelagerten Komponenten.

## Interviewfragen

### 1. Warum ist die Trennung von User- und Service-Identity wichtig?

**Antwort:** Eine Service-zu-Service-Anfrage sollte nicht automatisch dieselben Rechte wie ein ursprünglicher Nutzer erhalten; ohne explizite Trennung kann ein interner Dienst versehentlich mit überhöhten Rechten agieren.

### 2. Was bedeutet „delegierte Berechtigung"?

**Antwort:** Ein Dienst handelt im Auftrag eines konkreten Nutzers und sollte dabei dessen (oft eingeschränktere) Rechte anwenden, nicht seine eigenen, potenziell weiterreichenden Service-Rechte.

### 3. Warum ist rein clientseitige Session-Verwaltung riskant?

**Antwort:** Eine widerrufene oder abgelaufene Session könnte ohne serverseitige Prüfung weiterhin als gültig akzeptiert werden, wenn der Client (oder ein Angreifer mit gestohlenem Token) sie weiterverwendet.

### 4. Warum sollte jeder Dienst Tokens selbst validieren, statt einem vorgelagerten Proxy zu vertrauen?

**Antwort:** Ein blindes Vertrauen erzeugt eine einzelne Fehlerquelle — wird die Validierung am Proxy umgangen oder fehlerhaft konfiguriert, sind alle nachgelagerten Dienste ungeschützt.

### 5. Wie erkennst du eine vermischte Identitätsbehandlung im Code?

**Antwort:** Indem geprüft wird, ob ein Service-Token an derselben Stelle wie ein User-Token verarbeitet wird, ohne dass der Code explizit zwischen beiden unterscheidet und unterschiedliche Berechtigungsprüfungen anwendet.

### 6. Widersprüchliche Anforderung: Team will einfache, einheitliche Token-Validierung für alle Anfragetypen UND strikte Trennung von User-/Service-Rechten — wie gehst du vor?

**Antwort:** Ich würde eine einheitliche Validierungsschicht bauen, die aber den Tokentyp als erstes Unterscheidungsmerkmal extrahiert und basierend darauf unterschiedliche, getrennte Autorisierungspfade auslöst — Einfachheit der Validierungsinfrastruktur und strikte Rechtetrennung sind mit dieser Struktur vereinbar.

## Praktische Labs

~~~python
def validate_token(token):
    if token.startswith("user_"):
        return {"type": "user", "id": token[5:]}
    if token.startswith("service_"):
        return {"type": "service", "id": token[8:]}
    raise ValueError("unknown token type")

def check_access(token, resource_owner_id):
    identity = validate_token(token)
    if identity["type"] == "service":
        return False  # service identity alone never grants access to user-owned resources
    return identity["id"] == resource_owner_id

assert check_access("service_orders-api", "user123") is False
assert check_access("user_user123", "user123") is True
print("Service identity correctly denied access to a user-owned resource without explicit delegation.")
~~~

## Dependencies, Cross-References und Quellen

1. IETF: [RFC 6749: OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749), abgerufen 2026-09-17 (Grundlagenreferenz; Protokolltiefe folgt in Domain 23).

Vollständige OAuth2/OIDC-Protokolldetails werden in Domain 23 (Security, IAM, Zero Trust) vertieft.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kurzlebige, automatisch rotierende Service-Zertifikate (mTLS) statt langlebiger statischer Secrets | Established | Rotationsintervall gegen Betriebskomplexität abwägen. |

Ein Team akzeptiert eine Authentifizierungsimplementierung erst, wenn User- und Service-Identity nachweislich getrennt behandelt und delegierte Anfragen korrekt die Nutzerrechte anwenden.
