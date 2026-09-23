---
{"id": "KB-0535", "title": "Deployment-Rollback und Datenfolgen", "domain": "22", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0526", "concepts": ["Release-Strategien"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Rollback auf vorherige Artefakte und Konfiguration anhand etablierter Praktiken korrekt durchführen und dabei irreversible Migrationen erkennen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung explizit entscheiden, wann ein klassischer Rollback möglich ist und wann stattdessen ein Roll-Forward mit gezieltem Fix die einzig sichere Option ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen fehlgeschlagenen Rollback-Versuch auf eine irreversible Datenmigration oder Zustandsdrift zurückführen können, die einen einfachen Artefakt-Rollback technisch unmöglich macht.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards festlegen, die für jede Änderung mit Datenfolgen explizit zwischen Rollback-Fähigkeit und Roll-Forward-Notwendigkeit unterscheiden, statt Rollback pauschal als universelle Rettungsoption anzunehmen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailimplementierung spezifischer Datenbankmigrationswerkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Grenzen von Artefakt-Rollback bei Datenfolgen und die Roll-Forward-Alternative, nicht die migrationswerkzeugspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0535-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation irreversibler Zustandsdrift nach einem fehlgeschlagenen Rollback-Versuch, kein produktives Deployment-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein Rollback auf eine vorherige Anwendungsversion nach bereits erfolgter, irreversibler Datenmigration (z. B. destruktiv umgewandelte Datensätze) zu einem inkonsistenten Zustand führt, da die zurückgesetzte Anwendungsversion Daten in einem Format erwartet, das nicht mehr existiert, und zeigt damit, warum ein Roll-Forward mit gezieltem Fix in solchen Fällen die einzig sichere Option ist.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Deployment-System mit tatsächlicher Datenbankdynamik."}]}
---
# Deployment-Rollback und Datenfolgen

> **Ziel:** Ein klassischer Deployment-Rollback stellt das vorherige **Artefakt** und die vorherige **Konfiguration** wieder her — dies funktioniert zuverlässig, solange keine begleitende Datenänderung stattgefunden hat, die mit der vorherigen Version inkompatibel ist. Der zentrale Punkt dieses Kapitels (aufbauend auf der in [KB-0526](14-release-strategien.md) behandelten Grundlage) ist, dass bestimmte Datenfolgen einen Rollback strukturell unmöglich machen, unabhängig davon, wie technisch korrekt der Artefakt-Rollback-Mechanismus selbst funktioniert: **Irreversible Migrationen** (destruktive Datenumwandlungen, bei denen die ursprüngliche Datenform nicht mehr existiert) und **Zustandsdrift** (der tatsächliche Datenzustand hat sich seit dem letzten bekannten Zustand der vorherigen Version durch neue, mit dieser Version inkompatible Schreibvorgänge verändert) bedeuten, dass ein Zurücksetzen der Anwendung auf die vorherige Version zu einem inkonsistenten Zustand führt, da diese Version Daten in einer Form erwartet, die nicht mehr existiert oder mit neueren Daten kollidiert. In solchen Fällen ist **Roll-Forward** (ein gezielter Fix, der auf der aktuellen, fehlerhaften Version aufbaut, statt zu einer älteren zurückzukehren) die einzig sichere Option.

## Zweck, Mental Model und Dependencies

