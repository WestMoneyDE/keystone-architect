---
{"id": "KB-0343", "title": "Modellbewertung und Fehlertypen", "domain": "14", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0335", "concepts": ["Loss Functions und Lernziele"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Konfusionsmatrix für ein Klassifikationsmodell erstellen und daraus abgeleitete Metriken (Precision, Recall, F1) berechnen, um die Grenzen eines einzelnen Genauigkeitswerts zu demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Bewertungsstrategie für ein konkretes Modell gestalten, die aufgabenspezifische Fehlermatrizen statt eines einzelnen aggregierten Metrikwerts nutzt, um Fehlertypen differenziert zu bewerten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine trotz guter Gesamtgenauigkeit inakzeptable Modellleistung auf eine unzureichend differenzierte Bewertung statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Modellbewertung als mehrdimensionale, fehlertypbewusste Praxis positionieren, die aufgabenspezifische Fehlerkosten und Datenverteilung explizit berücksichtigt, nicht als einzelnen aggregierten Kennzahlwert.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Generierungsmetriken (BLEU, ROUGE, BERTScore) sind Vertiefung.", "rationale": "Kern ist das Prinzip differenzierter Fehlertypbewertung, nicht die konkrete Metrikformel für Generierungsaufgaben."}}, "lab_validation": [{"lab_id": "KB-0343-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokale Konfusionsmatrix-Berechnung für ein binäres Klassifikationsmodell mit unausgewogenen Klassen", "evidence": "Ein Modell mit 95 Prozent Gesamtgenauigkeit zeigt in der Konfusionsmatrix, dass es die seltenere, kritische Klasse fast nie korrekt erkennt, was durch die aggregierte Genauigkeitsmetrik allein verborgen bliebe.", "limitations": "Kein produktives Bewertungssystem, kein realer Geschäftsdatensatz, keine reale Fehlerkosten-Kalibrierung."}]}
---
# Modellbewertung und Fehlertypen

> **Ziel:** Klassifikations-, Regressions- und Generierungsmetriken (aufbauend auf Loss Functions, siehe [KB-0335](05-loss-functions-und-lernziele.md)) müssen aufgabenspezifisch gewählt werden. Der zentrale Punkt ist, Datenverteilung und Fehlerkosten anhand aufgabenspezifischer Fehlermatrizen (z. B. einer Konfusionsmatrix) statt eines einzelnen aggregierten Kennzahlwerts zu bewerten — ein einzelner Wert wie Gesamtgenauigkeit kann kritische Schwächen bei bestimmten Fehlertypen oder Datenuntergruppen vollständig verbergen.

## Zweck, Mental Model und Dependencies

Klassifikationsmetriken (Genauigkeit, Precision, Recall, F1) bewerten, wie gut ein Modell diskrete Kategorien vorhersagt. Regressionsmetriken (mittlerer quadratischer Fehler, mittlerer absoluter Fehler) bewerten die Genauigkeit kontinuierlicher Vorhersagen. Generierungsmetriken (BLEU, ROUGE, BERTScore) bewerten die Qualität generierter Texte gegenüber Referenztexten. Der zentrale, oft übersehene Fehler ist, sich auf einen einzelnen aggregierten Kennzahlwert (z. B. Gesamtgenauigkeit) zu verlassen, ohne die zugrunde liegende Fehlerverteilung zu betrachten: eine Konfusionsmatrix zeigt für Klassifikationsprobleme nicht nur die Gesamtgenauigkeit, sondern die genaue Verteilung, welche tatsächliche Klasse wie oft als welche vorhergesagte Klasse klassifiziert wurde — dies macht sichtbar, ob ein Modell bestimmte Fehlertypen (z. B. falsch-negative Vorhersagen für eine kritische, aber seltene Klasse) systematisch häufiger macht als andere, was ein einzelner Genauigkeitswert vollständig verbergen kann (verwandt mit dem Problem unausgewogener Klassen bei Loss Functions, siehe [KB-0335](05-loss-functions-und-lernziele.md)). Fehlerkosten sind der zweite zentrale Faktor: verschiedene Fehlertypen können in der Praxis unterschiedlich teuer sein, und eine Bewertung, die alle Fehler gleich gewichtet, spiegelt diese tatsächlichen geschäftlichen Konsequenzen nicht wider — eine aufgabenspezifische Fehlermatrix macht sichtbar, welche konkreten Fehlertypen mit welcher Häufigkeit auftreten, sodass diese gegen die tatsächlichen Kosten jedes Fehlertyps bewertet werden können.

