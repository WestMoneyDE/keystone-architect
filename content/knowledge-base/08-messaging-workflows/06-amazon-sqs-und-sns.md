---
{"id": "KB-0182", "title": "Amazon SQS und SNS", "domain": "08", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0178", "concepts": ["Zustellsemantik"], "needed_for": "both"}, {"id": "KB-0180", "concepts": ["Fan-out", "Routing"], "needed_for": "understanding"}], "related": ["KB-0183", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Visibility-Timeout-Verhalten und einen FIFO-Deduplizierungsfall lokal simulieren.", "rationale": "Kein echtes AWS-Konto nötig, um die Kernmechanik zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "SNS-zu-SQS-Fan-out-Topologie und Visibility-Timeout-Dimensionierung für einen konkreten Verarbeitungsfall entwerfen.", "rationale": "SNS+SQS-Kombination ist ein Standardmuster für Ein-zu-Viele-Verteilung mit Queue-Semantik pro Empfänger."}, "STAFF-TARGET": {"active": true, "scope": "Doppelte Verarbeitung auf einen zu kurzen Visibility Timeout zurückführen, bei dem die Nachricht erneut sichtbar wurde, während sie noch verarbeitet wurde.", "rationale": "Das ist eine der häufigsten SQS-spezifischen Fehlerursachen."}, "CHIEF-TARGET": {"active": true, "scope": "SNS/SQS als verwalteter Standardansatz für AWS-native Ereignisverteilung positionieren, mit Bewusstsein für FIFO-Grenzen.", "rationale": "Verwaltete Dienste reduzieren Betriebsaufwand, haben aber eigene Skalierungs-/Ordnungsgrenzen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "SQS-Extended-Client für große Payloads und SNS-Message-Filtering im Detail sind Vertiefung.", "rationale": "Kern ist Visibility Timeout, FIFO-Deduplizierung und Fan-out-Grundmuster."}}, "lab_validation": [{"lab_id": "KB-0182-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Visibility Timeout und FIFO-Deduplizierung", "evidence": "Eine Nachricht wird nach Ablauf des Visibility Timeout während laufender Verarbeitung erneut sichtbar und von einem zweiten Consumer verarbeitet, was ohne ausreichende Idempotenz zu doppelter Verarbeitung führt; eine FIFO-Queue mit identischer Deduplizierungs-ID lehnt ein exaktes Duplikat innerhalb des Deduplizierungsfensters ab.", "limitations": "Kein echtes AWS-Konto, keine Produktion."}]}
---
# Amazon SQS und SNS

> **Ziel:** SQS implementiert Polling-basierte Queue-Semantik mit einem zentralen, oft unterschätzten Mechanismus: dem Visibility Timeout — eine abgeholte, aber noch nicht bestätigte Nachricht wird für andere Consumer für eine konfigurierte Zeit unsichtbar; läuft diese Zeit ab, bevor die Verarbeitung abgeschlossen und bestätigt ist, wird die Nachricht erneut sichtbar und kann doppelt verarbeitet werden. SNS bietet Publish-Subscribe-Fan-out, oft kombiniert mit SQS-Queues als Abonnenten (Fan-out-Pattern).

## Zweck, Mental Model und Dependencies

Ein SQS-Consumer holt (polling) eine Nachricht ab; ab diesem Moment startet der Visibility Timeout — die Nachricht bleibt für andere Consumer unsichtbar, bis entweder eine explizite Löschbestätigung (nach erfolgreicher Verarbeitung) erfolgt oder der Timeout abläuft. Läuft die Verarbeitung länger als der konfigurierte Timeout, wird die Nachricht fälschlich als „nicht verarbeitet" angesehen und erneut zugestellt — eine Standard-Zustellsemantik-Falle ([KB-0178](02-zustellsemantik-und-verarbeitungsgarantien.md)). SNS+SQS-Fan-out lässt eine SNS-Topic-Nachricht an mehrere abonnierte SQS-Queues verteilen, wobei jede Queue unabhängig ihre eigene Verarbeitungsgeschwindigkeit und Fehlerbehandlung hat. Lies [KB-0178](02-zustellsemantik-und-verarbeitungsgarantien.md) und [KB-0180](04-rabbitmq-und-routingtopologien.md).

~~~text
Consumer polls SQS -> message becomes invisible for visibility_timeout seconds
Processing takes LONGER than visibility_timeout -> message becomes visible again -> ANOTHER consumer picks it up
                        -> DUPLICATE processing, even though the first consumer is still working on it
