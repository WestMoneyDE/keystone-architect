---
{"id": "KB-0121", "title": "Service Discovery und Erreichbarkeit", "domain": "05", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0058", "concepts": ["DNS", "Caching"], "needed_for": "understanding"}, {"id": "KB-0116", "concepts": ["Circuit Breaker"], "needed_for": "understanding"}], "related": ["KB-0122", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Registry-Modell mit Health-Zustand und veraltetem Eintrag lokal simulieren.", "rationale": "Kein echtes Service-Mesh nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Discovery-Mechanismus (DNS-basiert vs. Registry-basiert) und Health-Zustandsmodell begründet wählen.", "rationale": "Falsche Wahl erzeugt entweder zu träge oder zu instabile Routing-Entscheidungen."}, "STAFF-TARGET": {"active": true, "scope": "Anfragen an einen bereits ausgefallenen Knoten auf einen veralteten Registry-Eintrag zurückführen.", "rationale": "Discovery-Staleness ist eine häufige, aber diagnostizierbare Fehlerquelle."}, "CHIEF-TARGET": {"active": true, "scope": "Health-Check-Standard (aktiv/passiv, Zeitfenster) für alle intern aufgerufenen Dienste festlegen.", "rationale": "Inkonsistente Health-Definitionen über Dienste hinweg erzeugen unzuverlässiges Routing."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Service-Mesh-Sidecar-Discovery und Multi-Cluster-Discovery-Föderation sind Vertiefung.", "rationale": "Kern ist das Zusammenspiel von Registry, Health-Zustand und Staleness."}}, "lab_validation": [{"lab_id": "KB-0121-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Registry mit Health-Zustand und Staleness-Fenster", "evidence": "Ein Knoten, der vor 90 Sekunden ausgefallen ist, wird bei einem 30-Sekunden-Health-Check-Intervall korrekt als unhealthy erkannt und aus dem Routing entfernt.", "limitations": "Kein reales Service-Mesh, keine Produktion."}]}
---
# Service Discovery und Erreichbarkeit

> **Ziel:** Service Discovery beantwortet die Frage „welche Instanzen eines Dienstes sind gerade erreichbar und gesund?" — über eine Registry oder DNS-basierte Mechanik. Veraltete Einträge, unklare Health-Definitionen und Discovery-Ausfälle selbst können dazu führen, dass Traffic an tote oder überlastete Instanzen geroutet wird.

## Zweck, Mental Model und Dependensies

Ein Registry-basierter Ansatz (Dienste melden sich aktiv an/ab, ein zentraler Dienst hält die aktuelle Liste) bietet feingranulare, oft nahezu echtzeitnahe Sicht auf Verfügbarkeit; ein DNS-basierter Ansatz nutzt bestehende Infrastruktur, ist aber durch DNS-Caching-Verhalten ([KB-0058](../03-network-foundations/10-dns-aufloesung-und-caches.md)) träger bei Änderungen. „Erreichbar" (Netzwerkpfad existiert) und „gesund" (Dienst kann Anfragen tatsächlich sinnvoll beantworten) sind unterschiedliche Zustände — ein Health-Check muss beide meinen, nicht nur Netzwerkerreichbarkeit prüfen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0058](../03-network-foundations/10-dns-aufloesung-und-caches.md) und [KB-0116](16-circuit-breaker-und-fehlereindaemmung.md).

~~~text
Instance registers -> health check passes -> added to routing pool
Instance crashes -> health check fails (after check interval) -> removed from pool
                          ^ staleness window: traffic to dead instance until removal takes effect
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Health-Check-Typ | aktiv (Poller fragt) vs. passiv (aus realem Traffic abgeleitet)? | passiv allein erkennt Probleme erst nach echtem Fehlschlag |
| Check-Intervall | wie lange bis ein ausgefallener Knoten erkannt wird? | zu lang: Staleness-Fenster mit fehlgeschlagenen Anfragen |
| Deregistrierung | sauberes Abmelden bei geplantem Shutdown? | fehlendes Deregister erzeugt unnötiges Staleness-Fenster |
| Discovery-Ausfall selbst | was passiert, wenn Registry/DNS nicht erreichbar ist? | Client ohne Fallback kann gar keine Instanz mehr finden |

Implementierung: Health-Checks kombinieren aktive Polls (regelmäßige Prüfung unabhängig von echtem Traffic) mit passiver Beobachtung (Fehlerquote aus realen Anfragen, ähnlich [KB-0116](16-circuit-breaker-und-fehlereindaemmung.md)). Geplante Shutdowns sollten sich aktiv deregistrieren, statt auf den nächsten fehlgeschlagenen Health-Check zu warten (Graceful Shutdown). Clients sollten einen zwischengespeicherten letzten bekannten Zustand mit begrenzter Gültigkeit vorhalten, damit ein kurzer Discovery-Ausfall nicht sofort zu vollständigem Verbindungsverlust führt.

## Scalability, Reliability, Security und Observability

Das Staleness-Fenster (Zeit zwischen echtem Ausfall und Entfernung aus dem Routing-Pool) ist eine direkte Funktion des Check-Intervalls und der Fehlerschwelle — es lässt sich nicht auf null reduzieren, nur minimieren. Reliability-Grenze: die Discovery-Infrastruktur selbst ist ein kritischer Pfad; fällt sie aus, können selbst gesunde Dienstinstanzen nicht mehr gefunden werden, wenn kein lokaler Cache-Fallback existiert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| gelegentliche Fehler zu einem bestimmten Knoten | Staleness-Fenster nach dessen Ausfall | Fehlerzeitpunkt gegen letzten erfolgreichen Health-Check des Knotens vergleichen |
| Fehlerquote steigt kurz nach Deployment/Rolling-Restart | fehlendes Graceful-Shutdown-Deregister | prüfen, ob Instanzen sich vor Beendigung aktiv abmelden |
| alle Dienstaufrufe schlagen gleichzeitig fehl trotz gesunder Instanzen | Discovery-Infrastruktur selbst ausgefallen | Registry-/DNS-Erreichbarkeit unabhängig von Zieldiensten prüfen |
| DNS-basierte Discovery reagiert sehr träge auf Änderungen | TTL/Caching-Verhalten von DNS-Resolvern | TTL-Konfiguration gegen tatsächliche Änderungsgeschwindigkeit prüfen |

