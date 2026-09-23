---
{"id": "KB-0098", "title": "Python und Nornir für NetOps", "domain": "04", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0089", "concepts": ["SoT", "Inventory"], "needed_for": "both"}, {"id": "KB-0097", "concepts": ["Idempotenz", "Rollout"], "needed_for": "understanding"}], "related": ["KB-0099", "KB-0100", "KB-0562", "KB-0720"], "applies": ["KB-0099", "KB-0100", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales Task-/Result-/Fehlermodell mit paralleler Ausführung selbst prüfen.", "rationale": "Kein Gerätezugriff nötig."}, "ARCHITECT-TARGET": {"active": true, "scope": "Inventory-Plugin, Task-Struktur, Connection-Plugin-Wahl und Fehlerbehandlung als Vertrag entwerfen.", "rationale": "Nornir ist ein Python-Framework mit expliziter Kontrolle über Parallelität und Fehler."}, "STAFF-TARGET": {"active": true, "scope": "Teilausfall bei parallelen Tasks, Connection-Timeouts und uneinheitliche Geräteantworten testen.", "rationale": "Parallele Ausführung verändert Fehlermodi gegenüber sequenziellen Skripten."}, "CHIEF-TARGET": {"active": true, "scope": "Werkzeugstandard zwischen Ansible und codebasierter Automation sowie Skillanforderungen entscheiden.", "rationale": "Codebasierte Automation verlangt andere Teamkompetenzen als deklarative Tools."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Custom Nornir-Plugins, NAPALM-Getter-Erweiterung und Netmiko-Textparsing sind Vertiefung.", "rationale": "Kern ist strukturierte, parallele und fehlertolerante Ausführung."}}, "lab_validation": [{"lab_id": "KB-0098-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales fiktives Task-/Result-Modell", "evidence": "Ein fehlgeschlagener Host blockiert nicht die übrigen parallelen Tasks.", "limitations": "Keine echten Geräte, kein Nornir-Connection-Plugin, keine Produktion."}]}
---
# Python und Nornir für NetOps

> **Ziel:** Nornir strukturiert Netzwerkautomation als Python-Code mit Inventories, parallelen Tasks und typisierten Ergebnissen. NAPALM liefert plattformübergreifende Getter/Konfiguration, Netmiko liefert direkten CLI-Zugriff. Die Wahl zwischen ihnen hängt von Abstraktionsgrad, Plattformabdeckung und benötigter Kontrolle ab.

## Zweck, Mental Model und Dependencies

Nornir ist kein CLI-Tool, sondern eine Python-Bibliothek: Inventory, Task-Funktionen und Ergebnisobjekte werden explizit programmiert statt deklariert. NAPALM abstrahiert häufige Operationen (Facts, Konfiguration, Diff) plattformübergreifend; Netmiko bleibt näher an der rohen CLI-Session für Fälle ohne NAPALM-Unterstützung. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0089](13-netbox-als-source-of-truth.md) und [KB-0097](21-ansible-fuer-netzwerkaenderungen.md).

~~~text
inventory (SoT) -> task(host) x N parallel -> connection plugin (NAPALM/Netmiko) -> AggregatedResult
                        ^ per-host exception isolated                    ^ failed hosts do not block others
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Inventory-Plugin | statisch, NetBox-Plugin, Transformationsschicht? | veraltete oder inkonsistente Quelle |
| Task-Design | reine Funktion, klare Result-Struktur, Fehlerbehandlung? | unklare Teilfehler in AggregatedResult |
| NAPALM vs. Netmiko | Abstraktion vs. Rohzugriff, Plattformabdeckung? | falsche Wahl erzwingt Workarounds |
| Parallelität | Anzahl Worker, Connection-Limits, Rate? | Geräteüberlastung oder Timeouts |
| Fehlerisolation | Exception pro Host abgefangen? | ein Host bricht gesamten Lauf ab |

Implementierung beginnt mit SoT-basiertem Inventory-Plugin, klaren Task-Funktionen mit explizitem Result, begrenzter Worker-Zahl passend zu Geräte-/Verbindungslimits, strukturierter Fehlerbehandlung pro Host, Logging/Result-Aggregation und einer klaren Trennung zwischen Read-only-Tasks (Facts/Discovery) und ändernden Tasks.

## Scalability, Reliability, Security und Observability

