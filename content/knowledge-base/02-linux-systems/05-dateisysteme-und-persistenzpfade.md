---
{"id": "KB-0035", "title": "Dateisysteme und Persistenzpfade", "domain": "02", "sequence": 5, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["PLATFORM", "CLOUD", "GENAI", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0031", "concepts": ["System Calls", "Kernel/User-Space", "File Descriptors"], "needed_for": "understanding"}, {"id": "KB-0032", "concepts": ["Prozesslebenszyklus", "FD-Inheritance", "Shutdown"], "needed_for": "understanding"}], "related": ["KB-0034", "KB-0036", "KB-0038", "KB-0040", "KB-0410", "KB-0565", "KB-0580", "KB-0720"], "applies": ["KB-0410", "KB-0565", "KB-0580", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein isoliertes lokales Lab schreibt Testdateien atomar, simuliert Abbruchpunkte und beobachtet Mount-/FD-Informationen ohne Systemänderung.", "rationale": "Crash-Konsistenz wird als überprüfbarer Vertrag gelernt."}, "ARCHITECT-TARGET": {"active": true, "scope": "Jeder Persistenzpfad beschreibt Datenowner, Dauerhaftigkeitsgrenze, fsync-/Commitverhalten, Recovery und Container-/Volumegrenze.", "rationale": "Lokale Dateischreibvorgänge sind erst mit Failurevertrag produktionsreif."}, "STAFF-TARGET": {"active": true, "scope": "Teams verwenden sichere Write-Replace-, Locking-, Cleanup-, Tempfile- und Volume-Patterns sowie Failuretests.", "rationale": "Das reduziert Datenverlust und schwer diagnostizierbare Containerzustände."}, "CHIEF-TARGET": {"active": true, "scope": "Plattformstandards regeln Stateful Workloads, Backup/Restore, Encryption, Retention, Storageklassen und Datenresidenz.", "rationale": "Chief-Ebene verantwortet Risiko und Betriebsmodell über einzelne Dateisysteme hinaus."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "VFS-Interna, Filesystementwicklung, Journalreplay, RAID, Blocklayer, NFS-/Ceph-Details und Storage-Forensik sind Spezialistenfelder.", "rationale": "Die Zielrollen erkennen ihre Auswirkungen und binden Spezialisten ein."}}, "lab_validation": [{"lab_id": "KB-0035-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Geplantes lokales Sandboxlab mit eigenen Testdateien", "evidence": "Ablauf, negative Proben und Cleanup sind dokumentiert.", "limitations": "Keine Mount-, Journal-, Overlay-, Kernel-, Container-Runtime-, Cloud- oder Produktionskonfiguration wurde ausgeführt oder behauptet."}]}
---
# Dateisysteme und Persistenzpfade

> **Ziel:** Entwirf einen Dateipfad so, dass klar ist, wann Daten nur im Prozesspuffer, im Kernelcache, in einem Volume oder nach einem Crash tatsächlich sichtbar und wiederherstellbar sind. Ein erfolgreicher `write()` ist kein allgemeiner Haltbarkeitsnachweis.

## Purpose, Definition und Scope

Linux-VFS ist die Kernelabstraktion, über die Prozesse mit `open`, `stat`, `read`, `write`, `rename` und verwandten System Calls unterschiedliche Dateisysteme nutzen. Pfadnamen werden über Dentries auf Inodes aufgelöst; ein File Descriptor bezeichnet eine geöffnete Dateiinstanz. Mounts verbinden einen Pfad mit einem Dateisystem. Ein Journal kann Dateisystemmetadaten nach Crash konsistent halten, ersetzt aber keine Anwendungs- oder Datenbanktransaktion.

Scope: Inodes, VFS, Journaling, Mounts, `fsync`, File Descriptors, Crash-Konsistenz, OverlayFS und Containeranwendung. Nicht Scope: ein vollständiger Storage- oder Datenbankbetrieb.

## Kompetenzstatus: Fakt, Konzept und Lernziel

| Ebene | Aussage |
|---|---|
| CURRENT-EVIDENCE | offen — eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| Konzeptwissen | Pfad, inode, FD, Cache, Journal, `fsync`, Rename, Volume und Crashgrenze können unterschieden werden. |
| HANDS-ON-TARGET | Isolierte Testdateien zeigen atomaren Replace und Cleanup. |
| ARCHITECT-TARGET | Jeder stateful Pfad hat Owner, Dauerhaftigkeits-/Recoveryvertrag und Volumegrenze. |
| STAFF-TARGET | Teams testen Abbruch, Berechtigung, Disk-full, Wiederanlauf und Cleanup. |
| CHIEF-TARGET | Storage-Policy verbindet Verfügbarkeit, Compliance, Kosten und Restorefähigkeit. |

