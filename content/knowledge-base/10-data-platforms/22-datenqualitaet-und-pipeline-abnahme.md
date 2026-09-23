---
{"id": "KB-0240", "title": "Datenqualität und Pipeline-Abnahme", "domain": "10", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0239", "concepts": ["Data Mesh", "Datenprodukte"], "needed_for": "understanding"}, {"id": "KB-0230", "concepts": ["Lakehouse-Qualitätsgates"], "needed_for": "understanding"}], "related": ["KB-0219"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Quarantäne-Modell für fehlerhafte Datensätze mit expliziter Eskalation lokal implementieren.", "rationale": "Der Unterschied zwischen stillem Verwerfen fehlerhafter Daten und expliziter Quarantäne mit Eskalation wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Datenqualitätsprüfungen (Frische, Vollständigkeit, fachliche Invarianten) für eine konkrete Pipeline-Abnahme begründet definieren.", "rationale": "Unterschiedliche Qualitätsdimensionen erfordern unterschiedliche Prüfmechanismen und haben unterschiedliche Konsequenzen bei Verletzung."}, "STAFF-TARGET": {"active": true, "scope": "Nachgelagerte fachliche Fehler auf eine übersehene Datenqualitätsverletzung statt auf einen Anwendungsfehler zurückführen können.", "rationale": "Ohne systematische Pipeline-Abnahme können Datenqualitätsprobleme unbemerkt bis in fachliche Endergebnisse durchsickern."}, "CHIEF-TARGET": {"active": true, "scope": "Datenqualitäts-Pipeline-Abnahme als verpflichtenden Prozess mit definierter Eskalation positionieren, nicht als optionale Nice-to-have-Prüfung.", "rationale": "Ohne verpflichtende Abnahme mit klarer Eskalation werden Datenqualitätsprobleme oft erst nach fachlichem Schaden entdeckt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Werkzeugspezifische Datenqualitäts-Framework-Implementierungen (z. B. Great Expectations, Soda) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Qualitätsdimensionen, Quarantäne und Eskalation, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0240-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Quarantäne fehlerhafter Datensätze mit expliziter Eskalation", "evidence": "Datensätze, die eine Qualitätsprüfung nicht bestehen, werden in eine separate Quarantäne-Zone verschoben statt stillschweigend verworfen oder weitergeleitet, mit expliziter Eskalationsbenachrichtigung an Verantwortliche.", "limitations": "Kein echtes Datenqualitäts-Framework, keine reale Pipeline, keine Produktion."}]}
---
# Datenqualität und Pipeline-Abnahme

> **Ziel:** Datenqualitäts-Pipeline-Abnahme prüft Frische (Aktualität), Vollständigkeit und fachliche Invarianten (Geschäftslogik-Regeln) — fehlerhafte Datensätze werden explizit in Quarantäne verschoben und eskaliert, statt stillschweigend verworfen oder weitergeleitet zu werden. Diese Abnahme ist ein verpflichtender Prozess, kein optionales Nice-to-have, da ohne ihn Datenqualitätsprobleme unbemerkt bis in fachliche Endergebnisse durchsickern können.

## Zweck, Mental Model und Dependencies

Frische (Freshness) prüft, ob Daten innerhalb eines erwarteten Zeitfensters aktualisiert wurden — eine Pipeline, die seit Stunden keine neuen Daten geliefert hat, obwohl kontinuierliche Aktualisierung erwartet wird, deutet auf ein Problem hin, auch wenn die vorhandenen Daten selbst technisch korrekt sind. Vollständigkeit prüft, ob die erwartete Datenmenge tatsächlich vorhanden ist (z. B. Zeilenzahl innerhalb eines plausiblen Bereichs, keine unerwartet fehlenden Partitionen). Fachliche Invarianten sind Geschäftslogik-Regeln, die über reine technische Schema-Validierung hinausgehen (z. B. "die Summe der Teilbeträge muss dem Gesamtbetrag entsprechen" oder "ein Kunde kann nicht mehr aktive Verträge haben als vertraglich zulässig") — diese Regeln erfassen fachliche Korrektheit, die ein reines Schema nicht prüfen kann. Quarantäne bedeutet, dass Datensätze, die eine Prüfung nicht bestehen, explizit isoliert werden, statt entweder stillschweigend verworfen zu werden (Datenverlust ohne Spur) oder trotzdem weitergeleitet zu werden (fehlerhafte Daten erreichen nachgelagerte Systeme) — Quarantäne erhält die fehlerhaften Daten für Untersuchung, verhindert aber ihre unkontrollierte Weiterverbreitung. Eskalation stellt sicher, dass eine Qualitätsverletzung tatsächlich einer verantwortlichen Person oder einem Team bekannt gemacht wird, statt nur in einem Log zu verschwinden, das niemand aktiv überwacht. Lies [KB-0239](21-data-mesh-und-datenprodukte.md) und [KB-0230](12-lakehouse-architektur.md) für verwandte Qualitätsgate-Konzepte.

