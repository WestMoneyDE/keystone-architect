---
{"id": "KB-0194", "title": "Schema Registry und Stream-Grenzen", "domain": "08", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0141", "concepts": ["Schema Evolution"], "needed_for": "both"}, {"id": "KB-0179", "concepts": ["Kafka"], "needed_for": "understanding"}], "related": ["KB-0190", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Schema-Kompatibilitätsprüfung (backward compatible) lokal implementieren und eine inkompatible Änderung ablehnen lassen.", "rationale": "Kein echtes Schema-Registry-System nötig, um das Kernprinzip zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Schema-Registrierung und Kompatibilitätsprüfung als Broker-nahe Grenzkontrolle entwerfen, getrennt von zustandsbehaftetem Stream Processing.", "rationale": "Schema-Validierung an der Producer-Grenze ist eine andere Verantwortung als die spätere Datenverarbeitung."}, "STAFF-TARGET": {"active": true, "scope": "Einen Consumer-Absturz auf eine nicht validierte, inkompatible Schema-Änderung eines Producers zurückführen.", "rationale": "Ohne Schema Registry können inkompatible Änderungen unbemerkt Consumer brechen."}, "CHIEF-TARGET": {"active": true, "scope": "Schema-Registry-Nutzung mit erzwungener Kompatibilitätsprüfung als Pflichtstandard für alle produktiven Event-Streams festlegen.", "rationale": "Ohne zentrale Durchsetzung verlässt sich jeder Producer individuell auf korrekte Schema-Disziplin."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Zustandsbehaftetes Stream Processing (Aggregationen, Joins über Streams) wird in Domain 10 vertieft.", "rationale": "Diese Datei behandelt Schema-Grenzkontrolle, nicht die Verarbeitungslogik selbst."}}, "lab_validation": [{"lab_id": "KB-0194-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Schema-Kompatibilitätsprüfung vor Registrierung", "evidence": "Eine additive Schema-Änderung (neues optionales Feld) wird als kompatibel akzeptiert; eine Änderung, die ein Pflichtfeld entfernt, wird korrekt als inkompatibel abgelehnt, bevor sie produktiv genutzt werden kann.", "limitations": "Kein echtes Schema-Registry-System, keine Produktion."}]}
---
# Schema Registry und Stream-Grenzen

> **Ziel:** Eine Schema Registry validiert und versioniert Ereignisschemas zentral, bevor ein Producer eine Nachricht mit einem neuen oder geänderten Schema tatsächlich publizieren darf — sie setzt die Schema-Evolution-Prinzipien ([KB-0141](../06-software-architecture/13-schema-evolution-und-kompatibilitaet.md)) an der Broker-Grenze technisch durch, statt sich auf disziplinierte manuelle Einhaltung durch jeden einzelnen Producer zu verlassen.

## Zweck, Mental Model und Dependencies

Ohne Schema Registry kann ein Producer eine inkompatible Schema-Änderung (z. B. ein Pflichtfeld entfernen) unbemerkt publizieren, was bestehende Consumer bricht, sobald sie die neue Nachrichtenform erhalten. Eine Schema Registry prüft jede neue Schema-Version gegen eine konfigurierte Kompatibilitätsregel (backward, forward oder full compatible), bevor sie registriert und damit für die Produktion freigegeben wird — eine inkompatible Änderung wird an dieser Grenze abgelehnt, statt erst beim Consumer zu einem Laufzeitfehler zu führen. Dies ist eine Broker-nahe Grenzkontrolle, klar getrennt von zustandsbehaftetem Stream Processing (Aggregationen, Joins über mehrere Streams), das eine eigene Vertiefung in Domain 10 erhält. Lies [KB-0141](../06-software-architecture/13-schema-evolution-und-kompatibilitaet.md) und [KB-0179](03-kafka-und-partitionierte-ereignislogs.md).

~~~text
Producer attempts to register schema v2 (removed a required field)
Schema Registry checks: is v2 backward-compatible with v1? -> NO -> registration REJECTED
Producer attempts schema v2' (added an optional field only)
Schema Registry checks compatibility -> YES -> registration ACCEPTED, producer can now publish with v2'
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Kompatibilitätsmodus | backward, forward oder full compatible konfiguriert? | falscher Modus für den tatsächlichen Consumer-/Producer-Rollout-Bedarf gewählt |
| Registrierungszeitpunkt | Schema-Prüfung vor oder erst bei Producer-Publikation? | zu späte Prüfung lässt inkompatible Nachrichten bereits durchsickern |
| Consumer-Vertrauen | vertraut der Consumer der Registry-Validierung oder prüft er zusätzlich selbst? | doppelte, potenziell inkonsistente Validierungslogik |
| Grenzklarheit | Schema-Validierung sauber getrennt von Stream-Verarbeitungslogik? | Vermischung erschwert Verantwortungszuordnung bei Fehlern |

Implementierung: die Schema Registry wird mit einem Kompatibilitätsmodus konfiguriert, der zum tatsächlichen Rollout-Muster passt — backward compatible, wenn Consumer vor Producern aktualisiert werden, forward compatible im umgekehrten Fall. Jede neue Schema-Version wird bei der Registrierung geprüft, bevor sie für die Produktion freigegeben wird, nicht erst nachträglich beim ersten tatsächlichen Publikationsversuch. Consumer können der Registry-Validierung vertrauen und müssen keine eigene, redundante Schema-Prüfung implementieren, solange die Registry konsequent durchgesetzt wird (z. B. über einen Broker-Interceptor, der nicht-registrierte Schemata ablehnt).

## Scalability, Reliability, Security und Observability

Eine zentrale Schema Registry skaliert Vertrauen zwischen vielen unabhängigen Producern und Consumern, ohne dass jedes Team individuell Schema-Disziplin durchsetzen muss. Reliability-Grenze: die Registry schützt nur, wenn sie tatsächlich technisch durchgesetzt wird (Publikation ohne registriertes, kompatibles Schema wird abgelehnt) — eine Registry, die nur als optionale Dokumentation dient, bietet keine echte Garantie.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Consumer bricht nach Producer-Deployment mit einem neuen Schema | Schema-Registry-Prüfung nicht technisch durchgesetzt, nur dokumentarisch | prüfen, ob der Broker Publikation ohne Registry-Validierung tatsächlich verhindert |
| falscher Kompatibilitätsmodus lässt destruktive Änderung durch | Kompatibilitätsmodus nicht zum tatsächlichen Rollout-Muster passend konfiguriert | Kompatibilitätsmodus gegen Deployment-Reihenfolge von Producern/Consumern abgleichen |
| Schema-Registrierung schlägt unerwartet fehl bei eigentlich harmloser Änderung | Kompatibilitätsregel zu streng für den tatsächlichen Anwendungsfall | konkrete Änderung gegen die konfigurierte Kompatibilitätsregel im Detail prüfen |
| Consumer implementiert redundante eigene Schema-Validierung | fehlendes Vertrauen in die zentrale Registry-Durchsetzung | prüfen, ob die Registry tatsächlich konsequent durchgesetzt wird, um redundante Prüfung überflüssig zu machen |

Security: Zugriff auf die Schema Registry (wer darf Schemata registrieren/ändern) sollte granular kontrolliert werden, da eine unautorisierte Schema-Änderung produktive Datenflüsse plattformweit beeinträchtigen könnte. Observability: die Historie registrierter Schema-Versionen ist ein wertvoller Audit-Trail für die Entwicklung eines Event-Vertrags über Zeit.

## Trade-offs und Entscheidungen

**Staff** prüft bei Consumer-Ausfällen nach Producer-Deployment zuerst, ob die Schema Registry tatsächlich technisch durchgesetzt wurde. **Principal** wählt den Kompatibilitätsmodus passend zum tatsächlichen Deployment-Reihenfolge-Muster von Producern und Consumern. **Chief** verlangt technisch durchgesetzte Schema-Registry-Nutzung als Pflichtstandard für alle produktiven Event-Streams.

Anti-Patterns: Schema Registry nur als optionale Dokumentation ohne technische Durchsetzung betreiben; Kompatibilitätsmodus ohne Bezug zum tatsächlichen Rollout-Muster wählen; Schema-Validierung mit zustandsbehaftetem Stream Processing vermischen, statt beide sauber zu trennen.

## Production Checklist

- [ ] Schema Registry wird technisch durchgesetzt, nicht nur dokumentarisch genutzt.
- [ ] Kompatibilitätsmodus passt zum tatsächlichen Producer-/Consumer-Deployment-Muster.
- [ ] Zugriff auf Schema-Registrierung/-Änderung ist granular kontrolliert.
- [ ] Schema-Historie dient als nachvollziehbarer Audit-Trail für Event-Vertragsentwicklung.

## Interviewfragen

### 1. Was ist der Kernzweck einer Schema Registry?

**Antwort:** Sie validiert und versioniert Ereignisschemas zentral und lehnt inkompatible Änderungen bereits bei der Registrierung ab, statt sie erst zur Laufzeit beim Consumer als Fehler sichtbar werden zu lassen.

### 2. Was ist der Unterschied zwischen backward- und forward-kompatiblen Schema-Änderungen?

**Antwort:** Backward-kompatibel bedeutet, dass ein neuer Reader alte Daten lesen kann; forward-kompatibel bedeutet, dass ein alter Reader neue Daten lesen kann — die Wahl hängt davon ab, ob Consumer oder Producer zuerst aktualisiert werden.

### 3. Warum reicht eine Schema Registry als reine Dokumentation nicht aus?

**Antwort:** Ohne technische Durchsetzung (Ablehnung inkompatibler Registrierungen) kann ein Producer trotzdem eine inkompatible Änderung publizieren, was die eigentliche Schutzfunktion der Registry zunichtemacht.

### 4. Warum ist Schema-Validierung von Stream-Processing-Logik getrennt zu behandeln?

**Antwort:** Schema-Validierung ist eine Broker-nahe Grenzkontrolle für die Struktur einzelner Nachrichten, während Stream Processing zustandsbehaftete Verarbeitung über mehrere Nachrichten/Streams hinweg betrifft — beide haben unterschiedliche Verantwortungen und Fehlerklassen.

### 5. Wie wählst du den passenden Kompatibilitätsmodus für die Schema Registry?

**Antwort:** Anhand der tatsächlichen Deployment-Reihenfolge: werden Consumer typischerweise vor Producern aktualisiert, ist backward-kompatibel angemessen; im umgekehrten Fall forward-kompatibel.

### 6. Widersprüchliche Anforderung: Producer-Team will schnelle, unbürokratische Schema-Iterationen UND Consumer wollen garantiert nie durch eine Schema-Änderung brechen — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte, technisch durchgesetzte Kompatibilitätsprüfung in der Registry etablieren, die inkompatible Änderungen sofort bei der Registrierung ablehnt — das erlaubt Producern schnelle Iteration innerhalb der Kompatibilitätsgrenzen, ohne dass ein manueller, langsamer Freigabeprozess nötig wäre, während Consumer vor destruktiven Änderungen geschützt bleiben.

## Praktische Labs

~~~python
schema_v1 = {"required": ["orderId", "amount"], "optional": []}

def check_backward_compatible(old_schema, new_schema):
    for field in old_schema["required"]:
        if field not in new_schema["required"] and field not in new_schema.get("optional", []):
            return False  # a required field disappeared entirely - breaks old readers relying on it
    return True

schema_v2_additive = {"required": ["orderId", "amount"], "optional": ["currency"]}
schema_v2_breaking = {"required": ["orderId"], "optional": []}  # removed 'amount' entirely

assert check_backward_compatible(schema_v1, schema_v2_additive) is True
assert check_backward_compatible(schema_v1, schema_v2_breaking) is False
print("Additive change accepted; breaking change (removed required field) correctly rejected before registration.")
~~~

## Dependencies, Cross-References und Quellen

1. Confluent: [Schema Registry Overview](https://docs.confluent.io/platform/current/schema-registry/index.html), abgerufen 2026-09-17.

Produktspezifische Schema-Registry-Tooling-Details vor Einsatz an aktueller Herstellerdokumentation prüfen. Zustandsbehaftetes Stream Processing wird in Domain 10 vertieft.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| CI-integrierte Schema-Kompatibilitätsprüfung vor Deployment | Established | Abdeckung gegen tatsächliche Registry-Enforcement-Regeln synchron halten. |

Ein Team akzeptiert eine Schema-Registry-Nutzung erst, wenn technische Durchsetzung der Kompatibilitätsprüfung und passender Kompatibilitätsmodus nachweisbar konfiguriert sind.
