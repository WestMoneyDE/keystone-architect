---
{"id": "KB-0507", "title": "Pub/Sub im GCP-Lösungsdesign", "domain": "21", "sequence": 9, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0504", "concepts": ["Cloud Run"], "needed_for": "understanding"}, {"id": "KB-0506", "concepts": ["Cloud SQL und Spanner"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Pub/Sub-Ereigniswege zwischen Cloud Run, Datenplattform und externen Diensten anhand offizieller Dokumentation gestalten und IAM-Zugriffsrechte korrekt zuordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Ereignisarchitektur explizit entscheiden, wie Pub/Sub-Topics und Subscriptions zwischen Cloud Run, Datenplattform-Komponenten und externen Diensten mit klarer Ownership verbunden werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Ereignisverarbeitungslücke auf fehlende IAM-Berechtigungen für ein Subscription-Ziel oder eine unklare Ownership-Zuordnung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Ereignisarchitektur-Governance im Unternehmen anhand klarer IAM- und Ownership-Zuordnung für jeden Pub/Sub-Topic-/Subscription-Pfad festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die allgemeine Message-Broker-Semantik (At-least-once-Zustellung, Ordering, Dead-Letter-Queues) ist in Domain 08 dieser Wissensdatenbank behandelt und hier bewusst nicht wiederholt.", "rationale": "Kern dieses Kapitels ist die GCP-spezifische Lösungsintegration (Cloud Run, Datenplattform, IAM, Ownership), nicht die allgemeine Broker-Semantik."}}, "lab_validation": [{"lab_id": "KB-0507-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu Pub/Sub im GCP-Lösungsdesign, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie Pub/Sub Push-Subscriptions direkt Cloud-Run-Dienste auslösen können, wie IAM-Berechtigungen auf Topic- und Subscription-Ebene den Zugriff granular steuern, und wie Pub/Sub als Integrationsschicht zwischen Cloud Run, Datenplattform-Komponenten (z. B. BigQuery-Subscriptions) und externen Diensten fungiert, mit expliziter Abgrenzung zur allgemeinen Message-Broker-Semantik, die in Domain 08 dieser Wissensdatenbank behandelt wird.", "limitations": "Kein aktives GCP-Konto verwendet, keine reale Pub/Sub-Topologie konfiguriert."}]}
---
# Pub/Sub im GCP-Lösungsdesign

> **Ziel:** Dieses Kapitel behandelt Pub/Sub nicht als generischen Message Broker (dessen allgemeine Semantik — At-least-once-Zustellung, Ordering, Dead-Letter-Queues — in Domain 08 dieser Wissensdatenbank behandelt wird), sondern als **GCP-spezifische Integrationsschicht**: Wie Pub/Sub konkret Cloud Run (siehe [KB-0504](06-cloud-run.md)), Datenplattform-Komponenten (z. B. direkte BigQuery-Subscriptions, die Nachrichten ohne zusätzlichen Verarbeitungscode direkt in eine Tabelle schreiben) und externe Dienste über klar zugeordnete IAM-Berechtigungen und Ownership verbindet. Der zentrale Punkt ist, dass eine unerwartete Ereignisverarbeitungslücke — Nachrichten, die veröffentlicht, aber nicht am erwarteten Ziel verarbeitet werden — typischerweise nicht auf ein Problem der Pub/Sub-Zustellsemantik selbst hindeutet, sondern auf fehlende IAM-Berechtigungen für das Subscription-Ziel oder eine unklare Ownership-Zuordnung, wer für die Überwachung eines bestimmten Topic-/Subscription-Pfads verantwortlich ist.

## Zweck, Mental Model und Dependencies