~~~text
Freshness check:      data updated within expected time window? -> stale data is a problem even if technically valid
Completeness check:   expected data volume/partitions actually present?
Business invariant:   domain-specific logic rules (sum checks, cardinality limits) -> beyond schema validation
Failed check -> QUARANTINE (isolated, not lost, not silently forwarded) + ESCALATION (actively notified, not just logged)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Frischeprüfung | wird die Aktualität von Daten gegen ein erwartetes Zeitfenster geprüft? | veraltete Daten werden als aktuell behandelt, fachliche Entscheidungen basieren auf überholter Information |
| Vollständigkeitsprüfung | wird geprüft, ob die tatsächliche Datenmenge dem erwarteten Umfang entspricht? | fehlende Partitionen oder unerwartet niedrige Zeilenzahl bleiben unbemerkt |
| Fachliche Invarianten | sind geschäftslogik-spezifische Konsistenzregeln explizit geprüft, nicht nur Schema? | fachlich inkonsistente, aber schema-valide Daten erreichen nachgelagerte Systeme |
| Quarantäne vs. stilles Verwerfen/Weiterleiten | werden fehlerhafte Datensätze isoliert statt verworfen oder ungeprüft weitergeleitet? | stilles Verwerfen verliert Untersuchungsmöglichkeit, ungeprüftes Weiterleiten verbreitet fehlerhafte Daten |

Implementierung: Frischeprüfungen werden mit explizit definierten, pipeline-spezifischen Zeitfenstern konfiguriert (was "aktuell genug" für diese spezifische Pipeline bedeutet, nicht ein pauschaler Standardwert). Vollständigkeitsprüfungen vergleichen tatsächliche gegen erwartete Datenmenge, idealerweise mit historischem Kontext (plausibler Bereich basierend auf vergangenen Läufen, nicht nur "größer als null"). Fachliche Invarianten werden gemeinsam mit den Fachdomänen-Experten definiert, da sie geschäftsspezifisches Wissen erfordern, das ein rein technisches Team oft nicht vollständig hat. Bei Prüfungsfehlschlag werden betroffene Datensätze in eine dedizierte Quarantäne-Zone verschoben, mit automatisierter Eskalationsbenachrichtigung an dokumentierte Verantwortliche (ähnlich der Ownership-Prinzipien in Data Contracts und Data Mesh), statt nur einen Log-Eintrag zu erzeugen.

## Scalability, Reliability, Security und Observability

Datenqualitäts-Pipeline-Abnahme skaliert Vertrauen in automatisierte Datenpipelines über wachsende Datenmengen und Komplexität, weil Prüfungen automatisiert statt manuell durchgeführt werden. Reliability-Grenze: eine Pipeline-Abnahme ohne aktive Eskalation ist nur so verlässlich wie die Wahrscheinlichkeit, dass jemand die entsprechenden Logs manuell überwacht — ohne aktive Benachrichtigung können Qualitätsverletzungen lange unbemerkt bleiben, selbst wenn die Prüfung selbst korrekt funktioniert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| fachliche Endergebnisse (Berichte, Dashboards) zeigen unplausible Werte | eine Datenqualitätsverletzung wurde nicht erkannt oder nicht eskaliert, fehlerhafte Daten sind durchgesickert | Qualitätsprüfungsergebnisse der zugrunde liegenden Pipeline für den betroffenen Zeitraum prüfen |
| ein Team bemerkt eine Datenqualitätsverletzung erst deutlich verzögert | Eskalation erfolgt nur passiv über Logs, keine aktive Benachrichtigung an Verantwortliche | Eskalationsmechanismus auf aktive Benachrichtigung statt passives Logging prüfen |
| fehlerhafte Datensätze sind nicht mehr auffindbar zur Untersuchung | Datensätze wurden bei Prüfungsfehlschlag verworfen statt in Quarantäne verschoben | Pipeline-Logik auf Quarantäne- statt Verwerfungs-Verhalten bei Prüfungsfehlschlag prüfen |
| fachliche Invarianten-Verletzungen werden nicht erkannt, obwohl Schema-Validierung erfolgreich ist | fachliche Invarianten sind nicht definiert, nur technische Schema-Prüfung erfolgt | Prüfungsumfang auf Vorhandensein fachlicher, nicht nur technischer Regeln prüfen |

