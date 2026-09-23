---
{"id": "KB-0268", "title": "Verwaltete Modellplattformen", "domain": "11", "sequence": 28, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0256", "concepts": ["Lokale und verwaltete Inferenz"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Endpunkt-Auswahl anhand Regionsverfügbarkeit und Zugangskontrollanforderungen lokal implementieren.", "rationale": "Der Zusammenhang zwischen Regionsverfügbarkeit, Zugangskontrolle und tatsächlicher Endpunktwahl wird erst durch konkrete Entscheidungslogik greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Auswahl einer verwalteten Modellplattform für einen konkreten Unternehmensintegrationsfall begründet gestalten, mit Bewusstsein für Service-Lifecycle-Risiken.", "rationale": "Verwaltete Plattformen unterscheiden sich in Katalogbreite, Unternehmensintegrationsfähigkeit und Lifecycle-Stabilität, was explizite Prüfung erfordert."}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Regionsverfügbarkeitseinschränkung auf fehlende vorherige Prüfung statt auf einen Plattformfehler zurückführen können.", "rationale": "Modellverfügbarkeit variiert oft nach Region, was bei der Architekturplanung explizit geprüft werden muss, statt global einheitliche Verfügbarkeit anzunehmen."}, "CHIEF-TARGET": {"active": true, "scope": "Verwaltete Modellplattformen als Unternehmensintegrationsentscheidung mit Region-, Zugangs- und Lifecycle-Implikationen positionieren, deren Details zwingend gegen aktuelle Primärquellen zu verifizieren sind.", "rationale": "Plattformangebote entwickeln sich schnell weiter; Architekturentscheidungen dürfen sich nicht auf möglicherweise veraltete Angaben verlassen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Aktuelle, konkrete Modellkataloge und Preislisten einzelner Plattformen sind bewusst nicht Teil dieser Datei, da sie sich schnell ändern.", "rationale": "Diese Datei behandelt das Vergleichsprinzip (Kataloge, Endpunkte, Integration), nicht eine Momentaufnahme konkreter, schnell veraltender Angebotsdetails."}}, "lab_validation": [{"lab_id": "KB-0268-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Endpunkt-Auswahl anhand Regionsverfügbarkeit und Zugangskontrollanforderungen", "evidence": "Eine Modellplattform-Auswahl, die Regionsverfügbarkeit und Zugangskontrollanforderungen explizit prüft, kann inkompatible Endpunkte vor der Architekturentscheidung ausschließen, statt dies erst bei tatsächlicher Integration zu entdecken.", "limitations": "Kein echtes produktives Plattformsystem, keine reale Regionskonfiguration, keine Produktion."}]}
---
# Verwaltete Modellplattformen

> **Ziel:** Verwaltete Modellplattformen unterscheiden sich in Katalogbreite (welche Modelle verfügbar sind), Endpunktarchitektur und Unternehmensintegrationsfähigkeit (aufbauend auf Grundlagen verwalteter Inferenz, siehe [KB-0256](16-lokale-und-verwaltete-inferenz.md)) — Regionsverfügbarkeit, Zugangskontrollen und Service-Lifecycle-Details entwickeln sich schnell weiter und müssen zwingend gegen aktuelle Primärquellen verifiziert werden, statt sich auf möglicherweise veraltete Angaben zu verlassen.

## Zweck, Mental Model und Dependencies

Kataloge beschreiben, welche Modelle (unterschiedlicher Anbieter, unterschiedlicher Größen und Spezialisierungen) über eine verwaltete Plattform tatsächlich zugänglich sind — Plattformen unterscheiden sich erheblich in Breite und Aktualität ihres Katalogs, was direkt die verfügbare Modellauswahl für eine Anwendung einschränkt oder erweitert. Endpunkte beschreiben die technische Zugriffsschnittstelle (API-Struktur, Authentifizierungsmechanismus, unterstützte Funktionen wie Function Calling oder strukturierte Ausgaben) — unterschiedliche Plattformen bieten unterschiedliche Endpunkt-Charakteristika, auch für dasselbe zugrunde liegende Modell. Unternehmensintegration betrifft, wie gut eine Plattform sich in bestehende Unternehmensinfrastruktur einfügt (Identity-Provider-Integration, Netzwerkarchitektur, bestehende Cloud-Verträge). Regionsverfügbarkeit ist ein häufig übersehener, aber praktisch entscheidender Faktor: nicht jedes Modell ist in jeder geografischen Region verfügbar, was direkte Auswirkungen auf Datenresidenz-Anforderungen und Latenz haben kann. Zugangskontrollen (welche Authentifizierungs- und Autorisierungsmechanismen eine Plattform unterstützt) müssen gegen bestehende Unternehmens-Identity-Infrastruktur geprüft werden. Service-Lifecycle (wie eine Plattform Modellversionen einführt, pflegt und deprecatet, verwandt mit API-EOL-Risiken, siehe [KB-0251](11-providerabstraktion-und-portabilitaet.md)) bestimmt langfristige Stabilität. Der zentrale, wiederkehrende Punkt ist, dass diese Details sich bei allen großen Plattformanbietern kontinuierlich weiterentwickeln — jede konkrete Aussage über aktuelle Modellverfügbarkeit, Regionsabdeckung oder Preisstruktur muss zwingend gegen die aktuelle Primärdokumentation des jeweiligen Anbieters verifiziert werden, bevor sie einer Architekturentscheidung zugrunde gelegt wird.

