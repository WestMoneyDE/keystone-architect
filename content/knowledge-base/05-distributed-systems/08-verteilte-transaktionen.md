---
{"id": "KB-0108", "title": "Verteilte Transaktionen", "domain": "05", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0046", "concepts": ["Hypothese", "Gegenprobe"], "needed_for": "both"}, {"id": "KB-0104", "concepts": ["Konsens", "Quorum"], "needed_for": "understanding"}, {"id": "KB-0107", "concepts": ["Sharding"], "needed_for": "understanding"}], "related": ["KB-0109", "KB-0562", "KB-0720"], "applies": ["KB-0109", "KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Zwei-Phasen-Commit lokal simulieren und einen blockierenden Koordinatorausfall erzeugen.", "rationale": "Kein verteiltes System nötig, um das Blockierungsproblem zu zeigen."}, "ARCHITECT-TARGET": {"active": true, "scope": "Für einen Cross-Service-Datenfluss begründen, ob 2PC, Sagas oder lokale Transaktion mit Umstrukturierung passend ist.", "rationale": "2PC ist selten die richtige Standardwahl in modernen verteilten Systemen."}, "STAFF-TARGET": {"active": true, "scope": "Einen blockierten Teilnehmer nach Koordinatorausfall im Prepare-Zustand diagnostizieren.", "rationale": "Das ist die zentrale, bekannte Schwäche von 2PC."}, "CHIEF-TARGET": {"active": true, "scope": "2PC als Ausnahme statt Standard für Cross-Service-Konsistenz positionieren und Alternativen (Sagas) verlangen.", "rationale": "2PC-Blockierungsrisiko skaliert schlecht über viele Services/Teams."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Drei-Phasen-Commit, XA-Standard und Recovery-Protokolle sind Vertiefung.", "rationale": "Kern ist das Verständnis, warum 2PC blockiert und wann Alternativen vorzuziehen sind."}}, "lab_validation": [{"lab_id": "KB-0108-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Zwei-Phasen-Commit", "evidence": "Ein Teilnehmer, der nach dem Prepare-Vote auf den Koordinator wartet, bleibt bei simuliertem Koordinatorausfall blockiert, statt selbst zu entscheiden.", "limitations": "Kein reales XA/2PC-System, keine Produktion."}]}
---
# Verteilte Transaktionen

> **Ziel:** Zwei-Phasen-Commit (2PC) koordiniert Atomizität über mehrere unabhängige Teilnehmer (Datenbanken, Services): entweder committen alle oder keiner. Der Preis ist eine Blockierungsphase, in der Teilnehmer auf den Koordinator warten müssen — bei Koordinatorausfall bleiben sie in Unsicherheit gefangen.

## Zweck, Mental Model und Dependencies

Eine lokale Transaktion garantiert Atomizität innerhalb eines Systems über ACID. Sobald mehrere unabhängige Systeme atomar zusammenwirken sollen, reicht das nicht mehr — 2PC führt einen Koordinator ein, der in Phase 1 (Prepare) alle Teilnehmer fragt „kannst du committen?“ und in Phase 2 (Commit/Abort) das gemeinsame Ergebnis durchsetzt. Das Problem: nach einem „Ja“ in Phase 1 muss ein Teilnehmer seine Ressourcen sperren und auf die Entscheidung des Koordinators warten — fällt der Koordinator aus, weiß der Teilnehmer nicht, ob er committen oder abbrechen soll. Lies [KB-0046](../02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md) und [KB-0104](04-konsens-und-quoren.md).

~~~text
Coordinator -> PREPARE -> Participant1, Participant2  (each locks resources, votes yes/no)
Coordinator -> [all yes] -> COMMIT -> Participant1, Participant2
                 ^ coordinator crashes here -> participants blocked, holding locks, unsure
~~~

## Core Concepts, Architektur und Implementierung

| Phase | Aktion | Risiko |
|---|---|---|
| Prepare | Teilnehmer sperrt Ressourcen, stimmt ab | Sperre bleibt bei Koordinatorausfall bestehen |
| Commit/Abort | Koordinator setzt Entscheidung durch | Nachrichtenverlust erzeugt inkonsistenten Zustand |
| In-doubt | Teilnehmer wartet nach „Ja“-Stimme | blockierender Zustand, kein selbstständiger Fortschritt |

Implementierung: 2PC nur einsetzen, wenn Atomizität über Systemgrenzen wirklich zwingend ist und die beteiligten Systeme kurze, seltene Transaktionen mit geringer Sperrdauer haben. Koordinator-Recovery (Transaktionslog, Wiederanlauf mit bekanntem Zustand) ist Pflicht, sonst bleibt jeder Koordinatorausfall ein manuelles Eingreifen. Für die meisten modernen verteilten Systeme ist die praktischere Alternative eine Umstrukturierung zu einer einzigen atomaren lokalen Operation oder ein Saga-Muster ([KB-0109](09-sagas-und-kompensation.md)) mit Kompensation statt echter Atomizität.

## Scalability, Reliability, Security und Observability

2PC skaliert schlecht: jeder zusätzliche Teilnehmer erhöht die Wahrscheinlichkeit, dass mindestens einer während der Sperrphase ausfällt oder langsam ist, und verlängert die effektive Sperrdauer für alle. Reliability-Grenze: die „in-doubt“-Blockierung ist keine seltene Ausnahme, sondern ein strukturelles Merkmal von 2PC — jedes System, das 2PC einsetzt, braucht einen expliziten Recovery-Prozess für diesen Fall.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Ressourcen bleiben lange gesperrt | Teilnehmer im in-doubt-Zustand nach Koordinatorausfall | Koordinator-Log/Transaktionsstatus prüfen |
| Timeout löst Teilnehmer nicht auf | kein Recovery-Prozess implementiert | prüfen, ob Teilnehmer nach Timeout autonom entscheiden darf/kann |
| inkonsistenter Zustand nach Netzwerkfehler in Phase 2 | Commit-Nachricht ging an einen Teilnehmer verloren | Zustand aller Teilnehmer nach der Transaktion vergleichen |
| Durchsatz sinkt bei mehr Teilnehmern überproportional | Sperrdauer wächst mit langsamstem Teilnehmer | Latenzverteilung pro Teilnehmer während Prepare messen |

