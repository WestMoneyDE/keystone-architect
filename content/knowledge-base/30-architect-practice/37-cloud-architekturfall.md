---
{"id": "KB-0713", "title": "Cloud-Architekturfall", "domain": "30", "sequence": 37, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0441", "concepts": ["Landing Zones"], "needed_for": "Dieser Fall wendet die in Domain 18 etablierten Landing-Zone-Konzepte auf ein konkretes, hybrides Szenario an"}, {"id": "KB-0685", "concepts": ["Trade-off-Narrative"], "needed_for": "Die Providerwahl wird mit derselben, fairen Trade-off-Struktur wie in KB-0685 beschrieben begründet"}], "related": ["KB-0706"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für das gegebene, hybride Unternehmensszenario eine konkrete Landing-Zone-, Identity- und Recovery-Architektur mit expliziten Annahmen entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für den Cloud-Architekturfall mehrere Provider- und Recovery-Optionen mit fairer Trade-off-Darstellung gegeneinander abwägen und begründen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Cloud-Architekturentscheidung eine kritische Dimension (Identity, Recovery, Betriebsübergabe) unadressiert lässt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine vollständige, hybride Cloud-Architekturentscheidung mit Providerwahl, Kostenbegründung und Betriebsübergabe treffen und vor Entscheidern begründen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Landing-Zone-Implementierung eines konkreten Anbieters im Detail ist Vertiefung.", "rationale": "Kern ist die konzeptionelle Fallbearbeitung mit expliziten Annahmen, nicht die produktspezifische Implementierungsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0713-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur vollständigen Bearbeitung eines hybriden Cloud-Architekturfalls, keine reale Organisation involviert", "evidence": "Ein vollständig durchgearbeitetes Fallbeispiel zeigt, wie Landing Zone, Identity, Recovery, Providerwahl, Kosten und Betriebsübergabe mit expliziten, klar als Annahmen gekennzeichneten Randbedingungen zu einer kohärenten Architekturentscheidung zusammengeführt werden.", "limitations": "Vollständig fiktives Fallbeispiel; alle Zahlen, Lasten und Randbedingungen sind Beispielannahmen, keine realen Projektergebnisse."}]}
---
# Cloud-Architekturfall

> **Ziel:** Dieses Kapitel ist ein vollständiger, durchgearbeiteter Übungsfall: Ein fiktives, mittelständisches Unternehmen benötigt eine hybride (teils Cloud, teils On-Premises) Architektur für eine geschäftskritische Unternehmensanwendung. Der Fall verbindet **Landing Zone** (siehe Domain 18), **Identity** (siehe Domain 23), **Recovery** (siehe die in Domain 24 behandelten RTO/RPO-Prinzipien) sowie **Providerwahl**, **Kosten** und **Betriebsübergabe** zu einer kohärenten Architekturentscheidung. Der zentrale Punkt dieses Kapitels ist, dass jede Annahme (Lastprofil, Budget, Teamgröße) explizit als Beispielannahme gekennzeichnet ist, nicht als reales Projektergebnis — dies demonstriert die tatsächliche Denkweise und Struktur einer solchen Entscheidung, ohne eine tatsächlich nicht vorhandene, praktische Projekterfahrung zu suggerieren.

## Fallbeschreibung und explizite Annahmen

**Hinweis:** Alle folgenden Annahmen sind explizit als Beispielannahmen gekennzeichnet, keine realen Projektdaten.

Das fiktive Unternehmen "Beispiel GmbH" betreibt eine geschäftskritische Bestellabwicklungsanwendung (angelehnt an die in Domain 29 behandelten Commerce-Prinzipien) mit angenommenen 50.000 täglichen Bestellungen, einem angenommenen Jahresbudget von 400.000 Euro für die Cloud-Infrastruktur und einem angenommenen Betriebsteam von 6 Personen. Aus regulatorischen Gründen (angenommen: branchenspezifische Datenresidenzanforderung) müssen bestimmte Kundendaten tatsächlich innerhalb der EU verbleiben, während die Rechenlast tatsächlich flexibel auf mehrere Regionen verteilt werden kann.

## Landing Zone

