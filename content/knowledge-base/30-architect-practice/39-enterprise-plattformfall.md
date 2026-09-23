---
{"id": "KB-0715", "title": "Enterprise-Plattformfall", "domain": "30", "sequence": 39, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0713", "concepts": ["Vollständiger, durchgearbeiteter Übungsfall"], "needed_for": "Dieser Fall folgt derselben, vollständigen Fallstruktur wie der in KB-0713 beschriebene Cloud-Architekturfall"}, {"id": "KB-0688", "concepts": ["Plattformstrategie"], "needed_for": "Dieser Fall wendet die in KB-0688 beschriebene Plattformstrategie auf ein konkretes, hybrides AI-/Entwicklerplattform-Szenario an"}], "related": ["KB-0714"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für das gegebene, mehrteamübergreifende Plattformszenario Golden Paths, GPU-Dienste und Governance mit klaren Serviceverträgen entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für den Enterprise-Plattformfall mehrere Adoptionsstrategien mit fairer Trade-off-Darstellung gegeneinander abwägen und begründen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Plattform eine kritische Dimension (Serviceverträge, Adoptionsevidenz, Governance) unadressiert lässt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine vollständige, unternehmensweite AI-/Entwicklerplattform-Entscheidung mit Governance und Adoptionsevidenz treffen und vor Entscheidern begründen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Implementierung eines konkreten Internal Developer Portals im Detail ist Vertiefung.", "rationale": "Kern ist die konzeptionelle Fallbearbeitung mit überprüfbaren Anforderungen, nicht die produktspezifische Implementierungsdetailtiefe."}}, "lab_validation": [{"lab_id": "KB-0715-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur vollständigen Bearbeitung eines Enterprise-Plattformfalls, keine reale Organisation involviert", "evidence": "Ein vollständig durchgearbeitetes Fallbeispiel zeigt, wie Golden Paths, GPU-Dienste, Governance, Serviceverträge und Adoptionsevidenz mit expliziten, klar als Annahmen gekennzeichneten Randbedingungen zu einer kohärenten Plattformentscheidung zusammengeführt werden.", "limitations": "Vollständig fiktives Fallbeispiel; alle Zahlen, Lasten und Randbedingungen sind Beispielannahmen, keine realen Projektergebnisse."}]}
---
# Enterprise-Plattformfall

> **Ziel:** Dieses Kapitel ist ein vollständiger, durchgearbeiteter Übungsfall, strukturell analog zu KB-0713 und KB-0714: Ein fiktives Unternehmen benötigt eine interne AI-/Entwicklerplattform, die mehreren, unabhängigen Produktteams tatsächlich gemeinsame Fähigkeiten für GenAI-Entwicklung und -Betrieb bereitstellt. Der Fall verbindet **Golden Paths** (vordefinierte, tatsächlich empfohlene Entwicklungswege, die typische Aufgaben vereinfachen), **GPU-Dienste** (gemeinsam genutzte Inferenz- und Trainingsressourcen, siehe Domain 17), **Governance** und **Serviceverträge** sowie **Adoptionsevidenz** zu einer kohärenten Plattformentscheidung, entsprechend dem in KB-0688 beschriebenen Plattformstrategie-Prinzip.

## Fallbeschreibung und explizite Annahmen

**Hinweis:** Alle folgenden Annahmen sind explizit als Beispielannahmen gekennzeichnet, keine realen Projektdaten.

Das fiktive Unternehmen "Beispiel Holding" hat angenommen 12 Produktteams, von denen jedes tatsächlich eigene GenAI-Funktionen entwickelt. Ohne gemeinsame Plattform würde jedes Team tatsächlich eigene GPU-Ressourcenverwaltung, Modell-Deployment-Pipelines und Observability-Instrumentierung redundant aufbauen. Angenommenes Plattformteam: 8 Personen, angenommenes Jahresbudget für die Plattform: 600.000 Euro.

## Golden Paths

