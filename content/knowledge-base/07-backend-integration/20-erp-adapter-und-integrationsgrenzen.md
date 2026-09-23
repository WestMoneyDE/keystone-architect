---
{"id": "KB-0172", "title": "ERP-Adapter und Integrationsgrenzen", "domain": "07", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "STAFF"], "requires": [{"id": "KB-0140", "concepts": ["API-Vertrag"], "needed_for": "both"}, {"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}], "related": ["KB-0173", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein kanonisches Nachrichtenformat mit Mapping zu einem fiktiven ERP-Format lokal implementieren.", "rationale": "Kein echtes ERP-System nötig, um das Mapping-Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Kanonisches Datenmodell, Mapping-Schicht und Batch-/Online-Übergabe für ERP-Integration entwerfen, mit eindeutiger Fehlerzuständigkeit zwischen Systemen.", "rationale": "Ohne kanonisches Modell entstehen N-zu-N-Mappings zwischen jedem Systempaar."}, "STAFF-TARGET": {"active": true, "scope": "Eine Dateninkonsistenz zwischen ERP und angebundenem System auf unklare Fehlerzuständigkeit zurückführen.", "rationale": "Ohne klare Verantwortungsgrenze bleibt ein Datenfehler zwischen zwei Systemen oft unbearbeitet liegen."}, "CHIEF-TARGET": {"active": true, "scope": "Kanonisches Integrationsmodell als Standard für Enterprise-Systemlandschaften mit mehreren ERP-Anbindungen festlegen.", "rationale": "N-zu-N-Punkt-zu-Punkt-Integrationen werden bei wachsender Systemanzahl unwartbar."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "SAP-spezifische Protokolle (OData, IDoc, RFC) werden in KB-0173 vertieft.", "rationale": "Diese Datei behandelt das generische Integrationsmuster, nicht ein spezifisches ERP-Produkt."}}, "lab_validation": [{"lab_id": "KB-0172-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für kanonisches Nachrichtenformat mit ERP-Mapping", "evidence": "Ein kanonisches 'Order'-Objekt wird korrekt in ein fiktives ERP-spezifisches Feldformat übersetzt und zurück, ohne dass das kanonische Modell ERP-Interna kennt.", "limitations": "Kein echtes ERP-System, keine Produktion."}]}
---
# ERP-Adapter und Integrationsgrenzen

> **Ziel:** Ohne ein kanonisches (systemunabhängiges) Datenmodell entstehen bei mehreren angebundenen Systemen N-zu-N-Punkt-zu-Punkt-Mappings, die bei wachsender Systemanzahl quadratisch unwartbar werden. Ein ERP-Adapter übersetzt zwischen dem kanonischen Modell und dem spezifischen ERP-Format, mit klar definierter Fehlerzuständigkeit zwischen den Systemen.

## Zweck, Mental Model und Dependensies

