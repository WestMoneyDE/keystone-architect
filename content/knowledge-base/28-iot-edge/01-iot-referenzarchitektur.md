---
{"id": "KB-0649", "title": "IoT-Referenzarchitektur", "domain": "28", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE", "CLOUD"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine IoT-Referenzarchitektur mit Geräten, Gateways und Cloudservices konzeptionell entwerfen und Offlineverhalten sowie Verantwortungsgrenzen anhand etablierter Praxis definieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes IoT-Vorhaben explizit gestalten, wie physische Wirkung (reale, physikalische Konsequenzen von Systementscheidungen) und eindeutige Verantwortungsgrenzen zwischen Geräte-, Gateway- und Cloudebene als zentrale, nicht optionale Systemanforderungen behandelt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine IoT-Architektur Offlineverhalten nicht explizit definiert, sodass bei Konnektivitätsverlust ein physisch riskantes statt sicheres Systemverhalten entsteht.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für IoT-Referenzarchitekturen festlegen, die physische Wirkung und Verantwortungsgrenzen als verbindliche, nicht nachträglich ergänzbare Systemanforderungen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Lernziel dieses Kapitels mit einem überprüfbaren Artefakt belegen.", "rationale": "Kern ist die konzeptionelle Architekturverbindung von Geräten, Gateways und Cloudservices mit physischer Wirkung und Verantwortungsgrenzen, nicht die protokollspezifische Detailimplementierung."}}, "lab_validation": [{"lab_id": "KB-0649-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Offlineverhalten bei Konnektivitätsverlust, kein reales IoT-System verwendet", "evidence": "Ein lokales Skript simuliert ein IoT-Gerät, das bei Konnektivitätsverlust zur Cloud explizit in einen physisch sicheren, statt undefinierten Zustand übergeht, und zeigt den Unterschied zu einem System ohne definiertes Offlineverhalten.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales IoT-System."}]}
---
# IoT-Referenzarchitektur

> **Ziel:** Eine IoT-Referenzarchitektur verbindet drei Ebenen — **Geräte** (physische Sensoren und Aktoren, die tatsächlich mit der realen Welt interagieren), **Gateways** (lokale Vermittlungspunkte, die Gerätekommunikation bündeln und mit der Cloud verbinden) und **Cloudservices** (zentrale Verarbeitung, Speicherung und Steuerungslogik). Der zentrale Punkt dieses Kapitels ist, dass IoT-Systeme sich von rein digitalen Systemen durch zwei strukturelle Eigenschaften unterscheiden, die als zentrale, nicht nachträglich ergänzbare Systemanforderungen behandelt werden müssen: **physische Wirkung** (Systementscheidungen haben tatsächliche, physikalische Konsequenzen in der realen Welt, nicht nur digitale) und die Notwendigkeit definierten **Offlineverhaltens** (ein Gerät muss auch bei tatsächlichem Verlust der Cloud-Konnektivität ein definiertes, sicheres Verhalten zeigen, statt in einem undefinierten Zustand zu verharren). Eindeutige Verantwortungsgrenzen zwischen den drei Ebenen sind die dritte, zentrale Anforderung — unklar zugeordnete Verantwortung zwischen Geräte-, Gateway- und Cloudebene führt bei einem tatsächlichen Vorfall zu Verzögerungen bei der Ursachenklärung und Behebung.

## Zweck, Mental Model und Dependencies

