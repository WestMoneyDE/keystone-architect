---
{"id": "KB-0377", "title": "AI-Lifecycle und Stilllegung", "domain": "15", "sequence": 27, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0373", "concepts": ["Model Governance im Delivery-Prozess"], "needed_for": "understanding"}], "related": ["KB-0358"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Vor einer simulierten Modell-Stilllegung alle produktiven Verbraucher eines Modells über die Lineage-Kette identifizieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Lifecycle-Prozess gestalten, der Provider-EOL-Ankündigungen, Datenlöschung und Nachweisaufbewahrung als geplante, nicht reaktive Schritte behandelt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Vor einer geplanten Stilllegung eines Modells oder Providers alle abhängigen produktiven Systeme identifizieren, die sonst unbemerkt ausfallen würden.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Geplante Stilllegung mit vollständiger Verbraucher-Identifikation als verpflichtenden Bestandteil des AI-Lifecycles im Unternehmen etablieren, statt Stilllegung als nachträgliche, reaktive Aufräumaktion zu behandeln.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die rechtliche Detailprüfung branchenspezifischer Aufbewahrungsfristen ist Vertiefung.", "rationale": "Kern ist der strukturierte Lifecycle-Prozess und die Verbraucher-Identifikation, nicht die juristische Detailprüfung jeder Aufbewahrungsfrist."}}, "lab_validation": [{"lab_id": "KB-0377-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Stilllegungsszenario mit mehreren abhängigen produktiven Verbrauchern eines Modells", "evidence": "Eine simulierte Modell-Stilllegung ohne vorherige Verbraucher-Identifikation würde ein noch aktives, abhängiges Produktionssystem unbemerkt funktionsunfähig machen; eine Abfrage der Lineage-Kette vor der Stilllegung identifiziert dieses System rechtzeitig und ermöglicht eine koordinierte Migration statt eines ungeplanten Ausfalls.", "limitations": "Kein produktives Lifecycle-Management-System, kein realer Geschäftsdatensatz, künstlich konstruiertes Szenario."}]}
---
# AI-Lifecycle und Stilllegung

> **Ziel:** Der AI-Lifecycle verbindet Entwicklung, Betrieb und Außerbetriebnahme (Stilllegung) eines Modells oder einer AI-Komponente zu einem durchgängigen, geplanten Prozess, aufbauend auf Model Governance (siehe [KB-0373](23-model-governance-im-delivery-prozess.md)) und Lineage-Nachvollziehbarkeit (siehe [KB-0358](08-ai-lineage-und-abhaengigkeiten.md)). Der zentrale Punkt dieses Kapitels ist, drei spezifische Stilllegungsrisiken — Provider-End-of-Life (EOL), Datenlöschung und Nachweisaufbewahrung — als geplante, vorausschauende Lebenszyklusschritte statt als reaktive Notfallmaßnahmen zu behandeln, und produktive Verbraucher eines Modells vollständig zu identifizieren, bevor eine Stilllegung erfolgt.

## Zweck, Mental Model und Dependencies