Ein Deployment-Rollback funktioniert im einfachsten Fall zuverlässig, wenn eine Anwendung zustandslos ist oder ihre gesamte Zustandsänderung reversibel und mit der vorherigen Version kompatibel bleibt — das vorherige Artefakt wird erneut deployt, die vorherige Konfiguration angewendet, und die Anwendung verhält sich wieder wie zuvor. Die Komplikation entsteht, sobald eine Änderung Datenfolgen hat, die über die reine Anwendungslogik hinausgehen: Eine irreversible Migration, etwa das destruktive Löschen einer Spalte, das Zusammenführen mehrerer Datensätze zu einem, oder eine verlustbehaftete Formatkonvertierung, bedeutet, dass die ursprüngliche Datenform nach der Migration nicht mehr existiert — selbst wenn die vorherige Anwendungsversion erneut deployt wird, findet sie die von ihr erwarteten Daten nicht mehr vor, was zu Fehlern oder inkonsistentem Verhalten führt, nicht zu einer erfolgreichen Wiederherstellung des vorherigen Zustands. Zustandsdrift ist ein verwandtes, aber unterschiedliches Problem: Selbst wenn keine destruktive Migration stattfand, kann die neue Anwendungsversion zwischen ihrem Deployment und dem späteren Rollback-Versuch neue Daten in einem Format geschrieben haben, das nur sie selbst versteht — die zurückgesetzte, vorherige Version trifft dann auf Daten, die sie nicht korrekt interpretieren kann, obwohl keine explizite, destruktive Migration stattgefunden hat. In beiden Fällen ist ein Roll-Forward die strukturell sicherere Alternative: Statt zu einer älteren Version zurückzukehren, die mit dem aktuellen Datenzustand inkompatibel ist, wird ein gezielter Fix auf Basis der aktuellen, fehlerhaften Version entwickelt und deployt, der das eigentliche Problem behebt, ohne die zwischenzeitlich entstandene, möglicherweise bereits irreversible Datenrealität zu ignorieren. Die entscheidende architektonische Konsequenz ist, dass Rollback-Fähigkeit nicht als selbstverständliche, universelle Eigenschaft jeder Änderung angenommen werden darf, sondern für jede Änderung mit Datenfolgen explizit bewertet werden muss, bevor diese Änderung ausgerollt wird — nicht erst im Ernstfall, wenn ein Rollback tatsächlich benötigt, aber technisch nicht mehr möglich ist.

~~~text
Deployment Rollback: restores previous ARTIFACT + CONFIG
  works RELIABLY when: stateless app, OR all state changes reversible/compatible with previous version
COMPLICATION: data consequences beyond app logic
  Irreversible migration: destructive transform (dropped column, merged records, lossy format conversion)
    -> original data form NO LONGER EXISTS after migration
    -> rolled-back previous version expects data it can't find -> errors, NOT successful restoration
  State drift: new version writes NEW data in a format ONLY IT understands
    -> even WITHOUT explicit destructive migration
    -> rolled-back previous version encounters data it cannot correctly interpret
BOTH cases -> ROLL-FORWARD is the structurally SAFER alternative
  targeted fix built ON TOP of current (broken) version
  vs reverting to an OLDER version incompatible with current actual data reality
KEY ARCHITECTURAL CONSEQUENCE: rollback capability is NOT a given for every change
  MUST be explicitly assessed for every data-consequential change BEFORE rollout
    -> not discovered too late, in the actual emergency, when rollback turns out technically impossible
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Klassischer Rollback | Wiederherstellung von Artefakt und Konfiguration | funktioniert nur bei zustandslosen oder kompatiblen Änderungen |
| Irreversible Migration | destruktive Datenumwandlung ohne ursprüngliche Form | macht Rollback zur vorherigen Version technisch unmöglich |
| Zustandsdrift | neue, mit vorheriger Version inkompatible Daten ohne destruktive Migration | erzeugt dieselbe Rollback-Unmöglichkeit wie irreversible Migration |
| Roll-Forward | gezielter Fix auf aktueller Version statt Rückkehr zur alten | sichere Alternative bei irreversiblen Datenfolgen |

Implementierung: Vor jeder Änderung mit Datenfolgen wird explizit geprüft, ob sie irreversibel ist oder Zustandsdrift erzeugt, die einen Rollback zur vorherigen Version unmöglich machen würde. Bei irreversiblen Änderungen wird ein Roll-Forward-Plan als primäre Notfallstrategie vorbereitet, statt sich auf einen technisch nicht mehr möglichen Rollback zu verlassen. Die tatsächliche Rollback-Fähigkeit wird vor produktivem Rollout einer riskanten Änderung explizit getestet, nicht erst im Ernstfall angenommen.

