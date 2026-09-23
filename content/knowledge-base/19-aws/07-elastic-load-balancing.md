---
{"id": "KB-0469", "title": "Elastic Load Balancing", "domain": "19", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0073", "concepts": ["Load Balancing auf Layer 4 und 7"], "needed_for": "understanding"}, {"id": "KB-0468", "concepts": ["EC2 und Auto Scaling"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Application Load Balancer (ALB) mit einer Zielgruppe und TLS-Terminierung anhand offizieller Dokumentation konfigurieren können und den Unterschied zu einem Network Load Balancer (NLB) erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Workload begründet zwischen ALB (Layer 7, HTTP/HTTPS-bewusst) und NLB (Layer 4, für extreme Latenz-/Durchsatzanforderungen) entscheiden und Connection Draining für einen sicheren Instanzaustausch konfigurieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten Verbindungsabbruch bei einer Instanzersetzung auf fehlendes oder unzureichend konfiguriertes Connection Draining zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Load-Balancing-Richtlinien im Unternehmen anhand tatsächlicher Protokoll- und Latenzanforderungen statt anhand einer pauschalen Standardwahl zwischen ALB und NLB festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der AWS-Hypervisor-Netzwerkschicht für Load Balancer im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von ALB versus NLB, Health Checks, TLS-Terminierung und Connection Draining als Entscheidungsgrundlage, nicht die Hypervisor-Interna."}}, "lab_validation": [{"lab_id": "KB-0469-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-Elastic-Load-Balancing-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie ein Application Load Balancer (Layer 7) HTTP/HTTPS-bewusstes Routing und TLS-Terminierung bereitstellt, wie ein Network Load Balancer (Layer 4) für extreme Latenz- und Durchsatzanforderungen optimiert ist, und wie Connection Draining laufende Verbindungen bei der Terminierung einer Instanz kontrolliert abschließt, statt sie abrupt zu unterbrechen.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale Load-Balancer-Konfiguration erstellt."}]}
---
# Elastic Load Balancing

> **Ziel:** AWS Elastic Load Balancing stellt unterschiedliche Load-Balancer-Typen bereit, die sich in ihrer Wirkungsebene unterscheiden (siehe Load Balancing auf Layer 4 und 7, [KB-0073](../02-netzwerke/16-load-balancing-auf-layer-4-und-7.md)) — der Application Load Balancer (ALB) arbeitet auf Layer 7 (HTTP/HTTPS-bewusst, kann basierend auf Pfad, Host-Header oder anderen HTTP-Eigenschaften an unterschiedliche Zielgruppen weiterleiten und TLS terminieren), während der Network Load Balancer (NLB) auf Layer 4 arbeitet (verbindungsbasiert, ohne HTTP-Bewusstsein, für extrem hohe Durchsatz- und niedrige Latenzanforderungen optimiert). Der zentrale Punkt dieses Kapitels ist, dass Connection Draining (auch Deregistration Delay genannt) laufende Verbindungen zu einer Instanz, die aus einer Zielgruppe entfernt wird (z. B. bei einer Auto-Scaling-Ersetzung, siehe [KB-0468](06-ec2-und-auto-scaling.md)), für einen konfigurierbaren Zeitraum kontrolliert zu Ende führt, statt sie abrupt zu unterbrechen — ohne diese Konfiguration können Nutzer bei jeder Instanzersetzung unterbrochene Verbindungen erleben, selbst wenn die zugrunde liegende Skalierungs- oder Ersetzungslogik korrekt funktioniert.

## Zweck, Mental Model und Dependencies

