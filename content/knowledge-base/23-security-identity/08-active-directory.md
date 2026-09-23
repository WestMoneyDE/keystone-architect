---
{"id": "KB-0544", "title": "Active Directory", "domain": "23", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0538", "concepts": ["IAM und Identitätslebenszyklen"], "needed_for": "understanding"}, {"id": "KB-0482", "concepts": ["Entra-Tenant-Design für Azure"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Active-Directory-Domains, Forests, Kerberos-Authentifizierung und Gruppenrichtlinien anhand offizieller Dokumentation korrekt einordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit administrative Grenzen und Vertrauensbeziehungen zwischen Domains/Forests modellieren, insbesondere für hybride Unternehmensidentitäten mit Cloud-Anbindung.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, zu breite administrative Kontrolle auf eine falsch modellierte Vertrauensbeziehung zwischen Domains statt eine fehlerhafte Einzelberechtigung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Active-Directory-Domain-/Forest-Struktur und hybride Identitätsanbindung festlegen, die administrative Grenzen bewusst statt implizit gestalten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Kerberos-Ticket-Protokollmechanik im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Domain-/Forest-Grenzen, Vertrauensbeziehungen und Gruppenrichtlinien-Geltungsbereich, nicht die Kerberos-Protokoll-Interna."}}, "lab_validation": [{"lab_id": "KB-0544-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Microsoft-Dokumentation zu Active-Directory-Domains, Forests, Kerberos und Gruppenrichtlinien, kein aktives Active-Directory-System verwendet", "evidence": "Anhand offizieller Dokumentation wird nachvollzogen, wie eine Active-Directory-Domain die administrative Grundeinheit darstellt, wie ein Forest mehrere Domains mit einer gemeinsamen, aber nicht vollständig transitiv vertrauenden Struktur bündelt, wie Kerberos-Authentifizierung über Ticket-Granting-Tickets funktioniert, und wie Gruppenrichtlinien Konfigurationen auf definierte organisatorische Einheiten anwenden, mit besonderem Fokus auf die Vertrauensbeziehungen zwischen Domains als Quelle unerwarteter, zu breiter administrativer Kontrolle bei fehlerhafter Modellierung.", "limitations": "Kein aktives Active-Directory-System verwendet, keine reale Domain-Struktur konfiguriert."}]}
---
# Active Directory

> **Ziel:** Active Directory strukturiert Unternehmensidentitäten über **Domains** (die administrative Grundeinheit, innerhalb derer eine gemeinsame Sicherheitsrichtlinie gilt) und **Forests** (eine Sammlung von Domains, die eine gemeinsame Schema- und Konfigurationsstruktur teilen, aber nicht notwendigerweise vollständig transitiv vertrauen). **Kerberos** ist das zugrunde liegende Authentifizierungsprotokoll, bei dem ein Nutzer ein initiales Ticket-Granting-Ticket erhält, das dann für den Zugriff auf spezifische Dienste gegen dienstspezifische Tickets eingetauscht wird, ohne dass Passwörter wiederholt über das Netzwerk übertragen werden müssen. **Gruppenrichtlinien** wenden Konfigurationen (Sicherheitseinstellungen, Softwareverteilung) auf definierte organisatorische Einheiten an. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartete, zu breite administrative Kontrolle typischerweise nicht auf eine fehlerhafte Einzelberechtigung zurückzuführen ist, sondern auf eine falsch modellierte Vertrauensbeziehung zwischen Domains oder Forests — eine Vertrauensbeziehung, die breiter konfiguriert ist als tatsächlich beabsichtigt (etwa eine bidirektionale statt einer beabsichtigt unidirektionalen Vertrauensbeziehung), gewährt administrativen Konten der einen Domain effektiven Zugriff auf Ressourcen der anderen, was bei der isolierten Prüfung einzelner Berechtigungen leicht übersehen wird.

## Zweck, Mental Model und Dependencies

