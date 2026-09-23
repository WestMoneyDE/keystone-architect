---
{"id": "KB-0232", "title": "Microsoft Fabric als Datenplattform", "domain": "10", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0230", "concepts": ["Lakehouse-Architektur"], "needed_for": "understanding"}, {"id": "KB-0231", "concepts": ["Data Warehouses"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Workspace-Grenzen und geteilte Capacity-Ressourcenzuweisung lokal implementieren.", "rationale": "Der Effekt geteilter Capacity über mehrere Workspaces wird erst durch konkrete Ressourcenzuweisungssimulation greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Workspace-Grenzen und Verantwortungszuordnung für einen konkreten Fabric-Anwendungsfall begründet gestalten.", "rationale": "Fehlende Workspace-Grenzen erzeugen unklare Verantwortlichkeiten und Ressourcenkonflikte zwischen Teams."}, "STAFF-TARGET": {"active": true, "scope": "Ressourcenkonflikte zwischen Teams auf geteilte Capacity-Zuweisung statt auf einen individuellen Workload-Fehler zurückführen können.", "rationale": "Mehrere Workspaces können dieselbe Capacity-Einheit teilen, was ressourcenintensive Workloads eines Teams die Performance eines anderen Teams beeinträchtigen lässt."}, "CHIEF-TARGET": {"active": true, "scope": "Microsoft Fabric als integrierte Datenplattform mit konzeptioneller Nähe zu Lakehouse-Prinzipien positionieren, ohne unbelegte Release- oder Feature-Annahmen zu treffen.", "rationale": "Als schnell weiterentwickelte Plattform sollten Aussagen über spezifische Features an aktueller Dokumentation verifiziert werden, statt auf Erinnerung oder Annahme zu basieren."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Capacity-SKU-Details und Preismodelle sind Vertiefung.", "rationale": "Kern ist das konzeptionelle Verständnis von OneLake, Workspace-Grenzen und Capacity-Sharing, nicht die kommerziellen Details."}}, "lab_validation": [{"lab_id": "KB-0232-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für geteilte Capacity-Ressourcenzuweisung über mehrere Workspaces", "evidence": "Mehrere Workspaces, die dieselbe Capacity-Einheit nutzen, konkurrieren um dasselbe Ressourcenbudget; ein ressourcenintensiver Workload in einem Workspace kann die verfügbare Kapazität für andere Workspaces derselben Capacity-Einheit reduzieren.", "limitations": "Kein echtes Microsoft-Fabric-System, keine reale Capacity-Zuweisung, keine Produktion."}]}
---
# Microsoft Fabric als Datenplattform

> **Ziel:** Microsoft Fabric integriert Datenintegration, Data-Engineering, Data-Warehousing und Analyse-Workloads auf einer gemeinsamen Speicherbasis (OneLake) mit konzeptioneller Nähe zu Lakehouse-Prinzipien (siehe [KB-0230](12-lakehouse-architektur.md)). Workspace-Grenzen und geteilte Capacity-Ressourcenzuweisung bestimmen, wie Teams voneinander isoliert oder miteinander verbunden sind — ohne unbelegte Release- oder Feature-Annahmen, da sich die Plattform schnell weiterentwickelt.

## Zweck, Mental Model und Dependencies

OneLake ist die zentrale, plattformweite Speicherschicht von Microsoft Fabric, konzeptionell vergleichbar mit einer Lakehouse-Speicherbasis (siehe [KB-0230](12-lakehouse-architektur.md)) — verschiedene Workloads (Data Engineering, Data Warehousing, Business Intelligence) greifen auf gemeinsam gespeicherte Daten zu, statt separate, isolierte Datenkopien für jeden Workload-Typ zu benötigen. Workspaces sind die primäre organisatorische Grenze in Fabric — sie gruppieren Ressourcen (Datenpipelines, Lakehouses, Warehouses, Berichte) und definieren Zugriffsberechtigungen für Teams. Capacity ist die zugrunde liegende Recheneinheit, die einem oder mehreren Workspaces zugewiesen wird — mehrere Workspaces können dieselbe Capacity-Einheit teilen, was bedeutet, dass ressourcenintensive Workloads in einem Workspace die verfügbare Rechenleistung für andere Workspaces derselben Capacity reduzieren können, wenn dies nicht bewusst geplant wird. Datenverantwortliche (fachlich und technisch) sollten pro Workspace explizit zugeordnet werden, da unklare Verantwortlichkeit bei einer plattformweiten, geteilten Speicherbasis leicht zu Verwirrung darüber führt, wer für Datenqualität und -governance eines bestimmten Datensatzes zuständig ist. Lies [KB-0230](12-lakehouse-architektur.md) und [KB-0231](13-data-warehouses.md).

~~~text
OneLake:      shared storage layer across workload types -> conceptually similar to lakehouse principles
Workspace:     organizational boundary -> groups resources, defines access permissions
Capacity:      underlying compute unit -> can be SHARED across multiple workspaces
Shared capacity: one workspace's heavy workload can reduce available compute for OTHER workspaces on the same capacity
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Workspace-Grenzen | sind Workspace-Grenzen entlang tatsächlicher Team- und Verantwortungsgrenzen gezogen? | unklare Workspace-Grenzen erzeugen unklare Zugriffs- und Datenverantwortlichkeiten |
| Capacity-Sharing-Bewusstsein | ist bekannt, welche Workspaces dieselbe Capacity-Einheit teilen? | ressourcenintensive Workloads eines Teams beeinträchtigen unbemerkt die Performance anderer Teams auf derselben Capacity |
| Fachliche/technische Verantwortungszuordnung | ist pro Workspace klar, wer fachlich und wer technisch für die Daten verantwortlich ist? | fehlende Zuordnung erzeugt Verzögerungen bei Datenqualitätsproblemen, da unklar ist, wer zuständig ist |
| Feature-/Release-Aktualität | werden Aussagen über spezifische Fabric-Features gegen aktuelle Dokumentation statt Erinnerung geprüft? | schnelle Plattformweiterentwicklung macht veraltete Annahmen über Features oder Grenzen riskant |

Implementierung: Workspace-Grenzen werden entlang tatsächlicher Team- und Verantwortungsstrukturen gezogen, nicht willkürlich oder rein technisch motiviert, damit Zugriffsberechtigungen und Datenverantwortung klar nachvollziehbar bleiben. Capacity-Zuweisung wird explizit geplant, mit Bewusstsein dafür, welche Workspaces dieselbe Capacity-Einheit teilen, und mit Monitoring, um Ressourcenkonflikte zwischen Teams frühzeitig zu erkennen. Für jeden Workspace wird explizit dokumentiert, wer fachlich (Datenqualität, Geschäftsbedeutung) und wer technisch (Pipeline-Betrieb, Zugriffskonfiguration) verantwortlich ist. Aussagen über spezifische Fabric-Features, Grenzen oder Preismodelle werden grundsätzlich gegen aktuelle Microsoft-Dokumentation verifiziert, statt auf möglicherweise veralteter Erinnerung zu basieren, da sich die Plattform kontinuierlich weiterentwickelt.

## Scalability, Reliability, Security und Observability

Fabric skaliert Datenintegration über mehrere Workload-Typen durch die gemeinsame OneLake-Speicherbasis, die separate Datenkopien für unterschiedliche Analysewerkzeuge vermeidet. Reliability-Grenze: geteilte Capacity ist ein latentes Risiko für Teams, die sich der Capacity-Sharing-Struktur nicht bewusst sind — ein ressourcenintensiver Workload eines Teams kann unerwartet die Performance eines völlig anderen, scheinbar unabhängigen Teams beeinträchtigen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Performance eines Workspace-Workloads verschlechtert sich, ohne dass sich der eigene Workload geändert hat | ein anderer Workspace auf derselben Capacity-Einheit erzeugt zusätzliche Ressourcenlast | Capacity-Zuweisung und Auslastung aller Workspaces auf derselben Capacity-Einheit prüfen |
| unklar, wer für ein Datenqualitätsproblem in einem bestimmten Workspace zuständig ist | fachliche und technische Verantwortungszuordnung für den Workspace ist nicht dokumentiert | Workspace-Dokumentation auf explizite Verantwortungszuordnung prüfen |
| ein erwartetes Feature verhält sich anders als in älterer Dokumentation oder Erinnerung beschrieben | Plattform hat sich seit der letzten Prüfung weiterentwickelt, Annahme war veraltet | aktuelle Microsoft-Fabric-Dokumentation für das betroffene Feature konsultieren, statt auf Erinnerung zu vertrauen |
| Zugriffsberechtigungen sind inkonsistent zwischen verwandten Ressourcen | Workspace-Grenzen folgen nicht den tatsächlichen Team- und Verantwortungsstrukturen | Workspace-Struktur gegen die tatsächliche organisatorische Team-/Verantwortungsstruktur vergleichen |

Security: Zugriffskontrolle in Fabric erfolgt primär über Workspace-Berechtigungen, weshalb eine sorgfältige, den tatsächlichen Verantwortungsgrenzen entsprechende Workspace-Struktur eine zentrale Sicherheitsvoraussetzung ist, nicht nur eine organisatorische Bequemlichkeit. Observability: Capacity-Auslastung pro Workspace, Ressourcenkonflikt-Häufigkeit bei geteilter Capacity und Workspace-Zugriffsprotokolle sind zentrale Metriken für Fabric-Plattform-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** plant Capacity-Zuweisung mit explizitem Bewusstsein für Sharing-Effekte zwischen Workspaces. **Principal** macht fachliche und technische Verantwortungszuordnung pro Workspace für das Team dokumentiert nachvollziehbar. **Chief** positioniert Fabric als integrierte Datenplattform mit Lakehouse-Prinzipien, verifiziert aber Feature- und Grenzaussagen konsequent gegen aktuelle Dokumentation statt Annahmen zu treffen.

Anti-Patterns: Workspace-Grenzen willkürlich statt entlang tatsächlicher Verantwortungsstrukturen ziehen; Capacity-Sharing-Effekte zwischen Teams ignorieren, bis ein Ressourcenkonflikt auftritt; veraltete Feature- oder Grenzannahmen ohne Verifikation gegen aktuelle Dokumentation als gegeben voraussetzen.

## Production Checklist

- [ ] Workspace-Grenzen entsprechen den tatsächlichen Team- und Verantwortungsstrukturen.
- [ ] Capacity-Sharing zwischen Workspaces ist bekannt und im Ressourcenplan berücksichtigt.
- [ ] Fachliche und technische Verantwortung ist pro Workspace explizit dokumentiert.
- [ ] Aussagen über spezifische Features/Grenzen sind gegen aktuelle Dokumentation verifiziert.

## Interviewfragen

### 1. Was ist OneLake, und wie verhält es sich konzeptionell zu Lakehouse-Prinzipien?

**Antwort:** OneLake ist die zentrale, plattformweite Speicherschicht von Microsoft Fabric, auf die verschiedene Workload-Typen (Data Engineering, Warehousing, BI) gemeinsam zugreifen, statt separate Datenkopien zu benötigen — konzeptionell vergleichbar mit einer Lakehouse-Speicherbasis, die unterschiedliche Analytiklasten auf einer gemeinsamen, konsistenten Datenschicht vereint.

### 2. Warum kann ein Workload in einem Fabric-Workspace die Performance eines anderen, scheinbar unabhängigen Workspace beeinträchtigen?

**Antwort:** Mehrere Workspaces können dieselbe zugrunde liegende Capacity-Einheit teilen; ein ressourcenintensiver Workload in einem Workspace kann die verfügbare Rechenleistung für andere Workspaces derselben Capacity reduzieren, wenn dies nicht bewusst geplant und überwacht wird.

### 3. Warum sollten Workspace-Grenzen entlang tatsächlicher Team- und Verantwortungsstrukturen gezogen werden?

**Antwort:** Da Zugriffsberechtigungen primär über Workspace-Grenzen kontrolliert werden, erzeugen willkürlich gezogene Grenzen unklare Zugriffs- und Datenverantwortlichkeiten, was Datenqualitätsprobleme und Sicherheitsrisiken erschwert nachzuverfolgen macht.

### 4. Wie diagnostizierst du eine unerklärliche Performanceverschlechterung in einem Fabric-Workspace?

**Antwort:** Ich prüfe die Capacity-Zuweisung und Auslastung aller Workspaces, die dieselbe Capacity-Einheit teilen — ein ressourcenintensiver Workload in einem anderen, geteilten Workspace ist eine häufige, aber leicht übersehene Ursache für unerklärliche Performanceprobleme.

### 5. Warum ist es wichtig, Aussagen über spezifische Fabric-Features gegen aktuelle Dokumentation zu verifizieren?

**Antwort:** Fabric ist eine sich schnell weiterentwickelnde Plattform; Annahmen basierend auf älterer Erinnerung oder Dokumentation können veraltet sein, was zu fehlerhaften Architekturentscheidungen führen kann, wenn sie nicht gegen die aktuelle Dokumentation geprüft werden.

### 6. Widersprüchliche Anforderung: Mehrere Teams wollen unabhängige, isolierte Ressourcenkontrolle UND minimale Gesamtkosten durch geteilte Capacity-Ressourcen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass vollständige Ressourcenisolation und geteilte Capacity-Kosteneffizienz im Konflikt stehen; ich würde vorschlagen, Teams mit kritischen, latenzsensiblen Workloads auf dedizierte Capacity-Einheiten zu setzen, während Teams mit weniger kritischen, flexibleren Workloads geteilte Capacity nutzen können, um einen bewussten Kompromiss zwischen Isolation und Kosten zu erreichen, statt eine einzelne Struktur für alle Teams zu erzwingen.

## Praktische Labs

~~~python
# Shared capacity resource contention model
capacity_budget = 100  # compute units

workspaces = {
    "team_a": {"capacity_group": "shared_1", "requested_units": 40},
    "team_b": {"capacity_group": "shared_1", "requested_units": 70},  # heavy workload
    "team_c": {"capacity_group": "shared_2", "requested_units": 30},  # isolated capacity
}

def check_capacity_contention(workspaces, budget):
    groups = {}
    for name, ws in workspaces.items():
        groups.setdefault(ws["capacity_group"], []).append((name, ws["requested_units"]))

    for group, members in groups.items():
        total_requested = sum(units for _, units in members)
        if total_requested > budget:
            print(f"Capacity group '{group}': CONTENTION - requested {total_requested}, budget {budget}")
        else:
            print(f"Capacity group '{group}': OK - requested {total_requested}, budget {budget}")

check_capacity_contention(workspaces, capacity_budget)
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft: [Microsoft Fabric Documentation — OneLake Overview](https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview), abgerufen 2026-09-17.
2. Microsoft: [Microsoft Fabric — Workspaces](https://learn.microsoft.com/en-us/fabric/get-started/workspaces), abgerufen 2026-09-17.
3. Microsoft: [Microsoft Fabric Capacity Planning](https://learn.microsoft.com/en-us/fabric/enterprise/capacity-planning), abgerufen 2026-09-17.

Lakehouse-Prinzipien sind kanonisch in [KB-0230](12-lakehouse-architektur.md) behandelt. Fabric ist eine sich schnell weiterentwickelnde Plattform — spezifische Feature- und Preisdetails vor Einsatz zwingend an aktueller Microsoft-Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Direkter Lakehouse-Zugriff über offene Tabellenformat-Schnittstellen (Interoperabilität mit externen Engines) | Adopting | Für Multi-Engine-Umgebungen Interoperabilitätsfähigkeit gegen aktuelle Dokumentation prüfen. |
| KI-gestützte Copilot-Funktionen für Datenintegration und Abfrageerstellung innerhalb der Plattform | Adopting | Produktivitätsgewinn gegen Datenschutz- und Governance-Implikationen für den jeweiligen Anwendungsfall abwägen. |

Ein Team akzeptiert ein Fabric-Plattformdesign erst, wenn Workspace-Grenzen dokumentiert, Capacity-Sharing-Risiken geprüft und Feature-Annahmen gegen aktuelle Dokumentation verifiziert sind.
