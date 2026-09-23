---
{"id": "KB-0657", "title": "IoT-Telemetriepipelines", "domain": "28", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0650", "concepts": ["MQTT", "QoS"], "needed_for": "Telemetriepipelines nutzen typischerweise MQTT als Transportprotokoll"}, {"id": "KB-0654", "concepts": ["Pufferung bei Edge Gateways"], "needed_for": "Offlinepuffer in Telemetriepipelines bauen auf dem Pufferungsprinzip der Edge Gateways auf"}], "related": ["KB-0649"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Messwerte, Zeitstempel und Gerätezustand korrekt in einer Telemetriepipeline übertragen und für ein gegebenes Szenario eine passende Behandlung von Ausreißern und Offlinepuffer entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein IoT-Vorhaben explizit gestalten, wie unterschiedliche Samplingraten und Zeitstempelquellen konsistent zu verwertbaren, vergleichbaren Betriebsdaten zusammengeführt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn Zeitstempel unterschiedlicher Geräte ohne einheitliche Zeitquelle tatsächlich nicht mehr vergleichbar sind.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Telemetriepipeline-Architektur festlegen, die einheitliche Zeitstempelquellen und Ausreißerbehandlung vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte statistische Modellierung fortgeschrittener Ausreißererkennungsverfahren im Detail ist Vertiefung.", "rationale": "Kern ist die strukturelle Pipeline-Gestaltung, nicht die statistische Detailmodellierung."}}, "lab_validation": [{"lab_id": "KB-0657-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung von Ausreißern und Uhrenabweichungen in Telemetriedaten, keine reale Pipeline verwendet", "evidence": "Ein lokales Skript prüft eine Reihe simulierter Messwerte auf statistische Ausreißer und zeigt, wie eine fehlende einheitliche Zeitquelle zu nicht mehr vergleichbaren Zeitstempeln zwischen zwei simulierten Geräten führt.", "limitations": "Simulation mit synthetischen, deterministischen Daten, keine reale Telemetriepipeline oder reale Geräte getestet."}]}
---
# IoT-Telemetriepipelines

> **Ziel:** Eine IoT-Telemetriepipeline überträgt Messwerte vom Gerät bis zur auswertenden Anwendung und muss dabei drei strukturelle Herausforderungen bewältigen, die aus den physischen und konnektivitätsbedingten Eigenschaften von IoT-Systemen (siehe KB-0649) entstehen: **Zeitstempel** (jeder Messwert muss einem tatsächlich vergleichbaren Zeitpunkt zugeordnet werden können, auch über Geräte mit unterschiedlichen internen Uhren hinweg), **Ausreißer** (offensichtlich fehlerhafte oder physikalisch unplausible Messwerte müssen erkannt werden, bevor sie eine nachgelagerte Auswertung verfälschen) und **unterschiedliche Samplingraten** (Geräte messen mit unterschiedlicher Frequenz, sodass eine gemeinsame Auswertung eine explizite Vereinheitlichung erfordert). Der zentrale Punkt dieses Kapitels ist, dass Rohdaten aus heterogenen IoT-Geräten ohne diese drei Behandlungsschritte tatsächlich nicht direkt vergleichbar oder verwertbar sind — eine Pipeline, die Zeitstempel, Ausreißer und Samplingraten nicht explizit adressiert, liefert scheinbar vollständige, aber tatsächlich irreführende Betriebsdaten.

## Zweck, Mental Model und Dependencies

