---
{"id": "KB-0373", "title": "Model Governance im Delivery-Prozess", "domain": "15", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0356", "concepts": ["Model Registries und Freigabestatus"], "needed_for": "understanding"}], "related": ["KB-0372"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Governance-Bündel (Modellzustand, verantwortliche Person, verknüpfte Prüfbelege) für eine Modell-Promotion zusammenstellen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Einen Delivery-Prozess gestalten, der Modellzustand, Verantwortliche und Evidenz systematisch bündelt und dabei fachliche Freigaben klar von technischen Enforcement-Punkten trennt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine fachliche Freigabeentscheidung ohne entsprechenden technischen Enforcement-Punkt getroffen wurde, wodurch die Freigabe faktisch wirkungslos bleibt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Model Governance im Delivery-Prozess klar von der regulatorischen Gesamtgovernance (Domain 26) abgrenzen und beide als komplementäre, nicht redundante Ebenen im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Integration von Model Governance in unternehmensweite GRC-Systeme (Governance, Risk, Compliance) ist Vertiefung.", "rationale": "Kern ist die Unterscheidung von fachlicher Freigabe und technischem Enforcement innerhalb des Delivery-Prozesses, nicht die Integration in übergeordnete GRC-Systeme."}}, "lab_validation": [{"lab_id": "KB-0373-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Szenario mit einer fachlichen Freigabeentscheidung ohne entsprechenden technischen Enforcement-Punkt", "evidence": "Eine simulierte fachliche Freigabeentscheidung (eine verantwortliche Person dokumentiert die Genehmigung einer Modellversion) wird getroffen, aber das Deployment-System prüft diese Genehmigung nicht technisch, wodurch eine nicht genehmigte Modellversion trotz fehlender fachlicher Freigabe tatsächlich deploybar bleibt; dies demonstriert die Notwendigkeit, fachliche Freigabe und technisches Enforcement als zwei getrennte, aber verbundene Ebenen zu behandeln.", "limitations": "Kein produktives Governance-System, kein realer Geschäftsdatensatz, künstlich konstruiertes Szenario."}]}
---
# Model Governance im Delivery-Prozess

> **Ziel:** Model Governance im Delivery-Prozess bündelt für jede Modellversion drei Elemente: den Modellzustand (welche Lebenszyklusphase, siehe [KB-0356](06-model-registries-und-freigabestatus.md)), die verantwortliche Person (wer hat diese Promotion fachlich genehmigt) und die zugehörige Evidenz (welche Prüfbelege liegen vor). Der zentrale Punkt dieses Kapitels ist die klare Unterscheidung zwischen fachlichen Freigaben (einer Entscheidung durch eine verantwortliche Person) und technischen Enforcement-Punkten (einem System, das diese Entscheidung tatsächlich technisch durchsetzt), sowie die Abgrenzung dieser Delivery-Prozess-Governance von der umfassenderen regulatorischen Gesamtgovernance in Domain 26.

## Zweck, Mental Model und Dependencies

Eine fachliche Freigabe ist eine menschliche Entscheidung: eine verantwortliche Person prüft die vorliegende Evidenz (Testergebnisse, Robustheitsprüfungen, Sicherheitsbewertungen) und genehmigt (oder verweigert) die Promotion einer Modellversion in eine höhere Lebenszyklusphase. Ein technischer Enforcement-Punkt ist ein System, das diese fachliche Entscheidung tatsächlich durchsetzt — z. B. eine Deployment-Pipeline, die eine Promotion technisch blockiert, solange keine dokumentierte fachliche Freigabe vorliegt. Der entscheidende Punkt ist, dass eine fachliche Freigabe ohne entsprechenden technischen Enforcement-Punkt faktisch wirkungslos bleibt: wenn ein Deployment-System eine Modellversion unabhängig davon deployen kann, ob eine fachliche Freigabe dokumentiert wurde, existiert die Governance nur auf dem Papier, nicht in der Praxis. Umgekehrt ist ein technischer Enforcement-Punkt ohne zugrunde liegende fachliche Freigabe ebenfalls unzureichend, da er nur eine formale Bedingung prüft (z. B. "existiert ein Eintrag"), aber keine tatsächliche inhaltliche Bewertung sicherstellt. Model Governance im Delivery-Prozess ist bewusst enger gefasst als die regulatorische Gesamtgovernance (behandelt in Domain 26): sie betrifft die konkrete, operative Steuerung einzelner Modell-Promotions innerhalb der Entwicklungs-/Deployment-Pipeline, während die regulatorische Gesamtgovernance übergeordnete rechtliche, organisatorische und compliance-bezogene Rahmenbedingungen für den gesamten AI-Einsatz im Unternehmen behandelt.

~~~text
Business approval: HUMAN decision -- a responsible person reviews evidence (tests, robustness, security) and approves/denies promotion
Technical enforcement point: a SYSTEM that actually ENFORCES that decision
  e.g. a deployment pipeline that technically BLOCKS promotion without a documented approval
CRITICAL: business approval WITHOUT enforcement point = governance on paper only, not in practice
  (deployment system CAN deploy regardless of whether approval was documented)
