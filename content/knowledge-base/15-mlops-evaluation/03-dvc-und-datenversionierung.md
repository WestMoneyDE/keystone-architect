---
{"id": "KB-0353", "title": "DVC und Datenversionierung", "domain": "15", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0346", "concepts": ["Datensplits und Leakage"], "needed_for": "understanding"}], "related": ["KB-0351"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Datensatz mit DVC content-adressiert versionieren, zu einem Remote pushen und eine frühere Datenversion wiederherstellen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine DVC-Pipeline mit Abhängigkeiten zwischen Datenverarbeitungsschritten gestalten, die reproduzierbare Neuberechnung bei Datenänderung ermöglicht.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Team davon überzeugen, große Datenstände über DVC statt direkt über Git zu versionieren, um Repository-Performance und Nachvollziehbarkeit zu erhalten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Datenversionierung als gleichrangigen Governance-Standard neben Codeversionierung im Unternehmen etablieren, um Modell-Reproduzierbarkeit bis zur exakten Datengrundlage sicherzustellen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Der Betrieb komplexer, mehrstufiger DVC-Pipelines mit verteilten Remotes im großen Maßstab ist Vertiefung.", "rationale": "Kern ist das Verständnis von Content-Adressierung und Pipeline-Abhängigkeiten, nicht der Betrieb einer spezifischen Infrastruktur."}}, "lab_validation": [{"lab_id": "KB-0353-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales DVC-Repository mit einem kleinen synthetischen Datensatz und einer einfachen Verarbeitungspipeline", "evidence": "Ein Datensatz wird mit DVC versioniert (content-adressiert über einen Hash statt direkt in Git gespeichert), eine Änderung am Datensatz erzeugt eine neue Version, und ein Rollback zur vorherigen Version stellt exakt den ursprünglichen Datenstand wieder her, während das Git-Repository selbst nur kleine Referenzdateien statt der Binärdaten enthält.", "limitations": "Kein produktiver Remote-Storage-Dienst, kein realer Geschäftsdatensatz, kleine Datenmenge."}]}
---
# DVC und Datenversionierung

> **Ziel:** DVC (Data Version Control) versioniert große Datenstände nachvollziehbar über Content-Adressierung (Dateien werden über einen Hash ihres Inhalts statt über ihren Namen identifiziert), Remotes (externe Speicherorte für die eigentlichen Binärdaten) und Pipeline-Abhängigkeiten (Verarbeitungsschritte, die bei Änderung ihrer Eingaben automatisch als veraltet erkannt werden), ohne das Git-Repository selbst mit großen Binärdaten zu überladen. Dies ergänzt die Datensplit-Disziplin (siehe [KB-0346](../14-ml-engineering/16-datensplits-und-leakage.md)) um eine nachvollziehbare Versionshistorie der zugrunde liegenden Daten selbst.

## Zweck, Mental Model und Dependencies

Git ist für Textdateien (Code) optimiert und speichert bei jeder Änderung effizient nur die Differenz; bei großen Binärdateien (Datensätze, Modellartefakte) funktioniert dieser Differenzmechanismus nicht, wodurch das Repository bei direkter Speicherung großer Datenstände in Git schnell unpraktikabel groß und langsam würde. DVC löst dies durch Content-Adressierung: statt die eigentlichen Binärdaten in Git zu speichern, speichert Git nur eine kleine Referenzdatei mit dem Hash des Dateiinhalts, während die tatsächlichen Daten in einem separaten Remote (z. B. Cloud-Speicher) abgelegt werden. Da der Hash vom Inhalt abhängt, identifiziert er einen Datenstand eindeutig — ändert sich der Inhalt, ändert sich der Hash, und eine neue Version wird referenziert, während alte Versionen weiterhin über ihren ursprünglichen Hash abrufbar bleiben. Pipeline-Abhängigkeiten erlauben es, Verarbeitungsschritte (z. B. Rohdaten → bereinigte Daten → Trainingsdaten) explizit zu definieren; ändert sich eine Eingabedatei, erkennt DVC automatisch, welche nachgelagerten Schritte veraltet sind und neu berechnet werden müssen, statt dass diese Abhängigkeit manuell nachverfolgt werden muss.

~~~text
Problem: Git's diff-based storage is efficient for TEXT (code), inefficient for large BINARY data (datasets/artifacts)
  -> storing large data directly in Git makes the repo impractically large and slow
DVC solution: content-addressing
  Git stores: small reference file with a HASH of the data's content
  Remote (cloud storage) stores: the actual binary data
  -> hash changes when content changes -> new version referenced, OLD versions still retrievable by their hash
