---
{"id": "KB-0661", "title": "Edge AI", "domain": "28", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0654", "concepts": ["Lokale Regeln am Gateway", "Pufferung"], "needed_for": "Edge AI erweitert die in KB-0654 beschriebenen lokalen Regeln um tatsächliche Modellinferenz statt einfacher Filterlogik"}, {"id": "KB-0656", "concepts": ["Rollback", "Update-Mechanismen"], "needed_for": "Modellupdates auf Edge-Geräten benötigen dieselbe Rollback-Disziplin wie Firmwareupdates aus KB-0656"}], "related": ["KB-0649", "KB-0657"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokale Inferenz, Datenvorverarbeitung und Modellupdates korrekt kombinieren und für ein gegebenes Szenario begründen können, ob Edge- oder Cloudinferenz vorzuziehen ist.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein IoT-Vorhaben explizit entscheiden, ob Latenz-, Energie-, Privacy- oder Offlinefähigkeitsanforderungen eine Verlagerung der Inferenz an den Edge tatsächlich rechtfertigen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Modellupdate auf Edge-Geräten ohne Rollback-Fähigkeit ausgerollt wird und dadurch dasselbe Risiko wie ein fehlgeschlagenes Firmwareupdate entsteht.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Edge-AI-Einsatz festlegen, die eine explizite Bewertung von Latenz, Energie, Privacy und Offlinefähigkeit gegenüber zentraler Cloudinferenz vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte Modelloptimierung für ressourcenbeschränkte Edge-Hardware (Quantisierung, Pruning) im Detail ist Vertiefung.", "rationale": "Kern ist die architektonische Entscheidung zwischen Edge- und Cloudinferenz, nicht die Detailoptimierung der Modellkompression."}}, "lab_validation": [{"lab_id": "KB-0661-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung der Latenz- und Offlinefähigkeits-Trade-offs zwischen Edge- und Cloudinferenz, kein reales Edge-AI-System verwendet", "evidence": "Ein lokales Skript vergleicht simulierte Latenz und Verfügbarkeit bei simuliertem Verbindungsabbruch zwischen einer lokalen Edge-Inferenz und einer Cloud-Inferenz und zeigt den Unterschied im Ausfallverhalten.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Edge-AI-Modell oder reale Hardware getestet."}]}
---
# Edge AI

> **Ziel:** Edge AI verlagert Modellinferenz vom zentralen Cloud-Dienst auf lokale, ressourcenbeschränkte Edge-Hardware und kombiniert dabei drei Aufgaben: **lokale Inferenz** (die tatsächliche Ausführung eines Modells direkt auf dem Edge-Gerät oder Gateway, statt Rohdaten zur Cloud zu senden), **Datenvorverarbeitung** (Aufbereitung der Rohdaten für die lokale Inferenz, etwa Normalisierung oder Formatanpassung) und **Modellupdates** (die kontrollierte Aktualisierung des lokal ausgeführten Modells, die derselben Rollback-Disziplin wie Firmwareupdates, siehe KB-0656, folgen muss). Der zentrale Punkt dieses Kapitels ist, dass die Entscheidung zwischen Edge- und Cloudinferenz anhand vier konkreter, tatsächlich messbarer Kriterien getroffen werden muss: Latenz (wie schnell eine Entscheidung tatsächlich vorliegen muss), Energie (wie viel tatsächliche Rechenleistung und damit Energie am Edge verfügbar ist), Privacy (ob Rohdaten tatsächlich die lokale Umgebung verlassen dürfen) und Offlinefähigkeit (ob eine Entscheidung tatsächlich auch bei Verbindungsabbruch getroffen werden muss).

## Zweck, Mental Model und Dependencies

