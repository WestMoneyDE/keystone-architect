---
{"id": "KB-0097", "title": "Ansible für Netzwerkänderungen", "domain": "04", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0095", "concepts": ["Modellierte Änderung", "Capability"], "needed_for": "understanding"}, {"id": "KB-0089", "concepts": ["SoT", "Inventory"], "needed_for": "both"}], "related": ["KB-0096", "KB-0098", "KB-0562", "KB-0720"], "applies": ["KB-0096", "KB-0098", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales Inventory-/Playbook-/Idempotenzmodell mit Fehlerfall selbst prüfen.", "rationale": "Kein Gerätezugriff nötig."}, "ARCHITECT-TARGET": {"active": true, "scope": "Inventory-Struktur, Modulwahl, Rollout-Stufen und Backup-/Rollback-Vertrag entwerfen.", "rationale": "Ansible-Netzwerkautomation ist ein Änderungsvertrag über heterogene Geräte."}, "STAFF-TARGET": {"active": true, "scope": "Idempotenzverletzung, Teilausfall, Gerätevarianten und Backup-Wiederherstellung testen.", "rationale": "Fehler entstehen oft an Geräteabweichungen, nicht am Playbook selbst."}, "CHIEF-TARGET": {"active": true, "scope": "Automationsstandard, Change-Gate-Pflicht und Exit-/Vendor-Neutralitätsstrategie entscheiden.", "rationale": "Netzwerkautomation prägt Änderungsrisiko organisationsweit."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Custom Module, Dynamic Inventory Plugins und AWX/Tower-Orchestrierung sind Vertiefung.", "rationale": "Kern ist sichere, idempotente Änderung."}}, "lab_validation": [{"lab_id": "KB-0097-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales fiktives Inventory-/Playbook-Modell", "evidence": "Ein zweiter Lauf desselben Playbooks erzeugt keinen zusätzlichen Change.", "limitations": "Keine echten Geräte, kein Ansible-Control-Node, keine Produktion."}]}
---
# Ansible für Netzwerkänderungen

> **Ziel:** Ansible automatisiert Netzwerkänderungen über Inventories, modulare Playbooks und deklarative Module. Idempotenz reduziert Risiko gegenüber Skripten mit Seiteneffekten, ersetzt aber nicht gestufte Rollouts, Konfigurationssicherungen und den Umgang mit gerätespezifischen Abweichungen.

## Zweck, Mental Model und Dependencies

Ein Inventory beschreibt Zielgeräte und Gruppen; ein Playbook beschreibt gewünschten Zustand über Module statt über Einzelbefehle; Idempotenz bedeutet, dass ein wiederholter Lauf ohne Abweichung keinen weiteren Change erzeugt. Netzwerkmodule unterscheiden sich stark in Abdeckung und Semantik zwischen Plattformen. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0095](19-netconf-restconf-und-yang.md) und [KB-0089](13-netbox-als-source-of-truth.md).

~~~text
SoT/inventory -> playbook/role -> module (platform-specific) -> device diff -> apply -> facts/verify
        ^ group vars                  ^ idempotency check              ^ backup    ^ rollback path
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Inventory | statisch/dynamisch, Gruppenvariablen, SoT-Sync? | veraltete oder falsche Gruppierung |
| Modulwahl | herstellerspezifisch vs. generisch (CLI/API)? | falsche Annahme über Idempotenzsemantik |
| Idempotenz | „changed“ korrekt erkannt? | falscher Change-Status verschleiert Drift |
| Rollout-Stufen | Canary, Batch-Größe, Abbruchkriterium? | ein fehlerhafter Change trifft alle Geräte |
| Backup/Rollback | Vor-Snapshot, Restore-Pfad getestet? | kein Weg zurück bei Fehlkonfiguration |

Implementierung beginnt mit SoT-abgeleitetem Inventory, minimal notwendigen Modulen, expliziten Backups vor Änderung, Check-Mode/Diff wo unterstützt, gestuften Batches mit Canary, Timeout-/Retry-Grenzen, Credentials aus Secret-Management statt Klartext und einer definierten Abbruch-/Rollback-Prozedur.

## Scalability, Reliability, Security und Observability

