---
{"id": "KB-0013", "title": "AI Platform Architect als Zielrolle", "domain": "01", "sequence": 3, "document_type": "role", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-15", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "MLOPS", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0002", "concepts": ["Rollen-Kompetenz-Matrix", "Tiefenstufen", "Nachweisarten"], "needed_for": "understanding"}, {"id": "KB-0004", "concepts": ["Evidenzgrenzen", "zulässige Aussagen", "Zielkompetenzen"], "needed_for": "understanding"}, {"id": "KB-0005", "concepts": ["Kompetenzcanvas", "Entscheidungsreichweite", "Wirkungskette"], "needed_for": "understanding"}, {"id": "KB-0006", "concepts": ["Hands-on-Tiefe", "Architekturnachweis", "Spezialistenübergabe"], "needed_for": "understanding"}, {"id": "KB-0009", "concepts": ["Labstrategie", "Gegenprobe", "Evidenzgrenze"], "needed_for": "lab"}], "related": ["KB-0011", "KB-0012", "KB-0014", "KB-0015", "KB-0016", "KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "applies": ["KB-0400", "KB-0434", "KB-0464", "KB-0500", "KB-0572", "KB-0618", "KB-0720"], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein nicht produktiver Testcluster oder eine vollständige Fallarbeit erhält einen Golden Path mit Namespace, Workload-Identität, Quota, Default-Deny-Netz, Modellgateway, Telemetrie und negativer Mandantentrennungprobe.", "rationale": "Ein Plattformangebot ist erst durch einen konsumierbaren, fehlertoleranten und beobachtbaren Pfad belegbar."}, "ARCHITECT-TARGET": {"active": true, "scope": "Die Rolle entwirft Produktgrenze, Isolationsstufe, Schnittstellen, SLO, Kapazitätsmodell, Supportmodell und Exit.", "rationale": "Eine AI-Plattform ist ein Produkt für Teams und keine Sammlung von Infrastrukturtools."}, "STAFF-TARGET": {"active": true, "scope": "Sie etabliert Golden Paths, policy-as-code, Produktmetriken und einen Ausnahmeprozess für mehrere Teams.", "rationale": "Staff-Wirkung ist sichere Self-Service-Fähigkeit über einzelne Projekte hinaus."}, "CHIEF-TARGET": {"active": true, "scope": "Sie steuert Zielbild, Investitionsgrenzen, Anbieter- und Souveränitätsrisiko, Ownership und Portfolio-Priorisierung.", "rationale": "Diese Entscheidungen prägen dauerhafte Kosten, Abhängigkeiten und Betriebsrisiken."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "GPU-Kernel, CNI/eBPF, Kryptografie, Training, Vertrags-FinOps und reguliertes Recht werden bei dominanten Risiken mit Spezialisten vertieft.", "rationale": "Der Architect integriert und eskaliert Spezialwissen, ohne es als eigene belegte Tiefe auszugeben."}}, "lab_validation": [{"lab_id": "KB-0013-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-15", "environment": "Dokumentierter Mehrteam-Fall auf einem ausdrücklich nicht produktiven Kubernetes-Testcluster oder als Papier-Lab", "evidence": "Der Fall spezifiziert Tenant- und Workload-Identität, Namespace-Policy, Quota, Modellgatewayvertrag, Tracefelder, SLO, Kostenlimit, negative Cross-Tenant-Probe und Cleanup.", "limitations": "Kein Cluster, keine CNI-Policy-Durchsetzung, kein GPU-Gerät und keine Modellproviderintegration wurden ausgeführt."}]}
---
# AI Platform Architect als Zielrolle

## Zweck, Definition und Scope

Ein AI Platform Architect gestaltet gemeinsame technische Fähigkeiten, über die mehrere Teams AI- und agentische Produkte sicher, wiederholbar und wirtschaftlich bauen sowie betreiben können. Die Plattform ist weder das Modell noch ein einzelner Use Case. Sie stellt einen versionierten Weg für Identität, Berechtigung, Datenzugang, Modell- und Toolrouting, Deployment, GPU- oder Providerkapazität, Evaluation, Telemetrie, Kostenallokation und Incident-Unterstützung bereit. Produktteams verantworten weiterhin fachliche Regeln und Nutzerwert; die Plattform macht wiederkehrende Kontrollen und Betriebsmechanismen so nutzbar, dass Teams sie wirklich anwenden.

Dies ist ein Zielrollenmodell, kein behaupteter aktueller Jobtitel. Eigene Entwicklungsarbeit an einer AI-Anwendung oder ein Konzept zu Modellrouting, GPU-Partitionierung, Tracing und Evaluation kann Lernkontext liefern, erlaubt aber keine Behauptung über reale Mandanten, Clustergröße, SLO oder organisationsweite Plattformführung.

Nach diesem Kapitel kann der Leser:

1. eine AI-Plattform als internes Produkt mit Nutzersegment, Vertrag, Onboarding, Support und Exit beschreiben;
2. Team-, Kunden-, Daten-, Workload- und GPU-Isolation anhand von Risiko, Last, Kosten und Regulatorik abwägen;
3. Control Plane, Data Plane und fachliche Autorität so trennen, dass Modelloutput keine Berechtigung oder Geschäftsregel erzwingt;
4. einen Golden Path aus Identität, Policy, Delivery, Modellgateway, Evaluation, Observability und Kostenmetern entwerfen;
5. Kapazität, Fairness, SLO, Failure Modes und Kosten pro akzeptiertem Ergebnis messbar machen;
6. Staff-, Principal- und Chief-Entscheidungen mit Owner, Ausnahme, Exit und erneuter Bewertungsbedingung dokumentieren.

## Kompetenzmarker und Evidenzgrenzen

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Ein Testangebot enthält Identität, Namespace, Quota, deny-by-default-Netz, Gatewayvertrag, Trace und negative Zugriffprobe. |
| ARCHITECT-TARGET | aktiv | Produktgrenze, Isolationsstufe, NFRs, Kapazitätsmodell, SLO, Support und Exit werden begründet. |
| STAFF-TARGET | aktiv | Mehrere Teams erhalten einen sicheren, messbaren Self-Service-Weg mit Ausnahmeprozess. |
| CHIEF-TARGET | aktiv | Zielbild, Investition, Souveränität, Anbieterbindung, Ownership und Risikobudget werden als Portfolio geführt. |
| SPECIALIST-OPTIONAL | aktiv | Tiefe Kernel-, GPU-, Netzwerk-, Security-, FinOps- und Rechtsfragen werden bei Bedarf gezielt ergänzt. |

