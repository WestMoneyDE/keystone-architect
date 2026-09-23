---
{"id": "KB-0163", "title": "AsyncAPI und Ereignisschnittstellen", "domain": "07", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0132", "concepts": ["Domain Events"], "needed_for": "both"}, {"id": "KB-0162", "concepts": ["OpenAPI", "Vertragswerkzeuge"], "needed_for": "understanding"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine AsyncAPI-Spezifikation für einen Event-Channel mit Beispielnachricht lokal erstellen.", "rationale": "Kein echter Message-Broker nötig, um das Dokumentationsprinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Produzentenverträge für asynchrone Ereignisschnittstellen dokumentieren, die über bloße Brokerkonfiguration hinausgehen.", "rationale": "Eine Topic-/Queue-Konfiguration allein sagt nichts über Nachrichtenstruktur oder -semantik aus."}, "STAFF-TARGET": {"active": true, "scope": "Einen Consumer-Integrationsfehler auf eine undokumentierte Nachrichtenformat-Änderung des Produzenten zurückführen.", "rationale": "Ohne AsyncAPI-artige Dokumentation ist der tatsächliche Nachrichtenvertrag oft nur implizit im Producer-Code sichtbar."}, "CHIEF-TARGET": {"active": true, "scope": "AsyncAPI-Dokumentation als Standard für alle produktiven Event-Schnittstellen mit externen Consumern festlegen.", "rationale": "Ohne dokumentierten Vertrag ist Consumer-Integration fehleranfällig und schwer koordinierbar."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Bindings für spezifische Broker-Technologien (Kafka, AMQP) im Detail sind Vertiefung.", "rationale": "Kern ist Channel-/Message-/Vertragsdokumentation, nicht jedes Binding-Detail."}}, "lab_validation": [{"lab_id": "KB-0163-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Producer-Vertragsänderung ohne AsyncAPI-Dokumentation", "evidence": "Eine Feldumbenennung im Producer, die nicht in einer versionierten Schnittstellendokumentation reflektiert wird, bricht einen Consumer, der noch das alte Feld erwartet, ohne dass die Änderung vorab erkennbar war.", "limitations": "Kein echter Message-Broker, keine Produktion."}]}
---
# AsyncAPI und Ereignisschnittstellen

> **Ziel:** AsyncAPI dokumentiert asynchrone Ereignisschnittstellen (Channels, Nachrichtenformate, Bindings) analog zu OpenAPI für synchrone REST-APIs. Eine reine Broker-/Topic-Konfiguration (welche Topics existieren) sagt nichts über den eigentlichen Vertrag aus (welche Nachrichtenstruktur, welche Felder, welche Versionierung) — genau diese Lücke schließt AsyncAPI.

## Zweck, Mental Model und Dependensies

Ein Team, das einen Kafka-Topic oder eine Message-Queue betreibt, dokumentiert oft nur die Infrastruktur (Topic-Name, Partitionsanzahl, Retention) — nicht den eigentlichen fachlichen Vertrag: welche Nachrichtentypen werden gesendet, mit welchem Schema, welchen Beispielen, welcher Versionierungsstrategie. AsyncAPI füllt diese Lücke mit einer maschinenlesbaren Spezifikation für Channels (wo Nachrichten fließen), Messages (Struktur und Beispiele) und Bindings (Broker-spezifische Details). Das baut auf denselben Prinzipien wie Domain Events ([KB-0132](../06-software-architecture/04-domain-events-und-fachereignisse.md)) auf: der Vertrag muss explizit dokumentiert sein, nicht nur implizit im Producer-Code existieren. Lies [KB-0132](../06-software-architecture/04-domain-events-und-fachereignisse.md) und [KB-0162](10-openapi-und-vertragswerkzeuge.md).

~~~text
Broker config only:  topic="orders.events", partitions=6, retention=7d  -- says nothing about message structure
AsyncAPI spec:        channel="orders.events" -> message: OrderConfirmed { orderId, totalAmount, confirmedAt }
                       + example payload + versioning notes -- documents the actual CONTRACT
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Häufiger Fehler |
|---|---|---|
| Channel | wo fließen Nachrichten, klar benannt? | Topic-Name ohne Bezug zur fachlichen Bedeutung |
| Message-Schema | Struktur, Typen, Pflichtfelder dokumentiert? | nur implizit im Producer-Code sichtbar, nicht extern dokumentiert |
| Beispiele | reale, konkrete Beispielnachrichten vorhanden? | reine abstrakte Schema-Definition ohne greifbares Beispiel |
| Versionierung | wie werden Änderungen am Nachrichtenformat kommuniziert? | Producer ändert Format ohne Vorankündigung an Consumer |

Implementierung: für jeden produktiven Event-Channel mit externen Consumern wird eine AsyncAPI-Spezifikation gepflegt, die Channel, Message-Schema und mindestens ein konkretes Beispiel enthält. Versionierungsstrategie (analog zu Schema Evolution, [KB-0141](../06-software-architecture/13-schema-evolution-und-kompatibilitaet.md)) wird explizit dokumentiert, sodass Consumer wissen, wie additive und destruktive Änderungen kommuniziert werden. Wo möglich, wird die Spezifikation aus dem Producer-Code generiert oder gegen ihn validiert, um Drift zu vermeiden (analog zu OpenAPI, [KB-0162](10-openapi-und-vertragswerkzeuge.md)).

## Scalability, Reliability, Security und Observability

AsyncAPI-Dokumentation skaliert Consumer-Integration über Teamgrenzen hinweg, indem sie den Nachrichtenvertrag explizit macht, statt Consumer zu zwingen, den Producer-Code zu lesen oder durch Trial-and-Error zu verstehen. Reliability-Grenze: ohne dokumentierten, versionierten Vertrag bricht eine Producer-Änderung Consumer unangekündigt — der eigentliche Fehlerort (Producer-Änderung) ist für den betroffenen Consumer-Entwickler oft nicht offensichtlich.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Consumer bricht nach Producer-Deployment ohne erkennbaren eigenen Fehler | undokumentierte, unangekündigte Nachrichtenformat-Änderung | Producer-Änderungshistorie gegen Consumer-Fehlerzeitpunkt korrelieren |
| neuer Consumer kann Nachrichtenstruktur nur durch Beobachtung realer Nachrichten erschließen | fehlende AsyncAPI-Dokumentation für den Channel | prüfen, ob eine maschinenlesbare Spezifikation für den Channel existiert |
| Topic-Konfiguration ist dokumentiert, aber Nachrichteninhalt unklar | Infrastruktur- statt Vertragsdokumentation vorhanden | Dokumentationsumfang auf Nachrichtenschema statt nur Broker-Config prüfen |
| Versionswechsel zwischen Producer und Consumer verläuft chaotisch | fehlende dokumentierte Versionierungsstrategie | Versionierungsansatz gegen Schema-Evolution-Prinzipien prüfen |

Security: die Spezifikation sollte auch dokumentieren, welche Consumer autorisiert auf welchen Channel zugreifen dürfen, da Message-Broker oft weniger granulare Zugriffskontrolle als REST-APIs bieten. Observability: eine AsyncAPI-Spezifikation ist auch ein nützliches Nachschlagewerk für Incident-Diagnose, um schnell zu verstehen, welche Nachrichtenstruktur an einem Channel erwartet wird.

## Trade-offs und Entscheidungen

**Staff** pflegt AsyncAPI-Spezifikationen für jeden Channel mit externen Consumern aktiv, nicht nur als nachträgliche Dokumentation. **Principal** definiert eine Versionierungsstrategie für Nachrichtenformate analog zur Schema-Evolution-Praxis. **Chief** verlangt AsyncAPI-Dokumentation als Pflichtstandard für alle produktiven Event-Schnittstellen mit Cross-Team-Konsum.

Anti-Patterns: nur Broker-/Topic-Konfiguration dokumentieren, nicht den eigentlichen Nachrichtenvertrag; Producer-Änderungen ohne Versionierungsankündigung an Consumer vornehmen; Consumer zwingen, den Producer-Code zu lesen, um die Nachrichtenstruktur zu verstehen.

## Production Checklist

- [ ] AsyncAPI-Spezifikation für jeden produktiven Event-Channel mit externen Consumern vorhanden.
- [ ] Nachrichtenschema mit konkreten Beispielen dokumentiert, nicht nur Broker-Konfiguration.
- [ ] Versionierungsstrategie für Nachrichtenformat-Änderungen explizit dokumentiert.
- [ ] Autorisierung pro Channel/Consumer dokumentiert.

## Interviewfragen

### 1. Warum reicht Broker-/Topic-Konfiguration nicht als API-Dokumentation für Event-Schnittstellen?

**Antwort:** Sie beschreibt nur die Infrastruktur (Topic-Name, Partitionen), nicht den eigentlichen fachlichen Vertrag — welche Nachrichtenstruktur, welche Felder, welche Semantik tatsächlich übertragen werden.

### 2. Was ist der Unterschied zwischen AsyncAPI und OpenAPI konzeptionell?

**Antwort:** Beide dokumentieren API-Verträge maschinenlesbar; OpenAPI beschreibt synchrone Request-Response-APIs, AsyncAPI beschreibt asynchrone Event-/Message-basierte Schnittstellen mit Channels statt Endpunkten.

### 3. Warum ist ein konkretes Beispiel in der Spezifikation wichtig, nicht nur ein abstraktes Schema?

**Antwort:** Ein Beispiel macht die tatsächliche Nutzung greifbar und reduziert Fehlinterpretationen, die bei einer rein abstrakten Schema-Definition entstehen können.

### 4. Wie verhinderst du, dass eine Producer-Änderung Consumer unangekündigt bricht?

**Antwort:** Durch eine dokumentierte Versionierungsstrategie, die additive von destruktiven Änderungen unterscheidet und Consumer vor destruktiven Änderungen vorab informiert, analog zu Expand-Contract bei Schema-Evolution.

### 5. Was sollte eine AsyncAPI-Spezifikation zusätzlich zum Nachrichtenschema enthalten?

**Antwort:** Informationen zu Autorisierung (wer darf auf welchen Channel zugreifen) und broker-spezifische Bindings (z. B. Kafka-Partitionierungsschlüssel), damit Consumer den vollständigen technischen und fachlichen Kontext haben.

### 6. Widersprüchliche Anforderung: Producer-Team will schnelle, häufige Nachrichtenformat-Iterationen UND Consumer wollen stabile, vorhersehbare Verträge — wie gehst du vor?

**Antwort:** Ich würde additive Änderungen als Standardpraxis etablieren, dokumentiert über eine versionierte AsyncAPI-Spezifikation, und destruktive Änderungen über einen expliziten Deprecation-Prozess mit Vorlaufzeit kommunizieren — das erlaubt Producer-Agilität bei gleichzeitigem Consumer-Vertrauen.

## Praktische Labs

~~~python
documented_schema_v1 = {"orderId": "string", "totalAmount": "number"}
producer_sends_v2 = {"orderId": "string", "orderTotal": "number"}  # undocumented rename

def consumer_reads(message, expected_schema):
    missing = set(expected_schema.keys()) - set(message.keys())
    return missing

missing_fields = consumer_reads(producer_sends_v2, documented_schema_v1)
assert "totalAmount" in missing_fields
print(f"Undocumented field rename broke the consumer's expectation: missing {missing_fields}")
~~~

## Dependencies, Cross-References und Quellen

1. AsyncAPI Initiative: [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest), abgerufen 2026-09-17.

Broker-spezifische Binding-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| AsyncAPI-Generierung direkt aus Producer-Code-Annotationen | Adopting | Drift-Vermeidung gegen manuellen Pflegeaufwand prüfen. |
| Schema-Registry-Integration mit AsyncAPI für automatisierte Kompatibilitätsprüfung | Established je Ökosystem | Kompatibilitätsmodus explizit gegen Consumer-Anforderungen konfigurieren. |

Ein Team akzeptiert eine Ereignisschnittstelle als dokumentiert erst, wenn eine AsyncAPI-Spezifikation mit konkretem Beispiel und Versionierungsstrategie vorhanden und aktuell ist.
