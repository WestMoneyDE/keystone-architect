---
{"id": "KB-0124", "title": "Verfügbarkeit und Abhängigkeitsrechnung", "domain": "05", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0122", "concepts": ["Fehlerdomäne"], "needed_for": "understanding"}], "related": ["KB-0125", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Serielle und redundante Verfügbarkeitsformeln auf ein konkretes Abhängigkeitsdiagramm lokal anwenden.", "rationale": "Kein reales System nötig, um die Rechenmethodik zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für ein System mit mehreren Abhängigkeiten die theoretische Gesamtverfügbarkeit berechnen und gegen das SLO-Ziel prüfen.", "rationale": "Serielle Abhängigkeiten multiplizieren sich, nicht addieren sich, in ihrer Verfügbarkeitsauswirkung."}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, warum ein System mit vier seriellen 99,9%-Abhängigkeiten selbst keine 99,9% erreichen kann.", "rationale": "Ein häufiges Missverständnis bei SLO-Zusagen."}, "CHIEF-TARGET": {"active": true, "scope": "SLO-Zusagen gegen die tatsächliche Abhängigkeitskette rechnerisch validieren, bevor sie vertraglich zugesagt werden.", "rationale": "Unrealistische SLO-Zusagen erzeugen Vertragsrisiken und Reputationsschäden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Korrelierte Ausfälle (gemeinsame Abhängigkeiten) und Markov-Modelle für Verfügbarkeit sind Vertiefung.", "rationale": "Kern ist die serielle/parallele Grundrechnung und das Erkennen unrealistischer Annahmen."}}, "lab_validation": [{"lab_id": "KB-0124-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für serielle und redundante Verfügbarkeitsberechnung", "evidence": "Vier serielle Abhängigkeiten mit je 99,9% Verfügbarkeit ergeben eine theoretische Gesamtverfügbarkeit unter 99,9%, korrekt berechnet als Produkt.", "limitations": "Kein reales System, vereinfachtes Modell ohne korrelierte Ausfälle."}]}
---
# Verfügbarkeit und Abhängigkeitsrechnung

> **Ziel:** Die Verfügbarkeit eines Systems mit mehreren seriellen Abhängigkeiten ist nicht die niedrigste Einzelverfügbarkeit, sondern das Produkt aller beteiligten Verfügbarkeiten — sie sinkt mit jeder zusätzlichen seriellen Abhängigkeit. Redundante (parallele) Komponenten erhöhen dagegen die Verfügbarkeit multiplikativ in die andere Richtung. Diese Rechnung ist die Grundlage jeder realistischen SLO-Zusage.

## Zweck, Mental Model und Dependencies

Wenn ein Request nacheinander (seriell) durch Dienst A, B, C, D muss und jeder eine Verfügbarkeit von 99,9% hat, ist die Gesamtverfügbarkeit 0,999 × 0,999 × 0,999 × 0,999 ≈ 99,6% — deutlich unter 99,9%. Bei redundanten (parallelen) Komponenten, bei denen nur eine von mehreren verfügbar sein muss, steigt die Verfügbarkeit: bei zwei parallelen 99%-Komponenten ist die Wahrscheinlichkeit, dass beide gleichzeitig ausfallen, nur 1% × 1% = 0,01%, also eine effektive Verfügbarkeit von 99,99%. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0122](22-fehlerdomaenen-und-bulkheads.md).

~~~text
serial:    A(99.9%) -> B(99.9%) -> C(99.9%) -> D(99.9%)  =>  0.999^4 ≈ 99.6% (worse than any single link)
parallel:  A(99%) OR B(99%) (redundant, independent)     =>  1-(0.01*0.01) = 99.99% (better than either alone)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Formel | Fehlannahme |
|---|---|---|
| Serielle Kette | Gesamt = Produkt der Einzelverfügbarkeiten | „Gesamtverfügbarkeit = niedrigste Einzelkomponente" ist falsch |
| Redundante Komponenten | Gesamt = 1 − Produkt der Ausfallwahrscheinlichkeiten | nur gültig bei echter statistischer Unabhängigkeit |
| Korrelierte Ausfälle | gemeinsame Abhängigkeit (z. B. dasselbe Netzwerk, dieselbe Region) | Redundanzrechnung überschätzt Verfügbarkeit, wenn Komponenten nicht unabhängig sind |
| Degradierte Antwort | teilweise Funktionsfähigkeit statt binär up/down | reine Verfügbarkeitsrechnung ignoriert Qualitätsabstufungen |

