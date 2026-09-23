---
{"id": "KB-0570", "title": "OpenTelemetry", "domain": "24", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0569", "concepts": ["Distributed Tracing"], "needed_for": "understanding"}, {"id": "KB-0567", "concepts": ["Metriken und Zeitreihen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "OpenTelemetry-SDKs, Collector und Exporter anhand offizieller Dokumentation kombinieren und semantische Konventionen für konsistente Instrumentierung korrekt nutzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie eine herstellerneutrale OpenTelemetry-Instrumentierungsschicht die Kopplung an ein spezifisches Observability-Backend vermeidet, statt Anwendungscode direkt an ein proprietäres Format zu binden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine kostspielige, aufwendige Migration zwischen Observability-Backends auf eine fehlende OpenTelemetry-Abstraktionsschicht zurückführen können, bei der Anwendungscode direkt proprietäre SDK-Aufrufe eines einzelnen Anbieters nutzt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für OpenTelemetry als herstellerneutrale Instrumentierungsgrundlage festlegen, um zukünftige Backend-Wechsel ohne Anwendungscode-Änderungen zu ermöglichen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer OpenTelemetry-Collector-Prozessoren im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der SDK-Collector-Exporter-Architektur und semantischer Konventionen als Entkopplungsmechanismus, nicht die Collector-Prozessor-Interna."}}, "lab_validation": [{"lab_id": "KB-0570-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller OpenTelemetry-Dokumentation zu SDK, Collector und Exporter-Architektur, kein aktives Observability-System verwendet", "evidence": "Anhand offizieller OpenTelemetry-Dokumentation wird nachvollzogen, wie Anwendungscode gegen die herstellerneutrale OpenTelemetry-API statt gegen ein proprietäres SDK eines spezifischen Observability-Anbieters instrumentiert wird, wie der Collector als vermittelnde Komponente Telemetriedaten empfängt, verarbeitet und über austauschbare Exporter an ein beliebiges Backend weiterleitet, und wie semantische Konventionen konsistente Feldbenennung über verschiedene Instrumentierungsquellen hinweg sicherstellen.", "limitations": "Kein aktives Observability-System verwendet, keine reale Instrumentierung durchgeführt."}]}
---
# OpenTelemetry

> **Ziel:** OpenTelemetry vereinheitlicht die bereits behandelten Signaltypen — Metriken (siehe [KB-0567](03-metriken-und-zeitreihen.md)) und Traces (siehe [KB-0569](05-distributed-tracing.md)) — über eine **herstellerneutrale** Architektur aus drei Komponenten: **SDKs** (in Anwendungscode eingebettete Bibliotheken, die Telemetriedaten anhand der OpenTelemetry-API statt eines proprietären Formats erzeugen), einem **Collector** (eine vermittelnde Komponente, die Telemetriedaten empfängt, verarbeitet — etwa filtert, anreichert, oder aggregiert — und weiterleitet), und **Exportern** (austauschbare Module, die Telemetriedaten in das spezifische Format eines beliebigen Ziel-Backends übersetzen). Der zentrale Punkt dieses Kapitels ist, dass eine kostspielige, aufwendige Migration zwischen Observability-Backends typischerweise nicht auf eine grundsätzlich fehlende Migrationsmöglichkeit zurückzuführen ist, sondern auf eine **fehlende Abstraktionsschicht** — Anwendungscode, der direkt gegen das proprietäre SDK eines spezifischen Observability-Anbieters instrumentiert wurde, erfordert bei einem Anbieterwechsel eine vollständige Neuinstrumentierung des gesamten Codes, während Code, der gegen die herstellerneutrale OpenTelemetry-API instrumentiert wurde, lediglich den Exporter austauschen muss, ohne die Instrumentierung selbst zu verändern.

## Zweck, Mental Model und Dependencies

