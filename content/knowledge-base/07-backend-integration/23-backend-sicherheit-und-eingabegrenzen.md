---
{"id": "KB-0175", "title": "Backend-Sicherheit und Eingabegrenzen", "domain": "07", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF"], "requires": [{"id": "KB-0165", "concepts": ["Autorisierung"], "needed_for": "understanding"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0176", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine SSRF-Schwachstelle in einer URL-Validierungsfunktion lokal reproduzieren und beheben.", "rationale": "Kein reales Produktionssystem nötig, um die Schwachstellenklasse zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Klare Vertrauensgrenzen für Query-Parameter, Datei-Uploads und extern referenzierte URLs entwerfen.", "rationale": "Jede externe Eingabe ist eine potenzielle Angriffsfläche, die explizit an der Vertrauensgrenze geprüft werden muss."}, "STAFF-TARGET": {"active": true, "scope": "Eine interne Ressourcenanfrage auf eine SSRF-Schwachstelle über eine vom Nutzer kontrollierte URL zurückführen.", "rationale": "SSRF ist eine häufige, aber oft übersehene Schwachstellenklasse bei Backend-Diensten, die externe URLs verarbeiten."}, "CHIEF-TARGET": {"active": true, "scope": "Eingabevalidierung an allen externen Vertrauensgrenzen als Pflichtstandard für alle Backend-Dienste festlegen.", "rationale": "Fehlende Eingabevalidierung ist eine der häufigsten Ursachen kritischer Sicherheitsvorfälle."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Deserialisierungs-Schwachstellen einzelner Sprachlaufzeiten sind Vertiefung.", "rationale": "Kern ist das Prinzip der Vertrauensgrenze, nicht jede sprachspezifische Implementierungsdetailschwachstelle."}}, "lab_validation": [{"lab_id": "KB-0175-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für SSRF-Schutz mit URL-Allowlist", "evidence": "Eine vom Nutzer angegebene URL, die auf eine interne Metadaten-Adresse zeigt, wird von einer Allowlist-Prüfung korrekt abgelehnt, während eine erlaubte externe URL akzeptiert wird.", "limitations": "Kein echtes Produktionssystem, keine Produktion."}]}
---
# Backend-Sicherheit und Eingabegrenzen

> **Ziel:** Jede externe Eingabe — Query-Parameter, Datei-Upload, vom Nutzer angegebene URL — ist eine potenzielle Angriffsfläche, die an der Vertrauensgrenze explizit geprüft werden muss. Injection (Eingabe wird als Code statt Daten interpretiert), SSRF (Server-Side Request Forgery: der Server wird dazu gebracht, Anfragen an unbeabsichtigte interne Ziele zu senden) und unsichere Deserialisierung sind die drei häufigsten Klassen von Backend-Sicherheitslücken.

## Zweck, Mental Model und Dependencies

Eine Vertrauensgrenze ist der Punkt, an dem Daten von einer weniger vertrauenswürdigen Quelle (externer Client) in eine vertrauenswürdigere Domäne (Backend-Logik) übergehen. Injection entsteht, wenn Eingabedaten ungeprüft in einen Ausführungskontext (SQL-Query, Shell-Kommando) eingefügt werden, wo sie als Code statt als reine Daten interpretiert werden. SSRF entsteht, wenn eine vom Nutzer kontrollierte URL vom Server ungeprüft angefragt wird — ein Angreifer kann so den Server dazu bringen, interne, eigentlich nicht extern erreichbare Ressourcen (z. B. Cloud-Metadaten-Endpunkte) abzufragen. Unsichere Deserialisierung entsteht, wenn ein Serialisierungsformat, das beliebigen Code ausführen kann, auf nicht vertrauenswürdige Eingabedaten angewendet wird. Lies [KB-0165](13-autorisierung-an-api-grenzen.md) und [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md).

~~~text
Injection: query = f"SELECT * FROM users WHERE name = '{user_input}'"  -- user_input interpreted as SQL, not data
SSRF:      requests.get(user_provided_url)  -- could target http://169.254.169.254/ (cloud metadata) internally
Deserialization: pickle.loads(untrusted_bytes)  -- can execute arbitrary code embedded in the serialized data
~~~

