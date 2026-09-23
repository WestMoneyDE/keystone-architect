---
{"id": "KB-0301", "title": "Fehlerbehandlung und Agenten-Recovery", "domain": "12", "sequence": 27, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "PLATFORM"], "requires": [{"id": "KB-0300", "concepts": ["Rollback und kompensierbare Aktionen"], "needed_for": "understanding"}, {"id": "KB-0296", "concepts": ["Langlebige Agententasks"], "needed_for": "understanding"}], "related": ["KB-0283"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Fehlerklassifikation implementieren, die Toolfehler, verlorene Leases und unklare Seiteneffekte unterscheidet und jeweils eine passende Recovery-Strategie auslöst.", "rationale": "Der Wert differenzierter Fehlerklassifikation wird erst durch konkrete Implementierung unterschiedlicher Recovery-Reaktionen greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, ab welchem Grad an Unklarheit über einen aufgetretenen Fehler eine kontrollierte Wiederaufnahme durch menschliche Klärung statt automatischer Selbstreparatur angemessen ist.", "rationale": "Nicht jeder Fehler kann sicher automatisch behoben werden; ein Fehler mit unklaren Seiteneffekten erfordert oft menschliches Urteilsvermögen statt automatischer Wiederholung."}, "STAFF-TARGET": {"active": true, "scope": "Eine sich wiederholende, erfolglose automatische Fehlerbehebung auf eine fehlende Eskalationsgrenze statt auf ein allgemeines Recovery-Problem zurückführen können.", "rationale": "Ein Agent, der bei jedem Fehler automatisch erneut versucht, ohne eine Eskalationsgrenze zu erreichen, kann in einer endlosen, erfolglosen Selbstreparaturschleife verharren."}, "CHIEF-TARGET": {"active": true, "scope": "Fehlerbehandlung als differenzierte Klassifikation mit expliziter Eskalationsgrenze zu menschlicher Klärung positionieren, nicht als generische Selbstreparaturlogik für jeden Fehlertyp.", "rationale": "Endlose automatische Selbstreparatur ohne Eskalationsgrenze ist ein reales Betriebsrisiko, das Ressourcen verschwendet und Probleme verschleiert, statt sie zu lösen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Retry-Backoff-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist die Fehlerklassifikation und die Eskalationsgrenze zu menschlicher Klärung, nicht die konkrete Retry-Mechanik."}}, "lab_validation": [{"lab_id": "KB-0301-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Fehlerklassifikation mit unterschiedlicher Recovery-Reaktion je nach Fehlertyp und Eskalation bei unklaren Seiteneffekten", "evidence": "Ein Toolfehler mit klar bekanntem, harmlosem Ursprung wird automatisch mit begrenzten Wiederholungsversuchen behandelt; ein Fehler mit unklaren, potenziell bereits eingetretenen Seiteneffekten wird stattdessen an eine menschliche Klärung eskaliert, statt automatisch wiederholt zu werden.", "limitations": "Kein echtes Zielsystem, kein produktives System, keine reale Recovery-Infrastruktur."}]}
---
# Fehlerbehandlung und Agenten-Recovery

> **Ziel:** Fehler in Agentensystemen müssen klassifiziert werden — Toolfehler (ein Tool-Aufruf schlägt mit einem bekannten Fehlercode fehl), verlorene Leases (siehe [KB-0296](22-langlebige-agententasks.md), ein Worker ist ausgefallen) und unklare Seiteneffekte (unbekannt, ob eine Aktion bereits eine Teilwirkung erzeugt hat, siehe [KB-0300](26-rollback-und-kompensierbare-aktionen.md)) erfordern jeweils unterschiedliche Recovery-Strategien. Der zentrale Punkt ist, dass nicht jeder Fehler sicher automatisch behoben werden kann — bei Unklarheit über tatsächlich eingetretene Seiteneffekte ist eine kontrollierte Wiederaufnahme mit menschlicher Klärung oft die einzig sichere Reaktion, statt eine endlose automatische Selbstreparaturschleife zu riskieren.

## Zweck, Mental Model und Dependencies

Ein Toolfehler mit bekanntem, klar identifiziertem Ursprung (z. B. ein temporärer Netzwerkfehler mit definiertem Fehlercode) kann typischerweise sicher automatisch mit einer begrenzten Anzahl an Wiederholungsversuchen behandelt werden, insbesondere wenn die zugrunde liegende Aktion idempotent ist (siehe Ergebnisverträge, [KB-0283](09-tool-use-und-ergebnisvertraege.md)). Eine verlorene Lease (siehe [KB-0296](22-langlebige-agententasks.md)) bedeutet, dass ein Worker vermutlich ausgefallen ist — die Recovery-Strategie hier ist typischerweise eine kontrollierte Übernahme durch einen anderen Worker, nicht eine sofortige Wiederholung der gesamten Aufgabe. Unklare Seiteneffekte sind der schwierigste Fall: wenn ein Fehler auftritt, aber unklar ist, ob die zugehörige Aktion bereits eine reale, möglicherweise nicht kompensierbare Teilwirkung erzeugt hat, bevor der Fehler auftrat, ist eine automatische Wiederholung riskant — sie könnte die Aktion doppelt ausführen (falls sie tatsächlich schon erfolgreich war) oder die tatsächliche Ursache verschleiern. In diesem Fall ist kontrollierte Wiederaufnahme mit menschlicher Klärung die sichere Strategie: der Prozess wird angehalten, der unklare Zustand wird einem Menschen zur Prüfung vorgelegt, und erst nach dieser Klärung wird die Aufgabe fortgesetzt oder korrigiert. Der zentrale, oft übersehene Fehler ist, eine generische Selbstreparaturlogik (z. B. "bei jedem Fehler automatisch bis zu N Mal wiederholen") unabhängig vom tatsächlichen Fehlertyp anzuwenden — dies kann bei unklaren Seiteneffekten zu wiederholten, potenziell schädlichen Aktionen führen, statt das eigentliche Problem zu lösen.

~~~text
Tool error (known cause, e.g. temporary network failure): SAFE to auto-retry (bounded attempts, if idempotent)
Lost lease (KB-0296, worker likely failed): recovery = controlled takeover by ANOTHER worker, not blind retry
Unclear side effects (unknown if partial effect already occurred, KB-0300): 
  AUTO-RETRY IS RISKY -> could double-execute OR mask the real cause
  -> CORRECT strategy: controlled pause + human clarification, THEN resume/correct
ANTI-PATTERN: generic "retry N times on any error" regardless of error TYPE
  -> dangerous for unclear-side-effect errors specifically
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Explizite Fehlerklassifikation vor Recovery-Entscheidung | wird jeder Fehler vor der Recovery-Reaktion explizit einem der drei Typen (Toolfehler, verlorene Lease, unklarer Seiteneffekt) zugeordnet? | eine generische Fehlerbehandlung ohne Klassifikation kann eine unpassende, potenziell schädliche Reaktion auslösen |
| Begrenzte, idempotenzgestützte Wiederholung für bekannte Toolfehler | ist die automatische Wiederholung auf bekannte, klar identifizierte Fehler mit idempotenten Aktionen beschränkt? | eine unbegrenzte oder nicht idempotenzgestützte Wiederholung kann zu doppelten Ausführungen führen |
| Eskalationsgrenze zu menschlicher Klärung | ist eine explizite Grenze definiert, ab der ein Fehler statt weiterer automatischer Versuche an einen Menschen eskaliert wird? | ohne Eskalationsgrenze kann ein Agent in einer endlosen, erfolglosen Selbstreparaturschleife verharren |
| Kontrollierte Wiederaufnahme statt sofortiger Neustart bei unklaren Seiteneffekten | wird bei unklarem Seiteneffekt der Prozess kontrolliert angehalten, statt automatisch neu gestartet zu werden? | ein automatischer Neustart bei unklarem Seiteneffekt kann eine bereits erfolgreiche Aktion unbeabsichtigt wiederholen |

Implementierung: Jeder auftretende Fehler wird vor der Recovery-Entscheidung explizit klassifiziert (bekannter Toolfehler, verlorene Lease, unklarer Seiteneffekt). Bekannte Toolfehler mit idempotenten zugrunde liegenden Aktionen werden mit einer begrenzten Anzahl automatischer Wiederholungsversuche behandelt, typischerweise mit exponentiellem Backoff. Eine verlorene Lease löst eine kontrollierte Übernahme durch einen anderen Worker aus, basierend auf dem zuletzt bekannten, konsistenten Checkpoint (siehe [KB-0285](11-checkpoints-und-wiederaufnahme.md)). Bei unklaren Seiteneffekten wird der Prozess angehalten und explizit an eine menschliche Klärung eskaliert, statt automatisch fortzufahren oder neu zu starten. Jede automatische Recovery-Strategie erhält eine explizite Eskalationsgrenze (z. B. maximale Anzahl an Wiederholungsversuchen), nach deren Erreichen ebenfalls an eine menschliche Klärung eskaliert wird.

## Scalability, Reliability, Security und Observability

Differenzierte Fehlerklassifikation skaliert die sichere Automatisierung der Fehlerbehandlung proportional zur Genauigkeit der Klassifikation; die Reliability-Grenze liegt in einer generischen, typunabhängigen Retry-Logik, die bei unklaren Seiteneffekten proportional zur Fehlerhäufigkeit ein wachsendes Risiko doppelter oder fehlerhafter Ausführungen erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Agentensystem versucht wiederholt erfolglos, denselben Fehler zu beheben, ohne jemals zu eskalieren | fehlende Eskalationsgrenze für die automatische Wiederholungslogik | prüfen, ob eine explizite Eskalationsgrenze für den betroffenen Fehlertyp definiert und implementiert war |
| eine Aktion mit unklarem Seiteneffekt wurde nach einem Fehler unbeabsichtigt doppelt ausgeführt | automatische Wiederholung wurde auf einen Fehler mit unklarem Seiteneffekt angewendet, statt an menschliche Klärung zu eskalieren | prüfen, ob der betroffene Fehler korrekt als "unklarer Seiteneffekt" klassifiziert und entsprechend behandelt wurde |
| nach einem Worker-Ausfall dauert die Wiederaufnahme unerwartet lange oder führt zu inkonsistentem Zustand | fehlende oder fehlerhafte Lease-basierte Übernahmelogik | prüfen, ob die Übernahme durch einen anderen Worker auf Basis des zuletzt bekannten konsistenten Checkpoints erfolgte |

Security: Eine generische Retry-Logik ohne Fehlerklassifikation ist auch ein Sicherheitsrisiko — ein wiederholt fehlschlagender, aber automatisch wiederholter Vorgang kann unbeabsichtigt Ressourcen verschwenden oder, bei unklaren Seiteneffekten, tatsächlich schädliche Aktionen mehrfach auslösen. Observability: Verteilung der Fehler nach Klassifikationstyp, Häufigkeit erreichter Eskalationsgrenzen und durchschnittliche Zeit bis zur menschlichen Klärung bei eskalierten Fehlern sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** klassifiziert jeden Fehler explizit vor der Recovery-Entscheidung und wendet unterschiedliche Strategien je Fehlertyp an. **Principal** macht Eskalationsgrenzen und Klärungsprozesse für das Team nachvollziehbar dokumentiert. **Chief** positioniert Fehlerbehandlung als differenzierte Klassifikation mit expliziter Eskalationsgrenze, nicht als generische Selbstreparaturlogik.

Anti-Patterns: eine generische "bei Fehler N Mal wiederholen"-Logik unabhängig vom Fehlertyp anwenden; bei unklaren Seiteneffekten automatisch wiederholen statt an menschliche Klärung zu eskalieren; keine Eskalationsgrenze für automatische Wiederholungsversuche definieren.

## Production Checklist

- [ ] Jeder Fehler wird vor der Recovery-Entscheidung explizit klassifiziert.
- [ ] Automatische Wiederholung ist auf bekannte, idempotente Fehlerfälle beschränkt.
- [ ] Fehler mit unklaren Seiteneffekten lösen eine kontrollierte Wiederaufnahme mit menschlicher Klärung aus.
- [ ] Jede automatische Recovery-Strategie hat eine explizite Eskalationsgrenze.

## Interviewfragen

### 1. Warum sollte Fehlerbehandlung differenziert nach Fehlertyp statt generisch erfolgen?

**Antwort:** Verschiedene Fehlertypen (bekannter Toolfehler, verlorene Lease, unklarer Seiteneffekt) erfordern unterschiedliche Recovery-Strategien; eine generische Retry-Logik kann bei unklaren Seiteneffekten schädlich sein.

### 2. Warum ist automatische Wiederholung bei unklaren Seiteneffekten riskant?

**Antwort:** Unklar ist, ob die zugehörige Aktion bereits eine reale Teilwirkung erzeugt hat; eine automatische Wiederholung könnte die Aktion doppelt ausführen oder die tatsächliche Fehlerursache verschleiern.

### 3. Was ist die korrekte Recovery-Strategie bei einer verlorenen Lease?

**Antwort:** Eine kontrollierte Übernahme durch einen anderen Worker basierend auf dem zuletzt bekannten, konsistenten Checkpoint, nicht ein sofortiger, blinder Neustart der gesamten Aufgabe.

### 4. Warum benötigt jede automatische Recovery-Strategie eine Eskalationsgrenze?

**Antwort:** Ohne diese Grenze kann ein Agent in einer endlosen, erfolglosen Selbstreparaturschleife verharren, die Ressourcen verschwendet, ohne das eigentliche Problem zu lösen.

### 5. Wie diagnostizierst du eine unbeabsichtigte doppelte Ausführung nach einem Fehler?

**Antwort:** Ich prüfe, ob der betroffene Fehler korrekt als "unklarer Seiteneffekt" klassifiziert wurde und ob eine automatische Wiederholung fälschlich statt einer Eskalation an menschliche Klärung angewendet wurde.

### 6. Widersprüchliche Anforderung: Team will maximale Systemverfügbarkeit durch aggressive automatische Fehlerbehebung ohne menschliche Eingriffe UND garantiert keine doppelte Ausführung bei unklaren Seiteneffekten — wie gehst du vor?

**Antwort:** Ich würde erklären, dass aggressive automatische Behebung nur für Fehler mit bekanntem, idempotenzgestütztem Ursprung sicher ist; ich würde vorschlagen, den Anteil an Fehlern mit unklaren Seiteneffekten durch bessere Ergebnisverträge und Idempotenzsicherung (siehe KB-0283) strukturell zu reduzieren, statt bei verbleibenden unklaren Fällen auf die notwendige menschliche Klärung zu verzichten.

## Praktische Labs

~~~python
# Error classification with type-specific recovery strategies and escalation limit
def classify_and_recover(error_type, attempt_count, max_retries=3):
    if error_type == "known_tool_error":
        if attempt_count < max_retries:
            return f"Auto-retry attempt {attempt_count + 1}/{max_retries} for known, idempotent tool error"
        return "Escalating to human clarification: retry limit reached for known tool error"

    if error_type == "lost_lease":
        return "Controlled takeover by another worker from last known consistent checkpoint"

    if error_type == "unclear_side_effect":
        return "Pausing and escalating to human clarification — auto-retry is unsafe for unclear side effects"

    raise ValueError(f"Unknown error type: '{error_type}'")

print(classify_and_recover("known_tool_error", attempt_count=0))
print(classify_and_recover("known_tool_error", attempt_count=3))
print(classify_and_recover("lost_lease", attempt_count=0))
print(classify_and_recover("unclear_side_effect", attempt_count=0))
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Book: [Addressing Cascading Failures — Retry and Backoff](https://sre.google/sre-book/addressing-cascading-failures/), abgerufen 2026-09-17.
2. Temporal: [Error Handling and Retries in Durable Workflows](https://docs.temporal.io/encyclopedia/retry-policies), abgerufen 2026-09-17.
3. Anthropic: [Building Effective AI Agents — Human-in-the-Loop](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.

Rollback und kompensierbare Aktionen sind kanonisch in [KB-0300](26-rollback-und-kompensierbare-aktionen.md) behandelt; langlebige Agententasks in [KB-0296](22-langlebige-agententasks.md); Ergebnisverträge in [KB-0283](09-tool-use-und-ergebnisvertraege.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Fehlerklassifikationsmodelle, die Toolfehler-Metadaten nutzen, um Retry-Sicherheit vorab einzuschätzen | Emerging | Beobachten; vielversprechend, aber noch keine breit etablierte, zuverlässige Methodik für Agentensysteme. |
| Strukturierte Eskalationsdashboards, die den Klärungsstatus unklarer Seiteneffekte über mehrere Agentenprozesse hinweg konsolidieren | Adopting | Gegenüber isolierter Fehlerbehandlung pro Prozess für konsistente, nachvollziehbare menschliche Klärung bevorzugen. |

Ein Team akzeptiert eine Fehlerbehandlungs-/Recovery-Architektur erst, wenn Fehlerklassifikation, typspezifische Recovery-Strategien und Eskalationsgrenzen dokumentiert und getestet sind.
