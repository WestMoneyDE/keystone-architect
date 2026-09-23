---
{"id": "KB-0145", "title": "Architekturschulden und Änderungsreibung", "domain": "06", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0142", "concepts": ["Fitness Functions"], "needed_for": "understanding"}], "related": ["KB-0146", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Änderungsreibung (Zeit für eine Standardänderung) für zwei unterschiedlich verschuldete Codebereiche lokal messen.", "rationale": "Kein reales Projekt nötig, um den Messansatz zu üben."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architekturschulden anhand konkreter Änderungsfolgen statt subjektivem Codegeschmack bewerten.", "rationale": "Eine belastbare Schuldenbewertung braucht messbare Konsequenzen, nicht nur 'der Code fühlt sich schlecht an'."}, "STAFF-TARGET": {"active": true, "scope": "Erhöhte Änderungsreibung in einem Modul auf konkrete strukturelle Schulden zurückführen.", "rationale": "Das macht Refactoring-Investitionsentscheidungen begründbar statt intuitiv."}, "CHIEF-TARGET": {"active": true, "scope": "Reparaturkosten, Risiko und Aufschubkosten von Architekturschulden transparent gegeneinander abwägen und priorisieren.", "rationale": "Nicht jede Schuld muss sofort behoben werden; die Entscheidung braucht eine explizite Kosten-Nutzen-Abwägung."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Automatisierte Codequalitätsmetriken als Schuldenindikator im Detail sind Vertiefung.", "rationale": "Kern ist die Verbindung von Schuld zu konkreten Änderungsfolgen, nicht ein bestimmtes Metrik-Tool."}}, "lab_validation": [{"lab_id": "KB-0145-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Änderungsreibung anhand Anzahl betroffener Dateien pro Änderung", "evidence": "Ein Modul mit hoher Kopplung erfordert für dieselbe Art von Änderung durchschnittlich mehr betroffene Dateien als ein besser strukturiertes Modul.", "limitations": "Kein reales Projekt, rein methodische Übung."}]}
---
# Architekturschulden und Änderungsreibung

> **Ziel:** Architekturschulden sind strukturelle Kompromisse, die zukünftige Änderungen teurer machen. Sie werden nicht am subjektiven Codegeschmack, sondern an messbarer Änderungsreibung erkannt: wie viel Aufwand, wie viele betroffene Stellen, wie viel Risiko erzeugt eine Standardänderung in einem bestimmten Bereich. Diese Messung macht Reparaturentscheidungen begründbar statt intuitiv.

## Zweck, Mental Model und Dependencies

„Dieser Code ist schlecht" ist keine handlungsleitende Aussage. „Eine typische Änderung an der Preisberechnung berührt aktuell sieben Dateien in vier Modulen und dauert im Schnitt drei Tage, verglichen mit einer Datei und vier Stunden in einem vergleichbar komplexen, aber sauber geschnittenen Modul" ist eine messbare, vergleichbare Aussage über Architekturschulden. Änderungsreibung (Change Friction) ist die konkrete, beobachtbare Folge struktureller Schulden — sie verbindet abstrakte Architekturkritik mit tatsächlichen Kosten. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0142](14-architecture-fitness-functions.md).

~~~text
Structural debt (e.g. tight coupling) -> observable symptom: typical change touches N files, takes T days
Compare across modules -> quantified debt signal, not just subjective code smell
~~~

## Core Concepts, Architektur und Implementierung

| Messgröße | Frage | Aussagekraft |
|---|---|---|
| Betroffene Dateien pro Änderung | wie viele Dateien müssen für eine typische Änderungsart angefasst werden? | hohe Zahl deutet auf verstreute, gekoppelte Logik hin |
| Änderungsdauer | wie lange dauert eine vergleichbare Änderung in diesem Bereich? | Anstieg über Zeit ist ein Frühwarnsignal für wachsende Schuld |
| Fehlerrate nach Änderung | wie oft führt eine Änderung in diesem Bereich zu einem Folgefehler? | hohe Rate deutet auf unklare Abhängigkeiten/Invarianten hin |
| Reparaturkosten vs. Aufschubkosten | was kostet die Behebung jetzt versus das Fortführen der Reibung? | Grundlage für eine explizite Priorisierungsentscheidung |

Implementierung: für kritische, häufig geänderte Module wird Änderungsreibung aktiv gemessen (z. B. über Versionskontroll-Historie: Anzahl gemeinsam geänderter Dateien, Änderungsdauer, Folgefehlerrate) statt nur subjektiv eingeschätzt. Diese Messung wird gegen die Reparaturkosten (Aufwand für ein gezieltes Refactoring) und die Aufschubkosten (fortgesetzte Reibung, falls nicht behoben) gestellt, um eine begründete Priorisierungsentscheidung zu treffen — nicht jede Schuld rechtfertigt sofortige Reparatur.

## Scalability, Reliability, Security und Observability

Änderungsreibungsmessung skaliert als Priorisierungswerkzeug über viele Module hinweg, indem sie subjektive Diskussionen durch vergleichbare Daten ersetzt. Reliability-Grenze: eine Schuld, die nie behoben wird, erzeugt nicht nur Reibung, sondern erhöht auch das Risiko, dass eine dringende Änderung unter Zeitdruck in einem bereits fragilen Bereich zu einem Produktionsfehler führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Modul braucht für triviale Änderungen ungewöhnlich lange | hohe strukturelle Kopplung, verstreute Logik | Anzahl gemeinsam geänderter Dateien für typische Änderungen messen |
| wiederholte Folgefehler nach Änderungen in einem bestimmten Bereich | unklare Invarianten oder fehlende Tests in diesem Bereich | Fehlerrate nach Änderung für dieses Modul gegen andere vergleichen |
| Team vermeidet Änderungen in einem bestimmten Modul aktiv | intuitiv wahrgenommene, aber unquantifizierte hohe Schuld | Änderungsreibung explizit messen, um die Vermeidung zu begründen oder zu widerlegen |
| Priorisierungsdiskussion über Refactoring bleibt subjektiv | fehlende quantifizierte Grundlage für die Entscheidung | Reparaturkosten explizit gegen gemessene Aufschubkosten stellen |

