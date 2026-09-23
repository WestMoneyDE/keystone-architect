---
{"id": "KB-0237", "title": "Datenkataloge und Auffindbarkeit", "domain": "10", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0235", "concepts": ["Data Contracts"], "needed_for": "understanding"}, {"id": "KB-0236", "concepts": ["Data Lineage"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Katalog-Aktualitätsprüfung mit Staleness-Erkennung lokal implementieren.", "rationale": "Der Unterschied zwischen einem einmalig befüllten Inventar und einem aktiv gepflegten Katalog wird erst durch konkrete Aktualitätsprüfung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Metadaten-, Glossar- und Klassifikationsstruktur für einen konkreten Datenkatalog begründet gestalten, mit expliziter Verantwortungszuordnung.", "rationale": "Ein Katalog ohne strukturierte Metadaten und klare Verantwortlichkeit verkommt zu einem unzuverlässigen, veraltenden Inventar."}, "STAFF-TARGET": {"active": true, "scope": "Fehlgeleitete Datennutzung auf veraltete Katalogeinträge statt auf einen Nutzerfehler zurückführen können.", "rationale": "Ein Katalog, der nicht aktiv gepflegt wird, kann Nutzer aktiv in die Irre führen, wenn er veraltete, aber scheinbar autoritative Information zeigt."}, "CHIEF-TARGET": {"active": true, "scope": "Datenkataloge als aktiv gepflegte Auffindbarkeits- und Governance-Infrastruktur positionieren, nicht als einmalig erstelltes Tabelleninventar.", "rationale": "Der Wert eines Katalogs hängt direkt von seiner Aktualität ab — ein veralteter Katalog ist schlimmer als kein Katalog, weil er falsches Vertrauen erzeugt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Katalog-Werkzeugintegrationen und automatisierte Metadaten-Erfassungsmechanismen sind Vertiefung.", "rationale": "Kern ist das Prinzip von Metadaten, Klassifikation, Verantwortungszuordnung und Aktualitätspflege, nicht die Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0237-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Katalog-Aktualitätsprüfung (Staleness-Erkennung)", "evidence": "Katalogeinträge, die seit ihrer letzten Verifikation eine definierte Zeitspanne überschritten haben, werden als veraltet (stale) markiert, statt weiterhin unmarkiert als aktuell und vertrauenswürdig zu gelten.", "limitations": "Kein echtes Katalog-Werkzeug, keine reale Datenplattform, keine Produktion."}]}
---
# Datenkataloge und Auffindbarkeit

> **Ziel:** Ein Datenkatalog ist mehr als ein Tabelleninventar — er erfasst Metadaten, Glossarbegriffe und Verantwortliche, um Datensätze auffindbar und vertrauenswürdig zu machen. Der Wert hängt direkt von aktiver Aktualitätspflege ab: ein veralteter Katalog ist gefährlicher als kein Katalog, weil er Nutzer mit scheinbar autoritativer, aber tatsächlich überholter Information in die Irre führt.

## Zweck, Mental Model und Dependencies

Ein bloßes Tabelleninventar listet technische Existenz von Datensätzen (Tabellennamen, Spaltennamen, Datentypen) — ein echter Datenkatalog ergänzt das um semantische Metadaten (Glossarbegriffe, die technische Felder mit Geschäftsbedeutung verknüpfen, ähnlich der fachlichen Lineage in [KB-0236](18-data-lineage.md)), Klassifikation (Sensitivitätsstufe, Datenqualitätsstufe, Zonenzugehörigkeit) und explizite Verantwortliche (wer fachlich und technisch für einen Datensatz zuständig ist, ähnlich der Ownership-Prinzipien in Data Contracts, siehe [KB-0235](17-data-contracts.md)). Suche und Auffindbarkeit hängen davon ab, dass diese Metadaten tatsächlich strukturiert und durchsuchbar erfasst sind, nicht nur als unstrukturierte Freitext-Dokumentation existieren. Der zentrale Risikofaktor ist Aktualität: ein Katalogeintrag, der beim Erstellen korrekt war, aber seitdem nicht mehr verifiziert wurde, kann veraltete Information zeigen, die Nutzer als aktuell und vertrauenswürdig interpretieren — dieses stille Veralten ist gefährlicher als eine offensichtliche Lücke, weil es aktiv zu Fehlentscheidungen führen kann, statt bloß keine Hilfe zu bieten. Lies [KB-0235](17-data-contracts.md) und [KB-0236](18-data-lineage.md).

