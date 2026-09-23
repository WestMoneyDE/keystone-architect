---
{"id": "KB-0490", "title": "Azure App Service", "domain": "20", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0488", "concepts": ["Azure Container Apps"], "needed_for": "understanding"}, {"id": "KB-0477", "concepts": ["Amazon API Gateway, Deployment-Stages"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine App-Service-Anwendung mit einem Deployment Slot anhand offizieller Dokumentation konfigurieren können und erklären, wie ein Slot-Swap Konfigurationsänderungen von Code-Deployments trennt.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen Web-Hosting-Anwendungsfall begründet zwischen App Service, Container Apps und Kubernetes entscheiden, basierend auf dem tatsächlichen Bedarf an Container-Orchestrierungsfähigkeiten gegenüber vereinfachtem Webhosting.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Konfigurationsänderung nach einem Slot-Swap auf slot-spezifische (nicht mit-geswappte) Einstellungen zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Web-Hosting-Plattformrichtlinien im Unternehmen anhand des tatsächlichen Bedarfs an Container-Orchestrierung statt anhand einer pauschalen Präferenz für Container-Plattformen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der App-Service-Hosting-Infrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Deployment Slots, Konfigurationsverhalten und der Abgrenzung zu Containerplattformen als Entscheidungsgrundlage, nicht die Hosting-Infrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0490-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Azure-App-Service-Dokumentation, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Deployment Slots separate, vollständige Umgebungen für dieselbe App-Service-Anwendung bereitstellen, wie ein Slot-Swap Code und bestimmte Konfigurationen zwischen Slots austauscht, während andere, slot-spezifisch markierte Einstellungen bewusst NICHT mitgetauscht werden, und wie sich App Service als vereinfachter Webhosting-Dienst von containerbasierten Plattformen wie Container Apps oder AKS unterscheidet.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale App-Service-Konfiguration erstellt."}]}
---
# Azure App Service

> **Ziel:** Azure App Service ist ein vereinfachter Webhosting-Dienst, der im Vergleich zu containerbasierten Plattformen wie Azure Container Apps (siehe [KB-0488](08-azure-container-apps.md)) oder AKS minimalen Konfigurationsaufwand für klassisches Webanwendungs-Hosting bietet, jedoch eingeschränkte Container-Orchestrierungsfähigkeiten besitzt. Der zentrale Punkt dieses Kapitels ist, dass Deployment Slots separate, vollständige Umgebungen für dieselbe Anwendung bereitstellen (z. B. "Staging" und "Production"), zwischen denen ein Slot-Swap Code und die meisten Konfigurationseinstellungen austauscht — jedoch bestimmte, explizit als "slot-spezifisch" markierte Einstellungen (z. B. Verbindungszeichenfolgen zu einer produktiven versus einer Staging-Datenbank) bewusst nicht mitgetauscht werden, was bei unzureichendem Verständnis dieser Trennung zu unerwarteten, scheinbar falschen Konfigurationswerten nach einem Swap führen kann.

## Zweck, Mental Model und Dependencies

