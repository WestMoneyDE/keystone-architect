---
{"id": "KB-0458", "title": "Cloud-Disaster-Recovery-Architekturen", "domain": "18", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0457", "concepts": ["Hochverfügbarkeit in der Cloud"], "needed_for": "understanding"}, {"id": "KB-0456", "concepts": ["Multi-Region-Cloudmuster"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Backup-and-Restore, Pilot Light und Warm Standby anhand ihrer jeweiligen RTO/RPO-Charakteristik unterscheiden können und für ein konkretes Szenario das passende Muster begründen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung ein Disaster-Recovery-Muster begründet wählen, basierend auf den tatsächlichen RTO/RPO-Anforderungen und einer vollständig nachvollzogenen Wiederanlaufabhängigkeitskette.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet lange tatsächliche Wiederherstellungszeit auf eine ungetestete oder unvollständig dokumentierte Wiederanlaufabhängigkeit zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Disaster-Recovery-Richtlinien im Unternehmen anhand tatsächlich getesteter RTO/RPO-Werte statt anhand theoretisch angenommener Zielwerte festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer, anbieternativer Disaster-Recovery-Automatisierungsdienste im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der DR-Muster und ihrer RTO/RPO-Trade-offs als Entscheidungsgrundlage, nicht die anbieterspezifische Automatisierungs-Interna."}}, "lab_validation": [{"lab_id": "KB-0458-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Disaster-Recovery-Musterdokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie sich Backup-and-Restore (langsamste, kostengünstigste Wiederherstellung aus Backups), Pilot Light (minimale, ständig replizierte Kernkomponenten, die im Ernstfall hochskaliert werden) und Warm Standby (reduzierte, aber aktive Kapazität in der DR-Umgebung) in RTO (Recovery Time Objective) und RPO (Recovery Point Objective) unterscheiden, und warum die tatsächliche, getestete Wiederherstellungszeit von der theoretisch angenommenen abweichen kann, wenn nicht alle Wiederanlaufabhängigkeiten vollständig berücksichtigt wurden.", "limitations": "Kein aktives Cloud-Deployment getestet, keine realen Wiederherstellungszeiten gemessen."}]}
---
# Cloud-Disaster-Recovery-Architekturen

> **Ziel:** Cloud-Disaster-Recovery-Muster unterscheiden sich in ihrer Position zwischen minimalen Kosten und minimaler Wiederherstellungszeit — Backup-and-Restore (Daten werden regelmäßig gesichert, im Katastrophenfall wird die gesamte Umgebung aus dem Backup neu aufgebaut, was die längste Wiederherstellungszeit, aber die geringsten laufenden Kosten bedeutet), Pilot Light (minimale Kernkomponenten, z. B. eine Datenbank, werden ständig in der DR-Region repliziert, während die übrige Infrastruktur erst im Ernstfall hochskaliert wird), und Warm Standby (eine reduzierte, aber bereits aktive Version der gesamten Anwendung läuft ständig in der DR-Region und wird im Ernstfall hochskaliert). Der zentrale Punkt dieses Kapitels ist, dass die Wahl eines Musters anhand der tatsächlichen RTO- (Recovery Time Objective, wie schnell muss die Anwendung wiederhergestellt sein) und RPO-Anforderungen (Recovery Point Objective, wie viel Datenverlust ist maximal akzeptabel) getroffen werden muss, und dass die tatsächliche, im Ernstfall erreichbare Wiederherstellungszeit nur durch echte Tests verifiziert werden kann — eine theoretisch angenommene RTO, die nicht alle tatsächlichen Wiederanlaufabhängigkeiten (z. B. DNS-Umschaltzeit, Zertifikatsbereitstellung, Datenmigrationszeit) berücksichtigt, weicht in der Praxis häufig erheblich von der tatsächlich erreichbaren Zeit ab.

## Zweck, Mental Model und Dependencies

