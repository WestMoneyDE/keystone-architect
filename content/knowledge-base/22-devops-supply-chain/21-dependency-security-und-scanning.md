---
{"id": "KB-0533", "title": "Dependency Security und Scanning", "domain": "22", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0529", "concepts": ["SBOM und Komponenteninventare"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Dependency-Scanning-Werkzeuge (konzeptionell Trivy/Grype) anhand offizieller Dokumentation für transitive Abhängigkeiten, Lockfiles und Paketquellen korrekt einsetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Lieferkette explizit einen Patch-Priorisierungsprozess gestalten, der tatsächliche Erreichbarkeit einer Schwachstelle im eigenen Code statt bloßer CVE-Anzahl als Kriterium nutzt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine Fehlallokation von Sicherheitsressourcen auf eine Priorisierung nach bloßer CVE-Anzahl statt tatsächlicher Erreichbarkeit und Ausnutzbarkeit im konkreten Anwendungskontext zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für risikobasierte, erreichbarkeitsgestützte Patch-Priorisierung statt reiner CVE-Zählung als Sicherheitsmetrik festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Scanner-Datenbank-Update-Mechanismen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Erreichbarkeitsanalyse und risikobasierter Priorisierung als Entscheidungsgrundlage, nicht die Scanner-Interna."}}, "lab_validation": [{"lab_id": "KB-0533-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation erreichbarkeitsbasierter versus reiner CVE-Zahl-Priorisierung, kein produktives Scanning-System verwendet", "evidence": "Ein lokales Skript simuliert, wie zwei Komponenten mit identischer, hoher CVE-Anzahl unterschiedliche tatsächliche Risiken darstellen können, abhängig davon, ob der verwundbare Codepfad tatsächlich vom eigenen Anwendungscode erreicht (aufgerufen) wird, und zeigt damit, warum eine Priorisierung allein nach CVE-Anzahl zu Fehlallokation von Patch-Ressourcen führen kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, keine reale Erreichbarkeitsanalyse eines produktiven Codebase."}]}
---
# Dependency Security und Scanning

> **Ziel:** Dependency-Scanning-Werkzeuge (konzeptionell etwa Trivy oder Grype) analysieren **transitive Abhängigkeiten**, **Lockfiles** (die exakte, aufgelöste Version jeder Abhängigkeit, im Gegensatz zu einem Versionsbereich in der ursprünglichen Projektkonfiguration) und **Paketquellen**, um bekannte Schwachstellen (CVEs) in der Software-Zusammensetzung zu identifizieren, aufbauend auf einer SBOM (siehe [KB-0529](17-sbom-und-komponenteninventare.md)). Der zentrale Punkt dieses Kapitels ist, dass eine Priorisierung von Patches allein nach der **Anzahl** gefundener CVEs zu systematischer Fehlallokation von Sicherheitsressourcen führt — zwei Komponenten mit identischer, hoher CVE-Anzahl können ein fundamental unterschiedliches tatsächliches Risiko darstellen, abhängig davon, ob der jeweils verwundbare Codepfad tatsächlich vom eigenen Anwendungscode **erreicht** (aufgerufen) wird. Eine Komponente mit vielen CVEs in ungenutzten, nie aufgerufenen Codepfaden stellt ein geringeres tatsächliches Risiko dar als eine Komponente mit wenigen, aber tatsächlich erreichbaren und ausnutzbaren CVEs — eine risikobasierte, erreichbarkeitsgestützte Priorisierung statt reiner CVE-Zählung ist daher notwendig, um begrenzte Patch-Kapazität dort einzusetzen, wo das tatsächliche Risiko am höchsten ist.

## Zweck, Mental Model und Dependencies

