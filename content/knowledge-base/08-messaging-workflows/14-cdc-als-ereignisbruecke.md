---
{"id": "KB-0190", "title": "CDC als Ereignisbrücke", "domain": "08", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0189", "concepts": ["Outbox"], "needed_for": "both"}, {"id": "KB-0141", "concepts": ["Schema Evolution"], "needed_for": "understanding"}], "related": ["KB-0179", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Change-Data-Capture aus einem simulierten Transaktionslog lokal implementieren und einen Änderungsereignisstrom erzeugen.", "rationale": "Kein echtes Datenbank-Transaktionslog nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "CDC als Relay-Mechanismus für das Outbox-Muster gegenüber Polling begründet abwägen, mit Bewusstsein für Snapshot-Übergänge und Schemawechsel.", "rationale": "CDC bietet geringere Latenz als Polling, aber mit eigener Betriebskomplexität."}, "STAFF-TARGET": {"active": true, "scope": "Einen Änderungsereignisstrom von echten Fachereignissen unterscheiden, die eine bewusste Modellierungsentscheidung erfordern.", "rationale": "Ein rohes Datenbank-Änderungsereignis ist kein automatisch fachlich bedeutsames Domain Event."}, "CHIEF-TARGET": {"active": true, "scope": "CDC-Betrieb (z. B. Debezium) als spezialisierte operative Verantwortung im Data-Track positionieren.", "rationale": "CDC-Infrastruktur erfordert eigene Betriebsexpertise, die budgetiert werden muss."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierter Debezium-Betrieb wird im Data-Engineering-Track (Domain 10) vertieft.", "rationale": "Diese Datei behandelt das CDC-Grundprinzip als Ereignisbrücke, nicht den vollständigen Betrieb."}}, "lab_validation": [{"lab_id": "KB-0190-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Transaktionslog-basierte Änderungserkennung", "evidence": "Eine Reihe simulierter Datenbankänderungen im Log wird korrekt in eine Folge strukturierter Änderungsereignisse übersetzt, ohne dass die Anwendung selbst Ereignisse explizit publizieren musste.", "limitations": "Kein echtes Datenbank-Transaktionslog, keine Produktion."}]}
---
# CDC als Ereignisbrücke

> **Ziel:** Change Data Capture (CDC) liest das Transaktionslog einer Datenbank und wandelt jede Änderung in ein strukturiertes Ereignis um — ohne dass die Anwendung selbst explizit Ereignisse publizieren muss. Das macht CDC zu einem effizienten Relay-Mechanismus für das Outbox-Muster ([KB-0189](13-outbox-und-inbox.md)), erfordert aber die bewusste Unterscheidung zwischen rohem Datenbank-Änderungsereignis und fachlich bedeutsamem Domain Event.

## Zweck, Mental Model und Dependencies