Security: Quarantäne-Zonen enthalten oft potenziell fehlerhafte, aber weiterhin sensible Daten und sollten denselben Zugriffsbeschränkungen wie die reguläre Datenpipeline unterliegen, nicht laxer behandelt werden, nur weil sie "nur" zur Untersuchung dienen. Observability: Prüfungsfehlschlagrate pro Qualitätsdimension (Frische, Vollständigkeit, Invarianten), Quarantäne-Volumen über Zeit und durchschnittliche Zeit bis zur Eskalationsreaktion sind zentrale Metriken für Datenqualitäts-Governance.

## Trade-offs und Entscheidungen

**Staff** implementiert Quarantäne statt stillem Verwerfen oder ungeprüftem Weiterleiten bei Prüfungsfehlschlag. **Principal** macht aktive Eskalation für Verantwortliche zur Regel, statt sich auf passives Log-Monitoring zu verlassen. **Chief** positioniert Datenqualitäts-Pipeline-Abnahme als verpflichtenden Prozess mit definierter Konsequenz, nicht als optionale, unverbindliche Prüfung.

Anti-Patterns: Datenqualitätsprüfungen nur als informelle, nicht durchgesetzte Empfehlung behandeln; fehlerhafte Datensätze bei Prüfungsfehlschlag stillschweigend verwerfen ohne Untersuchungsmöglichkeit; Eskalation nur passiv über Logs ohne aktive Benachrichtigung verantwortlicher Personen umsetzen.

## Production Checklist

- [ ] Frische-, Vollständigkeits- und fachliche Invarianten-Prüfungen sind für jede kritische Pipeline definiert.
- [ ] Fachliche Invarianten sind gemeinsam mit Fachdomänen-Experten definiert.
- [ ] Fehlerhafte Datensätze werden in Quarantäne verschoben, nicht verworfen oder ungeprüft weitergeleitet.
- [ ] Eskalation erfolgt aktiv an dokumentierte Verantwortliche, nicht nur passiv über Logs.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Frische-, Vollständigkeits- und fachlichen Invarianten-Prüfungen?

**Antwort:** Frische prüft, ob Daten innerhalb eines erwarteten Zeitfensters aktualisiert wurden; Vollständigkeit prüft, ob die erwartete Datenmenge vorhanden ist; fachliche Invarianten prüfen geschäftslogik-spezifische Konsistenzregeln, die über reine technische Schema-Validierung hinausgehen.

### 2. Warum ist Quarantäne fehlerhafter Datensätze besser als stilles Verwerfen oder ungeprüftes Weiterleiten?

**Antwort:** Stilles Verwerfen verliert die Möglichkeit, die Ursache zu untersuchen; ungeprüftes Weiterleiten verbreitet fehlerhafte Daten in nachgelagerte Systeme; Quarantäne isoliert die Daten, erhält sie für Untersuchung, verhindert aber ihre unkontrollierte Weiterverbreitung.

### 3. Warum reicht passives Logging von Qualitätsverletzungen nicht aus?

**Antwort:** Logs werden oft nicht aktiv überwacht; ohne aktive Benachrichtigung (Eskalation) an dokumentierte Verantwortliche können Qualitätsverletzungen lange unbemerkt bleiben, selbst wenn die Prüfung selbst korrekt eine Verletzung erkannt hat.

### 4. Wie diagnostizierst du unplausible Werte in einem fachlichen Endbericht?