Skalierung hängt von Worker-Anzahl, Verbindungsart (SSH/API), Gerätekapazität für gleichzeitige Sessions und Task-Laufzeit ab. Reliability erfordert Exception-Handling pro Host, damit ein einzelner Fehler nicht den gesamten Lauf abbricht, sowie Retry-Grenzen und Timeout-Konfiguration pro Connection-Plugin. Ein AggregatedResult mit gemischtem Erfolg/Fehler muss explizit ausgewertet werden, nicht nur als „Lauf beendet“ interpretiert werden.

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| Lauf bricht komplett ab | unbehandelte Exception außerhalb Task-Isolation | Task-Funktion mit try/except pro Host prüfen |
| einzelne Hosts hängen | fehlender Timeout im Connection-Plugin | Timeout-Konfiguration und Verbindungslogs |
| NAPALM-Getter liefert leere Felder | Plattform unterstützt Getter nicht vollständig | Plattform-Support-Matrix prüfen |
| parallele Läufe überlasten Geräte | zu hohe Worker-Zahl ohne Gerätelimit | Concurrency-Limit pro Host/Plattform |
| Ergebnis wirkt „erfolgreich“, Daten falsch | fehlende Validierung des Result-Inhalts | Post-Task-Assertion gegen erwartetes Schema |

Security erfordert Credentials aus Secret-Management statt Hartkodierung, minimale Rechte pro Task-Typ (Read vs. Write getrennt), Logging aller ändernden Tasks und Schutz der Ausführungsumgebung als privilegiertes System. Observability korreliert Task-Name, Host, Dauer, Erfolg/Fehler und aggregierte Fehlerquote über Läufe hinweg.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet Fehlerisolation, Timeout-Verhalten, Concurrency-Grenzen und Result-Validierung vor Rollout. **Principal** definiert Task-/Inventory-/Plugin-Standards und wann NAPALM statt Netmiko genutzt wird. **Chief** entscheidet zwischen deklarativer (Ansible) und codebasierter (Nornir) Automation als Organisationsstandard und die damit verbundene Skillanforderung.

- [ ] Inventory aus SoT, Worker-Zahl an Gerätekapazität angepasst.
- [ ] Exception-Handling pro Host und Timeout pro Connection-Plugin getestet.
- [ ] Read- und Write-Tasks mit getrennten Rechten und Logging versehen.
- [ ] Result-Inhalt validiert, nicht nur Task-Abschluss geprüft.

## Interviewfragen

### 1. Warum Nornir statt reinem Skript mit Netmiko-Schleife?

**Antwort:** Nornir strukturiert Inventory, Parallelität, Fehlerisolation pro Host und Ergebnisaggregation explizit, statt das in eigenem Code neu zu bauen.

### 2. Wann NAPALM statt Netmiko?

**Antwort:** Wenn eine plattformübergreifende, standardisierte Operation (Facts, Config-Diff) für die Zielplattform unterstützt wird; sonst bleibt Netmiko für rohen CLI-Zugriff nötig.

### 3. Was passiert, wenn ein Host in einem parallelen Lauf fehlschlägt?

**Antwort:** Bei korrektem Task-Design wird die Exception pro Host isoliert; die übrigen Hosts laufen weiter und der Fehler erscheint im AggregatedResult dieses Hosts.

### 4. Wie begrenzt du Last auf Zielgeräten?

**Antwort:** Über eine an Gerätekapazität angepasste Worker-Zahl und Timeouts im Connection-Plugin, nicht über unbegrenzte Parallelität.

### 5. Warum reicht „Task erfolgreich“ nicht als Ergebnisprüfung?

**Antwort:** Der Task kann ohne Exception laufen und trotzdem unvollständige oder falsche Daten liefern; der Result-Inhalt muss gegen ein erwartetes Schema geprüft werden.

### 6. Wie trennst du Lese- und Änderungsrechte in der Automation?

**Antwort:** Über unterschiedliche Credentials/Rollen für read-only Facts-Tasks und für konfigurationsändernde Tasks, mit separatem Logging für Änderungen.

## Praktische Labs

~~~python
def task(host):
    if host == "bad-host":
        return {"host": host, "failed": True, "error": "timeout"}
    return {"host": host, "failed": False}

results = [task(h) for h in ["r1", "bad-host", "r2"]]
ok = [r for r in results if not r["failed"]]
assert len(ok) == 2
print("A failing host is isolated; the remaining hosts still complete.")
~~~

## Dependencies, Cross-References und Quellen

1. [Nornir Documentation](https://nornir.readthedocs.io/), abgerufen 2026-09-17.
2. [NAPALM Documentation](https://napalm.readthedocs.io/), abgerufen 2026-09-17.
3. [Netmiko Documentation](https://github.com/ktbyers/netmiko), abgerufen 2026-09-17.

Zeitabhängige Plattform-Support-Matrizen und Bibliotheksversionen vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Nornir-Plugins für NetBox-Inventory | established | Sync-Richtung, Feldabdeckung und Aktualität prüfen. |
| Strukturierte Getter statt Textparsing (NAPALM/gNMI) | adopting | Plattformabdeckung gegen Netmiko-Fallback abwägen. |
| Typisierte Result-Validierung (Pydantic u.ä.) | adopting | Schema-Konsistenz und Fehlerklassifikation nachweisen. |

Ein Pilot akzeptiert eine Nornir-basierte NetOps-Automation erst, wenn Inventory-Qualität, Fehlerisolation, Concurrency-Grenzen, Rechte-Trennung und Result-Validierung nachgewiesen sind.
