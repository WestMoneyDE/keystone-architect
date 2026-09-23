---
{"id": "KB-0393", "title": "NetworkPolicy und Netzwerkisolation", "domain": "16", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0381", "concepts": ["CNI und Pod-Netzwerke"], "needed_for": "understanding"}, {"id": "KB-0066", "concepts": ["ACL und Paketfilterlogik"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Default-Deny-NetworkPolicy erstellen und anschließend gezielte Ingress-/Egress-Ausnahmen definieren, deren Wirkung durch tatsächliche Verbindungsversuche verifizieren.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Netzwerkisolationsstrategie gestalten, die Default Deny als Ausgangspunkt nutzt und explizite, minimal notwendige Ausnahmen definiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine konfigurierte NetworkPolicy fälschlich als wirksam angenommen wird, obwohl die eingesetzte CNI-Implementierung NetworkPolicy tatsächlich nicht unterstützt.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Verpflichtende Verifikation der NetworkPolicy-Wirksamkeit durch tatsächliche Verbindungsversuche als Standard im Unternehmen etablieren, statt sich auf die bloße Existenz einer Policy-Definition zu verlassen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Layer-7-Netzwerkrichtlinien (z. B. Cilium-spezifische Erweiterungen) im Detail sind Vertiefung.", "rationale": "Kern ist das Verständnis von Default Deny und CNI-Unterstützungsprüfung, nicht jede fortgeschrittene Erweiterung."}}, "lab_validation": [{"lab_id": "KB-0393-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes NetworkPolicy-Modell mit einer CNI-Implementierung, die NetworkPolicy nicht unterstützt", "evidence": "Eine simulierte Default-Deny-NetworkPolicy wird korrekt erstellt und im Cluster gespeichert, hat aber bei einer nicht unterstützenden CNI-Implementierung keinerlei tatsächliche Wirkung auf den Netzwerkverkehr, was durch einen weiterhin erfolgreichen, eigentlich zu blockierenden Verbindungsversuch demonstriert wird; erst der tatsächliche Verbindungstest deckt diese Nichtunterstützung auf, nicht die bloße Existenz der Policy-Definition.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Nichtunterstützungsszenario."}]}
---
# NetworkPolicy und Netzwerkisolation

> **Ziel:** Eine NetworkPolicy definiert Ingress- (eingehende) und Egress- (ausgehende) Regeln für Pod-zu-Pod-Kommunikation über Selektoren (welche Pods die Regel betrifft), aufbauend auf der CNI-Ebene (siehe [KB-0381](03-cni-und-pod-netzwerke.md)) und den allgemeinen Paketfilter-Grundlagen (siehe [KB-0066](../03-network-foundations/18-acl-und-paketfilterlogik.md)). Der zentrale Punkt dieses Kapitels ist zweifach: erstens Default Deny als sicherer Ausgangspunkt (aller Verkehr wird standardmäßig blockiert, nur explizit erlaubte Verbindungen sind zugelassen), und zweitens die kritische Notwendigkeit, die tatsächliche Wirksamkeit einer NetworkPolicy durch echte Verbindungsversuche zu verifizieren — die bloße Existenz einer Policy-Definition im Cluster garantiert keine tatsächliche Durchsetzung, wenn die eingesetzte CNI-Implementierung NetworkPolicy nicht unterstützt.

## Zweck, Mental Model und Dependencies

