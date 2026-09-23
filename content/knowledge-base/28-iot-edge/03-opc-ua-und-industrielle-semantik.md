---
{"id": "KB-0651", "title": "OPC UA und industrielle Semantik", "domain": "28", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0650", "concepts": ["MQTT", "Nachrichtentransport"], "needed_for": "OPC UA wird in diesem Kapitel explizit von reinem Nachrichtentransport wie MQTT abgegrenzt"}], "related": ["KB-0649", "KB-0650"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Den OPC-UA-Address-Space und Informationsmodelle korrekt erklären und für ein gegebenes Szenario begründen können, wann OPC UA gegenüber reinem Nachrichtentransport wie MQTT vorzuziehen ist.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein industrielles Datenintegrationsvorhaben explizit entscheiden, ob semantische Informationsmodellierung (OPC UA) oder reiner Nachrichtentransport (MQTT) die tatsächlichen Integrationsanforderungen erfüllt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Integrationsvorhaben fälschlich reinen Nachrichtentransport statt semantischer Informationsmodellierung nutzt, obwohl die tatsächliche Anforderung eine standardisierte Gerätesemantik voraussetzt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für industrielle Datenintegration festlegen, die klar zwischen semantischer Modellierung und reinem Transport unterscheiden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte OPC-UA-Sicherheitskonfiguration (Zertifikatsverwaltung, Security Policies) im Detail ist Vertiefung.", "rationale": "Kern ist die konzeptionelle Abgrenzung von Informationsmodellierung und Transport, nicht die vollständige Sicherheitskonfiguration."}}, "lab_validation": [{"lab_id": "KB-0651-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung des Unterschieds zwischen semantischem Informationsmodell und reinem Nachrichtentransport, kein realer OPC-UA-Server verwendet", "evidence": "Ein lokales Skript vergleicht eine OPC-UA-artige, typisierte Knotenstruktur mit einer flachen MQTT-artigen Topic-Nachricht für dasselbe Gerät und zeigt den Unterschied in struktureller Selbstbeschreibung.", "limitations": "Vereinfachte, synthetische Modellierung, kein realer OPC-UA-Server oder reale industrielle Anlage getestet."}]}
---
# OPC UA und industrielle Semantik

> **Ziel:** OPC UA (Open Platform Communications Unified Architecture) ist ein Standard für industrielle Datenintegration, der sich von reinem Nachrichtentransport wie MQTT durch drei zentrale Eigenschaften unterscheidet: den **Address Space** (eine standardisierte, hierarchische Knotenstruktur, in der jedes Gerät und jede Variable typisiert und selbstbeschreibend repräsentiert wird), **Informationsmodelle** (wiederverwendbare, standardisierte Beschreibungen von Gerätetypen und deren Beziehungen, sodass unterschiedliche Hersteller kompatible Semantik liefern) und **sichere Sessions** (authentifizierte, verschlüsselte Verbindungen mit granularer Zugriffskontrolle auf einzelne Knoten). Der zentrale Punkt dieses Kapitels ist die Abgrenzung: MQTT transportiert Nachrichten, ohne deren Bedeutung zu kennen — die Semantik muss die Anwendung selbst kennen. OPC UA hingegen transportiert selbstbeschreibende, semantisch strukturierte Daten, sodass eine Anwendung die Bedeutung eines Datenpunkts direkt aus dem Informationsmodell ableiten kann, ohne diese Bedeutung vorab fest zu verdrahten.

## Zweck, Mental Model und Dependencies

