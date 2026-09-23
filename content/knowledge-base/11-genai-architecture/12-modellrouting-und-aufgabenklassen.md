---
{"id": "KB-0252", "title": "Modellrouting und Aufgabenklassen", "domain": "11", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0250", "concepts": ["Model Gateways"], "needed_for": "understanding"}, {"id": "KB-0249", "concepts": ["Reasoning Models"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Routing-Modell implementieren, das Anfragen anhand gemessener Risiko-, Schwierigkeits- und Kostenmerkmale statt Modellnamen klassifiziert.", "rationale": "Der Unterschied zwischen namensbasiertem und messungsbasiertem Routing wird erst durch konkrete Implementierung von Entscheidungsmerkmalen greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Routing-Strategie für einen konkreten Anwendungsfall begründet gestalten, basierend auf gemessenen Risiko-, Schwierigkeits- und Kostenmerkmalen.", "rationale": "Routing-Entscheidungen anhand tatsächlich gemessener Merkmale statt Modellnamen sind robuster gegen Modell-Updates und Anbieteränderungen."}, "STAFF-TARGET": {"active": true, "scope": "Eine Fehlklassifikation (falsches Modell für eine Aufgabe gewählt) auf unzureichende Entscheidungsmerkmale statt auf einen zufälligen Routing-Fehler zurückführen können.", "rationale": "Fehlklassifikation ist oft ein systematisches Problem der Merkmalswahl, nicht ein zufälliges Einzelereignis."}, "CHIEF-TARGET": {"active": true, "scope": "Modellrouting als messungsbasierte Entscheidung über Risiko, Schwierigkeit und Kosten positionieren, nicht als statische Zuordnung nach Modellnamen.", "rationale": "Modellnamen und -versionen ändern sich häufig; robuste Routing-Systeme basieren auf stabilen, messbaren Aufgabenmerkmalen statt auf sich ändernden Bezeichnungen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Anbieterspezifische Routing-Werkzeug-Implementierungen sind Vertiefung.", "rationale": "Kern ist das Prinzip messungsbasierten Routings, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0252-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für messungsbasiertes Routing nach Risiko, Schwierigkeit und Kosten", "evidence": "Eine Anfrage wird anhand gemessener Merkmale (geschätzte Aufgabenschwierigkeit, Risikograd der Konsequenzen, Kostenbudget) einem geeigneten Modell zugeordnet, statt eine feste, namensbasierte Zuordnung zu verwenden.", "limitations": "Kein echtes produktives Routing-System, keine reale Modellqualitätsmessung, keine Produktion."}]}
---
# Modellrouting und Aufgabenklassen

> **Ziel:** Modellrouting sollte Anfragen anhand gemessener Merkmale (Risiko, Schwierigkeit, Kosten) einem geeigneten Modell zuordnen, nicht anhand statischer Modellnamen — Modellnamen und -versionen ändern sich häufig, während stabile Aufgabenmerkmale eine robustere, nachvollziehbarere Grundlage für Routing-Entscheidungen bieten. Fehlklassifikation ist oft ein systematisches Problem unzureichender Entscheidungsmerkmale, kein zufälliger Fehler.

## Zweck, Mental Model und Dependencies

Namensbasiertes Routing (z. B. "nutze Modell X für Aufgabentyp Y") ist fragil, weil es implizit von einer stabilen Eigenschaft eines bestimmten Modells ausgeht — wenn der Anbieter das Modell aktualisiert, ersetzt oder deprecatet (siehe [KB-0251](11-providerabstraktion-und-portabilitaet.md) für API-EOL-Risiken), bricht die Routing-Logik oder liefert stillschweigend andere Qualität, ohne dass dies offensichtlich wird. Messungsbasiertes Routing entkoppelt die Entscheidung von einem spezifischen Modellnamen und basiert stattdessen auf tatsächlich gemessenen Aufgabenmerkmalen: Risiko beschreibt, wie schwerwiegend die Konsequenzen eines Fehlers wären (eine informelle interne Zusammenfassung hat geringeres Risiko als eine automatisierte Finanzentscheidung), Schwierigkeit beschreibt die tatsächliche Komplexität der Aufgabe (siehe [KB-0249](09-reasoning-models-und-aufgabenwahl.md) für die verwandte Frage der Reasoning-Modellwahl), und Kosten beschreibt das verfügbare Budget für diese spezifische Anfrageklasse. Diese Merkmale werden gegen aktuelle Modellcharakteristika (die selbst über Zeit gemessen und aktualisiert werden, nicht als statische Annahme fortgeschrieben) abgeglichen, um die tatsächlich geeignetste verfügbare Option zu wählen — unabhängig davon, welches spezifische Modell diese Option gerade darstellt.

