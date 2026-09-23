---
{"id": "KB-0213", "title": "Backup und Restore auf Datenebene", "domain": "09", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "CLOUD"], "requires": [{"id": "KB-0199", "concepts": ["PostgreSQL Internals"], "needed_for": "understanding"}, {"id": "KB-0200", "concepts": ["Transaktionen"], "needed_for": "understanding"}], "related": ["KB-0209"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Point-in-Time-Recovery-Modell mit Basis-Backup und Änderungslog lokal implementieren.", "rationale": "Der Unterschied zwischen einem einzelnen Backup-Zeitpunkt und echter Point-in-Time-Recovery wird erst durch Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Backup-Strategie (Vollsicherung, inkrementell, WAL-Archivierung) für ein konkretes Recovery-Point-Objective begründet dimensionieren.", "rationale": "Unterschiedliche Backup-Strategien bieten unterschiedliche Wiederherstellungsgranularität bei unterschiedlichen Kosten."}, "STAFF-TARGET": {"active": true, "scope": "Ein fehlgeschlagenes Restore auf eine nie getestete Wiederherstellungsprozedur statt auf beschädigte Backupdateien zurückführen können.", "rationale": "Vorhandene Backupdateien sind kein Beleg für Wiederherstellbarkeit — nur ein tatsächlich durchgeführtes Restore ist ein Beleg."}, "CHIEF-TARGET": {"active": true, "scope": "Wiederherstellbarkeit als organisatorische Praxis (regelmäßige Restore-Übungen) statt als technisches Artefakt (vorhandene Backupdateien) positionieren.", "rationale": "Ein Backup ohne verifiziertes Restore ist keine Versicherung, sondern eine unbewiesene Annahme."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische WAL-Archivierungsmechanismen (z. B. PostgreSQL pg_basebackup, Continuous Archiving) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Point-in-Time-Recovery und die Notwendigkeit verifizierter Restores, nicht die Produktimplementierung."}}, "lab_validation": [{"lab_id": "KB-0213-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Point-in-Time-Recovery aus Basis-Backup und Änderungslog", "evidence": "Ein Basis-Backup kombiniert mit einem sequenziellen Änderungslog erlaubt Wiederherstellung zu jedem beliebigen Zeitpunkt zwischen Backup und letztem geloggten Änderung, nicht nur zum exakten Backup-Zeitpunkt.", "limitations": "Kein echtes Datenbanksystem, kein echtes WAL, keine Produktion."}]}
---
# Backup und Restore auf Datenebene

> **Ziel:** Ein vorhandenes Backup ist kein Beleg für Wiederherstellbarkeit — nur ein tatsächlich durchgeführtes und erfolgreiches Restore ist ein Beleg. WAL-Archivierung (Write-Ahead-Log) kombiniert mit periodischen Basis-Backups ermöglicht Point-in-Time-Recovery zu praktisch jedem Zeitpunkt, nicht nur zum letzten Backup-Zeitpunkt — aber nur, wenn die Wiederherstellungsprozedur regelmäßig geübt und verifiziert wird.

## Zweck, Mental Model und Dependencies

Ein einfaches Vollsicherungs-Backup erfasst den Datenbankzustand zu einem einzelnen Zeitpunkt — Wiederherstellung ist nur zu diesem exakten Zeitpunkt möglich, was bei einem Vorfall kurz vor dem nächsten geplanten Backup potenziell viele Stunden an Datenverlust bedeutet. WAL-Archivierung (Write-Ahead-Log, siehe [KB-0199](../09-databases-storage/07-postgresql-storage-engine-und-mvcc.md) für PostgreSQL-Interna) protokolliert jede Änderung sequenziell und kontinuierlich; kombiniert mit einem periodischen Basis-Backup ermöglicht das Replay der WAL-Einträge Wiederherstellung zu praktisch jedem Zeitpunkt zwischen dem letzten Basis-Backup und dem letzten archivierten Log-Eintrag — das ist Point-in-Time-Recovery (PITR). Der zentrale Denkfehler ist, das Vorhandensein von Backupdateien mit Wiederherstellbarkeit gleichzusetzen: Backups können durch Bitfäule, unvollständige Übertragung, falsche Versionskompatibilität oder fehlerhafte Archivierungskonfiguration unbrauchbar sein, was nur durch ein tatsächlich durchgeführtes Restore aufgedeckt wird. Lies [KB-0199](../09-databases-storage/07-postgresql-storage-engine-und-mvcc.md) und [KB-0200](04-transaktionen-und-isolation-level.md).

