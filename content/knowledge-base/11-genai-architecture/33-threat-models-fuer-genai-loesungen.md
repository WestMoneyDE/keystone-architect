---
{"id": "KB-0273", "title": "Threat Models für GenAI-Lösungen", "domain": "11", "sequence": 33, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0260", "concepts": ["Prompt Injection"], "needed_for": "understanding"}, {"id": "KB-0262", "concepts": ["Sicherheit von AI-Werkzeugen"], "needed_for": "understanding"}], "related": ["KB-0267"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Threat-Modell implementieren, das Datenquellen, Provider und Aktionsgrenzen entlang eines vollständigen AI-Ablaufs statt eines einzelnen Prompts kartiert.", "rationale": "Der Unterschied zwischen isolierter Prompt-Betrachtung und vollständiger Ablauf-Kartierung wird erst durch konkrete End-zu-End-Threat-Modellierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Threat Model für eine konkrete GenAI-Lösung begründet entlang des vollständigen Ablaufs (Datenquellen bis Aktionsgrenzen) gestalten, nicht nur für den isolierten Prompt.", "rationale": "Angriffe auf GenAI-Systeme nutzen oft die Kombination mehrerer Schwachstellen entlang des gesamten Ablaufs, nicht nur eine einzelne Prompt-Formulierung."}, "STAFF-TARGET": {"active": true, "scope": "Eine übersehene Sicherheitslücke auf eine unvollständige Threat-Modellierung (nur Prompt-Fokus statt vollständiger Ablauf) statt auf eine grundsätzlich falsche Analyse zurückführen können.", "rationale": "Eine Threat-Modellierung, die nur den Prompt betrachtet, übersieht systematisch Schwachstellen in Datenquellen, Provider-Integration und Aktionsausführung."}, "CHIEF-TARGET": {"active": true, "scope": "Threat Modeling für GenAI-Lösungen als Analyse vollständiger AI-Abläufe positionieren, die Angreiferziele und Kontrollversagen über alle Systemkomponenten hinweg betrachtet, nicht als isolierte Prompt-Sicherheitsprüfung.", "rationale": "Vollständige Threat-Modellierung erfasst Kombinationsangriffe, die eine isolierte Prompt-fokussierte Analyse strukturell übersehen würde."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Spezifische Threat-Modeling-Frameworks (STRIDE-Varianten für AI) sind Vertiefung.", "rationale": "Kern ist das Prinzip vollständiger Ablauf-Kartierung, nicht ein spezifisches Framework."}}, "lab_validation": [{"lab_id": "KB-0273-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Threat-Modellierung entlang eines vollständigen AI-Ablaufs", "evidence": "Eine Threat-Modellierung, die Datenquellen, Provider-Integration und Aktionsgrenzen gemeinsam betrachtet, kann Kombinationsschwachstellen identifizieren, die eine isolierte Prüfung nur des Prompts nicht erkennen würde.", "limitations": "Kein echtes produktives Sicherheitssystem, keine reale Angriffssimulation, keine Produktion."}]}
---
# Threat Models für GenAI-Lösungen

> **Ziel:** Threat Modeling für GenAI-Lösungen muss Datenquellen, Provider-Integration und Aktionsgrenzen entlang des vollständigen AI-Ablaufs kartieren (aufbauend auf Prompt-Injection- und Tool-Sicherheits-Grundlagen, siehe [KB-0260](20-prompt-injection-und-instruktionsgrenzen.md), [KB-0262](22-sicherheit-von-ai-werkzeugen.md)) — eine isolierte Betrachtung nur des einzelnen Prompts übersieht systematisch Kombinationsschwachstellen, die über mehrere Systemkomponenten hinweg entstehen.

## Zweck, Mental Model und Dependencies

Eine isolierte Prompt-fokussierte Sicherheitsprüfung betrachtet nur, ob eine einzelne Eingabe eine unerwünschte Reaktion des Modells provozieren könnte — das erfasst reale Risiken (siehe [KB-0260](20-prompt-injection-und-instruktionsgrenzen.md)), aber nicht die vollständige Angriffsfläche eines produktiven GenAI-Systems. Eine vollständige Threat-Modellierung kartiert stattdessen den gesamten AI-Ablauf: welche Datenquellen fließen in den Kontext ein (und welche davon könnten von einem Angreifer kontrolliert oder manipuliert werden), welche Provider-Integrationen bestehen (und welche Vertrauensannahmen werden dabei implizit getroffen), und welche Aktionsgrenzen existieren (welche tatsächlichen Seiteneffekte kann das System auslösen, siehe [KB-0262](22-sicherheit-von-ai-werkzeugen.md)). Angreiferziele werden explizit definiert — was würde ein Angreifer tatsächlich erreichen wollen (Datenexfiltration, unautorisierte Aktionen, Reputationsschaden), nicht nur abstrakt "das Modell zu etwas Unerwünschtem bringen". Kontrollversagen wird systematisch über alle Systemkomponenten hinweg analysiert — nicht nur, ob ein einzelner Prompt eine unerwünschte Antwort erzeugen kann, sondern ob eine Kombination aus manipulierter Datenquelle, unzureichender Autorisierungsprüfung und fehlender Ausgabevalidierung zusammen einen tatsächlich ausnutzbaren Angriffspfad ergibt, den keine einzelne isolierte Prüfung erkennen würde.

~~~text
Prompt-only security review:  does THIS input provoke an unwanted model reaction?
Full-flow threat model:        data sources (controllable by attacker?) + provider integrations (trust assumptions?) + action boundaries (real side effects?)
Attacker goals:                explicit - exfiltration, unauthorized action, reputational harm (not just "make the model misbehave")
Control failure analysis:      COMBINATION of weaknesses across components -> exploitable path that no single isolated check would catch
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Vollständige Ablauf-Kartierung | sind alle Datenquellen, Provider-Integrationen und Aktionsgrenzen des Systems explizit kartiert? | unvollständige Kartierung übersieht potenzielle Angriffsvektoren außerhalb des reinen Prompt-Fokus |
| Explizite Angreiferziele | sind konkrete, realistische Angreiferziele definiert, nicht nur abstraktes "unerwünschtes Verhalten"? | vage Zieldefinition erschwert die Bewertung, welche tatsächlichen Konsequenzen ein Angriff haben könnte |
| Kombinationsschwachstellen-Analyse | wird geprüft, ob mehrere einzeln unkritische Schwächen zusammen einen ausnutzbaren Pfad ergeben? | isolierte Einzelprüfungen übersehen Angriffspfade, die erst durch Kombination mehrerer Schwachstellen entstehen |
| Datenquellen-Vertrauensklassifikation | ist für jede Datenquelle explizit klassifiziert, wie vertrauenswürdig sie ist? | fehlende Klassifikation lässt eine potenziell manipulierbare externe Quelle wie eine vertrauenswürdige interne Quelle behandelt werden |

Implementierung: der vollständige AI-Ablauf wird explizit dokumentiert und kartiert — von allen Eingangsdatenquellen (Nutzereingabe, Retrieval-Ergebnisse, externe APIs) über die Modell-/Provider-Interaktion bis zu allen möglichen Aktionsausgängen (Textantwort, strukturierte Daten, ausgelöste Werkzeugaufrufe). Für jede Datenquelle wird explizit eine Vertrauensklassifikation vorgenommen (vollständig vertrauenswürdig, teilweise vertrauenswürdig, potenziell von einem Angreifer beeinflussbar), analog zur strukturellen Trennung bei Prompt-Injection-Abwehr. Konkrete, realistische Angreiferziele werden für die spezifische Anwendung definiert (was genau würde ein Angreifer versuchen zu erreichen), statt nur abstrakt zu prüfen, ob "etwas Unerwünschtes" passieren könnte. Die Analyse prüft systematisch, ob eine Kombination aus mehreren, jeweils für sich genommen möglicherweise akzeptablen Schwächen (z. B. eine wenig strenge Ausgabevalidierung kombiniert mit einer nicht vollständig unabhängigen Autorisierungsprüfung) zusammen einen tatsächlich ausnutzbaren Angriffspfad ergibt.

## Scalability, Reliability, Security und Observability

Vollständige Threat-Modellierung skaliert Sicherheitsverständnis über wachsende Systemkomplexität, weil sie systematisch alle Komponenten statt nur einzelner, isoliert betrachteter Prompts erfasst, was bei zunehmender Integration (mehr Datenquellen, mehr Werkzeuge) proportional wichtiger wird. Reliability-Grenze: eine nur prompt-fokussierte Sicherheitsprüfung ist ein trügerisches Risiko, weil sie ein falsches Sicherheitsgefühl erzeugt — das Team kann annehmen, ausreichend geprüft zu haben, während tatsächlich ausnutzbare Kombinationsschwachstellen im Gesamtablauf unentdeckt bleiben.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Sicherheitsvorfall entsteht über einen Angriffspfad, der keine einzelne Prompt-Formulierung, sondern eine Kombination mehrerer Faktoren nutzte | Threat-Modellierung war auf isolierte Prompt-Prüfung beschränkt, erfasste keine Kombinationsschwachstellen | den tatsächlichen Angriffspfad gegen die ursprüngliche Threat-Modell-Dokumentation prüfen, welche Komponenten fehlten |
| eine externe Datenquelle wurde wie eine vertrauenswürdige interne Quelle behandelt | fehlende explizite Vertrauensklassifikation für diese Datenquelle | Vertrauensklassifikationsdokumentation für alle Datenquellen auf Vollständigkeit prüfen |
| ein Sicherheitsreview konzentrierte sich ausschließlich auf Prompt-Formulierung | fehlende vollständige Ablauf-Kartierung im Threat-Modeling-Prozess | Threat-Modeling-Dokumentation auf Abdeckung aller Systemkomponenten (Datenquellen, Provider, Aktionsgrenzen) prüfen |
| Angreiferziele wurden nicht konkret genug definiert, um die tatsächliche Risikobewertung zu ermöglichen | vage, abstrakte statt konkreter, realistischer Zieldefinition | Threat-Model auf explizite, konkrete Angreiferzielformulierung prüfen |

Security: Threat Modeling für GenAI-Lösungen sollte regelmäßig aktualisiert werden, da neue Datenquellen, Provider-Integrationen oder Werkzeugintegrationen jeweils neue potenzielle Angriffsvektoren einführen können, die im ursprünglichen Modell nicht erfasst waren. Observability: Abdeckung der Threat-Modell-Dokumentation über alle Systemkomponenten, Häufigkeit identifizierter Kombinationsschwachstellen bei Reviews und Aktualität der Vertrauensklassifikation für Datenquellen sind zentrale Metriken für Threat-Modeling-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** kartiert den vollständigen AI-Ablauf, nicht nur den isolierten Prompt. **Principal** macht explizite Vertrauensklassifikation für alle Datenquellen für das Team nachvollziehbar dokumentiert. **Chief** positioniert Threat Modeling für GenAI-Lösungen als Analyse vollständiger AI-Abläufe mit Kombinationsschwachstellen-Betrachtung, nicht als isolierte Prompt-Sicherheitsprüfung.

Anti-Patterns: Sicherheitsprüfung ausschließlich auf Prompt-Formulierung beschränken, ohne Datenquellen, Provider und Aktionsgrenzen zu betrachten; Datenquellen ohne explizite Vertrauensklassifikation gleich behandeln; Threat-Modeling einmalig durchführen und bei neuen Integrationen nie aktualisieren.

## Production Checklist

- [ ] Der vollständige AI-Ablauf (Datenquellen, Provider, Aktionsgrenzen) ist explizit kartiert.
- [ ] Jede Datenquelle hat eine explizite Vertrauensklassifikation.
- [ ] Konkrete, realistische Angreiferziele sind für die spezifische Anwendung definiert.
- [ ] Kombinationsschwachstellen über mehrere Komponenten hinweg werden systematisch geprüft.

## Interviewfragen

### 1. Warum reicht eine isolierte Prompt-Sicherheitsprüfung nicht für vollständiges Threat Modeling von GenAI-Lösungen aus?

**Antwort:** Sie erfasst nur, ob eine einzelne Eingabe eine unerwünschte Modellreaktion provozieren könnte, übersieht aber Schwachstellen in Datenquellen, Provider-Integration und Aktionsausführung sowie Kombinationsangriffe, die über mehrere Komponenten hinweg entstehen.

### 2. Warum ist explizite Vertrauensklassifikation für Datenquellen wichtig?

**Antwort:** Ohne diese Klassifikation kann eine potenziell von einem Angreifer manipulierbare externe Quelle unbewusst wie eine vollständig vertrauenswürdige interne Quelle behandelt werden, was das System für indirekte Manipulation über diese Quelle anfällig macht.

### 3. Was sind Kombinationsschwachstellen, und warum sind sie besonders gefährlich?

**Antwort:** Es sind Angriffspfade, die entstehen, wenn mehrere, jeweils für sich genommen möglicherweise akzeptable Schwächen (z. B. moderate Ausgabevalidierung plus unzureichende Autorisierung) zusammenwirken und einen tatsächlich ausnutzbaren Pfad ergeben — eine isolierte Prüfung jeder einzelnen Komponente würde diese Kombination nicht erkennen.

### 4. Wie diagnostizierst du, dass eine Sicherheitslücke auf unvollständige Threat-Modellierung zurückzuführen ist?

**Antwort:** Ich prüfe den tatsächlichen Angriffspfad gegen die ursprüngliche Threat-Modell-Dokumentation und identifiziere, welche Systemkomponenten (Datenquelle, Provider-Integration, Aktionsgrenze) in der ursprünglichen Analyse fehlten oder nicht ausreichend betrachtet wurden.

### 5. Warum müssen konkrete, realistische Angreiferziele statt abstrakter Zielformulierungen definiert werden?

**Antwort:** Abstrakte Ziele wie "das Modell zu etwas Unerwünschtem bringen" erschweren die tatsächliche Risikobewertung; konkrete Ziele (z. B. Datenexfiltration eines bestimmten Datentyps, Auslösung einer bestimmten unautorisierten Aktion) ermöglichen eine präzise, priorisierte Analyse der tatsächlichen Konsequenzen.

### 6. Widersprüchliche Anforderung: Team will schnelle, ressourcenschonende Sicherheitsreviews für jede neue GenAI-Integration UND vollständige, umfassende Threat-Modellierung über den gesamten Ablauf für jede Änderung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Threat-Modellierung für jede kleine Änderung unverhältnismäßig aufwendig sein kann; ich würde vorschlagen, ein einmalig erstelltes, umfassendes Basis-Threat-Model zu pflegen und es inkrementell bei neuen Integrationen (neue Datenquellen, neue Aktionsgrenzen) gezielt zu aktualisieren, statt bei jeder kleinen Änderung eine vollständige Neuanalyse durchzuführen, während trotzdem sichergestellt wird, dass neue Komponenten tatsächlich erfasst werden.

## Praktische Labs

~~~python
# Full-flow threat model combining multiple components
threat_model = {
    "data_sources": {
        "user_input": {"trust": "controlled_by_attacker"},
        "retrieved_documents": {"trust": "potentially_manipulated"},
        "internal_database": {"trust": "trusted"},
    },
    "action_boundaries": {
        "send_email": {"authorization_independent": False},  # weak point
        "read_only_query": {"authorization_independent": True},
    },
}

def find_combination_vulnerability(model):
    vulnerabilities = []
    for source_name, source in model["data_sources"].items():
        if source["trust"] != "trusted":
            for action_name, action in model["action_boundaries"].items():
                if not action["authorization_independent"]:
                    vulnerabilities.append(
                        f"COMBINATION RISK: untrusted source '{source_name}' -> "
                        f"action '{action_name}' without independent authorization"
                    )
    return vulnerabilities

vulnerabilities = find_combination_vulnerability(threat_model)
for v in vulnerabilities:
    print(v)

assert len(vulnerabilities) > 0
print(f"\n{len(vulnerabilities)} combination vulnerability(ies) found by analyzing sources AND actions TOGETHER -")
print("a prompt-only review checking each component in isolation would likely have missed this combination.")
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [LLM Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-17.
2. Microsoft: [Threat Modeling AI/ML Systems and Dependencies](https://learn.microsoft.com/en-us/security/engineering/threat-modeling-aiml), abgerufen 2026-09-17.
3. MITRE: [ATLAS — Adversarial Threat Landscape for AI Systems](https://atlas.mitre.org/), abgerufen 2026-09-17.

Prompt-Injection- und Tool-Sicherheits-Grundlagen sind kanonisch in [KB-0260](20-prompt-injection-und-instruktionsgrenzen.md) und [KB-0262](22-sicherheit-von-ai-werkzeugen.md) behandelt. Referenzarchitektur-Grundlagen sind in [KB-0267](27-genai-referenzarchitekturen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte AI-spezifische Threat-Modeling-Frameworks (z. B. MITRE ATLAS) als Ausgangspunkt für systematische Analyse | Adopting | Gegenüber generischen, nicht AI-spezifischen Threat-Modeling-Ansätzen für vollständigere Abdeckung bevorzugen. |
| Automatisierte Angriffssimulations-Werkzeuge, die kombinierte Schwachstellen über mehrere Systemkomponenten aktiv testen | Adopting | Ergänzend zu manueller Threat-Modell-Analyse für kontinuierliche Verifikation einsetzen. |

Ein Team akzeptiert eine GenAI-Lösung erst, wenn ein vollständiges Threat Model über Datenquellen, Provider und Aktionsgrenzen nachweisbar dokumentiert und auf Kombinationsschwachstellen geprüft ist.
