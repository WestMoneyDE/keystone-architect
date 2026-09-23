---
{"id": "KB-0606", "title": "Dependency und Service Mapping", "domain": "25", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "PLATFORM", "CHIEF"], "requires": [{"id": "KB-0605", "concepts": ["Configuration Items und Beziehungen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Technische Abhängigkeiten aus Configuration Items in geschäftsrelevante Servicesichten überführen können und die Vollständigkeitsgrenzen von Discovery-basierten Mappings korrekt einschätzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie dynamische Topologien und unvollständige Discovery-Daten in Service-Mapping-Darstellungen sichtbar begrenzt statt unreflektiert als vollständig präsentiert werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Impactanalyse auf Basis eines Service-Mappings tatsächlich vorhandene, aber vom Discovery-Prozess nicht erfasste Abhängigkeiten übersieht, und dies von einer tatsächlich vollständigen Analyse unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Dependency- und Service-Mapping festlegen, die Discovery-Vollständigkeitsgrenzen explizit kennzeichnen, statt automatisch erzeugte Mappings unreflektiert als vollständig zu präsentieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Discovery-Technik (Netzwerkscanning, Agentenbasierte Erfassung) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Grenzen und Vollständigkeitsanforderungen von Service Mapping für Impactanalysen, nicht die produktspezifische Discovery-Technik."}}, "lab_validation": [{"lab_id": "KB-0606-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation einer unvollständigen Service-Mapping-Discovery, kein produktives Service-Mapping-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein Discovery-Prozess eine Abhängigkeit übersieht, die nur über eine selten genutzte, nicht regelmäßig gescannte Verbindung besteht, und zeigt damit, wie eine formal vollständig wirkende Service-Map dennoch tatsächlich vorhandene Abhängigkeiten übersehen kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Service-Mapping-System."}]}
---
# Dependency und Service Mapping

> **Ziel:** Dependency und Service Mapping überführt die bereits in [KB-0605](17-configuration-items-und-beziehungen.md) behandelten technischen Configuration-Item-Beziehungen (etwa "Server A kommuniziert mit Server B") in eine **geschäftsrelevante Servicesicht** (etwa "der Bestellprozess-Service hängt von diesen fünf technischen Komponenten ab") — eine für Geschäftsentscheidungen nachvollziehbare Darstellung, die über die reine technische Netzwerktopologie hinausgeht. Der zentrale Punkt dieses Kapitels ist, dass sowohl **dynamische Topologien** (Abhängigkeiten, die sich durch Skalierung, Deployment-Änderungen oder Lastverteilung laufend ändern) als auch **unvollständige Discovery-Daten** (Abhängigkeiten, die vom automatisierten Erfassungsprozess tatsächlich nicht erkannt wurden) dazu führen können, dass ein Service-Mapping formal vollständig wirkt, tatsächlich aber Lücken enthält — diese Grenzen müssen für Impactanalysen explizit sichtbar gemacht werden, statt ein Service-Mapping unreflektiert als vollständige, verlässliche Abbildung der Realität zu behandeln.

## Zweck, Mental Model und Dependencies

