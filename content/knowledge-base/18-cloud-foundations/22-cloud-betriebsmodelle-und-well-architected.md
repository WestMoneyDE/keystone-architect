---
{"id": "KB-0462", "title": "Cloud-Betriebsmodelle und Well-Architected", "domain": "18", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0442", "concepts": ["Shared Responsibility"], "needed_for": "understanding"}, {"id": "KB-0450", "concepts": ["Landing Zones"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Well-Architected-Reviewfrage für eine konkrete Anwendung anhand offizieller Dokumentation konkret beantworten können und die Antwort mit einer nachvollziehbaren Verbesserungsentscheidung verknüpfen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation eine Verantwortungsverteilung zwischen Plattform-, Produkt- und Governance-Teams gestalten, die mit Well-Architected-Prinzipien konsistent ist und Risikoakzeptanz-Entscheidungen nachvollziehbar dokumentiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unbeachtete Well-Architected-Empfehlung auf eine fehlende, explizite Ownership-Zuordnung für deren Umsetzung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Cloud-Betriebsmodell-Richtlinien im Unternehmen anhand konkreter, nachvollziehbarer Risikoakzeptanz- und Verbesserungs-Ownership-Entscheidungen statt anhand einer unverbindlichen Best-Practice-Checkliste festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige Detailtiefe aller Well-Architected-Säulen eines spezifischen Cloud-Anbieters im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Anwendung als konkrete Reviewfragen mit nachvollziehbarer Ownership, nicht die vollständige Checklisten-Interna eines spezifischen Frameworks."}}, "lab_validation": [{"lab_id": "KB-0462-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Well-Architected-Framework-Dokumentation, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie Well-Architected-Frameworks konkrete Reviewfragen zu Säulen wie Reliability, Security und Kosten stellen, wie ein Cloud-Betriebsmodell Verantwortung zwischen Plattform-, Produkt- und Governance-Teams verteilt, und warum eine unbeantwortete Well-Architected-Empfehlung ohne explizite Ownership-Zuordnung typischerweise folgenlos bleibt.", "limitations": "Kein aktives Cloud-Deployment getestet, kein realer Well-Architected-Review durchgeführt."}]}
---
# Cloud-Betriebsmodelle und Well-Architected

> **Ziel:** Ein Cloud-Betriebsmodell verteilt Verantwortung zwischen drei Rollen — Plattform-Teams (betreiben gemeinsam genutzte Infrastruktur wie Landing Zones, siehe [KB-0450](10-landing-zones.md)), Produkt-Teams (entwickeln und betreiben die eigentlichen Anwendungen auf dieser Plattform), und Governance (definiert übergreifende Richtlinien und prüft deren Einhaltung) — während Well-Architected-Frameworks (systematische Reviewfragen entlang mehrerer Säulen wie Reliability, Security, Kosteneffizienz) eine strukturierte Methode bereitstellen, um die Qualität einer konkreten Architektur zu bewerten. Der zentrale Punkt dieses Kapitels ist, dass Well-Architected-Prinzipien nur dann tatsächlich wirksam sind, wenn sie als konkrete, beantwortbare Reviewfragen mit einer klaren, nachvollziehbaren Ownership für die resultierende Verbesserungsentscheidung angewendet werden — ein Framework, das lediglich als unverbindliche Checkliste behandelt wird, ohne dass jede identifizierte Lücke einem konkreten Team zur Risikoakzeptanz oder Behebung zugeordnet wird, bleibt typischerweise folgenlos, unabhängig davon, wie detailliert die zugrunde liegenden Fragen sind.

## Zweck, Mental Model und Dependencies

