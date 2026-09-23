---
{"id": "KB-0380", "title": "CRI und Container-Runtimes", "domain": "16", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0379", "concepts": ["Docker und OCI"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Einen fehlgeschlagenen Pod-Start anhand von Kubelet-Logs und Runtime-Socket-Status auf einen konkreten Fehlerschritt (Image-Pull, Sandbox-Erstellung, Container-Start) zurückführen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Den tatsächlichen Startpfad eines Pods (Kubelet → CRI-Schnittstelle → containerd → OCI-Runtime → Sandbox) nachvollziehen, um Diagnoseschritte gezielt statt geraten zuzuordnen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Zwischen einem Image-Pull-Fehler, einem Runtime-Socket-Fehler und einem Berechtigungsfehler unterscheiden, statt alle als generischen 'Pod startet nicht'-Fehler zu behandeln.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Strukturierte Diagnose entlang des tatsächlichen CRI-Startpfads als Standard für Plattform-Troubleshooting im Unternehmen etablieren, gegenüber Trial-and-Error-Neustarts.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Der Vergleich alternativer CRI-Implementierungen (containerd vs. CRI-O) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis des Startpfads und der Fehlerklassen, nicht der Vergleich konkreter Implementierungen."}}, "lab_validation": [{"lab_id": "KB-0380-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Diagnoseszenario mit drei unterschiedlichen Pod-Startfehlern (Image-Pull, Sandbox, Berechtigung)", "evidence": "Drei simulierte Fehlerfälle mit identischer oberflächlicher Symptomatik ('Pod startet nicht') werden anhand der jeweiligen Kubelet-/CRI-Fehlermeldung korrekt drei unterschiedlichen Ursachen (fehlgeschlagener Image-Pull, fehlgeschlagene Sandbox-Erstellung, fehlende Berechtigung am Runtime-Socket) zugeordnet, was unterschiedliche, gezielte Korrekturmaßnahmen erfordert.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruierte Fehlerszenarien."}]}
---
# CRI und Container-Runtimes

> **Ziel:** Das Container Runtime Interface (CRI) ist der standardisierte Vertrag zwischen dem Kubelet (dem auf jedem Kubernetes-Knoten laufenden Agenten) und einer konkreten Container-Runtime (typischerweise containerd), aufbauend auf den Docker/OCI-Grundlagen (siehe [KB-0379](01-docker-und-oci.md)). Der zentrale Punkt dieses Kapitels ist, Image-Pull- und Runtime-Fehler entlang des tatsächlichen Startpfads eines Pods zu diagnostizieren, statt sie pauschal als "Pod startet nicht" zu behandeln — insbesondere die Unterscheidung zwischen Runtime-Socket-Fehlern und Berechtigungsfehlern erfordert unterschiedliche Diagnoseschritte.

## Zweck, Mental Model und Dependencies

Der tatsächliche Startpfad eines Pods verläuft in klar unterscheidbaren Schritten: das Kubelet erhält den Auftrag, einen Pod zu starten, und kommuniziert über die standardisierte CRI-Schnittstelle mit der konkreten Container-Runtime (z. B. containerd) über einen lokalen Unix-Socket. Die Runtime erstellt zunächst eine Sandbox (eine isolierte Netzwerk- und Namespace-Umgebung für den Pod), zieht dann die benötigten Container-Images (Image-Pull), und startet schließlich die Container innerhalb der Sandbox über die zugrunde liegende OCI-Runtime. Jeder dieser Schritte kann unabhängig fehlschlagen, mit jeweils unterschiedlicher Ursache und Diagnose: ein Image-Pull-Fehler tritt auf, wenn das referenzierte Image nicht erreichbar oder nicht autorisiert ist (z. B. falsche Registry-Zugangsdaten); ein Runtime-Socket-Fehler tritt auf, wenn das Kubelet die Container-Runtime über den lokalen Socket nicht erreichen kann (z. B. weil der containerd-Dienst nicht läuft); ein Berechtigungsfehler tritt auf, wenn das Kubelet zwar den Socket erreicht, aber keine ausreichenden Rechte hat, um die angeforderte Operation auszuführen (z. B. eine fehlerhafte Dateisystem-Berechtigung auf dem Socket selbst). Diese drei Fehlerarten erzeugen oft dieselbe oberflächliche Symptomatik ("Pod bleibt im Zustand Pending oder ContainerCreating"), erfordern aber grundlegend unterschiedliche Korrekturmaßnahmen — eine strukturierte Diagnose entlang des tatsächlichen Startpfads (welcher Schritt genau ist fehlgeschlagen, laut Kubelet-Log und CRI-Fehlermeldung) ist notwendig, statt durch wiederholte Neustarts pauschal zu "raten".

