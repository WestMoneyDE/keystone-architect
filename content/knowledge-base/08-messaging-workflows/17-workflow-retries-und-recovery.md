---
{"id": "KB-0193", "title": "Workflow-Retries und Recovery", "domain": "08", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "STAFF"], "requires": [{"id": "KB-0192", "concepts": ["Durable Workflows"], "needed_for": "both"}, {"id": "KB-0109", "concepts": ["Sagas", "Kompensation"], "needed_for": "both"}, {"id": "KB-0114", "concepts": ["Retry", "Backoff"], "needed_for": "understanding"}], "related": ["KB-0194", "KB-0562", "KB-0720"], "applies": ["KB-0562", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Activity-Retry mit Heartbeat und manueller Wiederaufnahme nach unklarem Seiteneffekt lokal implementieren.", "rationale": "Kein echtes Temporal-System nötig, um das Kernprinzip zu zeigen."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Activity-Retry-Policy, Heartbeat-Nutzung für lange Activities und Kompensationsstrategie für einen Workflow mit externen Seiteneffekten entwerfen.", "rationale": "Ein Activity-Retry ohne Idempotenz-/Heartbeat-Bewusstsein kann Seiteneffekte duplizieren oder hängende Activities nicht erkennen."}, "STAFF-TARGET": {"active": true, "scope": "Einen unklaren Zustand nach Activity-Timeout (Seiteneffekt eventuell erfolgt, eventuell nicht) korrekt behandeln, statt anzunehmen, er sei nicht erfolgt.", "rationale": "Ein Activity-Timeout bedeutet nicht zwingend, dass die Operation nicht ausgeführt wurde."}, "CHIEF-TARGET": {"active": true, "scope": "Kompensationsstrategien für Workflows mit unklaren externen Seiteneffekten als Pflichtstandard festlegen.", "rationale": "Ohne definierte Kompensation bleiben unklare Zustände nach Workflow-Abbrüchen unbearbeitet liegen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte Heartbeat-Intervall-Tuning-Strategien für sehr lange Activities sind Vertiefung.", "rationale": "Kern ist die Kombination aus Retry, Heartbeat und Kompensation für zuverlässige Recovery."}}, "lab_validation": [{"lab_id": "KB-0193-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Activity-Retry mit unklarem Seiteneffekt und Kompensation", "evidence": "Ein Activity-Timeout, dessen tatsächlicher externer Effekt unbekannt ist, löst eine idempotente Prüfung aus, bevor die Operation erneut versucht wird, statt sie blind zu wiederholen.", "limitations": "Kein echtes Temporal-System, keine Produktion."}]}
---
# Workflow-Retries und Recovery

> **Ziel:** Ein Activity-Timeout bedeutet nicht zwingend, dass die zugrunde liegende Operation nicht ausgeführt wurde — sie könnte erfolgreich abgeschlossen sein, während nur die Bestätigung verloren ging. Diese Unklarheit erfordert eine Kombination aus Heartbeats (für Fortschrittserkennung bei langen Activities), idempotenten Retries und definierten Kompensationsstrategien ([KB-0109](../05-distributed-systems/09-sagas-und-kompensation.md)) für Fälle, in denen eine Wiederholung nicht sicher möglich ist.

## Zweck, Mental Model und Dependencies

Wenn eine Activity innerhalb ihres Timeout-Fensters nicht antwortet, weiß der Workflow nicht mit Sicherheit, ob die Operation fehlgeschlagen ist, noch läuft, oder bereits erfolgreich abgeschlossen wurde, aber die Antwort verloren ging — dasselbe Grundproblem wie bei allgemeinem At-least-once-Messaging ([KB-0114](../05-distributed-systems/14-retries-und-wiederholungsstuerme.md)), hier auf Workflow-Activity-Ebene. Ein Heartbeat-Mechanismus erlaubt einer lange laufenden Activity, periodisch „ich lebe noch, hier ist mein Fortschritt" zu signalisieren, was echten Fortschritt von einem tatsächlich hängenden Prozess unterscheidbar macht. Wenn eine Activity nicht sicher idempotent wiederholt werden kann (z. B. eine nicht-idempotente externe Zahlung), muss stattdessen eine Kompensationsstrategie greifen, ähnlich einem Saga-Muster. Lies [KB-0192](16-durable-workflows-und-wartezustaende.md), [KB-0109](../05-distributed-systems/09-sagas-und-kompensation.md) und [KB-0114](../05-distributed-systems/14-retries-und-wiederholungsstuerme.md).

