---
{"id": "KB-0694", "title": "Modernisierungsprogramme leiten", "domain": "30", "sequence": 18, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0615", "concepts": ["Modernisierungsportfolio"], "needed_for": "Dieses Kapitel konkretisiert die in KB-0615 beschriebene Portfolioplanung auf die praktische Leitung eines einzelnen Modernisierungsprogramms"}, {"id": "KB-0687", "concepts": ["Evidenzpunkte"], "needed_for": "Programmabschnitte nutzen dieselben Evidenzpunkt-Prinzipien wie die in KB-0687 beschriebene Roadmap-Steuerung"}], "related": ["KB-0693"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für eine gegebene technische Ablösung Geschäftsfähigkeiten und Teamkapazität verbinden und daraus überprüfbare Programmabschnitte mit definierten Zwischenzuständen strukturieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein komplexes Modernisierungsprogramm mehrere Programmabschnitte mit Risiken und expliziten Stilllegungskriterien für die Altsysteme entwerfen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Modernisierungsprogramm ohne definierte Zwischenzustände geplant wird, sodass ein Team über lange Zeit zwei parallele Systeme ohne klaren Übergabezeitpunkt betreiben muss.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ein unternehmensweites Modernisierungsprogramm mit überprüfbaren Programmabschnitten, Risikomanagement und expliziter Altsystem-Stilllegung leiten und verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Migrationsmuster-Implementierung (etwa Strangler Fig Pattern) im Detail ist Vertiefung und wird als etabliert referenziert.", "rationale": "Kern ist die programmatische Strukturierung mit Zwischenzuständen und Stilllegung, nicht die technische Detailimplementierung einzelner Migrationsmuster."}}, "lab_validation": [{"lab_id": "KB-0694-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung überprüfbarer Programmabschnitte mit Stilllegungskriterium, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Modernisierungsprogramm mit definierten Zwischenzuständen und einem expliziten Stilllegungskriterium das Altsystem tatsächlich zu einem nachvollziehbaren Zeitpunkt abschaltet, statt es unbegrenzt parallel weiterzubetreiben.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Modernisierungsprogramme leiten

> **Ziel:** Ein Modernisierungsprogramm setzt eine technische Ablösung (etwa die Ersetzung eines Legacy-Systems) tatsächlich in überprüfbare **Programmabschnitte** um, wobei jeder Abschnitt Geschäftsfähigkeiten (welche fachliche Funktion tatsächlich weiterhin verfügbar sein muss) mit tatsächlicher Teamkapazität verbindet. Dieses Kapitel konkretisiert die in KB-0615 beschriebene Modernisierungsportfolio-Planung auf die praktische Programmleitung. Der zentrale Punkt dieses Kapitels ist, dass explizite **Zwischenzustände** (definierte, stabile Konfigurationen, in denen sowohl Alt- als auch Neusystem tatsächlich parallel funktionieren) und eine explizite **Stilllegung** (der tatsächliche, geplante Zeitpunkt, an dem das Altsystem tatsächlich abgeschaltet wird) geplant werden müssen — ein Modernisierungsprogramm ohne diese Struktur riskiert tatsächlich, in einem dauerhaften, nie abgeschlossenen Parallelbetrieb zu verharren, bei dem beide Systeme tatsächlich gewartet werden müssen, was die eigentlich angestrebte Vereinfachung tatsächlich nie erreicht.

## Zweck, Mental Model und Dependencies

Technische Ablösung mit Geschäftsfähigkeiten zu verbinden bedeutet, tatsächlich zu verstehen, welche fachliche Funktion das Altsystem tatsächlich erfüllt, bevor die Modernisierung geplant wird — eine rein technisch getriebene Modernisierung, die die Geschäftsfähigkeiten nicht tatsächlich vollständig kennt, riskiert tatsächlich, eine fachliche Funktion bei der Ablösung zu übersehen, die im Altsystem implizit, aber tatsächlich wichtig war. Teamkapazität zu berücksichtigen bedeutet, tatsächlich ehrlich einzuschätzen, wie viel Kapazität ein Team tatsächlich parallel zur laufenden Weiterentwicklung für die Modernisierung aufbringen kann — ein Programm, das Teamkapazität überschätzt, verzögert sich tatsächlich, während laufende, fachliche Anforderungen unbearbeitet bleiben oder die Modernisierung selbst tatsächlich ins Stocken gerät. Zwischenzustände explizit zu definieren bedeutet, tatsächlich stabile, überprüfbare Konfigurationen festzulegen, in denen sowohl Alt- als auch Neusystem tatsächlich parallel funktionieren, mit einer klaren Definition, welcher Teil der Funktionalität zu diesem Zeitpunkt tatsächlich bereits im Neusystem liegt — diese Zwischenzustände entsprechen strukturell den in KB-0687 beschriebenen Evidenzpunkten, hier jedoch angewendet auf den fortschreitenden Übergang zwischen zwei Systemen statt auf eine reine Zeitplanung. Risiken pro Programmabschnitt zu benennen bedeutet, tatsächlich für jeden Zwischenzustand explizit zu dokumentieren, was tatsächlich schiefgehen könnte (etwa Datenverlust bei der Migration eines bestimmten Datenbereichs) und wie dieses Risiko tatsächlich adressiert wird. Stilllegung explizit zu planen bedeutet, tatsächlich einen konkreten, überprüfbaren Zeitpunkt und ein Kriterium festzulegen, an dem das Altsystem tatsächlich abgeschaltet wird — ohne dieses explizite Stilllegungskriterium besteht tatsächlich die Gefahr, dass ein Altsystem aus Vorsicht ("man weiß ja nie") unbegrenzt parallel weiterbetrieben wird, obwohl die tatsächliche fachliche Funktionalität bereits vollständig im Neusystem liegt — dieser dauerhafte Parallelbetrieb bindet tatsächlich Wartungsressourcen, ohne den eigentlichen Modernisierungsnutzen (Vereinfachung, reduzierte technische Schuld) tatsächlich zu realisieren.

~~~text
Modernization Program ACTUALLY translates a technical replacement (legacy system
  replacement) into checkable PROGRAM SEGMENTS, every segment connecting business
  capabilities (which business function must ACTUALLY remain available) w/ ACTUAL team
  capacity -- this chapter concretizes KB-0615's modernization portfolio planning onto
  practical program leadership
KEY POINT: explicit INTERMEDIATE STATES (defined, stable configurations where old+new
  system ACTUALLY function in parallel) + explicit DECOMMISSIONING (ACTUAL, planned
  point in time when old system ACTUALLY gets shut down) must be planned -- program w/o
  this structure ACTUALLY risks getting stuck in permanent, never-completed parallel
  operation, where both systems ACTUALLY must be maintained, never ACTUALLY achieving
  intended simplification
CONNECTING TECHNICAL REPLACEMENT + BUSINESS CAPABILITIES means ACTUALLY understanding
  what business function old system ACTUALLY fulfills before modernization planned --
  purely technically-driven modernization not ACTUALLY fully knowing business
  capabilities ACTUALLY risks overlooking a business function implicit but ACTUALLY
  important in old system during replacement
CONSIDERING TEAM CAPACITY means ACTUALLY honestly assessing how much capacity a team can
  ACTUALLY bring to modernization parallel to ongoing development -- program
  overestimating team capacity ACTUALLY delays, while ongoing business requirements go
  unaddressed or modernization itself ACTUALLY stalls
EXPLICITLY DEFINING INTERMEDIATE STATES means ACTUALLY fixing stable, checkable
  configurations where old+new system ACTUALLY function in parallel, w/ clear definition
  of which functionality part ACTUALLY already resides in new system at that point --
  these intermediate states structurally correspond to KB-0687's evidence points, here
  applied to progressive transition between two systems instead of pure time scheduling
NAMING RISKS PER PROGRAM SEGMENT means ACTUALLY explicitly documenting, for every
  intermediate state, what could ACTUALLY go wrong (data loss migrating a specific data
  area) + how this risk is ACTUALLY addressed
EXPLICITLY PLANNING DECOMMISSIONING means ACTUALLY fixing a concrete, checkable point in
  time + criterion at which old system ACTUALLY gets shut down -- w/o this explicit
  decommissioning criterion, ACTUAL danger old system ACTUALLY kept running in parallel
  indefinitely out of caution ("just in case"), although ACTUAL business functionality
  already fully resides in new system -- this permanent parallel operation ACTUALLY
  binds maintenance resources w/o ACTUALLY realizing actual modernization benefit
  (simplification, reduced technical debt)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Geschäftsfähigkeits-Vollständigkeitsprüfung | erfasst implizite, aber wichtige Altsystemfunktionen | verhindert Übersehen fachlicher Funktionen bei Ablösung |
| Ehrliche Teamkapazitätseinschätzung | balanciert Modernisierung gegen laufende Anforderungen | verhindert Überschätzung und resultierende Verzögerung |
| Explizite, überprüfbare Zwischenzustände | definiert stabile Parallelbetrieb-Konfigurationen | entspricht Evidenzpunkt-Prinzip auf System-Übergang angewendet |
| Dokumentierte Risiken je Programmabschnitt | benennt konkrete Gefahren pro Zwischenzustand | ermöglicht gezielte Risikoadressierung |
| Explizites Stilllegungskriterium | konkreter Abschaltzeitpunkt für Altsystem | verhindert dauerhaften, ressourcenbindenden Parallelbetrieb |

Implementierung: Vor Programmbeginn werden die tatsächlichen Geschäftsfähigkeiten des Altsystems vollständig erfasst. Das Programm wird in überprüfbare Zwischenzustände mit dokumentierten Risiken unterteilt. Ein explizites, konkretes Stilllegungskriterium für das Altsystem wird vorab festgelegt.

## Scalability, Reliability, Security und Observability

Eine Modernisierungsprogramm-Praxis skaliert über die Anzahl der zu migrierenden Geschäftsfähigkeiten; die Reliability-Grenze liegt darin, dass ein Programm ohne explizites Stilllegungskriterium tatsächlich in einem dauerhaften, ressourcenbindenden Parallelbetrieb verharrt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Modernisierungsprogramm bleibt über Jahre im Parallelbetrieb, ohne das Altsystem tatsächlich abzuschalten | kein explizites Stilllegungskriterium wurde vorab definiert | ein konkretes, überprüfbares Stilllegungskriterium nachträglich festlegen und verfolgen |
| nach der Migration fehlt eine fachliche Funktion, die im Altsystem implizit vorhanden war | die Geschäftsfähigkeiten des Altsystems wurden vor der Modernisierung nicht vollständig erfasst | eine nachträgliche, vollständige Geschäftsfähigkeitserfassung des Altsystems durchführen |
| ein Modernisierungsprogramm verzögert sich erheblich, während laufende Anforderungen liegenbleiben | die Teamkapazität für die Modernisierung wurde überschätzt | die Programmplanung um eine ehrlichere, realistischere Teamkapazitätseinschätzung anpassen |

Security: Bei der Migration sicherheitsrelevanter Daten sollten Zwischenzustände explizit auf konsistente Zugriffskontrolle zwischen Alt- und Neusystem geprüft werden. Observability: Die tatsächliche Dauer eines Parallelbetriebs im Vergleich zum ursprünglich geplanten Stilllegungszeitpunkt ist ein zentrales Signal zur Bewertung der Programmsteuerung.

## Trade-offs und Entscheidungen

**Staff** setzt einen begrenzten Programmabschnitt mit definiertem Zwischenzustand um. **Principal** entwirft das vollständige Modernisierungsprogramm mit Zwischenzuständen, Risiken und Stilllegungskriterium. **Chief** leitet und verantwortet das unternehmensweite Modernisierungsprogramm mit Portfoliobezug (siehe KB-0615).

Anti-Patterns: ein Modernisierungsprogramm ohne explizite Zwischenzustände planen; die Teamkapazität für die Modernisierung überschätzen; kein explizites Stilllegungskriterium für das Altsystem festlegen, sodass der Parallelbetrieb unbegrenzt fortbesteht.

## Production Checklist

- [ ] Die Geschäftsfähigkeiten des Altsystems sind vollständig erfasst.
- [ ] Die Teamkapazität für die Modernisierung ist ehrlich eingeschätzt.
- [ ] Explizite, überprüfbare Zwischenzustände mit dokumentierten Risiken sind definiert.
- [ ] Ein konkretes, überprüfbares Stilllegungskriterium für das Altsystem existiert.

## Interviewfragen

### 1. Warum müssen die Geschäftsfähigkeiten eines Altsystems vor der Modernisierung vollständig erfasst werden?

**Antwort:** Weil eine rein technisch getriebene Modernisierung sonst riskiert, eine fachliche Funktion zu übersehen, die im Altsystem implizit, aber tatsächlich wichtig war.

### 2. Warum sind explizite Zwischenzustände in einem Modernisierungsprogramm wichtig?

**Antwort:** Weil sie stabile, überprüfbare Konfigurationen definieren, in denen Alt- und Neusystem tatsächlich parallel funktionieren, und damit den Übergang nachvollziehbar strukturieren, statt ihn implizit unklar zu lassen.

### 3. Was passiert, wenn kein explizites Stilllegungskriterium für das Altsystem festgelegt wird?

**Antwort:** Das Altsystem wird tatsächlich häufig aus Vorsicht unbegrenzt parallel weiterbetrieben, obwohl die fachliche Funktionalität bereits vollständig im Neusystem liegt, was Wartungsressourcen ohne tatsächlichen Modernisierungsnutzen bindet.

### 4. Warum ist eine ehrliche Teamkapazitätseinschätzung für ein Modernisierungsprogramm notwendig?

**Antwort:** Weil eine Überschätzung dazu führt, dass sich das Programm verzögert, während laufende, fachliche Anforderungen unbearbeitet bleiben oder die Modernisierung selbst ins Stocken gerät.

### 5. Wie gehst du vor, wenn ein Modernisierungsprogramm über Jahre im Parallelbetrieb verharrt, ohne das Altsystem abzuschalten?

**Antwort:** Ich lege nachträglich ein konkretes, überprüfbares Stilllegungskriterium fest und verfolge dessen Erfüllung aktiv, statt den Parallelbetrieb unbegrenzt fortzusetzen.

### 6. Widersprüchliche Anforderung: Das Betriebsteam will maximale Sicherheit durch langen Parallelbetrieb beider Systeme UND die Organisation will die Kosteneinsparung durch zügige Stilllegung des Altsystems realisieren — wie gehst du vor?

**Antwort:** Ich würde ein konkretes, aber angemessen konservatives Stilllegungskriterium mit definierten Übergangsphasen festlegen (etwa eine begrenzte Nachlaufzeit mit reduziertem, aber nicht vollständig abgeschaltetem Altsystemzugriff), statt entweder unbegrenzten Parallelbetrieb oder eine übereilte, riskante sofortige Abschaltung zu wählen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Unternehmen modernisiert ein Legacy-ERP-System (angelehnt an Domain 29, ERP-Integration) in Richtung einer modularen Commerce-Plattform. Nach der Migration der Kernfunktionen bleibt das Altsystem "vorsichtshalber" ohne definiertes Stilllegungskriterium weiter aktiv.

~~~python
# Local, deterministic illustration of tracking a decommissioning criterion across program segments (fictional lab example, no real program):

program_segments = [
    {"segment": "order_processing_migrated", "business_capability_covered_pct": 40},
    {"segment": "inventory_migrated", "business_capability_covered_pct": 75},
    {"segment": "reporting_migrated", "business_capability_covered_pct": 100},
]

def check_decommission_readiness(segments, threshold_pct=100):
    latest = segments[-1]
    return latest["business_capability_covered_pct"] >= threshold_pct

print(check_decommission_readiness(program_segments))
~~~

Erwartete Beobachtung: Die Prüfung zeigt korrekt an, dass nach vollständiger Migration aller Geschäftsfähigkeiten die Stilllegungsbedingung erfüllt ist. Auswertung: Ohne dieses explizite Kriterium hätte das Team das Altsystem vermutlich unbegrenzt aus Vorsicht weiterbetrieben, obwohl die tatsächliche fachliche Funktionalität bereits vollständig im neuen System verfügbar war.

## Dependencies, Cross-References und Quellen

1. Martin Fowler: [StranglerFigApplication — Incremental Legacy Migration Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html), abgerufen 2026-09-18.
2. Gartner: [Application Modernization Strategies — Program Governance](https://www.gartner.com/en/information-technology), abgerufen 2026-09-18.

Dieses Kapitel baut auf der in KB-0615 (Modernisierungsportfolio) beschriebenen Portfolioplanung und der in KB-0687 (Technologieroadmaps steuern) beschriebenen Evidenzpunkt-Steuerung auf.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatisierte Identifikation impliziter Geschäftsfähigkeiten aus Legacy-Codebasen zur Vervollständigung der Anforderungserfassung vor Modernisierung | Emerging | Bei künftigen, umfangreichen Modernisierungsprogrammen als Ergänzung evaluieren, jedoch die finale Vollständigkeitsprüfung weiterhin durch fachliche Experten mit Domänenwissen verifizieren lassen. |

Ein Team akzeptiert ein Modernisierungsprogramm erst, wenn Geschäftsfähigkeiten vollständig erfasst, Zwischenzustände mit Risiken definiert und ein konkretes Stilllegungskriterium für das Altsystem festgelegt sind.