## Core Concepts, Architektur und Implementierung

| Schwachstellenklasse | Ursache | Gegenmaßnahme |
|---|---|---|
| Injection | Eingabe wird als Code statt Daten interpretiert | parametrisierte Queries/Prepared Statements, nie String-Konkatenation |
| SSRF | vom Nutzer kontrollierte URL wird ungeprüft angefragt | Allowlist erlaubter Ziele, Blockierung interner/privater IP-Bereiche |
| Unsichere Deserialisierung | code-ausführendes Format auf untrusted Daten angewendet | nur datenreine Formate (JSON) für externe Eingaben, nie code-ausführende Formate |
| Datei-Upload | fehlende Typ-/Inhaltsprüfung | Dateityp-Validierung, Größenlimit, Ausführung im Upload-Verzeichnis verhindern |

Implementierung: für Datenbankzugriffe werden ausnahmslos parametrisierte Queries verwendet, nie String-Konkatenation mit Nutzereingaben. Für vom Nutzer angegebene URLs (z. B. Webhook-Ziel-URLs, Bild-Import-URLs) wird eine Allowlist erlaubter Schemata/Domains geprüft, und private/interne IP-Bereiche werden explizit blockiert, auch wenn eine DNS-Auflösung sie erst zur Laufzeit ergibt (DNS-Rebinding-Schutz). Deserialisierung nicht vertrauenswürdiger Daten nutzt ausschließlich reine Datenformate wie JSON, nie Formate, die beliebigen Code ausführen können. Datei-Uploads werden nach Typ und Größe validiert und in einem Verzeichnis gespeichert, das nicht direkt ausführbar ist.

## Scalability, Reliability, Security und Observability

Konsistente Eingabevalidierung an klar definierten Vertrauensgrenzen skaliert Sicherheit über eine wachsende Codebasis, während verstreute Ad-hoc-Prüfungen Lücken hinterlassen. Reliability-Grenze: eine SSRF-Schwachstelle kann nicht nur Daten exfiltrieren, sondern auch interne, eigentlich geschützte Dienste erreichbar machen — die Konsequenzen reichen weit über den eigentlichen Backend-Dienst hinaus.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Datenbankfehler bei bestimmten Nutzereingaben (z. B. Anführungszeichen) | SQL-Injection durch String-Konkatenation statt parametrisierter Query | Datenbankzugriffscode auf Query-Aufbau-Methode prüfen |
| Server sendet unerwartete Anfragen an interne Adressen | SSRF durch ungeprüfte, vom Nutzer kontrollierte URL | URL-Validierungslogik gegen private IP-Bereiche und DNS-Rebinding testen |
| unerwarteter Codeausführungsfehler nach Deserialisierung externer Daten | code-ausführendes Deserialisierungsformat auf untrusted Daten angewendet | Deserialisierungsformat für externe Eingaben auf reine Datenformate prüfen |
| hochgeladene Datei wird unerwartet ausgeführt | fehlende Dateityp-Prüfung, Upload-Verzeichnis ausführbar konfiguriert | Upload-Verzeichnis-Berechtigungen und Dateityp-Validierung prüfen |

Security: diese Datei behandelt selbst zentrale Sicherheitsklassen; jede dieser Schwachstellen steht typischerweise in den OWASP Top 10 und sollte in jedem Security-Review explizit geprüft werden. Observability: Web Application Firewalls und Eingabevalidierungs-Logs helfen, Angriffsversuche gegen diese Schwachstellenklassen frühzeitig zu erkennen.

## Trade-offs und Entscheidungen

**Staff** prüft bei jeder neuen externen Eingabequelle explizit, welche dieser drei Schwachstellenklassen relevant sein könnten. **Principal** etabliert Standardbibliotheken/-muster (parametrisierte Queries, URL-Allowlists) als verpflichtende Vorgabe. **Chief** verlangt Eingabevalidierung an allen externen Vertrauensgrenzen als nicht verhandelbaren Sicherheitsstandard.