Eine Active-Directory-Domain bündelt Nutzer, Computer und Gruppen unter einer gemeinsamen administrativen und Sicherheitsrichtlinie — sie ist die grundlegende Vertrauens- und Verwaltungsgrenze. Ein Forest fasst mehrere Domains zusammen, die ein gemeinsames Schema (welche Attributtypen für Objekte existieren) und eine gemeinsame Konfigurationspartition teilen, wobei Domains innerhalb desselben Forests standardmäßig automatisch bidirektional vertrauen, während Vertrauensbeziehungen zwischen unterschiedlichen Forests explizit konfiguriert werden müssen und dabei bewusst als unidirektional oder bidirektional, transitiv oder nicht-transitiv gestaltet werden können. Diese Konfigurierbarkeit ist zugleich die zentrale Fehlerquelle: Eine Vertrauensbeziehung, die aus Bequemlichkeit breiter als tatsächlich benötigt konfiguriert wird (etwa bidirektional, obwohl nur eine Richtung des Zugriffs tatsächlich erforderlich ist), öffnet einen Zugriffspfad, der bei einer reinen Prüfung individueller Nutzerberechtigungen unsichtbar bleibt, da die eigentliche Ursache auf der strukturellen Ebene der Vertrauensbeziehung liegt, nicht auf einer einzelnen, fehlerhaft vergebenen Berechtigung. Kerberos löst das Authentifizierungsproblem, indem ein Nutzer sich einmalig beim Key Distribution Center authentifiziert und ein Ticket-Granting-Ticket erhält, das für eine begrenzte Zeit gültig ist und anschließend für den Zugriff auf spezifische Dienste gegen kurzlebige, dienstspezifische Tickets eingetauscht wird, ohne dass das ursprüngliche Passwort wiederholt über das Netzwerk gesendet werden muss — dies reduziert die Angriffsfläche gegenüber wiederholter Passwortübertragung erheblich. Gruppenrichtlinien wenden Konfigurationen (etwa Passwortkomplexitätsanforderungen, Softwareinstallationen, Sicherheitseinstellungen) auf organisatorische Einheiten an — eine falsch abgegrenzte organisatorische Einheit oder eine unbeabsichtigte Vererbung von Gruppenrichtlinien kann Konfigurationen auf Systeme anwenden, für die sie nicht beabsichtigt waren. Für hybride Umgebungen, in denen Active Directory mit einem Cloud-Identitätsanbieter (etwa Entra ID, siehe [KB-0482](../20-azure/02-entra-tenant-design-fuer-azure.md)) synchronisiert wird, ist die Konsistenz der administrativen Grenzen zwischen On-Premises-Active-Directory und der Cloud-Identitätsstruktur besonders kritisch — eine On-Premises-Vertrauensbeziehung, die nicht bewusst auf die Cloud-Synchronisation abgebildet wird, kann zu unerwarteten Diskrepanzen zwischen der tatsächlichen, effektiven Berechtigung On-Premises und in der Cloud führen.

~~~text
Active Directory: Domain (base admin/security policy unit) + Forest (multiple domains, shared schema/config)
  domains WITHIN same forest: auto-trust bidirectionally by default
  trust BETWEEN forests: must be EXPLICITLY configured
    -> can be unidirectional/bidirectional, transitive/non-transitive -- CONFIGURABILITY = key error source
    trust configured BROADER than actually needed (e.g. bidirectional when only one direction required)
    -> opens access path INVISIBLE to pure individual-permission review
       (root cause is at the TRUST RELATIONSHIP structural level, not a single misconfigured permission)
Kerberos: authenticate ONCE at KDC -> get Ticket-Granting-Ticket (time-limited)
  -> exchange for short-lived, SERVICE-SPECIFIC tickets per service access
  -> NO repeated password transmission over network -- reduces attack surface
Group Policy: applies config (password complexity, software, security settings) to defined ORG UNITS
  -> wrongly-scoped org unit / unintended policy inheritance -> config applied to unintended systems
HYBRID environments (AD synced to cloud IdP like Entra ID, KB-0482):
  on-prem trust boundary NOT consciously mapped to cloud sync
  -> unexpected discrepancy between EFFECTIVE on-prem vs cloud permission
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Domain | administrative Grundeinheit mit gemeinsamer Sicherheitsrichtlinie | Basis-Vertrauens- und Verwaltungsgrenze |
| Forest | Bündelung mehrerer Domains mit gemeinsamem Schema | automatisches bidirektionales Domain-Vertrauen innerhalb |
| Vertrauensbeziehungen zwischen Forests | explizit konfigurierbar, unidirektional/bidirektional | häufige Quelle unerwarteter, zu breiter Zugriffspfade |
| Kerberos | ticketbasierte Authentifizierung ohne wiederholte Passwortübertragung | reduziert Angriffsfläche gegenüber Passwortübertragung |
| Gruppenrichtlinien | Konfigurationsanwendung auf organisatorische Einheiten | falsche Abgrenzung führt zu unbeabsichtigter Konfigurationsanwendung |

