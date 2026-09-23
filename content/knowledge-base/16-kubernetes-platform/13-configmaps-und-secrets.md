---
{"id": "KB-0391", "title": "ConfigMaps und Secrets", "domain": "16", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [{"id": "KB-0384", "concepts": ["Pods und Lebenszyklen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Secret erstellen, seine Base64-Kodierung ohne zusätzliche Verschlüsselung nachvollziehen, und eine Secret-Rotation während eines laufenden Pods beobachten.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Konfigurationsverwaltung gestalten, die tatsächliche Geheimnisschutzgrenzen (Verschlüsselung im Ruhezustand, Zugriffskontrolle) statt bloßer Base64-Kodierung als Sicherheitsmaßnahme behandelt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, dass ein rotiertes Secret bei bereits laufenden Requests nicht automatisch die alte, im Speicher gehaltene Version ersetzt, und dies bei einer Rotationsstrategie berücksichtigen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Echte Geheimnisschutzmaßnahmen (Verschlüsselung im Ruhezustand, externe Secret-Manager-Integration) statt reiner Base64-Kodierung als Standard für sensible Konfiguration im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Integration externer Secret-Manager (z. B. Vault, Cloud-KMS) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der tatsächlichen Schutzgrenzen von Kubernetes-Secrets, nicht eine spezifische externe Integration."}}, "lab_validation": [{"lab_id": "KB-0391-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Secret-Rotationsszenario mit einer laufenden Anwendung, die eine Konfigurationsvariable zum Startzeitpunkt einliest", "evidence": "Ein simuliertes Secret wird aktualisiert, während eine Anwendung bereits läuft und den ursprünglichen Wert als Umgebungsvariable zum Startzeitpunkt eingelesen hat; die laufende Anwendung verwendet weiterhin den alten Wert, bis sie neu gestartet wird, während ein über eine gemountete Datei eingebundenes Secret nach der Aktualisierung ohne Neustart aktualisiert wird.", "limitations": "Kein produktiver Kubernetes-Cluster, kein realer Geschäftsdatensatz, künstlich konstruiertes Rotationsszenario."}]}
---
# ConfigMaps und Secrets

> **Ziel:** ConfigMaps und Secrets injizieren Konfiguration in Pods, aufbauend auf den Pod-Grundlagen (siehe [KB-0384](06-pods-und-lebenszyklen.md)), entweder als Umgebungsvariablen oder als gemountete Dateien. Der zentrale Punkt dieses Kapitels ist die klare Trennung zwischen zwei unabhängigen Missverständnissen: erstens, dass Base64-Kodierung eines Secrets tatsächliche Verschlüsselung sei (sie ist es nicht — Base64 ist reversibel ohne Schlüssel), und zweitens, dass eine Secret-Rotation automatisch alle bereits laufenden Prozesse mit dem neuen Wert versorgt (was von der Art der Injektion abhängt).

## Zweck, Mental Model und Dependencies

Ein Kubernetes Secret speichert seinen Wert standardmäßig Base64-kodiert im etcd-Zustandsspeicher — Base64 ist jedoch keine Verschlüsselung, sondern eine reversible Kodierung: jeder mit Lesezugriff auf das Secret-Objekt (oder auf den zugrunde liegenden etcd-Speicher) kann den ursprünglichen Wert ohne Schlüssel oder besonderes Wissen sofort zurückgewinnen. Tatsächlicher Geheimnisschutz erfordert zusätzliche Maßnahmen: Verschlüsselung im Ruhezustand (etcd selbst wird verschlüsselt gespeichert), strikte RBAC-Zugriffskontrollen (wer darf Secret-Objekte überhaupt lesen), und häufig die Integration eines externen, spezialisierten Secret-Managers (der Secrets außerhalb von etcd verwaltet und nur zur Laufzeit kontrolliert bereitstellt) — Base64-Kodierung allein bietet keinen dieser Schutzmechanismen. Der zweite zentrale Punkt betrifft die Rotation: wird ein Secret als Umgebungsvariable in einen Container injiziert, wird dieser Wert einmalig beim Start des Containers gelesen und bleibt danach unverändert im Prozessspeicher, selbst wenn das zugrunde liegende Secret-Objekt später aktualisiert wird — eine Aktualisierung des Secrets erreicht diesen bereits laufenden Prozess erst nach einem Neustart. Wird ein Secret dagegen als gemountete Datei eingebunden, aktualisiert Kubernetes den Dateiinhalt im laufenden Container automatisch (mit einer gewissen Verzögerung), sodass eine Anwendung, die die Datei bei jedem Zugriff neu liest, den aktualisierten Wert ohne Neustart erhält — die Anwendung selbst muss jedoch so gestaltet sein, dass sie tatsächlich erneut liest, statt den ursprünglich gelesenen Wert dauerhaft im Speicher zu behalten.

~~~text
Base64 encoding: REVERSIBLE, NOT encryption -- anyone with read access to the Secret object (or underlying etcd) recovers the value instantly, no key needed
REAL secret protection requires ADDITIONAL measures:
  encryption at rest (etcd itself encrypted)
  strict RBAC (who can even read Secret objects)
  often: external secret manager integration (secrets managed outside etcd, provided at runtime only)
ROTATION BEHAVIOR depends on injection method:
  as environment variable: read ONCE at container start, stays in process memory unchanged -- update reaches it only on RESTART
  as mounted file: Kubernetes updates the file content in the running container automatically (with some delay)
    -> app receives the update WITHOUT restart, but ONLY IF the app actually RE-READS the file rather than caching the original value
~~~

## Core Concepts, Architektur und Implementierung

| Aspekt | Fehlvorstellung | Tatsächliche Realität |
|---|---|---|
| Base64-Kodierung | wird oft für Verschlüsselung gehalten | reversible Kodierung ohne Schutz, tatsächliche Sicherheit erfordert Verschlüsselung im Ruhezustand und RBAC |
| Secret als Umgebungsvariable | wird oft für automatisch rotierbar gehalten | einmalig beim Start gelesen, Update erreicht laufenden Prozess erst nach Neustart |
| Secret als gemountete Datei | wird oft für sofort und garantiert aktuell gehalten | wird automatisch aktualisiert, aber nur wirksam, wenn die Anwendung die Datei tatsächlich erneut liest |

Implementierung: Sensible Konfigurationswerte werden nicht ausschließlich auf Base64-Kodierung als Schutzmaßnahme verlassen; stattdessen wird Verschlüsselung im Ruhezustand für etcd aktiviert, strikte RBAC-Regeln beschränken den Lesezugriff auf Secret-Objekte, und bei besonders sensiblen Werten wird ein externer Secret-Manager integriert. Für Anwendungen, die eine zuverlässige Secret-Rotation ohne Neustart benötigen, werden Secrets als gemountete Dateien statt als Umgebungsvariablen eingebunden, und die Anwendung wird explizit so implementiert, dass sie den Dateiinhalt periodisch neu liest, statt ihn einmalig zwischenzuspeichern. Für Anwendungen, bei denen ein Neustart bei Rotation akzeptabel ist, kann die einfachere Umgebungsvariablen-Injektion in Kombination mit einem automatisierten Rolling-Update-Trigger bei Secret-Änderung verwendet werden.

## Scalability, Reliability, Security und Observability

Externe Secret-Manager-Integration skaliert tatsächlichen Geheimnisschutz unabhängig von den begrenzten, nativen Kubernetes-Mechanismen; die Reliability-Grenze liegt darin, dass eine Rotation, die nur das Secret-Objekt selbst aktualisiert, ohne die Injektionsmethode und das Anwendungsverhalten zu berücksichtigen, proportional zur Anzahl umgebungsvariablen-basierter Injektionen zu unbemerkt veralteten, im Speicher gehaltenen Werten führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Anwendung verwendet nach einer Secret-Rotation weiterhin den alten Wert | das Secret wurde als Umgebungsvariable injiziert, die nur einmalig beim Start gelesen wird | einen Neustart der betroffenen Pods auslösen oder auf eine Datei-basierte Secret-Injektion mit periodischem Neuladen umstellen |
| ein Secret erscheint bei einer Prüfung des etcd-Speichers im Klartext lesbar | keine Verschlüsselung im Ruhezustand für etcd ist aktiviert | die etcd-Verschlüsselungskonfiguration aktivieren und bestehende Secrets neu verschlüsseln |
| eine Anwendung mit dateibasierter Secret-Injektion zeigt nach einer Rotation dennoch weiterhin den alten Wert | die Anwendung liest die Secret-Datei nur einmalig beim Start statt periodisch neu | die Anwendungslogik prüfen und um periodisches Neulesen der Secret-Datei ergänzen |

Security: Base64-Kodierung darf niemals als ausreichende Sicherheitsmaßnahme für sensible Werte kommuniziert werden; tatsächlicher Schutz erfordert Verschlüsselung im Ruhezustand, strikte RBAC und idealerweise externe Secret-Manager-Integration. Observability: Der Anteil der Secrets mit aktivierter Verschlüsselung im Ruhezustand, die Anzahl der RBAC-Regeln mit Lesezugriff auf Secret-Objekte, und die Zeit zwischen Secret-Rotation und tatsächlicher Wirksamkeit in allen betroffenen Anwendungen sind zentrale Sicherheitsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Verschlüsselung im Ruhezustand und strikte RBAC für alle Secret-Objekte. **Principal** macht die tatsächliche Rotationswirksamkeit je nach Injektionsmethode für das Team nachvollziehbar. **Chief** etabliert echte Geheimnisschutzmaßnahmen statt reiner Base64-Kodierung als Standard für sensible Konfiguration im Unternehmen.

Anti-Patterns: Base64-Kodierung als ausreichenden Schutz für sensible Werte kommunizieren oder behandeln; eine Secret-Rotation ohne Berücksichtigung der Injektionsmethode als sofort wirksam annehmen; Secret-Objekte ohne strikte RBAC-Beschränkung breit lesbar konfigurieren.

## Production Checklist

- [ ] Verschlüsselung im Ruhezustand ist für etcd/Secret-Speicherung aktiviert.
- [ ] RBAC beschränkt den Lesezugriff auf Secret-Objekte auf tatsächlich benötigte Identitäten.
- [ ] Die Injektionsmethode (Umgebungsvariable vs. gemountete Datei) ist bewusst basierend auf dem tatsächlichen Rotationsbedarf gewählt.
- [ ] Anwendungen mit dateibasierter Secret-Injektion lesen die Datei periodisch neu, statt sie einmalig zwischenzuspeichern.

## Interviewfragen

### 1. Warum ist Base64-Kodierung keine tatsächliche Verschlüsselung?

**Antwort:** Base64 ist eine reversible Kodierung ohne Schlüssel; jeder mit Lesezugriff auf das kodierte Secret kann den ursprünglichen Wert sofort zurückgewinnen, ohne besonderes Wissen zu benötigen.

### 2. Welche Maßnahmen bieten tatsächlichen Geheimnisschutz über Base64-Kodierung hinaus?

**Antwort:** Verschlüsselung im Ruhezustand für etcd, strikte RBAC-Zugriffskontrollen auf Secret-Objekte, und die Integration eines externen, spezialisierten Secret-Managers.

### 3. Warum erreicht eine Secret-Rotation nicht automatisch einen bereits laufenden Prozess bei Umgebungsvariablen-Injektion?

**Antwort:** Der Wert wird einmalig beim Start des Containers gelesen und bleibt danach unverändert im Prozessspeicher; ein Update des zugrunde liegenden Secrets erreicht diesen Prozess erst nach einem Neustart.

### 4. Warum reicht dateibasierte Secret-Injektion allein nicht aus, um garantiert aktuelle Werte ohne Neustart sicherzustellen?

**Antwort:** Kubernetes aktualisiert zwar den Dateiinhalt im laufenden Container, aber die Anwendung selbst muss so gestaltet sein, dass sie die Datei tatsächlich periodisch erneut liest, statt den ursprünglich gelesenen Wert dauerhaft zwischenzuspeichern.

### 5. Wie gehst du vor, wenn eine Anwendung nach einer Secret-Rotation weiterhin den alten Wert verwendet?

**Antwort:** Ich prüfe die Injektionsmethode — bei Umgebungsvariablen löse ich einen Neustart der betroffenen Pods aus; bei dateibasierter Injektion prüfe ich, ob die Anwendung die Datei tatsächlich periodisch neu liest.

### 6. Widersprüchliche Anforderung: Team will einfache Umgebungsvariablen-Konfiguration UND garantierte, sofortige Secret-Rotation ohne Neustart — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Umgebungsvariablen-Injektion und rotationsfreie sofortige Aktualisierung sich strukturell widersprechen, und stattdessen dateibasierte Secret-Injektion mit einer Anwendungslogik empfehlen, die periodisch neu liest — dies erreicht sofortige Rotation ohne Neustart bei nur geringfügig höherem Implementierungsaufwand.

## Praktische Labs

~~~python
import base64

original_value = "super-secret-database-password"
encoded_value = base64.b64encode(original_value.encode()).decode()
print(f"Base64-encoded 'secret': {encoded_value}")

decoded_value = base64.b64decode(encoded_value).decode()
print(f"Trivially decoded back (NO key needed, NOT encryption): {decoded_value}")

class SimulatedContainer:
    def __init__(self, injection_method):
        self.injection_method = injection_method
        self.cached_env_value = None
        self.file_content = None

    def start(self, secret_value):
        if self.injection_method == "env":
            self.cached_env_value = secret_value  # read ONCE at start
        else:
            self.file_content = secret_value  # mounted file reference

    def get_current_value(self):
        if self.injection_method == "env":
            return self.cached_env_value  # never changes without restart
        else:
            return self.file_content  # reflects live file content if re-read

env_container = SimulatedContainer("env")
env_container.start("password_v1")

file_container = SimulatedContainer("file")
file_container.start("password_v1")

# Simulate Kubernetes rotating the secret WITHOUT restarting the containers
rotated_value = "password_v2"
file_container.file_content = rotated_value  # Kubernetes updates the mounted file automatically

print(f"\nEnv-injected container after rotation (unchanged, needs restart): {env_container.get_current_value()}")
print(f"File-injected container after rotation (updated, if app re-reads): {file_container.get_current_value()}")
~~~

## Dependencies, Cross-References und Quellen

1. Kubernetes-Dokumentation: [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/), abgerufen 2026-09-17.
2. Kubernetes-Dokumentation: [Encrypting Confidential Data at Rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/), abgerufen 2026-09-17.

Pods und Lebenszyklen sind kanonisch in [KB-0384](06-pods-und-lebenszyklen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Externe Secret-Manager-Integrationen (z. B. Vault, Cloud-KMS über CSI-Treiber), die Secrets außerhalb von etcd verwalten | Adopting | Gegenüber nativen Kubernetes-Secrets für sensible Produktionsdaten mit strengeren Compliance-Anforderungen bevorzugen. |
| Automatisierte, kurzlebige Secrets mit häufiger, automatischer Rotation statt langlebiger, statischer Werte | Adopting | Gegenüber statischen, langlebigen Secrets für reduziertes Risiko bei kompromittierten Werten bevorzugen. |

Ein Team akzeptiert eine Secret-Verwaltung erst, wenn Verschlüsselung im Ruhezustand, RBAC und eine bewusst gewählte, funktionierende Rotationsstrategie nachgewiesen sind.
