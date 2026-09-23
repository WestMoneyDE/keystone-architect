---
{"id": "KB-0671", "title": "ERP-Integration im Handelsprozess", "domain": "29", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0669", "concepts": ["ERP-Webhook-Abnahmezuständigkeit"], "needed_for": "Die hier behandelte Festlegung führender Systeme baut auf der in KB-0669 beschriebenen ERP-Webhook-Zuständigkeit auf"}], "related": ["KB-0666"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Stamm-, Preis- und Auftragsdaten korrekt zwischen Commerce und ERP zuordnen und für ein gegebenes Szenario führende Systeme sowie Batchfenster eindeutig festlegen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, welches System für welche Datenkategorie führend ist und wie manuelle Klärpfade bei Dateninkonsistenzen strukturiert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn zwei Systeme fälschlich beide als führend für dieselbe Datenkategorie behandelt werden, wodurch Änderungen tatsächlich widersprüchlich werden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für ERP-Commerce-Integration festlegen, die eindeutige führende Systeme pro Datenkategorie und dokumentierte manuelle Klärpfade vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Lernziel dieses Kapitels mit einem überprüfbaren Artefakt belegen.", "rationale": "Kern ist die konzeptionelle Zuordnungs- und Zuständigkeitsarchitektur, nicht die produktspezifische ERP-Konnektorimplementierung."}}, "lab_validation": [{"lab_id": "KB-0671-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung führender Systeme pro Datenkategorie, kein reales ERP-System verwendet", "evidence": "Ein lokales Skript modelliert eine Datenänderung, die je nach Datenkategorie entweder vom ERP oder vom Commerce-System als führend behandelt wird, und zeigt, wie eine Änderung im nicht-führenden System korrekt als Klärfall statt als direkte Übernahme behandelt wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales ERP-System getestet."}]}
---
# ERP-Integration im Handelsprozess

> **Ziel:** Die ERP-Integration im Handelsprozess koordiniert den Datenaustausch zwischen Commerce-System und ERP über drei Datenkategorien: **Stammdaten** (Produktinformationen, die typischerweise im ERP oder einem dedizierten PIM gepflegt und in das Commerce-System übernommen werden), **Preisdaten** (Preisinformationen, die je nach Geschäftsmodell entweder im ERP oder im Commerce-System tatsächlich führend sein können) und **Auftragsdaten** (Bestellinformationen, die typischerweise im Commerce-System entstehen und in das ERP zur Weiterverarbeitung, etwa Fakturierung und Fulfillment, übertragen werden). Der zentrale Punkt dieses Kapitels ist, dass für jede Datenkategorie explizit ein einziges, führendes System festgelegt sein muss — ein System, in dem zwei Systeme fälschlich beide als führend für dieselbe Datenkategorie behandelt werden, kann tatsächlich zu widersprüchlichen Änderungen führen, deren Auflösung ohne einen dokumentierten, manuellen Klärpfad tatsächlich unklar bleibt.

## Zweck, Mental Model und Dependencies

