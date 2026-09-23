---
{"id": "KB-0375", "title": "Model Cards und Nutzungsgrenzen", "domain": "15", "sequence": 25, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0343", "concepts": ["Modellbewertung und Fehlertypen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Model Card für ein trainiertes Modell erstellen, die Trainingskontext, Evaluation und Einschränkungen dokumentiert, ohne unbelegte Leistungsversprechen zu machen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Prozess gestalten, der Model Cards als verpflichtenden Bestandteil jeder Modellfreigabe etabliert und Lizenz-/IP-Fragen explizit vor dem Einsatz eines Modells klärt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Model Card unbelegte Leistungsversprechen enthält, die über die tatsächlich durchgeführte Evaluation hinausgehen, und dies korrigieren.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Model Cards mit geprüften Lizenz-/IP-Angaben als verpflichtenden Standard für jede Modellnutzung im Unternehmen etablieren, um rechtliche und Reputationsrisiken zu begrenzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte juristische Prüfung komplexer Modell-Lizenzbedingungen ist Vertiefung.", "rationale": "Kern ist das Verständnis der notwendigen Dokumentationsinhalte, nicht die vollständige juristische Analyse jeder Lizenzform."}}, "lab_validation": [{"lab_id": "KB-0375-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal erstellte Model Card für ein trainiertes lokales Modell mit expliziter Trennung von belegter Evaluation und Nutzungsgrenzen", "evidence": "Eine Model Card für ein lokal trainiertes Modell dokumentiert ausschließlich die tatsächlich durchgeführte Evaluation (Testgenauigkeit auf einem spezifischen Datensatz) und explizit bekannte Einschränkungen (z. B. keine Prüfung auf bestimmte Subgruppen), ohne eine allgemeine, unbelegte Aussage über die Modellqualität außerhalb des getesteten Rahmens zu treffen.", "limitations": "Kein produktives Model-Card-System, kein realer Geschäftsdatensatz, kleines lokales Modell."}]}
---
# Model Cards und Nutzungsgrenzen

> **Ziel:** Eine Model Card dokumentiert Trainingskontext (welche Daten, welcher Zeitraum, welche Methode), Evaluation (welche Tests wurden tatsächlich durchgeführt, siehe [KB-0343](../14-ml-engineering/13-modellbewertung-und-fehlertypen.md)) und Einschränkungen (bekannte Grenzen, nicht getestete Szenarien) eines Modells. Der zentrale Punkt dieses Kapitels ist, zulässige Nutzung sowie Lizenz- und geistige-Eigentums-Fragen (IP) sichtbar zu machen, ohne dabei unbelegte Leistungsversprechen zu machen — eine Model Card darf niemals mehr Kompetenz suggerieren, als durch die tatsächlich durchgeführte Evaluation belegt ist.

## Zweck, Mental Model und Dependencies

Eine Model Card ist ein standardisiertes Dokument, das für ein Modell transparent macht: mit welchen Daten und welcher Methode es trainiert wurde (Trainingskontext), welche Evaluationen tatsächlich durchgeführt wurden und mit welchem Ergebnis (nicht nur eine pauschale Genauigkeitszahl, sondern die konkrete Testbedingung), und welche bekannten Einschränkungen bestehen (z. B. nicht getestete Sprachen, Subgruppen oder Anwendungsszenarien). Der zentrale methodische Grundsatz, der sich direkt aus der in dieser gesamten Knowledge Base etablierten Anti-Fabrikations-Disziplin ableitet, ist: eine Model Card darf ausschließlich Aussagen enthalten, die durch die tatsächlich durchgeführte Evaluation belegt sind — eine allgemeine Aussage wie "das Modell funktioniert gut" ohne Bezug auf die konkrete Testbedingung ist ein unbelegtes Leistungsversprechen und muss vermieden werden. Zusätzlich zur technischen Dokumentation müssen Lizenz- und IP-Fragen explizit geklärt werden: unter welcher Lizenz steht das Modell selbst, unter welcher Lizenz stehen die verwendeten Trainingsdaten, und welche Einschränkungen bestehen für die kommerzielle oder abgeleitete Nutzung — diese Fragen sind unabhängig von der technischen Qualität des Modells und müssen vor jedem Einsatz geklärt sein, da eine rechtliche Verletzung unabhängig von der technischen Leistungsfähigkeit des Modells reale Konsequenzen haben kann.

~~~text
Model Card documents:
  Training context: which data, what time period, what method
  Evaluation: which tests were ACTUALLY performed, under which conditions, with which result
  Limitations: known gaps -- untested languages, subgroups, application scenarios
CORE PRINCIPLE (direct extension of this KB's anti-fabrication discipline):
  a Model Card may ONLY contain claims backed by ACTUALLY performed evaluation
  "the model works well" without a specific test condition = an UNSUPPORTED performance claim -- must be avoided
SEPARATE, EQUALLY REQUIRED: license/IP clarity
  model's own license, training data license, constraints on commercial/derivative use
  -> independent of technical quality; a legal violation has real consequences regardless of how well the model performs
~~~

## Core Concepts, Architektur und Implementierung

| Element | Inhalt | Anti-Pattern |
|---|---|---|
| Trainingskontext | verwendete Daten, Zeitraum, Trainingsmethode | vage oder fehlende Angaben zur Datenherkunft |
| Evaluation | konkret durchgeführte Tests mit Bedingungen und Ergebnissen | pauschale Qualitätsaussagen ohne Bezug zur tatsächlichen Testbedingung |
| Einschränkungen | bekannte Grenzen, nicht getestete Szenarien | Verschweigen bekannter Lücken, um das Modell besser erscheinen zu lassen |
| Lizenz/IP | Lizenz des Modells und der Trainingsdaten, Nutzungseinschränkungen | Einsatz eines Modells ohne geklärte Lizenzbedingungen |

Implementierung: Für jedes Modell wird vor dessen Freigabe eine Model Card erstellt, die den Trainingskontext, die tatsächlich durchgeführten Evaluationen mit ihren konkreten Bedingungen und Ergebnissen, sowie bekannte Einschränkungen dokumentiert. Jede Aussage in der Model Card wird gegen die tatsächlich vorliegende Evidenz geprüft — Aussagen ohne entsprechende Evaluation werden entfernt oder als "nicht getestet" explizit gekennzeichnet, statt implizit Kompetenz zu suggerieren. Vor jedem Einsatz eines Modells (insbesondere bei extern bezogenen oder vortrainierten Modellen) werden die Lizenzbedingungen des Modells selbst und der verwendeten Trainingsdaten explizit geprüft und dokumentiert, um rechtliche Risiken bei kommerzieller oder abgeleiteter Nutzung auszuschließen.

## Scalability, Reliability, Security und Observability

Model Cards skalieren Transparenz über Modellfähigkeiten und -grenzen proportional zur Vollständigkeit ihrer Dokumentation; die Reliability-Grenze liegt darin, dass unbelegte Leistungsversprechen proportional zur Diskrepanz zwischen dokumentierter und tatsächlicher Modellqualität zu Fehleinschätzungen bei nachgelagerten Entscheidungen führen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Modell wird für einen Anwendungsfall eingesetzt, für den es nachträglich als ungeeignet erkannt wird | die Model Card enthielt keine explizite Dokumentation der bekannten Einschränkungen für diesen Anwendungsfall | die Model Card um die entdeckte Einschränkung ergänzen und den unpassenden Einsatz korrigieren |
| ein Team wird nach dem Einsatz eines Modells mit einer Lizenzverletzung konfrontiert | die Lizenzbedingungen des Modells oder der Trainingsdaten wurden vor dem Einsatz nicht geprüft | die Lizenzbedingungen nachträglich prüfen und den Einsatz bei Verletzung anpassen oder einstellen |
| eine Model Card enthält eine allgemeine Qualitätsaussage, die bei genauerer Prüfung nicht durch eine konkrete Evaluation belegt ist | die Model Card wurde nicht konsequent gegen die tatsächlich vorliegende Evidenz geprüft | jede Aussage in der Model Card einzeln gegen die zugrunde liegende Evaluationsevidenz prüfen und unbelegte Aussagen entfernen |

Security: Model Cards mit ehrlich dokumentierten Einschränkungen verhindern den Einsatz eines Modells in Szenarien, für die es nachweislich nicht getestet wurde, was insbesondere in sicherheitsrelevanten Anwendungsfällen reale Risiken reduziert. Observability: Der Anteil der Modelle mit vollständiger, aktueller Model Card, sowie die Anzahl dokumentierter versus tatsächlich entdeckter Einschränkungen, sind zentrale Governance-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine Model Card für jedes freigegebene Modell mit ausschließlich evidenzbasierten Aussagen. **Principal** macht Lizenz-/IP-Status und bekannte Einschränkungen für das Team nachvollziehbar. **Chief** etabliert Model Cards mit geprüften Lizenz-/IP-Angaben als verpflichtenden Standard für jede Modellnutzung im Unternehmen.

Anti-Patterns: eine Model Card mit pauschalen, nicht durch konkrete Evaluation belegten Qualitätsaussagen erstellen; ein Modell ohne geprüfte Lizenzbedingungen kommerziell einsetzen; bekannte Einschränkungen eines Modells in der Model Card verschweigen, um es vorteilhafter erscheinen zu lassen.

## Production Checklist

- [ ] Jedes freigegebene Modell besitzt eine Model Card mit Trainingskontext, Evaluation und Einschränkungen.
- [ ] Jede Aussage in der Model Card ist durch tatsächlich durchgeführte Evaluation belegt.
- [ ] Lizenzbedingungen des Modells und der Trainingsdaten sind vor jedem Einsatz geprüft und dokumentiert.
- [ ] Bekannte Einschränkungen sind vollständig und ehrlich dokumentiert, nicht verschwiegen.

## Interviewfragen

### 1. Was gehört zu einer vollständigen Model Card?

**Antwort:** Trainingskontext (Daten, Zeitraum, Methode), tatsächlich durchgeführte Evaluationen mit konkreten Bedingungen und Ergebnissen, sowie bekannte Einschränkungen.

### 2. Was ist ein unbelegtes Leistungsversprechen in einer Model Card, und warum ist es problematisch?

**Antwort:** Eine allgemeine Qualitätsaussage ohne Bezug zur tatsächlich durchgeführten Testbedingung, die mehr Kompetenz suggeriert, als durch Evidenz belegt ist, und zu Fehleinschätzungen bei nachgelagerten Entscheidungen führen kann.

### 3. Warum müssen Lizenz- und IP-Fragen unabhängig von der technischen Modellqualität geklärt werden?

**Antwort:** Eine rechtliche Verletzung (z. B. eine nicht zulässige kommerzielle Nutzung) hat reale Konsequenzen unabhängig davon, wie gut das Modell technisch funktioniert.

### 4. Wie stellst du sicher, dass eine Model Card keine unbelegten Aussagen enthält?

**Antwort:** Jede Aussage wird einzeln gegen die zugrunde liegende Evaluationsevidenz geprüft; Aussagen ohne entsprechende Evaluation werden entfernt oder explizit als "nicht getestet" gekennzeichnet.

### 5. Wie gehst du vor, wenn ein Modell für einen Anwendungsfall eingesetzt wird, für den es sich nachträglich als ungeeignet erweist?

**Antwort:** Ich ergänze die Model Card um die entdeckte Einschränkung und passe den unpassenden Einsatz entsprechend an, statt die Lücke unkommentiert zu lassen.

### 6. Widersprüchliche Anforderung: Team will ein Modell möglichst positiv präsentieren UND garantiert vollständig ehrliche, evidenzbasierte Dokumentation — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine ehrliche, evidenzbasierte Model Card langfristig vertrauenswürdiger und risikoärmer ist als eine geschönte Darstellung, und die Model Card konsequent auf tatsächlich belegte Aussagen beschränken, während positive, tatsächlich nachgewiesene Stärken klar und prominent, aber wahrheitsgemäß dargestellt werden.

## Praktische Labs

~~~python
class ModelCard:
    def __init__(self, model_name):
        self.model_name = model_name
        self.training_context = {}
        self.evaluations = []
        self.limitations = []
        self.license_info = {}

    def add_evaluation(self, test_name, condition, result):
        self.evaluations.append({"test": test_name, "condition": condition, "result": result})

    def add_limitation(self, description):
        self.limitations.append(description)

    def validate_no_unsupported_claims(self, claim_text):
        # Simplified check: a claim must reference a specific, documented evaluation
        return any(ev["test"] in claim_text for ev in self.evaluations)

card = ModelCard("classifier-v1")
card.training_context = {"data": "internal_dataset_v3", "period": "2026-06 to 2026-08", "method": "supervised fine-tuning"}
card.add_evaluation("held_out_test_accuracy", condition="English-language customer support tickets", result="0.91")
card.add_limitation("Not evaluated on non-English text.")
card.add_limitation("Not evaluated on adversarial or out-of-distribution inputs (see KB-0345).")
card.license_info = {"model_license": "Apache-2.0", "training_data_license": "internal, proprietary"}

good_claim = "held_out_test_accuracy of 0.91 on English-language customer support tickets"
bad_claim = "works great for all languages and use cases"

print(f"Claim backed by evidence: '{good_claim}' -> valid: {card.validate_no_unsupported_claims(good_claim)}")
print(f"Claim backed by evidence: '{bad_claim}' -> valid: {card.validate_no_unsupported_claims(bad_claim)}")
print(f"\nDocumented limitations: {card.limitations}")
~~~

## Dependencies, Cross-References und Quellen

1. Mitchell et al.: [Model Cards for Model Reporting](https://arxiv.org/abs/1810.03993), abgerufen 2026-09-17.
2. Hugging Face-Dokumentation: [Model Cards](https://huggingface.co/docs/hub/model-cards), abgerufen 2026-09-17.

Modellbewertung und Fehlertypen sind kanonisch in [KB-0343](../14-ml-engineering/13-modellbewertung-und-fehlertypen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Model-Card-Generierungswerkzeuge, die Evaluationsergebnisse direkt aus dem Experiment-Tracking übernehmen | Adopting | Gegenüber manuell erstellten Model Cards für konsistentere, evidenzbasierte Dokumentation ohne manuelle Übertragungsfehler bevorzugen. |
| Standardisierte, maschinenlesbare Lizenz-Metadatenformate für Modelle und Trainingsdaten | Evaluating | Gegenüber rein textueller Lizenzdokumentation abwägen, sobald ein breit unterstützter Standard verfügbar ist. |

Ein Team akzeptiert den Einsatz eines Modells erst, wenn eine vollständige, evidenzbasierte Model Card mit geprüften Lizenzangaben vorliegt.