~~~text
Activity times out -> unclear: did chargePayment() actually succeed externally, or not?
IF idempotent (has idempotency key): safe to retry -> retry with SAME key -> no duplicate charge
IF NOT idempotent: cannot safely retry -> must check actual state OR trigger compensation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Retry-Policy | Backoff, maximale Versuche für diese spezifische Activity begründet? | zu aggressive Retries verstärken Last auf ein bereits gestresstes externes System |
| Heartbeat | signalisiert eine lange Activity aktiv Fortschritt? | ohne Heartbeat kann eine hängende Activity nicht von einer aktiv arbeitenden unterschieden werden |
| Idempotenz der Activity | kann sie sicher mehrfach mit demselben Effekt ausgeführt werden? | nicht-idempotente Retry-Activity erzeugt doppelte externe Effekte |
| Kompensationsstrategie | definiert für Fälle, in denen Retry nicht sicher möglich ist? | unklarer Zustand bleibt ohne definierte Reaktion liegen |

Implementierung: jede Activity erhält eine begründete Retry-Policy (Backoff, maximale Versuche), abgestimmt auf die Charakteristik der zugrunde liegenden Operation. Lange laufende Activities senden periodische Heartbeats, damit die Workflow-Engine echten Fortschritt von einem tatsächlichen Hänger unterscheiden kann. Jede Activity mit externem Seiteneffekt wird entweder mit einem Idempotenzschlüssel abgesichert (sicherer Retry möglich) oder erhält eine explizite Kompensationsaktivität für den Fall, dass ein Retry nicht sicher ist — der Workflow-Code enthält dann eine bewusste Entscheidungslogik, welcher Pfad bei einem Fehler eingeschlagen wird.

## Scalability, Reliability, Security und Observability

Heartbeat-basierte Fortschrittserkennung skaliert Zuverlässigkeit für lange laufende Activities, ohne pauschal sehr lange Timeouts zu benötigen, die hängende Prozesse spät erkennen würden. Reliability-Grenze: eine nicht-idempotente Activity, die naiv wiederholt wird, kann externe Seiteneffekte duplizieren (z. B. doppelte Zahlung) — dieselbe Gefahrenklasse wie bei generischen Retries ([KB-0114](../05-distributed-systems/14-retries-und-wiederholungsstuerme.md)), aber mit dem zusätzlichen Kontext, dass Workflow-Activities oft besonders kritische Geschäftsoperationen kapseln.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| doppelter externer Effekt (z. B. doppelte Zahlung) nach Activity-Retry | Activity nicht idempotent implementiert, naiver Retry | Idempotenzschlüssel-Nutzung der betroffenen Activity prüfen |
| lange Activity wird fälschlich als hängend erkannt und abgebrochen | fehlender Heartbeat-Mechanismus | Heartbeat-Intervall gegen tatsächliche Activity-Laufzeit-Charakteristik prüfen |
| unklarer Zustand nach Activity-Timeout bleibt unbearbeitet | fehlende Kompensationsstrategie für nicht-idempotente Operationen | prüfen, ob eine definierte Kompensationsaktivität für diesen Fehlerfall existiert |
| Retry-Sturm verschärft Überlastung eines externen Systems | Retry-Policy ohne angemessenen Backoff für diese spezifische Activity | Backoff-Konfiguration gegen die Fehlercharakteristik des externen Systems prüfen |

Security: Kompensationsaktionen (z. B. eine Rückerstattung) sollten dieselben Berechtigungsprüfungen wie die ursprüngliche Operation durchlaufen, um zu verhindern, dass der Kompensationspfad zu einem Umgehungsweg für Autorisierungskontrollen wird. Observability: Activity-Retry-Häufigkeit, Heartbeat-Ausfälle und ausgelöste Kompensationen sind zentrale Metriken zur Diagnose instabiler externer Abhängigkeiten.

## Trade-offs und Entscheidungen

**Staff** implementiert Heartbeats für alle lange laufenden Activities und begründete Retry-Policies statt pauschaler Standardwerte. **Principal** definiert für jede Activity mit externem Seiteneffekt, ob Idempotenz oder Kompensation der richtige Sicherungsmechanismus ist. **Chief** verlangt eine dokumentierte Recovery-Strategie für jede kritische Workflow-Activity als Voraussetzung für Produktivfreigabe.

