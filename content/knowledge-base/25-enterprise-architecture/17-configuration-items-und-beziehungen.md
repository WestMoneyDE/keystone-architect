---
{"id": "KB-0605", "title": "Configuration Items und Beziehungen", "domain": "25", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0604", "concepts": ["ServiceNow CMDB"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Configuration Items mit eindeutiger Identität, korrekter Klassenzuordnung und definiertem Lebenszyklusstatus anhand etablierter Praxis korrekt modellieren und von Assets und Services unterscheiden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie CI-Identität über Lebenszyklusänderungen hinweg stabil bleibt und wie Assets, Services und Configuration Items als unterschiedliche, aber verbundene Konzepte konsistent modelliert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine CI-Identität bei einem Lebenszyklusübergang (etwa Hardware-Austausch) fälschlich verändert statt konsistent fortgeführt wird, und die daraus resultierende Verfälschung der Beziehungshistorie einordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für CI-Identität, Klassenmodellierung und Lebenszyklusverwaltung festlegen, die eine konsistente Unterscheidung von Assets, Services und Configuration Items sicherstellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Implementierung der CI-Identitätsverwaltung in einem bestimmten CMDB-Produkt ist Vertiefung.", "rationale": "Kern ist das konzeptionelle Verständnis von CI-Identität, Klassen und Lebenszyklen, nicht die produktspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0605-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung stabiler CI-Identität über einen Lebenszyklusübergang, kein produktives CMDB-System verwendet", "evidence": "Ein lokales Skript simuliert einen Hardware-Austausch (ein physischer Server wird durch einen neuen ersetzt) und zeigt, wie eine fälschlich fortgeführte CI-Identität die Beziehungshistorie verfälscht, während eine korrekt neu vergebene CI-Identität für den neuen Server die Historie konsistent hält.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales CMDB-System."}]}
---
# Configuration Items und Beziehungen

> **Ziel:** Ein Configuration Item (CI) benötigt eine eindeutige, über seinen gesamten Lebenszyklus stabile **Identität** — die bereits in [KB-0604](16-servicenow-cmdb.md) behandelte Reconciliation kann nur dann tatsächlich funktionieren, wenn diese Identität konsistent bleibt und nicht bei jeder Lebenszyklusänderung (etwa einem Hardware-Austausch) neu interpretiert wird. Der zentrale Punkt dieses Kapitels ist die explizite Unterscheidung dreier verwandter, aber unterschiedlicher Konzepte: Ein **Asset** ist eine finanziell/vertraglich relevante Einheit (etwa ein gekauftes Gerät mit Abschreibungswert), ein **Service** ist eine für Nutzer sichtbare, geschäftlich bedeutsame Funktion (etwa "E-Mail-Dienst"), und ein **Configuration Item** ist eine technische Einheit, die für das Konfigurationsmanagement relevant ist (etwa ein einzelner Server) — diese drei Konzepte überlappen sich häufig, sind aber konzeptionell unterschiedlich, und eine Vermischung führt zu inkonsistenten, unzuverlässigen Beziehungsmodellen.

## Zweck, Mental Model und Dependencies

