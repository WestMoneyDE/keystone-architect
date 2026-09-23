---
{"id": "KB-0496", "title": "Microsoft Foundry für AI-Lösungen", "domain": "20", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0268", "concepts": ["Verwaltete Modellplattformen"], "needed_for": "understanding"}, {"id": "KB-0479", "concepts": ["Amazon Bedrock"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Modellzugang, Projektorganisation und Unternehmensintegration in Microsoft Foundry anhand offizieller, aktueller Primärquellen einordnen können, statt sich auf möglicherweise veraltete Sekundärquellen zu verlassen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Unternehmensarchitektur explizit entscheiden, ob und wie Microsoft Foundry für Modellzugang und Agentenintegration genutzt wird, unter expliziter Prüfung aktueller Dienstgrenzen statt Annahme statischer Fähigkeiten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Funktionslücke oder ein Verhalten, das nicht der ursprünglichen Erwartung entspricht, auf eine veraltete Annahme über den sich schnell weiterentwickelnden Dienstumfang zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Entscheidungen zur Nutzung von Microsoft Foundry im Unternehmen an eine Pflicht zur Verifikation gegen aktuelle Primärquellen statt an fixierte, möglicherweise veraltete Produktannahmen koppeln.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Agent Service im Detail ist Vertiefung und im Agententrack behandelt.", "rationale": "Kern ist die strukturelle Einordnung von Modellzugang, Projekten und Unternehmensintegration, nicht die Agent-Service-Interna."}}, "lab_validation": [{"lab_id": "KB-0496-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Microsoft-Dokumentation zu Microsoft Foundry, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Microsoft Foundry Modellzugang (verwaltete Bereitstellung verschiedener Basis- und Partnermodelle), Projektorganisation (Gruppierung von Ressourcen, Konfigurationen und Zugriffsrechten pro Anwendungsfall) und Unternehmensintegration (Anbindung an Azure-Identitäts- und Netzwerkinfrastruktur) strukturell bündelt, mit explizitem Verweis auf den Agent Service als separat im Agententrack behandelte Komponente.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Foundry-Instanz konfiguriert. Da sich verwaltete AI-Plattformdienste sehr schnell weiterentwickeln, werden keine spezifischen, zeitpunktgebundenen Funktions- oder Modellverfügbarkeitsaussagen getroffen; diese müssen gegen aktuelle Primärquellen verifiziert werden."}]}
---
# Microsoft Foundry für AI-Lösungen

> **Ziel:** Microsoft Foundry (vormals Teile von Azure AI Studio/Azure OpenAI Service) bündelt drei strukturelle Bausteine für Unternehmens-AI-Lösungen: **Modellzugang** (verwaltete Bereitstellung verschiedener Basis- und Partnermodelle über eine gemeinsame API-Oberfläche, analog zur AWS-Bedrock-Logik, siehe [KB-0479](../19-aws/17-amazon-bedrock.md)), **Projekte** (eine Organisationseinheit, die Ressourcen, Konfigurationen und Zugriffsrechte für einen konkreten Anwendungsfall bündelt) und **Unternehmensintegration** (Anbindung an Azure-Identitäts-, Netzwerk- und Governance-Infrastruktur, damit AI-Lösungen denselben Sicherheits- und Compliance-Anforderungen unterliegen wie andere Unternehmensanwendungen). Der Agent Service, der agentenbasierte Orchestrierung auf Basis dieser Modellzugangs- und Projektstruktur ermöglicht, wird hier nur referenziert, nicht vertieft — die Detailbehandlung agentenspezifischer Konzepte gehört in den dedizierten Agententrack dieser Wissensdatenbank. Da sich verwaltete AI-Plattformdienste wie Microsoft Foundry sehr schnell weiterentwickeln, sind konkrete Aussagen zu Modellverfügbarkeit, Preisgestaltung oder Funktionsumfang in diesem Kapitel bewusst konservativ gehalten und müssen vor jeder produktiven Entscheidung explizit gegen aktuelle Primärquellen (Microsoft-Dokumentation zum Zeitpunkt der Entscheidung) verifiziert werden, statt sich auf den zum Recherchezeitpunkt dieses Kapitels (2026-09-18) gültigen Stand zu verlassen.