~~~text
Catalog breadth:        which models are actually accessible through this platform? Varies significantly.
Endpoint architecture:   API structure, auth, supported features (function calling, structured outputs)
Enterprise integration:  identity provider fit, network architecture, existing cloud contract alignment
Region availability:      NOT globally uniform - directly affects data residency and latency options
Access controls:          must align with existing enterprise identity infrastructure
Service lifecycle:        how are model versions introduced/maintained/deprecated? (see KB-0251 for EOL risk)
ALL of these evolve rapidly - verify against CURRENT primary sources before any architecture decision
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Katalogaktualität | ist die tatsächlich aktuelle Modellverfügbarkeit gegen die Primärquelle geprüft, nicht aus Erinnerung angenommen? | veraltete Katalogannahmen führen zu Architekturentscheidungen basierend auf nicht mehr verfügbaren Modellen |
| Regionsverfügbarkeitsprüfung | ist geprüft, ob das benötigte Modell in der relevanten Region tatsächlich verfügbar ist? | unerwartete Regionseinschränkung wird erst bei tatsächlicher Integration entdeckt, nicht vorab geplant |
| Zugangskontroll-Kompatibilität | ist geprüft, ob die Plattform-Zugangskontrolle mit bestehender Unternehmens-Identity-Infrastruktur kompatibel ist? | inkompatible Zugangskontrolle erzeugt zusätzlichen Integrationsaufwand oder Sicherheitslücken |
| Service-Lifecycle-Transparenz | ist bekannt, wie die Plattform Modellversionen einführt und deprecatet? | fehlendes Verständnis des Lifecycle-Prozesses führt zu unerwarteten Breaking Changes bei Modellversion-Updates |

Implementierung: vor jeder Plattformentscheidung wird die tatsächliche, aktuelle Modellkatalogverfügbarkeit gegen die primäre Anbieterdokumentation geprüft, nicht aus Erinnerung oder veralteten internen Notizen übernommen. Regionsverfügbarkeit wird explizit für die tatsächlich relevanten geografischen Anforderungen der Anwendung geprüft, bevor eine Architekturentscheidung getroffen wird, mit Bewusstsein dafür, dass sich Regionsangebote über Zeit ändern können. Zugangskontroll-Mechanismen der Plattform werden gegen die bestehende Unternehmens-Identity-Infrastruktur geprüft, um Kompatibilität sicherzustellen, bevor eine tiefere Integration erfolgt. Service-Lifecycle-Prozesse (Ankündigungsfristen für Deprecation, Versionierungspolitik) werden vor einer langfristigen Verpflichtung geprüft und dokumentiert, ähnlich der Providerabstraktions-Prinzipien für API-EOL-Risiken.

## Scalability, Reliability, Security und Observability

Verwaltete Modellplattformen mit breitem Katalog und guter Unternehmensintegration skalieren Modellzugriff über wachsende Anzahl interner Teams und Anwendungsfälle, indem sie eine konsistente, bereits in die Unternehmensinfrastruktur integrierte Schnittstelle bereitstellen. Reliability-Grenze: eine Architekturentscheidung, die auf veralteten Annahmen über Regionsverfügbarkeit oder Katalogumfang basiert, ist ein latentes Risiko, das erst bei tatsächlicher Integration oder Skalierung in eine bisher nicht geprüfte Region sichtbar wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein benötigtes Modell ist in der geplanten Zielregion unerwartet nicht verfügbar | Regionsverfügbarkeit wurde vor der Architekturentscheidung nicht gegen aktuelle Primärquellen geprüft | aktuelle Regionsverfügbarkeitsdokumentation des Anbieters für das konkrete Modell und die Zielregion prüfen |
| Integration mit bestehender Unternehmens-Identity-Infrastruktur erfordert unerwarteten Zusatzaufwand | Zugangskontroll-Kompatibilität wurde vor der Plattformentscheidung nicht ausreichend geprüft | Plattform-Authentifizierungsmechanismus gegen bestehende Identity-Provider-Anforderungen vergleichen |
| ein Modellversion-Update bricht unerwartet bestehende Integration | Service-Lifecycle-Prozess der Plattform war vor der Entscheidung nicht ausreichend bekannt | Lifecycle-/Deprecation-Dokumentation der Plattform auf tatsächliche Ankündigungsfristen und Versionierungspolitik prüfen |
| eine Architekturentscheidung basiert auf einem Modell, das inzwischen nicht mehr im Katalog verfügbar ist | Katalogannahme war zum Entscheidungszeitpunkt bereits veraltet oder wurde nicht gegen aktuelle Quelle geprüft | aktuellen Modellkatalog der Plattform gegen die ursprüngliche Entscheidungsgrundlage vergleichen |

