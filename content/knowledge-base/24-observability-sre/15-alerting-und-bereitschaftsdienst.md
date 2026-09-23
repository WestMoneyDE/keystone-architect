---
{"id": "KB-0579", "title": "Alerting und Bereitschaftsdienst", "domain": "24", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "CLOUD", "MLOPS"], "requires": [{"id": "KB-0566", "concepts": ["Error Budgets"], "needed_for": "understanding"}, {"id": "KB-0565", "concepts": ["SLI, SLO und SLA"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Symptomalarme und Burn-Rate-basierte Alarmierung anhand offizieller Dokumentation korrekt konfigurieren und Eskalationsrouten für einen Bereitschaftsdienst einrichten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein konkretes System explizit gestalten, welche Alarme tatsächlich handlungsfähige, symptombasierte Signale liefern, statt Alarme für jede beobachtbare Abweichung zu erzeugen und dadurch Alarmmüdigkeit zu riskieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen Alarm, auf den keine sinnvolle Handlung folgen kann, als strukturelles Problem erkennen und auf einen tatsächlich handlungsfähigen Symptomalarm zurückführen oder den Alarm entfernen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Alerting- und Eskalationsgestaltung festlegen, die Alarmmüdigkeit strukturell begrenzen und jeden aktiven Alarm auf eine tatsächliche Handlungsmöglichkeit zurückführen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Alerting- und Eskalationswerkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Symptomalarmen, Burn Rates und Eskalationsgestaltung als Entscheidungsgrundlage, nicht die interne Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0579-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Burn-Rate-basierter Alarmierung, kein produktives Alerting-System verwendet", "evidence": "Ein lokales Skript simuliert, wie eine schnelle Fehlerbudget-Verbrauchsrate (hohe Burn Rate) frühzeitig alarmiert, während eine langsame, aber stetige Verbrauchsrate erst bei tatsächlicher Gefährdung des Fehlerbudgets alarmiert, und zeigt damit den Unterschied zwischen reinen Schwellenwertalarmen und Burn-Rate-basierter Alarmierung.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Alerting-System."}]}
---
# Alerting und Bereitschaftsdienst

> **Ziel:** Alerting soll Menschen im Bereitschaftsdienst genau dann benachrichtigen, wenn eine tatsächliche, handlungsfähige Reaktion erforderlich ist — nicht bei jeder beobachtbaren Abweichung. Der zentrale Punkt dieses Kapitels ist die Unterscheidung zwischen **Symptomalarmen** (die ein tatsächlich für Nutzer spürbares Problem anzeigen, etwa über die bereits in [KB-0566](02-error-budgets.md) behandelte Burn-Rate des Fehlerbudgets) und Ursachenalarmen oder reinen Schwellenwertalarmen, die zwar formal korrekt eine Abweichung melden, aber häufig kein tatsächlich handlungsfähiges Signal liefern und damit zu **Alarmmüdigkeit** führen — einem Zustand, in dem Bereitschaftsdienstpersonal wegen der Häufigkeit nicht handlungsfähiger Alarme beginnt, Alarme systematisch zu ignorieren oder verzögert zu bearbeiten, wodurch tatsächlich kritische Alarme im Rauschen untergehen.

## Zweck, Mental Model und Dependencies

Die bereits in [KB-0566](02-error-budgets.md) behandelte Burn-Rate (die Geschwindigkeit, mit der das Fehlerbudget verbraucht wird) ist die strukturelle Grundlage für Symptomalarme: Statt bei jeder einzelnen Fehlerbeobachtung zu alarmieren, alarmiert ein Burn-Rate-basierter Alarm erst, wenn die Verbrauchsgeschwindigkeit des Fehlerbudgets tatsächlich auf eine drohende Verletzung des zugrunde liegenden SLO (siehe [KB-0565](01-sli-slo-und-sla.md)) hindeutet — eine kurze, isolierte Fehlerspitze, die das Fehlerbudget kaum beansprucht, löst dabei keinen Alarm aus, während eine schnelle, anhaltende Verbrauchsrate frühzeitig alarmiert, bevor das Budget tatsächlich erschöpft ist. Dieser Ansatz unterscheidet sich grundlegend von reinen Schwellenwertalarmen (etwa "CPU über 80%"), die formal korrekt eine Abweichung melden, aber häufig keine direkte Aussage darüber treffen, ob diese Abweichung tatsächlich ein für Nutzer spürbares Problem verursacht — ein System kann dauerhaft bei 85% CPU-Auslastung stabil und für Nutzer unauffällig laufen, während ein solcher Schwellenwertalarm dennoch kontinuierlich auslöst. Die zentrale Konsequenz für Alerting-Gestaltung ist, dass jeder aktive Alarm auf eine konkrete, sinnvolle Handlungsmöglichkeit zurückführbar sein muss: Wenn eine Person im Bereitschaftsdienst auf einen Alarm regelmäßig keine sinnvolle Handlung ausführen kann (weder eine direkte Behebung noch eine sinnvolle Eskalation), ist der Alarm strukturell fehlerhaft gestaltet und sollte entweder auf ein tatsächlich handlungsfähiges Symptomsignal umgestellt oder vollständig entfernt werden — ein System mit vielen, überwiegend nicht handlungsfähigen Alarmen führt unvermeidlich zu Alarmmüdigkeit, bei der auch tatsächlich kritische Alarme im allgemeinen Rauschen untergehen.

~~~text
Alerting: notify on-call humans EXACTLY when actual, actionable response is required
  NOT on every observable deviation
KEY DISTINCTION:
  SYMPTOM alarms (show actual user-perceptible problem, e.g. via error budget burn rate from KB-0566)
  vs CAUSE/pure THRESHOLD alarms (formally correct deviation report, often NOT actually actionable)
    -> leads to ALARM FATIGUE: on-call staff starts systematically ignoring/delaying alarms
       due to frequency of non-actionable ones -> truly critical alarms get lost in noise
BURN RATE (KB-0566) = structural basis for symptom alarms:
  instead of alarming on every single error observation
  burn-rate-based alarm fires only when error-budget consumption SPEED indicates
    an impending SLO (KB-0565) violation
  brief isolated error spike barely touching budget -> NO alarm
  fast, sustained consumption rate -> alarms EARLY, before budget actually exhausted
DIFFERS fundamentally from pure threshold alarms (e.g. "CPU > 80%"):
  formally correct deviation report, but often no direct statement whether it causes
  an actual user-perceptible problem
  system can run stably at 85% CPU, unnoticeable to users, while threshold alarm still fires continuously
CENTRAL CONSEQUENCE for alerting design:
  every active alarm must trace back to a concrete, meaningful action
  if on-call person regularly CANNOT take meaningful action on an alarm
    (neither direct fix nor meaningful escalation)
    -> alarm is structurally misdesigned -> convert to actionable symptom signal, or remove entirely
  many mostly-non-actionable alarms -> alarm fatigue -> truly critical alarms lost in general noise
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Symptomalarm | zeigt tatsächlich für Nutzer spürbares Problem | handlungsfähiges Signal statt reiner Abweichungsmeldung |
| Burn-Rate-Alarm | alarmiert bei drohender SLO-Verletzung, nicht bei jeder Einzelabweichung | verhindert übermäßige, nicht handlungsfähige Alarmierung |
| Alarmmüdigkeit | Folge zu vieler nicht handlungsfähiger Alarme | führt zu ignorierten oder verzögert bearbeiteten kritischen Alarmen |
| Eskalationsrouting | leitet unbeantwortete Alarme an nächste Bereitschaftsebene weiter | stellt sicher, dass kritische Alarme tatsächlich bearbeitet werden |

Implementierung: Alarme werden primär auf Basis von Burn-Rate-Berechnungen über das Fehlerbudget definiert, statt auf reine Schwellenwertüberschreitungen. Jeder aktive Alarm wird periodisch daraufhin geprüft, ob Bereitschaftspersonal tatsächlich eine sinnvolle Handlung ausführen kann; nicht handlungsfähige Alarme werden entfernt oder umgestaltet. Eskalationsrouten stellen sicher, dass unbeantwortete, kritische Alarme automatisch an die nächste Bereitschaftsebene weitergeleitet werden.

## Scalability, Reliability, Security und Observability

Alerting skaliert die tatsächliche Reaktionsfähigkeit proportional zum Anteil handlungsfähiger, symptombasierter Alarme; die Reliability-Grenze liegt darin, dass ein hoher Anteil nicht handlungsfähiger Alarme zu Alarmmüdigkeit führt und dadurch die Reaktionsfähigkeit auf tatsächlich kritische Alarme strukturell verschlechtert, unabhängig von der formalen Vollständigkeit der Alarmabdeckung.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Bereitschaftspersonal reagiert verzögert oder gar nicht auf Alarme | Alarmmüdigkeit durch zu viele, überwiegend nicht handlungsfähige Alarme liegt vor | den Anteil handlungsfähiger Alarme prüfen und nicht handlungsfähige Alarme entfernen oder umgestalten |
| ein System löst kontinuierlich Alarme aus, ohne dass Nutzer ein Problem melden | reiner Schwellenwertalarm ohne Bezug zu tatsächlicher SLO-Gefährdung | den Alarm auf Burn-Rate-basierte, symptombezogene Alarmierung umstellen |
| ein kritischer Vorfall wird spät erkannt, obwohl formal ein Alarm existierte | der Alarm war Teil eines von Alarmmüdigkeit betroffenen, überfluteten Alarmstroms | die Gesamtzahl aktiver Alarme reduzieren und Eskalationsrouten für kritische Signale priorisieren |

Security: Alerting-Kanäle (etwa Benachrichtigungsintegrationen) sollten nicht ohne Zugriffskontrolle manipulierbar sein, da eine unterdrückte oder gefälschte Alarmierung kritische Vorfälle verdecken könnte. Observability: Die tatsächliche Handlungsquote pro Alarmtyp (wie oft ein Alarm tatsächlich zu einer sinnvollen Handlung führt) ist ein zentrales Signal zur Bewertung der Alerting-Qualität selbst.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Burn-Rate-basierte Alarme für einen gegebenen Dienst korrekt. **Principal** entwirft die vollständige Alerting- und Eskalationsstrategie für ein System, die Alarmmüdigkeit strukturell begrenzt. **Chief** legt unternehmensweite Standards für Alerting-Gestaltung fest, die jeden aktiven Alarm auf eine tatsächliche Handlungsmöglichkeit zurückführen.

Anti-Patterns: Alarme für jede beobachtbare Abweichung statt für tatsächlich symptombasierte, handlungsfähige Signale erzeugen; reine Schwellenwertalarme ohne Bezug zu tatsächlicher Nutzerwirkung dauerhaft aktiv lassen; eine hohe Anzahl aktiver Alarme als Zeichen umfassender Überwachung statt als Alarmmüdigkeitsrisiko betrachten.

## Production Checklist

- [ ] Alarme basieren primär auf Burn-Rate-Berechnungen über das Fehlerbudget, nicht auf reinen Schwellenwerten.
- [ ] Jeder aktive Alarm ist auf eine konkrete, sinnvolle Handlungsmöglichkeit zurückführbar.
- [ ] Eskalationsrouten leiten unbeantwortete, kritische Alarme automatisch weiter.
- [ ] Die Handlungsquote pro Alarmtyp wird periodisch überwacht, um Alarmmüdigkeit frühzeitig zu erkennen.

## Interviewfragen

### 1. Was unterscheidet einen Symptomalarm von einem reinen Schwellenwertalarm?

**Antwort:** Ein Symptomalarm zeigt ein tatsächlich für Nutzer spürbares Problem an, während ein reiner Schwellenwertalarm formal korrekt eine Abweichung meldet, ohne notwendigerweise eine tatsächliche Nutzerauswirkung zu belegen.

### 2. Wie funktioniert Burn-Rate-basierte Alarmierung?

**Antwort:** Sie alarmiert erst, wenn die Verbrauchsgeschwindigkeit des Fehlerbudgets auf eine drohende SLO-Verletzung hindeutet, statt bei jeder einzelnen Fehlerbeobachtung zu alarmieren.

### 3. Was ist Alarmmüdigkeit und wie entsteht sie?

**Antwort:** Ein Zustand, in dem Bereitschaftspersonal wegen der Häufigkeit nicht handlungsfähiger Alarme beginnt, Alarme systematisch zu ignorieren oder verzögert zu bearbeiten, wodurch tatsächlich kritische Alarme im Rauschen untergehen.

### 4. Welches Kriterium bestimmt, ob ein Alarm strukturell korrekt gestaltet ist?

**Antwort:** Ob eine Person im Bereitschaftsdienst auf diesen Alarm regelmäßig eine konkrete, sinnvolle Handlung ausführen kann — andernfalls ist der Alarm fehlerhaft gestaltet.

### 5. Wie gehst du vor, wenn Bereitschaftspersonal verzögert oder gar nicht auf Alarme reagiert?

**Antwort:** Ich prüfe den Anteil handlungsfähiger Alarme, da eine hohe Anzahl nicht handlungsfähiger Alarme zu Alarmmüdigkeit führt, und entferne oder gestalte nicht handlungsfähige Alarme um.

### 6. Widersprüchliche Anforderung: Team will vollständige Alarmabdeckung für jede beobachtbare Abweichung UND minimale Alarmmüdigkeit im Bereitschaftsdienst — wie gehst du vor?

**Antwort:** Ich würde ausschließlich symptombasierte, burn-rate-gestützte Alarme aktiv im Bereitschaftsdienst eskalieren, während weniger kritische, nicht unmittelbar handlungsfähige Abweichungen in Dashboards statt als aktive Alarme sichtbar bleiben, um vollständige Beobachtbarkeit mit minimaler Alarmmüdigkeit zu verbinden.

## Praktische Labs

~~~python
# Local, deterministic simulation of burn-rate-based vs pure threshold alerting (executed locally, no real alerting system):

def burn_rate_alert(budget_remaining_pct, consumption_rate_per_hour):
    hours_to_exhaustion = budget_remaining_pct / consumption_rate_per_hour if consumption_rate_per_hour > 0 else float("inf")
    return {"alert": hours_to_exhaustion < 4, "hours_to_exhaustion": hours_to_exhaustion}

print("slow, isolated spike:", burn_rate_alert(budget_remaining_pct=95, consumption_rate_per_hour=1))
print("fast, sustained burn:", burn_rate_alert(budget_remaining_pct=95, consumption_rate_per_hour=30))
~~~

## Dependencies, Cross-References und Quellen

1. Google SRE Book: [My Philosophy on Alerting (Rob Ewaschuk)](https://sre.google/workbook/alerting-on-slos/), abgerufen 2026-09-18.
2. PagerDuty-Dokumentation: [Incident Response and Escalation](https://support.pagerduty.com/docs/escalation-policies), abgerufen 2026-09-18.

Fehlerbudgets und Burn Rates sind kanonisch in [KB-0566](02-error-budgets.md) behandelt; SLI/SLO-Grundlagen in [KB-0565](01-sli-slo-und-sla.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatische Alarmkorrelation zur Bündelung zusammenhängender Alarme während eines einzelnen Vorfalls | Evaluating | Gegen die bestehende, manuell gestaltete Eskalationsstrategie evaluieren, bevor automatische Korrelation als alleinige Grundlage für Eskalationsentscheidungen eingesetzt wird. |

Ein Team akzeptiert eine Alerting-Strategie erst, wenn jeder aktive Alarm nachweislich auf eine tatsächliche Handlungsmöglichkeit zurückführbar ist und die Handlungsquote regelmäßig überwacht wird, statt formale Alarmvollständigkeit als Ziel zu behandeln.
