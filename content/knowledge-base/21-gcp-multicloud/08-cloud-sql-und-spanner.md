---
{"id": "KB-0506", "title": "Cloud SQL und Spanner", "domain": "21", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0505", "concepts": ["Cloud Storage"], "needed_for": "context"}, {"id": "KB-0474", "concepts": ["RDS und Aurora"], "needed_for": "context"}, {"id": "KB-0492", "concepts": ["Azure SQL und Cosmos DB"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Cloud SQL und Spanner anhand offizieller Dokumentation korrekt für fachliche Datenanforderungen (Skalierung, Transaktionsgarantien, Standortwahl) auswählen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Datenarchitektur explizit entscheiden, ob eine klassische verwaltete relationale Datenbank (Cloud SQL) oder eine global verteilte, horizontal skalierbare Datenbank (Spanner) den tatsächlichen Skalierungs- und Konsistenzanforderungen entspricht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Skalierungsgrenze oder überhöhte Kosten auf die Nutzung von Spanner für eine Anwendung zurückführen können, deren tatsächlicher Skalierungsbedarf mit Cloud SQL ausreichend gedeckt gewesen wäre, oder umgekehrt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Datenbankauswahlstandards im Unternehmen anhand einer klaren Abgrenzung zwischen Cloud-SQL- und Spanner-geeigneten Anwendungsfällen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des TrueTime-basierten Spanner-Konsistenzmechanismus im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Skalierungs- und Konsistenz-Trade-offs als Entscheidungsgrundlage, nicht die TrueTime-Interna."}}, "lab_validation": [{"lab_id": "KB-0506-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu Cloud SQL und Spanner, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie Cloud SQL als klassische verwaltete relationale Datenbank (MySQL/PostgreSQL/SQL Server) mit vertikaler Skalierung und begrenzter horizontaler Lesereplikation funktioniert, während Spanner eine global verteilte, horizontal skalierbare relationale Datenbank mit starker externer Konsistenz über Regionen hinweg bietet, mit entsprechend höherer Komplexität und Kosten, im Vergleich zur analogen AWS-RDS/Aurora- und Azure-SQL/Cosmos-DB-Logik.", "limitations": "Kein aktives GCP-Konto verwendet, keine reale Datenbankinstanz erstellt."}]}
---
# Cloud SQL und Spanner

> **Ziel:** Cloud SQL ist eine klassische verwaltete relationale Datenbank (MySQL, PostgreSQL, SQL Server) mit vertikaler Skalierung und begrenzter horizontaler Lesereplikation, strukturell vergleichbar mit AWS RDS (siehe [KB-0474](../19-aws/12-rds-und-aurora.md)) und Azure SQL Database (siehe [KB-0492](../20-azure/12-azure-sql-und-cosmos-db.md)). Spanner ist eine global verteilte, horizontal skalierbare relationale Datenbank mit starker externer Konsistenz (external consistency) über Regionen hinweg, basierend auf einem präzisen, hardwaregestützten Zeitsynchronisationsmechanismus (TrueTime), der garantiert, dass Transaktionen über global verteilte Knoten hinweg eine konsistente, global gültige Reihenfolge einhalten. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartete Skalierungsgrenze oder überhöhte Kosten häufig aus einer falschen Zuordnung zwischen Datenbanktyp und tatsächlichem Skalierungsbedarf entstehen — Spanner für eine Anwendung zu nutzen, deren Datenvolumen und Zugriffsmuster problemlos mit einer klassischen verwalteten Datenbank wie Cloud SQL bewältigbar wären, verursacht unnötige Komplexität und Kosten, während Cloud SQL für eine Anwendung mit echtem globalen, horizontal skalierenden Konsistenzbedarf an eine harte Skalierungsgrenze stößt.

## Zweck, Mental Model und Dependencies

