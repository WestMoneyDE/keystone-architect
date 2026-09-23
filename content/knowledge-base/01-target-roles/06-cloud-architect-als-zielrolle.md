---
{"id": "KB-0016", "title": "Cloud Architect als Zielrolle", "domain": "01", "sequence": 6, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0013", "KB-0014", "KB-0015", "KB-0400", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0400", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für einen synthetischen Workload wird eine Landing-Zone-Entscheidung mit Account/Subscription/Project-Struktur, IAM, Netzwerk, Logging, Budget, Recovery, IaC, Policy und einer negativen Zugriffsprobe ausgearbeitet und in einer freigegebenen Testumgebung erst später ausgeführt.", "rationale": "Cloudkompetenz ist erst belastbar, wenn Sicherheits-, Kosten- und Betriebsgrenzen in überprüfbaren Artefakten zusammengeführt werden."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Rolle bewertet Standort, Provider, Managed Service, Container/VM/Serverless, Datenpfad, Resilienz, Souveränität, Kosten und Exit unter definierten NFRs.", "rationale": "Sie entwirft nicht nur Ressourcen, sondern begründet die Workloadplatzierung und ihre langfristigen Folgen."}, "STAFF-TARGET": {"active": true, "scope": "Sie etabliert Landing-Zone-Produkte, IaC-Module, Referenzarchitekturen, Policy-/Exception-Prozesse, FinOps-Signale und Cloud-Supportmuster für mehrere Teams.", "rationale": "Staff-Wirkung bedeutet sichere, schnelle Workloadautonomie statt manuelle Account- und Netzwerkprovisionierung."}, "CHIEF-TARGET": {"active": true, "scope": "Sie steuert Cloud-Strategie, Anbieter- und Souveränitätsrisiko, Investitionsrahmen, Commitment, Sourcing, Zielbetriebsmodell und das Verhältnis von zentraler Basis zu Workloadverantwortung.", "rationale": "Chief-Entscheidungen erzeugen mehrjährige Vertrags-, Daten-, Kompetenz- und Kostenfolgen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Vertiefungen in Netzwerk, IAM, Kryptografie, Datenresidenz, Cloudrecht, GPU/HPC, Service-spezifische SRE und Vertragsverhandlung erfolgen mit Spezialisten.", "rationale": "Der Cloud Architect integriert diese Disziplinen und macht ihre Abhängigkeiten entscheidbar."}}, "lab_validation": [{"lab_id": "KB-0016-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Synthetischer AI-gestützter Commerce-Workload und lokale Architektur-/IaC-Fallarbeit", "evidence": "Die Fallarbeit definiert Landing-Zone-Hierarchie, Identitäts- und Netzwerkgrenzen, Datenfluss, Infrastrukturvertrag, Budget, SLO, Recovery, negative IAM-Probe, Audit und Cleanup.", "limitations": "Keine Cloudressource, kein Providerkonto, keine reale Subscription/Organisation, keine Kostenbuchung und kein Produktionssystem wurden angelegt oder getestet."}]}
---
# Cloud Architect als Zielrolle

## Zweck, Definition und Scope

Ein Cloud Architect übersetzt fachliche und technische Anforderungen in eine sichere, betreibbare, wirtschaftliche und ausstiegsfähige Cloudplatzierung. Die Rolle wählt nicht einfach „AWS, Azure oder GCP“. Sie begründet, welche Workloads wo laufen, welche Identitäts-, Netzwerk-, Daten-, Resilienz- und Kostenkontrollen gelten, wie Teams Umgebungen bekommen und wie der Weg bei Provider-, Vertrags-, Sicherheits- oder Laständerungen angepasst werden kann.

Eine Cloud Landing Zone ist die gemeinsame Basis, nicht die Anwendung selbst. Sie stellt einen Organisations-, Identity-, Netzwerk-, Logging-, Security-, Policy- und Billingrahmen bereit. Workloadteams betreiben ihre Anwendung innerhalb dieser Leitplanken und tragen ihre fachlichen Daten, SLOs, Releases und Verbrauchsentscheidungen. Der Cloud Architect verbindet diese Ebenen und sorgt dafür, dass Shared Services nicht zur Zentralisierung jeder Produktentscheidung führen.

Eigene Arbeit an Cloud- und Datenintegration in einem Prototyp, an einer Systemintegration oder an einer Runtime-Konzeption stützt Lernkontext, nicht den Nachweis produktiver Landing Zones, Providerbetrieb, Netzwerkkonfiguration, Cloud-SLOs oder FinOps-Verantwortung.

Nach diesem Kapitel kann der Leser:

1. Landing Zone, Plattformlandingzone und Workloadlandingzone als getrennte Verantwortungs- und Sicherheitsbereiche erklären;
2. Workloadplatzierung anhand von Datenklasse, Latenz, Resilienz, Kompetenz, Kosten, Souveränität, Provider und Exit begründen;
3. Identity, Netzwerk, Secrets, Observability, Policy, IaC, Backup/Recovery und FinOps in ein Cloudarchitekturartefakt integrieren;
4. Availability Zone, Region, Account/Subscription/Project, VPC/VNet und Datenpfad nicht als austauschbare Isolationsbegriffe behandeln;
5. Providerframeworks als Checklisten und Vergleichsrahmen nutzen, ohne deren Produkte unkritisch als Zielarchitektur zu übernehmen;
6. Staff- und Chief-Entscheidungen für zentrale Landing-Zone-Fähigkeiten, Commitments, Sourcing und Risikoakzeptanz treffen.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Ein Test- oder Papierfall enthält Landing-Zone-Entscheidung, IAM-/Netzgrenzen, IaC-Vertrag, Budget, Recovery und negative Zugriffprobe. |
| ARCHITECT-TARGET | aktiv | Workload- und Providerplatzierung, Daten-/Trustgrenze, NFRs, Betrieb, FinOps und Exit werden als Optionen begründet. |
| STAFF-TARGET | aktiv | Wiederverwendbare Landing-Zone-Produkte, IaC-Module, Policies, Exception-Prozesse und Cloud-Supportmuster helfen mehreren Teams. |
| CHIEF-TARGET | aktiv | Cloudstrategie, Souveränität, Commitments, Sourcing, Operating Model und Portfolioinvestition werden über ihren langfristigen Wert und ihr Risiko geführt. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe Networking-, IAM-, GPU-, Rechts-, Kryptografie-, Contract- und SRE-Fragen bleiben bewusste Spezialistenübergaben. |