Security: die Discovery-Registry ist eine privilegierte Komponente; unautorisierte Registrierung könnte Traffic zu einer bösartigen Instanz umleiten, daher braucht Registrierung Authentifizierung. Observability korreliert Registry-Größe, Health-Check-Erfolg/-Fehler pro Instanz, Staleness-Dauer nach echtem Ausfall und Discovery-Infrastruktur-Verfügbarkeit selbst.

## Trade-offs und Entscheidungen

**Staff** prüft bei sporadischen Fehlern zuerst das Staleness-Fenster gegen den tatsächlichen Ausfallzeitpunkt der betroffenen Instanz. **Principal** definiert Standard-Health-Check-Intervalle und verpflichtendes Graceful-Shutdown-Deregister für alle Dienste. **Chief** legt einen einheitlichen Health-Definitionsstandard (was bedeutet „gesund" konkret) über alle Dienste hinweg fest.

Anti-Patterns: Health-Check prüft nur Netzwerkerreichbarkeit statt echter Diensttauglichkeit; kein Graceful Shutdown, Instanzen werden erst nach fehlgeschlagenem Check entfernt; Discovery-Infrastruktur ohne eigenen Verfügbarkeitsstandard betreiben, obwohl sie ein kritischer Pfad für alle abhängigen Dienste ist.

## Production Checklist

- [ ] Health-Check prüft echte Diensttauglichkeit, nicht nur Netzwerkerreichbarkeit.
- [ ] Graceful Shutdown mit aktiver Deregistrierung implementiert.
- [ ] Staleness-Fenster gemessen und gegen SLO-Anforderung geprüft.
- [ ] Discovery-Infrastruktur selbst mit eigenem Verfügbarkeitsstandard betrieben, Client-Fallback bei Discovery-Ausfall vorhanden.

## Interviewfragen

### 1. Was ist der Unterschied zwischen „erreichbar" und „gesund"?

**Antwort:** Erreichbar bedeutet, dass ein Netzwerkpfad zur Instanz existiert; gesund bedeutet, dass die Instanz Anfragen tatsächlich korrekt und in angemessener Zeit beantworten kann — ein Health-Check muss beides prüfen.

### 2. Was ist das Staleness-Fenster?

**Antwort:** Die Zeit zwischen dem tatsächlichen Ausfall einer Instanz und ihrer Entfernung aus dem Routing-Pool, bestimmt durch Check-Intervall und Fehlerschwelle.

### 3. Warum ist Graceful Shutdown wichtig?

**Antwort:** Ohne aktive Deregistrierung bei geplanter Beendigung erhält die Instanz weiter Traffic, bis der nächste Health-Check fehlschlägt, was unnötige Fehler erzeugt.

### 4. Warum ist DNS-basierte Discovery träger als Registry-basierte?

**Antwort:** DNS-Resolver cachen Einträge basierend auf TTL, wodurch Änderungen erst nach Ablauf des Caches sichtbar werden, während eine dedizierte Registry Änderungen nahezu in Echtzeit propagieren kann.

### 5. Was passiert, wenn die Discovery-Infrastruktur selbst ausfällt?

**Antwort:** Ohne lokalen Fallback-Cache können selbst gesunde Dienstinstanzen nicht mehr gefunden werden; ein zwischengespeicherter letzter bekannter Zustand mit begrenzter Gültigkeit mildert dieses Risiko.

### 6. Widersprüchliche Anforderung: Produkt will sofortige Erkennung von Ausfällen UND keine Fehlalarme bei kurzen Netzwerk-Hängern — wie gehst du vor?

**Antwort:** Ich würde aktive und passive Health-Checks kombinieren: ein kurzes aktives Intervall für schnelle Erkennung, kombiniert mit einer Fehlerschwelle (mehrere aufeinanderfolgende Fehlschläge statt einem einzelnen), um kurzzeitige Hänger von echten Ausfällen zu unterscheiden.

## Praktische Labs

~~~python
import time

registry = {"node1": {"last_healthy": 0}}
now = 90  # seconds since last known healthy check
check_interval = 30
failure_threshold_checks = 2

missed_checks = (now - registry["node1"]["last_healthy"]) // check_interval
is_removed = missed_checks >= failure_threshold_checks
assert is_removed
print(f"Node missed {missed_checks} health checks and was correctly removed from the routing pool.")
~~~

## Dependencies, Cross-References und Quellen

1. Newman: [Building Microservices, Kapitel Service Discovery](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/), O'Reilly 2021, abgerufen 2026-09-17.

Produktspezifische Service-Mesh-/Registry-Implementierungsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Sidecar-basierte Discovery in Service Meshes statt zentraler Registry | Established | Konsistenz zwischen Sidecar-Sicht und tatsächlichem Zustand prüfen. |
| eBPF-basierte transparente Discovery ohne Sidecar | Emerging | Reife und Beobachtbarkeit gegenüber etablierten Sidecar-Mustern vor Einsatz prüfen. |

Ein Team akzeptiert eine Service-Discovery-Implementierung erst, wenn Staleness-Fenster gemessen, Graceful Shutdown getestet und Verhalten bei Discovery-Infrastruktur-Ausfall geprüft sind.