Die Landing Zone wird mit einer klaren Trennung zwischen Produktions-, Staging- und Entwicklungsumgebungen entworfen, entsprechend den in Domain 18 etablierten Prinzipien — jede Umgebung erhält ein eigenes Konto/Subscription mit expliziten Grenzen, um versehentliche Produktionsauswirkungen durch Entwicklungsaktivitäten strukturell zu verhindern. Netzwerksegmentierung trennt die Bestellabwicklungskomponente von administrativen Systemen, entsprechend dem in Domain 28 (IoT Security) etablierten Segmentierungsprinzip, hier auf eine klassische Enterprise-Anwendung übertragen.

## Identity

Identity wird zentral über einen einzigen Identity Provider verwaltet, mit föderiertem Zugriff für Mitarbeiter (Single Sign-On) und separaten, gerätegebundenen Credentials für Service-zu-Service-Kommunikation, entsprechend dem in KB-0655 beschriebenen Prinzip individueller, gerätegebundener Identität. Rollenbasierte Zugriffskontrolle folgt dem Prinzip minimaler, tatsächlich benötigter Berechtigungen, mit besonders strenger Kontrolle für Schreibzugriffe auf Zahlungsdaten.

## Recovery

Für die Bestellabwicklungsanwendung wird ein RTO (Recovery Time Objective) von angenommen 4 Stunden und ein RPO (Recovery Point Objective) von angenommen 15 Minuten festgelegt, basierend auf einer angenommenen, geschätzten Ausfallkostenschätzung von 5.000 Euro pro Stunde. Diese Ziele bestimmen die Wahl einer Multi-AZ-Architektur mit regelmäßiger, automatisierter Datenreplikation, statt einer reinen Backup-Strategie mit längerer Wiederherstellungszeit.

## Providerwahl (Trade-off-Narrativ)

Zwei Optionen wurden tatsächlich erwogen: Option A (ein einzelner, großer Cloud-Anbieter für die gesamte Infrastruktur) und Option B (ein primärer Anbieter mit einem zweiten Anbieter für die EU-Datenresidenzanforderung). Option A bietet geringere operative Komplexität, aber tatsächlich höheres Konzentrationsrisiko bei einem anbieterweiten Ausfall. Option B verteilt das Risiko, erfordert aber tatsächlich zusätzliche Integrationskomplexität. Basierend auf der angenommenen, begrenzten Teamgröße (6 Personen) wurde tatsächlich Option A gewählt, mit der expliziten Begründung, dass die operative Komplexität von Option B die tatsächliche Kapazität des Teams übersteigen würde — dies folgt direkt dem in KB-0696 beschriebenen Teamlast-Prinzip.

## Kosten

Die Kostenschätzung folgt der in KB-0646 beschriebenen TCO-Modellierung: angenommene, monatliche Grundkosten von 25.000 Euro für Compute und Storage, zuzüglich einer angenommenen, lastabhängigen Komponente, die bei Spitzenlast (angenommen: Weihnachtsgeschäft) auf das 3-fache ansteigt. Die Sensitivität dieser Schätzung (siehe KB-0648) wird explizit gegen ein optimistisches (2-fache Spitzenlast) und pessimistisches (4-fache Spitzenlast) Szenario geprüft, statt eine einzelne, scheinbar präzise Zahl zu präsentieren.

## Betriebsübergabe

Die Betriebsübergabe an das interne Team erfolgt gemäß den in KB-0706 beschriebenen Prinzipien: Die Bestellabwicklungskomponente wird als Produktverantwortung dem Bestellungs-Team zugeordnet, während die zugrunde liegende Cloud-Infrastruktur als zentrale Plattformverantwortung geführt wird, mit einem angenommenen Chargeback-Modell zur Kostenzuordnung.

~~~text
FALL-STRUKTUR (Zusammenfassung):
  LANDING ZONE: getrennte Umgebungen + Netzwerksegmentierung
  IDENTITY: zentraler IdP, föderierter SSO-Zugriff, gerätegebundene Service-Identität
  RECOVERY: RTO 4h / RPO 15min, Multi-AZ-Replikation basierend auf Ausfallkostenschätzung
  PROVIDERWAHL: Option A gewählt wegen Teamkapazität, Option B als dokumentierte
    Alternative mit expliziten Vor-/Nachteilen
  KOSTEN: TCO mit expliziter Sensitivitätsspanne statt Einzelzahl
  BETRIEBSÜBERGABE: föderierte Produkt-/Plattform-Verantwortung mit Chargeback
