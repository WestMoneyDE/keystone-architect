---
{"id": "KB-0601", "title": "Application Portfolio Management", "domain": "25", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0591", "concepts": ["Application Architecture im Unternehmen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Anwendungen für eine konkrete Anwendungslandschaft anhand etablierter Application-Portfolio-Management-Praxis korrekt nach Nutzen, Risiko und Kosten bewerten und priorisierte Konsolidierungsoptionen ableiten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Nutzen-, Risiko- und Kostenbewertung mit fachlichen Eigentümern verbunden werden, um Konsolidierungsentscheidungen nachvollziehbar zu priorisieren, aufbauend auf der bereits in KB-0591 behandelten Anwendungskartierung.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Portfoliobewertung auf unzureichender Datenqualität beruht (etwa veraltete Kostenzahlen oder fehlende fachliche Eigentümerbestätigung), und die Bewertung entsprechend als vorläufig statt als belastbar einordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Application Portfolio Management festlegen, die Nutzen-, Risiko- und Kostenbewertung mit verbindlicher fachlicher Eigentümerbestätigung und Datenqualitätsanforderungen verbinden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Kostenmessung einzelner Anwendungen (Infrastrukturkosten, Lizenzkosten) ist Vertiefung.", "rationale": "Kern ist die nachvollziehbare Priorisierung von Konsolidierungsoptionen anhand von Nutzen, Risiko und Kosten mit fachlicher Eigentümerbestätigung, nicht die detaillierte technische Kostenmessung selbst."}}, "lab_validation": [{"lab_id": "KB-0601-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Priorisierung von Konsolidierungskandidaten anhand von Nutzen, Risiko und Kosten, kein produktives EA-Tool verwendet", "evidence": "Ein lokales Skript bewertet eine Liste von Anwendungen anhand ihres Nutzens, Risikos und ihrer Kosten und identifiziert Anwendungen mit niedrigem Nutzen, hohem Risiko und hohen Kosten als vorrangige Konsolidierungskandidaten, sofern ihre Bewertungsdaten als aktuell und fachlich bestätigt markiert sind.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales EA-Tool."}]}
---
# Application Portfolio Management

> **Ziel:** Application Portfolio Management bewertet die bereits in [KB-0591](03-application-architecture-im-unternehmen.md) kartierten Anwendungen systematisch nach drei Dimensionen — **Nutzen** (wie wertvoll eine Anwendung für die unterstützten Geschäftsfähigkeiten tatsächlich ist), **Risiko** (etwa technische Schulden, fehlende Sicherheitsupdates, mangelnde Verfügbarkeit von Know-how) und **Kosten** (Betriebs-, Lizenz- und Wartungskosten) — um Konsolidierungsoptionen nachvollziehbar zu priorisieren. Der zentrale Punkt dieses Kapitels ist, dass diese Bewertung nur dann tatsächlich belastbar ist, wenn sie mit fachlichen Eigentümern (die tatsächlich beurteilen können, wie wertvoll eine Anwendung für ihre Geschäftsfähigkeit ist) abgestimmt und auf ausreichender **Datenqualität** beruht — eine Portfoliobewertung, die auf veralteten Kostenzahlen oder ohne fachliche Eigentümerbestätigung des Nutzens erstellt wird, liefert eine formal vollständige, aber tatsächlich unzuverlässige Grundlage für Konsolidierungsentscheidungen.

## Zweck, Mental Model und Dependencies

Die drei Bewertungsdimensionen ergänzen sich zu einem aussagekräftigen Priorisierungsbild, das keine einzelne Dimension allein liefern kann: Eine Anwendung mit hohem Nutzen und niedrigem Risiko rechtfertigt typischerweise weitere Investition, während eine Anwendung mit niedrigem Nutzen, hohem Risiko und hohen Kosten ein vorrangiger Konsolidierungskandidat ist — die praktisch schwierigsten, aber häufig folgenreichsten Fälle sind Anwendungen mit hohem Nutzen, aber auch hohem Risiko (etwa eine geschäftskritische, aber technisch veraltete Anwendung), die eine gezielte Modernisierung statt einer einfachen Konsolidierung oder Abschaltung benötigen. Die fachliche Eigentümerbestätigung ist deshalb unverzichtbar, weil der tatsächliche Nutzen einer Anwendung für eine Geschäftsfähigkeit von der IT-Organisation allein häufig nicht zuverlässig eingeschätzt werden kann — nur der fachlich verantwortliche Eigentümer (siehe die bereits in [KB-0591](03-application-architecture-im-unternehmen.md) behandelte Anwendungskartierung mit Verantwortlichenzuordnung) kann beurteilen, ob eine Anwendung für seinen Geschäftsbereich tatsächlich noch kritisch ist oder ob ihr Nutzen inzwischen gesunken ist. Datenqualität ist die zweite, ebenso entscheidende Voraussetzung: Eine Kostenbewertung, die auf veralteten oder unvollständigen Zahlen beruht, oder eine Risikobewertung, die veraltete Sicherheitsinformationen verwendet, kann zu einer Priorisierung führen, die formal korrekt berechnet, aber inhaltlich fehlerhaft ist — die methodische Konsequenz ist, dass jede Portfoliobewertung explizit dokumentieren sollte, wie aktuell und wie fachlich bestätigt ihre zugrunde liegenden Daten tatsächlich sind, statt eine formal vollständige, aber möglicherweise auf veralteten Annahmen beruhende Priorisierung unhinterfragt als belastbar zu präsentieren.

~~~text
Application Portfolio Management: systematically evaluates KB-0591-mapped apps on THREE dimensions
  BENEFIT (how valuable an app actually is for the business capabilities it supports)
  RISK (technical debt, missing security updates, lacking know-how availability)
  COST (operating, license, maintenance costs)
  -> to traceably prioritize consolidation options
KEY POINT: this evaluation only actually reliable when
  aligned w/ BUSINESS OWNERS (who can actually judge value to their capability)
  AND based on sufficient DATA QUALITY
  portfolio evaluation on stale cost figures or w/o business owner confirmation of benefit
    -> formally complete but ACTUALLY unreliable basis for consolidation decisions
THREE dimensions combine into a meaningful prioritization picture no single dimension alone provides:
  high benefit + low risk -> typically justifies further investment
  low benefit + high risk + high cost -> priority consolidation candidate
  PRACTICALLY HARDEST but often most consequential case: high benefit + high risk
    (business-critical but technically outdated app)
    -> needs targeted MODERNIZATION, not simple consolidation/shutdown
BUSINESS OWNER CONFIRMATION indispensable BECAUSE:
  actual benefit of an app to a business capability often NOT reliably assessable by IT org alone
  only the fachlich responsible owner (per KB-0591 app mapping with ownership assignment)
    can judge whether an app is still actually critical to their business unit or whether benefit has declined
DATA QUALITY = second, equally decisive prerequisite:
  cost evaluation on stale/incomplete figures, or risk evaluation using outdated security info
  -> can produce prioritization that's formally correctly calculated but SUBSTANTIVELY flawed
METHODOLOGICAL CONSEQUENCE: every portfolio evaluation should explicitly document
  how current + how fachlich-confirmed its underlying data actually is
  instead of unquestioningly presenting a formally-complete-but-possibly-stale-assumption-based
    prioritization as reliable
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Nutzenbewertung | schätzt Wert einer Anwendung für ihre Geschäftsfähigkeit | benötigt fachliche Eigentümerbestätigung |
| Risikobewertung | erfasst technische Schulden, Sicherheits- und Know-how-Risiken | Grundlage für Modernisierungs- vs. Konsolidierungsentscheidung |
| Kostenbewertung | erfasst Betriebs-, Lizenz- und Wartungskosten | benötigt aktuelle, vollständige Kostendaten |
| Datenqualitätskennzeichnung | dokumentiert Aktualität und fachliche Bestätigung der Bewertungsdaten | verhindert unbegründetes Vertrauen in veraltete Priorisierung |

Implementierung: Jede Anwendung wird mit Nutzen-, Risiko- und Kostenbewertung erfasst, wobei die Nutzenbewertung explizit vom fachlichen Eigentümer bestätigt wird. Jede Bewertung wird mit einem Aktualitätsdatum versehen, das die zugrunde liegende Datenqualität dokumentiert. Konsolidierungsoptionen werden anhand der Kombination aus Nutzen, Risiko und Kosten priorisiert, wobei Anwendungen mit hohem Nutzen und hohem Risiko gezielt für Modernisierung statt einfache Konsolidierung vorgesehen werden.

## Scalability, Reliability, Security und Observability

Application Portfolio Management skaliert die Verlässlichkeit von Konsolidierungsentscheidungen proportional zur Aktualität der Kosten-/Risikodaten und zur Konsequenz der fachlichen Eigentümerbestätigung; die Reliability-Grenze liegt darin, dass eine Priorisierung auf veralteten oder unbestätigten Daten formal korrekt berechnet, aber inhaltlich fehlerhaft sein kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine zur Abschaltung priorisierte Anwendung erweist sich als weiterhin geschäftskritisch | die Nutzenbewertung wurde ohne fachliche Eigentümerbestätigung erstellt | die Nutzenbewertung explizit mit dem fachlichen Eigentümer validieren, bevor eine Konsolidierungsentscheidung getroffen wird |
| eine Kostenpriorisierung führt zu unerwarteten, tatsächlich nicht zutreffenden Ergebnissen | die zugrunde liegenden Kostendaten sind veraltet oder unvollständig | die Kostendaten aktualisieren und die Priorisierung mit dem Datenqualitätsdatum kennzeichnen |
| eine geschäftskritische, aber technisch veraltete Anwendung wird fälschlich zur einfachen Abschaltung statt zur Modernisierung eingeplant | Nutzen- und Risikobewertung wurden nicht gemeinsam betrachtet | die Kombination aus hohem Nutzen und hohem Risiko explizit als Modernisierungskandidat statt als Konsolidierungskandidat behandeln |

Security: Die Risikobewertung sollte explizit bekannte Sicherheitslücken und fehlende Update-Fähigkeit als eigenständige Risikofaktoren berücksichtigen. Observability: Die tatsächliche Aktualität der zugrunde liegenden Nutzen-, Risiko- und Kostendaten über die Zeit ist ein zentrales Signal zur Bewertung der Verlässlichkeit des Portfoliomanagements.

## Trade-offs und Entscheidungen

**Staff** bewertet eine gegebene Anwendung korrekt nach Nutzen, Risiko und Kosten und stimmt die Bewertung mit dem fachlichen Eigentümer ab. **Principal** entwirft die vollständige Portfoliobewertung und Konsolidierungspriorisierung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Application Portfolio Management fest, die Datenqualität und fachliche Eigentümerbestätigung verbindlich machen.

Anti-Patterns: eine Nutzenbewertung ohne fachliche Eigentümerbestätigung als belastbar behandeln; eine Kostenpriorisierung auf veralteten Daten ohne explizite Datenqualitätskennzeichnung erstellen; eine geschäftskritische, aber risikoreiche Anwendung pauschal zur Abschaltung statt zur gezielten Modernisierung einplanen.

## Production Checklist

- [ ] Jede Anwendung ist mit Nutzen-, Risiko- und Kostenbewertung erfasst.
- [ ] Die Nutzenbewertung ist explizit vom fachlichen Eigentümer bestätigt.
- [ ] Jede Bewertung ist mit einem Aktualitätsdatum zur Datenqualität versehen.
- [ ] Anwendungen mit hohem Nutzen und hohem Risiko sind für Modernisierung, nicht einfache Konsolidierung vorgesehen.

## Interviewfragen

### 1. Welche drei Dimensionen werden bei Application Portfolio Management typischerweise bewertet?

**Antwort:** Nutzen (Wert für die Geschäftsfähigkeit), Risiko (technische Schulden, Sicherheits-/Know-how-Risiken) und Kosten (Betrieb, Lizenz, Wartung).

### 2. Warum ist eine fachliche Eigentümerbestätigung für die Nutzenbewertung notwendig?

**Antwort:** Weil der tatsächliche Wert einer Anwendung für eine Geschäftsfähigkeit von der IT-Organisation allein häufig nicht zuverlässig eingeschätzt werden kann und nur der fachlich verantwortliche Eigentümer dies beurteilen kann.

### 3. Was ist die praktisch schwierigste Fallkombination bei der Portfoliobewertung, und warum?

**Antwort:** Anwendungen mit hohem Nutzen und gleichzeitig hohem Risiko — sie benötigen gezielte Modernisierung statt einfache Konsolidierung, da sie geschäftskritisch, aber technisch problematisch sind.

### 4. Warum sollte jede Portfoliobewertung explizit ihre Datenqualität dokumentieren?

**Antwort:** Weil eine Priorisierung auf veralteten oder unvollständigen Daten formal korrekt berechnet, aber inhaltlich fehlerhaft sein kann, und dies ohne explizite Kennzeichnung nicht erkennbar wäre.

### 5. Wie gehst du vor, wenn eine zur Abschaltung priorisierte Anwendung sich als weiterhin geschäftskritisch erweist?

**Antwort:** Ich prüfe, ob die ursprüngliche Nutzenbewertung tatsächlich vom fachlichen Eigentümer bestätigt wurde, und validiere die Bewertung erneut mit dem verantwortlichen Eigentümer, bevor eine Konsolidierungsentscheidung umgesetzt wird.

### 6. Widersprüchliche Anforderung: Geschäftsführung will schnelle Kostensenkung durch aggressive Anwendungskonsolidierung UND Fachbereiche wollen keine tatsächlich noch benötigten Anwendungen verlieren — wie gehst du vor?

**Antwort:** Ich würde jede Konsolidierungsentscheidung verbindlich an eine fachliche Eigentümerbestätigung der Nutzenbewertung koppeln und nur Anwendungen mit fachlich bestätigt niedrigem Nutzen für schnelle Konsolidierung priorisieren, statt entweder pauschal aggressiv zu konsolidieren oder Kostensenkung vollständig zurückzustellen.

## Praktische Labs

~~~python
# Local, deterministic simulation of prioritizing consolidation candidates via benefit/risk/cost (executed locally, no real EA tool):

def prioritize_portfolio(apps):
    for app in apps:
        app["consolidation_score"] = app["risk"] + app["cost"] - app["benefit"]
    return sorted(apps, key=lambda a: a["consolidation_score"], reverse=True)

apps = [
    {"name": "LegacyBilling", "benefit": 2, "risk": 8, "cost": 7, "owner_confirmed": True},
    {"name": "CoreOrderMgmt", "benefit": 9, "risk": 6, "cost": 5, "owner_confirmed": True},
    {"name": "InternalWiki", "benefit": 3, "risk": 2, "cost": 2, "owner_confirmed": True},
]

for a in prioritize_portfolio(apps):
    print(a["name"], "score:", a["consolidation_score"])
~~~

## Dependencies, Cross-References und Quellen

1. The Open Group: [TOGAF Standard, 10th Edition — Application Portfolio Management](https://pubs.opengroup.org/togaf-standard/introduction/), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [IT Application Portfolio Management Overview](https://www.gartner.com/en/information-technology/glossary/application-portfolio-management-apm), abgerufen 2026-09-18.

Application Architecture im Unternehmen ist kanonisch in [KB-0591](03-application-architecture-im-unternehmen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Kosten- und Risikodatenerfassung aus Cloud-Billing- und Sicherheitsscanning-Systemen zur Ergänzung manuell gepflegter Portfoliobewertungen | Evaluating | Als kontinuierliche, aktuelle Datenquelle für Kosten- und Risikobewertung einsetzen, jedoch die Nutzenbewertung weiterhin als fachliche, menschliche Eigentümerentscheidung behandeln, da automatisierte Systeme den tatsächlichen Geschäftswert nicht zuverlässig ableiten können. |

Ein Team akzeptiert eine Application-Portfolio-Priorisierung erst, wenn Nutzen-, Risiko- und Kostenbewertung mit fachlicher Eigentümerbestätigung und dokumentierter, aktueller Datenqualität nachweislich vorliegen.
