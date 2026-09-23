---
{"id": "KB-0189", "title": "Outbox und Inbox", "domain": "08", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL"], "requires": [{"id": "KB-0108", "concepts": ["Transaktion"], "needed_for": "both"}, {"id": "KB-0113", "concepts": ["Idempotenz"], "needed_for": "both"}], "related": ["KB-0190", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Das Outbox-Muster lokal implementieren und die Alternative (direkte Doppel-Schreiboperation) mit ihrem Inkonsistenzrisiko vergleichen.", "rationale": "Kein echtes verteiltes System nötig, um das Kernproblem und seine Lösung zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Outbox- und Inbox-Muster kombinieren, um atomare lokale Transaktion mit zuverlässiger Nachrichtenpublikation über Dienstgrenzen hinweg zu verbinden.", "rationale": "Eine direkte Datenbank-Schreiboperation plus separate Broker-Publikation ist nicht atomar und erzeugt eine Publikationslücke."}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlende Ereignispublikation trotz erfolgreicher Datenbankänderung auf eine fehlende Outbox-Transaktion zurückführen.", "rationale": "Das ist das zentrale Problem, das das Outbox-Muster löst."}, "CHIEF-TARGET": {"active": true, "scope": "Outbox/Inbox als Standardmuster für zuverlässige Ereignispublikation über Dienstgrenzen hinweg festlegen.", "rationale": "Ohne dieses Muster entstehen schwer diagnostizierbare Dateninkonsistenzen zwischen lokaler Datenbank und Nachrichtensystem."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "CDC-basierte Outbox-Relay-Implementierungen (statt Polling) im Detail werden in KB-0190 vertieft.", "rationale": "Diese Datei behandelt das Grundmuster; CDC als Relay-Mechanismus ist eine eigene Vertiefung."}}, "lab_validation": [{"lab_id": "KB-0189-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Outbox-Muster mit simuliertem Absturz zwischen Datenbank-Commit und Broker-Publikation", "evidence": "Bei direkter Doppel-Schreiboperation führt ein simulierter Absturz nach dem Datenbank-Commit zu einer fehlenden Ereignispublikation; beim Outbox-Muster bleibt der Eintrag in derselben Transaktion gespeichert und wird von einem separaten Relay-Prozess zuverlässig nachgeliefert.", "limitations": "Kein echtes verteiltes System, keine Produktion."}]}
---
# Outbox und Inbox

> **Ziel:** Eine direkte Datenbankänderung gefolgt von einer separaten Broker-Publikation ist nicht atomar — stürzt der Dienst zwischen beiden Schritten ab, ist die Datenbankänderung committet, aber das Ereignis wurde nie publiziert (Publikationslücke). Das Outbox-Muster löst das, indem die zu publizierende Nachricht in derselben lokalen Transaktion wie die fachliche Änderung gespeichert wird; ein separater Relay-Prozess liest die Outbox-Tabelle und publiziert zuverlässig.

## Zweck, Mental Model und Dependensies