Die Überführung technischer Abhängigkeiten (Configuration-Item-Beziehungen, siehe [KB-0605](17-configuration-items-und-beziehungen.md)) in eine geschäftsrelevante Servicesicht ist notwendig, weil eine rein technische Netzwerktopologie für Geschäftsentscheidungen (etwa "welche Geschäftsprozesse sind von einem geplanten Wartungsfenster betroffen") nicht direkt interpretierbar ist — die Servicesicht aggregiert und interpretiert die technischen Beziehungen so, dass sie tatsächlich beantwortbare, geschäftlich relevante Fragen ermöglichen. Dynamische Topologien stellen eine strukturelle Herausforderung für die Verlässlichkeit dieser Sicht dar: In modernen, elastisch skalierenden Infrastrukturen (etwa Container-Orchestrierung mit häufig wechselnden Instanzen) kann sich die tatsächliche technische Abhängigkeitsstruktur schneller ändern, als ein Mapping-Prozess sie erfassen kann — ein zu einem bestimmten Zeitpunkt erstelltes, statisches Service-Mapping kann bereits kurz danach nicht mehr die tatsächliche, aktuelle Topologie widerspiegeln, weshalb solche Mappings entweder kontinuierlich aktualisiert oder explizit mit einem Aktualitätszeitstempel versehen werden müssen. Unvollständige Discovery-Daten sind eine zweite, unabhängige Grenze: Automatisierte Discovery-Prozesse erkennen typischerweise Abhängigkeiten über regelmäßig genutzte, gut sichtbare Kommunikationswege (etwa häufige Netzwerkverbindungen), können aber seltener genutzte, unregelmäßige oder über ungewöhnliche Kanäle laufende Abhängigkeiten (etwa eine selten ausgeführte, aber kritische Batch-Verbindung) leicht übersehen — ein Service-Mapping, das ausschließlich auf automatisierter Discovery beruht, kann daher formal vollständig wirken, während es tatsächlich kritische, aber selten aktive Abhängigkeiten nicht erfasst. Die methodische Konsequenz für Impactanalysen ist, diese beiden Grenzen (Aktualität und Discovery-Vollständigkeit) explizit sichtbar zu machen, statt ein Service-Mapping unreflektiert als vollständige, verlässliche Abbildung zu präsentieren — eine Impactanalyse, die diese Grenzen ignoriert, kann tatsächlich betroffene Services übersehen und dadurch zu einer gefährlich unvollständigen Risikoeinschätzung führen.

~~~text
Dependency/Service Mapping: converts KB-0605 technical CI relationships (server A talks to server B)
  into BUSINESS-RELEVANT SERVICE VIEW (order process service depends on these 5 technical components)
  -- traceable representation for business decisions, beyond pure technical network topology
KEY POINT: BOTH dynamic topologies (deps changing continuously via scaling/deployment/load balancing)
  AND incomplete discovery data (deps actually not detected by automated capture process)
  -> can make a service mapping LOOK formally complete while ACTUALLY containing gaps
  these limits must be EXPLICITLY made visible for impact analyses
  instead of treating service mapping unreflectively as complete, reliable reality representation
WHY conversion to business-relevant view necessary: pure technical network topology
  not directly interpretable for business decisions
    (e.g. "which business processes affected by planned maintenance window")
  service view aggregates+interprets technical relationships to answer actually-relevant business questions
DYNAMIC TOPOLOGIES = structural challenge to this view's reliability
  modern, elastically-scaling infra (container orchestration, frequently-changing instances)
  -> actual technical dependency structure can change FASTER than a mapping process can capture it
  static mapping created at one point in time -> can already no longer reflect actual current topology
    shortly after -> must be either continuously updated OR explicitly timestamped for currency
INCOMPLETE DISCOVERY DATA = second, independent limit
  automated discovery typically detects deps via regularly-used, well-visible communication paths
    (frequent network connections)
  CAN easily miss rarely-used, irregular, or unusual-channel deps
    (rarely-executed but critical batch connection)
  service mapping relying purely on automated discovery -> can LOOK formally complete
    while ACTUALLY missing critical-but-rarely-active dependencies
METHODOLOGICAL CONSEQUENCE for impact analyses: make BOTH limits (currency + discovery completeness)
  EXPLICITLY visible
  instead of unreflectively presenting a service mapping as complete, reliable representation
  impact analysis ignoring these limits -> can miss actually affected services
    -> dangerously incomplete risk assessment
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Technisch-zu-geschäftlich-Überführung | macht technische Abhängigkeiten geschäftlich interpretierbar | Grundlage für nachvollziehbare Impactanalysen |
| Dynamische Topologie | Abhängigkeiten ändern sich laufend | erfordert kontinuierliche Aktualisierung oder Zeitstempel |
| Discovery-Vollständigkeit | Grenze automatisierter Abhängigkeitserkennung | seltene, kritische Abhängigkeiten können übersehen werden |
| Explizite Vollständigkeitskennzeichnung | macht Aktualitäts- und Discovery-Grenzen sichtbar | verhindert gefährlich unvollständige Impactanalysen |