Skalierung hängt von Forks/Parallelität, Verbindungsplugin, Geräteanzahl und Modullaufzeit ab. Reliability erfordert getestete Backups, Check-Mode vor Apply, Batch-Rollout mit Canary und definierte Reaktion auf Teilausfälle innerhalb eines Batches. „Changed: true“ ist ein Modul-Report, kein Beweis für den gewünschten operativen Zustand.

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| Playbook meldet „changed“ bei jedem Lauf | Modul/Plattform erkennt Zustand nicht korrekt | rohen Diff vor/nach Apply vergleichen |
| Batch bricht bei Gerät 40 von 200 ab | fehlende Canary-Stufe, keine Fehlergrenze | Batch-Größe, max_fail_percentage, Logs |
| Rollback schlägt fehl | Backup nicht getestet oder unvollständig | Restore in Testumgebung verifizieren |
| Credentials im Playbook sichtbar | fehlendes Secret-Management | Vault/External-Secret-Integration prüfen |
| Änderung wirkt, Service bleibt gestört | Config akzeptiert, Data-Plane-Effekt ungeprüft | Post-Check gegen operativen Zustand |

Security erfordert Secret-Management statt Klartext-Credentials, minimale Rechte für den Control-Node, Audit-Log jeder Änderung, getrennte Berechtigungen für Lesen/Ändern und Schutz des Control-Node selbst als privilegiertes System. Observability korreliert Playbook-Run, betroffene Geräte, Change-Diff, Fehlerquote pro Batch und Post-Check-Ergebnis.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet Idempotenz, Teilausfall, Backup-Restore und gerätespezifische Modulgrenzen vor Rollout. **Principal** definiert Rollen-/Modul-/Inventory-Standards, Canary-Policy und Review-Pflicht für Playbooks. **Chief** entscheidet Automationsstandard, Vendor-Neutralität, Change-Gate-Pflicht und Exit-Strategie bei Werkzeugwechsel.

- [ ] Inventory aus SoT abgeleitet und aktuell.
- [ ] Backup, Check-Mode/Diff und Canary-Stufe vor produktivem Rollout getestet.
- [ ] Credentials über Secret-Management, minimale Control-Node-Rechte, Audit-Log vorhanden.
- [ ] Post-Check gegen operativen Zustand statt nur „changed“-Status geprüft.

## Interviewfragen

### 1. Was bedeutet Idempotenz in Ansible-Netzwerkmodulen konkret?

**Antwort:** Ein wiederholter Lauf ohne reale Abweichung erzeugt keinen weiteren Change; das Modul muss den Ist-Zustand korrekt erkennen, nicht nur den Befehl erneut senden.

### 2. Warum reicht „changed: true“ nicht als Erfolgsnachweis?

**Antwort:** Es zeigt einen erkannten Konfigurationsunterschied, nicht ob die Änderung den gewünschten operativen Effekt hatte.

### 3. Wie strukturierst du einen produktiven Rollout?

**Antwort:** Über gestufte Batches mit Canary, definierter Fehlergrenze pro Batch und Abbruch bei Überschreitung, statt alle Geräte gleichzeitig zu ändern.

### 4. Was gehört vor jede Änderung?

**Antwort:** Ein getestetes Backup oder Snapshot des aktuellen Zustands mit verifiziertem Restore-Pfad.

### 5. Wie sicherst du Credentials in Playbooks ab?

**Antwort:** Über Secret-Management/Vault statt Klartextvariablen, mit minimalen Rechten für den Control-Node und Audit-Logging jeder Ausführung.

### 6. Warum unterscheiden sich Module zwischen Herstellern?

**Antwort:** Weil zugrundeliegende CLI/API-Semantik, unterstützte Operationen und Idempotenzerkennung je Plattform unterschiedlich implementiert sind.

## Praktische Labs

~~~python
def apply(state, desired):
    changed = state != desired
    return {**desired}, changed

state = {"vlan": 10}
state, changed1 = apply(state, {"vlan": 10})
state, changed2 = apply(state, {"vlan": 10})
assert changed1 is False and changed2 is False
print("Repeated apply with no drift produces no additional change.")
~~~

## Dependencies, Cross-References und Quellen

1. [Ansible Network Automation Documentation](https://docs.ansible.com/ansible/latest/network/index.html), abgerufen 2026-09-17.
2. [Ansible Inventory Guide](https://docs.ansible.com/ansible/latest/inventory_guide/index.html), abgerufen 2026-09-17.

Zeitabhängige Modulabdeckung, Plattformversionen und Collection-Änderungen vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Netzwerk-Collections statt Kernmodule | established | Versionsmatrix und Modulabdeckung pro Plattform prüfen. |
| Event-Driven Ansible für Netzwerkreaktionen | emerging | Blast Radius, Approval und Fehlerisolation vor Einsatz testen. |
| Integration mit SoT-getriebenen Pipelines | adopting | Sync-Richtung, Konfliktauflösung und Audit-Pfad nachweisen. |

Ein Pilot akzeptiert eine Ansible-Netzwerkautomation erst, wenn Inventory-Qualität, Idempotenz, Backup/Rollback, Canary-Rollout, Secret-Management und Post-Check gegen den operativen Zustand nachgewiesen sind.
