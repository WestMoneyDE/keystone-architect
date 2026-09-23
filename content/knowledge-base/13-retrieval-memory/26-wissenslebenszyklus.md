---
{"id": "KB-0330", "title": "Wissenslebenszyklus", "domain": "13", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0328", "concepts": ["Enterprise Search"], "needed_for": "understanding"}, {"id": "KB-0317", "concepts": ["Zitationen und Provenienz"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Wissenslebenszyklus-Modell implementieren, das einen Dokumenteintrag von Ingestion über Review bis zum Veralten und Löschen mit fachlicher Ownership-Zuordnung führt.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Wissenslebenszyklus-Architektur gestalten, die messbare Aktualität als expliziten Qualitätsindikator behandelt, statt Aktualität implizit anzunehmen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine systematisch veraltete Wissensbasis auf fehlende fachliche Ownership-Zuordnung statt auf ein allgemeines Pflegeproblem zurückführen können.", "rationale": "Ohne klare fachliche Verantwortung für die Aktualität eines Wissenseintrags bleibt unklar, wer für dessen Überprüfung und Aktualisierung zuständig ist, was zu systematischer Veraltung führen kann."}, "CHIEF-TARGET": {"active": true, "scope": "Wissenslebenszyklus als organisatorisches, nicht nur technisches Problem positionieren, das fachliche Ownership und messbare Aktualitätsindikatoren erfordert, nicht nur eine technische Indexierungspipeline.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Workflow-Tool-Implementierungsdetails für Review-Prozesse sind Vertiefung.", "rationale": "Kern ist das Prinzip fachlicher Ownership und messbarer Aktualität über den gesamten Lebenszyklus, nicht das konkrete Workflow-Werkzeug."}}, "lab_validation": [{"lab_id": "KB-0330-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell eines Wissenslebenszyklus mit Ownership-Zuordnung und messbarem Aktualitätsindikator", "evidence": "Ein Wissenseintrag ohne zugewiesenen fachlichen Owner überschreitet unbemerkt seine erwartete Überprüfungsfrist, während ein Eintrag mit zugewiesenem Owner eine explizite Erinnerung zur Überprüfung auslöst, bevor die Aktualität als fraglich gilt.", "limitations": "Kein echtes Workflow-System, kein produktives System, keine reale organisatorische Struktur."}]}
---
# Wissenslebenszyklus

> **Ziel:** Ein Wissenslebenszyklus organisiert Ingestion (Aufnahme neuer Wissensinhalte, aufbauend auf Enterprise Search, siehe [KB-0328](24-enterprise-search.md)), Review (fachliche Prüfung auf Korrektheit und Relevanz), Veralten (systematische Erkennung, wann ein Eintrag nicht mehr aktuell ist) und Löschen (kontrollierte Entfernung veralteter oder nicht mehr relevanter Inhalte) als zusammenhängenden Prozess. Der zentrale Punkt ist, dass dieser Lebenszyklus fachliche Ownership (eine konkrete, verantwortliche Person oder Rolle für jeden Wissensbereich) und messbare Aktualität (ein expliziter, überprüfbarer Indikator, wie aktuell ein Eintrag tatsächlich ist) benötigt — ohne diese beiden Elemente bleibt der Lebenszyklus eine rein technische Indexierungspipeline ohne organisatorische Verankerung.

## Zweck, Mental Model und Dependencies