Implementierung: Technische CI-Beziehungen werden systematisch in geschäftsrelevante Servicesichten aggregiert, mit expliziter Verknüpfung zu den bereits in [KB-0605](17-configuration-items-und-beziehungen.md) behandelten Configuration Items. Jedes Service Mapping wird mit einem Aktualitätszeitstempel und einer expliziten Kennzeichnung der Discovery-Methode und ihrer bekannten Grenzen versehen. Impactanalysen berücksichtigen diese Kennzeichnung explizit, statt das Mapping unreflektiert als vollständig zu behandeln.

## Scalability, Reliability, Security und Observability

Dependency und Service Mapping skaliert die tatsächliche Verlässlichkeit von Impactanalysen proportional zur expliziten Sichtbarkeit von Aktualitäts- und Discovery-Vollständigkeitsgrenzen; die Reliability-Grenze liegt darin, dass ein unreflektiert als vollständig behandeltes Mapping tatsächlich betroffene Services bei einer Impactanalyse übersehen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Impactanalyse übersieht einen tatsächlich betroffenen Service bei einem geplanten Wartungsfenster | die zugrunde liegende Abhängigkeit wurde vom Discovery-Prozess nicht erfasst | die Discovery-Methode und ihre bekannten Erfassungsgrenzen für diese Abhängigkeitsart prüfen |
| ein Service Mapping zeigt eine Topologie, die nicht mehr der tatsächlichen Infrastruktur entspricht | die dynamische Topologie hat sich seit der letzten Mapping-Aktualisierung verändert | das Mapping mit aktuellem Aktualitätszeitstempel neu erstellen oder kontinuierlich aktualisieren |
| ein Team vertraut einem Service Mapping als vollständig, ohne dessen Grenzen zu kennen | keine explizite Kennzeichnung der Discovery- und Aktualitätsgrenzen ist vorhanden | jedes Service Mapping explizit mit Aktualitätszeitstempel und Discovery-Methodenhinweis versehen |

Security: Sicherheitsrelevante Impactanalysen (etwa bei der Bewertung einer kompromittierten Komponente) sollten die Discovery-Vollständigkeitsgrenzen besonders konservativ berücksichtigen, da eine übersehene Abhängigkeit ein unerkanntes Risiko darstellen kann. Observability: Die tatsächliche Diskrepanzrate zwischen automatisiert erkanntem Service Mapping und nachträglich, manuell entdeckten, tatsächlichen Abhängigkeiten ist ein zentrales Signal zur Bewertung der Discovery-Qualität.

## Trade-offs und Entscheidungen

**Staff** überführt gegebene technische Abhängigkeiten korrekt in eine Servicesicht und kennzeichnet deren Aktualität. **Principal** entwirft die vollständige Dependency- und Service-Mapping-Strategie mit expliziter Grenzenkennzeichnung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards fest, die Discovery-Vollständigkeitsgrenzen verbindlich sichtbar machen.

Anti-Patterns: ein Service Mapping als vollständig behandeln, ohne dessen Aktualitäts- und Discovery-Grenzen zu kennzeichnen; eine Impactanalyse ausschließlich auf Basis eines rein automatisiert erzeugten Mappings ohne Berücksichtigung seltener, nicht erfasster Abhängigkeiten treffen; ein statisches Mapping in einer dynamischen, sich schnell ändernden Topologie ohne Aktualisierung dauerhaft verwenden.

## Production Checklist

- [ ] Jedes Service Mapping ist mit einem Aktualitätszeitstempel versehen.
- [ ] Die Discovery-Methode und ihre bekannten Erfassungsgrenzen sind explizit dokumentiert.
- [ ] Impactanalysen berücksichtigen explizit die Aktualitäts- und Discovery-Grenzen des zugrunde liegenden Mappings.
- [ ] Dynamische Topologien werden kontinuierlich aktualisiert oder mit entsprechend kurzer Gültigkeitsdauer gekennzeichnet.

## Interviewfragen

### 1. Warum wird eine technische Netzwerktopologie in eine geschäftsrelevante Servicesicht überführt?

**Antwort:** Weil eine rein technische Topologie für Geschäftsentscheidungen nicht direkt interpretierbar ist — die Servicesicht aggregiert und interpretiert technische Beziehungen so, dass sie geschäftlich relevante Fragen tatsächlich beantwortbar machen.