Die Plattform bietet einen vordefinierten, tatsächlich empfohlenen Weg für die häufigsten Aufgaben (angenommen: Modell-Deployment, Prompt-Versionierung, Evaluationsdurchführung) — Teams, die diesen Golden Path nutzen, erhalten tatsächlich automatisierte Unterstützung (etwa vorkonfigurierte CI/CD-Pipelines), während Teams mit tatsächlich abweichenden Anforderungen den Weg außerhalb des Golden Path gehen können, jedoch ohne dieselbe automatisierte Unterstützung — dies entspricht dem in KB-0688 beschriebenen Prinzip, Produktgrenzen explizit zu ziehen, statt jede mögliche Anforderung abzudecken.

## GPU-Dienste

Gemeinsam genutzte GPU-Ressourcen werden über ein zentrales, angenommenes Kontingentsystem bereitgestellt, mit MIG-Partitionierung (siehe KB-0416) für kleinere Workloads und dedizierten Instanzen für größere Trainingsaufgaben — diese gemeinsame Bereitstellung entspricht dem in KB-0688 beschriebenen wirtschaftlichen Kern einer Plattform: Vermeidung redundanter Eigenbeschaffung durch jedes einzelne Team.

## Governance

Die Plattform folgt dem in KB-0699 beschriebenen, praktischen Governance-Prinzip: Sicherheitsrelevante Standards (etwa Modellzugriffskontrolle) sind zentral, nicht föderiert, mit einem definierten Ausnahmeprozess für begründete Abweichungen. Die Durchlaufzeit für Governance-Entscheidungen ist explizit auf angenommen maximal 3 Werktage begrenzt, um Umgehung durch zeitkritische Teams zu vermeiden.

## Serviceverträge

Für jeden Plattformdienst (GPU-Kontingent, Deployment-Pipeline, Observability) existiert ein expliziter Servicevertrag mit definierter Support-Zuständigkeit und Eskalationsweg, entsprechend dem in KB-0706 beschriebenen Operating-Model-Prinzip — Nutzerteams wissen tatsächlich, wer bei einem Problem zuständig ist, statt bei jedem Vorfall neu zu klären, welches Team verantwortlich ist.

## Adoptionsevidenz

Der Erfolg der Plattform wird tatsächlich an der freiwilligen Adoptionsrate gemessen, nicht an der formalen Verfügbarkeit — angenommen wird eine Zielsetzung von tatsächlich 80% der Produktteams, die den Golden Path für Modell-Deployment innerhalb von 12 Monaten aktiv nutzen, mit einer Zwischenüberprüfung nach 6 Monaten (entsprechend dem in KB-0687 beschriebenen Evidenzpunkt-Prinzip), an der die Plattformstrategie bei unzureichender Adoption tatsächlich angepasst wird.

~~~text
FALL-STRUKTUR (Zusammenfassung):
  GOLDEN PATHS: vordefinierter, automatisiert unterstützter Weg für häufige Aufgaben;
    explizite Grenze zu nicht-unterstützten, abweichenden Anforderungen
  GPU-DIENSTE: zentrales Kontingentsystem mit MIG-Partitionierung und dedizierten
    Instanzen, vermeidet redundante Team-Eigenbeschaffung
  GOVERNANCE: zentrale Sicherheitsstandards mit begrenzter Durchlaufzeit und definiertem
    Ausnahmeprozess
  SERVICEVERTRÄGE: explizite Support-/Eskalationszuständigkeit je Plattformdienst
  ADOPTIONSEVIDENZ: freiwillige Nutzungsrate als Erfolgsmaß statt formaler
    Verfügbarkeit, mit Zwischenüberprüfung nach 6 Monaten
