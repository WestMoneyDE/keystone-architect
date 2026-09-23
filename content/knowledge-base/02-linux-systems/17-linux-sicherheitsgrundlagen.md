---
{"id": "KB-0047", "title": "Linux-Sicherheitsgrundlagen", "domain": "02", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-16", "technical_reviewed_at": null, "research_cutoff": "2026-09-16", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0031", "concepts": ["Kernelgrenze", "System Calls", "User Space"], "needed_for": "understanding"}, {"id": "KB-0032", "concepts": ["Prozesse", "exec", "Prozesslebenszyklus"], "needed_for": "understanding"}, {"id": "KB-0035", "concepts": ["VFS", "Inodes", "Pfadauflösung"], "needed_for": "both"}, {"id": "KB-0037", "concepts": ["User Namespaces", "Mount Namespaces", "Isolation"], "needed_for": "both"}, {"id": "KB-0038", "concepts": ["cgroups", "Ressourcenisolation", "Containergrenzen"], "needed_for": "understanding"}], "related": ["KB-0045", "KB-0046", "KB-0048", "KB-0049", "KB-0139", "KB-0501", "KB-0720"], "applies": ["KB-0048", "KB-0139", "KB-0501", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein lokales temporäres Verzeichnis zeigt umask, Eigentümer, Modusbits, sichere Pfadgrenzen und eine read-only Capability-/LSM-Inventur.", "rationale": "Das Lab verändert keine Benutzer, Gruppen, Capabilities, LSM-Policy, Mountoptionen oder Produktionsrechte."}, "ARCHITECT-TARGET": {"active": true, "scope": "Ein Workload-Schutzdesign ordnet lokale UID/GID, Dateisystemrechte, Capability-Minimierung, LSM, Container-/Namespacegrenze, Secretzugriff und Enterprise-Identität zu.", "rationale": "Lokale Kernelautorisierung und externe IAM-Autorisierung werden als getrennte, aber abgestimmte Kontrollschichten entworfen."}, "STAFF-TARGET": {"active": true, "scope": "Teams erhalten sichere Standardidentitäten, immutable Runtime-Defaults, Ausnahmewege, Berechtigungsreviews und negative Tests für privilegierte Workloads.", "rationale": "Least Privilege wird als überprüfbarer Deployment- und Betriebsvertrag umgesetzt."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformweite Baselines für Host-/Containerhärtung, LSM-Strategie, IAM-Föderation, Ausnahmegovernance, Audit und Lifecycle werden gesteuert.", "rationale": "Kernelrechte, Cloud-/Enterprise-IAM und Compliance werden nicht durch eine einzelne Technologie oder eine globale Root-Rolle ersetzt."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "SELinux-/AppArmor-Policyautoring, Landlock, seccomp, file capabilities, user namespaces, kernel lockdown, IMA/EVM und Hostforensik sind Spezialistenfelder.", "rationale": "Die Zielrollen bewerten Modell, Risiko, Support und Rollback; tiefgreifende Policies werden nur autorisiert und getestet betrieben."}}, "lab_validation": [{"lab_id": "KB-0047-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-16", "environment": "Geplante lokale Linux-Sandbox mit temporärem Verzeichnis", "evidence": "Read-only Inventar, sichere Modusprüfung, Gegenprobe und Cleanup fachlich geprüft.", "limitations": "Keine Accounts, Gruppen, Capabilities, LSM-Policies, Mountoptionen, Containerrechte oder Produktionsobjekte wurden verändert oder getestet."}]}
---
# Linux-Sicherheitsgrundlagen

> **Ziel:** Ein Prozess darf nur die Identität, Daten, Systemaufrufe, Ressourcen und Netzwerkwege erhalten, die seine konkrete Aufgabe benötigt. UID/GID, Datei-Modi, Capabilities und LSM sind unterschiedliche Kontrollen mit unterschiedlichen Grenzen. Sie ersetzen weder Enterprise-IAM noch Anwendungsauthorisierung, sondern bilden die lokale Durchsetzungsschicht darunter.

## Purpose, Definition und Scope

Linux-Sicherheitsgrundlagen beschreiben, wie der Kernel lokale Prozesse, Dateien, Geräte und Zugriffe voneinander trennt. Das Kapitel behandelt:

- Prozesscredentials: reale, effektive, gespeicherte und filesystembezogene UID/GID sowie Zusatzgruppen;
- klassische Discretionary Access Control (DAC) mit Ownership, Datei-/Verzeichnismodi, `umask`, set-ID- und Sticky-Bit-Kontext;
- Linux Capabilities als feinere Privilege-Teilung statt einer pauschalen Root-Rolle;
- Linux Security Modules (LSM) als zusätzliche Mandatory-Access-Control- und Security-Hook-Schicht;
- sichere Container-/Namespace- und Workloadgrenzen;
- die Abgrenzung zu Unternehmensidentität, OAuth/OIDC, Directory Services, Secrets Management und Governance, die später eigene kanonische Themen erhalten.

Dieses Kapitel ist keine Anleitung zum Umgehen von Berechtigung, keine SELinux-/AppArmor-Produktkonfiguration und keine Zusage, dass ein Container mit einer non-root UID automatisch sicher ist. Nach dem Kapitel kannst du:

1. erklären, welche Credential-Werte Linux bei lokalem Ressourcen- und Dateizugriff heranzieht;
2. Datei- und Verzeichnisberechtigungen einschließlich Pfadtraversal und `umask` mit einem Datenflussmodell prüfen;
3. Capabilities, privilegierte Systemaufrufe, Bounding-/Effective-Kontext und Drop-Strategie einordnen;
4. DAC, LSM, Containerisolierung, Secrets und externe Enterprise-IAM als geschichtete Kontrollen entwerfen;
5. eine Privilege-Ausnahme mit Owner, Umfang, Dauer, negativer Probe, Audit und Rollback bewerten.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Lokale Kernelzugriffsentscheidung, Dateirechte und Containergrenzen werden aus Primärdokumentation modelliert. |
| HANDS-ON-TARGET | Ein begrenztes Sandbox-Lab erzeugt nur eigene Dateien, prüft deren Modus und inventarisiert Capability-/LSM-Sicht ohne Policyänderung. |
| ARCHITECT-TARGET | Workloadidentität, Dateipfad, Secret, Capability, LSM, Namespace, Netzwerk und Enterprise-IAM werden als Durchsetzungskette mit Fallback entworfen. |
| STAFF/PRINCIPAL | Secure defaults, negative Tests, Ausnahmeprozess und Plattformartefakte machen Least Privilege wiederholbar. |
| CHIEF | Sicherheitsbaseline, IAM-/Plattformverantwortung, Audit und Lifecycle steuern das Portfolio statt einer allmächtigen Adminrolle. |

