---
{"id": "KB-0571", "title": "Prometheus", "domain": "24", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0570", "concepts": ["OpenTelemetry"], "needed_for": "understanding"}, {"id": "KB-0567", "concepts": ["Metriken und Zeitreihen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Prometheus-Scraping, Labels und PromQL-Abfragen anhand offizieller Dokumentation korrekt konfigurieren und Recording Rules für wiederkehrende, teure Abfragen einsetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Infrastruktur explizit gestalten, wie das Pull-basierte Scraping-Modell mit Service Discovery zusammenwirkt, und wann Federation für eine mehrstufige Metrikaggregation über mehrere Prometheus-Instanzen sinnvoll ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unentdeckte, kurzzeitig ausgefallene Metrikerfassung auf eine fehlgeschlagene Scrape-Anfrage innerhalb eines konfigurierten Scrape-Intervalls zurückführen können, statt einen grundsätzlichen Systemausfall zu vermuten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Prometheus-Skalierungsstrategien (Recording Rules, Federation, Kardinalitätsgrenzen) festlegen, die zuverlässige Metrikerfassung bei wachsender Infrastrukturgröße gewährleisten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Speicherimplementierung der Prometheus-Zeitreihendatenbank im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Pull-basiertem Scraping, PromQL, Recording Rules und Federation als Entscheidungsgrundlage, nicht die interne Speicherimplementierung."}}, "lab_validation": [{"lab_id": "KB-0571-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation eines fehlgeschlagenen Scrape-Vorgangs innerhalb eines Scrape-Intervalls, kein produktives Prometheus-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein einzelner, fehlgeschlagener Scrape-Versuch (etwa durch eine kurzzeitige Netzwerkunterbrechung) innerhalb eines regelmäßigen Scrape-Intervalls zu einer Datenlücke in der Zeitreihe führt, die beim nächsten erfolgreichen Scrape automatisch fortgesetzt wird, und zeigt damit, dass eine einzelne fehlgeschlagene Erfassung nicht notwendigerweise einen grundsätzlichen Systemausfall bedeutet.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Prometheus-System mit tatsächlicher Netzwerk- und Service-Discovery-Dynamik."}]}
---
# Prometheus

> **Ziel:** Prometheus erfasst Metriken (siehe die grundlegenden Metriktypen in [KB-0567](03-metriken-und-zeitreihen.md)) über ein **Pull-basiertes Scraping-Modell** — statt dass überwachte Systeme aktiv Metriken an einen zentralen Sammelpunkt senden (Push-Modell), fragt Prometheus in regelmäßigen Abständen (dem Scrape-Intervall) aktiv bei jedem bekannten, überwachten Ziel dessen aktuelle Metrikwerte ab. **Labels** ermöglichen die bereits in [KB-0567](03-metriken-und-zeitreihen.md) behandelte Aufschlüsselung von Metriken nach zusätzlichen Dimensionen, und **PromQL** ist die Abfragesprache, mit der diese Zeitreihendaten für Dashboards, Alarmierung und Ad-hoc-Analyse ausgewertet werden. Der zentrale Punkt dieses Kapitels ist, dass eine kurzzeitig ausgefallene Metrikerfassung nicht notwendigerweise einen grundsätzlichen Systemausfall bedeutet — das Pull-basierte Modell mit regelmäßigem Scrape-Intervall bedeutet, dass ein einzelner, fehlgeschlagener Scrape-Versuch (etwa durch eine kurzzeitige Netzwerkunterbrechung) lediglich zu einer einzelnen, kurzen Datenlücke in der betroffenen Zeitreihe führt, die beim nächsten, planmäßigen Scrape-Versuch automatisch fortgesetzt wird, statt eine dauerhafte, manuell zu behebende Störung darzustellen.

## Zweck, Mental Model und Dependencies

Das Pull-basierte Scraping-Modell unterscheidet sich strukturell von Push-basierten Metriksystemen, bei denen überwachte Anwendungen selbst aktiv Metriken an einen zentralen Sammelpunkt senden müssen — beim Pull-Modell hält jedes überwachte System lediglich einen HTTP-Endpunkt bereit, der seinen aktuellen Metrikzustand bei Abfrage zurückgibt, während Prometheus selbst die Verantwortung für die tatsächliche Erfassung übernimmt, basierend auf einer konfigurierten Liste bekannter Ziele (typischerweise dynamisch über Service Discovery ermittelt, statt statisch hinterlegt, um mit sich häufig ändernder Infrastruktur, etwa in Kubernetes-Umgebungen, Schritt zu halten). Dieses Modell vereinfacht die Fehlerbehandlung strukturell: Da Prometheus selbst die Kontrolle über den Erfassungszeitpunkt hat, kann es fehlgeschlagene Scrape-Versuche selbst erkennen (ein Ziel, das innerhalb eines erwarteten Zeitfensters nicht antwortet, wird explizit als "down" markiert) und den nächsten Versuch gemäß dem konfigurierten Intervall automatisch erneut durchführen, ohne dass eine komplexe, verteilte Zustellungsgarantie für Push-basierte Übertragungen benötigt wird. PromQL ermöglicht komplexe Aggregationen und Berechnungen über diese Zeitreihendaten (etwa Ratenberechnungen aus Countern, wie bereits in [KB-0567](03-metriken-und-zeitreihen.md) behandelt, oder mehrdimensionale Aggregation über Labels hinweg), wobei komplexe, häufig wiederholte Abfragen (etwa eine Abfrage, die in jedem Dashboard-Refresh oder jeder Alarmierungsauswertung erneut vollständig berechnet werden müsste) über Recording Rules vorab periodisch berechnet und als neue, effizientere Zeitreihe gespeichert werden können, statt bei jeder Nutzung erneut die teure, ursprüngliche Berechnung durchzuführen. Federation adressiert das Skalierungsproblem größerer Infrastrukturen: Statt eine einzelne Prometheus-Instanz alle Ziele einer sehr großen, verteilten Infrastruktur direkt scrapen zu lassen (was die Kapazität dieser einzelnen Instanz überfordern könnte), können mehrere Prometheus-Instanzen jeweils einen Teilbereich der Infrastruktur überwachen, während eine übergeordnete Prometheus-Instanz selektiv, aggregierte Metriken von diesen untergeordneten Instanzen abfragt (selbst über dasselbe Pull-Modell), was eine mehrstufige, skalierbare Architektur ermöglicht. Die bereits in [KB-0567](03-metriken-und-zeitreihen.md) behandelte Kardinalitätsgrenze bleibt dabei unverändert kritisch — Prometheus' Speicherarchitektur ist besonders empfindlich gegenüber hoher Kardinalität, da jede eindeutige Label-Kombination als separate Zeitreihe im Arbeitsspeicher und auf Festplatte gehalten wird, weshalb Kardinalitätsdisziplin bei Prometheus-Instrumentierung besonders konsequent durchgesetzt werden muss.

~~~text
Prometheus: PULL-based scraping model (metrics from KB-0567)
  vs PUSH-based systems: monitored apps actively send metrics to central collector
  PULL: monitored system exposes HTTP endpoint returning current metric state
    Prometheus itself pulls at scrape interval, based on target list (typically via Service Discovery,
    not static -- keeps up with dynamic infra, e.g. Kubernetes)
  SIMPLIFIES error handling: Prometheus controls scrape timing
    -> can detect failed scrapes itself (target unresponsive within expected window -> marked "down")
    -> next attempt automatically retried per configured interval
    -> NO complex distributed delivery guarantee needed (unlike push-based transmission)
PromQL: query language for complex aggregation/computation over time series
Recording Rules: pre-compute expensive, frequently-repeated queries periodically
  -> store as NEW, more efficient time series -> avoid recomputing costly original query on every use
Federation: scaling solution for large infra
  multiple Prometheus instances each scrape a SUBTREE of infra
  higher-level Prometheus instance selectively pulls AGGREGATED metrics from lower instances (same pull model)
  -> multi-tier, scalable architecture
CARDINALITY LIMIT (from KB-0567) remains UNCHANGED critical
  Prometheus storage especially sensitive: each unique label combo = separate time series in RAM+disk
KEY POINT: single failed scrape (brief network blip) usually != fundamental system outage
  -> just a short data gap in that series, auto-continued at next scheduled scrape
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Pull-basiertes Scraping | Prometheus fragt Ziele aktiv nach ihrem Metrikzustand ab | vereinfacht Fehlererkennung, kein Push-Zustellungsproblem |
| Service Discovery | dynamische Zielermittlung statt statischer Konfiguration | hält Schritt mit sich häufig ändernder Infrastruktur |
| Recording Rules | vorab berechnete, wiederkehrende Abfragen | vermeidet wiederholte, teure Berechnung |
| Federation | mehrstufige Metrikaggregation über mehrere Instanzen | skaliert für sehr große, verteilte Infrastrukturen |

Implementierung: Scrape-Ziele werden über Service Discovery dynamisch ermittelt, statt statisch konfiguriert zu werden, um mit sich ändernder Infrastruktur Schritt zu halten. Häufig wiederholte, teure PromQL-Abfragen werden als Recording Rules vorab berechnet. Für sehr große Infrastrukturen wird eine Federation-Architektur mit mehreren Prometheus-Instanzen eingerichtet. Kardinalitätsdisziplin (siehe [KB-0567](03-metriken-und-zeitreihen.md)) wird bei jeder Metrikdefinition konsequent durchgesetzt.

## Scalability, Reliability, Security und Observability

Prometheus skaliert die zuverlässige Metrikerfassung proportional zur Kombination aus Service-Discovery-basiertem Scraping, Recording Rules für Abfrageeffizienz, und Federation für größenkritische Infrastrukturen; die Reliability-Grenze liegt darin, dass unkontrollierte Kardinalität proportional zur Label-Variabilität die Speicherkapazität einer einzelnen Instanz überfordert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine kurze Datenlücke in einer Metrik-Zeitreihe wird beobachtet | ein einzelner Scrape-Versuch ist innerhalb eines Intervalls fehlgeschlagen, wurde aber beim nächsten Versuch automatisch fortgesetzt | den Scrape-Status des betroffenen Ziels prüfen, um zwischen kurzer Lücke und dauerhaftem Ausfall zu unterscheiden |
| Dashboard- oder Alarmierungsabfragen sind unerwartet langsam | eine komplexe, häufig wiederholte PromQL-Abfrage wird bei jeder Nutzung erneut vollständig berechnet | die betroffene Abfrage als Recording Rule vorab periodisch berechnen |
| eine einzelne Prometheus-Instanz wird bei wachsender Infrastruktur überlastet | keine Federation-Architektur zur Aufteilung der Scrape-Last existiert | eine mehrstufige Federation-Architektur mit aufgeteilten Zuständigkeiten einrichten |

Security: Scrape-Endpunkte sollten nicht öffentlich ohne Zugriffskontrolle erreichbar sein, da sie potenziell sensible Betriebsdaten offenlegen können. Observability: Die tatsächliche Scrape-Erfolgsrate pro Ziel, die Abfragelatenz häufig genutzter PromQL-Abfragen, und die tatsächliche Zeitreihenanzahl relativ zur Speicherkapazität sind zentrale Betriebssignale zur Bewertung der Prometheus-Infrastruktur selbst.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Scraping und einfache PromQL-Abfragen für einen gegebenen Dienst korrekt. **Principal** entwirft die vollständige Prometheus-Architektur mit Recording Rules und gegebenenfalls Federation für eine skalierende Infrastruktur. **Chief** legt unternehmensweite Standards für Prometheus-Skalierungsstrategien und Kardinalitätsdisziplin fest.

Anti-Patterns: komplexe, häufig wiederholte Abfragen ohne Recording Rules bei jeder Nutzung neu berechnen; eine einzelne Prometheus-Instanz ohne Federation für eine stark wachsende Infrastruktur überlasten; Scrape-Ziele statisch statt über Service Discovery dynamisch konfigurieren.

## Production Checklist

- [ ] Scrape-Ziele werden über Service Discovery dynamisch ermittelt.
- [ ] Häufig wiederholte, teure PromQL-Abfragen sind als Recording Rules vorab berechnet.
- [ ] Für große Infrastrukturen ist eine Federation-Architektur mit aufgeteilten Zuständigkeiten eingerichtet.
- [ ] Scrape-Endpunkte sind nicht ohne Zugriffskontrolle öffentlich erreichbar.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen Pull- und Push-basierten Metriksystemen?

**Antwort:** Bei Pull-basierten Systemen wie Prometheus fragt das Metriksystem aktiv bei überwachten Zielen deren aktuellen Zustand ab; bei Push-basierten Systemen senden überwachte Anwendungen selbst aktiv Metriken an einen zentralen Sammelpunkt.

### 2. Warum vereinfacht das Pull-Modell die Fehlerbehandlung bei Scraping-Fehlern?

**Antwort:** Weil Prometheus selbst die Kontrolle über den Erfassungszeitpunkt hat und fehlgeschlagene Scrape-Versuche selbst erkennen sowie automatisch beim nächsten geplanten Intervall erneut versuchen kann, ohne eine komplexe, verteilte Zustellungsgarantie zu benötigen.

### 3. Wofür werden Recording Rules genutzt?

**Antwort:** Um komplexe, häufig wiederholte PromQL-Abfragen vorab periodisch zu berechnen und als neue, effizientere Zeitreihe zu speichern, statt die teure Berechnung bei jeder Nutzung erneut durchzuführen.

### 4. Wofür wird Federation eingesetzt?

**Antwort:** Um sehr große, verteilte Infrastrukturen skalierbar zu überwachen, indem mehrere Prometheus-Instanzen jeweils einen Teilbereich überwachen und eine übergeordnete Instanz selektiv aggregierte Metriken von diesen abfragt.

### 5. Wie gehst du vor, wenn eine kurze Datenlücke in einer Metrik-Zeitreihe beobachtet wird?

**Antwort:** Ich prüfe den Scrape-Status des betroffenen Ziels, da ein einzelner, fehlgeschlagener Scrape-Versuch innerhalb eines Intervalls lediglich zu einer kurzen, automatisch fortgesetzten Datenlücke führt, nicht notwendigerweise zu einem dauerhaften Systemausfall.

### 6. Widersprüchliche Anforderung: Team will minimale Scrape-Intervall-Latenz für nahezu Echtzeit-Metriken UND minimalen Ressourcenverbrauch durch seltenes Scraping — wie gehst du vor?

**Antwort:** Ich würde das Scrape-Intervall differenziert nach tatsächlichem Bedarf konfigurieren — kürzere Intervalle für kritische, latenzsensitive Metriken, längere Intervalle für weniger zeitkritische Metriken — statt ein einheitliches, entweder zu aggressives oder zu träges Intervall für alle Metriken zu erzwingen, um Echtzeit-Anforderungen und Ressourcenschonung je nach tatsächlicher Notwendigkeit zu balancieren.

## Praktische Labs

~~~python
# Local, deterministic simulation of scrape failure creating a data gap, auto-resumed at next scrape (executed locally, no real Prometheus):

def simulate_scrapes(scrape_results):
    time_series = []
    for i, success in enumerate(scrape_results):
        if success:
            time_series.append({"timestamp": i, "value": 42, "status": "collected"})
        else:
            time_series.append({"timestamp": i, "value": None, "status": "gap (failed scrape, will retry next interval)"})
    return time_series

scrape_results = [True, True, False, True, True]  # single failed scrape at index 2

for entry in simulate_scrapes(scrape_results):
    print(entry)
~~~

## Dependencies, Cross-References und Quellen

1. Prometheus-Dokumentation: [Prometheus Overview — Pull-based Scraping](https://prometheus.io/docs/introduction/overview/), abgerufen 2026-09-18.
2. Prometheus-Dokumentation: [Recording Rules](https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/), abgerufen 2026-09-18.

OpenTelemetry ist kanonisch in [KB-0570](06-opentelemetry.md) behandelt; Metriken und Zeitreihen in [KB-0567](03-metriken-und-zeitreihen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, verteilte Prometheus-kompatible Speicher-Backends (Remote Write mit horizontal skalierbarer Langzeitspeicherung) als Alternative zu klassischer Federation | Evaluating | Gegenüber klassischer Federation erst nach Prüfung der tatsächlichen Betriebskomplexität und Kostenstruktur für die konkrete Infrastrukturgröße bevorzugen. |

Ein Team akzeptiert eine Prometheus-Implementierung erst, wenn Service Discovery, Recording Rules für teure Abfragen, und bei Bedarf Federation nachweislich korrekt konfiguriert sind, mit konsequenter Kardinalitätsdisziplin.