Jede Annahme (Teamanzahl, Budget, Zielrate) ist EXPLIZIT als Beispielannahme markiert,
  keine reale Projektangabe.
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Golden Path mit expliziter Grenze | fokussiert Automatisierung auf häufige Fälle | verhindert unkontrolliertes Scope-Wachstum |
| Zentrales GPU-Kontingentsystem | vermeidet redundante Team-Eigenbeschaffung | wirtschaftlicher Kern der Plattform |
| Zentrale, zeitbegrenzte Governance | verhindert Umgehung durch zu lange Durchlaufzeit | folgt praktischem Governance-Prinzip |
| Explizite Serviceverträge je Dienst | klärt Support-/Eskalationszuständigkeit | folgt Operating-Model-Prinzip |
| Adoptionsevidenz mit Zwischenüberprüfung | misst tatsächlichen Erfolg statt formaler Bereitstellung | folgt Evidenzpunkt-Prinzip |

## Scalability, Reliability, Security und Observability

Der Fall skaliert über die angenommene Anzahl nutzender Produktteams; die Reliability-Grenze liegt darin, dass eine zu lange Governance-Durchlaufzeit tatsächlich zur Umgehung der Plattform durch zeitkritische Teams führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Adoptionsrate bleibt nach 6 Monaten deutlich unter der Zielsetzung | der Golden Path deckt nicht die tatsächlich häufigsten Bedürfnisse der Teams ab | eine gezielte Nutzerforschung durchführen und den Golden Path entsprechend anpassen |
| Teams umgehen die Plattform-Governance bei zeitkritischen Anforderungen | die Governance-Durchlaufzeit überschreitet die vorgesehene Grenze | den Governance-Prozess für zeitkritische Fälle beschleunigen oder den Ausnahmeprozess nutzen |
| ein Plattformdienst-Vorfall wird zwischen Plattform- und Nutzerteam hin- und hergeschoben | der Servicevertrag für den betroffenen Dienst ist nicht klar genug definiert | den Servicevertrag um eine explizite, dokumentierte Support-Grenze ergänzen |

## Trade-offs und Entscheidungen

Dieser Fall demonstriert auf **Staff**-Ebene die korrekte technische Umsetzung eines einzelnen Golden-Path-Elements. Auf **Principal**-Ebene demonstriert er die Verbindung von Golden Paths, GPU-Diensten und Governance zu einem kohärenten Gesamtentwurf. Auf **Chief**-Ebene demonstriert er die wirtschaftliche und organisatorische Einbettung (Adoptionsevidenz, Serviceverträge) der Plattformentscheidung.

## Production Checklist

- [ ] Golden Paths sind für die tatsächlich häufigsten Aufgaben definiert, mit expliziter Grenze zu abweichenden Anforderungen.
- [ ] GPU-Ressourcen sind über ein zentrales Kontingentsystem bereitgestellt.
- [ ] Sicherheitsrelevante Governance ist zentral mit begrenzter Durchlaufzeit und Ausnahmeprozess.
- [ ] Jeder Plattformdienst hat einen expliziten Servicevertrag mit Support-/Eskalationszuständigkeit.
- [ ] Der Plattformerfolg wird an tatsächlicher Adoptionsrate mit Zwischenüberprüfung gemessen.

## Interviewfragen

### 1. Warum ist die Adoptionsrate ein besseres Erfolgsmaß für die Plattform als deren formale Verfügbarkeit?

**Antwort:** Weil eine formal verfügbare, aber ungenutzte Plattform ihren eigentlichen Zweck (Vermeidung redundanter Eigenentwicklung) tatsächlich nicht erfüllt, während die tatsächliche Adoptionsrate den echten Nutzen zeigt.

### 2. Warum ist eine begrenzte Governance-Durchlaufzeit für die Plattform wichtig?

**Antwort:** Weil eine zu lange Durchlaufzeit dazu führt, dass zeitkritische Teams die Governance tatsächlich umgehen, was die Plattform insgesamt wirkungslos macht.

### 3. Was ist der wirtschaftliche Vorteil eines zentralen GPU-Kontingentsystems?

**Antwort:** Es vermeidet, dass jedes der 12 Produktteams redundant eigene GPU-Ressourcenverwaltung aufbaut, was tatsächlich Kosten und Aufwand spart.