## Mental Model: sieben Sicherheitsgates statt „Root oder nicht“

Ein lokaler Zugriff auf eine Ressource passiert entlang mehrerer Gates:

```text
workload identity
  -> process credentials (UID/GID/groups)
  -> namespace and mount view
  -> path traversal + DAC/ACL
  -> capabilities and syscall-specific checks
  -> LSM / device / kernel policy
  -> service, secret and network authorization
  -> audit / retention / detection
```

Jedes Gate beantwortet eine andere Frage:

- **Credentials:** Unter welcher lokalen Kernelidentität läuft der Thread?
- **Namespace/Mount:** Welche Prozesse, Pfade und Geräte sind überhaupt sichtbar?
- **DAC/ACL:** Darf diese Identität die Datei bzw. das Verzeichnis lesen, schreiben oder traversieren?
- **Capabilities:** Ist eine sonst privilegierte Operation in diesem Threadset zulässig?
- **LSM:** Ist die Aktion trotz DAC/Capabilities unter einer zusätzlichen Sicherheitsrichtlinie erlaubt?
- **External IAM:** Darf diese Workloadidentität den externen Dienst, den Key oder die Datenklasse nutzen?
- **Application Authorization:** Darf der konkrete fachliche Auftrag diese Datenoperation ausführen?

Die Gates sind nicht austauschbar. Eine erfolgreiche OIDC-Authentisierung gibt keinen Linux-Dateizugriff. `chmod 600` ersetzt keine Key-Policy. Ein LSM-Allow ersetzt keine Mandantentrennung. Root im Container ist nicht automatisch Root auf dem Host, aber es ist auch keine ausreichende Sicherheitsgrenze.

## Prerequisites und Dependencies

| ID | Art | Warum |
|---|---|---|
| [KB-0031](01-linux-kernel-und-systemaufrufe.md) | Verständnis | Kernelentscheidung und System Calls sind der Durchsetzungspunkt. |
| [KB-0032](02-prozesse-und-lebenszyklen.md) | Verständnis | Credentials, `exec`, Eltern-/Kindprozesse und kontrolliertes Ende gehören zusammen. |
| [KB-0035](05-dateisysteme-und-persistenzpfade.md) | Anwendung und Lab | Inodes, Pfade, Mounts und Persistenz klären, worauf Rechte wirken. |
| [KB-0037](07-namespaces-und-isolation.md) | Anwendung und Lab | User-/Mount-/PID-Namespace ändern Sicht und Credential-Bedeutung. |
| [KB-0038](08-cgroups-und-ressourcenbegrenzung.md) | Verständnis | Ressourcenisolation ergänzt, aber ersetzt keine Rechteisolation. |

Hilfreiche Nachbarn: [KB-0045](15-ebpf-und-kernelbeobachtung.md) für privilegiennahe Observability, [KB-0046](16-linux-fehlersuche-und-performance-debugging.md) für sichere Diagnose, [KB-0048](18-container-als-betriebssystemsubstrat.md) für Container und KB-0139/KB-0501 für spätere IAM-/Security-Architektur.

## Core Concepts und Mechanismen

### Prozesscredentials: UID, GID und Gruppen

`credentials(7)` beschreibt mehrere Nutzer- und Gruppenidentitäten pro Prozess. Die wichtigste Architekturregel ist: **ein Prozess hat nicht nur „einen Usernamen“.** Reale UID/GID identifizieren Herkunft; effektive UID/GID beeinflussen viele Permission Checks; gespeicherte Set-IDs ermöglichen bei set-ID-Programmen kontrolliertes Wiederannehmen/Abgeben; filesystem UID/GID sind Linux-spezifisch für Dateioperationen relevant; Zusatzgruppen erweitern den Gruppenkontext.

| Credential | Typische Funktion | Sicherheitsfrage |
|---|---|---|
| Real UID/GID | Herkunft / Ownership-Kontext | Wer startete bzw. besitzt den Prozess? |
| Effective UID/GID | Privilege Checks für viele Kernelobjekte | Welche Berechtigung wirkt aktuell? |
| Saved set-ID | set-ID-Programmkontext | Kann Privileg später wieder aktiviert werden? |
| Filesystem UID/GID | File Access Check auf Linux | Welche ID prüft die VFS-/Dateizugriffslogik? |
| Supplementary groups | zusätzliche Gruppenberechtigungen | Welche unbewussten Freigaben entstehen? |
| User namespace mapping | übersetzte UID/GID-Sicht | Wie wirkt „root“ innerhalb und außerhalb des Namespace? |

`id`, `/proc/<pid>/status` und `ps` können in geeigneten, autorisierten Umgebungen Informationen anzeigen. Eine Anzeige eines Namens sagt jedoch nicht automatisch, welche Effective-/Filesystem-IDs, Gruppen, Capabilities, Namespaces oder LSM-Labels zum Zeitpunkt eines System Calls galten.

### DAC: Eigentümer, Gruppe, Other und Pfadtraversal

Die bekannten `rwx`-Bits auf einem Inode sind eine DAC-Schicht. Für reguläre Dateien bedeutet `r` gewöhnlich Lesen, `w` Ändern des Inhalts und `x` Ausführen. Für Verzeichnisse bedeutet `r` Namen auflisten, `w` Einträge anlegen/löschen/umbenennen und `x` den Pfad traversieren beziehungsweise auf Einträge zugreifen, wenn deren Namen bekannt sind. Zugriffsentscheidungen hängen daher nicht nur an der Zieldatei, sondern an jedem durchlaufenen Verzeichnis.

```text
open("/srv/app/private/report.txt")
  -> may traverse "/"?
  -> may traverse "/srv"?
  -> may traverse "/srv/app"?
  -> may traverse "/srv/app/private"?
  -> may read target inode?
  -> extra ACL / LSM / mount / capability constraints?
```