Pipeline dependencies: raw data -> cleaned data -> training data, explicitly declared
  -> input file changes -> DVC automatically detects which downstream steps are now STALE and need recomputation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Rolle | Problem ohne dieses Konzept |
|---|---|---|
| Content-Adressierung | identifiziert einen Datenstand eindeutig über den Inhalts-Hash | Git-Repository wird durch direkte Binärdatenspeicherung unpraktikabel groß |
| Remote | speichert die tatsächlichen Binärdaten getrennt vom Git-Repository | Datenversionen sind nicht zentral und teamweit zugänglich abgelegt |
| Pipeline-Abhängigkeiten | erkennt automatisch veraltete Verarbeitungsschritte bei Datenänderung | manuelle Nachverfolgung, welche Schritte nach einer Datenänderung neu berechnet werden müssen |

Implementierung: Große Datenstände werden mit DVC statt direkt mit Git versioniert; Git verwaltet dabei nur kleine Referenzdateien, während die eigentlichen Daten zu einem konfigurierten Remote hochgeladen werden. Verarbeitungsschritte (z. B. Datenbereinigung, Split-Erzeugung) werden als DVC-Pipeline mit expliziten Eingabe-/Ausgabeabhängigkeiten definiert, sodass eine Änderung an den Rohdaten automatisch erkennt, welche nachgelagerten Schritte neu ausgeführt werden müssen. Ein Rollback zu einer früheren Datenversion erfolgt durch Zurücksetzen der Referenzdatei in Git auf einen früheren Commit, wodurch DVC die exakt zugehörige Datenversion vom Remote wiederherstellt.

## Scalability, Reliability, Security und Observability

DVC skaliert Datenversionierung unabhängig von der Repository-Größe, da nur kleine Referenzdateien in Git gespeichert werden; die Reliability-Grenze liegt darin, dass die Verfügbarkeit der eigentlichen Daten von der Verfügbarkeit des konfigurierten Remotes abhängt, nicht mehr von Git allein.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| das Git-Repository wird durch enthaltene Datensätze zunehmend langsam und groß | große Binärdaten wurden direkt in Git statt über DVC versioniert | die betroffenen Dateien nachträglich zu DVC migrieren und aus der Git-Historie der Binärdaten entfernen |
| ein Trainingslauf lässt sich nicht mehr exakt auf die ursprünglich verwendeten Trainingsdaten zurückführen | die Trainingsdaten wurden nicht versioniert, oder der Referenz-Commit zur Datenversion fehlt | den Referenz-Commit zur ursprünglichen DVC-Datenversion im zugehörigen MLflow-Run (siehe [KB-0351](01-mlflow-und-modelllebenszyklen.md)) prüfen |
| nach einer Änderung an den Rohdaten wird nicht klar, welche nachgelagerten Verarbeitungsschritte veraltet sind | keine DVC-Pipeline mit expliziten Abhängigkeiten wurde definiert | die Verarbeitungsschritte als DVC-Pipeline mit expliziten Eingabe-/Ausgabeabhängigkeiten definieren |

Security: Der Zugriff auf das DVC-Remote sollte denselben Zugriffskontrollen unterliegen wie der Zugriff auf die sensiblen Rohdaten selbst, da das Remote die tatsächlichen, potenziell sensiblen Daten enthält. Observability: Die Anzahl der Datenversionen, die Größe der über DVC verwalteten Datenstände und die Aktualität der Pipeline-Abhängigkeiten (welche Schritte als veraltet markiert sind) sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert DVC für alle größeren Datenstände statt direkter Git-Speicherung. **Principal** macht die Datenversions-Historie und Pipeline-Abhängigkeiten für das Team nachvollziehbar. **Chief** etabliert Datenversionierung als gleichrangigen Governance-Standard neben Codeversionierung im Unternehmen.

Anti-Patterns: große Datensätze direkt in Git statt über DVC versionieren; einen Trainingslauf ohne referenzierbare Datenversion protokollieren; Verarbeitungsschritte ohne explizite Pipeline-Abhängigkeiten manuell nachverfolgen.

## Production Checklist

- [ ] Große Datenstände werden über DVC, nicht direkt über Git, versioniert.
- [ ] Jeder Trainingslauf referenziert eine exakte, über DVC nachvollziehbare Datenversion.
- [ ] Verarbeitungsschritte sind als DVC-Pipeline mit expliziten Abhängigkeiten definiert.
- [ ] Der Zugriff auf das DVC-Remote unterliegt denselben Zugriffskontrollen wie die zugrunde liegenden Rohdaten.