Zeitstempel müssen sich auf eine tatsächlich einheitliche Zeitquelle beziehen, damit Messwerte unterschiedlicher Geräte miteinander verglichen werden können — Geräte mit eigener, nicht synchronisierter interner Uhr driften über die Zeit tatsächlich auseinander, sodass ohne eine Zeitsynchronisation (etwa über NTP) zwei Geräte denselben physikalischen Moment mit unterschiedlichen Zeitstempeln melden würden. Es ist zudem zu unterscheiden zwischen dem Zeitpunkt der tatsächlichen Messung (Erfassungszeitstempel) und dem Zeitpunkt des Empfangs durch die Cloud (Empfangszeitstempel) — bei einem Gerät mit Offlinepuffer (siehe KB-0654) können beide erheblich auseinanderfallen, da ein während eines Verbindungsabbruchs gepufferter Messwert erst deutlich verzögert bei der Cloud ankommt; eine Pipeline, die nur den Empfangszeitstempel nutzt, würde die tatsächliche zeitliche Abfolge der Ereignisse verfälschen. Ausreißer entstehen tatsächlich häufig aus Sensordefekten, Übertragungsfehlern oder physikalisch unmöglichen Werten (etwa eine Temperaturmessung weit außerhalb des physikalisch plausiblen Bereichs) — eine Pipeline sollte offensichtliche Ausreißer entweder am Edge Gateway (siehe KB-0654, lokale Regeln) oder zentral in der Pipeline erkennen und markieren, statt sie unbehandelt in nachgelagerte Auswertungen einfließen zu lassen, wo sie tatsächlich zu falschen Schlussfolgerungen führen könnten. Unterschiedliche Samplingraten (ein Temperatursensor misst etwa jede Minute, ein Vibrationssensor hunderte Male pro Sekunde) erfordern eine explizite Entscheidung, wie diese Daten für eine gemeinsame Auswertung zusammengeführt werden — etwa durch Aggregation der hochfrequenten Daten auf die niedrigere Rate oder durch getrennte, aber zeitlich korrelierbare Speicherung beider Raten; eine unreflektierte Vermischung unterschiedlicher Samplingraten ohne explizite Aggregationsstrategie führt tatsächlich zu einer verzerrten, nicht repräsentativen Auswertung.

~~~text
IoT telemetry pipeline transports readings from device to analyzing app, must handle 3
  structural challenges arising from IoT systems' physical+connectivity properties
  (see KB-0649)
  TIMESTAMPS: every reading must map to an ACTUALLY comparable point in time, even
  across devices w/ different internal clocks
  OUTLIERS: obviously faulty or physically implausible readings must be detected before
  distorting downstream analysis
  DIFFERENT SAMPLING RATES: devices measure at different frequencies -> joint analysis
  requires explicit unification
KEY POINT: raw data from heterogeneous IoT devices, w/o these 3 treatment steps, is
  ACTUALLY not directly comparable/usable -- a pipeline not explicitly addressing
  timestamps, outliers, sampling rates delivers seemingly complete but ACTUALLY
  misleading operational data
TIMESTAMPS must reference an ACTUALLY unified time source so readings from different
  devices are comparable
  devices w/ own, unsynced internal clock ACTUALLY drift apart over time -> w/o time sync
  (e.g. NTP) two devices would report same physical moment w/ different timestamps
  distinguish actual measurement time (capture timestamp) vs cloud receipt time (receipt
  timestamp) -- for device w/ offline buffer (see KB-0654) both can differ substantially,
  since a buffered reading arrives at cloud significantly delayed
  pipeline using only receipt timestamp would distort actual event sequence
OUTLIERS ACTUALLY frequently arise from sensor defects, transmission errors, physically
  impossible values (temp reading far outside physically plausible range)
  pipeline should detect+flag obvious outliers either at edge gateway (see KB-0654, local
  rules) or centrally in pipeline, instead of letting them flow unhandled into downstream
  analysis where they could ACTUALLY lead to wrong conclusions