Ein Application Load Balancer versteht den Inhalt von HTTP/HTTPS-Anfragen und kann basierend darauf intelligentes Routing durchführen (z. B. unterschiedliche Pfade an unterschiedliche Backend-Zielgruppen weiterleiten, was Microservice-Architekturen mit einem einzigen, gemeinsamen Eingangspunkt ermöglicht), sowie TLS-Verbindungen terminieren (die Verschlüsselung wird am Load Balancer beendet, wodurch die dahinterliegenden Instanzen unverschlüsselten HTTP-Verkehr erhalten, was TLS-Zertifikatsverwaltung zentralisiert, aber bedeutet, dass der interne Netzwerkverkehr zwischen Load Balancer und Instanzen selbst nicht mehr durch dieses TLS geschützt ist, sofern keine zusätzliche interne Verschlüsselung eingerichtet wird). Ein Network Load Balancer arbeitet auf einer niedrigeren Ebene ohne HTTP-Verständnis, leitet TCP/UDP-Verbindungen mit minimalem Overhead weiter, und eignet sich daher für Anwendungsfälle mit extrem hohen Durchsatzanforderungen oder sehr niedriger Latenztoleranz, bei denen der zusätzliche Verarbeitungsaufwand eines Layer-7-bewussten Load Balancers spürbar wäre, sowie für Protokolle, die nicht HTTP/HTTPS sind. Eine Zielgruppe (Target Group) definiert die Menge der Backend-Ressourcen (z. B. EC2-Instanzen einer Auto-Scaling-Gruppe), an die der Load Balancer Anfragen weiterleitet, wobei Health Checks kontinuierlich prüfen, welche Ziele tatsächlich verfügbar sind — ähnlich wie bei Route-53-Health-Checks (siehe [KB-0467](05-amazon-route-53.md)) hängt die Verlässlichkeit dieser Weiterleitungsentscheidung von der Aussagekraft der konfigurierten Prüfkriterien ab. Connection Draining adressiert ein spezifisches, praktisches Problem: Wenn eine Instanz aus der Zielgruppe entfernt wird (z. B. weil eine Auto-Scaling-Gruppe sie ersetzt), sollen bereits laufende, an diese Instanz gerichtete Verbindungen nicht abrupt unterbrochen werden — stattdessen wird die Instanz für neue Anfragen sofort deregistriert, während bestehende Verbindungen für einen konfigurierbaren Zeitraum (typischerweise Sekunden bis wenige Minuten) weiterhin bedient werden dürfen, bevor die Instanz tatsächlich terminiert wird. Der zentrale methodische Punkt ist, dass ein unzureichend konfiguriertes oder fehlendes Connection Draining bei jeder Instanzersetzung zu für Nutzer sichtbaren, unterbrochenen Verbindungen führt, selbst wenn die zugrunde liegende Skalierungs- oder Health-Check-Logik technisch einwandfrei funktioniert — dies ist eine häufig übersehene, aber leicht behebbare Ursache für scheinbar zufällige Verbindungsabbrüche in produktiven Umgebungen.

~~~text
ALB (Layer 7): understands HTTP/HTTPS content
  -> intelligent routing (path/host-based to different target groups), TLS termination
     (encryption ends at LB -> backend gets UNENCRYPTED traffic, centralizes cert management
      but internal traffic no longer protected by THIS TLS unless separately encrypted)
NLB (Layer 4): NO HTTP awareness, forwards TCP/UDP connections with MINIMAL overhead
  -> for extreme throughput/latency requirements, non-HTTP/HTTPS protocols
Target Group: defines backend resources LB routes to, health-checked continuously
  reliability of routing decision depends on health-check CRITERIA quality (same logic as KB-0467)
Connection Draining (Deregistration Delay): instance removed from target group
  -> NEW requests stop immediately, but EXISTING connections continue for a configurable period
     before actual instance termination
KEY METHODOLOGICAL POINT: missing/insufficient connection draining
  -> visible, disrupted user connections on EVERY instance replacement
     EVEN IF the underlying scaling/health-check logic works perfectly
  -> commonly overlooked but easily fixable cause of seemingly random connection drops
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Application Load Balancer (ALB) | HTTP/HTTPS-bewusstes Routing, TLS-Terminierung | geeignet für die meisten webbasierten Anwendungsfälle |
| Network Load Balancer (NLB) | verbindungsbasiertes, minimal-overhead Routing | geeignet für extreme Durchsatz-/Latenzanforderungen, nicht-HTTP-Protokolle |
| Zielgruppe und Health Check | definiert Backend-Ziele, prüft deren Verfügbarkeit | Verlässlichkeit hängt von der Aussagekraft der Health-Check-Kriterien ab |
| Connection Draining | schließt laufende Verbindungen kontrolliert ab | verhindert abrupte Verbindungsabbrüche bei Instanzersetzung |