Jede Annahme (Last, Budget, Teamgröße, Ausfallkosten) ist EXPLIZIT als Beispielannahme
  markiert, keine reale Projektangabe.
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Explizit gekennzeichnete Beispielannahmen | trennt Übungsfall von realer Projekterfahrung | folgt Artikelvertrag Abschnitt 4 |
| Landing Zone mit Umgebungstrennung | verhindert versehentliche Produktionsauswirkung | Grundlage jeder Cloud-Architekturentscheidung |
| RTO/RPO-basierte Recovery-Architektur | leitet technische Wahl aus Ausfallkostenschätzung ab | verbindet Betriebsrisiko mit Architekturentscheidung |
| Trade-off-Narrativ für Providerwahl | begründet Wahl gegen tatsächliche Teamkapazität | fair dargestellte Alternative statt einseitiger Empfehlung |
| TCO mit Sensitivitätsspanne | vermeidet Scheingenauigkeit bei Kostenschätzung | folgt KB-0648/KB-0705-Prinzip |

## Scalability, Reliability, Security und Observability

Der Fall skaliert über die angenommene Lastspitze im Weihnachtsgeschäft; die Reliability-Grenze liegt in der gewählten RTO/RPO-Zielsetzung, die explizit gegen die geschätzten Ausfallkosten begründet ist, statt willkürlich gesetzt zu sein.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die tatsächliche Ausfallzeit überschreitet das festgelegte RTO | die Multi-AZ-Architektur oder Failover-Automatisierung war unzureichend getestet | einen Failover-Probelauf gemäß KB-0695 durchführen, um die tatsächliche RTO-Einhaltung zu verifizieren |
| die tatsächlichen Kosten übersteigen die Sensitivitätsspanne deutlich | die Lastannahme für die Spitzenzeit war zu niedrig geschätzt | die Lastannahme anhand tatsächlich gemessener, historischer Daten neu kalibrieren |
| die Betriebsübergabe führt zu unklaren Zuständigkeiten | Produkt- und Plattformverantwortung wurden nicht klar genug getrennt | die Verantwortungsgrenze gemäß KB-0706 explizit nachschärfen |

## Trade-offs und Entscheidungen

Dieser Fall demonstriert auf **Staff**-Ebene die korrekte technische Umsetzung einzelner Komponenten (etwa Multi-AZ-Konfiguration). Auf **Principal**-Ebene demonstriert er die Verbindung von Landing Zone, Identity, Recovery und Providerwahl zu einem kohärenten Gesamtentwurf. Auf **Chief**-Ebene demonstriert er die wirtschaftliche und organisatorische Einbettung (Kosten, Betriebsübergabe) der technischen Entscheidung.

## Production Checklist

- [ ] Landing Zone trennt Produktions-, Staging- und Entwicklungsumgebungen explizit.
- [ ] Identity nutzt zentrale Verwaltung mit gerätegebundenen Service-Credentials.
- [ ] RTO/RPO sind explizit gegen eine Ausfallkostenschätzung begründet.
- [ ] Die Providerwahl ist als faires Trade-off-Narrativ mit dokumentierter Alternative dargestellt.
- [ ] Die Kostenschätzung enthält eine explizite Sensitivitätsspanne statt einer Einzelzahl.
- [ ] Die Betriebsübergabe klärt Produkt- und Plattformverantwortung explizit.

## Interviewfragen

### 1. Warum wurde in diesem Fall Option A (ein einzelner Cloud-Anbieter) statt Option B (Multi-Provider) gewählt?

**Antwort:** Weil die angenommene, begrenzte Teamkapazität (6 Personen) die zusätzliche operative Komplexität von Option B tatsächlich überstiegen hätte, entsprechend dem Teamlast-Prinzip.

### 2. Wie wurde das RTO/RPO-Ziel für die Bestellabwicklungsanwendung begründet?