Security: gehaltene Sperren während in-doubt-Zuständen können zu Denial-of-Service-artigen Effekten führen, wenn ein Angreifer gezielt Koordinator-Kommunikation stört. Observability korreliert Transaktions-ID, Koordinatorstatus, Teilnehmerstimmen und Dauer im Prepare-Zustand.

## Trade-offs und Entscheidungen

**Staff** testet explizit den Koordinatorausfall im Prepare-Zustand und prüft, ob das System danach konsistent recovern kann. **Principal** verlangt für jeden 2PC-Einsatz eine dokumentierte Begründung, warum eine lokale Transaktion oder ein Saga-Muster nicht ausreicht. **Chief** positioniert 2PC als Ausnahme mit hoher Review-Schwelle statt als Standardlösung für Cross-Service-Konsistenz.

Anti-Patterns: 2PC über viele Services/Teams hinweg als „einfachste“ Lösung für Konsistenz einführen; keinen Recovery-Prozess für in-doubt-Transaktionen implementieren; lange laufende Geschäftslogik innerhalb der Sperrphase ausführen.

## Production Checklist

- [ ] Begründung dokumentiert, warum 2PC statt lokaler Transaktion oder Saga nötig ist.
- [ ] Koordinator-Recovery (Transaktionslog, Wiederanlauf) implementiert und getestet.
- [ ] In-doubt-Verhalten bei simuliertem Koordinatorausfall getestet.
- [ ] Sperrdauer und Teilnehmerzahl bewusst minimal gehalten.

## Interviewfragen

### 1. Warum blockiert 2PC?

**Antwort:** Ein Teilnehmer, der in Phase 1 „Ja“ gestimmt hat, muss seine Ressourcen gesperrt halten, bis der Koordinator die endgültige Entscheidung sendet; fällt der Koordinator aus, kann der Teilnehmer nicht sicher selbst entscheiden.

### 2. Was ist ein „in-doubt“-Zustand?

**Antwort:** Ein Teilnehmer hat zugestimmt, aber noch keine Commit/Abort-Entscheidung erhalten und weiß daher nicht, wie die Transaktion tatsächlich ausging.

### 3. Wann ist 2PC gerechtfertigt?

**Antwort:** Bei seltenen, kurzen Transaktionen über wenige, gut kontrollierte Systeme, wo echte Atomizität zwingend ist und ein robuster Koordinator-Recovery-Prozess existiert.

### 4. Was ist die gängige Alternative zu 2PC in modernen verteilten Systemen?

**Antwort:** Das Saga-Muster mit Kompensationsschritten statt echter Atomizität, oder eine Umstrukturierung der Daten, sodass die kritische Operation lokal atomar bleibt.

### 5. Warum skaliert 2PC schlecht mit mehr Teilnehmern?

**Antwort:** Jeder zusätzliche Teilnehmer erhöht die Wahrscheinlichkeit eines Ausfalls/einer Verzögerung während der Sperrphase und verlängert die effektive Sperrdauer für alle Beteiligten.

### 6. Widersprüchliche Anforderung: Produkt will echte Atomizität über fünf unabhängige Microservices UND hohe Verfügbarkeit — wie gehst du vor?

**Antwort:** Ich würde erklären, dass 2PC über fünf Services das Blockierungsrisiko und damit die effektive Verfügbarkeit verschlechtert; Alternative ist ein Saga mit Kompensation, das Verfügbarkeit priorisiert und definierte Kompensationsschritte statt echter Atomizität bietet, mit expliziter Abstimmung, welche Zwischenzustände für das Geschäft tolerierbar sind.

## Praktische Labs

~~~python
class Participant:
    def __init__(self):
        self.locked = False
        self.decision = None

    def prepare(self):
        self.locked = True
        return "yes"

    def commit(self):
        self.decision = "committed"
        self.locked = False

p1 = Participant()
p1.prepare()
# simulate coordinator crash before sending commit/abort
assert p1.locked is True and p1.decision is None
print("Participant remains locked and undecided after coordinator crash - the core 2PC blocking problem.")
~~~

## Dependencies, Cross-References und Quellen

1. Gray, Lamport: [Consensus on Transaction Commit](https://lamport.azurewebsites.net/pubs/consensus-on-transaction-commit.pdf), ACM TODS 2006, abgerufen 2026-09-17.

Produktspezifische XA/2PC-Implementierungsdetails vor Einsatz an aktueller Herstellerdokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Konsensbasierte verteilte Transaktionen (statt klassischem 2PC-Koordinator) | Adopting in manchen NewSQL-Datenbanken | Recovery-Verhalten und Blockierungsrisiko trotzdem explizit testen. |
| Saga-Orchestrierungsplattformen als Standardalternative | Established | Kompensationsvollständigkeit vor Vertrauen in Atomizitätsersatz prüfen. |

Ein Team akzeptiert 2PC in Produktion erst, wenn Koordinator-Recovery, in-doubt-Verhalten und die Notwendigkeit gegenüber Saga-Alternativen explizit geprüft und dokumentiert sind.