Provider-EOL (End-of-Life) tritt auf, wenn ein extern gehosteter LLM-Provider ankündigt, ein bestimmtes Modell oder eine API-Version zu einem festen Datum einzustellen — ohne geplante Reaktion auf diese Ankündigung riskiert ein Unternehmen einen unkontrollierten Ausfall aller Systeme, die auf dieser Provider-Komponente basieren. Datenlöschung betrifft die Frage, welche mit einem Modell verbundenen Daten (Trainingsdaten, Logs, protokollierte Interaktionen) bei Stilllegung gelöscht werden müssen (z. B. aus Datenschutzgründen) und welche aus anderen Gründen (Nachweisaufbewahrung) erhalten bleiben müssen — diese beiden Anforderungen können in Spannung zueinander stehen und müssen explizit abgewogen werden. Nachweisaufbewahrung bezeichnet die Notwendigkeit, bestimmte Belege (z. B. dokumentierte Testergebnisse, Freigabeentscheidungen, siehe [KB-0376](26-approval-workflows-fuer-ai-releases.md)) auch nach Stilllegung eines Modells für einen definierten Zeitraum aufzubewahren, etwa für spätere Audits oder rechtliche Anfragen. Der zentrale methodische Punkt ist die vollständige Identifikation produktiver Verbraucher vor einer Stilllegung: über die Lineage-Kette (siehe [KB-0358](08-ai-lineage-und-abhaengigkeiten.md)) wird geprüft, welche Systeme, Workflows oder nachgelagerten Prozesse tatsächlich noch auf das stillzulegende Modell zugreifen — ohne diese Prüfung kann eine Stilllegung ein noch aktiv genutztes System unbemerkt funktionsunfähig machen, was einen ungeplanten Produktionsausfall statt einer koordinierten Migration zur Folge hat.

~~~text
Provider EOL: external provider announces discontinuation of a model/API version at a fixed date
  -> unplanned response = uncontrolled outage of everything depending on it
Data deletion vs. evidence retention: TENSION
  data deletion: privacy/compliance may REQUIRE deleting certain data at decommission
  evidence retention: audits/legal inquiries may REQUIRE keeping certain records (approvals, test results) for a defined period
  -> must be explicitly reconciled, not resolved by defaulting to either "delete everything" or "keep everything"
CRITICAL STEP BEFORE DECOMMISSION: identify ALL productive consumers via the lineage chain (KB-0358)
  -> without this: decommissioning silently breaks a still-active dependent system -> unplanned outage, not coordinated migration
~~~

## Core Concepts, Architektur und Implementierung

| Lifecycle-Risiko | Was ohne Planung passiert | Notwendige vorausschauende Maßnahme |
|---|---|---|
| Provider-EOL | unkontrollierter Ausfall bei Erreichen des Einstellungsdatums | EOL-Ankündigungen aktiv verfolgen und Migrationsplan vor dem Stichtag erstellen |
| Datenlöschung vs. Nachweisaufbewahrung | widersprüchliche oder unbegründete Löschentscheidungen | explizite Abwägung und dokumentierte Aufbewahrungsfristen je Datentyp |
| Fehlende Verbraucher-Identifikation | unbemerkter Ausfall abhängiger produktiver Systeme | Lineage-Kette vor jeder Stilllegung vollständig abfragen |

Implementierung: EOL-Ankündigungen genutzter externer Provider werden aktiv überwacht, und bei Ankündigung einer Einstellung wird rechtzeitig vor dem Stichtag ein Migrationsplan erstellt. Vor jeder geplanten Stilllegung einer eigenen Modellkomponente wird die Lineage-Kette (siehe [KB-0358](08-ai-lineage-und-abhaengigkeiten.md)) vollständig abgefragt, um alle produktiven Verbraucher zu identifizieren; diese werden über die geplante Stilllegung informiert und erhalten Gelegenheit zur koordinierten Migration, bevor die Stilllegung erfolgt. Für jeden Datentyp, der mit dem stillzulegenden Modell verbunden ist, wird explizit entschieden und dokumentiert, ob er aus Datenschutzgründen gelöscht oder aus Nachweisgründen für einen definierten Zeitraum aufbewahrt werden muss.

## Scalability, Reliability, Security und Observability

