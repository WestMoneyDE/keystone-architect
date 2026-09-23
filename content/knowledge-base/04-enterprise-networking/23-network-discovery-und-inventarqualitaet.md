---
{"id": "KB-0099", "title": "Network Discovery und Inventarqualität", "domain": "04", "sequence": 23, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "CLOUD", "PLATFORM", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0093", "concepts": ["SNMP", "Polling"], "needed_for": "both"}, {"id": "KB-0089", "concepts": ["SoT", "Datenqualität"], "needed_for": "both"}], "related": ["KB-0098", "KB-0100", "KB-0562", "KB-0720"], "applies": ["KB-0098", "KB-0100", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Lokales Modell für aktive/passive Discovery-Konflikte selbst prüfen.", "rationale": "Kein Netzwerkzugriff nötig."}, "ARCHITECT-TARGET": {"active": true, "scope": "Discovery-Quellen, Konfliktauflösung, Datenalter und SoT-Rückschreibung als Datenpipeline entwerfen.", "rationale": "Inventar ist eine Datenqualitätsfrage, kein einmaliger Scan."}, "STAFF-TARGET": {"active": true, "scope": "Mehrdeutige Geräteidentität, Credential-Fehlschläge und veraltete Einträge diagnostizieren.", "rationale": "Fehlerhafte Discovery-Daten verbreiten sich in nachgelagerte Automation."}, "CHIEF-TARGET": {"active": true, "scope": "Datenqualitätsstandard, Aktualisierungsfrequenz und Verantwortlichkeit für Inventarwahrheit festlegen.", "rationale": "Ein unzuverlässiges Inventar untergräbt jede darauf aufbauende Automation."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "L2/L3-Topologieableitung, CDP/LLDP-Korrelation und Fingerprinting sind Vertiefung.", "rationale": "Kern ist eine vertrauenswürdige, aktuelle Geräteliste."}}, "lab_validation": [{"lab_id": "KB-0099-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales fiktives Discovery-Quellenmodell", "evidence": "Ein Gerät mit widersprüchlichen Quellenangaben wird als Konflikt markiert statt automatisch überschrieben.", "limitations": "Kein reales Netzwerk, keine Scan-Tools, keine Produktion."}]}
---
# Network Discovery und Inventarqualität

> **Ziel:** Network Discovery kombiniert aktive Scans und passive Signale (CDP/LLDP, ARP, SNMP, Routing-Tabellen), um Geräte und Topologie zu finden. Ein Inventar wird erst zuverlässig, wenn Mehrdeutigkeiten, Credential-Grenzen und Datenalter explizit behandelt statt ignoriert werden.

## Zweck, Mental Model und Dependencies

Aktive Discovery fragt gezielt (Ping-Sweep, SNMP, API); passive Discovery beobachtet vorhandenen Verkehr oder Nachbarschaftsprotokolle. Beide liefern unvollständige, teils widersprüchliche Sichten; ein belastbares Inventar entsteht erst durch Konfliktauflösung, Quellenpriorität und Altersbewertung. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md), [KB-0093](17-snmp-und-geraeteueberwachung.md) und [KB-0089](13-netbox-als-source-of-truth.md).

~~~text
active scan + passive signals (CDP/LLDP/ARP/routes) -> raw candidates -> identity resolution -> conflict check -> SoT
                                                              ^ same device, different IDs?         ^ stale vs. fresh?
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Identitätsauflösung | eindeutige Geräte-ID über mehrere Quellen? | ein Gerät als zwei Einträge oder umgekehrt |
| Quellenpriorität | welche Quelle gewinnt bei Widerspruch? | stille Überschreibung korrekter Daten |
| Datenalter | letzter erfolgreicher Check pro Feld? | veralteter Eintrag als aktuell behandelt |
| Credential-Grenzen | welche Geräte wurden nicht erreicht? | Lücken werden als „nicht vorhanden“ fehlinterpretiert |
| Rückschreibung in SoT | automatisch oder mit Review? | fehlerhafte Discovery korrumpiert SoT direkt |

Implementierung beginnt mit definierten Discovery-Quellen und ihrer Vertrauensreihenfolge, einer stabilen Geräteidentität (z. B. Chassis-ID statt nur IP), explizitem Timestamp pro Feld, sichtbarer Markierung nicht erreichter Geräte statt stiller Löschung und einem Review-Schritt vor automatischer SoT-Aktualisierung bei Konflikten.

## Scalability, Reliability, Security und Observability

Skalierung hängt von Scan-Reichweite, Polling-Intervall, Anzahl Quellen und Verarbeitungsaufwand der Konfliktauflösung ab. Reliability erfordert, dass ein fehlgeschlagener Scan-Lauf nicht als „Gerät entfernt“ interpretiert wird, sondern als fehlender Datenpunkt markiert bleibt, bis mehrere aufeinanderfolgende Läufe dies bestätigen.