Backup-and-Restore bietet die geringsten laufenden Kosten, da in der DR-Region im Normalbetrieb keine aktive Infrastruktur vorgehalten wird — im Katastrophenfall muss die gesamte Umgebung aus Backups neu erstellt werden, was typischerweise Stunden bis Tage dauert (abhängig von der Datenmenge und der Komplexität der Umgebung) und daher nur für Anwendungen mit entsprechend hoher RTO-Toleranz geeignet ist. Pilot Light reduziert die Wiederherstellungszeit, indem die kritischsten, am schwierigsten schnell wiederherzustellenden Komponenten (typischerweise Datenbanken, deren Wiederherstellung aus einem Backup am längsten dauert) ständig in der DR-Region repliziert werden, während die übrige, leichter und schneller neu bereitstellbare Infrastruktur (z. B. zustandslose Anwendungsserver) erst im Ernstfall hochskaliert wird — dies bietet eine mittlere RTO bei moderaten laufenden Kosten. Warm Standby geht einen Schritt weiter, indem eine reduzierte, aber vollständig funktionsfähige Version der gesamten Anwendung ständig in der DR-Region läuft, was die Wiederherstellungszeit weiter reduziert (im Wesentlichen nur noch eine Hochskalierung der bereits laufenden, reduzierten Kapazität statt eines vollständigen Neuaufbaus), jedoch entsprechend höhere laufende Kosten verursacht. Der zentrale methodische Punkt ist, dass die theoretisch angenommene RTO eines gewählten Musters von zahlreichen Details abhängt, die bei einer rein konzeptionellen Planung leicht übersehen werden — die Zeit für die DNS-Umschaltung zur DR-Region (abhängig von TTL-Werten, siehe hybrides DNS, [KB-0455](15-hybrides-dns.md)), die Zeit für die Bereitstellung oder Übertragung von TLS-Zertifikaten, die tatsächliche Zeit für die Datenmigration oder -synchronisation bis zu einem konsistenten Zustand, und die Zeit für das Hochskalieren zuvor inaktiver oder reduzierter Ressourcen — all dies muss durch tatsächliche, regelmäßige Disaster-Recovery-Tests verifiziert werden, statt sich auf eine theoretisch berechnete RTO zu verlassen.

~~~text
Backup-and-restore: LOWEST ongoing cost (no active DR infra), HIGHEST RTO
  disaster -> rebuild ENTIRE environment from backups (hours-days depending on data/complexity)
Pilot light: MOST CRITICAL, hardest-to-quickly-restore components (databases) continuously replicated
  rest of infra (stateless app servers) scaled up only when disaster strikes
  -> MODERATE RTO, MODERATE ongoing cost
Warm standby: REDUCED but FULLY FUNCTIONAL version of WHOLE app runs continuously in DR region
  disaster -> just SCALE UP already-running reduced capacity (not a full rebuild)
  -> LOWEST RTO of the three, HIGHEST ongoing cost
KEY METHODOLOGICAL POINT: theoretical RTO overlooks MANY details in purely conceptual planning
  DNS switchover time (TTL-dependent, see KB-0455), TLS cert provisioning/transfer time,
  actual data migration/sync time to a consistent state, scale-up time for previously inactive/reduced resources
  -> MUST be verified through ACTUAL, regular DR tests, never trusted as a theoretical calculation alone
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Backup-and-Restore | geringste Kosten, längste Wiederherstellungszeit | nur für Anwendungen mit hoher RTO-Toleranz geeignet |
| Pilot Light | ständige Replikation kritischer Komponenten, Rest wird hochskaliert | mittlere RTO/Kosten, geeignet bei moderater RTO-Anforderung |
| Warm Standby | reduzierte, aber aktive Gesamtinfrastruktur ständig verfügbar | niedrigste RTO der drei Muster, höchste laufende Kosten |
| Tatsächliche Wiederanlaufabhängigkeiten | DNS-Umschaltung, Zertifikate, Datenmigration, Hochskalierung | müssen durch echte Tests verifiziert werden, nicht theoretisch angenommen |

Implementierung: Vor der Wahl eines Disaster-Recovery-Musters werden die tatsächlichen RTO- und RPO-Anforderungen der Anwendung explizit dokumentiert und mit dem Geschäftsbereich abgestimmt, statt pauschale Zielwerte anzunehmen. Regelmäßige, echte Disaster-Recovery-Tests werden durchgeführt, die die gesamte Wiederanlaufkette (DNS-Umschaltung, Zertifikatsbereitstellung, Datenmigration, Hochskalierung) End-to-End durchlaufen, um die tatsächlich erreichbare RTO gegen die theoretisch angenommene zu verifizieren. Das gewählte Muster wird anhand der tatsächlich gemessenen, nicht der theoretisch berechneten RTO/RPO-Werte gegen die Geschäftsanforderungen geprüft, und bei Abweichungen wird entweder das Muster angepasst oder die Wiederanlaufkette optimiert.