~~~text
Name-based routing:        "use Model X for task type Y" -> fragile, breaks silently when Model X changes/deprecates
Measurement-based routing:  classify by RISK + DIFFICULTY + COST -> match against CURRENT, measured model characteristics
Model characteristics are measured continuously, not assumed once and left static
Misclassification is usually a feature-quality problem, not a random routing glitch
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Risikobewertung | ist ein systematischer Mechanismus vorhanden, um Konsequenzschwere einer Anfrage einzuschätzen? | fehlende Risikobewertung führt zu unangemessenem Modelleinsatz für hochriskante Aufgaben |
| Schwierigkeitsmessung | wird tatsächliche Aufgabenschwierigkeit gemessen, statt anhand oberflächlicher Merkmale (Textlänge) geschätzt? | oberflächliche Schwierigkeitsschätzung führt zu Fehlklassifikation bei tatsächlich komplexen, aber kurz formulierten Aufgaben |
| Kostenbudget-Integration | ist das verfügbare Kostenbudget explizit Teil der Routing-Entscheidung? | Routing ignoriert Kostenbudget, wählt durchgängig das leistungsfähigste (teuerste) Modell |
| Kontinuierliche Modellcharakteristik-Messung | werden Modellcharakteristika (Qualität, Latenz, Kosten) aktuell gemessen, statt einmalig angenommen? | veraltete Modellcharakteristik-Annahmen führen zu suboptimalem Routing nach Modell-Updates |

Implementierung: eine Risikoklassifikation wird für Anfragetypen definiert (z. B. basierend auf der nachgelagerten Verwendung der Antwort — informell vs. automatisierte Entscheidung), die bestimmt, welches Mindestmaß an Zuverlässigkeit erforderlich ist. Schwierigkeit wird anhand tatsächlicher Aufgabenmerkmale geschätzt (Anzahl der erforderlichen Schlussfolgerungsschritte, Domänenspezifität), nicht anhand oberflächlicher Proxys wie Texteingabelänge. Kostenbudget wird explizit als Routing-Parameter integriert, sodass die Entscheidung eine bewusste Abwägung zwischen Qualität und Kosten darstellt, nicht eine unreflektierte Wahl des leistungsfähigsten verfügbaren Modells. Modellcharakteristika (tatsächlich gemessene Qualität, Latenz, Kosten für relevante Aufgabentypen) werden kontinuierlich aktualisiert, statt einmalig zum Zeitpunkt der Routing-Implementierung angenommen und danach nie wieder überprüft zu werden.

## Scalability, Reliability, Security und Observability

Messungsbasiertes Routing skaliert Robustheit gegen Modelländerungen über Zeit, weil die Routing-Logik nicht an spezifische Modellnamen gekoppelt ist, sondern automatisch auf aktuelle, gemessene Modellcharakteristika reagieren kann. Reliability-Grenze: ohne kontinuierliche Messung ist auch messungsbasiertes Routing nur so gut wie seine letzte Aktualisierung — veraltete Charakteristik-Annahmen können zu suboptimalem Routing führen, das sich schleichend verschlechtert, ohne dass dies ohne aktive Überwachung sichtbar wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Aufgabenklasse wird konsistent einem ungeeigneten Modell zugeordnet | Entscheidungsmerkmale (Risiko/Schwierigkeit) sind unzureichend definiert oder gemessen | Merkmalsdefinition für die betroffene Aufgabenklasse auf Vollständigkeit und Genauigkeit prüfen |
| Routing-Qualität hat sich seit einem Modell-Update verschlechtert | Modellcharakteristik-Annahmen wurden nicht aktualisiert, veraltete Messung liegt der Entscheidung zugrunde | letzten Aktualisierungszeitpunkt der Modellcharakteristik-Messung gegen den Zeitpunkt des Modell-Updates prüfen |
| Routing wählt durchgängig das teuerste verfügbare Modell | Kostenbudget ist nicht als Routing-Parameter integriert, nur Qualitätsmaximierung erfolgt | Routing-Logik auf explizite Kostenbudget-Berücksichtigung prüfen |
| hochriskante Aufgaben werden mit demselben Modell wie niedrigriskante behandelt | fehlende oder unzureichende Risikoklassifikation der Aufgabenklasse | Risikoklassifikation für die betroffene Aufgabenklasse gegen die tatsächlichen Konsequenzen eines Fehlers prüfen |