Ingestion nimmt neue Wissensinhalte in das System auf (technisch über Enterprise-Search-Connectoren, siehe [KB-0328](24-enterprise-search.md)). Review ist die fachliche Prüfung eines Wissensinhalts durch eine Person mit tatsächlicher fachlicher Expertise, die dessen Korrektheit und Relevanz bestätigt oder Korrekturbedarf identifiziert. Veralten bedeutet, dass ein einmal korrekter Wissensinhalt durch Zeitablauf oder durch eine Änderung der zugrunde liegenden Realität nicht mehr zutreffend ist — dieser Zustand tritt nicht automatisch offensichtlich ein, sondern muss aktiv über Aktualitätsindikatoren erkannt werden. Löschen ist die kontrollierte Entfernung eines Wissensinhalts, der veraltet oder nicht mehr relevant ist, idealerweise mit Nachvollziehbarkeit über den Grund der Entfernung (verwandt mit vollständiger Löschung bei Langzeitgedächtnis, siehe [KB-0322](18-langzeitgedaechtnis.md)). Der zentrale, oft übersehene organisatorische Fehler ist, den Wissenslebenszyklus rein technisch zu betrachten (eine Indexierungspipeline, die Inhalte automatisch verarbeitet), ohne fachliche Ownership zuzuweisen: ohne eine konkrete, verantwortliche Person oder Rolle für jeden Wissensbereich bleibt unklar, wer tatsächlich für die Überprüfung und Aktualisierung eines Wissensinhalts zuständig ist, was systematisch zu unbemerkter Veraltung führen kann. Messbare Aktualität bedeutet, dass für jeden Wissensinhalt ein expliziter, überprüfbarer Indikator existiert (z. B. Zeit seit letzter Überprüfung, Anzahl seither erfolgter relevanter Änderungen in der Quelle), statt Aktualität implizit oder subjektiv anzunehmen.

~~~text
Ingestion: new content enters system (via connectors, KB-0328)
Review: SUBJECT-MATTER expert confirms correctness/relevance, or flags need for correction
Staleness: content no longer accurate due to time/reality change -> NOT self-evident, must be ACTIVELY detected via indicators
Deletion: controlled removal of stale/irrelevant content, with traceable reason (like complete deletion, KB-0322)
CRITICAL ORGANIZATIONAL ERROR: treating lifecycle as PURELY TECHNICAL (an indexing pipeline)
  -> without assigned OWNERSHIP, unclear WHO is responsible for review/update -> systematic unnoticed staleness
Measurable freshness: EXPLICIT, checkable indicator per content item (time since review, source change count)
  -> NOT implicit/subjective assumption of "probably still current"
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite fachliche Ownership pro Wissensbereich | ist für jeden Wissensbereich eine konkrete, verantwortliche Person oder Rolle zugewiesen, die für dessen Aktualität zuständig ist? | ohne Ownership bleibt unklar, wer für die Überprüfung und Aktualisierung eines Wissensinhalts verantwortlich ist |
| Messbarer Aktualitätsindikator pro Eintrag | existiert für jeden Wissenseintrag ein expliziter, überprüfbarer Indikator seiner tatsächlichen Aktualität? | ohne diesen Indikator kann Aktualität nur subjektiv angenommen, aber nicht objektiv überprüft werden |
| Systematischer Review-Prozess statt einmaliger Prüfung | wird ein Wissenseintrag regelmäßig, nicht nur einmalig bei Ingestion, fachlich überprüft? | ohne regelmäßige Wiederholung des Reviews kann ein einmal korrekter Eintrag über Zeit unbemerkt veralten |
| Kontrollierte, nachvollziehbare Löschung | wird eine Löschung mit nachvollziehbarem Grund dokumentiert, statt Inhalte spurlos zu entfernen? | eine spurlose Löschung erschwert die spätere Nachvollziehbarkeit, warum ein bestimmter Inhalt entfernt wurde |

Implementierung: Jedem Wissensbereich wird eine konkrete, fachlich zuständige Person oder Rolle als Owner zugewiesen, die für die regelmäßige Überprüfung und Aktualisierung verantwortlich ist. Jeder Wissenseintrag erhält einen expliziten Aktualitätsindikator (z. B. Zeitstempel der letzten fachlichen Überprüfung, Vergleich mit der Änderungsfrequenz der Quelle), der objektiv auswertbar ist, statt Aktualität implizit anzunehmen. Ein systematischer Review-Prozess löst in regelmäßigen, an die Änderungsfrequenz des jeweiligen Wissensbereichs angepassten Intervallen eine erneute fachliche Prüfung aus, statt sich auf eine einmalige Prüfung bei Ingestion zu verlassen. Löschungen werden mit einem nachvollziehbaren Grund dokumentiert und, wo relevant, mit dem verantwortlichen Owner abgestimmt, statt Inhalte ohne Nachvollziehbarkeit zu entfernen.

## Scalability, Reliability, Security und Observability

