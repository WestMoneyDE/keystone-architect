---
{"id": "KB-0630", "title": "Unternehmensweite Model Governance", "domain": "26", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0373", "concepts": ["Model Governance im Delivery-Prozess"], "needed_for": "understanding"}, {"id": "KB-0617", "concepts": ["EU AI Act und Systemklassifikation"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modellinventar mit benannten Verantwortlichen und Risikoklassen für eine konkrete Organisation anhand etablierter Praxis korrekt pflegen können, aufbauend auf der bereits in KB-0373 behandelten pipelinespezifischen Model Governance.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie unternehmensweite Model Governance einzelne, isolierte Delivery-Pipeline-Governance-Prozesse zu einem organisationsweiten Modellinventar mit konsistenter Freigabe-, Monitoring- und Stilllegungspraxis zusammenführt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Modell außerhalb des zentralen Modellinventars betrieben wird (Schatten-Modell), und die daraus resultierende Governance-Lücke von einer vollständig erfassten Modelllandschaft unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Model Governance festlegen, die ein vollständiges Modellinventar über alle Delivery-Pipelines hinweg mit konsistenter Risikoklassifikation, Freigabe und Stilllegung verbindlich machen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Governance innerhalb einer einzelnen Delivery-Pipeline ist bereits in KB-0373 behandelt.", "rationale": "Kern ist die unternehmensweite Zusammenführung und Konsistenz über mehrere Pipelines hinweg, nicht die pipelineinterne Governance selbst."}}, "lab_validation": [{"lab_id": "KB-0630-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung von Schatten-Modellen außerhalb des zentralen Inventars, kein produktives Governance-Tool verwendet", "evidence": "Ein lokales Skript vergleicht eine Liste tatsächlich in Produktion laufender Modelle mit dem zentralen Modellinventar und markiert Modelle, die produktiv laufen, aber im Inventar nicht erfasst sind, als Schatten-Modelle mit Governance-Lücke.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Governance-Tool."}]}
---
# Unternehmensweite Model Governance

> **Ziel:** Die bereits in [KB-0373](../15-mlops-evaluation/23-model-governance-im-delivery-prozess.md) behandelte Model Governance innerhalb einer einzelnen Delivery-Pipeline reicht für eine Organisation mit mehreren, unabhängigen Teams und Pipelines nicht aus — unternehmensweite Model Governance führt diese pipelinespezifischen Prozesse zu einem zentralen **Modellinventar** zusammen, das jedes tatsächlich betriebene Modell mit benanntem Verantwortlichen und der bereits in [KB-0617](01-eu-ai-act-und-systemklassifikation.md) behandelten Risikoklasse erfasst. Der zentrale Punkt dieses Kapitels ist, dass Freigabe, Monitoring und Stilllegung als **verbindliche Governance über einzelne Delivery-Pipelines hinweg** organisiert werden müssen — eine Organisation, in der jedes Team seine eigene, isolierte Model-Governance-Praxis pflegt, ohne ein zentrales, vollständiges Modellinventar, riskiert **Schatten-Modelle**: Modelle, die tatsächlich produktiv betrieben werden, aber in keinem zentralen Verzeichnis erfasst sind und dadurch keiner konsistenten Risikobewertung, Freigabe oder Überwachung unterliegen.

## Zweck, Mental Model und Dependencies