Die numerische Darstellung gruppiert Owner, Group und Other. `chmod(2)` dokumentiert die Modusbits und die Einschränkungen, unter denen ein Prozess sie ändern darf. Ein Review fragt nie nur „Ist die Datei 600?“, sondern auch: Welcher Prozess besitzt sie, wer darf den übergeordneten Pfad traversieren, welche Gruppe ist wirksam, wie entstehen neue Dateien und welche Mount-/Namespace-/LSM-Kontexte gelten?

### `umask`, set-ID und Sticky Bit

`umask` entfernt Rechte aus dem von einem Create-Aufruf gewünschten Ausgangsmodus. Sie ist eine Prozess-/Shellumgebungseigenschaft, nicht die alleinige Sicherheitsgarantie. Ein Service mit `umask 077` kann als sichere Standardtendenz neue private Dateien erzeugen; Anwendungen müssen aber weiterhin explizite Modi, Verzeichnisrechte, Fehlerbehandlung und Secrets-Lifecycle besitzen.

Set-user-ID und set-group-ID verändern den Sicherheitskontext beim `exec` und sind deshalb hochsensibel. Das setgid-Bit auf einem Verzeichnis kann Gruppenvererbung für neue Einträge bewirken; es vereinfacht Kollaboration, kann aber zu breiterem Zugriff führen. Das Sticky Bit auf gemeinsam beschreibbaren Verzeichnissen begrenzt bestimmte Lösch-/Rename-Aktionen auf Owner/Privilegierte. Diese Bits lösen keine allgemeine Tenant- oder Secrets-Isolation und werden nur in begründeten, getesteten Plattformfällen eingesetzt.

### ACLs und Ownershipwechsel

POSIX-ACLs können DAC verfeinern, sofern Dateisystem und Plattform sie nutzen. Sie verbessern Zusammenarbeit, erschweren aber einen Review, wenn nur die drei Standardgruppen betrachtet werden. Ownership- und Gruppenwechsel sind ebenfalls keine harmlose Wartungsaktion: Sie ändern die Sicherheitsoberfläche und können Serviceausfälle erzeugen. Ein automatisierter Deploymentpfad dokumentiert deshalb Owner, Group, Mode, ACL-Absicht und erwartete Consumer. Keine manuelle „chmod 777“-Reparatur als Incident-Fix.

### Capabilities: Privilegien in Teilrechte zerlegen

Linux zerlegt seit langem viele klassische Root-Berechtigungen in Capabilities. `capabilities(7)` beschreibt sie als per-thread Attribute. Statt einer Prozessrolle mit umfassender UID-0-Macht kann ein Workload gegebenenfalls genau die Capability benötigen, die einen klar abgegrenzten Vorgang ermöglicht. Aber „kleiner als root“ bedeutet nicht klein genug: Manche Capabilities sind breit oder riskant; `CAP_SYS_ADMIN` ist insbesondere kein pauschal akzeptabler Ersatz für eine genaue Analyse.

Eine robuste Architektur betrachtet mindestens:

- **Permitted set:** Capabilities, die der Thread potenziell effektiv machen kann;
- **Effective set:** aktuell bei Permission Checks wirksame Capabilities;
- **Inheritable / Ambient:** Übergabe-/Exec-Kontext mit eigenen Regeln;
- **Bounding set:** Obergrenze dessen, was später durch Exec erreichbar werden kann;
- **File capabilities:** Capabilities, die einer Datei/Executable zugeordnet sind und beim Exec relevant werden können;
- **User namespace:** Capabilitywirkung ist namespaced und muss gegen Hostgrenzen geprüft werden;
- **No-new-privileges-/Runtimepolicy:** verhindert oder begrenzt Privileggewinn in passenden Laufzeitmodellen.

Die genaue Transformation beim `exec`, bei set-ID, File Capabilities, Securebits, User Namespaces und Container-Runtimes ist komplex und zielkernelspezifisch. Ein Design trägt daher eine Capability-Matrix und testet die konkrete Runtime statt aus einer Image-Dokumentation zu schließen.

### LSM: zusätzliche Policies über DAC und Capabilities

Linux Security Modules stellen Hooks bereit, über die Securitymodule zusätzliche Entscheidungen treffen können. LSM ist ein Framework; konkrete Systeme wie SELinux oder AppArmor haben eigene Semantik, Labels/Profiles, Werkzeuge, Auditformate und Betriebsmodelle. Ein DAC-Allow kann durch LSM abgewiesen werden. Umgekehrt darf ein LSM-Policy-Allow nicht so interpretiert werden, als wären IAM, Anwendungsauthorisierung oder Datenklassifikation automatisch erfüllt.

Die Debuggingfrage lautet nicht „Wie deaktiviere ich die Policy?“, sondern:

1. Welche Aktion, welcher Prozess, welcher Pfad/Socket und welches Label/Profile waren betroffen?
2. Ist der Zugriff fachlich und architektonisch nötig?
3. Kann die Anwendung oder ihr Datenpfad enger gestaltet werden?
4. Falls eine Policyausnahme nötig ist: ist sie minimal, versionskontrolliert, testbar, zeitlich begrenzt und auditierbar?
5. Wie wird die Ausnahme bei Image-, Kernel-, Distribution- oder Datenklassenwechsel erneut geprüft?

### Landlock und anwendungsnahe Sandboxing

Landlock ist eine Linux-Schnittstelle für anwendungsseitige Einschränkung von Dateisystem- und weiteren Ressourcenberechtigungen; `landlock(7)` dokumentiert Regeln, Rulesets und ABI-Abhängigkeiten. Es kann Defence in Depth bieten, etwa wenn ein Prozess seine eigene Sicht weiter einschränken soll. Es ersetzt keinen Hostzugangsschutz, keine Containerpolicy und kein Enterprise-IAM. Der ABI-/Kernel-Support wird vor Verwendung geprüft; eine fehlende Landlockfähigkeit löst einen klaren Fallback aus, nicht ein stilles Security-Downgrade.

### Container, Namespace und „non-root“

Container kombinieren oft User-/Mount-/PID-/Netzwerk-Namespaces, cgroups, Linux Capabilities, Seccomp, LSM und Runtimepolicy. Kein einzelnes Element ist die Sicherheit. Non-root UID ist ein wichtiger Default, aber die tatsächliche Grenze hängt an effektiver UID, Gruppen, Capabilitysets, User Namespace Mapping, writable Mounts, HostPath-/Devicezugriff, Service Account, Tokenmounts, LSM, Runtime und Deploymentrechten.