Geplante Lifecycle-Prozesse skalieren Stilllegungssicherheit proportional zur Vollständigkeit der Verbraucher-Identifikation; die Reliability-Grenze liegt darin, dass eine unvollständige Lineage-Abfrage proportional zur Anzahl unentdeckter Abhängigkeiten das Risiko unbemerkter Produktionsausfälle bei Stilllegung erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Systemkomponente fällt unerwartet aus, nachdem ein externer Provider eine Modellversion eingestellt hat | die EOL-Ankündigung des Providers wurde nicht rechtzeitig verfolgt oder es wurde kein Migrationsplan erstellt | ein systematisches Monitoring von Provider-EOL-Ankündigungen einführen und rechtzeitig Migrationspläne erstellen |
| ein nach Stilllegung eines Modells noch aktives System funktioniert plötzlich nicht mehr | die Lineage-Kette wurde vor der Stilllegung nicht vollständig abgefragt, wodurch dieser Verbraucher unentdeckt blieb | vor zukünftigen Stilllegungen die Lineage-Kette systematisch und vollständig abfragen |
| bei einem späteren Audit fehlen erforderliche Nachweise zu einem bereits stillgelegten Modell | keine explizite Nachweisaufbewahrungsfrist wurde vor der Stilllegung festgelegt und eingehalten | für zukünftige Stilllegungen explizite Aufbewahrungsfristen je Datentyp vor der Stilllegung festlegen |

Security: Eine unvollständige Datenlöschung bei Stilllegung kann ein Datenschutzrisiko darstellen, während eine übermäßige, unbegründete Löschung die Fähigkeit zur nachträglichen Rechenschaftslegung bei sicherheitsrelevanten Vorfällen einschränkt — beide Extreme sind zu vermeiden. Observability: Der Anteil geplanter Stilllegungen mit vollständiger Verbraucher-Identifikation, dokumentierte Aufbewahrungsfristen je Datentyp, und die Vorlaufzeit zwischen Provider-EOL-Ankündigung und abgeschlossener Migration sind zentrale Lifecycle-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine vollständige Lineage-Abfrage vor jeder geplanten Stilllegung. **Principal** macht Datenlöschungs- und Aufbewahrungsentscheidungen für das Team nachvollziehbar. **Chief** etabliert geplante Stilllegung mit vollständiger Verbraucher-Identifikation als verpflichtenden Bestandteil des AI-Lifecycles im Unternehmen, statt Stilllegung als reaktive Aufräumaktion zu behandeln.

Anti-Patterns: eine Modellkomponente stilllegen, ohne vorher alle produktiven Verbraucher über die Lineage-Kette zu identifizieren; Provider-EOL-Ankündigungen ignorieren, bis ein tatsächlicher Ausfall eintritt; Datenlöschungs- und Nachweisaufbewahrungsentscheidungen pauschal statt differenziert je Datentyp treffen.

## Production Checklist

- [ ] Provider-EOL-Ankündigungen werden aktiv überwacht, mit rechtzeitiger Migrationsplanung.
- [ ] Vor jeder Stilllegung wird die Lineage-Kette vollständig abgefragt, um produktive Verbraucher zu identifizieren.
- [ ] Datenlöschungs- und Nachweisaufbewahrungsentscheidungen sind je Datentyp explizit dokumentiert.
- [ ] Identifizierte Verbraucher erhalten Gelegenheit zur koordinierten Migration vor der Stilllegung.

## Interviewfragen

### 1. Was ist Provider-EOL, und warum ist eine geplante Reaktion darauf wichtig?

**Antwort:** Die Ankündigung eines externen Providers, ein Modell oder eine API-Version zu einem festen Datum einzustellen; ohne geplante Reaktion riskiert man einen unkontrollierten Ausfall aller darauf basierenden Systeme.

### 2. Welche Spannung besteht zwischen Datenlöschung und Nachweisaufbewahrung bei einer Stilllegung?

**Antwort:** Datenschutzanforderungen können die Löschung bestimmter Daten erfordern, während Audit- oder Rechtsanforderungen die Aufbewahrung bestimmter Nachweise für einen definierten Zeitraum erfordern; beides muss explizit abgewogen werden.

### 3. Warum ist die vollständige Identifikation produktiver Verbraucher vor einer Stilllegung kritisch?

