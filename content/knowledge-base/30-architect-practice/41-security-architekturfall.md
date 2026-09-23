---
{"id": "KB-0717", "title": "Security-Architekturfall", "domain": "30", "sequence": 41, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0713", "concepts": ["Vollständiger, durchgearbeiteter Übungsfall"], "needed_for": "Dieser Fall folgt derselben, vollständigen Fallstruktur wie der in KB-0713 beschriebene Cloud-Architekturfall"}, {"id": "KB-0709", "concepts": ["Technische Führung bei Incidents"], "needed_for": "Dieser Fall nutzt die in KB-0709 beschriebenen Stabilisierungs- und Führungsprinzipien für einen konkreten Sicherheitsvorfall"}], "related": ["KB-0716"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für das gegebene, kompromittierte Identitäts-/Integrationsszenario einen nachvollziehbaren Angriffspfad analysieren und die Architektur mit Zero Trust und Minimalrechten neu gestalten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für den Security-Architekturfall mehrere Kontrollpfad-Optionen mit fairer Trade-off-Darstellung gegeneinander abwägen und die tatsächlich wirksamste Kontrolle begründen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Sicherheitsarchitektur eine kritische Dimension (Recovery, Minimalrechte, Angriffspfadanalyse) unadressiert lässt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine vollständige, unternehmensweite Sicherheitsarchitekturentscheidung nach einem kompromittierten Zugriffspfad treffen und vor Entscheidern begründen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, forensische Analyse eines realen Angriffs im Detail ist Vertiefung und außerhalb des konzeptionellen Fallumfangs.", "rationale": "Kern ist die konzeptionelle Neugestaltung der Architektur nach dem Vorfall, nicht die forensische Detailanalyse eines realen Angriffs."}}, "lab_validation": [{"lab_id": "KB-0717-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur vollständigen Bearbeitung eines Security-Architekturfalls, keine reale Organisation involviert", "evidence": "Ein vollständig durchgearbeitetes Fallbeispiel zeigt, wie ein nachvollziehbarer Angriffspfad über eine kompromittierte Integrationsgrenze zu einer neu gestalteten, Zero-Trust-basierten Architektur mit Minimalrechten und Recovery-Plan führt.", "limitations": "Vollständig fiktives Fallbeispiel; alle Details des Vorfalls sind Beispielannahmen, keine realen Vorfallsdaten."}]}
---
# Security-Architekturfall

> **Ziel:** Dieses Kapitel ist ein vollständiger, durchgearbeiteter Übungsfall, strukturell analog zu KB-0713 bis KB-0716: Ein fiktives Unternehmen hat einen Sicherheitsvorfall erlebt, bei dem eine Integrationsgrenze zwischen zwei internen Systemen tatsächlich kompromittiert wurde. Der Fall analysiert den **Angriffspfad** (wie der Zugriff tatsächlich erfolgte), entwirft die Architektur mit **Zero Trust** und **Minimalrechten** neu und definiert einen **Recovery**-Plan, entsprechend den in Domain 23 (Security/Identity) und KB-0709 (Technische Führung bei Incidents) etablierten Prinzipien.

## Fallbeschreibung und explizite Annahmen

**Hinweis:** Alle folgenden Annahmen sind explizit als Beispielannahmen gekennzeichnet, keine realen Vorfallsdaten.

Das fiktive Unternehmen "Beispiel Finanzdienste GmbH" betreibt eine interne Reporting-Anwendung, die über eine API-Integration auf ein Kundendatensystem zugreift. Angenommener Vorfall: Ein kompromittiertes Service-Account-Credential (angenommen: durch versehentliche Offenlegung in einem internen Repository) ermöglichte tatsächlich unautorisierten Zugriff auf das Kundendatensystem über die Integrationsgrenze, da das Service-Account tatsächlich mehr Berechtigungen hatte, als für die Reporting-Funktion tatsächlich notwendig waren.

## Angriffspfadanalyse

Der nachvollziehbare Angriffspfad wird tatsächlich Schritt für Schritt rekonstruiert: (1) Offenlegung des Service-Account-Credentials, (2) Nutzung des Credentials für einen API-Aufruf außerhalb des tatsächlich vorgesehenen Reporting-Zwecks, (3) Zugriff auf tatsächlich nicht für Reporting benötigte, sensible Kundendatenfelder, da das Service-Account tatsächlich übermäßige Berechtigungen hatte. Diese Rekonstruktion folgt der in KB-0691 (Technical Due Diligence) beschriebenen Fakten-/Annahmen-Trennung — jeder Schritt wird als tatsächlich bestätigter Fakt oder als Annahme gekennzeichnet.

## Zero Trust und Minimalrechte

