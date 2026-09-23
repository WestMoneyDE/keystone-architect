---
{"id": "KB-0141", "title": "Schema Evolution und Kompatibilität", "domain": "06", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0140", "concepts": ["API-Vertrag"], "needed_for": "both"}], "related": ["KB-0142", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Expand-Contract-Migration lokal simulieren und einen gemischten Versionszustand während des Rollouts zeigen.", "rationale": "Kein reales verteiltes System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Schema-Änderungen so planen, dass alte und neue Versionen während eines Rollouts gleichzeitig funktionieren.", "rationale": "Rolling Deployments bedeuten, dass für einen Zeitraum mehrere Versionen gleichzeitig aktiv sind."}, "STAFF-TARGET": {"active": true, "scope": "Einen Rollout-Fehler auf inkompatible gleichzeitige Schema-Versionen zurückführen.", "rationale": "Das ist eine häufige, vermeidbare Ursache für Deployment-Ausfälle."}, "CHIEF-TARGET": {"active": true, "scope": "Expand-Contract als Pflichtprozess für schemaändernde Deployments in produktionskritischen Systemen festlegen.", "rationale": "Ungeplante Breaking Changes während Rollouts erzeugen vermeidbare Ausfälle."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Schema-Registry-basierte Kompatibilitätsprüfung (Avro/Protobuf-Stil) im Detail ist Vertiefung.", "rationale": "Kern ist das Expand-Contract-Prinzip und Reader/Writer-Kompatibilität, nicht ein bestimmtes Format."}}, "lab_validation": [{"lab_id": "KB-0141-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Expand-Contract-Migration mit gemischten Lese-/Schreibversionen", "evidence": "Ein alter Reader kann während der Expand-Phase weiterhin lesen, obwohl ein neuer Writer bereits im neuen Format schreibt.", "limitations": "Kein reales System, keine Produktion."}]}
---
# Schema Evolution und Kompatibilität

> **Ziel:** Ein Rolling Deployment bedeutet, dass für einen Übergangszeitraum alte und neue Codeversionen gleichzeitig auf dasselbe Schema zugreifen. Eine Schema-Änderung ohne Rücksicht auf diese Übergangsphase (z. B. ein Feld sofort umbenennen statt schrittweise zu migrieren) bricht die alte Version, während sie noch läuft. Expand-Contract löst das durch eine dreistufige, rückwärtskompatible Migration.

## Zweck, Mental Model und Dependencies

Expand-Contract (auch Parallel Change genannt) hat drei Phasen: Expand (das neue Schema-Element wird hinzugefügt, ohne das alte zu entfernen — alte und neue Version funktionieren beide), Migrate (Daten/Code werden schrittweise auf das neue Element umgestellt), Contract (erst wenn keine alte Version mehr aktiv ist, wird das alte Element entfernt). Diese Reihenfolge stellt sicher, dass während eines Rolling Deployments — wo für Minuten oder Stunden alte und neue Codeversionen gleichzeitig laufen — beide Versionen funktionsfähig bleiben. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0140](12-api-grenzen-und-fachliche-vertraege.md).

~~~text
Expand:    add new_field (keep old_field)        -- old and new code both work
Migrate:   backfill new_field from old_field, switch writers to new_field
Contract:  remove old_field, only after ALL readers/writers use new_field
~~~

## Core Concepts, Architektur und Implementierung

| Phase | Aktion | Risiko bei Überspringen |
|---|---|---|
| Expand | neues Element hinzufügen, altes behalten | direkt umbenennen bricht laufende alte Version sofort |
| Migrate | Daten/Code schrittweise umstellen | inkonsistente Datenquelle zwischen altem und neuem Feld |
| Contract | altes Element erst nach vollständiger Migration entfernen | zu frühes Entfernen bricht noch aktive alte Leser/Schreiber |
| Reader/Writer-Kompatibilität | kann ein alter Reader ein neues Schema lesen (und umgekehrt)? | fehlende Kompatibilitätsprüfung vor Deployment |

Implementierung: jede Schema-Änderung wird in additive (neues optionales Feld) und destruktive (Entfernen/Umbenennen/Typänderung) Kategorien eingeteilt. Destruktive Änderungen laufen immer über Expand-Contract, nie direkt. Während der Migrate-Phase wird explizit überwacht, ob noch alte Versionen aktiv sind (z. B. über Deployment-Status oder Nutzung des alten Feldes), bevor die Contract-Phase eingeleitet wird. Kompatibilitätsregeln (was ein alter Reader mit einem neuen Schema tun kann und umgekehrt) werden vor jeder Änderung explizit geprüft, idealerweise automatisiert (Schema-Registry).

## Scalability, Reliability, Security und Observability

Expand-Contract skaliert über beliebig lange Rollout-Zeiträume, da es keine Annahme über einen „Moment" macht, in dem alle Instanzen gleichzeitig wechseln. Reliability-Grenze: ohne Expand-Contract-Disziplin ist jedes Rolling Deployment mit Schema-Änderung ein Risiko für einen Teilausfall während des Übergangs — das ist keine seltene Ausnahme, sondern der Normalfall bei jedem Deployment mit mehreren Instanzen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Fehler nur während eines Rolling Deployments, nicht davor/danach | direkte Breaking-Change-Migration statt Expand-Contract | Deployment-Zeitfenster gegen Fehlerzeitpunkt korrelieren |
| alte Instanzen können neue Daten nicht lesen | fehlende Rückwärtskompatibilitätsprüfung vor Migration | altes Leseverhalten explizit gegen neues Schema testen |
| Contract-Phase wurde zu früh eingeleitet | fehlende Überwachung, ob noch alte Versionen aktiv sind | Nutzung des alten Feldes/Codes vor Entfernen prüfen |
| Datenverlust nach Feldentfernung | Migrate-Phase unvollständig, Daten nur teilweise übertragen | Backfill-Vollständigkeit vor Contract-Phase verifizieren |

