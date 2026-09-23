---
{"id": "KB-0559", "title": "API Security", "domain": "23", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0558", "concepts": ["WAF und DDoS-Abwehr"], "needed_for": "context"}, {"id": "KB-0552", "concepts": ["MTLS und Dienstauthentifizierung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Broken Object Level Authorization, SSRF und ressourcenbasierte Missbrauchsmuster anhand etablierter Praktiken erkennen und für konkrete API-Operationen korrekt absichern können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete API-Architektur explizit sicherstellen, dass Objektzugriffsprüfungen pro einzelner Ressourcenanfrage erfolgen, statt sich auf erfolgreiche Authentifizierung als ausreichenden Autorisierungsnachweis zu verlassen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unautorisierten Datenzugriff trotz erfolgreicher API-Authentifizierung auf eine fehlende Objektzugriffsprüfung (Broken Object Level Authorization) zurückführen können, bei der ein authentifizierter Nutzer über die bloße Änderung einer Objekt-ID auf fremde Daten zugreift.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für verbindliche Objektzugriffsprüfung pro API-Operation sowie Begrenzung von Querykomplexität und Ressourcenverbrauch festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailimplementierung spezifischer API-Gateway-Sicherheitswerkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Broken Object Level Authorization, SSRF und Ressourcenverbrauchsbegrenzung als Entscheidungsgrundlage, nicht die werkzeugspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0559-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Broken Object Level Authorization trotz erfolgreicher Authentifizierung, kein produktives API-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein authentifizierter Nutzer, der lediglich eine Objekt-ID in einer API-Anfrage verändert (etwa von der eigenen Bestellungs-ID zu einer fremden), auf die Daten eines anderen Nutzers zugreifen kann, wenn die API nur die Authentifizierung, nicht jedoch die tatsächliche Eigentümerschaft des angefragten Objekts prüft, und zeigt damit, warum eine erfolgreiche Authentifizierung keine ausreichende Grundlage für eine Autorisierungsentscheidung auf Objektebene darstellt.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales API-System mit tatsächlicher Backend-Logik."}]}
---
# API Security

> **Ziel:** API-Sicherheit erfordert die Absicherung mehrerer, strukturell unterschiedlicher Schwachstellenklassen: **Broken Object Level Authorization** (BOLA — ein authentifizierter Nutzer greift durch bloße Manipulation einer Objekt-ID in der Anfrage auf Daten zu, die ihm nicht gehören, weil die API zwar die Identität des Nutzers, nicht aber dessen tatsächliche Berechtigung für das spezifische, angefragte Objekt prüft), **SSRF** (Server-Side Request Forgery — ein Angreifer manipuliert eine API-Funktion, die serverseitig Anfragen an von Nutzern angegebene URLs stellt, dazu, Anfragen an interne, eigentlich nicht öffentlich erreichbare Systeme zu senden), und **Ressourcenverbrauch-Missbrauch** (eine API-Operation mit unbegrenzter Querykomplexität oder Antwortgröße kann durch eine einzelne, technisch "legitime" Anfrage unverhältnismäßig hohen Ressourcenverbrauch verursachen). Der zentrale Punkt dieses Kapitels ist, dass eine erfolgreiche Authentifizierung (siehe [KB-0552](16-mtls-und-dienstauthentifizierung.md)) keine ausreichende Grundlage für eine Autorisierungsentscheidung auf Objektebene darstellt — dieselbe strukturelle Trennung von Authentifizierung und Autorisierung, die bereits bei mTLS behandelt wurde, gilt in verschärfter Form für APIs: Ein unautorisierter Datenzugriff trotz erfolgreicher API-Authentifizierung ist fast immer auf eine fehlende, pro Objektanfrage durchzuführende Eigentümerschaftsprüfung zurückzuführen, nicht auf einen Fehler im Authentifizierungsmechanismus selbst.

## Zweck, Mental Model und Dependencies

Broken Object Level Authorization ist strukturell die häufigste und folgenreichste API-Sicherheitsschwachstelle, weil sie eine subtile, aber fundamentale Verwechslung ausnutzt: Eine API-Operation wie "Bestelldetails abrufen" prüft typischerweise korrekt, dass der anfragende Nutzer authentifiziert ist (er hat gültige Credentials vorgelegt), übersieht jedoch häufig, explizit zu prüfen, ob genau dieser authentifizierte Nutzer tatsächlich Eigentümer oder berechtigter Betrachter genau dieser spezifischen, in der Anfrage referenzierten Bestellung ist — ein Angreifer, der lediglich die Objekt-ID in seiner Anfrage von seiner eigenen zu einer beliebigen anderen, erratbaren oder sequenziellen ID ändert, kann dadurch auf fremde Daten zugreifen, obwohl seine eigene Authentifizierung vollkommen korrekt und gültig war. Diese Schwachstelle muss für jede einzelne API-Operation, die auf ein spezifisches Objekt zugreift, individuell geprüft werden — es reicht nicht, Autorisierung einmalig auf API-Ebene (etwa "darf dieser Nutzer überhaupt die Bestellungs-API nutzen") zu prüfen, sondern jede Operation muss zusätzlich explizit verifizieren, dass das konkret angefragte Objekt tatsächlich zum anfragenden, authentifizierten Nutzer gehört oder von ihm autorisiert eingesehen werden darf. SSRF nutzt eine andere strukturelle Schwäche aus: APIs, die als legitime Funktion serverseitig eine Anfrage an eine vom Nutzer angegebene URL stellen (etwa zum Abrufen eines Profilbilds von einer externen URL, oder zum Validieren eines Webhooks), können von einem Angreifer manipuliert werden, diese Anfrage stattdessen an eine interne, eigentlich nicht öffentlich erreichbare Adresse zu richten (etwa an interne Verwaltungsschnittstellen oder Cloud-Metadaten-Endpunkte) — der Server selbst führt die bösartige Anfrage im Namen des Angreifers aus, wodurch Netzwerksegmentierung, die eigentlich vor direktem, externem Zugriff schützen sollte, effektiv umgangen wird. Ressourcenverbrauch-Missbrauch betrifft APIs, die komplexe, flexible Abfragen erlauben (etwa GraphQL-artige Abfragesprachen oder Paginierungsparameter ohne obere Grenze) — eine einzelne, technisch valide Anfrage kann durch übermäßige Verschachtelungstiefe oder eine angeforderte Ergebnismenge unverhältnismäßig hohen Rechen- oder Speicherressourcenverbrauch auf dem Server verursachen, was strukturell einem gezielten, punktuellen Denial-of-Service-Angriff über eine einzelne, scheinbar harmlose Anfrage entspricht.

~~~text
API Security: multiple structurally different vulnerability classes
  Broken Object Level Authorization (BOLA): authenticated user manipulates OBJECT ID in request
    -> API checks authentication (WHO is asking) but NOT object-specific ownership (are they allowed THIS object)
    -> attacker changes ID from own to arbitrary/guessable/sequential ID -> accesses others' data
    -> MUST be checked PER OPERATION accessing a specific object, not just once at API level
  SSRF (Server-Side Request Forgery): API legitimately makes server-side requests to user-supplied URLs
    (fetch profile image, validate webhook)
    -> attacker redirects that request to INTERNAL, normally-unreachable addresses
       (internal admin interfaces, cloud metadata endpoints)
    -> server itself executes the malicious request ON BEHALF OF the attacker
       -> effectively BYPASSES network segmentation meant to block direct external access
  Resource consumption abuse: flexible query APIs (GraphQL-like, unbounded pagination)
    -> SINGLE technically-valid request -> excessive nesting depth/result size
       -> disproportionate compute/memory consumption -- structurally a targeted DoS via ONE innocuous-looking request
CORE POINT: successful auth (KB-0552) != sufficient basis for OBJECT-LEVEL authorization decision
  unauthorized access DESPITE valid auth -> almost always = missing per-object ownership check, NOT an auth bug
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Broken Object Level Authorization | fehlende Eigentümerschaftsprüfung pro Objektanfrage | häufigste, folgenreichste API-Schwachstellenklasse |
| SSRF | serverseitige Anfrage an vom Angreifer kontrollierte, interne Adresse | umgeht Netzwerksegmentierung über den Server selbst |
| Ressourcenverbrauch-Missbrauch | einzelne Anfrage mit übermäßiger Komplexität/Größe | gezielter Denial-of-Service über eine scheinbar harmlose Anfrage |
| Objektzugriffsprüfung pro Operation | explizite, individuelle Eigentümerschaftsverifikation | notwendig zusätzlich zur allgemeinen Authentifizierung |

Implementierung: Jede API-Operation, die auf ein spezifisches Objekt zugreift, prüft explizit, ob der authentifizierte Nutzer tatsächlich berechtigter Eigentümer oder Betrachter genau dieses Objekts ist, nicht nur, dass er allgemein authentifiziert ist. Serverseitige Anfragen an nutzerdefinierte URLs werden gegen eine Positivliste erlaubter, externer Zieladressen geprüft, mit expliziter Ablehnung interner, privater Adressbereiche. Querykomplexität und Antwortgröße werden explizit begrenzt, um einzelne Anfragen mit übermäßigem Ressourcenverbrauch zu verhindern.

## Scalability, Reliability, Security und Observability

API-Sicherheit skaliert die tatsächliche Schutzwirkung proportional zur Konsequenz objektspezifischer Autorisierungsprüfung über alle API-Operationen hinweg; die Reliability-Grenze liegt darin, dass eine fehlende Objektzugriffsprüfung bei einer einzelnen Operation unabhängig von der Robustheit der allgemeinen Authentifizierung zu unautorisiertem Datenzugriff führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein authentifizierter Nutzer erhält Zugriff auf fremde Daten durch Änderung einer Objekt-ID | die betroffene API-Operation prüft nur Authentifizierung, nicht die tatsächliche Eigentümerschaft des angefragten Objekts | eine explizite Eigentümerschaftsprüfung für die betroffene Operation ergänzen |
| eine API-Funktion, die externe URLs abruft, erreicht unerwartet interne Systeme | keine Positivlistenprüfung erlaubter Zieladressen schützt vor SSRF | eine explizite Positivliste erlaubter externer Adressen einrichten und private/interne Adressbereiche blockieren |
| eine einzelne API-Anfrage verursacht unverhältnismäßig hohen Ressourcenverbrauch | Querykomplexität oder Antwortgröße sind nicht begrenzt | explizite Grenzen für Verschachtelungstiefe, Ergebnismenge oder Antwortgröße einführen |

Security: Jede Objektzugriffsprüfung sollte konsequent und individuell pro API-Operation durchgesetzt werden, unabhängig von der allgemeinen Authentifizierung, und serverseitige Anfragen an nutzerdefinierte URLs sollten stets gegen eine explizite Positivliste geprüft werden. Observability: Die tatsächliche Abdeckung objektspezifischer Autorisierungsprüfung über alle API-Operationen hinweg, die Häufigkeit blockierter SSRF-Versuche, und die Verteilung der Ressourcenverbrauchsmuster einzelner Anfragen sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert eine Objektzugriffsprüfung für eine einzelne API-Operation korrekt. **Principal** entwirft die vollständige API-Sicherheitsarchitektur inklusive SSRF-Schutz und Ressourcenverbrauchsbegrenzung für eine API-Landschaft. **Chief** legt unternehmensweite Standards für verbindliche, objektspezifische Autorisierungsprüfung über alle API-Operationen fest.

Anti-Patterns: Objektzugriff allein auf Basis erfolgreicher Authentifizierung gewähren, ohne die tatsächliche Eigentümerschaft des spezifischen Objekts zu prüfen; serverseitige Anfragen an nutzerdefinierte URLs ohne Positivlistenprüfung zulassen; Querykomplexität oder Antwortgröße ohne explizite Obergrenzen konfigurieren.

## Production Checklist

- [ ] Jede API-Operation, die auf ein spezifisches Objekt zugreift, prüft explizit die tatsächliche Eigentümerschaft.
- [ ] Serverseitige Anfragen an nutzerdefinierte URLs sind gegen eine Positivliste erlaubter Adressen geprüft.
- [ ] Querykomplexität und Antwortgröße sind explizit begrenzt.
- [ ] Die Objektzugriffsprüfung wird regelmäßig gegen alle API-Operationen auf Vollständigkeit geprüft.

## Interviewfragen

### 1. Was ist Broken Object Level Authorization, und warum ist sie besonders häufig?

**Antwort:** Eine Schwachstelle, bei der eine API zwar die Authentifizierung eines Nutzers prüft, nicht jedoch dessen tatsächliche Eigentümerschaft für ein spezifisches, angefragtes Objekt, wodurch ein authentifizierter Nutzer durch bloße Manipulation einer Objekt-ID auf fremde Daten zugreifen kann — sie ist häufig, weil sie leicht übersehen wird, wenn nur allgemeine Authentifizierung, nicht aber objektspezifische Autorisierung geprüft wird.

### 2. Wie funktioniert ein SSRF-Angriff?

**Antwort:** Ein Angreifer manipuliert eine API-Funktion, die serverseitig legitime Anfragen an vom Nutzer angegebene URLs stellt, dazu, stattdessen Anfragen an interne, eigentlich nicht öffentlich erreichbare Systeme zu senden, wodurch der Server selbst die bösartige Anfrage im Namen des Angreifers ausführt.

### 3. Warum reicht erfolgreiche Authentifizierung nicht als Grundlage für eine Objektzugriffsentscheidung aus?

**Antwort:** Weil Authentifizierung nur bestätigt, wer der Nutzer ist, nicht jedoch, ob dieser Nutzer tatsächlich berechtigt ist, auf ein spezifisches, angefragtes Objekt zuzugreifen — diese Prüfung muss individuell pro Operation erfolgen.

### 4. Was ist Ressourcenverbrauch-Missbrauch bei APIs?

**Antwort:** Eine einzelne, technisch valide Anfrage mit übermäßiger Querykomplexität oder Antwortgröße, die unverhältnismäßig hohen Rechen- oder Speicherressourcenverbrauch verursacht, strukturell vergleichbar mit einem gezielten Denial-of-Service über eine scheinbar harmlose Anfrage.

### 5. Wie gehst du vor, wenn ein authentifizierter Nutzer Zugriff auf fremde Daten durch Änderung einer Objekt-ID erhält?

**Antwort:** Ich prüfe, ob die betroffene API-Operation nur Authentifizierung, nicht jedoch die tatsächliche Eigentümerschaft des angefragten Objekts prüft, und ergänze eine explizite, objektspezifische Autorisierungsprüfung.

### 6. Widersprüchliche Anforderung: Team will maximale API-Flexibilität durch frei kombinierbare, verschachtelte Abfragen für Endnutzer UND garantiert begrenzten, vorhersehbaren Ressourcenverbrauch pro Anfrage — wie gehst du vor?

**Antwort:** Ich würde explizite Obergrenzen für Verschachtelungstiefe, Ergebnismenge und Ausführungszeit pro Anfrage einführen, innerhalb derer Nutzer weiterhin flexible, kombinierbare Abfragen stellen können — Flexibilität und begrenzter Ressourcenverbrauch lassen sich durch definierte, aber großzügige Grenzen statt durch unbegrenzte Flexibilität oder übermäßig restriktive, starre Abfragestrukturen vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of Broken Object Level Authorization vs correct ownership check (executed locally, no real API):

def get_order_insecure(authenticated, order_id, orders_db):
    if not authenticated:
        return "REJECTED: not authenticated"
    return orders_db.get(order_id, "not found")  # BUG: no ownership check

def get_order_secure(authenticated, requesting_user_id, order_id, orders_db):
    if not authenticated:
        return "REJECTED: not authenticated"
    order = orders_db.get(order_id)
    if order is None:
        return "not found"
    if order["owner"] != requesting_user_id:
        return "REJECTED: not authorized for this specific object"
    return order

orders_db = {"order-1": {"owner": "user-a", "amount": 100}, "order-2": {"owner": "user-b", "amount": 250}}

print("insecure, user-a requests order-2:", get_order_insecure(True, "order-2", orders_db))
print("secure, user-a requests order-2:  ", get_order_secure(True, "user-a", "order-2", orders_db))
~~~

## Dependencies, Cross-References und Quellen

1. OWASP-Dokumentation: [OWASP API Security Top 10 — Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/), abgerufen 2026-09-18.
2. OWASP-Dokumentation: [Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html), abgerufen 2026-09-18.

WAF und DDoS-Abwehr sind kanonisch in [KB-0558](22-waf-und-ddos-abwehr.md) behandelt; MTLS und Dienstauthentifizierung in [KB-0552](16-mtls-und-dienstauthentifizierung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte API-Sicherheitsscanner, die Broken-Object-Level-Authorization-Schwachstellen durch systematische ID-Manipulation und Vergleich mit erwarteten Autorisierungsregeln erkennen | Evaluating | Gegenüber rein manueller Code-Review-Prüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für komplexe, verschachtelte Objektbeziehungen bevorzugen. |

Ein Team akzeptiert eine API-Implementierung erst, wenn nachweislich jede Operation, die auf ein spezifisches Objekt zugreift, eine explizite Eigentümerschaftsprüfung durchführt, nicht nur allgemeine Authentifizierung.