Die Stabilität der CI-Identität über Lebenszyklusänderungen hinweg ist entscheidend für die Verlässlichkeit der Beziehungshistorie: Wenn ein physischer Server ausgetauscht wird (etwa im Rahmen einer Hardware-Erneuerung), stellt sich die zentrale Frage, ob dies als "derselbe CI mit neuer Hardware" oder als "neuer CI, der den alten ersetzt" modelliert werden sollte — die korrekte Antwort hängt davon ab, was tatsächlich nachverfolgt werden soll: Wird die CI-Identität fälschlich fortgeführt, obwohl es sich tatsächlich um eine völlig neue physische Einheit handelt, vermischt die Historie dieses CI Ereignisse, die tatsächlich zu zwei unterschiedlichen physischen Objekten gehören, was rückwirkende Analysen (etwa "wie oft ist dieser spezifische Server ausgefallen") verfälscht. Die Unterscheidung von Asset, Service und Configuration Item ist methodisch notwendig, weil jedes dieser Konzepte unterschiedliche Lebenszyklen und unterschiedliche Verantwortlichkeiten hat: Ein Asset existiert vom Kauf bis zur Ausmusterung und wird primär vom Finanz-/Einkaufsbereich verwaltet; ein Service existiert, solange die entsprechende Geschäftsfunktion angeboten wird, und wird primär vom fachlich verantwortlichen Eigentümer verwaltet (siehe die bereits in [KB-0591](03-application-architecture-im-unternehmen.md) behandelte Anwendungsverantwortung); ein Configuration Item existiert, solange die technische Einheit im Konfigurationsmanagement relevant ist, und wird primär vom technischen Betrieb verwaltet — ein einzelner physischer Server kann gleichzeitig ein Asset (mit Abschreibungswert), Teil eines oder mehrerer Configuration Items (mit technischen Beziehungen) und indirekt Teil eines Service (der auf ihm läuft) sein, ohne dass diese drei Sichten deckungsgleich sein müssen. Konsistente Beziehungsmodellierung bedeutet, diese drei Sichten explizit zu verknüpfen (etwa "Service E-Mail läuft auf CI Server-042, der Asset-ID A-1234 entspricht"), statt sie zu vermischen oder eine für alle drei Zwecke zu verwenden.

~~~text
Configuration Item (CI): needs unique, LIFECYCLE-STABLE identity
  reconciliation (KB-0604) only actually works if this identity stays consistent,
  not reinterpreted at every lifecycle change (e.g. hardware swap)
KEY POINT: explicit distinction of THREE related-but-different concepts
  ASSET: financially/contractually relevant unit (purchased device w/ depreciation value)
  SERVICE: user-visible, business-meaningful function ("email service")
  CONFIGURATION ITEM: technical unit relevant for config management (individual server)
  these three OFTEN OVERLAP but are conceptually DIFFERENT
  mixing them -> inconsistent, unreliable relationship models
CI IDENTITY STABILITY across lifecycle changes decisive for relationship history reliability
  physical server replaced (hardware refresh): central question -- model as
    "same CI, new hardware" or "new CI replacing old one"?
  correct answer depends on what should actually be tracked
  CI identity wrongly continued despite being an entirely new physical unit
    -> mixes history of this CI with events actually belonging to two different physical objects
    -> falsifies retrospective analysis (e.g. "how often has THIS specific server failed")
ASSET/SERVICE/CI distinction methodically necessary: each has DIFFERENT lifecycle + different ownership
  Asset: exists purchase-to-disposal, primarily managed by finance/procurement
  Service: exists as long as business function offered, primarily managed by fachlich owner (KB-0591)
  CI: exists as long as technical unit relevant for config mgmt, primarily managed by technical ops
  single physical server CAN simultaneously be: an asset (depreciation value),
    part of one/more CIs (technical relationships), indirectly part of a service (runs on it)
    WITHOUT these three views needing to coincide
CONSISTENT relationship modeling = explicitly LINK these three views
  ("email service runs on CI server-042, which corresponds to asset ID A-1234")
  instead of mixing them or using one concept for all three purposes
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| CI-Identität | eindeutige, lebenszyklusstabile Kennung | Grundlage verlässlicher Beziehungshistorie |
| Asset | finanziell/vertraglich relevante Einheit | eigener Lebenszyklus, primär Finanz-/Einkaufsverantwortung |
| Service | geschäftlich bedeutsame, nutzersichtbare Funktion | eigener Lebenszyklus, primär fachliche Verantwortung |
| Configuration Item | technische Einheit für Konfigurationsmanagement | eigener Lebenszyklus, primär technische Betriebsverantwortung |

