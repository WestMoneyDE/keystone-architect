---
{"id": "KB-0532", "title": "Image Signing und Admission-Vertrauen", "domain": "22", "sequence": 20, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0531", "concepts": ["Sigstore und Cosign"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Admission-Policies, die Signaturprüfung und zulässige Builderidentitäten durchsetzen, anhand offizieller Dokumentation korrekt konfigurieren können, um unsignierte oder nicht autorisierte Artefakte vor Clusterausführung abzulehnen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Cluster explizit entscheiden, wie Admission-Policies mit Signaturverifikationsregeln kombiniert werden, ohne Lücken zu lassen, durch die unsignierte oder falsch signierte Artefakte dennoch ausgeführt werden könnten.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein trotz Admission-Policy erfolgreich ausgeführtes, unsigniertes oder falsch signiertes Artefakt auf eine Lücke in der Policy-Durchsetzung (z. B. einen ausgenommenen Namespace oder eine Fallback-Regel) zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für verbindliche Admission-basierte Signaturprüfung ohne unkontrollierte Ausnahmen im gesamten Cluster festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Admission-Controller-Webhook-Mechanik im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis, wie Signaturverifikation an Admission-Policies gebunden wird und welche Lücken dabei entstehen können, nicht die Webhook-Interna."}}, "lab_validation": [{"lab_id": "KB-0532-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Admission-Policy-Lücken durch ausgenommene Namespaces, kein produktives Cluster-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine ansonsten korrekt konfigurierte Signaturverifikations-Admission-Policy durch einen explizit ausgenommenen Namespace (z. B. für Debugging-Zwecke eingerichtet und nie wieder entfernt) umgangen werden kann, wodurch unsignierte oder nicht autorisierte Artefakte in diesem Namespace ausgeführt werden können, obwohl die Policy im übrigen Cluster korrekt durchgesetzt wird.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Cluster-Admission-System."}]}
---
# Image Signing und Admission-Vertrauen

> **Ziel:** Sigstore/Cosign-Signaturverifikation (siehe [KB-0531](19-sigstore-und-cosign.md)) entfaltet ihre volle Schutzwirkung erst, wenn sie an eine **Admission-Policy** gebunden ist — einen Kubernetes-Mechanismus, der jede Anfrage zur Erstellung eines Pods (oder anderer Ressourcen) vor deren tatsächlicher Ausführung prüft und ablehnt, wenn definierte Bedingungen nicht erfüllt sind. Ohne diese Bindung bleibt eine korrekte Signatur- und Provenienzprüfung ein optionaler, manueller Schritt, den ein Entwickler vor einem Deployment durchführen könnte oder auch nicht — mit Admission-Bindung wird die Prüfung zu einer verbindlichen, technisch erzwungenen Voraussetzung, ohne die ein Artefakt im Cluster grundsätzlich nicht ausgeführt werden kann. Der zentrale Punkt dieses Kapitels ist, dass ein trotz vorhandener Admission-Policy erfolgreich ausgeführtes, unsigniertes oder falsch signiertes Artefakt fast immer auf eine Lücke in der Policy-Durchsetzung hindeutet — typischerweise ein explizit ausgenommener Namespace (häufig ursprünglich für Debugging oder eine Übergangsphase eingerichtet und nie wieder entfernt) oder eine zu breite Fallback-Regel, die bei Verifikationsfehlern statt strikter Ablehnung eine Warnung protokolliert, aber die Ausführung dennoch zulässt.

## Zweck, Mental Model und Dependencies

