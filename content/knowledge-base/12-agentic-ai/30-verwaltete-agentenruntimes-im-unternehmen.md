---
{"id": "KB-0304", "title": "Verwaltete Agentenruntimes im Unternehmen", "domain": "12", "sequence": 30, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0287", "concepts": ["Agent Identity und Service Identity"], "needed_for": "understanding"}, {"id": "KB-0298", "concepts": ["Agentenorchestrierung und Prozessintegration"], "needed_for": "understanding"}], "related": ["KB-0284"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Bewertungsmatrix für einen verwalteten Agentenruntime-Anbieter erstellen, die Persistenz, Identity, Governance und Exit-Möglichkeiten explizit gegeneinander abwägt.", "rationale": "Der Wert einer strukturierten Bewertung wird erst durch konkrete Anwendung auf einen realen Anbieter greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann eine verwaltete Agentenruntime gegenüber einer selbst betriebenen Orchestrierung (siehe KB-0298) für einen konkreten Enterprise-Anwendungsfall angemessen ist.", "rationale": "Verwaltete Runtimes reduzieren Betriebsaufwand, erzeugen aber Anbieterabhängigkeit, die gegen den Betriebsaufwand einer selbst betriebenen Lösung abgewogen werden muss."}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Migrationsblockade auf fehlende Exit-Möglichkeiten eines verwalteten Agentenruntime-Anbieters statt auf ein allgemeines Architekturproblem zurückführen können.", "rationale": "Verwaltete Runtimes können proprietäre Persistenz- oder Identity-Formate verwenden, die eine spätere Migration zu einem anderen Anbieter erschweren, wenn dies nicht vorab geprüft wurde."}, "CHIEF-TARGET": {"active": true, "scope": "Die Wahl eines verwalteten Agentenruntime-Anbieters als strategische Build-vs-Buy-Entscheidung mit Anbieterabhängigkeitsrisiko positionieren, die anhand aktueller Primärquellen zu Persistenz, Identity, Governance und Exit-Optionen zu verifizieren ist.", "rationale": "Anbieter-Feature-Sets und Governance-Fähigkeiten verwalteter Agentenruntimes entwickeln sich schnell weiter; eine einmalige Bewertung veraltet und muss vor einer Bindungsentscheidung erneut gegen aktuelle Primärquellen geprüft werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Anbieterspezifische API-Details sind Vertiefung.", "rationale": "Kern ist das Bewertungsraster (Persistenz, Identity, Governance, Exit), nicht die konkrete Anbieter-API."}}, "lab_validation": [{"lab_id": "KB-0304-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Bewertungsmatrix für verwaltete Agentenruntime-Anbieter anhand von vier Kriterien", "evidence": "Ein Anbieter ohne dokumentierte Exportfunktion für persistierten Agentenzustand erhält in der Bewertungsmatrix eine niedrige Exit-Bewertung, was das Migrationsrisiko explizit sichtbar macht, statt es implizit zu übersehen.", "limitations": "Kein echter Anbieter getestet, kein produktives System; konkrete Anbieter-Feature-Sets müssen vor einer Bindungsentscheidung gegen aktuelle Primärquellen verifiziert werden, da sich diese schnell weiterentwickeln."}]}
---
# Verwaltete Agentenruntimes im Unternehmen

> **Ziel:** Verwaltete Agentenruntimes (z. B. Microsoft Foundry Agent Service und vergleichbare Angebote anderer Anbieter) übernehmen Betriebsaufwand für Agentenorchestrierung (siehe [KB-0298](24-agentenorchestrierung-und-prozessintegration.md)), Identity (siehe [KB-0287](13-agent-identity-und-service-identity.md)) und Persistenz (siehe [KB-0284](10-dauerhafter-agentenzustand.md)) — die zentrale Bewertungsdimension bei der Anbieterwahl ist jedoch nicht nur der Funktionsumfang, sondern explizit auch die Exit-Möglichkeit: wie leicht lässt sich persistierter Zustand, Identity-Konfiguration und Governance-Regelwerk zu einem anderen Anbieter oder einer selbst betriebenen Lösung migrieren, falls dies später notwendig wird.

## Zweck, Mental Model und Dependencies

