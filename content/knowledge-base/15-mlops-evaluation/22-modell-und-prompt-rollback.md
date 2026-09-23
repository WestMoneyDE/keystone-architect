---
{"id": "KB-0372", "title": "Modell- und Prompt-Rollback", "domain": "15", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0359", "concepts": ["Daten-, Modell- und Promptversionen"], "needed_for": "understanding"}, {"id": "KB-0370", "concepts": ["AI-Canary-Releases"], "needed_for": "understanding"}], "related": ["KB-0371"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Release-Set-Rollback simulieren und dabei erkennen, welche Teile einer vorherigen Anfrage (z. B. eine bereits ausgeführte Toolaktion) durch den Rollback nicht rückgängig gemacht werden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Rollback-Strategie gestalten, die freigegebene Release-Sets zuverlässig wiederherstellt und explizite Grenzen für nicht rücknehmbare Effekte (Toolaktionen, externe Provideränderungen, geänderte Daten) definiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Bei einem angeforderten Rollback erkennen, welche bereits ausgeführten Toolaktionen oder Datenänderungen durch den Rollback nicht automatisch rückgängig gemacht werden und einen expliziten Kompensationsplan vorschlagen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Explizite Dokumentation von Rücknahmegrenzen als verpflichtenden Bestandteil jeder Rollback-Fähigkeit im Unternehmen etablieren, statt Rollback als pauschale, vollständige Wiederherstellung misszuverstehen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Kompensationsmechanismen für nicht rücknehmbare Toolaktionen (Saga-Pattern) sind Vertiefung.", "rationale": "Kern ist das Verständnis der Rücknahmegrenzen selbst, nicht eine spezifische Kompensationsarchitektur."}}, "lab_validation": [{"lab_id": "KB-0372-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Rollback-Szenario mit einer bereits ausgeführten, nicht automatisch rücknehmbaren Toolaktion", "evidence": "Ein simuliertes Release-Set-Rollback stellt Modell- und Promptversion erfolgreich auf einen vorherigen, geprüften Stand zurück, kann aber eine bereits vor dem Rollback ausgeführte reale Toolaktion (z. B. eine versendete Nachricht) nicht rückgängig machen, was die Notwendigkeit einer expliziten Rücknahmegrenzen-Dokumentation demonstriert.", "limitations": "Kein produktives Rollback-System, kein realer Geschäftsdatensatz, künstlich konstruiertes Szenario."}]}
---
# Modell- und Prompt-Rollback

> **Ziel:** Ein Rollback stellt ein zuvor freigegebenes, vollständig getestetes Release-Set (siehe [KB-0359](09-daten-modell-und-promptversionen.md)) nach einem erkannten Problem (z. B. durch ein Canary-Stoppsignal, siehe [KB-0370](20-ai-canary-releases.md)) wieder her. Der zentrale Punkt dieses Kapitels ist, dass ein Rollback niemals als vollständige, universelle Wiederherstellung des vorherigen Zustands missverstanden werden darf — geänderte Daten, externe Providerzustände und bereits ausgeführte Toolaktionen bilden konkrete Rücknahmegrenzen, die explizit benannt und kommuniziert werden müssen.

## Zweck, Mental Model und Dependencies

