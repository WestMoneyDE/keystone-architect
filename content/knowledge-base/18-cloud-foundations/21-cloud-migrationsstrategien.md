---
{"id": "KB-0461", "title": "Cloud-Migrationsstrategien", "domain": "18", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0450", "concepts": ["Landing Zones"], "needed_for": "understanding"}, {"id": "KB-0460", "concepts": ["Datenresidenz und Cloud-Platzierung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Rehost, Replatform und Refactor anhand ihres jeweiligen Aufwands und Nutzens unterscheiden können und für ein konkretes Anwendungsbeispiel die passende Strategie begründen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendungslandschaft einen überprüfbaren Migrationspfad gestalten, der Abhängigkeiten, Datenbewegung und explizite Abschaltkriterien für die Altsysteme definiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet lange Parallelbetriebsphase auf unvollständig geprüfte Abschaltkriterien oder übersehene Abhängigkeiten zum Altsystem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Migrationsrichtlinien im Unternehmen anhand eines überprüfbaren, kriteriengestützten Migrationspfads statt anhand eines pauschalen Zieldatums für die Migration festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Migrationsautomatisierungswerkzeuge eines Cloud-Anbieters im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Migrationsstrategien, Abhängigkeitsanalyse und Abschaltkriterien als Entscheidungsgrundlage, nicht die anbieterspezifische Automatisierungswerkzeug-Interna."}}, "lab_validation": [{"lab_id": "KB-0461-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Cloud-Migrations-Framework-Dokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie sich Rehost (unveränderte Verlagerung), Replatform (moderate Anpassung für Cloud-native Dienste) und Refactor (grundlegende Neugestaltung für Cloud-native Architektur) in Aufwand und langfristigem Nutzen unterscheiden, und warum ein überprüfbarer Migrationspfad explizite, messbare Abschaltkriterien für das Altsystem benötigt, statt sich auf ein reines Zieldatum zu verlassen.", "limitations": "Kein aktives Cloud-Deployment getestet, keine reale Migration durchgeführt."}]}
---
# Cloud-Migrationsstrategien

> **Ziel:** Cloud-Migrationsstrategien unterscheiden sich im Verhältnis von Migrationsaufwand zu langfristigem Cloud-nativem Nutzen — Rehost (eine Anwendung wird unverändert, "wie sie ist", in die Cloud verlagert, typischerweise auf virtuelle Maschinen, siehe Cloud-Compute-Modelle, [KB-0445](05-cloud-compute-modelle.md), was den geringsten initialen Aufwand, aber auch den geringsten Cloud-nativen Nutzen bedeutet), Replatform (moderate Anpassungen, um bestimmte Cloud-native Dienste zu nutzen, z. B. eine selbst betriebene Datenbank wird durch einen verwalteten Cloud-Datenbankdienst ersetzt, siehe [KB-0447](07-verwaltete-cloud-datenbanken.md), ohne die Anwendungsarchitektur grundlegend zu verändern), und Refactor (grundlegende Neugestaltung der Anwendungsarchitektur für Cloud-native Muster, z. B. Zerlegung eines Monolithen in Microservices, was den höchsten Aufwand, aber auch den höchsten langfristigen Nutzen bietet). Der zentrale Punkt dieses Kapitels ist, dass ein Migrationspfad überprüfbar gestaltet werden muss — mit expliziten Abhängigkeitsanalysen, einem klaren Datenbewegungsplan, und vor allem messbaren, dokumentierten Abschaltkriterien für das Altsystem, statt sich auf ein reines Zieldatum zu verlassen, das ohne Berücksichtigung tatsächlicher, überprüfbarer Kriterien leicht verschoben oder vorzeitig als "erledigt" markiert wird, obwohl relevante Abhängigkeiten noch bestehen.

## Zweck, Mental Model und Dependencies

Rehost verlagert eine Anwendung ohne architektonische Änderungen in die Cloud, was den schnellsten Migrationsweg darstellt und primär für Anwendungen geeignet ist, die kurzfristig aus einem alten Rechenzentrum entfernt werden müssen (z. B. wegen eines auslaufenden Vertrags), jedoch die langfristigen Vorteile Cloud-nativer Dienste (z. B. automatische Skalierung, verwaltete Betriebsaufgaben) nicht realisiert, solange keine weiteren Schritte folgen. Replatform nimmt moderate, gezielte Anpassungen vor, um bestimmte Cloud-native Dienste zu nutzen (typischerweise Datenbanken oder andere Infrastrukturkomponenten, die einfach durch verwaltete Cloud-Äquivalente ersetzt werden können, siehe Landing Zones, [KB-0450](10-landing-zones.md), für die vorbereitete Zielumgebung), ohne die Kernarchitektur der Anwendung selbst zu verändern — dies bietet einen guten Kompromiss zwischen Aufwand und Nutzen für viele Anwendungen. Refactor stellt die grundlegendste, aufwendigste Strategie dar, bei der die Anwendungsarchitektur selbst für Cloud-native Muster neu gestaltet wird (z. B. Aufteilung in unabhängig skalierbare Microservices, Einsatz von Serverless-Komponenten, siehe [KB-0448](08-serverless-architekturen.md)) — dies bietet den größten langfristigen Nutzen (Skalierbarkeit, Betriebsaufwandreduktion, Kosteneffizienz), erfordert jedoch den größten initialen Investitionsaufwand und ist nur für Anwendungen gerechtfertigt, deren langfristige, strategische Bedeutung diesen Aufwand rechtfertigt. Der zentrale methodische Punkt ist, dass ein Migrationsprojekt nicht mit einem reinen Zieldatum ("das Altsystem wird am Datum X abgeschaltet") geplant werden sollte, sondern mit expliziten, überprüfbaren Abschaltkriterien (z. B. "alle identifizierten Abhängigkeiten zum Altsystem sind migriert und verifiziert", "der Parallelbetrieb zeigt über einen definierten Zeitraum keine Diskrepanzen zwischen Alt- und Neusystem") — ein reines Zieldatum führt häufig entweder zu einer verfrühten Abschaltung, bei der übersehene Abhängigkeiten zu Ausfällen führen, oder zu einer wiederholten, unbegründeten Verschiebung des Datums, ohne dass der tatsächliche Migrationsfortschritt nachvollziehbar ist.

~~~text
Rehost: unchanged "lift and shift" -> lowest initial effort, LOWEST cloud-native benefit
  suitable for: short-term departure from old DC (e.g. expiring contract)
Replatform: MODERATE, targeted changes (e.g. self-run DB -> managed cloud DB service)
  core app architecture UNCHANGED -> good effort/benefit compromise for many apps
Refactor: FUNDAMENTAL architecture redesign for cloud-native patterns (microservices, serverless)
  HIGHEST initial investment, HIGHEST long-term benefit
  only justified for apps whose long-term strategic importance justifies the effort
KEY METHODOLOGICAL POINT: never plan with a pure TARGET DATE ("legacy shut down on date X")
  -> use EXPLICIT, VERIFIABLE shutdown criteria instead:
     "all identified legacy dependencies migrated AND verified",
     "parallel run over a defined period shows NO discrepancies between old and new system"
  -> pure target date -> either premature shutdown (missed dependencies -> outages)
     OR repeated, unjustified date slippage with no traceable actual progress
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Rehost | unveränderte Verlagerung, schnellster Weg | geringster Cloud-nativer Nutzen, geeignet für kurzfristigen Bedarf |
| Replatform | moderate Anpassung für Cloud-native Dienste | guter Aufwands-/Nutzen-Kompromiss für die meisten Anwendungen |
| Refactor | grundlegende, Cloud-native Neugestaltung | höchster Aufwand/Nutzen, nur für strategisch wichtige Anwendungen gerechtfertigt |
| Abschaltkriterien | messbar, überprüfbar, statt reinem Zieldatum | zentrale Voraussetzung für einen sicheren, nachvollziehbaren Migrationsabschluss |

Implementierung: Für jede zu migrierende Anwendung wird zunächst eine vollständige Abhängigkeitsanalyse durchgeführt (welche anderen Systeme greifen auf diese Anwendung zu, welche Datenflüsse bestehen), bevor eine Migrationsstrategie (Rehost, Replatform, Refactor) gewählt wird. Der Datenbewegungsplan wird explizit dokumentiert, einschließlich der Reihenfolge, in der Daten migriert werden, und wie die Konsistenz zwischen Alt- und Neusystem während einer möglichen Parallelbetriebsphase sichergestellt wird. Statt eines reinen Zieldatums werden explizite, messbare Abschaltkriterien definiert (z. B. eine bestimmte Anzahl fehlerfreier Tage im Parallelbetrieb, die vollständige Migration und Verifikation aller identifizierten Abhängigkeiten), die erfüllt sein müssen, bevor das Altsystem tatsächlich abgeschaltet wird.

## Scalability, Reliability, Security und Observability

Cloud-Migrationsstrategien skalieren den langfristigen Nutzen proportional zur Passgenauigkeit der gewählten Strategie zur strategischen Bedeutung und den tatsächlichen Anforderungen der jeweiligen Anwendung; die Reliability-Grenze liegt darin, dass eine Migration ohne vollständige Abhängigkeitsanalyse und überprüfbare Abschaltkriterien proportional zur Anzahl übersehener Abhängigkeiten zu unerwarteten Ausfällen bei der Abschaltung des Altsystems führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach der Abschaltung des Altsystems treten unerwartete Ausfälle in abhängigen Systemen auf | eine Abhängigkeit zum Altsystem wurde bei der ursprünglichen Analyse übersehen | die Abhängigkeitsanalyse nachträglich vervollständigen und die übersehene Abhängigkeit migrieren |
| das Zieldatum für die Abschaltung des Altsystems wird wiederholt verschoben | es existieren keine expliziten, messbaren Abschaltkriterien, die den tatsächlichen Fortschritt nachvollziehbar machen | explizite, messbare Abschaltkriterien definieren und den tatsächlichen Fortschritt gegen diese Kriterien verfolgen |
| eine gewählte Migrationsstrategie (z. B. Refactor) erweist sich als unverhältnismäßig aufwendig für den tatsächlichen Nutzen der Anwendung | die strategische Bedeutung der Anwendung wurde bei der Strategiewahl überschätzt | die strategische Bedeutung neu bewerten und gegebenenfalls eine weniger aufwendige Strategie (Replatform statt Refactor) evaluieren |

Security: Während einer Migration, insbesondere bei einer Parallelbetriebsphase mit Datensynchronisation zwischen Alt- und Neusystem, sollte die Zugriffskontrolle für beide Systeme konsistent geprüft werden, um zu verhindern, dass das ältere, möglicherweise weniger sorgfältig gepflegte System zu einem zusätzlichen Sicherheitsrisiko wird. Observability: Der tatsächliche Fortschritt gegen die definierten Abschaltkriterien, die Anzahl noch offener, identifizierter Abhängigkeiten, und die Konsistenz zwischen Alt- und Neusystem während der Parallelbetriebsphase sind zentrale Metriken zur Bewertung des Migrationsfortschritts.

## Trade-offs und Entscheidungen

**Staff** definiert für jede Migration explizite, messbare Abschaltkriterien statt eines reinen Zieldatums. **Principal** macht die Abhängigkeitsanalyse und den Migrationspfad für das Team nachvollziehbar. **Chief** legt Migrationsrichtlinien im Unternehmen anhand eines überprüfbaren, kriteriengestützten Migrationspfads fest.

Anti-Patterns: ein Altsystem an einem reinen Zieldatum abschalten, ohne alle identifizierten Abhängigkeiten vollständig migriert und verifiziert zu haben; eine Refactor-Strategie für eine Anwendung ohne ausreichende strategische Bedeutung wählen und dadurch unverhältnismäßigen Aufwand verursachen; eine Migration ohne vollständige, vorab durchgeführte Abhängigkeitsanalyse beginnen.

## Production Checklist

- [ ] Eine vollständige Abhängigkeitsanalyse liegt für jede zu migrierende Anwendung vor.
- [ ] Die gewählte Migrationsstrategie (Rehost, Replatform, Refactor) ist anhand der strategischen Bedeutung und tatsächlichen Anforderungen begründet.
- [ ] Explizite, messbare Abschaltkriterien für das Altsystem sind definiert, nicht nur ein Zieldatum.
- [ ] Der tatsächliche Fortschritt gegen die Abschaltkriterien wird nachvollziehbar verfolgt.

## Interviewfragen

### 1. Was unterscheidet Rehost, Replatform und Refactor?

**Antwort:** Rehost verlagert eine Anwendung unverändert in die Cloud (geringster Aufwand/Nutzen); Replatform nimmt moderate Anpassungen für Cloud-native Dienste vor, ohne die Kernarchitektur zu verändern; Refactor gestaltet die Anwendungsarchitektur grundlegend für Cloud-native Muster neu (höchster Aufwand/Nutzen).

### 2. Warum ist ein reines Zieldatum für die Abschaltung eines Altsystems riskant?

**Antwort:** Es führt entweder zu einer verfrühten Abschaltung mit übersehenen Abhängigkeiten und resultierenden Ausfällen, oder zu wiederholter, unbegründeter Verschiebung ohne nachvollziehbaren tatsächlichen Fortschritt.

### 3. Was sollten explizite Abschaltkriterien anstelle eines reinen Zieldatums umfassen?

**Antwort:** Messbare Kriterien wie die vollständige Migration und Verifikation aller identifizierten Abhängigkeiten, oder eine definierte, fehlerfreie Parallelbetriebsphase zwischen Alt- und Neusystem.

### 4. Wann ist eine Refactor-Strategie gegenüber Rehost oder Replatform gerechtfertigt?

**Antwort:** Wenn die langfristige, strategische Bedeutung der Anwendung den erheblichen initialen Aufwand einer grundlegenden, Cloud-nativen Neugestaltung rechtfertigt.

### 5. Wie gehst du vor, wenn nach der Abschaltung eines Altsystems unerwartete Ausfälle in abhängigen Systemen auftreten?

**Antwort:** Ich prüfe, ob eine Abhängigkeit zum Altsystem bei der ursprünglichen Analyse übersehen wurde, und vervollständige die Abhängigkeitsanalyse nachträglich, um die übersehene Abhängigkeit zu migrieren.

### 6. Widersprüchliche Anforderung: Geschäftsbereich will ein festes, kurzfristiges Zieldatum für die Migrationsabschaltung UND garantiert keine Ausfälle bei abhängigen Systemen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein garantiert ausfallfreier Übergang explizite, verifizierte Abschaltkriterien statt eines reinen Datums erfordert, und vorschlagen, das Zieldatum als Zielkorridor zu verstehen, der erst nach Erfüllung der Kriterien final bestätigt wird, statt ein Datum zu versprechen, das das tatsächliche Migrationsrisiko ignoriert.

## Praktische Labs

~~~python
# Conceptual migration strategy recommendation and shutdown-criteria tracking (not executed against a real system):

def recommend_migration_strategy(strategic_importance, effort_tolerance):
    if strategic_importance == "high" and effort_tolerance == "high":
        return "refactor"
    if strategic_importance in ("medium", "high"):
        return "replatform"
    return "rehost"

def check_shutdown_readiness(dependencies_migrated, dependencies_total, parallel_run_clean_days, required_clean_days):
    dependency_ready = dependencies_migrated == dependencies_total
    parallel_run_ready = parallel_run_clean_days >= required_clean_days
    return {
        "dependency_ready": dependency_ready,
        "parallel_run_ready": parallel_run_ready,
        "ready_to_shutdown": dependency_ready and parallel_run_ready,
    }

strategy = recommend_migration_strategy(strategic_importance="high", effort_tolerance="high")
readiness = check_shutdown_readiness(dependencies_migrated=8, dependencies_total=9, parallel_run_clean_days=12, required_clean_days=14)

print(f"Recommended strategy: {strategy}")
print(f"Shutdown readiness: {readiness}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Migration Strategies (6 Rs) — AWS Prescriptive Guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/large-migration-guide/migration-strategies.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Migration to Google Cloud — Assessing and Planning](https://cloud.google.com/architecture/migration-to-gcp-getting-started), abgerufen 2026-09-18.

Landing Zones sind kanonisch in [KB-0450](10-landing-zones.md) behandelt; Datenresidenz und Cloud-Platzierung in [KB-0460](20-datenresidenz-und-cloud-platzierung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Abhängigkeitsanalyse-Werkzeuge, die Anwendungsabhängigkeiten aus Netzwerkverkehr und Konfiguration automatisch erkennen | Adopting | Gegenüber rein manueller Abhängigkeitsanalyse bevorzugen, sobald die tatsächliche Erkennungsvollständigkeit für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert die Abschaltung eines Altsystems erst, wenn alle identifizierten Abhängigkeiten nachweislich migriert und verifiziert sind und explizit definierte, messbare Abschaltkriterien erfüllt sind.
