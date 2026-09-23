---
{"id": "KB-0523", "title": "Ansible und Konfigurationsmanagement", "domain": "22", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0522", "concepts": ["IaC-Provider und Lifecycle"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ansible-Inventories, Roles und idempotente Playbooks anhand offizieller Dokumentation korrekt für Host-Konfigurationsmanagement einsetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Infrastruktur explizit entscheiden, welche Aspekte über mutable Host-Konfiguration (Ansible) und welche über deklarative Cloudbereitstellung (Terraform/OpenTofu) verwaltet werden, statt beide Ansätze zu vermischen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein wiederholt fehlschlagendes oder inkonsistentes Playbook auf eine verletzte Idempotenz einzelner Tasks zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für die klare Trennung zwischen deklarativer Ressourcenbereitstellung und mutabler Host-Konfiguration festlegen, statt beide Verantwortungsbereiche zu vermischen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Ansible-Modul-Ausführungsmechanik (SSH-basierte Push-Architektur) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Idempotenz, Inventories/Roles-Struktur und der Abgrenzung zu deklarativer Cloudbereitstellung, nicht die Ausführungsmechanik-Interna."}}, "lab_validation": [{"lab_id": "KB-0523-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Idempotenzverletzung in wiederholt ausgeführten Konfigurationsschritten, kein produktives Ansible-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein nicht idempotenter Konfigurationsschritt (z. B. ein Task, der eine Zeile unbedingt an eine Datei anhängt statt deren Vorhandensein zu prüfen) bei wiederholter Ausführung zu inkonsistentem, akkumulierendem Zustand führt, während ein idempotenter Task bei wiederholter Ausführung stets denselben Endzustand erzeugt.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Ansible-Inventory mit tatsächlicher Host-Heterogenität."}]}
---
# Ansible und Konfigurationsmanagement

> **Ziel:** Ansible verwaltet die **mutable Konfiguration bestehender Hosts** (welche Pakete installiert sind, welche Konfigurationsdateien welchen Inhalt haben, welche Dienste laufen) über **Inventories** (Listen verwalteter Hosts, gruppiert nach Rolle oder Umgebung), **Roles** (wiederverwendbare, strukturierte Bündel von Konfigurationsaufgaben) und **Idempotenz** (ein Task, der bei wiederholter Ausführung stets denselben Endzustand erzeugt, unabhängig davon, wie oft er zuvor ausgeführt wurde). Der zentrale Punkt dieses Kapitels ist die Abgrenzung zwischen Ansible und deklarativer Cloudbereitstellung wie Terraform/OpenTofu (siehe [KB-0522](10-iac-provider-und-lifecycle.md)): Terraform/OpenTofu verwaltet, **ob eine Ressource existiert** (Erstellung, Löschung, grundlegende Konfiguration einer Cloud-Ressource), während Ansible verwaltet, **was innerhalb eines bereits existierenden Hosts geschieht** (Paketinstallation, Dateikonfiguration, Dienststeuerung) — eine Vermischung beider Verantwortungsbereiche (etwa: Terraform nutzen, um wiederholt Host-interne Konfigurationsänderungen vorzunehmen, oder Ansible nutzen, um Cloud-Ressourcen zu erstellen und zu löschen) führt zu unklarer Verantwortlichkeit und macht beide Werkzeuge weniger vorhersehbar in ihrem jeweiligen Kernbereich.

## Zweck, Mental Model und Dependencies