## Zweck, Mental Model und Dependencies

Microsoft Foundry adressiert das strukturelle Problem, dass Unternehmen, die generative AI-Modelle produktiv nutzen wollen, sowohl konsistenten, governance-konformen Zugang zu verschiedenen Modellen als auch eine Organisationsstruktur benötigen, die verschiedene Anwendungsfälle (Projekte) mit jeweils passenden Ressourcen, Konfigurationen und Zugriffsrechten voneinander trennt, ohne dass jedes Projekt eine eigene, redundante Infrastruktur aufbauen muss. Modellzugang erfolgt über eine gemeinsame API-Oberfläche, die verschiedene Basis- und Partnermodelle verwaltet bereitstellt — strukturell vergleichbar mit der Rolle, die Amazon Bedrock innerhalb der AWS-Plattform einnimmt (siehe [KB-0479](../19-aws/17-amazon-bedrock.md)), wobei die konkrete Modellauswahl, Feature-Parität zwischen Modellen und regionale Verfügbarkeit sich laufend ändern und daher nicht als statisch angenommen werden dürfen. Ein Projekt bündelt die für einen Anwendungsfall benötigten Ressourcen (Modellverbindungen, Datenquellen, Zugriffsrechte) in einer klar abgegrenzten Organisationseinheit, was eine granulare Kostenzuordnung und Zugriffskontrolle pro Anwendungsfall ermöglicht, statt einer undifferenzierten, unternehmensweiten Nutzung ohne klare Verantwortungsgrenzen. Die Unternehmensintegration verankert Microsoft Foundry in der bestehenden Azure-Identitäts- (Entra ID, siehe [KB-0482](02-entra-tenant-design-fuer-azure.md)) und Netzwerkinfrastruktur (Private Link, siehe [KB-0484](04-azure-vnets-und-private-link.md)), sodass AI-Lösungen nicht als isolierte, separat abzusichernde Systeme behandelt werden müssen, sondern denselben etablierten Governance-Mechanismen unterliegen wie andere Unternehmensressourcen.

~~~text
Microsoft Foundry: 3 structural building blocks for enterprise AI solutions
  Model access: managed provisioning of base + partner models via common API surface
    (parallel to AWS Bedrock, see KB-0479) -- model selection/feature parity/regional availability CHANGES FAST
  Project: organizational unit bundling resources/config/access rights per use case
    -> granular cost allocation + access control PER use case (vs undifferentiated enterprise-wide use)
  Enterprise integration: anchored in existing Azure identity (Entra ID) + network (Private Link) infra
    -> AI solutions subject to SAME governance as other enterprise resources (not isolated systems)
Agent Service: referenced only -- detailed treatment belongs in dedicated AGENT TRACK of this KB
CAUTION: managed AI platform services evolve VERY FAST
  -> concrete feature/model/pricing claims deliberately kept conservative here
  -> MUST verify against current primary sources before any production decision
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Modellzugang | verwaltete Bereitstellung von Basis-/Partnermodellen über gemeinsame API | analog zu AWS Bedrock, Feature-Parität variiert und muss verifiziert werden |
| Projekt | Bündelung von Ressourcen/Konfiguration/Zugriffsrechten pro Anwendungsfall | ermöglicht granulare Kosten-/Zugriffszuordnung |
| Unternehmensintegration | Anbindung an Entra ID und Azure-Netzwerkinfrastruktur | AI-Lösungen unterliegen denselben Governance-Mechanismen |
| Agent Service | agentenbasierte Orchestrierung auf Basis von Modellzugang/Projekten | Detailbehandlung im dedizierten Agententrack |