Ein Workload sollte daher nicht auf die Annahme bauen, dass UID 0 im Container ungefährlich oder dass eine beliebige nicht-null UID keine Berechtigungen hat. Der sichere Standard ist: explizite non-root UID/GID, minimale Gruppen, read-only Root-Dateisystem wo kompatibel, genau dokumentierte writable Pfade, keine unnötigen Capabilities/Devices/Hostnamespaces, enges Secret-Mounting und negative Tests.

## Architecture und Data Flow: ein minimal privilegierter Index-Worker

Der Fall ist eine Lernannahme, kein reales Praxisprojekt.

```text
Enterprise workload identity
  -> workload admission / service account
  -> container runtime identity (UID/GID, groups, capability set)
  -> namespaces + cgroups + read-only root filesystem
  -> writable ephemeral work directory only
  -> short-lived secret projection / approved remote secret API
  -> filesystem DAC + LSM policy
  -> encrypted external data service with IAM authorization
  -> audit events and policy health
```

**Beispielauftrag:** Ein Index-Worker liest einen autorisierten Job, verarbeitet kurzlebige Daten und schreibt das Ergebnis über eine Serviceidentität in einen externen Index. Er benötigt keine Host-PIDs, keine Devicezugriffe, keinen Socket-Admin-Kontext, keinen privilegierten Port, keine globale Schreibbarkeit und keine langfristigen Klartextsecrets.

| Schicht | Entscheidung | Schutz | Failure / Fallback |
|---|---|---|---|
| Enterprise IAM | Welche Workload darf welchen Service nutzen? | workload-bound identity, scoped token, audit | token expiry → controlled re-auth/fail closed |
| Runtime | Unter welcher lokalen UID/GID läuft der Prozess? | non-root, minimal groups | image assumes root → redesign image, no broad override |
| Filesystem | Welche Pfade sind writable? | explicit owned work dir, secret dir read-only | permission error → correct path/owner, no `777` |
| Capabilities | Welche Syscallklasse ist ausnahmsweise nötig? | default drop, documented add | capability missing → validate need, not `SYS_ADMIN` |
| LSM | Welche file/socket actions sind erlaubt? | reviewed profile/label | denial → investigate policy and design intent |
| Network | Welche egresses sind erlaubt? | service-specific policy | dependency fail → degrade/retry per contract |
| Audit | Was wird belegt? | identity, policy revision, denial/error class | missing audit → block production approval |

Dieses Modell trennt **wer ein externer Dienst glaubt, dass du bist** von **wie der Linux-Kernel deine lokale Prozessaktion bewertet**. Beide Identitäten müssen zusammenpassen, aber sie sind nicht dieselbe Implementierung.

## Protocols, Standards und Tools

| Mechanismus / Tool | Primäre Rolle | Sichere Nutzung | Grenze |
|---|---|---|---|
| `credentials(7)`, `id`, `/proc/<pid>/status` | UID/GID-/Gruppenkontext | read-only, scope auf eigenen/autorisierten Prozess | keine vollständige IAM- oder LSM-Sicht. |
| `chmod(2)`, `stat`, `umask` | DAC- und Datei-Modi | eigene temporäre Dateien, deklarierte Erwartungen | prüft nicht alle Pfade, ACLs, LSM oder Mountpolicy. |
| `capabilities(7)`, `getcap`, `/proc/self/status` | Capability-Inventar | read-only, genaue Wirkung pro Runtime prüfen | Capabilityname allein garantiert nicht nötige oder sichere Funktion. |
| LSM `/sys/kernel/security/lsm`, Audit | aktive Security-Hooks und Denials | read-only inventory, redigiertes Audit | konkrete SELinux/AppArmor-Policy ist distributionsspezifisch. |
| Landlock | optionale appnahe Sandbox | nur nach Kernel-/ABI-Matrix | keine universelle Container-/IAM-Kontrolle. |
| Container Runtime / orchestrator policy | workload baseline | versionierte Templates + negative tests | kein Ersatz für Host- oder external IAM Governance. |

Standards im engeren Sinne sind hier vor allem Linux-ABI und Distribution-/Runtime-Policies. Eine Unternehmensbaseline muss deshalb Kernel-, Distribution-, Container-Runtime-, Orchestrator- und Cloud-/IAM-Versionen explizit erfassen.

## Konfiguration und Implementierung: Schutzvertrag eines Workloads

Die folgende Vorlage beschreibt eine Architekturentscheidung, keine direkt ausführbare Deploymentdatei:

```yaml
workload_security_contract:
  identity:
    enterprise_subject: "workload-bound; short-lived"
    runtime_uid_gid: "non-root; explicit"
    supplementary_groups: "minimum documented set"
  filesystem:
    root: read_only_when_compatible
    writable_paths:
      - path: /work
        owner: runtime_uid
        mode: "0700"
        lifecycle: ephemeral
    secret_paths:
      mode: "read_only; consumer-specific"
      retention: short_lived
  privilege:
    capabilities: drop_all_by_default
    exceptions:
      - capability: "only-after-need-and-negative-test"
        owner: platform-security
        expiry: required
    no_new_privileges: required_when_runtime_supports
  isolation:
    host_namespaces: prohibited
    host_devices: prohibited
    user_namespace_policy: platform-defined
    lsm_profile: required-where-supported
  access:
    network: approved-dependencies-only
    external_iam: least-privilege-scope
  assurance:
    tests: [non_root, write_path_denial, secret_scope, capability_inventory, lsm_denial_review]
    audit: [identity, policy_revision, denied_operation_class]
    rollback: "remove exception or revert workload revision"
```

Die Konfiguration ist erst vollständig, wenn sie Tests enthält, die **keinen** Zugriff erwarten. Eine positive Prüfung von „Service startet“ beweist kaum etwas. Notwendige Negative Tests sind beispielsweise: Schreibversuch außerhalb des Workdir, Zugriff ohne externen Scope, Capability-Inventar ohne unerwartete Rechte, fehlender Secretpfad und LSM-Denial in einer freigegebenen Testumgebung.

## Scalability und Performance

Securitykontrollen haben Ressourcen- und Latenzfolgen. Das ist kein Argument, sie pauschal zu entfernen, sondern eine Designfrage:

