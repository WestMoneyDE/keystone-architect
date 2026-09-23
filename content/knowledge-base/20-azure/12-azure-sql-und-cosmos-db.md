---
{"id": "KB-0492", "title": "Azure SQL und Cosmos DB", "domain": "20", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0474", "concepts": ["RDS und Aurora"], "needed_for": "understanding"}, {"id": "KB-0475", "concepts": ["Amazon DynamoDB"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Azure-SQL-Datenbank und ein Cosmos-DB-Konto mit einer konfigurierten Konsistenzstufe anhand offizieller Dokumentation strukturieren können und die fünf verfügbaren Cosmos-DB-Konsistenzstufen erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung begründet zwischen Azure SQL (relational) und Cosmos DB (multi-modell, global verteilt) entscheiden, basierend auf tatsächlichen Konsistenz-, Partitionierungs- und globalen Verteilungsanforderungen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Leseinkonsistenz in Cosmos DB auf eine zu schwache, für den Anwendungsfall ungeeignete Konsistenzstufe zurückführen können, statt einen Datenbankfehler anzunehmen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Datenbankplattform-Richtlinien im Unternehmen anhand explizit geprüfter Konsistenzanforderungen statt anhand einer pauschalen Standardkonfiguration festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Cosmos-DB-Multi-Modell-Speicher-Engines im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Konsistenzstufen, Partitionierung und globaler Verteilung als Entscheidungsgrundlage, nicht die Speicher-Engine-Interna."}}, "lab_validation": [{"lab_id": "KB-0492-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-SQL- und Cosmos-DB-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Azure SQL als verwalteter, relationaler Datenbankdienst funktioniert, wie Cosmos DB als global verteilter, multi-modell-fähiger Datenbankdienst fünf abgestufte Konsistenzstufen (von stark bis eventual) anbietet, die jeweils unterschiedliche Trade-offs zwischen Konsistenz, Verfügbarkeit und Latenz darstellen, und warum die Wahl der Konsistenzstufe explizit gegen die tatsächlichen Anwendungsanforderungen geprüft werden muss, statt eine Standardeinstellung unreflektiert zu übernehmen.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Azure-SQL- oder Cosmos-DB-Konfiguration erstellt."}]}
---
# Azure SQL und Cosmos DB

> **Ziel:** Azure SQL ist ein verwalteter, relationaler Datenbankdienst, strukturell vergleichbar mit Amazon RDS (siehe [KB-0474](../19-aws/12-rds-und-aurora.md)), während Cosmos DB ein global verteilter, multi-modell-fähiger Datenbankdienst ist, der sowohl dokumentorientierte als auch andere Datenmodelle unterstützt, mit einem Fokus auf globale Verteilung und konfigurierbare Konsistenz — strukturell am ehesten vergleichbar mit Amazon DynamoDB (siehe [KB-0475](../19-aws/13-amazon-dynamodb.md)), jedoch mit einem deutlich granulareren, explizit wählbaren Konsistenzmodell. Der zentrale Punkt dieses Kapitels ist, dass Cosmos DB fünf abgestufte Konsistenzstufen bereitstellt (von "Strong" bis "Eventual"), die jeweils unterschiedliche Trade-offs zwischen Konsistenz, Verfügbarkeit und Latenz darstellen — eine unerwartete Leseinkonsistenz (ein Lesevorgang liefert nicht den zuletzt geschriebenen Wert) ist bei Cosmos DB typischerweise nicht auf einen Datenbankfehler zurückzuführen, sondern auf eine bewusst oder unbewusst gewählte, für den tatsächlichen Anwendungsfall zu schwache Konsistenzstufe.

## Zweck, Mental Model und Dependencies

