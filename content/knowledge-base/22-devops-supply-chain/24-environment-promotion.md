---
{"id": "KB-0536", "title": "Environment Promotion", "domain": "22", "sequence": 24, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0528", "concepts": ["Artifact Registries"], "needed_for": "understanding"}, {"id": "KB-0534", "concepts": ["Policy Gates für die Lieferkette"], "needed_for": "understanding"}, {"id": "KB-0535", "concepts": ["Deployment-Rollback und Datenfolgen"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Dasselbe, digest-identifizierte Artefakt anhand offizieller Praktiken durch Test-, Staging- und Produktionsumgebungen bewegen können, mit erhaltener Herkunft und umgebungsspezifischer, aber vom Artefakt getrennter Konfiguration.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Lieferkette explizit gestalten, wie Konfigurationsabweichungen zwischen Umgebungen verwaltet werden, ohne die zugrunde liegende Artefaktidentität zu verändern, und wie Freigaben pro Umgebungsübergang durchgesetzt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Diskrepanz zwischen Staging- und Produktionsverhalten auf eine erneute Artefakterstellung für die Zielumgebung statt einer reinen Promotion des bereits verifizierten Artefakts zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Environment Promotion festlegen, die dasselbe Artefakt mit erhaltener, überprüfbarer Herkunft durch alle Umgebungen bewegen, statt erneuter Builds pro Umgebung.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailkonfiguration spezifischer Promotion-Automatisierungswerkzeuge im Detail ist Vertiefung.", "rationale": "Kern dieses Abschlusskapitels ist die integrative Zusammenführung von Artefaktidentität, Konfigurationstrennung, Policy Gates und Rollback-/Roll-Forward-Bewusstsein über den gesamten Promotion-Pfad, nicht die werkzeugspezifische Automatisierung."}}, "lab_validation": [{"lab_id": "KB-0536-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Konfigurationsdrift bei erneuter Artefakterstellung statt reiner Promotion, kein produktives Promotion-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein für die Staging-Umgebung neu gebautes (statt aus Test promotetes) Artefakt trotz identischem Quellcode durch abweichende Build-Zeitabhängigkeiten ein anderes tatsächliches Artefakt erzeugen kann als das in der Testumgebung verifizierte, und zeigt damit, warum Promotion die Weitergabe des bereits verifizierten Digests statt eines erneuten Builds erfordert.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Promotion-System mit tatsächlicher Umgebungsdynamik."}]}
---
# Environment Promotion

> **Ziel:** Dieses Abschlusskapitel der DevOps/Supply-Chain-Domain führt die in den vorangegangenen 23 Kapiteln behandelten Bausteine — Artifact Registries mit digest-basierter, unveränderlicher Identität (siehe [KB-0528](16-artifact-registries.md)), Policy Gates mit inhaltlich belastbaren Freigaberegeln (siehe [KB-0534](22-policy-gates-fuer-die-lieferkette.md)), und Rollback-/Roll-Forward-Bewusstsein bei Datenfolgen (siehe [KB-0535](23-deployment-rollback-und-datenfolgen.md)) — zu einem vollständigen Environment-Promotion-Prozess zusammen: **Dasselbe** Artefakt (identifiziert über seinen unveränderlichen Digest, nicht neu gebaut) bewegt sich durch Test-, Staging- und Produktionsumgebungen, wobei **Konfigurationsabweichungen** (umgebungsspezifische Werte wie Datenbankverbindungen oder Skalierungsparameter) explizit vom Artefakt selbst getrennt bleiben, **Freigaben** (Policy Gates) an jedem Umgebungsübergang durchgesetzt werden, und die **überprüfbare Herkunft** (welches Artefakt durchlief welche Prüfungen in welcher Umgebung) während des gesamten Promotion-Pfads erhalten bleibt. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartete Diskrepanz zwischen Staging- und Produktionsverhalten fast immer darauf hindeutet, dass für die Produktionsumgebung ein neues Artefakt gebaut wurde, statt das bereits in Staging verifizierte Artefakt unverändert zu promoten — dieselbe Grundregel, die bereits bei Pipeline-Architektur (siehe [KB-0518](06-pipeline-architektur.md)) und Artifact Registries (siehe [KB-0528](16-artifact-registries.md)) etabliert wurde, gilt für den gesamten Promotion-Pfad: build einmal, bewege dasselbe, unveränderliche Artefakt durch alle Umgebungen.

## Zweck, Mental Model und Dependencies