| Kontrolle | Leistungsaspekt | Richtige Messfrage |
|---|---|---|
| UID/GID/DAC | typischerweise geringer lokaler Checkaufwand | entstehen Fehlzugriffe oder zusätzliche I/O durch falsche Pfade? |
| LSM | Policy-/Auditpfad kann zusätzliche Arbeit und Denials erzeugen | bleibt Produktp99 im SLO bei realistischer Last und Auditvolumen? |
| Secret Projection | Rotation/Refresh und API-Aufruf | sind Start-/Rotation-/Failurephasen budgetiert? |
| Namespaces / runtime | Mount-/Mapping-/Startupkomplexität | funktioniert Horizontal Scaling bei identischem Privilegmodell? |
| Capabilities | keine Pauschalperformanceaussage | reduziert die Ausnahme wirklich den Scope ohne funktionale Nebenwirkung? |
| Audit / telemetry | Events, retention, query | ist der Auditwert höher als Ingest-/Privacykosten und sind Felder minimiert? |

Eine Plattform skaliert Rechte nicht durch mehr Gruppen, globale Shared Volumes oder breite Capabilities. Sie skaliert über wiederverwendbare, versionierte Workloadklassen mit klarer Daten-, Secret- und Pfadsemantik. Eine Ausnahme, die nur auf einer Node oder als Root funktioniert, ist ein Portabilitäts- und Reliabilityrisiko.

## Reliability und Failure Modes

| Fehlermodus | Symptom | Richtige Reaktion |
|---|---|---|
| falscher Owner/Mode | `EACCES` / `EPERM`, Startup fail | Pfad-/Owner-/Modevertrag prüfen; keine globale Öffnung. |
| fehlendes Pfad-`x` | Datei scheint korrekt, Zugriff scheitert | alle Verzeichniskomponenten und Namespace-/Mountsicht prüfen. |
| überbreite Gruppe/ACL | ungewollter Read/Write | Gruppen-/ACL-Intent reviewen, kleinsten Scope herstellen. |
| Capability fehlt | Syscall abgewiesen | fachliche Notwendigkeit/Alternative bewerten, minimale Ausnahme testen. |
| Capability zu breit | erhöhte Exploit-/Blast-Radius | drop by default, konkrete Capability oder Designwechsel. |
| LSM-Denial | Prozess darf laut DAC, aber Aktion wird blockiert | Denial klassifizieren; Policy/Design minimal ändern, auditieren. |
| UID mapping surprise | Containerzugriff stimmt nicht mit Host/Volume überein | user namespace, ownership, storage driver, image/runAs matrix prüfen. |
| Secret permissions break rotation | neue Secretdatei nicht lesbar / alter Prozess hält Daten | Rotation contract, atomic update, least privilege, failure test. |
| Root workaround | Incident „gelöst“, Baseline gebrochen | rollback, root cause, exception governance, post-incident repair. |
| fehlendes Audit | Denial/Access nicht nachvollziehbar | logging pipeline and retention before rollout herstellen. |

Permission errors sind häufig ein sicheres Fail-Closed-Signal. In einem Incident wird zuerst geklärt, welche kontrollierte Zugriffsbeziehung fehlt. Ein pauschales Privilege-Upgrade kann das akute Symptom verdecken, aber eine neue, langlebige Sicherheitslücke erzeugen.

## Security, Governance und Compliance

### Threat Model

| Asset | Angreifer-/Fehlermodell | Kontrolle |
|---|---|---|
| Secrets / tokens | anderer Prozess, Imagekompromittierung, Debugdump | scoped, short-lived, read-only, redacted logs, rotation. |
| Kundendaten / Indexe | falsche UID/group/ACL, shared volume, path traversal | namespace/path separation, DAC/LSM, external IAM, audit. |
| Host / Kernel | privileged container, capability/device/host namespace misuse | minimal runtime, no host privileges, reviewed exception, node isolation. |
| Netzwerkidentität | gestohlener Token, breites Servicekonto | workload identity, narrow audience/scope, expiry, revocation. |
| Auditdaten | sensitive paths/args/labels | data minimization, RBAC, retention, access audit. |
| Availability | overrestrictive policy or emergency broadening | test matrix, canary, break-glass with expiry/audit. |

### Governancegrenze zu Enterprise-IAM

Linux UID/GID und Capabilities werden lokal am Kernel durchgesetzt. Enterprise-IAM verwaltet Identitäten, Federation, Token, Rollen, Nachweis, Rezertifizierung und externe Ressourcenzugriffe. Beide müssen zusammengeführt werden:

```text
human / workload identity
  -> enterprise policy and token
  -> deployment admission
  -> runtime service account
  -> local Linux UID/GID/capabilities/LSM
  -> resource action
  -> correlated audit without leaking secret data
```

Eine UID 10001 ist keine Person, kein Mandant und keine IAM-Rolle. Umgekehrt gewährt eine Directory-Gruppe nicht automatisch Lesezugriff auf `/run/secrets/...`. Architekturreviews dokumentieren Zuordnung, Rotation, Deprovisioning, Break Glass, Auditcorrelation und die Grenzen jeder Schicht.

## Observability und Troubleshooting

### Security-Signale

- Workload-UID/GID, Gruppenanzahl und Capability-Inventar als kontrollierte, nicht sensitive Konfigurationsdaten;
- File-/Path-Denial-Klasse, LSM-Denial-Klasse, Secret-/Token-Rotation-Erfolg, unzulässige Capability-/Hostnamespace-Anforderung;
- Policy-/Image-/Runtime-/Kernelrevision, Nodepool- und Datenklassifikation;
- privilegierte Ausnahme mit Owner, Ablauf, Canary-/Rollbackstatus;
- Auditpipeline-Gesundheit und Redactionfehler.

Keine Telemetrie enthält Klartexttoken, vollständige Secretpfade, Kundendaten, private Process Arguments oder unbounded Containerlabels.

### Diagnosepfad für `permission denied`

