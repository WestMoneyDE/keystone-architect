---
{"id": "KB-0135", "title": "Schichtenarchitektur und Durchgriffe", "domain": "06", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0134", "concepts": ["Dependency Rule"], "needed_for": "understanding"}], "related": ["KB-0136", "KB-0562", "KB-0720"], "applies": ["KB-0136", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Vier-Schichten-Modell implementieren und einen Durchgriff (Presentation direkt auf Persistenz) als Verstoß identifizieren.", "rationale": "Kein reales System nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Schichtengrenzen so entwerfen, dass jede Schicht nur die direkt darunterliegende kennt, ohne Durchgriffe.", "rationale": "Durchgriffe erzeugen versteckte Kopplung, die spätere Refactorings erschwert."}, "STAFF-TARGET": {"active": true, "scope": "Einen zyklischen Abhängigkeitsfall zwischen zwei Schichten im Code identifizieren.", "rationale": "Zyklen zwischen Schichten untergraben den eigentlichen Zweck der Schichtentrennung."}, "CHIEF-TARGET": {"active": true, "scope": "Entscheiden, für welche Systemklassen eine volle Schichtenarchitektur gerechtfertigt ist und wo sie unnötigen Overhead erzeugt.", "rationale": "Nicht jedes einfache System braucht vier explizite Schichten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Strikte versus entspannte Schichtenarchitektur (Skip-Schichten-Zugriff erlaubt) sind Vertiefung.", "rationale": "Kern ist das Erkennen und Vermeiden von Durchgriffen und Zyklen."}}, "lab_validation": [{"lab_id": "KB-0135-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für vier Schichten mit und ohne Durchgriff", "evidence": "Ein direkter Aufruf der Persistenzschicht aus der Präsentationsschicht wird als Durchgriff erkannt, der die Anwendungs- und Fachschicht umgeht.", "limitations": "Kein reales System, keine Produktion."}]}
---
# Schichtenarchitektur und Durchgriffe

> **Ziel:** Eine Schichtenarchitektur ordnet Code in Präsentation, Anwendung, Fachlogik und Persistenz, wobei jede Schicht nur die direkt darunterliegende kennt. Ein Durchgriff (z. B. Präsentation greift direkt auf Persistenz zu, unter Umgehung der Fach- und Anwendungsschicht) untergräbt diese Ordnung und erzeugt versteckte Kopplung.

## Zweck, Mental Model und Dependencies

Die vier klassischen Schichten haben unterschiedliche Verantwortung: Präsentation (Ein-/Ausgabe, UI/API), Anwendung (Orchestrierung von Anwendungsfällen), Fachlogik (Geschäftsregeln), Persistenz (Datenspeicherung). Die Grundregel: eine Schicht darf nur mit der direkt darunterliegenden kommunizieren, nie eine Schicht überspringen (Durchgriff) und nie nach oben kommunizieren (das würde einen Zyklus erzeugen). Diese Struktur ist eine vereinfachte, oft pragmatischere Variante der strikteren Dependency Rule aus [KB-0134](06-clean-architecture-und-abhaengigkeitsrichtung.md). Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0134](06-clean-architecture-und-abhaengigkeitsrichtung.md).

~~~text
Presentation -> Application -> Domain -> Persistence   (correct: each layer only talks to the one below)
Presentation ------------------------> Persistence      (layer-skipping call: a bypass/durchgriff)
Domain -> Presentation (upward call)                     (cycle: violates layering entirely)
~~~

## Core Concepts, Architektur und Implementierung

| Schicht | Verantwortung | Häufiger Verstoß |
|---|---|---|
| Präsentation | Ein-/Ausgabe, Formatierung, Nutzerinteraktion | enthält Geschäftslogik statt nur Orchestrierung |
| Anwendung | orchestriert Anwendungsfälle über Fachlogik | ruft Persistenz direkt auf, umgeht Fachschicht |
| Fachlogik | Geschäftsregeln und Invarianten | kennt Präsentationsdetails (z. B. HTTP-Statuscodes) |
| Persistenz | Datenspeicherung und -abruf | ruft zurück in Fachlogik (Zyklus) |

Implementierung: jede Schicht wird mit klaren, expliziten Schnittstellen zur darunterliegenden Schicht versehen; ein Linting- oder Architektur-Test kann automatisiert prüfen, dass keine Schicht eine andere überspringt oder einen Zyklus erzeugt. Bei sehr einfachen Anwendungen (z. B. simple CRUD-Tools) sollte bewusst geprüft werden, ob die volle Vier-Schichten-Trennung tatsächlichen Nutzen bringt oder nur unnötigen Boilerplate erzeugt.

## Scalability, Reliability, Security und Observability

Schichtenarchitektur skaliert als Organisationsprinzip für mittelgroße Systeme mit klarer Verantwortungstrennung. Reliability-Grenze: ein Durchgriff wird oft „aus Bequemlichkeit" für einen einzelnen Fall eingeführt und bleibt dann unbemerkt bestehen — mit der Zeit sammeln sich mehrere solcher Durchgriffe an, bis die Schichtentrennung faktisch bedeutungslos wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Präsentationscode enthält SQL-Abfragen | Durchgriff auf Persistenzschicht unter Umgehung von Anwendung/Fachlogik | Imports/Aufrufe der Präsentationsschicht auf Persistenz-Bibliotheken prüfen |
| Änderung in der Fachlogik erfordert Änderungen in der Präsentationsschicht | zyklische oder zu enge Kopplung zwischen den Schichten | Abhängigkeitsrichtung zwischen den betroffenen Schichten prüfen |
| Architektur-Reviews finden immer wieder neue Durchgriffe | fehlende automatisierte Prüfung (Architektur-Linting) | prüfen, ob eine automatisierte Schichtenprüfung in CI existiert |
| Team empfindet die Schichtentrennung als reinen Overhead | Schichtenarchitektur für zu einfachen Anwendungsfall eingesetzt | tatsächliche Komplexität der Fachlogik gegen den Trennungsaufwand abwägen |

