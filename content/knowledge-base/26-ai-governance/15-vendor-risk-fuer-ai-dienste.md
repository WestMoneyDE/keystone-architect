---
{"id": "KB-0631", "title": "Vendor Risk für AI-Dienste", "domain": "26", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0623", "concepts": ["SOC 2 und BSI C5"], "needed_for": "understanding"}, {"id": "KB-0620", "concepts": ["DORA und digitale Resilienz"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Datenverwendung, Unterauftragnehmerkette und Service-Lebenszyklus eines konkreten AI-Dienstanbieters anhand etablierter Praxis bewerten und in belastbare Vertragsanforderungen übersetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Vendor-Risk-Bewertung für AI-Dienste die bereits in KB-0623 behandelte Zertifizierungsprüfung und die bereits in KB-0620 behandelte Exit-Fähigkeit auf AI-spezifische Risiken (Datenverwendung für Modelltraining, Unterauftragnehmerketten) erweitert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein AI-Dienstvertrag die tatsächliche Datenverwendung des Anbieters (etwa Nutzung für eigenes Modelltraining) nicht ausreichend regelt, und die daraus resultierende Lücke von einem tatsächlich abgesicherten Vertrag unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Vendor-Risk-Bewertung bei AI-Diensten festlegen, die Datenverwendung, Unterauftragnehmerrisiko und Service-Lifecycle-Ende verbindlich in Vertragsanforderungen übersetzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, juristische Vertragsverhandlung im Detail ist Vertiefung und erfordert juristische Fachberatung.", "rationale": "Kern ist die technische und organisatorische Identifikation AI-spezifischer Vendor-Risiken, nicht die abschließende, juristische Vertragsformulierung."}}, "lab_validation": [{"lab_id": "KB-0631-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung, ob ein AI-Dienstvertrag zentrale Risikodimensionen abdeckt, kein produktives Vendor-Risk-Tool verwendet", "evidence": "Ein lokales Skript prüft eine Liste von AI-Dienstverträgen darauf, ob sie explizite Regelungen zu Datenverwendung für Anbietertraining, Unterauftragnehmeroffenlegung und Exit-/Migrationsunterstützung enthalten, und markiert Verträge mit fehlenden Regelungen als unzureichend abgesichert.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Vendor-Risk-Tool und keine juristische Beratung."}]}
---
# Vendor Risk für AI-Dienste

> **Ziel:** Vendor Risk für AI-Dienste erweitert die bereits in [KB-0623](07-soc-2-und-bsi-c5.md) behandelte allgemeine Anbieterzertifizierungsprüfung und die bereits in [KB-0620](04-dora-und-digitale-resilienz.md) behandelte Exit-Fähigkeit um AI-spezifische Risikodimensionen: die tatsächliche **Datenverwendung** durch den Anbieter (werden die übermittelten Daten tatsächlich nur für den vereinbarten Zweck verarbeitet, oder auch für das eigene Modelltraining des Anbieters genutzt), die Kette der **Unterauftragnehmer** (welche weiteren Anbieter tatsächlich an der Erbringung des AI-Dienstes beteiligt sind, etwa Infrastrukturanbieter oder Basis-Modellanbieter), und der **Service-Lifecycle** (was passiert, wenn der Anbieter einen genutzten Dienst oder ein genutztes Modell einstellt, ein sogenanntes Managed-Service-End-of-Life). Der zentrale Punkt dieses Kapitels ist, dass diese Risiken in konkrete, belastbare **Vertragsanforderungen** übersetzt werden müssen, statt als allgemeine, unverbindliche Erwartungen zu bestehen.

## Zweck, Mental Model und Dependencies

