---
{"id": "KB-0400", "title": "Admission Control", "domain": "16", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0383", "concepts": ["Kubernetes Control Plane"], "needed_for": "understanding"}], "related": ["KB-0399"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen Mutating und einen Validating Webhook konfigurieren und deren Ausführungsreihenfolge sowie das Verhalten bei einem simulierten Webhook-Ausfall beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Admission-Control-Kette gestalten, die das Ausfallverhalten (fail-open vs. fail-closed) jedes Webhooks bewusst basierend auf dessen Kritikalität konfiguriert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet lange API-Server-Antwortzeit auf einen langsamen oder hängenden Admission-Webhook statt auf ein allgemeines Cluster-Problem zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Bewusst konfiguriertes Ausfallverhalten (fail-open/fail-closed) für jeden Admission-Webhook als verpflichtenden Standard im Unternehmen etablieren, statt sich auf eine ungeprüfte Standardkonfiguration zu verlassen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Policy-as-Code-Admission-Controller (z. B. OPA Gatekeeper, Kyverno) im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Mutating/Validating Webhooks, Ausfallverhalten und Reihenfolge, nicht ein spezifisches Policy-Engine-Produkt."}}, "lab_validation": [{"lab_id": "KB-0400-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Admission-Webhook-Modell mit einem ausgefallenen Webhook und unterschiedlicher Ausfallverhalten-Konfiguration", "evidence": "Ein simulierter, ausgefallener Validating Webhook mit fail-closed-Konfiguration blockiert korrekt alle betroffenen Ressourcenerstellungen, während derselbe ausgefallene Webhook mit fail-open-Konfiguration die Erstellung fälschlich ungeprüft durchlässt, was die kritische Bedeutung der bewussten Ausfallverhalten-Wahl demonstriert.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Ausfallszenario."}]}
---
# Admission Control

> **Ziel:** Admission Control ist der letzte Schritt im API-Zulassungspfad (siehe [KB-0383](05-kubernetes-control-plane.md)), bevor eine Ressourcenanfrage tatsächlich in etcd gespeichert wird: Mutating Webhooks können eine Ressource vor der Speicherung modifizieren (z. B. Standardwerte ergänzen), Validating Webhooks können eine Ressource ablehnen, wenn sie definierte Regeln verletzt. Der zentrale Punkt dieses Kapitels ist, drei kritische Grenzen dieses Zulassungspfads bewusst zu behandeln: das Ausfallverhalten eines Webhooks (fail-open vs. fail-closed, analog zum in [KB-0378](../15-mlops-evaluation/28-ai-quality-gates.md) beschriebenen Prinzip), die durch Webhook-Latenz verursachte Verzögerung jeder Ressourcenoperation im gesamten Cluster, und die Ausführungsreihenfolge mehrerer registrierter Webhooks.

## Zweck, Mental Model und Dependencies

Jede Ressourcenanfrage an den API Server durchläuft, nachdem sie authentifiziert und autorisiert wurde (siehe RBAC, [KB-0392](14-rbac-und-service-accounts.md)), die Admission-Control-Kette: zunächst alle registrierten Mutating Webhooks (die die Ressource verändern können, z. B. das automatische Hinzufügen eines Sidecar-Containers), dann die Schema-Validierung (siehe [KB-0399](21-custom-resource-definitions.md)), und schließlich alle registrierten Validating Webhooks (die die Ressource nur akzeptieren oder ablehnen, aber nicht mehr verändern können). Ein Admission Webhook ist ein externer HTTP-Dienst, den der API Server bei jeder passenden Anfrage synchron aufruft — dies bedeutet, dass die Antwortzeit des API Servers für diese Operation direkt von der Antwortzeit des Webhooks abhängt: ein langsamer oder hängender Webhook verlangsamt jede betroffene Ressourcenoperation im gesamten Cluster, nicht nur eine einzelne. Fällt ein Webhook vollständig aus (nicht erreichbar, Timeout), bestimmt eine explizit konfigurierte Failure Policy das Verhalten: fail-closed lehnt die Anfrage ab (sicherer, aber kann den Cluster bei einem Webhook-Ausfall funktionsunfähig machen, wenn der Webhook für kritische Operationen zuständig ist); fail-open lässt die Anfrage ungeprüft durch (verfügbarer, aber untergräbt die eigentliche Schutzwirkung des Webhooks vollständig während des Ausfalls). Bei mehreren registrierten Webhooks derselben Kategorie (mehrere Mutating oder mehrere Validating Webhooks) ist die Ausführungsreihenfolge relevant, insbesondere bei Mutating Webhooks, da ein späterer Webhook auf den bereits von einem früheren Webhook veränderten Zustand der Ressource reagiert — eine falsch angenommene Reihenfolge kann zu unerwarteten, schwer nachvollziehbaren Interaktionseffekten zwischen mehreren Webhooks führen.

