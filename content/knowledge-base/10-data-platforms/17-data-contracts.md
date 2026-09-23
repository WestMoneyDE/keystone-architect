---
{"id": "KB-0235", "title": "Data Contracts", "domain": "10", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0220", "concepts": ["Kafka Data Products"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Data-Contract-Validierungsmodell mit expliziter Vertragsverletzungserkennung lokal implementieren.", "rationale": "Der Unterschied zwischen impliziter Schema-Kompatibilität und einem expliziten, überprüfbaren Vertrag wird erst durch konkrete Verletzungserkennung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Data-Contract-Struktur (Schema, Semantik, Qualitätszusagen) für eine konkrete Produzenten-Konsumenten-Beziehung begründet gestalten.", "rationale": "Ein vollständiger Data Contract umfasst mehr als reines Schema — Semantik und Qualitätszusagen sind gleichermaßen vertragsrelevant."}, "STAFF-TARGET": {"active": true, "scope": "Eine Vertragsverletzung auf eine identifizierbare Produzentenänderung statt auf eine generelle Datenqualitätsstörung zurückführen können.", "rationale": "Ein formaler Vertrag mit Versionierung erlaubt präzise Rückverfolgung, welche Änderung welche Verletzung ausgelöst hat."}, "CHIEF-TARGET": {"active": true, "scope": "Data Contracts als überprüfbare, versionierte Vereinbarung zwischen Produzenten und Konsumenten positionieren, nicht als informelle Dokumentationskonvention.", "rationale": "Nur ein tatsächlich technisch durchgesetzter und überprüfbarer Vertrag verhindert stillschweigende Vertragsverletzungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Werkzeugspezifische Data-Contract-Spezifikationsformate (z. B. Open Data Contract Standard) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Schema, Semantik, Qualitätszusagen, Versionierung und Ownership, nicht die Spezifikationssyntax."}}, "lab_validation": [{"lab_id": "KB-0235-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Data-Contract-Validierung mit Verletzungserkennung", "evidence": "Ein formaler Vertrag mit Schema-, Semantik- und Qualitätsregeln erlaubt automatische Erkennung, wenn produzierte Daten von der vereinbarten Spezifikation abweichen, mit präziser Angabe der verletzten Regel.", "limitations": "Kein echtes Data-Contract-Werkzeug, keine reale Produzenten-Konsumenten-Beziehung, keine Produktion."}]}
---
# Data Contracts

> **Ziel:** Ein Data Contract ist eine formale, überprüfbare Vereinbarung zwischen Datenproduzent und -konsument über Schema, Semantik und Qualitätszusagen — nicht nur informelle Dokumentation. Versionierung und explizite Ownership-Zuordnung ermöglichen, Vertragsverletzungen präzise auf eine identifizierbare Änderung zurückzuführen, statt sie als diffuse Datenqualitätsstörung zu behandeln.

## Zweck, Mental Model und Dependencies

Ein Data Contract umfasst drei Ebenen, die über reines Schema hinausgehen: Schema (welche Felder mit welchen Datentypen existieren, siehe [KB-0220](02-kafka-fuer-streaming-data-products.md) für den Kafka-spezifischen Fall), Semantik (was ein Feld tatsächlich bedeutet — z. B. ist "created_at" der Zeitpunkt der Datensatzerstellung in der Quelldatenbank oder der Zeitpunkt der Ereigniserzeugung), und Qualitätszusagen (z. B. Vollständigkeitsgarantien, Aktualitätsgarantien, Eindeutigkeitsgarantien). Ein Vertrag ohne explizite Semantik-Dokumentation kann trotz technisch korrektem Schema zu Fehlinterpretation durch Konsumenten führen — dieselbe Feldbezeichnung kann unterschiedlich interpretiert werden, wenn die Bedeutung nicht explizit festgehalten ist. Versionierung ermöglicht, dass ein Vertrag sich kontrolliert weiterentwickeln kann, während Konsumenten explizit wissen, gegen welche Vertragsversion sie entwickelt haben und wann eine neue, möglicherweise inkompatible Version veröffentlicht wurde. Ownership stellt sicher, dass bei einer Vertragsverletzung klar ist, welches Team verantwortlich ist, um die Ursache zu beheben — ohne explizite Ownership wird die Verantwortungsklärung bei einer Verletzung selbst zum zeitraubenden Problem. Lies [KB-0220](02-kafka-fuer-streaming-data-products.md).