Security: Schema-Änderungen an sicherheitsrelevanten Feldern (z. B. Berechtigungsstruktur) brauchen besonders sorgfältige Expand-Contract-Planung, da ein inkonsistenter Übergangszustand Sicherheitslücken öffnen kann. Observability: Metriken zur Nutzung alter versus neuer Schema-Elemente sind Pflicht, um sicher zu erkennen, wann die Contract-Phase gefahrlos eingeleitet werden kann.

## Trade-offs und Entscheidungen

**Staff** kategorisiert jede Schema-Änderung explizit als additiv oder destruktiv und wendet Expand-Contract für destruktive Änderungen konsequent an. **Principal** definiert Kompatibilitätsregeln (welche Änderungsarten erlaubt sind) und automatisierte Prüfung dagegen. **Chief** verlangt Expand-Contract als Pflichtprozess für schemaändernde Deployments produktionskritischer Systeme.

Anti-Patterns: ein Feld direkt umbenennen oder entfernen, ohne Rücksicht auf laufende alte Versionen; Contract-Phase ohne Nachweis vollständiger Migration einleiten; keine automatisierte Kompatibilitätsprüfung vor Schema-Änderungen.

## Production Checklist

- [ ] Schema-Änderungen als additiv oder destruktiv kategorisiert.
- [ ] Destruktive Änderungen laufen über Expand-Migrate-Contract, nie direkt.
- [ ] Nutzung alter Schema-Elemente überwacht, bevor Contract-Phase eingeleitet wird.
- [ ] Kompatibilitätsprüfung (Reader/Writer) automatisiert vor jeder Schema-Änderung.

## Interviewfragen

### 1. Warum reicht eine direkte Feldumbenennung bei einem Rolling Deployment nicht aus?

**Antwort:** Während des Rollouts laufen alte und neue Codeversionen gleichzeitig; die direkte Umbenennung würde die noch aktive alte Version sofort brechen, da sie das alte Feld erwartet.

### 2. Was sind die drei Phasen von Expand-Contract?

**Antwort:** Expand (neues Element hinzufügen, altes behalten), Migrate (Daten/Code schrittweise umstellen), Contract (altes Element erst nach vollständiger Migration entfernen).

### 3. Wie stellst du sicher, dass die Contract-Phase sicher ist?

**Antwort:** Durch Überwachung, ob noch irgendeine Instanz oder ein Client das alte Schema-Element nutzt, bevor es entfernt wird — nicht durch bloße Zeitannahme.

### 4. Was ist Reader/Writer-Kompatibilität?

**Antwort:** Die Fähigkeit eines alten Readers, mit einem neuen Schema umzugehen (Vorwärtskompatibilität) und eines neuen Readers, ein altes Schema zu lesen (Rückwärtskompatibilität) — beide Richtungen müssen während eines Übergangs geprüft werden.

### 5. Warum ist ein Rolling Deployment ein Normalfall und keine Ausnahme für Schema-Kompatibilität?

**Antwort:** Bei mehr als einer Instanz eines Dienstes laufen während jedes Deployments für einen Zeitraum alte und neue Versionen gleichzeitig — das ist der Regelfall, nicht ein seltener Edge Case.

### 6. Widersprüchliche Anforderung: Team will eine Schema-Änderung sofort abschließen UND null Downtime während des Rollouts — wie gehst du vor?

**Antwort:** Ich würde erklären, dass „sofort abschließen" und „null Downtime bei Rolling Deployment" sich bei einer destruktiven Änderung widersprechen; Expand-Contract braucht mehrere Deployment-Zyklen, garantiert aber null Downtime — ich würde diesen zeitlichen Mehraufwand gegen das Downtime-Risiko einer direkten Änderung explizit abwägen.

## Praktische Labs

~~~python
record = {"amount_cents": 2500}  # old schema

def expand(record):
    record["amount"] = record["amount_cents"] / 100  # new field added, old kept
    return record

def old_reader(record):
    return record["amount_cents"]  # still works during rollout

def new_reader(record):
    return record["amount"]

record = expand(record)
assert old_reader(record) == 2500  # old version still functions
assert new_reader(record) == 25.0  # new version already works
print("Both old and new readers function correctly during the Expand phase of the rollout.")
~~~

## Dependencies, Cross-References und Quellen

1. Sadalage, Fowler: [NoSQL Distilled - Schema Migration](https://martinfowler.com/books/nosql.html), Addison-Wesley 2012, abgerufen 2026-09-17 (als konzeptionelle Referenz für schrittweise Schema-Migration).

Produktspezifische Schema-Registry-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Kompatibilitätsprüfung über Schema-Registries (Avro/Protobuf-Stil) | Established | Kompatibilitätsmodus (backward/forward/full) explizit gegen tatsächlichen Bedarf prüfen. |
| CI-Gates, die destruktive Schema-Änderungen ohne Expand-Contract-Nachweis blockieren | Adopting | Falsch-Positiv-Rate vor Durchsetzung als hartes Gate validieren. |

Ein Team akzeptiert eine destruktive Schema-Änderung erst, wenn Expand-Contract vollständig durchlaufen und die Nutzung des alten Elements nachweislich auf null zurückgegangen ist.