Ansible adressiert das Problem der Konfigurationskonsistenz über eine Flotte bereits existierender Hosts hinweg — ohne ein Konfigurationsmanagement-Werkzeug müsste jede Konfigurationsänderung (ein neues Paket installieren, eine Konfigurationsdatei anpassen, einen Dienst neu starten) manuell und potenziell inkonsistent auf jedem einzelnen Host wiederholt werden. Ein Inventory definiert, welche Hosts verwaltet werden und wie sie gruppiert sind (etwa nach Umgebung oder Rolle), während eine Role eine wiederverwendbare, in sich geschlossene Sammlung von Konfigurationsaufgaben für einen bestimmten Zweck (etwa "Webserver konfigurieren") kapselt, die auf verschiedene Hosts oder Host-Gruppen angewendet werden kann. Idempotenz ist das zentrale Verlässlichkeitsprinzip: Ein gut geschriebener Ansible-Task prüft zunächst den tatsächlichen aktuellen Zustand (etwa: ist ein Paket bereits installiert? Enthält eine Datei bereits die gewünschte Konfigurationszeile?) und nimmt nur dann eine Änderung vor, wenn der tatsächliche Zustand vom gewünschten Zustand abweicht — dies ermöglicht es, ein Playbook beliebig oft wiederholt auszuführen, ohne unerwünschte, akkumulierende Nebeneffekte zu erzeugen (etwa eine Konfigurationszeile, die bei jeder Ausführung erneut an eine Datei angehängt wird, statt nur einmal vorhanden zu sein). Die grundlegende architektonische Trennung zu deklarativer Cloudbereitstellung liegt im Verantwortungsbereich: Terraform/OpenTofu entscheidet, welche Cloud-Ressourcen (VMs, Netzwerke, Datenbanken) existieren, während Ansible entscheidet, was innerhalb einer bereits existierenden VM tatsächlich läuft und wie sie konfiguriert ist — ein typisches, sauberes Muster nutzt Terraform/OpenTofu, um eine VM zu erstellen, und übergibt anschließend an Ansible, um diese VM mit der gewünschten Software und Konfiguration zu versehen, statt einen der beiden Verantwortungsbereiche in den jeweils anderen Werkzeugtyp zu verlagern.

~~~text
Ansible: manages MUTABLE configuration of EXISTING hosts
  Inventory: list of managed hosts, grouped by role/environment
  Role: reusable, self-contained bundle of config tasks for a purpose (e.g. "configure webserver")
  Idempotency: task produces SAME end state regardless of how many times it ran before
    -> well-written task CHECKS actual current state first, only changes if it deviates from desired state
    -> enables re-running playbook arbitrarily often WITHOUT accumulating unwanted side effects
    (bad example: task that unconditionally APPENDS a config line -> re-run = duplicate lines accumulate)
KEY ARCHITECTURAL SEPARATION vs declarative cloud provisioning (Terraform/OpenTofu, KB-0522):
  Terraform/OpenTofu: decides WHETHER a resource EXISTS (create/delete/base config of cloud resource)
  Ansible: decides WHAT HAPPENS INSIDE an already-existing host (packages, files, services)
CLEAN PATTERN: Terraform/OpenTofu creates the VM -> hands off to Ansible to configure it
MIXING responsibilities (Terraform for repeated in-host config changes, Ansible for creating/deleting cloud resources)
  -> UNCLEAR ownership, LESS predictable in each tool's core domain
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Inventory | Liste verwalteter Hosts, gruppiert nach Rolle/Umgebung | Grundlage für gezielte, konsistente Konfiguration |
| Role | wiederverwendbares Bündel von Konfigurationsaufgaben | ermöglicht konsistente Anwendung über mehrere Hosts hinweg |
| Idempotenz | Task erzeugt stets denselben Endzustand bei Wiederholung | zentrales Verlässlichkeitsprinzip, prüft Ist- gegen Soll-Zustand |
| Trennung zu deklarativer Cloudbereitstellung | Terraform entscheidet Existenz, Ansible entscheidet Host-Inhalt | Vermischung führt zu unklarer Verantwortlichkeit |

Implementierung: Jeder Ansible-Task wird explizit so gestaltet, dass er den tatsächlichen Ist-Zustand prüft, bevor eine Änderung vorgenommen wird, statt Änderungen unbedingt und wiederholbar-akkumulierend auszuführen. Rollen werden mit klar abgegrenztem Zweck gestaltet und über mehrere Hosts/Gruppen hinweg wiederverwendet, statt hostspezifische, duplizierte Konfigurationslogik zu pflegen. Die Verantwortungsgrenze zwischen deklarativer Cloudbereitstellung (Terraform/OpenTofu) und mutabler Host-Konfiguration (Ansible) wird explizit eingehalten, statt Cloud-Ressourcenerstellung über Ansible oder wiederholte Host-Konfiguration über Terraform vorzunehmen.