Eine Datenbank schreibt jede Änderung zunächst in ihr Transaktionslog (Write-Ahead Log), bevor sie die eigentlichen Datenstrukturen aktualisiert — das ist die Grundlage für Crash Recovery. CDC-Tools (wie Debezium) lesen dieses Log kontinuierlich und wandeln jede erkannte Änderung in ein strukturiertes Ereignis um, das an einen Message-Broker publiziert wird — mit sehr geringer Latenz, da direkt am Log statt über Polling gelesen wird. Der entscheidende Punkt: ein rohes CDC-Änderungsereignis („Zeile X in Tabelle Y geändert, alte/neue Werte Z") ist noch kein fachlich bedeutsames Domain Event ([KB-0132](../06-software-architecture/04-domain-events-und-fachereignisse.md)) — diese Übersetzung erfordert eine bewusste Modellierungsentscheidung. Lies [KB-0189](13-outbox-und-inbox.md) und [KB-0141](../06-software-architecture/13-schema-evolution-und-kompatibilitaet.md).

~~~text
DB transaction log: INSERT INTO orders (id, status) VALUES (1, 'confirmed')
CDC captures:        {table: "orders", op: "INSERT", before: null, after: {id:1, status:"confirmed"}}
                      -- this is a raw change event, NOT automatically a meaningful "OrderConfirmed" domain event
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Log-Position | wird der CDC-Consumer-Fortschritt persistent verfolgt? | Neustart ohne gespeicherte Log-Position verliert oder wiederholt Änderungen |
| Snapshot-Übergang | initialer Bestandssnapshot korrekt mit Log-Streaming verbunden? | Lücke oder Überlappung zwischen Snapshot-Ende und Log-Start |
| Schema-Änderung | wird eine Tabellenschema-Änderung im CDC-Strom korrekt behandelt? | CDC-Consumer bricht oder interpretiert Daten falsch bei unerwartetem Schema |
| Rohes vs. fachliches Ereignis | wird das rohe Änderungsereignis bewusst in ein Domain Event übersetzt? | technische Datenbankdetails sickern ungefiltert in nachgelagerte Systeme |

Implementierung: der CDC-Consumer verfolgt seine Log-Position (Offset) persistent, damit ein Neustart korrekt fortsetzt, ohne Änderungen zu verlieren oder zu wiederholen. Der initiale Zustand wird über einen konsistenten Snapshot erfasst, der nahtlos in das fortlaufende Log-Streaming übergeht, ohne Lücke. Schema-Änderungen an der Quelltabelle werden explizit behandelt (z. B. über eine Schema-Registry, [KB-0194](18-schema-registry-und-stream-grenzen.md)), damit der CDC-Consumer nicht unerwartet bricht. Rohe CDC-Änderungsereignisse werden bewusst in fachlich bedeutsame Domain Events übersetzt (ähnlich der Domain-Event-Payload-Gestaltung, [KB-0132](../06-software-architecture/04-domain-events-und-fachereignisse.md)), statt technische Datenbankdetails ungefiltert an nachgelagerte Systeme weiterzugeben.

## Scalability, Reliability, Security und Observability

CDC skaliert niedrig-latente Ereignispublikation ohne Änderungen an der publizierenden Anwendung, da es direkt am Transaktionslog ansetzt statt an Anwendungscode. Reliability-Grenze: ein Schema-Wechsel an der Quelltabelle, der nicht explizit im CDC-Pfad behandelt wird, kann den CDC-Consumer zum Absturz bringen oder zu stiller Fehlinterpretation führen — dieselbe Klasse von Risiko wie bei Protobuf-Field-Number-Wiederverwendung ([KB-0159](07-grpc-und-protobuf-vertraege.md)), hier auf Datenbankschema-Ebene.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| CDC-Consumer wiederholt oder verpasst Änderungen nach Neustart | Log-Position nicht persistent gespeichert | Offset-/Log-Position-Speicherung des CDC-Consumers prüfen |
| Lücke zwischen initialem Bestand und Live-Änderungen | Snapshot-zu-Streaming-Übergang nicht konsistent implementiert | Übergangspunkt zwischen Snapshot-Ende und Log-Start prüfen |
| CDC-Pipeline bricht nach Datenbankschema-Änderung | fehlende explizite Schema-Änderungs-Behandlung | Schema-Registry-Integration und Kompatibilitätsprüfung vor der Änderung verifizieren |
| nachgelagerte Systeme erhalten technische Datenbankdetails statt fachlicher Ereignisse | rohe CDC-Ereignisse ungefiltert weitergeleitet ohne Domain-Event-Übersetzung | Payload-Struktur der publizierten Ereignisse auf fachliche versus technische Felder prüfen |

Security: der CDC-Prozess benötigt privilegierten Lesezugriff auf das Datenbank-Transaktionslog, was besonders geschützt werden sollte, da das Log potenziell alle Änderungen, auch sensible, ungefiltert enthält. Observability: Log-Lag (Verzögerung zwischen tatsächlicher Datenbankänderung und CDC-Verarbeitung) ist die zentrale Metrik zur Erkennung von CDC-Pipeline-Problemen.

## Trade-offs und Entscheidungen

**Staff** übersetzt rohe CDC-Ereignisse bewusst in fachliche Domain Events, statt sie ungefiltert weiterzuleiten. **Principal** entscheidet zwischen CDC- und Polling-basiertem Outbox-Relay anhand von Latenzanforderung und Betriebskomplexitätsbudget. **Chief** positioniert CDC-Betrieb (z. B. Debezium) als spezialisierte Verantwortung mit eigenem Expertisebedarf im Data-Engineering-Track.

Anti-Patterns: rohe Datenbank-Änderungsereignisse ungefiltert als „Domain Events" an Consumer weitergeben; CDC-Consumer ohne persistente Log-Position-Verfolgung betreiben; Schema-Änderungen an der Quelltabelle ohne Koordination mit dem CDC-Pfad vornehmen.

## Production Checklist

- [ ] CDC-Consumer verfolgt Log-Position persistent über Neustarts hinweg.
- [ ] Snapshot-zu-Streaming-Übergang ist konsistent ohne Lücke implementiert.
- [ ] Schema-Änderungen an Quelltabellen werden koordiniert mit dem CDC-Pfad vorgenommen.
- [ ] Rohe Änderungsereignisse werden bewusst in fachliche Domain Events übersetzt.

## Interviewfragen

### 1. Was ist Change Data Capture und wie funktioniert es grundlegend?

**Antwort:** CDC liest das Transaktionslog einer Datenbank und wandelt jede erkannte Änderung in ein strukturiertes Ereignis um, ohne dass die Anwendung selbst explizit Ereignisse publizieren muss.

### 2. Warum ist ein rohes CDC-Änderungsereignis kein automatisches Domain Event?

**Antwort:** Es spiegelt technische Datenbankdetails (Tabelle, Spalten, alte/neue Werte) wider, nicht zwingend eine fachlich bedeutsame Aussage — diese Übersetzung erfordert eine bewusste Modellierungsentscheidung.

### 3. Was passiert bei einem Schema-Wechsel an der Quelltabelle ohne CDC-Koordination?

**Antwort:** Der CDC-Consumer kann abstürzen oder Daten fälschlich interpretieren, wenn er ein unerwartetes Schema erhält, ohne dass diese Änderung explizit kommuniziert wurde.

### 4. Wie unterscheidet sich CDC-basiertes Outbox-Relay von Polling-basiertem?

**Antwort:** CDC liest direkt am Transaktionslog mit sehr geringer Latenz, während Polling die Outbox-Tabelle in regelmäßigen Intervallen abfragt, was höhere Latenz, aber geringere Betriebskomplexität bedeutet.

### 5. Warum ist Log-Position-Persistenz für CDC-Consumer wichtig?

**Antwort:** Ohne persistente Speicherung der zuletzt verarbeiteten Log-Position würde ein Neustart entweder Änderungen verpassen oder erneut verarbeiten.

### 6. Widersprüchliche Anforderung: Team will minimale Latenz zwischen Datenbankänderung und Ereignispublikation UND minimale zusätzliche Betriebsinfrastruktur — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Latenz (CDC) und minimale Infrastruktur (Polling) sich direkt widersprechen; ich würde den tatsächlichen Latenzbedarf des nachgelagerten Anwendungsfalls klären und nur bei wirklich niedrigem Latenzbedarf die zusätzliche CDC-Infrastruktur rechtfertigen.

## Praktische Labs

~~~python
transaction_log = [
    {"op": "INSERT", "table": "orders", "after": {"id": 1, "status": "confirmed"}},
]

def raw_to_domain_event(change):
    if change["table"] == "orders" and change["op"] == "INSERT":
        return {"event": "OrderConfirmed", "orderId": change["after"]["id"]}
    return None

domain_events = [raw_to_domain_event(c) for c in transaction_log if raw_to_domain_event(c)]
assert domain_events == [{"event": "OrderConfirmed", "orderId": 1}]
print("Raw CDC change event was deliberately translated into a meaningful domain event.")
~~~

## Dependencies, Cross-References und Quellen

1. Debezium/Red Hat: [Debezium Documentation - Change Data Capture](https://debezium.io/documentation/reference/stable/index.html), abgerufen 2026-09-17.

Detaillierter CDC-Betrieb (Debezium-Konfiguration, Connector-Details) wird im Data-Engineering-Track vertieft.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Log-basiertes CDC als Standardansatz gegenüber Trigger-basiertem CDC | Established | Datenbankspezifische Log-Format-Unterstützung vor Einsatz verifizieren. |

Ein Team akzeptiert eine CDC-Implementierung erst, wenn Log-Position-Persistenz, Snapshot-Übergang und die bewusste Übersetzung in Domain Events nachweisbar funktionsfähig sind.