## Interviewfragen

### 1. Warum ist Git allein für die Versionierung großer Datensätze ungeeignet?

**Antwort:** Git ist auf effiziente Differenzspeicherung von Textdateien optimiert; bei großen Binärdateien funktioniert dieser Mechanismus nicht, wodurch das Repository unpraktikabel groß und langsam würde.

### 2. Wie funktioniert Content-Adressierung in DVC?

**Antwort:** Git speichert nur eine kleine Referenzdatei mit dem Hash des Dateiinhalts, während die tatsächlichen Daten in einem separaten Remote abgelegt werden; der Hash identifiziert einen Datenstand eindeutig über seinen Inhalt.

### 3. Was passiert bei einer DVC-Pipeline, wenn sich eine Eingabedatei ändert?

**Antwort:** DVC erkennt automatisch, welche nachgelagerten Verarbeitungsschritte durch diese Änderung veraltet sind und neu berechnet werden müssen, ohne dass dies manuell nachverfolgt werden muss.

### 4. Wie stellst du sicher, dass ein Trainingslauf exakt auf die ursprünglich verwendeten Daten zurückführbar ist?

**Antwort:** Indem der zugehörige DVC-Referenz-Commit im Experiment-Tracking-Run (z. B. in MLflow) protokolliert wird, sodass die exakte Datenversion jederzeit über ihren Hash wiederherstellbar ist.

### 5. Wie gehst du vor, wenn ein Repository durch versehentlich direkt in Git gespeicherte Datensätze zunehmend unpraktikabel wird?

**Antwort:** Ich migriere die betroffenen Datensätze zu DVC, entferne die Binärdaten aus der Git-Historie und stelle sicher, dass zukünftige Datenänderungen ausschließlich über DVC versioniert werden.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Datenänderungen UND vollständige Nachvollziehbarkeit jeder historischen Datenversion — wie gehst du vor?

**Antwort:** Ich würde DVC so konfigurieren, dass jede Datenänderung automatisch eine neue, über ihren Hash referenzierbare Version erzeugt, ohne manuellen Zusatzaufwand für das Team, sodass schnelle Änderungen möglich bleiben, während jede historische Version jederzeit über ihren Referenz-Commit wiederherstellbar bleibt.

## Praktische Labs

~~~python
# Konzeptioneller Ablauf typischer DVC-Kommandos (nicht in dieser Umgebung ausgeführt):
commands = [
    "dvc init",
    "dvc remote add -d myremote s3://example-bucket/dvc-store",
    "dvc add data/training_data.csv",   # creates data/training_data.csv.dvc reference file
    "git add data/training_data.csv.dvc .gitignore",
    "git commit -m 'Track training data v1 with DVC'",
    "dvc push",                          # uploads actual data to remote
    # ... later, after data changes ...
    "dvc add data/training_data.csv",   # new hash, new version
    "git add data/training_data.csv.dvc",
    "git commit -m 'Update training data to v2'",
    "dvc push",
    # rollback to v1:
    "git checkout <v1-commit-hash> -- data/training_data.csv.dvc",
    "dvc checkout",                      # restores exact v1 data content from remote
]

for step, cmd in enumerate(commands, 1):
    print(f"{step}. {cmd}")
~~~

## Dependencies, Cross-References und Quellen

1. DVC-Dokumentation: [Data Management](https://dvc.org/doc/user-guide/data-management), abgerufen 2026-09-17.
2. DVC-Dokumentation: [Data Pipelines](https://dvc.org/doc/user-guide/pipelines), abgerufen 2026-09-17.

Datensplits und Leakage sind kanonisch in [KB-0346](../14-ml-engineering/16-datensplits-und-leakage.md) behandelt; MLflow und Modelllebenszyklen in [KB-0351](01-mlflow-und-modelllebenszyklen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Integrierte Datenversionierung direkt in cloud-nativen ML-Plattformen (ohne separates DVC-Tooling) | Evaluating | Gegenüber eigenständigem DVC abwägen, sobald die Plattformintegration ausgereift und portabel genug ist. |
| Automatisierte Datenqualitätsprüfungen als Teil der DVC-Pipeline (vor der Versionierung) | Adopting | Gegenüber reiner Versionierung ohne Qualitätsprüfung für frühzeitigere Fehlererkennung bevorzugen. |

Ein Team akzeptiert eine Datenänderung erst, wenn sie über DVC versioniert und mit einem nachvollziehbaren Referenz-Commit dokumentiert ist.