Implementierung: Abhängigkeitsgraph des Systems explizit zeichnen (welche Aufrufe sind seriell zwingend, welche sind redundant/optional), dann die Formeln entsprechend anwenden. Für redundante Komponenten kritisch prüfen, ob echte Unabhängigkeit besteht (unterschiedliche Racks, Netzwerke, Provider) oder eine versteckte gemeinsame Abhängigkeit (dasselbe Rechenzentrum, derselbe DNS-Resolver) die angenommene Unabhängigkeit zunichtemacht. Für nicht-kritische Abhängigkeiten sollte das System degradieren können (Feature abschalten) statt komplett auszufallen, was die effektive Verfügbarkeit der Kernfunktion erhöht.

## Scalability, Reliability, Security und Observability

Diese Rechnung skaliert als Denkwerkzeug unabhängig von Systemgröße, wird aber bei komplexen Graphen (Mischung aus seriell/parallel/bedingt) schnell unübersichtlich und profitiert von automatisierter Modellierung. Reliability-Grenze: die Formel für unabhängige Redundanz überschätzt die reale Verfügbarkeit systematisch, wenn Komponenten tatsächlich korreliert ausfallen (z. B. zwei „redundante" Datenbankinstanzen im selben Rechenzentrum, das einen Stromausfall erlebt).

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| System erreicht SLO trotz „ausreichend guter" Einzelabhängigkeiten nicht | serielle Kette zu lang, Verfügbarkeiten multiplizieren sich | Produktrechnung über alle seriellen Abhängigkeiten aufstellen |
| redundante Komponenten fallen dennoch gemeinsam aus | versteckte gemeinsame Abhängigkeit (Netzwerk, Strom, Region) | gemeinsame Infrastruktur beider „unabhängiger" Komponenten identifizieren |
| SLO-Zusage wurde vertraglich gegeben, aber real nicht erreichbar | SLO wurde ohne Abhängigkeitsrechnung festgelegt | theoretische Maximalverfügbarkeit anhand der Abhängigkeitskette nachrechnen |
| eine nicht-kritische Abhängigkeit legt das ganze System lahm | fehlende Degradationsstrategie, harte serielle Kopplung | prüfen, ob diese Abhängigkeit tatsächlich zwingend seriell sein muss |

Security: eine falsch angenommene Unabhängigkeit redundanter Sicherheitskontrollen (z. B. zwei Firewalls mit derselben Konfigurationsquelle) kann eine angenommene Verteidigungstiefe untergraben. Observability korreliert gemessene reale Verfügbarkeit pro Komponente gegen die theoretisch berechnete Gesamtverfügbarkeit, um Abweichungen (z. B. durch korrelierte Ausfälle) sichtbar zu machen.

## Trade-offs und Entscheidungen

**Staff** rechnet vor jeder SLO-Zusage die theoretische Maximalverfügbarkeit anhand der tatsächlichen Abhängigkeitskette nach, statt sie zu schätzen. **Principal** identifiziert versteckte gemeinsame Abhängigkeiten, die die Unabhängigkeitsannahme redundanter Komponenten untergraben. **Chief** verlangt eine rechnerische Validierung jeder vertraglichen SLO-Zusage gegen die reale Systemarchitektur, bevor sie zugesagt wird.

Anti-Patterns: SLO-Ziele ohne Bezug zur Abhängigkeitskette festlegen; redundante Komponenten als unabhängig annehmen, ohne gemeinsame Infrastruktur zu prüfen; jede Abhängigkeit als zwingend seriell behandeln, ohne Degradationsmöglichkeiten zu prüfen.

## Production Checklist

- [ ] Abhängigkeitsgraph (seriell/parallel) für kritische Nutzerpfade explizit dokumentiert.
- [ ] Theoretische Maximalverfügbarkeit berechnet und gegen SLO-Zusage geprüft.
- [ ] Redundante Komponenten auf echte Unabhängigkeit (keine gemeinsame Infrastruktur) geprüft.
- [ ] Degradationsstrategie für nicht-kritische Abhängigkeiten definiert.

## Interviewfragen

### 1. Warum kann ein System mit vier 99,9%-Abhängigkeiten selbst keine 99,9% erreichen?

**Antwort:** Bei serieller Abhängigkeit multiplizieren sich die Einzelverfügbarkeiten; 0,999 hoch 4 ergibt etwa 99,6%, was unter der Verfügbarkeit jeder Einzelkomponente liegt.

### 2. Wie erhöht Redundanz die Verfügbarkeit?

**Antwort:** Bei echter statistischer Unabhängigkeit ist die Wahrscheinlichkeit, dass alle redundanten Komponenten gleichzeitig ausfallen, das Produkt ihrer einzelnen Ausfallwahrscheinlichkeiten — deutlich kleiner als die Ausfallwahrscheinlichkeit einer einzelnen Komponente.

### 3. Warum ist die Unabhängigkeitsannahme bei Redundanz oft falsch?

**Antwort:** Weil „redundante" Komponenten häufig eine versteckte gemeinsame Abhängigkeit teilen (gleiches Rechenzentrum, gleiches Netzwerk, gleiche Stromversorgung), wodurch sie korreliert statt unabhängig ausfallen.

### 4. Wie validierst du eine SLO-Zusage vor Vertragsabschluss?

**Antwort:** Durch Nachrechnen der theoretischen Maximalverfügbarkeit anhand der tatsächlichen seriellen/parallelen Abhängigkeitskette und Vergleich mit dem zugesagten Wert.

### 5. Was ist eine Degradationsstrategie und warum verbessert sie effektive Verfügbarkeit?

**Antwort:** Statt bei Ausfall einer nicht-kritischen Abhängigkeit komplett auszufallen, schaltet das System nur die betroffene Funktion ab und bleibt im Kern verfügbar — das entkoppelt die Gesamtverfügbarkeit von jeder Einzelabhängigkeit.

### 6. Widersprüchliche Anforderung: Produkt will 99,99% Gesamtverfügbarkeit UND fünf zwingend serielle externe Abhängigkeiten mit je 99,9% — wie gehst du vor?

**Antwort:** Ich würde vorrechnen, dass fünf serielle 99,9%-Abhängigkeiten rechnerisch bei etwa 99,5% liegen, weit unter 99,99%; ich würde vorschlagen, welche Abhängigkeiten tatsächlich zwingend seriell sein müssen und für welche eine Degradationsstrategie oder redundante Alternative die theoretische Obergrenze anheben kann.

## Praktische Labs

~~~python
def serial_availability(components):
    result = 1.0
    for a in components:
        result *= a
    return result

def parallel_availability(components):
    failure = 1.0
    for a in components:
        failure *= (1 - a)
    return 1 - failure

serial = serial_availability([0.999, 0.999, 0.999, 0.999])
parallel = parallel_availability([0.99, 0.99])
assert serial < 0.999
assert parallel > 0.99
print(f"Serial chain: {serial:.4%}, Parallel redundancy: {parallel:.4%}")
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Workbook: [Implementing SLOs](https://sre.google/workbook/implementing-slos/), abgerufen 2026-09-17.

Produktspezifische SLA-Zusagen von Cloud-Anbietern vor eigener SLO-Kalkulation an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Abhängigkeitsgraph-Erkennung aus Tracing-Daten für Verfügbarkeitsmodellierung | Adopting | Vollständigkeit der automatisch erkannten Kette vor Vertrauen in die Berechnung prüfen. |
| Korrelationsbewusste Verfügbarkeitsmodelle (statt naiver Unabhängigkeitsannahme) | Emerging | Datenbasis für Korrelationsschätzung vor Einsatz kritisch bewerten. |

Ein Team akzeptiert eine SLO-Zusage erst, wenn die theoretische Maximalverfügbarkeit anhand der realen Abhängigkeitskette nachgerechnet und gegen die Zusage geprüft wurde.