Persistenz bei einem verwalteten Agentenruntime-Anbieter bedeutet, dass Agentenzustand (siehe [KB-0284](10-dauerhafter-agentenzustand.md)) vom Anbieter selbst gespeichert und verwaltet wird — die Bewertungsfrage ist, in welchem Format dieser Zustand vorliegt und ob er exportierbar ist. Identity bedeutet, dass der Anbieter eigene Mechanismen für Agenten- und Nutzeridentität (siehe [KB-0287](13-agent-identity-und-service-identity.md)) bereitstellt — hier ist relevant, ob diese mit bestehenden Enterprise-Identity-Systemen (z. B. bestehenden Identity Providern) integrierbar sind oder eine isolierte, proprietäre Lösung darstellen. Governance bedeutet, dass der Anbieter Werkzeuge für Autorisierung, Audit und Richtliniendurchsetzung bereitstellt — die Bewertungsfrage ist, ob diese den in vorherigen Kapiteln behandelten Prinzipien (minimale Berechtigungen, nachvollziehbare Principal-Ketten, Human Gates) tatsächlich genügen oder nur oberflächlich abdecken. Exit-Möglichkeiten sind die am häufigsten unterschätzte Dimension: eine verwaltete Runtime, die keine dokumentierte Export- oder Migrationsfunktion für Zustand, Identity-Konfiguration und Governance-Regeln bietet, erzeugt eine faktische Anbieterbindung (Vendor Lock-in), die bei einer späteren strategischen Notwendigkeit zum Wechsel erhebliche Kosten oder sogar Unmöglichkeit der Migration bedeuten kann. Da sich Anbieter-Feature-Sets schnell weiterentwickeln, muss jede konkrete Bewertung dieser vier Dimensionen vor einer Bindungsentscheidung gegen die aktuelle offizielle Dokumentation des jeweiligen Anbieters verifiziert werden, statt sich auf einmalig recherchierte oder veraltete Informationen zu verlassen.

~~~text
Persistence: agent state stored/managed BY the provider -> is it EXPORTABLE, in what format?
Identity: provider's own agent/user identity mechanisms -> integrable with existing enterprise IdP, or isolated/proprietary?
Governance: authorization/audit/policy tooling -> does it actually satisfy least-privilege/Principal-chain/Human-Gate principles, or only superficially?
Exit: MOST underestimated dimension -> no documented export/migration path = de facto VENDOR LOCK-IN
  -> can make later strategic migration costly or IMPOSSIBLE
MUST verify all four against CURRENT official docs before commitment -> provider feature sets evolve fast
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Persistenz-Exportierbarkeit | ist dokumentiert, in welchem Format und über welchen Mechanismus persistierter Agentenzustand exportiert werden kann? | fehlende Exportierbarkeit macht eine spätere Migration von Zustand praktisch unmöglich |
| Identity-Interoperabilität | lässt sich die Identity-Lösung des Anbieters mit bestehenden Enterprise-Identity-Systemen integrieren, statt eine isolierte Insellösung zu erzwingen? | eine isolierte Identity-Lösung erschwert konsistente unternehmensweite Autorisierung und spätere Migration |
| Tatsächliche Governance-Tiefe | erfüllen die Governance-Werkzeuge des Anbieters tatsächlich die Prinzipien aus minimalen Berechtigungen, Principal-Ketten und Human Gates, oder nur oberflächlich? | oberflächliche Governance-Werkzeuge können ein falsches Sicherheitsgefühl erzeugen, ohne tatsächlichen Schutz zu bieten |
| Dokumentierte Exit-Strategie | existiert ein dokumentierter, funktionierender Migrationspfad zu einem anderen Anbieter oder einer selbst betriebenen Lösung? | ohne dokumentierte Exit-Strategie entsteht eine faktische Anbieterbindung, die erst bei tatsächlichem Migrationsbedarf sichtbar wird |

Implementierung: Vor der Wahl eines verwalteten Agentenruntime-Anbieters wird eine Bewertungsmatrix erstellt, die Persistenz-Exportierbarkeit, Identity-Interoperabilität, tatsächliche Governance-Tiefe und dokumentierte Exit-Möglichkeiten explizit anhand der aktuellen offiziellen Dokumentation des Anbieters bewertet. Governance-Werkzeuge des Anbieters werden konkret gegen die in dieser Wissensbasis behandelten Prinzipien (Autorität und minimale Berechtigungen, Principal-Ketten, Human Gates) geprüft, statt Marketingaussagen des Anbieters unkritisch zu übernehmen. Die Exit-Bewertung wird als eigenständiges, gleichrangiges Kriterium neben Funktionsumfang und Kosten behandelt, nicht als nachrangige Zusatzüberlegung. Diese Bewertung wird vor jeder größeren Bindungsentscheidung (z. B. Migration bestehender Workloads auf den Anbieter) erneut gegen die dann aktuelle Dokumentation verifiziert.

## Scalability, Reliability, Security und Observability

