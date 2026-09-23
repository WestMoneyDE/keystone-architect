---
{"id": "KB-0495", "title": "Azure Monitor und Application Insights", "domain": "20", "sequence": 15, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0478", "concepts": ["CloudWatch und AWS-Betriebssignale"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ressourcenmetriken, Logs und verteilte Traces in Azure Monitor und Application Insights anhand offizieller Dokumentation verbinden und einen Anfragepfad über mehrere Dienste hinweg nachvollziehen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Architektur explizit entscheiden, wie Instrumentierung, Log-Analytics-Workspacegrenzen und verteiltes Tracing gestaltet werden, um diagnostische Lücken über Dienstgrenzen hinweg zu vermeiden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerklärliche diagnostische Lücke in einem Anfragepfad auf eine fehlende Instrumentierung oder eine falsch abgegrenzte Log-Analytics-Workspace-Grenze zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Observability-Standards im Unternehmen anhand konsistenter Instrumentierung und Workspace-Strategie über alle Azure-Dienste hinweg festlegen, statt fragmentierter, dienstspezifischer Ad-hoc-Lösungen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der Application-Insights-SDK-Sampling-Algorithmen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Metriken-/Logs-/Traces-Verbindung als diagnostische Grundlage, nicht die SDK-Interna."}}, "lab_validation": [{"lab_id": "KB-0495-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Dokumentation zu Azure Monitor und Application Insights, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie Azure Monitor Ressourcenmetriken und Plattformlogs zentral sammelt, wie Application Insights als Application-Performance-Management-Komponente verteilte Traces über einen Anfragepfad hinweg korreliert, und wie Log-Analytics-Workspacegrenzen bestimmen, welche Logs gemeinsam abgefragt werden können, mit besonderem Fokus auf diagnostische Lücken, die entstehen, wenn Instrumentierung fehlt oder Workspaces falsch abgegrenzt sind.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Monitoring-Instanz konfiguriert."}]}
---
# Azure Monitor und Application Insights

> **Ziel:** Azure Monitor ist der zentrale Sammlungsdienst für Ressourcenmetriken und Plattformlogs über alle Azure-Dienste hinweg; Application Insights ist die darauf aufbauende Application-Performance-Management-Komponente, die verteilte Traces über einen Anfragepfad hinweg korreliert und damit Metriken (aggregierte Zahlenwerte), Logs (strukturierte Ereignisdatensätze) und Traces (der tatsächliche Weg einer einzelnen Anfrage durch mehrere Dienste) zu einem zusammenhängenden diagnostischen Bild verbindet. Der zentrale Punkt dieses Kapitels ist, dass eine unerklärliche diagnostische Lücke in einem Anfragepfad — etwa ein Abschnitt, in dem nicht nachvollziehbar ist, was zwischen zwei Diensten geschah — typischerweise nicht auf ein tatsächliches Systemproblem hindeutet, sondern auf fehlende Instrumentierung (ein Dienst sendet keine Traces an Application Insights) oder eine falsch abgegrenzte Log-Analytics-Workspace-Grenze (Logs verschiedener Dienste landen in getrennten Workspaces und können nicht gemeinsam abgefragt werden), was die eigentliche Fehlerursache verschleiert statt sie aufzudecken.

## Zweck, Mental Model und Dependencies

Azure Monitor sammelt zwei grundlegend unterschiedliche Datenarten: Metriken (numerische, zeitreihenbasierte Messwerte wie CPU-Auslastung oder Anfragerate, mit geringer Speicherungsgranularität aber hoher Abfragegeschwindigkeit) und Logs (strukturierte, oft hochvolumige Ereignisdatensätze, die über Kusto Query Language, KQL, flexibel abgefragt werden können, aber langsamer und teurer in der Abfrage sind als Metriken). Application Insights baut auf dieser Grundlage auf und fügt verteiltes Tracing hinzu — eine eindeutige Operation-ID wird bei Eintritt einer Anfrage in das System erzeugt und über alle beteiligten Dienste propagiert, sodass ein einzelner Anfragepfad über mehrere Microservices hinweg als zusammenhängende Kette rekonstruiert werden kann, was strukturell parallel zur AWS-CloudWatch-mit-X-Ray-Kombination ist (siehe [KB-0478](../19-aws/16-cloudwatch-und-aws-betriebssignale.md)), jedoch mit Application Insights als stärker integrierter, End-to-End-APM-Lösung statt einer separaten Tracing-Komponente. Eine zentrale strukturelle Entscheidung ist die Log-Analytics-Workspace-Topologie: Werden Logs verschiedener Dienste oder Teams in getrennten Workspaces gesammelt, können sie nicht in einer einzigen KQL-Abfrage gemeinsam korreliert werden, was bei einer Fehlersuche über Dienstgrenzen hinweg eine künstliche diagnostische Lücke erzeugt — eine zentralisierte oder zumindest cross-workspace-abfragbare Topologie (Azure Monitor unterstützt Cross-Workspace-Queries innerhalb bestimmter Grenzen) ist notwendig, um einen Anfragepfad, der mehrere Teams oder Dienste durchquert, vollständig diagnostizieren zu können.

