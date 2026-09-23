---
{"id": "KB-0169", "title": "API-Versionierung und Deprecation", "domain": "07", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0141", "concepts": ["Schema Evolution"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Sunset-Header-Antwort implementieren und aktive Nutzung einer veralteten API-Version anhand simulierter Zugriffslogs identifizieren.", "rationale": "Kein reales API-Gateway nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Versionierungsstrategie (URL/Header) und Sunset-Kommunikation für eine öffentliche API entwerfen, die aktive Altclients vor Abschaltung identifiziert.", "rationale": "Eine Abschaltung ohne Kenntnis aktiver Nutzer riskiert unerwartete Kundenausfälle."}, "STAFF-TARGET": {"active": true, "scope": "Vertragliche Abschaltzusagen von technischen Managed-Service-EOL-Terminen unterscheiden.", "rationale": "Beide Fristen haben unterschiedliche Konsequenzen und Verhandlungsspielräume."}, "CHIEF-TARGET": {"active": true, "scope": "Einen formalen Deprecation-Prozess mit Mindestvorlaufzeit und aktiver Nutzer-Identifikation als Standard für öffentliche APIs festlegen.", "rationale": "Unangekündigte Abschaltungen beschädigen Kundenvertrauen und erzeugen Vertragsrisiken."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte Migrationswerkzeuge zwischen API-Versionen im Detail sind Vertiefung.", "rationale": "Kern ist Versionierungsstrategie, Sunset-Kommunikation und aktive Nutzeridentifikation."}}, "lab_validation": [{"lab_id": "KB-0169-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Zugriffslog-Analyse auf aktive Altversion-Nutzer", "evidence": "Simulierte Zugriffslogs zeigen drei Clients, die noch API-Version v1 nach Ankündigung der Abschaltung nutzen; diese werden korrekt für gezielte Kontaktaufnahme identifiziert.", "limitations": "Kein reales API-Gateway, keine Produktion."}]}
---
# API-Versionierung und Deprecation

> **Ziel:** Eine API-Version abzukündigen erfordert mehr als eine Ankündigung — sie braucht eine Strategie (URL- oder Header-basierte Versionierung), klare Sunset-Kommunikation und aktive Identifikation, welche Clients die alte Version noch tatsächlich nutzen, bevor sie abgeschaltet wird. Diese Datei wendet Schema-Evolution-Prinzipien ([KB-0141](../06-software-architecture/13-schema-evolution-und-kompatibilitaet.md)) auf die vertragliche und organisatorische Ebene der API-Lebenszyklusverwaltung an.

## Zweck, Mental Model und Dependencies

URL-basierte Versionierung (`/v1/orders`, `/v2/orders`) macht Versionen explizit und cachefreundlich, erfordert aber Routing-Logik für mehrere parallele Versionen. Header-basierte Versionierung (`Accept: application/vnd.api+json;version=2`) hält URLs stabil, ist aber für Clients weniger offensichtlich. Unabhängig von der gewählten Strategie ist der kritische organisatorische Schritt: bevor eine alte Version abgeschaltet wird, muss aktiv geprüft werden, welche Clients sie noch nutzen — eine Abschaltung ohne diese Prüfung riskiert, aktive, zahlende Kunden unerwartet auszusperren. Eine vertragliche Abschaltzusage (im Kundenvertrag vereinbarte Frist) unterscheidet sich von einem technischen Managed-Service-EOL (Ende der Herstellerunterstützung einer zugrunde liegenden Abhängigkeit) — beide erfordern unterschiedliche Kommunikation und Verhandlungsspielräume. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0141](../06-software-architecture/13-schema-evolution-und-kompatibilitaet.md).