Ein Well-Architected-Review stellt für eine konkrete Anwendung systematische Fragen entlang definierter Säulen (z. B. "Wie wird sichergestellt, dass die Anwendung einen Ausfall einer Availability Zone übersteht?", "Wie werden Zugriffsrechte nach dem Prinzip geringster Berechtigung vergeben?", siehe Cloud-IAM-Grundarchitektur, [KB-0444](04-cloud-iam-grundarchitektur.md)) — jede Frage sollte eine konkrete, überprüfbare Antwort haben, nicht eine allgemeine Zustimmung zum zugrunde liegenden Prinzip. Wenn eine Reviewfrage eine Lücke aufdeckt (z. B. "die Anwendung übersteht derzeit keinen Ausfall einer Availability Zone"), muss diese Lücke einem konkreten Entscheidungsprozess zugeführt werden — entweder wird ein Team explizit mit der Behebung beauftragt (mit einer nachvollziehbaren Priorisierung und einem Zeitrahmen), oder das identifizierte Risiko wird bewusst und dokumentiert akzeptiert (Risikoakzeptanz, mit einer explizit benannten, verantwortlichen Person oder Rolle, die diese Akzeptanz trägt). Das Cloud-Betriebsmodell bestimmt, wer für welche Art von Lücke tatsächlich zuständig ist — eine plattformweite Lücke (z. B. eine fehlende, übergreifende Verschlüsselungsrichtlinie) liegt typischerweise in der Verantwortung des Plattform-Teams oder der Governance, während eine anwendungsspezifische Lücke (z. B. fehlende Multi-AZ-Konfiguration einer bestimmten Datenbank) in der Verantwortung des jeweiligen Produkt-Teams liegt. Der zentrale methodische Punkt ist, dass ein Well-Architected-Framework ohne diese explizite Verknüpfung mit Ownership und Risikoakzeptanz zu einer bloßen Dokumentationsübung verkommt — Reviewfragen werden beantwortet, Lücken werden identifiziert, aber ohne eine klare, nachvollziehbare Zuordnung, wer für die Behebung oder die bewusste Akzeptanz des Risikos verantwortlich ist, bleiben identifizierte Probleme typischerweise unadressiert.

~~~text
Well-Architected review: systematic questions per pillar (Reliability, Security, Cost, etc.)
  EACH question needs a CONCRETE, verifiable answer -- not general agreement with the underlying principle
Gap identified (e.g. "app doesn't survive an AZ outage") -> MUST feed into a decision process:
  EITHER a team is EXPLICITLY tasked with remediation (traceable priority + timeframe)
  OR the risk is CONSCIOUSLY, DOCUMENTED accepted (named responsible person/role)
Cloud operating model determines WHO owns WHICH kind of gap:
  platform-wide gap (e.g. missing encryption-at-rest policy) -> platform team / governance
  app-specific gap (e.g. one DB missing multi-AZ config) -> that product team
KEY METHODOLOGICAL POINT: Well-Architected WITHOUT this explicit ownership/risk-acceptance link
  degenerates into a mere DOCUMENTATION exercise
  -> gaps identified but stay UNADDRESSED without clear, traceable remediation-or-acceptance ownership
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Well-Architected-Reviewfrage | konkrete, überprüfbare Bewertung eines Architekturaspekts | muss eine spezifische, nicht nur allgemeine Antwort haben |
| Plattform-Verantwortung | gemeinsam genutzte Infrastruktur, plattformweite Richtlinien | zuständig für plattformweite, nicht anwendungsspezifische Lücken |
| Produkt-Verantwortung | Entwicklung und Betrieb der einzelnen Anwendung | zuständig für anwendungsspezifische Lücken |
| Risikoakzeptanz | bewusste, dokumentierte Entscheidung, ein identifiziertes Risiko nicht zu beheben | erfordert eine explizit benannte, verantwortliche Rolle |

Implementierung: Für jede kritische Anwendung wird ein Well-Architected-Review mit konkreten, spezifischen Antworten auf jede Reviewfrage durchgeführt, statt eine allgemeine Zustimmung zu den zugrunde liegenden Prinzipien zu dokumentieren. Jede identifizierte Lücke wird explizit entweder einem Team mit einem nachvollziehbaren Zeitrahmen zur Behebung zugeordnet, oder als bewusst akzeptiertes Risiko mit einer explizit benannten, verantwortlichen Person dokumentiert. Das Cloud-Betriebsmodell wird so gestaltet, dass für jede Art von Lücke (plattformweit versus anwendungsspezifisch) eindeutig geklärt ist, welches Team tatsächlich zuständig ist, statt Verantwortung implizit unzugeordnet zu lassen.