App Service abstrahiert die Infrastrukturverwaltung für klassisches Webanwendungs-Hosting (Web-Apps, APIs) nahezu vollständig — der Kunde stellt Code oder ein Container-Image bereit, und Azure verwaltet die zugrunde liegende Ausführungsumgebung, Skalierung und grundlegende Betriebsaufgaben, ohne dass der Kunde eine vollständige Container-Orchestrierungsplattform wie Kubernetes benötigt oder direkten Zugriff darauf erhält. Ein Deployment Slot ist eine separate, vollständige Instanz derselben App-Service-Anwendung mit eigener URL, die parallel zur Produktionsumgebung betrieben werden kann — typischerweise für Staging oder Testing, bevor eine neue Version tatsächlich produktiv geschaltet wird. Ein Slot-Swap tauscht die Inhalte zweier Slots aus (z. B. Staging wird zur neuen Produktion), wobei der entscheidende, oft übersehene Mechanismus darin besteht, dass die meisten Anwendungseinstellungen mit dem Slot-Inhalt mitgetauscht werden, bestimmte Einstellungen jedoch explizit als "slot-spezifisch" (sticky) markiert werden können, sodass sie beim Swap bewusst am jeweiligen Slot verbleiben, statt mitgetauscht zu werden — dies ist beispielsweise für Datenbankverbindungszeichenfolgen relevant, bei denen der "Production"-Slot immer mit der produktiven Datenbank verbunden bleiben soll, unabhängig davon, welcher Anwendungscode gerade in diesem Slot läuft. Der zentrale methodische Punkt ist, dass eine unerwartete Konfigurationsänderung nach einem Slot-Swap (z. B. eine Anwendung, die nach dem Swap scheinbar mit der falschen Datenbank verbunden ist) typischerweise nicht auf einen Fehler im Swap-Mechanismus selbst zurückzuführen ist, sondern darauf, dass eine bestimmte Einstellung fälschlich nicht als slot-spezifisch markiert war (und daher unbeabsichtigt mitgetauscht wurde) oder umgekehrt fälschlich als slot-spezifisch markiert war (und daher nicht wie erwartet mitgetauscht wurde) — diese Konfiguration muss explizit für jede Einstellung geprüft werden, statt anzunehmen, dass ein Swap entweder "alles" oder "nichts" an Konfiguration mitnimmt.

~~~text
App Service: near-complete infra abstraction for classic web app hosting (web apps, APIs)
  customer provides code/container image, Azure manages execution env, scaling, basic ops
  -> NO Kubernetes orchestration needed/accessible
Deployment Slot: SEPARATE, FULL instance of the SAME app, own URL
  (typically staging, tested BEFORE actually going to production)
Slot Swap: exchanges TWO slots' content
  MOST app settings SWAP WITH the slot content
  BUT settings marked "slot-specific" (sticky) DELIBERATELY stay WITH the slot, NOT swapped
    (e.g. "Production" slot ALWAYS connects to the production DB, regardless of which code version runs there)
KEY METHODOLOGICAL POINT: unexpected config change after a swap
  typically NOT a swap-mechanism bug
  -> traceable to a setting WRONGLY NOT marked slot-specific (unintentionally swapped)
     OR WRONGLY marked slot-specific (unintentionally NOT swapped as expected)
  -> must be checked EXPLICITLY PER SETTING, never assume "all" or "nothing" swaps by default
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| App Service | vereinfachtes Webhosting ohne Container-Orchestrierung | geeignet, wenn kein tatsächlicher Kubernetes-Bedarf besteht |
| Deployment Slot | separate, vollständige Umgebung für dieselbe Anwendung | ermöglicht Staging/Testing vor produktiver Umschaltung |
| Slot-Swap | tauscht Code und die meisten Einstellungen zwischen Slots | slot-spezifische Einstellungen bleiben bewusst am Slot |
| Slot-spezifische (Sticky) Einstellungen | verbleiben beim Swap am jeweiligen Slot | explizit pro Einstellung geprüft, nicht pauschal angenommen |

Implementierung: Vor der Wahl von App Service gegenüber containerbasierten Plattformen wird geprüft, ob tatsächlich Container-Orchestrierungsfähigkeiten (z. B. spezifische Skalierungslogik, Multi-Container-Koordination) benötigt werden, oder ob das vereinfachte Webhosting-Modell von App Service ausreichend ist. Für jede Anwendungseinstellung wird explizit dokumentiert und konfiguriert, ob sie als slot-spezifisch markiert sein soll (z. B. Datenbankverbindungen, die immer zur jeweiligen Umgebung gehören sollen) oder mit dem Code mitgetauscht werden soll (z. B. anwendungslogische Feature-Flags, die zur neuen Version gehören). Vor jedem produktiven Slot-Swap wird explizit verifiziert, dass die tatsächliche Konfiguration nach dem Swap dem beabsichtigten Zustand entspricht, statt sich blind auf den Swap-Mechanismus zu verlassen.