~~~text
Classification metrics: accuracy, precision, recall, F1 -> how well discrete categories are predicted
Regression metrics: MSE, MAE -> accuracy of continuous predictions
Generation metrics: BLEU, ROUGE, BERTScore -> quality of generated text vs reference
CRITICAL ERROR: relying on a SINGLE aggregated metric (e.g. overall accuracy) without examining the error distribution
Confusion matrix: shows EXACT distribution of which true class was predicted as which class
  -> reveals systematic errors on a specific (often rare, critical) class that a single accuracy number HIDES
Error costs: different error types can have DIFFERENT real-world costs
  -> task-specific error matrix makes visible WHICH error types occur, enabling weighting against ACTUAL costs
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Passende Metrikwahl je nach Aufgabentyp | ist die gewählte Metrik (Klassifikation, Regression, Generierung) tatsächlich für die Struktur der Aufgabe geeignet? | eine unpassende Metrikwahl kann eine für die tatsächliche Aufgabe irrelevante Qualitätsaussage liefern |
| Nutzung einer Fehlermatrix statt eines einzelnen Aggregatwerts | wird eine Konfusionsmatrix oder ähnliche aufgabenspezifische Fehlermatrix genutzt, um die Verteilung der Fehlertypen sichtbar zu machen? | ohne diese Matrix kann ein einzelner aggregierter Wert eine systematische Schwäche bei einem spezifischen Fehlertyp verbergen |
| Explizite Berücksichtigung von Fehlerkosten | werden unterschiedliche Fehlertypen anhand ihrer tatsächlichen geschäftlichen Kosten bewertet, nicht nur nach Häufigkeit? | eine ausschließlich häufigkeitsbasierte Bewertung kann einen seltenen, aber teuren Fehlertyp unterschätzen |
| Berücksichtigung der Datenverteilung bei der Bewertung | wird die Bewertung getrennt für unterschiedliche Datenuntergruppen (z. B. Klassen, demografische Gruppen) durchgeführt? | eine ausschließlich globale Bewertung kann schlechte Leistung bei spezifischen, kleineren Datenuntergruppen übersehen |

Implementierung: Die Bewertungsmetrik wird explizit passend zur Aufgabenstruktur (Klassifikation, Regression, Generierung) gewählt. Für Klassifikationsaufgaben wird zusätzlich zu einem aggregierten Wert eine vollständige Konfusionsmatrix erstellt, die die Verteilung der Fehlertypen sichtbar macht. Fehlerkosten werden für unterschiedliche Fehlertypen explizit definiert (z. B. anhand geschätzter geschäftlicher Konsequenzen) und bei der Bewertung berücksichtigt, statt alle Fehler gleich zu gewichten. Die Bewertung wird zusätzlich getrennt für relevante Datenuntergruppen durchgeführt, um schlechte Leistung bei spezifischen, möglicherweise kleineren Gruppen zu erkennen, die in einer globalen Bewertung untergehen könnten.

## Scalability, Reliability, Security und Observability

