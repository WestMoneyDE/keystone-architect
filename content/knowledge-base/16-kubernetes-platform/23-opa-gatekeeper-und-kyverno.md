---
{"id": "KB-0401", "title": "OPA, Gatekeeper und Kyverno", "domain": "16", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0400", "concepts": ["Admission Control"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Constraint-Policy erstellen, die eine bestimmte Cluster-Regel durchsetzt, im Auditmodus testen, und anschließend in den erzwingenden Modus überführen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein Policy-Framework so gestalten, dass Ausnahmen explizit dokumentiert und begrenzt statt informell und unbegrenzt gewährt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Bei einer unerwartet blockierten Ressourcenerstellung die zuständige Constraint-Policy und deren tatsächliche Regel identifizieren, statt die Policy-Engine pauschal zu deaktivieren.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Verbindliche Cluster-Policies mit Auditmodus-Testphase vor Erzwingung als Standard-Rollout-Prozess im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Rego-Sprache von OPA im Detail sowie Kyverno-spezifische YAML-Regelsyntax sind Vertiefung.", "rationale": "Kern ist das Verständnis von Regelmodellen, Auditmodus und Ausnahmebehandlung als Konzepte, nicht die konkrete Regelsprache."}}, "lab_validation": [{"lab_id": "KB-0401-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Policy-Modell mit Auditmodus und anschließender Erzwingung", "evidence": "Eine simulierte Constraint-Policy im Auditmodus protokolliert Verstöße gegen eine definierte Regel, ohne die betroffenen Ressourcenerstellungen tatsächlich zu blockieren; nach Umstellung in den erzwingenden Modus werden dieselben Verstöße korrekt aktiv blockiert, was die Notwendigkeit einer Testphase vor der tatsächlichen Durchsetzung demonstriert.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Policy-Szenario."}]}
---
# OPA, Gatekeeper und Kyverno

> **Ziel:** Policy-Engines wie Open Policy Agent (OPA) mit Gatekeeper oder Kyverno implementieren verbindliche Cluster-Policies als deklarative Admission Webhooks (siehe [KB-0400](22-admission-control.md)), statt individuell programmierten Code für jede einzelne Regel zu schreiben. Der zentrale Punkt dieses Kapitels ist, wie Constraint-Prüfung (Validierung gegen definierte Regeln), Mutation (automatische Korrektur nicht konformer Ressourcen), Ausnahmen (begrenzte, dokumentierte Abweichungen von einer Regel) und der Auditmodus (Protokollierung von Verstößen ohne tatsächliche Blockierung) zusammenwirken, um eine überprüfbare, schrittweise Einführung neuer Policies zu ermöglichen.

## Zweck, Mental Model und Dependencies

Eine Constraint-Policy definiert deklarativ eine Regel (z. B. "jeder Container muss ein CPU-Limit besitzen") und wird über eine Policy-Engine als Admission Webhook durchgesetzt: bei jeder passenden Ressourcenanfrage prüft die Engine die Regel und akzeptiert oder lehnt die Anfrage entsprechend ab. Manche Policy-Engines unterstützen zusätzlich Mutation: statt eine nicht konforme Ressource abzulehnen, wird sie automatisch korrigiert (z. B. ein fehlendes Standard-CPU-Limit wird automatisch ergänzt), was insbesondere für weniger kritische, gut automatisierbare Korrekturen praktikabel ist. Ausnahmen ermöglichen es, bestimmte, explizit dokumentierte Fälle (z. B. ein spezifischer Namespace für Legacy-Anwendungen) von einer allgemein geltenden Regel auszunehmen, statt die Regel selbst aufzuweichen oder informell zu umgehen — eine Ausnahme sollte stets begrenzt, dokumentiert und mit einer Begründung versehen sein, statt eine unbegrenzte, unbegründete Lücke in der Durchsetzung zu erzeugen. Der Auditmodus ist der zentrale, praktisch entscheidende Mechanismus für eine sichere Policy-Einführung: statt eine neue Regel sofort im erzwingenden Modus (der tatsächlich Ressourcenerstellungen blockiert) einzuführen, wird sie zunächst im Auditmodus betrieben, der Verstöße lediglich protokolliert, ohne tatsächlich zu blockieren — dies macht sichtbar, wie viele bestehende Ressourcen tatsächlich gegen die neue Regel verstoßen würden, bevor die Regel produktionswirksam durchgesetzt wird, und verhindert, dass eine neue Policy unerwartet viele bestehende, legitime Workloads blockiert.

~~~text
Constraint policy: declarative rule (e.g. "every container must have a CPU limit"), enforced via a policy engine as an admission webhook
Mutation: instead of REJECTING a non-compliant resource, AUTO-CORRECT it (e.g. add a missing default CPU limit)
  -> practical for less-critical, easily automated corrections
Exceptions: explicitly documented, BOUNDED deviations from a general rule (e.g. one legacy namespace)
  -> never an unbounded, undocumented workaround