| Symptom | Ursache | Gegenprobe |
|---|---|---|
| Gerät verschwindet aus Inventar | einzelner fehlgeschlagener Scan als Löschung interpretiert | mehrere aufeinanderfolgende Läufe vor Löschung fordern |
| Ein Gerät erscheint doppelt | inkonsistente Identität zwischen Quellen | Identitätsschlüssel (Chassis-ID/Serial) vereinheitlichen |
| SoT enthält veraltete Werte | fehlendes Datenalter pro Feld | Timestamp-Feld und Staleness-Schwelle prüfen |
| Discovery liefert falsche Nachbarschaft | CDP/LLDP auf einigen Ports deaktiviert | Quellenabdeckung pro Segment prüfen |
| automatischer Sync überschreibt korrekte SoT-Daten | fehlender Review bei Widerspruch | Konfliktfälle in Review-Queue statt Auto-Merge |

Security erfordert minimale Scan-Rechte, Rate-Begrenzung um Zielsysteme nicht zu überlasten, Schutz gescannter Credentials und Klassifikation, welche entdeckten Geräte sensible Netzwerkbereiche betreffen. Observability korreliert Scan-Abdeckung, Erfolgsquote pro Quelle, Konfliktanzahl und Alter der ältesten unbestätigten Einträge.

## Trade-offs, Entscheidungen und Checklist

**Staff** testet Identitätsauflösung, Umgang mit fehlgeschlagenen Scans und Konfliktfälle vor Produktivsetzung. **Principal** definiert Quellenpriorität, Staleness-Schwellen und Review-Prozess für Konflikte. **Chief** entscheidet Datenqualitätsstandard, Aktualisierungsfrequenz und Verantwortlichkeit für die Inventarwahrheit.

- [ ] Discovery-Quellen, Priorität und Identitätsschlüssel definiert.
- [ ] Fehlgeschlagene Scans als fehlende Daten markiert, nicht als Löschung interpretiert.
- [ ] Konflikte landen in Review-Queue statt automatischem Overwrite.
- [ ] Staleness-Schwellen und Abdeckungsmetriken überwacht.

## Interviewfragen

### 1. Warum reicht ein einmaliger Netzwerkscan nicht als Inventar?

**Antwort:** Geräte ändern sich, Scans schlagen teilweise fehl, und ohne Datenalter und Wiederholung lässt sich Aktualität nicht bewerten.

### 2. Wie behandelst du ein Gerät, das in einem Scan-Lauf nicht antwortet?

**Antwort:** Als fehlenden Datenpunkt mit Timestamp markieren, nicht als entferntes Gerät, bis mehrere Läufe dies bestätigen.

### 3. Was ist der Unterschied zwischen aktiver und passiver Discovery?

**Antwort:** Aktive Discovery fragt gezielt Geräte ab; passive Discovery wertet beobachtete Signale wie CDP/LLDP oder ARP aus, ohne selbst Anfragen auszulösen.

### 4. Wie löst du widersprüchliche Angaben zwischen zwei Quellen?

**Antwort:** Über eine definierte Quellenpriorität plus Review-Schritt bei echten Konflikten, statt automatisch die zuletzt gesehene Quelle zu übernehmen.

### 5. Warum ist ein stabiler Identitätsschlüssel wichtig?

**Antwort:** Ohne stabilen Schlüssel wie Chassis-ID/Serial kann dasselbe Gerät bei IP-Wechsel als neues Gerät erscheinen und Duplikate erzeugen.

### 6. Wie verhinderst du, dass fehlerhafte Discovery-Daten die SoT korrumpieren?

**Antwort:** Über Review-Queues für Konfliktfälle statt automatischem Merge, sowie Nachvollziehbarkeit, welche Quelle welchen Wert zuletzt bestätigt hat.

## Praktische Labs

~~~python
sources = [{"src": "cdp", "id": "sw1", "seen": 1}, {"src": "arp", "id": "sw1-old", "seen": 3}]
conflict = len({s["id"] for s in sources}) > 1
assert conflict
print("Conflicting identities are flagged for review, not silently merged.")
~~~

## Dependencies, Cross-References und Quellen

1. [IEEE 802.1AB (LLDP)](https://standards.ieee.org/ieee/802.1AB/6455/), abgerufen 2026-09-17.
2. [RFC 1157: SNMP](https://datatracker.ietf.org/doc/html/rfc1157), abgerufen 2026-09-17.

Zeitabhängige Scan-Tool-Fähigkeiten und Netzwerkgrößen vor Einsatz aktuell prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Kontinuierliche Streaming-Discovery statt periodischer Scans | adopting | Datenaktualität gegen Last und Kosten abwägen. |
| Automatisierte Identitätsauflösung über mehrere Quellen | adopting | Fehlerquote und Review-Aufwand vor Automatisierung messen. |
| ML-gestützte Anomalieerkennung im Inventarwandel | emerging | Falsch-Positiv-Rate und Erklärbarkeit vor Einsatz prüfen. |

Ein Pilot akzeptiert eine Discovery-Pipeline erst, wenn Identitätsauflösung, Quellenpriorität, Staleness-Handling, Konflikt-Review und Abdeckungsmetriken nachgewiesen sind.