Environment Promotion integriert die Erkenntnis aus der gesamten Domäne, dass Artefaktidentität und Konfiguration zwei fundamental getrennte Konzepte sind, die während einer Promotion niemals vermischt werden dürfen: Das Artefakt selbst (ein Container-Image, ein Paket) bleibt über alle Umgebungen hinweg bitweise identisch, identifiziert über seinen unveränderlichen Digest (siehe [KB-0528](16-artifact-registries.md)), während umgebungsspezifische Werte (Datenbankverbindungszeichenfolgen, Skalierungsparameter, Feature-Flag-Zustände) ausschließlich über externe Konfiguration injiziert werden, die getrennt vom Artefakt verwaltet wird. Diese Trennung stellt sicher, dass ein in Test verifiziertes Artefakt tatsächlich dasselbe Artefakt ist, das in Staging und schließlich Produktion läuft — nur die umgebende Konfiguration ändert sich, nicht das Artefakt selbst. An jedem Übergang zwischen Umgebungen (Test zu Staging, Staging zu Produktion) wird ein Policy Gate durchgesetzt (siehe [KB-0534](22-policy-gates-fuer-die-lieferkette.md)), das inhaltlich belastbare Belege (nicht nur formale grüne Status) für die Freigabe verlangt — üblicherweise mit steigender Strenge, je näher die Zielumgebung an der Produktion liegt. Die überprüfbare Herkunft über den gesamten Promotion-Pfad bedeutet, dass zu jedem Zeitpunkt nachvollziehbar bleibt, welches spezifische Artefakt (über seinen Digest) welche Prüfungen in welcher Umgebung durchlaufen hat, was sowohl für Audit-Zwecke als auch für die Ursachenanalyse bei einem später entdeckten Problem essenziell ist. Schließlich integriert dieses Kapitel das Rollback-/Roll-Forward-Bewusstsein aus [KB-0535](23-deployment-rollback-und-datenfolgen.md): Für jede Promotion in eine kritische Umgebung wird explizit bewertet, ob ein Rollback bei Problemen tatsächlich möglich bleibt, oder ob Datenfolgen der Promotion einen Roll-Forward-Plan erfordern.

~~~text
Environment Promotion: DOMAIN 22 CAPSTONE -- integrates Artifact Registries (KB-0528),
                                              Policy Gates (KB-0534), Rollback/Roll-Forward awareness (KB-0535)
CORE RULE (consistent with Pipeline Architecture KB-0518 and Artifact Registries KB-0528):
  build ONCE, move the SAME, unchanged, digest-identified artifact through ALL environments
  -> NEVER rebuild for a new target environment
Artifact identity vs Configuration: STRICTLY SEPARATE concepts
  artifact: bitwise identical across environments (identified by digest, KB-0528)
  configuration: environment-specific values (DB conn strings, scaling params, flag states)
    injected EXTERNALLY, managed SEPARATELY from the artifact
Policy Gate at EVERY environment transition (test->staging->prod, KB-0534)
  -> MEANINGFUL evidence required, typically INCREASING strictness closer to production
Verifiable provenance across ENTIRE promotion path
  -> at any point: which SPECIFIC artifact (digest) passed which checks in which environment
  -> essential for audit AND root-cause analysis of later-discovered issues
Rollback/Roll-Forward awareness (KB-0535) integrated: EVERY promotion to a critical env
  -> explicitly assess: does rollback stay possible, or does this promotion's data consequence require roll-forward?
UNEXPECTED staging-vs-production behavior discrepancy
  -> almost always = NEW artifact built for production INSTEAD OF promoting the already-verified staging artifact
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Artefaktidentität über Promotion-Pfad | dasselbe, unveränderliche Artefakt in allen Umgebungen | verhindert Diskrepanz zwischen getesteter und deployter Version |
| Konfigurationstrennung | umgebungsspezifische Werte extern vom Artefakt injiziert | ermöglicht Wiederverwendung desselben Artefakts über Umgebungen |
| Policy Gate pro Übergang | inhaltlich belastbare Freigabe bei jedem Umgebungswechsel | steigende Strenge näher an Produktion |
| Überprüfbare Herkunft | nachvollziehbar, welches Artefakt welche Prüfungen durchlief | essenziell für Audit und Ursachenanalyse |
| Rollback-/Roll-Forward-Bewertung | explizite Prüfung vor jeder kritischen Promotion | verhindert Überraschung im Ernstfall |