Lokale Inferenz ist notwendig, wenn eine Entscheidung tatsächlich innerhalb einer Zeitspanne getroffen werden muss, die eine Cloud-Roundtrip-Latenz (Datenübertragung zur Cloud, Inferenz, Rückübertragung des Ergebnisses) tatsächlich nicht erlaubt — ein sicherheitsrelevanter Anwendungsfall, der innerhalb weniger Millisekunden reagieren muss, kann tatsächlich nicht auf eine Cloud-Roundtrip-Antwort warten, während ein Anwendungsfall mit toleranter Reaktionszeit (etwa eine tägliche Trendanalyse) problemlos in der Cloud verarbeitet werden kann. Energie ist eine begrenzende Ressource für lokale Inferenz: Edge-Geräte verfügen typischerweise über deutlich weniger Rechenleistung und Energiebudget als Cloud-Infrastruktur, sodass das für lokale Inferenz genutzte Modell tatsächlich für diese begrenzten Ressourcen optimiert sein muss (etwa durch Modellkompression), statt ein für Cloud-Hardware dimensioniertes Modell unverändert auf Edge-Hardware auszuführen. Privacy ist ein zentraler Treiber für Edge AI, wenn Rohdaten aus regulatorischen oder vertraulichkeitsbezogenen Gründen tatsächlich die lokale Umgebung nicht verlassen dürfen — in diesem Fall ermöglicht lokale Inferenz eine Verarbeitung, bei der nur das Ergebnis (nicht die sensiblen Rohdaten) die Cloud erreicht, oder bei der überhaupt keine Daten die lokale Umgebung verlassen. Offlinefähigkeit knüpft direkt an das in KB-0649 eingeführte Prinzip des definierten Offlineverhaltens an: Wenn eine KI-gestützte Entscheidung tatsächlich auch bei einem Verbindungsabbruch zur Cloud getroffen werden muss (etwa eine sicherheitsrelevante Erkennung in einer Industrieanlage), ist lokale Inferenz die einzige Option, die dieses Offlineverhalten strukturell garantieren kann. Modellupdates auf Edge-Geräten müssen derselben Rollback-Disziplin folgen wie Firmwareupdates (siehe KB-0656): Ein fehlerhaftes Modellupdate, das etwa systematisch falsche Vorhersagen liefert, muss tatsächlich zu einem vorherigen, bekannt funktionierenden Modell zurückgerollt werden können, statt das Edge-Gerät mit einem fehlerhaften Modell weiterzubetreiben.

~~~text
Edge AI moves model inference from central cloud service to local, resource-constrained
  edge hardware, combines 3 tasks
  LOCAL INFERENCE: actual model execution directly on edge device/gateway instead of
  sending raw data to cloud
  DATA PREPROCESSING: preparing raw data for local inference (normalization, format
  adaptation)
  MODEL UPDATES: controlled update of locally-run model, must follow same rollback
  discipline as firmware updates (see KB-0656)
KEY POINT: decision between edge and cloud inference must be made via 4 concrete,
  ACTUALLY measurable criteria
  LATENCY: how fast a decision must ACTUALLY be available
  ENERGY: how much ACTUAL compute + thus energy available at edge
  PRIVACY: whether raw data may ACTUALLY leave local environment
  OFFLINE CAPABILITY: whether a decision must ACTUALLY be made even during connection
  outage
LOCAL INFERENCE necessary when decision must ACTUALLY be made within timeframe a cloud
  round-trip latency (data transfer to cloud, inference, result transfer back) ACTUALLY
  doesn't allow
  safety-relevant use case needing millisecond-scale response can't ACTUALLY wait for
  cloud round-trip response; tolerant-response-time use case (daily trend analysis) can
  be processed in cloud w/o issue
ENERGY = limiting resource for local inference
  edge devices typically have significantly less compute + energy budget than cloud
  infra -> model used for local inference must ACTUALLY be optimized for these limited
  resources (model compression) instead of running a cloud-hardware-sized model
  unchanged on edge hardware
PRIVACY = central driver for edge AI when raw data ACTUALLY must not leave local
  environment for regulatory/confidentiality reasons
  local inference enables processing where only result (not sensitive raw data) reaches
  cloud, or where no data leaves local environment at all
OFFLINE CAPABILITY directly connects to KB-0649's defined offline-behavior principle
  when an AI-driven decision must ACTUALLY be made even during cloud connection outage
  (safety-relevant detection in industrial plant), local inference is the only option
  that can structurally guarantee this offline behavior