Implementierung: Für jeden Anwendungsfall wird ein separates Projekt mit klar abgegrenzten Ressourcen und Zugriffsrechten angelegt, statt eine unternehmensweite, undifferenzierte Nutzung eines gemeinsamen Zugangs zuzulassen. Vor jeder produktiven Modellentscheidung wird die tatsächliche, aktuelle Verfügbarkeit und Feature-Parität des gewählten Modells explizit gegen die aktuelle Microsoft-Dokumentation verifiziert, statt sich auf Annahmen aus früheren Recherchen zu verlassen. Unternehmensintegration erfolgt konsequent über bestehende Entra-ID- und Private-Link-Mechanismen statt über isolierte, separat abzusichernde Zugänge.

## Scalability, Reliability, Security und Observability

Microsoft Foundry skaliert die organisatorische Klarheit proportional zur Projektabgrenzung; die Reliability-Grenze liegt darin, dass eine veraltete Annahme über den sich schnell weiterentwickelnden Funktionsumfang proportional zur tatsächlichen Diskrepanz zwischen Erwartung und aktuellem Dienstverhalten zu unerwarteten Funktionslücken führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein erwartetes Modell-Feature ist nicht verfügbar | die Annahme über den Funktionsumfang basiert auf veralteter Dokumentation oder früherer Recherche | die aktuelle Microsoft-Dokumentation zum Zeitpunkt der Prüfung explizit konsultieren |
| Kosten oder Zugriffsrechte verschiedener Anwendungsfälle sind nicht klar zuordenbar | mehrere Anwendungsfälle teilen sich ein undifferenziertes Projekt statt separater Projekte | prüfen, ob eine Aufteilung in separate Projekte pro Anwendungsfall sinnvoll ist |
| eine AI-Lösung unterliegt nicht denselben Sicherheitsrichtlinien wie andere Unternehmensanwendungen | die Unternehmensintegration über Entra ID/Private Link ist unvollständig konfiguriert | prüfen, ob die AI-Ressourcen korrekt an bestehende Identitäts- und Netzwerkinfrastruktur angebunden sind |

Security: Zugriff auf Modelle und Projektressourcen sollte über Entra-ID-basierte RBAC statt über gemeinsam genutzte statische Zugangsschlüssel erfolgen, konsistent mit der allgemeinen Azure-Zugriffskontrollpraxis. Observability: Die tatsächliche Modellnutzung pro Projekt, Zugriffsmuster relativ zu erwarteten Anwendungsfällen, und die Häufigkeit von Funktionsverifikationsprüfungen vor produktiven Entscheidungen sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** richtet ein Projekt mit korrekt abgegrenzten Ressourcen für einen gegebenen Anwendungsfall ein. **Principal** entscheidet, welche Modelle und Integrationsmuster für eine konkrete Architektur geeignet sind, unter expliziter Verifikation aktueller Fähigkeiten. **Chief** koppelt unternehmensweite Nutzungsentscheidungen an eine verbindliche Pflicht zur Verifikation gegen aktuelle Primärquellen.

Anti-Patterns: Funktions- oder Modellverfügbarkeitsannahmen aus früheren Recherchen ungeprüft in produktive Entscheidungen übernehmen; mehrere unabhängige Anwendungsfälle ohne Projektabgrenzung in einer undifferenzierten gemeinsamen Umgebung betreiben; AI-Ressourcen ohne Anbindung an bestehende Entra-ID-/Netzwerk-Governance isoliert betreiben.

## Production Checklist

- [ ] Jeder Anwendungsfall hat ein eigenes, klar abgegrenztes Projekt.
- [ ] Aktuelle Modellverfügbarkeit und Feature-Parität sind vor jeder produktiven Entscheidung gegen aktuelle Primärquellen verifiziert.
- [ ] Unternehmensintegration über Entra ID und Private Link ist vollständig konfiguriert.
- [ ] Zugriff erfolgt über Entra-ID-basierte RBAC statt statischer Zugangsschlüssel.

## Interviewfragen

### 1. Welche drei strukturellen Bausteine bündelt Microsoft Foundry?