~~~text
Actual pod start path:
  Kubelet -> CRI interface (local unix socket) -> Container Runtime (e.g. containerd)
    -> create SANDBOX (isolated network/namespace environment)
    -> IMAGE PULL (fetch required container images)
    -> start containers within sandbox via underlying OCI runtime
EACH STEP CAN FAIL INDEPENDENTLY, with a DIFFERENT cause and diagnosis:
  Image pull failure:    image unreachable/unauthorized (e.g. wrong registry credentials)
  Runtime socket failure: kubelet CANNOT REACH the runtime via the local socket (e.g. containerd not running)
  Permission failure:    kubelet REACHES the socket but lacks rights for the requested operation (e.g. bad socket file permissions)
ALL THREE often produce the SAME surface symptom ("Pod stuck Pending/ContainerCreating")
  -> requires structured diagnosis along the ACTUAL start path (kubelet log + CRI error message), not trial-and-error restarts
~~~

## Core Concepts, Architektur und Implementierung

| Startschritt | Typischer Fehler | Diagnosequelle |
|---|---|---|
| Kubelet → CRI-Socket | Runtime-Socket nicht erreichbar | Kubelet-Log zeigt "connection refused" oder ähnliches am Socket-Pfad |
| Sandbox-Erstellung | Netzwerk-/Namespace-Konfigurationsfehler | CRI-Fehlermeldung zur Sandbox-Erstellung |
| Image-Pull | Image nicht erreichbar/nicht autorisiert | Kubelet-Event/-Log zeigt konkrete Pull-Fehlermeldung (z. B. "unauthorized", "not found") |
| Berechtigung am Socket | fehlende Dateisystem-Rechte für Kubelet-Prozess | Betriebssystem-/Kubelet-Log zeigt "permission denied" statt "connection refused" |

Implementierung: Bei einem fehlgeschlagenen Pod-Start wird zunächst der Kubelet-Log auf die konkrete Fehlermeldung geprüft, um den tatsächlich fehlgeschlagenen Startschritt zu identifizieren, statt den Pod pauschal neu zu starten. Ein "connection refused" am Runtime-Socket deutet auf einen nicht laufenden oder abgestürzten Container-Runtime-Dienst hin; ein "permission denied" deutet auf ein Berechtigungsproblem am Socket selbst hin (unterschiedliche Diagnose und Korrektur als ein Erreichbarkeitsproblem); eine konkrete Image-Pull-Fehlermeldung deutet auf ein Registry-Zugriffsproblem hin. Jede dieser Fehlerklassen wird gezielt durch die jeweils passende Maßnahme behoben (Runtime-Dienst neu starten, Socket-Berechtigungen korrigieren, Registry-Zugangsdaten prüfen), statt eine einzige, generische Reaktion (z. B. "Node neu starten") auf alle Fehlerklassen anzuwenden.

## Scalability, Reliability, Security und Observability