Ohne jegliche NetworkPolicy kann standardmäßig jeder Pod im Cluster mit jedem anderen Pod kommunizieren — dies ist praktisch für einfache Setups, aber sicherheitstechnisch riskant, da ein kompromittierter Pod ungehindert auf beliebige andere Pods zugreifen kann. Default Deny kehrt dieses Verhalten um: eine NetworkPolicy, die für einen bestimmten Pod-Selector jeglichen Ingress- oder Egress-Verkehr standardmäßig blockiert, erzwingt, dass jede tatsächlich benötigte Verbindung explizit als Ausnahme definiert werden muss. Selektoren bestimmen, für welche Pods eine Policy gilt (basierend auf Labels) und mit welchen anderen Pods/Namespaces/IP-Bereichen Kommunikation erlaubt ist. Der zentrale, oft übersehene Punkt ist: NetworkPolicy ist eine Kubernetes-API-Ressource, deren tatsächliche Durchsetzung von der eingesetzten CNI-Implementierung abhängt — nicht jede CNI-Implementierung unterstützt NetworkPolicy vollständig oder überhaupt. Wird eine NetworkPolicy in einem Cluster mit einer nicht unterstützenden CNI-Implementierung erstellt, wird sie vom API Server anstandslos gespeichert (es gibt keinen technischen Fehler bei der Erstellung), hat aber tatsächlich keinerlei Wirkung auf den realen Netzwerkverkehr — ein Team, das sich auf die bloße Existenz der Policy-Definition verlässt, ohne deren tatsächliche Wirksamkeit durch einen echten Verbindungsversuch zu verifizieren, kann fälschlich annehmen, isoliert zu sein, während tatsächlich weiterhin uneingeschränkter Verkehr möglich ist. Zusätzlich ist zu beachten, dass eine strikte Default-Deny-Egress-Policy auch die DNS-Auflösung blockieren kann, wenn nicht explizit eine Ausnahme für den Zugriff auf Cluster-DNS definiert wird — ein häufiger Fehler, der Anwendungen unerwartet funktionsunfähig macht.

~~~text
WITHOUT any NetworkPolicy: any pod can talk to any other pod by default -- convenient, but risky (unrestricted lateral movement if compromised)
Default Deny: a policy blocking ALL ingress/egress for a selector by default -> every needed connection must be an EXPLICIT exception
CRITICAL, OFTEN OVERLOOKED POINT: NetworkPolicy enforcement depends ENTIRELY on the CNI implementation
  API server ACCEPTS and STORES a NetworkPolicy object regardless of CNI support -- NO error on creation
  -> if the CNI does NOT support (or only partially supports) NetworkPolicy: the policy has ZERO actual effect on real traffic
  -> relying on "the policy object exists" instead of an ACTUAL connection test -> false sense of isolation
COMMON MISTAKE: strict default-deny EGRESS also blocks DNS resolution unless Cluster-DNS access is explicitly allowed
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Risiko bei Fehlannahme |
|---|---|---|
| Default Deny | blockiert allen Verkehr standardmäßig, erzwingt explizite Ausnahmen | ohne explizite DNS-Ausnahme kann selbst legitime Namensauflösung blockiert werden |
| Selektoren | bestimmen, welche Pods betroffen sind und welcher Verkehr erlaubt ist | zu weit gefasste Selektoren untergraben die beabsichtigte Isolation |
| CNI-Unterstützung | bestimmt, ob eine NetworkPolicy tatsächlich technisch durchgesetzt wird | ohne Verifikation kann eine Policy-Definition ohne jegliche tatsächliche Wirkung existieren |

Implementierung: Für jeden Namespace mit sicherheitsrelevanten Anforderungen wird zunächst eine Default-Deny-Policy für Ingress und Egress erstellt, gefolgt von expliziten, minimal notwendigen Ausnahmen für tatsächlich benötigte Verbindungen (einschließlich einer expliziten Ausnahme für den Zugriff auf Cluster-DNS, um Namensauflösung zu ermöglichen). Nach jeder NetworkPolicy-Konfiguration wird deren tatsächliche Wirksamkeit durch einen echten Verbindungsversuch verifiziert — sowohl ein Versuch, der eigentlich erlaubt sein sollte (muss erfolgreich sein), als auch ein Versuch, der eigentlich blockiert sein sollte (muss fehlschlagen) —, statt sich auf die bloße Existenz der Policy-Definition im Cluster zu verlassen.

## Scalability, Reliability, Security und Observability

