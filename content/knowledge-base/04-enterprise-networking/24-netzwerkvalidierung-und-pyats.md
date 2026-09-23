---
{"id": "KB-0100", "title": "Netzwerkvalidierung und PyATS", "domain": "04", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0098", "concepts": ["Task", "Result", "Parallelität"], "needed_for": "both"}, {"id": "KB-0064", "concepts": ["Routing", "FIB"], "needed_for": "understanding"}], "related": ["KB-0097", "KB-0099", "KB-0562", "KB-0720"], "applies": ["KB-0097", "KB-0099", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales Pre-/Postcheck-Modell mit erkannter Drift selbst prüfen.", "rationale": "Kein Testbed/Geräte nötig."}, "ARCHITECT-TARGET": {"active": true, "scope": "Precheck-/Postcheck-Umfang, Invarianten und Rollback-Kriterien als Change-Vertrag entwerfen.", "rationale": "Validierung ist die Gegenprobe zu jeder Netzwerkänderung."}, "STAFF-TARGET": {"active": true, "scope": "Falsch-negative Prechecks, unvollständige Invarianten und Drift-Erkennung nach Change testen.", "rationale": "Eine unvollständige Validierung gibt falsches Vertrauen vor riskanten Changes."}, "CHIEF-TARGET": {"active": true, "scope": "Pflicht-Validierung vor produktiven Änderungen und Rollback-Kriterien als Governance-Standard festlegen.", "rationale": "Nachweisbare Validierung reduziert Ausfallrisiko organisationsweit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "pyATS-Testbeds, Genie-Parser und automatisierte Learn/Diff-Workflows sind Vertiefung.", "rationale": "Kern ist der nachweisbare Vorher-Nachher-Vergleich."}}, "lab_validation": [{"lab_id": "KB-0100-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales fiktives Pre-/Postcheck-Modell", "evidence": "Eine verletzte Routing-Invariante nach Change löst Rollback-Kriterium aus.", "limitations": "Kein reales Testbed, keine Geräte, keine Produktion."}]}
---
# Netzwerkvalidierung und PyATS

> **Ziel:** Netzwerkvalidierung vergleicht definierte Invarianten (Erreichbarkeit, Routing, Nachbarschaften) vor und nach einer Änderung. pyATS/Genie liefern strukturierte Testbeds und geparste Gerätezustände für Prechecks, Postchecks und Drift-Erkennung, ersetzen aber nicht die Definition der richtigen Invarianten.

## Zweck, Mental Model und Dependencies

Ein Precheck erfasst den Ist-Zustand vor einer Änderung; ein Postcheck erfasst ihn danach; Validierung vergleicht beide gegen definierte Invarianten statt nur „Änderung angewendet“ zu prüfen. pyATS strukturiert Geräte als Testbed-Objekte, Genie parst rohe CLI-Ausgabe in vergleichbare Strukturen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0098](22-python-und-nornir-fuer-netops.md) und [KB-0064](../03-network-foundations/16-routingtabellen-und-weiterleitung.md).

~~~text
precheck (invariants) -> apply change -> postcheck (invariants) -> diff -> pass/rollback decision
        ^ baseline captured                         ^ same structure compared              ^ explicit criteria
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Invarianten | welche Zustände dürfen sich nicht ungewollt ändern? | zu enger oder zu weiter Prüfumfang |
| Testbed | Geräteinventar mit korrekten Zugangsdaten/Protokollen? | veraltetes Testbed liefert falsche Baseline |
| Parsing (Genie) | strukturierte statt roher Textvergleich? | brüchiger Textvergleich erzeugt Fehlalarme |
| Diff-Bewertung | erwarteter versus unerwarteter Unterschied? | echte Regression wird als „erwartet“ abgetan |
| Rollback-Kriterium | klar definierte Abbruchbedingung vor Change? | Entscheidung erst nach Eskalation getroffen |

Implementierung beginnt mit klar definierten Invarianten pro Change-Typ (z. B. BGP-Nachbarschaften stabil, Erreichbarkeit kritischer Präfixe erhalten), einem aktuellen Testbed, strukturierten Precheck-Snapshots, automatisiertem Diff nach dem Change und einem vorab festgelegten, nicht nachträglich verhandelten Rollback-Kriterium.

## Scalability, Reliability, Security und Observability