Ohne Outbox-Muster: eine Anwendung committet eine Datenbankänderung (z. B. „Bestellung bestätigt") und ruft danach separat den Message-Broker auf, um ein Ereignis zu publizieren — zwei unabhängige Operationen ohne gemeinsame Transaktionsgrenze ([KB-0108](../05-distributed-systems/08-verteilte-transaktionen.md)). Stürzt der Prozess zwischen beiden Schritten ab, ist die Datenbankänderung dauerhaft, aber das Ereignis nie publiziert worden. Das Outbox-Muster schreibt die zu publizierende Nachricht in eine „Outbox"-Tabelle innerhalb derselben lokalen Datenbanktransaktion wie die fachliche Änderung — beide sind dann atomar: entweder beide oder keine. Ein separater Relay-Prozess liest die Outbox-Tabelle und publiziert die Nachrichten zuverlässig an den Broker, mit Retry bei Bedarf. Das Inbox-Muster ist das Consumer-seitige Gegenstück: eingehende Nachrichten werden mit ihrer ID in einer Inbox-Tabelle vermerkt, um Deduplizierung ([KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md)) über Neustarts hinweg zu garantieren. Lies [KB-0108](../05-distributed-systems/08-verteilte-transaktionen.md) und [KB-0113](../05-distributed-systems/13-idempotenz-als-systemgarantie.md).

~~~text
WITHOUT Outbox: DB.commit(order) -> [CRASH HERE] -> broker.publish(event) never happens -> publication gap
WITH Outbox:    BEGIN TRANSACTION: DB.commit(order) + DB.insert(outbox_table, event) -> COMMIT (atomic, both or neither)
                Separate relay process: reads outbox_table -> publishes to broker -> marks as published
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Atomarität | Outbox-Eintrag in derselben Transaktion wie fachliche Änderung? | separate Operationen erzeugen Publikationslücke bei Absturz dazwischen |
| Relay-Mechanismus | Polling oder CDC-basiert (siehe [KB-0190](14-cdc-als-ereignisbruecke.md))? | ineffizientes Polling versus komplexere, aber effizientere CDC-Anbindung |
| Inbox-Deduplizierung | eingehende Nachrichten-ID gegen bereits verarbeitete geprüft? | ohne Inbox-Tabelle geht Deduplizierungsstatus bei Consumer-Neustart verloren |
| Outbox-Bereinigung | veröffentlichte Einträge werden zeitnah aufgeräumt? | unbegrenzt wachsende Outbox-Tabelle ohne Bereinigung |

Implementierung: die Outbox-Tabelle wird in derselben Datenbank und derselben Transaktion wie die fachliche Änderung beschrieben — kein separater Systemaufruf zwischen beiden. Ein Relay-Prozess (Polling oder CDC-basiert) liest unveröffentlichte Outbox-Einträge und publiziert sie an den Broker, markiert sie danach als veröffentlicht (oder löscht sie nach erfolgreicher Publikation mit ausreichendem Aufbewahrungspuffer). Consumer-seitig wird eine Inbox-Tabelle mit der eindeutigen Nachrichten-ID geführt, um zu erkennen, ob eine Nachricht bereits verarbeitet wurde, auch nach einem Consumer-Neustart — das macht die Verarbeitung robust gegen At-least-once-Zustellung ([KB-0178](02-zustellsemantik-und-verarbeitungsgarantien.md)).

## Scalability, Reliability, Security und Observability

Das Outbox-Muster skaliert zuverlässige Ereignispublikation ohne verteilte Transaktionen (2PC), indem es die Atomaritätsgarantie auf die lokale Datenbanktransaktion beschränkt. Reliability-Grenze: ohne Outbox-Muster ist die Publikationslücke kein seltener Randfall, sondern eine strukturelle Schwäche jeder Zwei-System-Schreiboperation ohne gemeinsame Transaktion — sie tritt bei jedem Absturz im kritischen Fenster zwischen beiden Operationen auf.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Datenbankänderung erfolgreich, aber kein zugehöriges Ereignis wurde publiziert | fehlendes Outbox-Muster, direkte getrennte Schreiboperationen | prüfen, ob die Ereignispublikation in derselben Transaktion wie die Datenbankänderung erfolgt |
| Outbox-Tabelle wächst unbegrenzt | fehlende Bereinigung veröffentlichter Einträge | Bereinigungsprozess und -frequenz der Outbox-Tabelle prüfen |
| Consumer verarbeitet dieselbe Nachricht nach eigenem Neustart erneut | fehlende oder nicht persistente Inbox-Deduplizierung | prüfen, ob die Inbox-Tabelle nach Consumer-Neustart weiterhin den Verarbeitungsstatus kennt |
| Relay-Prozess veröffentlicht Nachrichten verspätet | Polling-Intervall zu lang für Latenzanforderung | Polling-Frequenz gegen tatsächliche Latenzanforderung abgleichen |

Security: Outbox-/Inbox-Tabellen enthalten oft dieselben sensiblen Daten wie die fachlichen Tabellen und sollten entsprechend geschützt werden; der Relay-Prozess benötigt minimale, auf Lesen der Outbox-Tabelle und Publikationsberechtigung beschränkte Rechte. Observability: unveröffentlichte Outbox-Einträge (Alter der ältesten unveröffentlichten Nachricht) sind eine kritische Metrik, um Relay-Ausfälle frühzeitig zu erkennen.

## Trade-offs und Entscheidungen

**Staff** implementiert Outbox-Einträge konsequent innerhalb derselben Transaktion wie die zugehörige fachliche Änderung, nie als separaten Schritt danach. **Principal** wählt zwischen Polling- und CDC-basiertem Relay anhand von Latenzanforderung und Betriebskomplexitätsbudget. **Chief** etabliert Outbox/Inbox als verpflichtendes Standardmuster für jede zuverlässige Ereignispublikation über Dienstgrenzen hinweg.

Anti-Patterns: Datenbankänderung und Broker-Publikation als getrennte, nicht-atomare Operationen implementieren; Outbox-Tabelle ohne Bereinigungsprozess unbegrenzt wachsen lassen; Consumer-seitige Deduplizierung ohne persistente Inbox-Tabelle, die einen Neustart überlebt.

## Production Checklist

- [ ] Outbox-Eintrag wird in derselben lokalen Transaktion wie die fachliche Änderung geschrieben.
- [ ] Relay-Prozess überwacht und veröffentlicht unveröffentlichte Einträge zuverlässig.
- [ ] Outbox-Tabelle wird nach erfolgreicher Publikation zeitnah bereinigt.
- [ ] Consumer-seitige Inbox-Tabelle persistiert Deduplizierungsstatus über Neustarts hinweg.

## Interviewfragen

### 1. Was ist die Publikationslücke, die das Outbox-Muster löst?

**Antwort:** Bei getrennter Datenbankänderung und Broker-Publikation kann ein Absturz zwischen beiden Schritten dazu führen, dass die Datenbankänderung dauerhaft ist, das zugehörige Ereignis aber nie publiziert wird.

### 2. Wie stellt das Outbox-Muster Atomarität sicher, ohne eine verteilte Transaktion zu benötigen?

**Antwort:** Die zu publizierende Nachricht wird in derselben lokalen Datenbanktransaktion wie die fachliche Änderung gespeichert; beide sind damit atomar innerhalb eines einzigen Systems, ohne 2PC über mehrere Systeme zu benötigen.

### 3. Was ist die Aufgabe des Relay-Prozesses?

**Antwort:** Er liest unveröffentlichte Einträge aus der Outbox-Tabelle und publiziert sie zuverlässig an den Message-Broker, mit Retry bei Bedarf, und markiert sie danach als veröffentlicht.

### 4. Was ist das Inbox-Muster und wozu dient es?

**Antwort:** Es ist das Consumer-seitige Gegenstück zum Outbox-Muster: eingehende Nachrichten-IDs werden persistent vermerkt, um Deduplizierung bei At-least-once-Zustellung auch über Consumer-Neustarts hinweg sicherzustellen.

### 5. Warum ist ein zu langes Polling-Intervall im Relay-Prozess ein Problem?

**Antwort:** Es erhöht die Latenz zwischen fachlicher Änderung und tatsächlicher Ereignispublikation, was für latenzsensitive nachgelagerte Systeme problematisch sein kann.

### 6. Widersprüchliche Anforderung: Team will garantierte, atomare Ereignispublikation UND minimale zusätzliche Betriebskomplexität — wie gehst du vor?

**Antwort:** Ich würde mit einem einfachen Polling-basierten Outbox-Relay beginnen, das geringe Betriebskomplexität hat, aber die Atomaritätsgarantie bereits vollständig erfüllt; nur bei nachgewiesenem Latenzbedarf würde ich auf einen komplexeren CDC-basierten Relay-Mechanismus migrieren.

## Praktische Labs

~~~python
db = {"orders": {}, "outbox": []}
published_events = []

def confirm_order_with_outbox(order_id):
    # both writes happen in the same "transaction" (same function, same commit point)
    db["orders"][order_id] = "confirmed"
    db["outbox"].append({"order_id": order_id, "event": "OrderConfirmed", "published": False})

def relay():
    for entry in db["outbox"]:
        if not entry["published"]:
            published_events.append(entry["event"])
            entry["published"] = True

confirm_order_with_outbox("order-1")
relay()
assert db["orders"]["order-1"] == "confirmed"
assert published_events == ["OrderConfirmed"]
print("Order change and event publication happened atomically via the outbox, then reliably relayed.")
~~~

## Dependencies, Cross-References und Quellen

1. Richardson: [Pattern: Transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html), microservices.io, abgerufen 2026-09-17.

Framework-/Datenbank-spezifische Outbox-Implementierungsbibliotheken vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| CDC-basierte Outbox-Relays statt Polling (Debezium-artige Tools) | Established | Latenzgewinn gegen zusätzliche Betriebskomplexität abwägen, siehe [KB-0190](14-cdc-als-ereignisbruecke.md). |

Ein Team akzeptiert eine Outbox-/Inbox-Implementierung erst, wenn Atomarität der Outbox-Transaktion und persistente Inbox-Deduplizierung nachweisbar getestet sind.
