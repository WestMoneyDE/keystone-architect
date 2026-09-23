---
{"id": "KB-0663", "title": "Headless-Commerce-Architektur", "domain": "29", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Storefront, Commerce Engine und Backoffice korrekt trennen und für ein gegebenes Commerce-Vorhaben eine passende Produktdatenmodellierung und Erweiterungspunktstruktur entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein Commerce-Vorhaben explizit gestalten, wie Checkout-Prozesse und Erweiterungspunkte mit klaren fachlichen Verantwortungsgrenzen zwischen Storefront, Commerce Engine und Backoffice strukturiert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Headless-Commerce-Architektur fachliche Verantwortungsgrenzen zwischen Storefront und Commerce Engine vermischt, sodass Änderungen an einer Ebene ungewollt die andere beeinflussen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Headless-Commerce-Architekturen festlegen, die klare fachliche Verantwortungsgrenzen zwischen Storefront, Commerce Engine und Backoffice vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Lernziel dieses Kapitels mit einem überprüfbaren Artefakt belegen.", "rationale": "Kern ist die architektonische Trennung von Storefront, Commerce Engine und Backoffice, nicht die produktspezifische ERP-/WMS-Integrationstiefe."}}, "lab_validation": [{"lab_id": "KB-0663-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung der Verantwortungstrennung zwischen Storefront, Commerce Engine und Backoffice, kein reales Commerce-System verwendet", "evidence": "Ein lokales Skript modelliert einen Checkout-Ablauf, bei dem Storefront, Commerce Engine und Backoffice jeweils klar abgegrenzte Zuständigkeiten haben, und zeigt, wie eine Vermischung dieser Zuständigkeiten zu inkonsistentem Verhalten führen kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Commerce-System getestet."}]}
---
# Headless-Commerce-Architektur

> **Ziel:** Headless Commerce trennt eine E-Commerce-Plattform in drei fachlich klar abgegrenzte Ebenen: die **Storefront** (die Präsentationsebene, über die Kunden tatsächlich mit dem Shop interagieren, etwa Web- oder App-Frontend), die **Commerce Engine** (die zentrale Geschäftslogik für Produktkatalog, Preisbildung, Warenkorb und Checkout, angesprochen über eine API statt über eine fest gekoppelte Präsentationsschicht) und das **Backoffice** (die administrative und operative Ebene für Produktpflege, Bestandsverwaltung und Auftragsabwicklung). Der zentrale Punkt dieses Kapitels ist, dass diese Trennung nur dann tatsächlich Wert liefert, wenn die fachlichen Verantwortungsgrenzen zwischen den drei Ebenen von Beginn an klar gezogen werden — eine Headless-Architektur, die zwar technisch entkoppelt ist, aber fachliche Logik unsauber zwischen Storefront und Commerce Engine verteilt, verliert tatsächlich den zentralen Vorteil der Trennung: unabhängige Entwicklungs- und Änderungsfähigkeit jeder Ebene.

## Zweck, Mental Model und Dependencies

Die Storefront ist bewusst von der Commerce Engine entkoppelt, sodass mehrere unterschiedliche Präsentationsschichten (etwa ein Web-Shop, eine mobile App und ein Kiosk-System) dieselbe Commerce Engine über eine gemeinsame API tatsächlich nutzen können, statt für jeden Kanal eine eigene, gekoppelte Geschäftslogik zu implementieren — diese Mehrfachnutzung ist der zentrale, praktische Vorteil gegenüber einer traditionellen, monolithischen Shop-Architektur. Die Commerce Engine führt die eigentliche Geschäftslogik: Produktkatalogverwaltung, Preisbildung, Warenkorblogik und Checkout-Orchestrierung müssen tatsächlich vollständig in der Commerce Engine verortet sein, statt teilweise in der Storefront implementiert zu werden — eine in der Storefront implementierte Preisberechnung würde etwa dazu führen, dass unterschiedliche Storefronts (Web, App) tatsächlich inkonsistente Preise anzeigen könnten, wenn die Logik nicht synchron gehalten wird. Produktdaten müssen in einem Modell strukturiert sein, das sowohl die Commerce-Engine-interne Logik (Preisbildung, Verfügbarkeitsprüfung) als auch die Darstellungsanforderungen unterschiedlicher Storefronts tatsächlich bedient, ohne dass die Storefront eigene, redundante Produktdatenlogik aufbauen muss. Das Backoffice greift auf dieselbe Commerce Engine wie die Storefront zu, jedoch über administrative statt kundenorientierte Funktionen — eine saubere Trennung stellt sicher, dass Backoffice-Operationen (etwa Preisänderungen oder Lagerkorrekturen) tatsächlich konsistent und unmittelbar in der Commerce Engine wirksam werden, ohne dass die Storefront separat synchronisiert werden muss. Erweiterungspunkte (etwa für Webhooks bei Bestellereignissen oder für die Integration mit externen Systemen wie ERP oder Warenwirtschaft) müssen an klar definierten, dokumentierten Schnittstellen der Commerce Engine ansetzen, statt als Ad-hoc-Erweiterungen quer durch alle drei Ebenen implementiert zu werden — dies erhält die fachliche Verantwortungsgrenze auch bei wachsender Systemkomplexität.

~~~text
Headless Commerce separates e-commerce platform into 3 clearly delineated levels
  STOREFRONT: presentation layer customers ACTUALLY interact with (web/app frontend)
  COMMERCE ENGINE: central business logic for catalog, pricing, cart, checkout, addressed
  via API instead of tightly coupled presentation layer
  BACKOFFICE: administrative/operational layer for product maintenance, inventory,
  order processing
KEY POINT: this separation only ACTUALLY delivers value when business responsibility
  boundaries between the 3 levels are drawn clearly from the start
  headless architecture technically decoupled but unclean business-logic distribution
  between storefront + commerce engine ACTUALLY loses central benefit of separation:
  independent development/change capability of each level
STOREFRONT deliberately decoupled from commerce engine -> multiple different
  presentation layers (web shop, mobile app, kiosk) can ACTUALLY use same commerce
  engine via shared API instead of implementing own, coupled business logic per channel
  this multi-use = central, practical advantage over traditional, monolithic shop
  architecture
COMMERCE ENGINE runs actual business logic: catalog management, pricing, cart logic,
  checkout orchestration must ACTUALLY be fully located in commerce engine instead of
  partially implemented in storefront
  price calc implemented in storefront -> different storefronts (web, app) could
  ACTUALLY show inconsistent prices if logic not kept in sync
PRODUCT DATA must be structured in a model ACTUALLY serving both commerce-engine-internal
  logic (pricing, availability check) and different storefronts' presentation needs,
  w/o storefront needing own, redundant product data logic
BACKOFFICE accesses same commerce engine as storefront, but via administrative instead
  of customer-facing functions
  clean separation ensures backoffice ops (price changes, inventory corrections)
  ACTUALLY take effect consistently+immediately in commerce engine w/o storefront
  needing separate sync
EXTENSION POINTS (webhooks for order events, integration w/ external systems like
  ERP/warehouse) must attach at clearly defined, documented commerce-engine interfaces
  instead of being implemented as ad-hoc extensions across all 3 levels
  preserves business responsibility boundary even as system complexity grows
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Storefront-Entkopplung | ermöglicht Mehrfachnutzung der Commerce Engine über Kanäle | verhindert kanalspezifische, redundante Geschäftslogik |
| Commerce Engine als alleinige Geschäftslogik-Instanz | zentralisiert Preisbildung, Warenkorb, Checkout | verhindert inkonsistente Logik über Storefronts hinweg |
| Strukturiertes Produktdatenmodell | bedient sowohl Engine-Logik als auch Darstellungsanforderungen | verhindert redundante Produktdatenlogik in der Storefront |
| Backoffice-Zugriff über dieselbe Engine | administrative Operationen wirken unmittelbar konsistent | verhindert Synchronisationsbedarf mit der Storefront |
| Dokumentierte Erweiterungspunkte | Webhooks/ERP-Integration an klaren Schnittstellen | erhält Verantwortungsgrenzen bei wachsender Komplexität |

Implementierung: Sämtliche Geschäftslogik (Preisbildung, Warenkorb, Checkout) wird ausschließlich in der Commerce Engine implementiert. Die Storefront konsumiert diese Logik ausschließlich über die API, ohne eigene, redundante Geschäftslogik. Erweiterungspunkte für ERP-/Warenwirtschaftsintegration werden an dokumentierten Commerce-Engine-Schnittstellen (etwa Webhooks) angebunden.

## Scalability, Reliability, Security und Observability

Eine Headless-Commerce-Architektur skaliert über die Anzahl unterschiedlicher Storefronts, die dieselbe Commerce Engine nutzen; die Reliability-Grenze liegt darin, dass in der Storefront implementierte Geschäftslogik bei mehreren Storefronts tatsächlich zu inkonsistentem Verhalten führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| unterschiedliche Storefronts zeigen inkonsistente Preise oder Verfügbarkeiten | Geschäftslogik wurde teilweise in der Storefront statt ausschließlich in der Commerce Engine implementiert | die betroffene Logik vollständig in die Commerce Engine verlagern |
| Backoffice-Änderungen wirken sich nicht unmittelbar auf die Storefront aus | Backoffice und Storefront greifen nicht konsistent auf dieselbe Commerce Engine zu | den Backoffice-Zugriffspfad auf Konsistenz mit dem Storefront-Zugriffspfad prüfen |
| eine ERP-Integration wurde als Ad-hoc-Erweiterung quer durch mehrere Ebenen implementiert | keine dokumentierten Erweiterungspunkte an der Commerce Engine wurden genutzt | die Integration auf dokumentierte Commerce-Engine-Schnittstellen (Webhooks) umstellen |

Security: Die Commerce-Engine-API sollte für administrative Backoffice-Funktionen strengere Authentifizierung erfordern als für kundenorientierte Storefront-Funktionen. Observability: Die tatsächliche Konsistenz von Preisen und Verfügbarkeiten über unterschiedliche Storefronts hinweg ist ein zentrales Signal zur Bewertung der sauberen Verantwortungstrennung.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte Trennung von Geschäftslogik zwischen Storefront und Commerce Engine für eine gegebene Funktion. **Principal** entwirft die vollständige Headless-Commerce-Architektur mit Erweiterungspunkten für eine Organisation. **Chief** legt unternehmensweite Standards für Verantwortungsgrenzen zwischen Storefront, Commerce Engine und Backoffice fest.

Anti-Patterns: Geschäftslogik (Preisbildung, Verfügbarkeit) in der Storefront statt in der Commerce Engine implementieren; ERP-/Warenwirtschaftsintegrationen als Ad-hoc-Erweiterungen ohne dokumentierte Schnittstelle einbinden; Backoffice-Funktionen über einen separaten, nicht mit der Storefront konsistenten Zugriffspfad implementieren.

## Production Checklist

- [ ] Sämtliche Geschäftslogik ist ausschließlich in der Commerce Engine implementiert.
- [ ] Alle Storefronts konsumieren dieselbe Commerce-Engine-API ohne redundante Geschäftslogik.
- [ ] Backoffice und Storefront greifen konsistent auf dieselbe Commerce Engine zu.
- [ ] Erweiterungspunkte (Webhooks, ERP-Integration) sind an dokumentierten Commerce-Engine-Schnittstellen angebunden.

## Interviewfragen

### 1. Was sind die drei zentralen Ebenen einer Headless-Commerce-Architektur?

**Antwort:** Die Storefront (Präsentationsebene), die Commerce Engine (zentrale Geschäftslogik) und das Backoffice (administrative Ebene).

### 2. Warum ist die Mehrfachnutzung der Commerce Engine über unterschiedliche Storefronts ein zentraler Vorteil?

**Antwort:** Weil mehrere Präsentationsschichten dieselbe Geschäftslogik über eine gemeinsame API nutzen können, statt für jeden Kanal eine eigene, gekoppelte Geschäftslogik implementieren zu müssen.

### 3. Was passiert, wenn Preisberechnungslogik in der Storefront statt in der Commerce Engine implementiert wird?

**Antwort:** Unterschiedliche Storefronts können tatsächlich inkonsistente Preise anzeigen, wenn die Logik nicht synchron gehalten wird.

### 4. Wie sollten Erweiterungspunkte wie ERP-Integrationen in einer Headless-Commerce-Architektur angebunden werden?

**Antwort:** An klar definierten, dokumentierten Schnittstellen der Commerce Engine, statt als Ad-hoc-Erweiterungen quer durch alle drei Ebenen.

### 5. Wie gehst du vor, wenn unterschiedliche Storefronts inkonsistente Preise oder Verfügbarkeiten zeigen?

**Antwort:** Ich prüfe, ob Geschäftslogik teilweise in der Storefront statt ausschließlich in der Commerce Engine implementiert wurde, und verlagere sie vollständig in die Commerce Engine.

### 6. Widersprüchliche Anforderung: Das Storefront-Team will schnelle, unabhängige Iteration bei kanalspezifischen Sonderangeboten UND die Organisation will eine einzige, konsistente Preislogik über alle Kanäle — wie gehst du vor?

**Antwort:** Ich würde kanalspezifische Sonderangebote als konfigurierbare Parameter innerhalb der zentralen Commerce-Engine-Preislogik modellieren, statt eigene Preisberechnungslogik in die Storefront zu verlagern, sodass Storefronts weiterhin schnell iterieren können, ohne die zentrale Konsistenz zu gefährden.

## Praktische Labs

~~~python
# Local, deterministic illustration of commerce-engine-centralized vs. storefront-scattered pricing logic (executed locally, no real commerce system):

def get_price_centralized(product_id, commerce_engine_catalog):
    return commerce_engine_catalog[product_id]["price"]

def get_price_scattered(product_id, storefront_local_cache):
    return storefront_local_cache.get(product_id, {}).get("price", "stale_or_missing")

catalog = {"sku-1": {"price": 49.99}}
stale_cache = {}  # storefront didn't sync

print(get_price_centralized("sku-1", catalog))
print(get_price_scattered("sku-1", stale_cache))
~~~

## Dependencies, Cross-References und Quellen

1. MACH Alliance: [MACH Principles — Microservices, API-first, Cloud-native, Headless](https://machalliance.org/mach-technology), abgerufen 2026-09-18.
2. Medusa: [Medusa Commerce Architecture Documentation](https://docs.medusajs.com/), abgerufen 2026-09-18.

Dieses Kapitel eröffnet Domain 29 (Commerce Integration) und hat keine kapitelinternen Vorgängerabhängigkeiten innerhalb dieses Domains.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Composable-Commerce-Ansätze, die die Commerce Engine selbst in unabhängig austauschbare Fähigkeitsmodule (Preisbildung, Katalog, Checkout) weiter zerlegen | Growing Adoption | Bei künftigen Neuvorhaben evaluieren, jedoch bei bestehenden, funktionierenden Headless-Architekturen weiterhin auf die etablierte Drei-Ebenen-Trennung setzen, bis ein konkreter Modularitätsbedarf entsteht. |

Ein Team akzeptiert eine Headless-Commerce-Architektur erst, wenn die fachliche Verantwortungsgrenze zwischen Storefront, Commerce Engine und Backoffice nachweislich konsistent eingehalten wird.