Security: Risikoklassifikation sollte auch Sicherheits- und Compliance-relevante Faktoren berücksichtigen (z. B. ob eine Anfrage personenbezogene Daten oder regulatorisch sensible Inhalte betrifft), da diese Faktoren zusätzliche Anforderungen an das gewählte Modell oder zusätzliche Validierungsschritte auslösen können. Observability: Verteilung der Anfragen nach Aufgabenklasse und gewähltem Modell, tatsächliche Ergebnisqualität pro Aufgabenklasse/Modell-Kombination und Kostenentwicklung pro Aufgabenklasse sind zentrale Metriken für Routing-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** implementiert Routing basierend auf gemessenen Merkmalen, nicht statischen Modellnamen. **Principal** macht Risiko-, Schwierigkeits- und Kostenklassifikation für das Team nachvollziehbar dokumentiert. **Chief** positioniert Modellrouting als kontinuierlich messungsbasierte Entscheidung, nicht als einmalig festgelegte, statische Zuordnung.

Anti-Patterns: Routing-Logik direkt an spezifische Modellnamen koppeln, die bei Anbieteränderungen bricht; Schwierigkeit anhand oberflächlicher Proxys wie Texteingabelänge statt tatsächlicher Aufgabenkomplexität schätzen; Modellcharakteristika einmalig annehmen und nie aktualisieren, obwohl sich Modelle über Zeit ändern.

## Production Checklist

- [ ] Routing basiert auf gemessenen Risiko-, Schwierigkeits- und Kostenmerkmalen, nicht auf statischen Modellnamen.
- [ ] Risikoklassifikation berücksichtigt tatsächliche Konsequenzschwere, inklusive Sicherheits-/Compliance-Faktoren.
- [ ] Kostenbudget ist explizit als Routing-Parameter integriert.
- [ ] Modellcharakteristika werden kontinuierlich gemessen und aktualisiert.

## Interviewfragen

### 1. Warum ist namensbasiertes Routing fragiler als messungsbasiertes Routing?

**Antwort:** Namensbasiertes Routing geht implizit von einer stabilen Eigenschaft eines bestimmten Modells aus; wenn der Anbieter das Modell aktualisiert oder ersetzt, bricht die Routing-Logik oder liefert stillschweigend andere Qualität, während messungsbasiertes Routing auf stabilen Aufgabenmerkmalen basiert und sich automatisch an aktuelle Modellcharakteristika anpassen kann.

### 2. Was sind die drei zentralen Entscheidungsmerkmale für messungsbasiertes Routing?

**Antwort:** Risiko (Konsequenzschwere eines Fehlers), Schwierigkeit (tatsächliche Aufgabenkomplexität) und Kosten (verfügbares Budget) — diese Merkmale werden gegen aktuelle, gemessene Modellcharakteristika abgeglichen, um die geeignetste verfügbare Option zu wählen.

### 3. Warum ist Textlänge ein unzureichender Proxy für Aufgabenschwierigkeit?

**Antwort:** Eine kurze Aufgabenformulierung kann trotzdem hohe Komplexität erfordern (z. B. eine kurze, aber vielschichtige logische Frage), während eine lange Eingabe trivial sein kann — tatsächliche Schwierigkeit hängt von der erforderlichen Schlussfolgerungstiefe und Domänenspezifität ab, nicht von der Textlänge.

### 4. Wie diagnostizierst du, dass eine Aufgabenklasse konsistent einem ungeeigneten Modell zugeordnet wird?

**Antwort:** Ich prüfe die Merkmalsdefinition (Risiko, Schwierigkeit) für die betroffene Aufgabenklasse auf Vollständigkeit und Genauigkeit — eine systematische Fehlklassifikation deutet meist auf unzureichende oder ungenaue Entscheidungsmerkmale hin, nicht auf einen zufälligen Routing-Fehler.