Aufgabenspezifische Fehlermatrizen skalieren die Fähigkeit, echte Modellprobleme zu erkennen, proportional zur Granularität der Bewertung; die Reliability-Grenze liegt in einer ausschließlich aggregierten Bewertung, die mit wachsender Diversität der Datenverteilung proportional mehr untergruppenspezifische oder fehlertypspezifische Schwächen verbergen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Modell zeigt trotz hoher Gesamtgenauigkeit inakzeptable Leistung in der Praxis | eine kritische, aber seltene Klasse oder ein spezifischer Fehlertyp wird durch die aggregierte Gesamtgenauigkeit verborgen | eine vollständige Konfusionsmatrix erstellen und die Leistung getrennt für jede Klasse prüfen |
| ein Modell macht überproportional oft den teuren Fehlertyp statt des günstigeren | die Bewertung berücksichtigt keine Fehlerkosten-Gewichtung, sondern behandelt alle Fehler gleich | die Fehlermatrix explizit gegen die tatsächlichen, geschätzten Kosten jedes Fehlertyps auswerten |
| ein Modell zeigt bei bestimmten Datenuntergruppen deutlich schlechtere Leistung als im globalen Durchschnitt | die Bewertung wurde nur global, nicht getrennt für relevante Untergruppen durchgeführt | die Bewertungsmetrik getrennt für relevante Datenuntergruppen berechnen und mit dem globalen Wert vergleichen |

Security: Eine Modellbewertung, die schlechte Leistung bei sicherheitsrelevanten Fehlertypen (z. B. übersehene Betrugsfälle) durch eine gute Gesamtgenauigkeit verbirgt, kann zu einer unentdeckten, aber tatsächlich erheblichen Sicherheitslücke führen. Observability: vollständige Konfusionsmatrix pro Evaluationslauf, Leistung getrennt nach relevanten Datenuntergruppen und Fehlerkosten-gewichtete Gesamtbewertung sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** erstellt für Klassifikationsaufgaben immer eine vollständige Konfusionsmatrix, nicht nur einen aggregierten Genauigkeitswert. **Principal** macht Fehlerkosten-Definitionen und deren Anwendung für das Team nachvollziehbar dokumentiert. **Chief** positioniert Modellbewertung als mehrdimensionale, fehlertypbewusste Praxis, die aufgabenspezifische Kosten und Datenverteilung explizit berücksichtigt.

Anti-Patterns: sich ausschließlich auf einen einzelnen aggregierten Metrikwert ohne Fehlermatrix verlassen; unterschiedliche Fehlertypen ohne Berücksichtigung ihrer tatsächlichen Kosten gleich gewichten; die Bewertung nur global durchführen, ohne relevante Datenuntergruppen getrennt zu prüfen.

## Production Checklist

- [ ] Die gewählte Metrik passt zur tatsächlichen Aufgabenstruktur.
- [ ] Eine vollständige Fehlermatrix (z. B. Konfusionsmatrix) ergänzt jeden aggregierten Metrikwert.
- [ ] Fehlerkosten sind explizit definiert und in der Bewertung berücksichtigt.
- [ ] Die Bewertung erfolgt zusätzlich getrennt für relevante Datenuntergruppen.

## Interviewfragen

### 1. Warum reicht ein einzelner aggregierter Metrikwert wie Gesamtgenauigkeit oft nicht aus?

**Antwort:** Er kann eine systematische Schwäche bei einem spezifischen, möglicherweise kritischen Fehlertyp oder einer seltenen Klasse verbergen, die erst durch eine detaillierte Fehlermatrix sichtbar wird.

### 2. Was zeigt eine Konfusionsmatrix, das ein einzelner Genauigkeitswert nicht zeigt?

**Antwort:** Sie zeigt die exakte Verteilung, welche tatsächliche Klasse wie oft als welche vorhergesagte Klasse klassifiziert wurde, wodurch systematische Fehlertypen sichtbar werden.

### 3. Warum sollten unterschiedliche Fehlertypen unterschiedlich gewichtet werden?

**Antwort:** Verschiedene Fehlertypen können in der Praxis unterschiedlich teuer sein; eine Bewertung, die alle Fehler gleich gewichtet, spiegelt diese tatsächlichen geschäftlichen Konsequenzen nicht wider.

