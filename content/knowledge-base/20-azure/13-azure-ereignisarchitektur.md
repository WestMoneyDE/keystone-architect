---
{"id": "KB-0493", "title": "Azure-Ereignisarchitektur", "domain": "20", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0476", "concepts": ["AWS-Ereignisarchitektur mit EventBridge"], "needed_for": "understanding"}, {"id": "KB-0489", "concepts": ["Azure Functions"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Kombination aus Service Bus (Geschäftsqueue), Event Grid (Ereignisrouting) und Event Hubs (Telemetrieingestion) anhand offizieller Dokumentation den jeweils passenden Anwendungsfällen zuordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Unternehmensarchitektur explizit entscheiden, welcher der drei Azure-Messaging-Dienste für welchen Kommunikationsanforderung (zuverlässige Geschäftstransaktionen, entkoppeltes Ereignisrouting, hochvolumige Telemetrieaufnahme) genutzt wird, statt einen Dienst pauschal für alle Anforderungen zu verwenden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Nachrichtenverzögerung oder einen Datenverlust auf die Verwendung des für den jeweiligen Durchsatz- oder Zuverlässigkeitsbedarf falschen Dienstes zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Messaging-Architekturrichtlinien im Unternehmen anhand klarer Zuordnung von Service Bus, Event Grid und Event Hubs zu ihren jeweiligen Einsatzzwecken statt anhand einer undifferenzierten Nutzung eines einzelnen Dienstes festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der zugrunde liegenden Partitionierungs- und Replikationsmechanismen jedes Dienstes im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der jeweiligen Einsatzzwecke und deren klare Abgrenzung als Entscheidungsgrundlage, nicht die dienstspezifische Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0493-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Dokumentation zu Service Bus, Event Grid und Event Hubs, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Service Bus zuverlässige, geordnete Geschäftsnachrichtenverarbeitung mit Transaktionsunterstützung bietet, wie Event Grid leichtgewichtiges, inhaltsbasiertes Ereignisrouting zwischen Diensten ermöglicht (analog zu AWS EventBridge, siehe KB-0476), und wie Event Hubs für die Aufnahme sehr hoher Telemetrie- oder Ereignisströme (z. B. IoT-Daten) optimiert ist, mit jeweils fundamental unterschiedlichen Durchsatz-, Zuverlässigkeits- und Ordnungsgarantien.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Messaging-Architektur erstellt."}]}
---
# Azure-Ereignisarchitektur

> **Ziel:** Azure stellt drei strukturell unterschiedliche Messaging-/Ereignisdienste bereit — Service Bus (zuverlässige, geordnete Geschäftsnachrichtenverarbeitung mit Transaktionsunterstützung, geeignet für Geschäftsqueues, bei denen jede einzelne Nachricht zuverlässig und in der richtigen Reihenfolge verarbeitet werden muss), Event Grid (leichtgewichtiges, inhaltsbasiertes Ereignisrouting zwischen Diensten, analog zu AWS EventBridge, siehe [KB-0476](../19-aws/14-aws-ereignisarchitektur-mit-eventbridge.md)), und Event Hubs (für die Aufnahme sehr hoher Ereignis- oder Telemetrieströme optimiert, z. B. IoT-Sensordaten oder Anwendungstelemetrie, mit Fokus auf hohen Durchsatz statt starker Einzelnachrichtengarantien). Der zentrale Punkt dieses Kapitels ist, dass diese drei Dienste fundamental unterschiedliche Zuverlässigkeits-, Ordnungs- und Durchsatzgarantien bieten und nicht austauschbar für dieselben Anforderungen genutzt werden sollten — eine unerwartete Nachrichtenverzögerung oder ein Datenverlust ist typischerweise darauf zurückzuführen, dass ein Dienst für einen Anwendungsfall genutzt wird, für den er nicht konzipiert wurde (z. B. Event Hubs für eine Geschäftstransaktion, die zuverlässige Einzelnachrichtenverarbeitung benötigt, statt für die tatsächlich vorgesehene, hochvolumige Telemetrieaufnahme).

## Zweck, Mental Model und Dependencies