~~~text
Response header on deprecated version: Sunset: Sat, 01 Aug 2026 00:00:00 GMT
Deprecation: true
-- Access logs monitored for continued v1 usage after announcement, before actual shutdown
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Versionierungsstrategie | URL oder Header, konsistent über alle Endpunkte? | gemischte, inkonsistente Strategie verwirrt Clients |
| Sunset-Kommunikation | Header/Dokumentation mit konkretem Abschaltdatum? | Clients erfahren erst bei tatsächlicher Abschaltung davon |
| Aktive Nutzer-Identifikation | werden Zugriffslogs auf verbleibende Altversion-Nutzung geprüft? | Abschaltung überrascht noch aktive, unbekannte Nutzer |
| Vertraglich vs. technisch | ist die Abschaltfrist vertraglich zugesichert oder nur technisch geplant? | vertragliche Zusage wird versehentlich technisch unterschritten |

Implementierung: eine Versionierungsstrategie wird konsistent über die gesamte API angewendet, nicht gemischt. Vor Ankündigung einer Abschaltung wird ein konkretes Datum festgelegt und über Standard-Header (`Sunset`, `Deprecation`) sowie Dokumentation kommuniziert, mit ausreichender Vorlaufzeit. Zugriffslogs werden aktiv auf fortgesetzte Nutzung der veralteten Version überwacht; identifizierte aktive Nutzer werden gezielt kontaktiert, nicht nur über eine allgemeine Ankündigung informiert. Vertragliche Abschaltzusagen werden von rein technischen Planungsterminen unterschieden und mit entsprechend höherer Verbindlichkeit behandelt.

## Scalability, Reliability, Security und Observability

Eine klare Versionierungsstrategie skaliert API-Evolution über lange Zeiträume mit vielen externen Konsumenten. Reliability-Grenze: eine Abschaltung ohne aktive Nutzer-Identifikation kann unerwartet Kunden treffen, die die Ankündigung übersehen haben — das ist ein vermeidbares, aber häufiges Versäumnis bei API-Lebenszyklusverwaltung.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Kunde beschwert sich über unerwarteten Ausfall nach Versionsabschaltung | fehlende gezielte Kontaktaufnahme trotz erkennbarer aktiver Nutzung | Zugriffslogs vor Abschaltung auf diesen Kunden prüfen |
| Clients migrieren nicht trotz Sunset-Ankündigung | unzureichende Kommunikation (nur Header, keine aktive Ansprache) | Kommunikationskanäle gegen tatsächliche Erreichbarkeit der Kunden prüfen |
| vertragliche Frist wird technisch unterschritten | fehlende Unterscheidung zwischen vertraglicher Zusage und technischer Planung | Abschaltdatum gegen Vertragsbedingungen des betroffenen Kunden prüfen |
| gemischte Versionierungsstrategie verwirrt neue Integratoren | inkonsistente Anwendung von URL- und Header-Versionierung | Versionierungsansatz über alle API-Bereiche auf Konsistenz prüfen |

Security: eine abgeschaltete, aber technisch noch erreichbare alte API-Version kann zu einem vergessenen, ungepatchten Angriffsvektor werden — tatsächliche technische Abschaltung (nicht nur Dokumentations-Deprecation) muss nachverfolgt werden. Observability: kontinuierliches Monitoring der Versionsverteilung im Traffic zeigt Migrationsfortschritt und verbleibendes Risiko vor einer geplanten Abschaltung.

## Trade-offs und Entscheidungen

**Staff** überwacht Zugriffslogs aktiv auf verbleibende Nutzung veralteter Versionen vor jeder geplanten Abschaltung. **Principal** definiert eine konsistente Versionierungsstrategie und Standard-Sunset-Kommunikation. **Chief** verlangt einen formalen Deprecation-Prozess mit Mindestvorlaufzeit und verbindlicher Unterscheidung zwischen vertraglichen und technischen Fristen.

Anti-Patterns: eine API-Version ohne vorherige Prüfung aktiver Nutzer abschalten; Versionierungsstrategie über verschiedene Endpunkte inkonsistent anwenden; vertragliche Abschaltzusagen wie unverbindliche technische Planungstermine behandeln.

## Production Checklist

- [ ] Versionierungsstrategie konsistent über die gesamte API angewendet.
- [ ] Sunset-Header und Dokumentation mit konkretem Abschaltdatum vor Ankündigung definiert.
- [ ] Zugriffslogs werden aktiv auf verbleibende Nutzung veralteter Versionen überwacht.
- [ ] Vertragliche Abschaltzusagen sind von technischen Planungsterminen klar unterschieden.