**Antwort:** Anhand einer geschätzten Ausfallkostenschätzung von 5.000 Euro pro Stunde, die eine Multi-AZ-Architektur mit automatisierter Replikation rechtfertigt.

### 3. Warum wird die Kostenschätzung mit einer Sensitivitätsspanne statt einer Einzelzahl dargestellt?

**Antwort:** Um eine unbegründete Scheingenauigkeit zu vermeiden und die tatsächliche Unsicherheit der Lastannahme transparent zu machen.

### 4. Wie wird die Betriebsübergabe zwischen Produkt- und Plattformverantwortung strukturiert?

**Antwort:** Die Bestellabwicklungskomponente wird als Produktverantwortung dem Bestellungs-Team zugeordnet, während die zugrunde liegende Cloud-Infrastruktur als zentrale Plattformverantwortung mit Chargeback-Finanzierung geführt wird.

### 5. Wie würdest du vorgehen, wenn sich die tatsächlichen Kosten deutlich außerhalb der angenommenen Sensitivitätsspanne bewegen?

**Antwort:** Ich würde die zugrunde liegende Lastannahme anhand tatsächlich gemessener, historischer Daten neu kalibrieren und die Sensitivitätsspanne entsprechend aktualisieren.

### 6. Widersprüchliche Anforderung: Die Geschäftsführung will minimale Kosten UND maximale Ausfallsicherheit für die Bestellabwicklungsanwendung — wie würdest du diesen Fall lösen?

**Antwort:** Ich würde das RTO/RPO-Ziel explizit gegen die geschätzten Ausfallkosten begründen, sodass die Investition in Ausfallsicherheit nachvollziehbar proportional zum tatsächlichen Risiko bleibt, statt entweder unbegründet zu sparen oder unbegründet zu überinvestieren.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Lab ist Teil des im Kapitel beschriebenen, vollständig fiktiven Übungsfalls, keine reale Projekterfahrung.

~~~python
# Local, deterministic illustration of the cost sensitivity model for this fictional case (fictional lab example, no real project):

def estimate_annual_cost(base_monthly, peak_multiplier_scenarios):
    return {scenario: base_monthly * 12 + base_monthly * (mult - 1) * 1 for scenario, mult in peak_multiplier_scenarios.items()}

scenarios = {"optimistic": 2, "expected": 3, "pessimistic": 4}
print(estimate_annual_cost(base_monthly=25000, peak_multiplier_scenarios=scenarios))
~~~

Erwartete Beobachtung: Die Kostenschätzung zeigt eine Spanne von optimistisch bis pessimistisch statt einer einzelnen Zahl. Auswertung: Diese Spanne ermöglicht eine realistische Budgetplanung, die die tatsächliche Unsicherheit der Lastannahme transparent berücksichtigt.

## Dependencies, Cross-References und Quellen

1. Amazon Web Services: [AWS Well-Architected Framework — Landing Zone and Multi-Account Strategy](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html), abgerufen 2026-09-18.
2. Microsoft: [Azure Landing Zones — Enterprise-Scale Architecture](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/), abgerufen 2026-09-18.

Dieses Kapitel ist ein vollständiger Übungsfall, der die in Domain 18 (Cloud Foundations), Domain 23 (Security/Identity), Domain 24 (Observability/SRE), KB-0685 (Trade-off-Narrative), KB-0646/KB-0648 (TCO/Sensitivität) und KB-0706 (Operating Models) beschriebenen Prinzipien zusammenführt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Landing-Zone-Compliance-Prüfung (Policy as Code) zur Reduzierung manueller Konfigurationsfehler | Growing Adoption | Bei künftigen, ähnlichen Fällen evaluieren, jedoch die grundlegende Landing-Zone-Struktur unabhängig vom gewählten Automatisierungswerkzeug zuerst konzeptionell festlegen. |

Ein Team akzeptiert diesen Cloud-Architekturfall als vollständig bearbeitet, wenn Landing Zone, Identity, Recovery, Providerwahl, Kosten und Betriebsübergabe nachweislich mit expliziten, klar gekennzeichneten Annahmen kohärent zusammengeführt sind.