**Antwort:** Ich prüfe die Datenqualitätsprüfungsergebnisse der zugrunde liegenden Pipeline für den betroffenen Zeitraum — eine unerkannte oder nicht eskalierte Qualitätsverletzung ist eine häufige Ursache, wenn fehlerhafte Daten bis in fachliche Endergebnisse durchgesickert sind.

### 5. Warum müssen fachliche Invarianten gemeinsam mit Fachdomänen-Experten definiert werden?

**Antwort:** Geschäftslogik-spezifische Konsistenzregeln (z. B. plausible Wertebereiche, Kardinalitätsgrenzen) erfordern fachliches Domänenwissen, das ein rein technisches Team oft nicht vollständig besitzt — ohne diese Zusammenarbeit bleiben wichtige fachliche Prüfungen unentdeckt oder fehlerhaft definiert.

### 6. Widersprüchliche Anforderung: Team will minimale Pipeline-Latenz (Daten so schnell wie möglich verfügbar) UND vollständige Qualitätsprüfung vor jeder Veröffentlichung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass umfassende Qualitätsprüfung zwangsläufig Verarbeitungszeit kostet, was der minimalen Latenz zuwiderläuft; ich würde vorschlagen, kritische, schnell ausführbare Prüfungen (z. B. Schema, grundlegende Vollständigkeit) synchron vor Veröffentlichung durchzuführen, während aufwendigere fachliche Invarianten-Prüfungen asynchron nachgelagert laufen und bei Verletzung eine nachträgliche Korrektur/Eskalation auslösen, um einen bewussten Kompromiss zwischen Latenz und Prüftiefe zu erreichen.

## Praktische Labs

~~~python
# Quarantine and escalation model for pipeline data quality
quarantine_zone = []
escalations = []

def check_quality(record):
    violations = []
    if record.get("amount", 0) < 0:
        violations.append("negative amount violates business invariant")
    if record.get("total") is not None and record.get("subtotal_sum") is not None:
        if abs(record["total"] - record["subtotal_sum"]) > 0.01:
            violations.append("total does not match sum of subtotals")
    return violations

def process_record(record, owner="finance-team"):
    violations = check_quality(record)
    if violations:
        quarantine_zone.append(record)
        escalations.append({"record_id": record.get("id"), "owner": owner, "violations": violations})
        return False
    return True

records = [
    {"id": 1, "amount": 100, "total": 110, "subtotal_sum": 110},
    {"id": 2, "amount": -50, "total": 0, "subtotal_sum": 0},  # negative amount
    {"id": 3, "amount": 200, "total": 220, "subtotal_sum": 210},  # mismatched total
]

for record in records:
    ok = process_record(record)
    print(f"Record {record['id']}: {'PASSED' if ok else 'QUARANTINED'}")

print(f"Quarantine zone: {len(quarantine_zone)} records")
print(f"Escalations sent: {escalations}")
assert len(quarantine_zone) == 2
assert len(escalations) == 2
~~~

## Dependencies, Cross-References und Quellen

1. Great Expectations: [Data Quality Testing Framework Documentation](https://docs.greatexpectations.io/docs/), abgerufen 2026-09-17.
2. Soda: [Data Quality Checks and Anomaly Detection](https://docs.soda.io/), abgerufen 2026-09-17.
3. Data Mesh Principles: [Data Product Quality Guarantees](https://www.datamesh-architecture.com/), abgerufen 2026-09-17.

Data-Mesh- und Lakehouse-Qualitätsgate-Grundlagen sind kanonisch in [KB-0239](21-data-mesh-und-datenprodukte.md) und [KB-0230](12-lakehouse-architektur.md) behandelt. Werkzeugspezifische Framework-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, statistische Anomalieerkennung ergänzend zu deklarativen Regelprüfungen | Adopting | Für Erkennung unbekannter, nicht vordefinierter Datenqualitätsmuster ergänzend zu expliziten Regeln einsetzen. |
| Automatisierte Root-Cause-Analyse bei Qualitätsverletzungen durch Verknüpfung mit Lineage-Information | Adopting | Zur Beschleunigung der Ursachenermittlung bei Eskalationen gegenüber manueller Untersuchung bevorzugen. |

Ein Team akzeptiert eine Datenqualitäts-Pipeline-Abnahme erst, wenn Frische-, Vollständigkeits- und fachliche Invarianten-Prüfungen definiert sind und Quarantäne mit aktiver Eskalation nachweisbar funktioniert.