1. Identifiziere die genaue Operation, den betroffenen Prozess, Zeitpunkt, Namespace/Mount und den erwarteten Ressourcenvertrag.
2. Prüfe Effective UID/GID, Zusatzgruppen, Runtime- und User Namespace Mapping.
3. Prüfe Zieldatei **und** alle Verzeichniskomponenten für Ownership, Mode und beabsichtigte ACL.
4. Prüfe den Mount-/Containerpfad: sieht der Prozess dieselbe Ressource wie der Host?
5. Prüfe Capabilities nur, wenn der System Call tatsächlich eine privilegierte Operation benötigt.
6. Prüfe LSM-/Audit-Denials in einer berechtigten, redigierten Sicht.
7. Vergleiche mit einer minimalen, autorisierten Referenzkonfiguration.
8. Entscheide: falscher Pfad, falsche Identity, fehlende berechtigte Policy, überbreites Design oder Bug. Erhöhe Privilegien nur über den expliziten Ausnahmeweg.
9. Ergänze einen negativen Regressions-/Deploymenttest und schließe temporäre Debugzugänge.

## Cost und FinOps

Security verursacht vor allem indirekte Kosten: sichere Image-/Policyentwicklung, CI-Tests, Support über Kernel-/Runtimeversionen, Audit-/Logingest, Incidentzeit, Secretrotation und Ausnahmegovernance. Die Kosten eines zu breiten Privilegs sind probabilistisch, aber potenziell sehr hoch: Datenverlust, laterale Bewegung, Regulierung, Forensik, Rebuild und Geschäftsunterbrechung.

```text
security_cost =
  baseline_engineering
+ policy_test_and_upgrade_work
+ audit_ingest_retention
+ secret_identity_lifecycle
+ exception_review
+ expected_incident_loss
```

FinOps bewertet deshalb nicht nur „Audit kostet Speicher“. Sinnvolle Einheiten sind beispielsweise sichere erfolgreiche Workload-Runs, überprüfbare Zugriffsentscheidungen oder vermiedene Blast Radius. Eine Plattformklasse mit Default-Deny und wiederverwendbaren Tests senkt langfristig Ausnahme-, Incident- und Reviewkosten, auch wenn der initiale Deploy etwas mehr Engineering benötigt.

## Trade-offs, Alternativen und Anti-Patterns

| Entscheidung | Sinnvoll wenn | Preis / Exit |
|---|---|---|
| dedizierte non-root UID/GID | fast immer bei App-Workloads | Image-/Volumeownership muss sauber entworfen werden. |
| Gruppenfreigabe | echte, kontrollierte Zusammenarbeit an lokalen Ressourcen | Gruppenwachstum und Rechtesicht werden komplex. |
| ACL | begrenzte zusätzliche Local Access-Regel nötig | Audit-/Tool-/Backup-Kompatibilität prüfen. |
| Capability-Ausnahme | exakt ein notwendiger, testbarer Systemcallkontext bleibt | runtime-/kernelabhängig, TTL/Owner/negative test nötig. |
| LSM-Policy | höherer Schutz-/Mandantentrennbedarf und Support vorhanden | Policyautoring, Debug, Upgrades und Audit. |
| Landlock | Anwendung kann ihre eigene Reichweite weiter reduzieren | ABI-/Kernelmatrix, kein Ersatz für Host/IAM. |
| Root / privileged container | nur eng begrenzter Plattformagent mit expliziter Risikofreigabe | großer Blast Radius, Nodeisolation, audit, exit plan. |
| external IAM | externe APIs, Daten und Secrets | Token-/Federation-/Rotationvertrag; ersetzt lokale File Rechte nicht. |

Anti-Patterns:

- `chmod -R 777` oder breite Gruppenrechte als Fehlerbehebung;
- `CAP_SYS_ADMIN` als erste oder dauerhafte Lösung;
- root im Container als „funktioniert“-Kriterium;
- UID als Ersatz für Enterprise-Person, Mandant oder Geschäftsrolle behandeln;
- LSM bei Denials deaktivieren statt Absicht und minimale Policy zu prüfen;
- Secrets auf allgemeine, persistente, schreibbare Volumes legen;
- Capability-/LSM-/Hostnamespace-Ausnahmen ohne Owner, TTL, Audit, negative Test und Rollback;
- standardisierte Non-root-Policies erzwingen, obwohl alte Images/Volumes keine Migrationsstrategie haben;
- Auditlogging mit Klartextsecrets, vollständigen Argumenten oder Kundendaten füllen.

## Staff-, Principal- und Chief-Level Decisions

### Staff: konkreter Workloadschutz

Staff legt für einen Dienst eine minimale lokale Sicherheitsoberfläche fest: UID/GID, Gruppen, writable paths, Secret consumer, benötigte Netzwerkziele, Capability-/Device-/Hostnamespace-Verbot, LSM-Erwartung, negative Tests und Incident-Runbook. Wenn eine Ausnahme erforderlich ist, dokumentiert Staff Nutzen, Alternative, Umfang, Risiko, Canary, Owner, TTL und Rückbau. Ein gescheiterter Denial-Test ist ein Releaseblocker, nicht ein Anlass für pauschale Rechte.

### Principal: wiederverwendbare Plattformstandards

Principal definiert sichere Baselines und Plattforminterfaces: curated images, non-root-/filesystem-/capability defaults, PSS-/admissionartige Guardrails, LSM-/runtime support matrix, Secret Delivery, identity federation, hardened Node Pools, audit schema und Ausnahmeboard. Produktteams deklarieren Bedarf; die Plattform liefert begrenzte, supportete Profile. Principal steuert Migrationen von rootabhängigen Images und macht Deviationen messbar.

### Chief: Sicherheits- und Betriebsportfolio

Chief entscheidet Risikoappetit, Betriebsmodell und Investment: Welche LSM-/Runtime-/Hosthärtung wird für welche Datenklasse vorausgesetzt? Wer verantwortet Break Glass? Wie korrelieren IAM-, Deployment-, Kernel- und Auditdaten? Welche Legacy-Ausnahmen werden abgebaut? Das Ziel ist nicht eine maximale Policyzahl, sondern eine überprüfbare Risikoreduktion mit verfügbarer Plattform, realistischen Upgradepfaden, Kostenallokation und belastbarer Incidentfähigkeit.

## Production Checklist

