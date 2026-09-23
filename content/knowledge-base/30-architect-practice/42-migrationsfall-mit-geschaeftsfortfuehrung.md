---
{"id": "KB-0718", "title": "Migrationsfall mit Geschäftsfortführung", "domain": "30", "sequence": 42, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0713", "concepts": ["Vollständiger, durchgearbeiteter Übungsfall"], "needed_for": "Dieser Fall folgt derselben, vollständigen Fallstruktur wie der in KB-0713 beschriebene Cloud-Architekturfall"}, {"id": "KB-0695", "concepts": ["Migrationsstrategie und Cutover"], "needed_for": "Dieser Fall wendet die in KB-0695 beschriebenen Cutover-Prinzipien auf ein konkretes Commerce-Migrationsszenario an"}], "related": ["KB-0717"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für das gegebene, laufende Commerce-System eine schrittweise Ablösung mit Datenkonsistenzsicherung und Cutover-Planung bei fortlaufendem Geschäftsbetrieb entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für den Migrationsfall mehrere Ablösungsstrategien mit fairer Trade-off-Darstellung gegeneinander abwägen und eine messbare Geschäftsabnahme definieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Migrationsplanung eine kritische Dimension (Datenkonsistenz während des Übergangs, Geschäftsabnahmekriterien) unadressiert lässt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine vollständige, unternehmensweite Migrationsentscheidung mit Geschäftsfortführungsgarantie treffen und vor Entscheidern begründen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Datenmigrationswerkzeug-Implementierung im Detail ist Vertiefung.", "rationale": "Kern ist die konzeptionelle Fallbearbeitung mit überprüfbaren Geschäftsabnahmekriterien, nicht die werkzeugspezifische Implementierungsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0718-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur vollständigen Bearbeitung eines Migrationsfalls mit Geschäftsfortführung, keine reale Organisation involviert", "evidence": "Ein vollständig durchgearbeitetes Fallbeispiel zeigt, wie Datenkonsistenz, Cutover und messbare Geschäftsabnahme mit expliziten, klar als Annahmen gekennzeichneten Randbedingungen zu einer kohärenten Migrationsentscheidung zusammengeführt werden, ohne den laufenden Geschäftsbetrieb zu unterbrechen.", "limitations": "Vollständig fiktives Fallbeispiel; alle Zahlen, Lasten und Randbedingungen sind Beispielannahmen, keine realen Projektergebnisse."}]}
---
# Migrationsfall mit Geschäftsfortführung

> **Ziel:** Dieses Kapitel ist der letzte in einer Reihe vollständiger, durchgearbeiteter Übungsfälle (KB-0713 bis KB-0718): Ein fiktives Unternehmen muss ein bestehendes, geschäftskritisches Commerce-System schrittweise auf eine neue Architektur ablösen, während der laufende Geschäftsbetrieb tatsächlich ununterbrochen weiterläuft. Der Fall verbindet **Datenkonsistenz** (siehe KB-0666), **Cutover** (siehe KB-0695) und **messbare Geschäftsabnahme** (überprüfbare Kriterien, die bestätigen, dass die Migration tatsächlich ohne Geschäftsschaden erfolgt ist) zu einer kohärenten Migrationsstrategie nach dem Strangler-Fig-Prinzip (siehe KB-0694).

## Fallbeschreibung und explizite Annahmen

**Hinweis:** Alle folgenden Annahmen sind explizit als Beispielannahmen gekennzeichnet, keine realen Projektdaten.

Das fiktive Unternehmen "Beispiel Handel AG" betreibt ein angenommen 8 Jahre altes Bestellsystem, das schrittweise durch eine moderne, Event-Driven-Commerce-Architektur (angelehnt an KB-0670) ersetzt werden soll. Angenommene Anforderung: Der laufende Geschäftsbetrieb (angenommen 30.000 Bestellungen täglich) darf während der gesamten, mehrmonatigen Migration tatsächlich nicht unterbrochen werden, und keine Bestellung darf tatsächlich verloren gehen.

