---
{"id": "KB-0150", "title": "Conway's Law und Architekturstruktur", "domain": "06", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0137", "concepts": ["Servicegrenzen"], "needed_for": "both"}], "related": ["KB-0151", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Beispiel-Kommunikationsdiagramm eines Teams gegen die resultierende Systemarchitektur lokal abgleichen.", "rationale": "Kein reales Team nötig, um das Prinzip zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Systemgrenzen bewusst mit Kommunikationswegen zwischen Teams abgleichen, statt sie unabhängig von der Organisation zu entwerfen.", "rationale": "Eine Architektur, die der Teamstruktur widerspricht, wird durch organisatorischen Druck zurückverformt."}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet enge technische Kopplung auf eine enge Kommunikationsbeziehung zwischen zwei Teams zurückführen.", "rationale": "Das ist eine häufige, oft übersehene Ursache technischer Kopplung."}, "CHIEF-TARGET": {"active": true, "scope": "Organisationsdesign und Zielarchitektur bewusst gemeinsam planen (Inverse Conway Maneuver).", "rationale": "Eine gewünschte Zielarchitektur lässt sich durch entsprechende Teamstruktur gezielt fördern."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Team-Topologien-Modelle (Stream-aligned, Platform, Enabling Teams) im Detail werden in Domain 30 vertieft.", "rationale": "Diese Datei behandelt das Grundprinzip; Teamumbau selbst ist ein eigenes Thema in Domain 30."}}, "lab_validation": [{"lab_id": "KB-0150-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Modell für Team-Kommunikationsstruktur versus Systemarchitektur", "evidence": "Ein Team mit häufiger direkter Kommunikation zwischen zwei Untergruppen korreliert mit enger technischer Kopplung der von ihnen verantworteten Module.", "limitations": "Kein reales Team, rein methodische Übung."}]}
---
# Conway's Law und Architekturstruktur

> **Ziel:** Conway's Law besagt, dass die Struktur eines Systems die Kommunikationsstruktur der Organisation widerspiegelt, die es baut. Eine Architektur, die der tatsächlichen Team-Kommunikationsstruktur widerspricht, wird durch organisatorischen Druck zurückverformt — Servicegrenzen ([KB-0137](09-microservices-und-servicegrenzen.md)) lassen sich daher nicht unabhängig von der Organisationsstruktur planen.

## Zweck, Mental Model und Dependencies

Melvin Conway beobachtete 1968: Organisationen entwerfen Systeme, die die Kommunikationsstruktur der Organisation kopieren. Wenn zwei Teams eng und häufig kommunizieren müssen, um ihre Arbeit zu koordinieren, wird das resultierende System diese enge Kopplung technisch widerspiegeln — unabhängig davon, was die ursprüngliche Architekturabsicht war. Das Inverse Conway Maneuver kehrt das bewusst um: die Teamstruktur wird gezielt so gestaltet, dass sie die gewünschte Zielarchitektur fördert, statt umgekehrt zu hoffen, dass eine Architektur gegen die bestehende Organisationsstruktur Bestand hat. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0137](09-microservices-und-servicegrenzen.md).

~~~text
Team communication structure: TeamA <-> TeamB (frequent, tight coordination)
Resulting system structure:   ModuleA <-> ModuleB (tightly coupled, regardless of intended architecture)
Inverse Conway Maneuver: design team structure FIRST to match desired loosely-coupled architecture
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Konsequenz bei Ignorieren |
|---|---|---|
| Kommunikationsstruktur | wie oft/eng kommunizieren die Teams tatsächlich? | Architektur ignoriert reale Koordinationsmuster |
| Team-Architektur-Abgleich | entsprechen Servicegrenzen den Teamgrenzen? | technische Grenze wird durch organisatorischen Druck untergraben |
| Inverse Conway Maneuver | wird die Teamstruktur bewusst für die Zielarchitektur gestaltet? | gewünschte lose Kopplung bleibt unerreichbar ohne passende Teamstruktur |
| Fehlende Eigentümerschaft | hat jedes System-Teil ein eindeutig verantwortliches Team? | geteilte Verantwortung erzeugt Koordinationsaufwand, der sich technisch als Kopplung zeigt |

