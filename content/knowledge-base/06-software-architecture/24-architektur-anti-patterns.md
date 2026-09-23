---
{"id": "KB-0152", "title": "Architektur-Anti-Patterns", "domain": "06", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0149", "concepts": ["Kopplung"], "needed_for": "both"}, {"id": "KB-0137", "concepts": ["Servicegrenzen"], "needed_for": "understanding"}], "related": ["KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Distributed-Monolith-Symptom (synchrone Kettenabhängigkeit über mehrere Services) lokal simulieren und diagnostizieren.", "rationale": "Kein reales verteiltes System nötig, um das Anti-Pattern zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Architektur-Anti-Patterns anhand konkreter Symptome statt reiner Namensmuster erkennen und einen schrittweisen Ausweg entwerfen.", "rationale": "Ein Anti-Pattern-Name allein hilft nicht ohne Verständnis der zugrunde liegenden Ursache."}, "STAFF-TARGET": {"active": true, "scope": "Ein wiederkehrendes Produktionsproblem auf ein bekanntes Architektur-Anti-Pattern zurückführen.", "rationale": "Das beschleunigt Diagnose, da bekannte Muster bekannte Ursachen haben."}, "CHIEF-TARGET": {"active": true, "scope": "Architektur-Reviews gezielt auf bekannte Anti-Patterns prüfen, um sie vor Produktivsetzung zu vermeiden.", "rationale": "Viele Anti-Patterns sind teurer zu beheben als zu verhindern."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Weitere seltenere Anti-Patterns (Golden Hammer, Lava Flow) im Detail sind Vertiefung.", "rationale": "Kern sind die häufigsten, folgenreichsten Muster: Distributed Monolith, Shared Database, Scheinsicherheit durch Abstraktion."}}, "lab_validation": [{"lab_id": "KB-0152-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für einen Distributed Monolith mit synchroner Kettenabhängigkeit", "evidence": "Ein Ausfall des letzten Services in einer synchronen Aufrufkette lässt alle vorgelagerten Services ebenfalls fehlschlagen, obwohl sie als 'unabhängige Microservices' bezeichnet wurden.", "limitations": "Kein reales System, keine Produktion."}]}
---
# Architektur-Anti-Patterns

> **Ziel:** Bestimmte Architekturfehler treten wiederholt in ähnlicher Form auf und haben erkennbare Symptome, Ursachen und Auswege. Distributed Monolith (Microservices mit Monolith-Nachteilen ohne dessen Vorteile), Shared Database (mehrere Services teilen sich eine Datenbank) und abstrahierte Scheinsicherheit (Abstraktionen, die Komplexität verstecken statt lösen) gehören zu den häufigsten und folgenreichsten.

## Zweck, Mental Model und Dependencies

Ein Anti-Pattern ist kein bloßer Stilfehler, sondern ein wiederkehrendes strukturelles Muster mit vorhersehbaren negativen Konsequenzen. Der Distributed Monolith entsteht, wenn Services zwar physisch getrennt deployt werden, aber durch synchrone Aufrufketten, geteilte Datenbanken oder enge Kopplung ([KB-0149](21-kohaesion-und-kopplungsarten.md)) faktisch wie ein Monolith zusammenhängen — mit den Nachteilen beider Welten: Netzwerklatenz und Fehlerfläche eines verteilten Systems, plus die enge Kopplung eines Monolithen. Shared Database (mehrere Services greifen direkt auf dieselbe Datenbank zu) verletzt Servicegrenzen ([KB-0137](09-microservices-und-servicegrenzen.md)) fundamental. Abstrahierte Scheinsicherheit entsteht, wenn eine Abstraktionsschicht echte Komplexität nicht löst, sondern nur verbirgt — bis sie in einer Krisensituation ungefiltert durchbricht. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0149](21-kohaesion-und-kopplungsarten.md) und [KB-0137](09-microservices-und-servicegrenzen.md).

~~~text
Distributed Monolith: ServiceA -> sync call -> ServiceB -> sync call -> ServiceC
                        (ServiceC down -> A and B fail too, deployed separately but coupled like a monolith)
Shared Database:       ServiceA -> DB <- ServiceB (schema change in DB breaks both, no data ownership)
~~~

## Core Concepts, Architektur und Implementierung