Physische Wirkung unterscheidet IoT-Systeme grundlegend von rein digitalen Systemen: Ein Softwarefehler in einem rein digitalen System führt typischerweise zu einer digitalen Konsequenz (eine falsche Anzeige, ein fehlgeschlagener API-Aufruf), während ein Softwarefehler in einem IoT-System tatsächliche, physikalische Konsequenzen haben kann (ein Aktor öffnet fälschlich ein Ventil, eine Heizung schaltet sich nicht ab) — diese physische Wirkung muss bei der Architekturentscheidung explizit als eigenständige, kritische Anforderung behandelt werden, nicht als nachträgliche Ergänzung einer primär digital gedachten Architektur. Offlineverhalten ist die praktische Konsequenz der physischen Verteilung eines IoT-Systems: Da Geräte typischerweise über unzuverlässige, physisch verteilte Netzwerkverbindungen mit der Cloud verbunden sind, muss jedes Gerät ein explizit definiertes Verhalten für den Fall zeigen, dass die Cloud-Konnektivität tatsächlich verloren geht — ein Gerät, das bei Konnektivitätsverlust in einen undefinierten oder physisch riskanten Zustand übergeht (etwa ein Aktor, der in seiner letzten Position verharrt, obwohl dies physisch unsicher ist), stellt ein erhebliches, tatsächliches Risiko dar, während ein Gerät mit explizit definiertem, sicherem Offlineverhalten (etwa ein automatischer Übergang in einen bekannten, sicheren Zustand) dieses Risiko strukturell vermeidet. Die Trennung eindeutiger Verantwortungsgrenzen zwischen Geräte-, Gateway- und Cloudebene ist die dritte, organisatorische Anforderung: Da ein tatsächlicher Fehler an jeder der drei Ebenen entstehen kann (ein defektes Gerät, ein Gateway-Ausfall, ein Cloud-Dienstproblem), muss vorab eindeutig geklärt sein, welche Ebene für welche Art von Fehler tatsächlich verantwortlich ist, damit eine Ursachenklärung im tatsächlichen Vorfall nicht durch unklare Zuständigkeiten verzögert wird — diese Verantwortungsklärung entspricht methodisch der bereits in anderen Domains dieses Curriculums behandelten Notwendigkeit klarer Ownership-Zuordnung, hier jedoch mit der zusätzlichen Dringlichkeit physischer Konsequenzen.

~~~text
IoT reference architecture: connects three levels
  DEVICES (physical sensors+actuators actually interacting with real world)
  GATEWAYS (local mediation points bundling device communication, connecting to cloud)
  CLOUD SERVICES (central processing, storage, control logic)
KEY POINT: IoT systems differ from purely digital systems in two structural properties,
  treated as central, non-retrofittable system requirements
  PHYSICAL EFFECT (system decisions have actual, physical consequences in real world, not
  just digital)
  necessity of defined OFFLINE BEHAVIOR (device must show defined, safe behavior even on
  actual loss of cloud connectivity, instead of remaining in undefined state)
  clear RESPONSIBILITY BOUNDARIES between the three levels = third central requirement --
  unclearly assigned responsibility between device/gateway/cloud level causes delays in
  root-cause clarification+fix during an actual incident
PHYSICAL EFFECT fundamentally distinguishes IoT from purely digital systems
  software bug in purely digital system -> typically digital consequence (wrong display,
  failed API call)
  software bug in IoT system -> CAN have actual, physical consequences (actuator wrongly
  opens a valve, heating fails to shut off)
  this physical effect must be treated as standalone, critical requirement in architecture
  decisions, NOT as after-the-fact addition to a primarily digitally-conceived architecture
OFFLINE BEHAVIOR = practical consequence of an IoT system's physical distribution
  devices typically connected to cloud via unreliable, physically-distributed network links
  every device must show EXPLICITLY DEFINED behavior for case where cloud connectivity is
  actually lost
  device transitioning to undefined or physically-risky state on connectivity loss
  (actuator remaining in last position even though physically unsafe)
  = substantial, actual risk
  device w/ explicitly defined, safe offline behavior (automatic transition to known, safe
  state) -> structurally avoids this risk
CLEAR RESPONSIBILITY BOUNDARIES between device/gateway/cloud = third, organizational
  requirement
  actual fault can arise at any of three levels (defective device, gateway outage, cloud
  service problem)
  must be clarified UPFRONT which level is actually responsible for which fault type
  so root-cause clarification during actual incident isn't delayed by unclear responsibilities
  this responsibility clarification methodically corresponds to clear ownership assignment
  necessity already covered elsewhere in this curriculum, here w/ ADDITIONAL urgency of
  physical consequences
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Geräte-Gateway-Cloud-Verbindung | strukturiert IoT-System in drei funktionale Ebenen | Grundlage für Verantwortungs- und Fehlerzuordnung |
| Physische Wirkung | erfasst reale, physikalische Konsequenzen von Systementscheidungen | zentrale, nicht nachträglich ergänzbare Anforderung |
| Definiertes Offlineverhalten | sicheres Geräteverhalten bei Konnektivitätsverlust | verhindert physisch riskante, undefinierte Zustände |
| Eindeutige Verantwortungsgrenzen | ordnet Fehlerklassen den drei Ebenen zu | verhindert Verzögerung bei Ursachenklärung |