Stammdaten (Produktname, Beschreibung, Kategorisierung) werden typischerweise im ERP oder einem dedizierten Produktinformationssystem gepflegt und in regelmäßigen, definierten Batchfenstern in das Commerce-System übernommen — das ERP ist hier tatsächlich das führende System, das Commerce-System übernimmt die Daten nur lesend, sodass eine direkte Änderung im Commerce-System tatsächlich beim nächsten Batch-Update überschrieben würde, wenn sie nicht explizit als Ausnahme behandelt wird. Preisdaten sind komplexer, da die Führungsfrage tatsächlich vom Geschäftsmodell abhängt: In manchen Organisationen ist das ERP mit seiner zentralen Preiskalkulation führend, in anderen wird die dynamische, kundenspezifische Preisbildung (siehe KB-0668, kundenspezifische Preise) tatsächlich im Commerce-System vorgenommen — diese Führungsfrage muss für jede Preiskomponente (Basispreis, Rabatte, kundenspezifische Konditionen) explizit und einzeln geklärt sein, statt pauschal ein System als vollständig führend zu betrachten. Auftragsdaten entstehen typischerweise im Commerce-System (eine Bestellung wird dort tatsächlich angelegt) und werden zur Weiterverarbeitung an das ERP übertragen — hier ist das Commerce-System für die Auftragsentstehung führend, während das ERP für die nachgelagerte Verarbeitung (Fakturierung, Lieferschein, Buchhaltung) führend wird, sobald die Bestellung übertragen wurde; diese Übergabe des Führungsstatus an einem definierten Punkt im Prozess muss explizit dokumentiert sein. Batchfenster (feste Zeitintervalle für den Datenaustausch, im Unterschied zu den in KB-0669 beschriebenen Echtzeit-Webhooks) werden für Datenkategorien genutzt, bei denen keine tatsächliche Echtzeitanforderung besteht (etwa tägliche Stammdatenaktualisierung), während zeitkritische Daten (etwa Auftragsübertragung) tatsächlich über Echtzeit-Mechanismen wie Webhooks übertragen werden sollten. Manuelle Klärpfade müssen explizit dokumentiert sein für den Fall, dass eine Dateninkonsistenz zwischen Commerce und ERP tatsächlich auftritt (etwa wenn eine automatische Zuordnung fehlschlägt) — ohne einen dokumentierten Klärpfad bleibt unklar, wer tatsächlich für die Auflösung einer solchen Inkonsistenz verantwortlich ist, was der in KB-0670 beschriebenen Notwendigkeit expliziter Ownership entspricht, hier jedoch angewendet auf den Ausnahmefall inkonsistenter Daten statt auf den regulären Ereignisfluss.

~~~text
ERP Integration in trade process coordinates commerce<->ERP data exchange across 3 data
  categories
  MASTER DATA: product info, typically maintained in ERP/PIM, pulled into commerce
  system
  PRICE DATA: pricing info, depending on business model ACTUALLY leading in either ERP
  or commerce system
  ORDER DATA: order info typically originating in commerce system, transferred to ERP
  for downstream processing (invoicing, fulfillment)
KEY POINT: every data category needs explicitly ONE single, leading system defined --
  system where two systems falsely both treated as leading for same data category CAN
  ACTUALLY cause conflicting changes, whose resolution stays ACTUALLY unclear w/o a
  documented, manual clarification path
MASTER DATA (product name, description, categorization) typically maintained in ERP/PIM,
  pulled into commerce system in regular, defined batch windows
  ERP ACTUALLY leading here, commerce system only read-pulls -- direct change in commerce
  system would ACTUALLY be overwritten on next batch update if not explicitly handled as
  exception
PRICE DATA more complex, leadership question ACTUALLY depends on business model: some
  orgs have ERP's central price calc leading, others ACTUALLY do dynamic, customer-
  specific pricing (see KB-0668) in commerce system
  leadership question must be explicitly + individually clarified per price component
  (base price, discounts, customer-specific terms), instead of treating one system as
  fully leading across the board
ORDER DATA typically originates in commerce system (order ACTUALLY created there),
  transferred to ERP for downstream processing
  commerce system leading for order creation, ERP becomes leading for downstream
  processing (invoicing, delivery note, accounting) once order transferred -- this
  handoff of leading status at a defined process point must be explicitly documented
BATCH WINDOWS (fixed time intervals for data exchange, unlike KB-0669's real-time
  webhooks) used for data categories w/o ACTUAL real-time requirement (daily master
  data update), while time-critical data (order transfer) should ACTUALLY use real-time
  mechanisms like webhooks