ALSO INSUFFICIENT: enforcement point WITHOUT underlying real approval
  (checks only a formal condition -- "does an entry exist" -- not actual substantive review)
SCOPE NOTE: this is delivery-process governance (operational, per-promotion)
  DISTINCT from broader regulatory/organizational governance (Domain 26) -- complementary, not redundant
~~~

## Core Concepts, Architektur und Implementierung

| Element | Rolle | Risiko bei fehlender Verbindung |
|---|---|---|
| Fachliche Freigabe | menschliche Entscheidung basierend auf vorliegender Evidenz | ohne technisches Enforcement bleibt sie wirkungslos |
| Technischer Enforcement-Punkt | System, das die Freigabeentscheidung tatsächlich durchsetzt | ohne fachliche Grundlage prüft er nur eine formale Bedingung, keine inhaltliche Qualität |
| Evidenzbündel | dokumentierte Prüfbelege, auf denen die fachliche Freigabe beruht | ohne Bündelung ist die Freigabeentscheidung nicht nachvollziehbar begründet |

Implementierung: Für jede Modell-Promotion wird ein Governance-Bündel erstellt, das den aktuellen Modellzustand, die verantwortliche Person und die zugrunde liegende Evidenz (Testergebnisse, Robustheitsprüfungen, siehe vorherige Kapitel) zusammenführt. Die Deployment-Pipeline wird so konfiguriert, dass sie eine Promotion technisch nur zulässt, wenn ein vollständiges, dokumentiertes Governance-Bündel mit fachlicher Freigabe vorliegt — die fachliche Freigabe und der technische Enforcement-Punkt sind damit strukturell verknüpft, statt unabhängig voneinander zu existieren. Diese Delivery-Prozess-Governance wird bewusst von der regulatorischen Gesamtgovernance (Domain 26) abgegrenzt: erstere regelt die operative Freigabe einzelner Modellversionen, letztere die übergeordneten rechtlichen und organisatorischen Rahmenbedingungen.

## Scalability, Reliability, Security und Observability

Model Governance im Delivery-Prozess skaliert Nachvollziehbarkeit einzelner Modell-Promotions proportional zur Vollständigkeit der Verknüpfung zwischen fachlicher Freigabe und technischem Enforcement; die Reliability-Grenze liegt darin, dass eine Lücke zwischen beiden proportional zur Häufigkeit ungeprüfter Promotions das Risiko unkontrollierter Modellwechsel in Produktion erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Modellversion gelangt in Produktion, obwohl keine dokumentierte fachliche Freigabe vorliegt | die Deployment-Pipeline verfügt über keinen technischen Enforcement-Punkt, der eine fehlende Freigabe blockiert | die Deployment-Pipeline um eine technische Prüfung des Governance-Bündels vor jeder Promotion ergänzen |
| eine fachliche Freigabe existiert, aber es ist unklar, auf welcher Evidenz sie beruht | das Evidenzbündel wurde nicht systematisch mit der Freigabeentscheidung verknüpft | einen strukturierten Prozess einführen, der Evidenz, Freigabe und Modellzustand gemeinsam dokumentiert |
| ein technischer Enforcement-Punkt lässt eine Promotion zu, obwohl die zugrunde liegende fachliche Prüfung unzureichend war | der Enforcement-Punkt prüft nur eine formale Bedingung (Existenz eines Eintrags), keine inhaltliche Qualität der Freigabe | die Enforcement-Logik um eine Prüfung der tatsächlichen Evidenzqualität statt nur der formalen Existenz erweitern |

Security: Eine Lücke zwischen fachlicher Freigabe und technischem Enforcement ist ein konkretes Sicherheitsrisiko, da sie ermöglicht, dass ungeprüfte oder abgelehnte Modellversionen dennoch technisch deploybar bleiben. Observability: Der Anteil der Modell-Promotions mit vollständig verknüpftem Governance-Bündel (Zustand, Verantwortliche, Evidenz) sowie die Anzahl technisch blockierter Promotions ohne ausreichende fachliche Freigabe sind zentrale Governance-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert technische Enforcement-Punkte, die eine Promotion ohne dokumentiertes Governance-Bündel blockieren. **Principal** macht die Verknüpfung von fachlicher Freigabe und technischem Enforcement für das Team nachvollziehbar. **Chief** grenzt Model Governance im Delivery-Prozess klar von der regulatorischen Gesamtgovernance (Domain 26) ab und etabliert beide als komplementäre, nicht redundante Ebenen im Unternehmen.

Anti-Patterns: eine fachliche Freigabe dokumentieren, ohne einen entsprechenden technischen Enforcement-Punkt zu implementieren; einen technischen Enforcement-Punkt einführen, der nur formale Existenz statt inhaltliche Qualität der Freigabe prüft; Delivery-Prozess-Governance mit der regulatorischen Gesamtgovernance verwechseln oder redundant duplizieren.

## Production Checklist