**Antwort:** Modellzugang, Projekte und Unternehmensintegration.

### 2. Wie ist Microsoft Foundry strukturell mit Amazon Bedrock vergleichbar?

**Antwort:** Beide bieten verwalteten Zugang zu verschiedenen Basis-/Partnermodellen über eine gemeinsame API-Oberfläche, wobei konkrete Modellauswahl und Feature-Parität bei beiden Diensten laufend variieren.

### 3. Wofür dient ein Projekt in Microsoft Foundry?

**Antwort:** Zur Bündelung von Ressourcen, Konfiguration und Zugriffsrechten für einen konkreten Anwendungsfall, was granulare Kosten- und Zugriffszuordnung ermöglicht.

### 4. Warum werden in diesem Kapitel keine konkreten Modellverfügbarkeitsaussagen getroffen?

**Antwort:** Weil sich verwaltete AI-Plattformdienste sehr schnell weiterentwickeln und konkrete Aussagen zum Recherchezeitpunkt schnell veralten können — solche Aussagen müssen vor jeder produktiven Entscheidung gegen aktuelle Primärquellen verifiziert werden.

### 5. Wie gehst du vor, wenn ein erwartetes Modell-Feature nicht verfügbar ist?

**Antwort:** Ich prüfe zuerst, ob meine Annahme über den Funktionsumfang auf veralteter Dokumentation basiert, und konsultiere die aktuelle Microsoft-Dokumentation, bevor ich ein technisches Problem vermute.

### 6. Widersprüchliche Anforderung: Team will schnelle, unternehmensweite Standardisierung auf ein einzelnes Modell UND maximale Flexibilität, für jeden Anwendungsfall das jeweils beste verfügbare Modell zu wählen — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, die Modellwahl pro Projekt zu treffen (Flexibilität) und gleichzeitig eine unternehmensweite Standardkonfiguration für Governance, Zugriffskontrolle und Unternehmensintegration festzulegen (Standardisierung), statt Modellwahl und Governance-Standardisierung als denselben Entscheidungsraum zu behandeln.

## Praktische Labs

~~~python
# Conceptual project-based resource isolation for AI use cases (not executed against a real Azure account):

def create_project_summary(project_name, model, use_case, cost_center):
    return {
        "project": project_name,
        "model": model,
        "use_case": use_case,
        "cost_center": cost_center,
        "note": "Verify current model availability/feature parity against primary sources before production use.",
    }

projects = [
    create_project_summary("support-triage", "model-A", "internal ticket triage", "cc-1001"),
    create_project_summary("contract-review", "model-B", "legal document review", "cc-1002"),
]

for p in projects:
    print(p)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Microsoft Foundry — Overview](https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-azure-ai-foundry), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Microsoft Foundry — Projects](https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/projects), abgerufen 2026-09-18.

Amazon Bedrock ist kanonisch in [KB-0479](../19-aws/17-amazon-bedrock.md) behandelt; Verwaltete Modellplattformen allgemein in [KB-0268](../11-genai-architecture/28-verwaltete-modellplattformen.md); Entra-Tenant-Design in [KB-0482](02-entra-tenant-design-fuer-azure.md); Azure-VNets und Private Link in [KB-0484](04-azure-vnets-und-private-link.md). Agent-Service-Detailbehandlung gehört in den dedizierten Agententrack (Domain 12) dieser Wissensdatenbank.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende Konvergenz von Modellzugang, Agentenorchestrierung und Unternehmensintegration in einer einzigen verwalteten Plattform | Evaluating | Gegenüber einer manuell zusammengesetzten Kombination separater Dienste erst nach Prüfung der aktuellen Reife und Vertragsbedingungen der konvergenten Plattform bevorzugen. |

Ein Team akzeptiert eine Microsoft-Foundry-Nutzung erst, wenn Modellwahl, Projektabgrenzung und Unternehmensintegration nachweislich gegen aktuelle Primärquellen verifiziert und nicht auf veralteten Annahmen aufgebaut sind.