Verwaltete Agentenruntimes skalieren Betriebsaufwand-Reduktion proportional zur Reife des Anbieterangebots; die Reliability-Grenze liegt in unzureichender Exit-Bewertung, die bei wachsender Abhängigkeit von einem Anbieter das Risiko einer faktisch irreversiblen Bindung proportional erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine geplante Migration zu einem anderen Anbieter erweist sich als unerwartet aufwendig oder unmöglich | fehlende oder unzureichend geprüfte Exit-Möglichkeiten des ursprünglichen Anbieters | prüfen, ob vor der ursprünglichen Anbieterwahl eine dokumentierte Exit-Strategie verifiziert wurde |
| die Governance-Werkzeuge des Anbieters lassen eine tatsächlich stattgefundene Rechteausweitung unentdeckt | die Governance-Tiefe des Anbieters wurde nicht konkret gegen etablierte Prinzipien (minimale Berechtigungen, Principal-Ketten) geprüft | prüfen, ob die Governance-Bewertung eine konkrete Prüfung gegen diese Prinzipien statt einer oberflächlichen Feature-Liste umfasste |
| die Identity-Integration mit bestehenden Enterprise-Systemen erweist sich als aufwendiger als erwartet | fehlende Prüfung der Identity-Interoperabilität vor der Anbieterwahl | prüfen, ob die Identity-Interoperabilität explizit gegen die bestehende Enterprise-Identity-Landschaft verifiziert wurde |

Security: Governance-Werkzeuge eines verwalteten Anbieters dürfen nicht unkritisch als ausreichend angenommen werden — sie müssen konkret gegen die etablierten Sicherheitsprinzipien (minimale Berechtigungen, nachvollziehbare Delegation, Human Gates für folgenreiche Aktionen) geprüft werden, bevor sie als Ersatz für selbst implementierte Kontrollen akzeptiert werden. Observability: Dokumentationsgrad der Exit-Optionen pro evaluiertem Anbieter, Ergebnis der Governance-Tiefenprüfung gegen etablierte Prinzipien und Häufigkeit der Neubewertung bei Anbieter-Feature-Updates sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** bewertet jeden verwalteten Agentenruntime-Anbieter anhand aller vier Dimensionen (Persistenz, Identity, Governance, Exit) vor einer Bindungsentscheidung. **Principal** macht die Bewertungsmatrix und ihre Ergebnisse für das Team nachvollziehbar dokumentiert. **Chief** positioniert die Anbieterwahl als strategische Build-vs-Buy-Entscheidung mit explizitem Anbieterabhängigkeitsrisiko, das gegen aktuelle Primärquellen verifiziert werden muss.

Anti-Patterns: einen verwalteten Agentenruntime-Anbieter allein anhand des Funktionsumfangs wählen, ohne Exit-Möglichkeiten zu prüfen; Governance-Werkzeuge des Anbieters unkritisch als ausreichend akzeptieren, ohne sie gegen etablierte Sicherheitsprinzipien zu prüfen; eine einmalige Anbieterbewertung nicht bei relevanten Feature-Updates erneuern.

## Production Checklist

- [ ] Persistenz-Exportierbarkeit ist anhand aktueller Anbieterdokumentation geprüft.
- [ ] Identity-Interoperabilität mit bestehenden Enterprise-Systemen ist verifiziert.
- [ ] Governance-Werkzeuge sind konkret gegen etablierte Sicherheitsprinzipien geprüft, nicht nur oberflächlich akzeptiert.
- [ ] Eine dokumentierte, funktionierende Exit-Strategie existiert vor der Bindungsentscheidung.

## Interviewfragen

### 1. Warum ist die Exit-Möglichkeit die am häufigsten unterschätzte Bewertungsdimension bei verwalteten Agentenruntimes?

**Antwort:** Ohne dokumentierte Export- oder Migrationsfunktion entsteht eine faktische Anbieterbindung, die erst sichtbar wird, wenn ein tatsächlicher Migrationsbedarf entsteht — zu diesem Zeitpunkt kann die Migration bereits kostspielig oder unmöglich sein.

### 2. Warum reicht es nicht, Governance-Werkzeuge eines Anbieters anhand einer Feature-Liste zu bewerten?

**Antwort:** Eine Feature-Liste zeigt, dass ein Werkzeug existiert, aber nicht, ob es tatsächlich die etablierten Sicherheitsprinzipien (minimale Berechtigungen, nachvollziehbare Delegation, Human Gates) erfüllt; nur eine konkrete Prüfung gegen diese Prinzipien zeigt die tatsächliche Governance-Tiefe.

### 3. Warum ist Identity-Interoperabilität bei der Anbieterwahl relevant?