Implementierung: Für jede Vertrauensbeziehung zwischen Domains oder Forests wird explizit geprüft, ob die tatsächlich benötigte Richtung und Transitivität der beabsichtigten, minimal notwendigen Zugriffsanforderung entspricht, statt eine breitere Konfiguration aus Bequemlichkeit zu wählen. Organisatorische Einheiten für Gruppenrichtlinien werden explizit gegen die tatsächliche Systemgruppierung geprüft, um unbeabsichtigte Vererbung zu vermeiden. Für hybride Umgebungen wird die Konsistenz zwischen On-Premises-Vertrauensgrenzen und Cloud-Identitätssynchronisation explizit modelliert und geprüft.

## Scalability, Reliability, Security und Observability

Active Directory skaliert die administrative Kontrolle proportional zur bewussten Modellierung von Domain-/Forest-Vertrauensbeziehungen; die Reliability-Grenze liegt darin, dass eine breiter als beabsichtigt konfigurierte Vertrauensbeziehung proportional zur tatsächlichen Diskrepanz zwischen beabsichtigtem und konfiguriertem Zugriffspfad zu unerwarteter, zu breiter administrativer Kontrolle führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| administrative Konten einer Domain haben unerwarteten Zugriff auf Ressourcen einer anderen Domain | die Vertrauensbeziehung zwischen den Domains ist breiter (z. B. bidirektional statt unidirektional) konfiguriert als beabsichtigt | die tatsächliche Konfiguration der Vertrauensbeziehung gegen die beabsichtigte Zugriffsanforderung prüfen und anpassen |
| eine Gruppenrichtlinie wird auf Systeme angewendet, für die sie nicht beabsichtigt war | die organisatorische Einheit ist falsch abgegrenzt oder die Richtlinie wird unbeabsichtigt vererbt | die Gruppenrichtlinien-Vererbung und die tatsächliche Zuordnung der organisatorischen Einheit prüfen |
| effektive Berechtigungen weichen zwischen On-Premises-Active-Directory und der Cloud-Identität ab | die On-Premises-Vertrauensgrenze wurde nicht bewusst auf die Cloud-Synchronisation abgebildet | die Synchronisationskonfiguration explizit gegen die beabsichtigten Vertrauensgrenzen prüfen |

Security: Vertrauensbeziehungen zwischen Domains und Forests sollten grundsätzlich auf die minimal notwendige Richtung und Transitivität beschränkt werden, nicht pauschal bidirektional oder transitiv konfiguriert werden. Observability: Die tatsächliche Konfiguration aller Vertrauensbeziehungen relativ zur beabsichtigten Zugriffsanforderung, sowie die Konsistenz zwischen On-Premises- und Cloud-Berechtigungen in hybriden Umgebungen, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Gruppenrichtlinien und einzelne Berechtigungen innerhalb einer gegebenen Domain korrekt. **Principal** entwirft die Domain-/Forest-Struktur und Vertrauensbeziehungen für eine Organisation mit bewusst minimalem, benötigtem Umfang. **Chief** legt unternehmensweite Standards für hybride Identitätsanbindung und bewusste Vertrauensgrenzenmodellierung fest.

Anti-Patterns: Vertrauensbeziehungen zwischen Domains oder Forests breiter als tatsächlich benötigt (bidirektional statt unidirektional, transitiv statt nicht-transitiv) konfigurieren; Gruppenrichtlinien ohne Prüfung tatsächlicher Vererbung auf organisatorische Einheiten anwenden; On-Premises-Vertrauensgrenzen ohne bewusste Abbildung auf Cloud-Identitätssynchronisation belassen.

## Production Checklist

- [ ] Jede Vertrauensbeziehung zwischen Domains/Forests entspricht der minimal notwendigen Richtung und Transitivität.
- [ ] Gruppenrichtlinien-Vererbung ist explizit gegen tatsächliche organisatorische Einheiten geprüft.
- [ ] Die Konsistenz zwischen On-Premises-Vertrauensgrenzen und Cloud-Identitätssynchronisation ist für hybride Umgebungen modelliert.
- [ ] Vertrauensbeziehungen werden regelmäßig auf unbeabsichtigte Breite überprüft.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einer Active-Directory-Domain und einem Forest?