~~~text
Schema only:           field types match -> but MEANING of fields can still be misinterpreted
Full data contract:    schema + explicit SEMANTICS + explicit QUALITY guarantees + VERSION + OWNER
Contract violation with versioning -> traceable to a specific producer change, not a vague "data quality issue"
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Semantik-Dokumentation | ist die Bedeutung jedes Feldes explizit dokumentiert, nicht nur sein Datentyp? | Konsumenten interpretieren technisch korrekte Felder fachlich unterschiedlich |
| Qualitätszusagen | sind Vollständigkeits-, Aktualitäts- und Eindeutigkeitsgarantien explizit im Vertrag festgehalten? | Konsumenten treffen implizite Annahmen über Datenqualität, die der Produzent nie zugesichert hat |
| Versionierung | ist jede Vertragsänderung als neue, nachvollziehbare Version veröffentlicht? | undokumentierte Änderungen erschweren die Rückverfolgung von Vertragsverletzungen auf ihre Ursache |
| Automatisierte Vertragsprüfung | wird die Einhaltung des Vertrags automatisch und kontinuierlich geprüft, nicht nur bei Einführung? | schleichende Vertragsverletzungen bleiben unentdeckt, wenn Prüfung nur einmalig erfolgt |

Implementierung: Data Contracts werden als strukturierte, maschinenlesbare Spezifikationen definiert (nicht nur als Prosa-Dokumentation), die Schema, explizite Feldsemantik und Qualitätszusagen (z. B. erwartete Aktualisierungsfrequenz, Nullwert-Toleranz, Eindeutigkeitsgarantien) umfassen. Jede Vertragsänderung wird versioniert veröffentlicht, mit expliziter Kennzeichnung, ob die Änderung rückwärtskompatibel ist oder eine Breaking Change darstellt. Automatisierte Prüfungen (kontinuierlich, nicht nur bei Vertragseinführung) validieren, dass tatsächlich produzierte Daten dem aktuellen Vertrag entsprechen, mit klarer Fehlermeldung bei Abweichung, die die verletzte Regel benennt. Ownership wird pro Vertrag explizit dokumentiert, inklusive eines definierten Eskalationswegs bei Vertragsverletzungen.

## Scalability, Reliability, Security und Observability

Data Contracts skalieren Vertrauen zwischen Teams in großen Organisationen mit vielen Datenproduzenten und -konsumenten, weil Konsumenten sich auf dokumentierte, überprüfbare Garantien verlassen können, statt bei jeder Nutzung informell mit dem Produzenten-Team Rücksprache halten zu müssen. Reliability-Grenze: ein Vertrag ohne automatisierte, kontinuierliche Prüfung ist nur so verlässlich wie die Disziplin des Produzenten-Teams, ihn manuell einzuhalten — ohne technische Durchsetzung ist er eine unverbindliche Absichtserklärung, keine belastbare Garantie.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Konsument interpretiert ein Feld fachlich anders als vom Produzenten beabsichtigt | Feldsemantik war nicht explizit im Vertrag dokumentiert | Vertragsdokumentation auf explizite semantische Beschreibung des betroffenen Feldes prüfen |
| eine Vertragsverletzung wird spät und ohne klare Ursache entdeckt | Vertragsprüfung erfolgt nicht kontinuierlich automatisiert, sondern nur sporadisch manuell | Prüfprozess auf kontinuierliche, automatisierte Durchsetzung gegen die aktuelle Vertragsversion prüfen |
| Konsument weiß nach einer Verletzung nicht, wen er kontaktieren soll | Ownership ist für den betroffenen Vertrag nicht explizit dokumentiert | Vertragsdokumentation auf explizite Ownership- und Eskalationsweg-Angabe prüfen |
| Vertragsverletzung lässt sich nicht auf eine konkrete Änderung zurückführen | fehlende oder unvollständige Versionierungshistorie des Vertrags | Versionshistorie des Vertrags gegen den Zeitpunkt der beobachteten Verletzung prüfen |