## Schrittweise Ablösung (Strangler-Fig-Prinzip)

Die Migration erfolgt schrittweise nach dem in KB-0694 beschriebenen Strangler-Fig-Prinzip: Zunächst wird nur die Produktkatalog-Funktion auf die neue Architektur migriert, während Bestellabwicklung und Zahlung tatsächlich weiterhin im Altsystem laufen. Erst nach Verifikation der Produktkatalog-Migration wird die Bestellabwicklung migriert, dann zuletzt die Zahlungsabwicklung — diese Reihenfolge minimiert tatsächlich das Risiko, da die am wenigsten kritische Funktion zuerst migriert wird.

## Datenkonsistenz während des Übergangs

Während des Übergangszeitraums, in dem beide Systeme tatsächlich parallel Daten verarbeiten, wird eine bidirektionale Datensynchronisation eingerichtet, mit dem in KB-0666 beschriebenen Prinzip atomarer Verfügbarkeitsprüfung zur Vermeidung von Overselling über beide Systeme hinweg. Jede Bestellung erhält eine eindeutige, systemübergreifende ID, sodass tatsächlich nachvollziehbar bleibt, welches System für eine gegebene Bestellung tatsächlich autoritativ ist.

## Cutover für jeden Migrationsabschnitt

Für jeden der drei Migrationsabschnitte (Produktkatalog, Bestellabwicklung, Zahlung) wird gemäß KB-0695 ein separater Cutover mit eigenem Probelauf, eigener Rollbackgrenze und eigenen Abnahmekriterien durchgeführt — ein einziger, großer Cutover für das gesamte System würde tatsächlich das in KB-0695 beschriebene, konzentrierte Risiko eines Big-Bang-Ansatzes tragen, das für ein derart geschäftskritisches System tatsächlich nicht vertretbar ist.

## Messbare Geschäftsabnahme

Für jeden Migrationsabschnitt werden explizite, messbare Geschäftsabnahmekriterien definiert (angenommen: für die Produktkatalog-Migration muss die tatsächliche Suchlatenz innerhalb von 10% der bisherigen Latenz bleiben, und die Konversionsrate darf tatsächlich um nicht mehr als 1% sinken) — diese Kriterien folgen dem in KB-0692 beschriebenen PoC-Prinzip vorab definierter Erfolgskriterien, hier jedoch auf einen tatsächlichen Produktivmigrationsabschnitt statt ein Experiment angewendet.

~~~text
FALL-STRUKTUR (Zusammenfassung):
  SCHRITTWEISE ABLÖSUNG (Strangler Fig): Produktkatalog zuerst, dann Bestellabwicklung,
    dann Zahlung -- geringstes Risiko zuerst
  DATENKONSISTENZ: bidirektionale Synchronisation während Übergang, eindeutige,
    systemübergreifende Bestell-ID, atomare Verfügbarkeitsprüfung
  CUTOVER PRO ABSCHNITT: separater Probelauf, Rollbackgrenze und Abnahmekriterien je
    Abschnitt statt einem großen Big-Bang-Cutover
  MESSBARE GESCHÄFTSABNAHME: explizite, vorab definierte Kriterien (Latenz,
    Konversionsrate) pro Abschnitt
Jede Annahme (Bestellvolumen, Toleranzschwellen) ist EXPLIZIT als Beispielannahme
  markiert, keine reale Projektangabe.
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Strangler-Fig-Reihenfolge (geringstes Risiko zuerst) | minimiert Gesamtrisiko der Migration | folgt KB-0694-Prinzip |
| Bidirektionale Datensynchronisation mit eindeutiger ID | erhält Datenkonsistenz während Parallelbetrieb | folgt KB-0666-Prinzip |
| Separater Cutover je Migrationsabschnitt | vermeidet konzentriertes Big-Bang-Risiko | folgt KB-0695-Prinzip |
| Vorab definierte, messbare Geschäftsabnahmekriterien | bestätigt Migrationserfolg ohne Geschäftsschaden | folgt KB-0692-PoC-Prinzip |