**Antwort:** Eine Domain ist die administrative Grundeinheit mit gemeinsamer Sicherheitsrichtlinie; ein Forest bündelt mehrere Domains mit einem gemeinsamen Schema und einer gemeinsamen Konfigurationspartition.

### 2. Wie funktioniert Kerberos-Authentifizierung grundlegend?

**Antwort:** Ein Nutzer authentifiziert sich einmalig und erhält ein zeitlich begrenztes Ticket-Granting-Ticket, das anschließend gegen kurzlebige, dienstspezifische Tickets für den Zugriff auf einzelne Dienste eingetauscht wird, ohne wiederholte Passwortübertragung.

### 3. Warum ist eine unerwartete, zu breite administrative Kontrolle häufig nicht auf eine einzelne fehlerhafte Berechtigung zurückzuführen?

**Antwort:** Weil sie typischerweise auf eine breiter als beabsichtigt konfigurierte Vertrauensbeziehung zwischen Domains oder Forests zurückzuführen ist, die bei einer isolierten Prüfung einzelner Berechtigungen unsichtbar bleibt.

### 4. Warum ist die Konsistenz zwischen On-Premises-Active-Directory und Cloud-Identität in hybriden Umgebungen kritisch?

**Antwort:** Weil eine nicht bewusst auf die Cloud-Synchronisation abgebildete On-Premises-Vertrauensgrenze zu unerwarteten Diskrepanzen zwischen effektiver On-Premises- und Cloud-Berechtigung führen kann.

### 5. Wie gehst du vor, wenn administrative Konten einer Domain unerwarteten Zugriff auf Ressourcen einer anderen Domain haben?

**Antwort:** Ich prüfe die tatsächliche Konfiguration der Vertrauensbeziehung zwischen den betroffenen Domains gegen die beabsichtigte, minimal notwendige Zugriffsanforderung, da dies häufig die strukturelle Ursache statt einer einzelnen fehlerhaften Berechtigung ist.

### 6. Widersprüchliche Anforderung: Unternehmen will nahtlose, unkomplizierte Zusammenarbeit zwischen zwei kürzlich fusionierten Organisationen mit jeweils eigenem Active Directory UND strikt getrennte administrative Kontrolle über die jeweils eigenen Ressourcen — wie gehst du vor?

**Antwort:** Ich würde eine explizit unidirektionale, nicht-transitive Vertrauensbeziehung einrichten, die nur den tatsächlich benötigten Zugriff (etwa Lesezugriff auf gemeinsam genutzte Ressourcen) in einer Richtung ermöglicht, statt eine breite, bidirektionale Vertrauensbeziehung aus Bequemlichkeit zu konfigurieren — nahtlose Zusammenarbeit für konkrete, benötigte Anwendungsfälle und strikte administrative Trennung lassen sich durch präzise, minimal konfigurierte Vertrauensbeziehungen statt durch pauschale Öffnung vereinbaren.

## Praktische Labs

~~~python
# Conceptual trust-relationship scope check (not executed against a real Active Directory environment):

def evaluate_trust(configured_bidirectional, actually_needed_bidirectional):
    if configured_bidirectional and not actually_needed_bidirectional:
        return "OVERLY BROAD: trust configured bidirectional but only unidirectional actually needed"
    return "trust scope matches actual need"

print(evaluate_trust(configured_bidirectional=True, actually_needed_bidirectional=False))
print(evaluate_trust(configured_bidirectional=False, actually_needed_bidirectional=False))
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Active Directory Domain Services Overview](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/active-directory-domain-services), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [How Domain and Forest Trusts Work](https://learn.microsoft.com/en-us/windows-server/security/kerberos/domain-and-forest-trusts), abgerufen 2026-09-18.

IAM und Identitätslebenszyklen sind kanonisch in [KB-0538](02-iam-und-identitaetslebenszyklen.md) behandelt; Entra-Tenant-Design für Azure in [KB-0482](../20-azure/02-entra-tenant-design-fuer-azure.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Erkennung übermäßig breiter Domain-/Forest-Vertrauensbeziehungen und riskanter Kerberos-Angriffspfade (Attack-Path-Analyse) | Evaluating | Gegenüber rein manueller Vertrauensbeziehungsprüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für komplexe, gewachsene Domain-Strukturen bevorzugen. |

Ein Team akzeptiert eine Active-Directory-Struktur erst, wenn Vertrauensbeziehungen nachweislich auf den minimal notwendigen Umfang beschränkt sind und hybride Cloud-Identitätsanbindung bewusst modelliert ist.