Anti-Patterns: nicht-idempotente Activities naiv retryen ohne Kompensationsstrategie; lange Activities ohne Heartbeat, was hängende Prozesse spät oder gar nicht erkennbar macht; Retry-Policy ohne Bezug zur tatsächlichen Fehlercharakteristik der externen Abhängigkeit konfigurieren.

## Production Checklist

- [ ] Jede Activity mit externem Seiteneffekt ist entweder idempotent oder hat eine definierte Kompensationsaktivität.
- [ ] Lange laufende Activities senden periodische Heartbeats.
- [ ] Retry-Policy (Backoff, maximale Versuche) ist pro Activity-Charakteristik begründet.
- [ ] Recovery-Strategie für unklare Zustände nach Activity-Timeout ist dokumentiert.

## Interviewfragen

### 1. Warum bedeutet ein Activity-Timeout nicht zwingend, dass die Operation fehlgeschlagen ist?

**Antwort:** Die zugrunde liegende externe Operation könnte erfolgreich abgeschlossen sein, während nur die Bestätigung an den Workflow verloren ging — Timeout zeigt fehlende Antwort, nicht zwingend fehlenden Erfolg.

### 2. Wozu dient ein Heartbeat bei einer langen Activity?

**Antwort:** Er erlaubt der Activity, periodisch aktiven Fortschritt zu signalisieren, wodurch die Workflow-Engine einen tatsächlich hängenden Prozess von einem noch aktiv arbeitenden unterscheiden kann.

### 3. Wie gehst du mit einer nicht-idempotenten Activity um, die nicht sicher wiederholt werden kann?

**Antwort:** Über eine definierte Kompensationsaktivität, die im Fehlerfall den möglichen Teilzustand explizit behandelt, statt die Operation blind erneut zu versuchen.

### 4. Warum ist eine pauschale Retry-Policy für alle Activities riskant?

**Antwort:** Unterschiedliche Activities haben unterschiedliche Fehlercharakteristiken; eine zu aggressive Policy kann ein bereits gestresstes externes System weiter belasten, eine zu passive verzögert Recovery unnötig.

### 5. Was passiert, wenn eine Activity mit Idempotenzschlüssel erneut versucht wird?

**Antwort:** Die zugrunde liegende Operation erkennt anhand des Schlüssels, dass sie bereits (möglicherweise) ausgeführt wurde, und liefert das ursprüngliche Ergebnis zurück, statt den Effekt zu duplizieren.

### 6. Widersprüchliche Anforderung: Team will automatisches Retry für alle Activities UND garantiert keine doppelten externen Effekte — wie gehst du vor?

**Antwort:** Ich würde jede Activity klassifizieren: idempotente Operationen erhalten automatisches Retry mit Idempotenzschlüssel, nicht-idempotente Operationen erhalten stattdessen eine explizite Kompensationsstrategie statt automatischem Retry — beide Ziele sind vereinbar, wenn die Behandlung pro Activity-Typ differenziert wird.

## Praktische Labs

~~~python
idempotency_store = set()

def charge_payment_idempotent(idempotency_key, amount):
    if idempotency_key in idempotency_store:
        return "already charged, no duplicate effect"
    idempotency_store.add(idempotency_key)
    return f"charged {amount}"

def activity_with_retry(idempotency_key, amount, attempts=2):
    results = []
    for _ in range(attempts):
        results.append(charge_payment_idempotent(idempotency_key, amount))
    return results

results = activity_with_retry("wf-instance-1-charge", 50)
assert results[0] == "charged 50"
assert "already charged" in results[1]
print("Retry with the same idempotency key did not duplicate the external charge effect.")
~~~

## Dependencies, Cross-References und Quellen

1. Temporal Technologies: [Temporal Documentation - Activity Retries and Heartbeats](https://docs.temporal.io/activities), abgerufen 2026-09-17.

Temporal-/Framework-spezifische Retry-Policy-API-Details vor Einsatz an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Erkennung nicht-idempotenter Activities durch statische Analyse | Emerging | Ergebnis gegen manuelle Klassifikation validieren, nicht blind vertrauen. |

Ein Team akzeptiert eine Workflow-Recovery-Strategie erst, wenn Idempotenz/Kompensation pro Activity klassifiziert und Heartbeat-Nutzung für lange Activities nachweisbar getestet sind.