## Scalability, Reliability, Security und Observability

Der Fall skaliert über die angenommene Anzahl der Migrationsabschnitte; die Reliability-Grenze liegt darin, dass eine unzureichende Datenkonsistenzsicherung während des Parallelbetriebs tatsächlich zu Bestellverlust oder Overselling führen könnte.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| während des Parallelbetriebs treten Dateninkonsistenzen zwischen Alt- und Neusystem auf | die bidirektionale Synchronisation oder die eindeutige, systemübergreifende ID war unzureichend implementiert | die Synchronisationslogik und ID-Zuordnung gemäß KB-0666 erneut prüfen |
| die Geschäftsabnahmekriterien für einen Migrationsabschnitt werden nicht erfüllt | der Cutover wurde ohne ausreichenden Probelauf durchgeführt | den Cutover gemäß KB-0695 zurückrollen und mit einem umfassenderen Probelauf wiederholen |
| die Migration eines Abschnitts dauert deutlich länger als geplant | die Reihenfolge der Migrationsabschnitte hat unerwartete Abhängigkeiten zwischen Alt- und Neusystem offengelegt | die verbleibenden Abschnitte anhand der neuen Erkenntnis neu planen |

## Trade-offs und Entscheidungen

Dieser Fall demonstriert auf **Staff**-Ebene die korrekte technische Umsetzung eines einzelnen Cutover-Abschnitts. Auf **Principal**-Ebene demonstriert er die vollständige Strangler-Fig-Sequenzierung mit Datenkonsistenzsicherung. Auf **Chief**-Ebene demonstriert er die geschäftliche Absicherung durch messbare Abnahmekriterien, die die Geschäftsfortführung während der gesamten Migration garantieren.

## Production Checklist

- [ ] Die Migration erfolgt schrittweise nach dem Prinzip geringsten Risikos zuerst.
- [ ] Datenkonsistenz während des Parallelbetriebs ist durch bidirektionale Synchronisation und eindeutige IDs gesichert.
- [ ] Jeder Migrationsabschnitt hat einen eigenen Cutover mit Probelauf und Rollbackgrenze.
- [ ] Messbare Geschäftsabnahmekriterien sind vorab für jeden Abschnitt definiert.

## Interviewfragen

### 1. Warum wird die Produktkatalog-Funktion vor der Zahlungsabwicklung migriert?

**Antwort:** Weil die Reihenfolge nach dem Prinzip geringsten Risikos zuerst erfolgt — die am wenigsten kritische Funktion wird zuerst migriert, um das Gesamtrisiko der Migration zu minimieren.

### 2. Warum ist eine eindeutige, systemübergreifende Bestell-ID während des Parallelbetriebs notwendig?

**Antwort:** Damit nachvollziehbar bleibt, welches System für eine gegebene Bestellung tatsächlich autoritativ ist, was Dateninkonsistenzen oder Overselling verhindert.

### 3. Warum wird für jeden Migrationsabschnitt ein separater statt ein einziger, großer Cutover durchgeführt?

**Antwort:** Um das konzentrierte Risiko eines Big-Bang-Ansatzes zu vermeiden, das für ein geschäftskritisches System nicht vertretbar wäre.

### 4. Was macht eine Geschäftsabnahme "messbar" statt vage?

**Antwort:** Explizite, vorab definierte Kriterien wie eine maximale Latenzabweichung oder eine maximal zulässige Konversionsratenverschlechterung, statt einer allgemeinen Aussage wie "die Migration soll erfolgreich sein".

### 5. Wie würdest du vorgehen, wenn während des Parallelbetriebs Dateninkonsistenzen zwischen Alt- und Neusystem auftreten?