Der Address Space von OPC UA strukturiert alle Geräte, Variablen und Methoden eines Systems als typisierte Knoten in einem Graphen, wobei jeder Knoten explizit Metadaten wie Datentyp, Einheit und Beziehungen zu anderen Knoten trägt — dies unterscheidet sich fundamental von einer MQTT-Nachricht, die lediglich einen Bytestring an ein Topic sendet, dessen Bedeutung die empfangende Anwendung bereits vorab kennen muss. Informationsmodelle sind standardisierte, wiederverwendbare Vorlagen für Gerätetypen (etwa ein standardisiertes Modell für einen Temperatursensor mit definierten Eigenschaften), die es ermöglichen, dass Geräte unterschiedlicher Hersteller, sofern sie dasselbe Informationsmodell implementieren, tatsächlich kompatible, interoperable Semantik liefern — eine Anwendung, die ein bestimmtes Informationsmodell versteht, kann jedes Gerät verarbeiten, das dieses Modell implementiert, ohne herstellerspezifische Anpassungen vorzunehmen. Sichere Sessions in OPC UA bieten granulare, knotenbasierte Zugriffskontrolle (etwa Lesezugriff auf Sensordaten, aber kein Schreibzugriff auf Steuerungsparameter für bestimmte Clients) und authentifizierte, verschlüsselte Verbindungen — dies ist für industrielle Umgebungen zentral, da ein unautorisierter Schreibzugriff auf einen Steuerungsparameter tatsächliche, physische Konsequenzen haben kann (siehe KB-0649, physische Wirkung). Die Abgrenzung zu reinem Nachrichtentransport wie MQTT (siehe KB-0650) ist entscheidend für die richtige Technologiewahl: MQTT eignet sich für einfache, hochfrequente Telemetrie ohne Bedarf an standardisierter Semantik, während OPC UA sich für heterogene, industrielle Umgebungen eignet, in denen Geräte unterschiedlicher Hersteller tatsächlich interoperabel zusammenarbeiten müssen. Ebenso ist die Abgrenzung zu Gebäudebussystemen wie KNX relevant — KNX ist ein Feldbusprotokoll für Gebäudeautomation mit eigener, gebäudespezifischer Semantik (Licht, Beschattung, Heizung), während OPC UA primär für industrielle Anlagen und Maschinendaten konzipiert ist; eine Cloud-Integration verbindet typischerweise KNX über einen Gateway mit MQTT oder OPC UA, statt KNX-Semantik direkt in die Cloud zu erweitern.

~~~text
OPC UA = industrial data integration standard, differs from pure message transport
  (MQTT) via 3 central properties
  ADDRESS SPACE: standardized, hierarchical node structure -- every device/variable
  represented typed + self-describing
  INFORMATION MODELS: reusable, standardized descriptions of device types + relations
  -> different vendors deliver compatible semantics
  SECURE SESSIONS: authenticated, encrypted connections w/ granular per-node access
  control
KEY POINT (abgrenzung): MQTT transports messages w/o knowing their meaning -- app itself
  must know the semantics. OPC UA transports self-describing, semantically structured
  data -> app can derive a data point's meaning directly from info model, w/o
  pre-hardwiring that meaning
ADDRESS SPACE structures all devices/vars/methods as typed nodes in a graph, every node
  explicitly carries metadata (data type, unit, relations to other nodes)
  fundamentally differs from MQTT msg = just a byte string to a topic, whose meaning
  receiving app must already know in advance
INFORMATION MODELS = standardized, reusable templates for device types (e.g. standardized
  temp-sensor model w/ defined properties)
  enable devices from different vendors, if implementing same info model, to actually
  deliver compatible, interoperable semantics
  app understanding a given info model can process any device implementing that model
  w/o vendor-specific adaptation
SECURE SESSIONS: granular, node-based access control (read access to sensor data but no
  write access to control params for certain clients) + authenticated, encrypted conns
  central for industrial environments: unauthorized write access to a control param CAN
  have actual, physical consequences (see KB-0649, physical effect)
ABGRENZUNG to pure message transport (MQTT, see KB-0650): MQTT fits simple, high-freq
  telemetry w/o need for standardized semantics; OPC UA fits heterogeneous, industrial
  environments where devices from different vendors must actually interoperate