Ein Kompetenzziel ist kein Ist-Nachweis. Ein rein konzeptioneller Bezug zu GPU-Partitionierung erlaubt beispielsweise keine Aussage, dass ein bestimmtes MIG-Profil, Device Plugin, Treiber oder Kubernetes-Cluster produktiv beherrscht wird.

## Mental Model: Die Plattform als abgesicherte Stadt

Die Plattform baut Straßen, Regeln, Adressen, Versorgungsnetze und Alarmwege. Sie entscheidet nicht, welche Geschäftslogik jedes Team in seinem Haus betreibt. Der Golden Path ist die sichere Standardstraße: Teams können liefern, ohne bei jedem Deployment ein Plattformticket zu öffnen. Die Plattform hält Identität, Leitplanken, Kapazität, Messung und Notfallwege konsistent.

Die Analogie hat Grenzen: Ein gemeinsamer Cluster oder Gateway ist nicht neutral, sondern erzeugt Fehlerkopplung, Kostenallokation und Sicherheitsgrenzen. Fünf Invarianten halten das Modell präzise:

1. **Modelloutput ist untrusted input.** Autorisierung, Validierung und Zustandsänderung bleiben bei deterministischen Fachsystemen.
2. **Tenancy ist ein Vektor.** IAM, Control Plane, Netzwerk, Daten, GPU, Telemetrie und Supportzugriff können unterschiedliche Schutzstärken haben.
3. **Self-Service braucht einen Vertrag.** API oder Template ohne Version, SLO, Owner, Support und Rückbaupfad ist kein Plattformprodukt.
4. **Default sicher, Ausnahme sichtbar.** Jede Abweichung hat Owner, Zusatzkontrolle, Ablaufdatum und Rückkehrkriterium.
5. **Geteilte Kapazität braucht Fairness.** Quota, Priorität, Backpressure und Rücknahme müssen zu realer Kapazität passen.

## Prerequisites und Dependencies