MANUAL CLARIFICATION PATHS must be explicitly documented for case where a data
  inconsistency between commerce+ERP ACTUALLY occurs (automatic mapping fails) -- w/o
  documented path, unclear who's ACTUALLY responsible for resolving such inconsistency,
  corresponds to KB-0670's explicit-ownership necessity, here applied to exception case
  of inconsistent data instead of regular event flow
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Stammdaten-Führung (ERP/PIM) | zentrale Pflege, lesende Übernahme im Commerce-System | verhindert Überschreibung durch nächsten Batch |
| Preisdaten-Führung (kategorienabhängig) | explizite Klärung je Preiskomponente | verhindert pauschale, falsche Führungsannahme |
| Auftragsdaten-Übergabepunkt | Commerce führt bei Entstehung, ERP bei Weiterverarbeitung | verhindert unklaren Führungsstatuswechsel |
| Batchfenster vs. Echtzeit-Übertragung | passt Übertragungsart an tatsächlichen Zeitkritikalitätsgrad an | verhindert unnötige Echtzeit-Komplexität für unkritische Daten |
| Dokumentierte manuelle Klärpfade | Zuständigkeit bei Dateninkonsistenz | verhindert unklare Verantwortung im Ausnahmefall |

Implementierung: Für jede Datenkategorie (Stamm-, Preis-, Auftragsdaten) ist explizit dokumentiert, welches System führend ist und an welchem Prozesspunkt sich dies gegebenenfalls ändert. Batchfenster werden für nicht zeitkritische Daten genutzt, Echtzeit-Mechanismen für zeitkritische. Ein dokumentierter, manueller Klärpfad existiert für Dateninkonsistenzen.

## Scalability, Reliability, Security und Observability

Eine ERP-Commerce-Integrationsarchitektur skaliert über die Anzahl der integrierten Datenkategorien und Batchfenster; die Reliability-Grenze liegt darin, dass eine unklare Führungszuordnung tatsächlich zu widersprüchlichen Datenänderungen führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Stammdatenänderungen im Commerce-System werden regelmäßig überschrieben | das ERP ist führend, die Änderung wurde jedoch fälschlich direkt im Commerce-System vorgenommen | die Änderung stattdessen im führenden ERP vornehmen oder einen expliziten Ausnahmeprozess definieren |
| eine Preisänderung führt zu widersprüchlichen Werten zwischen ERP und Commerce | die Führungsfrage für die betroffene Preiskomponente ist nicht eindeutig geklärt | die Führung für jede Preiskomponente explizit und einzeln dokumentieren |
| eine Dateninkonsistenz zwischen ERP und Commerce bleibt unbearbeitet | kein dokumentierter, manueller Klärpfad existiert | einen expliziten Klärpfad mit zugeordneter Verantwortlichkeit einführen |

Security: Der Datenaustausch zwischen Commerce und ERP sollte auf die tatsächlich benötigten Datenfelder beschränkt sein, statt vollständige interne Datenstrukturen zu übertragen. Observability: Die tatsächliche Häufigkeit manueller Klärfälle ist ein zentrales Signal zur Bewertung, ob die automatische Datenzuordnung ausreichend robust ist.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte Datenzuordnung für eine gegebene Datenkategorie zwischen Commerce und ERP. **Principal** entwirft die vollständige ERP-Integrationsarchitektur mit Führungszuordnung und Klärpfaden für ein Commerce-Vorhaben. **Chief** legt unternehmensweite Standards für ERP-Commerce-Datenführung fest.

Anti-Patterns: zwei Systeme fälschlich beide als führend für dieselbe Datenkategorie behandeln; keinen dokumentierten Klärpfad für Dateninkonsistenzen vorsehen; zeitkritische Daten über Batchfenster statt Echtzeit-Mechanismen übertragen.

## Production Checklist

- [ ] Für jede Datenkategorie (Stamm-, Preis-, Auftragsdaten) ist ein einziges, führendes System explizit dokumentiert.
- [ ] Der Übergabepunkt des Führungsstatus für Auftragsdaten ist explizit dokumentiert.
- [ ] Batchfenster werden nur für nicht zeitkritische Daten genutzt.
- [ ] Ein dokumentierter, manueller Klärpfad für Dateninkonsistenzen existiert.

## Interviewfragen

### 1. Warum muss für jede Datenkategorie explizit ein einziges, führendes System festgelegt sein?