## Scalability, Reliability, Security und Observability

Well-Architected-Reviews skalieren die tatsächliche Architekturqualität proportional zur Vollständigkeit der Ownership-Zuordnung für identifizierte Lücken; die Reliability-Grenze liegt darin, dass eine Reviewfrage ohne nachfolgende, explizite Ownership-Zuordnung proportional zur Anzahl unbeantworteter Verantwortungsfragen zu einer identifizierten, aber folgenlos bleibenden Lücke führt, die im Ernstfall (z. B. bei einem tatsächlichen Ausfall) zu einem vermeidbaren Vorfall wird.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine bereits in einem früheren Review identifizierte Lücke ist weiterhin ungelöst | die Lücke wurde keinem konkreten Team zur Behebung zugeordnet, und es gab keine dokumentierte Risikoakzeptanz | eine explizite Ownership-Zuordnung für die Lücke nachträglich herstellen |
| bei einem tatsächlichen Vorfall stellt sich heraus, dass ein bekanntes Risiko nie explizit akzeptiert wurde | die Risikoakzeptanz wurde implizit angenommen, ohne eine formale, dokumentierte Entscheidung | einen verbindlichen Prozess für explizite, dokumentierte Risikoakzeptanz einführen |
| eine plattformweite Lücke wird fälschlich von einem einzelnen Produkt-Team behoben, statt zentral gelöst zu werden | die Verantwortungsverteilung zwischen Plattform- und Produkt-Team für plattformweite Lücken ist unklar | das Cloud-Betriebsmodell explizit klären, welches Team für plattformweite versus anwendungsspezifische Lücken zuständig ist |

Security: Sicherheitsrelevante Well-Architected-Lücken sollten priorisiert und mit besonders kurzen, nachvollziehbaren Fristen für Behebung oder explizite Risikoakzeptanz versehen werden, da eine unadressierte Sicherheitslücke ein direktes, potenziell schwerwiegendes Risiko darstellt. Observability: Die tatsächliche Anzahl identifizierter, aber noch nicht adressierter Lücken, deren zugeordnete Ownership, und die Einhaltung dokumentierter Behebungsfristen sind zentrale Metriken zur Bewertung der tatsächlichen Wirksamkeit des Well-Architected-Prozesses.

## Trade-offs und Entscheidungen

**Staff** beantwortet Well-Architected-Reviewfragen konkret und ordnet identifizierte Lücken explizit einem Team oder einer Risikoakzeptanz zu. **Principal** macht die Verantwortungsverteilung zwischen Plattform, Produkt und Governance für das Team nachvollziehbar. **Chief** legt Cloud-Betriebsmodell-Richtlinien im Unternehmen anhand konkreter, nachvollziehbarer Risikoakzeptanz- und Verbesserungs-Ownership-Entscheidungen fest.

Anti-Patterns: ein Well-Architected-Review als reine Dokumentationsübung ohne nachfolgende, explizite Ownership-Zuordnung für identifizierte Lücken durchführen; Risiken implizit akzeptieren, ohne eine formale, dokumentierte Entscheidung mit benannter, verantwortlicher Rolle zu treffen; die Verantwortungsverteilung zwischen Plattform- und Produkt-Team für unterschiedliche Lückentypen ungeklärt lassen.

## Production Checklist

- [ ] Jede Well-Architected-Reviewfrage hat eine konkrete, überprüfbare Antwort, nicht nur eine allgemeine Zustimmung.
- [ ] Jede identifizierte Lücke ist entweder einem Team mit Zeitrahmen zugeordnet oder als dokumentierte Risikoakzeptanz mit benannter Rolle erfasst.
- [ ] Die Verantwortungsverteilung zwischen Plattform-, Produkt- und Governance-Teams ist für plattformweite versus anwendungsspezifische Lücken geklärt.
- [ ] Der Status offener Lücken und deren Ownership wird regelmäßig nachverfolgt.

## Interviewfragen

### 1. Was unterscheidet eine wirksame Well-Architected-Reviewfrage von einer unverbindlichen Checkliste?