Implementierung: Die IoT-Architektur wird explizit in Geräte-, Gateway- und Cloudebene strukturiert, mit dokumentierter Kommunikationsverbindung zwischen den Ebenen. Für jedes Gerät wird ein explizites, sicheres Offlineverhalten für den Fall des Konnektivitätsverlusts definiert. Verantwortungsgrenzen für unterschiedliche Fehlerklassen (Gerätefehler, Gateway-Ausfall, Cloud-Problem) werden vorab eindeutig dokumentiert.

## Scalability, Reliability, Security und Observability

Eine IoT-Referenzarchitektur skaliert die tatsächliche Systemsicherheit proportional zur Konsequenz, mit der physische Wirkung und Offlineverhalten als zentrale statt nachträgliche Anforderungen behandelt werden; die Reliability-Grenze liegt darin, dass ein Gerät ohne definiertes, sicheres Offlineverhalten bei Konnektivitätsverlust in einen tatsächlich riskanten Zustand übergehen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Gerät verharrt bei Konnektivitätsverlust in einem physisch riskanten Zustand | kein explizites, sicheres Offlineverhalten wurde definiert | ein definiertes, sicheres Offlineverhalten für den Konnektivitätsverlustfall implementieren |
| die Ursachenklärung eines Fehlers dauert ungewöhnlich lange | keine eindeutige Verantwortungszuordnung zwischen Geräte-, Gateway- und Cloudebene existiert | Verantwortungsgrenzen für unterschiedliche Fehlerklassen explizit dokumentieren |
| eine Architekturentscheidung berücksichtigt physische Konsequenzen nicht ausreichend | physische Wirkung wurde als nachträgliche Ergänzung statt zentrale Anforderung behandelt | physische Wirkung explizit als eigenständige, kritische Anforderung in die Architekturplanung aufnehmen |

Security: Physische Sicherheit (Safety) und informationstechnische Sicherheit (Security) müssen bei IoT-Systemen gemeinsam betrachtet werden, da eine Sicherheitslücke tatsächliche, physische Konsequenzen haben kann. Observability: Die tatsächliche Häufigkeit von Konnektivitätsverlusten und das dabei beobachtete, tatsächliche Geräteverhalten sind zentrale Signale zur Bewertung, ob das definierte Offlineverhalten tatsächlich wirksam ist.

## Trade-offs und Entscheidungen

**Staff** implementiert ein definiertes, sicheres Offlineverhalten für ein gegebenes Gerät korrekt. **Principal** entwirft die vollständige IoT-Referenzarchitektur mit Verantwortungsgrenzen für ein Gebäude- oder Produktionssystem. **Chief** legt unternehmensweite Standards für IoT-Referenzarchitekturen fest, die physische Wirkung und Verantwortungsgrenzen als verbindliche Anforderungen etablieren.

Anti-Patterns: eine IoT-Architektur primär als digitales System entwerfen und physische Wirkung erst nachträglich berücksichtigen; kein explizites Offlineverhalten definieren, sodass Geräte bei Konnektivitätsverlust in einen undefinierten Zustand übergehen; Verantwortungsgrenzen zwischen Geräte-, Gateway- und Cloudebene unklar lassen.

## Production Checklist

- [ ] Die Architektur ist explizit in Geräte-, Gateway- und Cloudebene strukturiert.
- [ ] Jedes Gerät hat ein explizit definiertes, sicheres Offlineverhalten für Konnektivitätsverlust.
- [ ] Verantwortungsgrenzen für unterschiedliche Fehlerklassen sind vorab eindeutig dokumentiert.
- [ ] Physische Wirkung ist explizit als eigenständige, kritische Anforderung in der Architekturplanung berücksichtigt.

## Interviewfragen

### 1. Was unterscheidet die physische Wirkung von IoT-Systemen von rein digitalen Systemen?