| Anti-Pattern | Symptom | Typische Ursache | Ausweg |
|---|---|---|---|
| Distributed Monolith | ein Service-Ausfall reißt mehrere andere mit | synchrone Aufrufketten, gemeinsame Deployment-Zyklen | Asynchrone Entkopplung, Bulkheads ([KB-0122](../05-distributed-systems/22-fehlerdomaenen-und-bulkheads.md)) |
| Shared Database | Schema-Änderung bricht mehrere Services gleichzeitig | fehlende Datenhoheit-Trennung ([KB-0136](08-modularer-monolith.md)) | schrittweise Datenbank-Entkopplung, API statt direktem DB-Zugriff |
| Abstrahierte Scheinsicherheit | Abstraktion versagt genau in der Krisensituation, die sie abfangen sollte | Komplexität versteckt statt gelöst, nie unter realer Last getestet | Abstraktion unter realistischen Fehlerbedingungen testen, nicht nur Happy Path |
| Golden Hammer | dieselbe Lösung für strukturell unterschiedliche Probleme | fehlende Bewertung, ob die Lösung tatsächlich passt | Problem zuerst analysieren, Lösung danach wählen |

Implementierung: Diagnose beginnt mit dem konkreten Symptom (z. B. „Ausfall von Service X zieht Service Y mit"), nicht mit dem Anti-Pattern-Namen — der Name hilft erst, wenn das Symptom verstanden ist. Der Ausweg ist meist schrittweise, nicht ein Komplettumbau: bei Distributed Monolith zuerst die kritischste synchrone Kette identifizieren und asynchron entkoppeln; bei Shared Database zuerst klare Datenhoheit definieren und schrittweise (Expand-Contract-artig) trennen; bei abstrahierter Scheinsicherheit die Abstraktion gezielt unter realistischen Fehlerbedingungen testen, um die verborgene Komplexität sichtbar zu machen.

## Scalability, Reliability, Security und Observability

Architektur-Anti-Patterns werden mit wachsender Systemgröße und Teamanzahl zunehmend kostspielig, da ihre Symptome (Kaskadenausfälle, blockierte unabhängige Entwicklung) sich verstärken. Reliability-Grenze: ein Distributed Monolith kombiniert die Fehlerfläche verteilter Systeme (Netzwerkfehler, Teilausfälle) mit der Kopplung eines Monolithen (ein Ausfall zieht andere mit) — das ist strukturell schlechter als entweder ein sauberer Monolith oder saubere Microservices allein.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Service-Ausfall breitet sich über mehrere „unabhängige" Services aus | Distributed Monolith durch synchrone Kettenabhängigkeit | Aufrufkette bei einem simulierten Ausfall nachverfolgen |
| Datenbank-Migration erfordert Koordination mehrerer Teams gleichzeitig | Shared Database ohne klare Datenhoheit | Datenbankzugriffe der beteiligten Services auf gemeinsame Tabellen prüfen |
| eine Abstraktion versagt genau während eines Incidents | abstrahierte Scheinsicherheit, nie unter realer Last getestet | prüfen, ob die Abstraktion je unter realistischen Fehlerbedingungen getestet wurde |
| dieselbe technische Lösung wird für strukturell unterschiedliche Probleme wiederverwendet | Golden-Hammer-Anti-Pattern | Eignung der Lösung für das jeweils konkrete Problem separat bewerten |

Security: ein Shared-Database-Anti-Pattern erschwert konsistente Zugriffskontrolle, da mehrere Services potenziell auf dieselben sensiblen Daten zugreifen können, ohne dass eine einzelne Stelle die Autorisierung kontrolliert. Observability: die typischen Symptome dieser Anti-Patterns (kaskadierende Ausfälle, koordinierte Migrationen, Krisenversagen von Abstraktionen) sind selbst diagnostische Signale, die auf das zugrunde liegende Muster hinweisen.

## Trade-offs und Entscheidungen

**Staff** diagnostiziert wiederkehrende Produktionsprobleme aktiv gegen bekannte Anti-Pattern-Symptome. **Principal** prüft Architektur-Reviews gezielt auf diese Muster, bevor sie in Produktion gehen. **Chief** verlangt, dass neue Architekturentscheidungen explizit gegen bekannte Anti-Patterns geprüft werden, um teure spätere Sanierung zu vermeiden.

Anti-Patterns (zum Anti-Pattern-Thema selbst): ein Anti-Pattern nur am Namen erkennen wollen, ohne das zugrunde liegende Symptom zu verstehen; einen kompletten Neubau statt schrittweiser Sanierung versuchen; ein einzelnes bekanntes Anti-Pattern beheben, ohne die zugrunde liegende strukturelle Ursache (z. B. fehlende Datenhoheit) systematisch anzugehen.

## Production Checklist

- [ ] Synchrone Aufrufketten über mehrere Services auf Distributed-Monolith-Risiko geprüft.
- [ ] Datenhoheit pro Service eindeutig geklärt, keine geteilte Datenbank ohne expliziten Grund.
- [ ] Kritische Abstraktionen unter realistischen Fehlerbedingungen getestet, nicht nur Happy Path.
- [ ] Architektur-Reviews prüfen gezielt gegen bekannte Anti-Pattern-Symptome.

## Interviewfragen

### 1. Was ist ein Distributed Monolith?

**Antwort:** Ein System aus physisch getrennt deployten Services, die durch synchrone Aufrufketten oder geteilte Ressourcen so eng gekoppelt sind, dass sie sich wie ein Monolith verhalten — mit den Nachteilen beider Architekturarten kombiniert.

### 2. Warum ist Shared Database ein Anti-Pattern?

**Antwort:** Es verletzt die Datenhoheit einzelner Services, macht Schema-Änderungen zu koordinationsintensiven Cross-Team-Vorhaben und untergräbt die eigentliche Idee unabhängiger Services.

### 3. Was bedeutet „abstrahierte Scheinsicherheit"?

**Antwort:** Eine Abstraktionsschicht, die echte Komplexität nicht tatsächlich löst, sondern nur verbirgt — sie funktioniert im Normalbetrieb, versagt aber oft genau in der Krisensituation, für die sie eigentlich gedacht war.

### 4. Wie diagnostizierst du einen Distributed Monolith in einem bestehenden System?

**Antwort:** Durch Nachverfolgung, ob ein simulierter Ausfall eines Service mehrere andere, angeblich unabhängige Services mitreißt — das zeigt die tatsächliche, versteckte Kopplung.

### 5. Warum sollten Abstraktionen unter realistischen Fehlerbedingungen getestet werden?

**Antwort:** Weil eine Abstraktion, die nur den Happy Path abdeckt, in genau der Krisensituation versagen kann, für die sie eigentlich Sicherheit bieten sollte — das ist erst unter realer Last/Fehlerbedingung sichtbar.

### 6. Widersprüchliche Anforderung: Team hat einen erkannten Distributed Monolith UND will keine Downtime für die Sanierung — wie gehst du vor?

**Antwort:** Ich würde die kritischste synchrone Kettenabhängigkeit zuerst identifizieren und schrittweise, nach den sicheren Refactoring-Prinzipien ([KB-0146](18-architekturrefactoring-und-sichere-schritte.md)), asynchron entkoppeln, statt einen riskanten Komplettumbau zu versuchen — jeder Schritt bleibt einzeln reversibel und der Betrieb läuft während der gesamten Sanierung weiter.

## Praktische Labs

~~~python
def service_c():
    raise ConnectionError("ServiceC is down")

def service_b():
    return service_c()  # synchronous chain dependency

def service_a():
    return service_b()  # synchronous chain dependency

try:
    service_a()
    raise AssertionError("expected cascading failure")
except ConnectionError:
    print("ServiceC's failure cascaded through ServiceB to ServiceA - a distributed monolith symptom.")
~~~

## Dependencies, Cross-References und Quellen

1. Richardson: [Microservices Patterns - Distributed Monolith](https://microservices.io/patterns/microservices.html), Manning 2018, abgerufen 2026-09-17.

Diese Muster sind zeitstabil bekannte Architekturfehler; konkrete Sanierungs-Tooling-Details sollten dennoch gegen aktuelle Dokumentation geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Erkennung von Distributed-Monolith-Symptomen aus Tracing-Daten | Adopting | Ergebnis gegen manuelle Architekturbewertung validieren. |

Diese Anti-Patterns sind etablierte, gut dokumentierte Muster; der Bonus betrifft primär automatisierte Erkennungswerkzeuge, nicht die Muster selbst.