## Mental Model: Die Cloud als reguliertes Grundstück mit Versorgungsnetzen

Eine Landing Zone ist ein erschlossenes Grundstück: Identität, Zufahrten, Grundstücksgrenzen, Bauvorschriften, Strom-/Wassermessung, Alarmierung und Notfallwege sind vorhanden. Ein Workloadteam errichtet darauf sein Produkt. Die zentrale Basis garantiert nicht, dass das Gebäude fachlich sinnvoll, ausfallsicher oder kostengünstig ist; sie macht sichere Grundmechanismen wiederholbar und sichtbar.

Der häufige Fehler lautet: „Wir haben einen Cloudaccount, also haben wir eine Landing Zone.“ Ein Account kann nur eine Abrechnungs- oder Verwaltungsgrenze sein. Eine belastbare Cloudbasis benennt mindestens Owner, Identity-Vertrauen, Netzwerk-/Egressregel, Datenklasse, Logs/Audit, Policy, Budget, Provisionierungsweg, Incidentzugriff und Decommissioning.

Fünf Invarianten leiten die Rolle:

1. **Ein Providerkonto ist keine Sicherheitsarchitektur.** Identität, Berechtigung, Netzwerk, Schlüssel, Daten, Logging, Policies und Betrieb sind getrennte Kontrollen.
2. **Der Workloadkontext entscheidet die Platzierung.** Eine Region, ein Managed Service oder Kubernetes ist nie allgemein „am besten“.
3. **Automatisierung ist ein Vertrag.** IaC ohne Review, State-Schutz, Policy, Rollback und Ownership kann Risiken schneller skalieren.
4. **Resilienz hat eine Fachgrenze.** RTO/RPO, konsistente Daten, menschliche Prozesse, Providerabhängigkeit und Kosten gehören zusammen.
5. **Exit ist eine Architekturentscheidung vor dem ersten Datenimport.** Datenexport, Schnittstellen, Observability, Schlüssel, Verträge, Egress und Kompetenz bestimmen reale Wechselkosten.

## Prerequisites und Dependencies