## Scalability, Reliability, Security und Observability

Azure App Service skaliert die Betriebseinfachheit für klassisches Webhosting proportional zur Delegation der Infrastrukturverantwortung an Azure; die Reliability-Grenze liegt darin, dass eine fehlerhafte Slot-spezifische Markierung einer Einstellung proportional zur Kritikalität dieser Einstellung zu unerwarteten, potenziell fehlerhaften Konfigurationszuständen nach einem Slot-Swap führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung ist nach einem Slot-Swap unerwartet mit der falschen Datenquelle verbunden | die entsprechende Einstellung war nicht als slot-spezifisch markiert und wurde daher unbeabsichtigt mitgetauscht | die Slot-spezifische Markierung der betroffenen Einstellung prüfen und korrigieren |
| eine neue Funktionalität ist nach einem Slot-Swap unerwartet nicht aktiv | die zugehörige Einstellung (z. B. ein Feature-Flag) war fälschlich als slot-spezifisch markiert und wurde daher nicht mitgetauscht | prüfen, ob diese Einstellung tatsächlich mit dem Code mitgetauscht werden sollte, statt slot-spezifisch zu sein |
| ein Team benötigt Multi-Container-Koordination oder spezifische Skalierungslogik, die App Service nicht bietet | App Service wurde für einen Anwendungsfall gewählt, der tatsächlich Container-Orchestrierungsfähigkeiten benötigt | den tatsächlichen Bedarf neu bewerten und eine Migration zu Container Apps oder AKS evaluieren |

Security: Produktive Slots sollten über restriktivere Netzwerkzugangsregeln als Staging-Slots verfügen, insbesondere wenn Staging-Umgebungen für Testzwecke breiter zugänglich sein müssen. Observability: Die tatsächliche Konfiguration jedes Slots vor und nach einem Swap, sowie die Slot-spezifische Markierung jeder kritischen Einstellung, sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** dokumentiert und prüft die Slot-spezifische Markierung jeder Anwendungseinstellung explizit. **Principal** macht das Slot-Swap-Verhalten und dessen Grenzen für das Team nachvollziehbar. **Chief** legt Web-Hosting-Plattformrichtlinien im Unternehmen anhand des tatsächlichen Bedarfs an Container-Orchestrierung fest.

Anti-Patterns: einen Slot-Swap durchführen, ohne die Slot-spezifische Markierung kritischer Einstellungen (z. B. Datenbankverbindungen) explizit zu prüfen; App Service für einen Anwendungsfall wählen, der tatsächlich Container-Orchestrierungsfähigkeiten benötigt; annehmen, dass ein Slot-Swap pauschal "alle" oder "keine" Einstellungen mitnimmt, ohne die individuelle Konfiguration zu prüfen.

## Production Checklist

- [ ] Die Slot-spezifische Markierung jeder Anwendungseinstellung ist explizit dokumentiert und geprüft.
- [ ] Vor jedem produktiven Slot-Swap wird die resultierende Konfiguration gegen den beabsichtigten Zustand verifiziert.
- [ ] Die Wahl zwischen App Service und containerbasierten Plattformen ist anhand des tatsächlichen Orchestrierungsbedarfs begründet.
- [ ] Produktive Slots haben restriktivere Netzwerkzugangsregeln als Staging-Slots.

## Interviewfragen

### 1. Was ist ein Deployment Slot, und wofür wird er typischerweise genutzt?

**Antwort:** Eine separate, vollständige Instanz derselben App-Service-Anwendung mit eigener URL, typischerweise für Staging oder Testing vor einer produktiven Umschaltung.

### 2. Was passiert bei einem Slot-Swap mit slot-spezifischen (sticky) Einstellungen?