Die Architektur wird neu gestaltet, sodass das Service-Account tatsächlich nur noch die für die Reporting-Funktion minimal notwendigen, spezifischen Datenfelder lesen kann, statt vollen Lesezugriff auf das gesamte Kundendatensystem zu haben — dies entspricht dem Prinzip minimaler, tatsächlich benötigter Berechtigungen, das durchgängig in diesem Curriculum etabliert wurde. Zusätzlich wird jede Integrationsanfrage tatsächlich explizit gegen den erwarteten Kontext geprüft (Zero Trust: kein Zugriff wird allein aufgrund eines gültigen Credentials automatisch als vertrauenswürdig behandelt, sondern zusätzlich gegen erwartetes Verhalten geprüft).

## Recovery

Der Recovery-Plan definiert tatsächlich konkrete Schritte: sofortiger Widerruf des kompromittierten Credentials (entsprechend dem in KB-0655 beschriebenen Prinzip individueller, widerrufbarer Geräte-/Service-Identität), Ausstellung eines neuen Credentials mit den neu definierten, minimalen Berechtigungen, und eine vollständige Überprüfung, welche Daten während des Vorfallszeitraums tatsächlich abgerufen wurden, um betroffene Kunden tatsächlich informieren zu können.

~~~text
FALL-STRUKTUR (Zusammenfassung):
  ANGRIFFSPFAD: Credential-Offenlegung -> Nutzung außerhalb vorgesehenen Zwecks ->
    Zugriff auf übermäßig berechtigte Datenfelder
  ZERO TRUST + MINIMALRECHTE: Service-Account auf tatsächlich minimal notwendige
    Datenfelder beschränkt, jede Anfrage gegen erwarteten Kontext geprüft
  RECOVERY: sofortiger Credential-Widerruf, Neuausstellung mit minimalen Rechten,
    vollständige Zugriffsüberprüfung für Kundeninformation
Jeder Schritt des Angriffspfads ist EXPLIZIT als bestätigter Fakt oder Annahme
  gekennzeichnet; alle Vorfallsdetails sind Beispielannahmen, keine realen Daten.
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Schrittweise Angriffspfadrekonstruktion | macht Kompromittierung nachvollziehbar | trennt bestätigte Fakten von Annahmen |
| Minimalrechte-Neugestaltung | beschränkt Service-Account auf tatsächlich notwendige Felder | verhindert Wiederholung durch übermäßige Berechtigung |
| Zero-Trust-Kontextprüfung | prüft jede Anfrage zusätzlich zum Credential | verhindert automatisches Vertrauen allein durch gültiges Credential |
| Strukturierter Recovery-Plan | definiert konkrete Widerrufs- und Überprüfungsschritte | ermöglicht tatsächliche Kundeninformation über Betroffenheit |

## Scalability, Reliability, Security und Observability

Der Fall skaliert über die Anzahl der zu prüfenden Integrationsgrenzen im Gesamtsystem; die Reliability-Grenze liegt darin, dass eine unzureichende Minimalrechte-Durchsetzung tatsächlich zu einer Wiederholung eines ähnlichen Vorfalls an anderer Stelle führen könnte.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein ähnlicher Vorfall tritt bei einer anderen Integration erneut auf | die Minimalrechte-Neugestaltung wurde nicht systematisch auf alle vergleichbaren Integrationen angewendet | eine systematische Überprüfung aller Service-Accounts auf übermäßige Berechtigungen durchführen |
| ein widerrufenes Credential ermöglicht weiterhin Zugriff | der Widerrufsprozess war unvollständig oder nicht sofort wirksam | den Widerrufsprozess gemäß KB-0655 verifizieren und die tatsächliche Wirksamkeit testen |
| unklar bleibt, welche Kunden tatsächlich betroffen waren | die vollständige Zugriffsüberprüfung wurde nicht systematisch durchgeführt | eine vollständige, protokollbasierte Überprüfung aller Zugriffe während des Vorfallszeitraums durchführen |

## Trade-offs und Entscheidungen

Dieser Fall demonstriert auf **Staff**-Ebene die korrekte technische Umsetzung der Minimalrechte-Beschränkung für ein einzelnes Service-Account. Auf **Principal**-Ebene demonstriert er die vollständige Angriffspfadanalyse und Zero-Trust-Neugestaltung. Auf **Chief**-Ebene demonstriert er die organisatorische Einbettung des Recovery-Prozesses, einschließlich Kundeninformation.

## Production Checklist

- [ ] Der Angriffspfad ist schrittweise, mit expliziter Fakten-/Annahmen-Kennzeichnung, rekonstruiert.
- [ ] Service-Accounts sind auf tatsächlich minimal notwendige Berechtigungen beschränkt.
- [ ] Jede Integrationsanfrage wird zusätzlich zum Credential gegen den erwarteten Kontext geprüft.
- [ ] Ein strukturierter Recovery-Plan mit Widerruf, Neuausstellung und Zugriffsüberprüfung existiert.