Strukturierte CRI-Diagnose skaliert Fehlerbehebungsgeschwindigkeit proportional zur Genauigkeit der Fehlerklassenzuordnung; die Reliability-Grenze liegt darin, dass eine undifferenzierte "Pod startet nicht"-Behandlung proportional zur Häufigkeit unterschiedlicher zugrunde liegender Ursachen zu wiederholten, wirkungslosen Korrekturversuchen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Pod bleibt dauerhaft im Zustand "ContainerCreating" | ein Image-Pull-Fehler liegt vor, aber wurde nicht anhand der konkreten Kubelet-Event-Meldung diagnostiziert | die Kubelet-Events des betroffenen Pods auf eine konkrete Image-Pull-Fehlermeldung prüfen |
| mehrere Pods auf demselben Knoten können gar nicht erst gestartet werden | die Container-Runtime (z. B. containerd) läuft auf diesem Knoten nicht oder ist über den Socket nicht erreichbar | den Status des Runtime-Dienstes auf dem betroffenen Knoten prüfen |
| Pods scheitern mit einer "permission denied"-Meldung statt einer Erreichbarkeitsmeldung | ein Berechtigungsproblem am Runtime-Socket selbst liegt vor, nicht ein reines Erreichbarkeitsproblem | die Dateisystem-Berechtigungen des Runtime-Sockets für den Kubelet-Prozess prüfen |

Security: Berechtigungsfehler am Runtime-Socket sollten nicht pauschal durch übermäßig weitreichende Rechtevergabe "gelöst" werden, da dies die Isolationsgarantien der Container-Runtime untergraben kann; stattdessen sollte die tatsächlich benötigte, minimale Berechtigung identifiziert werden. Observability: Die Verteilung von Pod-Startfehlern nach Fehlerklasse (Image-Pull, Sandbox, Socket-Erreichbarkeit, Berechtigung) über die Zeit ist eine zentrale Diagnosemetrik für Plattform-Zuverlässigkeit.

## Trade-offs und Entscheidungen

**Staff** implementiert eine strukturierte Diagnose entlang des tatsächlichen CRI-Startpfads bei jedem Pod-Startfehler. **Principal** macht die identifizierte Fehlerklasse und Korrekturmaßnahme für das Team nachvollziehbar. **Chief** etabliert strukturierte Diagnose entlang des tatsächlichen Startpfads als Standard für Plattform-Troubleshooting im Unternehmen, gegenüber Trial-and-Error-Neustarts.

Anti-Patterns: bei jedem Pod-Startfehler pauschal den Knoten oder den Pod neu starten, ohne die konkrete Fehlerklasse zu diagnostizieren; Berechtigungsfehler am Runtime-Socket durch übermäßig weitreichende Rechtevergabe statt gezielter Korrektur "lösen"; Kubelet-Logs und CRI-Fehlermeldungen bei der Fehlersuche ignorieren.

## Production Checklist

- [ ] Bei einem Pod-Startfehler wird zunächst die konkrete Kubelet-/CRI-Fehlermeldung geprüft, bevor eine Korrektur erfolgt.
- [ ] Image-Pull-, Sandbox-, Socket-Erreichbarkeits- und Berechtigungsfehler werden als getrennte Fehlerklassen behandelt.
- [ ] Berechtigungsprobleme am Runtime-Socket werden durch minimale, gezielte Rechtevergabe statt pauschaler Lockerung behoben.
- [ ] Die Verteilung von Pod-Startfehlern nach Fehlerklasse wird überwacht.

## Interviewfragen

### 1. Was ist die Rolle des Container Runtime Interface (CRI)?

**Antwort:** Es ist der standardisierte Vertrag zwischen dem Kubelet und einer konkreten Container-Runtime (z. B. containerd), über den das Kubelet Container-Operationen anfordert.

### 2. Welche drei Schritte durchläuft ein Pod-Start typischerweise, und wie können sie unabhängig fehlschlagen?

**Antwort:** Sandbox-Erstellung (Netzwerk-/Namespace-Fehler), Image-Pull (Erreichbarkeits-/Autorisierungsfehler), und Container-Start über die OCI-Runtime; jeder Schritt hat eine eigene, unterscheidbare Fehlerursache.

### 3. Wie unterscheidest du einen Runtime-Socket-Fehler von einem Berechtigungsfehler?

**Antwort:** Ein Socket-Erreichbarkeitsfehler zeigt typischerweise "connection refused" (der Dienst läuft nicht), während ein Berechtigungsfehler "permission denied" zeigt (der Dienst läuft, aber der Zugriff ist nicht erlaubt) — beide erfordern unterschiedliche Korrekturmaßnahmen.

