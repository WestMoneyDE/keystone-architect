---
{"id": "KB-0460", "title": "Datenresidenz und Cloud-Platzierung", "domain": "18", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0441", "concepts": ["Cloud-Regionen und Availability Zones"], "needed_for": "understanding"}, {"id": "KB-0459", "concepts": ["Cloud-Backup-Strategien"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Die tatsächliche Platzierung von Primärdaten, Replikaten, Logs und Metadaten für eine konkrete Cloud-Ressource anhand offizieller Anbieterdokumentation nachvollziehen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung eine vollständige Datenplatzierungskarte erstellen, die Primärdaten, Replikate, Backups, Logs und Metadaten getrennt erfasst, und diese technische Karte explizit von der rechtlichen Bewertung trennen, die durch Fachjuristen erfolgen muss.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Datenresidenz-Abweichung auf eine übersehene Platzierung von Metadaten, Logs oder Replikaten außerhalb der angenommenen Region zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Datenresidenz-Governance-Richtlinien im Unternehmen als Zusammenarbeit zwischen technischer Platzierungsdokumentation und rechtlicher Bewertung etablieren, statt technische Aussagen als rechtliche Zusicherung auszugeben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die konkrete rechtliche Bewertung spezifischer Datenresidenz-Anforderungen (z. B. DSGVO-Auslegung) ist ausdrücklich nicht Gegenstand dieses technischen Kapitels und erfordert Fachjuristen.", "rationale": "Dieses Kapitel behandelt die technische Nachvollziehbarkeit der Datenplatzierung, nicht deren rechtliche Bewertung, die außerhalb der technischen Kompetenz liegt."}}, "lab_validation": [{"lab_id": "KB-0460-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Cloud-Anbieter-Dokumentation zu Datenplatzierung, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, dass Primärdaten, Replikate, Backups, Logs und Metadaten einer Cloud-Ressource jeweils unterschiedliche, unter Umständen von der Primärregion abweichende tatsächliche Speicherorte haben können, und warum eine vollständige, technische Platzierungskarte notwendig ist, bevor überhaupt eine rechtliche Bewertung der Datenresidenz-Konformität sinnvoll durchgeführt werden kann.", "limitations": "Kein aktives Cloud-Deployment getestet, keine reale Datenplatzierungskarte für ein konkretes System erstellt. Dieses Kapitel trifft ausdrücklich KEINE rechtliche Bewertung von Datenresidenz-Anforderungen (z. B. DSGVO) — dies erfordert Fachjuristen und liegt außerhalb der technischen Kompetenz dieses Dokuments."}]}
---
# Datenresidenz und Cloud-Platzierung

> **Ziel:** Datenresidenz beschreibt die Anforderung, dass bestimmte Daten nur in definierten geografischen oder rechtlichen Grenzen gespeichert oder verarbeitet werden dürfen — die technische Voraussetzung für die Einhaltung einer solchen Anforderung ist eine vollständige, nachvollziehbare Platzierungskarte, die nicht nur die Primärdaten (siehe Cloud-Regionen und Availability Zones, [KB-0441](01-cloud-regionen-und-availability-zones.md)), sondern auch Replikate, Backups (siehe [KB-0459](19-cloud-backup-strategien.md)), Logs und Metadaten getrennt erfasst, da diese unterschiedlichen Datenkategorien häufig an unterschiedlichen, teils von der Primärregion abweichenden Orten gespeichert werden. Der zentrale Punkt dieses Kapitels ist, dass die technische Dokumentation der tatsächlichen Datenplatzierung strikt von der rechtlichen Bewertung getrennt werden muss — dieses Kapitel liefert die technische Grundlage (wo liegen die Daten tatsächlich), trifft jedoch ausdrücklich keine rechtliche Bewertung, ob diese Platzierung eine bestimmte regulatorische Anforderung erfüllt, da eine solche Bewertung Fachjuristen vorbehalten ist und von der Technik allein nicht geleistet werden kann.

## Zweck, Mental Model und Dependencies