~~~text
Table inventory:    lists technical existence (names, types) -> no semantic meaning, no trust signal
Data catalog:        + glossary terms (business meaning) + classification + explicit ownership -> discoverable AND trustworthy
Stale catalog entry: was correct when created, never re-verified -> users trust outdated info -> WORSE than no catalog
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Strukturierte Metadaten | sind Metadaten strukturiert und durchsuchbar erfasst, nicht nur als Freitext? | unstrukturierte Dokumentation ist schlecht durchsuchbar und schwer konsistent zu halten |
| Glossarverknüpfung | sind technische Felder explizit mit Geschäftsbegriffen (Glossar) verknüpft? | ohne Glossarverknüpfung können Nutzer technische Felder nicht fachlich einordnen |
| Klassifikation | sind Sensitivitäts- und Qualitätsstufen für jeden Datensatz explizit erfasst? | fehlende Klassifikation erschwert korrekte Zugriffs- und Vertrauensentscheidungen |
| Aktualitätspflege | werden Katalogeinträge aktiv auf Aktualität geprüft, nicht nur einmalig erstellt? | veraltete, unmarkierte Einträge führen Nutzer aktiv in die Irre |

Implementierung: Metadaten werden in strukturierter, durchsuchbarer Form erfasst (z. B. standardisierte Felder für Beschreibung, Verantwortliche, Klassifikation), oft ergänzt durch automatisierte Extraktion aus Schema-Definitionen und Data Contracts, statt vollständig manuell gepflegt zu werden. Ein zentrales Geschäftsglossar verknüpft technische Feldnamen explizit mit Geschäftsbegriffen, sodass Nutzer über fachliche Suche technische Datensätze finden können. Klassifikation (Sensitivität, Qualitätsstufe, Zonenzugehörigkeit) wird für jeden katalogisierten Datensatz explizit erfasst, idealerweise automatisiert aus vorhandenen Quellen (z. B. Data Contracts) übernommen, statt manuell dupliziert. Aktualitätspflege erfolgt durch periodische Verifikationsprozesse (automatisiert oder durch explizite Verantwortliche), mit klarer Kennzeichnung veralteter (stale) Einträge, die seit einer definierten Zeitspanne nicht verifiziert wurden.

## Scalability, Reliability, Security und Observability

Datenkataloge skalieren Auffindbarkeit über wachsende Datenplattformen mit vielen Datensätzen, indem sie strukturierte Suche statt informeller Rücksprache mit Teams als primären Auffindbarkeitsmechanismus ermöglichen. Reliability-Grenze: ein Katalog ohne aktive Aktualitätspflege verschlechtert sich schleichend — bei der Einführung korrekte Einträge veralten unbemerkt, bis der Katalog mehr Fehlinformation als Nutzen liefert, ohne dass dieser Übergangspunkt für Nutzer erkennbar ist.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Team nutzt einen Datensatz basierend auf Katalog-Information, die sich als falsch herausstellt | Katalogeintrag ist veraltet (stale), wurde seit einer relevanten Änderung nicht aktualisiert | letzten Verifikationszeitpunkt des Katalogeintrags gegen den Zeitpunkt der tatsächlichen zugrunde liegenden Änderung prüfen |
| Nutzer können relevante Datensätze über fachliche Suchbegriffe nicht finden | Glossarverknüpfung zwischen technischen Feldern und Geschäftsbegriffen fehlt oder ist unvollständig | Glossarabdeckung für die gesuchten Geschäftsbegriffe gegen tatsächlich vorhandene technische Datensätze prüfen |
| ein Team greift versehentlich auf einen Datensatz mit höherer Sensitivität als angenommen zu | Klassifikation fehlt oder ist im Katalog nicht sichtbar dokumentiert | Klassifikationsfeld des betroffenen Datensatzes im Katalog auf Vollständigkeit prüfen |
| Katalognutzung nimmt über Zeit ab, Teams greifen wieder auf informelle Rücksprache zurück | Katalog wird als unzuverlässig wahrgenommen, wahrscheinlich durch akkumulierte veraltete Einträge | Anteil als "stale" markierter oder tatsächlich veralteter Einträge im Katalog messen |

