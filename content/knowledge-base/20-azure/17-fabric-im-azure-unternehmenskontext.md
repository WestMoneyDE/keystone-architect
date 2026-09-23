---
{"id": "KB-0497", "title": "Fabric im Azure-Unternehmenskontext", "domain": "20", "sequence": 17, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0482", "concepts": ["Entra-Tenant-Design für Azure"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Tenant-, Workspace- und Kapazitätsentscheidungen in Microsoft Fabric anhand offizieller Dokumentation mit der Azure-Entra-Identitätsstruktur verbinden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Unternehmensarchitektur explizit entscheiden, wie Fabric-Workspaces und -Kapazitäten organisiert werden und welches Team welche Ownership über Tenant-, Workspace- und Kapazitätsebene trägt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unklare Verantwortlichkeit oder einen Kapazitätsengpass in Fabric auf eine fehlende explizite Ownership-Zuordnung auf Tenant-, Workspace- oder Kapazitätsebene zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Governance-Richtlinien für Fabric im Unternehmen anhand klarer Ownership-Zuordnung auf Tenant-, Workspace- und Kapazitätsebene statt undifferenzierter, unternehmensweiter Nutzung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die konkrete Data-Engineering-Mechanik innerhalb von Fabric (Pipelines, Lakehouse-Implementierung) ist in Domain 10 behandelt und hier bewusst nicht vertieft.", "rationale": "Kern dieses Kapitels ist die organisatorische Einordnung (Tenant/Workspace/Kapazität/Ownership) im Azure-Unternehmenskontext, nicht die Data-Engineering-Mechanik selbst."}}, "lab_validation": [{"lab_id": "KB-0497-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Microsoft-Dokumentation zu Microsoft Fabric, kein aktives Azure-Konto verwendet", "evidence": "Anhand offizieller Microsoft-Dokumentation wird nachvollzogen, wie ein Fabric-Tenant an die Entra-ID-Organisationsstruktur gekoppelt ist, wie Workspaces als Organisationseinheit für Teams und Projekte dienen, und wie Kapazitäten (Fabric Capacity Units) die verfügbaren Rechenressourcen über mehrere Workspaces hinweg bündeln, mit expliziter Abgrenzung zur reinen Data-Engineering-Mechanik, die in Domain 10 dieser Wissensdatenbank behandelt wird.", "limitations": "Kein aktives Azure-Konto verwendet, keine reale Fabric-Instanz konfiguriert."}]}
---
# Fabric im Azure-Unternehmenskontext

> **Ziel:** Microsoft Fabric ist eine vereinheitlichte Analytics-Plattform, deren organisatorische Struktur (nicht die Data-Engineering-Mechanik, die separat in Domain 10 dieser Wissensdatenbank behandelt wird) auf drei Ebenen aufbaut: **Tenant** (die oberste Organisationsebene, direkt gekoppelt an die Azure-Entra-ID-Organisationsstruktur, siehe [KB-0482](02-entra-tenant-design-fuer-azure.md)), **Workspace** (eine Organisationseinheit innerhalb des Tenants, die Teams oder Projekten zugeordnet wird und Zugriffsrechte sowie Inhalte wie Lakehouses, Pipelines und Berichte bündelt) und **Kapazität** (Fabric Capacity Units, die Rechenressourcen bereitstellen und über mehrere Workspaces hinweg zugeordnet oder isoliert werden können). Der zentrale Punkt dieses Kapitels ist, dass eine unklare Verantwortlichkeit oder ein Kapazitätsengpass in Fabric typischerweise nicht auf ein technisches Problem der Plattform selbst hindeutet, sondern auf eine fehlende explizite Ownership-Zuordnung auf einer dieser drei Ebenen — wenn nicht klar definiert ist, welches Team welchen Workspace verantwortet oder welche Kapazität welchem Anwendungsfall zugeordnet ist, entstehen Konflikte um gemeinsam genutzte Ressourcen oder unklare Eskalationswege bei Problemen.