~~~text
Azure Monitor: central collection -- METRICS (numeric time series, low storage, fast query)
                                   + LOGS (structured events, KQL query, higher volume, slower/costlier)
Application Insights: built on top -- DISTRIBUTED TRACING
  -> unique Operation ID at request entry, propagated across ALL involved services
  -> reconstructs single request path across multiple microservices as connected chain
  (parallel to AWS CloudWatch + X-Ray, see KB-0478 -- but more tightly integrated APM here)
KEY STRUCTURAL DECISION: Log Analytics WORKSPACE topology
  services/teams in SEPARATE workspaces -> CANNOT jointly correlate in single KQL query
    -> creates ARTIFICIAL diagnostic gap when troubleshooting across service boundaries
  centralized OR cross-workspace-queryable topology needed for full request-path diagnosis
DIAGNOSTIC GAP root causes (in a request path):
  1. missing instrumentation (a service doesn't send traces to App Insights)
  2. misaligned workspace boundary (logs land in separate, non-jointly-queryable workspaces)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Metriken | numerische Zeitreihen, geringe Granularität, schnelle Abfrage | für Alarmierung und Trendanalyse |
| Logs (KQL) | strukturierte Ereignisdatensätze, flexible Abfrage | für detaillierte Ursachenanalyse |
| Application Insights / Tracing | Operation-ID-basierte Korrelation über Dienste hinweg | rekonstruiert vollständigen Anfragepfad |
| Log-Analytics-Workspace-Grenze | bestimmt, welche Logs gemeinsam abfragbar sind | falsche Abgrenzung erzeugt diagnostische Lücken |

Implementierung: Für jeden Dienst im Anfragepfad wird explizit geprüft, ob Application-Insights-Instrumentierung aktiv ist und die Operation-ID korrekt propagiert wird, statt stillschweigend anzunehmen, dass Tracing vollständig ist. Die Log-Analytics-Workspace-Topologie wird explizit so gestaltet, dass Dienste, deren Anfragepfade sich überschneiden, entweder denselben Workspace nutzen oder über Cross-Workspace-Queries gemeinsam abfragbar sind. Alarmierung wird primär auf Metriken statt auf teurere Log-Abfragen aufgebaut, während Logs und Traces für die tiefergehende Ursachenanalyse nach einem Alarm genutzt werden.

## Scalability, Reliability, Security und Observability

Azure Monitor und Application Insights skalieren die diagnostische Vollständigkeit proportional zur tatsächlichen Instrumentierungsabdeckung und zur Konsistenz der Workspace-Topologie; die Reliability-Grenze liegt darin, dass eine unvollständige Instrumentierung oder eine fragmentierte Workspace-Struktur proportional zur Fragmentierung zu diagnostischen Lücken führt, die schwerer zu erkennen sind als ein vollständiger Ausfall.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Abschnitt eines Anfragepfads ist im Trace nicht sichtbar | der betroffene Dienst sendet keine Traces an Application Insights | prüfen, ob die Application-Insights-Instrumentierung für diesen Dienst aktiv und korrekt konfiguriert ist |
| Logs verschiedener Dienste können nicht gemeinsam in einer Abfrage korreliert werden | die Dienste nutzen getrennte Log-Analytics-Workspaces ohne Cross-Workspace-Query-Konfiguration | prüfen, ob eine Cross-Workspace-Query oder eine zentralisierte Workspace-Topologie eingerichtet werden kann |
| eine echte Fehlerursache wird trotz vorhandener Metriken nicht erkannt | Alarmierung basiert nur auf aggregierten Metriken ohne Verknüpfung zu detaillierten Logs/Traces | prüfen, ob Alarme mit einer Drill-down-Möglichkeit zu Logs und Traces verknüpft sind |

Security: Zugriff auf Log-Analytics-Workspaces sollte über Azure RBAC granular gesteuert werden, da Logs sensible Anwendungsdaten enthalten können. Observability: Die tatsächliche Instrumentierungsabdeckung (Anteil der Dienste mit aktivem Tracing), die Vollständigkeit rekonstruierter Anfragepfade, und die Häufigkeit von Cross-Workspace-Query-Nutzung sind zentrale Metriken zur Bewertung der Observability-Infrastruktur selbst.

## Trade-offs und Entscheidungen

**Staff** stellt sicher, dass ein einzelner Dienst korrekt instrumentiert ist und Traces an Application Insights sendet. **Principal** entwirft die Log-Analytics-Workspace-Topologie so, dass Anfragepfade über Dienstgrenzen hinweg vollständig diagnostizierbar bleiben. **Chief** legt unternehmensweite Observability-Standards für konsistente Instrumentierung fest.

Anti-Patterns: Dienste ohne Application-Insights-Instrumentierung in Produktion betreiben und diagnostische Lücken im Trace als Systemverhalten statt als Instrumentierungslücke fehlinterpretieren; Log-Analytics-Workspaces ohne Rücksicht auf tatsächliche Anfragepfade fragmentieren; Alarmierung ausschließlich auf teuren Log-Abfragen statt auf Metriken aufbauen.

## Production Checklist

- [ ] Jeder Dienst im Anfragepfad hat aktive Application-Insights-Instrumentierung mit korrekter Operation-ID-Propagierung.
- [ ] Die Log-Analytics-Workspace-Topologie ermöglicht gemeinsame Abfrage von Logs entlang tatsächlicher Anfragepfade.
- [ ] Alarmierung basiert primär auf Metriken mit Drill-down-Möglichkeit zu Logs/Traces.
- [ ] Zugriff auf Workspaces ist über RBAC granular gesteuert.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Metriken und Logs in Azure Monitor?

**Antwort:** Metriken sind numerische Zeitreihen mit geringer Speicherungsgranularität und schneller Abfrage, geeignet für Alarmierung; Logs sind strukturierte Ereignisdatensätze mit flexibler, aber langsamerer und teurerer KQL-Abfrage, geeignet für detaillierte Ursachenanalyse.

### 2. Wie korreliert Application Insights einen Anfragepfad über mehrere Dienste hinweg?

**Antwort:** Über eine eindeutige Operation-ID, die bei Eintritt einer Anfrage erzeugt und über alle beteiligten Dienste propagiert wird.

### 3. Was bewirkt eine Log-Analytics-Workspace-Grenze?

**Antwort:** Sie bestimmt, welche Logs gemeinsam in einer einzigen KQL-Abfrage korreliert werden können — Logs in getrennten Workspaces sind nicht ohne Weiteres gemeinsam abfragbar.

### 4. Welche zwei Hauptursachen führen zu diagnostischen Lücken in einem Anfragepfad?

**Antwort:** Fehlende Instrumentierung eines Dienstes (er sendet keine Traces an Application Insights) und eine falsch abgegrenzte Log-Analytics-Workspace-Grenze, die eine gemeinsame Abfrage verhindert.

### 5. Wie gehst du vor, wenn ein Abschnitt eines Anfragepfads im Trace nicht sichtbar ist?

**Antwort:** Ich prüfe zuerst, ob der betroffene Dienst überhaupt Application-Insights-Instrumentierung aktiv hat und die Operation-ID korrekt propagiert, bevor ich ein tatsächliches Systemproblem vermute.

### 6. Widersprüchliche Anforderung: Team will vollständige, granulare Observability über alle Dienste UND minimale Logging-Kosten — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, Alarmierung primär auf kostengünstigeren Metriken aufzubauen und detailliertes, teureres Log-/Trace-Sampling gezielt auf kritische Anfragepfade zu beschränken, statt vollständige, granulare Instrumentierung undifferenziert über alle Dienste hinweg zu aktivieren.

## Praktische Labs

~~~python
# Conceptual request-path reconstruction from trace spans (not executed against a real Azure account):

def reconstruct_path(spans, operation_id):
    matching = [s for s in spans if s["operation_id"] == operation_id]
    matching.sort(key=lambda s: s["start_time"])
    gaps = []
    for i in range(len(matching) - 1):
        if matching[i]["end_time"] < matching[i + 1]["start_time"]:
            gaps.append((matching[i]["service"], matching[i + 1]["service"]))
    return matching, gaps

spans = [
    {"service": "frontend", "operation_id": "op-1", "start_time": 0, "end_time": 10},
    {"service": "api-gateway", "operation_id": "op-1", "start_time": 10, "end_time": 20},
    {"service": "backend", "operation_id": "op-1", "start_time": 35, "end_time": 50},
]

path, gaps = reconstruct_path(spans, "op-1")
print(f"path: {[s['service'] for s in path]}")
print(f"gaps (likely missing instrumentation): {gaps}")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Azure Monitor Overview](https://learn.microsoft.com/en-us/azure/azure-monitor/overview), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Application Insights Overview — Distributed Tracing](https://learn.microsoft.com/en-us/azure/azure-monitor/app/distributed-tracing-telemetry-correlation), abgerufen 2026-09-18.

AWS CloudWatch und AWS-Betriebssignale sind kanonisch in [KB-0478](../19-aws/16-cloudwatch-und-aws-betriebssignale.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| OpenTelemetry-basierte Instrumentierung als anbieterneutrale Alternative zum proprietären Application-Insights-SDK | Evaluating | Gegenüber dem proprietären SDK erst nach Prüfung der Portabilitätsanforderungen und des tatsächlichen Funktionsumfangs im Vergleich bevorzugen. |

Ein Team akzeptiert eine Azure-Monitor-Konfiguration erst, wenn ein vollständiger Anfragepfad über alle beteiligten Dienste hinweg nachweislich ohne diagnostische Lücke rekonstruierbar ist.