~~~text
Full backup only:        recovery point = exact backup timestamp -> data loss window = time since last backup
WAL archiving + backup:  recovery point = ANY timestamp between base backup and last archived log entry -> minimal data loss window
Backup files exist != restore works. Only a tested, successful restore proves recoverability.
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Recovery Point Objective (RPO) | wie viel Datenverlust ist im Vorfall akzeptabel, und passt die Backup-Strategie dazu? | Backup-Frequenz erzeugt größeres Datenverlustfenster als das tolerierte RPO |
| WAL-Archivierung | ist kontinuierliche WAL-Archivierung aktiviert und überwacht? | Lücken in der WAL-Archivierung verhindern Point-in-Time-Recovery über den Lückenpunkt hinaus |
| Restore-Verifikation | wird ein tatsächliches Restore regelmäßig geübt und verifiziert? | Backup-Dateien vorhanden, aber nie getestetes Restore schlägt im echten Vorfall fehl |
| Recovery Time Objective (RTO) | wie lange darf die Wiederherstellung dauern, und ist das gemessen worden? | Restore-Dauer im echten Vorfall überschreitet die akzeptable Ausfallzeit, weil nie zeitlich gemessen |

Implementierung: die Backup-Strategie (Frequenz von Vollsicherungen, kontinuierliche WAL-Archivierung) wird anhand des dokumentierten Recovery Point Objective dimensioniert, nicht nach Standardkonfiguration. WAL-Archivierung wird aktiv überwacht, damit Lücken in der Archivierungskette (z. B. durch vollen Speicherplatz oder Netzwerkprobleme) sofort erkannt werden, bevor sie die Point-in-Time-Recovery-Fähigkeit einschränken. Restore-Übungen werden regelmäßig (nicht nur einmalig bei Einführung) durchgeführt, mit gemessener Restore-Dauer gegen das dokumentierte Recovery Time Objective, in einer isolierten Umgebung, die die Produktionsumgebung nicht gefährdet.

## Scalability, Reliability, Security und Observability

Backup- und Restore-Strategien skalieren mit Datenvolumen unterschiedlich: Vollsicherungen werden bei wachsendem Datenvolumen zunehmend teuer in Zeit und Speicherplatz, während inkrementelle Backups kombiniert mit WAL-Archivierung den laufenden Overhead reduzieren, aber die Restore-Komplexität (mehr Schritte, mehr potenzielle Fehlerquellen) erhöhen. Reliability-Grenze: eine ungetestete Backup-Strategie ist ein latentes Risiko, das per Definition erst im schlimmsten Moment (während eines echten Datenverlustvorfalls) sichtbar wird, wenn keine Zeit für Fehlerbehebung bleibt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Restore im echten Vorfall schlägt fehl, obwohl Backupdateien vorhanden sind | Wiederherstellungsprozedur wurde nie tatsächlich getestet | Datum der letzten erfolgreich verifizierten Restore-Übung prüfen |
| Point-in-Time-Recovery ist nur bis zu einem bestimmten Zeitpunkt möglich, nicht bis zum aktuellen Zeitpunkt | Lücke in der WAL-Archivierungskette nach diesem Zeitpunkt | WAL-Archivierungs-Log auf Lücken oder Fehler nach dem betroffenen Zeitpunkt prüfen |
| Restore dauert im echten Vorfall deutlich länger als erwartet | Restore-Dauer wurde nie unter realistischen Datenvolumen-Bedingungen gemessen | letzte gemessene Restore-Dauer gegen aktuelles Datenvolumen und dokumentiertes RTO vergleichen |
| Backup-Speicherplatzverbrauch wächst unerwartet schnell | Backup-Strategie (Frequenz, Retention) ist nicht an das tatsächliche Datenwachstum angepasst | Backup-Retention-Policy gegen aktuelles Datenwachstum und Speicherbudget prüfen |

Security: Backup-Dateien enthalten dieselben sensiblen Daten wie die Produktionsdatenbank und müssen mit gleichwertiger Verschlüsselung und Zugriffskontrolle geschützt werden, oft an einem geografisch getrennten Ort zur Absicherung gegen standortweite Vorfälle. Observability: WAL-Archivierungsstatus, letzte erfolgreiche Backup- und Restore-Verifikation sowie gemessene Restore-Dauer sind zentrale Metriken, die aktiv überwacht und nicht nur bei Bedarf geprüft werden sollten.

## Trade-offs und Entscheidungen

**Staff** dimensioniert Backup-Strategie anhand des dokumentierten RPO, nicht nach Standardkonfiguration. **Principal** macht ungetestete Wiederherstellungsprozeduren als Risiko für das Team explizit sichtbar. **Chief** positioniert Wiederherstellbarkeit als organisatorische Praxis regelmäßiger Restore-Übungen, nicht als technisches Artefakt vorhandener Backupdateien.

Anti-Patterns: Backup-Erfolg an vorhandenen Dateien statt an verifiziertem Restore messen; WAL-Archivierung einrichten, aber nie auf Lücken überwachen; Restore-Dauer nie unter realistischen Datenvolumen-Bedingungen messen und dann im echten Vorfall vom RTO überrascht werden.

## Production Checklist

- [ ] Backup-Strategie ist anhand des dokumentierten Recovery Point Objective dimensioniert.
- [ ] WAL-Archivierung wird aktiv auf Lücken überwacht.
- [ ] Restore wird regelmäßig geübt und die Dauer gegen das Recovery Time Objective gemessen.
- [ ] Backup-Dateien sind gleichwertig zur Produktionsdatenbank verschlüsselt und geografisch getrennt gespeichert.

## Interviewfragen