Die tatsächliche Datenverwendung durch einen AI-Dienstanbieter ist ein Risiko, das über die bereits in [KB-0623](07-soc-2-und-bsi-c5.md) behandelte, allgemeine Sicherheitszertifizierung hinausgeht: Ein Anbieter kann formal alle Sicherheitszertifizierungen erfüllen, während er gleichzeitig vertraglich berechtigt ist, übermittelte Nutzeranfragen oder Daten für das eigene, allgemeine Modelltraining zu verwenden — diese Datenverwendung ist ein eigenständiges, vertraglich explizit zu regelndes Risiko, das eine reine Sicherheitszertifizierung nicht abdeckt. Eine Organisation, die AI-Dienste eines Drittanbieters nutzt, muss daher explizit prüfen und vertraglich absichern, ob und unter welchen Bedingungen der Anbieter übermittelte Daten für eigene Zwecke (insbesondere Modelltraining) verwenden darf, statt diese Frage stillschweigend offen zu lassen. Die Kette der Unterauftragnehmer erweitert das bereits in [KB-0442](../18-cloud-foundations/02-shared-responsibility.md) behandelte Shared-Responsibility-Prinzip auf mehrstufige AI-Dienstleistungsketten: Ein AI-Dienst kann selbst auf einem Basis-Modell eines weiteren Anbieters und einer Infrastruktur eines dritten Anbieters aufbauen — die tatsächliche Risikobewertung muss diese gesamte Kette berücksichtigen, nicht nur den direkten Vertragspartner, da ein Risiko oder Ausfall bei einem Unterauftragnehmer tief in der Kette dennoch den tatsächlich genutzten AI-Dienst beeinträchtigen kann. Der Service-Lifecycle, insbesondere ein Managed-Service-End-of-Life, ist ein AI-spezifisches Risiko mit besonderer Dringlichkeit: AI-Modelle und -Dienste werden von Anbietern häufig schneller eingestellt oder durch neue Versionen ersetzt als klassische Infrastrukturdienste, und eine Organisation, die ein genutztes Modell tief in ihre eigenen Prozesse integriert hat, kann bei einer plötzlichen Einstellung erheblichen, kurzfristigen Anpassungsdruck erfahren — diese Anforderung verbindet sich direkt mit der bereits in [KB-0620](04-dora-und-digitale-resilienz.md) behandelten, technisch geprüften Exit-Fähigkeit: Eine Organisation sollte vertraglich und technisch vorbereitet sein, auf ein alternatives Modell oder einen alternativen Anbieter zu wechseln, bevor ein tatsächliches End-of-Life-Ereignis eintritt.