AUDIT MODE (the critical rollout mechanism): new rule logs violations WITHOUT actually blocking
  -> reveals how many EXISTING resources would violate the rule BEFORE it becomes production-enforcing
  -> prevents a new policy from unexpectedly blocking many legitimate existing workloads
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Rolloutrelevanz |
|---|---|---|
| Constraint-Prüfung | validiert Ressourcen gegen eine deklarative Regel | Kernmechanismus jeder Policy-Durchsetzung |
| Mutation | korrigiert nicht konforme Ressourcen automatisch | reduziert manuellen Korrekturaufwand für einfache, standardisierte Abweichungen |
| Ausnahmen | dokumentierte, begrenzte Regelausnahmen | verhindert informelle, unbegrenzte Umgehung der Regel |
| Auditmodus | protokolliert Verstöße ohne Blockierung | zentrale, sichere Testphase vor tatsächlicher Erzwingung |

Implementierung: Jede neue Constraint-Policy wird zunächst im Auditmodus eingeführt, und die protokollierten Verstöße werden über einen definierten Beobachtungszeitraum ausgewertet, um festzustellen, wie viele bestehende Ressourcen tatsächlich betroffen wären. Bestehende, legitime Abweichungen werden entweder korrigiert oder als explizit dokumentierte, begrenzte Ausnahme mit Begründung erfasst. Erst nachdem alle bekannten, legitimen Abweichungen behandelt wurden, wird die Policy vom Auditmodus in den tatsächlich erzwingenden Modus überführt. Bei unerwartet blockierten Ressourcenerstellungen wird die zuständige Constraint-Policy und deren konkrete Regel identifiziert, statt die gesamte Policy-Engine pauschal zu deaktivieren.

## Scalability, Reliability, Security und Observability

Policy-Engines skalieren konsistente Regeldurchsetzung über den gesamten Cluster proportional zur Anzahl definierter, deklarativer Constraints; die Reliability-Grenze liegt darin, dass eine ohne Auditmodus-Testphase direkt erzwungene neue Policy proportional zur Anzahl unentdeckter, tatsächlich betroffener bestehender Ressourcen zu unerwarteten, weitreichenden Produktionsausfällen führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine neu eingeführte Policy blockiert unerwartet viele, bisher funktionierende Ressourcenerstellungen | die Policy wurde direkt erzwungen, ohne vorherige Auditmodus-Testphase | die Policy zurück in den Auditmodus versetzen, die tatsächliche Verstoßrate auswerten und betroffene Ressourcen gezielt korrigieren oder als Ausnahme dokumentieren |
| ein Team umgeht eine Policy informell durch undokumentierte Workarounds | keine expliziten, dokumentierten Ausnahmen wurden für legitime Abweichungsfälle definiert | einen formalen, begrenzten Ausnahmeprozess mit Dokumentationspflicht einführen |
| eine Ressourcenerstellung wird unerwartet blockiert, ohne klare Fehlermeldung zur Ursache | mehrere Constraint-Policies sind aktiv, und die konkret zuständige Regel wurde nicht identifiziert | die Policy-Engine-Logs auf die konkret ausgelöste Constraint und deren Regel-Definition prüfen |

Security: Eine unentdeckte, unbegründete Häufung von Ausnahmen kann die tatsächliche Schutzwirkung einer Policy erheblich untergraben; jede Ausnahme sollte periodisch überprüft werden, ob sie noch tatsächlich notwendig ist. Observability: Die Anzahl der im Auditmodus protokollierten Verstöße pro Policy vor deren Erzwingung, die Anzahl aktiver, dokumentierter Ausnahmen, und die Anzahl tatsächlich blockierter Ressourcenerstellungen nach Erzwingung sind zentrale Governance-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert jede neue Policy zunächst im Auditmodus, bevor sie erzwungen wird. **Principal** macht Auditmodus-Ergebnisse und dokumentierte Ausnahmen für das Team nachvollziehbar. **Chief** etabliert verbindliche Cluster-Policies mit Auditmodus-Testphase vor Erzwingung als Standard-Rollout-Prozess im Unternehmen.

Anti-Patterns: eine neue Policy direkt im erzwingenden Modus einführen, ohne vorherige Auditmodus-Testphase; informelle, undokumentierte Workarounds statt expliziter, begrenzter Ausnahmen zulassen; die gesamte Policy-Engine bei einem unerwarteten Blockierungsproblem pauschal deaktivieren, statt die konkrete Ursache zu identifizieren.

## Production Checklist

- [ ] Jede neue Policy durchläuft eine Auditmodus-Testphase vor tatsächlicher Erzwingung.
- [ ] Bestehende, legitime Abweichungen werden vor Erzwingung korrigiert oder als dokumentierte Ausnahme erfasst.
- [ ] Ausnahmen sind explizit begrenzt, dokumentiert und mit Begründung versehen.
- [ ] Bei blockierten Ressourcen wird die konkret zuständige Policy-Regel identifiziert, statt die Engine pauschal zu deaktivieren.

## Interviewfragen

### 1. Was ist der Zweck des Auditmodus bei der Einführung einer neuen Cluster-Policy?