Cloud SQL adressiert den klassischen Anwendungsfall einer relationalen Datenbank innerhalb einer einzelnen Region — es bietet vertraute SQL-Engines (MySQL, PostgreSQL, SQL Server) mit verwalteten Backups, automatischem Failover zwischen primärer und Standby-Instanz, und Lesereplikaten zur horizontalen Skalierung von Lesezugriffen, jedoch mit einer fundamentalen Skalierungsgrenze: Schreibzugriffe können letztlich nur vertikal skaliert werden (größere Instanz), und eine echte Multi-Region-Aktiv-Aktiv-Schreibarchitektur ist mit Cloud SQL nicht möglich. Spanner löst genau dieses Problem, indem es relationale Semantik (SQL, Schemas, ACID-Transaktionen) mit horizontaler Skalierung über beliebig viele Knoten und Regionen kombiniert — eine Kombination, die traditionell als Widerspruch galt (relationale Konsistenz versus horizontale Verteilung), da Spanner durch TrueTime (eine präzise, GPS- und Atomuhr-gestützte globale Zeitsynchronisation) eine garantierte, global konsistente Transaktionsreihenfolge ohne die üblichen Kompromisse verteilter Systeme erreicht. Diese Fähigkeit hat jedoch einen Preis: Spanner ist strukturell komplexer zu betreiben, teurer in der Grundausstattung (Mindestkapazität pro Knoten), und für Anwendungsfälle mit moderatem, innerhalb einer Region bewältigbarem Datenvolumen unverhältnismäßig — die Entscheidung zwischen Cloud SQL und Spanner sollte daher explizit anhand des tatsächlichen Skalierungsbedarfs (Wird eine globale, horizontal skalierende Schreiblast tatsächlich erwartet?) getroffen werden, nicht anhand einer pauschalen Präferenz für die "modernere" oder "leistungsfähigere" Option.

~~~text
Cloud SQL: classic managed relational DB (MySQL/PostgreSQL/SQL Server)
  (parallel to AWS RDS, KB-0474, and Azure SQL Database, KB-0492)
  vertical write scaling only, limited horizontal READ scaling via read replicas
  NO true multi-region active-active WRITE architecture possible
Spanner: GLOBALLY DISTRIBUTED, horizontally scalable relational DB
  -> combines relational semantics (SQL, schemas, ACID) + horizontal scale across MANY nodes/regions
  -> powered by TrueTime (GPS+atomic-clock-based global time sync)
     -> guarantees globally consistent transaction ordering WITHOUT usual distributed-systems trade-offs
  COST: structurally more complex to operate, higher baseline cost (min capacity per node)
DECISION CRITERION: actual scaling need, NOT preference for "more modern/powerful"
  moderate, single-region-bounded data volume -> Cloud SQL (Spanner = disproportionate complexity/cost)
  true global, horizontally-scaling write load -> Spanner (Cloud SQL hits a hard scaling wall)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Cloud SQL | klassische verwaltete relationale DB, vertikale Skalierung | für regional begrenzte, moderate Datenvolumen |
| Spanner | global verteilte, horizontal skalierbare relationale DB | für echten globalen, horizontal skalierenden Schreibbedarf |
| TrueTime | präzise globale Zeitsynchronisation | Grundlage für Spanners externe Konsistenz |
| Lesereplikate (Cloud SQL) | horizontale Skalierung von Lesezugriffen | keine Lösung für Schreibskalierungsgrenzen |

Implementierung: Für jede Datenbankentscheidung wird explizit der tatsächliche Skalierungsbedarf (regional versus global, Schreiblast-Wachstumserwartung) geprüft, bevor zwischen Cloud SQL und Spanner gewählt wird. Cloud-SQL-Instanzen werden mit Lesereplikaten für lesegetriebene Skalierung ausgestattet, wenn Schreibzugriffe innerhalb der vertikalen Skalierungsgrenze bleiben. Spanner wird nur eingesetzt, wenn ein nachweisbarer Bedarf an horizontaler, global konsistenter Schreibskalierung besteht, nicht als pauschale Standardwahl.

## Scalability, Reliability, Security und Observability