ABGRENZUNG to building bus systems (KNX): KNX = field bus protocol for building
  automation w/ own, building-specific semantics (light, shading, heating); OPC UA
  primarily designed for industrial plants + machine data; cloud integration typically
  connects KNX via a gateway to MQTT or OPC UA, instead of extending KNX semantics
  directly into cloud
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Address Space | typisierte, selbstbeschreibende Knotenstruktur | Grundlage der semantischen Interoperabilität |
| Informationsmodelle | standardisierte, wiederverwendbare Gerätetyp-Beschreibungen | ermöglicht herstellerübergreifende Kompatibilität |
| Sichere Sessions | authentifizierte, verschlüsselte, granular kontrollierte Verbindungen | verhindert unautorisierten Schreibzugriff mit physischer Wirkung |
| Abgrenzung zu MQTT | semantische Modellierung vs. reiner Transport | bestimmt die richtige Technologiewahl je nach Interoperabilitätsbedarf |
| Abgrenzung zu KNX | industrielle vs. gebäudespezifische Semantik | bestimmt Gateway-Integrationsstrategie |

Implementierung: Für ein industrielles Integrationsvorhaben wird explizit geprüft, ob standardisierte, herstellerübergreifende Semantik tatsächlich benötigt wird (dann OPC UA) oder ob reiner, einfacher Nachrichtentransport ausreicht (dann MQTT). Schreibzugriffe auf Steuerungsparameter werden granular auf autorisierte Clients beschränkt.

## Scalability, Reliability, Security und Observability

Eine OPC-UA-basierte Integrationsarchitektur skaliert über die Anzahl standardisierter Informationsmodelle, die tatsächlich herstellerübergreifend wiederverwendet werden; die Reliability-Grenze liegt darin, dass eine unzureichend granulare Zugriffskontrolle unautorisierten Schreibzugriff mit tatsächlicher physischer Konsequenz ermöglicht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Geräte unterschiedlicher Hersteller liefern inkompatible Datenstrukturen | kein gemeinsames, standardisiertes Informationsmodell wurde genutzt | ein standardisiertes Informationsmodell für den Gerätetyp einführen |
| ein Client kann Steuerungsparameter ändern, obwohl er dies nicht sollte | die Zugriffskontrolle ist nicht granular genug auf Knotenebene konfiguriert | granulare, knotenbasierte Zugriffskontrolle für Schreibzugriffe einrichten |
| eine einfache Telemetrieintegration wird unnötig komplex | OPC UA wurde gewählt, obwohl reiner Nachrichtentransport (MQTT) ausgereicht hätte | die tatsächliche Interoperabilitätsanforderung neu bewerten und ggf. auf MQTT vereinfachen |

Security: Sichere Sessions mit Zertifikatsauthentifizierung sind für industrielle Umgebungen zentral, da unautorisierter Zugriff tatsächliche physische Konsequenzen haben kann. Observability: Die tatsächliche Nutzung granularer Zugriffsrechte (welcher Client tatsächlich welche Knoten liest oder schreibt) ist ein zentrales Signal zur Bewertung der tatsächlichen Zugriffskontrollwirksamkeit.

## Trade-offs und Entscheidungen

**Staff** implementiert ein standardisiertes Informationsmodell für einen gegebenen Gerätetyp korrekt. **Principal** entscheidet für ein Integrationsvorhaben zwischen OPC UA und reinem Nachrichtentransport. **Chief** legt unternehmensweite Standards für industrielle Datenintegration fest, die semantische Modellierung und Transport klar trennen.

Anti-Patterns: OPC UA für einfache, homogene Telemetrie ohne Interoperabilitätsbedarf einsetzen und dadurch unnötige Komplexität erzeugen; keine granulare Zugriffskontrolle auf Steuerungsparameter konfigurieren; KNX-Semantik direkt und unverändert in die Cloud erweitern, statt über ein Gateway zu vermitteln.

## Production Checklist

- [ ] Die Wahl zwischen OPC UA und reinem Nachrichtentransport ist explizit anhand des tatsächlichen Interoperabilitätsbedarfs begründet.
- [ ] Ein standardisiertes Informationsmodell wird für herstellerübergreifende Gerätetypen genutzt.
- [ ] Schreibzugriffe auf Steuerungsparameter sind granular auf autorisierte Clients beschränkt.
- [ ] Sessions sind authentifiziert und verschlüsselt konfiguriert.

