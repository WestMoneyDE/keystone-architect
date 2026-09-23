---
{"id": "KB-0591", "title": "Application Architecture im Unternehmen", "domain": "25", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0590", "concepts": ["Business Architecture"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Anwendungsfunktionen, Schnittstellen und Verantwortliche für eine konkrete Anwendungslandschaft anhand etablierter Application-Architecture-Praxis korrekt kartieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Redundanzen und kritische Abhängigkeiten in der Anwendungslandschaft sichtbar gemacht werden, auf der Ebene mehrerer Systeme statt auf der detaillierten Softwarestruktur einzelner Systeme.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Application-Architecture-Kartierung fälschlich auf Ebene der detaillierten Softwarestruktur eines einzelnen Systems statt auf Ebene der unternehmensweiten Anwendungslandschaft betrieben wird, und die Ebene korrekt zuordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Application-Architecture-Kartierung festlegen, die Redundanzen und kritische Abhängigkeiten über die gesamte Anwendungslandschaft hinweg sichtbar und konsolidierbar machen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, interne Softwarestruktur einzelner Systeme (Modul-/Klassenebene) ist bereits in den jeweiligen technischen Domains behandelt und hier bewusst nicht wiederholt.", "rationale": "Kern ist die unternehmensweite Kartierung von Anwendungsfunktionen und Abhängigkeiten, nicht die interne Softwarestruktur einzelner Systeme."}}, "lab_validation": [{"lab_id": "KB-0591-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung redundanter Anwendungsfunktionen über mehrere Systeme, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript vergleicht eine Liste von Anwendungen und deren dokumentierten Funktionen und identifiziert, welche Funktionen von mehreren, unterschiedlichen Anwendungen redundant bereitgestellt werden, sowie welche Anwendungen kritische, nicht redundante Abhängigkeiten für mehrere andere Systeme darstellen.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Application Architecture im Unternehmen

> **Ziel:** Application Architecture kartiert Anwendungsfunktionen, Schnittstellen und Verantwortliche auf Ebene der gesamten Anwendungslandschaft eines Unternehmens — bewusst nicht auf Ebene der detaillierten internen Softwarestruktur einzelner Systeme (Module, Klassen, interne Architekturmuster), die bereits in den jeweiligen technischen Domains dieses Curriculums behandelt wird. Der zentrale Punkt dieses Kapitels ist, dass diese unternehmensweite Kartierung **Redundanzen** (mehrere Anwendungen, die dieselbe oder eine sehr ähnliche fachliche Funktion bereitstellen) und **kritische Abhängigkeiten** (Anwendungen, von denen viele andere Systeme abhängen, deren Ausfall oder Ablösung daher besonders weitreichende Konsequenzen hätte) sichtbar macht, die auf der Ebene eines einzelnen Systems gar nicht erkennbar wären — eine Redundanz zwischen zwei Anwendungen ist nur sichtbar, wenn beide gemeinsam auf Unternehmensebene betrachtet werden, nicht wenn jede isoliert für sich analysiert wird.

## Zweck, Mental Model und Dependencies

Die bereits in [KB-0590](02-business-architecture.md) behandelten Geschäftsfähigkeiten sind der Bezugspunkt für die Application-Architecture-Kartierung: Jede Anwendung wird danach kartiert, welche Geschäftsfähigkeiten sie tatsächlich unterstützt, welche Anwendungsfunktionen sie dafür bereitstellt, über welche Schnittstellen sie mit anderen Anwendungen interagiert, und welche Organisationseinheit für sie verantwortlich ist. Redundanz wird erst auf dieser unternehmensweiten Kartierungsebene sichtbar: Zwei Anwendungen, die unabhängig voneinander, in unterschiedlichen Geschäftsbereichen entstanden sind, können dieselbe fachliche Funktion (etwa "Kundendaten verwalten") redundant bereitstellen, ohne dass dies innerhalb eines einzelnen Geschäftsbereichs auffällt — erst der unternehmensweite Vergleich der kartierten Anwendungsfunktionen deckt diese Redundanz auf und ermöglicht eine informierte Entscheidung über Konsolidierung. Kritische Abhängigkeiten entstehen durch die Schnittstellenstruktur zwischen Anwendungen: Eine Anwendung, von der viele andere Systeme über Schnittstellen abhängig sind (etwa ein zentrales Kundenstammdatensystem), stellt ein besonders hohes Risiko dar, da ihre Ablösung, Migration oder ein Ausfall weitreichende Konsequenzen für alle abhängigen Systeme hat — diese Abhängigkeitsstruktur ist nur durch eine unternehmensweite Schnittstellenkartierung sichtbar, nicht durch die Betrachtung eines einzelnen Systems isoliert. Die bewusste Abgrenzung zur detaillierten internen Softwarestruktur einzelner Systeme ist methodisch notwendig: Eine Application-Architecture-Kartierung, die versucht, sowohl die unternehmensweite Anwendungslandschaft als auch die interne Modul- und Klassenstruktur jedes einzelnen Systems im selben Detailgrad abzubilden, wird unpraktikabel umfangreich und verliert den eigentlichen Zweck — die unternehmensweite Sichtbarkeit von Redundanzen und kritischen Abhängigkeiten — aus den Augen.

~~~text
Application Architecture: maps app functions, interfaces, owners at ENTERPRISE-WIDE application landscape level
  deliberately NOT at detailed internal software structure level (modules, classes, internal patterns)
    -- already covered in respective technical domains of this curriculum
KEY POINT: this enterprise-wide mapping makes visible what single-system view CANNOT show:
  REDUNDANCY: multiple apps providing same/very similar business function
  CRITICAL DEPENDENCY: apps many other systems depend on
    (failure/replacement has especially far-reaching consequences)
  redundancy between two apps ONLY visible when BOTH considered together at enterprise level
    NOT when each analyzed in isolation
Business capabilities (KB-0590) = reference point for mapping:
  each app mapped by: which capabilities it actually supports, which app functions it provides for that,
    which interfaces it uses to interact with other apps, which org unit owns it
REDUNDANCY only visible at THIS enterprise-wide mapping level:
  two apps independently arising in different business units
    can redundantly provide same business function (e.g. "manage customer data")
    without this being noticeable WITHIN a single business unit
  only enterprise-wide comparison of mapped app functions uncovers this redundancy
    -> enables informed consolidation decision
CRITICAL DEPENDENCIES arise from interface structure between apps:
  app that MANY other systems depend on via interfaces (e.g. central customer master data system)
    = especially high risk: replacement/migration/failure has far-reaching consequences for all dependents
  this dependency structure ONLY visible via enterprise-wide interface mapping,
    NOT by considering a single system in isolation
DELIBERATE boundary vs detailed internal software structure = methodically necessary:
  mapping trying to capture BOTH enterprise-wide landscape AND internal module/class structure
    of every single system at same detail level -> becomes impractically large
    -> loses actual purpose (enterprise-wide visibility of redundancy + critical dependencies)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Anwendungsfunktion | fachliche Funktion, die eine Anwendung bereitstellt | Grundlage für Redundanzerkennung über mehrere Anwendungen |
| Schnittstellenkartierung | dokumentiert Interaktion zwischen Anwendungen | macht kritische Abhängigkeiten sichtbar |
| Redundanz | mehrere Anwendungen mit gleicher/ähnlicher Funktion | nur auf unternehmensweiter Kartierungsebene erkennbar |
| Kritische Abhängigkeit | Anwendung mit vielen abhängigen Systemen | besonders hohes Risiko bei Ablösung oder Ausfall |

Implementierung: Jede Anwendung wird mit ihren bereitgestellten Funktionen, Schnittstellen und der verantwortlichen Organisationseinheit kartiert, bezogen auf die von ihr unterstützten Geschäftsfähigkeiten. Redundante Funktionen werden durch unternehmensweiten Vergleich der kartierten Anwendungsfunktionen identifiziert. Kritische Abhängigkeiten werden durch Analyse der Schnittstellenkartierung sichtbar gemacht, insbesondere Anwendungen mit vielen eingehenden Abhängigkeiten.

## Scalability, Reliability, Security und Observability

Application Architecture skaliert die Sichtbarkeit von Redundanzen und kritischen Abhängigkeiten proportional zur Vollständigkeit der unternehmensweiten Kartierung; die Reliability-Grenze liegt darin, dass eine unvollständige oder zu detaillierte, auf einzelne Systeme fokussierte Kartierung unternehmensweite Redundanzen und kritische Abhängigkeiten unentdeckt lässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| zwei unabhängig entstandene Anwendungen stellen dieselbe fachliche Funktion redundant bereit, ohne dass dies auffällt | keine unternehmensweite Kartierung der Anwendungsfunktionen vergleicht beide Anwendungen | eine unternehmensweite Funktionskartierung einführen, die Redundanzen über Geschäftsbereiche hinweg sichtbar macht |
| die Ablösung einer Anwendung hat unerwartet weitreichende Konsequenzen für viele andere Systeme | eine kritische Abhängigkeit wurde vor der Ablösungsentscheidung nicht durch Schnittstellenkartierung identifiziert | eine Schnittstellenkartierung vor jeder größeren Anwendungsänderung durchführen |
| eine Application-Architecture-Kartierung wird unpraktikabel umfangreich und selten gepflegt | die Kartierung versucht, interne Softwarestruktur einzelner Systeme im selben Detailgrad wie die Unternehmenslandschaft abzubilden | den Detailgrad bewusst auf Funktionen, Schnittstellen und Verantwortliche begrenzen |

Security: Kritische, unternehmensweite Abhängigkeiten (etwa ein zentrales Identitäts- oder Kundenstammdatensystem) sind besonders relevante Ziele für Sicherheitsbewertungen, da ihre Kompromittierung weitreichende Konsequenzen hätte. Observability: Die tatsächliche Aktualität der Anwendungskartierung (wie oft sie mit der tatsächlichen Anwendungslandschaft abgeglichen wird) ist ein zentrales Signal zur Bewertung ihrer Verlässlichkeit als Entscheidungsgrundlage.

## Trade-offs und Entscheidungen

**Staff** kartiert Funktionen und Schnittstellen einer gegebenen Anwendung korrekt. **Principal** entwirft die vollständige Application-Architecture-Kartierung für einen Geschäftsbereich und identifiziert Redundanzen und kritische Abhängigkeiten. **Chief** legt unternehmensweite Standards für Application-Architecture-Kartierung und Konsolidierungsentscheidungen fest.

Anti-Patterns: Application Architecture mit demselben Detailgrad wie interne Softwarestruktur einzelner Systeme betreiben und dadurch unpraktikabel umfangreich werden; Redundanzen zwischen Anwendungen verschiedener Geschäftsbereiche unentdeckt lassen, weil keine unternehmensweite Kartierung existiert; eine Anwendung ablösen, ohne vorher ihre kritischen Abhängigkeiten über eine Schnittstellenkartierung zu identifizieren.

## Production Checklist

- [ ] Jede Anwendung ist mit Funktionen, Schnittstellen und verantwortlicher Organisationseinheit kartiert.
- [ ] Redundante Anwendungsfunktionen sind durch unternehmensweiten Vergleich identifiziert.
- [ ] Kritische Abhängigkeiten sind durch Schnittstellenkartierung sichtbar gemacht.
- [ ] Der Detailgrad der Kartierung ist bewusst auf Unternehmensebene begrenzt, nicht auf interne Softwarestruktur ausgedehnt.

## Interviewfragen

### 1. Auf welcher Ebene operiert Application Architecture, und wie unterscheidet sie sich von interner Softwarestruktur?

**Antwort:** Sie operiert auf Ebene der gesamten unternehmensweiten Anwendungslandschaft (Funktionen, Schnittstellen, Verantwortliche), bewusst nicht auf Ebene der detaillierten internen Modul- oder Klassenstruktur einzelner Systeme.

### 2. Warum wird eine Redundanz zwischen zwei Anwendungen oft erst auf unternehmensweiter Ebene sichtbar?

**Antwort:** Weil zwei unabhängig in unterschiedlichen Geschäftsbereichen entstandene Anwendungen dieselbe fachliche Funktion bereitstellen können, ohne dass dies innerhalb eines einzelnen Geschäftsbereichs auffällt — erst der unternehmensweite Vergleich deckt dies auf.

### 3. Was macht eine Anwendung zu einer kritischen Abhängigkeit?

**Antwort:** Wenn viele andere Systeme über Schnittstellen von ihr abhängen, sodass ihre Ablösung, Migration oder ein Ausfall weitreichende Konsequenzen für alle abhängigen Systeme hätte.

### 4. Warum ist die bewusste Abgrenzung zur internen Softwarestruktur methodisch notwendig?

**Antwort:** Weil eine Kartierung, die sowohl die unternehmensweite Landschaft als auch die interne Struktur jedes Systems im selben Detailgrad abbilden will, unpraktikabel umfangreich wird und den eigentlichen Zweck der unternehmensweiten Sichtbarkeit verliert.

### 5. Wie gehst du vor, wenn die Ablösung einer Anwendung unerwartet weitreichende Konsequenzen für andere Systeme hat?

**Antwort:** Ich prüfe, ob vor der Ablösungsentscheidung eine Schnittstellenkartierung durchgeführt wurde, die diese kritische Abhängigkeit hätte sichtbar machen können, und führe diese Kartierung künftig vor jeder größeren Anwendungsänderung durch.

### 6. Widersprüchliche Anforderung: Teams wollen minimalen Pflegeaufwand für die Anwendungskartierung UND die Organisation will vollständige Sichtbarkeit über Redundanzen und kritische Abhängigkeiten — wie gehst du vor?

**Antwort:** Ich würde den Detailgrad der Kartierung bewusst auf Funktionen, Schnittstellen und Verantwortliche begrenzen, statt interne Softwarestruktur mit abzubilden, um vollständige unternehmensweite Sichtbarkeit mit vertretbarem Pflegeaufwand zu verbinden, statt entweder auf Sichtbarkeit oder auf praktikablen Aufwand zu verzichten.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting redundant app functions and critical dependencies (executed locally, no real EA tool):

def find_redundancies(apps):
    function_map = {}
    for app in apps:
        for fn in app["functions"]:
            function_map.setdefault(fn, []).append(app["name"])
    return {fn: owners for fn, owners in function_map.items() if len(owners) > 1}

def find_critical_dependencies(apps, min_dependents=3):
    dependency_count = {}
    for app in apps:
        for dep in app["depends_on"]:
            dependency_count[dep] = dependency_count.get(dep, 0) + 1
    return {app: count for app, count in dependency_count.items() if count >= min_dependents}

apps = [
    {"name": "CRM-Sales", "functions": ["manage_customer_data"], "depends_on": ["MasterData"]},
    {"name": "CRM-Support", "functions": ["manage_customer_data"], "depends_on": ["MasterData"]},
    {"name": "Billing", "functions": ["issue_invoice"], "depends_on": ["MasterData"]},
]

print("redundancies:", find_redundancies(apps))
print("critical dependencies:", find_critical_dependencies(apps, min_dependents=2))
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Application Architecture](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. ArchiMate-Spezifikation: [ArchiMate 3.2 Specification — Application Layer](https://pubs.opengroup.org/architecture/archimate3-doc/chap10.html), abgerufen 2026-09-18.

Business Architecture ist kanonisch in [KB-0590](02-business-architecture.md) behandelt; die interne Softwarestruktur einzelner Systeme in den jeweiligen technischen Domains dieses Curriculums.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Application-Architecture-Kartierung durch API-Verkehrsanalyse und Service-Discovery-Daten statt manueller Dokumentation | Evaluating | Als ergänzende, kontinuierlich aktualisierte Datenquelle prüfen, jedoch die fachliche Funktionszuordnung (welche Geschäftsfähigkeit eine Anwendung unterstützt) weiterhin durch menschliche Kuratierung sicherstellen, da dies aus reinem API-Verkehr nicht zuverlässig ableitbar ist. |

Ein Team akzeptiert eine Application-Architecture-Kartierung erst, wenn Funktionen, Schnittstellen und Verantwortliche unternehmensweit dokumentiert sind und Redundanzen sowie kritische Abhängigkeiten daraus nachweislich identifizierbar sind.