Security: Klassifikationsinformation im Katalog selbst kann sensibel sein (sie offenbart, wo sensible Daten liegen) und sollte entsprechend zugriffsbeschränkt sein, während gleichzeitig ausreichend Transparenz für legitime Nutzer erhalten bleiben muss. Observability: Anteil aktueller versus veralteter (stale) Katalogeinträge, Suchnutzung und -erfolgsrate sowie Abdeckungsgrad (Anteil tatsächlich existierender Datensätze, die im Katalog erfasst sind) sind zentrale Metriken für Katalog-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** erfasst Metadaten strukturiert und durchsuchbar, statt unstrukturierter Freitext-Dokumentation. **Principal** macht Aktualitätsstatus von Katalogeinträgen für Nutzer-Teams explizit sichtbar, statt stillschweigend potenziell veraltete Information zu präsentieren. **Chief** positioniert Datenkataloge als aktiv gepflegte Auffindbarkeits- und Governance-Infrastruktur, nicht als einmalig erstelltes, dann sich selbst überlassenes Tabelleninventar.

Anti-Patterns: Katalog einmalig befüllen und danach nie wieder aktualisieren, wodurch Einträge unbemerkt veralten; Metadaten nur als unstrukturierte Freitext-Beschreibung ohne durchsuchbare Struktur erfassen; Klassifikation und Verantwortlichkeit nicht erfassen, wodurch der Katalog nur technische Existenz, aber keine Vertrauenswürdigkeit dokumentiert.

## Production Checklist

- [ ] Metadaten sind strukturiert und durchsuchbar erfasst.
- [ ] Technische Felder sind mit einem Geschäftsglossar verknüpft.
- [ ] Klassifikation (Sensitivität, Qualität, Zone) ist für jeden Datensatz explizit erfasst.
- [ ] Aktualitätspflege mit klarer Kennzeichnung veralteter Einträge ist etabliert.

## Interviewfragen

### 1. Was unterscheidet einen echten Datenkatalog von einem bloßen Tabelleninventar?

**Antwort:** Ein Tabelleninventar listet nur technische Existenz (Namen, Typen), während ein echter Datenkatalog zusätzlich semantische Metadaten (Glossarverknüpfung, Geschäftsbedeutung), Klassifikation (Sensitivität, Qualität) und explizite Verantwortliche erfasst, was Auffindbarkeit und Vertrauenswürdigkeit ermöglicht.

### 2. Warum kann ein veralteter Katalog schädlicher sein als gar kein Katalog?

**Antwort:** Ein veralteter Eintrag wird oft weiterhin als aktuell und autoritativ wahrgenommen, wodurch Nutzer Entscheidungen auf Basis überholter Information treffen — ohne Katalog würden sie zumindest wissen, dass sie keine verlässliche Information haben und entsprechend vorsichtiger vorgehen.

### 3. Warum ist eine Glossarverknüpfung für Auffindbarkeit wichtig?

**Antwort:** Nutzer suchen oft nach Geschäftsbegriffen, nicht nach technischen Feldnamen; ohne explizite Verknüpfung zwischen Geschäftsbegriffen und den zugrunde liegenden technischen Datensätzen können relevante Datensätze über fachliche Suche nicht gefunden werden.

### 4. Wie diagnostizierst du, dass ein Team basierend auf falscher Katalog-Information gehandelt hat?