Implementierung: bei der Planung einer Zielarchitektur (z. B. lose gekoppelte Microservices) wird parallel geprüft, ob die Teamstruktur diese Zielarchitektur tatsächlich unterstützt — ein einzelnes Team, das für zehn „unabhängige" Services verantwortlich ist, wird faktisch keine unabhängigen Deployments erreichen, weil die Koordination innerhalb des Teams ohnehin eng bleibt. Für eine gewünschte lose Kopplung wird die Teamstruktur (Verantwortlichkeiten, Kommunikationswege) bewusst vorab an die Zielarchitektur angepasst, nicht nachträglich gehofft, dass Architektur allein die Organisationsrealität überwindet.

## Scalability, Reliability, Security und Observability

Conway's Law wird bei wachsender Organisation zunehmend relevant: je mehr Teams beteiligt sind, desto stärker prägt die Kommunikationsstruktur die resultierende technische Struktur. Reliability-Grenze der Beobachtung: ein Architekturentwurf, der die tatsächliche Organisationsrealität ignoriert, führt in der Praxis oft zu genau der Kopplung zurück, die er eigentlich vermeiden wollte — unabhängig davon, wie sauber das ursprüngliche Diagramm aussah.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| „unabhängige" Services werden trotzdem immer gemeinsam geändert | Teams, die diese Services verantworten, kommunizieren eng/sind identisch | Team-Zuordnung der betroffenen Services gegen Kommunikationsmuster prüfen |
| eine geplante Zielarchitektur wird über Zeit unbemerkt wieder enger gekoppelt | Teamstruktur wurde nicht an die Zielarchitektur angepasst | aktuelle Teamgrenzen gegen ursprünglich geplante Servicegrenzen vergleichen |
| ein Systemteil hat unklare Verantwortlichkeit | kein eindeutiges Team-Ownership definiert | Owner-Zuordnung für den betroffenen Systemteil prüfen |
| Architekturumbau scheitert trotz technisch korrektem Design | fehlender begleitender Teamumbau (kein Inverse Conway Maneuver) | prüfen, ob die Teamstruktur parallel zur technischen Migration angepasst wurde |

Security: geteilte, unklare Verantwortlichkeit für ein System-Teil (Conway-Symptom) korreliert oft mit unklarer Sicherheitsverantwortung — niemand fühlt sich für Patches oder Audits eindeutig zuständig. Observability: die Korrelation zwischen Kommunikationsmustern (z. B. aus Chat-/Meeting-Daten) und Change-Coupling-Mustern ([KB-0149](21-kohaesion-und-kopplungsarten.md)) ist ein diagnostisches Werkzeug, um Conway's Law empirisch am eigenen System zu überprüfen.

## Trade-offs und Entscheidungen

**Staff** führt unerwartete technische Kopplung auf mögliche zugrunde liegende Team-Kommunikationsmuster zurück, bevor er sie rein technisch zu lösen versucht. **Principal** plant Team- und Systemgrenzen gemeinsam, nicht die technische Architektur isoliert von der Organisation. **Chief** wendet das Inverse Conway Maneuver bewusst an, indem er Teamstrukturen gezielt für eine gewünschte Zielarchitektur gestaltet.

Anti-Patterns: eine technische Zielarchitektur entwerfen, ohne die Teamstruktur zu berücksichtigen oder anzupassen; ein einzelnes Team für viele „unabhängige" Services verantwortlich machen und echte Unabhängigkeit erwarten; unklare System-Eigentümerschaft über mehrere Teams verteilen.

## Production Checklist

