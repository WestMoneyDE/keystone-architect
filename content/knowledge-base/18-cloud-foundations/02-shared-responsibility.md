---
{"id": "KB-0442", "title": "Shared Responsibility", "domain": "18", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0441", "concepts": ["Cloud-Regionen und Availability Zones"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein konkretes Servicemodell (IaaS, PaaS, SaaS) die jeweilige Verantwortungsgrenze zwischen Cloud-Anbieter und Kunde anhand offizieller Dokumentation korrekt benennen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendungsarchitektur explizit dokumentieren, welches Team für welche Konfigurations-, Daten- und Identitätsverantwortung zuständig ist, basierend auf den genutzten Servicemodellen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen Sicherheitsvorfall auf eine Lücke in der Verantwortungszuordnung (z. B. eine Konfiguration, die fälschlich als Anbieterverantwortung angenommen wurde) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Verantwortungsrichtlinien für Cloud-Nutzung im Unternehmen anhand des jeweiligen Servicemodells und eindeutig zugeordneter Teams statt anhand impliziter Annahmen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vertragsrechtlichen Details spezifischer Cloud-Anbieter-SLAs im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis der technischen Verantwortungsgrenze je Servicemodell als Entscheidungsgrundlage, nicht die vertragsrechtlichen Interna."}}, "lab_validation": [{"lab_id": "KB-0442-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Shared-Responsibility-Dokumentation großer Cloud-Anbieter, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie sich die Verantwortungsgrenze zwischen Cloud-Anbieter und Kunde je nach Servicemodell (IaaS, PaaS, SaaS) verschiebt, und warum eine unklare Zuordnung von Konfigurations-, Daten- und Identitätsverantwortung innerhalb eines Kundenunternehmens ein eigenständiges Sicherheitsrisiko darstellt, unabhängig von der formalen Anbieter-Kunden-Grenze.", "limitations": "Kein aktives Cloud-Deployment getestet, keine realen Sicherheitsvorfälle beobachtet."}]}
---
# Shared Responsibility

> **Ziel:** Das Shared-Responsibility-Modell beschreibt, wie die Verantwortung für Sicherheit und Betrieb zwischen Cloud-Anbieter und Kunde aufgeteilt ist — abhängig vom genutzten Servicemodell (IaaS: Infrastructure as a Service, PaaS: Platform as a Service, SaaS: Software as a Service) verschiebt sich diese Grenze systematisch: Bei IaaS trägt der Anbieter Verantwortung für die physische Infrastruktur und Virtualisierung, während der Kunde für Betriebssystem, Anwendung, Daten und Konfiguration verantwortlich bleibt; bei SaaS trägt der Anbieter zusätzlich Verantwortung für Anwendung und Plattform, während der Kunde primär für Daten, Identitäten und Nutzungskonfiguration verantwortlich bleibt. Der zentrale Punkt dieses Kapitels ist, dass diese formale Verantwortungsgrenze zwischen Anbieter und Kunde nicht automatisch bedeutet, dass innerhalb des Kundenunternehmens klar ist, welches konkrete Team für welchen kundenseitigen Verantwortungsbereich (Konfiguration, Daten, Identitäten) tatsächlich zuständig ist — diese interne Zuordnung muss explizit dokumentiert werden, da eine unklare interne Zuordnung selbst dann zu Sicherheitslücken führen kann, wenn das Shared-Responsibility-Modell des Anbieters formal korrekt verstanden wurde.

## Zweck, Mental Model und Dependencies