Implementierung: Jedes Configuration Item erhält eine eindeutige, über seinen Lebenszyklus stabile Identität, die bei Lebenszyklusänderungen explizit als "fortgeführt" oder "ersetzt" entschieden wird. Assets, Services und Configuration Items werden als unterschiedliche, aber explizit verknüpfte Konzepte modelliert, statt vermischt oder deckungsgleich behandelt zu werden.

## Scalability, Reliability, Security und Observability

Configuration-Item-Modellierung skaliert die Verlässlichkeit von Beziehungsanalysen proportional zur Stabilität der CI-Identität und zur konsequenten Trennung von Asset-, Service- und CI-Sichten; die Reliability-Grenze liegt darin, dass eine fälschlich fortgeführte CI-Identität die Beziehungshistorie verfälscht und retrospektive Analysen unzuverlässig macht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine retrospektive Analyse zu einem Server zeigt widersprüchliche oder unplausible Historie | die CI-Identität wurde bei einem Hardware-Austausch fälschlich fortgeführt statt neu vergeben | den Lebenszyklusübergang auf korrekte Identitätsentscheidung (fortgeführt vs. ersetzt) prüfen |
| ein Asset-Wert und ein zugehöriges Configuration Item weichen unerwartet voneinander ab | Asset- und CI-Sicht wurden vermischt statt explizit verknüpft modelliert | die Asset-ID und die CI-Identität explizit getrennt, aber verknüpft modellieren |
| ein Service-Ausfall lässt sich nicht eindeutig auf ein konkretes Configuration Item zurückführen | die Verknüpfung zwischen Service- und CI-Sicht ist unvollständig | die Beziehung zwischen Service und den tatsächlich zugrunde liegenden CIs explizit dokumentieren |

Security: Eine korrekte CI-Identität und -Beziehung ist Voraussetzung für verlässliche, sicherheitsrelevante Impactanalysen (etwa welche Services von einem kompromittierten Server tatsächlich betroffen sind). Observability: Die tatsächliche Konsistenz zwischen Asset-, Service- und CI-Zahlen ist ein zentrales Signal zur Bewertung, ob die drei Sichten tatsächlich korrekt verknüpft statt vermischt sind.

## Trade-offs und Entscheidungen

**Staff** modelliert ein gegebenes Configuration Item mit korrekter Identität und Klassenzuordnung. **Principal** entwirft die vollständige Asset-Service-CI-Verknüpfungsstruktur für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für CI-Identität und die Unterscheidung von Asset, Service und Configuration Item fest.

Anti-Patterns: eine CI-Identität bei einem Lebenszyklusübergang (Hardware-Austausch) unreflektiert fortführen, obwohl es sich um eine neue physische Einheit handelt; Asset, Service und Configuration Item als dasselbe Konzept behandeln, statt sie explizit zu unterscheiden und zu verknüpfen; Beziehungen zwischen Services und ihren zugrunde liegenden CIs unvollständig oder inkonsistent dokumentieren.

## Production Checklist

- [ ] Jedes Configuration Item hat eine eindeutige, über seinen Lebenszyklus stabile Identität.
- [ ] Lebenszyklusübergänge (Hardware-Austausch) entscheiden explizit zwischen "fortgeführt" und "ersetzt".
- [ ] Asset, Service und Configuration Item sind als unterschiedliche, aber explizit verknüpfte Konzepte modelliert.
- [ ] Beziehungen zwischen Services und den zugrunde liegenden CIs sind vollständig dokumentiert.

## Interviewfragen

### 1. Was unterscheidet ein Asset, einen Service und ein Configuration Item konzeptionell?

**Antwort:** Ein Asset ist eine finanziell/vertraglich relevante Einheit, ein Service eine geschäftlich bedeutsame, nutzersichtbare Funktion, und ein Configuration Item eine technische Einheit für das Konfigurationsmanagement — sie überlappen sich häufig, haben aber unterschiedliche Lebenszyklen und Verantwortlichkeiten.

### 2. Warum ist eine stabile CI-Identität über Lebenszyklusänderungen hinweg wichtig?