## Scalability, Reliability, Security und Observability

Cloud-Disaster-Recovery-Architekturen skalieren die tatsächliche Wiederherstellungsfähigkeit proportional zur Vollständigkeit der getesteten, verifizierten Wiederanlaufkette; die Reliability-Grenze liegt darin, dass eine nur theoretisch angenommene, nicht durch echte Tests verifizierte RTO proportional zur Anzahl übersehener Wiederanlaufabhängigkeiten (DNS, Zertifikate, Datenmigration) im tatsächlichen Katastrophenfall zu einer erheblich längeren, tatsächlichen Wiederherstellungszeit führt als geplant.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein echter Disaster-Recovery-Test zeigt eine deutlich längere Wiederherstellungszeit als theoretisch angenommen | eine oder mehrere Wiederanlaufabhängigkeiten (DNS-TTL, Zertifikate, Datenmigration) wurden bei der theoretischen RTO-Berechnung nicht berücksichtigt | die einzelnen Phasen des Wiederanlaufs im Test separat messen, um die tatsächliche Engpassphase zu identifizieren |
| die DNS-Umschaltung zur DR-Region dauert länger als erwartet | die konfigurierten DNS-TTL-Werte sind zu hoch, wodurch alte, zwischengespeicherte Einträge länger als nötig gültig bleiben | die TTL-Werte für kritische DNS-Einträge reduzieren und die Umschaltzeit erneut testen |
| die Wiederherstellung aus einem Backup dauert deutlich länger als für die RTO-Anforderung akzeptabel | Backup-and-Restore ist für die tatsächliche RTO-Anforderung dieser Anwendung ungeeignet | ein Muster mit kürzerer Wiederherstellungszeit (Pilot Light oder Warm Standby) evaluieren |

Security: Die DR-Umgebung sollte mit derselben Sorgfalt wie die primäre Umgebung abgesichert werden, da eine im Normalbetrieb weniger überwachte DR-Umgebung ein potenzielles, übersehenes Sicherheitsrisiko darstellen kann. Observability: Die tatsächlich gemessene RTO und RPO aus echten Disaster-Recovery-Tests, die Häufigkeit dieser Tests, und die Zeit für jede einzelne Phase der Wiederanlaufkette sind zentrale Metriken zur Bewertung der Disaster-Recovery-Architektur.

## Trade-offs und Entscheidungen

**Staff** führt regelmäßige, echte Disaster-Recovery-Tests durch, um die tatsächliche RTO gegen die theoretisch angenommene zu verifizieren. **Principal** macht das gewählte DR-Muster und dessen tatsächlich gemessene Wiederherstellungszeit für das Team nachvollziehbar. **Chief** legt Disaster-Recovery-Richtlinien im Unternehmen anhand tatsächlich getesteter RTO/RPO-Werte fest.

Anti-Patterns: eine RTO ausschließlich theoretisch berechnen, ohne sie durch echte Disaster-Recovery-Tests zu verifizieren; ein Disaster-Recovery-Muster ohne explizite Abstimmung der tatsächlichen RTO/RPO-Anforderungen mit dem Geschäftsbereich wählen; die DR-Umgebung weniger sorgfältig absichern als die primäre Umgebung.

## Production Checklist

- [ ] Die tatsächlichen RTO- und RPO-Anforderungen sind mit dem Geschäftsbereich explizit abgestimmt und dokumentiert.
- [ ] Das gewählte Disaster-Recovery-Muster entspricht diesen dokumentierten Anforderungen.
- [ ] Regelmäßige, echte Disaster-Recovery-Tests verifizieren die tatsächlich erreichbare RTO gegen die theoretisch angenommene.
- [ ] Die DR-Umgebung wird mit derselben Sorgfalt wie die primäre Umgebung abgesichert und überwacht.

## Interviewfragen

### 1. Was unterscheidet Backup-and-Restore, Pilot Light und Warm Standby in ihrer RTO/Kosten-Charakteristik?