## Scalability, Reliability, Security und Observability

Ansible skaliert die Konfigurationskonsistenz proportional zur konsequenten Idempotenz aller Tasks; die Reliability-Grenze liegt darin, dass eine Idempotenzverletzung proportional zur Ausführungshäufigkeit zu akkumulierendem, inkonsistentem Host-Zustand führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein wiederholt ausgeführtes Playbook erzeugt inkonsistenten oder akkumulierenden Zustand (z. B. duplizierte Konfigurationszeilen) | ein oder mehrere Tasks sind nicht idempotent, prüfen den Ist-Zustand nicht vor der Änderung | den betroffenen Task so umgestalten, dass er den Ist-Zustand explizit prüft, bevor er eine Änderung vornimmt |
| Cloud-Ressourcen und Host-Konfiguration werden über dasselbe Werkzeug inkonsistent verwaltet | die Verantwortungsgrenze zwischen Terraform/OpenTofu und Ansible wurde nicht eingehalten | die Ressourcenerstellung explizit auf Terraform/OpenTofu und die Host-Konfiguration explizit auf Ansible aufteilen |
| eine Role verhält sich auf verschiedenen Hosts unerwartet unterschiedlich | die Inventory-Gruppierung berücksichtigt tatsächliche Host-Unterschiede (Betriebssystem, Rolle) nicht korrekt | die Inventory-Gruppierung gegen tatsächliche Host-Eigenschaften prüfen und anpassen |

Security: Ansible-Playbooks, die privilegierte Änderungen vornehmen, sollten mit minimal notwendigen Berechtigungen ausgeführt werden, und sensible Variablen (Passwörter, Zugangsdaten) sollten verschlüsselt statt im Klartext im Playbook-Code gespeichert werden. Observability: Die tatsächliche Änderungsrate pro Playbook-Ausführung (ein hoher Anteil an "changed"-Tasks bei wiederholter Ausführung kann auf Idempotenzverletzung hindeuten), sowie die Konsistenz der Konfiguration über die Inventory-Gruppen hinweg, sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** schreibt idempotente Ansible-Tasks und wendet Rollen korrekt auf Hosts an. **Principal** entwirft die Inventory-Struktur und die Verantwortungsgrenze zwischen Terraform/OpenTofu und Ansible für eine Infrastrukturarchitektur. **Chief** legt unternehmensweite Standards für die klare Trennung von deklarativer Ressourcenbereitstellung und mutabler Host-Konfiguration fest.

Anti-Patterns: nicht idempotente Tasks schreiben, die bei wiederholter Ausführung akkumulierenden oder inkonsistenten Zustand erzeugen; Cloud-Ressourcenerstellung über Ansible statt deklarativer Werkzeuge vornehmen; wiederholte Host-interne Konfigurationsänderungen über Terraform/OpenTofu statt Ansible verwalten.

## Production Checklist

- [ ] Jeder Ansible-Task ist explizit idempotent, prüft den Ist-Zustand vor jeder Änderung.
- [ ] Rollen sind mit klar abgegrenztem Zweck gestaltet und über mehrere Hosts wiederverwendbar.
- [ ] Die Verantwortungsgrenze zwischen deklarativer Cloudbereitstellung und mutabler Host-Konfiguration ist eingehalten.
- [ ] Sensible Variablen sind verschlüsselt statt im Klartext gespeichert.

## Interviewfragen

### 1. Was bedeutet Idempotenz im Kontext eines Ansible-Tasks?

**Antwort:** Ein Task erzeugt bei wiederholter Ausführung stets denselben Endzustand, unabhängig davon, wie oft er zuvor ausgeführt wurde, indem er den Ist-Zustand vor jeder Änderung prüft.