Eine Admission-Policy für Signaturverifikation setzt am Punkt der tatsächlichen Ressourcenerstellung an — bevor ein Pod mit einem bestimmten Container-Image tatsächlich gestartet wird, prüft der Admission-Controller, ob dieses Image eine gültige, gegen die konfigurierten Issuer-/Subject-Regeln verifizierte Signatur trägt (siehe [KB-0531](19-sigstore-und-cosign.md)) — fehlt die Signatur oder stammt sie von einem nicht autorisierten Signierenden, wird die Anfrage zur Ressourcenerstellung abgelehnt, bevor überhaupt ein Container gestartet wird. Dies unterscheidet sich fundamental von einer rein pipeline-seitigen Signaturprüfung (etwa nur in der CI/CD-Pipeline vor dem Push in die Registry): Eine pipeline-seitige Prüfung kann umgangen werden, wenn jemand ein Image direkt, außerhalb der Pipeline, in die Registry pusht oder direkt im Cluster referenziert, während eine Admission-Policy jeden tatsächlichen Ausführungsversuch prüft, unabhängig davon, auf welchem Weg das Image in die Registry oder in die Deployment-Konfiguration gelangt ist. Die praktische Herausforderung liegt in der vollständigen, lückenlosen Durchsetzung: Eine Admission-Policy, die für die meisten, aber nicht alle Namespaces gilt, bietet an den Ausnahmestellen keinen Schutz — ein Namespace, der ursprünglich für Debugging-Zwecke von der Policy ausgenommen wurde, bleibt oft dauerhaft ausgenommen, auch wenn der ursprüngliche Grund längst nicht mehr besteht, und wird damit zu einer unbeabsichtigten, dauerhaften Lücke. Ebenso kritisch ist die Frage, wie eine Policy auf einen Verifikationsfehler reagiert: Eine "Audit"- oder "Warn"-Konfiguration protokolliert lediglich einen Verstoß, ohne die Ausführung tatsächlich zu verhindern, was für eine Übergangsphase bei der Einführung einer neuen Policy sinnvoll sein kann, aber niemals mit einer tatsächlichen "Enforce"- oder "Deny"-Konfiguration verwechselt werden darf, die die Ausführung tatsächlich blockiert.

~~~text
Image Signing + Admission Trust: Sigstore/Cosign verification (KB-0531) BOUND to Admission Policy
  Admission Policy: Kubernetes mechanism checking EVERY resource-creation request BEFORE actual execution
    -> unsigned/wrongly-signed image -> request REJECTED before container ever starts
DIFFERS FUNDAMENTALLY from pipeline-only signature check:
  pipeline-only check: bypassable if image pushed directly to registry outside pipeline
  admission policy: checks EVERY actual execution attempt, regardless of how image got into registry/config
PRACTICAL CHALLENGE: COMPLETE, GAPLESS enforcement
  policy covering MOST but not ALL namespaces -> NO protection at exception points
    namespace originally exempted "for debugging" -> often stays exempted FOREVER, original reason long gone
  "Audit"/"Warn" mode: LOGS violation, does NOT prevent execution
    -> useful during rollout transition, but MUST NOT be confused with actual "Enforce"/"Deny" mode
UNEXPECTEDLY SUCCEEDING unsigned/wrongly-signed artifact despite policy existing
  -> almost always = gap in enforcement (exempted namespace, or overly-broad fallback/audit-only rule)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Admission-Policy | prüft jede Ressourcenerstellung vor Ausführung | macht Signaturprüfung verbindlich statt optional |
| Admission versus Pipeline-Prüfung | erfasst jeden Ausführungsversuch, unabhängig vom Herkunftsweg | schließt Lücken pipeline-seitiger Prüfung allein |
| Namespace-Ausnahmen | häufige, oft vergessene Policy-Lücke | müssen regelmäßig auf tatsächliche Notwendigkeit geprüft werden |
| Audit/Warn versus Enforce/Deny | Protokollierung ohne Blockade versus tatsächliche Verhinderung | dürfen nicht verwechselt werden |

Implementierung: Für jeden Cluster wird eine Admission-Policy eingerichtet, die Signaturverifikation gegen definierte Issuer-/Subject-Regeln für jede Ressourcenerstellung verbindlich durchsetzt, nicht nur pipeline-seitig prüft. Namespace-Ausnahmen von dieser Policy werden explizit dokumentiert, mit einem konkreten Grund und einem geplanten Überprüfungs- oder Entfernungszeitpunkt, statt dauerhaft unbegründet zu bestehen. Der tatsächliche Enforcement-Modus (Audit/Warn versus Enforce/Deny) wird explizit geprüft und dokumentiert, um Verwechslungen zu vermeiden.