Service Bus implementiert klassische Warteschlangen- und Themen-basierte Nachrichtenverarbeitung mit starken Zuverlässigkeitsgarantien — Nachrichten werden zuverlässig zugestellt, können in Sitzungen gruppiert werden, um eine garantierte Verarbeitungsreihenfolge sicherzustellen, und unterstützen transaktionale Operationen über mehrere Nachrichten hinweg, was Service Bus für Geschäftsprozesse geeignet macht, bei denen jede einzelne Nachricht (z. B. eine Bestellung, eine Zahlungstransaktion) zuverlässig und korrekt verarbeitet werden muss, ohne Verlust oder Duplikation. Event Grid adressiert ein anderes Problem: die entkoppelte, inhaltsbasierte Verteilung von Ereignissen zwischen unabhängig voneinander verantworteten Diensten, ähnlich der AWS-EventBridge-Logik (siehe [KB-0476](../19-aws/14-aws-ereignisarchitektur-mit-eventbridge.md)) — ein erzeugender Dienst veröffentlicht ein Ereignis, ohne die konsumierenden Dienste zu kennen, und Abonnements mit Filterregeln bestimmen, welche Ereignisse an welche Ziele weitergeleitet werden. Event Hubs ist speziell für die Aufnahme sehr hoher Ereignisvolumina optimiert (z. B. Millionen von Ereignissen pro Sekunde aus IoT-Sensoren oder Anwendungstelemetrie), wobei der Fokus auf Durchsatz und skalierbarer Aufnahme liegt, nicht auf der starken Zuverlässigkeits- und Ordnungsgarantie einzelner Nachrichten wie bei Service Bus — Event Hubs organisiert Daten in Partitionen, wobei Konsumenten Daten in der Reihenfolge innerhalb einer Partition lesen, jedoch keine globale Ordnungsgarantie über alle Partitionen hinweg besteht. Der zentrale methodische Punkt ist, dass die Wahl zwischen diesen drei Diensten anhand der tatsächlichen Anforderungen an Zuverlässigkeit, Ordnung und Durchsatz getroffen werden muss — eine Geschäftstransaktion, die fälschlich über Event Hubs statt Service Bus abgewickelt wird, könnte bei hoher Last Nachrichten verlieren oder in falscher Reihenfolge verarbeiten, während eine hochvolumige Telemetrie-Aufnahme, die fälschlich über Service Bus statt Event Hubs erfolgt, an dessen begrenzterer Durchsatzkapazität scheitern könnte.

~~~text
Service Bus: RELIABLE, ORDERED business messaging, transaction support
  -> business processes needing GUARANTEED, correct single-message processing (order, payment)
Event Grid: DECOUPLED, content-based event ROUTING between independently-owned services
  (parallel to AWS EventBridge, see KB-0476) -- producer doesn't know consumers, filter-based subscriptions
Event Hubs: optimized for VERY HIGH-VOLUME event/telemetry INGESTION
  (millions of events/sec, e.g. IoT sensors, app telemetry)
  focus: THROUGHPUT + scalable ingestion, NOT strong single-message reliability/ordering guarantees
  data organized in PARTITIONS -- ordering guaranteed WITHIN a partition, NOT globally across all partitions
KEY METHODOLOGICAL POINT: NOT interchangeable for the same requirement
  business transaction mistakenly via Event Hubs (instead of Service Bus)
    -> risk of message loss/out-of-order processing under load
  high-volume telemetry mistakenly via Service Bus (instead of Event Hubs)
    -> fails against Service Bus's more limited throughput capacity
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Service Bus | zuverlässige, geordnete Geschäftsnachrichtenverarbeitung | geeignet für Transaktionen, die keinen Verlust/Duplikation tolerieren |
| Event Grid | entkoppeltes, inhaltsbasiertes Ereignisrouting | analog zu AWS EventBridge, für organisationsübergreifende Entkopplung |
| Event Hubs | hochvolumige Ereignis-/Telemetrieaufnahme | Ordnungsgarantie nur innerhalb einer Partition, nicht global |
| Dienstwahl nach Anforderung | Zuverlässigkeit versus Entkopplung versus Durchsatz | muss explizit anhand der tatsächlichen Kommunikationsanforderung getroffen werden |

Implementierung: Für jede Kommunikationsanforderung wird explizit geprüft, welche der drei Anforderungskategorien (zuverlässige, geordnete Geschäftstransaktion; entkoppeltes, organisationsübergreifendes Ereignisrouting; hochvolumige Telemetrieaufnahme) tatsächlich zutrifft, bevor ein Dienst gewählt wird, statt einen bereits im Unternehmen etablierten Dienst pauschal für alle neuen Anforderungen zu verwenden. Für Event Hubs wird das Partitionsschema explizit anhand der tatsächlichen Konsumentenanzahl und des benötigten Parallelisierungsgrads gestaltet, um die verfügbare Durchsatzkapazität sinnvoll zu nutzen. Für jede Kombination aus Diensten (z. B. Event Grid, das eine Azure Function auslöst, siehe [KB-0489](09-azure-functions.md)) wird das jeweilige Retry- und Fehlerverhalten explizit geprüft und konfiguriert.