### 2. Was ist der zentrale Unterschied im Verantwortungsbereich zwischen Ansible und Terraform/OpenTofu?

**Antwort:** Terraform/OpenTofu entscheidet, ob eine Cloud-Ressource existiert; Ansible entscheidet, was innerhalb einer bereits existierenden Ressource (Host) konfiguriert ist.

### 3. Warum ist die Vermischung beider Verantwortungsbereiche problematisch?

**Antwort:** Weil sie zu unklarer Verantwortlichkeit führt und beide Werkzeuge in ihrem jeweiligen Kernbereich weniger vorhersehbar macht.

### 4. Was passiert, wenn ein Ansible-Task nicht idempotent geschrieben ist?

**Antwort:** Bei wiederholter Ausführung kann er akkumulierenden oder inkonsistenten Zustand erzeugen, etwa eine Konfigurationszeile, die bei jeder Ausführung erneut angehängt wird, statt nur einmal vorhanden zu sein.

### 5. Wie gehst du vor, wenn ein wiederholt ausgeführtes Playbook inkonsistenten oder akkumulierenden Zustand erzeugt?

**Antwort:** Ich prüfe, welche Tasks nicht idempotent sind, weil sie den Ist-Zustand vor der Änderung nicht prüfen, und gestalte sie explizit so um, dass sie nur bei tatsächlicher Abweichung vom gewünschten Zustand eine Änderung vornehmen.

### 6. Widersprüchliche Anforderung: Team will vollständig deklarative, konsistente Infrastruktur nur über ein einziges Werkzeug UND flexible, mutable Host-Konfiguration für spezielle, sich häufig ändernde Anwendungsanforderungen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständig einheitliche Werkzeugnutzung und die jeweils passende Stärke für Ressourcenerstellung versus Host-Konfiguration sich teilweise widersprechen, und die etablierte Kombination aus Terraform/OpenTofu für Ressourcenerstellung und Ansible für flexible Host-Konfiguration vorschlagen, mit klar dokumentierter Übergabe zwischen beiden, statt ein einzelnes Werkzeug für beide Verantwortungsbereiche zu erzwingen.

## Praktische Labs

~~~python
# Local, deterministic simulation of idempotent vs non-idempotent task behavior (executed locally, no real hosts):

def non_idempotent_append(current_config, desired_line):
    return current_config + [desired_line]  # always appends, regardless of existing content

def idempotent_ensure_line(current_config, desired_line):
    if desired_line in current_config:
        return current_config
    return current_config + [desired_line]

config = ["existing-line"]
for i in range(3):
    config = non_idempotent_append(config, "new-config-line")
print(f"non-idempotent after 3 runs: {config}")

config2 = ["existing-line"]
for i in range(3):
    config2 = idempotent_ensure_line(config2, "new-config-line")
print(f"idempotent after 3 runs: {config2}")
~~~

## Dependencies, Cross-References und Quellen

1. Ansible-Dokumentation: [Ansible Inventory](https://docs.ansible.com/ansible/latest/inventory_guide/index.html), abgerufen 2026-09-18.
2. Ansible-Dokumentation: [Idempotency and Check Mode](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_checkmode.html), abgerufen 2026-09-18.

IaC-Provider und Lifecycle sind kanonisch in [KB-0522](10-iac-provider-und-lifecycle.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende Nutzung immutabler Host-Images (Golden Images, Container) statt wiederholter, mutabler Konfigurationsanwendung zur Laufzeit | Evaluating | Gegenüber laufzeitbasierter, mutabler Konfiguration über Ansible erst nach Prüfung, ob immutable Images für den konkreten Anwendungsfall die operative Komplexität tatsächlich reduzieren, bevorzugen. |

Ein Team akzeptiert eine Ansible-basierte Konfiguration erst, wenn alle Tasks nachweislich idempotent sind und die Verantwortungsgrenze zu deklarativer Cloudbereitstellung eingehalten wird.