### 4. Warum sind explizite Serviceverträge für jeden Plattformdienst notwendig?

**Antwort:** Damit Nutzerteams bei einem Problem sofort wissen, wer zuständig ist, statt dass ein Vorfall zwischen Plattform- und Nutzerteam hin- und hergeschoben wird.

### 5. Wie würdest du vorgehen, wenn die Adoptionsrate nach 6 Monaten deutlich unter der Zielsetzung bleibt?

**Antwort:** Ich würde eine gezielte Nutzerforschung durchführen, um zu verstehen, ob der Golden Path tatsächlich die häufigsten Bedürfnisse der Teams abdeckt, und ihn entsprechend anpassen.

### 6. Widersprüchliche Anforderung: Die Produktteams wollen maximale technische Freiheit ohne Plattformvorgaben UND die Organisation will konsistente, kosteneffiziente GPU-Nutzung über alle Teams hinweg — wie würdest du diesen Fall lösen?

**Antwort:** Ich würde den Golden Path als attraktiven, automatisiert unterstützten Standardweg gestalten, der freiwillig genutzt wird, statt ihn zwingend vorzuschreiben, sodass Teams mit begründeten, abweichenden Anforderungen weiterhin eigene Wege gehen können, während die meisten Teams den Golden Path aus tatsächlichem Nutzen freiwillig wählen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Lab ist Teil des im Kapitel beschriebenen, vollständig fiktiven Übungsfalls, keine reale Projekterfahrung.

~~~python
# Local, deterministic illustration of the adoption evidence check for this fictional case (fictional lab example, no real platform):

def check_adoption_milestone(teams_using_golden_path, total_teams, target_pct, months_elapsed, checkpoint_month=6):
    actual_pct = teams_using_golden_path / total_teams * 100
    status = "on_track" if actual_pct >= target_pct * (months_elapsed / 12) else "needs_intervention"
    return {"actual_pct": actual_pct, "status": status}

print(check_adoption_milestone(teams_using_golden_path=5, total_teams=12, target_pct=80, months_elapsed=6))
~~~

Erwartete Beobachtung: Bei einer Zwischenmessung nach 6 Monaten zeigt die Prüfung an, ob die Plattform auf Kurs zur Zielsetzung ist. Auswertung: Diese Zwischenüberprüfung ermöglicht eine rechtzeitige Anpassung der Plattformstrategie, statt erst nach 12 Monaten festzustellen, dass die Zielsetzung verfehlt wurde.

## Dependencies, Cross-References und Quellen

1. Spotify Engineering: [Golden Paths — Standardized, Well-Paved Development Roads](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem/), abgerufen 2026-09-18.
2. Matthew Skelton, Manuel Pais: [Team Topologies — Platform as a Product](https://teamtopologies.com/), abgerufen 2026-09-18.

Dieses Kapitel folgt der in KB-0713 (Cloud-Architekturfall) und KB-0714 (GenAI-Architekturfall) etablierten, vollständigen Fallstruktur und nutzt die in KB-0688 (Plattformstrategie), KB-0699 (Architekturgovernance praktisch führen) und KB-0706 (Operating Models) beschriebenen Prinzipien.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Internal Developer Portals (etwa Backstage) mit integrierter Adoptionsmessung zur automatisierten Nachverfolgung der Golden-Path-Nutzung | Growing Adoption | Bei künftigen, ähnlichen Fällen evaluieren, jedoch die grundlegende Plattformstrategie (Golden Paths, Governance, Serviceverträge) unabhängig vom gewählten Portal-Werkzeug zuerst konzeptionell festlegen. |

Ein Team akzeptiert diesen Enterprise-Plattformfall als vollständig bearbeitet, wenn Golden Paths, GPU-Dienste, Governance, Serviceverträge und Adoptionsevidenz nachweislich mit expliziten, klar gekennzeichneten Annahmen kohärent zusammengeführt sind.