Das grundlegende Problem, das OpenTelemetry löst, ist die historisch übliche, enge Kopplung zwischen Anwendungscode und einem spezifischen Observability-Anbieter: Wird Anwendungscode direkt mit dem proprietären SDK eines bestimmten Anbieters instrumentiert (etwa direkte Aufrufe einer anbieterspezifischen Tracing-Bibliothek), ist ein späterer Wechsel zu einem anderen Anbieter (etwa aus Kosten-, Funktions-, oder strategischen Gründen) mit einer vollständigen Neuinstrumentierung des gesamten, betroffenen Codes verbunden — jede einzelne Stelle, an der das proprietäre SDK genutzt wird, muss identifiziert und auf das neue SDK umgestellt werden, was bei größeren Codebasen einen erheblichen, oft unterschätzten Migrationsaufwand darstellt. OpenTelemetry entkoppelt diese beiden Aspekte strukturell: Die SDKs, die in den Anwendungscode eingebettet werden, implementieren eine standardisierte, herstellerneutrale API — der Anwendungscode "weiß" nicht, welches Backend die erzeugten Telemetriedaten letztlich konsumiert. Der Collector fungiert als zentrale, vermittelnde Instanz, die Telemetriedaten von allen instrumentierten Anwendungen empfängt und vor der Weiterleitung verarbeiten kann (etwa das Entfernen sensibler Felder, die bereits bei strukturierten Logs behandelte Notwendigkeit, siehe [KB-0568](04-strukturierte-logs.md), oder das Anreichern mit zusätzlichem Kontext). Exporter sind die austauschbare, letzte Komponente dieser Kette — ein Exporter übersetzt die vom Collector verarbeiteten, standardisierten Telemetriedaten in das spezifische Format des tatsächlich genutzten Backends; ein Wechsel des Backends erfordert lediglich den Austausch dieses Exporters (eine Konfigurationsänderung im Collector), ohne dass der instrumentierte Anwendungscode selbst geändert werden muss. Semantische Konventionen ergänzen diese strukturelle Entkopplung um eine inhaltliche Konsistenz: Sie definieren standardisierte Namen für gebräuchliche Attribute (etwa `http.status_code` statt einer beliebigen, anwendungsspezifischen Benennung), sodass Telemetriedaten aus unterschiedlichen Anwendungen, Programmiersprachen, oder sogar Organisationen konsistent interpretiert und ausgewertet werden können, ohne dass jede Analyse zunächst anwendungsspezifische Feldbenennungen berücksichtigen müsste.

~~~text
OpenTelemetry: unifies Metrics (KB-0567) + Traces (KB-0569) under VENDOR-NEUTRAL architecture
  SDK: embedded in app code, implements STANDARDIZED, vendor-neutral API
    -> app code doesn't "know" which backend ultimately consumes the telemetry
  Collector: central, mediating component
    receives telemetry from all instrumented apps -> processes (filter sensitive fields, enrich context)
    before forwarding
  Exporter: SWAPPABLE final component -> translates standardized data into TARGET backend's specific format
    -> backend switch = swap the exporter (config change in collector), NOT re-instrument app code
CRITICAL POINT: expensive backend migration usually != fundamentally impossible to migrate
  -> usually = MISSING abstraction layer
     app code instrumented DIRECTLY against a proprietary vendor SDK
     -> vendor switch = COMPLETE re-instrumentation of ALL affected code
     app code instrumented against vendor-neutral OpenTelemetry API
     -> vendor switch = swap exporter only, instrumentation unchanged
Semantic Conventions: standardized attribute names (e.g. http.status_code)
  -> consistent interpretation of telemetry across different apps/languages/orgs
     without each analysis needing to account for app-specific field naming
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| SDK | herstellerneutrale Instrumentierungs-API im Anwendungscode | entkoppelt Anwendung von spezifischem Backend |
| Collector | zentrale Verarbeitung (Filterung, Anreicherung) vor Weiterleitung | vermittelnde Schicht zwischen SDKs und Exportern |
| Exporter | austauschbare Übersetzung in Backend-spezifisches Format | Backend-Wechsel ohne Anwendungscode-Änderung |
| Semantische Konventionen | standardisierte Attributbenennung | konsistente Auswertbarkeit über Quellen hinweg |