Die [Rollenmatrix](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), das [Kompetenzmodell](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), die [Lerntiefe](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und die [Labstrategie](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md) sind harte Voraussetzungen.

| Beziehung | Kapitel | Anschluss |
|---|---|---|
| related | [KB-0011: GenAI Solution Architect](01-genai-solution-architect-als-zielrolle.md) | GenAI-Use-Cases bringen Daten-, Modell-, Provider- und Qualitätsgrenzen ein. |
| related | [KB-0013: AI Platform Architect](03-ai-platform-architect-als-zielrolle.md) | AI-Runtime, GPU, Gateway und Tenancy brauchen Landing-Zone- und Providerentscheidungen. |
| related | [KB-0014: Platform Architect](04-platform-architect-als-zielrolle.md) | Cloudbasis wird als internes Plattformprodukt für Workloadteams angeboten. |
| related | [KB-0015: Enterprise Architect](05-enterprise-architect-als-zielrolle.md) | Capability, Sourcing, Governance und Portfolio bestimmen Platzierung und Investition. |
| applies | [KB-0400: Admission Control](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0400) | Workloadpolicy und Deliveryguardrails. |
| applies | [KB-0464: AWS IAM und Rollenmodell](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0464) | Konkrete AWS-IAM-Tiefe statt pauschaler Providerbehauptung. |
| applies | [KB-0500: GCP VPC](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0500) | Konkrete Netz- und Projektgrenzen in GCP. |
| applies | [KB-0572: Grafana](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572) | SLOs, Dashboards und Betriebsfeedback. |
| applies | [KB-0618: Datenschutzarchitektur](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0618) | Datenklassifikation, Transfer, Retention und Zugriff. |
| applies | [KB-0720: Portfolioevidenz](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0720) | Cloudlabs und berufliche Evidenz sauber trennen. |

## Core Concepts und Mechanismen

### Landing Zone, Plattformlandingzone und Workloadlandingzone

| Ebene | Verantwortet | Beispiele | Nicht verantwortlich für |
|---|---|---|---|
| Organisation/Tenant | Billinghierarchie, Identity-Root, Vertrags- und Governancegrenzen | AWS Organizations, Azure Management Groups, GCP Organization/Folders | fachliche Produktlogik. |
| Plattformlandingzone | zentrale Netzwerk-/DNS-/Logging-/Security-/Policy-/Identity-Integration und Account/Subscription/Project-Vending | zentrale Auditlogs, Security Monitoring, Egress, IaC-Module, Budgetbaselines | jedes Deployment und jede Datenentscheidung des Workloads. |
| Workloadlandingzone | isolierter Anwendungskontext und seine Umgebungen | Accounts, Subscriptions oder Projects je Workload/Umgebung/Risiko | globale Zentralpolicies oder andere Produktteams. |
| Workload | API, Datenmodell, Fachinvarianten, SLO, Releases, Verbauch | Commerce API, AI-Gateway, Retrievalservice, Batchjob | Plattformbasis über den Rahmen hinaus. |

Azure beschreibt Landing Zones als flexible Architektur für Governance, Security und Skalierung in einer Multi-Subscription-Umgebung: eine zentral gemanagte Platform Landing Zone legt Baseline und gemeinsame Fähigkeiten fest, Application Landing Zones hosten Workloads innerhalb dieser Standards. Das ist ein Anbieterbeispiel; die Trennung von Basis und Workload ist übertragbar. Siehe [Azure Landing Zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/).

### Account, Subscription, Project, VPC/VNet, Region und Zone

Diese Grenzen haben andere Eigenschaften:

| Grenze | Primäre Funktion | Keine Garantie für |
|---|---|---|
| Account/Subscription/Project | Abrechnung, IAM/Policy-Scope, Quotas und Administrationsgrenze | vollständige Netzwerk-, Daten- oder Runtimeisolation. |
| VPC/VNet | privater IP-/Routing-/Subnetz-/Security-Kontext | Datenresidenz, Accountisolation oder sichere Anwendung. |
| Region | geographisch/providerseitig abgegrenzter Service- und Datenstandort | Rechtmäßigkeit, niedrige Latenz für jeden Nutzer oder Multi-Region-Resilienz. |
| Availability Zone | Failure Domain innerhalb einer Region | Regionausfall, Datenkorruption oder Appfehlertoleranz. |
| Namespace/Container | Laufzeit- und Objektgrenze | Cloud-Account- oder Billingisolation. |
| Key/Secret | kryptografische oder Zugriffskontrolle | korrekte Datenklassifikation oder Network Egress. |

Der Cloud Architect erklärt die beabsichtigte Isolation pro Dimension. Beispiel: Ein sensitiver AI-Workload kann eigenen Account/Subscription, private Endpoints, getrennte Schlüssel, Egress-Allowlist, auditierbaren Break-glass-Zugriff und regiongebundene Daten benötigen. Ein einzelnes Subnetz wäre dafür keine angemessene Aussage.

### Workloadplatzierung als Vergleich, nicht als Glaubensfrage

Eine Platzierungsentscheidung vergleicht mindestens:

- **Fach- und Datenkontext:** Datenklasse, Residenz, Transfer, System of Record, Toolzugriff, Audit, Verträge.
- **Latenz und Netz:** Nutzerstandort, On-prem/Edge-Abhängigkeit, Datenvolumen, Egress, private Connectivity, Bandbreite.
- **Resilienz:** Verfügbarkeitsziel, RTO/RPO, Failure Domains, Wiederherstellung, Provider- und Drittanbieterabhängigkeiten.
- **Betriebsmodell:** Teamkompetenz, On-call, Automation, Managed-Service-Reife, Patchen, Observability, Support.
- **Leistung:** CPU/RAM/GPU, I/O, Concurrency, Batching, Queue, Skalierungscharakteristik.
- **Ökonomie:** Fix/variabel, Commitment, Lizenz, Speicher, Netzwerk, Telemetrie, Personal, Migration, Exit.
- **Souveränität und Exit:** APIs, Datenformate, Schlüssel, Observability, IaC, Verträge, Multi-/Hybridcloud und realistische Wechselzeit.

Die Optionen können On-prem, Edge, eine Region, mehrere Regionen, Managed Service, VM, Kubernetes, PaaS, Serverless oder externer AI-Provider sein. Jede ist unter konkreten Annahmen sinnvoll oder ungeeignet.

### IaC, Policy und Change Control

IaC beschreibt gewünschten Zustand und kann Änderungen wiederholbar machen. Das ersetzt keine Governance:

```text
Change request / Git commit
        │
        ▼
Format, lint, unit/plan, policy, security, cost estimate
        │
        ▼
review and approved pipeline identity
        │
        ▼
apply against scoped landing zone
        │
        ▼
drift, audit, runtime health, budget, SLO feedback
```

Eine robuste Kette enthält getrennte Rollen für Autor, Reviewer und Ausführungsidentität, geschützten State, keine Secrets im Repository, Plan-/Policyprüfung, minimale Rechte, Audit, Rollback/Compensation und Driftmonitoring. „Infrastructure as Code“ bedeutet nicht, dass jede Produktionseinstellung direkt aus einem Merge ohne Risikoanalyse verändert werden darf.

## Architecture / Data Flow: Synthetischer Commerce- und AI-Workload

Der folgende Lernfall steht für eine B2B-Commerce-Statusanwendung mit optionalem AI-Erklärpfad. Er ist kein Produktionsnachweis.

```text
Organisation / Billing / Identity Root
           │
           ▼
Platform Landing Zone
  Identity federation ─ Policy ─ Audit/Security Logs ─ Connectivity/Egress ─ Cost data
           │
           ▼
Workload Landing Zone: Commerce Production
  private ingress → status API → order/status data boundary → event/API integration
                  │
                  └→ AI gateway → approved model route / retrieval boundary
           │
           ▼
Telemetry / SLO / security alerts / cost scope / backup-recovery evidence
```

1. Der Plattformweg erstellt für das Workloadteam eine klar besessene Workloadgrenze mit Kosten- und Logscope.
2. Menschliche und Workloadidentitäten erhalten föderierte, kurzlebige und least-privilege Berechtigungen. Break-glass ist getrennt, befristet und auditiert.
3. Ingress, Egress und private Dependencies werden von einer dokumentierten Netzpolicy abgeleitet. Default Egress oder öffentlicher Datenzugriff wird nicht als bequemer Testzustand in Produktion übernommen.
4. Der Statusservice behält fachliche Autorisierung und Datenhoheit. Der AI-Pfad erhält nur erlaubten Kontext und kann keine Fachzustandsänderung ohne deterministischen Service-/Human-Gate auslösen.
5. Logs/Traces/Metriken und Kosten werden in Workload- und Plattformansicht getrennt. Sensitive Inhalte haben Redaction, Zugriff und Retention.
6. Backup, Wiederherstellung, regionale Fehlergrenzen, Provider-/Modellroute und Datenreplikation werden gegen RTO/RPO getestet oder explizit als nicht getestet geführt.

## Protocols, Standards und Tools

| Bereich | Mechanismen | Architekturaussage |
|---|---|---|
| Identity | OIDC/SAML-Federation, MFA, Workload Identity, RBAC/ABAC, JIT | Keine dauerhaften Shared-Admincredentials für Delivery oder Betrieb. |
| Netzwerk | DNS, TLS/mTLS, VPC/VNet, private endpoints, routing, firewall/security groups, egress proxy | Network Topology folgt Datenfluss und Trust Boundary, nicht bloß IP-Ästhetik. |
| Delivery | Git, IaC, CI/CD, policy-as-code, signed artifacts, drift detection | Gewünschter und realer Zustand müssen mit Audit und Rückbau vergleichbar sein. |
| Data | Verschlüsselung, KMS/HSM, Backup, Replikation, Retention, DLP | Ein Provider-KMS-Häkchen ersetzt keine Datenklassifikation oder Ownerentscheidung. |
| Operations | OpenTelemetry, Logs/Metrics/Traces, SLO, Incident, Backup-/Restoretest | Managed Service reduziert Aufgaben, entfernt aber nicht die Verantwortlichkeit für Outcome. |
| FinOps | Tags/Labels, Kostenkonto, Budgets, Forecast, Showback, Commitment Governance | Kosten sind pro Workload/Capability und Owner sichtbar, nicht nur zentral verrechnet. |
| Frameworks | AWS Well-Architected, Azure CAF/Landing Zones, Providerreferenzen | Gute Fragen und Muster, keine portable Architektur ohne Anpassung. |

Das AWS Well-Architected Framework nennt sechs Perspektiven: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization und Sustainability. Sie sind ein Reviewrahmen; die Gewichtung entsteht erst aus Workload- und Unternehmenskontext. Siehe [AWS Well-Architected](https://docs.aws.amazon.com/wellarchitected/latest/framework/definitions.html). Azure CAF strukturiert Strategie, Planung, Landing Zone, Adoption, Governance, Security und Management, aber auch dort sind Beschleuniger nur ein Startpunkt für eigene Anforderungen. Siehe [Azure Cloud Adoption Framework](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/).

## Konfiguration / Implementierung: Landing-Zone-Vertrag

Eine providerneutrale Workloadregistrierung zwingt wichtige Entscheidungen vor der Ressourcenanlage sichtbar zu machen:

```yaml
workload: commerce-status-ai
owner: commerce-product-team
environment: production
data_classification: confidential
business_criticality: medium
target_rto: "4h"
target_rpo: "1h"
placement:
  region: "approved-region-to-be-selected"
  failure_domains: "provider-specific design required"
identity:
  human_access: federated-mfa
  workload_access: short-lived-workload-identity
network:
  ingress: private-or-approved-edge
  egress: allowlist-through-controlled-path
data:
  system_of_record: order-status-domain-owner
  encryption: provider-key-management-with-owner-review
  retention: "policy-required"
operations:
  slo_owner: commerce-product-team
  platform_owner: cloud-platform-team
  audit_log_scope: workload-and-platform
cost:
  cost_center: commerce-42
  monthly_budget: "synthetic-limit-only"
exit:
  data_export: documented-format-and-owner
  infrastructure: versioned-iac
  provider_dependencies: reviewed-quarterly
```

Der Wert liegt nicht in diesem YAML-Format, sondern in der Prüfung: Wer darf eine Region wählen? Welche Control durchsetzt Egress? Welche Daten dürfen eine Modellroute erreichen? Wer genehmigt Recoverykosten? Welche Providerabhängigkeit ist akzeptiert? Ein fehlender `owner`, unklare Datenklasse oder ungetestete RTO/RPO-Annahme muss den Produktionsweg blockieren oder eine sichtbare Ausnahme erzeugen.

Ein praktischer Start ist ein versioniertes Landing-Zone-Modul mit Minimalrechten, Auditlogging, verpflichtendem Tagging/Labeling, zentralem Budgetalarm und vorkonfiguriertem Telemetrieexport. Es darf keine globalen Ownerrechte, öffentlichen Datenpfade oder unverschlüsselbare Secrets in Workloadteams ausrollen.

## Scalability und Performance

Cloudskalierung unterscheidet **Elastizität**, **Kapazität** und **Resilienz**:

- Elastizität passt Ressourcen an Last an; sie benötigt Metrik, Grenzen, Warm-up und Budget.
- Kapazität sichert eine bestimmte Lastklasse; sie benötigt Reserven, Quota, Providerlimits und Lasttests.
- Resilienz erhält Funktion unter Fehlern; sie benötigt Fehlerdomänen, Recovery, Datenkonsistenz und getestete Prozesse.

| Last-/NFR-Signal | Messung | Architekturableitung |
|---|---|---|
| Nutzer-/Eventlast | Requests/s, Events/s, Bursts, Saisonalität | Ingress, Queue, Autoscaling, Quota und Providerlimit. |
| Latenz | p50/p95/p99 pro Netz-, App-, Daten- und Modellphase | Region, Caching, private Connectivity, Routing und Performancebudget. |
| Datenvolumen | Speicherwachstum, IOPS, Egress, Replikation | Storageklasse, Retention, Backup, Transferkosten und Datenplatzierung. |
| Compute | CPU/RAM/GPU-Auslastung, Queue, OOM, Startup | VM/PaaS/Kubernetes/Serverless, Pool, Slicing, Reserve. |
| Verfügbarkeit | Fehlerbudget, Dependency Availability, Failoverzeit | Zone/Region, Degradation, RTO/RPO, Runbook und Vertragsgrenze. |
| Kosten | Kosten/Request/Task, Idle, Commitment Coverage, Forecast | Abschaltregel, Rightsizing, Budget, Architektur- und Produktentscheidung. |
| Teamflow | Provisionierungsdauer, Self-Service, Change Failure | Landing Zone Vending, IaC, Policy UX, Supportmodell. |

Nicht jede Last braucht Multi-Region. Ein Multi-Region-Design kann Latenz, Datenkonsistenz, Betrieb, Egress und Kosten erhöhen. Bei stark konsistenten Fachzuständen kann ein kontrollierter regionaler Recoveryplan glaubwürdiger sein als ungetestetes Active-Active. Ein AI-Experiment kann mit Providerroute und Budgetlimit starten; eine dauerhafte hochkritische Fähigkeit benötigt anderes Kapazitäts- und Souveränitätsdesign.

## Reliability / Failure Modes

| Fehlerbild | Frühes Signal | Schutz | Recovery und Grenze |
|---|---|---|---|
| Falsche IAM-Policy | Access denied oder unerwarteter Zugriff | least privilege, policy tests, separates Adminmodell, Audit | Policyversion zurückrollen, Credentials widerrufen, Scope analysieren; kein globaler Adminfix. |
| Öffentlicher/unerwarteter Egress | Firewall-/DNS-/Flowlog-Anomalie, Kostenanstieg | default deny, allowlist, private endpoints, Egressgateway | Pfad blockieren, Daten-/Incidentbewertung, Ausnahme dokumentieren. |
| Region/AZ/Providerabhängigkeit | Dependency errors, Service health, RTO-Risiko | failure-domain-Design, Backups, Fallback, runbook, Contract awareness | nach RTO/RPO wiederherstellen; Multi-Region nur mit getesteter Datenstrategie. |
| IaC-State oder Drift | unerwartete Ressourcen, Planabweichung, Auditlücke | remote state protection, locking, approved pipeline identity, drift checks | State/Change prüfen, Ressourcen nicht blind löschen, kontrollierte Kompensation. |
| Quota-/Kapazitätslimit | Provision failure, Pending, API throttle | Preflight, quota monitoring, reserve/commitment, loadtest | drosseln, alternate approved region/service, Providereskalation. |
| Secret-/Keyverlust | Auth-/Decryptfehler, audit anomaly | rotation, recovery escrow/controls, access separation | documented recovery; Keydeletion kann absichtlich irreversibel sein. |
| Kostenburn | Budgetforecast, Egress, idle, token/GPU usage spike | budget, tags, rate/scale limits, alerts | scale down/disable route, owner decision; nicht ohne Produktwirkung abschalten. |
| Ungetestete Backups | Restorefehler erst im Incident | Restore tests, data classification, recovery runbook | ehrlich degradieren, Wiederherstellung testen, RPO neu verhandeln. |

Ein Cloudprovider kann hochverfügbare Komponenten anbieten; die Anwendung bleibt für ihre eigene Dependencykette, Datenkonsistenz, Identität, Konfiguration, Capacity Limits und Geschäftscontinuity verantwortlich. „Managed“ ist eine geteilte Verantwortlichkeit, keine Auslagerung jedes Risikos.

## Security, Governance und Compliance

| Bereich | Cloud-Architekturentscheidung | Nachweis |
|---|---|---|
| Identity | Federation, MFA, Rollenmodell, Workload Identity, JIT Break-glass | Access Review, Policy, Audit, Ablaufzeit. |
| Organisation | Account/Subscription/Project-Hierarchie, Owner, Policy Inheritance, Billing Scope | dokumentierte Hierarchie und Vendingprozess. |
| Netzwerk | Ingress, Egress, private connectivity, DNS, segmentation, DDoS/edge | Datenfluss-/Trustdiagramm, Flow-/Firewall-Review. |
| Daten | Klassifikation, Region, Zugriff, Verschlüsselung, Backup, Retention, Transfer | Datenownerentscheidung, Schlüssel-/Restore-/Access-Evidenz. |
| Delivery | IaC, Signatur, Review, Policy, Drift, Secrets | Pipeline- und Policybeleg, keine unkontrollierten Adminänderungen. |
| Logging | Audit, Security, Apptelemetrie, Redaction, Retention, Zugriff | Logscope, DLP/Redaction, Query-/Accessmodell. |
| Exception | Risiko, Owner, Kompensation, Ablauf, Review | sichtbares Register, keine permanente ad-hoc Berechtigung. |
| Compliance | Geltungsbereich, Control Mapping, Fach-/Rechtsreview | Architekturmaßnahme nicht als Rechtsgarantie ausgeben. |

Cloud Governance wird wirksam, wenn sie mit der Provisionierung verknüpft ist. Ein PDF mit Netzwerkregeln kann keinen öffentlichen Endpoint verhindern. Umgekehrt darf Policy-as-code keine unverständliche Einheitsblockade sein. Teams brauchen konkrete Fehler, dokumentierte Alternativen und einen befristeten Exceptionweg.

Datenresidenz ist mehr als die gewählte Region. Relevant sind Backups, Logs, Telemetrie, Supportzugriff, CDN, Modellprovider, Disaster Recovery, Schlüsselverwaltung, Subprozessoren und Datenexport. Für jede personenbezogene oder regulatorisch relevante Datenklasse benötigt die Cloudentscheidung Data Owner, Privacy/Legal und Security als sichtbare Beteiligte.

## Observability und Troubleshooting

Cloud Observability umfasst technische, Sicherheits-, Kosten- und Governanceperspektive.

| Ebene | Signale | Leitfrage |
|---|---|---|
| Landing Zone | Account/Subscription Vending, Policycompliance, Identity failures, Auditlog delivery | Ist die gemeinsame Basis korrekt und konsumierbar? |
| Netzwerk | DNS, Flow logs, TLS/edge errors, egress, latency | Wo endet der erlaubte Datenpfad und wo entsteht Verzögerung? |
| Runtime | resource health, saturation, autoscaling, deployment revision | Kann der Workload seine SLO unter Last und Fehler erfüllen? |
| Daten | backup success, restore duration, replication lag, access denials | Ist RPO/RTO real und ist Datenzugriff korrekt? |
| Security | unusual role use, key/secrets events, policy violations, findings | Ist ein Schutzmechanismus gebrochen oder nur ein berechtigter Sonderfall? |
| Kosten | spend, forecast, tag coverage, idle, egress, commitment | Welcher Owner und welcher Workload verursachen die Änderung? |
| Produkt | user success, error/abandon, AI quality/human escalation | Liefert Cloudbetrieb fachlichen Wert oder nur Infrastrukturaktivität? |

Diagnosepfad bei „Commerce Status API ist langsam und teuer“:

1. Scope klären: ein Environment, Region, Kundensegment, Release, Modellroute oder alle Nutzer?
2. E2E-Trace zerlegen: Edge/DNS/TLS, Ingress, App, Daten-/Eventintegration, AI-Gateway, Modell, Egress. Kostenanalyse muss dieselbe Workload-/Revisionkennung nutzen.
3. Änderungen korrelieren: IaC-Plan, Route, Autoscaling, Datenabfrage, Modellalias, DNS, Firewall, Providerquota, Tagging und Budget.
4. Bei Netzverdacht Flow-/DNS-/Egressdaten gegen erlaubten Pfad prüfen; nicht einfach öffentliche Freigabe als Test setzen.
5. Bei Datenverdacht I/O, Connection Pool, Locks, Replication/Cache und Queryplan prüfen. Multi-Region repliziert keinen fachlich korrekten Zustand automatisch.
6. Bei Kostenanstieg Requests, Tokens, Retry, Egress, Idle, neue Ressourcentypen und Tagabdeckung trennen. Eine Budgetüberschreitung ist ein Signal, keine Root Cause.
7. Gegenprobe ausschließlich in einem freigegebenen Testscope: definierte geringe Last und eine bekannte Vorversion/Route vergleichen. Ergebnis und ausgelöste Kosten dokumentieren.

## Cost / FinOps

Die FinOps Foundation beschreibt FinOps als kollaborative Praxis für technologiebezogenen Geschäftswert und finanzielle Verantwortlichkeit zwischen Engineering, Finance und Business. Das aktuelle Framework betont zeitnahe, zugängliche Daten, zentrale Befähigung und Ownership der Teams. Siehe [FinOps Framework](https://www.finops.org/framework/). Cloudarchitektur übersetzt das in messbare Workload- und Capabilityentscheidungen.

\[
C_{workload}=C_{compute}+C_{storage}+C_{network}+C_{managed}+C_{observability}+C_{support}+C_{risk}+C_{exit}
\]

\[
C_{useful\ outcome}=\frac{C_{workload}}{\max(1,N_{accepted\ outcomes})}
\]

| Kostentreiber | Messung/Allokation | Steuerhebel | Gefährliche Vereinfachung |
|---|---|---|---|
| Compute/GPU | Instanzzeit, Auslastung, Queue, Reserve, Commitment | Rightsizing, scheduling, autoscaling, Provider-/servicewahl | Idlekosten als einzige Verschwendung behandeln. |
| Managed Service | Request, Storage, I/O, API, Mindestgebühr | Lastprofil, Retention, Cache, SKU/Region | „Serverless ist automatisch billig“. |
| Network | Egress, Cross-zone/region, private connectivity, CDN | Datenplatzierung, Architektur, Transferlimit | nur Computekosten vergleichen. |
| Storage/Data | Hot/cold tier, Backup, Replication, retention, retrieval | Lifecycle, Deduplizierung, Datenowner | Backups und Logs kostenlos annehmen. |
| Observability | Ingestion, cardinality, retention, export | sampling, Redaction, SLO-Fokus | jedes Detail permanent speichern. |
| People/Risk | On-call, support, training, incident, contract | Plattformprodukt, Automation, klare Ownership | Providerrechnung sei Gesamtkosten. |
| Exit | Datenexport, refactoring, dual run, contract termination | offene Formate, adapters, IaC, regelmäßiger Test | Multi-cloud ohne reale Portabilität sei Exit. |

Commitments oder Reserved Capacity sind Finanz- und Verfügbarkeitsentscheidungen: Sie können Kosten senken, binden aber Lastannahmen. Ein Chief-Level-Entscheid braucht Abdeckung, Laufzeit, Szenarien bei Produktende, Owner, Budget- und Risikogrenze. Ein FinOps-Tool ohne saubere Workload- und Cost-Owner kann keine verantwortliche Entscheidung erzeugen.

## Trade-offs und Anti-Patterns

| Entscheidung | Optionen | Trade-off |
|---|---|---|
| Single Region | Multi-AZ, Multi-Region, Hybrid/Edge | Einfachheit und geringere Kosten gegen regionale Failure Domains; Multi-Region erhöht Daten- und Betriebsdesign. |
| Managed Service | Self-managed VM/Kubernetes/PaaS/Serverless | weniger Betriebsarbeit gegen API-, Daten-, Preis- und Exitabhängigkeit. |
| Central Landing Zone | Workload-owned foundation | gemeinsame Guardrails und Ökonomie gegen Warteschlange; Vending und APIs statt Tickets nötig. |
| Public Endpoint | private connectivity, edge proxy, VPN | einfacher Einstieg gegen Exposition, Egress und Zugriffskomplexität. |
| One Provider | multi-provider, hybrid, portable interface | Fokus und Kompetenz gegen Konzentration; Multi-cloud ohne reale Workloads ist Kostenmultiplikator. |
| Provider-native AI | self-hosted/open model, brokered provider | Time-to-value gegen Daten, Souveränität, Kosten und Modell-/APIbindung. |
| Strong policy | flexible guideline | Sicherheit/Consistency gegen UX- und Ausnahmebedarf; unverständliche denies erzeugen Schattenwege. |

Anti-Patterns: Cloudaccount als Landing Zone, Root-/Ownerzugang im Alltag, öffentliches Netzwerk als Debugdefault, IaC ohne State/Review/Drift, Region als Compliancegarantie, Multi-Region als ungetestetes Verfügbarkeitslabel, Multi-cloud als leere Folie, Tags als nachträgliche Option, Budgets ohne Owner, ungetestete Backups, committed spend ohne Exitannahme und AI-Routing ohne Daten-/Kostenpolicy.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Evidenz, Wirkung und Trigger |
|---|---|---|
| Staff | Landing-Zone-Vending als Plattformangebot definieren | Team erhält Workloadgrenze mit Identity, Logs, Policy und Budget ohne unsichere manuelle Schritte. Wiederkehrende Tickets oder Bypässe lösen Produktverbesserung aus. |
| Staff | Referenzmodule und Minimum Guardrails festlegen | IaC-Module, policy tests, Error UX, exception workflow und deprecation werden versioniert. Wiederkehrende Ausnahme zeigt eine falsche Grenze. |
| Principal | Workloadplatzierung festlegen | Daten, Latenz, NFR, Providerquota, Betrieb, Kosten und Exit sind je Option dokumentiert. Neue Datenklasse, Incident oder Kosten-/Lastabweichung löst Review aus. |
| Principal | Resilienzstrategie mit fachlichem Owner vereinbaren | RTO/RPO, Failure Domains, Datenkonsistenz, Test, Support und Kosten sind überprüfbar. Kein „HA“ ohne Wiederherstellungstest. |
| Chief | Cloud-/Sourcingportfolio steuern | Anbieter-/Souveränitäts-/Vertragsrisiko, Kompetenz, Commitments, Plattforminvestment und Workloadwerte entscheiden. Vertrags-/Region-/Regeländerung triggert Neubewertung. |
| Chief | zentrale und Workloadownership begrenzen | Zentral für wiederholte gemeinsame Controls; Teams für Fachdaten, SLO, Verbrauch. Ticketstau oder riskante Selbstverwaltung sind beobachtbare Warnsignale. |
| Chief | FinOps-Risikobudget entscheiden | Forecast, commitment coverage, Data/AI cost, exit exposure und Outcome verbinden. Anhaltende Überschreitung oder unzuordenbare Kosten löst Eskalation aus. |

## Production Checklist

| Bereich | Prüfnachweis | Owner | Stop-/Rollbackbedingung |
|---|---|---|---|
| Scope/Placement | Workload, Datenklasse, Region, Optionen, NFR, Exit | Cloud + Product/EA Owner | Kein Daten-/Fachowner oder keine begründete Platzierung. |
| Landing Zone | Hierarchie, Vending, Basispolicy, Logs, Budget, Support | Cloud Platform | Umgehung durch Root-/globale Adminrechte. |
| Identity | Federation, MFA, workload identity, JIT, Access Review | Security/IAM | dauerhafte Shared-Admincredentials oder unklare Rollen. |
| Network | Ingress/Egress, DNS, private endpoints, segmentation | Network + Cloud | ungewollter öffentlicher/unkontrollierter Datenpfad. |
| Data | Owner, encryption, access, backup, retention, transfer | Data/Privacy/Security | unbekannte Datentransfers, ungetestete kritische Wiederherstellung. |
| Delivery | IaC state, pipeline identity, plan/policy/review, drift | Platform + Workload | direkter, unauditierter Produktionschange. |
| Reliability | SLO, RTO/RPO, dependency map, backup/restore, runbook | Product/SRE | Ziel ohne Failure-/Recoverybeleg. |
| Observability | logs, metrics, traces, alerts, access, retention | SRE/Cloud | keine Detektion kritischer Basis- oder Datenfehler. |
| FinOps | tags/labels, budget, forecast, owner, commitment decision | Finance + Workload | Kosten ohne Scope/Owner oder Budgetalarm. |
| Decommission | data export/deletion, secrets, resource cleanup, cost end | Workload + Platform | keine dokumentierte Abschaltung oder Vertrags-/Datenrestgrenze. |

## Interviewfragen mit Antwortleitfäden

1. **Was ist eine Landing Zone?** Eine wiederholbare Cloudbasis für Organisation, Identity, Governance, Networking, Logs, Policy und Billing, über der Workloadteams eigene Umgebungen und Produkte betreiben. Sie ist kein einzelner Account.
2. **Wann braucht ein Workload einen eigenen Account, Subscription oder Project?** Wenn IAM/Policy/Billing/Quota/administrative oder Risiko-/Organisationsgrenzen es rechtfertigen. Netzwerk- oder Datenisolation wird separat bewertet.
3. **Wie wählen Sie Region und Resilienzmodell?** Anhand von Daten, Nutzern, Dependencies, RTO/RPO, Konsistenz, Failure Domains, Kosten, Betrieb und Verträgen. Multi-Region ist kein Standardantwort.
4. **Managed Service oder Kubernetes/VM?** Vergleiche Nutzlast, Kontrolle, Teamkompetenz, Operations, Skalierung, Compliance, Kosten, Portabilität und Exit. Managed verringert nicht jede Verantwortung.
5. **Wie behandeln Sie IaC-Sicherheit?** Geschützter State, minimale Pipelineidentity, Plan/Policy/Review, Secrets außerhalb des Repos, Audit, Drift und getestete Kompensation.
6. **Was bedeutet Shared Responsibility?** Provider und Kunde tragen verschiedene Schichten. Der Kunde bleibt für Konfiguration, Identity, Daten, Workload, Nutzung und Outcome verantwortlich; genaue Grenzen sind dienstabhängig.
7. **Wie verbinden Sie FinOps und Architektur?** Cost Scope/Owner, Forecast, Tagging, Last, Commitment, Egress, Daten, Personal und Exit werden mit Capability-Outcome und Architekturentscheidung verbunden.
8. **Wie prüfen Sie einen Cloudbackupplan?** Nicht am „Backup erfolgreich“-Flag, sondern über Klassifikation, RPO/RTO, Restoretest, Datenkonsistenz, Schlüssel, Zugriff, Abhängigkeiten und Runbook.
9. **Wie verhindern Sie Cloudsprawl?** Vending mit Ownership, Baseline, Budget, Katalog, Lifecycle, Decommissioning, Ausnahmeprozess und Beobachtung von ungenutzten/unklaren Ressourcen.

## Praktisches Lab / Fallarbeit: Landing-Zone-Entscheidung für einen Commerce-AI-Workload

**Status:** **reviewed_only**, Stand 2026-09-15. Kein Cloudkonto, keine Subscription, kein Project, keine Ressourcen, keine Kosten und keine realen Daten werden erstellt oder verändert. Alle Zahlen sind Lernannahmen.

### Ausgangslage

Ein fiktives Commerce-Team möchte eine Status-API und einen quellengebundenen AI-Erklärpfad betreiben. Bestell- und Kundendaten gelten als vertraulich. Das Unternehmen benötigt ein Produktions- und Testenvironment, begrenzte Egresspfade, zentralen Audit, monatliche Kostentransparenz und einen Wiederherstellungsplan. Es hat noch keine verbindliche Providerentscheidung. Budgetannahme: maximal 500 Euro pro Monat für einen späteren, separat genehmigten Pilot.

### Aufbau

1. Erstelle einen Workloadvertrag mit Owner, Capability, Datenklasse, SLO, RTO/RPO, Kostenstelle, Regionkandidaten, Provideroptionen, Datenfluss und Exitannahmen.
2. Zeichne eine Organisation-/Landing-Zone-/Workload-Hierarchie. Markiere, welche Policies zentral sind und welche Entscheidungen beim Team bleiben.
3. Entwickle drei Platzierungsoptionen: Managed PaaS, Kubernetes/Containerplattform und externer Modellprovider plus schlanker API-Workload. Bewerte Daten, Latenz, Kosten, Kompetenzen, Providerquote, Betrieb, Souveränität und Exit.
4. Definiere einen sicheren Provisionierungsablauf: Git/IaC, Format/Plan/Policy/Review, getrennte Pipelineidentity, Audit, State-Schutz, Drift und Rollback.
5. Formuliere Netzwerk-/Identity-Policy: federierter Nutzerzugriff, Workloadidentity, kein Shared Admin, Ingressschutz, egress allowlist, private Datenabhängigkeit, JIT Break-glass.
6. Definiere Telemetrie und FinOps: Workload-ID, Revision, Region, Kostenstelle, Budgetalarm, Logs/Metriken/Traces, sensitive Attribute, Retention und Zugriff.
7. Beschreibe Backup/Restore und einen regionalen Ausfall als Runbook. Kennzeichne ungetestete Annahmen.

### Negative Gegenproben

| Gegenprobe | Erwartetes Ergebnis | Was sie nicht beweist |
|---|---|---|
| Workload fordert globale Ownerrolle | Policy/Vending verweigert; zulässige Rolle und Ausnahmeweg sichtbar | Vollständige IAM-Korrektheit eines realen Providers. |
| Container versucht Egress zu unbekanntem Ziel | Egresskontrolle blockiert oder der fehlende Enforcementpunkt wird transparent | Rechtliche Zulässigkeit jedes erlaubten Ziels. |
| Budgetlimit wird simuliert überschritten | Alarm und Ownereskalation; Degradations-/Stopentscheidung dokumentiert | Reale Providerrechnung oder dauerhafte Kostenkontrolle. |
| Restoreplan verwendet falschen Schlüssel/fehlende Berechtigung | Testfall schlägt sichtbar fehl; Recoverylücke wird Risk Item | Erfolgreiche Wiederherstellung realer Kundendaten. |
| Regionausfall wird als „automatisch gelöst“ behauptet | Team muss RTO/RPO, Datenkonsistenz, Failover und Kosten konkretisieren | Dass Multi-Region ohne Test resilient ist. |

### Auswertung und Cleanup

Die Fallarbeit besteht, wenn ein Reviewer den Workloadpfad von Identität bis Daten, Telemetrie, Budget, Recovery und Exit verfolgen kann und jede wichtige Annahme einen Owner, Beleg oder offenen Risk Item besitzt. Lokale Beispieldaten werden anschließend gelöscht. Eine reale Ausführung benötigt ein freigegebenes Nichtproduktionskonto, Provider- und Security-/Privacyfreigabe, Kostenowner, echte Versionen, Testprotokolle und einen dokumentierten Cleanup.

## Dependencies, Cross-References und Quellen

Rollen- und Nachweisgrundlagen stehen in [KB-0002](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [KB-0004](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), [KB-0005](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und [KB-0009](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md). Die fachliche, Plattform- und Portfolioperspektive folgt aus [KB-0011](01-genai-solution-architect-als-zielrolle.md), [KB-0013](03-ai-platform-architect-als-zielrolle.md), [KB-0014](04-platform-architect-als-zielrolle.md) und [KB-0015](05-enterprise-architect-als-zielrolle.md).

| Quelle | Verwendete Aussage | Stand |
|---|---|---|
| Dateikatalog der Knowledge Base, KB-0016 | Verbindlicher Scope, Zielrollenfokus und Pfad. | Planstand 2026-09-14 |
| [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/definitions.html) | Sechs Perspektiven als Reviewrahmen für Cloudworkloads. | Abgerufen 2026-09-15 |
| [Azure Landing Zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/) | Plattform- und Application-Landing-Zone-Modell für Governance, Security und skalierbare Multi-Subscription-Umgebungen. | Abgerufen 2026-09-15 |
| [Azure Cloud Adoption Framework](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/) | Strategie-, Plan-, Ready-, Adopt-, Govern-, Secure- und Manage-Kontext für Cloudadoption. | Abgerufen 2026-09-15 |
| [FinOps Framework](https://www.finops.org/framework/) | Kollaborative, wertorientierte Technologie-Finanzverantwortung, Scopes und zentrale Befähigung. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — Landing Zones entwickeln sich zu wiederholbaren Produktangeboten.** Azure beschreibt eine zentrale Platform Landing Zone und verteilte Application Landing Zones, die Workloadteams innerhalb gemeinsamer Governance und Sicherheitsbaselines betreiben. **Reifegrad: Established als Muster, Adopting bei durchgängigem automatisiertem Vending und Product Management.** Der Nutzen ist schnelleres, konsistentes Workload-Onboarding. Das Risiko ist ein zentraler Ticketprozess oder überbreite Policies. Ein Pilot akzeptiert das Muster erst, wenn zwei Teams per Versionierter Automation eine Umgebung mit Identity, Audit, Budget und klarer Ausnahme erhalten und die Durchlaufzeit sowie Bypassquote messbar sinken. Quelle: [Azure Landing Zones](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/).

**Stand 2026-09-15 — FinOps erweitert die Cloudkostenfrage zur Technologie-Wertsteuerung.** Das FinOps Framework beschreibt Scopes für Produkte, Kostenstellen und Environments und veröffentlicht 2026 Aktualisierungen zu Executive Strategy Alignment und neuen Technology Categories. **Reifegrad: Adopting für organisationsweite Umsetzung, Established für die Kernpraxis.** Das hilft, AI-, Datenzentrum-, SaaS- und Cloudkosten an Wert und Ownership zu verbinden. Die Gefahr ist Kostendaten ohne Datenqualität oder die falsche Optimierung auf Infrastrukturpreis statt Outcome. Ein Pilot beginnt mit einer Capability, transparentem Scope, Budgetowner, Forecast, Tagdisziplin und Kosten pro akzeptiertem Ergebnis. Quelle: [FinOps Framework](https://www.finops.org/framework/).

**Stand 2026-09-15 — AI- und Agentenworkloads werden in die Cloudadoptionsbasis integriert.** Der aktuelle Azure Cloud Adoption Framework führt Szenarien für AI, Agenten und Souveränität neben der allgemeinen Landing-Zone- und Betriebsführung. **Reifegrad: Adopting.** Der Nutzen ist, neue AI-Anforderungen nicht außerhalb von Identity, Daten, Governance und Betrieb aufzubauen. Das neue Risiko ist eine „AI-Ausnahmezone“, die Modellzugriff schneller macht, aber Daten-/Tool-/Kosten- und Auditgrenzen umgeht. Ein Pilot verlangt deshalb denselben Landing-Zone-Vertrag plus zusätzliche Modellroute, Eval, Toolpolicy, Token-/GPU-Kostenmeter und Human-Gate-Nachweis. Quelle: [Azure Cloud Adoption Framework](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/).