## Mental Model: Der Persistenzpfad ist eine Kette

```text
application buffer -> write syscall -> kernel page cache
  -> filesystem metadata/data -> device/cache -> durable medium
  -> crash recovery / journal replay -> mounted volume -> next process
```

Die zentrale Frage lautet: **Welche Wirkung muss nach welchem Fehler überleben?** Ein Logeintrag darf eventuell verloren gehen; ein Commitmarker, Uploadabschluss oder Zahlungsnachweis nicht. Die Antwort bestimmt Durability, Atomicity, Recovery, Backups und Kosten.

## Prerequisites und Dependencies

| Abhängigkeit | Anwendung |
|---|---|
| [KB-0031 Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md) | FD, `open`/`write`/`close`, Kernelgrenze. |
| [KB-0032 Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md) | FD-Inheritance, Exit und Shutdown. |
| KB-0034 Virtueller Speicher und Paging | Page Cache, Mapping und Writeback. |
| KB-0036 Namespaces und cgroups | Mount Namespaces und Containergrenzen. |
| KB-0410 Durable Workflows | Lokale Dateioperationen versus verteilte Wirkung. |

## Core Concepts

### VFS, inode, dentry und File Descriptor

Ein **Pfad** ist eine Namensauflösung, kein stabiler Datenidentifikator. Ein **inode** repräsentiert Dateimetadaten und Verweise auf Inhalt. Eine **dentry** beschleunigt die Namensauflösung im dcache. Ein **FD** ist eine prozesslokale Referenz auf eine geöffnete Datei; nach `fork()` können FDs auf dieselbe Open-File-Description verweisen. Deshalb muss ein Service explizit schließen, was Childprozesse nicht erben oder nach `exec` nicht behalten dürfen.

### Schreiben, Cache und `fsync`

`write()` übergibt Daten an den Kernel; er kann sie im Page Cache halten. `fsync(fd)` synchronisiert laut Linux-man-page Daten und Metadaten einer Datei mit dem Storage Device, bedeutet aber nicht automatisch, dass auch die Änderung des Verzeichnisnamens persistent ist. Für eine sicher sichtbare neue Datei kann deshalb der Verzeichnis-FD ebenfalls relevant sein. Konkrete Semantik hängt von Dateisystem, Mountoptionen, Device und Plattform ab und wird im Ziel getestet.

Ein korrekter Pfad benennt exakt: „nach erfolgreichem `fsync` der Datei und des Verzeichnisses“, „nach Datenbankcommit“, „nach Object-Storage-etag“ oder „best effort Log“. Wörter wie „gespeichert“ reichen nicht.

### Journaling ist keine Datentransaktion

ext4-Journaling schützt vor allem Metadateninkonsistenz. Die Kernel-Dokumentation weist darauf hin, dass ext4 standardmäßig Metadaten journaled und Dateiblöcke nach Crash nicht automatisch in einem konsistenten Zustand garantiert sind; `data=journal` ist sicherer, aber langsamer. Ein Journal kann also Dateisystemreparatur begrenzen, beweist aber weder atomare Multi-Datei-Anwendungswirkung noch eine Nachricht an ein externes System.

### Atomic Replace und Crash Recovery

Ein solides Muster für ersetzbare lokale Dateien:

```text
create temporary file in target directory
-> write complete content
-> fsync temporary file
-> validate checksum/format
-> rename temporary name to target name
-> fsync target directory when the durability contract requires it
-> publish durable application state
```

Warum gleiche Directory? `rename` ist im selben Dateisystem typischerweise eine atomare Namensoperation, aber Cross-device-Moves können in Kopie/Löschen zerfallen. Ein Fehler nach Rename und vor Verzeichnis-Fsync muss als möglicher Recoveryfall modelliert werden. Tempnamen, Checksums, Versionen und Startup-Reconciliation machen den Zustand prüfbar.

### Mounts, Volumes und Container

Ein Containerimage ist kein Persistenzvertrag. Eine beschreibbare Containerlayer kann beim Ersatz eines Containers verschwinden. Stateful Daten gehören in eine bewusst gewählte Volume-, Datenbank- oder Object-Storage-Grenze mit Owner, Backup/Restore und Retention. Mount Namespace und OverlayFS verändern, welchen Pfad ein Prozess sieht; ein Pfad auf dem Host, im Image und im Container kann völlig verschiedene Lifecycle-/Securityeigenschaften besitzen.