Security: Zugangskontroll-Kompatibilität ist nicht nur eine Integrationsfrage, sondern eine Sicherheitsfrage — eine Plattform, deren Zugangskontrolle nicht angemessen mit bestehender Unternehmens-Identity-Governance integriert werden kann, kann zu inkonsistenten oder unzureichenden Zugriffskontrollen führen. Observability: tatsächliche Katalogverfügbarkeit gegen genutzte Modelle, Regionsverteilung der Nutzung und Häufigkeit von Service-Lifecycle-bedingten Anpassungsbedarfen sind zentrale Metriken für die Beziehung zu einer verwalteten Modellplattform.

## Trade-offs und Entscheidungen

**Staff** prüft Regionsverfügbarkeit und Zugangskontroll-Kompatibilität explizit vor jeder Plattformentscheidung. **Principal** macht Service-Lifecycle-Prozesse für das Team nachvollziehbar dokumentiert. **Chief** positioniert die Wahl einer verwalteten Modellplattform als Unternehmensintegrationsentscheidung, deren Details zwingend gegen aktuelle Primärquellen zu verifizieren sind, nicht als einmalige, auf möglicherweise veralteten Annahmen basierende Wahl.

Anti-Patterns: Architekturentscheidungen auf Basis erinnerter oder veralteter Katalog-/Regionsangaben treffen, ohne aktuelle Primärquelle zu prüfen; Zugangskontroll-Kompatibilität erst nach der Plattformentscheidung prüfen; Service-Lifecycle-Prozesse nicht vor einer langfristigen Verpflichtung verstehen.

## Production Checklist

- [ ] Modellkatalogverfügbarkeit ist gegen aktuelle Primärquelle geprüft, nicht aus Erinnerung angenommen.
- [ ] Regionsverfügbarkeit ist für die tatsächlich relevanten geografischen Anforderungen geprüft.
- [ ] Zugangskontroll-Kompatibilität mit bestehender Unternehmens-Identity-Infrastruktur ist geprüft.
- [ ] Service-Lifecycle-Prozesse der Plattform sind vor langfristiger Verpflichtung verstanden.

## Interviewfragen

### 1. Warum müssen Aussagen über Modellkatalog und Regionsverfügbarkeit zwingend gegen aktuelle Primärquellen verifiziert werden?

**Antwort:** Verwaltete Modellplattformen entwickeln ihre Angebote kontinuierlich weiter; eine Architekturentscheidung, die auf veralteten oder erinnerten Angaben basiert, kann auf inzwischen nicht mehr zutreffenden Annahmen beruhen, was erst bei tatsächlicher Integration als Problem sichtbar wird.

### 2. Warum ist Regionsverfügbarkeit ein oft übersehener, aber praktisch entscheidender Faktor?

**Antwort:** Nicht jedes Modell ist in jeder geografischen Region verfügbar; dies hat direkte Auswirkungen auf Datenresidenz-Anforderungen und Latenz, wird aber oft erst bei tatsächlicher Integration statt vorab bei der Architekturplanung geprüft.

### 3. Warum ist Zugangskontroll-Kompatibilität nicht nur eine technische Integrationsfrage, sondern eine Sicherheitsfrage?

**Antwort:** Eine Plattform, deren Zugangskontrolle nicht angemessen mit bestehender Unternehmens-Identity-Governance integriert werden kann, kann zu inkonsistenten oder unzureichenden Zugriffskontrollen führen, was über eine reine technische Integrationsherausforderung hinausgeht.

### 4. Wie diagnostizierst du, dass eine Architekturentscheidung auf veralteten Katalogannahmen basiert?