DIFFERENT SAMPLING RATES (temp sensor measures ~every minute, vibration sensor hundreds
  of times/sec) require explicit decision how to merge this data for joint analysis --
  aggregating high-freq data down to lower rate, or separate but time-correlatable
  storage of both rates
  unreflected mixing of different sampling rates w/o explicit aggregation strategy
  ACTUALLY leads to distorted, unrepresentative analysis
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Zeitsynchronisation (NTP) | verhindert Uhrendrift zwischen Geräten | Voraussetzung für tatsächlich vergleichbare Zeitstempel |
| Erfassungs- vs. Empfangszeitstempel | trennt tatsächliche Messzeit von Ankunftszeit | verhindert Verfälschung bei gepufferten, verzögerten Werten |
| Ausreißererkennung | markiert offensichtlich fehlerhafte Werte | verhindert verfälschte nachgelagerte Auswertung |
| Samplingraten-Vereinheitlichung | explizite Aggregation oder korrelierbare Speicherung | verhindert verzerrte Auswertung bei gemischten Raten |

Implementierung: Alle Geräte werden über eine einheitliche Zeitquelle synchronisiert. Jeder Messwert trägt sowohl einen Erfassungs- als auch einen Empfangszeitstempel. Offensichtliche Ausreißer werden explizit markiert oder gefiltert. Für Auswertungen mit gemischten Samplingraten wird eine explizite Aggregations- oder Korrelationsstrategie dokumentiert.

## Scalability, Reliability, Security und Observability

Eine Telemetriepipeline skaliert über die Anzahl der Geräte und die Gesamtdatenrate; die Reliability-Grenze liegt darin, dass fehlende Zeitsynchronisation oder unbehandelte Ausreißer die Vergleichbarkeit und Verwertbarkeit der Betriebsdaten tatsächlich untergraben.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Messwerte unterschiedlicher Geräte lassen sich zeitlich nicht sinnvoll vergleichen | keine einheitliche Zeitsynchronisation zwischen den Geräten ist implementiert | eine einheitliche Zeitquelle (NTP) für alle Geräte einführen |
| eine Auswertung zeigt unplausible Spitzen oder Einbrüche | unbehandelte Ausreißer sind in die Auswertung eingeflossen | eine explizite Ausreißererkennung vor der Auswertung einführen |
| eine gemeinsame Auswertung hochfrequenter und niederfrequenter Sensoren wirkt verzerrt | die unterschiedlichen Samplingraten wurden ohne explizite Aggregationsstrategie vermischt | eine explizite Aggregations- oder Korrelationsstrategie für die unterschiedlichen Raten definieren |

Security: Zeitstempel sollten gegen nachträgliche Manipulation abgesichert sein, da manipulierte Zeitstempel tatsächlich falsche Ereignisreihenfolgen vortäuschen könnten. Observability: Die tatsächliche Uhrenabweichung zwischen Geräten und der Zeitquelle ist ein zentrales Signal zur Bewertung der Zeitstempelqualität.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte Zeitstempel- und Ausreißerbehandlung für eine gegebene Telemetriequelle. **Principal** entwirft die vollständige Pipeline-Architektur mit Zeitsynchronisation, Ausreißerbehandlung und Samplingraten-Vereinheitlichung. **Chief** legt unternehmensweite Standards für Telemetriepipeline-Datenqualität fest.

Anti-Patterns: nur den Empfangszeitstempel statt des tatsächlichen Erfassungszeitstempels nutzen; Ausreißer unbehandelt in nachgelagerte Auswertungen einfließen lassen; unterschiedliche Samplingraten ohne explizite Aggregationsstrategie vermischen.

## Production Checklist

- [ ] Alle Geräte sind über eine einheitliche Zeitquelle synchronisiert.
- [ ] Jeder Messwert trägt sowohl Erfassungs- als auch Empfangszeitstempel.
- [ ] Offensichtliche Ausreißer werden explizit erkannt und markiert.
- [ ] Für gemischte Samplingraten existiert eine explizite Aggregations- oder Korrelationsstrategie.

## Interviewfragen

### 1. Warum ist eine einheitliche Zeitsynchronisation für IoT-Telemetrie notwendig?

**Antwort:** Weil Geräte mit eigener, nicht synchronisierter Uhr über die Zeit auseinanderdriften, sodass ohne Synchronisation Messwerte unterschiedlicher Geräte nicht mehr vergleichbar sind.