**Antwort:** Ein Fehler in einem IoT-System kann tatsächliche, physikalische Konsequenzen in der realen Welt haben (etwa ein fälschlich geöffnetes Ventil), während ein Fehler in einem rein digitalen System typischerweise nur digitale Konsequenzen erzeugt.

### 2. Warum benötigt jedes IoT-Gerät ein explizit definiertes Offlineverhalten?

**Antwort:** Weil Geräte typischerweise über unzuverlässige Netzwerkverbindungen mit der Cloud verbunden sind, und ein Gerät ohne definiertes Verhalten bei Konnektivitätsverlust in einen undefinierten oder physisch riskanten Zustand übergehen kann.

### 3. Warum sind eindeutige Verantwortungsgrenzen zwischen Geräte-, Gateway- und Cloudebene notwendig?

**Antwort:** Weil ein tatsächlicher Fehler an jeder der drei Ebenen entstehen kann, und unklare Zuständigkeiten die Ursachenklärung während eines tatsächlichen Vorfalls verzögern.

### 4. Was sollte bei Konnektivitätsverlust ein Aktor tun, der eine physisch riskante letzte Position hält?

**Antwort:** Er sollte automatisch in einen bekannten, physisch sicheren Zustand übergehen, statt undefiniert in der letzten, potenziell unsicheren Position zu verharren.

### 5. Wie gehst du vor, wenn ein Gerät bei Konnektivitätsverlust in einem physisch riskanten Zustand verharrt?

**Antwort:** Ich prüfe, ob ein explizites, sicheres Offlineverhalten definiert wurde, und implementiere andernfalls einen automatischen Übergang in einen bekannten, sicheren Zustand für den Konnektivitätsverlustfall.

### 6. Widersprüchliche Anforderung: Das Produktteam will minimale Geräte-Firmware-Komplexität UND die Organisation will umfassendes, sicheres Offlineverhalten für jedes Gerät — wie gehst du vor?

**Antwort:** Ich würde das Offlineverhalten auf die tatsächlich sicherheitskritischen Aktoren konzentrieren, mit einer einfachen, robusten Grundlogik (automatischer Übergang in einen bekannten, sicheren Zustand), statt entweder auf Offlineverhalten zu verzichten oder für jedes Gerät unnötig komplexe Firmware-Logik zu implementieren.

## Praktische Labs

~~~python
# Local, deterministic simulation of defined offline behavior on connectivity loss (executed locally, no real IoT system):

def device_state_on_connectivity_loss(has_offline_behavior, last_known_state):
    if has_offline_behavior:
        return "safe_default_state"
    return last_known_state  # undefined: may be physically unsafe

print(device_state_on_connectivity_loss(has_offline_behavior=True, last_known_state="valve_open"))
print(device_state_on_connectivity_loss(has_offline_behavior=False, last_known_state="valve_open"))
~~~

## Dependencies, Cross-References und Quellen

1. National Institute of Standards and Technology (NIST): [NISTIR 8228 — Considerations for Managing Internet of Things (IoT) Cybersecurity and Privacy Risks](https://csrc.nist.gov/pubs/ir/8228/final), abgerufen 2026-09-18.
2. Eclipse Foundation: [IoT Reference Architecture Concepts](https://iot.eclipse.org/resources/white-papers/), abgerufen 2026-09-18.

Dies ist das erste Kapitel von Domain 28 (IoT/Edge); es hat keine kapitelinternen Vorgängerabhängigkeiten innerhalb dieses Domains.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, herstellerübergreifende Offline-Verhaltensprofile für Smart-Building-Geräte zur konsistenten Sicherheitsgarantie über verschiedene Gerätehersteller hinweg | Evaluating | Bei künftigen Beschaffungsentscheidungen prüfen, jedoch bis zur breiten Standardisierung weiterhin explizite, projektspezifische Offlineverhaltens-Definitionen für jedes eingesetzte Gerät sicherstellen. |

Ein Team akzeptiert eine IoT-Referenzarchitektur erst, wenn physische Wirkung, definiertes Offlineverhalten und eindeutige Verantwortungsgrenzen nachweislich als zentrale, nicht nachträglich ergänzte Systemanforderungen etabliert sind.
