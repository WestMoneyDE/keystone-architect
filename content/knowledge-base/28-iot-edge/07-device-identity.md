---
{"id": "KB-0655", "title": "Device Identity", "domain": "28", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0654", "concepts": ["Sicherheitsgrenzen am Gateway", "Zugangsdaten-Isolation"], "needed_for": "Device Identity ist die Grundlage der in KB-0654 beschriebenen Sicherheitsgrenzen zwischen Gerät und Cloud"}], "related": ["KB-0649", "KB-0654"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Provisionierung, Zertifikate und gerätegebundene Credentials korrekt erklären und für ein gegebenes Gerät eine passende Identitätsstrategie auswählen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine Geräteflotte explizit gestalten, wie Provisionierung, Besitzwechsel und Kompromittierungsfälle gehandhabt werden, ohne die Identität anderer Geräte zu gefährden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine gemeinsame, geteilte Identität für mehrere Geräte genutzt wird, wodurch eine Kompromittierung eines Geräts tatsächlich die gesamte Gruppe betrifft.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Device-Provisionierung und Zertifikatslebenszyklus festlegen, die individuelle Geräteidentität als verbindliche Anforderung vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte Implementierung eines Hardware-Security-Moduls oder TPM-basierten Schlüsselspeichers im Detail ist Vertiefung.", "rationale": "Kern ist die konzeptionelle Identitätsarchitektur, nicht die Hardware-Sicherheitsimplementierung."}}, "lab_validation": [{"lab_id": "KB-0655-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung individueller vs. geteilter Geräteidentität, keine reale PKI-Infrastruktur verwendet", "evidence": "Ein lokales Skript simuliert die Sperrung einer kompromittierten Geräteidentität und zeigt, dass bei individueller Identität nur das betroffene Gerät gesperrt wird, während bei geteilter Identität alle Geräte der Gruppe betroffen wären.", "limitations": "Simulation mit synthetischen, deterministischen Daten, keine reale PKI-Infrastruktur oder reale Zertifikatsverwaltung getestet."}]}
---
# Device Identity

> **Ziel:** Device Identity stellt sicher, dass jedes Gerät in einer IoT-Flotte eine eindeutige, tatsächlich überprüfbare Identität besitzt, aufgebaut auf drei Mechanismen: **Provisionierung** (der Prozess, mit dem ein Gerät erstmals eine eindeutige Identität erhält, üblicherweise bei Herstellung oder Inbetriebnahme), **Zertifikate** (kryptografische Nachweise der Geräteidentität, meist auf Basis einer Public-Key-Infrastruktur) und **gerätegebundene Credentials** (Zugangsdaten, die fest an ein einzelnes physisches Gerät gebunden sind, statt geräteübergreifend geteilt zu werden). Der zentrale Punkt dieses Kapitels ist, dass eine geteilte Identität für mehrere Geräte ein tatsächlich hohes, strukturelles Risiko darstellt: Wird ein Gerät mit geteilter Identität kompromittiert, muss die gesamte Gruppe als kompromittiert behandelt werden, da die eigentliche Quelle innerhalb der Gruppe nicht mehr unterscheidbar ist — bei individueller, gerätegebundener Identität hingegen kann exakt das betroffene Gerät isoliert werden, ohne die übrige Flotte zu beeinträchtigen.

## Zweck, Mental Model und Dependencies