**Antwort:** Eine isolierte, proprietäre Identity-Lösung des Anbieters erschwert konsistente unternehmensweite Autorisierung und erhöht das Migrationsrisiko, wenn sie nicht mit bestehenden Enterprise-Identity-Systemen integrierbar ist.

### 4. Warum muss eine Anbieterbewertung vor jeder größeren Bindungsentscheidung erneuert werden?

**Antwort:** Anbieter-Feature-Sets für Persistenz, Identity, Governance und Exit-Optionen entwickeln sich schnell weiter; eine einmalige Bewertung veraltet und muss gegen die dann aktuelle Dokumentation erneut verifiziert werden.

### 5. Wie diagnostizierst du eine unerwartete Migrationsblockade bei einem verwalteten Agentenruntime-Anbieter?

**Antwort:** Ich prüfe, ob vor der ursprünglichen Anbieterwahl eine dokumentierte, tatsächlich funktionierende Exit-Strategie verifiziert wurde — fehlt sie, ist eine faktische Anbieterbindung die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will schnelle Einführung eines verwalteten Agentenruntime-Anbieters ohne aufwendige Vorabbewertung UND garantiert keine spätere Anbieterbindung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine minimale, aber vollständige Bewertung aller vier Dimensionen (Persistenz, Identity, Governance, Exit) den Einführungsaufwand nur geringfügig erhöht, verglichen mit dem Risiko einer späteren, unerwarteten Bindung; ich würde vorschlagen, eine standardisierte, wiederverwendbare Bewertungs-Checkliste zu etablieren, die den Bewertungsaufwand pro Anbieter minimiert, ohne die Exit-Prüfung auszulassen.

## Praktische Labs

~~~python
# Managed agent runtime provider evaluation matrix across four dimensions
def evaluate_provider(persistence_exportable, identity_interoperable, governance_matches_principles, exit_documented):
    scores = {
        "persistence": "OK" if persistence_exportable else "RISK: state locked in proprietary format",
        "identity": "OK" if identity_interoperable else "RISK: isolated, non-interoperable identity",
        "governance": "OK" if governance_matches_principles else "RISK: governance tools only superficial",
        "exit": "OK" if exit_documented else "RISK: de facto vendor lock-in, no documented migration path",
    }
    overall_risk = any(v.startswith("RISK") for v in scores.values())
    return scores, overall_risk

provider_a_scores, provider_a_risk = evaluate_provider(
    persistence_exportable=True, identity_interoperable=True,
    governance_matches_principles=True, exit_documented=False,
)
print(f"Provider A: {provider_a_scores}")
print(f"Provider A overall risk flagged: {provider_a_risk}")

provider_b_scores, provider_b_risk = evaluate_provider(
    persistence_exportable=True, identity_interoperable=True,
    governance_matches_principles=True, exit_documented=True,
)
print(f"Provider B: {provider_b_scores}")
print(f"Provider B overall risk flagged: {provider_b_risk}")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft: [Azure AI Foundry Agent Service Documentation](https://learn.microsoft.com/en-us/azure/ai-services/agents/overview), abgerufen 2026-09-17.
2. NIST: [SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-17.
3. Gartner: [Avoiding Vendor Lock-In in Cloud and AI Platform Decisions](https://www.gartner.com/en/information-technology/glossary/vendor-lock-in), abgerufen 2026-09-17.

Agent Identity und Service Identity sind kanonisch in [KB-0287](13-agent-identity-und-service-identity.md) behandelt; Agentenorchestrierung und Prozessintegration in [KB-0298](24-agentenorchestrierung-und-prozessintegration.md); Dauerhafter Agentenzustand in [KB-0284](10-dauerhafter-agentenzustand.md). Konkrete Anbieter-Feature-Sets sind vor einer Bindungsentscheidung gegen die zum Nutzungszeitpunkt aktuelle offizielle Anbieterdokumentation zu verifizieren, da sich diese schnell weiterentwickeln.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte Agentenzustands-Exportformate über verschiedene verwaltete Runtime-Anbieter hinweg | Emerging | Beobachten; würde Exit-Risiko strukturell reduzieren, aber noch keine breit etablierte Standardisierung. |
| Multi-Cloud-/Multi-Anbieter-Abstraktionsschichten für Agentenorchestrierung, die Anbieterwechsel erleichtern | Emerging | Beobachten; vielversprechend gegen Vendor Lock-in, aber Reifegrad und Vollständigkeit noch nicht ausreichend belegt. |

Ein Team akzeptiert die Wahl eines verwalteten Agentenruntime-Anbieters erst, wenn Persistenz, Identity, Governance und Exit-Möglichkeiten anhand aktueller Primärquellen bewertet und dokumentiert sind.