Bei IaaS (z. B. virtuelle Maschinen) trägt der Cloud-Anbieter Verantwortung für die physische Infrastruktur, die Virtualisierungsschicht und die grundlegende Netzwerkinfrastruktur (siehe Regionen und Availability Zones, [KB-0441](01-cloud-regionen-und-availability-zones.md)), während der Kunde für alles oberhalb dieser Ebene verantwortlich bleibt — Betriebssystem-Patches, Anwendungssicherheit, Netzwerkkonfiguration innerhalb der eigenen Umgebung, Daten und Zugriffskontrolle. Bei PaaS (z. B. eine verwaltete Datenbank oder ein verwaltetes Container-Orchestrierungssystem) übernimmt der Anbieter zusätzlich Verantwortung für die Plattform selbst (z. B. Datenbank-Engine-Patches, zugrunde liegende Betriebssystempflege), während der Kunde weiterhin für die Konfiguration der Plattform, die Daten und die Zugriffskontrolle verantwortlich bleibt. Bei SaaS (z. B. eine fertige Anwendung) übernimmt der Anbieter zusätzlich Verantwortung für die Anwendung selbst, während der Kunde primär für die Konfiguration der Anwendungsnutzung (z. B. Zugriffsrechte, Datenexport-Einstellungen), die eigenen Daten und die Identitäten seiner Nutzer verantwortlich bleibt. Der zentrale methodische Punkt ist, dass diese formale, anbieterseitig definierte Grenze zwischen Anbieter- und Kundenverantwortung eine zweite, oft übersehene Frage nicht beantwortet: welches konkrete Team innerhalb des Kundenunternehmens für den jeweiligen kundenseitigen Verantwortungsbereich tatsächlich zuständig ist — ohne diese explizite, interne Zuordnung kann eine formal korrekt verstandene Anbieter-Kunden-Grenze dennoch zu praktischen Sicherheitslücken führen, wenn z. B. keine der beteiligten internen Teams sich für eine bestimmte Konfigurationseinstellung tatsächlich zuständig fühlt.

~~~text
IaaS: provider = physical infra + virtualization + base network
      customer = OS patches, app security, network config within own env, data, access control
PaaS: provider ADDS platform itself (e.g. DB engine patches, underlying OS maintenance)
      customer = platform CONFIGURATION, data, access control
SaaS: provider ADDS the application itself
      customer = usage configuration (access rights, data export settings), data, user identities
KEY METHODOLOGICAL POINT: the formal provider-customer boundary answers only HALF the question
  the SECOND question: which INTERNAL TEAM is responsible for each customer-side area?
  -> without EXPLICIT internal assignment, a correctly-understood provider boundary
     can STILL produce security gaps if NO internal team actually owns a given setting
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| IaaS-Verantwortungsgrenze | Anbieter: Infrastruktur; Kunde: alles darüber | Betriebssystem- und Anwendungssicherheit liegen vollständig beim Kunden |
| PaaS-Verantwortungsgrenze | Anbieter zusätzlich: Plattform selbst | Konfiguration der Plattform bleibt Kundenverantwortung |
| SaaS-Verantwortungsgrenze | Anbieter zusätzlich: Anwendung selbst | Nutzungskonfiguration, Daten, Identitäten bleiben Kundenverantwortung |
| Interne Teamzuordnung | wer im Kundenunternehmen trägt die kundenseitige Verantwortung | muss explizit dokumentiert werden, unabhängig von der formalen Anbietergrenze |

Implementierung: Für jeden genutzten Cloud-Dienst wird zunächst anhand seines Servicemodells (IaaS, PaaS, SaaS) die formale Verantwortungsgrenze zwischen Anbieter und Kunde anhand offizieller Anbieterdokumentation geprüft. Für jeden kundenseitigen Verantwortungsbereich (Konfiguration, Daten, Identitäten) wird explizit ein konkretes, internes Team als verantwortlich dokumentiert, statt diese Verantwortung implizit unzugeordnet zu lassen. Bei der Einführung eines neuen Cloud-Dienstes wird diese interne Zuordnung als expliziter Schritt vor der produktiven Nutzung durchgeführt, um zu vermeiden, dass eine kundenseitige Verantwortung faktisch von niemandem wahrgenommen wird.

## Scalability, Reliability, Security und Observability