### 4. Warum sollte eine Bewertung getrennt für verschiedene Datenuntergruppen durchgeführt werden?

**Antwort:** Eine ausschließlich globale Bewertung kann schlechte Leistung bei spezifischen, möglicherweise kleineren Datenuntergruppen übersehen, die im globalen Durchschnitt untergehen.

### 5. Wie diagnostizierst du eine trotz hoher Gesamtgenauigkeit inakzeptable Modellleistung?

**Antwort:** Ich erstelle eine vollständige Konfusionsmatrix und prüfe die Leistung getrennt für jede Klasse — eine schlechte Erkennungsrate bei einer kritischen, aber seltenen Klasse ist die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will eine einzige, einfache Kennzahl für Modellqualität für schnelles Reporting UND garantiert vollständige Transparenz über alle Fehlertypen und Datenuntergruppen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine einzige Kennzahl Detailinformation notwendigerweise verliert; ich würde vorschlagen, weiterhin eine einfache Gesamtkennzahl für schnelles Reporting zu nutzen, aber zusätzlich eine dedizierte, immer verfügbare Fehlermatrix und Untergruppenanalyse als ergänzende Detailinformation bereitzustellen, statt auf die Gesamtkennzahl zu verzichten oder die Detailinformation wegzulassen.

## Praktische Labs

~~~python
import torch

# Confusion matrix reveals what overall accuracy hides for imbalanced classes
predictions = torch.tensor([0] * 97 + [0] * 3)  # model almost always predicts class 0
true_labels = torch.tensor([0] * 95 + [1] * 5)  # 95% class 0, 5% critical class 1

def confusion_matrix(preds, labels, num_classes=2):
    matrix = torch.zeros((num_classes, num_classes), dtype=torch.int64)
    for p, t in zip(preds, labels):
        matrix[t, p] += 1
    return matrix

overall_accuracy = (predictions == true_labels).float().mean().item()
matrix = confusion_matrix(predictions, true_labels)

print(f"Overall accuracy (looks good): {overall_accuracy:.2%}")
print(f"Confusion matrix:\n{matrix}")

class_1_recall = matrix[1, 1].item() / matrix[1].sum().item() if matrix[1].sum() > 0 else 0
print(f"Recall on critical minority class 1: {class_1_recall:.2%}")
print("High overall accuracy HIDES that the critical minority class is almost never correctly detected.")
~~~

## Dependencies, Cross-References und Quellen

1. Scikit-learn: [Model Evaluation Documentation — Confusion Matrix](https://scikit-learn.org/stable/modules/model_evaluation.html), abgerufen 2026-09-17.
2. Papineni et al.: [BLEU — A Method for Automatic Evaluation of Machine Translation](https://aclanthology.org/P02-1040/), abgerufen 2026-09-17.
3. He, Garcia: [Learning from Imbalanced Data](https://ieeexplore.ieee.org/document/5128907), abgerufen 2026-09-17.

Loss Functions und Lernziele sind kanonisch in [KB-0335](05-loss-functions-und-lernziele.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Fairness- und Untergruppen-Analyse-Werkzeuge, die systematisch Leistungsunterschiede über Datensegmente hinweg identifizieren | Adopting | Gegenüber manueller Untergruppenauswahl für systematischere Erkennung verborgener Leistungsunterschiede bevorzugen. |
| LLM-basierte, feinere Generierungsbewertung, die über einfache n-Gramm-Metriken (BLEU, ROUGE) hinausgeht | Adopting | Gegenüber ausschließlich n-Gramm-basierten Metriken für semantisch aussagekräftigere Generierungsbewertung bevorzugen, mit Stichprobenprüfung gegen menschliche Bewertung. |

Ein Team akzeptiert eine Modellbewertungsstrategie erst, wenn aufgabenspezifische Fehlermatrizen, Fehlerkosten und Untergruppenanalyse dokumentiert und getestet sind.