## Scalability, Reliability, Security und Observability

Image-Signing-Admission-Vertrauen skaliert die tatsächliche Schutzwirkung proportional zur Vollständigkeit der Policy-Abdeckung über alle Namespaces und Ressourcentypen; die Reliability-Grenze liegt darin, dass jede Ausnahme oder jeder Audit-statt-Enforce-Modus proportional zu ihrer Reichweite eine unentdeckte Lücke im Schutz darstellt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein unsigniertes oder falsch signiertes Artefakt wird trotz vorhandener Policy erfolgreich ausgeführt | ein Namespace ist explizit von der Policy ausgenommen, oder die Policy läuft im Audit- statt Enforce-Modus | die tatsächliche Policy-Abdeckung und den tatsächlichen Enforcement-Modus für den betroffenen Namespace prüfen |
| eine Namespace-Ausnahme besteht seit langer Zeit ohne erkennbaren aktuellen Grund | die Ausnahme wurde für einen temporären Zweck eingerichtet und nie wieder entfernt | die Notwendigkeit jeder Ausnahme regelmäßig gegen ihren ursprünglichen Zweck prüfen und bei Wegfall entfernen |
| ein Pipeline-seitig korrekt signiertes Artefakt kann dennoch durch ein direkt gepushtes, unsigniertes Image umgangen werden | keine Admission-Policy erzwingt die Signaturprüfung tatsächlich am Ausführungspunkt im Cluster | eine Admission-Policy einrichten, die jede Ressourcenerstellung unabhängig vom Herkunftsweg prüft |

Security: Admission-Policies für Signaturverifikation sollten standardmäßig für alle Namespaces gelten, mit expliziten, dokumentierten und zeitlich begrenzten Ausnahmen statt dauerhafter, unbegründeter Ausnahmen. Observability: Die tatsächliche Policy-Abdeckung über alle Namespaces, die Anzahl aktiver Ausnahmen und deren Alter, sowie der tatsächliche Enforcement-Modus (Audit versus Enforce) sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert eine Admission-Policy mit korrekten Signaturverifikationsregeln für einen gegebenen Namespace. **Principal** entwirft die vollständige, lückenlose Policy-Abdeckung über alle Namespaces und Ressourcentypen eines Clusters. **Chief** legt unternehmensweite Standards für verbindliche Admission-basierte Signaturprüfung ohne unkontrollierte Ausnahmen fest.

Anti-Patterns: Namespaces dauerhaft und unbegründet von der Admission-Policy ausnehmen; eine Policy im Audit-statt-Enforce-Modus belassen, ohne dies als tatsächliche Durchsetzungslücke zu erkennen; sich ausschließlich auf pipeline-seitige Signaturprüfung verlassen, ohne eine Admission-Policy als zusätzliche, verbindliche Durchsetzung am tatsächlichen Ausführungspunkt einzurichten.

## Production Checklist

- [ ] Eine Admission-Policy erzwingt Signaturverifikation für jede Ressourcenerstellung im Cluster.
- [ ] Namespace-Ausnahmen sind explizit dokumentiert, mit Grund und geplantem Überprüfungszeitpunkt.
- [ ] Der tatsächliche Enforcement-Modus (Enforce/Deny statt nur Audit/Warn) ist verifiziert.
- [ ] Die Policy-Abdeckung wird regelmäßig gegen alle Namespaces und Ressourcentypen geprüft.

## Interviewfragen

### 1. Was leistet eine Admission-Policy für Signaturverifikation zusätzlich zu einer reinen Pipeline-Prüfung?

**Antwort:** Sie prüft jeden tatsächlichen Ausführungsversuch im Cluster, unabhängig davon, auf welchem Weg das Image in die Registry oder Deployment-Konfiguration gelangt ist, und schließt damit Lücken, die eine rein pipeline-seitige Prüfung offenlässt.

### 2. Warum ist ein trotz vorhandener Admission-Policy erfolgreich ausgeführtes, unsigniertes Artefakt selten ein Fehler im Signaturmechanismus selbst?