Ein korrekt verstandenes und intern zugeordnetes Shared-Responsibility-Modell skaliert die Sicherheit einer Cloud-Nutzung proportional zur Vollständigkeit der internen Teamzuordnung für jeden kundenseitigen Verantwortungsbereich; die Reliability-Grenze liegt darin, dass ein formal korrekt verstandenes, aber intern nicht zugeordnetes Verantwortungsmodell proportional zur Anzahl ungeklärter Verantwortungsbereiche zu Sicherheitslücken führt, die keinem konkreten Team zuzuschreiben sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Sicherheitsvorfall entsteht durch eine fehlkonfigurierte, kundenseitige Einstellung | kein internes Team hat sich explizit für diesen kundenseitigen Verantwortungsbereich zuständig gefühlt | die interne Teamzuordnung für den betroffenen Verantwortungsbereich prüfen und explizit dokumentieren |
| ein Team geht fälschlich davon aus, der Cloud-Anbieter übernehme eine bestimmte Sicherheitsmaßnahme | die formale Verantwortungsgrenze für das genutzte Servicemodell wurde nicht korrekt geprüft | die offizielle Shared-Responsibility-Dokumentation des Anbieters für das konkrete Servicemodell konsultieren |
| bei einem neuen Cloud-Dienst bleibt unklar, wer für dessen Konfiguration verantwortlich ist | die interne Zuordnung wurde bei der Einführung des Dienstes nicht als expliziter Schritt durchgeführt | einen Prozess einführen, der die interne Verantwortungszuordnung als Voraussetzung für den produktiven Einsatz eines neuen Cloud-Dienstes vorschreibt |

Security: Eine unklare interne Zuordnung kundenseitiger Verantwortungsbereiche ist selbst ein Sicherheitsrisiko, unabhängig davon, ob das formale Shared-Responsibility-Modell des Anbieters korrekt verstanden wurde. Observability: Eine dokumentierte, aktuelle Zuordnung von Verantwortungsbereichen zu internen Teams, sowie regelmäßige Prüfungen, ob diese Zuordnung noch der tatsächlichen Cloud-Nutzung entspricht, sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** dokumentiert für jeden genutzten Cloud-Dienst explizit, welches interne Team für welchen kundenseitigen Verantwortungsbereich zuständig ist. **Principal** macht die formale Anbieter-Kunden-Grenze und die interne Teamzuordnung für das Team nachvollziehbar. **Chief** legt Verantwortungsrichtlinien für Cloud-Nutzung im Unternehmen anhand des jeweiligen Servicemodells und eindeutig zugeordneter Teams fest.

Anti-Patterns: annehmen, der Cloud-Anbieter übernehme eine Sicherheitsmaßnahme, ohne die formale Verantwortungsgrenze für das konkrete Servicemodell zu prüfen; einen kundenseitigen Verantwortungsbereich ohne explizite interne Teamzuordnung belassen; einen neuen Cloud-Dienst produktiv einsetzen, ohne vorab zu klären, welches Team für dessen Konfiguration, Daten und Identitäten verantwortlich ist.

## Production Checklist

- [ ] Die formale Verantwortungsgrenze zwischen Anbieter und Kunde ist für jeden genutzten Servicetyp geprüft.
- [ ] Jeder kundenseitige Verantwortungsbereich (Konfiguration, Daten, Identitäten) ist einem konkreten, internen Team zugeordnet.
- [ ] Die Verantwortungszuordnung wird bei der Einführung neuer Cloud-Dienste vor deren produktivem Einsatz erstellt.
- [ ] Die Verantwortungszuordnung wird regelmäßig gegen die tatsächliche Cloud-Nutzung geprüft.

## Interviewfragen

### 1. Wie verschiebt sich die Verantwortungsgrenze zwischen IaaS, PaaS und SaaS?

**Antwort:** Bei IaaS trägt der Anbieter nur die physische Infrastruktur und Virtualisierung; bei PaaS zusätzlich die Plattform selbst; bei SaaS zusätzlich die Anwendung selbst — der Kunde bleibt jeweils für die Ebenen oberhalb dieser Grenze verantwortlich (Konfiguration, Daten, Identitäten).