Anti-Patterns: SQL-Queries per String-Konkatenation mit Nutzereingaben aufbauen; vom Nutzer angegebene URLs ohne Allowlist/IP-Bereichsprüfung anfragen; code-ausführende Deserialisierungsformate auf nicht vertrauenswürdige externe Daten anwenden; Datei-Uploads ohne Typ-/Größenprüfung akzeptieren.

## Production Checklist

- [ ] Alle Datenbankzugriffe nutzen parametrisierte Queries, keine String-Konkatenation.
- [ ] Vom Nutzer angegebene URLs werden gegen eine Allowlist und private IP-Bereiche geprüft.
- [ ] Deserialisierung externer Daten nutzt ausschließlich reine Datenformate.
- [ ] Datei-Uploads werden nach Typ/Größe validiert und in nicht ausführbaren Verzeichnissen gespeichert.

## Interviewfragen

### 1. Warum ist String-Konkatenation für Datenbank-Queries gefährlich?

**Antwort:** Nutzereingaben können so als Teil der SQL-Syntax interpretiert werden statt als reine Daten, wodurch ein Angreifer beliebige Datenbankoperationen einschleusen kann (SQL-Injection).

### 2. Was ist SSRF und warum ist es besonders gefährlich?

**Antwort:** Server-Side Request Forgery bringt den Server dazu, Anfragen an unbeabsichtigte, oft interne Ziele zu senden — ein Angreifer kann so über den Server auf eigentlich nicht extern erreichbare interne Dienste zugreifen.

### 3. Warum reicht eine einfache IP-Prüfung gegen SSRF nicht immer aus?

**Antwort:** DNS-Rebinding kann eine zunächst harmlos erscheinende Domain zur Anfragezeit auf eine interne IP-Adresse auflösen lassen; die Prüfung muss zur tatsächlichen Verbindungszeit erfolgen, nicht nur einmalig gegen den ursprünglichen Domainnamen.

### 4. Warum ist Deserialisierung mit code-ausführenden Formaten für externe Daten riskant?

**Antwort:** Solche Formate können eingebetteten, beim Deserialisieren automatisch ausgeführten Code enthalten — ein Angreifer kann darüber beliebigen Code auf dem Server ausführen lassen.

### 5. Was gehört zu einer sicheren Datei-Upload-Behandlung?

**Antwort:** Validierung des tatsächlichen Dateityps (nicht nur der Dateiendung), ein Größenlimit und Speicherung in einem Verzeichnis, das nicht direkt ausführbar konfiguriert ist.

### 6. Widersprüchliche Anforderung: Produkt will maximale Flexibilität für Nutzer-URLs (z. B. beliebige Webhook-Ziele) UND vollständigen SSRF-Schutz — wie gehst du vor?

**Antwort:** Ich würde eine Allowlist erlaubter Schemata und eine Blockliste interner/privater IP-Bereiche kombinieren, die zur tatsächlichen Verbindungszeit geprüft wird, statt entweder beliebige URLs ungeprüft zuzulassen oder Flexibilität durch eine zu enge Whitelist unnötig einzuschränken.

## Praktische Labs

~~~python
import ipaddress

blocked_ranges = [ipaddress.ip_network("10.0.0.0/8"), ipaddress.ip_network("169.254.0.0/16")]

def is_safe_target(resolved_ip):
    ip = ipaddress.ip_address(resolved_ip)
    return not any(ip in net for net in blocked_ranges)

assert is_safe_target("8.8.8.8") is True
assert is_safe_target("169.254.169.254") is False  # cloud metadata endpoint, correctly blocked
print("SSRF protection correctly distinguished a safe external target from an internal metadata address.")
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [OWASP Top 10](https://owasp.org/www-project-top-ten/), abgerufen 2026-09-17.
2. OWASP: [Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html), abgerufen 2026-09-17.

Sprach-/Framework-spezifische Deserialisierungs- und SSRF-Schutzbibliothek-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte SAST/DAST-Tools zur Erkennung von Injection-/SSRF-Mustern in CI | Established | Regelabdeckung und Falsch-Positiv-Rate gegen tatsächliches Codebase-Risiko validieren. |

Ein Team akzeptiert eine Backend-Implementierung erst, wenn parametrisierte Queries, SSRF-Schutz und sichere Deserialisierung nachweisbar getestet sind.