Cloud SQL und Spanner skalieren die Datenbankkapazität proportional zur korrekten Zuordnung zwischen Datenbanktyp und tatsächlichem Skalierungsbedarf; die Reliability-Grenze liegt darin, dass Cloud SQL bei echtem globalen, horizontal skalierenden Schreibbedarf an eine harte vertikale Skalierungsgrenze stößt, während Spanner für moderate, regional begrenzte Workloads unverhältnismäßige operative Komplexität verursacht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Cloud-SQL-Instanz erreicht eine Schreibskalierungsgrenze trotz größerer Instanzgröße | die Anwendung hat tatsächlich einen global horizontal skalierenden Schreibbedarf, der Cloud SQLs vertikale Skalierungsgrenze überschreitet | prüfen, ob ein Wechsel zu Spanner für den tatsächlichen Skalierungsbedarf gerechtfertigt ist |
| eine Spanner-Instanz verursacht unverhältnismäßig hohe Kosten für moderates Datenvolumen | die Anwendung nutzt Spanner ohne tatsächlichen Bedarf an globaler horizontaler Schreibskalierung | prüfen, ob Cloud SQL für das tatsächliche Datenvolumen und Zugriffsmuster ausreichend wäre |
| Leselatenz ist trotz Lesereplikaten unerwartet hoch | Lesereplikate sind nicht geografisch nah genug an den tatsächlichen Nutzern platziert | die Platzierung der Lesereplikate gegen die tatsächliche geografische Nutzerverteilung prüfen |

Security: Datenbankzugriff sollte über IAM-Datenbankauthentifizierung statt statischer Datenbank-Passwörter erfolgen, wo verfügbar, konsistent mit der übrigen GCP-Zugriffskontrollpraxis. Observability: Die tatsächliche Schreiblast relativ zur vertikalen Skalierungsgrenze von Cloud SQL, sowie die Konsistenzlatenz und Kostenverteilung von Spanner, sind zentrale Metriken zur Bewertung der Datenbankwahl.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Cloud SQL oder Spanner für eine gegebene Anwendung korrekt entsprechend der vorgegebenen Architekturentscheidung. **Principal** entscheidet, ob Cloud SQL oder Spanner für eine konkrete Datenarchitektur basierend auf tatsächlichem Skalierungsbedarf geeignet ist. **Chief** legt Datenbankauswahlstandards im Unternehmen fest, die Cloud-SQL- und Spanner-geeignete Anwendungsfälle klar abgrenzen.

Anti-Patterns: Spanner pauschal als "modernere" Option ohne nachweisbaren Bedarf an globaler horizontaler Schreibskalierung wählen; Cloud SQL für eine Anwendung mit echtem globalen, horizontal skalierenden Schreibbedarf zu lange beibehalten, bis eine harte Skalierungsgrenze erreicht wird; Lesereplikate ohne Rücksicht auf tatsächliche geografische Nutzerverteilung platzieren.

## Production Checklist

- [ ] Die Wahl zwischen Cloud SQL und Spanner basiert auf einem nachweisbaren, tatsächlichen Skalierungsbedarf.
- [ ] Cloud-SQL-Lesereplikate sind geografisch nah an der tatsächlichen Nutzerverteilung platziert.
- [ ] Datenbankzugriff erfolgt über IAM-Authentifizierung statt statischer Passwörter, wo verfügbar.
- [ ] Die Schreiblast wird regelmäßig gegen die vertikale Skalierungsgrenze von Cloud SQL überwacht.

## Interviewfragen

### 1. Was ist der zentrale strukturelle Unterschied zwischen Cloud SQL und Spanner?

**Antwort:** Cloud SQL ist eine klassische verwaltete relationale Datenbank mit vertikaler Skalierung; Spanner ist eine global verteilte, horizontal skalierbare relationale Datenbank mit starker externer Konsistenz über Regionen hinweg.

### 2. Was ermöglicht Spanners globale, starke Konsistenz?