## Interviewfragen

### 1. Warum ist die schrittweise Rekonstruktion des Angriffspfads wichtig?

**Antwort:** Weil sie nachvollziehbar macht, wie die Kompromittierung tatsächlich erfolgte, und dabei explizit zwischen bestätigten Fakten und Annahmen unterscheidet, statt Spekulationen als Gewissheit darzustellen.

### 2. Warum hatte das übermäßig berechtigte Service-Account eine zentrale Rolle im Vorfall?

**Antwort:** Weil es tatsächlich mehr Berechtigungen hatte, als für die Reporting-Funktion notwendig waren, wodurch der Zugriff auf sensible, nicht benötigte Datenfelder überhaupt erst möglich wurde.

### 3. Was bedeutet Zero Trust im Kontext dieser Neugestaltung?

**Antwort:** Dass kein Zugriff allein aufgrund eines gültigen Credentials automatisch als vertrauenswürdig behandelt wird, sondern zusätzlich gegen den erwarteten Kontext geprüft wird.

### 4. Welche Schritte umfasst der Recovery-Plan in diesem Fall?

**Antwort:** Sofortiger Widerruf des kompromittierten Credentials, Neuausstellung mit minimalen Rechten, und eine vollständige Überprüfung der tatsächlich abgerufenen Daten zur Kundeninformation.

### 5. Wie würdest du vorgehen, wenn ein ähnlicher Vorfall bei einer anderen Integration erneut auftritt?

**Antwort:** Ich würde prüfen, ob die Minimalrechte-Neugestaltung systematisch auf alle vergleichbaren Integrationen angewendet wurde, und eine flächendeckende Überprüfung aller Service-Accounts auf übermäßige Berechtigungen durchführen.

### 6. Widersprüchliche Anforderung: Das Entwicklungsteam will minimalen Aufwand bei der Rechtevergabe für neue Integrationen UND die Organisation will striktes Minimalrechte-Prinzip nach diesem Vorfall — wie würdest du diesen Fall lösen?

**Antwort:** Ich würde standardisierte, vordefinierte Berechtigungsprofile für häufige Integrationsmuster (etwa "Reporting-Lesezugriff") bereitstellen, die bereits minimale Rechte kapseln, sodass Entwicklerteams schnell integrieren können, ohne das Minimalrechte-Prinzip individuell neu aushandeln zu müssen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Lab ist Teil des im Kapitel beschriebenen, vollständig fiktiven Übungsfalls, keine reale Projekterfahrung.

~~~python
# Local, deterministic illustration of minimal-permission redesign for this fictional case (fictional lab example, no real system):

def check_access(requested_field, allowed_fields):
    return requested_field in allowed_fields

before_incident_permissions = "full_customer_table_access"
after_redesign_permissions = {"customer_id", "order_count", "region"}  # minimal, reporting-only fields

print(check_access("ssn", after_redesign_permissions))
print(check_access("order_count", after_redesign_permissions))
~~~

Erwartete Beobachtung: Nach der Neugestaltung wird der Zugriff auf ein sensibles, nicht benötigtes Feld (etwa eine Sozialversicherungsnummer) korrekt verweigert, während der Zugriff auf ein tatsächlich benötigtes Reporting-Feld weiterhin funktioniert. Auswertung: Diese Minimalrechte-Beschränkung hätte den ursprünglichen Vorfall strukturell verhindert, da das Service-Account gar nicht erst Zugriff auf die sensiblen Felder gehabt hätte.

## Dependencies, Cross-References und Quellen

1. National Institute of Standards and Technology (NIST): [NIST SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-18.
2. Open Worldwide Application Security Project (OWASP): [OWASP Top 10 — Broken Access Control](https://owasp.org/Top10/), abgerufen 2026-09-18.

Dieses Kapitel folgt der in KB-0713 bis KB-0716 etablierten, vollständigen Fallstruktur und nutzt die in KB-0655 (Device Identity), KB-0691 (Technical Due Diligence) und KB-0709 (Technische Führung bei Incidents) beschriebenen Prinzipien.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Berechtigungsanalyse (Access Reviews) zur frühzeitigen Erkennung übermäßig berechtigter Service-Accounts vor einem tatsächlichen Vorfall | Growing Adoption | Bei künftigen, ähnlichen Fällen evaluieren, jedoch die grundlegende Minimalrechte-Neugestaltung unabhängig vom gewählten Automatisierungswerkzeug zuerst konzeptionell festlegen. |

Ein Team akzeptiert diesen Security-Architekturfall als vollständig bearbeitet, wenn Angriffspfad, Minimalrechte-Neugestaltung und Recovery-Plan nachweislich mit expliziten, klar gekennzeichneten Annahmen kohärent zusammengeführt sind.