Ein Wissenslebenszyklus mit fachlicher Ownership skaliert die tatsächliche Aktualität eines Wissenssystems proportional zur Konsequenz der Ownership-Zuweisung; die Reliability-Grenze liegt in einer rein technischen Betrachtung ohne Ownership, die mit wachsendem Wissensbestand proportional mehr unbemerkt veraltete Bereiche erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Wissensbereich enthält systematisch veraltete Information, die niemandem auffällt | fehlende fachliche Ownership-Zuweisung für den betroffenen Wissensbereich | prüfen, ob dem betroffenen Wissensbereich ein konkreter, verantwortlicher Owner zugewiesen ist |
| ein Wissenseintrag wird als aktuell behandelt, obwohl er tatsächlich seit langem nicht überprüft wurde | fehlender oder nicht überprüfter Aktualitätsindikator für den betroffenen Eintrag | den tatsächlichen Zeitpunkt der letzten fachlichen Überprüfung gegen den erwarteten Review-Zyklus prüfen |
| eine gelöschte Information lässt sich nicht nachvollziehen, warum sie entfernt wurde | fehlende Dokumentation des Löschgrunds | prüfen, ob für die betroffene Löschung ein nachvollziehbarer Grund dokumentiert wurde |

Security: Ein Wissenslebenszyklus, der veraltete, aber weiterhin zugängliche Information nicht systematisch erkennt und aktualisiert, kann zu fehlerhaften, auf veralteter Information basierenden Entscheidungen führen — dies ist besonders kritisch bei sicherheits- oder compliance-relevanten Wissensinhalten. Observability: Anteil von Wissenseinträgen mit zugewiesener Ownership, durchschnittliche Zeit seit letzter fachlicher Überprüfung pro Wissensbereich und Häufigkeit dokumentierter, nachvollziehbarer Löschungen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** weist jedem Wissensbereich eine konkrete fachliche Ownership zu und implementiert messbare Aktualitätsindikatoren. **Principal** macht Review-Zyklen und Löschgründe für das Team nachvollziehbar dokumentiert. **Chief** positioniert den Wissenslebenszyklus als organisatorisches, nicht nur technisches Problem, das fachliche Verantwortung erfordert.

Anti-Patterns: einen Wissenslebenszyklus rein technisch als automatisierte Indexierungspipeline ohne fachliche Ownership betreiben; Aktualität implizit annehmen, ohne einen expliziten, überprüfbaren Indikator zu führen; Wissenseinträge ohne dokumentierten Grund spurlos löschen.

## Production Checklist

- [ ] Jeder Wissensbereich hat eine konkrete, zugewiesene fachliche Ownership.
- [ ] Jeder Wissenseintrag hat einen expliziten, überprüfbaren Aktualitätsindikator.
- [ ] Ein systematischer, regelmäßiger Review-Prozess ist etabliert, nicht nur eine einmalige Prüfung bei Ingestion.
- [ ] Löschungen werden mit nachvollziehbarem Grund dokumentiert.

## Interviewfragen

### 1. Warum reicht eine rein technische Indexierungspipeline für einen Wissenslebenszyklus nicht aus?

**Antwort:** Ohne fachliche Ownership bleibt unklar, wer für die Überprüfung und Aktualisierung eines Wissensbereichs tatsächlich verantwortlich ist, was zu systematischer, unbemerkter Veraltung führen kann.

### 2. Was ist ein messbarer Aktualitätsindikator, und warum ist er notwendig?

**Antwort:** Ein expliziter, überprüfbarer Wert (z. B. Zeit seit letzter Überprüfung), der objektiv auswertbar macht, wie aktuell ein Wissenseintrag tatsächlich ist, statt Aktualität nur implizit anzunehmen.

### 3. Warum sollte Review ein wiederholter, nicht nur einmaliger Prozess sein?

**Antwort:** Ein einmal korrekter Eintrag kann über Zeit durch Änderungen in der zugrunde liegenden Realität veralten; ein systematischer, wiederholter Review-Prozess erkennt diese Veraltung, während eine einmalige Prüfung dies nicht leistet.

### 4. Warum sollte eine Löschung mit nachvollziehbarem Grund dokumentiert werden?