~~~text
Vendor risk for AI services: extends KB-0623's general provider certification check +
  KB-0620's exit capability w/ AI-SPECIFIC risk dimensions
  ACTUAL DATA USE by provider (transmitted data actually processed only for agreed purpose,
    or also used for provider's OWN model training)
  SUBCONTRACTOR CHAIN (which further providers actually involved in delivering the AI service --
    infra providers, base model providers)
  SERVICE LIFECYCLE (what happens when provider discontinues a used service/model --
    Managed Service End-of-Life)
KEY POINT: these risks must translate into concrete, demonstrable CONTRACT REQUIREMENTS
  instead of existing as general, non-binding expectations
ACTUAL DATA USE = risk going BEYOND KB-0623's general security certification
  provider CAN formally satisfy all security certifications while contractually entitled
    to use transmitted user requests/data for own, general model training
  this data use = separate, explicitly contract-regulable risk NOT covered by pure
    security certification
  org using third-party AI services must explicitly check+contractually secure whether/under
    what conditions provider may use transmitted data for own purposes (esp. model training)
    instead of silently leaving this question open
SUBCONTRACTOR CHAIN extends KB-0442's shared-responsibility principle to MULTI-TIER AI
  service delivery chains
  AI service can itself build on a base model of a FURTHER provider + infra of a THIRD provider
  actual risk assessment must consider this ENTIRE chain, not just direct contract partner
  risk/outage at a subcontractor deep in the chain can still affect the actually-used AI service
SERVICE LIFECYCLE, especially Managed Service End-of-Life = AI-specific risk w/ particular urgency
  AI models/services frequently discontinued/replaced by newer versions FASTER than classic
    infra services, by providers
  org having deeply integrated a used model into own processes -> can experience substantial,
    short-term adaptation pressure on sudden discontinuation
  this requirement connects DIRECTLY to KB-0620's technically-verified exit capability
  org should be contractually+technically prepared to switch to alternative model/provider
    BEFORE an actual end-of-life event occurs
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Datenverwendungsklausel | regelt, ob Anbieter Daten für eigenes Training nutzen darf | eigenständiges Risiko über Sicherheitszertifizierung hinaus |
| Unterauftragnehmeroffenlegung | macht mehrstufige AI-Lieferkette transparent | erweitert Shared-Responsibility auf gesamte Kette |
| Managed-Service-EOL-Klausel | regelt Ankündigungsfristen bei Diensteinstellung | Grundlage für rechtzeitige Exit-Vorbereitung |
| Vertragliche Übersetzung | überführt identifizierte Risiken in belastbare Klauseln | verhindert unverbindliche, rein erwartungsbasierte Absicherung |

Implementierung: Jeder AI-Dienstvertrag wird explizit auf eine Datenverwendungsklausel geprüft, die die Nutzung übermittelter Daten für Anbietertraining regelt. Die Unterauftragnehmerkette wird vom Anbieter offengelegt und in die Risikobewertung einbezogen. Verträge enthalten explizite Ankündigungsfristen und Migrationsunterstützung für den Fall eines Managed-Service-End-of-Life.

## Scalability, Reliability, Security und Observability

Vendor-Risk-Bewertung für AI-Dienste skaliert die tatsächliche Absicherung gegen AI-spezifische Lieferantenrisiken proportional zur Konsequenz, mit der Datenverwendung, Unterauftragnehmerkette und Service-Lifecycle in belastbare Vertragsklauseln übersetzt werden; die Reliability-Grenze liegt darin, dass unverbindliche, nicht vertraglich abgesicherte Erwartungen im tatsächlichen Risikofall keinen belastbaren Schutz bieten.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Nutzerdaten werden tatsächlich für das Training des Anbietermodells verwendet, obwohl dies nicht beabsichtigt war | der Vertrag enthielt keine explizite, restriktive Datenverwendungsklausel | eine explizite Datenverwendungsklausel nachverhandeln, die Nutzung für Anbietertraining ausschließt |
| ein Ausfall bei einem tief in der Lieferkette liegenden Unterauftragnehmer beeinträchtigt den genutzten AI-Dienst unerwartet | die Unterauftragnehmerkette wurde nicht vollständig offengelegt oder in die Risikobewertung einbezogen | eine vollständige Unterauftragnehmeroffenlegung vertraglich einfordern und in die Risikobewertung einbeziehen |
| eine plötzliche Diensteinstellung durch den Anbieter trifft die Organisation unvorbereitet | keine vertragliche Ankündigungsfrist oder Exit-Vorbereitung für Managed-Service-EOL existiert | eine explizite Ankündigungsfrist und technisch vorbereitete Exit-Fähigkeit vertraglich vereinbaren |

Security: Die Datenverwendungsklausel sollte mit der bereits in [KB-0618](02-gdpr-und-datenschutzarchitektur.md) behandelten Zweckbindung konsistent sein. Observability: Die tatsächliche Vollständigkeit vertraglicher Regelungen zu Datenverwendung, Unterauftragnehmern und Service-Lifecycle über alle genutzten AI-Dienste ist ein zentrales Signal zur Bewertung der Vendor-Risk-Absicherung.

## Trade-offs und Entscheidungen

**Staff** prüft einen gegebenen AI-Dienstvertrag korrekt auf Datenverwendungs-, Unterauftragnehmer- und Lifecycle-Klauseln. **Principal** entwirft die vollständige Vendor-Risk-Bewertungsstrategie für AI-Dienste mit Vertragsanforderungen für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Vendor-Risk bei AI-Diensten fest, die AI-spezifische Risiken verbindlich in Vertragsklauseln übersetzen.

Anti-Patterns: einen AI-Dienstvertrag ohne explizite Datenverwendungsklausel abschließen und dadurch die Nutzung übermittelter Daten für Anbietertraining offen lassen; die Unterauftragnehmerkette eines AI-Dienstes nicht offenlegen oder bewerten; einen AI-Dienst ohne vertragliche Ankündigungsfrist oder Exit-Vorbereitung für ein mögliches End-of-Life nutzen.

## Production Checklist

- [ ] Jeder AI-Dienstvertrag enthält eine explizite Datenverwendungsklausel, die Anbietertraining regelt.
- [ ] Die Unterauftragnehmerkette ist offengelegt und in die Risikobewertung einbezogen.
- [ ] Verträge enthalten explizite Ankündigungsfristen für Managed-Service-End-of-Life.
- [ ] Eine technisch vorbereitete Exit-Fähigkeit zu einem alternativen Anbieter existiert für kritische AI-Dienste.

## Interviewfragen

### 1. Warum reicht eine allgemeine Sicherheitszertifizierung nicht aus, um das Datenverwendungsrisiko bei AI-Diensten abzudecken?

**Antwort:** Weil ein Anbieter formal alle Sicherheitszertifizierungen erfüllen kann, während er gleichzeitig vertraglich berechtigt ist, übermittelte Daten für eigenes Modelltraining zu verwenden — dies ist ein eigenständiges, separat zu regelndes Risiko.

### 2. Warum muss die Unterauftragnehmerkette eines AI-Dienstes in die Risikobewertung einbezogen werden?

**Antwort:** Weil ein AI-Dienst selbst auf Basis-Modellen und Infrastruktur weiterer Anbieter aufbauen kann, und ein Risiko oder Ausfall tief in dieser Kette den tatsächlich genutzten Dienst beeinträchtigen kann.

### 3. Warum ist Managed-Service-End-of-Life bei AI-Diensten ein besonders dringliches Risiko?

**Antwort:** Weil AI-Modelle und -Dienste häufig schneller eingestellt oder ersetzt werden als klassische Infrastrukturdienste, was bei tiefer Integration erheblichen, kurzfristigen Anpassungsdruck erzeugen kann.

### 4. Wie verbindet sich die Managed-Service-EOL-Anforderung mit der bereits behandelten DORA-Exit-Fähigkeit?

**Antwort:** Eine Organisation sollte vertraglich und technisch vorbereitet sein, auf ein alternatives Modell oder einen alternativen Anbieter zu wechseln, bevor ein tatsächliches End-of-Life-Ereignis eintritt, analog zur technisch geprüften Exit-Fähigkeit aus DORA.

### 5. Wie gehst du vor, wenn Nutzerdaten tatsächlich für das Training des Anbietermodells verwendet werden, obwohl dies nicht beabsichtigt war?

**Antwort:** Ich prüfe, ob der Vertrag eine explizite, restriktive Datenverwendungsklausel enthielt, und verhandle eine solche Klausel nach, die die Nutzung für Anbietertraining explizit ausschließt.

### 6. Widersprüchliche Anforderung: Ein Fachbereich will schnell einen neuen, innovativen AI-Dienst nutzen UND die Organisation will vollständige Vendor-Risk-Prüfung vor jeder neuen Nutzung — wie gehst du vor?

**Antwort:** Ich würde einen standardisierten, beschleunigten Prüfprozess mit einer Kernprüfung der wichtigsten Risikodimensionen (Datenverwendung, kritische Unterauftragnehmer, Exit-Fähigkeit) etablieren, statt entweder die Nutzung ungeprüft zuzulassen oder jede neue Nutzung durch eine langwierige, vollständige Prüfung zu verzögern.

## Praktische Labs

~~~python
# Local, deterministic simulation of checking AI vendor contract completeness (executed locally, no real vendor risk tool):

def check_vendor_contract(contract):
    checks = {
        "data_use_clause": contract.get("data_use_for_training") is not None,
        "subcontractor_disclosure": contract.get("subcontractors") is not None,
        "eol_notice_period": contract.get("eol_notice_days") is not None,
    }
    return {"vendor": contract["vendor"], "checks": checks, "fully_covered": all(checks.values())}

contracts = [
    {"vendor": "AIProviderA", "data_use_for_training": "prohibited", "subcontractors": ["CloudInfraX"], "eol_notice_days": 180},
    {"vendor": "AIProviderB", "data_use_for_training": None, "subcontractors": None, "eol_notice_days": None},
]

for c in contracts:
    print(check_vendor_contract(c))
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [AI Risk Management Framework (AI RMF 1.0) — Third-Party Considerations](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-18.
2. Cloud Security Alliance (CSA): [AI Organizational Responsibilities and Vendor Assessment](https://cloudsecurityalliance.org/artificial-intelligence), abgerufen 2026-09-18.

SOC 2 und BSI C5 sind kanonisch in [KB-0623](07-soc-2-und-bsi-c5.md) behandelt; DORA und digitale Resilienz in [KB-0620](04-dora-und-digitale-resilienz.md); Shared Responsibility in [KB-0442](../18-cloud-foundations/02-shared-responsibility.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, branchenweite AI-Vendor-Risk-Fragebögen zur Beschleunigung der Datenverwendungs- und Unterauftragnehmerprüfung | Evaluating | Als Ausgangspunkt für die eigene Prüfung nutzen, jedoch die tatsächliche, vertragliche Absicherung weiterhin individuell für jeden genutzten AI-Dienst verifizieren, statt sich allein auf standardisierte Antworten zu verlassen. |

Ein Team akzeptiert eine Vendor-Risk-Bewertung für einen AI-Dienst erst, wenn Datenverwendung, Unterauftragnehmerkette und Managed-Service-Lifecycle nachweislich in belastbare Vertragsklauseln übersetzt sind.