Skalierung hängt von Anzahl Geräte im Testbed, Umfang der geparsten Kommandos und Parallelität der Prechecks ab. Reliability erfordert, dass Precheck und Postcheck exakt dieselben Kommandos und Parser verwenden, damit Diffs vergleichbar sind, sowie eine klare Trennung zwischen erwarteten Änderungen (Teil des Change) und unerwarteten Abweichungen (Regression).

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| Postcheck „grün“, Service dennoch gestört | Invarianten decken relevanten Zustand nicht ab | Invarianten gegen tatsächlichen Incident erweitern |
| viele Fehlalarme bei jedem Change | Textvergleich statt strukturiertem Parsing | Genie-Parser statt Rohtext-Diff nutzen |
| Rollback-Entscheidung dauert zu lange | kein vorab definiertes Kriterium | Rollback-Schwelle vor Change explizit festlegen |
| Precheck und Postcheck nicht vergleichbar | unterschiedliche Kommandos/Zeitpunkte | identische Prüfroutine für beide Phasen erzwingen |
| Testbed veraltet | keine Synchronisation mit SoT | Testbed-Generierung aus aktuellem Inventar |

Security erfordert Read-only-Zugangsdaten für Validierungsläufe getrennt von änderndem Zugriff, geschützte Ablage der Testbed-Credentials und Audit, welche Validierungsläufe zu welchem Change gehören. Observability korreliert Change-ID, Precheck-/Postcheck-Ergebnis, Diff-Umfang und getroffene Rollback-Entscheidung.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet, ob Invarianten reale Fehlerfälle abdecken, und ob Rollback-Kriterien tatsächlich ausgelöst werden. **Principal** definiert Standard-Invarianten pro Change-Typ und verpflichtende Precheck-/Postcheck-Nutzung vor produktiven Changes. **Chief** entscheidet, für welche Änderungsklassen Validierung Pflichtvoraussetzung für Produktivfreigabe ist.

- [ ] Invarianten pro Change-Typ definiert und mit realen Incidents abgeglichen.
- [ ] Testbed aktuell und aus SoT abgeleitet.
- [ ] Precheck und Postcheck nutzen identische Prüfroutinen.
- [ ] Rollback-Kriterium vor dem Change festgelegt, nicht danach verhandelt.

## Interviewfragen

### 1. Warum reicht „Change wurde angewendet“ nicht als Erfolgsnachweis?

**Antwort:** Die Konfiguration kann akzeptiert sein, während Routing, Nachbarschaften oder Erreichbarkeit trotzdem regressieren; das zeigt erst ein Vergleich definierter Invarianten vor und nach dem Change.

### 2. Was macht Genie-Parsing besser als reinen Textvergleich?

**Antwort:** Strukturierte Daten erlauben gezielten Vergleich relevanter Felder statt brüchigem Zeilenvergleich, der bei kosmetischen Ausgabeänderungen Fehlalarme erzeugt.

### 3. Wie definierst du eine gute Invariante?

**Antwort:** Sie bildet einen konkreten, für den Change relevanten Zustand ab (z. B. Anzahl etablierter BGP-Nachbarschaften), nicht die gesamte Konfiguration unspezifisch.

### 4. Wann sollte ein Rollback-Kriterium feststehen?

**Antwort:** Vor dem Change, nicht während einer laufenden Eskalation, damit die Entscheidung nicht unter Zeitdruck neu verhandelt wird.

### 5. Warum müssen Precheck und Postcheck identisch strukturiert sein?

**Antwort:** Nur ein Vergleich derselben Kommandos und Parser liefert einen validen Diff; unterschiedliche Prüfroutinen erzeugen unvergleichbare Ergebnisse.

### 6. Wie verhinderst du ein veraltetes Testbed?

**Antwort:** Durch Ableitung des Testbeds aus einer aktuellen Source of Truth statt manueller, selten gepflegter Listen.

## Praktische Labs

~~~python
pre = {"bgp_neighbors_up": 4}
post = {"bgp_neighbors_up": 3}
regression = post["bgp_neighbors_up"] < pre["bgp_neighbors_up"]
assert regression
print("A lost BGP neighbor after the change triggers the rollback criterion.")
~~~

## Dependencies, Cross-References und Quellen

1. [pyATS Documentation (Cisco DevNet)](https://developer.cisco.com/docs/pyats/), abgerufen 2026-09-17.
2. [Genie Parser Documentation](https://developer.cisco.com/docs/genie-docs/), abgerufen 2026-09-17.

Zeitabhängige Parser-Coverage und Testbed-Formatversionen vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| CI-integrierte Netzwerkvalidierung vor Merge | adopting | Pipeline-Kopplung, Testbed-Verfügbarkeit und Laufzeit prüfen. |
| Modellbasierte Invarianten (Intent-Vergleich statt reinem Diff) | emerging | Abdeckung gegen bekannte Incidents vor Vertrauen validieren. |
| Automatisierte Rollback-Auslösung bei Invariantenverletzung | emerging | Fehlalarmrisiko und Blast Radius vor Automatisierung testen. |

Ein Pilot akzeptiert automatisierte Netzwerkvalidierung erst, wenn Invarianten-Abdeckung, Testbed-Aktualität, identische Pre-/Postcheck-Routinen und ein belastbares, vorab definiertes Rollback-Kriterium nachgewiesen sind.