Implementierung: Jede Promotion zwischen Umgebungen erfolgt über die explizite Übertragung des bereits verifizierten Digests, niemals über einen erneuten Build für die Zielumgebung. Konfiguration wird konsequent extern und umgebungsspezifisch injiziert, niemals in das Artefakt selbst eingebettet. An jedem Umgebungsübergang wird ein Policy Gate mit inhaltlich belastbaren Kriterien durchgesetzt. Für jede Promotion in eine kritische Umgebung wird explizit bewertet, ob Rollback-Fähigkeit erhalten bleibt oder ein Roll-Forward-Plan vorzubereiten ist.

## Scalability, Reliability, Security und Observability

Environment Promotion skaliert die Verlässlichkeit der Lieferkette proportional zur konsequenten Trennung von Artefaktidentität und Konfiguration sowie zur Vollständigkeit der Policy-Gate-Durchsetzung an jedem Übergang; die Reliability-Grenze liegt darin, dass eine erneute Artefakterstellung statt reiner Promotion proportional zur Build-Umgebungsvolatilität zu unerwarteten Verhaltensdiskrepanzen zwischen Umgebungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Staging- und Produktionsverhalten weichen unerwartet voneinander ab | für Produktion wurde ein neues Artefakt gebaut statt das in Staging verifizierte Artefakt zu promoten | die Digests des in Staging getesteten und des in Produktion deployten Artefakts explizit vergleichen |
| umgebungsspezifische Konfiguration ist inkonsistent oder fest im Artefakt eingebettet | Konfiguration wurde nicht konsequent extern vom Artefakt getrennt verwaltet | Konfiguration auf externe, umgebungsspezifische Injektion umstellen |
| eine Promotion in Produktion führt zu einem nicht mehr rückgängig machbaren Zustand | die Rollback-Fähigkeit wurde vor der Promotion nicht explizit bewertet | vor jeder kritischen Promotion explizit prüfen, ob Rollback möglich bleibt, und bei Bedarf einen Roll-Forward-Plan vorbereiten |

Security: Policy Gates an jedem Umgebungsübergang sollten mit steigender Strenge konfiguriert werden, je näher die Zielumgebung an der Produktion liegt, und Konfigurationswerte mit sensiblen Daten sollten getrennt von der übrigen Umgebungskonfiguration mit zusätzlichem Zugriffsschutz verwaltet werden. Observability: Die tatsächliche Konsistenz der Artefaktidentität über den gesamten Promotion-Pfad, die Vollständigkeit der Policy-Gate-Durchsetzung pro Übergang, und die Ergebnisse der Rollback-Fähigkeitsprüfungen sind zentrale Betriebssignale zur Bewertung der Lieferkettenreife.

## Trade-offs und Entscheidungen

**Staff** führt eine Promotion für ein gegebenes Artefakt zwischen zwei Umgebungen korrekt durch, mit erhaltener Artefaktidentität. **Principal** entwirft den vollständigen Promotion-Pfad mit Konfigurationstrennung, Policy-Gate-Strenge und Rollback-Bewertung für eine gesamte Lieferkette. **Chief** legt unternehmensweite Standards fest, die dasselbe, unveränderliche Artefakt durch alle Umgebungen bewegen, statt erneuter Builds pro Umgebungswechsel.

Anti-Patterns: ein Artefakt für jede Zielumgebung erneut bauen, statt das bereits verifizierte Artefakt zu promoten; Konfiguration fest in das Artefakt einbetten, statt sie extern und umgebungsspezifisch zu injizieren; Promotion in kritische Umgebungen ohne vorherige Bewertung der Rollback-Fähigkeit durchführen.

## Production Checklist

- [ ] Jede Promotion überträgt den bereits verifizierten Digest, ohne erneuten Build für die Zielumgebung.
- [ ] Konfiguration ist konsequent extern und umgebungsspezifisch injiziert, nicht im Artefakt eingebettet.
- [ ] Policy Gates mit inhaltlich belastbaren Kriterien sind an jedem Umgebungsübergang durchgesetzt.
- [ ] Rollback-Fähigkeit oder ein Roll-Forward-Plan ist vor jeder Promotion in eine kritische Umgebung bewertet.

## Interviewfragen

### 1. Was ist die Grundregel für Environment Promotion bezüglich Artefakten?

**Antwort:** Dasselbe, unveränderliche, digest-identifizierte Artefakt wird durch alle Umgebungen bewegt, statt für jede Zielumgebung neu gebaut zu werden.

### 2. Warum müssen Artefaktidentität und Konfiguration strikt getrennt bleiben?