**Antwort:** Ohne diese Prüfung kann eine Stilllegung ein noch aktiv genutztes System unbemerkt funktionsunfähig machen, was einen ungeplanten Produktionsausfall statt einer koordinierten Migration verursacht.

### 4. Wie identifizierst du produktive Verbraucher eines stillzulegenden Modells?

**Antwort:** Über die Lineage-Kette (siehe KB-0358), die dokumentiert, welche produktiven Antworten und nachgelagerten Systeme tatsächlich auf das jeweilige Modell zugreifen.

### 5. Wie gehst du vor, wenn nach einer Stilllegung ein noch aktives System plötzlich nicht mehr funktioniert?

**Antwort:** Ich prüfe, ob die Lineage-Kette vor der Stilllegung vollständig abgefragt wurde, und stelle sicher, dass zukünftige Stilllegungen diese Prüfung systematisch durchführen, um solche unentdeckten Abhängigkeiten zu vermeiden.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Stilllegung veralteter Modelle UND garantiert keine unbemerkten Produktionsausfälle — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte Lineage-Abfrage als verpflichtenden, aber schnellen ersten Schritt vor jeder Stilllegung etablieren, die alle produktiven Verbraucher automatisch identifiziert und benachrichtigt, sodass die Stilllegung selbst zügig erfolgen kann, sobald keine unmigrierten Abhängigkeiten mehr bestehen.

## Praktische Labs

~~~python
lineage_records = [
    {"response_id": "resp_1", "model_version": "model_v1"},
    {"response_id": "resp_2", "model_version": "model_v2"},
    {"response_id": "resp_3", "model_version": "model_v1"},
]

active_consumers = {
    "model_v1": ["customer_support_bot", "internal_search_tool"],
}

def find_productive_consumers(model_to_decommission):
    still_referenced = any(r["model_version"] == model_to_decommission for r in lineage_records[-10:])
    consumers = active_consumers.get(model_to_decommission, [])
    return still_referenced, consumers

def plan_decommission(model_to_decommission, retention_requirements):
    still_referenced, consumers = find_productive_consumers(model_to_decommission)
    if still_referenced and consumers:
        print(f"BLOCKED: {model_to_decommission} still has active consumers: {consumers}")
        print("ACTION: notify consumers and coordinate migration before decommissioning.")
        return False
    print(f"Safe to decommission {model_to_decommission}. Applying retention rules:")
    for data_type, action in retention_requirements.items():
        print(f"  {data_type}: {action}")
    return True

plan_decommission("model_v1", {
    "training_data": "delete (privacy requirement)",
    "approval_records": "retain for 3 years (audit requirement)",
})
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-17.
2. ISO/IEC: [ISO/IEC 5055 — Automated Source Code Quality Measures](https://www.iso.org/standard/80623.html), abgerufen 2026-09-17.

AI-Lineage und Abhängigkeiten sind kanonisch in [KB-0358](08-ai-lineage-und-abhaengigkeiten.md) behandelt; Model Governance im Delivery-Prozess in [KB-0373](23-model-governance-im-delivery-prozess.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Provider-EOL-Überwachungswerkzeuge, die Ankündigungen mehrerer LLM-Anbieter zentral verfolgen | Evaluating | Gegenüber manueller Überwachung einzelner Provider-Ankündigungsseiten abwägen, sobald ein zuverlässiges, breit abdeckendes Werkzeug verfügbar ist. |
| Automatisierte Lineage-basierte Abhängigkeitsprüfung als fester Vorabschritt jeder Stilllegungsanfrage | Adopting | Gegenüber manueller Verbraucher-Recherche für zuverlässigere, vollständigere Identifikation bevorzugen. |

Ein Team akzeptiert eine Modell-Stilllegung erst, wenn eine vollständige Lineage-Abfrage keine unmigrierten produktiven Verbraucher zeigt und Datenlöschungs-/Aufbewahrungsentscheidungen dokumentiert sind.