OverlayFS kombiniert lower und upper. Bei erster Änderung eines lower-Objekts kann Copy-up stattfinden. Die aktuelle Kernel-Dokumentation betont, dass ohne explizites `fsync` keine generelle Garantie für beobachtete Daten nach Crash besteht; Copy-up und `fsync`-Verhalten sind konfigurationsabhängig. Containerdetails daher nie aus einem einzelnen Hosttest übernehmen.

## Architecture und Data Flow: Durable Artifact Pipeline

```text
request -> validate -> temporary local artifact
        -> checksum + fsync -> atomic rename
        -> directory durability as contract requires
        -> durable metadata/outbox
        -> upload / publish
        -> acknowledgement after confirmed contract
```

Für GenAI kann ein Artefakt Prompt-Protokoll, Evaluationresultat, Modelloutput, Indexsegment oder Export sein. Bevorzugt werden Object Storage oder Datenbank für shared durable state; lokale Disk ist Cache, Staging oder klar replizierter Node-State. Der Pfad enthält Classification, encryption, retention, tenant boundary und Delete-/Recoverypolicy.

## Protokolle, Standards und Tools

| Gegenstand | Anwendung | Grenze |
|---|---|---|
| VFS | einheitliche Kerneldateisystemschnittstelle | unterschiedliche Backends behalten eigene Semantik |
| `fsync`/`fdatasync` | explizite Dateidauerhaftigkeit | Zieldateisystem/Device prüfen |
| `rename` | atomarer Replace innerhalb einer geeigneten Grenze | nicht als verteilte Transaktion behandeln |
| ext4 Journal | Crash-Recovery für journaled Änderungen | schützt nicht automatisch File Data oder Business Invariant |
| OverlayFS | Image-/Layerunion | Copy-up und Durability sind spezielle Semantik |
| `stat`, `/proc`, mount information | Diagnose von FD/Pfad/Mount | Momentaufnahme, Zugriffsrechte beachten |

## Konfiguration und Implementierung

### Persistenzvertrag

```yaml
artifact: evaluation-result
owner: ml-platform
location: object-storage-primary
local_disk_role: bounded_staging_only
durability_point: provider_confirmed_put_plus_metadata_commit
recovery: scan_staging_and_reconcile_on_start
integrity: content_hash_and_version
security: tenant_prefix_encryption_retention
failure: disk_full_or_fsync_error_is_not_success
```

Ein Dateifehler darf nie als Erfolg fortgesetzt werden. `ENOSPC`, Berechtigungsfehler, `fsync`-Fehler, beschädigter Tempinhalt, fehlender Mount und unerwartetes Device sind fachlich klassifizierte Outcomes.

## Scalability und Performance

Durchsatz hängt an Bytes, IOPS, Latenz, Metadatenoperationen, Page Cache, Filecount, Locking, Deviceklasse und Writeback. Kleine synchrone Writes können Konsistenz erhöhen und P99 verschlechtern; ungebufferte Großdaten können Cache verdrängen. Batching ist nur dann korrekt, wenn eine ganze Batch dieselbe Failure-/Durabilitysemantik hat.

| Symptom | Hypothese | Nachweis |
|---|---|---|
| hohe Write-Latenz | `fsync`, Device, queueing, writeback | Trace, Storagemetriken, Mount/Workload |
| Disk voll | unbounded staging/log/cache | bytes per path, retention, cleanup |
| verlorene Datei nach Restart | falsche Containerlayer oder fehlendes Volume | Mount-/deployment- und lifecycle review |
| inkonsistenter Export | temp/rename/fsync/recovery lückenhaft | Crashpoint-Falltest |
| zu viele FDs | fehlendes close, Leak, fan-out | FD count, owner, lifecycle |

## Reliability und Failure Modes

- **Disk full:** Schreib- und `fsync`-Fehler sind sichtbar und lösen Load Shedding/Cleanup, nicht stillen Datenverlust aus.
- **Partial write/Crash:** Tempfile, Checksum, Version und Reconciliation verhindern, dass halbe Artefakte als gültig gelten.
- **FD leak:** jeder offene Stream besitzt Owner, Deadline und Close im `finally`/defer-Pfad.
- **Stale mount:** Startup prüft erwartete Storageklasse, Schreibbarkeit, Capacity und Identity; keine Blindwrites in den Image-Layer.
- **Overlay surprise:** lower/upper/copy-up nicht als normale Hostdisk behandeln.
- **External publish split brain:** Datei lokal geschrieben, Nachricht fehlt oder umgekehrt. Nutze Outbox, idempotency key und Reconciliation.