Azure SQL folgt dem klassischen relationalen Modell mit garantierter, starker Konsistenz innerhalb einer Datenbankinstanz, analog zu anderen verwalteten relationalen Datenbankdiensten — geeignet für Anwendungsfälle, die stark strukturierte Daten, komplexe Abfragen über mehrere Tabellen (Joins), und transaktionale Konsistenz benötigen. Cosmos DB verfolgt einen fundamental anderen Ansatz: Es unterstützt mehrere Datenmodelle (dokumentorientiert, Schlüssel-Wert, Graph, spaltenorientiert) über eine gemeinsame, zugrunde liegende Infrastruktur, und ist von Grund auf für globale Verteilung konzipiert — Daten können über mehrere Azure-Regionen hinweg repliziert werden, wobei die tatsächliche Konsistenzgarantie zwischen diesen Regionen explizit über eine von fünf Konsistenzstufen konfiguriert wird: "Strong" (stärkste Konsistenz, jeder Lesevorgang erhält garantiert die zuletzt geschriebene Version, jedoch mit höherer Latenz und reduzierter Verfügbarkeit bei regionalen Netzwerkproblemen), "Bounded Staleness" (Lesevorgänge können um eine definierte, begrenzte Zeit oder Anzahl von Versionen hinter dem aktuellsten Schreibvorgang zurückliegen), "Session" (innerhalb einer einzelnen Client-Sitzung garantiert konsistent, zwischen unterschiedlichen Sitzungen jedoch potenziell inkonsistent), "Consistent Prefix" (Lesevorgänge sehen niemals Schreibvorgänge außerhalb ihrer tatsächlichen Reihenfolge, können jedoch hinter dem aktuellsten Stand zurückliegen), und "Eventual" (schwächste Konsistenz, aber niedrigste Latenz und höchste Verfügbarkeit, ohne Garantie über die Reihenfolge sichtbarer Änderungen). Der zentrale methodische Punkt ist, dass diese Konsistenzstufe explizit anhand der tatsächlichen Anwendungsanforderungen gewählt werden muss — eine Anwendung, die eine schwächere Konsistenzstufe (z. B. "Eventual") aus Latenz- oder Kostengründen nutzt, ohne zu prüfen, ob die Anwendungslogik tatsächlich mit potenziell veralteten oder außerhalb der Reihenfolge sichtbaren Daten umgehen kann, wird typischerweise unerwartete, schwer diagnostizierbare Inkonsistenzen erleben, die nicht auf einen Datenbankfehler, sondern auf eine Diskrepanz zwischen der gewählten Konsistenzgarantie und der tatsächlichen Anwendungsanforderung zurückzuführen sind.

~~~text
Azure SQL: classic relational model, STRONG consistency within an instance
  (parallel to Amazon RDS, see KB-0474) -- structured data, joins, transactional consistency
Cosmos DB: MULTI-MODEL (document, key-value, graph, column-family), GLOBALLY distributed from the ground up
  (structurally closest to DynamoDB, see KB-0475, but with FAR more granular, explicit consistency control)
FIVE consistency levels:
  Strong: guaranteed latest version on EVERY read -- HIGHER latency, REDUCED availability during regional issues
  Bounded Staleness: reads may lag by a DEFINED, bounded time/version count
  Session: consistent WITHIN one client session, potentially inconsistent ACROSS sessions
  Consistent Prefix: reads never see writes OUT OF ORDER, but MAY lag behind latest
  Eventual: weakest -- lowest latency, highest availability, NO ordering guarantee
KEY METHODOLOGICAL POINT: consistency level MUST be chosen EXPLICITLY against ACTUAL app requirements
  app using a weaker level (e.g. Eventual) for latency/cost reasons
  WITHOUT checking if app logic can actually handle stale/out-of-order data
  -> unexpected, hard-to-diagnose inconsistencies -- NOT a database bug
     -- a mismatch between chosen guarantee and actual application need
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Azure SQL | verwalteter, relationaler Datenbankdienst | geeignet für strukturierte Daten mit transaktionaler Konsistenz |
| Cosmos DB | multi-modell, global verteilt | Konsistenzstufe muss explizit gewählt werden |
| Konsistenzstufen (5) | Trade-off zwischen Konsistenz, Verfügbarkeit, Latenz | müssen gegen tatsächliche Anwendungsanforderungen geprüft werden |
| Globale Verteilung | repliziert Daten über mehrere Regionen | Konsistenzgarantie gilt explizit für diese regionsübergreifende Replikation |

Implementierung: Für jede Cosmos-DB-Nutzung wird die Konsistenzstufe explizit anhand der tatsächlichen Anwendungsanforderungen gewählt, statt die Standardeinstellung unreflektiert zu übernehmen — insbesondere wird geprüft, ob die Anwendungslogik tatsächlich mit den Konsequenzen einer schwächeren Konsistenzstufe (potenziell veraltete oder außerhalb der Reihenfolge sichtbare Daten) korrekt umgehen kann. Für Anwendungsfälle mit tatsächlichem Bedarf an komplexen relationalen Abfragen und transaktionaler Konsistenz wird Azure SQL bevorzugt, während für Anwendungsfälle mit tatsächlichem Bedarf an globaler Verteilung und flexibler, nicht-relationaler Datenmodellierung Cosmos DB evaluiert wird. Bei Cosmos DB wird zusätzlich das Partitionsschlüssel-Design (analog zur DynamoDB-Logik, siehe [KB-0475](../19-aws/13-amazon-dynamodb.md)) anhand tatsächlicher Zugriffsmuster geprüft, um Hot-Partition-Risiken zu vermeiden.

