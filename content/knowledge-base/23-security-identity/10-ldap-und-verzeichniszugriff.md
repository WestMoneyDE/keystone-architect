---
{"id": "KB-0546", "title": "LDAP und Verzeichniszugriff", "domain": "23", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0544", "concepts": ["Active Directory"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "LDAP-Directory-Trees, Bind-Operationen und Suchfilter anhand offizieller Spezifikation korrekt und sicher (mit Eingabebereinigung gegen LDAP-Injection) implementieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit entscheiden, wann LDAP für Verzeichniszugriff geeignet ist, und wie sichere Bind-Verbindungen sowie Gruppenauflösung gestaltet werden, ohne LDAP fälschlich als allgemeines Authentifizierungsprotokoll oder Datenbanksystem zu behandeln.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unautorisierte Datenoffenlegung oder Authentifizierungsumgehung auf eine LDAP-Injection-Schwachstelle durch unbereinigte Nutzereingaben in Suchfiltern zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für sichere LDAP-Verbindungen (verschlüsselt statt Klartext) und konsequente Eingabebereinigung bei Suchfiltern festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer LDAP-Server-Software im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Directory-Tree-Struktur, Bind-Sicherheit und Suchfilter-Injection-Risiken, nicht die serverspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0546-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von LDAP-Suchfilter-Injection durch unbereinigte Nutzereingaben, kein produktives Verzeichnissystem verwendet", "evidence": "Ein lokales Skript simuliert, wie eine Nutzereingabe, die ohne Bereinigung direkt in einen LDAP-Suchfilter eingefügt wird, durch spezielle LDAP-Filtersyntax-Zeichen (Klammern, Sternchen, logische Operatoren) manipuliert werden kann, um die beabsichtigte Filterlogik zu verändern und dadurch unautorisierten Zugriff auf Verzeichnisdaten oder eine Umgehung der Authentifizierungslogik zu ermöglichen, analog zu SQL-Injection bei Datenbankabfragen.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales LDAP-Verzeichnissystem."}]}
---
# LDAP und Verzeichniszugriff

> **Ziel:** LDAP (Lightweight Directory Access Protocol) ist ein Protokoll für den Zugriff auf hierarchisch strukturierte **Directory Trees** (Verzeichnisbäume, in denen Einträge wie Nutzer oder Gruppen über einen eindeutigen, hierarchischen Distinguished Name adressiert werden), über **Bind**-Operationen (die Authentifizierung gegenüber dem Verzeichnis) und **Suchfilter** (Abfragen, die Einträge anhand von Attributbedingungen finden). Der zentrale Punkt dieses Kapitels ist, dass LDAP kein allgemeines Authentifizierungsprotokoll (wie OAuth2/OIDC, siehe [KB-0540](04-oauth2-und-delegierter-zugriff.md)/[KB-0541](05-openid-connect.md)) und kein Datenbanksystem ist, sondern spezifisch für hierarchischen Verzeichniszugriff konzipiert wurde — eine häufige, sicherheitskritische Schwachstelle entsteht, wenn Nutzereingaben ohne Bereinigung direkt in einen LDAP-Suchfilter eingefügt werden: Analog zu SQL-Injection bei Datenbankabfragen ermöglicht eine solche **LDAP-Injection** einem Angreifer, spezielle Filtersyntax-Zeichen zu nutzen, um die beabsichtigte Filterlogik zu manipulieren und dadurch unautorisierten Zugriff auf Verzeichnisdaten zu erlangen oder Authentifizierungslogik zu umgehen.

## Zweck, Mental Model und Dependencies

Ein LDAP-Directory-Tree organisiert Einträge hierarchisch, ähnlich einer Dateisystemstruktur — jeder Eintrag (ein Nutzer, eine Gruppe, eine Organisationseinheit) hat einen eindeutigen Distinguished Name, der seine Position im Baum beschreibt (etwa "cn=max.mustermann,ou=vertrieb,dc=firma,dc=example"), und Attribute, die die tatsächlichen Eigenschaften dieses Eintrags tragen (etwa E-Mail-Adresse, Gruppenzugehörigkeit). Eine Bind-Operation authentifiziert eine Verbindung gegenüber dem Verzeichnis — dies kann anonym (kein Nutzername/Passwort, meist nur für sehr eingeschränkten, öffentlichen Lesezugriff), mit einfachen Zugangsdaten (Nutzername und Passwort im Klartext, weshalb dies unbedingt über eine verschlüsselte Verbindung erfolgen muss), oder über stärkere Mechanismen (etwa SASL-basierte Authentifizierung) erfolgen. Suchfilter sind der Mechanismus, über den Einträge anhand von Attributbedingungen gefunden werden (etwa "finde alle Nutzer, deren E-Mail-Adresse mit 'max' beginnt") — die LDAP-Filtersyntax nutzt spezielle Zeichen (Klammern zur Gruppierung, Sternchen als Platzhalter, logische Operatoren wie `&` und `|`) zur Ausdrucksbildung. Die kritische Sicherheitslücke entsteht, wenn eine Anwendung eine Nutzereingabe (etwa einen vom Nutzer eingegebenen Anmeldenamen) direkt, ohne Bereinigung dieser speziellen Zeichen, in einen Suchfilter-String einfügt — ein Angreifer kann dann durch geschickte Eingabe von Filtersyntax-Zeichen die beabsichtigte Filterlogik verändern (etwa einen Filter, der eigentlich "Nutzername UND korrektes Passwort" prüfen sollte, so manipulieren, dass er effektiv immer wahr wird), was strukturell exakt der SQL-Injection-Schwachstellenklasse bei Datenbankabfragen entspricht, jedoch für die LDAP-spezifische Filtersyntax statt SQL. Die korrekte Absicherung erfolgt über parametrisierte Suchfilter-Konstruktion (analog zu vorbereiteten SQL-Statements) oder explizite Escape-Behandlung aller speziellen LDAP-Filtersyntax-Zeichen in Nutzereingaben, bevor diese in einen Filter eingefügt werden.

~~~text
LDAP: protocol for HIERARCHICAL DIRECTORY access (NOT a general auth protocol, NOT a database)
  Directory Tree: entries addressed by unique, hierarchical Distinguished Name (like a filesystem path)
  Bind: authenticates the connection (anonymous / simple creds -- MUST be over encrypted connection / SASL)
  Search filters: query entries by attribute conditions, using special syntax chars
    (parentheses for grouping, asterisk as wildcard, & and | as logical operators)
CRITICAL VULNERABILITY: LDAP INJECTION
  user input inserted DIRECTLY into a search filter string, WITHOUT sanitization
  -> attacker uses special filter syntax chars to MANIPULATE intended filter logic
     e.g. a "username AND correct password" filter -> manipulated to effectively ALWAYS evaluate true
  STRUCTURALLY IDENTICAL to SQL injection, just for LDAP filter syntax instead of SQL
CORRECT MITIGATION: parameterized filter construction (like prepared SQL statements)
  OR explicit escaping of all special LDAP filter syntax chars in user input BEFORE insertion into a filter
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Directory Tree | hierarchische Organisation von Verzeichniseinträgen | Distinguished Name adressiert Einträge eindeutig |
| Bind | Authentifizierung der Verbindung | muss über verschlüsselte Verbindung erfolgen |
| Suchfilter | Abfrage von Einträgen anhand von Attributbedingungen | anfällig für Injection bei unbereinigter Nutzereingabe |
| LDAP-Injection | Manipulation der Filterlogik durch Syntax-Zeichen | strukturell analog zu SQL-Injection |

Implementierung: Jede Nutzereingabe, die in einen LDAP-Suchfilter eingefügt wird, wird explizit über parametrisierte Filter-Konstruktion oder Escape-Behandlung der speziellen LDAP-Filtersyntax-Zeichen bereinigt, statt direkt und unbereinigt eingefügt zu werden. Bind-Operationen mit einfachen Zugangsdaten erfolgen ausschließlich über verschlüsselte Verbindungen (LDAPS oder STARTTLS), nie im Klartext. Gruppenauflösung wird explizit gegen die tatsächlich benötigte Verzeichnisstruktur geprüft, um unbeabsichtigt breite Gruppenzugehörigkeiten zu vermeiden.

## Scalability, Reliability, Security und Observability

LDAP-Verzeichniszugriff skaliert die tatsächliche Sicherheit proportional zur konsequenten Bereinigung von Nutzereingaben in Suchfiltern; die Reliability-Grenze liegt darin, dass eine unbereinigte Nutzereingabe proportional zur Häufigkeit und Kritikalität betroffener Suchfilter zu unautorisiertem Zugriff oder Authentifizierungsumgehung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| unautorisierter Zugriff auf Verzeichnisdaten oder eine erfolgreiche Authentifizierungsumgehung wird beobachtet | eine Nutzereingabe wurde ohne Bereinigung direkt in einen LDAP-Suchfilter eingefügt (LDAP-Injection) | alle Stellen, an denen Nutzereingaben in Suchfilter einfließen, auf parametrisierte Konstruktion oder Escape-Behandlung prüfen |
| Zugangsdaten für den Bind werden im Netzwerkverkehr im Klartext beobachtet | die Bind-Verbindung erfolgt unverschlüsselt statt über LDAPS oder STARTTLS | die Verbindung auf verschlüsselte Übertragung umstellen |
| ein Nutzer hat unerwartet breite Gruppenzugehörigkeit | die Gruppenauflösung berücksichtigt verschachtelte oder transitive Gruppenmitgliedschaften nicht korrekt | die tatsächliche, aufgelöste Gruppenzugehörigkeit explizit gegen die beabsichtigte Struktur prüfen |

Security: Alle Nutzereingaben, die in LDAP-Suchfilter einfließen, müssen konsequent bereinigt werden, und Bind-Verbindungen mit Zugangsdaten sollten ausschließlich verschlüsselt erfolgen. Observability: Die tatsächliche Nutzung bereinigter versus unbereinigter Filterkonstruktion über alle Integrationspunkte hinweg, sowie die Konsistenz verschlüsselter Bind-Verbindungen, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert eine bereinigte, sichere LDAP-Suchfilterkonstruktion für eine gegebene Abfrage. **Principal** entwirft die vollständige, sichere LDAP-Integrationsarchitektur inklusive verschlüsselter Bind-Verbindungen. **Chief** legt unternehmensweite Standards für konsequente Eingabebereinigung und verschlüsselte LDAP-Verbindungen fest.

Anti-Patterns: Nutzereingaben ohne Bereinigung direkt in LDAP-Suchfilter einfügen; Bind-Operationen mit Zugangsdaten über unverschlüsselte Verbindungen durchführen; LDAP fälschlich als allgemeines Authentifizierungsprotokoll oder Datenbanksystem statt als spezialisiertes Verzeichniszugriffsprotokoll behandeln.

## Production Checklist

- [ ] Alle Nutzereingaben in LDAP-Suchfiltern sind über parametrisierte Konstruktion oder Escape-Behandlung bereinigt.
- [ ] Bind-Operationen mit Zugangsdaten erfolgen ausschließlich über verschlüsselte Verbindungen.
- [ ] Gruppenauflösung ist explizit gegen die beabsichtigte Verzeichnisstruktur geprüft.
- [ ] LDAP wird ausschließlich für tatsächlichen Verzeichniszugriff genutzt, nicht als allgemeines Authentifizierungsprotokoll missverstanden.

## Interviewfragen

### 1. Was ist ein Distinguished Name in LDAP?

**Antwort:** Die eindeutige, hierarchische Adresse eines Eintrags im Directory Tree, die seine Position innerhalb der Verzeichnisstruktur beschreibt.

### 2. Was ist LDAP-Injection, und wie entsteht sie?

**Antwort:** Eine Schwachstelle, bei der eine Nutzereingabe ohne Bereinigung direkt in einen LDAP-Suchfilter eingefügt wird, wodurch ein Angreifer über spezielle Filtersyntax-Zeichen die beabsichtigte Filterlogik manipulieren kann, um unautorisierten Zugriff oder eine Authentifizierungsumgehung zu erreichen.

### 3. Womit ist LDAP-Injection strukturell vergleichbar?

**Antwort:** Mit SQL-Injection bei Datenbankabfragen — beide entstehen durch unbereinigte Nutzereingaben, die direkt in eine strukturierte Abfragesprache eingefügt werden.

### 4. Wie wird LDAP-Injection korrekt verhindert?

**Antwort:** Durch parametrisierte Suchfilter-Konstruktion oder explizite Escape-Behandlung aller speziellen LDAP-Filtersyntax-Zeichen in Nutzereingaben, bevor sie in einen Filter eingefügt werden.

### 5. Wie gehst du vor, wenn unautorisierter Zugriff auf Verzeichnisdaten beobachtet wird?

**Antwort:** Ich prüfe, ob eine Nutzereingabe ohne Bereinigung direkt in einen LDAP-Suchfilter eingefügt wurde, da dies die häufigste Ursache für unautorisierten Zugriff über LDAP-Injection ist, und stelle auf parametrisierte Filterkonstruktion um.

### 6. Widersprüchliche Anforderung: Team will flexible, benutzerdefinierte LDAP-Suchabfragen für Endnutzer ermöglichen UND garantiert, dass keine LDAP-Injection möglich ist — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, keine direkten, rohen Nutzereingaben in Suchfilter einfließen zu lassen, sondern eine begrenzte, vordefinierte Menge an Suchparametern anzubieten, die intern über parametrisierte Filterkonstruktion sicher in tatsächliche LDAP-Filter übersetzt werden — Flexibilität für Endnutzer und Sicherheit vor Injection lassen sich durch eine kontrollierte Abstraktionsschicht statt durch direkte, ungeprüfte Filterkonstruktion vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of LDAP filter injection risk (executed locally, no real directory system):

def build_filter_unsafe(username):
    return f"(&(uid={username})(objectClass=person))"

def build_filter_safe(username):
    escaped = username.replace("\\", "\\5c").replace("*", "\\2a").replace("(", "\\28").replace(")", "\\29")
    return f"(&(uid={escaped})(objectClass=person))"

malicious_input = "*)(uid=*))(|(uid=*"

print("unsafe filter:", build_filter_unsafe(malicious_input))
print("safe filter:  ", build_filter_safe(malicious_input))
~~~

## Dependencies, Cross-References und Quellen

1. IETF-Dokumentation: [RFC 4511 — Lightweight Directory Access Protocol (LDAP)](https://datatracker.ietf.org/doc/html/rfc4511), abgerufen 2026-09-18.
2. OWASP-Dokumentation: [LDAP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LDAP_Injection_Prevention_Cheat_Sheet.html), abgerufen 2026-09-18.

Active Directory ist kanonisch in [KB-0544](08-active-directory.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte statische Analysewerkzeuge zur Erkennung unbereinigter Nutzereingaben in LDAP-Suchfilterkonstruktion direkt im Code-Review | Evaluating | Gegenüber rein manueller Code-Review-Prüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für komplexe, dynamisch konstruierte Filterausdrücke bevorzugen. |

Ein Team akzeptiert eine LDAP-Integration erst, wenn nachweislich alle Nutzereingaben in Suchfiltern bereinigt sind und Bind-Verbindungen ausschließlich verschlüsselt erfolgen.