**Antwort:** Ich prüfe den letzten Verifikationszeitpunkt des betroffenen Katalogeintrags gegen den Zeitpunkt der tatsächlichen zugrunde liegenden Datenänderung — eine Diskrepanz deutet auf einen veralteten (stale) Katalogeintrag hin, der nicht mit der Realität Schritt gehalten hat.

### 5. Warum ist Klassifikationsinformation im Katalog wichtig, und warum muss sie selbst zugriffsbeschränkt sein?

**Antwort:** Klassifikation (Sensitivität, Qualität) hilft Nutzern, korrekte Zugriffs- und Vertrauensentscheidungen zu treffen; sie muss aber selbst zugriffsbeschränkt sein, weil sie offenbart, wo sensible Daten liegen, was für einen Angreifer wertvolle Aufklärungsinformation darstellen könnte.

### 6. Widersprüchliche Anforderung: Team will einen vollständigen Katalog über alle historischen und aktuellen Datensätze UND minimalen manuellen Pflegeaufwand — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige, manuell gepflegte Abdeckung proportionalen Aufwand erfordert und ohne automatisierte Unterstützung nicht nachhaltig aktuell gehalten werden kann; ich würde vorschlagen, Metadaten so weit wie möglich automatisiert aus vorhandenen Quellen (Schema-Definitionen, Data Contracts) zu extrahieren und manuellen Aufwand auf fachliche Anreicherung (Glossarverknüpfung, Geschäftskontext) zu konzentrieren, die sich nicht automatisieren lässt.

## Praktische Labs

~~~python
from datetime import datetime, timedelta

# Catalog staleness detection model
catalog_entries = [
    {"table": "gold.customer_ltv", "last_verified": datetime(2026, 8, 1), "classification": "internal"},
    {"table": "gold.revenue_summary", "last_verified": datetime(2026, 9, 10), "classification": "confidential"},
    {"table": "silver.orders", "last_verified": datetime(2026, 3, 1), "classification": "internal"},  # long unverified
]

STALENESS_THRESHOLD_DAYS = 90
now = datetime(2026, 9, 17)

def check_staleness(entries, threshold_days, now):
    for entry in entries:
        age_days = (now - entry["last_verified"]).days
        status = "STALE" if age_days > threshold_days else "current"
        print(f"{entry['table']}: last verified {age_days} days ago -> {status}")

check_staleness(catalog_entries, STALENESS_THRESHOLD_DAYS, now)

stale_count = sum(1 for e in catalog_entries if (now - e["last_verified"]).days > STALENESS_THRESHOLD_DAYS)
assert stale_count == 1
print(f"{stale_count} entries flagged as stale - users are warned instead of trusting outdated information silently.")
~~~

## Dependencies, Cross-References und Quellen

1. DAMA International: [Data Management Body of Knowledge — Metadata Management](https://www.dama.org/cpages/body-of-knowledge), abgerufen 2026-09-17.
2. Linux Foundation: [OpenMetadata Documentation](https://docs.open-metadata.org/), abgerufen 2026-09-17.
3. Data Mesh Principles: [Data Discoverability](https://www.datamesh-architecture.com/), abgerufen 2026-09-17.

Data-Contract- und Lineage-Grundlagen sind kanonisch in [KB-0235](17-data-contracts.md) und [KB-0236](18-data-lineage.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte automatische Metadaten-Anreicherung (Beschreibungsvorschläge, Klassifikationserkennung) | Adopting | Als Ausgangspunkt für menschliche Verifikation nutzen, nicht als vollautomatischen Ersatz für fachliche Prüfung. |
| Aktive, automatisierte Staleness-Erkennung mit Benachrichtigung an dokumentierte Verantwortliche | Adopting | Standardmäßig einsetzen, um manuelle, unregelmäßige Aktualitätsprüfung zu ersetzen. |

Ein Team akzeptiert ein Datenkatalog-Design erst, wenn strukturierte Metadaten, Glossarverknüpfung und aktive Aktualitätspflege nachweisbar etabliert sind.