**Antwort:** Ich vergleiche den aktuellen Modellkatalog der Plattform gegen die ursprüngliche Entscheidungsgrundlage — wenn das ursprünglich geplante Modell inzwischen nicht mehr verfügbar oder durch eine neue Version ersetzt ist, bestätigt das eine veraltete Annahme zum Entscheidungszeitpunkt.

### 5. Warum ist Service-Lifecycle-Verständnis vor einer langfristigen Plattformverpflichtung wichtig?

**Antwort:** Unterschiedliche Plattformen haben unterschiedliche Ankündigungsfristen und Versionierungspolitiken für Modell-Deprecation; ohne dieses Verständnis können Modellversion-Updates unerwartete Breaking Changes für bestehende Integrationen erzeugen.

### 6. Widersprüchliche Anforderung: Team will eine langfristig stabile, unveränderliche Plattformentscheidung treffen UND Zugriff auf die jeweils neuesten, leistungsfähigsten verfügbaren Modelle haben — wie gehst du vor?

**Antwort:** Ich würde erklären, dass langfristige Stabilität und Zugriff auf neueste Modelle in einem gewissen Spannungsverhältnis stehen, da Plattformen ihre Kataloge kontinuierlich weiterentwickeln; ich würde eine Providerabstraktionsschicht vorschlagen, die stabile Anwendungsschnittstellen von der zugrunde liegenden, sich entwickelnden Plattform trennt, sodass neue Modelle genutzt werden können, ohne die Anwendungsarchitektur bei jeder Plattformänderung neu zu gestalten.

## Praktische Labs

~~~python
# Platform selection decision model checking region and access control compatibility
platform_catalog = {
    "region_availability": {"eu-west": ["model_a", "model_b"], "us-east": ["model_a", "model_b", "model_c"]},
    "supported_auth": {"saml", "oidc"},
}

def check_platform_fit(required_model, required_region, enterprise_auth_method):
    available_models = platform_catalog["region_availability"].get(required_region, [])
    if required_model not in available_models:
        return False, f"'{required_model}' not available in region '{required_region}'"
    if enterprise_auth_method not in platform_catalog["supported_auth"]:
        return False, f"enterprise auth method '{enterprise_auth_method}' not supported by platform"
    return True, "platform fit confirmed"

scenarios = [
    ("model_c", "eu-west", "oidc"),   # model not available in this region
    ("model_a", "eu-west", "ldap"),    # auth method not supported
    ("model_a", "eu-west", "saml"),    # valid combination
]

for model, region, auth in scenarios:
    ok, message = check_platform_fit(model, region, auth)
    print(f"model={model}, region={region}, auth={auth} -> {'FIT' if ok else 'MISMATCH'}: {message}")

ok, _ = check_platform_fit("model_c", "eu-west", "oidc")
assert ok is False
print("\nRegion and auth mismatches are caught during PLANNING, before committing to a platform integration.")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft: [Azure AI Foundry Model Catalog](https://learn.microsoft.com/en-us/azure/ai-foundry/), abgerufen 2026-09-17.
2. AWS: [Amazon Bedrock Model Access and Regions](https://docs.aws.amazon.com/bedrock/latest/userguide/models-regions.html), abgerufen 2026-09-17.
3. Google Cloud: [Vertex AI Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models), abgerufen 2026-09-17.

Grundlagen zu lokaler versus verwalteter Inferenz sind kanonisch in [KB-0256](16-lokale-und-verwaltete-inferenz.md) behandelt. Providerabstraktions-/EOL-Grundlagen sind in [KB-0251](11-providerabstraktion-und-portabilitaet.md) behandelt. Konkrete Kataloge, Regionsangaben und Zugangskontrollmechanismen entwickeln sich schnell weiter — vor jeder Architekturentscheidung zwingend an aktueller Primärdokumentation der jeweiligen Plattform prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Vereinheitlichte Model-Garden-/Marketplace-Ansätze mit Modellen mehrerer Anbieter auf einer Plattform | Adopting | Gegenüber Einzelanbieter-Integrationen für Flexibilität bei der Modellwahl evaluieren, mit Prüfung der tatsächlichen Katalogtiefe. |
| Erweiterte Governance-Werkzeuge für zentrale Modellzugriffsverwaltung über mehrere Teams und Regionen | Adopting | Für Organisationen mit vielen Teams gegenüber dezentraler, teamindividueller Plattformnutzung bevorzugen. |

Ein Team akzeptiert eine verwaltete Modellplattform-Entscheidung erst, wenn Katalog-, Regions- und Zugangskontroll-Kompatibilität nachweisbar gegen aktuelle Primärquellen geprüft sind.