Implementierung: Für webbasierte Anwendungsfälle mit Bedarf an pfad- oder host-basiertem Routing wird ein Application Load Balancer gewählt, während für Anwendungsfälle mit extremen Durchsatz-/Latenzanforderungen oder nicht-HTTP-Protokollen ein Network Load Balancer geprüft wird. Health Checks für Zielgruppen werden auf tatsächlich aussagekräftige, dedizierte Endpunkte konfiguriert, analog zur Vorgehensweise bei Route-53-Health-Checks. Connection Draining wird für jede Zielgruppe mit einer für den Anwendungsfall angemessenen Zeitspanne konfiguriert, die lang genug ist, um typische, laufende Anfragen abzuschließen, aber nicht unnötig lange, um Instanzersetzungen unnötig zu verzögern.

## Scalability, Reliability, Security und Observability

Elastic Load Balancing skaliert die effektive Verfügbarkeit einer Anwendung proportional zur Anzahl gesund gemeldeter Ziele in der Zielgruppe; die Reliability-Grenze liegt darin, dass fehlendes oder zu kurz konfiguriertes Connection Draining proportional zur Häufigkeit von Instanzersetzungen zu wiederkehrenden, für Nutzer sichtbaren Verbindungsabbrüchen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzer erleben wiederkehrende, unterbrochene Verbindungen bei Instanzersetzungen | Connection Draining ist nicht oder mit zu kurzer Zeitspanne konfiguriert | die Connection-Draining-Konfiguration prüfen und gegebenenfalls die Zeitspanne erhöhen |
| bestimmte Anfragen werden nicht wie erwartet an die richtige Zielgruppe weitergeleitet | die Routing-Regeln des Application Load Balancer entsprechen nicht dem tatsächlich benötigten Pfad-/Host-Muster | die Routing-Regeln gegen die tatsächlichen Anfragepfade und -Header prüfen |
| eine Instanz wird trotz tatsächlicher Funktionsfähigkeit als ungesund markiert und aus der Zielgruppe entfernt | der Health Check prüft ein zu strenges oder ungeeignetes Kriterium für den tatsächlichen Zustand der Anwendung | die Health-Check-Konfiguration auf ein tatsächlich aussagekräftiges Kriterium umstellen |

Security: Bei TLS-Terminierung am ALB sollte geprüft werden, ob der interne Datenverkehr zwischen Load Balancer und Backend-Instanzen ebenfalls verschlüsselt werden muss, insbesondere bei sensiblen Daten oder strikten Compliance-Anforderungen. Observability: Die tatsächliche Verteilung des Datenverkehrs über Zielgruppen-Mitglieder, die Häufigkeit von Health-Check-Statusänderungen, und die tatsächliche Dauer von Connection-Draining-Vorgängen sind zentrale Metriken zur Bewertung der Load-Balancer-Konfiguration.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Connection Draining mit einer für den Anwendungsfall angemessenen Zeitspanne für jede Zielgruppe. **Principal** macht die Wahl zwischen ALB und NLB und deren Begründung für das Team nachvollziehbar. **Chief** legt Load-Balancing-Richtlinien im Unternehmen anhand tatsächlicher Protokoll- und Latenzanforderungen fest.

Anti-Patterns: einen Network Load Balancer für einen Anwendungsfall einsetzen, der tatsächlich HTTP-bewusstes Routing benötigt; Connection Draining ohne Prüfung der typischen Anfragedauer zu kurz konfigurieren oder ganz weglassen; Health Checks mit einem zu strengen oder unzureichend aussagekräftigen Kriterium konfigurieren.

## Production Checklist

- [ ] Die Wahl zwischen ALB und NLB entspricht den tatsächlichen Protokoll- und Latenzanforderungen des Workloads.
- [ ] Connection Draining ist mit einer für den Anwendungsfall angemessenen Zeitspanne konfiguriert.
- [ ] Health Checks für Zielgruppen prüfen tatsächlich aussagekräftige Kriterien.
- [ ] Bei TLS-Terminierung ist geprüft, ob interne Verschlüsselung zwischen Load Balancer und Instanzen erforderlich ist.

## Interviewfragen

### 1. Was unterscheidet einen Application Load Balancer von einem Network Load Balancer?