**Antwort:** Weil die Ursache fast immer eine Lücke in der Policy-Durchsetzung ist — typischerweise ein ausgenommener Namespace oder ein Audit- statt Enforce-Modus, nicht ein Fehler in der kryptographischen Signaturprüfung.

### 3. Was ist der Unterschied zwischen einem Audit/Warn- und einem Enforce/Deny-Modus?

**Antwort:** Audit/Warn protokolliert einen Verstoß, verhindert aber nicht die Ausführung; Enforce/Deny blockiert die Ausführung tatsächlich bei einem Verstoß.

### 4. Warum sind Namespace-Ausnahmen von Admission-Policies ein häufiges Sicherheitsrisiko?

**Antwort:** Weil sie oft für einen temporären Zweck (z. B. Debugging) eingerichtet werden und dauerhaft bestehen bleiben, auch wenn der ursprüngliche Grund längst nicht mehr besteht, was eine unbeabsichtigte, permanente Schutzlücke erzeugt.

### 5. Wie gehst du vor, wenn ein unsigniertes Artefakt trotz vorhandener Admission-Policy erfolgreich ausgeführt wird?

**Antwort:** Ich prüfe zuerst, ob der betroffene Namespace explizit von der Policy ausgenommen ist, und ob die Policy tatsächlich im Enforce- statt nur im Audit-Modus läuft, da dies die häufigsten Ursachen für eine solche Lücke sind.

### 6. Widersprüchliche Anforderung: Team will eine schrittweise, risikoarme Einführung einer neuen Signaturverifikations-Policy im gesamten Cluster UND sofortigen, vollständigen Schutz vor unsignierten Artefakten — wie gehst du vor?

**Antwort:** Ich würde die Policy zunächst im Audit-Modus über den gesamten Cluster hinweg einführen, um bestehende Verstöße ohne Betriebsunterbrechung sichtbar zu machen, mit einem expliziten, terminierten Zeitplan für den Übergang zu Enforce-Modus für jeden Namespace — sofortiger vollständiger Schutz und risikoarme Einführung lassen sich durch einen zeitlich begrenzten, verbindlich terminierten Audit-Übergang statt durch dauerhaften Audit-Modus vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of admission-policy gap via exempted namespace (executed locally, no real cluster):

def evaluate_admission(namespace, is_signed, exempted_namespaces, enforcement_mode):
    if namespace in exempted_namespaces:
        return "ALLOWED (namespace exempted, NO signature check performed)"
    if enforcement_mode != "enforce":
        return "ALLOWED (audit-only mode, violation logged but not blocked)" if not is_signed else "ALLOWED"
    if not is_signed:
        return "REJECTED: unsigned image blocked by admission policy"
    return "ALLOWED"

exempted_namespaces = {"legacy-debug"}

print(evaluate_admission("production", is_signed=False, exempted_namespaces=exempted_namespaces, enforcement_mode="enforce"))
print(evaluate_admission("legacy-debug", is_signed=False, exempted_namespaces=exempted_namespaces, enforcement_mode="enforce"))
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Admission Control in Kubernetes](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/), abgerufen 2026-09-18.
2. Sigstore-Dokumentation: [Policy Controller — Admission Enforcement](https://docs.sigstore.dev/policy-controller/overview/), abgerufen 2026-09-18.

Sigstore und Cosign sind kanonisch in [KB-0531](19-sigstore-und-cosign.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Erkennung und Alarmierung bei veralteten, unbegründeten Admission-Policy-Ausnahmen | Evaluating | Gegenüber rein manueller, periodischer Ausnahmeprüfung erst nach Prüfung der tatsächlichen Zuverlässigkeit automatisierter Erkennung bevorzugen. |

Ein Team akzeptiert eine Image-Signing-Admission-Konfiguration erst, wenn nachweislich alle Namespaces abgedeckt sind, der Enforcement-Modus tatsächlich Enforce/Deny ist, und verbleibende Ausnahmen explizit begründet und zeitlich begrenzt sind.