SNS Topic -> fan-out -> SQS Queue A, SQS Queue B (each processes independently)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Visibility Timeout | ausreichend länger als die tatsächliche Verarbeitungsdauer? | zu kurz gesetzt erzeugt doppelte Verarbeitung bei normaler Last |
| Löschbestätigung | erfolgt nur nach vollständig erfolgreicher Verarbeitung? | zu frühe Löschung riskiert Verlust bei Verarbeitungsfehler |
| FIFO-Deduplizierung | Deduplizierungs-ID korrekt und Fenster ausreichend? | Duplikate außerhalb des Deduplizierungsfensters werden nicht erkannt |
| SNS-Fan-out | jede Ziel-Queue unabhängig dimensioniert? | eine langsame Queue verzögert nicht automatisch andere, aber Gesamtsystem-Kapazität muss geplant sein |

Implementierung: der Visibility Timeout wird deutlich über der gemessenen P99-Verarbeitungsdauer dimensioniert, mit der Möglichkeit, ihn bei länger laufenden Verarbeitungen dynamisch zu verlängern (Heartbeat-Verlängerung). Nachrichten werden erst nach vollständig abgeschlossener, erfolgreicher Verarbeitung explizit gelöscht, nie vorab. Bei FIFO-Queues wird eine Deduplizierungs-ID (oder Content-basierte Deduplizierung) genutzt, mit Bewusstsein für das begrenzte Deduplizierungsfenster (Standard 5 Minuten). SNS-Fan-out wird für Ein-zu-Viele-Verteilung genutzt, wobei jede abonnierte SQS-Queue unabhängig nach ihrem eigenen Verarbeitungsbedarf dimensioniert wird.

## Scalability, Reliability, Security und Observability

SQS Standard Queues skalieren nahezu unbegrenzten Durchsatz ohne Ordnungsgarantie; FIFO Queues garantieren Reihenfolge und Exactly-once-artige Deduplizierung, aber mit begrenztem Durchsatz pro Message-Group. Reliability-Grenze: ein zu kurz konfigurierter Visibility Timeout ist eine der häufigsten Ursachen unerklärter doppelter Verarbeitung in SQS-basierten Systemen — er wird oft initial korrekt dimensioniert, aber bei wachsender Verarbeitungskomplexität nicht nachjustiert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nachricht wird doppelt verarbeitet unter normaler Last | Visibility Timeout kürzer als tatsächliche Verarbeitungsdauer | P99-Verarbeitungsdauer gegen konfigurierten Timeout vergleichen |
| Nachrichtenverlust bei Verarbeitungsfehler | Löschbestätigung erfolgte vor statt nach erfolgreicher Verarbeitung | Löschzeitpunkt im Code gegen tatsächlichen Verarbeitungsabschluss prüfen |
| Duplikat in FIFO-Queue trotz Deduplizierungs-ID | Duplikat außerhalb des 5-Minuten-Deduplizierungsfensters gesendet | Zeitabstand zwischen Original und Duplikat gegen Deduplizierungsfenster prüfen |
| eine abonnierte Queue verarbeitet viel langsamer als andere | Queue-Kapazität nicht individuell für ihre Last dimensioniert | Verarbeitungsdurchsatz jeder Ziel-Queue separat messen |

Security: SQS-/SNS-Zugriffsberechtigungen sollten über IAM granular pro Queue/Topic konfiguriert werden, nicht über breite Kontobasisberechtigungen. Observability: `ApproximateAgeOfOldestMessage` und Anzahl sichtbarer/unsichtbarer Nachrichten sind zentrale CloudWatch-Metriken zur Diagnose von Verarbeitungsverzögerungen.

## Trade-offs und Entscheidungen

**Staff** dimensioniert Visibility Timeout anhand gemessener P99-Verarbeitungsdauer, nicht anhand einer Schätzung. **Principal** definiert Standard für Löschbestätigungszeitpunkt (nach, nie vor Verarbeitung) und FIFO- versus Standard-Queue-Wahl je Ordnungsanforderung. **Chief** positioniert SQS/SNS als Standard für AWS-native, verwaltete Nachrichtenverteilung mit bewusster Abwägung des FIFO-Durchsatzlimits.

Anti-Patterns: Visibility Timeout ohne Bezug zur tatsächlichen Verarbeitungsdauer konfigurieren; Nachrichten vor statt nach erfolgreicher Verarbeitung löschen; FIFO-Queues für Anwendungsfälle mit hohem Durchsatzbedarf ohne Bewusstsein für Message-Group-Limits einsetzen.