### 2. Was ist der Unterschied zwischen Erfassungs- und Empfangszeitstempel?

**Antwort:** Der Erfassungszeitstempel ist der tatsächliche Messzeitpunkt am Gerät, der Empfangszeitstempel der Ankunftszeitpunkt bei der Cloud — bei gepufferten Geräten können beide erheblich auseinanderfallen.

### 3. Warum sollten Ausreißer explizit erkannt statt unbehandelt weitergeleitet werden?

**Antwort:** Weil unbehandelte, physikalisch unplausible Werte nachgelagerte Auswertungen verfälschen und zu falschen Schlussfolgerungen führen können.

### 4. Warum ist die Vereinheitlichung unterschiedlicher Samplingraten notwendig?

**Antwort:** Weil eine unreflektierte Vermischung von hoch- und niederfrequenten Messwerten ohne explizite Aggregationsstrategie zu einer verzerrten, nicht repräsentativen Auswertung führt.

### 5. Wie gehst du vor, wenn eine Auswertung unplausible Spitzen oder Einbrüche zeigt?

**Antwort:** Ich prüfe zuerst, ob unbehandelte Ausreißer in die Auswertung eingeflossen sind, und führe andernfalls eine explizite Ausreißererkennung vor der Auswertung ein.

### 6. Widersprüchliche Anforderung: Das Produktteam will minimale Verarbeitungslatenz für Echtzeit-Dashboards UND die Organisation will vollständig ausreißerbereinigte, zeitlich korrekt korrelierte Betriebsdaten — wie gehst du vor?

**Antwort:** Ich würde eine schnelle, leichte Ausreißererkennung für den Echtzeitpfad einsetzen und eine vollständigere, nachgelagerte Bereinigung mit korrekter Zeitkorrelation für Batch-Auswertungen vorsehen, statt entweder die Echtzeitlatenz durch vollständige Bereinigung zu erhöhen oder auf Datenqualität in der Batch-Auswertung zu verzichten.

## Praktische Labs

~~~python
# Local, deterministic outlier detection and clock-drift illustration (executed locally, no real pipeline):

def detect_outliers(readings, plausible_min, plausible_max):
    return [r for r in readings if not (plausible_min <= r <= plausible_max)]

readings = [21.5, 22.0, 21.8, 999.0, 21.9]  # 999.0 is physically implausible
print(detect_outliers(readings, plausible_min=-40, plausible_max=80))

device_a_time = 100.0
device_b_time_unsynced = 100.0 + 4.3  # clock drift, no NTP
print("comparable" if abs(device_a_time - device_b_time_unsynced) < 1.0 else "not comparable")
~~~

## Dependencies, Cross-References und Quellen

1. Internet Engineering Task Force (IETF): [RFC 5905 — Network Time Protocol Version 4: Protocol and Algorithms Specification](https://www.rfc-editor.org/rfc/rfc5905), abgerufen 2026-09-18.
2. Cloud Native Computing Foundation (CNCF): [OpenTelemetry — Timestamps and Semantic Conventions for Metrics](https://opentelemetry.io/docs/specs/otel/metrics/), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0650 (MQTT) beschriebenen Transportebene und der in KB-0654 (Edge Gateways) beschriebenen Pufferung auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, semantische Metrikkonventionen (etwa OpenTelemetry-Metrics) zur herstellerübergreifenden Vereinheitlichung von IoT-Telemetrieformaten | Growing Adoption | Bei künftigen Pipeline-Neuentwürfen evaluieren, jedoch bei bestehenden, funktionierenden Pipelines weiterhin auf etablierte, projektspezifische Schemata setzen. |

Ein Team akzeptiert eine IoT-Telemetriepipeline erst, wenn Zeitsynchronisation, Ausreißererkennung und Samplingraten-Vereinheitlichung nachweislich implementiert sind.