Ein Rollback im engeren Sinne setzt die Konfiguration (Modellversion, Prompt-Version, Retrieval-Konfiguration eines Release-Sets) auf einen zuvor freigegebenen, bekannt guten Stand zurück — dies ist technisch meist unkompliziert, da es sich um das Zurücksetzen einer Versionsreferenz handelt. Problematisch wird ein Rollback jedoch bei drei Arten von Effekten, die durch das Zurücksetzen der Konfiguration nicht automatisch rückgängig gemacht werden: erstens geänderte Daten — wenn zwischen der ursprünglichen Freigabe und dem Rollback-Zeitpunkt Trainings- oder Referenzdaten aktualisiert wurden, stellt ein Konfigurations-Rollback nicht automatisch auch den ursprünglichen Datenstand wieder her, sofern dies nicht explizit als Teil des Release-Sets mitversioniert wurde. Zweitens externe Provider — wenn ein extern gehosteter LLM-Provider zwischenzeitlich sein zugrunde liegendes Modell ausgetauscht hat (siehe die entsprechende Problematik in [KB-0359](09-daten-modell-und-promptversionen.md)), kann ein Rollback der eigenen Konfiguration nicht den ursprünglichen Provider-Modellzustand wiederherstellen, da dieser außerhalb der eigenen Kontrolle liegt. Drittens und am gravierendsten: bereits ausgeführte Toolaktionen — wenn ein Agentensystem zwischen Freigabe und Rollback bereits reale, nicht rückgängig machbare Aktionen ausgeführt hat (eine gesendete Nachricht, eine Zahlung, eine externe API-Anfrage mit Nebeneffekten), macht ein Rollback der Modell-/Prompt-Konfiguration diese bereits eingetretenen realen Effekte nicht ungeschehen. Ein Rollback ist daher nicht "Zeit zurückdrehen", sondern ausschließlich "Konfiguration zurücksetzen" — die Differenz zwischen beidem muss als explizite Rücknahmegrenze dokumentiert und bei Bedarf durch einen separaten Kompensationsplan (z. B. eine korrigierende Nachricht, eine Rückerstattung) adressiert werden.

~~~text
Rollback (narrow sense): reset CONFIGURATION (model version, prompt version, retrieval config) to a prior good state
  -> technically simple: resetting a version reference
THREE CATEGORIES NOT automatically undone by a config rollback:
  1. Changed data: reference/training data updated since release -> rollback doesn't restore the ORIGINAL data state
     unless explicitly versioned as part of the release set
  2. External providers: provider swapped its underlying model in the meantime -> outside your control, unrestorable
  3. Already-executed tool actions (MOST SEVERE): a sent message, a payment, an API call with real side effects
     -> rollback of config does NOT undo effects that ALREADY HAPPENED in the real world
CORE DISTINCTION: rollback = "reset configuration", NOT "turn back time"
  -> the gap between the two must be an EXPLICIT, documented boundary, addressed via a separate compensation plan
~~~

## Core Concepts, Architektur und Implementierung

| Rücknahmegrenze | Warum ein Rollback sie nicht abdeckt | Notwendige Ergänzung |
|---|---|---|
| Geänderte Daten | Konfigurations-Rollback stellt nicht automatisch den ursprünglichen Datenstand wieder her | Daten explizit als Teil des Release-Sets mitversionieren (siehe DVC, [KB-0353](03-dvc-und-datenversionierung.md)) |
| Externe Provider | Provider-Modellzustand liegt außerhalb der eigenen Kontrolle | den beobachteten Provider-Zustand dokumentieren, nicht als garantiert rücknehmbar behandeln |
| Bereits ausgeführte Toolaktionen | reale Effekte sind bereits eingetreten und werden durch Konfigurationsänderung nicht rückgängig | separater, expliziter Kompensationsplan (korrigierende Aktion, Benachrichtigung, Rückerstattung) |

Implementierung: Vor der Einführung einer Rollback-Fähigkeit werden die drei Rücknahmegrenzen explizit dokumentiert und kommuniziert, statt Rollback pauschal als "vollständige Wiederherstellung" zu bewerben. Release-Sets werden so gestaltet, dass relevante Daten explizit mitversioniert werden, um die erste Grenze zu minimieren. Für bereits ausgeführte Toolaktionen wird ein separater Prozess etabliert, der bei einem Rollback-Ereignis prüft, welche Aktionen im betroffenen Zeitraum tatsächlich ausgeführt wurden, und für diese einen expliziten Kompensationsplan vorschlägt, statt sie stillschweigend als durch den Rollback erledigt zu betrachten.

## Scalability, Reliability, Security und Observability