Implementierung: Anwendungscode wird konsequent gegen die herstellerneutrale OpenTelemetry-API statt gegen ein proprietäres, anbieterspezifisches SDK instrumentiert. Sensible Feldfilterung und Kontextanreicherung erfolgen zentral im Collector, statt in jeder einzelnen Anwendung separat implementiert zu werden. Semantische Konventionen werden konsequent für gebräuchliche Attribute genutzt, statt anwendungsspezifische, inkonsistente Benennungen zu verwenden.

## Scalability, Reliability, Security und Observability

OpenTelemetry skaliert die tatsächliche Backend-Unabhängigkeit proportional zur konsequenten Nutzung der herstellerneutralen API statt proprietärer SDKs; die Reliability-Grenze liegt darin, dass direkt anbieterspezifisch instrumentierter Code proportional zu seinem Umfang eine spätere Backend-Migration erheblich verteuert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine geplante Migration zu einem anderen Observability-Backend erfordert unerwartet umfangreiche Codeänderungen | Anwendungscode ist direkt gegen ein proprietäres, anbieterspezifisches SDK statt die OpenTelemetry-API instrumentiert | die betroffene Instrumentierung auf die herstellerneutrale OpenTelemetry-API umstellen |
| Telemetriedaten aus verschiedenen Anwendungen sind schwer gemeinsam auszuwerten | inkonsistente, anwendungsspezifische Feldbenennungen statt semantischer Konventionen werden genutzt | semantische Konventionen konsequent für gebräuchliche Attribute einführen |
| sensible Daten gelangen unbeabsichtigt in Telemetriedaten | keine zentrale Filterung im Collector, jede Anwendung müsste dies separat implementieren | eine zentrale Filterregel im Collector für sensible Felder einrichten |

Security: Sensible Feldfilterung sollte zentral im Collector erfolgen, statt sich auf konsistente, aber fehleranfällige Einzelimplementierung in jeder Anwendung zu verlassen. Observability: Die tatsächliche Abdeckung der OpenTelemetry-Instrumentierung über alle Anwendungen hinweg, sowie die Konsistenz genutzter semantischer Konventionen, sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** instrumentiert einen Dienst korrekt gegen die OpenTelemetry-API. **Principal** entwirft die vollständige Collector-Architektur mit zentraler Verarbeitung und austauschbaren Exportern für ein System. **Chief** legt unternehmensweite Standards für herstellerneutrale Instrumentierung statt proprietärer SDK-Kopplung fest.

Anti-Patterns: Anwendungscode direkt gegen ein proprietäres, anbieterspezifisches SDK statt die OpenTelemetry-API instrumentieren; sensible Feldfilterung in jeder Anwendung separat statt zentral im Collector implementieren; anwendungsspezifische, inkonsistente Attributbenennungen statt semantischer Konventionen nutzen.

## Production Checklist

- [ ] Anwendungscode ist konsequent gegen die herstellerneutrale OpenTelemetry-API instrumentiert.
- [ ] Sensible Feldfilterung erfolgt zentral im Collector.
- [ ] Semantische Konventionen werden konsequent für gebräuchliche Attribute genutzt.
- [ ] Ein Backend-Wechsel ist ausschließlich über Exporter-Konfiguration, ohne Anwendungscode-Änderung, möglich.

## Interviewfragen

### 1. Aus welchen drei Komponenten besteht die OpenTelemetry-Architektur?

**Antwort:** SDK (in Anwendungscode eingebettete, herstellerneutrale Instrumentierungsbibliothek), Collector (zentrale Verarbeitungsinstanz), und Exporter (austauschbare Übersetzung in Backend-spezifisches Format).

### 2. Warum ist eine direkte Instrumentierung gegen ein proprietäres SDK riskant?

**Antwort:** Weil ein späterer Wechsel des Observability-Anbieters eine vollständige Neuinstrumentierung des gesamten betroffenen Anwendungscodes erfordert, statt lediglich eine Exporter-Konfiguration zu ändern.