## Security, Governance und Compliance

Dateipfade sind Angriffspfade: Path traversal, Symbolic-Link-Verwechslung, falsche Ownership, world-readable Tempfiles, unverschlüsselte Stagingdaten, ungebremste Uploads und fehlende Retention. Nutze sichere Pfadnormalisierung, minimale Rechte, tenantisolierte Prefixe, keine Secrets in Dateinamen, kontrollierte Tempverzeichnisse und Logredaction. Backups, Restoretests, Aufbewahrung, Löschung, Datenresidenz und Schlüsselownership gehören zum Produktvertrag.

## Observability und Troubleshooting

Miss und korreliere `bytes_written`, `fsync_latency`, write errors, disk free/inodes, FD count, staging age/bytes, mount identity, upload outcome, checksum mismatch, recovery actions und durable metadata state. Verbinde jedes Artefakt mit Revision, Tenantklasse und idempotency key in Traces/Logs, nicht als unbounded Metriklabel.

Runbook: Pfad/Owner prüfen → Mount und verfügbare Kapazität prüfen → Fehlerklasse und `fsync`-/rename-Resultat prüfen → Temp-/Target-/Metadatazustand vergleichen → Recovery nur idempotent ausführen → Ursache per Canary korrigieren.

## Cost und FinOps

Storagekosten sind Kapazität, IOPS, Requests, Egress, Backup, Replikation und Aufbewahrung. Lokaler Cache kann Remote-I/O sparen, braucht aber Byte-/TTL-/Evictionbudget. Persistiere nicht jede Debug-/Promptnutzlast dauerhaft; setze Sampling, Redaction und Retention nach Nutzen und Compliance. Schnellere Storageklasse wird nur nach gemessener P99-/Recoveryanforderung gewählt.

## Trade-offs und Anti-Patterns

- „`write` erfolgreich“ als Durabilitynachweis.
- Journal als Ersatz für Anwendungs-/Datenbanktransaktion.
- Daten in beschreibbarer Containerlayer als dauerhaft behandeln.
- Cross-device `rename` als atomar annehmen.
- Tempdateien ohne Cleanup/Quota.
- `fsync` überall ohne SLO-/Kostenmodell oder nirgends ohne Failurevertrag.
- Shared Filesystem als Lösung für verteilte Konsistenz.
- Backup haben, aber Restore nicht testen.

## Staff-, Principal- und Chief-Level Decisions

**Staff** standardisiert Write-Replace, Tempfile, FD-Close, Error Classification und Recoverytests.  
**Principal** trennt lokales Staging, durable shared state und Caches; verbindet Object Storage, DB, Volumes und Workflow-Outbox.  
**Chief** setzt Plattformpolicy für stateful workloads, Backup/Restore, Encryption, retention, Storageklassen und Datenresidenz; es fordert Test- und Ownernachweis vor Ausnahmen.

## Production Checklist

- [ ] Datenowner, Standort, Durability Point und Recovery sind explizit.
- [ ] Tempfile/rename/fsync/cleanup und Fehlerpfade sind für lokale Artefakte getestet.
- [ ] Containerlayer und persistentes Volume/Object Store sind nicht verwechselt.
- [ ] FD-, Disk-, Inode-, staging- und fsync-Metriken existieren.
- [ ] Disk-full, permission denied, restart und partial publish haben klare Outcomes.
- [ ] Backups, Restore, Retention, Encryption und Deleteprozess sind nachweisbar.
- [ ] Kein lokaler Lock wird als verteilte Konsistenz ausgegeben.

## Interviewfragen mit Modellantworten

### Warum reicht ein erfolgreicher `write()` nicht?
Weil Daten noch in Anwendungs-/Kernelpuffern oder Devicecaches liegen können. Der erforderliche Durability Point wird pro Datenklasse definiert; er kann `fsync`, DB Commit oder Object-Store-Bestätigung sein.

### Was schützt ein Journal?
Es unterstützt Filesystemrecovery und Metadatenkonsistenz nach Crash. Es ersetzt nicht die fachliche Transaktion über mehrere Dateien, Datenbanken oder Nachrichten.