**Antwort:** Er protokolliert Verstöße gegen die neue Regel, ohne die betroffenen Ressourcenerstellungen tatsächlich zu blockieren, wodurch sichtbar wird, wie viele bestehende Ressourcen tatsächlich betroffen wären, bevor die Regel produktionswirksam durchgesetzt wird.

### 2. Was ist der Unterschied zwischen Constraint-Prüfung und Mutation bei einer Policy-Engine?

**Antwort:** Constraint-Prüfung validiert Ressourcen gegen eine Regel und akzeptiert oder lehnt sie ab; Mutation korrigiert nicht konforme Ressourcen automatisch, statt sie abzulehnen.

### 3. Wie sollten Ausnahmen von einer Cluster-Policy behandelt werden?

**Antwort:** Explizit begrenzt, dokumentiert und mit einer Begründung versehen, statt eine unbegrenzte, unbegründete Lücke in der Durchsetzung zu erzeugen oder informelle Workarounds zuzulassen.

### 4. Warum ist es riskant, eine neue Policy direkt im erzwingenden Modus einzuführen?

**Antwort:** Ohne vorherige Auditmodus-Testphase kann die Policy unerwartet viele bestehende, legitime Ressourcen blockieren, was zu unentdeckten Produktionsausfällen führen kann.

### 5. Wie gehst du vor, wenn eine neu eingeführte Policy unerwartet viele Ressourcenerstellungen blockiert?

**Antwort:** Ich versetze die Policy zurück in den Auditmodus, werte die tatsächliche Verstoßrate aus und korrigiere betroffene Ressourcen oder dokumentiere sie als begrenzte Ausnahme, bevor die Policy erneut erzwungen wird.

### 6. Widersprüchliche Anforderung: Team will sofortige, verbindliche Durchsetzung einer neuen Sicherheitsregel UND garantiert keine unerwarteten Produktionsausfälle bestehender Anwendungen — wie gehst du vor?

**Antwort:** Ich würde die neue Regel zunächst kurzzeitig, aber verpflichtend im Auditmodus einführen, um innerhalb kurzer Zeit die tatsächliche Verstoßrate zu ermitteln, bestehende Verstöße gezielt und schnell zu beheben, und die Regel danach zügig, aber informiert in den erzwingenden Modus zu überführen, statt sie ungeprüft sofort zu erzwingen.

## Praktische Labs

~~~python
class SimulatedConstraintPolicy:
    def __init__(self, name, rule_check, mode="audit"):
        self.name = name
        self.rule_check = rule_check  # function returning True if compliant
        self.mode = mode  # "audit" or "enforce"
        self.audit_violations = []

    def evaluate(self, resource):
        is_compliant = self.rule_check(resource)
        if not is_compliant:
            if self.mode == "audit":
                self.audit_violations.append(resource)
                return True, f"AUDIT LOG: '{self.name}' violated by {resource}, but request ALLOWED (audit mode)"
            else:
                return False, f"BLOCKED: '{self.name}' violated by {resource} (enforce mode)"
        return True, "compliant"

require_cpu_limit = SimulatedConstraintPolicy(
    "require-cpu-limit",
    rule_check=lambda r: "cpu_limit" in r,
    mode="audit",
)

resources = [
    {"name": "app-a", "cpu_limit": "500m"},
    {"name": "app-b"},  # missing cpu_limit -- would violate
    {"name": "app-c"},  # missing cpu_limit -- would violate
]

for resource in resources:
    allowed, message = require_cpu_limit.evaluate(resource)
    print(message)

print(f"\nAudit revealed {len(require_cpu_limit.audit_violations)} existing violations -- fix these before enforcing.")

require_cpu_limit.mode = "enforce"
allowed, message = require_cpu_limit.evaluate({"name": "app-d"})
print(f"\nAfter switching to enforce mode: {message}")
~~~

## Dependencies, Cross-References und Quellen

1. Open Policy Agent-Dokumentation: [Gatekeeper — Overview](https://open-policy-agent.github.io/gatekeeper/website/docs/), abgerufen 2026-09-17.
2. Kyverno-Dokumentation: [Policies](https://kyverno.io/docs/policy-types/), abgerufen 2026-09-17.

Admission Control ist kanonisch in [KB-0400](22-admission-control.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kyverno mit nativer YAML-basierter Regelsyntax gegenüber der Rego-Sprache von OPA für zugänglichere Policy-Autorenschaft | Adopting | Gegenüber OPA/Rego bevorzugen, wenn Teams ohne tiefe Rego-Kenntnisse Policies eigenständig autorisieren sollen. |
| Automatisierte Policy-Compliance-Dashboards, die Auditmodus-Ergebnisse über alle Policies zentral aggregieren | Adopting | Gegenüber verteilter, manueller Log-Auswertung für schnellere, konsolidierte Rollout-Entscheidungen bevorzugen. |

Ein Team akzeptiert die Erzwingung einer neuen Policy erst, wenn eine Auditmodus-Phase keine unentdeckten, kritischen Verstöße mehr zeigt.