~~~text
Admission control chain (after authn/authz, cf. KB-0392): Mutating webhooks -> schema validation (cf. KB-0399) -> Validating webhooks
Webhook: EXTERNAL HTTP service, called SYNCHRONOUSLY by the API Server for every matching request
  -> API Server response time DIRECTLY depends on webhook response time
  -> a slow/hung webhook slows down EVERY affected resource operation cluster-wide, not just one
Webhook FAILS entirely (unreachable, timeout) -> explicit Failure Policy determines behavior:
  fail-closed: reject the request (safer, but can make the cluster non-functional if webhook covers critical ops)
  fail-open: let the request through unchecked (more available, but fully undermines the webhook's protection during outage)
Execution ORDER matters for multiple webhooks of the same category (especially mutating):
  a later webhook sees the ALREADY-MODIFIED state from an earlier one -> wrong assumed order -> unexpected interaction effects
~~~

## Core Concepts, Architektur und Implementierung

| Aspekt | Risiko | Kontrollmaßnahme |
|---|---|---|
| Ausfallverhalten (fail-open/fail-closed) | fail-open untergräbt Schutzwirkung, fail-closed kann Cluster blockieren | bewusste, kritikalitätsbasierte Wahl pro Webhook statt einer pauschalen Standardeinstellung |
| Webhook-Latenz | verlangsamt jede betroffene Operation clusterweit | strikte Timeout-Konfiguration und Performance-Überwachung des Webhook-Dienstes |
| Ausführungsreihenfolge | unerwartete Interaktionseffekte zwischen mehreren Webhooks | explizite Dokumentation und Tests der tatsächlichen Reihenfolge mehrerer Mutating Webhooks |

Implementierung: Für jeden Admission Webhook wird die Failure Policy bewusst basierend auf der tatsächlichen Kritikalität der von ihm durchgesetzten Regel gewählt — sicherheitskritische Validating Webhooks (z. B. Ablehnung privilegierter Container) werden typischerweise fail-closed konfiguriert, während weniger kritische, rein informative Mutating Webhooks fail-open konfiguriert werden können, um die Cluster-Verfügbarkeit bei einem Webhook-Ausfall nicht zu gefährden. Jeder Webhook wird mit einem strikten Timeout konfiguriert und seine tatsächliche Antwortzeit kontinuierlich überwacht, um clusterweite Latenzauswirkungen frühzeitig zu erkennen. Bei mehreren registrierten Mutating Webhooks wird die tatsächliche Ausführungsreihenfolge explizit dokumentiert und durch Tests verifiziert, statt implizit anzunehmen.

## Scalability, Reliability, Security und Observability

Admission Control skaliert Durchsetzung clusterweiter Richtlinien proportional zur Anzahl registrierter Webhooks; die Reliability-Grenze liegt darin, dass jeder zusätzliche synchron aufgerufene Webhook proportional zu seiner Antwortzeit die Gesamtlatenz jeder betroffenen Ressourcenoperation im Cluster erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Ressourcenoperationen im gesamten Cluster werden plötzlich spürbar langsamer | ein registrierter Admission Webhook antwortet langsam oder ist teilweise überlastet | die Antwortzeit-Metriken des zuständigen Webhook-Dienstes prüfen |
| bei einem Ausfall eines Sicherheits-Webhooks werden dennoch eigentlich unzulässige Ressourcen akzeptiert | der Webhook ist fälschlich mit fail-open statt fail-closed konfiguriert | die Failure-Policy-Konfiguration des betroffenen Webhooks prüfen und bei sicherheitskritischen Regeln auf fail-closed umstellen |
| eine Ressource zeigt nach der Verarbeitung durch mehrere Mutating Webhooks ein unerwartetes, nicht nachvollziehbares Ergebnis | die tatsächliche Ausführungsreihenfolge der Webhooks weicht von der angenommenen Reihenfolge ab | die tatsächliche Ausführungsreihenfolge dokumentieren und gezielt testen, um die Interaktion der Webhooks nachzuvollziehen |

Security: Ein fail-open konfigurierter, sicherheitskritischer Validating Webhook stellt ein erhebliches Risiko dar, da ein Angreifer gezielt einen Webhook-Ausfall herbeiführen könnte, um dessen Schutzwirkung während des Ausfalls vollständig zu umgehen. Observability: Die Antwortzeitverteilung jedes registrierten Webhooks, die Häufigkeit von Webhook-Timeouts oder -Ausfällen, und die daraus resultierende Anzahl fail-open durchgelassener versus fail-closed abgelehnter Anfragen sind zentrale Sicherheits- und Reliability-Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert bewusst gewählte Failure Policies pro Webhook basierend auf tatsächlicher Kritikalität. **Principal** macht die Ausführungsreihenfolge mehrerer Webhooks und deren Interaktionseffekte für das Team nachvollziehbar. **Chief** etabliert bewusst konfiguriertes Ausfallverhalten für jeden Admission-Webhook als verpflichtenden Standard im Unternehmen, statt sich auf eine ungeprüfte Standardkonfiguration zu verlassen.

Anti-Patterns: alle Admission Webhooks pauschal mit derselben Failure Policy konfigurieren, ohne die jeweilige Kritikalität zu berücksichtigen; einen langsamen Webhook ohne striktes Timeout betreiben, wodurch er clusterweite Latenz verursacht; die Ausführungsreihenfolge mehrerer Mutating Webhooks implizit annehmen, ohne sie zu dokumentieren oder zu testen.

## Production Checklist

- [ ] Jeder Admission Webhook besitzt eine bewusst gewählte, kritikalitätsbasierte Failure Policy.
- [ ] Jeder Webhook ist mit einem strikten Timeout konfiguriert und seine Antwortzeit wird überwacht.
- [ ] Die tatsächliche Ausführungsreihenfolge mehrerer Mutating Webhooks ist dokumentiert und getestet.
- [ ] Sicherheitskritische Validating Webhooks sind fail-closed konfiguriert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Mutating und einem Validating Webhook?

**Antwort:** Ein Mutating Webhook kann eine Ressource vor der Speicherung verändern; ein Validating Webhook kann eine Ressource nur akzeptieren oder ablehnen, aber nicht mehr verändern.

### 2. Warum wirkt sich ein langsamer Admission Webhook auf den gesamten Cluster aus?

**Antwort:** Der API Server ruft den Webhook synchron auf, sodass seine Antwortzeit direkt in die Gesamtlatenz jeder betroffenen Ressourcenoperation im gesamten Cluster eingeht.

### 3. Was ist der Unterschied zwischen fail-open und fail-closed bei einem ausgefallenen Admission Webhook?

**Antwort:** Fail-closed lehnt die Anfrage bei einem Webhook-Ausfall ab (sicherer, kann aber den Cluster blockieren); fail-open lässt die Anfrage ungeprüft durch (verfügbarer, aber untergräbt die Schutzwirkung während des Ausfalls vollständig).

### 4. Warum ist die Ausführungsreihenfolge mehrerer Mutating Webhooks relevant?

**Antwort:** Ein später ausgeführter Webhook sieht den bereits von einem früheren Webhook veränderten Zustand der Ressource, was bei falsch angenommener Reihenfolge zu unerwarteten Interaktionseffekten führen kann.

### 5. Wie gehst du vor, wenn Ressourcenoperationen im gesamten Cluster plötzlich spürbar langsamer werden?

**Antwort:** Ich prüfe die Antwortzeit-Metriken aller registrierten Admission Webhooks, da ein langsamer Webhook clusterweite Latenz für jede betroffene Operation verursachen kann.

### 6. Widersprüchliche Anforderung: Team will maximale Cluster-Verfügbarkeit bei Webhook-Ausfällen UND garantiert lückenlose Durchsetzung sicherheitskritischer Regeln — wie gehst du vor?

**Antwort:** Ich würde die Failure Policy pro Webhook individuell basierend auf der tatsächlichen Kritikalität konfigurieren: sicherheitskritische Validating Webhooks fail-closed (Sicherheit hat Priorität), während weniger kritische, informative Webhooks fail-open konfiguriert werden, um die allgemeine Cluster-Verfügbarkeit bei nicht-kritischen Ausfällen zu erhalten.

## Praktische Labs

~~~python
class SimulatedAdmissionWebhook:
    def __init__(self, name, failure_policy, is_healthy=True):
        self.name = name
        self.failure_policy = failure_policy  # "fail-open" or "fail-closed"
        self.is_healthy = is_healthy

    def evaluate(self, resource):
        if not self.is_healthy:
            if self.failure_policy == "fail-closed":
                return False, f"REJECTED: webhook '{self.name}' unreachable, fail-closed blocks the request"
            else:
                return True, f"ALLOWED (RISK): webhook '{self.name}' unreachable, fail-open lets it through unchecked"
        # Healthy webhook: actually evaluates the rule
        is_valid = resource.get("privileged", False) is False
        return is_valid, f"webhook '{self.name}' evaluated normally: valid={is_valid}"

security_webhook_failclosed = SimulatedAdmissionWebhook("no-privileged-containers", "fail-closed", is_healthy=False)
security_webhook_failopen = SimulatedAdmissionWebhook("no-privileged-containers", "fail-open", is_healthy=False)

resource = {"privileged": True}  # a resource that SHOULD be rejected

allowed_closed, msg_closed = security_webhook_failclosed.evaluate(resource)
allowed_open, msg_open = security_webhook_failopen.evaluate(resource)

print(f"fail-closed during outage: allowed={allowed_closed} -- {msg_closed}")
print(f"fail-open during outage:   allowed={allowed_open} -- {msg_open}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Dynamic Admission Control](https://kubernetes.io/docs/reference/access-authn-authz/extensible-admission-controllers/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [A Guide to Kubernetes Admission Controllers](https://kubernetes.io/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/), abgerufen 2026-09-17.

Kubernetes Control Plane ist kanonisch in [KB-0383](05-kubernetes-control-plane.md) behandelt; Custom Resource Definitions in [KB-0399](21-custom-resource-definitions.md); RBAC und Service Accounts in [KB-0392](14-rbac-und-service-accounts.md); AI Quality Gates (fail-closed-Prinzip) in [KB-0378](../15-mlops-evaluation/28-ai-quality-gates.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Policy-as-Code-Admission-Controller (z. B. OPA Gatekeeper, Kyverno), die deklarative Richtlinien statt individuell programmierter Webhooks nutzen | Adopting | Gegenüber individuell entwickelten Webhooks für konsistentere, zentral pflegbare Richtliniendurchsetzung bevorzugen. |
| Automatisierte Webhook-Latenz-Überwachung mit proaktiver Warnung bei clusterweiter Auswirkung | Adopting | Gegenüber reiner reaktiver Fehlerbehebung für frühzeitigere Erkennung von Performance-Problemen bevorzugen. |

Ein Team akzeptiert eine Admission-Webhook-Konfiguration erst, wenn Failure Policy, Timeout und Ausführungsreihenfolge bewusst geprüft und dokumentiert sind.