Dependency-Scanning baut auf der SBOM als Grundlage auf (siehe [KB-0529](17-sbom-und-komponenteninventare.md)) und gleicht die erfassten Komponenten und Versionen gegen Schwachstellendatenbanken ab, um bekannte CVEs zu identifizieren. Ein Lockfile spielt dabei eine zentrale Rolle für die Genauigkeit dieser Analyse: Während eine Projektkonfiguration häufig einen Versionsbereich angibt (etwa "mindestens Version 2.0, aber unter 3.0"), fixiert ein Lockfile die exakte, tatsächlich aufgelöste Version jeder direkten und transitiven Abhängigkeit — ein Scan, der nur die Projektkonfiguration statt des Lockfiles analysiert, kann daher eine ungenaue oder unvollständige Sicht auf die tatsächlich genutzten Versionen liefern, da innerhalb eines zulässigen Versionsbereichs verschiedene tatsächliche Versionen mit unterschiedlichem Schwachstellenstatus möglich wären. Paketquellen sind ein separates, aber verwandtes Risiko: Ein Scanner sollte auch prüfen, ob Abhängigkeiten aus vertrauenswürdigen, autorisierten Paketquellen stammen, da eine kompromittierte oder nicht autorisierte Quelle unabhängig vom Versionsinhalt ein Risiko darstellt (etwa durch Typosquatting oder Dependency Confusion, bei der ein Angreifer ein bösartiges Paket mit ähnlichem oder identischem Namen in einer öffentlichen statt der beabsichtigten internen Paketquelle platziert). Die entscheidende methodische Verbesserung gegenüber reiner CVE-Zählung ist die Erreichbarkeitsanalyse: Ein moderner Scanner kann prüfen, ob der tatsächliche Anwendungscode den spezifischen, verwundbaren Codepfad einer Komponente tatsächlich aufruft — eine Schwachstelle in einer Funktion, die im eigenen Code nie aufgerufen wird, stellt ein erheblich geringeres tatsächliches Ausnutzungsrisiko dar als eine Schwachstelle in einer Funktion, die im aktiven Anfragepfad der Anwendung liegt, selbst wenn beide dieselbe CVE-Schweregrad-Bewertung tragen. Eine risikobasierte Priorisierung kombiniert daher Schweregrad, tatsächliche Erreichbarkeit, und die tatsächliche Exponiertheit der betroffenen Komponente (etwa: ist sie über eine öffentlich erreichbare API erreichbar, oder nur in einem internen Batch-Prozess ohne externe Eingabe?), statt Patches allein nach der Rohzahl gefundener CVEs zu priorisieren.

~~~text
Dependency Scanning (Trivy/Grype-like tools): analyzes transitive deps + Lockfiles + package sources
  builds on SBOM (KB-0529), matches components/versions against vulnerability DBs -> known CVEs
Lockfile: EXACT resolved version per dependency (vs version RANGE in project config)
  -> scanning only project config (not lockfile) = imprecise/incomplete actual-version visibility
Package sources: separate risk -> trusted/authorized source vs compromised/unauthorized
  (typosquatting, dependency confusion: malicious pkg w/ similar/identical name in public vs intended internal registry)
KEY METHODOLOGICAL IMPROVEMENT over raw CVE count: REACHABILITY ANALYSIS
  does actual app code ACTUALLY CALL the specific vulnerable code path?
  -> vuln in NEVER-CALLED function = much lower actual exploitation risk
  -> vuln in function on ACTIVE request path = much higher actual risk
     EVEN IF both carry the same CVE severity rating
RISK-BASED prioritization = severity + REACHABILITY + exposure (public API vs internal batch w/ no external input)
  vs prioritizing patches by RAW CVE COUNT alone -> systematic misallocation of patch resources
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Lockfile-basiertes Scanning | exakte, aufgelöste Versionen statt Versionsbereiche | präzisere Schwachstellenzuordnung |
| Paketquellenverifikation | erkennt kompromittierte/nicht autorisierte Quellen | separates Risiko zu Versionsschwachstellen |
| Erreichbarkeitsanalyse | prüft tatsächlichen Aufruf des verwundbaren Codepfads | zentrales Kriterium für tatsächliches Risiko |
| Risikobasierte Priorisierung | kombiniert Schweregrad, Erreichbarkeit, Exponiertheit | Alternative zu reiner CVE-Zählung |