## Scalability, Reliability, Security und Observability

Die Azure-Ereignisarchitektur skaliert die organisatorische und technische Passgenauigkeit proportional zur korrekten Zuordnung jeder Kommunikationsanforderung zum jeweils geeigneten Dienst; die Reliability-Grenze liegt darin, dass die Nutzung eines für die tatsächliche Anforderung ungeeigneten Dienstes proportional zur Diskrepanz zwischen tatsächlichem und angenommenem Zuverlässigkeits-/Durchsatzprofil zu Nachrichtenverlust, Verzögerung, oder Kapazitätsüberschreitung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nachrichten einer Geschäftstransaktion werden unter Last verloren oder in falscher Reihenfolge verarbeitet | die Transaktion wird über Event Hubs statt Service Bus abgewickelt, ohne dessen starke Zuverlässigkeits-/Ordnungsgarantie | prüfen, ob eine Migration zu Service Bus für diesen spezifischen Anwendungsfall angemessen ist |
| eine hochvolumige Telemetrie-Aufnahme erreicht die Kapazitätsgrenzen des genutzten Dienstes | die Telemetrie wird über Service Bus statt Event Hubs aufgenommen, dessen Durchsatzkapazität begrenzter ist | eine Migration zu Event Hubs für die hochvolumige Aufnahme evaluieren |
| erwartete Ereignisse erreichen ein Ziel nicht, obwohl der erzeugende Dienst sie scheinbar korrekt veröffentlicht | ein Event-Grid-Abonnement-Filter entspricht nicht der tatsächlichen Struktur der veröffentlichten Ereignisse | den Filter explizit gegen ein tatsächlich veröffentlichtes, protokolliertes Beispielereignis prüfen |

Security: Zugriff auf Service Bus, Event Grid und Event Hubs sollte über Azure RBAC mit Managed Identities erfolgen, konsistent mit der allgemeinen Azure-Zugriffskontrollpraxis, statt auf gemeinsam genutzte Zugriffsschlüssel zurückzugreifen. Observability: Die tatsächliche Nachrichtendurchsatzrate relativ zur Kapazität jedes Dienstes, die Häufigkeit von Retry-Ereignissen, und die Partitionsauslastungsverteilung bei Event Hubs sind zentrale Metriken zur Bewertung der Ereignisarchitektur.

## Trade-offs und Entscheidungen

**Staff** ordnet jede Kommunikationsanforderung explizit dem passenden Dienst (Service Bus, Event Grid, Event Hubs) zu. **Principal** macht die unterschiedlichen Zuverlässigkeits-/Durchsatzgarantien der drei Dienste für das Team nachvollziehbar. **Chief** legt Messaging-Architekturrichtlinien im Unternehmen anhand klarer Dienstzuordnung fest.

Anti-Patterns: eine Geschäftstransaktion mit Zuverlässigkeitsanforderung über Event Hubs statt Service Bus abwickeln; hochvolumige Telemetrie über Service Bus statt Event Hubs aufnehmen; einen einzigen Dienst unreflektiert für alle Kommunikationsanforderungen im Unternehmen verwenden, ohne die jeweiligen Anforderungen zu differenzieren.

## Production Checklist

- [ ] Jede Kommunikationsanforderung ist explizit dem passenden Dienst (Service Bus, Event Grid, Event Hubs) zugeordnet.
- [ ] Das Partitionsschema von Event Hubs ist anhand tatsächlicher Konsumentenanzahl und Parallelisierungsbedarf gestaltet.
- [ ] Event-Grid-Filter sind gegen tatsächlich veröffentlichte Ereignisstrukturen getestet.
- [ ] Zugriff auf alle drei Dienste erfolgt über RBAC mit Managed Identities.

## Interviewfragen

### 1. Wofür ist Service Bus primär geeignet, und wofür nicht?

**Antwort:** Für zuverlässige, geordnete Geschäftsnachrichtenverarbeitung mit Transaktionsunterstützung; nicht für die Aufnahme sehr hoher Ereignisvolumina, für die Event Hubs besser geeignet ist.

