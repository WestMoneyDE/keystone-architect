---
{"id": "KB-0147", "title": "Strangler Pattern und Ablösung", "domain": "06", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0146", "concepts": ["Sichere Schritte"], "needed_for": "both"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Routing-Fassade lokal implementieren, die schrittweise Traffic vom Altsystem auf ein neues System umleitet.", "rationale": "Kein reales Legacy-System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Eine inkrementelle Ablösung mit Fassade, paralleler Verarbeitung und definierten Abschaltkriterien statt eines Komplett-Rewrites entwerfen.", "rationale": "Ein vollständiger Neubau vor der Ablösung birgt hohes Risiko und liefert lange keinen Geschäftswert."}, "STAFF-TARGET": {"active": true, "scope": "Datendivergenz zwischen Alt- und Neusystem während einer parallelen Betriebsphase diagnostizieren.", "rationale": "Das ist ein zentrales Risiko jeder inkrementellen Ablösung."}, "CHIEF-TARGET": {"active": true, "scope": "Das Strangler Pattern als Standardstrategie für Legacy-Modernisierung gegenüber riskanten Komplett-Rewrites positionieren.", "rationale": "Komplett-Rewrites scheitern häufig; inkrementelle Ablösung liefert früher Wert und ist umkehrbar."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Feature-Flag-gesteuertes Traffic-Shifting und Shadow-Traffic-Vergleich im Detail sind Vertiefung.", "rationale": "Kern ist Fassade, schrittweise Verlagerung und klares Abschaltkriterium."}}, "lab_validation": [{"lab_id": "KB-0147-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für eine Routing-Fassade mit schrittweiser Traffic-Verlagerung", "evidence": "Die Fassade leitet 20% des Traffics an das neue System und 80% an das Altsystem, mit der Möglichkeit, den Anteil bei Problemen sofort zurückzusetzen.", "limitations": "Kein reales Legacy-System, keine Produktion."}]}
---
# Strangler Pattern und Ablösung

> **Ziel:** Das Strangler Pattern ersetzt ein Legacy-System schrittweise durch ein neues, statt es in einem riskanten „Big Bang" komplett neu zu schreiben. Eine Fassade routet Anfragen zwischen Alt- und Neusystem, Funktionalität wird stückweise migriert, und das Altsystem wird erst nach vollständiger, verifizierter Übernahme und definierten Abschaltkriterien abgeschaltet.

## Zweck, Mental Model und Dependencies

Ein Komplett-Rewrite liefert oft monatelang oder jahrelang keinen Geschäftswert und trägt das Risiko, am Ende doch nicht alle impliziten Anforderungen des Altsystems korrekt abzubilden. Das Strangler Pattern (benannt nach Würgefeigen, die einen Wirtsbaum langsam umwachsen) vermeidet das: eine Fassade vor dem Altsystem leitet Anfragen zunächst vollständig an das Altsystem, dann schrittweise, Funktion für Funktion, an das neue System — bis das Altsystem funktional vollständig „umwachsen" und sicher abschaltbar ist. Dies baut auf denselben sicheren, reversiblen Schritten auf wie [KB-0146](18-architekturrefactoring-und-sichere-schritte.md). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0146](18-architekturrefactoring-und-sichere-schritte.md).

~~~text
Phase 1: Facade -> 100% Legacy System
Phase 2: Facade -> route Feature A to New System, rest -> Legacy System (parallel operation)
Phase 3: Facade -> route Feature A+B to New System ... incrementally
Phase N: Facade -> 100% New System -> Legacy System decommissioned (only after verified equivalence)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Fassade/Router | leitet Anfragen granular nach Funktion/Traffic-Anteil? | grobe Fassade erlaubt keine schrittweise, kontrollierte Migration |
| Parallelbetrieb | wie wird Datenkonsistenz zwischen Alt- und Neusystem sichergestellt? | Datendivergenz zwischen beiden Systemen während der Übergangsphase |
| Migrationsreihenfolge | welche Funktion zuerst, nach welchem Kriterium? | riskanteste/komplexeste Funktion zuerst statt schrittweise Erfahrung aufzubauen |
| Abschaltkriterium | wann gilt eine Funktion als sicher vollständig migriert? | Altsystem wird ohne ausreichenden Nachweis abgeschaltet |

Implementierung: die Fassade beginnt mit granularem Routing (pro Funktion oder Traffic-Prozentsatz), sodass eine problematische Migration schnell zurückgesetzt werden kann. Für Funktionen mit gemeinsamen Daten wird eine explizite Synchronisationsstrategie zwischen Alt- und Neusystem definiert (z. B. Dual-Write mit Verifikation), ähnlich der Migrationsstrategie bei Sharding ([KB-0107](../05-distributed-systems/07-sharding-und-mandantenplatzierung.md)). Migrationsreihenfolge beginnt typischerweise mit weniger riskanten, gut abgrenzbaren Funktionen, um Erfahrung mit dem Prozess zu sammeln, bevor komplexere Kernfunktionen migriert werden. Ein Abschaltkriterium (z. B. „X Tage ohne Divergenz, Y% Traffic-Anteil erfolgreich") wird vor der Migration definiert, nicht nachträglich verhandelt.

## Scalability, Reliability, Security und Observability

Das Strangler Pattern skaliert über beliebig lange Migrationszeiträume, da jede Phase unabhängig vom Gesamtprojekt abgeschlossen und verifiziert werden kann. Reliability-Grenze: der Parallelbetrieb von Alt- und Neusystem ist selbst eine Komplexitätsquelle — Datendivergenz zwischen beiden Systemen während der Übergangsphase muss aktiv überwacht werden, sonst wird ein stiller Datenfehler erst nach der Abschaltung des Altsystems bemerkt, wenn kein Vergleich mehr möglich ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Alt- und Neusystem liefern unterschiedliche Ergebnisse für dieselbe Anfrage | Datendivergenz während des Parallelbetriebs | Shadow-Traffic-Vergleich zwischen beiden Systemen für identische Anfragen durchführen |
| Migration einer Funktion dauert viel länger als geplant | zu komplexe/riskante Funktion zu früh in der Reihenfolge migriert | Migrationsreihenfolge gegen tatsächliche Komplexität/Risiko neu bewerten |
| Altsystem wird abgeschaltet, danach treten Fehler auf | Abschaltkriterium war nicht ausreichend streng oder nicht vollständig erfüllt | Abschaltentscheidung gegen definiertes Kriterium und tatsächliche Nachweislage prüfen |
| Fassade wird selbst zum Flaschenhals | Routing-Logik zu komplex oder nicht skalierbar gestaltet | Latenz/Durchsatz der Fassade separat von den dahinterliegenden Systemen messen |

Security: während des Parallelbetriebs müssen Berechtigungsprüfungen zwischen Alt- und Neusystem konsistent bleiben, sonst kann ein Nutzer über das eine System Zugriff erhalten, der über das andere korrekt verweigert würde. Observability: kontinuierlicher Vergleich der Ergebnisse zwischen Alt- und Neusystem (Shadow Traffic) ist das wichtigste Werkzeug, um Divergenz vor der endgültigen Abschaltung zu erkennen.

## Trade-offs und Entscheidungen

**Staff** überwacht aktiv Datendivergenz zwischen Alt- und Neusystem während jeder Parallelbetriebsphase. **Principal** definiert Migrationsreihenfolge nach Risiko/Komplexität und ein klares, vorab dokumentiertes Abschaltkriterium pro Funktion. **Chief** positioniert das Strangler Pattern als Standardstrategie gegenüber riskanten Komplett-Rewrites für Legacy-Modernisierung.

Anti-Patterns: ein Komplett-Rewrite ohne inkrementelle Migration und ohne Zwischenwert-Lieferung; Altsystem ohne definiertes, erfülltes Abschaltkriterium abschalten; fehlende Überwachung der Datendivergenz während des Parallelbetriebs.

## Production Checklist

- [ ] Fassade ermöglicht granulares Routing pro Funktion/Traffic-Anteil.
- [ ] Datensynchronisations-/Vergleichsstrategie für den Parallelbetrieb definiert.
- [ ] Migrationsreihenfolge nach Risiko/Komplexität begründet.
- [ ] Abschaltkriterium pro Funktion vor Migration definiert und vor Abschaltung nachweislich erfüllt.

## Interviewfragen

### 1. Warum ist das Strangler Pattern gegenüber einem Komplett-Rewrite oft vorzuziehen?

**Antwort:** Es liefert inkrementell Geschäftswert statt monatelang keinen, bleibt jederzeit umkehrbar auf Funktionsebene und reduziert das Risiko, am Ende implizite Anforderungen des Altsystems zu übersehen.

### 2. Was ist die Rolle der Fassade im Strangler Pattern?

**Antwort:** Sie routet Anfragen granular zwischen Alt- und Neusystem und ermöglicht so eine kontrollierte, schrittweise Verlagerung von Funktionalität statt eines abrupten Komplettwechsels.

### 3. Was ist Shadow Traffic und wozu dient es?

**Antwort:** Identische Anfragen werden an Alt- und Neusystem gesendet, ohne dass das Ergebnis des Neusystems bereits produktiv genutzt wird, um Divergenz zwischen beiden Systemen risikofrei zu erkennen, bevor echter Traffic umgestellt wird.

### 4. Wie wählst du die Reihenfolge, in der Funktionen migriert werden?

**Antwort:** Typischerweise beginnend mit weniger riskanten, gut abgrenzbaren Funktionen, um Erfahrung mit dem Migrationsprozess zu sammeln, bevor komplexere Kernfunktionen migriert werden.

### 5. Was gehört in ein Abschaltkriterium für das Altsystem?

**Antwort:** Konkrete, messbare Nachweise wie eine definierte Zeitspanne ohne Datendivergenz und ein erfolgreicher Traffic-Anteil über das Neusystem, vor Beginn der Migration festgelegt, nicht nachträglich verhandelt.

### 6. Widersprüchliche Anforderung: Management will das Legacy-System schnell komplett loswerden UND null Risiko während der Migration — wie gehst du vor?

**Antwort:** Ich würde erklären, dass „schnell komplett" und „null Risiko" bei einer Legacy-Ablösung im Widerspruch stehen; das Strangler Pattern bietet den besten verfügbaren Kompromiss — kontrollierte, messbare Geschwindigkeit mit begrenztem Risiko pro Schritt, statt eines schnellen, aber riskanten Komplettwechsels.

## Praktische Labs

~~~python
import random

random.seed(1)

def facade(request, new_system_traffic_share):
    if random.random() < new_system_traffic_share:
        return "new_system_result"
    return "legacy_system_result"

results = [facade(r, new_system_traffic_share=0.2) for r in range(1000)]
new_system_share = results.count("new_system_result") / len(results)
assert 0.15 < new_system_share < 0.25
print(f"Facade routed approximately {new_system_share:.0%} of traffic to the new system, as configured.")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html), martinfowler.com, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Traffic-Shifting-/Feature-Flag-Tooling-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Feature-Flag-Plattformen mit granularem, prozentualem Traffic-Shifting | Established | Rollback-Geschwindigkeit und Granularität gegen tatsächlichen Migrationsbedarf prüfen. |
| Automatisierter Shadow-Traffic-Vergleich mit Diff-Reporting | Adopting | Abdeckung und Falsch-Positiv-Rate des automatisierten Vergleichs validieren. |

Ein Team akzeptiert eine Strangler-Pattern-Migration erst, wenn Fassaden-Routing, Datendivergenz-Überwachung und ein erfülltes Abschaltkriterium für jede migrierte Funktion nachgewiesen sind.