Die pipelinespezifische Model Governance (siehe [KB-0373](../15-mlops-evaluation/23-model-governance-im-delivery-prozess.md)) stellt sicher, dass innerhalb einer einzelnen Delivery-Pipeline Modelle ordnungsgemäß validiert und freigegeben werden — dieser Prozess ist notwendig, aber nicht hinreichend für eine Organisation mit mehreren, unabhängigen Teams, da jede Pipeline isoliert ihre eigene Governance-Praxis anwenden kann, ohne dass eine zentrale, organisationsweite Instanz einen vollständigen Überblick über alle tatsächlich betriebenen Modelle hat. Das zentrale Modellinventar schließt genau diese Lücke: Es erfasst jedes Modell, unabhängig davon, aus welcher Pipeline oder welchem Team es stammt, mit einem benannten, verantwortlichen Eigentümer und einer Risikoklassifikation (aufbauend auf der bereits in [KB-0617](01-eu-ai-act-und-systemklassifikation.md) behandelten EU-AI-Act-Klassifikation) — dieses Inventar ist die Voraussetzung dafür, dass unternehmensweite Fragen (etwa "welche Modelle verarbeiten tatsächlich personenbezogene Daten" oder "welche Hochrisiko-Systeme benötigen eine erneute Prüfung nach einer regulatorischen Änderung") tatsächlich beantwortbar sind, statt bei jedem einzelnen Team erneut erfragt werden zu müssen. Schatten-Modelle entstehen typischerweise nicht aus böswilliger Absicht, sondern aus der praktischen Realität verteilter Teams: Ein Team entwickelt und betreibt ein Modell für einen spezifischen, lokalen Anwendungsfall, ohne dass eine zentrale Governance-Instanz dies bemerkt oder das Modell in das zentrale Inventar aufgenommen wird — dieses Modell unterliegt dann keiner konsistenten, unternehmensweiten Risikobewertung, keiner koordinierten Freigabeprüfung und keinem zentralen Monitoring, selbst wenn es tatsächlich sensible Daten verarbeitet oder Hochrisiko-Entscheidungen trifft. Freigabe, Monitoring und Stilllegung als verbindliche, unternehmensweite Governance bedeuten konkret, dass diese drei Lebenszyklusphasen nicht mehr allein der einzelnen Pipeline oder dem einzelnen Team überlassen bleiben, sondern gegen zentrale, organisationsweite Kriterien geprüft werden — ein Modell darf erst produktiv gehen, nachdem es im zentralen Inventar erfasst und gegen die unternehmensweiten Kriterien geprüft wurde, und seine Stilllegung muss ebenso zentral nachvollzogen werden, um zu verhindern, dass ein formal stillgelegtes, aber tatsächlich weiterhin aktives Modell unentdeckt bleibt.

~~~text
KB-0373's pipeline-specific model governance insufficient for org w/ multiple, independent teams/pipelines
Enterprise-wide model governance joins these pipeline-specific processes into central MODEL INVENTORY
  capturing every actually-operated model w/ named owner + risk class (KB-0617 EU AI Act classification)
KEY POINT: approval, monitoring, decommissioning must be organized as BINDING GOVERNANCE
  ACROSS individual delivery pipelines
  org where every team maintains own, isolated model-governance practice, w/o central,
    complete model inventory -> risks SHADOW MODELS
  models actually operated in production but captured in NO central registry
  -> not subject to consistent risk assessment, approval, or monitoring
PIPELINE-SPECIFIC governance (KB-0373): ensures models properly validated+approved WITHIN a single
  delivery pipeline -- necessary but NOT SUFFICIENT for org w/ multiple independent teams
  each pipeline can apply own governance practice in isolation, w/o central org-wide instance
    having complete overview of ALL actually-operated models