Rollback-Fähigkeit skaliert die Reaktionsgeschwindigkeit auf erkannte Probleme proportional zur technischen Einfachheit der Konfigurationsumschaltung; die Reliability-Grenze liegt darin, dass die Anzahl bereits ausgeführter, nicht rücknehmbarer Toolaktionen proportional zur Dauer zwischen Freigabe und Rollback-Erkennung wächst und einen entsprechend wachsenden Kompensationsaufwand erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einem Rollback bestehen weiterhin Auswirkungen des fehlerhaften Modellstands | bereits ausgeführte Toolaktionen aus dem betroffenen Zeitraum wurden durch den Rollback nicht adressiert | die im betroffenen Zeitraum ausgeführten Toolaktionen identifizieren und einen expliziten Kompensationsplan erstellen |
| ein Rollback stellt nicht das ursprünglich getestete Verhalten wieder her | die zugrunde liegenden Daten wurden zwischen Freigabe und Rollback geändert und nicht mitversioniert | prüfen, ob die Datenversion als Teil des Release-Sets mitversioniert war, und diese Lücke für zukünftige Release-Sets schließen |
| ein Team geht fälschlich davon aus, ein Rollback mache alle Auswirkungen des fehlerhaften Stands ungeschehen | die Rücknahmegrenzen wurden dem Team nicht explizit kommuniziert | die drei Rücknahmegrenzen (Daten, Provider, Toolaktionen) explizit dokumentieren und im Rollback-Prozess kommunizieren |

Security: Bereits ausgeführte, potenziell schädliche Toolaktionen (z. B. eine fälschlich autorisierte Transaktion) stellen ein reales Sicherheitsrisiko dar, das durch einen reinen Konfigurations-Rollback nicht behoben wird und einen separaten, dringenden Kompensationsprozess erfordert. Observability: Die Anzahl der zwischen Freigabe und Rollback ausgeführten Toolaktionen, der Zeitraum zwischen Problem-Auftreten und Rollback-Ausführung, und der Status offener Kompensationspläne sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Release-Sets mit expliziter Daten-Mitversionierung und einen separaten Prozess zur Identifikation bereits ausgeführter Toolaktionen bei Rollback-Ereignissen. **Principal** macht die drei Rücknahmegrenzen für das Team explizit nachvollziehbar. **Chief** etabliert explizite Dokumentation von Rücknahmegrenzen als verpflichtenden Bestandteil jeder Rollback-Fähigkeit im Unternehmen.

Anti-Patterns: Rollback als pauschale, vollständige Wiederherstellung des vorherigen Zustands kommunizieren, ohne die drei Rücknahmegrenzen zu benennen; bereits ausgeführte Toolaktionen nach einem Rollback stillschweigend als erledigt betrachten; Datenversionierung nicht als Teil des Release-Sets behandeln.

## Production Checklist

- [ ] Die drei Rücknahmegrenzen (Daten, Provider, Toolaktionen) sind explizit dokumentiert und kommuniziert.
- [ ] Release-Sets versionieren relevante Daten explizit mit.
- [ ] Ein separater Prozess identifiziert bereits ausgeführte Toolaktionen bei Rollback-Ereignissen.
- [ ] Für nicht rücknehmbare Effekte existiert ein expliziter Kompensationsplan-Prozess.

## Interviewfragen

### 1. Was bedeutet ein Rollback im engeren Sinne, und was deckt er nicht ab?

**Antwort:** Er setzt die Konfiguration (Modell-, Prompt-, Retrieval-Version) auf einen vorherigen Stand zurück, macht aber bereits eingetretene reale Effekte (geänderte Daten, Provider-Zustände, ausgeführte Toolaktionen) nicht rückgängig.

### 2. Warum sind bereits ausgeführte Toolaktionen die gravierendste Rücknahmegrenze?

**Antwort:** Reale Effekte wie eine gesendete Nachricht oder eine Zahlung sind bereits eingetreten und werden durch eine Konfigurationsänderung nicht ungeschehen gemacht, im Gegensatz zu reinen Konfigurationszuständen.

### 3. Wie adressierst du die Rücknahmegrenze "geänderte Daten"?