Implementierung: Scans erfolgen explizit gegen das Lockfile, nicht nur gegen die Projektkonfiguration mit Versionsbereichen. Paketquellen werden explizit gegen eine Liste autorisierter, vertrauenswürdiger Quellen geprüft. Patch-Priorisierung erfolgt anhand einer risikobasierten Bewertung (Schweregrad, tatsächliche Erreichbarkeit, Exponiertheit), statt Komponenten allein nach der Anzahl gefundener CVEs zu ordnen.

## Scalability, Reliability, Security und Observability

Dependency-Scanning skaliert die tatsächliche Risikoreduktion proportional zur Nutzung erreichbarkeitsbasierter statt reiner CVE-Zahl-Priorisierung; die Reliability-Grenze liegt darin, dass eine Priorisierung allein nach CVE-Anzahl proportional zur Fehlallokation begrenzter Patch-Kapazität das tatsächliche Risiko unzureichend reduziert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| begrenzte Patch-Ressourcen werden auf Komponenten mit hoher CVE-Anzahl, aber geringer tatsächlicher Nutzung verwendet | die Priorisierung erfolgt allein nach CVE-Anzahl ohne Erreichbarkeitsanalyse | eine Erreichbarkeitsanalyse einführen, um tatsächlich aufgerufene, verwundbare Codepfade zu priorisieren |
| ein Scan übersieht tatsächlich genutzte, verwundbare Versionen | der Scan analysiert nur die Projektkonfiguration mit Versionsbereichen statt des Lockfiles | den Scan explizit gegen das Lockfile mit exakt aufgelösten Versionen durchführen |
| eine unerwartet bösartige Abhängigkeit wird installiert | die Abhängigkeit stammt aus einer nicht autorisierten oder kompromittierten Paketquelle (Dependency Confusion) | die Paketquellenverifikation gegen eine Liste autorisierter, vertrauenswürdiger Quellen prüfen |

Security: Paketquellen sollten explizit auf eine Liste autorisierter, vertrauenswürdiger Quellen beschränkt werden, um Dependency-Confusion-Angriffe zu vermeiden. Observability: Die tatsächliche Erreichbarkeitsrate identifizierter Schwachstellen, die durchschnittliche Patch-Zeit für erreichbare versus nicht erreichbare Schwachstellen, und die Konsistenz der Lockfile-basierten Scan-Abdeckung sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** führt einen Dependency-Scan korrekt gegen das Lockfile eines gegebenen Projekts durch. **Principal** entwirft den risikobasierten Priorisierungsprozess, der Erreichbarkeit und Exponiertheit statt reiner CVE-Anzahl nutzt. **Chief** legt unternehmensweite Standards für risikobasierte Patch-Priorisierung fest, statt reiner CVE-Zählung als Sicherheitsmetrik zu behandeln.

Anti-Patterns: Patches allein nach der Anzahl gefundener CVEs priorisieren, ohne tatsächliche Erreichbarkeit zu berücksichtigen; Scans nur gegen die Projektkonfiguration statt des präziseren Lockfiles durchführen; Paketquellen ohne explizite Autorisierungsprüfung akzeptieren.

## Production Checklist

- [ ] Dependency-Scans erfolgen gegen das Lockfile mit exakt aufgelösten Versionen.
- [ ] Paketquellen sind explizit auf autorisierte, vertrauenswürdige Quellen beschränkt.
- [ ] Patch-Priorisierung berücksichtigt tatsächliche Erreichbarkeit und Exponiertheit, nicht nur CVE-Anzahl oder Schweregrad.
- [ ] Die Erreichbarkeitsanalyse wird regelmäßig gegen den tatsächlichen, aktuellen Anwendungscode aktualisiert.

## Interviewfragen

### 1. Warum ist Lockfile-basiertes Scanning präziser als Scanning der Projektkonfiguration allein?

**Antwort:** Weil ein Lockfile die exakte, tatsächlich aufgelöste Version jeder Abhängigkeit fixiert, während eine Projektkonfiguration oft nur einen Versionsbereich angibt, innerhalb dessen unterschiedliche tatsächliche Versionen mit unterschiedlichem Schwachstellenstatus möglich sind.

### 2. Was ist Erreichbarkeitsanalyse im Kontext von Dependency Scanning?