## Scalability, Reliability, Security und Observability

Cosmos DB skaliert die effektive Lese-/Schreibkapazität und globale Verfügbarkeit proportional zur Passgenauigkeit der gewählten Konsistenzstufe zum tatsächlichen Anwendungsbedarf; die Reliability-Grenze liegt darin, dass eine zu schwach gewählte Konsistenzstufe proportional zur Häufigkeit paralleler Schreibvorgänge zu unerwarteten, schwer diagnostizierbaren Inkonsistenzen führt, die nicht als Datenbankfehler, sondern als Konfigurationsentscheidung zu verstehen sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Lesevorgang liefert nicht den zuletzt geschriebenen Wert | die konfigurierte Konsistenzstufe (z. B. Eventual oder Consistent Prefix) garantiert keine unmittelbare Sichtbarkeit des letzten Schreibvorgangs | die tatsächlich konfigurierte Konsistenzstufe prüfen und gegen die tatsächliche Anwendungsanforderung abwägen |
| die Latenz oder Verfügbarkeit ist bei Strong-Konsistenz geringer als erwartet | Strong-Konsistenz erfordert höhere Latenz und kann bei regionalen Netzwerkproblemen die Verfügbarkeit einschränken | prüfen, ob eine schwächere, für den Anwendungsfall tatsächlich ausreichende Konsistenzstufe genutzt werden könnte |
| eine Cosmos-DB-Partition zeigt ungleichmäßige Auslastung | der Partitionsschlüssel weist geringe Kardinalität oder ungleichmäßige Zugriffsverteilung auf | die Zugriffsverteilung über Partitionsschlüsselwerte analysieren und den Schlüssel gegebenenfalls neu gestalten |

Security: Cosmos-DB- und Azure-SQL-Zugriff sollte über Azure RBAC mit Managed Identities erfolgen, analog zur allgemeinen Azure-Storage-Praxis, statt auf dauerhafte Zugangsschlüssel zurückzugreifen. Observability: Die tatsächlich beobachtete Leseinkonsistenz-Rate relativ zur konfigurierten Konsistenzstufe, die Partitionsauslastungsverteilung bei Cosmos DB, und die tatsächliche Ende-zu-Ende-Latenz je nach Konsistenzstufe sind zentrale Metriken zur Bewertung der Datenbankarchitektur.

## Trade-offs und Entscheidungen

**Staff** wählt die Cosmos-DB-Konsistenzstufe explizit anhand der tatsächlichen Anwendungsanforderungen, statt die Standardeinstellung zu übernehmen. **Principal** macht die Konsistenz-/Verfügbarkeits-/Latenz-Trade-offs für das Team nachvollziehbar. **Chief** legt Datenbankplattform-Richtlinien im Unternehmen anhand explizit geprüfter Konsistenzanforderungen fest.

Anti-Patterns: eine schwächere Cosmos-DB-Konsistenzstufe aus Latenz- oder Kostengründen wählen, ohne zu prüfen, ob die Anwendungslogik tatsächlich mit den resultierenden Konsequenzen umgehen kann; Azure SQL für einen Anwendungsfall mit tatsächlichem Bedarf an globaler Verteilung einsetzen, wo Cosmos DB besser geeignet wäre; das Partitionsschlüssel-Design bei Cosmos DB ohne Berücksichtigung tatsächlicher Zugriffsmuster vornehmen.

## Production Checklist

- [ ] Die Cosmos-DB-Konsistenzstufe ist explizit anhand der tatsächlichen Anwendungsanforderungen gewählt.
- [ ] Die Wahl zwischen Azure SQL und Cosmos DB ist anhand tatsächlicher Konsistenz- und Verteilungsanforderungen begründet.
- [ ] Das Partitionsschlüssel-Design bei Cosmos DB ist gegen tatsächliche Zugriffsmuster geprüft.
- [ ] Datenbankzugriff erfolgt über RBAC mit Managed Identities statt dauerhafter Zugangsschlüssel.

## Interviewfragen

### 1. Was unterscheidet Azure SQL strukturell von Cosmos DB?

**Antwort:** Azure SQL ist ein klassischer, relationaler Datenbankdienst mit starker Konsistenz; Cosmos DB ist ein multi-modell-fähiger, global verteilter Dienst mit explizit konfigurierbaren Konsistenzstufen.