**Antwort:** Indem relevante Daten explizit als Teil des Release-Sets mitversioniert werden, sodass ein Rollback auch den ursprünglichen Datenstand wiederherstellt, statt nur die Modell-/Prompt-Konfiguration.

### 4. Warum kann ein Rollback den Zustand eines externen LLM-Providers nicht wiederherstellen?

**Antwort:** Der Provider-Modellzustand liegt außerhalb der eigenen Kontrolle; ein Provider kann sein zugrunde liegendes Modell unabhängig von der eigenen Konfiguration austauschen.

### 5. Wie gehst du vor, wenn nach einem Rollback weiterhin Auswirkungen des fehlerhaften Modellstands bestehen?

**Antwort:** Ich identifiziere die im betroffenen Zeitraum bereits ausgeführten Toolaktionen und erstelle für diese einen expliziten Kompensationsplan, statt anzunehmen, der Rollback habe alle Auswirkungen bereits behoben.

### 6. Widersprüchliche Anforderung: Team will schnellen, einfachen Rollback UND garantiert vollständige Wiederherstellung aller Auswirkungen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass ein Konfigurations-Rollback per Definition keine bereits eingetretenen realen Effekte rückgängig machen kann, und stattdessen einen zweistufigen Prozess vorschlagen: einen schnellen, einfachen Konfigurations-Rollback zur sofortigen Schadensbegrenzung, gefolgt von einem separaten, expliziten Kompensationsprozess für bereits eingetretene, nicht rücknehmbare Effekte.

## Praktische Labs

~~~python
release_history = [
    {"release_id": "rs1", "model_version": "model_v1", "prompt_version": "prompt_v1", "data_version": "data_v1"},
    {"release_id": "rs2", "model_version": "model_v2", "prompt_version": "prompt_v2", "data_version": "data_v2"},
]

executed_tool_actions = [
    {"timestamp": "t1", "release_id": "rs2", "action": "sent_email_to_customer_123"},
    {"timestamp": "t2", "release_id": "rs2", "action": "processed_refund_for_order_456"},
]

def rollback_to(release_id):
    target = next(r for r in release_history if r["release_id"] == release_id)
    print(f"Configuration rolled back to: {target}")
    return target

def identify_actions_requiring_compensation(from_release_id):
    return [a for a in executed_tool_actions if a["release_id"] == from_release_id]

current = rollback_to("rs1")  # rolling back FROM rs2 TO rs1

affected_actions = identify_actions_requiring_compensation("rs2")
print(f"\nConfiguration is now restored, BUT these real-world actions already happened and are NOT undone:")
for action in affected_actions:
    print(f"  [{action['timestamp']}] {action['action']} -- REQUIRES EXPLICIT COMPENSATION PLAN")
~~~

## Dependencies, Cross-References und Quellen

1. Garcia-Molina, Salem: [Sagas](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf), abgerufen 2026-09-17.
2. Sculley et al.: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), abgerufen 2026-09-17.

Daten-, Modell- und Promptversionen sind kanonisch in [KB-0359](09-daten-modell-und-promptversionen.md) behandelt; AI-Canary-Releases in [KB-0370](20-ai-canary-releases.md); Shadow Deployments für AI in [KB-0371](21-shadow-deployments-fuer-ai.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Erkennung und Katalogisierung bereits ausgeführter Toolaktionen im Rollback-Zeitfenster | Adopting | Gegenüber manueller Nachverfolgung für schnellere, vollständigere Identifikation kompensationsbedürftiger Aktionen bevorzugen. |
| Saga-Pattern-basierte Kompensationsmechanismen, die automatisch Gegenaktionen für bekannte Toolaktionstypen auslösen | Evaluating | Gegenüber manuellen Kompensationsplänen abwägen, sobald für die relevanten Aktionstypen zuverlässige automatische Gegenaktionen definiert sind. |

Ein Team akzeptiert einen Rollback als abgeschlossen erst, wenn zusätzlich zur Konfigurationswiederherstellung alle drei Rücknahmegrenzen explizit geprüft und bei Bedarf kompensiert wurden.