Provisionierung ist der Moment, in dem ein Gerät seine eindeutige, kryptografisch überprüfbare Identität erhält — dies geschieht idealerweise während der Herstellung (Werksprovisionierung, bei der jedes Gerät bereits ab Werk ein individuelles Zertifikat erhält) oder bei der ersten Inbetriebnahme (Feldprovisionierung, bei der das Gerät sich bei der ersten Verbindung selbst registriert) — der gewählte Provisionierungszeitpunkt bestimmt tatsächlich, wie vertrauenswürdig die resultierende Identität ist: Eine Werksprovisionierung unter kontrollierten Bedingungen bietet tatsächlich höhere Vertrauenswürdigkeit als eine Feldprovisionierung, bei der ein Angreifer theoretisch ein eigenes Gerät als legitim registrieren könnte, wenn der Registrierungsprozess nicht zusätzlich abgesichert ist. Zertifikate binden die kryptografische Identität eines Geräts an einen von einer vertrauenswürdigen Stelle signierten öffentlichen Schlüssel, sodass die Cloud die Authentizität eines Geräts tatsächlich überprüfen kann, ohne dem Gerät blind zu vertrauen — die Public-Key-Infrastruktur (PKI) stellt dabei sicher, dass ein Zertifikat zurückverfolgbar auf eine vertrauenswürdige Zertifizierungsstelle zurückgeführt werden kann. Gerätegebundene Credentials bedeuten, dass jedes physische Gerät seine eigene, individuelle Identität besitzt, statt dass mehrere Geräte dieselben Zugangsdaten teilen — dies ist die entscheidende Voraussetzung für granulare Reaktionsfähigkeit bei Kompromittierung: Bei individueller Identität kann genau das kompromittierte Gerät gesperrt werden, während bei geteilter Identität eine Kompromittierung eines einzelnen Geräts tatsächlich zur notwendigen Sperrung der gesamten Gruppe führt, da die eigentliche Quelle nicht mehr unterscheidbar ist. Besitzwechsel (etwa Weiterverkauf oder Umzug eines Geräts zwischen Organisationen) erfordert einen expliziten Prozess zur Übertragung oder zum Widerruf der bestehenden Identität, da ein Gerät mit fortbestehender, alter Identität nach einem tatsächlichen Besitzwechsel weiterhin Zugriff auf Systeme des vorherigen Besitzers haben könnte. Die Trennung von Benutzer- und Service-Identitäten (die Identität einer Person, die ein Gerät konfiguriert, im Unterschied zur Identität des Geräts selbst, das autonom Telemetrie sendet) ist notwendig, da beide unterschiedliche Berechtigungsprofile und Lebenszyklen haben — eine Vermischung führt tatsächlich dazu, dass Geräteberechtigungen und Benutzerberechtigungen nicht mehr unabhängig voneinander verwaltet werden können.

~~~text
Device Identity ensures every device in an IoT fleet has a unique, ACTUALLY verifiable
  identity, built on 3 mechanisms
  PROVISIONING: process by which device first gets unique identity (usually at
  manufacture or commissioning)
  CERTIFICATES: cryptographic proof of device identity, usually PKI-based
  DEVICE-BOUND CREDENTIALS: credentials firmly bound to single physical device, not
  shared across devices
KEY POINT: shared identity across multiple devices = ACTUALLY high, structural risk
  device w/ shared identity compromised -> entire group must be treated as compromised,
  actual source within group no longer distinguishable
  individual, device-bound identity -> exactly the affected device can be isolated w/o
  impacting rest of fleet
PROVISIONING = moment device gets unique, cryptographically verifiable identity
  ideally during manufacture (factory provisioning: every device gets individual cert
  ex-works) or first commissioning (field provisioning: device self-registers on first
  connection)
  chosen provisioning point ACTUALLY determines resulting identity's trustworthiness:
  factory provisioning under controlled conditions offers ACTUALLY higher trust than
  field provisioning, where attacker could theoretically register own device as
  legitimate if registration process not additionally secured
CERTIFICATES bind device's cryptographic identity to a public key signed by trusted
  authority -> cloud can ACTUALLY verify device authenticity w/o blindly trusting device
  PKI ensures a cert can be traced back to a trusted certificate authority
DEVICE-BOUND CREDENTIALS mean every physical device has own, individual identity instead
  of multiple devices sharing same credentials
  decisive precondition for granular response capability on compromise: individual
  identity -> exactly the compromised device can be blocked; shared identity -> a single
  device's compromise ACTUALLY requires blocking entire group, since actual source no
  longer distinguishable
OWNERSHIP TRANSFER (resale, move between orgs) requires explicit process to transfer or
  revoke existing identity -- device w/ persisting old identity after actual ownership
  change could still access previous owner's systems