### Warum braucht ein atomarer Replace eine Tempdatei?
Sie verhindert, dass Leser ein halbfertiges Ziel sehen. Vollständiges Schreiben, Validieren, Synchronisieren und Rename machen einen expliziten Zustandsübergang; Recovery behandelt verbleibende Tempdateien.

### Was ist bei OverlayFS besonders?
Upper/lower und Copy-up verändern Herkunft und Durability von Objekten. Containerpfade dürfen nicht mit persistenten Volumes gleichgesetzt werden.

### Wie erkennst du einen FD Leak?
FD-Anzahl und Altersverteilung wachsen; Streams/Clients fehlen Close-Ownership oder Error-/Cancellationpfade. Ich korreliere FDcount mit Requestklasse und Dumps.

### Wann ist lokale Disk passend?
Für klar begrenztes Cache, Staging oder nodegebundenen State mit Recoveryvertrag. Für shared durable fachliche Wahrheit bevorzuge ich eine dafür vorgesehene Datenbank oder Object Storage.

## Praktisches Lab: Atomarer Testartefaktpfad

> **Status:** `reviewed_only`; nicht ausgeführt, keine Systemkonfiguration verändert.

1. Erzeuge in einem eigenen temporären Testordner eine Datei mit Version und Checksumme.
2. Schreibe eine neue Version zuerst als Tempdatei im selben Verzeichnis, validiere sie und benenne sie um.
3. Simuliere Abbruch vor und nach jedem Übergang durch kontrolliertes Beenden des Testprogramms; starte einen Reconciler, der nur valide Zielversionen akzeptiert.
4. Negative Probe: schreibe direkt in die Zieldatei und dokumentiere, warum ein Abbruch einen unklaren Zustand erzeugen kann.
5. Zähle geöffnete Testressourcen, lösche Tempdateien und entferne den gesamten Testordner.

## Dependencies und Cross-References

- [KB-0031 – Linux Kernel und Systemaufrufe](01-linux-kernel-und-systemaufrufe.md)
- [KB-0032 – Prozesse und Lebenszyklen](02-prozesse-und-lebenszyklen.md)
- KB-0034 – Virtueller Speicher und Paging
- KB-0036 – Namespaces und cgroups
- KB-0040 – Linux Service Management und Operations
- KB-0410 – Durable Workflows
- KB-0565 – Cloud Architecture und Landing Zones
- KB-0580 – AI Infrastructure, GPU und Inference
- KB-0720 – Portfolioevidenz und Reifemodelle

## Quellen und Aktualitätsnotizen

| Quelle | Verwendung | Stand |
|---|---|---|
| Dateikatalog 720 | Scope. | Planstand 2026-09-14 |
| [Linux VFS](https://www.kernel.org/doc/html/latest/filesystems/vfs.html) | VFS, Dentry und Kerneldateisystemgrenze. | Abgerufen 2026-09-15 |
| [fsync(2)](https://man7.org/linux/man-pages/man2/fsync.2.html) | Dateidaten-/metadatensynchronisation. | Linux man-pages 6.19, abgerufen 2026-09-15 |
| [ext4 Journal](https://docs.kernel.org/filesystems/ext4/journal.html) | Metadata Journal und Crashgrenzen. | Abgerufen 2026-09-15 |
| [OverlayFS](https://docs.kernel.org/filesystems/overlayfs.html) | upper/lower, Copy-up, `fsync`-Semantik. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Containerisierte Persistenz wird stärker um deklarierte Volumes, Object Storage und Recoveryautomation statt Image-Layer aufgebaut.** **Reifegrad: Established.** Ein Pilot beweist Restore und Containerersatz, nicht nur erfolgreichen Write.

**Stand 2026-09-15 — OverlayFS entwickelt sich weiter, bleibt aber für Durability- und Complianceaussagen implementationsabhängig.** Die aktuelle Kernel-Dokumentation nennt seit v6.13 file-descriptor-basierte Layerangabe und unterschiedliche `fsync`-Modi. **Reifegrad: specialist optional.** Plattformteams prüfen Kernel-/Runtimeunterstützung vor Nutzung.

**Stand 2026-09-15 — AI-Artefakte verlangen häufig immutable, versionierte und kostengesteuerte Persistenz.** **Reifegrad: Adopting.** Ein Pilot trennt volatile Trace-/Cache-/Stagingdaten von reproduzierbaren Evaluation- und Modellartefakten.