**Antwort:** Weil eine fälschlich fortgeführte Identität bei einem tatsächlichen Austausch der physischen Einheit die Beziehungshistorie verfälscht und retrospektive Analysen unzuverlässig macht.

### 3. Was ist die zentrale Frage bei einem Hardware-Austausch für die CI-Modellierung?

**Antwort:** Ob dies als "derselbe CI mit neuer Hardware" oder als "neuer CI, der den alten ersetzt" modelliert werden sollte, abhängig davon, was tatsächlich nachverfolgt werden soll.

### 4. Können ein Asset, ein Service und ein Configuration Item sich auf dasselbe physische Objekt beziehen, ohne identisch zu sein?

**Antwort:** Ja, ein einzelner physischer Server kann gleichzeitig ein Asset, Teil eines oder mehrerer Configuration Items und indirekt Teil eines Service sein, ohne dass diese drei Sichten deckungsgleich sein müssen.

### 5. Wie gehst du vor, wenn eine retrospektive Analyse zu einem Server widersprüchliche oder unplausible Historie zeigt?

**Antwort:** Ich prüfe, ob die CI-Identität bei einem Lebenszyklusübergang (etwa Hardware-Austausch) fälschlich fortgeführt statt korrekt neu vergeben wurde.

### 6. Widersprüchliche Anforderung: Das Finanzteam will Assets nach Abschreibungslogik verwalten UND der technische Betrieb will Configuration Items nach tatsächlicher, technischer Lebensdauer verwalten — wie gehst du vor?

**Antwort:** Ich würde Asset- und CI-Identität explizit getrennt modellieren, mit einer expliziten Verknüpfungsbeziehung zwischen ihnen, sodass jede Seite ihre eigene, sachgerechte Lebenszykluslogik verfolgen kann, statt eine gemeinsame Identität zu erzwingen, die weder der Abschreibungslogik noch der technischen Lebensdauer gerecht wird.

## Praktische Labs

~~~python
# Local, deterministic simulation of CI identity continuity vs replacement on hardware swap (executed locally, no real CMDB):

def handle_hardware_swap(old_ci_id, is_same_physical_unit):
    if is_same_physical_unit:
        return {"ci_id": old_ci_id, "action": "continued", "history": "preserved"}
    return {"ci_id": f"{old_ci_id}-NEW", "action": "replaced", "old_ci_archived": old_ci_id}

print(handle_hardware_swap("server-042", is_same_physical_unit=True))   # e.g. RAM upgrade
print(handle_hardware_swap("server-042", is_same_physical_unit=False))  # full physical replacement
~~~

## Dependencies, Cross-References und Quellen

1. ServiceNow-Dokumentation: [Configuration Item Lifecycle Management](https://www.servicenow.com/docs/bundle/xanadu-it-service-management/page/product/configuration-management/concept/c_ITILConfigurationManagement.html), abgerufen 2026-09-18.
2. ITIL 4-Referenzmodell: [ITIL Asset and Configuration Management Practice](https://www.axelos.com/resource-hub/practice/itil-asset-management-itil-4-practice-guide), abgerufen 2026-09-18.

ServiceNow CMDB ist kanonisch in [KB-0604](16-servicenow-cmdb.md) behandelt; Anwendungsverantwortung in [KB-0591](03-application-architecture-im-unternehmen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, cloud-native Ressourcenkennungen (etwa Cloud-Provider-Ressourcen-IDs) als potenzielle, direkt übernehmbare CI-Identität statt manuell vergebener Identitäten | Evaluating | Als mögliche, konsistente Identitätsquelle für Cloud-Ressourcen prüfen, jedoch weiterhin explizit entscheiden, ob ein Ressourcenwechsel (etwa Instanzaustausch) als CI-Fortführung oder -Ersatz zu behandeln ist. |

Ein Team akzeptiert eine Configuration-Item-Modellierung erst, wenn CI-Identität nachweislich lebenszyklusstabil ist und Asset-, Service- und CI-Sichten explizit getrennt, aber konsistent verknüpft modelliert sind.