### 2. Warum stellen dynamische Topologien eine Herausforderung für Service Mapping dar?

**Antwort:** Weil sich die tatsächliche technische Abhängigkeitsstruktur in elastisch skalierenden Infrastrukturen schneller ändern kann, als ein Mapping-Prozess sie erfassen kann, wodurch ein statisches Mapping schnell veraltet.

### 3. Warum kann ein Service Mapping trotz automatisierter Discovery unvollständig sein?

**Antwort:** Weil automatisierte Discovery-Prozesse typischerweise regelmäßig genutzte, gut sichtbare Kommunikationswege erkennen, aber seltener genutzte oder ungewöhnliche Abhängigkeiten leicht übersehen können.

### 4. Was ist die methodische Konsequenz dieser beiden Grenzen für Impactanalysen?

**Antwort:** Aktualitäts- und Discovery-Vollständigkeitsgrenzen müssen explizit sichtbar gemacht werden, statt ein Service Mapping unreflektiert als vollständige, verlässliche Abbildung zu behandeln.

### 5. Wie gehst du vor, wenn eine Impactanalyse einen tatsächlich betroffenen Service übersieht?

**Antwort:** Ich prüfe, ob die zugrunde liegende Abhängigkeit vom Discovery-Prozess erfasst wurde, und untersuche, ob eine seltene, nicht regelmäßig gescannte Verbindung die Ursache für die Lücke ist.

### 6. Widersprüchliche Anforderung: Teams wollen ein einfaches, statisches Service Mapping zur schnellen Orientierung UND die Organisation will vollständig verlässliche, aktuelle Impactanalysen für kritische Entscheidungen — wie gehst du vor?

**Antwort:** Ich würde ein einfaches, statisches Mapping für schnelle Orientierung mit explizitem Aktualitätszeitstempel bereitstellen, während für kritische Impactanalysen ein kontinuierlich aktualisiertes, um bekannte Discovery-Lücken ergänztes Mapping verpflichtend eingesetzt wird, statt ein einziges Mapping für beide, unterschiedlich anspruchsvolle Zwecke zu verwenden.

## Praktische Labs

~~~python
# Local, deterministic simulation of a discovery process missing a rarely-active dependency (executed locally, no real service mapping tool):

def discover_dependencies(connections, min_frequency_threshold):
    discovered = [c for c in connections if c["frequency_per_month"] >= min_frequency_threshold]
    missed = [c for c in connections if c["frequency_per_month"] < min_frequency_threshold]
    return {"discovered": [c["name"] for c in discovered], "missed_but_real": [c["name"] for c in missed]}

connections = [
    {"name": "OrderService-to-Inventory", "frequency_per_month": 50000},
    {"name": "OrderService-to-QuarterlyBatchAudit", "frequency_per_month": 3},  # rare but critical
]

print(discover_dependencies(connections, min_frequency_threshold=100))
~~~

## Dependencies, Cross-References und Quellen

1. ServiceNow-Dokumentation: [Service Mapping Overview](https://www.servicenow.com/docs/bundle/xanadu-it-operations-management/page/product/service-mapping/concept/service-mapping.html), abgerufen 2026-09-18.
2. Gartner-Referenzmodell: [IT Discovery and Dependency Mapping Tools](https://www.gartner.com/en/information-technology/glossary/it-infrastructure-monitoring-tools), abgerufen 2026-09-18.

Configuration Items und Beziehungen sind kanonisch in [KB-0605](17-configuration-items-und-beziehungen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, kontinuierliche Anomalieerkennung zur Identifikation potenziell übersehener, seltener Abhängigkeiten aus Log- und Trace-Daten | Evaluating | Als ergänzende Erkennungsquelle für seltene Abhängigkeiten prüfen, jedoch die Discovery-Vollständigkeitsgrenzen weiterhin explizit dokumentieren, statt anzunehmen, dass diese Ergänzung vollständige Abdeckung garantiert. |

Ein Team akzeptiert ein Dependency- und Service-Mapping erst, wenn Aktualität und Discovery-Vollständigkeitsgrenzen explizit dokumentiert sind und Impactanalysen diese Grenzen nachweislich berücksichtigen.