Security: Data Contracts sollten Sensitivitätsklassifikation als Teil der Vertragsspezifikation enthalten, damit Konsumenten wissen, welche Zugriffs- und Verarbeitungseinschränkungen für die enthaltenen Daten gelten, insbesondere bei personenbezogenen oder anderweitig regulierten Daten. Observability: Vertragsverletzungsrate, durchschnittliche Zeit bis zur Verletzungserkennung und -behebung sowie Anzahl aktiver Vertragsversionen sind zentrale Metriken für Data-Contract-Governance-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** implementiert automatisierte, kontinuierliche Vertragsprüfung statt einmaliger manueller Validierung. **Principal** macht explizite Feldsemantik und Qualitätszusagen für Konsumenten-Teams nachvollziehbar dokumentiert. **Chief** positioniert Data Contracts als überprüfbare, technisch durchgesetzte Vereinbarung, nicht als informelle Dokumentationskonvention ohne echte Verbindlichkeit.

Anti-Patterns: Data Contracts nur als Prosa-Dokumentation ohne automatisierte, technisch durchgesetzte Prüfung führen; Feldsemantik implizit lassen und nur Datentypen dokumentieren; Verträge ohne Versionierung ändern, wodurch Rückverfolgung von Verletzungen auf ihre Ursache erschwert wird.

## Production Checklist

- [ ] Vertrag umfasst explizit Schema, Feldsemantik und Qualitätszusagen, nicht nur Datentypen.
- [ ] Jede Vertragsänderung ist versioniert veröffentlicht, mit Kennzeichnung von Breaking Changes.
- [ ] Automatisierte, kontinuierliche Prüfung validiert produzierte Daten gegen den aktuellen Vertrag.
- [ ] Ownership und Eskalationsweg sind pro Vertrag explizit dokumentiert.

## Interviewfragen

### 1. Warum reicht Schema-Übereinstimmung allein nicht aus, um einen vollständigen Data Contract zu definieren?

**Antwort:** Schema beschreibt nur Datentypen, nicht die tatsächliche Bedeutung eines Feldes; zwei Systeme können ein technisch identisches Schema haben, aber ein Feld fachlich unterschiedlich interpretieren, wenn die Semantik nicht explizit dokumentiert ist.

### 2. Warum ist Versionierung für die Rückverfolgung von Vertragsverletzungen wichtig?

**Antwort:** Mit expliziter Versionierung lässt sich eine beobachtete Vertragsverletzung präzise auf eine konkrete, dokumentierte Änderung zurückführen, statt sie als diffuse, schwer diagnostizierbare Datenqualitätsstörung zu behandeln.

### 3. Warum ist ein Data Contract ohne automatisierte Prüfung nur eine unverbindliche Absichtserklärung?

**Antwort:** Ohne kontinuierliche, technisch durchgesetzte Prüfung hängt die Vertragseinhaltung allein von der manuellen Disziplin des Produzenten-Teams ab — Abweichungen vom Vertrag würden nicht automatisch erkannt, was die Garantie praktisch wertlos macht.

### 4. Wie diagnostizierst du, dass ein Konsument ein Feld fachlich falsch interpretiert hat?