Harte Grundlagen sind die [Rollen- und Kompetenzmatrix](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [Selbsteinschätzung und Evidenzgrenzen](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), das [Kompetenzmodell](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), die [Lerntiefe](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und die [Labstrategie](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md).

| Beziehung | Kapitel | Nutzung |
|---|---|---|
| related | [KB-0011: GenAI Solution Architect](01-genai-solution-architect-als-zielrolle.md) | Der konkrete Fach-Use-Case konsumiert Plattformfähigkeiten. |
| related | [KB-0012: GenAI Engineer](02-genai-engineer-als-zielrolle.md) | Implementiert Gateway-, Eval- und Telemetrieintegration gegen den Plattformvertrag. |
| related | [KB-0014: Platform Architect](04-platform-architect-als-zielrolle.md) | Erweitert die AI-Fähigkeiten auf die gesamte interne Entwicklerplattform. |
| related | [KB-0015: Enterprise Architect](05-enterprise-architect-als-zielrolle.md) | Verbindet Plattformgrenzen mit Capability, Daten, Prozessen und Portfolio. |
| related | [KB-0016: Cloud Architect](06-cloud-architect-als-zielrolle.md) | Vertieft Standort, Netzwerk, Resilienz, Provider und Cloudkosten. |
| applies | [KB-0400: Admission Control](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0400) | Durchsetzung von Workload-Leitplanken. |
| applies | [KB-0434: NVLink und NVSwitch](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0434) | Hardwaretopologie für Mehr-GPU-Inferenz. |
| applies | [KB-0464: AWS IAM](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0464), [KB-0500: GCP VPC](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0500) | Konkrete Cloud-Identitäts- und Netzmechanik. |
| applies | [KB-0572: Grafana](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0572), [KB-0618: Datenschutzarchitektur](../00-navigation-governance/01-master-index-und-wegweiser.md#kb-0618) | Betriebs- und Datenschutzvertiefung. |

## Core Concepts und Mechanismen

### Ein Plattformprodukt hat einen konsumierbaren Vertrag

Ein Angebot ist erst ein Produkt, wenn ein klarer interner Nutzer ein messbares Ergebnis mit bekannten Grenzen erhält. Beispiel: „Ein registriertes Produktteam kann eine AI-Anwendung über ein Modellgateway bereitstellen und erhält Workload-Identität, erlaubten Datenzugang, Standardtelemetrie, ein Eval-Gate und ein Kostenmeter.“ Das ist überprüfbarer als „Wir bieten Kubernetes und LLMs“.

| Vertragselement | Leitfrage | Nachweis |
|---|---|---|
| Nutzersegment | Wer konsumiert: Team, Geschäftsfeld, externer Kunde? | Onboarding- und Ownershipprofil. |
| Wert | Welche wiederkehrende Arbeit wird sicherer oder schneller? | Baseline, Adoption, Durchlaufzeit oder Qualitätskennzahl. |
| Schnittstelle | Wie wird konsumiert? | Versionierte API, Git-Template, Pipeline, CRD oder Portal. |
| Guardrails | Was ist zwingend? | IAM, policy-as-code, Datenklasse, Audit und Freigabegate. |
| Zuverlässigkeit | Was wird zugesichert und wer reagiert? | SLO, Fehlerbudget, Runbook, Supportfenster. |
| Kosten | Was wird wem zugerechnet? | Meter, Labels, Budget, Showback/Chargeback. |
| Exit | Wie endet der Konsum? | Datenexport/-löschung, Adaptergrenze, Rückbauplan. |

Ein Portal ohne Automatisierung wird ein Ticketsystem. Eine technische API ohne Owner wird eine ungepflegte Abhängigkeit. Die Rolle gestaltet technische Durchsetzung und internes Produktmanagement zusammen.

### Control Plane, Data Plane und Fachplane

- **Control Plane:** verwaltet gewünschten Zustand: Team, Tenant, Identität, Policy, Modellkatalog, Quota, Deploymentvorlage und Zugriffsfreigabe. Sie darf nicht unnötig im synchronen Nutzerpfad liegen.
- **Data Plane:** verarbeitet konkrete Anfrage: Edge, Authentisierung, Gateway, Modellroute, Retrieval, Tooladapter, Antwort und Telemetrie.
- **Fachplane:** bleibt System of Record für Berechtigung, Preis, Reservierung, Zahlung, Prozessstatus und Auditpflicht. Sie prüft Tools immer selbst.
- **Operations Plane:** beobachtet und recoveriert die anderen Ebenen mit kurzlebigem, auditiertem Zugriff statt dauerhaften Adminschlüsseln.

Der gewünschte Zustand muss mit dem realen Zustand rückgekoppelt sein: Registrierung oder Git-Änderung → Policyprüfung → Provisionierung → Status → Laufzeittelemetrie → Kosten- und Qualitätsrückfluss. Diese Schleife ist etwas anderes als eine Nutzeranfrage.

### Tenancy ist ein Vektor, kein Häkchen

| Dimension | Schutzobjekt | Beispielkontrolle | Häufiger Fehler |
|---|---|---|---|
| Identität | Mensch, Workload, CI | OIDC, Workload Identity, kurzlebige Tokens | Namespace als Identität behandeln. |
| Control Plane | API-Objekte und Policies | RBAC, Projekte/Accounts, Admission | Read-only-Zugang zu Secrets oder Metadaten unterschätzen. |
| Netzwerk | Ost-West und Egress | Default Deny, explizite Ziele, mTLS, Egress Proxy | NetworkPolicy ohne wirksames CNI als Schutz annehmen. |
| Daten | Quellen, Prompts, Embeddings, Backups | ABAC, Schlüssel, Retention, Retrievalfilter | Embeddings pauschal als anonym ansehen. |
| Compute | CPU, RAM, GPU, Queue, IOPS | Requests/Limits, Quota, Priorität, Pools | Quota mit realer Kapazitätsreservierung verwechseln. |
| Modell/Tools | Modellroute und Aktion | Allowlist, scoped Credentials, Toolgateway, Idempotenz | Prompt als Autorisierungsmechanismus einsetzen. |
| Telemetrie | Traces, Logs, Kosten | Redaction, Sampling, Tenant-Scope | Betriebsdaten als nicht sensibel behandeln. |
| Betrieb | Support- und Break-glass-Zugriff | JIT, Approval, Audit, Ablauf | Zentraler Adminzugriff ohne Begrenzung. |

Kubernetes beschreibt Namespace pro Tenant und virtualisierte Control Planes als unterschiedliche Muster. Namespace-Sharing hat geringen Overhead, verlangt jedoch RBAC-, Quota-, Netz-, Daten- und Add-on-Kontrollen; nicht namespaced Ressourcen bleiben eine wichtige Grenze. Virtual Control Planes erhöhen Isolation und Betriebsaufwand. Die [offizielle Kubernetes-Multitenancy-Dokumentation](https://kubernetes.io/docs/concepts/security/multi-tenancy/) ist Ausgangspunkt, keine komplette SaaS-Sicherheitsgarantie.

### Golden Path, Guardrail und Escape Hatch

Ein Golden Path besteht aus einem vollständigen Ablauf:

1. Team registriert Service, Owner, Datenklasse, Modellwunsch und Kostenstelle.
2. Control Plane erzeugt identitäts- und policygebundene Ressourcen.
3. CI prüft Artefakt, Konfiguration, Eval-Regression und Policy.
4. Laufzeit nutzt Gateway, erlaubte Modelle und Tools.
5. Telemetrie korreliert Deployment, Route, Qualität, Latenz und Kosten.
6. SLO, Dashboard und Supportweg machen Abweichungen sichtbar.
7. Ein Exit entzieht Identität, beendet Kostenallokation und löscht temporäre Daten nach Policy.

Ein Paved Road ist bequem, ein Guardrail zwingend. Ein Escape Hatch erlaubt begründete Abweichung mit Owner, Zeitlimit, Zusatzkontrolle, Kosten- und Rückkehrplan. Ohne Escape Hatch entstehen Schattenplattformen; ohne Ablaufzeit wird jede Ausnahme zum ungesteuerten Standard.

### Kapazität für AI-Last

Inferenzlast braucht mehr als CPU-Auslastung: Modellgewichte, KV-Cache, Prompt-/Outputlänge, Batch, Nebenläufigkeit, Hardwaretopologie, Queue, Netzwerk, Providerlimits und Qualitätsgates. Eine erste Speicherplausibilisierung lautet:

\[
M_{weights} + M_{kv}(B,L_{in},L_{out}) + M_{runtime} \leq M_{allocatable}
\]

Das ist kein Leistungsversprechen. Fragmentierung, Quantisierung, Offload, Reserve und Scheduler können die reale Grenze verändern. Deshalb veröffentlicht eine Plattform getestete Leistungsklassen mit Annahmen statt universeller Tokens-pro-Sekunde-Zahlen.

NVIDIA beschreibt MIG als Partitionierung unterstützter GPUs in Instanzen mit zugewiesenen Compute- und Memory-Ressourcen. Das verbessert je nach Workload Auslastung und Planbarkeit, ersetzt aber weder IAM noch Netzwerk-, Daten-, Telemetrie- oder Betriebsisolation. Hardware-, Treiber-, Runtime- und Orchestrator-Kompatibilität müssen für die konkrete Matrix validiert werden; siehe [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/).

## Architektur und Data Flow

Der folgende fiktive Lernfall hat drei Teams: Commerce Support, interne Wissensassistenz und Gebäudebetrieb. Sie haben verschiedene Datenklassen und Fehlkosten. Das Plattformteam betreibt Gateway und Basiskontrollen; Fachteams verantworten Daten und Fachtools.

```text
Team-Repo/API → Service-Katalog, Owner, Policy, Quota, Eval
                         │
                         ▼
Endnutzer → Edge → App → Model Gateway → Modellroute/Provider oder GPU
                             │                 │
                             │                 ├─ Retrieval mit Tenant-ACL
                             │                 └─ Tool Gateway → Fachservice/System of Record
                             ▼
                  Trace, Meter, Auditereignis → OTel, SLO, Kosten, Incident
```

Ablauf einer Commerce-Anfrage:

1. Die Produktanwendung authentisiert den Nutzer und bestimmt den fachlichen Kontext.
2. Das Gateway prüft Serviceidentität, Modellallowlist, Datenklasse, Budget und Rate Limit.
3. Retrieval sieht nur Quellen, die zur Daten- und Fach-ACL passen. Fehlende Quellen führen zu sicherer Rückgabe statt erfundener Antwort.
4. Eine Toolabsicht wird strukturiert an einen Fachservice gesendet. Dieser prüft Berechtigung, Idempotency Key und Geschäftsregel nochmals selbst.
5. Telemetrie erhält Request-ID, Route, Latenz, Tokenzählung, Fehlerklasse und kostenrelevante Attribute, aber nicht automatisch Rohprompt oder Kundendaten.
6. Asynchrone Evals und Kostenaggregation dürfen den Antwortpfad nicht blockieren.

## Protocols, Standards und Tools

| Bereich | Standards oder Technik | Architekturaussage |
|---|---|---|
| Identity | OIDC/OAuth 2.0, mTLS, Workload Identity, kurzlebige Credentials | Nutzer- und Workloadidentität werden getrennt und auditierbar modelliert. |
| API/Tools | TLS, REST/gRPC, JSON/Protobuf-Schema, Idempotency Key | Freitext wird nicht direkt zu einer Fachaktion. |
| Supply Chain | OCI Images, Signatur/Provenance, SBOM, deklarative Delivery, Admission Policy | Startbares Image ist nicht automatisch zulässig. |
| Kubernetes | Namespace, RBAC, ResourceQuota, LimitRange, NetworkPolicy, Node Pool, Admission | Isolationsstärke entsteht aus geprüfter Kombination, nicht aus einem Objekt. |
| GPU | Device Plugin, Scheduler, Accelerator Pool, optional MIG | Ressourcennamen und Slicing sind installationsabhängig und müssen im Plattformvertrag stehen. |
| Gateway | Modellkatalog, Provideradapter, Routing, Rate Limit, Fallback, Budget | Zentrale Policy braucht HA und darf kein unkontrollierter Single Point of Failure sein. |
| Telemetrie | OpenTelemetry Traces, Metrics, Logs, Resource Attributes | Gemeinsame Semantik erleichtert Korrelation; sensitive Inhalte erfordern Redaction und Zugriffsschutz. |
| Risiko | NIST AI RMF: Govern, Map, Measure, Manage | Rahmen für fortlaufende Risikoarbeit, keine automatische Compliancegarantie. |

OpenTelemetry definiert gemeinsame Bedeutungen für Traces, Metriken, Logs und Ressourcenattribute. Die reguläre Semantik verweist GenAI-Konventionen in ein eigenes Repository; SDK- und Collector-Upgrades müssen deshalb gemeinsam mit Schema, Dashboard und Evals versioniert werden. Siehe [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/). Der [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) strukturiert Risikoarbeit durch Govern, Map, Measure und Manage, ersetzt aber weder Rechtsprüfung noch konkrete technische Kontrolle.

## Konfiguration und Implementierung

Dieses Minimalbeispiel zeigt eine logische Teamgrenze in einem nicht produktiven Cluster. Es ist kein vollständiges Produktionsmanifest. Es setzt einen wirksamen CNI, eine Identitätsintegration und Security Review voraus.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ai-commerce-test
  labels:
    platform.example/tenant: commerce
    platform.example/data-class: confidential
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: workload-budget
  namespace: ai-commerce-test
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "12"
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: ai-commerce-test
spec:
  podSelector: {}
  policyTypes: ["Ingress", "Egress"]
```

Das erstellt keinen erlaubten Netzwerkpfad, keine Reservierung eines Knotens und keine Datenverschlüsselung. Nach Default Deny werden DNS, Gateway und explizite Fachdienste gezielt erlaubt. Kubernetes dokumentiert, dass NetworkPolicy ohne unterstützendes CNI nicht durchgesetzt wird; Quota begrenzt Namespace-aggregate, isoliert aber keine Nodes oder erhöht nicht automatisch die Clusterkapazität. Siehe [Kubernetes Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/).

Für GPU-Workloads darf ein Manifest nur Ressourcennamen anfordern, die das installierte Device Plugin tatsächlich anbietet. Die Plattform dokumentiert Hardware, Treiber, Runtime, Pluginversion, Profil, Node Pool, Scheduling- und Repartitionierungsregel. Ein Platzhalter wie `vendor.example/ai-accelerator-profile` ist ausdrücklich kein echter Ressourcenname.

Der Gatewayvertrag enthält mindestens Service-ID, Teamowner, Modellalias, Datenklasse, Request- und Tokenlimit, Timeout, Retrybudget, Budgetklasse, Toolallowlist, Eval-Suite-Version, Telemetrieprofil und Fallbackverhalten. Ein Fallback auf ein anderes Modell ist eine eigenständige Daten-, Qualitäts- und Kostenpolicy, kein transparenter Retry.

## Scalability und Performance

| Größe | Einheit | Warum sie zählt |
|---|---:|---|
| Eingangslast | Requests/s und Bursts | Dimensioniert Gateway, Queue und Providerquota. |
| Kontext/Ausgabe | Token pro Request, Perzentile | Treibt KV-Cache, Latenz, Providerkosten und Promptgrenzen. |
| Nebenläufigkeit | aktive Requests oder Streams | Treibt Queue, Connection Pools und Accelerator-Speicher. |
| E2E-Latenz | p50/p95/p99 je Phase | Trennt Gateway-, Retrieval-, Modell- und Toolengpass. |
| Qualitätsrate | task-spezifische Eval- und Policyquote | Verhindert Optimierung nur auf Durchsatz. |
| Kapazitätsverlust | verfügbare Knoten/Routen | Bestimmt Reserve und SLO-Realismus. |
| Kosten | Euro pro akzeptiertem Task | Verbindet technische Nutzung mit fachlichem Ergebnis. |

Little's Law, \(N=\lambda W\), liefert eine Plausibilisierung für mittlere Gleichzeitigkeit. Bei AI-Last bleiben Tokenlänge, Batch, Queue und Modellroute wichtige Nichtlinearitäten. Ein Plattformangebot nutzt Rate Limits, gewichtete Queues, Team-Priorität, Backpressure und sichtbaren Degradationsmodus. Bei Überlast darf es etwa eine Antwort verkürzen oder verzögern; es darf nie Authentisierung, Datenklasse oder Fachinvariante lockern.

| Option | Geeignet wenn | Vorteil | Grenze |
|---|---|---|---|
| Shared Cluster/Namespace | Teams ähnliche Basiskontrollen und begrenzte gegenseitige Vertrauensannahmen haben | weniger Overhead und bessere Auslastung | Add-ons, Daten, Netzwerk und nicht namespaced Ressourcen brauchen Zusatzkontrollen. |
| Virtual Control Plane | API-Isolation über Namespace hinaus nötig ist | stärkere Control-Plane-Segmentierung | höherer Betrieb und schwierigeres Sharing. |
| Dedizierter Cluster/Account | Datenklasse, Blast Radius oder Lebenszyklus stark abweichen | klare Fehl- und Ownershipgrenze | Grundkosten und Kapazitätsfragmentierung. |
| Externer Modellprovider | Modellvielfalt oder Burstlast dominieren | schnelle Elastizität | Providerquote, Egress, Daten- und Konzentrationsrisiko. |
| Eigener GPU-Pool | stabile Grundlast oder Souveränität dominiert | Kontrolle über Datenpfad und Auslastung | Hardware-, Energie-, Treiber- und Reserverisiko. |

## Reliability und Failure Modes

| Fehlerbild | Signal | Schutz | Recovery |
|---|---|---|---|
| Gateway/DNS ausgefallen | Connect- und Timeoutfehler, synthetische Checks rot | HA, Timeouts, Circuit Breaker, getesteter Ingress | kontrollierter Fehler oder vorab bewerteter Fallback; kein Direktsprung um Policy herum. |
| Providerquota oder Route erschöpft | 429/5xx, Queue wächst | pro Team Limits, Queue, Reserve, alternative geprüfte Route | nur zugelassene Fallbackroute mit Qualitäts- und Datenprüfung. |
| GPU-Knoten verloren/fragmentiert | Pending Pods, OOM, Device-Plugin-Fehler | Pools, Reserve, Events, Anti-Affinity | Jobs neu schedulen; Repartitionierung als Wartungsoperation behandeln. |
| Noisy Neighbor | p99 und Queue eines Teams steigen | Requests/Limits, Quota, Priorität, getrennte Pools | drosseln oder Isolation erhöhen; Quota garantiert kein Netzwerk-QoS. |
| Policy-Bug blockiert Delivery | Admission denies steigen | Staging, Auditmodus, versionierte Policy, Break-glass | auf geprüfte Version zurückrollen, Ausnahme auditieren. |
| Retrieval leakt Daten | ACL-Mismatch, Quellenanomalie | Zugriff vor/nach Retrieval, scoped Index, Provenance | Ingestion stoppen, Index korrigieren, Audit und Incidentprozess. |
| Telemetrie leak/blind | DLP Alarm oder fehlende Traces | Redaction, getrennte Zugriffe, Sampling, Schemacheck | Export stoppen; Hauptpfad nicht wegen optionaler Telemetrie blockieren. |
| Kostenloop | Tokens/Request, Retry oder Burnrate steigt | max tokens, Budget, Idempotenz, Alarm | Route drosseln, Konfigversion zurückrollen, Owner entscheidet. |

Retry ist nur für klar temporäre und sichere Fehler sinnvoll. Bei Timeout einer potenziell zustandsändernden Toolaktion wird nicht blind wiederholt: Der Fachservice prüft Idempotency Key und Endzustand. Ein HTTP-Erfolg sagt zudem nichts über fachliche Qualität, Grounding oder Berechtigung.

## Security, Governance und Compliance

| Bedrohung | Plattformkontrolle | Produktteamverantwortung |
|---|---|---|
| Gestohlenes Credential | kurzlebige Tokens, Workload Identity, least privilege, Audit | keine Secrets in Logs/Repos, korrekte Serviceklassifikation. |
| Prompt Injection | Content Boundary, Toolallowlist, strukturierte Parameter, Evals | erlaubte Fachaktionen und Human Gate festlegen. |
| Cross-Tenant-Zugriff | IAM, scoped Retrieval, Netz-/Control-Plane-Isolation, Audit | korrekte Tenant- und Fach-ACL liefern. |
| Privilegiertes Add-on | minimierte Rollen, Supply-Chain-Prüfung, JIT-Admin | Abhängigkeiten deklarieren und Ausnahmen prüfen. |
| Kapazitätsmissbrauch | Quota, Rate Limit, Budget, Anomalieerkennung | ehrliches Lastprofil, Kostenstelle, keine Umgehung. |
| Telemetrieabfluss | Redaction, Retention, Zugriffstrennung | keine Rohprompts ohne begründeten Bedarf instrumentieren. |

Für jedes Angebot sind Data Owner, Platform Owner, Product Owner, Security/Privacy, Incident-Entscheider, Ausnahmegenehmiger, Retention- und Decommissioning-Owner benannt. NIST AI RMF kann Rollen und Risikoarbeit strukturieren, ist aber keine juristische Freigabe. Telemetrie folgt Datenminimierung: Request-ID, Modellalias, Status, Tokenzählung, Latenz und Fehlerklasse reichen häufig; Inhalte, Nutzerkennungen, Quellen und Toolpayloads brauchen gesonderte Begründung, Zugriff, Aufbewahrung und Löschung.

## Observability und Troubleshooting

| Ebene | Signale | Leitfrage |
|---|---|---|
| Control Plane | Provisionierungszeit, Drift, Policy denies, Reconciliation | Ist das Angebot korrekt und schnell bereitgestellt? |
| Gateway | Requests, Auth deny, Rate limit, Routeanteil, Retry, p95/p99 | Ist Einstieg erreichbar und richtige Route aktiv? |
| Modell/Provider | Queue, TTFT, Generationdauer, Tokens, Fehler, Quota | Liegt der Engpass vor, in oder hinter dem Modell? |
| Retrieval/Tools | ACL deny, Nulltreffer, Quellenabdeckung, Idempotenzkonflikt | Ist Kontext zugelassen, aktuell und fachlich sicher? |
| Compute | Pending-Zeit, OOM, Accelerator Health, Auslastung/Wartezeit | Fehlt Kapazität oder verhindert Fragmentierung Zuteilung? |
| Qualität/Sicherheit | Evalpassrate, Policyfälle, Human-Eskalation | Erkauft Durchsatz unvertretbare Qualität? |
| Kosten/Nutzen | aktive Teams, Time-to-first-deployment, Kosten/Task, Ticketquote | Liefert die Plattform echten internen Produktwert? |

Diagnosepfad bei steigender Antwortlatenz:

1. Scope abgrenzen: Team, Region, Modellroute oder alle Services? Letzte Änderung und letzte gute Zeit prüfen.
2. Trace an der Edge beginnen und Auth, Gateway, Queue, Retrieval, Modell und Tool getrennt vergleichen. Keine Rohprompts als Debugstandard exportieren.
3. Bei Queuewachstum Ankunftsrate, Rate Limit, Providerfehler und Consumer-/GPU-Kapazität trennen.
4. Bei Pending Pods Schedulerereignisse, Acceleratoradvertisement, Requests/Limits, Quota und Fragmentierung prüfen. Niedrige Durchschnittsauslastung bedeutet nicht, dass ein passendes Profil frei ist.
5. Kontrollierte Gegenprobe ausschließlich in freigegebener Testumgebung durchführen und Ergebnis, Kosten sowie Datenklasse festhalten.
6. Geänderte Policy oder Route nur gegen eine versionierte, geprüfte Referenz zurückrollen und Blast Radius dokumentieren.

## Cost und FinOps

\[
C_{service}=C_{fixed}+C_{compute}+C_{model}+C_{storage}+C_{network}+C_{observability}+C_{operations}
\]

\[
C_{accepted\ task}=\frac{C_{service}}{\max(1,N_{accepted\ tasks})}
\]

Ein akzeptierter Task wird fachlich definiert, beispielsweise eine quellen- und berechtigungsgebundene Antwort oder ein nach Human Gate übernommener Vorgang. Billige Requests, die Supportarbeit und Fehlentscheidungen auslösen, sind kein günstiges Ergebnis.

| Kostentreiber | Allokation | Steuerhebel | Anti-Pattern |
|---|---|---|---|
| Externe Modelle | Tokens, Route, Region, Retry | Modellpolicy, max tokens, Kontextdisziplin, Caching | nur Inputtokens zählen. |
| GPU-Pool | reservierte/aktive Accelerator-Zeit und Profil | Queue, Poolgrenze, Slicing, Abschaltfenster | hohe Auslastung ohne p99 betrachten. |
| Daten/Retrieval | Speicher, Ingestion, Embedding, Query, Retention | Lebenszyklus, Deduplizierung, Indexstrategie | Vektordaten als kosten- und risikofrei behandeln. |
| Netzwerk | Egress, Zone/Region, private Verbindung | Datenplatzierung, Routing | Fallback ohne Transferkosten planen. |
| Observability | Ingestion, Kardinalität, Retention | Sampling, Aggregation, Redaction | jeden Prompt dauerhaft loggen. |
| Organisation | FTE, Support, Compliance, Incident | Self-Service, klare Grenzen, Automatisierung | nur die Cloudrechnung zählen. |

Showback schafft Transparenz vor verbindlichem Chargeback. Chargeback braucht messbare Nutzung, Budgetowner, Streitfallprozess und Behandlung gemeinsamer Fixkosten. Die Plattform liefert Kosten- und Kapazitätsevidenz; sie entscheidet nicht allein über fachliche Prioritäten.

## Trade-offs und Anti-Patterns

| Entscheidung | Alternative | Trade-off und Reviewtrigger |
|---|---|---|
| Zentraler Modellgateway | direkte Providerintegration | einheitliche Policy und Kostenmessung gegen kritische Abhängigkeit; bei hohem Bypass oder SLO-Bruch neu bewerten. |
| Shared Cluster | dedizierter Cluster/Account | Auslastung gegen Blast Radius und Isolationsaufwand; bei neuer Datenklasse oder Chaos-Testbefund neu bewerten. |
| Zentrales Plattformteam | föderierte Fähigkeiten | Konsistenz gegen Domänennähe; bei Ticketstau oder divergierenden Standards neu bewerten. |
| Eigene Inferenz | externer Provider | Steuerbarkeit gegen Hardwarebetrieb; bei veränderter Grundlast oder Vertragslage neu bewerten. |
| Harte Policy | Leitlinie | Schutz gegen Workarounds; jede Deny-Policy braucht begründeten, befristeten Escape Hatch. |
| Vollständige Prompttraces | minimierte Telemetrie | Diagnosegewinn gegen Datenschutz- und Kostenrisiko; Inhalte nur gezielt und policygebunden. |

Anti-Patterns sind Toolkatalog statt Produktvertrag, „Namespace gleich Mandant“, Golden Path als starres Zwangstemplate, Gateway als Sicherheitsmagie, GPU-Auslastung als einzige Kennzahl, ungebremste Observability, Retry als Verfügbarkeitsstrategie und das Plattformteam als Ticket-Hub.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Evidenz, Folge und Trigger |
|---|---|---|
| Staff | Golden Path v1 als deklarativer Vertrag mit Template, CI-Gate und API | Zwei Teams müssen ihn mit weniger manuellen Schritten als den bisherigen Weg nutzen können. Hohe Ausnahmequote löst Produktverbesserung aus. |
| Staff | Minimales Telemetrieschema | Gemeinsame technische Attribute, tenant-scoped Zugriff, Redaction und Schemaadapter. Neue Semantikversion oder Datenschutzbefund löst Review aus. |
| Principal | Zentraler Gateway mit domänennahen Daten- und Toolgrenzen | Datenfluss, Anbieterbindung, HA, Kosten, Migration und Organisationsfähigkeit entscheiden. Wiederholte Adapterduplikation oder nicht auditierbare ACLs lösen Neubewertung aus. |
| Principal | Isolationsprofil nach Risiko statt Einheitscluster | Jede Datenklasse erhält begründete Control-, Data-, Network-, Compute- und Operationsgrenzen. Schwere Incidents oder geänderte Rechtslage lösen Review aus. |
| Chief | GPU-Grundkapazität versus Provider-first | Lastprofil, Ausfallmodell, Energie/Betrieb, Souveränität und Vertragsrisiko vor Investition. Anhaltende Queue-/Auslastungsabweichung löst Review aus. |
| Chief | Zentrale versus föderierte Ownership | Teamtopologie, Adoption, Supportlast, Incidentmuster und Ausnahmequote entscheiden. Ticketcentralisierung oder Schattenplattformen sind Warnsignale. |
| Chief | AI-Risikobudget | Use-Case-Klassen, Fehlerkosten, Evalbelege und Human Gates werden als Portfolio gesteuert. Modell-, Tool- oder Datenflusswechsel ist ein Trigger. |

Chief-Level heißt nicht, jede Kubernetes- oder Modellversion zu genehmigen. Es heißt, Standards, zulässige Varianten, Investitionsgrenzen und Verantwortlichkeit so zu setzen, dass Teams Wert liefern können, ohne irreversible Risiko- oder Kostenpfade zu erzeugen.

## Production Checklist

| Bereich | Beleg vor Go-live | Owner | Stop/Rollback |
|---|---|---|---|
| Produktvertrag | Servicekatalog, Nutzersegment, SLO, Support, Exit | Platform Product Owner | kein benannter Owner oder kein messbarer Nutzen. |
| Identität | Workloadidentity, least privilege, Rotation, Audit | Security + Platform | dauerhafte Adminsecrets oder unklare Dienstidentität. |
| Tenancy | dokumentierte Ebenen, Quota, Netz- und Datenpfadtest | Platform + Data/Security | Cross-Tenant-Test ungeklärt oder Policy nicht wirksam. |
| Modell/Tools | Modellkatalog, Datenklasse, Toolvertrag, Idempotenz, Fallback | Platform + Domainowner | Tool ändert Fachzustand ohne Nachweis. |
| Delivery | prüfbare Artefakte, Staging, Policy, Rollback | Platform + Produktteam | ungetestete Policy oder fehlende Rückrollversion. |
| Qualität | Eval-Suite, negative Fälle, Schwelle, Driftplan | Produktteam + AI Owner | keine messbare Qualitäts-/Safetygrenze. |
| Betrieb | synthetische Checks, Dashboard, Alert, Runbook, On-call | SRE/Platform | kritischer Pfad ohne erreichbaren Support. |
| Kapazität | Lastprofil, Reserve, Queue, Provider/GPU-Matrix | Platform + Cloud | SLO braucht nicht zugesicherte Kapazität. |
| Kosten | Meter, Budgetowner, Alarm, Showback | FinOps + Product Owner | Kostenstelle oder Limit fehlt. |
| Datenschutz | Klassifikation, Redaction, Retention, Löschung | Privacy/Security + Platform | sensibler Export oder fehlender Löschpfad. |

## Interviewfragen mit Antwortleitfäden

1. **Wann brauchen Teams eine AI-Plattform?** Nenne wiederkehrende Nutzer, Kontroll- und Betriebsprobleme, Vertrag und Kosten der Zentralisierung. Ein einzelner Pilot ist kein Beweis.
2. **Warum ist Namespace nicht gleich Mandant?** Erkläre RBAC, nicht namespaced Ressourcen, CNI, Daten, Storage, Telemetrie, Add-ons und Supportzugriff.
3. **Wie entwerfen Sie einen Golden Path?** Beginne bei Nutzer, Datenklasse, Risiko und SLO; schließe Identität, Policy, Delivery, Gateway, Eval, Telemetrie, Kosten und Gegenprobe an.
4. **Wann zentralisieren Sie ein Modellgateway?** Wäge Policy, Audit, Rate Limit und Metering gegen HA, Entwicklungsfluss und Bypass ab; fordere Exit und Fallbackdesign.
5. **GPU-Pool, MIG oder Provider?** Vergleiche Grundlast, Latenz, Daten, Hardwarebetrieb, Providerlimit, Kosten und Ausfall. MIG ersetzt keine übrige Tenancy-Kontrolle.
6. **Welche Kennzahl misst Plattformnutzen?** Kombiniere Adoption, Time-to-first-deployment, SLO, Eval-/Policyqualität, Kosten pro akzeptiertem Task, Supportlast und Ausnahmequote.
7. **Wie behandeln Sie eine Policy-Ausnahme?** Risiko, Owner, Zusatzkontrolle, Ablauf, Audit und Rückkehrkriterium dokumentieren. Wiederholung zeigt oft eine Produktlücke.
8. **Timeout nach Toolaktion?** Nicht blind wiederholen. Fachservice prüft Idempotency Key und Zustand; Nutzer erhält ehrlichen Pendingpfad, Plattform korreliert den Incident.

## Praktisches Lab / Fallarbeit

**Status:** **reviewed_only**, Stand 2026-09-15. Keine Cluster-, CNI-, GPU- oder Modellproviderausführung wurde durchgeführt. Diese vollständige Fallarbeit darf erst mit dokumentierter Testumgebung, Versionsständen, Ausgaben und Gegenproben auf **executed** oder gegebenenfalls **syntax_checked** angehoben werden.

### Ziel und Eingaben

Entwirf eine fiktive interne AI Runtime für zwei Teams:

- **Commerce:** vertrauliche Bestell- und Produktdaten; Statuserklärung erlaubt, Reservierung nur als Human-Gate-Entwurf.
- **Knowledge:** interne Handbücher; Lesezugriff, keine Fachzustandsänderung.
- **Grenzen:** maximal 300 Euro/Monat Pilotannahme, keine realen Cloud-/GPU-Käufe oder Produktionszugriffe.
- **SLO-Annahme:** 99,5 Prozent Gateway-Verfügbarkeit im Pilot; Knowledge-p95 unter vier Sekunden nur bei dokumentierter Testlast und verfügbarer Route.

Lege `platform-contract.md`, Teammanifeste, Netzpolicy, Gatewaypolicy, Evals, Runbook und Evidenzordner an. Verwende keine realen Secrets, Kunden- oder Produktionsdaten.

### Aufbau

1. Erstelle je einen Servicekatalogeintrag mit Owner, Datenklasse, Modellroute, Toolrechten, Kostenstelle, SLO, Support und Exit.
2. Definiere Namespace, ServiceAccount-Strategie, ResourceQuota und Default-Deny-Netz. Dokumentiere den benötigten CNI.
3. Beschreibe Gatewayfelder: Service, verifizierter Tenant, Modellalias, Datenklasse, Request- und Tokenlimit, Budgetklasse, Toolintent und Idempotency Key. Tenant darf nicht frei vom Client stammen.
4. Zeichne Daten- und Trust Boundaries bis zum Commerce-System of Record. Markiere Autorisierung, Retrievalfilter, Toolvertrag und Human Gate.
5. Lege Telemetrieattribute fest: Service, Route, Status, Latenzphasen, Tokenzählung, Budgetklasse und Fehlerklasse. Begründe die Abwesenheit von Rohprompt als Standardattribut.
6. Erstelle Eval-/Policyfälle für berechtigte Knowledge-Frage, fehlende Quelle, unzulässigen Toolintent, Cross-Tenant-Versuch und Tooltimeout.
7. Dokumentiere fiktive Kapazitäts- und Kostenrechnung mit klaren Annahmen.

### Negative Gegenproben

| Probe | Erwartete Beobachtung | Beweist nicht |
|---|---|---|
| Commerce-Workload wählt fremden Tenant | Gateway oder Datenservice verweigert; Audit enthält keine sensitive Nutzlast | globale Daten- oder Adminsicherheit. |
| Pod sendet Egress an unbekannten Host | bei wirksamem CNI blockiert; DNS und erlaubte Ziele separat getestet | dass eine NetworkPolicy ohne CNI greift. |
| Modell schlägt Reservierung ohne Human Gate vor | Fachservice lehnt ab oder erzeugt nur prüfbaren Entwurf | dass das Modell die Regel erzwingt. |
| gleicher Idempotency Key nach Timeout | Fachservice liefert bekannten Zustand oder Pending; keine Doppelreservierung | dass jedes Fremdsystem idempotent ist. |
| Budgetgrenze überschritten | Gateway drosselt/ablehnt, Kostenereignis sichtbar | dass Budgethöhe fachlich richtig ist. |

### Auswertung und Cleanup

Ordne jeder zugesagten Kontrolle Durchsetzungspunkt, Owner und Nachweis zu. Liste unbelegte Annahmen getrennt: CNI, Identity Claims, Device-Plugin-Matrix, Providerlimits, Datenschutzbewertung, Modellqualität und echte Last. Entferne danach Testnamespaces, Service Accounts und Testtelemetrie nach Retention. Bei Papierarbeit werden nur lokale Beispieldaten gelöscht und vermerkt, dass keine Infrastruktur erzeugt wurde.

**Abnahmekriterium:** Ein berechtigter Pfad und alle fünf Gegenproben müssen in isolierter, freigegebener Testumgebung dokumentiert sein. Ein grünes Deployment ohne Gegenprobe beweist den Golden Path nicht.

## Dependencies, Cross-References und Quellen

Die kanonische Rollen- und Evidenzsteuerung liegt in [KB-0002](../00-navigation-governance/02-rollen-kompetenz-matrix.md), [KB-0004](../00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md), [KB-0005](../00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md), [KB-0006](../00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md) und [KB-0009](../00-navigation-governance/09-laborstrategie-und-beweisartefakte.md). Produkt- und Implementierungsperspektive stehen in [KB-0011](01-genai-solution-architect-als-zielrolle.md) und [KB-0012](02-genai-engineer-als-zielrolle.md). Breitere Zielrollen folgen in [KB-0014](04-platform-architect-als-zielrolle.md), [KB-0015](05-enterprise-architect-als-zielrolle.md) und [KB-0016](06-cloud-architect-als-zielrolle.md).

| Quelle | Aussage | Stand |
|---|---|---|
| Dateikatalog der Knowledge Base, KB-0013 | Verbindlicher Scope, Rollenfokus und Pfad. | Planstand 2026-09-14 |
| [Kubernetes Multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/) | Namespace-/virtual-control-plane-Modelle, RBAC-, Quota-, Netz- und CNI-Grenzen. | Abgerufen 2026-09-15 |
| [Kubernetes Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/) | Quotas begrenzen Namespace-Aggregate, isolieren aber keine Nodes. | Abgerufen 2026-09-15 |
| [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/) | Partitionierung unterstützter GPUs mit zugewiesenem Compute und Memory; konkrete Matrix prüfen. | Abgerufen 2026-09-15 |
| [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/) | Gemeinsame Telemetriesemantik; GenAI-Konventionen sind separat und versionsbewusst zu übernehmen. | Abgerufen 2026-09-15 |
| [NIST AI RMF 1.0](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf) | Govern, Map, Measure, Manage als Risikorahmen. | Abgerufen 2026-09-15 |

## Bonus: New Tech and Innovations

**Stand 2026-09-15 — GenAI-Telemetrie als versionierter Plattformvertrag.** Die OpenTelemetry-Spezifikation verweist GenAI-Semantik in ein eigenes Repository. **Reifegrad: Adopting.** Der Nutzen sind korrelierbare Modell-, Agenten- und Toolsignale über Teams und Anbieter. Risiken sind instabile Semantik, Kardinalität und sensitive Inhalte. Ein Pilot startet deshalb mit Schemaadapter, Redaction-Test, Kostenbudget und Rückfall auf die vorherige Adapterversion. Die Ausweitung setzt voraus, dass zwei Teams dieselben Diagnosefragen beantworten können, ohne Rohpromptdaten zentral zu speichern. Quelle: [OpenTelemetry Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/).

**Stand 2026-09-15 — GPU-Partitionierung ist Kapazitätstechnik, keine vollständige Tenancy-Strategie.** MIG kann auf unterstützter NVIDIA-Hardware Compute- und Speicherressourcen aufteilen. **Reifegrad: Established für geeignete Hardware- und Betriebsumgebungen.** Es verbessert planbare Auslastung, löst jedoch weder Identität, Daten, Netzwerk noch Adminzugriff. Vor Einführung prüft ein Pilot Kompatibilitätsmatrix, Queue-/Latenz, OOM- und Node-Ausfall, Kosten gegen Provider und Repartitionierungs-/Rückbauplan. Dedizierte GPU oder Providerroute bleibt sinnvoll, wenn Isolation oder Burstlast überwiegt. Quelle: [NVIDIA MIG User Guide](https://docs.nvidia.com/datacenter/tesla/mig-user-guide/latest/).

**Stand 2026-09-15 — Tenancy wird als abgestufte Zusage reifer.** Kubernetes dokumentiert Namespace-Sharing und virtualisierte Control Planes als Muster mit klar unterschiedlichen Grenzen. **Reifegrad: Established als Grundlage; Adopting in der AI-spezifischen Kombination aus Gateway, Retrieval, Tools und Telemetriepolicy.** Der praktische Fortschritt ist ein messbares Tenancy-Profil: Welche Ebenen sind wie isoliert, was bleibt geteilt und welche Gegenprobe belegt es? Ein Pilot akzeptiert eine Stufe nur, wenn IAM-, Netz-, Daten-, Quota- und Betriebszugriffsbeweise zum Risikoprofil passen. Quelle: [Kubernetes Multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/).