**Antwort:** Diese Einstellungen verbleiben bewusst am jeweiligen Slot und werden nicht mitgetauscht, im Gegensatz zu den meisten anderen Einstellungen, die mit dem Code mitgetauscht werden.

### 3. Warum sollte eine Datenbankverbindungszeichenfolge typischerweise slot-spezifisch markiert werden?

**Antwort:** Damit der "Production"-Slot immer mit der produktiven Datenbank verbunden bleibt, unabhängig davon, welche Anwendungsversion gerade in diesem Slot läuft, statt versehentlich mit der Staging-Datenbank getauscht zu werden.

### 4. Wann ist App Service gegenüber containerbasierten Plattformen wie Container Apps oder AKS angemessen?

**Antwort:** Wenn kein tatsächlicher Bedarf an Container-Orchestrierungsfähigkeiten (z. B. Multi-Container-Koordination, spezifische Skalierungslogik) besteht und das vereinfachte Webhosting-Modell ausreichend ist.

### 5. Wie gehst du vor, wenn eine Anwendung nach einem Slot-Swap unerwartet mit der falschen Datenquelle verbunden ist?

**Antwort:** Ich prüfe, ob die entsprechende Einstellung als slot-spezifisch markiert war; falls nicht, wurde sie unbeabsichtigt mitgetauscht, und ich korrigiere die Markierung entsprechend.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Slot-Swaps UND garantiert korrekte Konfiguration nach jedem Swap — wie gehst du vor?

**Antwort:** Ich würde eine klare, dokumentierte Konvention für die Slot-spezifische Markierung jeder Einstellungskategorie etablieren (z. B. immer Datenverbindungen slot-spezifisch, immer Feature-Flags nicht slot-spezifisch) und diese durch einen automatisierten Prüfschritt vor jedem produktiven Swap verifizieren lassen, statt jede Konfiguration manuell und fehleranfällig einzeln zu prüfen.

## Praktische Labs

~~~python
# Conceptual slot-swap configuration behavior simulation (not executed against a real Azure account):

def simulate_slot_swap(staging_settings, production_settings, sticky_settings):
    """sticky_settings: set of setting names that stay WITH their slot, not swapped."""
    new_production = {}
    new_staging = {}
    for key in set(staging_settings) | set(production_settings):
        if key in sticky_settings:
            new_production[key] = production_settings.get(key)  # stays
            new_staging[key] = staging_settings.get(key)  # stays
        else:
            new_production[key] = staging_settings.get(key)  # swapped IN from staging
            new_staging[key] = production_settings.get(key)  # swapped IN from production
    return {"new_production": new_production, "new_staging": new_staging}

staging = {"code_version": "v2", "db_connection": "staging-db"}
production = {"code_version": "v1", "db_connection": "prod-db"}
sticky = {"db_connection"}  # db_connection stays with its slot

result = simulate_slot_swap(staging, production, sticky)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure App Service — Set Up Staging Environments](https://learn.microsoft.com/en-us/azure/app-service/deploy-staging-slots), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Azure App Service — Configure App Settings](https://learn.microsoft.com/en-us/azure/app-service/configure-common), abgerufen 2026-09-18.

Azure Container Apps sind kanonisch in [KB-0488](08-azure-container-apps.md) behandelt; Amazon API Gateway und Deployment-Stages in [KB-0477](../19-aws/15-amazon-api-gateway.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Slot-Swap-Validierungswerkzeuge, die vor einem Swap automatisch prüfen, ob die resultierende Konfiguration dem erwarteten Zustand entspricht | Adopting | Gegenüber manueller Prüfung bevorzugen, sobald die tatsächliche Zuverlässigkeit der automatisierten Validierung verifiziert ist. |

Ein Team akzeptiert einen produktiven Slot-Swap erst, wenn die Slot-spezifische Markierung aller kritischen Einstellungen nachweislich geprüft und die resultierende Konfiguration verifiziert ist.