- [ ] Jede Modell-Promotion ist mit einem vollständigen Governance-Bündel (Zustand, Verantwortliche, Evidenz) dokumentiert.
- [ ] Ein technischer Enforcement-Punkt blockiert Promotions ohne dokumentiertes Governance-Bündel.
- [ ] Der technische Enforcement-Punkt prüft inhaltliche Evidenzqualität, nicht nur formale Existenz eines Eintrags.
- [ ] Die Abgrenzung zur regulatorischen Gesamtgovernance (Domain 26) ist klar dokumentiert.

## Interviewfragen

### 1. Warum ist eine fachliche Freigabe ohne technischen Enforcement-Punkt wirkungslos?

**Antwort:** Wenn das Deployment-System unabhängig von der dokumentierten Freigabe deployen kann, existiert die Governance nur auf dem Papier, nicht in der tatsächlichen technischen Durchsetzung.

### 2. Was unterscheidet Model Governance im Delivery-Prozess von der regulatorischen Gesamtgovernance?

**Antwort:** Delivery-Prozess-Governance regelt die konkrete, operative Freigabe einzelner Modell-Promotions innerhalb der Pipeline; die regulatorische Gesamtgovernance behandelt übergeordnete rechtliche und organisatorische Rahmenbedingungen für den gesamten AI-Einsatz.

### 3. Warum reicht ein technischer Enforcement-Punkt allein, ohne inhaltliche Prüfung, nicht aus?

**Antwort:** Er prüft möglicherweise nur eine formale Bedingung (z. B. Existenz eines Eintrags), ohne sicherzustellen, dass die zugrunde liegende fachliche Bewertung tatsächlich inhaltlich fundiert war.

### 4. Was gehört zu einem vollständigen Governance-Bündel für eine Modell-Promotion?

**Antwort:** Der aktuelle Modellzustand, die verantwortliche Person, die die Promotion fachlich genehmigt hat, und die zugrunde liegende Evidenz (Testergebnisse, Robustheitsprüfungen).

### 5. Wie gehst du vor, wenn eine Modellversion trotz fehlender fachlicher Freigabe in Produktion gelangt?

**Antwort:** Ich prüfe, ob die Deployment-Pipeline über einen technischen Enforcement-Punkt verfügt, der eine fehlende Freigabe blockiert, und ergänze diese Prüfung, falls sie fehlt.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte Modell-Promotions UND garantiert lückenlose Governance-Durchsetzung — wie gehst du vor?

**Antwort:** Ich würde die fachliche Freigabe und den technischen Enforcement-Punkt so integrieren, dass eine dokumentierte Freigabe automatisch die technische Promotion freischaltet, sodass keine manuelle Zusatzarbeit für bereits genehmigte Promotions nötig ist, während nicht genehmigte Promotions technisch zuverlässig blockiert bleiben.

## Praktische Labs

~~~python
class GovernanceBundle:
    def __init__(self, model_version, state):
        self.model_version = model_version
        self.state = state
        self.approver = None
        self.evidence = []

    def add_evidence(self, item):
        self.evidence.append(item)

    def approve(self, approver, evidence_required=True):
        if evidence_required and not self.evidence:
            raise ValueError("Cannot approve without documented evidence.")
        self.approver = approver

bundle = GovernanceBundle("model_v3", "staging")
bundle.add_evidence("robustness_check_passed")
bundle.add_evidence("security_redteam_passed")
bundle.approve(approver="qa_lead_jane")

def deployment_pipeline_enforcement(bundle, target_stage):
    # Technical enforcement point: BLOCKS promotion without a real, evidence-backed approval
    if bundle.approver is None:
        raise PermissionError(f"BLOCKED: cannot promote {bundle.model_version} to {target_stage} -- no business approval.")
    if not bundle.evidence:
        raise PermissionError(f"BLOCKED: approval exists but no evidence attached -- rejecting promotion.")
    bundle.state = target_stage
    print(f"Promotion ALLOWED: {bundle.model_version} -> {target_stage} (approved by {bundle.approver}, evidence: {bundle.evidence})")

deployment_pipeline_enforcement(bundle, "production")

unapproved_bundle = GovernanceBundle("model_v4", "staging")
try:
    deployment_pipeline_enforcement(unapproved_bundle, "production")
except PermissionError as e:
    print(f"\n{e}")
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-17.
2. Sculley et al.: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), abgerufen 2026-09-17.

Model Registries und Freigabestatus sind kanonisch in [KB-0356](06-model-registries-und-freigabestatus.md) behandelt; Modell- und Prompt-Rollback in [KB-0372](22-modell-und-prompt-rollback.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Policy-as-Code-Enforcement-Systeme, die Governance-Regeln direkt in der Deployment-Pipeline maschinenlesbar durchsetzen | Adopting | Gegenüber manuell geprüften Genehmigungsprozessen für konsistentere, weniger fehleranfällige Durchsetzung bevorzugen. |
| Integrierte GRC-Plattformen, die Model Governance mit übergeordneter regulatorischer Gesamtgovernance verknüpfen | Evaluating | Gegenüber getrennten, unabhängigen Systemen abwägen, sobald die Integration nachweislich die Abgrenzung beider Ebenen erhält statt sie zu vermischen. |

Ein Team akzeptiert eine Modell-Promotion erst, wenn ein vollständiges Governance-Bündel technisch durchgesetzt wurde.