### 1. Warum ist das Vorhandensein von Backupdateien kein Beleg für Wiederherstellbarkeit?

**Antwort:** Backups können durch Bitfäule, unvollständige Übertragung, Versionsinkompatibilität oder fehlerhafte Archivierungskonfiguration unbrauchbar sein — das wird nur durch ein tatsächlich durchgeführtes und erfolgreiches Restore aufgedeckt, nicht durch das bloße Vorhandensein der Dateien.

### 2. Was ist der Unterschied zwischen einer einfachen Vollsicherung und Point-in-Time-Recovery?

**Antwort:** Eine Vollsicherung erlaubt Wiederherstellung nur zum exakten Backup-Zeitpunkt; Point-in-Time-Recovery kombiniert ein Basis-Backup mit kontinuierlicher WAL-Archivierung und erlaubt Wiederherstellung zu praktisch jedem Zeitpunkt zwischen Backup und letztem archivierten Log-Eintrag.

### 3. Was ist der Unterschied zwischen Recovery Point Objective (RPO) und Recovery Time Objective (RTO)?

**Antwort:** RPO beschreibt, wie viel Datenverlust (gemessen in Zeit seit dem letzten wiederherstellbaren Zustand) akzeptabel ist; RTO beschreibt, wie lange die Wiederherstellung selbst dauern darf, bis der Betrieb wieder verfügbar ist.

### 4. Wie diagnostizierst du, warum Point-in-Time-Recovery nur bis zu einem bestimmten Zeitpunkt funktioniert?

**Antwort:** Ich prüfe das WAL-Archivierungs-Log auf Lücken oder Fehler nach diesem Zeitpunkt — eine unterbrochene Archivierungskette (z. B. durch vollen Speicherplatz) begrenzt, wie weit vorwärts wiederhergestellt werden kann.

### 5. Warum sollten Restore-Übungen regelmäßig, nicht nur einmalig bei Einführung, durchgeführt werden?

**Antwort:** Backup-Konfiguration, Datenvolumen und Systemumgebung ändern sich über Zeit; eine einmalig erfolgreiche Restore-Übung garantiert nicht, dass ein späteres Restore unter aktuellen Bedingungen (z. B. gewachsenes Datenvolumen, geänderte Konfiguration) ebenfalls innerhalb des RTO gelingt.

### 6. Widersprüchliche Anforderung: Team will minimalen Backup-Speicherplatzverbrauch (nur seltene Vollsicherungen) UND ein RPO von wenigen Minuten Datenverlust — wie gehst du vor?

**Antwort:** Ich würde erklären, dass seltene Vollsicherungen allein ein RPO von wenigen Minuten nicht erfüllen können; ich würde kontinuierliche WAL-Archivierung zwischen den seltenen Vollsicherungen vorschlagen, die den Speicherplatzbedarf gegenüber häufigeren Vollsicherungen deutlich reduziert, während sie trotzdem ein minutengenaues RPO über Point-in-Time-Recovery ermöglicht.

## Praktische Labs

~~~python
# Point-in-time recovery model: base backup + sequential change log (WAL-like)
base_backup = {"balance": 100, "timestamp": 0}
wal_log = [
    {"timestamp": 5, "change": +20},
    {"timestamp": 10, "change": -30},
    {"timestamp": 15, "change": +50},
]

def recover_to(target_timestamp, base, log):
    state = base["balance"]
    for entry in log:
        if entry["timestamp"] <= target_timestamp:
            state += entry["change"]
    return state

assert recover_to(0, base_backup, wal_log) == 100    # exact backup point
assert recover_to(7, base_backup, wal_log) == 120    # between backup and full log - only base backup allows this
assert recover_to(12, base_backup, wal_log) == 90    # arbitrary point mid-log
assert recover_to(20, base_backup, wal_log) == 140   # full log replayed

print("Recovery to timestamp 7 (mid-way, not an exact backup point) succeeded - this is what PITR enables.")
~~~

## Dependencies, Cross-References und Quellen

1. PostgreSQL: [Continuous Archiving and Point-in-Time Recovery (PITR)](https://www.postgresql.org/docs/current/continuous-archiving.html), abgerufen 2026-09-17.
2. AWS: [Amazon RDS Backup and Restore](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html), abgerufen 2026-09-17.
3. Percona: [Backup and Recovery Best Practices](https://www.percona.com/blog/backup-and-recovery-best-practices/), abgerufen 2026-09-17.

Produktspezifische WAL-Archivierungs- und Restore-Mechanismen vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, regelmäßig geplante Restore-Verifikation als Teil der CI/CD-Pipeline | Adopting | Manuelle, seltene Restore-Übungen durch automatisierte, häufige Verifikation ersetzen, wo praktikabel. |
| Copy-on-Write-Snapshot-basierte Backups mit minimalem Performance-Overhead auf der Quelldatenbank | Established | Für große Datenbanken mit engem Backup-Zeitfenster gezielt gegenüber logischen Backups prüfen. |

Ein Team akzeptiert eine Backup-Strategie erst, wenn ein tatsächliches Restore innerhalb des dokumentierten RTO nachweisbar erfolgreich durchgeführt wurde.