Pub/Sub fungiert im GCP-Ökosystem als zentrale Integrationsschicht zwischen verschiedenen verwalteten Diensten, wobei die konkrete Integration je nach Ziel unterschiedliche Mechanismen nutzt: Eine Push-Subscription kann direkt einen Cloud-Run-Dienst (siehe [KB-0504](06-cloud-run.md)) auslösen, indem Pub/Sub HTTP-Requests an den Cloud-Run-Endpunkt sendet, sobald eine Nachricht im Topic veröffentlicht wird — dies erfordert, dass der Cloud-Run-Dienst die eingehenden Push-Requests korrekt authentifiziert und verarbeitet, und dass die Pub/Sub-Service-Identity die IAM-Berechtigung hat, den Cloud-Run-Dienst aufzurufen. Für die Datenplattform-Integration bietet Pub/Sub direkte BigQuery-Subscriptions, die Nachrichten ohne zusätzlichen Verarbeitungscode direkt in eine BigQuery-Tabelle schreiben, was für einfache Ingestion-Pipelines die Notwendigkeit eines separaten Verarbeitungsdienstes eliminiert, jedoch weniger Flexibilität für Transformationen vor dem Schreiben bietet als eine klassische Subscriber-Anwendung. Für jeden dieser Integrationspfade ist IAM die zentrale Steuerungsebene: Berechtigungen werden granular auf Topic- (wer darf veröffentlichen) und Subscription-Ebene (wer darf konsumieren, oder welche Service-Identity darf im Namen von Pub/Sub einen Push-Endpunkt aufrufen) vergeben, wobei eine fehlende oder falsch konfigurierte Berechtigung an jedem Punkt der Kette (Publisher, Topic, Subscription, Konsument) die gesamte Ereignisverarbeitung unterbricht, ohne dass dies notwendigerweise als offensichtlicher Fehler sichtbar wird — Nachrichten werden möglicherweise einfach nicht zugestellt oder verworfen, statt einen klaren Fehler zu erzeugen. Ownership-Zuordnung ist daher zentral: Für jeden Topic-/Subscription-Pfad muss explizit dokumentiert sein, welches Team für die Überwachung der Zustellrate und die Reaktion auf Zustellprobleme verantwortlich ist.

