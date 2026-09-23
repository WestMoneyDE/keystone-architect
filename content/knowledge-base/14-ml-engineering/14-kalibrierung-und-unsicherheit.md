---
{"id": "KB-0344", "title": "Kalibrierung und Unsicherheit", "domain": "14", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0343", "concepts": ["Modellbewertung und Fehlertypen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Reliability Diagram für ein Klassifikationsmodell erstellen und Überkonfidenz anhand der Abweichung zwischen vorhergesagter Konfidenz und tatsächlicher Trefferquote demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Abstentionsschwelle für risikobehaftete Vorhersagen basierend auf empirisch gemessener Kalibrierung statt auf der rohen, unkalibrierten Modellkonfidenz festlegen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlerhafte automatisierte Entscheidung trotz hoher gemeldeter Modellkonfidenz auf Überkonfidenz durch fehlende Kalibrierung statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Kalibrierung als Voraussetzung für vertrauenswürdige Konfidenzwerte positionieren, die für Abstentionsentscheidungen bei risikobehafteten Vorhersagen empirisch verifiziert werden muss, statt roher Modellkonfidenz blind zu vertrauen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Kalibrierungsverfahren (Platt Scaling, Temperature Scaling) sind Vertiefung.", "rationale": "Kern ist das Prinzip, dass rohe Konfidenz nicht automatisch kalibriert ist, nicht die konkrete Kalibrierungstechnik."}}, "lab_validation": [{"lab_id": "KB-0344-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Reliability Diagram für ein Klassifikationsmodell mit simulierter Überkonfidenz", "evidence": "Vorhersagen mit gemeldeter Konfidenz von 90 Prozent erweisen sich tatsächlich nur in etwa 70 Prozent der Fälle als korrekt, was eine deutliche Überkonfidenz zeigt, die durch ein Reliability Diagram sichtbar wird, aber durch die reine Konfidenzzahl verborgen bliebe.", "limitations": "Kein produktives Kalibrierungssystem, kein realer Geschäftsdatensatz, keine reale Abstentionsinfrastruktur."}]}
---
# Kalibrierung und Unsicherheit

> **Ziel:** Kalibrierung misst, ob die von einem Modell gemeldete Konfidenz tatsächlich mit der realen Trefferquote übereinstimmt (aufbauend auf Modellbewertung, siehe [KB-0343](13-modellbewertung-und-fehlertypen.md)). Ein Reliability Diagram macht diese Übereinstimmung visuell sichtbar. Der zentrale Punkt ist, dass rohe Modellkonfidenz nicht automatisch kalibriert ist — Überkonfidenz (das Modell meldet höhere Konfidenz, als seine tatsächliche Genauigkeit rechtfertigt) ist ein verbreitetes Problem, das empirisch verifizierte Kalibrierung notwendig macht, bevor Konfidenzwerte für Abstentionsentscheidungen bei risikobehafteten Vorhersagen genutzt werden.

## Zweck, Mental Model und Dependencies

Konfidenz ist der von einem Modell gemeldete Wahrscheinlichkeitswert für seine Vorhersage (z. B. "90 Prozent sicher, dass dies Klasse A ist"). Kalibrierung fragt, ob diese Zahl tatsächlich bedeutungsvoll ist: wenn ein Modell über viele Vorhersagen hinweg konsistent 90 Prozent Konfidenz meldet, sollten tatsächlich etwa 90 Prozent dieser Vorhersagen korrekt sein, wenn das Modell gut kalibriert ist. Der zentrale, oft übersehene Fehler ist, anzunehmen, dass ein Modell automatisch kalibriert ist, nur weil es Wahrscheinlichkeitswerte ausgibt — moderne, insbesondere tiefe neuronale Netze neigen systematisch zu Überkonfidenz: sie melden oft deutlich höhere Konfidenzwerte, als ihre tatsächliche Trefferquote rechtfertigt, weil das Trainingsziel (z. B. Kreuzentropie, siehe [KB-0335](05-loss-functions-und-lernziele.md)) primär auf korrekte Klassifikation, nicht auf kalibrierte Konfidenzwerte optimiert. Ein Reliability Diagram macht dies sichtbar, indem Vorhersagen nach ihrer gemeldeten Konfidenz in Bins gruppiert werden und für jeden Bin die tatsächliche Trefferquote gegen die durchschnittliche gemeldete Konfidenz aufgetragen wird — bei perfekter Kalibrierung liegen alle Punkte auf der Diagonalen (gemeldete Konfidenz gleich tatsächliche Trefferquote); eine Abweichung nach unten (tatsächliche Trefferquote niedriger als gemeldete Konfidenz) zeigt Überkonfidenz. Der zentrale praktische Anwendungsfall für Kalibrierung ist die Festlegung von Abstentionsschwellen: wenn ein Modell bei risikobehafteten Vorhersagen (z. B. medizinische Diagnose, Kreditentscheidung) nur bei ausreichender Konfidenz automatisch entscheiden und ansonsten an einen Menschen eskalieren soll, muss diese Schwelle auf empirisch verifizierter, kalibrierter Konfidenz basieren — eine Schwelle basierend auf unkalibrierter, überkonfidenter roher Modellkonfidenz kann dazu führen, dass tatsächlich unsichere Vorhersagen fälschlich als ausreichend sicher automatisch entschieden werden.

~~~text
Confidence: model-reported probability for its prediction (e.g. "90% sure this is class A")
Calibration: does that number MEAN anything? -> if model reports 90% confidence consistently, ~90% of those should be CORRECT
CRITICAL ERROR: assuming a model is automatically calibrated just because it outputs probability values
  -> modern deep networks systematically tend toward OVERCONFIDENCE
  -> training objective (cross-entropy, KB-0335) optimizes for correct classification, NOT calibrated confidence
Reliability diagram: bin predictions by confidence -> plot actual accuracy per bin vs average reported confidence
  perfect calibration = points on the diagonal; below diagonal = OVERCONFIDENCE
KEY APPLICATION: abstention thresholds for risky predictions (medical, credit)
  -> threshold MUST be based on EMPIRICALLY VERIFIED, calibrated confidence
  -> threshold based on RAW overconfident model output can auto-decide genuinely uncertain cases as "safe enough"
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Kalibrierungsmessung statt Annahme | wird die Kalibrierung des Modells explizit gemessen (z. B. über ein Reliability Diagram), statt automatische Kalibrierung anzunehmen? | ohne diese Messung kann Überkonfidenz unentdeckt bleiben und zu fälschlich vertrauenswürdig erscheinenden Vorhersagen führen |
| Kalibrierungsverfahren bei erkannter Überkonfidenz | wird bei erkannter Überkonfidenz ein Kalibrierungsverfahren (z. B. Temperature Scaling) angewendet, um die gemeldeten Konfidenzwerte zu korrigieren? | ohne Korrektur bleiben die Konfidenzwerte irreführend, auch wenn das zugrunde liegende Modell selbst korrekte Klassifikationsleistung zeigt |
| Empirisch fundierte Abstentionsschwellen | basiert die Abstentionsschwelle für risikobehaftete Vorhersagen auf empirisch verifizierter, kalibrierter Konfidenz, nicht auf roher, unkalibrierter Modellausgabe? | eine auf unkalibrierter Konfidenz basierende Schwelle kann tatsächlich unsichere Vorhersagen fälschlich als ausreichend sicher automatisch entscheiden lassen |
| Regelmäßige Neubewertung der Kalibrierung | wird die Kalibrierung regelmäßig neu gemessen, insbesondere nach Modellaktualisierungen oder bei Datenverteilungsverschiebungen? | eine einmalige Kalibrierungsmessung kann veralten, wenn sich das Modell oder die Datenverteilung ändert |

Implementierung: Die Kalibrierung eines Modells wird explizit über ein Reliability Diagram gemessen, das Vorhersagen nach gemeldeter Konfidenz gruppiert und die tatsächliche Trefferquote pro Gruppe gegen die gemeldete Konfidenz vergleicht. Bei erkannter Überkonfidenz wird ein Kalibrierungsverfahren wie Temperature Scaling oder Platt Scaling angewendet, um die gemeldeten Konfidenzwerte an die tatsächliche Trefferquote anzupassen. Abstentionsschwellen für risikobehaftete Vorhersagen werden explizit auf Basis der kalibrierten, nicht der rohen Konfidenz festgelegt, mit empirischer Verifikation anhand eines repräsentativen Testsets. Die Kalibrierung wird regelmäßig neu gemessen, insbesondere nach Modellaktualisierungen oder bei erkannten Verschiebungen in der Datenverteilung.

## Scalability, Reliability, Security und Observability

Kalibrierung skaliert Vertrauenswürdigkeit automatisierter Entscheidungen proportional zur Konsequenz der empirischen Kalibrierungsverifikation; die Reliability-Grenze liegt in unkalibrierter, überkonfidenter Modellausgabe, die mit wachsender Anzahl automatisierter, risikobehafteter Entscheidungen proportional mehr fälschlich als sicher eingestufte, tatsächlich unsichere Entscheidungen erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein automatisiertes System trifft trotz hoher gemeldeter Konfidenz häufig falsche Entscheidungen | das Modell ist überkonfident, und die gemeldete Konfidenz entspricht nicht der tatsächlichen Trefferquote | ein Reliability Diagram erstellen und die tatsächliche Trefferquote gegen die gemeldete Konfidenz vergleichen |
| eine Abstentionsschwelle lässt zu viele tatsächlich unsichere Vorhersagen automatisch durchgehen | die Schwelle basiert auf roher, unkalibrierter statt kalibrierter Konfidenz | die Abstentionsschwelle gegen eine explizit kalibrierte Konfidenzmetrik neu festlegen und die Fehlerrate vergleichen |
| eine zuvor gute Kalibrierung eines Modells verschlechtert sich über Zeit | eine Verschiebung in der Datenverteilung oder eine Modellaktualisierung hat die ursprüngliche Kalibrierung ungültig gemacht | die Kalibrierung erneut anhand eines aktuellen, repräsentativen Testsets messen |

Security: Eine unkalibrierte, überkonfidente Modellausgabe kann bei sicherheitsrelevanten, automatisierten Entscheidungen (z. B. Zugriffsfreigaben basierend auf Modellkonfidenz) dazu führen, dass tatsächlich unsichere Fälle fälschlich als ausreichend sicher automatisch entschieden werden, was ein reales Sicherheitsrisiko darstellt. Observability: Kalibrierungsfehler (Abweichung zwischen gemeldeter Konfidenz und tatsächlicher Trefferquote pro Konfidenz-Bin), Häufigkeit ausgelöster Abstentionen und Verteilung tatsächlicher Fehlerraten oberhalb und unterhalb der Abstentionsschwelle sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** misst Kalibrierung explizit über ein Reliability Diagram, statt automatische Kalibrierung anzunehmen. **Principal** macht Kalibrierungsverfahren und Abstentionsschwellen für das Team nachvollziehbar dokumentiert. **Chief** positioniert Kalibrierung als Voraussetzung für vertrauenswürdige, für Abstentionsentscheidungen nutzbare Konfidenzwerte.

Anti-Patterns: rohe Modellkonfidenz ohne Kalibrierungsmessung für Abstentionsentscheidungen nutzen; Kalibrierung einmalig messen und danach nicht mehr aktualisieren, obwohl sich Modell oder Datenverteilung geändert haben; Überkonfidenz erkennen, aber kein Kalibrierungsverfahren zur Korrektur anwenden.

## Production Checklist

- [ ] Die Kalibrierung des Modells ist explizit über ein Reliability Diagram gemessen.
- [ ] Bei erkannter Überkonfidenz ist ein Kalibrierungsverfahren angewendet.
- [ ] Abstentionsschwellen für risikobehaftete Vorhersagen basieren auf kalibrierter, nicht roher Konfidenz.
- [ ] Die Kalibrierung wird regelmäßig neu gemessen, insbesondere nach Modelländerungen.

## Interviewfragen

### 1. Was misst Kalibrierung, und warum ist sie nicht automatisch gegeben?

**Antwort:** Kalibrierung misst, ob die gemeldete Modellkonfidenz mit der tatsächlichen Trefferquote übereinstimmt; moderne neuronale Netze neigen systematisch zu Überkonfidenz, da ihr Trainingsziel primär auf korrekte Klassifikation, nicht auf kalibrierte Konfidenzwerte optimiert.

### 2. Was zeigt ein Reliability Diagram?

**Antwort:** Es gruppiert Vorhersagen nach gemeldeter Konfidenz und trägt die tatsächliche Trefferquote pro Gruppe gegen die durchschnittliche gemeldete Konfidenz auf; eine Abweichung von der Diagonalen zeigt Über- oder Unterkonfidenz.

### 3. Warum ist Kalibrierung besonders wichtig für Abstentionsschwellen bei risikobehafteten Vorhersagen?

**Antwort:** Eine Abstentionsschwelle basierend auf unkalibrierter, überkonfidenter Modellausgabe kann tatsächlich unsichere Vorhersagen fälschlich als ausreichend sicher automatisch entscheiden lassen.

### 4. Was ist ein Beispiel für ein Kalibrierungsverfahren, und wozu dient es?

**Antwort:** Temperature Scaling passt die gemeldeten Konfidenzwerte eines Modells nachträglich an, um sie näher an die tatsächliche Trefferquote anzugleichen, ohne die zugrunde liegende Klassifikationsentscheidung zu verändern.

### 5. Wie diagnostizierst du, dass eine Abstentionsschwelle zu viele tatsächlich unsichere Vorhersagen automatisch durchgehen lässt?

**Antwort:** Ich prüfe, ob die Schwelle auf roher, unkalibrierter Konfidenz statt auf einer explizit gemessenen, kalibrierten Konfidenzmetrik basiert — eine solche unkalibrierte Schwelle ist die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will maximale Automatisierung durch eine möglichst niedrige Abstentionsschwelle für schnelle Entscheidungen UND garantiert keine automatisierte Fehlentscheidung bei tatsächlich unsicheren Fällen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine niedrige Schwelle ohne Kalibrierung das Risiko automatisierter Fehlentscheidungen direkt erhöht; ich würde vorschlagen, die Schwelle explizit auf Basis kalibrierter Konfidenz empirisch so zu kalibrieren, dass die tatsächliche Fehlerrate unterhalb der Schwelle einem definierten, akzeptablen Niveau entspricht, statt eine niedrige Schwelle ohne diese Verifikation zu wählen.

## Praktische Labs

~~~python
import torch

# Reliability diagram: comparing reported confidence to actual accuracy per confidence bin
torch.manual_seed(0)

confidences = torch.rand(1000) * 0.5 + 0.5  # reported confidences between 0.5 and 1.0
# Simulate systematic overconfidence: actual correctness is LOWER than reported confidence suggests
actual_correct = (torch.rand(1000) < (confidences - 0.2)).float()

def reliability_diagram(confidences, actual_correct, num_bins=5):
    bin_edges = torch.linspace(0.5, 1.0, num_bins + 1)
    results = []
    for i in range(num_bins):
        mask = (confidences >= bin_edges[i]) & (confidences < bin_edges[i + 1])
        if mask.sum() > 0:
            avg_confidence = confidences[mask].mean().item()
            actual_accuracy = actual_correct[mask].mean().item()
            results.append((avg_confidence, actual_accuracy))
    return results

for avg_conf, actual_acc in reliability_diagram(confidences, actual_correct):
    gap = avg_conf - actual_acc
    print(f"Reported confidence: {avg_conf:.2f}, actual accuracy: {actual_acc:.2f}, overconfidence gap: {gap:.2f}")

print("\nA consistent positive gap across bins indicates systematic overconfidence.")
~~~

## Dependencies, Cross-References und Quellen

1. Guo et al.: [On Calibration of Modern Neural Networks](https://arxiv.org/abs/1706.04599), abgerufen 2026-09-17.
2. Niculescu-Mizil, Caruana: [Predicting Good Probabilities with Supervised Learning](https://www.cs.cornell.edu/~alexn/papers/calibration.icml05.crc.rev3.pdf), abgerufen 2026-09-17.
3. Scikit-learn: [Probability Calibration Documentation](https://scikit-learn.org/stable/modules/calibration.html), abgerufen 2026-09-17.

Modellbewertung und Fehlertypen sind kanonisch in [KB-0343](13-modellbewertung-und-fehlertypen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Konforme Vorhersage (Conformal Prediction), die statistisch garantierte Unsicherheitsintervalle statt reiner Punktkonfidenz liefert | Adopting | Gegenüber einfacher Konfidenz-Schwellenwertbildung für statistisch abgesicherte Unsicherheitsquantifizierung bevorzugen. |
| Automatisierte, kontinuierliche Kalibrierungsüberwachung in Produktion, die Verschiebungen zeitnah erkennt | Emerging | Beobachten; würde manuelle periodische Neukalibrierung ergänzen, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Kalibrierungs- und Abstentionsstrategie erst, wenn die Kalibrierung empirisch gemessen und Abstentionsschwellen auf kalibrierter Konfidenz basiert dokumentiert sind.
