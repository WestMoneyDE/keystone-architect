---
{"id": "KB-0509", "title": "Vertex AI", "domain": "21", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0479", "concepts": ["Amazon Bedrock"], "needed_for": "context"}, {"id": "KB-0496", "concepts": ["Microsoft Foundry für AI-Lösungen"], "needed_for": "context"}, {"id": "KB-0268", "concepts": ["Verwaltete Modellplattformen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Modellzugang, Training und Endpunkte in Vertex AI anhand offizieller, aktueller Primärquellen einordnen können, statt sich auf möglicherweise veraltete Sekundärquellen zu verlassen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete GCP-AI-Architektur explizit entscheiden, ob und wie Vertex AI für Modellzugang und Training genutzt wird, unter expliziter Prüfung aktueller Dienstgrenzen und Portabilitätsanforderungen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Portabilitätseinschränkung auf eine unreflektierte Nutzung Vertex-AI-spezifischer Funktionen ohne Prüfung der Multi-Cloud-Portabilitätsanforderung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Entscheidungen zur Nutzung von Vertex AI im Unternehmen an eine Pflicht zur Verifikation gegen aktuelle Primärquellen und eine explizite Portabilitätsbewertung koppeln.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Vertex-AI-Trainingsinfrastruktur im Detail ist Vertiefung.", "rationale": "Kern ist die strukturelle Einordnung von Modellzugang, Training und Endpunkten als Entscheidungsgrundlage, nicht die Trainingsinfrastruktur-Interna."}}, "lab_validation": [{"lab_id": "KB-0509-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu Vertex AI, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie Vertex AI Modellzugang (verwaltete Bereitstellung von Google-eigenen und Partnermodellen über Model Garden), eigenes Training (verwaltete Trainingsinfrastruktur für benutzerdefinierte Modelle) und Endpunkte (verwaltete Bereitstellung trainierter oder verwalteter Modelle für Inferenz) strukturell bündelt, analog zur AWS-Bedrock- und Microsoft-Foundry-Logik.", "limitations": "Kein aktives GCP-Konto verwendet, keine reale Vertex-AI-Instanz konfiguriert. Da sich verwaltete AI-Plattformdienste sehr schnell weiterentwickeln, werden keine spezifischen, zeitpunktgebundenen Funktions- oder Modellverfügbarkeitsaussagen getroffen; diese müssen gegen aktuelle Primärquellen verifiziert werden."}]}
---
# Vertex AI

> **Ziel:** Vertex AI bündelt drei strukturelle Bausteine für AI-Lösungen in GCP, analog zu AWS Bedrock (siehe [KB-0479](../19-aws/17-amazon-bedrock.md)) und Microsoft Foundry (siehe [KB-0496](../20-azure/16-microsoft-foundry-fuer-ai-loesungen.md)): **Modellzugang** über Model Garden (verwaltete Bereitstellung von Google-eigenen Modellen wie der Gemini-Familie sowie Partnermodellen über eine gemeinsame API-Oberfläche), **eigenes Training** (verwaltete Trainingsinfrastruktur für benutzerdefinierte Modelle, von AutoML bis zu individuell konfigurierbaren Trainingsjobs) und **Endpunkte** (verwaltete Bereitstellung trainierter oder verwalteter Modelle für Online- oder Batch-Inferenz). Da sich verwaltete AI-Plattformdienste wie Vertex AI sehr schnell weiterentwickeln, sind konkrete Aussagen zu Modellverfügbarkeit, Preisgestaltung oder Funktionsumfang in diesem Kapitel bewusst konservativ gehalten und müssen vor jeder produktiven Entscheidung explizit gegen aktuelle Primärquellen (Google-Cloud-Dokumentation zum Zeitpunkt der Entscheidung) verifiziert werden. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartete Portabilitätseinschränkung häufig auf eine unreflektierte Nutzung Vertex-AI-spezifischer Funktionen (proprietäre Trainings-Pipelines, spezifische Endpunkt-Konfigurationen) zurückzuführen ist, ohne vorher explizit zu prüfen, ob eine Multi-Cloud-Portabilitätsanforderung tatsächlich besteht.

## Zweck, Mental Model und Dependencies

Vertex AI adressiert das strukturelle Problem, dass Unternehmen sowohl Zugang zu vorgefertigten Modellen als auch die Möglichkeit benötigen, eigene, benutzerdefinierte Modelle zu trainieren und bereitzustellen, innerhalb einer konsistenten, verwalteten Plattform. Model Garden bietet verwalteten Zugang zu verschiedenen Google-eigenen (Gemini-Familie) und Partnermodellen über eine gemeinsame API, strukturell vergleichbar mit der Rolle von Amazon Bedrock (siehe [KB-0479](../19-aws/17-amazon-bedrock.md)) und Microsoft Foundry (siehe [KB-0496](../20-azure/16-microsoft-foundry-fuer-ai-loesungen.md)) innerhalb ihrer jeweiligen Cloud-Plattformen — konkrete Modellauswahl, Feature-Parität und regionale Verfügbarkeit ändern sich laufend und dürfen nicht als statisch angenommen werden. Für eigenes Training bietet Vertex AI ein Spektrum von AutoML (minimaler Konfigurationsaufwand, für Standardanwendungsfälle wie Klassifikation oder Regression) bis zu vollständig benutzerdefinierten Trainingsjobs (maximale Kontrolle über Trainingscode, Infrastruktur und Hyperparameter), wobei die Wahl zwischen diesen Optionen einen expliziten Trade-off zwischen Konfigurationsaufwand und Kontrolle darstellt. Endpunkte stellen trainierte oder verwaltete Modelle für Inferenz bereit, entweder als Online-Endpunkte (niedrige Latenz, für Echtzeitanfragen) oder Batch-Vorhersage (hoher Durchsatz, für große, nicht-latenzsensitive Verarbeitungsmengen). Eine zentrale architektonische Überlegung ist Portabilität: Die Nutzung Vertex-AI-spezifischer Funktionen (proprietäre Pipeline-Formate, spezifische Endpunkt-Konfigurationen) kann eine spätere Migration zu einer anderen Plattform erschweren — diese Kopplung sollte bewusst und nicht unreflektiert eingegangen werden, abhängig davon, ob eine tatsächliche Multi-Cloud-Portabilitätsanforderung besteht.

~~~text
Vertex AI: 3 structural building blocks for GCP AI solutions (parallel to AWS Bedrock KB-0479, MS Foundry KB-0496)
  Model Garden: managed access to Google's own (Gemini family) + partner models, common API
    -> model selection/feature parity/regional availability CHANGES FAST
  Custom training: spectrum from AutoML (minimal config, standard use cases)
                              to fully custom training jobs (max control over code/infra/hyperparams)
    -> trade-off: config effort vs control
  Endpoints: serve trained/managed models for inference
    Online endpoints: low latency, real-time requests
    Batch prediction: high throughput, non-latency-sensitive large volumes
KEY ARCHITECTURAL CONSIDERATION: PORTABILITY
  Vertex-AI-specific features (proprietary pipeline formats, specific endpoint configs)
    -> can complicate LATER migration to another platform
    -> coupling should be DELIBERATE, not unreflective -- depends on actual multi-cloud portability need
CAUTION: managed AI platform services evolve VERY FAST -> verify claims against current primary sources
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Model Garden | verwalteter Zugang zu Google-/Partnermodellen | analog zu Bedrock/Foundry, Verfügbarkeit variiert |
| AutoML versus Custom Training | Trade-off Konfigurationsaufwand versus Kontrolle | Wahl anhand tatsächlichem Anwendungsfall |
| Online-Endpunkt | niedrige Latenz für Echtzeitanfragen | für latenzsensitive Anwendungen |
| Batch-Vorhersage | hoher Durchsatz für nicht-latenzsensitive Verarbeitung | für große Verarbeitungsmengen ohne Echtzeitanforderung |
| Portabilität | Kopplung an Vertex-AI-spezifische Funktionen | sollte bewusst anhand tatsächlicher Multi-Cloud-Anforderung entschieden werden |

Implementierung: Für jeden Anwendungsfall wird explizit geprüft, ob AutoML für den Konfigurationsaufwand ausreicht oder ob ein benutzerdefinierter Trainingsjob für die tatsächliche Kontrollanforderung nötig ist. Vor jeder produktiven Modellentscheidung wird die tatsächliche, aktuelle Verfügbarkeit und Feature-Parität des gewählten Modells explizit gegen die aktuelle Google-Cloud-Dokumentation verifiziert. Die Nutzung Vertex-AI-spezifischer Funktionen wird explizit gegen eine tatsächliche Multi-Cloud-Portabilitätsanforderung abgewogen, statt unreflektiert maximale Plattformintegration anzustreben.

## Scalability, Reliability, Security und Observability

Vertex AI skaliert die Modell-Bereitstellungskapazität proportional zur gewählten Endpunkt-Konfiguration; die Reliability-Grenze liegt darin, dass eine veraltete Annahme über den sich schnell weiterentwickelnden Funktionsumfang proportional zur tatsächlichen Diskrepanz zwischen Erwartung und aktuellem Dienstverhalten zu unerwarteten Funktionslücken führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein erwartetes Modell-Feature ist nicht verfügbar | die Annahme über den Funktionsumfang basiert auf veralteter Dokumentation oder früherer Recherche | die aktuelle Google-Cloud-Dokumentation zum Zeitpunkt der Prüfung explizit konsultieren |
| eine Migration zu einer anderen Plattform erweist sich als unerwartet aufwendig | proprietäre Vertex-AI-Funktionen wurden ohne Portabilitätsprüfung genutzt | prüfen, welche genutzten Funktionen die Migration konkret erschweren und ob Alternativen bestehen |
| Online-Inferenz zeigt unerwartet hohe Latenz | die Anwendung nutzt Batch-Vorhersage-Logik für einen eigentlich latenzsensitiven Anwendungsfall | prüfen, ob ein Online-Endpunkt statt Batch-Vorhersage für den tatsächlichen Anwendungsfall geeigneter ist |

Security: Zugriff auf Vertex-AI-Ressourcen sollte über IAM-basierte RBAC statt gemeinsam genutzter statischer Zugangsschlüssel erfolgen, konsistent mit der allgemeinen GCP-Zugriffskontrollpraxis (siehe [KB-0499](01-gcp-organisation-und-iam.md)). Observability: Die tatsächliche Modellnutzung pro Projekt, Endpunkt-Latenz relativ zur Anwendungsanforderung, und die Häufigkeit von Funktionsverifikationsprüfungen vor produktiven Entscheidungen sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert einen Endpunkt oder Trainingsjob für einen gegebenen Anwendungsfall korrekt. **Principal** entscheidet, welche Modelle und Trainingsansätze für eine konkrete Architektur geeignet sind, unter expliziter Verifikation aktueller Fähigkeiten und Portabilitätsbewertung. **Chief** koppelt unternehmensweite Nutzungsentscheidungen an eine verbindliche Pflicht zur Verifikation gegen aktuelle Primärquellen und Portabilitätsbewertung.

Anti-Patterns: Funktions- oder Modellverfügbarkeitsannahmen aus früheren Recherchen ungeprüft in produktive Entscheidungen übernehmen; Vertex-AI-spezifische Funktionen ohne Prüfung der tatsächlichen Multi-Cloud-Portabilitätsanforderung nutzen; Batch-Vorhersage für latenzsensitive Anwendungsfälle statt Online-Endpunkte einsetzen.

## Production Checklist

- [ ] AutoML versus Custom Training ist anhand des tatsächlichen Kontroll- und Konfigurationsbedarfs entschieden.
- [ ] Aktuelle Modellverfügbarkeit und Feature-Parität sind vor jeder produktiven Entscheidung gegen aktuelle Primärquellen verifiziert.
- [ ] Die Nutzung Vertex-AI-spezifischer Funktionen ist bewusst gegen die tatsächliche Portabilitätsanforderung abgewogen.
- [ ] Endpunkt-Typ (Online versus Batch) entspricht der tatsächlichen Latenzanforderung.

## Interviewfragen

### 1. Welche drei strukturellen Bausteine bündelt Vertex AI?

**Antwort:** Modellzugang (Model Garden), eigenes Training (AutoML bis Custom Training) und Endpunkte (Online- und Batch-Inferenz).

### 2. Wie ist Vertex AI strukturell mit Amazon Bedrock und Microsoft Foundry vergleichbar?

**Antwort:** Alle drei bieten verwalteten Zugang zu verschiedenen Basis-/Partnermodellen über eine gemeinsame API-Oberfläche, wobei konkrete Modellauswahl und Feature-Parität bei allen drei Diensten laufend variieren.

### 3. Was ist der Trade-off zwischen AutoML und benutzerdefinierten Trainingsjobs?

**Antwort:** AutoML bietet minimalen Konfigurationsaufwand für Standardanwendungsfälle; benutzerdefinierte Trainingsjobs bieten maximale Kontrolle über Trainingscode, Infrastruktur und Hyperparameter bei höherem Aufwand.

### 4. Warum sollte die Nutzung Vertex-AI-spezifischer Funktionen bewusst abgewogen werden?

**Antwort:** Weil proprietäre Funktionen (Pipeline-Formate, Endpunkt-Konfigurationen) eine spätere Migration zu einer anderen Plattform erschweren können; diese Kopplung sollte anhand einer tatsächlichen Portabilitätsanforderung, nicht unreflektiert, eingegangen werden.

### 5. Wie gehst du vor, wenn ein erwartetes Vertex-AI-Feature nicht verfügbar ist?

**Antwort:** Ich prüfe zuerst, ob meine Annahme über den Funktionsumfang auf veralteter Dokumentation basiert, und konsultiere die aktuelle Google-Cloud-Dokumentation, bevor ich ein technisches Problem vermute.

### 6. Widersprüchliche Anforderung: Team will maximale Integration und Automatisierung durch Vertex-AI-spezifische Funktionen UND jederzeitige Möglichkeit, zu einer anderen Cloud zu wechseln — wie gehst du vor?

**Antwort:** Ich würde eine explizite Portabilitätsbewertung durchführen und Vertex-AI-spezifische Funktionen gezielt für Komponenten nutzen, bei denen Portabilität keine tatsächliche Anforderung ist, während für Komponenten mit echtem Multi-Cloud-Bedarf portablere, standardisierte Ansätze (z. B. containerisierte, plattformunabhängige Trainingscode-Strukturen) gewählt werden, statt maximale Integration und maximale Portabilität als gleichzeitig erreichbare Ziele zu behandeln.

## Praktische Labs

~~~python
# Conceptual training-approach and endpoint-type selection (not executed against a real GCP account):

def recommend_training_approach(is_standard_use_case, needs_custom_architecture):
    if needs_custom_architecture:
        return "custom training job (full control needed)"
    if is_standard_use_case:
        return "AutoML (minimal config, standard use case)"
    return "custom training job (non-standard use case)"

def recommend_endpoint_type(is_latency_sensitive):
    return "online endpoint" if is_latency_sensitive else "batch prediction"

print(recommend_training_approach(is_standard_use_case=True, needs_custom_architecture=False))
print(recommend_endpoint_type(is_latency_sensitive=True))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [Vertex AI Overview](https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [Vertex AI Model Garden](https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models), abgerufen 2026-09-18.

Amazon Bedrock ist kanonisch in [KB-0479](../19-aws/17-amazon-bedrock.md) behandelt; Microsoft Foundry für AI-Lösungen in [KB-0496](../20-azure/16-microsoft-foundry-fuer-ai-loesungen.md); Verwaltete Modellplattformen allgemein in [KB-0268](../11-genai-architecture/28-verwaltete-modellplattformen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende Konvergenz von Modellzugang, Agentenorchestrierung und MLOps-Tooling in einer einzigen Vertex-AI-Plattform | Evaluating | Gegenüber einer manuell zusammengesetzten Kombination separater Dienste erst nach Prüfung der aktuellen Reife und Portabilitätsimplikationen der konvergenten Plattform bevorzugen. |

Ein Team akzeptiert eine Vertex-AI-Nutzung erst, wenn Modellwahl, Trainingsansatz und Portabilitätsimplikationen nachweislich gegen aktuelle Primärquellen verifiziert und nicht auf veralteten Annahmen aufgebaut sind.