Default-Deny-basierte Netzwerkisolation skaliert die Begrenzung lateraler Bewegung proportional zur Granularität und Vollständigkeit der definierten Ausnahmen; die Reliability-Grenze liegt darin, dass eine nicht verifizierte Annahme über die CNI-Unterstützung proportional zur tatsächlichen Diskrepanz zwischen angenommener und tatsächlicher Durchsetzung ein trügerisches Sicherheitsgefühl erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein eigentlich durch eine NetworkPolicy blockierter Verbindungsversuch gelingt trotzdem | die eingesetzte CNI-Implementierung unterstützt NetworkPolicy nicht oder nur teilweise | einen echten Verbindungsversuch durchführen, um die tatsächliche Durchsetzung zu verifizieren, und die CNI-Dokumentation auf NetworkPolicy-Unterstützung prüfen |
| eine Anwendung schlägt nach Einführung einer Default-Deny-Egress-Policy mit DNS-Fehlern fehl | keine explizite Ausnahme für den Zugriff auf Cluster-DNS wurde definiert | eine explizite Egress-Ausnahme für Cluster-DNS-Zugriff hinzufügen |
| ein Team geht von vollständiger Netzwerkisolation aus, obwohl tatsächlich weiterhin uneingeschränkter Verkehr möglich ist | die NetworkPolicy-Konfiguration wurde nie durch einen tatsächlichen Verbindungsversuch verifiziert | die Wirksamkeit jeder NetworkPolicy durch gezielte, echte Verbindungstests (erlaubt und blockiert) verifizieren |

Security: NetworkPolicy ist ein zentrales Werkzeug zur Begrenzung lateraler Bewegung nach einer Kompromittierung eines einzelnen Pods; ihre tatsächliche Wirksamkeit hängt jedoch vollständig von der CNI-Unterstützung ab, weshalb Verifikation durch echte Verbindungstests unverzichtbar ist. Observability: Der Anteil der NetworkPolicies mit nachgewiesener, durch echte Verbindungstests verifizierter Wirksamkeit, sowie beobachtete, eigentlich blockierte, aber dennoch erfolgreiche Verbindungsversuche, sind zentrale Sicherheitsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Default-Deny-Policies mit expliziten, minimal notwendigen Ausnahmen für jeden sicherheitsrelevanten Namespace. **Principal** macht die Verifikationsergebnisse jeder NetworkPolicy für das Team nachvollziehbar. **Chief** etabliert verpflichtende Verifikation der NetworkPolicy-Wirksamkeit durch tatsächliche Verbindungsversuche als Standard im Unternehmen.

Anti-Patterns: eine NetworkPolicy erstellen und deren Wirksamkeit ohne echten Verbindungstest annehmen; eine Default-Deny-Egress-Policy ohne explizite DNS-Ausnahme konfigurieren; die CNI-Unterstützung für NetworkPolicy vor der Cluster-Auswahl nicht prüfen.

## Production Checklist

- [ ] Sicherheitsrelevante Namespaces verwenden Default-Deny-Policies mit expliziten, minimal notwendigen Ausnahmen.
- [ ] Jede NetworkPolicy wird durch tatsächliche Verbindungsversuche (erlaubt und blockiert) verifiziert.
- [ ] Default-Deny-Egress-Policies enthalten eine explizite Ausnahme für Cluster-DNS-Zugriff.
- [ ] Die CNI-Unterstützung für NetworkPolicy ist vor der Cluster-Auswahl geprüft und dokumentiert.

## Interviewfragen

### 1. Was bedeutet Default Deny im Kontext von NetworkPolicy?

**Antwort:** Eine Policy, die jeglichen Ingress- oder Egress-Verkehr für einen bestimmten Pod-Selector standardmäßig blockiert, sodass jede tatsächlich benötigte Verbindung explizit als Ausnahme definiert werden muss.

### 2. Warum garantiert die bloße Existenz einer NetworkPolicy im Cluster keine tatsächliche Durchsetzung?

**Antwort:** Der API Server speichert eine NetworkPolicy unabhängig davon, ob die eingesetzte CNI-Implementierung sie unterstützt; ohne Unterstützung hat die Policy keinerlei tatsächliche Wirkung auf den realen Netzwerkverkehr.

### 3. Wie verifizierst du die tatsächliche Wirksamkeit einer NetworkPolicy?

**Antwort:** Durch echte Verbindungsversuche — sowohl einen, der eigentlich erlaubt sein sollte (muss erfolgreich sein), als auch einen, der eigentlich blockiert sein sollte (muss fehlschlagen) — statt mich auf die bloße Existenz der Policy-Definition zu verlassen.

### 4. Warum kann eine Default-Deny-Egress-Policy die DNS-Auflösung versehentlich blockieren?