**Antwort:** Eine wirksame Reviewfrage erfordert eine konkrete, überprüfbare Antwort für die spezifische Anwendung, während eine unverbindliche Checkliste nur eine allgemeine Zustimmung zum zugrunde liegenden Prinzip dokumentiert, ohne tatsächliche Verbesserung zu erzwingen.

### 2. Was muss passieren, wenn eine Reviewfrage eine Lücke aufdeckt?

**Antwort:** Die Lücke muss entweder einem konkreten Team mit nachvollziehbarem Zeitrahmen zur Behebung zugeordnet werden, oder als bewusst akzeptiertes Risiko mit explizit benannter, verantwortlicher Rolle dokumentiert werden.

### 3. Wie verteilt ein Cloud-Betriebsmodell typischerweise die Verantwortung für unterschiedliche Lückentypen?

**Antwort:** Plattformweite Lücken (z. B. fehlende übergreifende Richtlinien) liegen typischerweise in der Verantwortung des Plattform-Teams oder der Governance, während anwendungsspezifische Lücken in der Verantwortung des jeweiligen Produkt-Teams liegen.

### 4. Warum degeneriert ein Well-Architected-Framework ohne explizite Ownership-Verknüpfung zu einer bloßen Dokumentationsübung?

**Antwort:** Weil identifizierte Lücken ohne eine klare, nachvollziehbare Zuordnung, wer für Behebung oder Risikoakzeptanz verantwortlich ist, typischerweise unadressiert bleiben, unabhängig davon, wie detailliert die Reviewfragen selbst waren.

### 5. Wie gehst du vor, wenn eine bereits früher identifizierte Lücke weiterhin ungelöst ist?

**Antwort:** Ich prüfe, ob die Lücke jemals einem konkreten Team zur Behebung zugeordnet oder formal als Risiko akzeptiert wurde, und stelle diese explizite Ownership-Zuordnung nachträglich her.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Well-Architected-Reviews (allgemeine Checkliste abhaken) UND tatsächliche, messbare Verbesserung der Architekturqualität — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine rein abgehakte Checkliste keine tatsächliche Verbesserung erzeugt, und einen fokussierten, aber verbindlichen Prozess vorschlagen, der weniger, dafür konkret beantwortete Reviewfragen mit expliziter Ownership-Zuordnung für jede identifizierte Lücke kombiniert, statt Breite über tatsächliche Wirksamkeit zu stellen.

## Praktische Labs

~~~python
# Conceptual Well-Architected gap ownership tracking (not executed against a real review):

def check_gap_ownership(gaps):
    """gaps: list of {"question": str, "gap_found": bool, "assigned_team": str or None, "risk_accepted_by": str or None}"""
    unaddressed = [
        g["question"] for g in gaps
        if g["gap_found"] and g["assigned_team"] is None and g["risk_accepted_by"] is None
    ]
    return {"fully_addressed": len(unaddressed) == 0, "unaddressed_gaps": unaddressed}

gaps = [
    {"question": "Does the app survive an AZ outage?", "gap_found": True, "assigned_team": "product-team-a", "risk_accepted_by": None},
    {"question": "Is least-privilege enforced for service accounts?", "gap_found": True, "assigned_team": None, "risk_accepted_by": None},  # unaddressed
    {"question": "Are backups tested regularly?", "gap_found": False, "assigned_team": None, "risk_accepted_by": None},
]

result = check_gap_ownership(gaps)
print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [AWS Well-Architected Framework — Overview](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework), abgerufen 2026-09-18.

Shared Responsibility ist kanonisch in [KB-0442](02-shared-responsibility.md) behandelt; Landing Zones in [KB-0450](10-landing-zones.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Well-Architected-Review-Werkzeuge, die technische Konfigurationslücken automatisch gegen Reviewfragen prüfen und direkt einer Ownership-Zuordnung zuführen | Adopting | Gegenüber rein manuellen Reviews bevorzugen, sobald die tatsächliche Abdeckung der automatischen Prüfregeln für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert einen Well-Architected-Review erst als abgeschlossen, wenn jede identifizierte Lücke nachweislich entweder einem Team mit Zeitrahmen zugeordnet oder formal als Risiko akzeptiert ist.