### 2. Welche fünf Konsistenzstufen bietet Cosmos DB?

**Antwort:** Strong (stärkste Garantie, höhere Latenz), Bounded Staleness, Session, Consistent Prefix, und Eventual (schwächste Garantie, niedrigste Latenz).

### 3. Warum kann ein Lesevorgang in Cosmos DB nicht den zuletzt geschriebenen Wert liefern, ohne dass ein Fehler vorliegt?

**Antwort:** Weil eine schwächere, konfigurierte Konsistenzstufe (z. B. Eventual oder Consistent Prefix) keine unmittelbare Sichtbarkeit des letzten Schreibvorgangs garantiert — dies ist beabsichtigtes, dokumentiertes Verhalten der gewählten Konfiguration.

### 4. Welchen Trade-off stellt die Strong-Konsistenzstufe dar?

**Antwort:** Garantierte Sichtbarkeit des zuletzt geschriebenen Werts bei jedem Lesevorgang, jedoch mit höherer Latenz und reduzierter Verfügbarkeit bei regionalen Netzwerkproblemen.

### 5. Wie gehst du vor, wenn ein Lesevorgang unerwartet nicht den zuletzt geschriebenen Wert liefert?

**Antwort:** Ich prüfe die tatsächlich konfigurierte Konsistenzstufe und ob sie tatsächlich für den Anwendungsfall geeignet ist, statt einen Datenbankfehler anzunehmen, da dieses Verhalten bei schwächeren Konsistenzstufen dokumentiert und beabsichtigt ist.

### 6. Widersprüchliche Anforderung: Team will maximale globale Verfügbarkeit und niedrige Latenz (Eventual Consistency) UND garantiert konsistente Leseergebnisse für kritische Transaktionen — wie gehst du vor?

**Antwort:** Ich würde eine differenzierte Konsistenzstufen-Zuordnung vornehmen: kritische, konsistenzsensitive Operationen mit Strong oder Bounded Staleness, während weniger kritische, latenzsensitive Lesezugriffe mit Eventual Consistency arbeiten, statt eine pauschale Konsistenzstufe für die gesamte Anwendung zu wählen.

## Praktische Labs

~~~python
# Conceptual consistency-level tradeoff illustration (not executed against a real Cosmos DB account):

def estimate_consistency_tradeoff(consistency_level):
    tradeoffs = {
        "Strong": {"latency": "HIGH", "availability": "REDUCED during regional issues", "staleness_risk": "NONE"},
        "Bounded Staleness": {"latency": "MEDIUM", "availability": "HIGH", "staleness_risk": "BOUNDED"},
        "Session": {"latency": "LOW", "availability": "HIGH", "staleness_risk": "ACROSS SESSIONS"},
        "Consistent Prefix": {"latency": "LOW", "availability": "HIGH", "staleness_risk": "ORDERED BUT LAGGING"},
        "Eventual": {"latency": "LOWEST", "availability": "HIGHEST", "staleness_risk": "UNBOUNDED, unordered"},
    }
    return tradeoffs.get(consistency_level, "unknown level")

for level in ["Strong", "Eventual"]:
    print(f"{level}: {estimate_consistency_tradeoff(level)}")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Cosmos DB — Consistency Levels](https://learn.microsoft.com/en-us/azure/cosmos-db/consistency-levels), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure SQL Database — Overview](https://learn.microsoft.com/en-us/azure/azure-sql/database/sql-database-paas-overview), abgerufen 2026-09-18.

RDS und Aurora sind kanonisch in [KB-0474](../19-aws/12-rds-und-aurora.md) behandelt; Amazon DynamoDB in [KB-0475](../19-aws/13-amazon-dynamodb.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, dynamische Konsistenzstufen-Anpassung pro Anfrage innerhalb von Cosmos DB, die eine feingranularere Steuerung als eine globale Konto-Konsistenzstufe ermöglicht | Adopting | Gegenüber einer einzigen, kontoweiten Konsistenzstufe bevorzugen, sobald der tatsächliche Bedarf an unterschiedlichen Konsistenzanforderungen pro Anfragetyp geprüft ist. |

Ein Team akzeptiert eine Cosmos-DB-Konfiguration erst, wenn die gewählte Konsistenzstufe nachweislich gegen die tatsächlichen Anwendungsanforderungen geprüft und die Anwendungslogik auf die resultierenden Konsequenzen (z. B. mögliche Staleness) vorbereitet ist.