Wenn eine Anwendung in einer bestimmten Cloud-Region betrieben wird, bedeutet dies nicht automatisch, dass alle mit dieser Anwendung verbundenen Daten ausschließlich in dieser Region gespeichert werden — Primärdaten (die eigentlichen Anwendungsdaten) liegen üblicherweise tatsächlich in der gewählten Region, jedoch können Replikate für Hochverfügbarkeit (siehe [KB-0457](17-hochverfuegbarkeit-in-der-cloud.md)) in andere Regionen repliziert werden, Backups können in einem separaten, möglicherweise anders lokalisierten Konto gespeichert werden, Logs und Metriken werden häufig in einer zentralen, unternehmensweiten Logging-Infrastruktur gesammelt, die nicht notwendigerweise in derselben Region wie die Primärdaten liegt, und Metadaten (z. B. Konfigurationsdaten des Cloud-Anbieters selbst über die Ressource) können in einer vom Anbieter global verwalteten Kontrollebene gespeichert sein, unabhängig von der gewählten Datenregion. Eine vollständige Datenplatzierungskarte muss daher jede dieser Kategorien (Primärdaten, Replikate, Backups, Logs, Metadaten) getrennt erfassen und deren tatsächlichen Speicherort dokumentieren, statt anzunehmen, dass die Wahl einer Region für die primäre Ressource automatisch alle verbundenen Daten an denselben Ort bindet. Der zentrale methodische Punkt ist, dass diese technische Platzierungskarte eine notwendige, aber nicht hinreichende Voraussetzung für eine Datenresidenz-Konformitätsbewertung ist — die Frage, ob eine bestimmte, dokumentierte Platzierung tatsächlich eine konkrete regulatorische Anforderung (z. B. eine spezifische Datenschutzverordnung) erfüllt, ist eine rechtliche Bewertung, die technische Dokumentation als Grundlage benötigt, aber nicht durch technische Analyse allein beantwortet werden kann — dieses Dokument liefert daher ausschließlich die technische Grundlage, nicht die rechtliche Einordnung.

~~~text
Application runs in a specific cloud region -> does NOT automatically mean
  ALL associated data is stored EXCLUSIVELY in that region:
  primary data: usually actually in the chosen region
  replicas (HA, see KB-0457): may be replicated to OTHER regions
  backups (see KB-0459): may be in a SEPARATE, differently-located account
  logs/metrics: often collected in a CENTRAL, company-wide logging infra, not necessarily same region
  metadata: provider-managed control plane, potentially globally managed, independent of chosen data region
Complete data placement map MUST capture EACH category SEPARATELY
  never assume choosing a region for the primary resource binds ALL associated data to that place
KEY METHODOLOGICAL POINT: this technical map is NECESSARY but NOT SUFFICIENT
  for a data residency COMPLIANCE assessment
  -> whether a documented placement satisfies a SPECIFIC regulatory requirement
     is a LEGAL assessment, needing this technical documentation as input
     but NOT answerable by technical analysis alone
  -> this document provides ONLY the technical foundation, NOT the legal classification
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Primärdaten | eigentliche Anwendungsdaten in der gewählten Region | typischerweise, aber nicht garantiert, in der Primärregion |
| Replikate | Kopien für Hochverfügbarkeit/Multi-Region | können in anderen Regionen als die Primärdaten liegen |
| Backups | separat verwaltete Sicherungskopien | Speicherort kann vom Backup-Konto abhängig von der Primärregion abweichen |
| Logs und Metadaten | oft zentral, unternehmensweit gesammelt | Speicherort ist unabhängig von der Datenregion der Primärressource zu prüfen |

Implementierung: Für jede Anwendung mit einer tatsächlichen Datenresidenz-Anforderung wird eine vollständige Platzierungskarte erstellt, die den tatsächlichen Speicherort für jede der fünf Kategorien (Primärdaten, Replikate, Backups, Logs, Metadaten) getrennt dokumentiert, basierend auf der offiziellen Dokumentation des jeweiligen Cloud-Anbieters. Diese technische Platzierungskarte wird an das Rechts- oder Compliance-Team übergeben, das die tatsächliche rechtliche Bewertung vornimmt, statt dass technische Teams selbst eine rechtliche Konformitätsaussage treffen. Bei jeder Änderung an der Infrastruktur (z. B. Hinzufügen eines neuen Logging-Ziels oder einer neuen Replikationsregion) wird die Platzierungskarte aktualisiert, um sicherzustellen, dass die rechtliche Bewertung stets auf einer aktuellen, technisch verifizierten Grundlage basiert.

