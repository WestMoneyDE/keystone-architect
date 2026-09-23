---
{"id": "KB-0220", "title": "Kafka für Streaming Data Products", "domain": "10", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0179", "concepts": ["Kafka Broker-Grundlagen"], "needed_for": "understanding"}, {"id": "KB-0219", "concepts": ["ETL/ELT"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Schema-Contract-Validierungsmodell für Topic-Producer lokal implementieren.", "rationale": "Der Unterschied zwischen einem rohen Ereignisstrom und einem vertraglich definierten Datenprodukt wird erst durch Schema-Validierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Topic-Grenzen als Datenproduktgrenzen für einen konkreten Domänenkontext begründet gestalten, mit klarer Ownership-Zuordnung.", "rationale": "Unklare Topic-Ownership erzeugt Verantwortungslücken bei Schema-Änderungen und Datenqualitätsproblemen."}, "STAFF-TARGET": {"active": true, "scope": "Nachgelagerte Konsumentenfehler auf eine unangekündigte Schema-Änderung statt auf einen Konsumenten-Bug zurückführen können.", "rationale": "Ohne Data Contracts können Producer-Änderungen nachgelagerte Konsumenten unbemerkt brechen."}, "CHIEF-TARGET": {"active": true, "scope": "Kafka-Topics als Datenproduktgrenzen mit expliziten Contracts positionieren, nicht als reine technische Transportschicht.", "rationale": "Diese Datei behandelt Topics aus Datenprodukt-Perspektive (Contracts, Replay, Ownership); Brokerbetrieb und Zustellsemantik bleiben kanonisch in Domain 08."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Schema-Registry-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip von Data Contracts und Ownership, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0220-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Schema-Contract-Validierung bei Topic-Produktion", "evidence": "Ein Producer, der gegen einen definierten Schema-Contract validiert, kann inkompatible Änderungen vor der Veröffentlichung erkennen, statt nachgelagerte Konsumenten unbemerkt zu brechen.", "limitations": "Kein echtes Kafka-Cluster, keine reale Schema Registry, keine Produktion."}]}
---
# Kafka für Streaming Data Products

> **Ziel:** Ein Kafka-Topic wird zum Datenprodukt, wenn es einen expliziten Contract (Schema, Semantik, Garantien), klare Ownership und Replay-Fähigkeit bietet — nicht allein durch die technische Existenz des Topics. Ohne Data Contracts können Producer-Änderungen nachgelagerte Konsumenten unbemerkt brechen, was Vertrauen in die Plattform als Ganzes untergräbt.

## Zweck, Mental Model und Dependencies

Ein rohes Kafka-Topic (Broker-Mechanik siehe [KB-0179](../08-messaging-workflows/03-kafka-und-partitionierte-ereignislogs.md)) ist zunächst nur ein technischer Transportmechanismus — es wird zu einem Datenprodukt, wenn es zusätzlich einen expliziten Contract trägt: ein versioniertes Schema, das definiert, welche Felder mit welcher Semantik garantiert vorhanden sind, und Kompatibilitätsregeln, die festlegen, welche Änderungen konsumierende Systeme nicht brechen. Ownership bedeutet, dass ein Team explizit verantwortlich für ein Topic als Datenprodukt ist — für Schema-Evolution, Datenqualität und Kommunikation von Änderungen an Konsumenten, nicht nur für den technischen Betrieb des zugrunde liegenden Kafka-Clusters. Replay-Fähigkeit (die Möglichkeit, historische Ereignisse aus einem Topic erneut zu konsumieren) macht ein Topic zu einer wiederverwendbaren Datenquelle für neue Konsumenten, nicht nur zu einem flüchtigen Echtzeit-Strom — das unterscheidet ein Datenprodukt-Topic von einem rein transienten Messaging-Kanal. Lies [KB-0179](../08-messaging-workflows/kafka-und-partitionierte-ereignisloges.md) und [KB-0219](01-etl-und-elt.md).

~~~text
Raw Kafka topic:        technical transport -> no guarantees about schema, no clear owner
Data product topic:     versioned schema contract + explicit owner + replay capability -> trustworthy for downstream consumers
Producer change without contract check -> downstream consumers break silently, trust in the platform erodes
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Schema-Contract | ist ein versioniertes Schema mit expliziten Kompatibilitätsregeln definiert? | Producer-Änderung bricht nachgelagerte Konsumenten unbemerkt ohne Contract-Prüfung |
| Explizite Ownership | ist ein Team eindeutig für Schema-Evolution und Datenqualität des Topics verantwortlich? | unklare Ownership erzeugt Verantwortungslücken bei Problemen oder Änderungsanfragen |
| Replay-Fähigkeit | können neue Konsumenten historische Ereignisse aus dem Topic erneut lesen? | ohne Replay-Fähigkeit ist ein Topic nur für Echtzeit-Konsumenten nutzbar, keine wiederverwendbare Datenquelle |
| Kompatibilitätsprüfung | wird jede Schema-Änderung vor Veröffentlichung gegen bestehende Konsumenten geprüft? | inkompatible Änderungen erreichen Produktion und brechen Konsumenten zur Laufzeit |

Implementierung: jedes als Datenprodukt positionierte Topic erhält ein versioniertes Schema (z. B. über eine Schema Registry) mit expliziten Kompatibilitätsregeln (z. B. rückwärtskompatibel: neue optionale Felder erlaubt, Entfernen bestehender Felder nicht). Producer-seitige Validierung prüft jede Veröffentlichung gegen den aktuellen Contract, bevor Nachrichten das Topic erreichen. Ownership wird explizit dokumentiert (welches Team ist verantwortlich, über welchen Kanal werden Änderungen kommuniziert) und mit einem definierten Prozess für Schema-Evolution verbunden. Retention-Konfiguration wird bewusst für Replay-Fähigkeit dimensioniert (ausreichend lange Aufbewahrung, damit neue Konsumenten historische Daten nachladen können), statt nur für minimale Speicherkosten optimiert zu werden.

## Scalability, Reliability, Security und Observability

Datenprodukt-Topics mit klaren Contracts skalieren organisatorisch besser als undokumentierte Rohdaten-Topics, weil neue Konsumenten sich ohne direkte Rücksprache mit dem Producer-Team auf die dokumentierten Garantien verlassen können. Reliability-Grenze: fehlende Kompatibilitätsprüfung ist ein latentes Risiko, das erst sichtbar wird, wenn eine Producer-Änderung tatsächlich veröffentlicht wird und nachgelagerte Konsumenten zur Laufzeit brechen, oft ohne unmittelbaren Zusammenhang für das Producer-Team erkennbar.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nachgelagerter Konsument bricht plötzlich, ohne dass an seinem eigenen Code etwas geändert wurde | Producer hat eine inkompatible Schema-Änderung ohne Contract-Prüfung veröffentlicht | Schema-Änderungshistorie des Topics um den Fehlerzeitpunkt herum prüfen |
| neuer Konsument kann historische Daten nicht laden, obwohl das Topic seit langem existiert | Retention-Konfiguration war nicht für Replay-Fähigkeit dimensioniert | Retention-Dauer des Topics gegen den benötigten historischen Zeitraum des neuen Konsumenten prüfen |
| Team weiß nicht, wen es bei einem Datenqualitätsproblem in einem Topic kontaktieren soll | Ownership für das Topic als Datenprodukt ist nicht explizit dokumentiert | Ownership-Dokumentation für das betroffene Topic prüfen |
| unterschiedliche Konsumenten interpretieren dieselben Felder unterschiedlich | Schema-Contract definiert Semantik nicht ausreichend explizit | Schema-Dokumentation auf explizite semantische Definition jedes Feldes prüfen, nicht nur Typinformation |

Security: Data Contracts sollten auch explizit festlegen, welche Felder sensible Daten enthalten und welche Zugriffsbeschränkungen für Konsumenten gelten, da ein Topic mit unklarer Sensitivitätsklassifikation versehentlich sensible Daten an unautorisierte Konsumenten weitergeben kann. Observability: Schema-Änderungshistorie, Kompatibilitätsprüfungs-Fehlerrate und Konsumenten-Registrierung (wer konsumiert welches Topic) sind zentrale Metriken für Datenprodukt-Governance.

## Trade-offs und Entscheidungen

**Staff** implementiert Producer-seitige Schema-Contract-Validierung vor jeder Veröffentlichung. **Principal** macht Ownership und Änderungskommunikation für Konsumenten-Teams explizit nachvollziehbar. **Chief** positioniert Kafka-Topics als Datenproduktgrenzen mit expliziten Contracts, nicht als reine technische Transportschicht ohne Garantien.

Anti-Patterns: Schema-Änderungen ohne Kompatibilitätsprüfung direkt veröffentlichen; Topics ohne dokumentierte Ownership betreiben; Retention ausschließlich nach minimalen Speicherkosten dimensionieren, ohne Replay-Bedarf neuer Konsumenten zu berücksichtigen.

## Production Checklist

- [ ] Jedes Datenprodukt-Topic hat ein versioniertes Schema mit expliziten Kompatibilitätsregeln.
- [ ] Producer-seitige Validierung prüft jede Veröffentlichung gegen den aktuellen Contract.
- [ ] Ownership ist explizit dokumentiert, inklusive Kommunikationskanal für Änderungen.
- [ ] Retention ist bewusst für Replay-Fähigkeit dimensioniert, nicht nur für minimale Speicherkosten.

## Interviewfragen

### 1. Was unterscheidet ein rohes Kafka-Topic von einem Datenprodukt-Topic?

**Antwort:** Ein Datenprodukt-Topic trägt zusätzlich einen expliziten Contract (versioniertes Schema mit Kompatibilitätsregeln), hat klare Ownership und bietet Replay-Fähigkeit für historische Daten — ein rohes Topic ist nur ein technischer Transportmechanismus ohne diese Garantien.

### 2. Warum ist eine Kompatibilitätsprüfung vor jeder Schema-Änderung wichtig?

**Antwort:** Ohne Kompatibilitätsprüfung kann eine Producer-seitige Änderung nachgelagerte Konsumenten unbemerkt brechen, da diese sich auf das bisherige Schema verlassen — eine explizite Prüfung fängt inkompatible Änderungen vor der Veröffentlichung ab.

### 3. Warum ist Ownership für ein Kafka-Topic als Datenprodukt wichtiger als für ein rein technisches Topic?

**Antwort:** Als Datenprodukt hat das Topic externe Konsumenten, die sich auf Datenqualität und Schema-Stabilität verlassen; ohne explizite Ownership gibt es keine klare Verantwortlichkeit für Schema-Evolution, Datenqualitätsprobleme oder Kommunikation von Änderungen.

### 4. Wie diagnostizierst du, warum ein nachgelagerter Konsument plötzlich ohne eigene Codeänderung bricht?

**Antwort:** Ich prüfe die Schema-Änderungshistorie des konsumierten Topics um den Fehlerzeitpunkt herum — eine unangekündigte, inkompatible Producer-seitige Schema-Änderung ist die wahrscheinlichste Ursache für einen plötzlichen Bruch ohne eigene Codeänderung.

### 5. Warum reicht kurze Retention-Konfiguration nicht für ein Topic aus, das als Datenprodukt dienen soll?

**Antwort:** Neue Konsumenten benötigen oft die Möglichkeit, historische Ereignisse zu laden (Replay), um ihren eigenen Zustand aufzubauen; kurze Retention löscht diese historischen Daten, bevor neue Konsumenten sie nutzen können, was das Topic zu einem rein transienten Kanal statt einer wiederverwendbaren Datenquelle macht.

### 6. Widersprüchliche Anforderung: Producer-Team will maximale Entwicklungsgeschwindigkeit ohne Contract-Overhead UND Konsumenten-Teams wollen garantierte Schema-Stabilität — wie gehst du vor?

**Antwort:** Ich würde erklären, dass unkontrollierte Schema-Änderungen ohne Contract-Prüfung das Vertrauen der Konsumenten-Teams systematisch untergraben und langfristig mehr Reibung erzeugen als eine leichtgewichtige, automatisierte Kompatibilitätsprüfung; ich würde eine automatisierte, in die CI/CD-Pipeline integrierte Schema-Validierung vorschlagen, die schnelle Entwicklung ermöglicht, ohne Konsumenten unangekündigt zu brechen.

## Praktische Labs

~~~python
# Schema contract compatibility check for producer publications
current_schema = {"required_fields": {"id", "amount", "timestamp"}, "optional_fields": {"currency"}}

def is_compatible(new_schema, current_schema):
    # backward-compatible: all currently required fields must still be present
    missing_required = current_schema["required_fields"] - (new_schema["required_fields"] | new_schema["optional_fields"])
    if missing_required:
        return False, f"breaking change: removed required fields {missing_required}"
    return True, "compatible"

# Compatible change: adding a new optional field
new_schema_ok = {"required_fields": {"id", "amount", "timestamp"}, "optional_fields": {"currency", "region"}}
ok, msg = is_compatible(new_schema_ok, current_schema)
assert ok is True

# Breaking change: removing a required field
new_schema_broken = {"required_fields": {"id", "amount"}, "optional_fields": {"currency"}}
ok, msg = is_compatible(new_schema_broken, current_schema)
assert ok is False
print(f"New schema (removed 'timestamp'): compatible={ok}, reason='{msg}'")
print("The breaking change is caught BEFORE publication, protecting downstream consumers.")
~~~

## Dependencies, Cross-References und Quellen

1. Confluent: [Schema Registry and Compatibility Types](https://docs.confluent.io/platform/current/schema-registry/fundamentals/schema-evolution.html), abgerufen 2026-09-17.
2. Data Mesh Principles: [Data as a Product](https://www.datamesh-architecture.com/), abgerufen 2026-09-17.
3. Apache Kafka: [Log Compaction and Retention](https://kafka.apache.org/documentation/#compaction), abgerufen 2026-09-17.

Kafka-Brokerbetrieb und Zustellsemantik sind kanonisch in Domain 08 behandelt (siehe [KB-0179](../08-messaging-workflows/03-kafka-und-partitionierte-ereignislogs.md)). Produktspezifische Schema-Registry-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Data-Contract-Standards mit maschinenlesbarer Governance-Metadaten (SLA, Ownership, Klassifikation im Contract selbst) | Adopting | Für neue Datenprodukt-Topics standardmäßig strukturierte Contracts statt informeller Dokumentation nutzen. |
| Automatisierte Konsumenten-Impact-Analyse vor Schema-Änderungen | Adopting | Für Topics mit vielen Konsumenten gezielt einsetzen, um Breaking-Change-Risiko vor Veröffentlichung sichtbar zu machen. |

Ein Team akzeptiert ein Kafka-Topic als Datenprodukt erst, wenn Schema-Contract, Ownership und Replay-Fähigkeit nachweisbar dokumentiert sind.
