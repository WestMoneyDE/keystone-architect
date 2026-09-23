---
{"id": "KB-0356", "title": "Model Registries und Freigabestatus", "domain": "15", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0351", "concepts": ["MLflow und Modelllebenszyklen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Modellversion mit unveränderlicher Identität (Hash-basiert) registrieren und den Unterschied zu einem frei überschreibbaren Modellnamen demonstrieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Registry-Struktur mit klaren Promotion-Grenzen (z. B. Staging zu Production nur nach bestandener Prüfung) und unveränderlichen Modellidentitäten gestalten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Team davon überzeugen, produktive Modellreferenzen über unveränderliche Versionskennungen statt über einen frei überschreibbaren Modellnamen wie 'latest' zu verwalten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unveränderliche Modellidentitäten und dokumentierte Prüfbelege als nicht verhandelbaren Governance-Standard für jede Produktions-Promotion im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Registry-Föderation über mehrere Teams/Organisationen hinweg ist Vertiefung.", "rationale": "Kern ist das Verständnis von unveränderlichen Identitäten und Promotion-Grenzen, nicht die organisationsübergreifende Föderation."}}, "lab_validation": [{"lab_id": "KB-0356-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Szenario mit einem frei überschreibbaren Modellnamen ('latest') gegenüber einer unveränderlichen, hash-referenzierten Modellversion", "evidence": "Ein Produktionssystem, das ein Modell über den überschreibbaren Namen 'latest' referenziert, verwendet nach einer erneuten Registrierung unbemerkt eine andere, nicht geprüfte Modellversion, während ein System, das eine unveränderliche, versionsspezifische Kennung referenziert, stets exakt dieselbe geprüfte Modellversion verwendet, bis die Referenz explizit geändert wird.", "limitations": "Kein produktives Registry-System, kein realer Geschäftsdatensatz, lokal simuliertes Szenario."}]}
---
# Model Registries und Freigabestatus

> **Ziel:** Eine Model Registry verwaltet Modellartefakte, ihre Metadaten und explizite Promotion-Grenzen (definierte Übergänge zwischen Lebenszyklusphasen wie Staging und Production), aufbauend auf den Registry-Grundlagen aus [KB-0351](01-mlflow-und-modelllebenszyklen.md). Der zentrale Governance-Punkt dieses Kapitels ist die Durchsetzung unveränderlicher Modellidentitäten (jede Modellversion ist über eine feste, nicht überschreibbare Kennung eindeutig referenzierbar) und dokumentierter Prüfbelege gegenüber frei überschreibbaren Modellnamen (z. B. ein Name wie "latest", der bei jeder neuen Registrierung unbemerkt auf eine andere, potenziell ungeprüfte Modellversion verweist).

## Zweck, Mental Model und Dependencies

Ein frei überschreibbarer Modellname funktioniert wie ein Zeiger, der bei jeder neuen Registrierung auf eine andere, aktuellere Modellversion umgelenkt wird — ein Produktionssystem, das diesen Namen referenziert, verwendet automatisch die jeweils neueste Version, ohne dass dies explizit nachvollzogen oder geprüft wird. Dies erzeugt ein konkretes Risiko: eine neue, möglicherweise fehlerhafte oder ungeprüfte Modellversion kann unbemerkt in Produktion gelangen, sobald sie unter demselben Namen registriert wird, ohne dass ein expliziter Freigabeschritt stattfindet. Eine unveränderliche Modellidentität löst dieses Problem, indem jede registrierte Version eine feste, eindeutige Kennung (z. B. eine Versionsnummer oder ein Inhalts-Hash) erhält, die niemals auf eine andere Version umgelenkt wird — ein Produktionssystem referenziert eine spezifische Version explizit, und ein Wechsel zu einer neuen Version erfordert eine bewusste, dokumentierte Änderung dieser Referenz. Promotion-Grenzen definieren, unter welchen Bedingungen eine Modellversion von einer Phase (z. B. Staging) in die nächste (z. B. Production) übergehen darf — typischerweise verknüpft mit dokumentierten Prüfbelegen (bestandene Tests, Robustheitsprüfungen aus [KB-0345](../14-ml-engineering/15-robustheit-und-verteilungsaenderung.md), Genehmigung durch eine verantwortliche Person), statt einer unkontrollierten, automatischen Umstufung.

~~~text
Mutable model name (e.g. "latest"): pointer that silently shifts to newest registration
  -> production referencing it auto-uses whichever version was registered last, WITHOUT explicit review
  -> RISK: unvetted/broken model reaches production silently
Immutable model identity: fixed, unique version identifier (version number or content hash), NEVER redirected
  -> production references a SPECIFIC version explicitly; switching requires a deliberate, documented reference change
Promotion boundary: explicit condition for phase transition (Staging -> Production)
  -> tied to documented evidence: passed tests, robustness checks (KB-0345), sign-off — NOT automatic
~~~

## Core Concepts, Architektur und Implementierung

| Element | Funktion | Risiko ohne dieses Element |
|---|---|---|
| Unveränderliche Modellidentität | referenziert eine spezifische, feste Modellversion eindeutig | ein überschreibbarer Name kann unbemerkt auf eine andere, ungeprüfte Version zeigen |
| Promotion-Grenze | erzwingt eine explizite Bedingung für den Phasenübergang | Modellversionen können ohne Prüfung direkt in Produktion gelangen |
| Dokumentierte Prüfbelege | belegen, dass eine Promotion-Bedingung tatsächlich erfüllt wurde | eine Promotion kann ohne nachvollziehbare Begründung erfolgen |

Implementierung: Jede Modellversion erhält bei der Registrierung eine feste, unveränderliche Kennung (z. B. eine fortlaufende Versionsnummer oder einen Inhalts-Hash), die niemals nachträglich einer anderen Version zugewiesen wird. Produktive Systeme referenzieren ausschließlich diese spezifische Kennung, nie einen überschreibbaren Namen wie "latest". Der Übergang einer Modellversion in die Produktionsphase erfordert eine explizite Promotion mit dokumentierten Prüfbelegen (z. B. bestandene Robustheits- und Evaluationstests, siehe [KB-0343](../14-ml-engineering/13-modellbewertung-und-fehlertypen.md) und [KB-0345](../14-ml-engineering/15-robustheit-und-verteilungsaenderung.md)) statt einer automatischen oder unkontrollierten Umstufung.

## Scalability, Reliability, Security und Observability

Unveränderliche Modellidentitäten skalieren Nachvollziehbarkeit unabhängig von der Anzahl der Modellversionen; die Reliability-Grenze liegt darin, dass überschreibbare Namen proportional zur Häufigkeit neuer Registrierungen das Risiko unbemerkter, ungeprüfter Produktionswechsel erhöhen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Produktionssystem zeigt plötzlich unerwartetes Modellverhalten ohne dokumentierte Änderung | ein überschreibbarer Modellname wurde durch eine neue, ungeprüfte Registrierung unbemerkt umgelenkt | prüfen, ob das System einen überschreibbaren Namen statt einer unveränderlichen Versionskennung referenziert |
| eine fehlerhafte Modellversion gelangt in Produktion, ohne dass ein Freigabeprozess dokumentiert ist | keine expliziten Promotion-Grenzen mit Prüfbelegpflicht wurden durchgesetzt | den Registry-Promotion-Prozess prüfen und eine verpflichtende Prüfbelegdokumentation vor jeder Production-Umstufung einführen |
| es ist unklar, welche Modellversion für ein früheres Produktionsverhalten verantwortlich war | fehlende unveränderliche Versionsreferenzierung verhindert eine nachträgliche Zuordnung | die Registry-Historie nach der zum fraglichen Zeitpunkt in Production-Phase befindlichen Versionskennung durchsuchen |

Security: Unveränderliche Modellidentitäten mit dokumentierten Prüfbelegen sind eine Voraussetzung für Rechenschaftspflicht bei fehlerhaften oder schädlichen Modellentscheidungen, da jede produktive Entscheidung eindeutig einer geprüften, spezifischen Version zugeordnet werden kann. Observability: Die aktuelle Promotion-Phase jeder Modellversion, die Historie der Phasenübergänge mit Zeitstempel und verantwortlicher Person, sowie die verknüpften Prüfbelege pro Promotion sind zentrale Governance-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert unveränderliche Versionskennungen für jede registrierte Modellversion. **Principal** macht Promotion-Grenzen und die zugehörigen Prüfbelege für das Team nachvollziehbar. **Chief** etabliert unveränderliche Modellidentitäten und dokumentierte Prüfbelege als nicht verhandelbaren Governance-Standard für jede Produktions-Promotion im Unternehmen.

Anti-Patterns: produktive Systeme über einen frei überschreibbaren Modellnamen wie "latest" statt einer unveränderlichen Versionskennung referenzieren; eine Modellversion ohne dokumentierte Prüfbelege in die Produktionsphase umstufen; die Promotion-Historie einer Modellversion nicht nachvollziehbar protokollieren.

## Production Checklist

- [ ] Jede registrierte Modellversion besitzt eine feste, unveränderliche Kennung.
- [ ] Produktive Systeme referenzieren ausschließlich spezifische Versionskennungen, nie überschreibbare Namen.
- [ ] Jede Production-Promotion erfordert dokumentierte Prüfbelege.
- [ ] Die Promotion-Historie jeder Modellversion ist mit Zeitstempel und verantwortlicher Person nachvollziehbar.

## Interviewfragen

### 1. Was ist das Risiko eines frei überschreibbaren Modellnamens wie "latest" in Produktion?

**Antwort:** Er kann bei jeder neuen Registrierung unbemerkt auf eine andere, möglicherweise ungeprüfte Modellversion umgelenkt werden, wodurch eine fehlerhafte Version ohne expliziten Freigabeschritt in Produktion gelangen kann.

### 2. Wie löst eine unveränderliche Modellidentität dieses Problem?

**Antwort:** Jede Version erhält eine feste, eindeutige Kennung, die niemals umgelenkt wird; ein Produktionssystem referenziert eine spezifische Version explizit, und ein Wechsel erfordert eine bewusste, dokumentierte Änderung.

### 3. Was ist eine Promotion-Grenze, und warum ist sie wichtig?

**Antwort:** Eine explizite Bedingung, unter der eine Modellversion von einer Lebenszyklusphase in die nächste übergehen darf, typischerweise verknüpft mit dokumentierten Prüfbelegen, um unkontrollierte Produktionswechsel zu verhindern.

### 4. Wie stellst du sicher, dass ein Produktionsproblem auf eine spezifische, verantwortliche Modellversion zurückgeführt werden kann?

**Antwort:** Durch die Verwendung unveränderlicher Versionskennungen in Produktion und eine nachvollziehbare Promotion-Historie, die dokumentiert, welche Version zu welchem Zeitpunkt in welcher Phase war.

### 5. Wie gehst du vor, wenn ein Produktionssystem unerwartetes Verhalten ohne dokumentierte Änderung zeigt?

**Antwort:** Ich prüfe zuerst, ob das System einen überschreibbaren Modellnamen statt einer unveränderlichen Versionskennung referenziert, und ob eine neue Registrierung diesen Namen unbemerkt umgelenkt haben könnte.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Modell-Updates in Produktion UND garantiert nachvollziehbare, geprüfte Promotions — wie gehst du vor?

**Antwort:** Ich würde einen automatisierten, aber verpflichtenden Promotion-Prozess etablieren, der bei bestandenen Prüfungen (Tests, Robustheitschecks) eine schnelle, aber stets dokumentierte Umstufung auf eine neue, unveränderliche Versionskennung ermöglicht, statt manuelle Bürokratie oder unkontrollierte automatische Umlenkung zuzulassen.

## Praktische Labs

~~~python
class ModelRegistry:
    def __init__(self):
        self.versions = {}  # immutable version_id -> metadata
        self.mutable_aliases = {}  # e.g. "latest" -> version_id (demonstrates the risk)
        self.promotion_stage = {}  # version_id -> stage

    def register(self, version_id, model_artifact):
        if version_id in self.versions:
            raise ValueError(f"Version {version_id} already exists and cannot be overwritten (immutability).")
        self.versions[version_id] = model_artifact
        self.promotion_stage[version_id] = "staging"
        self.mutable_aliases["latest"] = version_id  # simulates the risky mutable pointer

    def promote_to_production(self, version_id, evidence):
        if not evidence.get("tests_passed") or not evidence.get("robustness_checked"):
            raise ValueError("Promotion denied: missing documented evidence.")
        self.promotion_stage[version_id] = "production"
        print(f"Version {version_id} promoted to production with evidence: {evidence}")

registry = ModelRegistry()
registry.register("v1", "model_v1_artifact")
registry.promote_to_production("v1", {"tests_passed": True, "robustness_checked": True})

registry.register("v2", "model_v2_artifact")  # NOT promoted, still in staging

print(f"'latest' alias currently points to: {registry.mutable_aliases['latest']} (UNVETTED v2 — this is the risk)")
print(f"Explicit immutable production reference should use: 'v1' (stage={registry.promotion_stage['v1']}), NOT the 'latest' alias")
~~~

## Dependencies, Cross-References und Quellen

1. MLflow-Dokumentation: [Model Registry — Model Stage Transitions](https://mlflow.org/docs/latest/model-registry.html#transitioning-an-mlflow-models-stage), abgerufen 2026-09-17.
2. Sculley et al.: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), abgerufen 2026-09-17.

MLflow und Modelllebenszyklen sind kanonisch in [KB-0351](01-mlflow-und-modelllebenszyklen.md) behandelt; Modellbewertung und Fehlertypen in [KB-0343](../14-ml-engineering/13-modellbewertung-und-fehlertypen.md); Robustheit und Verteilungsänderung in [KB-0345](../14-ml-engineering/15-robustheit-und-verteilungsaenderung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Promotion-Gates, die Prüfbelege (Tests, Robustheitschecks) maschinell verifizieren, bevor eine Umstufung möglich ist | Adopting | Gegenüber manueller Prüfbelegkontrolle für konsistentere, weniger fehleranfällige Governance bevorzugen. |
| Kryptografisch signierte Modellartefakte zur zusätzlichen Absicherung der Unveränderlichkeit gegen nachträgliche Manipulation | Evaluating | Gegenüber reiner Registry-basierter Unveränderlichkeit abwägen, sobald ein konkretes Bedrohungsmodell nachträgliche Artefaktmanipulation als reales Risiko einstuft. |

Ein Team akzeptiert eine Production-Promotion erst, wenn eine unveränderliche Versionskennung und dokumentierte Prüfbelege vorliegen.
