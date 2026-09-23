---
{"id": "KB-0246", "title": "Strukturierte Modellausgaben", "domain": "11", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0244", "concepts": ["Prompt Design"], "needed_for": "understanding"}], "related": ["KB-0206"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Validierungsmodell implementieren, das zwischen syntaktisch korrekter und semantisch korrekter JSON-Ausgabe unterscheidet.", "rationale": "Der Unterschied zwischen Schema-Konformität und fachlicher Korrektheit wird erst durch konkrete Unterscheidung beider Prüfebenen greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Validierungsstrategie (Schema plus semantische Prüfung) für strukturierte Modellausgaben in einem konkreten Anwendungsfall begründet gestalten.", "rationale": "Reine Schema-Validierung fängt nur strukturelle Fehler ab, nicht fachlich falsche, aber syntaktisch valide Werte."}, "STAFF-TARGET": {"active": true, "scope": "Einen nachgelagerten fachlichen Fehler auf ein semantisch falsches, aber schema-valides Feld statt auf einen Parsing-Fehler zurückführen können.", "rationale": "Ein Feld kann das erwartete JSON-Schema erfüllen und trotzdem einen fachlich falschen Wert enthalten, was reine Schema-Validierung nicht erkennt."}, "CHIEF-TARGET": {"active": true, "scope": "Strukturierte Modellausgaben als zweistufiges Validierungsproblem (Syntax und Semantik) positionieren, nicht als durch Schema allein gelöst.", "rationale": "Constrained Decoding garantiert Schema-Konformität, aber keine fachliche Korrektheit der eingesetzten Werte."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Anbieterspezifische Constrained-Decoding-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist die Unterscheidung von Syntax- und Semantikvalidierung, nicht die Decoding-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0246-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für zweistufige Validierung (Schema plus fachliche Prüfung) strukturierter Ausgaben", "evidence": "Ein JSON-Objekt kann ein definiertes Schema vollständig erfüllen (korrekte Typen, alle Pflichtfelder vorhanden) und trotzdem einen fachlich unplausiblen oder falschen Wert enthalten, den nur eine zusätzliche semantische Prüfung erkennt.", "limitations": "Kein echtes constrained-decoding-fähiges Modell, keine reale Produktionsintegration, keine Produktion."}]}
---
# Strukturierte Modellausgaben

> **Ziel:** Constrained Decoding garantiert, dass eine Modellausgabe einem definierten JSON-Schema entspricht (Syntax) — aber Schema-Konformität ist keine Garantie fachlicher Korrektheit (Semantik). Ein Feld kann alle Typ- und Pflichtfeld-Anforderungen erfüllen und trotzdem einen falschen Wert enthalten; strukturierte Ausgaben brauchen deshalb zweistufige Validierung, nicht nur Schema-Prüfung.

## Zweck, Mental Model und Dependencies

JSON-Schemas definieren die strukturelle Form einer erwarteten Ausgabe (welche Felder, welche Datentypen, welche Pflichtfelder) — sie sind ein Vertrag über Syntax, vergleichbar mit den Schema-Kompatibilitätsregeln bei Data Contracts (siehe verwandte NoSQL-Datenmodellierungsprinzipien in [KB-0206](../09-databases-storage/12-nosql-kategorien-und-datenmodelle.md)). Constrained Decoding ist ein Mechanismus, der die Modellausgabe während der Generierung selbst auf ein gültiges Schema beschränkt — statt Freitext zu generieren und nachträglich zu hoffen, dass er valides JSON ergibt, wird die Ausgabe schrittweise so gesteuert, dass sie das Schema strukturell nicht verletzen kann. Das eliminiert eine ganze Klasse von Fehlern (fehlende Anführungszeichen, falsche Typen, fehlende Pflichtfelder), löst aber nicht das fundamental andere Problem der semantischen Korrektheit: ein Feld "betrag" vom Typ Zahl kann schema-konform mit dem Wert `-500` befüllt sein, obwohl ein negativer Betrag fachlich unsinnig ist für diesen Kontext, oder ein Feld "kategorie" kann einen syntaktisch gültigen String-Wert enthalten, der aber keiner der fachlich erlaubten Kategorien entspricht. Refusals (das Modell weigert sich, eine Ausgabe zu generieren) und semantisch falsche, aber schema-valide Felder sind zwei unterschiedliche Fehlerklassen, die unterschiedliche Behandlung erfordern — ein Refusal ist explizit erkennbar, ein semantisch falscher, aber syntaktisch korrekter Wert ist es ohne zusätzliche Prüfung nicht.

~~~text
JSON Schema:          defines STRUCTURE (field types, required fields) -> a syntax contract
Constrained decoding:  generation is steered to NEVER violate the schema -> eliminates structural errors
Schema-valid but semantically wrong:  {"amount": -500} passes schema (it IS a number), but is factually nonsensical
Two DIFFERENT failure classes: refusal (explicit, detectable) vs. semantically-wrong-but-valid (silent, needs extra check)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Schema-Vollständigkeit | deckt das definierte Schema alle strukturell relevanten Constraints ab (Typen, Pflichtfelder, Wertebereiche wo möglich)? | ein zu grobes Schema lässt strukturell unerwünschte, aber technisch "gültige" Werte durch |
| Semantische Validierung | ist eine zusätzliche fachliche Prüfung nach der Schema-Validierung vorhanden? | fehlende semantische Prüfung lässt syntaktisch korrekte, aber fachlich falsche Werte unentdeckt |
| Refusal-Behandlung | wird eine explizite Modellweigerung von einer fehlerhaften, aber "erfolgreichen" Ausgabe unterschieden? | Refusals werden fälschlich wie normale, aber leere Antworten behandelt, statt als eigene Fehlerklasse erkannt |
| Fehlerbehandlungspfad | ist definiert, was bei Schema- oder Semantikverletzung geschieht (Retry, Eskalation, Ablehnung)? | fehlende Fehlerbehandlung lässt fehlerhafte strukturierte Ausgaben unkontrolliert in nachgelagerte Systeme durchsickern |

Implementierung: JSON-Schemas werden so vollständig wie möglich definiert, inklusive Wertebereichs-Constraints, wo das Schema-Format dies unterstützt (z. B. Enum-Werte für Kategoriefelder, Minimalwerte für Zahlenfelder), um bereits auf syntaktischer Ebene möglichst viele fachlich unerwünschte Werte auszuschließen. Zusätzlich zur Schema-Validierung wird eine explizite semantische Prüfschicht implementiert, die fachliche Plausibilität prüft, die das Schema-Format allein nicht ausdrücken kann (z. B. Konsistenz zwischen mehreren Feldern, komplexere Geschäftsregeln). Refusals werden explizit als eigene Antwortklasse erkannt und behandelt, getrennt von erfolgreichen, aber möglicherweise semantisch fehlerhaften Ausgaben. Ein definierter Fehlerbehandlungspfad (automatischer Retry mit angepasstem Prompt, Eskalation an einen Menschen, oder explizite Ablehnung) wird für beide Fehlerklassen (Schema-Verletzung und Semantik-Verletzung) festgelegt.

## Scalability, Reliability, Security und Observability

Constrained Decoding skaliert strukturelle Zuverlässigkeit zuverlässig, da es eine ganze Fehlerklasse (Schema-Verletzungen) strukturell eliminiert, unabhängig von der Anfragemenge. Reliability-Grenze: semantische Fehler bleiben unabhängig von Constrained Decoding bestehen und sind ein latentes Risiko, das erst sichtbar wird, wenn nachgelagerte Systeme einen schema-validen, aber fachlich falschen Wert verarbeiten, ohne dass eine semantische Prüfung dies vorher abgefangen hat.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nachgelagertes System verarbeitet einen fachlich unsinnigen Wert trotz erfolgreicher Schema-Validierung | Feld ist syntaktisch schema-konform, aber semantisch falsch, keine zusätzliche Prüfung vorhanden | den konkreten Wert manuell auf fachliche Plausibilität prüfen, unabhängig vom Schema-Validierungsergebnis |
| Anwendung behandelt eine Modellweigerung wie eine normale, aber leere Antwort | Refusal wird nicht als eigene, explizit erkennbare Antwortklasse behandelt | Antwortverarbeitungslogik auf explizite Refusal-Erkennung prüfen |
| fehlerhafte strukturierte Ausgaben erreichen unkontrolliert nachgelagerte Systeme | kein definierter Fehlerbehandlungspfad bei Schema- oder Semantikverletzung | Fehlerbehandlungslogik auf explizite Reaktion (Retry/Eskalation/Ablehnung) bei beiden Fehlerklassen prüfen |
| Team vertraut strukturierten Ausgaben vollständig, ohne semantische Stichprobenprüfung | Annahme, dass Schema-Konformität gleichbedeutend mit fachlicher Korrektheit ist | Stichprobe schema-valider Ausgaben auf fachliche Plausibilität manuell verifizieren |

Security: strukturierte Ausgaben, die direkt in nachgelagerte Aktionen (z. B. API-Aufrufe, Datenbankoperationen) übersetzt werden, sollten trotz Schema-Konformität nicht blind vertraut werden — ein schema-valider, aber manipulierter oder fachlich falscher Wert könnte unbeabsichtigte Aktionen auslösen, wenn keine semantische Prüfung vor der Ausführung erfolgt. Observability: Schema-Validierungsfehlerrate, semantische Validierungsfehlerrate (separat gemessen) und Refusal-Rate sind zentrale, getrennt zu überwachende Metriken für strukturierte Ausgabequalität.

## Trade-offs und Entscheidungen

**Staff** implementiert semantische Validierung zusätzlich zur Schema-Validierung, nicht als Ersatz dafür. **Principal** macht die Unterscheidung zwischen Refusal und semantisch fehlerhafter, aber "erfolgreicher" Ausgabe für das Team explizit nachvollziehbar. **Chief** positioniert strukturierte Modellausgaben als zweistufiges Validierungsproblem, nicht als durch Schema-Konformität allein gelöst.

Anti-Patterns: Schema-Validierung als ausreichenden Nachweis fachlicher Korrektheit behandeln; Refusals wie normale, aber leere Antworten ohne explizite Erkennung verarbeiten; strukturierte Ausgaben ohne definierten Fehlerbehandlungspfad direkt in nachgelagerte Systeme durchreichen.

## Production Checklist

- [ ] JSON-Schema definiert Wertebereichs-Constraints, wo das Format dies unterstützt (Enums, Minimalwerte).
- [ ] Eine explizite semantische Validierungsschicht ergänzt die Schema-Validierung.
- [ ] Refusals werden als eigene, explizit erkannte Antwortklasse behandelt.
- [ ] Ein definierter Fehlerbehandlungspfad existiert für Schema- und Semantikverletzungen.

## Interviewfragen

### 1. Was garantiert Constrained Decoding, und was garantiert es nicht?

**Antwort:** Constrained Decoding garantiert strukturelle Schema-Konformität (korrekte Typen, vorhandene Pflichtfelder), garantiert aber nicht fachliche Korrektheit — ein Feld kann schema-valide und trotzdem semantisch falsch sein.

### 2. Warum reicht Schema-Validierung allein nicht aus, um strukturierte Ausgaben als korrekt zu betrachten?

**Antwort:** Schema-Validierung prüft nur strukturelle Eigenschaften (Typ, Vorhandensein), nicht fachliche Plausibilität; ein Zahlenfeld kann einen technisch validen, aber fachlich unsinnigen Wert (z. B. negativer Betrag in einem Kontext, der nur positive Werte erlaubt) enthalten, den reine Schema-Prüfung nicht erkennt.

### 3. Warum müssen Refusals und semantisch falsche Ausgaben unterschiedlich behandelt werden?

**Antwort:** Ein Refusal ist eine explizite, erkennbare Modellweigerung, während ein semantisch falscher, aber schema-valider Wert wie eine "erfolgreiche" Ausgabe erscheint — ohne getrennte Behandlung könnte ein Refusal übersehen oder eine fehlerhafte Ausgabe fälschlich als erfolgreich akzeptiert werden.

### 4. Wie diagnostizierst du, dass ein nachgelagertes System einen fachlich falschen, aber schema-validen Wert verarbeitet hat?

**Antwort:** Ich prüfe den konkreten Wert manuell auf fachliche Plausibilität, unabhängig vom Ergebnis der Schema-Validierung — ein erfolgreiches Schema-Validierungsergebnis ist kein Beweis fachlicher Korrektheit und muss separat verifiziert werden.

### 5. Welche Arten von Constraints können in einem JSON-Schema ausgedrückt werden, um semantische Fehler bereits strukturell zu reduzieren?

**Antwort:** Enum-Werte für Kategoriefelder, Minimal-/Maximalwerte für Zahlenfelder und Musterprüfungen für String-Formate können einen Teil fachlicher Constraints bereits auf Schema-Ebene erzwingen, ersetzen aber keine vollständige semantische Prüfung für komplexere, feldübergreifende Geschäftsregeln.

### 6. Widersprüchliche Anforderung: Team will garantiert immer eine strukturierte Ausgabe erhalten (nie einen Refusal) UND garantiert fachlich korrekte Werte in jedem Feld — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein erzwungener "immer eine Ausgabe"-Modus einen Refusal in eine möglicherweise fachlich falsche, aber schema-valide Notlösung verwandeln könnte, was dem zweiten Ziel (fachliche Korrektheit) widerspricht; ich würde vorschlagen, Refusals als legitime, informative Antwortklasse zuzulassen und stattdessen in die semantische Validierungsschicht zu investieren, die fachlich falsche Werte zuverlässig erkennt, statt beide Ziele durch Unterdrückung von Refusals in Konflikt zu bringen.

## Praktische Labs

~~~python
# Two-stage validation: schema (syntax) + semantic (business logic)
import json

schema_required_fields = {"order_id": str, "amount": (int, float), "category": str}
valid_categories = {"electronics", "clothing", "food"}

def validate_schema(record):
    for field, expected_type in schema_required_fields.items():
        if field not in record:
            return False, f"missing required field: {field}"
        if not isinstance(record[field], expected_type):
            return False, f"field '{field}' has wrong type"
    return True, "schema valid"

def validate_semantics(record):
    if record["amount"] < 0:
        return False, "amount cannot be negative (business rule)"
    if record["category"] not in valid_categories:
        return False, f"category '{record['category']}' is not a recognized business category"
    return True, "semantically valid"

test_record = {"order_id": "ord-1", "amount": -50, "category": "electronics"}

schema_ok, schema_msg = validate_schema(test_record)
print(f"Schema validation: {schema_ok} ({schema_msg})")
assert schema_ok is True  # passes schema - amount IS a number, all fields present

semantic_ok, semantic_msg = validate_semantics(test_record)
print(f"Semantic validation: {semantic_ok} ({semantic_msg})")
assert semantic_ok is False  # fails business logic despite passing schema

print("\nThe record is SCHEMA-VALID but SEMANTICALLY WRONG - schema validation alone would have missed this.")
~~~

## Dependencies, Cross-References und Quellen

1. OpenAI: [Structured Outputs Guide](https://platform.openai.com/docs/guides/structured-outputs), abgerufen 2026-09-17.
2. Anthropic: [Tool Use and Structured Output](https://docs.anthropic.com/en/docs/build-with-claude/tool-use), abgerufen 2026-09-17.
3. JSON Schema: [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/), abgerufen 2026-09-17.

NoSQL-Schema-Grundlagen sind kanonisch in [KB-0206](../09-databases-storage/12-nosql-kategorien-und-datenmodelle.md) behandelt. Anbieterspezifische Constrained-Decoding-Implementierung vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Native, anbieterseitig garantierte Schema-Konformität ohne nachträgliches Parsing/Retry | Established | Gegenüber selbstgebautem Prompt-basiertem JSON-Format-Versuch standardmäßig bevorzugen. |
| Kombinierte Schema- und Semantik-Validierungs-Frameworks mit deklarativer Geschäftsregel-Definition | Adopting | Für komplexe, feldübergreifende Geschäftsregeln gegenüber manuell programmierter Validierungslogik evaluieren. |

Ein Team akzeptiert eine strukturierte Ausgabe-Integration erst, wenn sowohl Schema- als auch semantische Validierung nachweisbar implementiert und getrennt überwacht werden.