MODEL UPDATES on edge devices must follow same rollback discipline as firmware updates
  (see KB-0656) -- faulty model update systematically delivering wrong predictions must
  ACTUALLY be rollable back to previous, known-working model instead of continuing to
  operate edge device w/ faulty model
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Latenzkriterium | Cloud-Roundtrip vs. tatsächlich benötigte Reaktionszeit | bestimmt, ob lokale Inferenz überhaupt notwendig ist |
| Energiekriterium | begrenzte Rechenleistung am Edge | erfordert Modelloptimierung für ressourcenbeschränkte Hardware |
| Privacy-Kriterium | Rohdaten dürfen ggf. lokale Umgebung nicht verlassen | rechtfertigt lokale Inferenz aus regulatorischen Gründen |
| Offlinefähigkeit | Entscheidung muss auch bei Verbindungsabbruch getroffen werden | direkte Anwendung des Offlineverhalten-Prinzips aus KB-0649 |
| Modellupdate-Rollback | Rückkehr zu vorherigem, funktionierendem Modell | verhindert dauerhaften Betrieb mit fehlerhaftem Modell |

Implementierung: Für jedes Edge-AI-Szenario wird explizit anhand der vier Kriterien (Latenz, Energie, Privacy, Offlinefähigkeit) begründet, ob lokale oder Cloudinferenz genutzt wird. Modellupdates auf Edge-Geräten erfolgen mit derselben Rollback-Fähigkeit wie Firmwareupdates.

## Scalability, Reliability, Security und Observability

Eine Edge-AI-Architektur skaliert über die Anzahl der Edge-Geräte mit lokal ausgeführten Modellen; die Reliability-Grenze liegt darin, dass ein Modellupdate ohne Rollback-Fähigkeit ein fehlerhaftes Modell dauerhaft im Betrieb belässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine sicherheitsrelevante Entscheidung reagiert bei Verbindungsabbruch nicht mehr | die Inferenz erfolgt fälschlich in der Cloud statt lokal, obwohl Offlinefähigkeit tatsächlich benötigt wird | die Inferenz für dieses Szenario an den Edge verlagern |
| ein Edge-Gerät liefert nach einem Modellupdate systematisch falsche Vorhersagen | keine Rollback-Fähigkeit für Modellupdates ist implementiert | Rollback-Fähigkeit für Modellupdates nach demselben Muster wie Firmwareupdates einführen |
| ein Modell läuft auf Edge-Hardware unzuverlässig oder zu langsam | das Modell wurde nicht für die begrenzten Edge-Ressourcen optimiert | das Modell durch Kompression (Quantisierung, Pruning) für die Edge-Hardware optimieren |

Security: Bei Privacy-getriebener lokaler Inferenz sollte verifiziert werden, dass tatsächlich keine sensiblen Rohdaten unbeabsichtigt die lokale Umgebung verlassen. Observability: Die tatsächliche Modellgenauigkeit auf Edge-Geräten sollte im Vergleich zur Cloud-Referenz überwacht werden, um eine Verschlechterung durch Kompression oder veraltete Modelle zu erkennen.

## Trade-offs und Entscheidungen

**Staff** wählt für ein gegebenes Szenario korrekt zwischen Edge- und Cloudinferenz. **Principal** entwirft die vollständige Edge-AI-Architektur mit Datenvorverarbeitung und Modellupdate-Rollback für eine Geräteflotte. **Chief** legt unternehmensweite Standards fest, die eine explizite Vier-Kriterien-Bewertung vor jedem Edge-AI-Einsatz vorschreiben.

Anti-Patterns: lokale Inferenz einsetzen, ohne eines der vier Kriterien (Latenz, Energie, Privacy, Offlinefähigkeit) tatsächlich zu benötigen, und dadurch unnötige Komplexität erzeugen; Modellupdates ohne Rollback-Fähigkeit ausrollen; ein für Cloud-Hardware dimensioniertes Modell unverändert auf ressourcenbeschränkter Edge-Hardware betreiben.

## Production Checklist

- [ ] Die Wahl zwischen Edge- und Cloudinferenz ist explizit anhand von Latenz, Energie, Privacy und Offlinefähigkeit begründet.
- [ ] Das Edge-Modell ist für die begrenzten Ressourcen der Zielhardware optimiert.
- [ ] Modellupdates auf Edge-Geräten haben dieselbe Rollback-Fähigkeit wie Firmwareupdates.
- [ ] Die Modellgenauigkeit am Edge wird gegen eine Cloud-Referenz überwacht.

## Interviewfragen

### 1. Welche vier Kriterien bestimmen die Entscheidung zwischen Edge- und Cloudinferenz?