### 4. Warum ist eine strukturierte Diagnose entlang des Startpfads besser als ein pauschaler Neustart?

**Antwort:** Ein pauschaler Neustart behebt nur zufällig die tatsächliche Ursache und kann bei anhaltendem, strukturellem Problem (z. B. falsche Registry-Zugangsdaten) wirkungslos bleiben, während eine gezielte Diagnose die tatsächliche Fehlerklasse identifiziert und eine passende Korrektur ermöglicht.

### 5. Wie gehst du vor, wenn mehrere Pods auf demselben Knoten gar nicht erst gestartet werden können?

**Antwort:** Ich prüfe zunächst, ob die Container-Runtime auf diesem Knoten läuft und über den Socket erreichbar ist, bevor ich einzelne Pod-spezifische Ursachen wie Image-Pull-Probleme untersuche.

### 6. Widersprüchliche Anforderung: Team will schnelle Fehlerbehebung bei Pod-Startproblemen UND garantiert die tatsächlich richtige, ursachengerechte Korrektur — wie gehst du vor?

**Antwort:** Ich würde einen standardisierten, schnellen Diagnose-Runbook etablieren, der zuerst die Kubelet-/CRI-Fehlermeldung prüft und die Fehlerklasse in Sekunden identifiziert, sodass die anschließende Korrektur gezielt und schnell erfolgen kann, statt Zeit mit wirkungslosen, geratenen Neustarts zu verlieren.

## Praktische Labs

~~~python
def diagnose_pod_start_failure(kubelet_log_message):
    if "connection refused" in kubelet_log_message and "sock" in kubelet_log_message:
        return "Runtime socket unreachable -- check if containerd/runtime service is running on this node."
    if "permission denied" in kubelet_log_message and "sock" in kubelet_log_message:
        return "Socket permission issue -- check filesystem permissions on the runtime socket for the kubelet process."
    if "pull" in kubelet_log_message.lower() and ("unauthorized" in kubelet_log_message.lower() or "not found" in kubelet_log_message.lower()):
        return "Image pull failure -- check registry credentials and image reference."
    if "sandbox" in kubelet_log_message.lower():
        return "Sandbox creation failure -- check network/namespace configuration on this node."
    return "Unclassified failure -- inspect full kubelet log and CRI error message manually."

sample_logs = [
    "Error: rpc error: code = Unavailable desc = connection refused (/run/containerd/containerd.sock)",
    "Error: rpc error: permission denied (/run/containerd/containerd.sock)",
    "Failed to pull image \"myregistry/app:v2\": unauthorized: authentication required",
    "Failed to create pod sandbox: network plugin not ready",
]

for log in sample_logs:
    print(f"Log: {log}")
    print(f"  Diagnosis: {diagnose_pod_start_failure(log)}\n")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Container Runtime Interface (CRI)](https://kubernetes.io/docs/concepts/architecture/cri/), abgerufen 2026-09-17.
2. containerd-Dokumentation: [Getting Started](https://containerd.io/docs/getting-started/), abgerufen 2026-09-17.

Docker und OCI sind kanonisch in [KB-0379](01-docker-und-oci.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, strukturierte Kubelet-/CRI-Fehlerklassifikationswerkzeuge, die Startfehler direkt in Dashboards kategorisieren | Adopting | Gegenüber manueller Log-Analyse für schnellere, konsistentere Fehlerdiagnose bevorzugen. |
| Alternative CRI-Implementierungen (z. B. CRI-O) mit reduzierter Angriffsfläche gegenüber Vollausstattungs-Runtimes | Evaluating | Gegenüber containerd abwägen, sobald spezifische Sicherheits- oder Ressourcenanforderungen dies rechtfertigen. |

Ein Team akzeptiert eine Pod-Startfehler-Behebung erst, wenn die tatsächliche Fehlerklasse anhand der Kubelet-/CRI-Fehlermeldung identifiziert wurde.
