---
{"id": "KB-0609", "title": "Discovery und CMDB-Datenqualität", "domain": "25", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0604", "concepts": ["ServiceNow CMDB"], "needed_for": "understanding"}, {"id": "KB-0605", "concepts": ["Configuration Items und Beziehungen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Discovery-Erkennungsquellen und Identifikationsmechanismen anhand etablierter Praxis korrekt gestalten und messbare Qualitätsregeln zur Kontrolle von Dubletten, veralteten CIs und Credential-Problemen anwenden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie mehrere Discovery-Quellen mit konsistenter Identifikation kombiniert werden, um Dubletten zu vermeiden, und wie messbare Qualitätsregeln die tatsächliche CMDB-Datenqualität kontinuierlich überwachen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn zwei Discovery-Quellen dasselbe physische System als zwei unterschiedliche Configuration Items erfassen (Dublette), und die Ursache auf eine inkonsistente Identifikationslogik zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Discovery-Quellenkombination und messbare CMDB-Qualitätsregeln festlegen, die Dubletten, veraltete CIs und Credential-Probleme kontinuierlich kontrollierbar machen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Konfiguration einzelner Discovery-Werkzeuge (Netzwerkscanning-Protokolle, Agentenbereitstellung) ist Vertiefung.", "rationale": "Kern ist das konzeptionelle Verständnis von Identifikation, Dublettenvermeidung und messbaren Qualitätsregeln, nicht die produktspezifische Discovery-Werkzeugkonfiguration."}}, "lab_validation": [{"lab_id": "KB-0609-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung von Dubletten aus mehreren Discovery-Quellen, kein produktives Discovery-System verwendet", "evidence": "Ein lokales Skript kombiniert Erkennungsergebnisse aus zwei simulierten Discovery-Quellen (Netzwerkscan und Agentenbasierte Erfassung) und identifiziert, wenn beide Quellen dasselbe physische System über unterschiedliche Identifikationsmerkmale als getrennte CIs melden.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Discovery-System."}]}
---
# Discovery und CMDB-Datenqualität

> **Ziel:** Dieses Kapitel vertieft die bereits in [KB-0604](16-servicenow-cmdb.md) angesprochene Reconciliation um die konkreten, praktischen Mechanismen dahinter: **Erkennungsquellen** (etwa Netzwerkscans, Agenten-basierte Erfassung, Cloud-API-Abfragen), **Identifikation** (wie ein erkanntes System eindeutig einem Configuration Item zugeordnet wird, siehe die bereits in [KB-0605](17-configuration-items-und-beziehungen.md) behandelte CI-Identität) und der **Abgleich** mehrerer Erkennungsquellen. Der zentrale Punkt dieses Kapitels ist, dass CMDB-Datenqualität nur durch **messbare Qualitätsregeln** kontrollierbar wird — ohne explizite, überprüfbare Regeln für **Dubletten** (dasselbe physische System, fälschlich als zwei getrennte CIs erfasst), **veraltete CIs** (Einträge, die nicht mehr der Realität entsprechen) und **Credential-Probleme** (fehlende oder ungültige Zugangsdaten, die eine vollständige Erfassung verhindern) bleibt die tatsächliche Datenqualität unsichtbar und unkontrollierbar, selbst wenn ein Discovery-Prozess formal regelmäßig läuft.

## Zweck, Mental Model und Dependencies

Mehrere Erkennungsquellen liefern typischerweise unterschiedliche, sich ergänzende Sichten auf dieselbe Infrastruktur: Ein Netzwerkscan erkennt, welche Geräte im Netzwerk tatsächlich erreichbar sind, während eine Agenten-basierte Erfassung detailliertere, interne Informationen über ein System liefert, das einen entsprechenden Agenten installiert hat — die Kombination mehrerer Quellen erhöht typischerweise die Erfassungsvollständigkeit, erzeugt aber ein neues, strukturelles Risiko: Dubletten. Eine Dublette entsteht, wenn zwei unterschiedliche Erkennungsquellen dasselbe physische oder virtuelle System über unterschiedliche, nicht konsistent zusammengeführte Identifikationsmerkmale melden (etwa eine IP-Adresse aus dem Netzwerkscan und ein Hostname aus der Agenten-Erfassung, ohne dass beide Merkmale explizit demselben Configuration Item zugeordnet werden) — die bereits in [KB-0605](17-configuration-items-und-beziehungen.md) behandelte, stabile CI-Identität ist die strukturelle Antwort auf dieses Risiko: Eine konsistente Identifikationslogik (etwa eine eindeutige Hardware-Kennung oder eine Cloud-Ressourcen-ID, die über mehrere Erkennungsquellen hinweg konsistent zugeordnet werden kann) verhindert, dass dasselbe System als zwei getrennte CIs erfasst wird. Veraltete CIs entstehen, wenn ein System stillgelegt oder entfernt wurde, aber der zugehörige CMDB-Eintrag nicht entsprechend aktualisiert wird — dies erfordert nicht nur die Erkennung neuer Systeme, sondern auch die explizite Erkennung, dass ein zuvor erfasstes System nicht mehr tatsächlich existiert (etwa weil ein Netzwerkscan es über einen definierten Zeitraum nicht mehr erreichen kann). Credential-Probleme sind eine praktische, aber häufig übersehene Grenze der Erfassungsvollständigkeit: Eine Agenten-basierte oder zugangsdatenbasierte Erfassung kann ein System nur dann vollständig erfassen, wenn gültige Zugangsdaten für dieses System hinterlegt sind — abgelaufene oder fehlende Zugangsdaten führen zu unvollständiger oder fehlender Erfassung, ohne dass dies notwendigerweise als expliziter Fehler sichtbar wird, sofern die Qualitätsregeln dies nicht gezielt messen. Die methodische Konsequenz ist, dass jede dieser drei Qualitätsdimensionen (Dubletten, veraltete CIs, Credential-Abdeckung) als explizite, messbare Regel mit einer konkreten Kennzahl (etwa "Anzahl erkannter Dubletten pro Discovery-Lauf", "Anzahl CIs ohne erfolgreiche Erfassung in den letzten 30 Tagen", "Prozentsatz der Systeme mit gültigen Credentials") überwacht werden muss, statt sich auf eine allgemeine, unmessbare Einschätzung der Datenqualität zu verlassen.

~~~text
This chapter deepens KB-0604's reconciliation with concrete practical mechanisms:
  DISCOVERY SOURCES (network scans, agent-based collection, cloud API queries)
  IDENTIFICATION (how a detected system is uniquely mapped to a CI, per KB-0605 CI identity)
  RECONCILIATION across multiple discovery sources
KEY POINT: CMDB data quality only controllable through MEASURABLE QUALITY RULES
  w/o explicit, verifiable rules for DUPLICATES (same physical system wrongly captured as 2 separate CIs),
  STALE CIs (entries no longer matching reality), CREDENTIAL problems (missing/invalid access data
    preventing complete capture)
  -> actual data quality stays invisible+uncontrollable, even if discovery process formally runs regularly
MULTIPLE discovery sources: typically different, complementary views of same infra
  network scan: which devices actually reachable on network
  agent-based collection: more detailed, internal info about a system w/ agent installed
  combining sources typically increases capture completeness, but creates NEW structural risk: DUPLICATES
DUPLICATE arises when two different discovery sources report same physical/virtual system
  via different, not-consistently-merged identification attributes
  (IP from network scan + hostname from agent, w/o both explicitly mapped to same CI)
  KB-0605's stable CI identity = structural answer to this risk
    consistent identification logic (unique hardware ID or cloud resource ID, mappable consistently
     across multiple discovery sources) prevents same system being captured as 2 separate CIs
STALE CIs arise when a system decommissioned/removed but corresponding CMDB entry not updated
  requires not just detecting NEW systems, but explicitly detecting that a previously-captured system
  no longer actually exists (e.g. network scan can no longer reach it over defined time period)
CREDENTIAL problems = practical, often-overlooked limit on capture completeness
  agent-based/credential-based collection only fully captures a system IF valid credentials exist for it
  expired/missing credentials -> incomplete/missing capture, w/o necessarily being visible as explicit error
    unless quality rules specifically measure this
METHODOLOGICAL CONSEQUENCE: each of these three quality dimensions
  (duplicates, stale CIs, credential coverage)
  must be monitored as explicit, measurable rule w/ concrete metric
  ("duplicate count per discovery run", "CI count w/o successful capture in last 30 days",
   "% of systems w/ valid credentials")
  instead of relying on general, unmeasurable data quality impression
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Erkennungsquelle | liefert unterschiedliche, ergänzende Infrastruktursichten | Kombination erhöht Vollständigkeit, birgt Dublettenrisiko |
| Konsistente Identifikation | ordnet erkannte Systeme eindeutig CIs zu | zentrale strukturelle Antwort gegen Dubletten |
| Veraltungserkennung | erkennt, dass ein System nicht mehr existiert | verhindert dauerhaft falsche, aktiv wirkende CIs |
| Messbare Qualitätsregel | konkrete Kennzahl je Qualitätsdimension | macht Datenqualität überwachbar statt unmessbar |

Implementierung: Mehrere Discovery-Quellen werden mit konsistenter, stabiler Identifikationslogik kombiniert, um Dubletten strukturell zu vermeiden. Ein expliziter Prozess erkennt und markiert Configuration Items, die über einen definierten Zeitraum nicht mehr erfasst werden konnten, als potenziell veraltet. Credential-Abdeckung wird als eigene, messbare Kennzahl überwacht. Jede Qualitätsdimension (Dubletten, Veraltung, Credential-Abdeckung) wird mit einer konkreten, regelmäßig ausgewerteten Kennzahl versehen.

## Scalability, Reliability, Security und Observability

Discovery und CMDB-Datenqualität skalieren die tatsächliche Verlässlichkeit der Konfigurationsbasis proportional zur Konsequenz messbarer Qualitätsregeln; die Reliability-Grenze liegt darin, dass Dubletten, veraltete CIs und Credential-Lücken ohne explizite Messung unsichtbar bleiben, selbst wenn der Discovery-Prozess formal regelmäßig läuft.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| dasselbe physische System erscheint in der CMDB als zwei getrennte Configuration Items | die Identifikationslogik zwischen zwei Discovery-Quellen ist inkonsistent | eine konsistente, stabile Identifikationslogik über beide Quellen hinweg einführen |
| stillgelegte Systeme erscheinen weiterhin als aktiv in der CMDB | keine explizite Veraltungserkennung markiert nicht mehr erreichbare Systeme | einen Prozess einführen, der Systeme nach definierter Nichterreichbarkeit als potenziell veraltet markiert |
| Discovery-Läufe erfassen bestimmte Systeme systematisch unvollständig | abgelaufene oder fehlende Zugangsdaten verhindern die vollständige Erfassung | die Credential-Abdeckung als eigene, messbare Kennzahl einführen und überwachen |

Security: Zugangsdaten für Discovery-Prozesse müssen selbst sicher verwaltet werden, da sie weitreichenden Zugriff auf die erfasste Infrastruktur ermöglichen. Observability: Die drei messbaren Qualitätskennzahlen (Dublettenrate, Veraltungsrate, Credential-Abdeckung) sind die zentralen Signale zur Bewertung der tatsächlichen CMDB-Datenqualität, unabhängig von der formalen Vollständigkeit der Einträge.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Discovery-Quellen und Identifikationslogik für einen gegebenen Bereich korrekt. **Principal** entwirft die vollständige Discovery-Strategie mit messbaren Qualitätsregeln für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Discovery-Quellenkombination und CMDB-Datenqualitätsmessung fest.

Anti-Patterns: mehrere Discovery-Quellen ohne konsistente Identifikationslogik kombinieren und dadurch Dubletten erzeugen; keine explizite Veraltungserkennung einrichten, sodass stillgelegte Systeme dauerhaft als aktiv gelistet bleiben; Credential-Abdeckung nicht als eigene Kennzahl messen und dadurch unvollständige Erfassung unentdeckt lassen.

## Production Checklist

- [ ] Mehrere Discovery-Quellen sind mit konsistenter, stabiler Identifikationslogik kombiniert.
- [ ] Ein expliziter Prozess erkennt und markiert potenziell veraltete Configuration Items.
- [ ] Die Credential-Abdeckung wird als eigenständige, messbare Kennzahl überwacht.
- [ ] Dublettenrate, Veraltungsrate und Credential-Abdeckung werden regelmäßig ausgewertet und berichtet.

## Interviewfragen

### 1. Warum kann die Kombination mehrerer Discovery-Quellen ein Dublettenrisiko erzeugen?

**Antwort:** Weil zwei unterschiedliche Quellen dasselbe System über unterschiedliche, nicht konsistent zusammengeführte Identifikationsmerkmale melden können, sodass es fälschlich als zwei getrennte Configuration Items erfasst wird.

### 2. Was ist die strukturelle Antwort auf das Dublettenrisiko?

**Antwort:** Eine konsistente, stabile Identifikationslogik (etwa eine eindeutige Hardware- oder Cloud-Ressourcen-ID), die über mehrere Discovery-Quellen hinweg konsistent demselben Configuration Item zugeordnet werden kann.

### 3. Wie entstehen veraltete CIs, und wie werden sie erkannt?

**Antwort:** Sie entstehen, wenn ein System stillgelegt wird, ohne dass der zugehörige CMDB-Eintrag aktualisiert wird; sie werden durch einen expliziten Prozess erkannt, der Systeme nach definierter Nichterreichbarkeit als potenziell veraltet markiert.

### 4. Warum können Credential-Probleme die Erfassungsvollständigkeit beeinträchtigen, ohne als expliziter Fehler sichtbar zu werden?

**Antwort:** Weil eine unvollständige oder fehlende Erfassung durch abgelaufene oder fehlende Zugangsdaten nicht automatisch als Fehler erkennbar ist, sofern die Qualitätsregeln die Credential-Abdeckung nicht gezielt messen.

### 5. Wie gehst du vor, wenn dasselbe physische System in der CMDB als zwei getrennte Configuration Items erscheint?

**Antwort:** Ich prüfe die Identifikationslogik der beteiligten Discovery-Quellen und stelle sicher, dass beide Quellen konsistent demselben, stabilen Identifikationsmerkmal zugeordnet werden.

### 6. Widersprüchliche Anforderung: Die Organisation will minimalen Aufwand für Discovery-Konfiguration UND vollständige, verlässliche CMDB-Datenqualität — wie gehst du vor?

**Antwort:** Ich würde die drei messbaren Qualitätsregeln (Dubletten, Veraltung, Credential-Abdeckung) als automatisierte, kontinuierliche Überwachung einrichten, die den manuellen Aufwand auf die tatsächliche Korrektur erkannter Abweichungen begrenzt, statt entweder auf Qualitätsmessung zu verzichten oder umfangreiche, manuelle Vollprüfungen durchzuführen.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting duplicates from multiple discovery sources (executed locally, no real discovery system):

def detect_duplicates(network_scan_results, agent_results, identity_map):
    combined_ids = set()
    duplicates = []
    for entry in network_scan_results + agent_results:
        stable_id = identity_map.get(entry["raw_identifier"], entry["raw_identifier"])
        if stable_id in combined_ids:
            duplicates.append(stable_id)
        combined_ids.add(stable_id)
    return {"unique_cis": len(combined_ids), "duplicates_detected": duplicates}

network_scan_results = [{"raw_identifier": "192.168.1.10"}]
agent_results = [{"raw_identifier": "hostname-server42"}]
identity_map = {"192.168.1.10": "hw-uuid-abc123", "hostname-server42": "hw-uuid-abc123"}  # same physical system

print(detect_duplicates(network_scan_results, agent_results, identity_map))
~~~

## Dependencies, Cross-References und Quellen

1. ServiceNow-Dokumentation: [Discovery Overview](https://www.servicenow.com/docs/bundle/xanadu-it-operations-management/page/product/discovery/concept/discovery.html), abgerufen 2026-09-18.
2. ServiceNow-Dokumentation: [CMDB Health and Data Quality](https://www.servicenow.com/docs/bundle/xanadu-it-service-management/page/product/configuration-management/concept/c_CMDBHealth.html), abgerufen 2026-09-18.

ServiceNow CMDB ist kanonisch in [KB-0604](16-servicenow-cmdb.md) behandelt; Configuration Items und Beziehungen in [KB-0605](17-configuration-items-und-beziehungen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, KI-gestützte Fuzzy-Matching-Verfahren zur Erkennung wahrscheinlicher Dubletten aus uneindeutigen Identifikationsmerkmalen | Evaluating | Als ergänzendes Vorschlagswerkzeug für Fälle ohne eindeutige, stabile Identifikationsmerkmale einsetzen, jedoch die abschließende Zusammenführungsentscheidung weiterhin menschlich validieren, um fehlerhafte Zusammenführungen unterschiedlicher, tatsächlich getrennter Systeme zu vermeiden. |

Ein Team akzeptiert eine Discovery- und CMDB-Datenqualitätsstrategie erst, wenn Dublettenrate, Veraltungsrate und Credential-Abdeckung nachweislich als messbare, regelmäßig überwachte Kennzahlen etabliert sind.