Ein kanonisches Datenmodell definiert eine systemneutrale Repräsentation fachlicher Objekte (z. B. „Order" mit standardisierten Feldern), unabhängig von der Terminologie oder Struktur eines bestimmten ERP-Systems. Jeder Adapter übersetzt nur zwischen diesem kanonischen Modell und seinem jeweiligen externen System — bei N angebundenen Systemen braucht es N Adapter statt N×(N-1) Punkt-zu-Punkt-Übersetzungen. Diese Struktur baut auf demselben Prinzip wie API-Verträge ([KB-0140](12-api-grenzen-und-fachliche-vertraege.md)) auf: eine stabile, bewusst gestaltete Schnittstelle statt direkter Kopplung an fremde Systeminterna. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0140](12-api-grenzen-und-fachliche-vertraege.md).

~~~text
Point-to-point (N systems -> up to N*(N-1) mappings): System A <-> B, A <-> C, B <-> C, ...
Canonical model (N systems -> N adapters):            SystemA -> Adapter -> Canonical Order <- Adapter <- SystemB
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Kanonisches Modell | systemneutral, nicht an ein bestimmtes ERP-Format angelehnt? | kanonisches Modell übernimmt versehentlich ERP-spezifische Konzepte |
| Mapping-Schicht | klar getrennt vom kanonischen Modell und vom ERP-Adapter? | Mapping-Logik vermischt mit fachlicher Kernlogik |
| Batch vs. Online | welche Integrationsart für welchen Datentyp/welche Aktualitätsanforderung? | Batch-Verzögerung wird fälschlich als Echtzeit-Ausfall interpretiert |
| Fehlerzuständigkeit | wer behebt einen Datenfehler zwischen zwei Systemen? | Fehler bleibt unbearbeitet liegen, da keine Seite sich eindeutig zuständig fühlt |

Implementierung: das kanonische Modell wird unabhängig von jedem einzelnen angebundenen System entworfen, basierend auf der eigenen fachlichen Domäne (ähnlich einem Bounded Context). Jeder ERP-Adapter übersetzt explizit zwischen diesem Modell und dem jeweiligen ERP-Format, mit klarer Versionierung des Mappings. Für jede Integrationsart (Batch-Synchronisation für nicht-zeitkritische Massendaten, Online/Echtzeit für zeitkritische Statusänderungen wie Lagerbestand) wird die Wahl explizit begründet. Fehlerzuständigkeit wird vertraglich/organisatorisch festgelegt: welches Team behebt einen Dateninkonsistenzfall, basierend auf der Quelle der Wahrheit für das jeweilige Datenfeld.

## Scalability, Reliability, Security und Observability

Ein kanonisches Modell skaliert Integrationsaufwand linear statt quadratisch mit der Anzahl angebundener Systeme. Reliability-Grenze: Batch-Integrationen haben inhärente Aktualitätsverzögerung — ein System, das Echtzeit-Konsistenz mit einem batch-synchronisierten ERP erwartet, wird regelmäßig scheinbare Inkonsistenzen sehen, die tatsächlich nur normale Synchronisationsverzögerung sind.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| jede neue Systemanbindung erfordert Anpassung an vielen bestehenden Mappings | fehlendes kanonisches Modell, Punkt-zu-Punkt-Integration | Anzahl der bei einer neuen Anbindung geänderten bestehenden Mappings zählen |
| Lagerbestand wirkt inkonsistent zwischen Shop und ERP | Batch-Synchronisationsverzögerung fälschlich als Fehler interpretiert | Synchronisationsintervall gegen beobachtete Verzögerung vergleichen |
| ein Datenfehler zwischen zwei Systemen bleibt lange unbehoben | keine klare Fehlerzuständigkeit definiert | Verantwortlichkeit für das betroffene Datenfeld in der Integrationsdokumentation prüfen |
| Mapping-Logik ist schwer nachvollziehbar und fehleranfällig | Mapping vermischt mit fachlicher Kernlogik statt eigener Schicht | Mapping-Code auf Trennung von kanonischem Modell und Adapter-Logik prüfen |

Security: ERP-Systeme enthalten oft besonders sensible Geschäftsdaten (Preise, Verträge, Lieferanten); Adapter-Zugriffe sollten minimal privilegiert und auditierbar sein. Observability: Synchronisationsstatus, Mapping-Fehlerrate und Datenabgleich-Diskrepanzen zwischen kanonischem Modell und ERP sollten kontinuierlich überwacht werden.

## Trade-offs und Entscheidungen

**Staff** implementiert Mapping-Logik als eigene, testbare Schicht getrennt vom kanonischen Modell. **Principal** entwirft das kanonische Modell unabhängig von einem bestimmten ERP-System und definiert Batch- versus Online-Integration je Datentyp. **Chief** etabliert das kanonische Integrationsmodell als Standard für Systemlandschaften mit mehreren ERP-/Drittsystem-Anbindungen und klärt Fehlerzuständigkeit vertraglich.

Anti-Patterns: direkte Punkt-zu-Punkt-Integration zwischen jedem Systempaar ohne kanonisches Modell; Mapping-Logik direkt in fachliche Geschäftslogik einbetten; Echtzeit-Konsistenz von einer Batch-Integration erwarten, ohne die Verzögerung explizit zu kommunizieren.

## Production Checklist

- [ ] Kanonisches, systemneutrales Datenmodell definiert und dokumentiert.
- [ ] Mapping-Logik als eigene, getrennte, testbare Schicht implementiert.
- [ ] Batch- versus Online-Integrationsart je Datentyp explizit begründet.
- [ ] Fehlerzuständigkeit zwischen Systemen vertraglich/organisatorisch geklärt.

## Interviewfragen

### 1. Warum ist ein kanonisches Datenmodell besser als direkte Punkt-zu-Punkt-Integration?

**Antwort:** Es reduziert den Integrationsaufwand von quadratisch (N×(N-1) Mappings) auf linear (N Adapter), da jedes System nur gegen ein gemeinsames, neutrales Modell übersetzt werden muss statt gegen jedes andere System einzeln.

### 2. Was ist der Unterschied zwischen Batch- und Online-Integration, und wann wählst du welche?

**Antwort:** Batch synchronisiert periodisch größere Datenmengen mit inhärenter Verzögerung, geeignet für nicht-zeitkritische Daten; Online/Echtzeit überträgt Änderungen sofort, nötig für zeitkritische Daten wie Lagerbestand bei hoher Änderungsfrequenz.

### 3. Warum bleibt ein Datenfehler zwischen zwei Systemen oft unbearbeitet?

**Antwort:** Ohne klar definierte Fehlerzuständigkeit fühlt sich keine Seite eindeutig verantwortlich, den Fehler zu beheben, besonders wenn die Quelle der Wahrheit für das betroffene Feld nicht eindeutig geklärt ist.

### 4. Warum sollte Mapping-Logik von fachlicher Kernlogik getrennt sein?

**Antwort:** Vermischte Logik macht sowohl die Mapping-Regeln als auch die fachliche Logik schwerer testbar und nachvollziehbar; eine getrennte Schicht erlaubt unabhängige Änderung und Testung beider Aspekte.

### 5. Was ist eine scheinbare Inkonsistenz, die tatsächlich normales Batch-Verhalten ist?

**Antwort:** Ein Lagerbestand, der im Shop kurzzeitig vom tatsächlichen ERP-Bestand abweicht, weil die letzte Batch-Synchronisation noch nicht gelaufen ist — das ist erwartete Verzögerung, kein Integrationsfehler.

### 6. Widersprüchliche Anforderung: Vertrieb will Echtzeit-Lagerbestand für den Shop UND das ERP unterstützt nur stündliche Batch-Exporte — wie gehst du vor?

**Antwort:** Ich würde erklären, dass echte Echtzeit-Konsistenz mit einem stündlichen Batch-Export technisch nicht erreichbar ist; Alternativen wären ein ergänzender Event-basierter Kanal für kritische Statusänderungen (falls das ERP das unterstützt) oder eine bewusst kommunizierte Aktualitätsgrenze im Shop, statt eine nicht einlösbare Echtzeit-Zusage zu geben.

## Praktische Labs

~~~python
canonical_order = {"orderId": "1001", "totalAmount": 150.0, "status": "confirmed"}

def to_erp_format(canonical):  # fictional ERP field naming
    return {"BELNR": canonical["orderId"], "NETWR": canonical["totalAmount"], "STATUS_CODE": "C"}

def from_erp_format(erp_data):
    status_map = {"C": "confirmed", "P": "pending"}
    return {"orderId": erp_data["BELNR"], "totalAmount": erp_data["NETWR"], "status": status_map[erp_data["STATUS_CODE"]]}

erp_repr = to_erp_format(canonical_order)
round_trip = from_erp_format(erp_repr)
assert round_trip == canonical_order
print("Canonical model and ERP-specific format map correctly in both directions without leaking ERP internals into the canonical model.")
~~~

## Dependencies, Cross-References und Quellen

1. Hohpe, Woolf: [Enterprise Integration Patterns - Canonical Data Model](https://www.enterpriseintegrationpatterns.com/patterns/messaging/CanonicalDataModel.html), Addison-Wesley 2003, abgerufen 2026-09-17.

Produktspezifische ERP-/Warenwirtschafts-Schnittstellendetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Event-basierte ERP-Integration statt reinem Batch-Export, wo vom ERP unterstützt | Adopting je Anbieter | Tatsächliche Event-Unterstützung und Latenz des konkreten ERP-Systems verifizieren. |

Ein Team akzeptiert eine ERP-Integration erst, wenn kanonisches Modell, getrennte Mapping-Schicht und geklärte Fehlerzuständigkeit nachweisbar dokumentiert sind.