### 5. Warum muss Modellcharakteristik-Messung kontinuierlich erfolgen, statt einmalig angenommen zu werden?

**Antwort:** Modelle werden von Anbietern regelmäßig aktualisiert, was ihre tatsächliche Qualität, Latenz und Kosten für bestimmte Aufgabentypen verändern kann; eine einmalig getroffene Annahme wird mit der Zeit veraltet und führt zu suboptimalem Routing, das ohne kontinuierliche Messung unentdeckt bleibt.

### 6. Widersprüchliche Anforderung: Team will für jede Anfrage automatisch das qualitativ bestmögliche Modell wählen UND striktes, vorhersehbares Gesamtkostenbudget einhalten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass automatische Wahl des qualitativ besten Modells für jede Anfrage tendenziell zu unvorhersehbaren, tendenziell hohen Kosten führt; ich würde vorschlagen, Kostenbudget explizit als Routing-Parameter neben Qualität zu integrieren, sodass die Routing-Entscheidung eine bewusste, für jede Risikoklasse angemessene Qualitäts-Kosten-Abwägung darstellt, statt Qualität ohne Kostenrücksicht zu maximieren.

## Praktische Labs

~~~python
# Measurement-based model routing by risk, difficulty, and cost
model_characteristics = {
    "fast_cheap": {"quality_score": 0.7, "cost_per_request": 0.01, "latency_ms": 200},
    "balanced": {"quality_score": 0.85, "cost_per_request": 0.05, "latency_ms": 500},
    "premium": {"quality_score": 0.95, "cost_per_request": 0.20, "latency_ms": 1200},
}

def route_request(risk_level, difficulty_score, cost_budget):
    # high risk always requires minimum quality threshold regardless of cost preference
    min_quality = 0.9 if risk_level == "high" else (0.8 if difficulty_score > 0.6 else 0.6)

    candidates = [
        (name, chars) for name, chars in model_characteristics.items()
        if chars["quality_score"] >= min_quality and chars["cost_per_request"] <= cost_budget
    ]
    if not candidates:
        return "NO SUITABLE MODEL within constraints"

    # pick cheapest among candidates meeting quality bar
    chosen = min(candidates, key=lambda c: c[1]["cost_per_request"])
    return f"{chosen[0]} (quality={chosen[1]['quality_score']}, cost={chosen[1]['cost_per_request']})"

print(f"Low-risk, simple task, budget 0.02: {route_request('low', 0.3, 0.02)}")
print(f"High-risk task, budget 0.30: {route_request('high', 0.5, 0.30)}")
print(f"High-risk task, budget 0.05 (insufficient): {route_request('high', 0.5, 0.05)}")

result = route_request('high', 0.5, 0.05)
assert "NO SUITABLE" in result
print("\nHigh-risk tasks are never routed to underqualified models, even under budget pressure - the constraint is explicit, not silently violated.")
~~~

## Dependencies, Cross-References und Quellen

1. LiteLLM: [Router and Load Balancing](https://docs.litellm.ai/docs/routing), abgerufen 2026-09-17.
2. Martian: [Model Routing Research](https://withmartian.com/), abgerufen 2026-09-17.
3. Chen et al.: [FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance](https://arxiv.org/abs/2305.05176), abgerufen 2026-09-17.

Model-Gateway- und Reasoning-Modell-Grundlagen sind kanonisch in [KB-0250](10-model-gateways.md) und [KB-0249](09-reasoning-models-und-aufgabenwahl.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, lernbasierte Routing-Systeme, die aus Qualitätsfeedback kontinuierlich Modellcharakteristiken aktualisieren | Adopting | Gegenüber manuell gepflegten, statischen Charakteristik-Tabellen für dynamische Umgebungen bevorzugen. |
| Kaskadierendes Routing (günstiges Modell zuerst, Eskalation zu teurerem Modell nur bei erkannter Unsicherheit) | Adopting | Für kostensensitive Anwendungsfälle mit variabler Aufgabenschwierigkeit evaluieren. |

Ein Team akzeptiert ein Modellrouting-Design erst, wenn Entscheidungsmerkmale messungsbasiert definiert und Modellcharakteristiken nachweisbar kontinuierlich aktualisiert werden.