**Antwort:** Wenn keine explizite Ausnahme für den Zugriff auf Cluster-DNS definiert wird, blockiert die strikte Default-Deny-Regel auch legitime DNS-Anfragen, was Anwendungen unerwartet funktionsunfähig macht.

### 5. Wie gehst du vor, wenn ein eigentlich durch eine NetworkPolicy blockierter Verbindungsversuch trotzdem gelingt?

**Antwort:** Ich prüfe, ob die eingesetzte CNI-Implementierung NetworkPolicy tatsächlich unterstützt, und führe einen gezielten Verbindungstest durch, um die tatsächliche Durchsetzung zu verifizieren.

### 6. Widersprüchliche Anforderung: Team will strikte Netzwerkisolation UND garantiert keine versehentlich blockierten legitimen Verbindungen (z. B. DNS) — wie gehst du vor?

**Antwort:** Ich würde eine Default-Deny-Policy mit einer sorgfältig kuratierten, vollständigen Liste expliziter Ausnahmen (einschließlich Cluster-DNS-Zugriff) einführen und jede Ausnahme durch echte Verbindungstests verifizieren, bevor die Policy produktiv aktiviert wird, sodass strikte Isolation und funktionierende legitime Verbindungen gleichzeitig sichergestellt sind.

## Praktische Labs

~~~python
class SimulatedNetworkPolicy:
    def __init__(self, cni_supports_policy=True):
        self.cni_supports_policy = cni_supports_policy
        self.allowed_connections = set()  # (from_pod, to_pod)
        self.default_deny_active = False

    def enable_default_deny(self):
        self.default_deny_active = True

    def allow_connection(self, from_pod, to_pod):
        self.allowed_connections.add((from_pod, to_pod))

    def attempt_connection(self, from_pod, to_pod):
        if not self.cni_supports_policy:
            # CRITICAL: policy object "exists" but has NO actual effect
            return True  # connection succeeds regardless of policy, because CNI doesn't enforce it
        if not self.default_deny_active:
            return True
        return (from_pod, to_pod) in self.allowed_connections

policy_unsupported_cni = SimulatedNetworkPolicy(cni_supports_policy=False)
policy_unsupported_cni.enable_default_deny()
result = policy_unsupported_cni.attempt_connection("pod-a", "pod-b")
print(f"Default-deny policy exists, but CNI does NOT support it -- blocked connection actually succeeds: {result}")
print("This is only detected by an ACTUAL connection test, not by checking if the policy object exists.")

policy_supported_cni = SimulatedNetworkPolicy(cni_supports_policy=True)
policy_supported_cni.enable_default_deny()
policy_supported_cni.allow_connection("pod-a", "pod-b")
print(f"\nAllowed connection succeeds: {policy_supported_cni.attempt_connection('pod-a', 'pod-b')}")
print(f"Non-allowed connection correctly blocked: {policy_supported_cni.attempt_connection('pod-a', 'pod-c')}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/), abgerufen 2026-09-17.
2. Cilium-Dokumentation: [Network Policy](https://docs.cilium.io/en/stable/network/kubernetes/policy/), abgerufen 2026-09-17.

CNI und Pod-Netzwerke sind kanonisch in [KB-0381](03-cni-und-pod-netzwerke.md) behandelt; ACL und Paketfilterlogik in [KB-0066](../03-network-foundations/18-acl-und-paketfilterlogik.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte NetworkPolicy-Wirksamkeitstest-Werkzeuge, die echte Verbindungstests systematisch nach jeder Policy-Änderung durchführen | Adopting | Gegenüber manueller, gelegentlicher Verbindungsprüfung für konsistentere, kontinuierliche Verifikation bevorzugen. |
| Layer-7-Netzwerkrichtlinien (z. B. HTTP-Pfad-basierte Regeln über Cilium-Erweiterungen) über traditionelle Layer-3/4-NetworkPolicy hinaus | Evaluating | Gegenüber Standard-NetworkPolicy abwägen, sobald der Anwendungsfall eine Feingranularität auf Anwendungsprotokollebene tatsächlich erfordert. |

Ein Team akzeptiert eine NetworkPolicy-Konfiguration erst, wenn ihre tatsächliche Wirksamkeit durch echte, dokumentierte Verbindungstests verifiziert wurde.