- [ ] Workload- und Enterpriseidentität, Audience/Scope, Rotation und Auditcorrelation sind dokumentiert.
- [ ] UID/GID, Zusatzgruppen, User Namespace und effektive Runtime-Credentials sind bewusst gewählt und testbar.
- [ ] Root-Dateisystem, writable paths, Volumeownership, `umask`, Secretpfade und Retention sind explizit.
- [ ] DAC-/ACL- und Pfadtraversaltests decken erwartete Allows und Denials ab.
- [ ] Capabilityset ist default-deny; jede Ausnahme hat begründeten Syscall/Use Case, Owner, TTL und negativen Test.
- [ ] Host namespaces, HostPath, Devices und privileged mode sind verboten oder separat freigegeben.
- [ ] LSM-/runtime-/kernel-Support und Denial-Audit sind auf dem Zielnode geprüft.
- [ ] Secrets sind klein, kurzlebig, nicht geloggt, rotierbar und im Ausfallpfad bewertet.
- [ ] Policy-/Image-/Runtimeupgrade haben Canary, Rollback und Kompatibilitätstest.
- [ ] Ausnahme-, Access- und Auditdaten haben Retention, Owner und regelmäßige Re-Zertifizierung.

## Interviewfragen mit Antwortleitfäden

### 1. Wie entscheidet Linux bei einer Dateioperation, ob ein Prozess lesen darf?

Ich betrachte effektive beziehungsweise filesystembezogene Credentials, Zusatzgruppen, alle Verzeichnisse im Pfad, Owner/Group/Mode, mögliche ACLs, Mount-/Namespace-Sicht und LSM. Capabilities können einzelne Checks beeinflussen, aber sie ersetzen nicht das vollständige Modell. Eine richtige Antwort trennt Dateiinhalt, Verzeichnistraversal und externe IAM-Autorisierung.

### 2. Warum ist `chmod 777` ein Anti-Pattern?

Es vergrößert den lokalen Blast Radius, verschleiert die notwendige Identitäts-/Pfad-/Gruppenentscheidung und bleibt oft dauerhaft. Die richtige Lösung ist der kleinste korrekte Owner, Group, Mode, ACL oder Workloadpfad, abgesichert durch einen Denial-Test.

### 3. Was sind Capabilities und warum ist `CAP_SYS_ADMIN` problematisch?

Capabilities teilen traditionelle Superuserrechte auf. Sie sind per Thread und haben Sets mit Exec-/Namespacekontext. `CAP_SYS_ADMIN` deckt viele, breit wirkende Operationen ab und ist deshalb selten eine minimal gerechtfertigte Ausnahme. Ich prüfe zuerst ein alternatives Design oder eine engere Capability und dokumentiere einen testbaren Bedarf.

### 4. Reicht non-root in einem Container als Sicherheitskontrolle?

Nein. Ich prüfe zusätzlich Gruppen, Capabilities, User Namespace Mapping, writable Mounts, Devices, Hostnamespace, Runtimepolicy, LSM, Secrets, Network und Deploymentrechte. Non-root ist ein guter Default, keine vollständige Bedrohungsmodellierung.

### 5. Was macht ein LSM zusätzlich zu Dateirechten?

Ein LSM kann über Security Hooks zusätzliche erlaubende oder verweigernde Richtlinien durchsetzen. Ein DAC-Allow kann daher LSM-seitig scheitern. Ich interpretiere einen Denial als Hinweis, den beabsichtigten Zugriff und die minimal nötige Policy zu prüfen, nicht als Aufforderung zum Abschalten.

### 6. Wie grenzt du Linux-UID von Enterprise-IAM ab?

UID/GID sind lokale Kernelcredentials. Enterprise-IAM verwaltet externe Identitäten, Tokens, Rollen, Federation und Rezertifizierung. Ein vollständiger Datenpfad verbindet beide über Deployment-/Workloadidentität und korrelierte Audits, ohne sie semantisch gleichzusetzen.

### 7. Wann sind File Capabilities angemessen?

Nur wenn eine klar definierte Executable eine konkrete Capability braucht, der Zielkernel/Runtime-/namespace-Kontext getestet ist und es keine engere Architekturalternative gibt. Sie erhalten Buildprovenance, Scanning, Owner, TTL/Review und negative Tests. Sie sind nicht die Standardantwort für Containerprobleme.

### 8. Wie behandelst du eine Produktionsmeldung „Permission denied“?

Ich sichere zuerst Scope, Impact und Audit. Dann prüfe die lokale Identitäts- und Pfadkette, Mount-/Namespace-Sicht, legitime Capability-/LSM-Denials und die externe Berechtigung. Ich vermeide Root-/777-Workarounds und ergänze den endgültigen Fix um eine negative Regressionprobe, eine Rollbackstrategie und ein Ausnahmeende.

## Praktisches Lab: eigene Dateirechte und read-only Sicherheitsinventur

> **Status:** `reviewed_only`. Das Lab ist nur für eine eigene Linux-Sandbox bestimmt. Es erzeugt ein frisches temporäres Verzeichnis und lokale Dateien. Es erstellt keine User/Gruppen, setzt keine File Capabilities, lädt keine LSM-Policy, ändert keine Mounts und berührt keine Produktions- oder Shared-Pfade.

### Ziel

Prüfe, wie `umask`, Owner und Modusbits in einem privaten Testpfad sichtbar werden. Inventarisiere Capability-/LSM-Sicht nur lesend. Die Negative Probe zeigt, dass ein Modusdeny nicht pauschal durch höhere Rechte umgangen werden soll.

### Ablauf

```bash
set -euo pipefail

work_dir="$(mktemp -d "${TMPDIR:-/tmp}/kb0047-XXXXXX")"
trap 'rm -rf -- "$work_dir"' EXIT

umask 077
printf 'local test data\n' > "$work_dir/private.txt"
mkdir "$work_dir/private-dir"
chmod 700 "$work_dir" "$work_dir/private-dir"
chmod 600 "$work_dir/private.txt"

id
stat -c '%A %a %U:%G %n' "$work_dir" "$work_dir/private.txt" "$work_dir/private-dir"
grep -E 'Cap(Prm|Eff|Bnd|Amb)' /proc/self/status || true
test -r /sys/kernel/security/lsm && cat /sys/kernel/security/lsm || true

if command -v getcap >/dev/null 2>&1; then
  getcap "$work_dir/private.txt" || true
else
  echo 'getcap absent: no installation requested'
fi

# Negative mode probe only for a non-root sandbox identity.
if [ "$(id -u)" -ne 0 ]; then
  chmod 000 "$work_dir/private.txt"
  if test -r "$work_dir/private.txt"; then
    echo 'unexpected: read still permitted; inspect environment before continuing'
  else
    echo 'expected: mode denies read for this sandbox identity'
  fi
  chmod 600 "$work_dir/private.txt"
else
  echo 'negative permission probe skipped for UID 0; root can bypass DAC checks'
fi
```