**Antwort:** Backup-and-Restore hat die geringsten Kosten und längste RTO; Pilot Light repliziert nur kritische Komponenten ständig für eine mittlere RTO/Kosten-Balance; Warm Standby hält eine reduzierte, aber aktive Gesamtinfrastruktur ständig verfügbar für die niedrigste RTO bei höchsten Kosten.

### 2. Warum reicht eine theoretisch berechnete RTO allein nicht aus?

**Antwort:** Weil sie zahlreiche praktische Wiederanlaufabhängigkeiten übersehen kann (DNS-Umschaltzeit, Zertifikatsbereitstellung, tatsächliche Datenmigrationszeit, Hochskalierungszeit), die nur durch echte, End-to-End-Tests verifiziert werden können.

### 3. Wie beeinflusst der DNS-TTL-Wert die tatsächliche Recovery-Zeit?

**Antwort:** Ein zu hoher TTL-Wert führt dazu, dass alte, zwischengespeicherte DNS-Einträge länger gültig bleiben, was die tatsächliche Umschaltzeit zur DR-Region über die theoretisch angenommene Zeit hinaus verlängert.

### 4. Wovon hängt die Wahl eines Disaster-Recovery-Musters ab?

**Antwort:** Von den tatsächlichen RTO- und RPO-Anforderungen der Anwendung, abgestimmt mit dem Geschäftsbereich, gegen die Kosten des jeweiligen Musters.

### 5. Wie gehst du vor, wenn ein echter Disaster-Recovery-Test eine deutlich längere Wiederherstellungszeit als theoretisch angenommen zeigt?

**Antwort:** Ich messe die einzelnen Phasen des Wiederanlaufs separat (DNS, Zertifikate, Datenmigration, Hochskalierung), um die tatsächliche Engpassphase zu identifizieren, die bei der theoretischen Berechnung übersehen wurde.

### 6. Widersprüchliche Anforderung: Geschäftsbereich fordert eine sehr niedrige RTO UND minimale laufende DR-Kosten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine sehr niedrige RTO typischerweise ein Warm-Standby-Muster mit entsprechend höheren laufenden Kosten erfordert, und mit dem Geschäftsbereich klären, ob eine etwas höhere, aber realistisch getestete RTO mit einem kostengünstigeren Pilot-Light-Muster akzeptabel ist, statt beide Ziele unreflektiert gleichzeitig zu versprechen.

## Praktische Labs

~~~python
# Conceptual DR pattern selection based on RTO/RPO requirements (not executed against a real cloud account):

def recommend_dr_pattern(rto_hours, budget_sensitivity):
    if rto_hours < 1:
        return "warm_standby"
    if rto_hours < 8:
        return "pilot_light"
    return "backup_and_restore"

applications = {
    "critical_payment_system": {"rto_hours": 0.5, "budget_sensitivity": "low"},
    "internal_reporting_dashboard": {"rto_hours": 24, "budget_sensitivity": "high"},
    "customer_order_system": {"rto_hours": 4, "budget_sensitivity": "medium"},
}

for name, attrs in applications.items():
    recommendation = recommend_dr_pattern(attrs["rto_hours"], attrs["budget_sensitivity"])
    print(f"{name}: RTO requirement = {attrs['rto_hours']}h -> recommended pattern = {recommendation}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Disaster Recovery of Workloads on AWS — Recovery in the Cloud](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [DR Planning Guide — RTO and RPO](https://cloud.google.com/architecture/dr-scenarios-planning-guide), abgerufen 2026-09-18.

Hochverfügbarkeit in der Cloud ist kanonisch in [KB-0457](17-hochverfuegbarkeit-in-der-cloud.md) behandelt; Multi-Region-Cloudmuster in [KB-0456](16-multi-region-cloudmuster.md), hybrides DNS in [KB-0455](15-hybrides-dns.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, regelmäßig geplante Disaster-Recovery-Testwerkzeuge, die die gesamte Wiederanlaufkette ohne manuellen Aufwand durchlaufen | Adopting | Gegenüber seltenen, manuell durchgeführten DR-Tests bevorzugen, sobald die Testabdeckung für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert eine Disaster-Recovery-Architektur erst, wenn die tatsächliche RTO durch mindestens einen echten, End-to-End-Test verifiziert wurde und den dokumentierten Geschäftsanforderungen entspricht.