**Antwort:** Der ALB arbeitet auf Layer 7 mit HTTP/HTTPS-Bewusstsein und ermöglicht pfad-/host-basiertes Routing sowie TLS-Terminierung; der NLB arbeitet auf Layer 4 ohne HTTP-Verständnis mit minimalem Overhead für extreme Durchsatz-/Latenzanforderungen.

### 2. Was ist Connection Draining, und welches Problem löst es?

**Antwort:** Es führt laufende Verbindungen zu einer aus der Zielgruppe entfernten Instanz für eine konfigurierbare Zeitspanne kontrolliert zu Ende, statt sie abrupt zu unterbrechen, was für Nutzer sichtbare Verbindungsabbrüche bei Instanzersetzungen verhindert.

### 3. Was passiert bei TLS-Terminierung am Application Load Balancer?

**Antwort:** Die Verschlüsselung wird am Load Balancer beendet, wodurch Backend-Instanzen unverschlüsselten HTTP-Verkehr erhalten; dies zentralisiert die Zertifikatsverwaltung, erfordert aber gegebenenfalls zusätzliche interne Verschlüsselung für sensible Daten.

### 4. Warum kann eine Instanz trotz tatsächlicher Funktionsfähigkeit als ungesund markiert werden?

**Antwort:** Wenn der Health Check ein zu strenges oder für die tatsächliche Anwendung ungeeignetes Kriterium prüft, kann er fälschlich einen ungesunden Status melden, obwohl die Anwendung tatsächlich funktionsfähig ist.

### 5. Wie gehst du vor, wenn Nutzer wiederkehrende, unterbrochene Verbindungen bei Instanzersetzungen erleben?

**Antwort:** Ich prüfe, ob Connection Draining konfiguriert ist und ob dessen Zeitspanne ausreichend lang ist, um typische, laufende Anfragen abzuschließen, bevor die betroffene Instanz tatsächlich terminiert wird.

### 6. Widersprüchliche Anforderung: Team will maximale Skalierungsgeschwindigkeit (Instanzen sofort ersetzen) UND keine unterbrochenen Nutzerverbindungen — wie gehst du vor?

**Antwort:** Ich würde Connection Draining mit einer angemessenen Zeitspanne konfigurieren, sodass eine Instanz sofort für neue Anfragen deregistriert wird (schnelle Skalierungsreaktion), aber laufende Verbindungen weiterhin kontrolliert abgeschlossen werden, bevor die tatsächliche Terminierung erfolgt, sodass beide Ziele gleichzeitig erreicht werden.

## Praktische Labs

~~~python
# Conceptual connection draining timing sufficiency check (not executed against a real AWS account):

def check_draining_sufficiency(draining_timeout_seconds, p99_request_duration_seconds):
    sufficient = draining_timeout_seconds >= p99_request_duration_seconds
    return {
        "sufficient": sufficient,
        "recommendation": "increase draining timeout" if not sufficient else "current timeout adequate",
    }

result_a = check_draining_sufficiency(draining_timeout_seconds=30, p99_request_duration_seconds=45)
result_b = check_draining_sufficiency(draining_timeout_seconds=60, p99_request_duration_seconds=45)

print(f"Scenario A (30s draining, 45s p99 request): {result_a}")
print(f"Scenario B (60s draining, 45s p99 request): {result_b}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Elastic Load Balancing — Application Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Elastic Load Balancing — Connection Draining (Deregistration Delay)](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html), abgerufen 2026-09-18.

Load Balancing auf Layer 4 und 7 ist kanonisch in [KB-0073](../02-netzwerke/16-load-balancing-auf-layer-4-und-7.md) behandelt; EC2 und Auto Scaling in [KB-0468](06-ec2-und-auto-scaling.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, anwendungsbewusste Routing-Funktionen innerhalb von Application Load Balancern (z. B. auf Basis benutzerdefinierter Header oder Request-Attribute) | Adopting | Gegenüber einfacherem Pfad-/Host-basiertem Routing bevorzugen, sobald der tatsächliche Bedarf an feingranularerer Routing-Logik für den konkreten Anwendungsfall geprüft ist. |

Ein Team akzeptiert eine Load-Balancer-Konfiguration erst, wenn Connection Draining mit einer nachweislich ausreichenden Zeitspanne konfiguriert und die Health-Check-Kriterien als tatsächlich aussagekräftig verifiziert sind.