## Zweck, Mental Model und Dependencies

Ein Fabric-Tenant ist direkt an die Azure-Entra-ID-Organisationsstruktur gekoppelt — die Tenant-Grenze in Fabric entspricht strukturell der Entra-ID-Tenant-Grenze, wodurch dieselben Identitäts- und Zugriffskontrollmechanismen, die für andere Azure-Ressourcen gelten (siehe [KB-0482](02-entra-tenant-design-fuer-azure.md)), auch für Fabric-Ressourcen greifen, statt eine separate, isolierte Identitätsverwaltung für die Analytics-Plattform aufzubauen. Innerhalb eines Tenants organisieren Workspaces Inhalte und Zugriffsrechte pro Team oder Projekt — ein Workspace bündelt typischerweise die Lakehouses, Pipelines, Berichte und weiteren Analytics-Artefakte eines zusammengehörigen Anwendungsfalls, wobei Zugriffsrechte auf Workspace-Ebene granular vergeben werden können, um zu verhindern, dass Teams versehentlich auf Ressourcen anderer Teams zugreifen oder diese verändern. Kapazitäten (Fabric Capacity Units) stellen die tatsächliche Rechenleistung bereit, die von einem oder mehreren Workspaces genutzt wird — eine zentrale architektonische Entscheidung ist, ob mehrere Workspaces eine gemeinsame Kapazität teilen (kosteneffizienter, aber mit dem Risiko, dass ein rechenintensiver Workspace die Kapazität für andere Workspaces erschöpft) oder ob kritische Workspaces eine dedizierte, isolierte Kapazität erhalten (teurer, aber ohne Interferenzrisiko durch andere Workspaces). Die konkrete Data-Engineering-Mechanik innerhalb von Fabric — wie Lakehouses strukturiert werden, wie Pipelines Daten transformieren — ist bewusst nicht Gegenstand dieses Kapitels, da diese thematisch zu Domain 10 (Data Engineering) dieser Wissensdatenbank gehört; dieses Kapitel behandelt ausschließlich die organisatorische Einordnung im Azure-Unternehmenskontext.

~~~text
Microsoft Fabric: unified analytics platform -- ORGANIZATIONAL structure (not data-eng mechanics, see Domain 10)
  Tenant: top org level, DIRECTLY COUPLED to Azure Entra ID org structure (see KB-0482)
    -> same identity/access control mechanisms as other Azure resources (no separate isolated identity mgmt)
  Workspace: org unit within tenant, assigned to team/project
    -> bundles Lakehouses, Pipelines, Reports; granular access rights PER workspace
  Capacity (Fabric Capacity Units): actual compute, used by one or more workspaces
    shared capacity across workspaces -> cost-efficient BUT risk: one heavy workspace starves others
    dedicated capacity per critical workspace -> no interference risk BUT more expensive
KEY POINT: unclear ownership OR capacity bottleneck usually != platform bug
  -> usually MISSING explicit ownership assignment at tenant/workspace/capacity level
Data-engineering mechanics (Lakehouse structure, pipeline transforms) deliberately OUT of scope here -> Domain 10
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Tenant | oberste Organisationsebene, gekoppelt an Entra ID | nutzt dieselben Identitäts-/Zugriffsmechanismen wie andere Azure-Ressourcen |
| Workspace | Organisationseinheit pro Team/Projekt | bündelt Inhalte und granulare Zugriffsrechte |
| Kapazität | Fabric Capacity Units, Rechenressourcen | geteilt (kosteneffizient, Interferenzrisiko) vs. dediziert (teurer, isoliert) |
| Ownership-Zuordnung | explizite Verantwortlichkeit pro Ebene | verhindert Konflikte um gemeinsam genutzte Ressourcen |