**Antwort:** TrueTime, ein präziser, GPS- und atomuhrgestützter globaler Zeitsynchronisationsmechanismus, der eine garantierte, global konsistente Transaktionsreihenfolge sicherstellt.

### 3. Warum ist Spanner nicht die pauschal bessere Wahl gegenüber Cloud SQL?

**Antwort:** Weil Spanner strukturell komplexer zu betreiben und mit höheren Grundkosten verbunden ist, was für Anwendungsfälle mit moderatem, regional begrenztem Datenvolumen unverhältnismäßig ist.

### 4. Welche Skalierungsgrenze hat Cloud SQL, die Spanner nicht hat?

**Antwort:** Schreibzugriffe können bei Cloud SQL nur vertikal skaliert werden; eine echte Multi-Region-Aktiv-Aktiv-Schreibarchitektur ist mit Cloud SQL nicht möglich.

### 5. Wie gehst du vor, wenn eine Cloud-SQL-Instanz trotz größerer Instanzgröße eine Schreibskalierungsgrenze erreicht?

**Antwort:** Ich prüfe, ob die Anwendung tatsächlich einen global horizontal skalierenden Schreibbedarf hat, der Cloud SQLs vertikale Skalierungsgrenze strukturell überschreitet, und evaluiere einen Wechsel zu Spanner.

### 6. Widersprüchliche Anforderung: Team will minimale operative Komplexität und Kosten UND garantierte, unbegrenzte globale Schreibskalierung für die Zukunft — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Komplexität/Kosten und garantierte unbegrenzte globale Schreibskalierung sich in der initialen Datenbankwahl widersprechen, und vorschlagen, mit Cloud SQL zu starten, wenn der aktuelle Bedarf regional begrenzt ist, während eine klare Migrationsstrategie zu Spanner für den Fall dokumentiert wird, dass der tatsächliche Skalierungsbedarf die Cloud-SQL-Grenzen später überschreitet.

## Praktische Labs

~~~python
# Conceptual database selection based on actual scaling requirements (not executed against a real GCP account):

def recommend_database(needs_global_write_scaling, expected_write_qps, is_single_region_bounded):
    if needs_global_write_scaling and not is_single_region_bounded:
        return "Spanner (global horizontal write scaling required)"
    if expected_write_qps > 10000:
        return "Spanner (write load exceeds typical Cloud SQL vertical scaling ceiling)"
    return "Cloud SQL (regional, moderate write load -- Spanner would be disproportionate)"

cases = [
    {"needs_global_write_scaling": True, "expected_write_qps": 50000, "is_single_region_bounded": False},
    {"needs_global_write_scaling": False, "expected_write_qps": 500, "is_single_region_bounded": True},
]

for case in cases:
    print(recommend_database(**case))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [Cloud SQL Overview](https://cloud.google.com/sql/docs/introduction), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [Spanner — TrueTime and External Consistency](https://cloud.google.com/spanner/docs/true-time-external-consistency), abgerufen 2026-09-18.

Cloud Storage ist kanonisch in [KB-0505](07-cloud-storage.md) behandelt; RDS und Aurora in [KB-0474](../19-aws/12-rds-und-aurora.md); Azure SQL und Cosmos DB in [KB-0492](../20-azure/12-azure-sql-und-cosmos-db.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende Konvergenz von Cloud-SQL-Enterprise-Plus-Funktionen mit Spanner-ähnlicher Verfügbarkeit für regional begrenzte Workloads | Evaluating | Gegenüber vollem Wechsel zu Spanner erst nach Prüfung, ob erweiterte Cloud-SQL-Funktionen die tatsächliche Verfügbarkeitsanforderung bereits ohne Spanners Komplexität erfüllen, bevorzugen. |

Ein Team akzeptiert eine Cloud-SQL- oder Spanner-Entscheidung erst, wenn sie nachweislich auf dem tatsächlichen, nicht dem vermuteten oder pauschal angenommenen Skalierungsbedarf basiert.