## Scalability, Reliability, Security und Observability

Deployment-Rollback skaliert die tatsächliche Notfallfähigkeit proportional zur expliziten Vorab-Bewertung von Datenfolgen; die Reliability-Grenze liegt darin, dass eine unbewertete irreversible Migration oder Zustandsdrift proportional zu ihrer Häufigkeit die tatsächliche Rollback-Fähigkeit im Ernstfall untergräbt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Rollback-Versuch schlägt fehl oder führt zu inkonsistentem Verhalten | eine irreversible Datenmigration oder Zustandsdrift hat seit dem Deployment der neuen Version stattgefunden | prüfen, ob die betroffenen Daten mit der vorherigen Version noch kompatibel sind, und bei Inkompatibilität auf Roll-Forward wechseln |
| eine Notfallreaktion verzögert sich, weil unklar ist, ob Rollback möglich ist | die Rollback-Fähigkeit wurde vor dem Rollout nicht explizit geprüft oder dokumentiert | die Rollback-Fähigkeit für jede riskante Änderung explizit vor dem produktiven Rollout testen und dokumentieren |
| ein Roll-Forward-Fix wird unter Zeitdruck fehlerhaft entwickelt | kein vorbereiteter Roll-Forward-Plan existiert, die Reaktion erfolgt vollständig ad hoc | für Änderungen mit bekannter Rollback-Unmöglichkeit einen vorbereiteten Roll-Forward-Prozess etablieren |

Security: Irreversible Datenoperationen (destruktives Löschen, Formatkonvertierung) sollten mit besonderer Vorsicht und, wo möglich, mit einer Zwischenphase erfolgen, die eine begrenzte Rückwärtskompatibilität aufrechterhält, statt sofort vollständig destruktiv zu sein. Observability: Die tatsächliche, getestete Rollback-Fähigkeit pro Änderungstyp, sowie die Häufigkeit von Roll-Forward- statt Rollback-Reaktionen bei Vorfällen, sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** führt einen Rollback für eine gegebene, kompatible Änderung korrekt durch. **Principal** bewertet für jede riskante Änderung explizit die Rollback-Fähigkeit und bereitet bei Bedarf einen Roll-Forward-Plan vor. **Chief** legt unternehmensweite Standards fest, die Rollback-Fähigkeit nicht pauschal voraussetzen, sondern für jede Änderung mit Datenfolgen explizit bewerten.

Anti-Patterns: eine Datenmigration ohne vorherige Prüfung der Rollback-Kompatibilität mit der vorherigen Anwendungsversion durchführen; Rollback-Fähigkeit pauschal als selbstverständlich annehmen, ohne sie vor produktivem Rollout zu testen; im Ernstfall ohne vorbereiteten Roll-Forward-Plan unter Zeitdruck improvisieren.

## Production Checklist

- [ ] Jede Änderung mit Datenfolgen wird vor Rollout explizit auf Rollback-Kompatibilität geprüft.
- [ ] Für Änderungen mit bekannter Rollback-Unmöglichkeit existiert ein vorbereiteter Roll-Forward-Plan.
- [ ] Die tatsächliche Rollback-Fähigkeit wird vor produktivem Rollout riskanter Änderungen getestet.
- [ ] Irreversible Datenoperationen erfolgen, wo möglich, mit einer Zwischenphase begrenzter Rückwärtskompatibilität.

## Interviewfragen

### 1. Wann funktioniert ein klassischer Deployment-Rollback zuverlässig?

**Antwort:** Wenn die Anwendung zustandslos ist oder alle Zustandsänderungen reversibel und mit der vorherigen Version kompatibel bleiben.

### 2. Was ist der Unterschied zwischen einer irreversiblen Migration und Zustandsdrift?