Implementierung: Für jeden Workspace wird explizit ein verantwortliches Team benannt, statt Workspaces ohne klare Ownership unternehmensweit zugänglich zu machen. Die Entscheidung zwischen geteilter und dedizierter Kapazität wird anhand der tatsächlichen Kritikalität und des erwarteten Rechenbedarfs eines Workspaces getroffen, nicht pauschal für alle Workspaces gleich. Data-Engineering-Inhalte innerhalb eines Workspaces (Lakehouse-Struktur, Pipeline-Logik) werden gemäß der in Domain 10 dieser Wissensdatenbank behandelten Praktiken gestaltet, nicht in diesem organisatorischen Kapitel wiederholt.

## Scalability, Reliability, Security und Observability

Fabric skaliert die organisatorische Klarheit proportional zur expliziten Ownership-Zuordnung auf Tenant-, Workspace- und Kapazitätsebene; die Reliability-Grenze liegt darin, dass eine fehlende Kapazitätsisolierung für kritische Workspaces proportional zur Rechenlast konkurrierender Workspaces zu Leistungseinbußen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein kritischer Workspace zeigt unerwartete Leistungseinbußen | die Kapazität wird von einem anderen, rechenintensiven Workspace mitgenutzt und erschöpft | prüfen, ob eine dedizierte Kapazität für den kritischen Workspace sinnvoll ist |
| unklar, welches Team für einen Workspace verantwortlich ist | keine explizite Ownership-Zuordnung wurde beim Anlegen des Workspaces dokumentiert | eine verbindliche Ownership-Dokumentation pro Workspace einführen |
| Zugriffsrechte auf Workspace-Inhalte sind inkonsistent | Zugriffsrechte wurden nicht granular auf Workspace-Ebene, sondern pauschal auf Tenant-Ebene vergeben | die Zugriffsrechte explizit auf Workspace-Ebene statt Tenant-Ebene prüfen und anpassen |

Security: Zugriff auf Fabric-Workspaces sollte über dieselben Entra-ID-basierten RBAC-Mechanismen wie andere Azure-Ressourcen erfolgen, konsistent mit der allgemeinen Azure-Zugriffskontrollpraxis. Observability: Die tatsächliche Kapazitätsauslastung pro Workspace relativ zur zugewiesenen Kapazität, sowie die Verteilung der Zugriffsrechte über Workspaces hinweg, sind relevante Betriebssignale zur Bewertung der organisatorischen Struktur.

## Trade-offs und Entscheidungen

**Staff** richtet einen Workspace mit korrekt zugeordneten Zugriffsrechten für ein gegebenes Team ein. **Principal** entscheidet, ob ein Workspace geteilte oder dedizierte Kapazität benötigt, basierend auf tatsächlicher Kritikalität. **Chief** legt Governance-Richtlinien für Tenant-, Workspace- und Kapazitätsownership im gesamten Unternehmen fest.

Anti-Patterns: Workspaces ohne explizite Ownership-Zuordnung unternehmensweit zugänglich machen; kritische Workspaces ohne Kapazitätsisolierung neben rechenintensiven, unkritischen Workspaces betreiben; Data-Engineering-Entscheidungen mit organisatorischen Tenant-/Workspace-Entscheidungen vermischen, statt sie als getrennte Verantwortungsbereiche zu behandeln.

## Production Checklist

- [ ] Jeder Workspace hat ein explizit benanntes, verantwortliches Team.
- [ ] Die Kapazitätsstrategie (geteilt versus dediziert) ist anhand tatsächlicher Kritikalität pro Workspace getroffen.
- [ ] Zugriffsrechte sind granular auf Workspace-Ebene statt pauschal auf Tenant-Ebene vergeben.
- [ ] Data-Engineering-Entscheidungen folgen den in Domain 10 dokumentierten Praktiken, getrennt von organisatorischen Tenant-/Workspace-Entscheidungen.

## Interviewfragen

### 1. Wie ist ein Fabric-Tenant mit der Azure-Identitätsstruktur verbunden?