**Antwort:** Weil zwei fälschlich als führend behandelte Systeme für dieselbe Datenkategorie zu widersprüchlichen Änderungen führen können, deren Auflösung ohne klare Führungszuordnung unklar bleibt.

### 2. Warum ist die Führungsfrage bei Preisdaten komplexer als bei Stammdaten?

**Antwort:** Weil die Führung je nach Geschäftsmodell und Preiskomponente unterschiedlich sein kann — mal ist das ERP mit zentraler Kalkulation führend, mal die dynamische, kundenspezifische Preisbildung im Commerce-System.

### 3. An welchem Punkt wechselt der Führungsstatus für Auftragsdaten typischerweise vom Commerce-System zum ERP?

**Antwort:** Sobald die Bestellung im Commerce-System entstanden ist und zur Weiterverarbeitung (Fakturierung, Fulfillment) an das ERP übertragen wurde.

### 4. Wann sollten Batchfenster statt Echtzeit-Webhooks für den Datenaustausch genutzt werden?

**Antwort:** Für Datenkategorien ohne tatsächliche Echtzeitanforderung, etwa tägliche Stammdatenaktualisierungen, während zeitkritische Daten wie Auftragsübertragung Echtzeit-Mechanismen nutzen sollten.

### 5. Wie gehst du vor, wenn Stammdatenänderungen im Commerce-System regelmäßig überschrieben werden?

**Antwort:** Ich prüfe, ob das ERP tatsächlich führend ist, und stelle sicher, dass Änderungen im führenden System statt direkt im Commerce-System vorgenommen werden, oder definiere einen expliziten Ausnahmeprozess.

### 6. Widersprüchliche Anforderung: Das Vertriebsteam will schnelle, direkte Preisanpassungen im Commerce-System für Sonderaktionen UND die Buchhaltung will das ERP als alleinige, verlässliche Preisquelle für die Finanzberichterstattung — wie gehst du vor?

**Antwort:** Ich würde die Führung pro Preiskomponente differenzieren — Sonderaktionspreise führend im Commerce-System mit definierter Gültigkeitsdauer, Basispreise weiterhin führend im ERP — statt ein System pauschal für alle Preiskomponenten als alleinige Quelle zu erzwingen.

## Praktische Labs

~~~python
# Local, deterministic illustration of per-category system leadership (executed locally, no real ERP system):

LEADERSHIP = {"master_data": "erp", "order_data": "commerce", "base_price": "erp", "promo_price": "commerce"}

def apply_change(category, source_system):
    leader = LEADERSHIP.get(category)
    if leader is None:
        return "unmapped category: manual clarification required"
    if source_system != leader:
        return f"rejected/queued for clarification: {category} is led by {leader}, not {source_system}"
    return f"applied: {category} updated by leading system {leader}"

print(apply_change("master_data", "commerce"))
print(apply_change("master_data", "erp"))
~~~

## Dependencies, Cross-References und Quellen

1. GS1: [GS1 Standards — Master Data Alignment Between Trading Partners](https://www.gs1.org/standards), abgerufen 2026-09-18.
2. Medusa: [Medusa ERP Integration Patterns Documentation](https://docs.medusajs.com/resources/integrations), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0669 (Commerce-Webhooks) beschriebenen ERP-Webhook-Zuständigkeit auf und erweitert diese um die vollständige Datenführungsarchitektur.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Master-Data-Management-Plattformen (MDM) als eigenständige, dedizierte Führungsinstanz für Stammdaten statt direkter ERP-Führung | Growing Adoption | Bei künftigen Neuvorhaben mit mehreren nachgelagerten Systemen evaluieren, jedoch bei bestehenden, zweiseitigen ERP-Commerce-Integrationen weiterhin auf die etablierte, direkte Führungszuordnung setzen. |

Ein Team akzeptiert eine ERP-Commerce-Integrationsarchitektur erst, wenn Führungszuordnung pro Datenkategorie, Übergabepunkte und manuelle Klärpfade nachweislich dokumentiert sind.