Security: hohe Änderungsreibung in sicherheitsrelevanten Modulen ist besonders riskant, da dringende Sicherheitsfixes unter Zeitdruck in einem fragilen Bereich eher zu neuen Fehlern führen. Observability: Trends in Änderungsreibung über Zeit (steigend/fallend) sind ein wertvolles Frühwarnsignal für wachsende Architekturschulden, bevor sie zu akuten Problemen werden.

## Trade-offs und Entscheidungen

**Staff** misst Änderungsreibung für Module, bei denen ein Schuldenverdacht besteht, statt sich nur auf subjektiven Eindruck zu verlassen. **Principal** priorisiert Refactoring-Investitionen anhand gemessener Reparatur- versus Aufschubkosten statt reiner Intuition. **Chief** akzeptiert bewusst, dass nicht jede Schuld sofort behoben werden muss, und verlangt eine explizite, dokumentierte Priorisierungsentscheidung für jede bewusst aufgeschobene Schuld.

Anti-Patterns: Architekturschulden nur subjektiv („fühlt sich schlecht an") statt anhand messbarer Änderungsfolgen bewerten; jede identifizierte Schuld sofort und unpriorisiert beheben wollen; Schulden komplett ignorieren, ohne die wachsenden Aufschubkosten zu erfassen.

## Production Checklist

- [ ] Änderungsreibung für kritische, häufig geänderte Module aktiv gemessen.
- [ ] Reparaturkosten explizit gegen Aufschubkosten gestellt für Priorisierungsentscheidungen.
- [ ] Bewusst aufgeschobene Schulden dokumentiert, nicht nur stillschweigend ignoriert.
- [ ] Trend der Änderungsreibung über Zeit beobachtet, nicht nur einmalig gemessen.

## Interviewfragen

### 1. Warum ist „dieser Code ist schlecht" keine handlungsleitende Architekturschulden-Bewertung?

**Antwort:** Sie ist subjektiv und nicht vergleichbar; eine belastbare Bewertung braucht messbare Konsequenzen wie Änderungsreibung, um Priorisierungsentscheidungen zu begründen.

### 2. Was ist Änderungsreibung und wie misst du sie?

**Antwort:** Der konkrete Mehraufwand (Anzahl betroffener Dateien, Dauer, Folgefehlerrate), den eine typische Änderung in einem strukturell verschuldeten Bereich im Vergleich zu einem sauberen Bereich verursacht — messbar über Versionskontroll-Historie.

### 3. Muss jede identifizierte Architekturschuld sofort behoben werden?

**Antwort:** Nein, die Entscheidung sollte auf einer expliziten Abwägung von Reparaturkosten gegen die Kosten des Fortführens der Reibung (Aufschubkosten) basieren, nicht auf reflexartiger sofortiger Behebung.

### 4. Warum ist ein Trend über Zeit aussagekräftiger als eine einmalige Messung?

**Antwort:** Eine steigende Änderungsreibung über Zeit zeigt wachsende Schulden als Frühwarnsignal, bevor sie zu akuten, teuren Problemen eskalieren.

### 5. Warum ist hohe Änderungsreibung in sicherheitsrelevanten Modulen besonders riskant?

**Antwort:** Dringende Sicherheitsfixes müssen oft unter Zeitdruck erfolgen; in einem fragilen, stark verschuldeten Bereich erhöht das die Wahrscheinlichkeit neuer Fehler durch den Fix selbst.

### 6. Widersprüchliche Anforderung: Management will keine Zeit für Refactoring investieren UND schnellere Feature-Lieferung in einem stark verschuldeten Modul — wie gehst du vor?

**Antwort:** Ich würde die gemessene Änderungsreibung (z. B. verdoppelte Lieferzeit) explizit als Kostenfaktor der Feature-Lieferung selbst darstellen, nicht als separate „Refactoring-Zeit" — das macht sichtbar, dass die aktuelle Verschuldung bereits jetzt Lieferzeit kostet, unabhängig von einer expliziten Refactoring-Entscheidung.

## Praktische Labs

~~~python
change_history = {
    "pricing_module": [{"files_touched": 7, "days": 3}, {"files_touched": 6, "days": 2.5}],
    "clean_module": [{"files_touched": 1, "days": 0.5}, {"files_touched": 2, "days": 0.7}],
}

def avg_friction(history, module):
    entries = history[module]
    return sum(e["files_touched"] for e in entries) / len(entries)

pricing_friction = avg_friction(change_history, "pricing_module")
clean_friction = avg_friction(change_history, "clean_module")
assert pricing_friction > clean_friction * 2
print(f"pricing_module friction: {pricing_friction:.1f} files/change vs clean_module: {clean_friction:.1f} files/change")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [TechnicalDebtQuadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html), martinfowler.com, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Codequalitäts-Metrik-Tooling-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Änderungsreibungs-Analyse aus Versionskontroll-Historie | Adopting | Ergebnis gegen manuelle Teameinschätzung validieren, bevor Priorisierung darauf basiert. |

Diese Methodik ist ein etabliertes, stabiles Bewertungsprinzip; der Bonus betrifft primär automatisierte Messung, nicht das Konzept selbst.