SEPARATION of user identity (person configuring device) vs service identity (device
  itself autonomously sending telemetry) necessary -- both have different permission
  profiles + lifecycles; mixing them ACTUALLY prevents independently managing device vs
  user permissions
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Provisionierung (Werk vs. Feld) | Zeitpunkt und Art der Identitätsvergabe | bestimmt Vertrauenswürdigkeit der resultierenden Identität |
| Zertifikate/PKI | kryptografischer Nachweis der Geräteidentität | ermöglicht tatsächliche Verifikation ohne blindes Vertrauen |
| Gerätegebundene Credentials | individuelle statt geteilte Identität pro Gerät | ermöglicht granulare Sperrung bei Kompromittierung |
| Besitzwechsel | expliziter Übertrag/Widerruf der Identität | verhindert Fortbestand von Zugriff nach Eigentümerwechsel |
| Benutzer-/Service-Identität-Trennung | getrennte Berechtigungsprofile für Person und Gerät | verhindert Vermischung unabhängiger Berechtigungslebenszyklen |

Implementierung: Geräte erhalten wo möglich eine Werksprovisionierung mit individuellem Zertifikat. Für Kompromittierungsfälle wird ein Prozess zur gezielten Sperrung der individuellen Geräteidentität definiert. Für Besitzwechsel wird ein expliziter Übertrags- oder Widerrufsprozess dokumentiert.

## Scalability, Reliability, Security und Observability

Eine Device-Identity-Architektur skaliert über die Anzahl individuell verwalteter Zertifikate in der Flotte; die Reliability-Grenze liegt darin, dass eine geteilte Identität bei Kompromittierung eines einzelnen Geräts die notwendige Sperrung der gesamten Gruppe erzwingt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| bei Kompromittierung eines Geräts müssen mehrere Geräte gesperrt werden | die betroffenen Geräte teilen sich eine gemeinsame Identität statt individueller Zertifikate | auf individuelle, gerätegebundene Zertifikate pro physischem Gerät umstellen |
| ein Gerät nach Weiterverkauf hat weiterhin Zugriff auf Systeme des vorherigen Besitzers | kein expliziter Widerrufsprozess für Besitzwechsel existiert | einen expliziten Identitätswiderrufsprozess für Besitzwechsel einführen |
| Geräteberechtigungen lassen sich nicht unabhängig von Benutzerberechtigungen verwalten | Benutzer- und Service-Identität wurden vermischt | Benutzer- und Service-Identität mit getrennten Berechtigungsprofilen einführen |

Security: Werksprovisionierung unter kontrollierten Bedingungen bietet tatsächlich höhere Vertrauenswürdigkeit als ungesicherte Feldprovisionierung. Observability: Die tatsächliche Anzahl gemeinsam genutzter versus individueller Geräteidentitäten in der Flotte ist ein zentrales Signal zur Bewertung des Kompromittierungsrisikos.

## Trade-offs und Entscheidungen

**Staff** provisioniert ein einzelnes Gerät korrekt mit individuellem Zertifikat. **Principal** entwirft die vollständige Provisionierungs- und Identitätslebenszyklus-Architektur für eine Geräteflotte. **Chief** legt unternehmensweite Standards fest, die individuelle Geräteidentität und Werksprovisionierung als verbindliche Anforderung vorschreiben.

Anti-Patterns: mehrere Geräte mit einer gemeinsamen, geteilten Identität betreiben; keinen expliziten Prozess für Identitätswiderruf bei Besitzwechsel definieren; Benutzer- und Service-Identität ohne Trennung verwalten.

## Production Checklist

- [ ] Jedes Gerät besitzt eine individuelle, gerätegebundene Identität statt einer geteilten.
- [ ] Provisionierung erfolgt wo möglich werksseitig unter kontrollierten Bedingungen.
- [ ] Ein expliziter Prozess für Identitätswiderruf bei Besitzwechsel ist dokumentiert.
- [ ] Benutzer- und Service-Identität sind mit getrennten Berechtigungsprofilen verwaltet.

## Interviewfragen