## Scalability, Reliability, Security und Observability

Datenresidenz-Transparenz skaliert die Verlässlichkeit einer Compliance-Bewertung proportional zur Vollständigkeit der technischen Platzierungskarte über alle fünf Datenkategorien hinweg; die Reliability-Grenze liegt darin, dass eine unvollständige Platzierungskarte (z. B. die Logs oder Metadaten nicht erfasst) proportional zur übersehenen Datenkategorie zu einer fehlerhaften, auf unvollständigen Informationen basierenden rechtlichen Bewertung führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Datenresidenz-Prüfung deckt eine unerwartete Platzierung von Daten außerhalb der angenommenen Region auf | Replikate, Backups, Logs oder Metadaten wurden bei der ursprünglichen Platzierungskarte nicht vollständig erfasst | eine vollständige, alle fünf Kategorien umfassende Platzierungskarte erstellen und die Diskrepanz identifizieren |
| technische Teams treffen unbeabsichtigt eine faktische rechtliche Aussage über Datenresidenz-Konformität | die Trennung zwischen technischer Dokumentation und rechtlicher Bewertung ist im Prozess nicht klar etabliert | einen expliziten Prozess einführen, der technische Dokumentation an das Rechts-/Compliance-Team zur eigenständigen Bewertung übergibt |
| die Platzierungskarte ist veraltet und entspricht nicht mehr der tatsächlichen Infrastruktur | Änderungen an der Infrastruktur wurden nicht in die Platzierungskarte übernommen | einen Prozess einführen, der die Platzierungskarte bei jeder relevanten Infrastrukturänderung aktualisiert |

Security: Eine vollständige Datenplatzierungskarte ist auch für Sicherheitsbewertungen relevant, da sie zeigt, welche Systeme und Regionen tatsächlich Zugriff auf welche Datenkategorien haben. Observability: Die Vollständigkeit und Aktualität der Datenplatzierungskarte sowie deren regelmäßige Übergabe an das Rechts-/Compliance-Team für Bewertung sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** erstellt eine vollständige, alle fünf Datenkategorien umfassende Platzierungskarte für Anwendungen mit Datenresidenz-Anforderungen. **Principal** macht die technische Platzierung und deren Grenzen für das Team nachvollziehbar, ohne eine rechtliche Bewertung selbst vorzunehmen. **Chief** etabliert Datenresidenz-Governance-Richtlinien im Unternehmen als Zusammenarbeit zwischen technischer Dokumentation und rechtlicher Bewertung.

Anti-Patterns: eine Datenresidenz-Prüfung nur anhand der Primärregion durchführen, ohne Replikate, Backups, Logs und Metadaten separat zu erfassen; technische Teams treffen eigenständige, faktische rechtliche Konformitätsaussagen, ohne Rücksprache mit Fachjuristen; die Platzierungskarte nach Infrastrukturänderungen nicht aktualisieren.

## Production Checklist

- [ ] Eine vollständige Platzierungskarte erfasst Primärdaten, Replikate, Backups, Logs und Metadaten getrennt.
- [ ] Die technische Platzierungskarte ist explizit von der rechtlichen Bewertung getrennt und wird an Fachjuristen/Compliance übergeben.
- [ ] Die Platzierungskarte wird bei jeder relevanten Infrastrukturänderung aktualisiert.
- [ ] Die Vollständigkeit der Platzierungskarte wird regelmäßig überprüft.

## Interviewfragen

### 1. Warum reicht die Wahl einer Cloud-Region für die Primärressource nicht aus, um Datenresidenz sicherzustellen?