## Interviewfragen

### 1. Was ist der Unterschied zwischen URL- und Header-basierter API-Versionierung?

**Antwort:** URL-basierte Versionierung macht die Version explizit im Pfad sichtbar und ist cachefreundlich; Header-basierte Versionierung hält URLs stabil, ist aber für Clients weniger offensichtlich und erfordert bewusstes Header-Handling.

### 2. Warum reicht eine allgemeine Sunset-Ankündigung nicht als vollständiger Deprecation-Prozess?

**Antwort:** Weil nicht alle betroffenen Kunden die Ankündigung notwendigerweise wahrnehmen; aktive Nutzer der veralteten Version sollten anhand von Zugriffslogs identifiziert und gezielt kontaktiert werden.

### 3. Was ist der Unterschied zwischen einer vertraglichen Abschaltzusage und einem technischen Managed-Service-EOL?

**Antwort:** Eine vertragliche Zusage ist eine verbindliche, mit dem Kunden vereinbarte Frist mit rechtlichen Konsequenzen bei Unterschreitung; ein technisches EOL ist ein Planungstermin für das Ende der Herstellerunterstützung einer Abhängigkeit, der intern flexibler gehandhabt werden kann.

### 4. Warum ist eine „abgeschaltete" API-Version, die technisch noch erreichbar ist, ein Sicherheitsrisiko?

**Antwort:** Sie wird oft nicht mehr aktiv gepatcht oder überwacht, bleibt aber ein potenzieller, vergessener Angriffsvektor, wenn die tatsächliche technische Abschaltung nicht nachverfolgt wird.

### 5. Wie identifizierst du aktive Nutzer einer veralteten API-Version?

**Antwort:** Durch Analyse der Zugriffslogs auf Traffic an den entsprechenden Endpunkten/Versionen nach der Sunset-Ankündigung, um gezielt betroffene Kunden zu kontaktieren statt sich auf passive Kommunikation zu verlassen.

### 6. Widersprüchliche Anforderung: Produkt will schnelle Abschaltung einer alten, teuren API-Version UND null Kundenverlust durch die Migration — wie gehst du vor?

**Antwort:** Ich würde eine ausreichende Vorlaufzeit mit aktiver, gezielter Kontaktaufnahme identifizierter Nutzer kombinieren, statt beide Ziele gegeneinander auszuspielen; „schnell" und „ohne Kundenverlust" sind vereinbar, wenn die Kommunikation proaktiv statt passiv erfolgt und der Migrationsfortschritt aktiv überwacht wird.

## Praktische Labs

~~~python
access_logs = [
    {"client": "clientA", "version": "v1", "timestamp": "2026-09-10"},
    {"client": "clientB", "version": "v2", "timestamp": "2026-09-15"},
    {"client": "clientC", "version": "v1", "timestamp": "2026-09-16"},  # still on deprecated version
]

sunset_announced = "2026-09-01"

def find_active_legacy_users(logs, deprecated_version, since):
    return {log["client"] for log in logs if log["version"] == deprecated_version and log["timestamp"] > since}

still_using_v1 = find_active_legacy_users(access_logs, "v1", sunset_announced)
assert "clientA" in still_using_v1 and "clientC" in still_using_v1
print(f"Identified clients still using the deprecated version for targeted outreach: {still_using_v1}")
~~~

## Dependencies, Cross-References und Quellen

1. IETF: [RFC 8594: The Sunset HTTP Header Field](https://datatracker.ietf.org/doc/html/rfc8594), abgerufen 2026-09-17.

Anbieterspezifische Deprecation-Prozessdetails vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Client-Migrationswerkzeuge zwischen API-Versionen | Adopting | Abdeckung gegen tatsächliche Breaking Changes zwischen Versionen prüfen. |

Ein Team akzeptiert eine API-Versionsabschaltung erst, wenn aktive Nutzer identifiziert, gezielt kontaktiert und die Frist (vertraglich oder technisch) korrekt eingeordnet ist.