### Auswertung, Gegenproben und Cleanup

1. Dokumentiere nur die eigene UID/GID, Gruppenanzahl, Modusbits und die Tatsache, ob Capability-/LSM-Inventar sichtbar war. Keine Hostnamen, Tokens oder vollständigen Security-Auditdaten in Lernnotizen übernehmen.
2. **Gegenprobe 1:** `private.txt` mit 600 ist nur ein DAC-Ausgangspunkt. Sie beweist weder Secretrotation noch LSM-/Mount-/IAM-Sicherheit.
3. **Gegenprobe 2:** Wenn das Lab als UID 0 läuft, wird die Modusdenyprobe übersprungen. Ein Erfolg als root wäre kein Nachweis, dass die Datei öffentlich lesbar ist.
4. **Gegenprobe 3:** Fehlendes `/sys/kernel/security/lsm` oder `getcap` beweist nicht, dass LSM/Capabilities „aus“ sind; Container-/Mount-/Tool-Sicht kann eingeschränkt sein.
5. Der `trap` löscht das temporäre Verzeichnis. Prüfe bei abgebrochenem Shellprozess vor dem manuellen Löschen den Pfad exakt; berühre keine anderen Verzeichnisse.

## Dependencies und Cross-References

- [KB-0031: Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md) für lokale Durchsetzungspunkte.
- [KB-0032: Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md) für Credentials und `exec` im Prozessmodell.
- [KB-0035: Dateisysteme und Persistenzpfade](05-dateisysteme-und-persistenzpfade.md) für VFS, Inodes und Pfade.
- [KB-0037: Namespaces und Isolation](07-namespaces-und-isolation.md) für User-/Mount-/PID-Sicht.
- [KB-0038: cgroups und Ressourcenbegrenzung](08-cgroups-und-ressourcenbegrenzung.md) für ergänzende Ressourcengrenzen.
- [KB-0048: Container als Betriebssystemsubstrat](18-container-als-betriebssystemsubstrat.md) verbindet diese Kontrolle später mit Images/Runtimes.
- KB-0139 und KB-0501 behandeln Enterprise-IAM und Security Architecture vertieft; sie sind keine Duplikate dieses Kernelgrundlagenkapitels.
- [KB-0720: Portfolioevidenz und Reifemodelle](../../30-architect-practice/44-portfolioevidenz-und-reifemodelle.md) nimmt negative Tests, Ausnahme- und Reifeevidenz auf.

## Quellen und Aktualitätsnotizen

| Quelle | Aussage / Verwendung | Stand |
|---|---|---|
| Dateikatalog | Verbindlicher Scope und Reihenfolge. | 2026-09-14 |
| [`credentials(7)`](https://man7.org/linux/man-pages/man7/credentials.7.html) | Prozess-UID/GID, FSUID/FSGID und Zusatzgruppen. | Linux man-pages, abgerufen 2026-09-16 |
| [`capabilities(7)`](https://man7.org/linux/man-pages/man7/capabilities.7.html) | Linux Capabilities und Privilegienmodell. | Linux man-pages, abgerufen 2026-09-16 |
| [`chmod(2)`](https://man7.org/linux/man-pages/man2/chmod.2.html) | Dateimodi, Änderungsvoraussetzungen, set-ID-/Sticky-Bit-Kontext. | Linux man-pages, abgerufen 2026-09-16 |
| [Linux Security Modules](https://docs.kernel.org/security/lsm.html) | LSM als Security-Hook-Framework. | Linux Kernel Documentation, abgerufen 2026-09-16 |
| [`landlock(7)`](https://man7.org/linux/man-pages/man7/landlock.7.html) | appnahe Sandbox- und ABI-Kontext. | Linux man-pages, abgerufen 2026-09-16 |
| [KB-0037](07-namespaces-und-isolation.md) | kanonische Namespace-/Isolationsgrundlage. | 2026-09-15 |

Kernel-, Distribution-, LSM-, Landlock-, Container-Runtime-, Filesystem-ACL-, Cloud-/IAM- und Orchestratorverhalten ist versions- und umgebungsabhängig. Jede Policy, Capability oder Privilege-Ausnahme wird auf der konkreten Zielplattform getestet, versioniert und mit ihrem Rückbau überprüft.

## Bonus: New Tech and Innovations

**Stand 2026-09-16 — Landlock bietet einen anwendungsnahen, regelbasierten Sandboxansatz über Linux-ABI-Versionen hinweg.** **Reifegrad: Adopting.** Es kann den Blast Radius eines kompromittierten oder fehlerhaften Prozesses zusätzlich verkleinern; Grenzen sind Kernel-/ABI-/Runtime-Support und die Tatsache, dass es Enterprise-IAM, Hostisolation oder LSM nicht ersetzt. Ein Pilot akzeptiert Landlock erst nach einem Allow- und Deny-Test, Upgrade-Matrix, Fallback und Daten-/Auditreview. Grundlage ist [`landlock(7)`](https://man7.org/linux/man-pages/man7/landlock.7.html).

**Stand 2026-09-16 — Workloadidentitäten werden zunehmend über kurzlebige, föderierte Credentials mit lokaler Runtime-Minimierung kombiniert.** **Reifegrad: Adopting.** Der Sicherheitsgewinn entsteht aus kleinerem Secret-Lebenszyklus und besserer Auditkorrelation; neue Abhängigkeiten sind Tokenservice, Rotation, Clock-/Network-Failures und Deployintegration. Ein Pilot misst erfolgreiche/fehlgeschlagene Rotation, Fail-Closed-Verhalten, Recovery und Cost per sicheren Workload-Run.

**Stand 2026-09-16 — Policy as Code für Runtime-, Capability-, LSM- und Containerdefaults macht Sicherheitsausnahmen test- und abbaubar.** **Reifegrad: Established bis Adopting je Plattform.** Ein Standard ist erst reif, wenn negative Tests, Ausnahme-TTL, Audit, Upgrade-Canary und Rollback den tatsächlichen Schutz- und Betriebsvertrag belegen.