**Antwort:** Ein Fabric-Tenant ist direkt an die Azure-Entra-ID-Organisationsstruktur gekoppelt, wodurch dieselben Identitäts- und Zugriffskontrollmechanismen wie für andere Azure-Ressourcen gelten.

### 2. Wofür dient ein Workspace in Fabric?

**Antwort:** Als Organisationseinheit innerhalb eines Tenants, die Inhalte (Lakehouses, Pipelines, Berichte) und granulare Zugriffsrechte für ein Team oder Projekt bündelt.

### 3. Was ist der Trade-off zwischen geteilter und dedizierter Kapazität?

**Antwort:** Geteilte Kapazität ist kosteneffizienter, birgt aber das Risiko, dass ein rechenintensiver Workspace die Kapazität für andere Workspaces erschöpft; dedizierte Kapazität ist teurer, aber ohne Interferenzrisiko.

### 4. Warum wird die Data-Engineering-Mechanik von Fabric in diesem Kapitel nicht behandelt?

**Antwort:** Weil sie thematisch zu Domain 10 (Data Engineering) dieser Wissensdatenbank gehört; dieses Kapitel behandelt ausschließlich die organisatorische Einordnung im Azure-Unternehmenskontext.

### 5. Wie gehst du vor, wenn ein kritischer Workspace unerwartete Leistungseinbußen zeigt?

**Antwort:** Ich prüfe zuerst, ob die Kapazität von einem anderen, rechenintensiven Workspace mitgenutzt und erschöpft wird, und evaluiere eine dedizierte Kapazität für den kritischen Workspace.

### 6. Widersprüchliche Anforderung: Unternehmen will maximale Kosteneffizienz durch geteilte Kapazität UND garantierte Leistung für alle kritischen Workloads — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, kritische Workspaces gezielt auf dedizierte Kapazität zu isolieren, während weniger kritische Workspaces eine gemeinsame, kosteneffiziente Kapazität teilen, statt eine einheitliche Kapazitätsstrategie für alle Workspaces unabhängig von deren Kritikalität zu erzwingen.

## Praktische Labs

~~~python
# Conceptual workspace-to-capacity assignment based on criticality (not executed against a real Fabric tenant):

def assign_capacity(workspace_name, criticality, shared_capacity_load):
    if criticality == "high":
        return f"{workspace_name}: dedicated capacity (isolated from other workspaces)"
    if shared_capacity_load < 0.7:
        return f"{workspace_name}: shared capacity (load headroom sufficient)"
    return f"{workspace_name}: shared capacity AT RISK -- review dedicated capacity"

workspaces = [
    ("finance-reporting", "high", 0.4),
    ("marketing-adhoc", "low", 0.5),
    ("marketing-adhoc-2", "low", 0.85),
]

for name, crit, load in workspaces:
    print(assign_capacity(name, crit, load))
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Microsoft Fabric — Tenant, Workspace und Kapazitätskonzepte](https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview), abgerufen 2026-09-18.
2. Microsoft-Dokumentation: [Fabric Capacity Konzepte](https://learn.microsoft.com/en-us/fabric/enterprise/licenses), abgerufen 2026-09-18.

Entra-Tenant-Design für Azure ist kanonisch in [KB-0482](02-entra-tenant-design-fuer-azure.md) behandelt; Data-Engineering-Mechanik gehört in Domain 10 dieser Wissensdatenbank.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende Integration von Fabric-Kapazitäten mit KI-Workloads (z. B. gemeinsame Kapazitätsnutzung mit Modellinferenz) | Evaluating | Gegenüber getrennten Kapazitäten für Analytics- und KI-Workloads erst nach Prüfung tatsächlicher Interferenzrisiken bevorzugen. |

Ein Team akzeptiert eine Fabric-Organisationsstruktur erst, wenn jeder Workspace nachweislich eine explizite Ownership-Zuordnung und eine der tatsächlichen Kritikalität entsprechende Kapazitätsstrategie hat.