- [ ] Servicegrenzen wurden mit tatsächlichen Team-Kommunikationsmustern abgeglichen.
- [ ] Jedes System-Teil hat eine eindeutige Team-Eigentümerschaft.
- [ ] Bei geplanten Architekturänderungen wird die Teamstruktur parallel bewusst angepasst.
- [ ] Change-Coupling-Muster werden periodisch gegen Team-Kommunikationsmuster geprüft.

## Interviewfragen

### 1. Was besagt Conway's Law?

**Antwort:** Die Struktur eines von einer Organisation gebauten Systems spiegelt die Kommunikationsstruktur dieser Organisation wider — unabhängig von der ursprünglich beabsichtigten technischen Architektur.

### 2. Was ist das Inverse Conway Maneuver?

**Antwort:** Die bewusste Gestaltung der Teamstruktur, um eine gewünschte Zielarchitektur zu fördern, statt zu hoffen, dass eine technische Architektur unabhängig von der bestehenden Organisationsstruktur Bestand hat.

### 3. Warum scheitert eine „unabhängige" Microservices-Architektur oft, wenn ein einzelnes Team für alle Services verantwortlich ist?

**Antwort:** Weil die Koordination innerhalb dieses einen Teams ohnehin eng bleibt, wodurch die technische Trennung in der Praxis keine echte organisatorische/Deployment-Unabhängigkeit erzeugt.

### 4. Wie erkennst du Conway's Law empirisch in einem bestehenden System?

**Antwort:** Durch Korrelation von Team-Kommunikationsmustern mit Change-Coupling-Mustern im Code — enge Kommunikation zwischen Teams korreliert typischerweise mit enger technischer Kopplung ihrer verantworteten Module.

### 5. Warum ist unklare System-Eigentümerschaft ein Conway-Symptom?

**Antwort:** Wenn kein Team eindeutig für einen Systemteil verantwortlich ist, spiegelt das oft eine unklare oder fragmentierte Kommunikationsstruktur in der Organisation wider.

### 6. Widersprüchliche Anforderung: Management will eine lose gekoppelte Microservices-Architektur UND die bestehende, stark zentralisierte Teamstruktur beibehalten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Kombination laut Conway's Law nicht nachhaltig funktioniert; entweder die Teamstruktur wird an die gewünschte Architektur angepasst (Inverse Conway Maneuver), oder die Erwartung an lose Kopplung muss realistisch an die bestehende zentralisierte Struktur angepasst werden.

## Praktische Labs

~~~python
team_communication = {("TeamA", "TeamB"): 50, ("TeamA", "TeamC"): 2}  # meetings/week
module_coupling = {("ModuleA", "ModuleB"): 0.9, ("ModuleA", "ModuleC"): 0.05}  # change coupling ratio

def correlates(comm, coupling, threshold_comm=20, threshold_coupling=0.5):
    high_comm = comm > threshold_comm
    high_coupling = coupling > threshold_coupling
    return high_comm == high_coupling

assert correlates(team_communication[("TeamA", "TeamB")], module_coupling[("ModuleA", "ModuleB")])
print("High team communication correlates with high module coupling - Conway's Law observed empirically.")
~~~

## Dependencies, Cross-References und Quellen

1. Conway: [How Do Committees Invent?](http://www.melconway.com/Home/pdf/committees.pdf), Datamation 1968, abgerufen 2026-09-17.
2. Skelton, Pais: [Team Topologies](https://teamtopologies.com/), IT Revolution Press 2019, abgerufen 2026-09-17.

Detaillierte Team-Topologien-Modelle werden in Domain 30 vertieft; diese Datei behandelt das Grundprinzip.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Analyse von Kommunikationsdaten (Chat/Meetings) zur Conway-Law-Validierung | Emerging | Datenschutz- und Interpretationsgrenzen vor Einsatz sorgfältig prüfen. |

Dieses Prinzip ist seit über fünf Jahrzehnten stabil bestätigt; der Bonus betrifft primär Tooling zur empirischen Messung, nicht das Prinzip selbst.