## Interviewfragen

### 1. Was unterscheidet OPC UA grundlegend von reinem Nachrichtentransport wie MQTT?

**Antwort:** OPC UA transportiert selbstbeschreibende, semantisch strukturierte Daten über einen typisierten Address Space, während MQTT lediglich Nachrichten transportiert, deren Bedeutung die Anwendung bereits vorab kennen muss.

### 2. Wofür wird ein Informationsmodell in OPC UA genutzt?

**Antwort:** Es ist eine standardisierte, wiederverwendbare Beschreibung eines Gerätetyps, die es Geräten unterschiedlicher Hersteller ermöglicht, kompatible, interoperable Semantik zu liefern.

### 3. Warum ist granulare Zugriffskontrolle in industriellen OPC-UA-Umgebungen besonders wichtig?

**Antwort:** Weil unautorisierter Schreibzugriff auf einen Steuerungsparameter tatsächliche, physische Konsequenzen haben kann.

### 4. Wie unterscheidet sich OPC UA von einem Gebäudebussystem wie KNX?

**Antwort:** KNX ist ein Feldbusprotokoll mit gebäudespezifischer Semantik (Licht, Beschattung, Heizung), während OPC UA primär für industrielle Anlagen und Maschinendaten konzipiert ist; eine Integration erfolgt typischerweise über ein Gateway.

### 5. Wie gehst du vor, wenn Geräte unterschiedlicher Hersteller inkompatible Datenstrukturen liefern?

**Antwort:** Ich prüfe, ob ein gemeinsames, standardisiertes Informationsmodell genutzt wird, und führe andernfalls eines für den betroffenen Gerätetyp ein.

### 6. Widersprüchliche Anforderung: Das Engineering-Team will minimale Integrationskomplexität für ein einfaches Sensor-Netzwerk UND die Organisation will langfristige, herstellerübergreifende Interoperabilität — wie gehst du vor?

**Antwort:** Ich würde bewerten, ob tatsächlich mehrere Hersteller künftig integriert werden müssen; bei genuinem Interoperabilitätsbedarf würde ich OPC UA mit einem standardisierten Informationsmodell einsetzen, bei rein einfacher, homogener Telemetrie würde ich bei MQTT bleiben, statt vorschnell die komplexere Lösung zu wählen.

## Praktische Labs

~~~python
# Local, deterministic comparison of a typed OPC-UA-like node vs a flat MQTT-like message (executed locally, no real OPC-UA server):

opcua_node = {"id": "ns=2;s=Sensor1.Temperature", "data_type": "Double", "unit": "Celsius", "value": 21.5}
mqtt_message = {"topic": "building/floor1/room3/temperature", "payload": b"21.5"}

def describe(x):
    if "data_type" in x:
        return f"self-describing: {x['data_type']} in {x['unit']}"
    return "opaque payload: meaning must be known by receiving app in advance"

print(describe(opcua_node))
print(describe(mqtt_message))
~~~

## Dependencies, Cross-References und Quellen

1. OPC Foundation: [OPC Unified Architecture Specification Overview](https://opcfoundation.org/about/opc-technologies/opc-ua/), abgerufen 2026-09-18.
2. Konnex Association: [KNX Standard Overview](https://www.knx.org/knx-en/for-professionals/What-is-KNX/A-brief-introduction/index.php), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0650 (MQTT und Gerätetelemetrie) beschriebenen Transportebene auf und grenzt sich explizit durch semantische Informationsmodellierung davon ab.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| OPC UA FX (Field eXchange) für vereinheitlichte Feldebene-Kommunikation über TSN-Netzwerke | Emerging | Bei künftigen Neuanlagen evaluieren, jedoch bis zur breiteren Herstellerunterstützung weiterhin auf etablierte OPC-UA-Client-Server-Integration setzen. |

Ein Team akzeptiert eine OPC-UA-basierte Integrationsarchitektur erst, wenn die Wahl zwischen semantischer Modellierung und reinem Transport nachweislich anhand des tatsächlichen Interoperabilitätsbedarfs begründet ist.