**Antwort:** Die Prüfung, ob der tatsächliche Anwendungscode den spezifischen, verwundbaren Codepfad einer Komponente tatsächlich aufruft, statt anzunehmen, dass jede vorhandene Schwachstelle gleichermaßen ausnutzbar ist.

### 3. Warum führt reine CVE-Zahl-Priorisierung zu Fehlallokation von Sicherheitsressourcen?

**Antwort:** Weil zwei Komponenten mit identischer CVE-Anzahl ein fundamental unterschiedliches tatsächliches Risiko darstellen können, abhängig davon, ob der verwundbare Codepfad tatsächlich erreicht wird — reine Zählung ignoriert diesen entscheidenden Unterschied.

### 4. Was ist Dependency Confusion, und wie wird ihr durch Paketquellenverifikation begegnet?

**Antwort:** Ein Angriff, bei dem ein Angreifer ein bösartiges Paket mit ähnlichem oder identischem Namen in einer öffentlichen statt der beabsichtigten internen Paketquelle platziert; eine explizite Beschränkung auf autorisierte, vertrauenswürdige Quellen verhindert die unbeabsichtigte Installation solcher Pakete.

### 5. Wie gehst du vor, wenn begrenzte Patch-Ressourcen auf Komponenten mit hoher CVE-Anzahl, aber geringer tatsächlicher Nutzung verwendet werden?

**Antwort:** Ich führe eine Erreichbarkeitsanalyse ein, um zu prüfen, welche der gefundenen Schwachstellen tatsächlich vom Anwendungscode aufgerufen werden, und priorisiere Patches entsprechend nach tatsächlichem Risiko statt reiner CVE-Anzahl.

### 6. Widersprüchliche Anforderung: Sicherheitsteam will jede gefundene CVE unabhängig von Erreichbarkeit sofort patchen UND Entwicklungsteam hat begrenzte Kapazität für ständige, unpriorisierte Patch-Zyklen — wie gehst du vor?

**Antwort:** Ich würde eine risikobasierte Priorisierung vorschlagen, die kritische, tatsächlich erreichbare Schwachstellen mit hoher Dringlichkeit behandelt, während nicht erreichbare Schwachstellen mit geringerer Priorität, aber dennoch dokumentiert und zeitversetzt gepatcht werden — dies erfüllt die Sicherheitsanforderung, alle bekannten Schwachstellen letztlich zu adressieren, während die begrenzte Entwicklungskapazität zuerst auf das tatsächlich größte Risiko konzentriert wird.

## Praktische Labs

~~~python
# Local, deterministic simulation of reachability-based vs raw-CVE-count prioritization (executed locally, no real scanner):

def prioritize(components):
    return sorted(components, key=lambda c: (not c["reachable"], -c["severity"]))

components = [
    {"name": "libA", "cve_count": 12, "severity": 7, "reachable": False},
    {"name": "libB", "cve_count": 2, "severity": 9, "reachable": True},
]

for c in prioritize(components):
    print(f"{c['name']}: cve_count={c['cve_count']}, severity={c['severity']}, reachable={c['reachable']}")
~~~

## Dependencies, Cross-References und Quellen

1. Trivy-Dokumentation: [Vulnerability Scanning Overview](https://aquasecurity.github.io/trivy/latest/docs/scanner/vulnerability/), abgerufen 2026-09-18.
2. OWASP-Dokumentation: [Dependency Confusion Attack](https://owasp.org/www-community/attacks/Dependency_Confusion), abgerufen 2026-09-18.

SBOM und Komponenteninventare sind kanonisch in [KB-0529](17-sbom-und-komponenteninventare.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Call-Graph-basierte Erreichbarkeitsanalyse direkt in Standard-Dependency-Scannern integriert | Evaluating | Gegenüber manueller oder separater Erreichbarkeitsprüfung erst nach Prüfung der tatsächlichen Genauigkeit für komplexe, dynamisch aufgerufene Codepfade bevorzugen. |

Ein Team akzeptiert eine Dependency-Security-Praxis erst, wenn Patch-Priorisierung nachweislich auf tatsächlicher Erreichbarkeit und Exponiertheit basiert, statt lediglich auf der Rohzahl gefundener CVEs.