### 2. Warum reicht ein formal korrektes Verständnis des Shared-Responsibility-Modells allein nicht aus?

**Antwort:** Weil die formale Anbieter-Kunden-Grenze nicht beantwortet, welches konkrete Team innerhalb des Kundenunternehmens für den jeweiligen kundenseitigen Verantwortungsbereich tatsächlich zuständig ist; ohne diese interne Zuordnung kann eine Sicherheitslücke entstehen, weil kein Team sich verantwortlich fühlt.

### 3. Welche Verantwortungsbereiche bleiben bei SaaS typischerweise beim Kunden?

**Antwort:** Die Konfiguration der Anwendungsnutzung (z. B. Zugriffsrechte), die eigenen Daten und die Identitäten der eigenen Nutzer.

### 4. Wie stellst du sicher, dass ein kundenseitiger Verantwortungsbereich nicht unzugeordnet bleibt?

**Antwort:** Ich dokumentiere für jeden genutzten Cloud-Dienst explizit, welches interne Team für Konfiguration, Daten und Identitäten zuständig ist, als Voraussetzung für dessen produktiven Einsatz.

### 5. Wie gehst du vor, wenn ein Sicherheitsvorfall durch eine fehlkonfigurierte, kundenseitige Einstellung entsteht?

**Antwort:** Ich prüfe, ob für diesen kundenseitigen Verantwortungsbereich überhaupt ein internes Team explizit zuständig war, da eine fehlende interne Zuordnung eine häufige, oft übersehene Ursache für solche Vorfälle ist.

### 6. Widersprüchliche Anforderung: Zwei Teams gehen jeweils davon aus, das andere Team sei für die Konfiguration eines bestimmten Cloud-Dienstes zuständig — wie gehst du vor?

**Antwort:** Ich würde eine explizite, dokumentierte Klärung der Verantwortungszuordnung herbeiführen und diese für zukünftige, ähnliche Fälle in einem verbindlichen Prozess festhalten, statt die Unklarheit implizit fortbestehen zu lassen.

## Praktische Labs

~~~python
# Conceptual responsibility-assignment completeness check (not executed against a real cloud account):

def check_responsibility_assignment(services):
    """services: list of {"name": ..., "model": "IaaS"|"PaaS"|"SaaS", "assigned_team": str or None}"""
    gaps = [s["name"] for s in services if s["assigned_team"] is None]
    return {
        "fully_assigned": len(gaps) == 0,
        "unassigned_services": gaps,
    }

services = [
    {"name": "vm_cluster", "model": "IaaS", "assigned_team": "platform-eng"},
    {"name": "managed_db", "model": "PaaS", "assigned_team": "data-eng"},
    {"name": "saas_crm", "model": "SaaS", "assigned_team": None},  # gap: no team assigned
]

result = check_responsibility_assignment(services)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Shared Responsibility Model](https://aws.amazon.com/compliance/shared-responsibility-model/), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Shared Responsibility in the Cloud](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility), abgerufen 2026-09-18.

Cloud-Regionen und Availability Zones sind kanonisch in [KB-0441](01-cloud-regionen-und-availability-zones.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Compliance- und Konfigurationsprüfwerkzeuge, die kundenseitige Fehlkonfigurationen gegen bekannte Shared-Responsibility-Grenzen automatisch erkennen | Adopting | Gegenüber rein manueller Prüfung bevorzugen, sobald die Abdeckung der Prüfregeln für die eigene Cloud-Nutzung verifiziert ist. |

Ein Team akzeptiert die produktive Nutzung eines neuen Cloud-Dienstes erst, wenn sowohl die formale Anbieter-Kunden-Verantwortungsgrenze geprüft als auch die interne Teamzuordnung für alle kundenseitigen Verantwortungsbereiche explizit dokumentiert ist.