CENTRAL MODEL INVENTORY closes exactly this gap
  captures every model, regardless of source pipeline/team, w/ named responsible owner
    + risk classification (KB-0617)
  prerequisite for org-wide questions being ACTUALLY answerable
    ("which models actually process personal data", "which high-risk systems need re-review
     after a regulatory change") instead of re-querying every individual team each time
SHADOW MODELS typically arise NOT from malicious intent, but practical reality of distributed teams
  team develops+operates a model for specific, local use case
  w/o central governance instance noticing or model being added to central inventory
  -> not subject to consistent, org-wide risk assessment, coordinated approval, central monitoring
     even if it actually processes sensitive data or makes high-risk decisions
APPROVAL/MONITORING/DECOMMISSIONING as binding, org-wide governance concretely means:
  these 3 lifecycle phases no longer left solely to individual pipeline/team
  checked against CENTRAL, org-wide criteria
  model may only go to production AFTER being captured in central inventory + checked against
    org-wide criteria
  decommissioning must equally be tracked centrally, to prevent a formally decommissioned but
    actually still-active model going undetected
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Zentrales Modellinventar | erfasst alle tatsächlich betriebenen Modelle organisationsweit | Grundlage für organisationsweite Governance-Fragen |
| Schatten-Modell | Modell außerhalb des zentralen Inventars | Governance-Lücke ohne Risikobewertung, Freigabe, Monitoring |
| Benannter Verantwortlicher | Eigentümer je Modell im Inventar | stellt Ansprechbarkeit und Aktualisierungsverantwortung sicher |
| Unternehmensweite Lebenszyklus-Governance | einheitliche Freigabe/Monitoring/Stilllegung über Pipelines hinweg | verhindert isolierte, inkonsistente Pipeline-Praktiken |

Implementierung: Jedes tatsächlich betriebene Modell wird im zentralen Modellinventar mit benanntem Verantwortlichen und Risikoklasse erfasst, unabhängig von seiner Herkunftspipeline. Freigabe- und Stilllegungsprozesse werden gegen zentrale, organisationsweite Kriterien geprüft, statt allein pipelineintern entschieden zu werden. Ein regelmäßiger Abgleich zwischen tatsächlich produktiv laufenden Modellen und dem zentralen Inventar deckt Schatten-Modelle auf.

## Scalability, Reliability, Security und Observability

Unternehmensweite Model Governance skaliert die tatsächliche, organisationsweite Kontrolle über die AI-Modelllandschaft proportional zur Vollständigkeit des zentralen Modellinventars; die Reliability-Grenze liegt darin, dass Schatten-Modelle außerhalb des Inventars keiner konsistenten Risikobewertung, Freigabe oder Überwachung unterliegen, unabhängig von deren tatsächlicher Kritikalität.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Modell verarbeitet tatsächlich sensible Daten, ist aber im zentralen Inventar nicht erfasst | das Modell wurde als isoliertes Team-Projekt betrieben, ohne zentrale Governance-Einbindung | einen regelmäßigen Abgleich zwischen produktiv laufenden Modellen und dem zentralen Inventar durchführen |
| eine organisationsweite Frage (etwa nach Hochrisiko-Modellen) lässt sich nicht beantworten, ohne jedes Team einzeln zu befragen | kein vollständiges, zentrales Modellinventar existiert | ein zentrales Modellinventar mit verbindlicher Erfassungspflicht für alle Pipelines einführen |
| ein formal stillgelegtes Modell läuft tatsächlich weiterhin produktiv | die Stilllegung wurde nicht zentral nachvollzogen und verifiziert | die Stilllegung als zentral zu bestätigenden Schritt im Modellinventar verankern |

Security: Schatten-Modelle stellen ein besonderes Sicherheitsrisiko dar, da sie keiner zentralen Sicherheitsbewertung unterliegen, obwohl sie potenziell sensible Daten verarbeiten. Observability: Die tatsächliche Vollständigkeit des zentralen Modellinventars im Vergleich zu tatsächlich produktiv laufenden Modellen ist ein zentrales Signal zur Bewertung der Governance-Wirksamkeit.

## Trade-offs und Entscheidungen

**Staff** erfasst ein gegebenes Modell korrekt im zentralen Inventar mit Verantwortlichem und Risikoklasse. **Principal** entwirft die vollständige, unternehmensweite Model-Governance-Struktur mit Inventar- und Lebenszyklus-Prozess für eine Organisation. **Chief** legt unternehmensweite Standards für Model Governance fest, die vollständige Inventarerfassung über alle Pipelines hinweg verbindlich machen.

Anti-Patterns: Modelle isoliert innerhalb einzelner Teams oder Pipelines betreiben, ohne sie im zentralen Inventar zu erfassen; Freigabe- und Stilllegungsentscheidungen allein pipelineintern treffen, ohne zentrale, organisationsweite Kriterien anzuwenden; keinen regelmäßigen Abgleich zwischen tatsächlich produktiv laufenden Modellen und dem zentralen Inventar durchführen.

## Production Checklist

- [ ] Jedes tatsächlich betriebene Modell ist im zentralen Inventar mit benanntem Verantwortlichen und Risikoklasse erfasst.
- [ ] Freigabe- und Stilllegungsentscheidungen werden gegen zentrale, organisationsweite Kriterien geprüft.
- [ ] Ein regelmäßiger Abgleich zwischen produktiv laufenden Modellen und dem Inventar deckt Schatten-Modelle auf.
- [ ] Organisationsweite Governance-Fragen sind anhand des zentralen Inventars beantwortbar, ohne jedes Team einzeln zu befragen.

## Interviewfragen

### 1. Warum reicht pipelinespezifische Model Governance für eine Organisation mit mehreren Teams nicht aus?

**Antwort:** Weil jede Pipeline isoliert ihre eigene Governance-Praxis anwenden kann, ohne dass eine zentrale Instanz einen vollständigen Überblick über alle tatsächlich betriebenen Modelle hat.

### 2. Was ist ein Schatten-Modell?

**Antwort:** Ein Modell, das tatsächlich produktiv betrieben wird, aber im zentralen Modellinventar nicht erfasst ist und dadurch keiner konsistenten Risikobewertung, Freigabe oder Überwachung unterliegt.

### 3. Wofür dient das zentrale Modellinventar?

**Antwort:** Es erfasst jedes tatsächlich betriebene Modell mit benanntem Verantwortlichen und Risikoklasse, unabhängig von seiner Herkunftspipeline, und ermöglicht dadurch die Beantwortung organisationsweiter Governance-Fragen.

### 4. Wie entstehen Schatten-Modelle typischerweise?

**Antwort:** Nicht aus böswilliger Absicht, sondern aus der praktischen Realität verteilter Teams, die ein Modell für einen lokalen Anwendungsfall entwickeln, ohne dass eine zentrale Governance-Instanz dies bemerkt.

### 5. Wie gehst du vor, wenn ein Modell tatsächlich sensible Daten verarbeitet, aber im zentralen Inventar nicht erfasst ist?

**Antwort:** Ich prüfe, wie dieses Schatten-Modell entstanden ist, nehme es umgehend in das zentrale Inventar auf und unterziehe es der organisationsweiten Risikobewertung und Freigabeprüfung.

### 6. Widersprüchliche Anforderung: Einzelne Teams wollen schnelle, unbürokratische Modellentwicklung UND die Organisation will vollständige, zentrale Governance über alle Modelle — wie gehst du vor?

**Antwort:** Ich würde einen schlanken, automatisierten Erfassungsprozess für das zentrale Inventar einführen, der bei jeder Modellbereitstellung automatisch ausgelöst wird, statt manuelle, verzögernde Meldeprozesse zu erzwingen, um schnelle Teamarbeit mit vollständiger, zentraler Sichtbarkeit zu verbinden.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting shadow models via inventory comparison (executed locally, no real governance tool):

def find_shadow_models(production_models, central_inventory):
    inventory_names = {m["name"] for m in central_inventory}
    return [m for m in production_models if m["name"] not in inventory_names]

production_models = [
    {"name": "fraud_detection_v3", "team": "Risk"},
    {"name": "internal_recommendation_engine", "team": "Marketing"},
]
central_inventory = [{"name": "fraud_detection_v3", "owner": "Risk Lead", "risk_class": "high"}]

print("shadow models:", find_shadow_models(production_models, central_inventory))
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [AI Risk Management Framework (AI RMF 1.0) — Govern Function](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-18.
2. The Open Group: [TOGAF Standard, 10th Edition — Application Portfolio Management](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.

Model Governance im Delivery-Prozess ist kanonisch in [KB-0373](../15-mlops-evaluation/23-model-governance-im-delivery-prozess.md) behandelt; EU AI Act und Systemklassifikation in [KB-0617](01-eu-ai-act-und-systemklassifikation.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Netzwerk- und Infrastruktur-Scans zur Erkennung produktiv laufender, aber nicht inventarisierter Modelle | Evaluating | Als ergänzendes Erkennungswerkzeug für Schatten-Modelle einführen, jedoch die abschließende Bewertung und Aufnahme in das Inventar weiterhin als menschliche, governance-gestützte Entscheidung behandeln. |

Ein Team akzeptiert eine unternehmensweite Model Governance erst, wenn das zentrale Modellinventar nachweislich vollständig ist und Freigabe, Monitoring und Stilllegung konsistent über alle Delivery-Pipelines hinweg organisiert sind.