**Antwort:** Ich würde die bidirektionale Synchronisationslogik und die eindeutige ID-Zuordnung erneut prüfen, um die Ursache der Inkonsistenz zu identifizieren und zu beheben, bevor der nächste Migrationsabschnitt beginnt.

### 6. Widersprüchliche Anforderung: Die Geschäftsführung will eine schnelle, vollständige Migration innerhalb weniger Wochen UND die Organisation will null Geschäftsunterbrechung mit vollständiger Datenkonsistenzsicherung — wie würdest du diesen Fall lösen?

**Antwort:** Ich würde die schrittweise, nach Risiko geordnete Migration mit separaten Cutover-Punkten beibehalten, da eine überstürzte, vollständige Migration innerhalb weniger Wochen das Risiko einer Geschäftsunterbrechung tatsächlich erheblich erhöhen würde — ich würde stattdessen transparent kommunizieren, dass die Geschäftsfortführungsgarantie eine realistische, mehrmonatige Zeitplanung erfordert.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Lab ist Teil des im Kapitel beschriebenen, vollständig fiktiven Übungsfalls, keine reale Projekterfahrung.

~~~python
# Local, deterministic illustration of measurable business acceptance criteria for a migration segment (fictional lab example, no real migration):

def evaluate_business_acceptance(new_latency_ms, old_latency_ms, new_conversion_rate, old_conversion_rate, latency_tolerance_pct=10, conversion_tolerance_pct=1):
    latency_increase_pct = (new_latency_ms - old_latency_ms) / old_latency_ms * 100
    conversion_drop_pct = (old_conversion_rate - new_conversion_rate) / old_conversion_rate * 100
    return {
        "latency_acceptable": latency_increase_pct <= latency_tolerance_pct,
        "conversion_acceptable": conversion_drop_pct <= conversion_tolerance_pct,
    }

result = evaluate_business_acceptance(new_latency_ms=105, old_latency_ms=100, new_conversion_rate=0.048, old_conversion_rate=0.05)
print(result)
~~~

Erwartete Beobachtung: Die Prüfung zeigt an, ob der migrierte Produktkatalog-Abschnitt die vorab definierten Latenz- und Konversionskriterien tatsächlich erfüllt. Auswertung: Diese messbare Abnahme ermöglicht eine objektive Entscheidung, ob der nächste Migrationsabschnitt begonnen werden kann, statt eine subjektive Einschätzung zu verwenden.

## Dependencies, Cross-References und Quellen

1. Martin Fowler: [StranglerFigApplication — Incremental Legacy Migration Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html), abgerufen 2026-09-18.
2. Amazon Web Services: [AWS Prescriptive Guidance — Migration Strategies and Cutover Planning](https://docs.aws.amazon.com/prescriptive-guidance/latest/strategy-database-migration/), abgerufen 2026-09-18.

Dieses Kapitel schließt die in KB-0713 bis KB-0717 etablierte Reihe vollständiger Übungsfälle ab und nutzt die in KB-0666 (Inventory Consistency), KB-0694 (Modernisierungsprogramme leiten), KB-0695 (Migrationsstrategie und Cutover) sowie KB-0692 (PoCs und Erfolgskriterien) beschriebenen Prinzipien.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Datenkonsistenzprüfung (Dual-Write-Verification-Werkzeuge) zur Echtzeit-Erkennung von Synchronisationsabweichungen während einer laufenden Migration | Growing Adoption | Bei künftigen, ähnlichen Fällen evaluieren, jedoch die grundlegende Strangler-Fig-Sequenzierung und Cutover-Planung unabhängig vom gewählten Prüfwerkzeug zuerst konzeptionell festlegen. |

Ein Team akzeptiert diesen Migrationsfall als vollständig bearbeitet, wenn schrittweise Ablösung, Datenkonsistenz, Cutover und messbare Geschäftsabnahme nachweislich mit expliziten, klar gekennzeichneten Annahmen kohärent zusammengeführt sind.