### 2. Wie unterscheidet sich Event Grid von Event Hubs?

**Antwort:** Event Grid ermöglicht entkoppeltes, inhaltsbasiertes Ereignisrouting zwischen Diensten; Event Hubs ist für die Aufnahme sehr hoher Ereignis- oder Telemetrievolumina mit Fokus auf Durchsatz optimiert.

### 3. Welche Ordnungsgarantie bietet Event Hubs?

**Antwort:** Reihenfolge ist nur innerhalb einer einzelnen Partition garantiert, nicht global über alle Partitionen hinweg.

### 4. Warum sind Service Bus, Event Grid und Event Hubs nicht austauschbar für dieselbe Anforderung?

**Antwort:** Weil sie fundamental unterschiedliche Zuverlässigkeits-, Ordnungs- und Durchsatzgarantien bieten — eine Nutzung des falschen Dienstes für eine gegebene Anforderung kann zu Nachrichtenverlust, falscher Reihenfolge oder Kapazitätsüberschreitung führen.

### 5. Wie gehst du vor, wenn Nachrichten einer Geschäftstransaktion unter Last verloren oder in falscher Reihenfolge verarbeitet werden?

**Antwort:** Ich prüfe, ob die Transaktion über Event Hubs statt Service Bus abgewickelt wird, da Event Hubs nicht dieselben starken Zuverlässigkeits- und Ordnungsgarantien wie Service Bus bietet, und evaluiere eine Migration zu Service Bus.

### 6. Widersprüchliche Anforderung: Team will einen einzigen, einheitlichen Messaging-Dienst für alle Anforderungen (Geschäftstransaktionen, Ereignisrouting, Telemetrie) UND jeweils optimale Zuverlässigkeit/Durchsatz — wie gehst du vor?

**Antwort:** Ich würde erklären, dass die drei Anforderungskategorien fundamental unterschiedliche technische Garantien benötigen, die kein einzelner Dienst gleichermaßen optimal erfüllen kann, und eine gezielte, aber klar dokumentierte Kombination aller drei Dienste für ihre jeweils passenden Anwendungsfälle vorschlagen, statt eine pauschale Vereinheitlichung zu erzwingen.

## Praktische Labs

~~~python
# Conceptual service selection based on communication requirement (not executed against a real Azure account):

def recommend_messaging_service(needs_strong_ordering, needs_transaction_support, expected_volume_per_sec):
    if needs_strong_ordering and needs_transaction_support:
        return "Service Bus"
    if expected_volume_per_sec > 10000:
        return "Event Hubs"
    return "Event Grid"

use_cases = {
    "order_processing": {"needs_strong_ordering": True, "needs_transaction_support": True, "expected_volume_per_sec": 50},
    "iot_sensor_ingestion": {"needs_strong_ordering": False, "needs_transaction_support": False, "expected_volume_per_sec": 500000},
    "cross_service_notification": {"needs_strong_ordering": False, "needs_transaction_support": False, "expected_volume_per_sec": 20},
}

for name, attrs in use_cases.items():
    print(f"{name}: recommended = {recommend_messaging_service(**attrs)}")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Choose Between Azure Messaging Services — Service Bus, Event Grid, Event Hubs](https://learn.microsoft.com/en-us/azure/event-grid/compare-messaging-services), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure Event Hubs — Partitions](https://learn.microsoft.com/en-us/azure/event-hubs/event-hubs-features#partitions), abgerufen 2026-09-18.

AWS-Ereignisarchitektur mit EventBridge ist kanonisch in [KB-0476](../19-aws/14-aws-ereignisarchitektur-mit-eventbridge.md) behandelt; Azure Functions in [KB-0489](09-azure-functions.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Integrationsmuster zwischen Event Grid und Event Hubs, die eine kombinierte Nutzung für gefiltertes, ereignisbasiertes Routing hochvolumiger Telemetrie ermöglichen | Evaluating | Gegenüber isolierter Nutzung eines einzelnen Dienstes erst nach Prüfung der tatsächlichen Integrationskomplexität für den konkreten Anwendungsfall bevorzugen. |

Ein Team akzeptiert eine Azure-Ereignisarchitektur erst, wenn jede Kommunikationsanforderung nachweislich dem für ihre tatsächlichen Zuverlässigkeits- und Durchsatzanforderungen passenden Dienst zugeordnet ist.
