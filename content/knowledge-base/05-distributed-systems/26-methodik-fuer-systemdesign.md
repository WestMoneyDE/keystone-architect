---
{"id": "KB-0126", "title": "Methodik für Systemdesign", "domain": "05", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0124", "concepts": ["Verfügbarkeitsrechnung"], "needed_for": "understanding"}, {"id": "KB-0125", "concepts": ["Latenz", "Fan-out"], "needed_for": "understanding"}], "related": ["KB-0127", "KB-0562", "KB-0720"], "applies": ["KB-0127", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Kapazitätsüberschlagsrechnung für ein Beispielsystem selbst durchführen.", "rationale": "Kein reales System nötig, um die Methodik zu üben."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein unklares Systemdesign-Problem Scope, Datenfluss und Lastannahmen schrittweise zu einer begründeten Architekturvariante entwickeln.", "rationale": "Systemdesign ohne strukturierte Methodik führt zu impliziten, ungeprüften Annahmen."}, "STAFF-TARGET": {"active": true, "scope": "Eine unrealistische Kapazitätsannahme in einem Architekturvorschlag durch Überschlagsrechnung widerlegen.", "rationale": "Überschlagsrechnungen sind ein schnelles, wirksames Prüfwerkzeug gegen unbegründete Annahmen."}, "CHIEF-TARGET": {"active": true, "scope": "Eine strukturierte Systemdesign-Methodik als Standard für Architekturentscheidungsdokumente verlangen.", "rationale": "Konsistente Methodik erleichtert Vergleichbarkeit und Review von Architekturvorschlägen organisationsweit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Formale Kapazitätsmodellierung mit Warteschlangentheorie ist Vertiefung.", "rationale": "Kern ist die schrittweise Methodik: Scope, Datenfluss, Lastannahme, Überschlagsrechnung, Schwachstellenprüfung."}}, "lab_validation": [{"lab_id": "KB-0126-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für eine Kapazitätsüberschlagsrechnung", "evidence": "Eine angenommene Schreibrate von 10.000 Ereignissen/Sekunde mit angenommener Ereignisgröße ergibt eine tägliche Speicheranforderung, die gegen eine Plausibilitätsschwelle geprüft wird.", "limitations": "Kein reales System, rein methodische Übung, keine Produktion."}]}
---
# Methodik für Systemdesign

> **Ziel:** Systemdesign ohne strukturierte Methodik erzeugt implizite, ungeprüfte Annahmen über Scope, Last und Datenfluss, die erst spät (oder gar nicht) hinterfragt werden. Eine schrittweise Methodik — Scope klären, Datenfluss skizzieren, Lastannahmen explizit machen, mit Überschlagsrechnungen prüfen, Schwachstellen identifizieren — macht diese Annahmen sichtbar und angreifbar, bevor sie in Code gegossen werden.

## Zweck, Mental Model und Dependencies

Ein Systemdesign-Problem beginnt fast immer unterspezifiziert („baue ein System für X"). Die Methodik behandelt das nicht als Mangel, sondern als ersten Arbeitsschritt: Scope und Annahmen explizit klären (welche Funktionen sind im Scope, welche bewusst nicht), Datenfluss auf hoher Ebene skizzieren (wer schreibt, wer liest, welche Transformationen), Lastannahmen quantifizieren (wie viele Nutzer, welche Anfragerate, welche Datenmenge), diese Annahmen mit einfachen Überschlagsrechnungen (Fermi-Schätzungen) auf Plausibilität prüfen, und erst dann Architekturvarianten mit ihren Trade-offs vergleichen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0124](24-verfuegbarkeit-und-abhaengigkeitsrechnung.md) und [KB-0125](25-latenzverteilungen-und-fan-out.md).

~~~text
1. Scope & Constraints -> 2. Data Flow (high-level) -> 3. Load Assumptions (quantified)
        -> 4. Back-of-envelope check (plausibility) -> 5. Architecture Variants -> 6. Trade-off comparison
~~~

## Core Concepts, Architektur und Implementierung

| Schritt | Frage | Häufiger Fehler |
|---|---|---|
| Scope | was ist explizit im/außerhalb des Umfangs? | unausgesprochene Annahmen über Umfang führen zu Missverständnissen |
| Datenfluss | wer erzeugt, transformiert, konsumiert welche Daten? | zu früh in Implementierungsdetails statt High-Level-Fluss zu springen |
| Lastannahme | wie viele Nutzer/Anfragen/Daten, mit welcher Quelle für diese Zahl? | Zahlen raten statt aus Anforderung oder Vergleichssystem ableiten |
| Überschlagsrechnung | ist die Annahme grob plausibel (Größenordnung)? | Annahmen unbestätigt übernehmen, die bei grober Rechnung offensichtlich unrealistisch wären |
| Architekturvarianten | mindestens zwei begründete Alternativen verglichen? | direkt eine einzige Lösung vorschlagen, ohne Alternativen zu erwägen |

Implementierung: jede Lastannahme sollte eine explizite Quelle haben (Anforderung, Vergleichssystem, konservative Schätzung) und mit einer Überschlagsrechnung auf Größenordnung geprüft werden — z. B. „10.000 Schreibvorgänge/Sekunde × 1 KB × 86.400 Sekunden/Tag ≈ 864 GB/Tag" zeigt sofort, ob eine Speicherannahme plausibel ist. Architekturvarianten sollten mindestens zwei begründete Alternativen enthalten, nicht nur eine vorgefasste Lösung nachträglich gerechtfertigt.

## Scalability, Reliability, Security und Observability

Diese Methodik selbst skaliert nicht technisch, sondern als Denkprozess — sie verhindert, dass Skalierungs-, Zuverlässigkeits- und Sicherheitsentscheidungen auf ungeprüften Annahmen basieren. Reliability-Grenze der Methodik: Überschlagsrechnungen zeigen Größenordnungsfehler (Faktor 10 oder mehr), nicht präzise Werte — sie ersetzen keine echte Lasttest-Messung, sondern filtern grob unrealistische Annahmen früh aus.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Architekturvorschlag scheitert später an unrealistischer Lastannahme | keine Überschlagsrechnung zu Beginn durchgeführt | Kernannahmen nachträglich mit einfacher Rechnung auf Plausibilität prüfen |
| Design-Review dauert sehr lange wegen unklarem Scope | Scope nicht zu Beginn explizit festgelegt | prüfen, ob eine schriftliche Scope-Abgrenzung existierte |
| nur eine Architekturvariante wurde je erwogen | Methodik übersprang den Alternativenvergleich | mindestens eine plausible Alternative nachträglich durchdenken |
| Datenfluss-Diagramm fehlt oder ist unvollständig | direkter Sprung zu Implementierungsdetails | High-Level-Datenfluss nachträglich rekonstruieren und Lücken identifizieren |

Security: Scope-Klärung sollte explizit einschließen, welche Daten sensibel sind und welche Vertrauensgrenzen im Datenfluss existieren — das gehört in den Systemdesign-Prozess, nicht als nachträgliche Ergänzung. Observability: die Methodik selbst erzeugt kein Monitoring, aber die im Design identifizierten Lastannahmen sollten später gegen reale Metriken validiert werden.

## Trade-offs und Entscheidungen

**Staff** wendet die Methodik konsequent auch unter Zeitdruck an, mindestens in verkürzter Form (Scope, grobe Last, eine Alternative). **Principal** verlangt für Architekturentscheidungsdokumente eine dokumentierte Lastannahme mit Quelle und Überschlagsrechnung. **Chief** etabliert die Methodik als Standardformat für Architekturvorschläge, um Vergleichbarkeit und Reviewbarkeit über Teams hinweg zu sichern.

Anti-Patterns: direkt mit einer Implementierungslösung beginnen, ohne Scope/Last zu klären; Lastannahmen ohne Quelle oder Plausibilitätsprüfung übernehmen; nur eine Architekturvariante erwägen und sie nachträglich rechtfertigen statt sie gegen Alternativen zu vergleichen.

## Production Checklist

- [ ] Scope explizit dokumentiert (im/außerhalb des Umfangs).
- [ ] Lastannahmen mit Quelle und Überschlagsrechnung auf Plausibilität geprüft.
- [ ] Mindestens zwei Architekturvarianten mit Trade-offs verglichen.
- [ ] Datenfluss auf High-Level-Ebene dokumentiert, inklusive Vertrauensgrenzen.

## Interviewfragen

### 1. Warum beginnt Systemdesign mit Scope-Klärung statt mit einer Lösung?

**Antwort:** Weil unausgesprochene Annahmen über den Umfang zu Missverständnissen und später zu Fehlentscheidungen führen; explizite Scope-Klärung macht diese Annahmen sichtbar und verhandelbar.

### 2. Was ist eine Überschlagsrechnung und wozu dient sie?

**Antwort:** Eine grobe Rechnung (Größenordnung, nicht Präzision), die eine Lastannahme auf offensichtliche Unrealistik prüft, bevor darauf aufbauend eine Architektur entworfen wird.

### 3. Warum sollten mindestens zwei Architekturvarianten verglichen werden?

**Antwort:** Eine einzige, vorgefasste Lösung wird selten kritisch hinterfragt; der Vergleich mit einer Alternative macht die tatsächlichen Trade-offs und die Begründung für die gewählte Lösung explizit.

### 4. Woher nimmst du eine Lastannahme, wenn keine konkreten Zahlen vorliegen?

**Antwort:** Aus Vergleichssystemen ähnlicher Größenordnung, aus expliziten Anforderungen des Auftraggebers, oder aus einer konservativen, klar als Annahme gekennzeichneten Schätzung.

### 5. Was zeigt dir eine Überschlagsrechnung, die eine echte Messung nicht ersetzt?

**Antwort:** Grobe Größenordnungsfehler (z. B. Faktor 10 oder mehr), die eine Annahme offensichtlich unrealistisch machen — sie liefert keine präzisen Werte, aber einen schnellen Plausibilitätsfilter.

### 6. Widersprüchliche Anforderung: Stakeholder will sofort eine fertige Architekturlösung UND eine gründliche methodische Herleitung — wie gehst du vor?

**Antwort:** Ich würde eine verkürzte, aber vollständige Methodik-Durchführung anbieten (Scope in wenigen Sätzen, grobe Lastannahme mit einer Überschlagsrechnung, eine kurz begründete Hauptlösung mit einer genannten Alternative), statt die Methodik ganz zu überspringen oder stundenlang zu vertiefen.

## Praktische Labs

~~~python
writes_per_second = 10_000
bytes_per_event = 1_000
seconds_per_day = 86_400

daily_bytes = writes_per_second * bytes_per_event * seconds_per_day
daily_gb = daily_bytes / (1024 ** 3)
assert 700 < daily_gb < 900  # plausibility check on the order of magnitude
print(f"Assumed load implies ~{daily_gb:.0f} GB/day - checked against a plausible storage budget.")
~~~

## Dependencies, Cross-References und Quellen

1. Xu, Tune, et al.: [System Design Interview methodology overview](https://github.com/donnemartin/system-design-primer), community-maintained reference, abgerufen 2026-09-17 (als praxisnahe methodische Referenz, nicht als normative Quelle).

Diese Methodik ist zeitstabil; konkrete Kapazitätszahlen und Systembeispiele sollten dennoch gegen aktuelle Referenzsysteme geprüft werden.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte Unterstützung bei Systemdesign-Skizzen und Lastannahmen | Emerging | Vorschläge immer gegen eigene Überschlagsrechnung und Quellenprüfung validieren, nie ungeprüft übernehmen. |

Diese Methodik selbst ist ein etabliertes, stabiles Denkwerkzeug ohne wesentlichen Neuheitsbedarf; die Bonus-Bewertung betrifft hier primär, wie neue Tools den Prozess unterstützen können, ohne die Prüfschritte (Überschlagsrechnung, Alternativenvergleich) zu ersetzen.