**Antwort:** Ohne Dokumentation lässt sich später nicht nachvollziehen, warum ein bestimmter Wissensinhalt entfernt wurde, was die Bewertung der Angemessenheit der Löschung erschwert.

### 5. Wie diagnostizierst du einen systematisch veralteten Wissensbereich?

**Antwort:** Ich prüfe, ob dem betroffenen Wissensbereich eine konkrete fachliche Ownership zugewiesen ist und ob der tatsächliche Zeitpunkt der letzten Überprüfung dem erwarteten Review-Zyklus entspricht.

### 6. Widersprüchliche Anforderung: Team will minimalen Pflegeaufwand durch möglichst seltene Reviews UND garantiert stets aktuelle Wissensinhalte — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich direkt widersprechen, wenn Reviews pauschal selten stattfinden; ich würde vorschlagen, die Review-Frequenz an die tatsächliche Änderungsfrequenz jedes Wissensbereichs anzupassen, sodass häufig sich ändernde Bereiche öfter, stabile Bereiche seltener überprüft werden, statt eine einheitliche, für alle Bereiche unpassende Frequenz zu verwenden.

## Praktische Labs

~~~python
# Knowledge lifecycle with ownership and measurable freshness indicator
import time

knowledge_base = {}

def ingest(entry_id, content, owner, review_interval_seconds):
    knowledge_base[entry_id] = {
        "content": content, "owner": owner,
        "last_reviewed": time.time(), "review_interval_seconds": review_interval_seconds,
    }

def check_freshness(entry_id, now):
    entry = knowledge_base.get(entry_id)
    if entry is None:
        return "No such entry"
    age = now - entry["last_reviewed"]
    if age > entry["review_interval_seconds"]:
        return f"STALE: '{entry_id}' overdue for review by owner '{entry['owner']}' (age={age:.0f}s, limit={entry['review_interval_seconds']}s)"
    return f"Fresh: '{entry_id}' last reviewed {age:.0f}s ago by '{entry['owner']}'"

def delete_with_reason(entry_id, reason):
    if entry_id in knowledge_base:
        del knowledge_base[entry_id]
        return f"Deleted '{entry_id}' — reason: {reason}"
    return "No such entry"

start = time.time()
ingest("pricing_policy", "Standard tier: $10/month", owner="pricing-team", review_interval_seconds=30)

print(check_freshness("pricing_policy", now=start + 10))
print(check_freshness("pricing_policy", now=start + 45))
print(delete_with_reason("pricing_policy", reason="Superseded by updated 2027 pricing policy document"))
~~~

## Dependencies, Cross-References und Quellen

1. AIIM: [Information Governance and Content Lifecycle Management](https://www.aiim.org/what-is-information-governance), abgerufen 2026-09-17.
2. Glean: [Enterprise Search Architecture and Permissions](https://www.glean.com/blog/enterprise-search-architecture), abgerufen 2026-09-17.
3. NIST: [SP 800-92 — Guide to Computer Security Log Management](https://csrc.nist.gov/pubs/sp/800/92/final), abgerufen 2026-09-17.

Enterprise Search ist kanonisch in [KB-0328](24-enterprise-search.md) behandelt; Zitationen und Provenienz in [KB-0317](13-zitationen-und-provenienz.md); Langzeitgedächtnis (Löschprinzipien) in [KB-0322](18-langzeitgedaechtnis.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Aktualitätsbewertung, die Quellenänderungsfrequenz nutzt, um Review-Intervalle dynamisch statt statisch zu bestimmen | Emerging | Beobachten; würde Review-Frequenz bedarfsgerechter gestalten, aber noch nicht breit etabliert. |
| Workflow-Integrationen, die fällige Reviews automatisch an den zugewiesenen fachlichen Owner eskalieren | Adopting | Gegenüber rein manueller Nachverfolgung für zuverlässigere Durchsetzung der Ownership-Verantwortung bevorzugen. |

Ein Team akzeptiert eine Wissenslebenszyklus-Architektur erst, wenn fachliche Ownership, messbare Aktualitätsindikatoren und ein systematischer Review-Prozess dokumentiert und getestet sind.