**Antwort:** Eine irreversible Migration ist eine explizite, destruktive Datenumwandlung, nach der die ursprüngliche Datenform nicht mehr existiert; Zustandsdrift entsteht, wenn die neue Version neue Daten in einem Format schreibt, das die vorherige Version nicht versteht, ohne dass eine explizite destruktive Migration stattgefunden hat.

### 3. Warum ist Roll-Forward in Fällen irreversibler Datenfolgen sicherer als ein klassischer Rollback?

**Antwort:** Weil ein Roll-Forward auf der aktuellen, tatsächlichen Datenrealität aufbaut, während ein Rollback zur vorherigen Version auf Daten trifft, die sie nicht korrekt interpretieren kann, was zu Fehlern statt erfolgreicher Wiederherstellung führt.

### 4. Warum sollte Rollback-Fähigkeit nicht als selbstverständliche Eigenschaft jeder Änderung angenommen werden?

**Antwort:** Weil bestimmte Datenfolgen (irreversible Migration, Zustandsdrift) einen Rollback strukturell unmöglich machen können, unabhängig von der technischen Korrektheit des Rollback-Mechanismus selbst — dies muss explizit vor dem Rollout bewertet werden.

### 5. Wie gehst du vor, wenn ein Rollback-Versuch nach einem fehlgeschlagenen Deployment zu inkonsistentem Verhalten führt?

**Antwort:** Ich prüfe, ob seit dem Deployment der neuen Version eine irreversible Datenmigration oder Zustandsdrift stattgefunden hat, und wechsle bei Inkompatibilität auf einen Roll-Forward mit gezieltem Fix statt eines weiteren Rollback-Versuchs.

### 6. Widersprüchliche Anforderung: Team will schnelle, destruktive Datenmigrationen zur Vereinfachung der Codebasis UND garantierte Rollback-Fähigkeit für jede Änderung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass destruktive Migrationen und garantierte Rollback-Fähigkeit sich strukturell widersprechen, und vorschlagen, Migrationen in reversible Zwischenschritte aufzuteilen (etwa eine Übergangsphase mit paralleler Unterstützung alter und neuer Datenform), bevor die tatsächliche Destruktion erfolgt, sodass ein Rollback während der Übergangsphase möglich bleibt, während die endgültige Vereinfachung erst nach ausreichender Stabilitätsbestätigung durchgeführt wird.

## Praktische Labs

~~~python
# Local, deterministic simulation of rollback compatibility check for a pending migration (executed locally, no real deployment system):

def assess_rollback_capability(migration_is_destructive, previous_version_reads_new_format):
    if migration_is_destructive:
        return "ROLLBACK IMPOSSIBLE: original data form no longer exists -- roll-forward required"
    if not previous_version_reads_new_format:
        return "ROLLBACK RISKY: state drift -- previous version cannot interpret new data format"
    return "rollback capability preserved"

print(assess_rollback_capability(migration_is_destructive=True, previous_version_reads_new_format=False))
print(assess_rollback_capability(migration_is_destructive=False, previous_version_reads_new_format=True))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Dokumentation: [DevOps Tech: Database Change Management](https://cloud.google.com/architecture/devops/devops-tech-database-change-management), abgerufen 2026-09-18.
2. Martin-Fowler-Dokumentation: [Evolutionary Database Design](https://martinfowler.com/articles/evodb.html), abgerufen 2026-09-18.

Release-Strategien sind kanonisch in [KB-0526](14-release-strategien.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Rollback-Kompatibilitätsprüfung, die vor Deployment prüft, ob die vorherige Anwendungsversion mit dem geplanten neuen Datenzustand kompatibel bleibt | Evaluating | Gegenüber rein manueller Kompatibilitätsprüfung erst nach Prüfung der tatsächlichen Erkennungsgenauigkeit für komplexe Datenmigrationsszenarien bevorzugen. |

Ein Team akzeptiert eine Deployment-Strategie erst, wenn Rollback-Fähigkeit oder ein vorbereiteter Roll-Forward-Plan nachweislich vor dem produktiven Rollout jeder Änderung mit Datenfolgen bewertet wurde.