**Antwort:** Ich prüfe, ob die Feldsemantik explizit im Vertrag dokumentiert war — fehlende oder unklare semantische Dokumentation ist eine häufige Ursache dafür, dass technisch korrekte Felder fachlich unterschiedlich interpretiert werden.

### 5. Warum ist explizite Ownership-Zuordnung für Data Contracts wichtig?

**Antwort:** Bei einer Vertragsverletzung muss klar sein, welches Team verantwortlich für die Behebung ist; ohne dokumentierte Ownership wird die Verantwortungsklärung selbst zu einer zeitraubenden Verzögerung bei der Problemlösung.

### 6. Widersprüchliche Anforderung: Produzenten-Team will maximale Entwicklungsgeschwindigkeit ohne formale Vertragsdokumentation UND Konsumenten-Teams wollen verlässliche, überprüfbare Garantien für jede Datenänderung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass fehlende formale Verträge kurzfristig Entwicklungsgeschwindigkeit erhöhen, aber langfristig das Vertrauen der Konsumenten-Teams untergraben und zu mehr Reibung bei jeder Änderung führen; ich würde eine leichtgewichtige, in den Entwicklungsworkflow integrierte Vertragsdefinition und automatisierte Prüfung vorschlagen, die schnelle Entwicklung ermöglicht, ohne auf überprüfbare Garantien zu verzichten.

## Praktische Labs

~~~python
# Data contract validation with violation detection
contract_v2 = {
    "version": 2,
    "fields": {
        "order_id": {"type": "string", "nullable": False},
        "amount": {"type": "number", "nullable": False, "min": 0},
        "currency": {"type": "string", "nullable": False},
    },
}

def validate_against_contract(record, contract):
    violations = []
    for field, rules in contract["fields"].items():
        value = record.get(field)
        if value is None and not rules["nullable"]:
            violations.append(f"field '{field}' is required but missing/null (contract v{contract['version']})")
            continue
        if "min" in rules and value is not None and value < rules["min"]:
            violations.append(f"field '{field}' value {value} violates min={rules['min']} (contract v{contract['version']})")
    return violations

good_record = {"order_id": "ord-1", "amount": 100, "currency": "EUR"}
bad_record = {"order_id": "ord-2", "amount": -50, "currency": None}

print(f"Good record violations: {validate_against_contract(good_record, contract_v2)}")
violations = validate_against_contract(bad_record, contract_v2)
print(f"Bad record violations: {violations}")
assert len(violations) == 2
print("Each violation is precisely attributed to a specific contract rule and version - not a vague 'bad data' report.")
~~~

## Dependencies, Cross-References und Quellen

1. Open Data Contract Standard: [ODCS Specification](https://bitol-io.github.io/open-data-contract-standard/latest/), abgerufen 2026-09-17.
2. Data Mesh Principles: [Data Contracts](https://www.datamesh-architecture.com/data-contracts), abgerufen 2026-09-17.
3. Confluent: [Schema Registry and Data Contracts](https://docs.confluent.io/platform/current/schema-registry/fundamentals/data-contracts.html), abgerufen 2026-09-17.

Kafka-spezifische Datenprodukt-Contracts sind kanonisch in [KB-0220](02-kafka-fuer-streaming-data-products.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, werkzeugübergreifende Data-Contract-Spezifikationsformate (z. B. Open Data Contract Standard) | Adopting | Gegenüber proprietären, werkzeugspezifischen Contract-Formaten für Interoperabilität bevorzugen. |
| Contract-Testing direkt in CI/CD-Pipelines integriert, mit Blockierung inkompatibler Deployments | Adopting | Für kritische Datenprodukte standardmäßig einsetzen, um Vertragsverletzungen vor Produktivsetzung abzufangen. |

Ein Team akzeptiert einen Data Contract erst, wenn Semantik, Qualitätszusagen, Versionierung und Ownership nachweisbar vollständig dokumentiert und automatisiert geprüft sind.