**Antwort:** Damit dasselbe Artefakt über alle Umgebungen hinweg bitweise identisch bleibt, während nur die umgebende, umgebungsspezifische Konfiguration sich ändert — dies stellt sicher, dass das in Test verifizierte Artefakt tatsächlich dasselbe ist, das in Produktion läuft.

### 3. Warum sind unerwartete Diskrepanzen zwischen Staging- und Produktionsverhalten fast immer auf einen erneuten Build zurückzuführen?

**Antwort:** Weil subtile Build-Umgebungsunterschiede bei einem erneuten Build ein tatsächlich anderes Artefakt erzeugen können, selbst bei identischem Quellcode, wodurch das in Produktion laufende Artefakt vom in Staging getesteten abweicht.

### 4. Was sollte vor jeder Promotion in eine kritische Umgebung explizit bewertet werden?

**Antwort:** Ob die Rollback-Fähigkeit nach dieser Promotion erhalten bleibt oder ob Datenfolgen einen vorbereiteten Roll-Forward-Plan erfordern.

### 5. Wie gehst du vor, wenn Staging- und Produktionsverhalten unerwartet voneinander abweichen?

**Antwort:** Ich vergleiche explizit die Digests des in Staging getesteten und des in Produktion deployten Artefakts, da eine erneute Artefakterstellung für die Zielumgebung statt reiner Promotion die häufigste Ursache für solche Diskrepanzen ist.

### 6. Widersprüchliche Anforderung: Team will pro Umgebung individuell angepasste, optimierte Artefakte UND garantiert, dass genau das getestete Artefakt in jeder Umgebung läuft — wie gehst du vor?

**Antwort:** Ich würde erklären, dass umgebungsspezifisch angepasste Artefakte und garantierte Artefaktkonsistenz sich strukturell widersprechen, und vorschlagen, ein einziges, umgebungsunabhängiges Artefakt zu bauen und umgebungsspezifische Anpassungen ausschließlich über externe Konfiguration statt über unterschiedliche Artefaktversionen vorzunehmen — Optimierung und Konsistenz lassen sich durch Konfigurationsparameter statt durch getrennte Artefakte pro Umgebung vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of artifact-identity consistency across the promotion path (executed locally, no real system):

def promote(source_digest, target_env, rebuild_for_target=False):
    if rebuild_for_target:
        return {"env": target_env, "digest": f"{source_digest}-rebuilt-for-{target_env}", "consistent": False}
    return {"env": target_env, "digest": source_digest, "consistent": True}

staging_digest = "sha256:abc123"
staging_result = promote(staging_digest, "staging")
prod_result_correct = promote(staging_result["digest"], "production")
prod_result_incorrect = promote(staging_result["digest"], "production", rebuild_for_target=True)

print("correct promotion:", prod_result_correct)
print("incorrect (rebuilt):", prod_result_incorrect)
~~~

## Dependencies, Cross-References und Quellen

1. Google-Dokumentation: [DevOps Tech: Deployment Automation](https://cloud.google.com/architecture/devops/devops-tech-deployment-automation), abgerufen 2026-09-18.
2. CNCF-Dokumentation: [OpenGitOps Principles](https://opengitops.dev/), abgerufen 2026-09-18.

Artifact Registries sind kanonisch in [KB-0528](16-artifact-registries.md) behandelt; Policy Gates für die Lieferkette in [KB-0534](22-policy-gates-fuer-die-lieferkette.md); Deployment-Rollback und Datenfolgen in [KB-0535](23-deployment-rollback-und-datenfolgen.md); Pipeline-Architektur in [KB-0518](06-pipeline-architektur.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte End-to-End-Provenienzverfolgung über den gesamten Promotion-Pfad (von Build über jede Umgebung bis Produktion) in einem einzigen, durchsuchbaren Nachweis | Evaluating | Gegenüber fragmentierter, pro-Werkzeug getrennter Herkunftsverfolgung erst nach Prüfung der tatsächlichen Integrationsreife über die gesamte Toolchain bevorzugen. |

Ein Team akzeptiert eine Environment-Promotion-Pipeline erst, wenn nachweislich dasselbe, unveränderliche Artefakt durch alle Umgebungen bewegt wird, Konfiguration strikt getrennt bleibt, Policy Gates an jedem Übergang durchgesetzt werden, und Rollback-/Roll-Forward-Fähigkeit vor jeder kritischen Promotion bewertet wurde — damit ist Domain 22 (DevOps/Supply Chain) mit allen 24 Dateien vollständig ausgearbeitet.