Security: Durchgriffe sind auch ein Sicherheitsrisiko, wenn sie Autorisierungsprüfungen umgehen, die normalerweise in der Anwendungs- oder Fachschicht stattfinden würden. Observability: automatisierte Architektur-Tests (die Schichtengrenzen prüfen) sind ein einfaches, wirksames Werkzeug, um Durchgriffe früh im Entwicklungsprozess zu erkennen, statt sie erst im Review zu finden.

## Trade-offs und Entscheidungen

**Staff** identifiziert Durchgriffe aktiv im Code Review und schlägt die korrekte Schichtenroute vor. **Principal** etabliert automatisierte Architektur-Tests, die Durchgriffe und Zyklen in CI erkennen. **Chief** entscheidet, für welche Systemklassen eine volle Vier-Schichten-Trennung gerechtfertigt ist und wo eine einfachere Struktur ausreicht.

Anti-Patterns: Durchgriffe „nur für diesen einen Fall" einführen und nie wieder bereinigen; keine automatisierte Prüfung der Schichtengrenzen, sodass Verstöße sich unbemerkt anhäufen; volle Schichtentrennung für triviale CRUD-Anwendungen erzwingen, ohne den tatsächlichen Nutzen zu hinterfragen.

## Production Checklist

- [ ] Jede Schicht kommuniziert nur mit der direkt darunterliegenden, keine Durchgriffe.
- [ ] Keine zyklischen Abhängigkeiten zwischen Schichten.
- [ ] Automatisierte Architektur-Tests prüfen Schichtengrenzen in CI.
- [ ] Schichtentrennung bewusst gegen tatsächliche Systemkomplexität abgewogen.

## Interviewfragen

### 1. Was ist ein Durchgriff in einer Schichtenarchitektur?

**Antwort:** Ein Aufruf, der eine oder mehrere Zwischenschichten überspringt, z. B. wenn die Präsentationsschicht direkt auf die Persistenzschicht zugreift statt über Anwendungs- und Fachschicht.

### 2. Warum ist ein Durchgriff problematisch, auch wenn er funktioniert?

**Antwort:** Er umgeht die in den Zwischenschichten implementierte Logik (z. B. Autorisierung, Geschäftsregeln) und erzeugt versteckte Kopplung, die spätere Refactorings und Konsistenzprüfungen erschwert.

### 3. Was ist ein zyklischer Abhängigkeitsfall zwischen Schichten?

**Antwort:** Wenn eine untere Schicht (z. B. Persistenz) zurück in eine obere Schicht (z. B. Fachlogik) ruft, was die eigentliche Idee der gerichteten Schichtenordnung komplett untergräbt.

### 4. Wie erkennst du Durchgriffe automatisiert statt nur im manuellen Review?

**Antwort:** Über Architektur-Tests oder Linting-Regeln, die prüfen, welche Module/Pakete welche anderen importieren dürfen, integriert in die CI-Pipeline.

### 5. Wann ist eine volle Vier-Schichten-Architektur überdimensioniert?

**Antwort:** Bei sehr einfachen Anwendungen mit trivialer Geschäftslogik, wo der Aufwand für explizite Schichtentrennung den tatsächlichen Nutzen (Testbarkeit, Wartbarkeit) übersteigt.

### 6. Widersprüchliche Anforderung: Entwickler will schnell einen dringenden Fix liefern UND die Schichtenarchitektur sauber einhalten — wie gehst du vor?

**Antwort:** Ich würde einen sauberen, aber minimalen Fix innerhalb der korrekten Schicht bevorzugen, statt eines Durchgriffs „für jetzt"; ein Durchgriff unter Zeitdruck wird erfahrungsgemäß selten nachträglich bereinigt und erzeugt langfristig mehr Aufwand als der kurzfristige Zeitgewinn wert ist.

## Praktische Labs

~~~python
allowed_calls = {"presentation": {"application"}, "application": {"domain"}, "domain": {"persistence"}, "persistence": set()}

def check_call(caller, callee):
    return callee in allowed_calls[caller]

assert check_call("presentation", "application") is True
assert check_call("presentation", "persistence") is False  # layer-skipping bypass detected
print("Direct presentation-to-persistence call correctly flagged as a layering violation.")
~~~

## Dependencies, Cross-References und Quellen

1. Fowler: [PresentationDomainDataLayering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html), martinfowler.com, abgerufen 2026-09-17.

Diese Methodik ist zeitstabil; konkrete Architektur-Test-Tooling-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Architektur-Fitness-Functions in CI (z. B. ArchUnit-artige Tools) | Established | Regelabdeckung gegen tatsächliche Schichtengrenzen des Systems prüfen. |

Diese Methodik ist ein etabliertes, stabiles Strukturprinzip; der Bonus betrifft primär automatisiertes Tooling zur Durchsetzung, nicht das Prinzip selbst.