### 1. Warum ist eine geteilte Identität für mehrere Geräte ein strukturelles Risiko?

**Antwort:** Weil bei Kompromittierung eines Geräts die gesamte Gruppe als kompromittiert behandelt werden muss, da die eigentliche Quelle innerhalb der Gruppe nicht mehr unterscheidbar ist.

### 2. Was ist der Unterschied zwischen Werks- und Feldprovisionierung?

**Antwort:** Werksprovisionierung vergibt die Identität unter kontrollierten Bedingungen bei der Herstellung, während Feldprovisionierung bei der ersten Inbetriebnahme erfolgt und tatsächlich anfälliger für unautorisierte Registrierung ist, wenn der Prozess nicht zusätzlich abgesichert ist.

### 3. Warum ist ein expliziter Prozess für Besitzwechsel bei Geräteidentität notwendig?

**Antwort:** Weil ein Gerät mit fortbestehender, alter Identität nach einem tatsächlichen Besitzwechsel weiterhin Zugriff auf Systeme des vorherigen Besitzers haben könnte.

### 4. Warum sollten Benutzer- und Service-Identität getrennt verwaltet werden?

**Antwort:** Weil beide unterschiedliche Berechtigungsprofile und Lebenszyklen haben; eine Vermischung verhindert, dass Geräte- und Benutzerberechtigungen unabhängig voneinander verwaltet werden können.

### 5. Wie gehst du vor, wenn bei Kompromittierung eines Geräts mehrere Geräte gesperrt werden müssen?

**Antwort:** Ich prüfe, ob die betroffenen Geräte eine gemeinsame Identität teilen, und stelle auf individuelle, gerätegebundene Zertifikate pro physischem Gerät um.

### 6. Widersprüchliche Anforderung: Das Produktteam will minimalen Provisionierungsaufwand bei der Massenfertigung UND die Organisation will individuelle, gerätegebundene Identität für jedes Gerät — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte Werksprovisionierung mit individuellem Zertifikat pro Gerät als Teil des bestehenden Fertigungsprozesses integrieren, statt entweder geteilte Identitäten zu akzeptieren oder manuelle, aufwändige Einzelprovisionierung nach der Fertigung durchzuführen.

## Praktische Labs

~~~python
# Local, deterministic comparison of individual vs. shared device identity on compromise (executed locally, no real PKI):

def revoke(compromised_device, device_identities):
    identity = device_identities[compromised_device]
    return [d for d, i in device_identities.items() if i == identity]

individual = {"dev1": "cert-a", "dev2": "cert-b", "dev3": "cert-c"}
shared = {"dev1": "cert-shared", "dev2": "cert-shared", "dev3": "cert-c"}

print(revoke("dev1", individual))
print(revoke("dev1", shared))
~~~

## Dependencies, Cross-References und Quellen

1. National Institute of Standards and Technology (NIST): [NISTIR 8259 — Foundational Cybersecurity Activities for IoT Device Manufacturers](https://csrc.nist.gov/pubs/ir/8259/final), abgerufen 2026-09-18.
2. Internet Engineering Task Force (IETF): [RFC 5280 — Internet X.509 Public Key Infrastructure Certificate and CRL Profile](https://www.rfc-editor.org/rfc/rfc5280), abgerufen 2026-09-18.

Dieses Kapitel bildet die Grundlage der in KB-0654 (Edge Gateways) beschriebenen Sicherheitsgrenzen zwischen Gerät und Cloud.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Hardware-Root-of-Trust-basierte, automatisierte Geräteattestierung (Remote Attestation) für kontinuierliche Identitätsverifikation über den Gerätelebenszyklus | Emerging | Bei sicherheitskritischen Neuvorhaben evaluieren, jedoch bis zur breiteren Verfügbarkeit weiterhin auf etablierte, zertifikatsbasierte Provisionierung mit periodischer Erneuerung setzen. |

Ein Team akzeptiert eine Device-Identity-Architektur erst, wenn individuelle Geräteidentität, Provisionierungsprozess und Widerrufsfähigkeit bei Besitzwechsel nachweislich implementiert sind.