**Antwort:** Weil Replikate, Backups, Logs und Metadaten häufig an unterschiedlichen, teils von der Primärregion abweichenden Orten gespeichert werden, die separat erfasst werden müssen.

### 2. Welche fünf Datenkategorien sollte eine vollständige Platzierungskarte erfassen?

**Antwort:** Primärdaten, Replikate, Backups, Logs und Metadaten, jeweils mit ihrem tatsächlichen, dokumentierten Speicherort.

### 3. Warum ist eine technische Platzierungskarte nicht ausreichend für eine Datenresidenz-Compliance-Aussage?

**Antwort:** Weil die Frage, ob eine dokumentierte Platzierung eine konkrete regulatorische Anforderung erfüllt, eine rechtliche Bewertung ist, die Fachjuristen vorbehalten ist und nicht durch technische Analyse allein beantwortet werden kann.

### 4. Wer sollte eine technische Datenplatzierungskarte für eine rechtliche Konformitätsbewertung nutzen?

**Antwort:** Das Rechts- oder Compliance-Team, das die technische Dokumentation als Grundlage für die eigenständige, rechtliche Bewertung heranzieht.

### 5. Wie gehst du vor, wenn eine Datenresidenz-Prüfung eine unerwartete Platzierung außerhalb der angenommenen Region aufdeckt?

**Antwort:** Ich erstelle eine vollständige, alle fünf Kategorien umfassende Platzierungskarte, um zu identifizieren, welche Kategorie (Replikate, Backups, Logs, Metadaten) bei der ursprünglichen Dokumentation übersehen wurde.

### 6. Widersprüchliche Anforderung: Geschäftsbereich will eine schnelle, technische Zusage, dass eine bestimmte Datenresidenz-Anforderung erfüllt ist, ohne auf eine rechtliche Bewertung zu warten — wie gehst du vor?

**Antwort:** Ich würde die vollständige, technische Platzierungskarte bereitstellen, aber klarstellen, dass eine verbindliche Konformitätsaussage eine rechtliche Bewertung erfordert, die ich als Techniker nicht eigenständig treffen kann, und eine zeitnahe Rücksprache mit dem Rechts-/Compliance-Team vorschlagen, statt eine faktische Zusage ohne rechtliche Grundlage zu geben.

## Praktische Labs

~~~python
# Conceptual data placement map completeness check (not executed against a real cloud account):

def check_placement_map_completeness(placement_map):
    """placement_map: {"primary_data": location, "replicas": [locations], "backups": location, "logs": location, "metadata": location}"""
    required_categories = ["primary_data", "replicas", "backups", "logs", "metadata"]
    missing = [cat for cat in required_categories if cat not in placement_map or not placement_map[cat]]
    return {"complete": len(missing) == 0, "missing_categories": missing}

placement_map = {
    "primary_data": "eu-central-1",
    "replicas": ["eu-west-1"],
    "backups": "eu-central-1",
    "logs": None,  # not documented -- gap
    "metadata": "global (provider-managed)",
}

result = check_placement_map_completeness(placement_map)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Data Residency Considerations](https://docs.aws.amazon.com/whitepapers/latest/aws-data-residency/data-residency-considerations.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Data Residency and Sovereignty](https://cloud.google.com/security/compliance/data-residency), abgerufen 2026-09-18.

Cloud-Regionen und Availability Zones sind kanonisch in [KB-0441](01-cloud-regionen-und-availability-zones.md) behandelt; Cloud-Backup-Strategien in [KB-0459](19-cloud-backup-strategien.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, providerseitige Datenplatzierungs-Nachweiswerkzeuge, die alle Datenkategorien einer Ressource zentral erfassen | Adopting | Gegenüber manueller Dokumentation bevorzugen, sobald die tatsächliche Vollständigkeit der automatischen Erfassung verifiziert ist. |

Ein Team akzeptiert eine Datenresidenz-Compliance-Aussage erst, wenn eine vollständige, technische Platzierungskarte erstellt und die rechtliche Bewertung durch Fachjuristen erfolgt ist — niemals ausschließlich auf Basis technischer Analyse allein.