~~~text
Pub/Sub in GCP solution design: NOT generic broker semantics (that's Domain 08)
  -> THIS chapter: GCP-SPECIFIC integration layer
Push Subscription -> Cloud Run (KB-0504):
  Pub/Sub sends HTTP request to Cloud Run endpoint on message publish
  -> requires: Cloud Run correctly authenticates/handles push requests
  -> requires: Pub/Sub service identity has IAM permission to invoke Cloud Run service
BigQuery Subscription: writes messages DIRECTLY to BigQuery table, no processing code needed
  -> simple ingestion pipelines, but LESS transform flexibility than classic subscriber app
IAM = central control plane for EVERY integration path
  Topic level: who can PUBLISH
  Subscription level: who can CONSUME / which service identity can invoke push endpoint
  -> missing/misconfigured permission ANYWHERE in chain (publisher/topic/sub/consumer)
     -> BREAKS entire event flow, often SILENTLY (message just not delivered, not an obvious error)
OWNERSHIP: each topic/subscription path needs EXPLICIT documented owner
  -> who monitors delivery rate, who responds to delivery problems
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Push-Subscription zu Cloud Run | direktes Auslösen eines Cloud-Run-Dienstes bei Nachrichtenveröffentlichung | erfordert korrekte Push-Authentifizierung und IAM-Berechtigung |
| BigQuery-Subscription | direktes Schreiben in eine Tabelle ohne zusätzlichen Code | einfache Ingestion, weniger Transformationsflexibilität |
| IAM auf Topic-/Subscription-Ebene | granulare Steuerung von Publish-/Consume-Berechtigungen | fehlende Berechtigung unterbricht die Kette oft ohne offensichtlichen Fehler |
| Ownership-Dokumentation | explizite Verantwortlichkeit pro Topic-/Subscription-Pfad | verhindert unklare Reaktion auf Zustellprobleme |

Implementierung: Für jeden Integrationspfad wird explizit dokumentiert, welche IAM-Berechtigungen auf Topic- und Subscription-Ebene für Publisher, Pub/Sub-Service-Identity und Konsument benötigt werden, statt sich auf implizite Standardberechtigungen zu verlassen. Für jeden Topic-/Subscription-Pfad wird ein verantwortliches Team dokumentiert, das die Zustellrate überwacht. BigQuery-Subscriptions werden nur für Anwendungsfälle genutzt, bei denen keine Transformation vor dem Schreiben nötig ist, statt sie unreflektiert für komplexere Verarbeitungsanforderungen einzusetzen.

## Scalability, Reliability, Security und Observability

Pub/Sub im GCP-Lösungsdesign skaliert die Integrationszuverlässigkeit proportional zur expliziten IAM- und Ownership-Dokumentation jedes Pfads; die Reliability-Grenze liegt darin, dass eine fehlende Berechtigung an einem Punkt der Kette proportional zur Unsichtbarkeit des Fehlers zu unbemerkten Ereignisverarbeitungslücken führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Cloud-Run-Dienst wird nicht bei neuen Nachrichten ausgelöst | die Pub/Sub-Service-Identity hat keine IAM-Berechtigung, den Cloud-Run-Dienst aufzurufen | die IAM-Berechtigung für die Pub/Sub-Service-Identity auf dem Cloud-Run-Dienst prüfen |
| Nachrichten erscheinen nicht in einer erwarteten BigQuery-Tabelle | die BigQuery-Subscription hat keine Schreibberechtigung auf die Zieltabelle | die IAM-Berechtigung der BigQuery-Subscription auf die Zieltabelle prüfen |
| ein Zustellproblem bleibt lange unbemerkt | kein Team ist explizit für die Überwachung des betroffenen Topic-/Subscription-Pfads verantwortlich | eine explizite Ownership-Dokumentation für den betroffenen Pfad einführen |

Security: IAM-Berechtigungen für Publisher, Push-Endpunkte und Subscriptions sollten minimal und zweckgebunden vergeben werden, statt breite Berechtigungen für mehrere Topics/Subscriptions gemeinsam zu nutzen. Observability: Die tatsächliche Zustellrate pro Topic-/Subscription-Pfad relativ zur erwarteten Rate, sowie die Häufigkeit von IAM-bedingten Zustellfehlern, sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert eine Push-Subscription oder BigQuery-Subscription für einen gegebenen Anwendungsfall korrekt. **Principal** entwirft die IAM- und Ownership-Struktur für ein vollständiges Ereignisnetzwerk zwischen Cloud Run, Datenplattform und externen Diensten. **Chief** legt unternehmensweite Governance-Standards für IAM- und Ownership-Dokumentation jedes Pub/Sub-Integrationspfads fest.

Anti-Patterns: IAM-Berechtigungen für Pub/Sub-Integrationspfade implizit oder undokumentiert lassen; BigQuery-Subscriptions für Anwendungsfälle nutzen, die tatsächlich eine Transformation vor dem Schreiben benötigen; Topic-/Subscription-Pfade ohne explizit dokumentierte Ownership betreiben.

## Production Checklist

- [ ] Jeder Integrationspfad (Push-Subscription, BigQuery-Subscription) hat explizit dokumentierte IAM-Berechtigungen.
- [ ] Jeder Topic-/Subscription-Pfad hat ein explizit benanntes, verantwortliches Team.
- [ ] BigQuery-Subscriptions werden nur für Anwendungsfälle ohne Transformationsbedarf genutzt.
- [ ] Die Zustellrate pro Pfad wird aktiv überwacht.

## Interviewfragen

### 1. Wie kann eine Pub/Sub-Push-Subscription einen Cloud-Run-Dienst auslösen?

**Antwort:** Pub/Sub sendet einen HTTP-Request an den Cloud-Run-Endpunkt, sobald eine Nachricht im Topic veröffentlicht wird, wobei die Pub/Sub-Service-Identity die IAM-Berechtigung benötigt, den Dienst aufzurufen.

### 2. Wofür eignet sich eine BigQuery-Subscription?

**Antwort:** Für einfache Ingestion-Pipelines, bei denen Nachrichten ohne zusätzlichen Verarbeitungscode direkt in eine BigQuery-Tabelle geschrieben werden sollen, ohne Transformationsbedarf vor dem Schreiben.

### 3. Warum werden Ereignisverarbeitungslücken bei Pub/Sub-Integrationen oft nicht sofort bemerkt?

**Antwort:** Weil eine fehlende oder falsch konfigurierte IAM-Berechtigung an einem Punkt der Kette dazu führt, dass Nachrichten einfach nicht zugestellt oder verworfen werden, ohne einen offensichtlichen Fehler zu erzeugen.

### 4. Warum ist eine explizite Ownership-Dokumentation für jeden Topic-/Subscription-Pfad wichtig?

**Antwort:** Weil ohne einen klar benannten, verantwortlichen Team ein Zustellproblem lange unbemerkt bleiben kann, da niemand explizit für die Überwachung dieses Pfads zuständig ist.

### 5. Wie gehst du vor, wenn ein Cloud-Run-Dienst nicht bei neuen Nachrichten ausgelöst wird?

**Antwort:** Ich prüfe zuerst, ob die Pub/Sub-Service-Identity die IAM-Berechtigung hat, den Cloud-Run-Dienst aufzurufen, da dies eine häufige, leicht übersehene Ursache für stille Zustellprobleme ist.

### 6. Widersprüchliche Anforderung: Team will minimale administrative IAM-Konfiguration UND garantiert zuverlässige Ereigniszustellung über mehrere Zieldienste hinweg — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale, aber korrekt zweckgebundene IAM-Konfiguration keine reduzierte Zuverlässigkeit bedeutet, solange jeder Integrationspfad einmalig sorgfältig mit den exakt benötigten Berechtigungen eingerichtet und dokumentiert wird, statt breite, undifferenzierte Berechtigungen als vermeintliche Abkürzung zu vergeben, die spätere stille Zustellprobleme eher verschleiern als verhindern.

## Praktische Labs

~~~python
# Conceptual IAM-chain completeness check for a Pub/Sub integration path (not executed against a real GCP account):

def check_integration_path(publisher_can_publish, pubsub_identity_can_invoke_target, target_configured):
    missing = []
    if not publisher_can_publish:
        missing.append("publisher lacks publish permission on topic")
    if not pubsub_identity_can_invoke_target:
        missing.append("Pub/Sub service identity lacks permission to invoke target (push endpoint or BigQuery table)")
    if not target_configured:
        missing.append("target subscription is not correctly configured")
    return missing if missing else ["integration path complete"]

paths = [
    {"publisher_can_publish": True, "pubsub_identity_can_invoke_target": False, "target_configured": True},
    {"publisher_can_publish": True, "pubsub_identity_can_invoke_target": True, "target_configured": True},
]

for path in paths:
    print(check_integration_path(**path))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [Pub/Sub Push Subscriptions](https://cloud.google.com/pubsub/docs/push), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [BigQuery Subscriptions](https://cloud.google.com/pubsub/docs/bigquery), abgerufen 2026-09-18.

Cloud Run ist kanonisch in [KB-0504](06-cloud-run.md) behandelt; Cloud SQL und Spanner in [KB-0506](08-cloud-sql-und-spanner.md). Allgemeine Message-Broker-Semantik ist in Domain 08 (Messaging Workflows) dieser Wissensdatenbank behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Schema-Validierung und Format-Konvertierung direkt in Pub/Sub vor der Zustellung an BigQuery- oder Cloud-Run-Ziele | Evaluating | Gegenüber Validierung im Konsumenten-Code erst nach Prüfung, ob native Pub/Sub-Schema-Validierung die tatsächlichen Datenqualitätsanforderungen vollständig abdeckt, bevorzugen. |

Ein Team akzeptiert eine Pub/Sub-Integrationstopologie erst, wenn jeder Topic-/Subscription-Pfad nachweislich vollständige IAM-Berechtigungen und eine explizite Ownership-Zuordnung hat.