## Production Checklist

- [ ] Visibility Timeout deutlich über gemessener P99-Verarbeitungsdauer dimensioniert, mit Heartbeat-Verlängerung bei Bedarf.
- [ ] Löschbestätigung erfolgt ausschließlich nach vollständig erfolgreicher Verarbeitung.
- [ ] FIFO-Deduplizierungsfenster gegen tatsächliches Duplikatsrisiko-Zeitfenster geprüft.
- [ ] Jede SNS-abonnierte SQS-Queue individuell nach ihrer Last dimensioniert.

## Interviewfragen

### 1. Was ist der Visibility Timeout und warum ist er kritisch?

**Antwort:** Die Zeit, für die eine abgeholte Nachricht für andere Consumer unsichtbar bleibt; ist er kürzer als die tatsächliche Verarbeitungsdauer, wird die Nachricht fälschlich erneut zugestellt und doppelt verarbeitet.

### 2. Wann sollte eine Nachricht aus der Queue gelöscht werden?

**Antwort:** Erst nach vollständig erfolgreicher Verarbeitung — eine vorzeitige Löschung riskiert Datenverlust, falls die Verarbeitung danach fehlschlägt.

### 3. Was ist der Unterschied zwischen SQS Standard und FIFO Queues?

**Antwort:** Standard Queues bieten nahezu unbegrenzten Durchsatz ohne Reihenfolgegarantie und mit möglichen Duplikaten; FIFO Queues garantieren Reihenfolge innerhalb einer Message-Group und bieten Deduplizierung, mit begrenztem Durchsatz.

### 4. Was ist das SNS-zu-SQS-Fan-out-Muster?

**Antwort:** Eine SNS-Topic-Nachricht wird an mehrere abonnierte SQS-Queues verteilt, wobei jede Queue unabhängig ihre eigene Verarbeitungsgeschwindigkeit und Fehlerbehandlung hat.

### 5. Warum kann ein Duplikat trotz FIFO-Deduplizierungs-ID auftreten?

**Antwort:** Die Deduplizierung gilt nur innerhalb eines begrenzten Zeitfensters (standardmäßig 5 Minuten); ein Duplikat außerhalb dieses Fensters wird nicht mehr als solches erkannt.

### 6. Widersprüchliche Anforderung: Team will maximalen Durchsatz UND garantierte Reihenfolge für alle Nachrichten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass FIFO-Queues Reihenfolge innerhalb einer Message-Group garantieren, aber mit Durchsatzbegrenzung; für maximalen Durchsatz bei dennoch relevanter Teilordnung würde ich mehrere Message-Groups (z. B. pro Kunde) nutzen, um Parallelität zwischen Gruppen bei Ordnung innerhalb jeder Gruppe zu erreichen.

## Praktische Labs

~~~python
import time

class SQSSimulation:
    def __init__(self, visibility_timeout):
        self.visibility_timeout = visibility_timeout
        self.message = {"body": "order-1", "received_at": None, "deleted": False}

    def receive(self):
        self.message["received_at"] = time.monotonic()
        return self.message

    def is_visible_again(self):
        if self.message["deleted"] or self.message["received_at"] is None:
            return False
        return (time.monotonic() - self.message["received_at"]) > self.visibility_timeout

queue = SQSSimulation(visibility_timeout=0.1)
queue.receive()
time.sleep(0.2)  # processing takes longer than visibility timeout
assert queue.is_visible_again() is True  # message reappears, risking duplicate processing
print("Message became visible again before processing finished - the visibility timeout misconfiguration risk.")
~~~

## Dependencies, Cross-References und Quellen

1. AWS: [Amazon SQS Visibility Timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html), abgerufen 2026-09-17.
2. AWS: [Amazon SNS Fanout Scenario](https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html), abgerufen 2026-09-17.

AWS-Service-Limits und Preisdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Höherer FIFO-Durchsatz durch Hoch-Durchsatz-Modus mit mehreren Message-Groups | Established | Tatsächlichen Durchsatzbedarf gegen Message-Group-Granularität planen. |

Ein Team akzeptiert eine SQS/SNS-Implementierung erst, wenn Visibility-Timeout-Dimensionierung und Löschbestätigungszeitpunkt gegen reale Verarbeitungsdauer nachweisbar getestet sind.