### 3. Was leistet der OpenTelemetry-Collector?

**Antwort:** Er empfängt Telemetriedaten von allen instrumentierten Anwendungen, verarbeitet sie zentral (etwa Filterung sensibler Felder, Kontextanreicherung) und leitet sie über austauschbare Exporter an das tatsächliche Backend weiter.

### 4. Wofür dienen semantische Konventionen?

**Antwort:** Sie definieren standardisierte Namen für gebräuchliche Attribute, sodass Telemetriedaten aus unterschiedlichen Anwendungen oder Sprachen konsistent interpretiert und ausgewertet werden können.

### 5. Wie gehst du vor, wenn eine geplante Backend-Migration unerwartet umfangreiche Codeänderungen erfordert?

**Antwort:** Ich prüfe, ob der Anwendungscode direkt gegen ein proprietäres SDK statt die herstellerneutrale OpenTelemetry-API instrumentiert ist, da dies die häufigste Ursache für eine aufwendige, umfangreiche Migration ist.

### 6. Widersprüchliche Anforderung: Team will sofortigen Zugriff auf anbieterspezifische, fortgeschrittene Funktionen eines bestimmten Observability-Backends UND garantierte, zukünftige Backend-Unabhängigkeit — wie gehst du vor?

**Antwort:** Ich würde die grundlegende Instrumentierung konsequent gegen die herstellerneutrale OpenTelemetry-API vornehmen, während anbieterspezifische, fortgeschrittene Funktionen gezielt und explizit dokumentiert als optionale, isolierte Erweiterung genutzt werden, statt die gesamte Instrumentierung direkt an das proprietäre SDK zu koppeln — sofortiger Funktionszugriff und langfristige Unabhängigkeit lassen sich durch eine klare Trennung zwischen Kern-Instrumentierung und optionalen, anbieterspezifischen Erweiterungen vereinbaren.

## Praktische Labs

~~~python
# Conceptual illustration of backend-swap cost with vs without vendor-neutral abstraction (not executed against a real system):

def instrument_direct_vendor_sdk(app_code_lines):
    # every line using proprietary SDK must be found and rewritten on vendor switch
    return app_code_lines  # full re-instrumentation cost

def instrument_via_otel(app_code_lines, exporter_config_change=True):
    # only exporter config changes, app code instrumentation stays the same
    return 0 if exporter_config_change else app_code_lines  # near-zero re-instrumentation cost

app_code_lines_using_telemetry = 500

print(f"direct vendor SDK migration cost (lines to rewrite): {instrument_direct_vendor_sdk(app_code_lines_using_telemetry)}")
print(f"OpenTelemetry-based migration cost (lines to rewrite): {instrument_via_otel(app_code_lines_using_telemetry)}")
~~~

## Dependencies, Cross-References und Quellen

1. OpenTelemetry-Dokumentation: [OpenTelemetry Overview — Architecture](https://opentelemetry.io/docs/concepts/), abgerufen 2026-09-18.
2. OpenTelemetry-Dokumentation: [Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/), abgerufen 2026-09-18.

Distributed Tracing ist kanonisch in [KB-0569](05-distributed-tracing.md) behandelt; Metriken und Zeitreihen in [KB-0567](03-metriken-und-zeitreihen.md); Strukturierte Logs in [KB-0568](04-strukturierte-logs.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte OpenTelemetry-Unterstützung für Logs als dritten vollintegrierten Signaltyp neben Metriken und Traces, mit einheitlicher Korrelation aller drei Signale | Evaluating | Gegenüber separat verwalteten Logging-Systemen erst nach Prüfung der tatsächlichen Integrationsreife und des Migrationsaufwands für die konkrete Organisation bevorzugen. |

Ein Team akzeptiert eine OpenTelemetry-Implementierung erst, wenn Anwendungscode nachweislich gegen die herstellerneutrale API statt proprietärer SDKs instrumentiert ist und ein Backend-Wechsel ausschließlich über Exporter-Konfiguration möglich bleibt.