**Antwort:** Latenz, Energie, Privacy und Offlinefähigkeit.

### 2. Warum ist lokale Inferenz notwendig, wenn eine Entscheidung auch bei Verbindungsabbruch getroffen werden muss?

**Antwort:** Weil eine cloudbasierte Inferenz bei einem tatsächlichen Verbindungsabbruch nicht verfügbar ist, während lokale Inferenz das in KB-0649 eingeführte, definierte Offlineverhalten strukturell garantieren kann.

### 3. Warum muss ein für Cloud-Hardware dimensioniertes Modell für den Edge-Einsatz typischerweise angepasst werden?

**Antwort:** Weil Edge-Geräte deutlich weniger Rechenleistung und Energiebudget als Cloud-Infrastruktur haben, sodass das Modell durch Kompressionstechniken wie Quantisierung oder Pruning optimiert werden muss.

### 4. Warum müssen Modellupdates auf Edge-Geräten dieselbe Rollback-Disziplin wie Firmwareupdates haben?

**Antwort:** Weil ein fehlerhaftes Modellupdate, das systematisch falsche Vorhersagen liefert, sonst dauerhaft im Betrieb bleiben würde, statt zu einem vorherigen, bekannt funktionierenden Modell zurückgerollt zu werden.

### 5. Wie gehst du vor, wenn eine sicherheitsrelevante Entscheidung bei Verbindungsabbruch nicht mehr reagiert?

**Antwort:** Ich prüfe, ob die Inferenz fälschlich in der Cloud statt lokal erfolgt, und verlagere sie an den Edge, wenn Offlinefähigkeit tatsächlich benötigt wird.

### 6. Widersprüchliche Anforderung: Das Produktteam will maximale Modellgenauigkeit durch ein großes, komplexes Modell UND die Organisation will Ausführung auf ressourcenbeschränkter Edge-Hardware mit geringer Latenz — wie gehst du vor?

**Antwort:** Ich würde das Modell gezielt für die Edge-Hardware komprimieren (Quantisierung, Pruning) und die dabei tatsächlich entstehende Genauigkeitseinbuße explizit gegen die Latenz- und Ressourcenanforderungen abwägen, statt entweder unkomprimiert auf ungeeigneter Hardware zu betreiben oder unnötig aggressiv zu komprimieren.

## Praktische Labs

~~~python
# Local, deterministic comparison of edge vs. cloud inference latency and offline availability (executed locally, no real Edge AI system):

def get_decision(location, connection_available, cloud_roundtrip_ms, edge_inference_ms):
    if location == "cloud" and not connection_available:
        return None  # decision unavailable during outage
    latency = cloud_roundtrip_ms if location == "cloud" else edge_inference_ms
    return {"decision": "made", "latency_ms": latency}

print(get_decision("edge", connection_available=False, cloud_roundtrip_ms=300, edge_inference_ms=15))
print(get_decision("cloud", connection_available=False, cloud_roundtrip_ms=300, edge_inference_ms=15))
~~~

## Dependencies, Cross-References und Quellen

1. Linux Foundation: [LF Edge — EVE and Open Horizon: Edge AI Deployment Frameworks](https://www.lfedge.org/projects/), abgerufen 2026-09-18.
2. National Institute of Standards and Technology (NIST): [NIST AI Risk Management Framework — Edge and Embedded AI Considerations](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0654 (Edge Gateways) beschriebenen lokalen Verarbeitung und der in KB-0656 (Device Lifecycle) beschriebenen Rollback-Disziplin auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kleine, spezialisierte Sprachmodelle (Small Language Models) für Edge-Inferenz mit deutlich reduziertem Ressourcenbedarf gegenüber großen, generischen Modellen | Growing Adoption | Bei künftigen Edge-AI-Vorhaben mit Sprachverarbeitungsbedarf evaluieren, jedoch die tatsächliche Genauigkeitseinbuße gegenüber größeren Cloud-Modellen für den jeweiligen Anwendungsfall explizit messen. |

Ein Team akzeptiert eine Edge-AI-Architektur erst, wenn die Wahl zwischen Edge- und Cloudinferenz nachweislich anhand der vier Kriterien begründet ist und Modellupdates eine verifizierte Rollback-Fähigkeit besitzen.
