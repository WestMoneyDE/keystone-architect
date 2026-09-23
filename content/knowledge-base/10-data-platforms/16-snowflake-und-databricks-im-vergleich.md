---
{"id": "KB-0234", "title": "Snowflake und Databricks im Vergleich", "domain": "10", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["ENTERPRISE", "GENAI", "MLOPS"], "requires": [{"id": "KB-0230", "concepts": ["Lakehouse-Architektur"], "needed_for": "understanding"}, {"id": "KB-0231", "concepts": ["Data Warehouses"], "needed_for": "understanding"}], "related": ["KB-0233"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Compute-/Storage-Trennung mit unabhängiger Skalierung lokal implementieren.", "rationale": "Der Vorteil unabhängiger Compute-/Storage-Skalierung wird erst durch konkrete Simulation getrennter Ressourcenzuweisung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Snowflake gegenüber Databricks für einen konkreten Anwendungsfall begründet abgrenzen, basierend auf dominantem Arbeitsmodell (SQL-Analytik vs. Data-Engineering/ML-Zusammenarbeit).", "rationale": "Beide Plattformen haben Compute-/Storage-Trennung als gemeinsame Grundlage, aber unterschiedliche Stärken je nach dominantem Team-Arbeitsmodell."}, "STAFF-TARGET": {"active": true, "scope": "Unerwartete Portabilitätseinschränkungen bei einem Plattformwechsel auf plattformspezifische, nicht-portable Konstrukte statt auf einen allgemeinen Migrationsfehler zurückführen können.", "rationale": "Beide Plattformen bieten proprietäre Erweiterungen neben offenen Standards, deren Nutzung Portabilität einschränkt."}, "CHIEF-TARGET": {"active": true, "scope": "Die Wahl zwischen Snowflake und Databricks als Entscheidung über das dominante Arbeitsmodell und Portabilitätsanforderungen positionieren, nicht als rein technischen Feature-Vergleich.", "rationale": "Beide Plattformen konvergieren technisch zunehmend (beide unterstützen SQL-Analytik und Data-Engineering), der Unterschied liegt stärker im ursprünglichen Arbeitsmodell und Ökosystem."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Preismodelle und Feature-Details sind Vertiefung, die an aktueller Dokumentation zu prüfen sind.", "rationale": "Beide Plattformen entwickeln sich schnell weiter; Kern ist das konzeptionelle Verständnis von Compute-/Storage-Trennung und Arbeitsmodell-Unterschieden, nicht Feature-Schnappschüsse."}}, "lab_validation": [{"lab_id": "KB-0234-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für unabhängige Compute-/Storage-Skalierung", "evidence": "Storage-Kapazität und Compute-Kapazität können unabhängig voneinander skaliert werden, wenn sie architektonisch getrennt sind, was Kosten- und Performance-Kontrolle für unterschiedliche Lastprofile ermöglicht.", "limitations": "Kein echtes Snowflake- oder Databricks-System, keine reale Abrechnung, keine Produktion."}]}
---
# Snowflake und Databricks im Vergleich

> **Ziel:** Snowflake und Databricks teilen ein gemeinsames architektonisches Grundprinzip — Trennung von Compute und Storage für unabhängige Skalierung — unterscheiden sich aber im ursprünglichen dominanten Arbeitsmodell: Snowflake historisch stärker SQL-Analytik-zentriert, Databricks historisch stärker Data-Engineering-/ML-Zusammenarbeit-zentriert. Beide Plattformen konvergieren zunehmend technisch; die Wahl ist stärker eine Entscheidung über Portabilität und dominantes Team-Arbeitsmodell als ein reiner Feature-Vergleich.

## Zweck, Mental Model und Dependencies

Compute-/Storage-Trennung bedeutet, dass Rechenleistung (für Abfrageverarbeitung) und Speicherung (für die eigentlichen Daten) unabhängig voneinander skaliert werden können — Speicherkapazität wächst mit dem Datenvolumen, während Rechenleistung nach tatsächlichem Abfragebedarf dimensioniert und bei Bedarf elastisch hoch- oder heruntergefahren werden kann, ohne dass beide Dimensionen aneinander gekoppelt sind. Beide Plattformen nutzen dieses Prinzip, unterscheiden sich aber im historischen Ausgangspunkt: Snowflake entstand als SQL-natives Data Warehouse mit starkem Fokus auf einfache, performante SQL-Analytik und Benutzerfreundlichkeit für Analysten; Databricks entstand aus dem Apache-Spark-Ökosystem mit starkem Fokus auf Data-Engineering-Pipelines, verteilte Verarbeitung und ML-Workflows mit enger Notebook-basierter Zusammenarbeit. Diese historischen Ausgangspunkte prägen bis heute die jeweiligen Stärken, auch wenn beide Plattformen inzwischen SQL-Analytik und Data-Engineering/ML-Fähigkeiten anbieten. Portabilität wird durch die Nutzung offener Tabellenformate (Iceberg, Delta Lake, siehe [KB-0228](10-apache-iceberg.md), [KB-0229](11-delta-lake.md)) gegenüber proprietären plattformspezifischen Erweiterungen bestimmt — je stärker proprietäre Features genutzt werden, desto schwieriger und teurer wird ein späterer Plattformwechsel. Lies [KB-0230](12-lakehouse-architektur.md) und [KB-0231](13-data-warehouses.md).

~~~text
Shared foundation: compute/storage separation -> independent scaling of each dimension
Snowflake origin:   SQL-native data warehouse -> historically strongest for SQL analytics, analyst-friendly
Databricks origin:  Spark ecosystem -> historically strongest for data engineering pipelines, ML collaboration
Both converge over time -> choice increasingly about dominant team workflow AND portability, not raw feature gaps
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Dominantes Arbeitsmodell | ist das Team primär SQL-Analytik- oder Data-Engineering-/ML-zentriert? | Plattformwahl gegen das falsche dominante Arbeitsmodell erzeugt unnötige Reibung im täglichen Workflow |
| Portabilität | wird bewusst zwischen offenen Standards und proprietären Erweiterungen unterschieden? | starke Nutzung proprietärer Features macht einen späteren Plattformwechsel kostspielig und riskant |
| Compute-/Storage-Skalierungsnutzung | wird die unabhängige Skalierbarkeit tatsächlich genutzt (z. B. Compute bei Inaktivität herunterfahren)? | ungenutzte Skalierungsflexibilität verschenkt Kostenvorteile der Architektur |
| Workloadisolation und Datenaustausch | sind Mechanismen für Team-übergreifende Datenfreigabe und Ressourcenisolation geprüft? | fehlende Isolation erzeugt Ressourcenkonflikte, fehlender Datenaustausch erzeugt Datenduplikation |

Implementierung: die Plattformwahl wird explizit gegen das dominante Arbeitsmodell des Teams geprüft — ein primär SQL-Analytik-getriebenes Team mit wenig Data-Engineering-Bedarf profitiert oft stärker von einer historisch SQL-nativen Plattform, während ein Team mit starkem Data-Engineering-/ML-Zusammenarbeitsbedarf oft von einer Notebook-/Pipeline-zentrierten Plattform profitiert — diese Unterschiede haben sich jedoch mit der Konvergenz beider Plattformen verringert und sollten gegen aktuelle Fähigkeiten geprüft werden. Portabilität wird bewusst gemanagt, indem offene Tabellenformate für die primäre Datenspeicherung genutzt werden, während proprietäre Erweiterungen selektiv und mit Bewusstsein für die entstehende Kopplung eingesetzt werden. Compute-Ressourcen werden aktiv nach tatsächlichem Bedarf skaliert (z. B. automatisches Pausieren bei Inaktivität), um den Kostenvorteil der Compute-/Storage-Trennung tatsächlich zu realisieren.

## Scalability, Reliability, Security und Observability

Beide Plattformen skalieren Compute und Storage unabhängig gut, was insbesondere für stark schwankende Lastprofile (z. B. tagsüber hohe interaktive Abfragelast, nachts geringe Last) Kostenvorteile gegenüber statisch dimensionierter Infrastruktur bietet. Reliability-Grenze: starke Kopplung an proprietäre Plattformfeatures ist ein organisatorisches Risiko, das erst bei einem tatsächlichen Migrationsversuch oder einer Preisänderung des Anbieters sichtbar wird, wenn der Wechsel deutlich aufwendiger ist als ursprünglich angenommen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Team empfindet die gewählte Plattform als unpassend für den täglichen Workflow | Plattformwahl passt nicht zum tatsächlichen dominanten Arbeitsmodell (SQL-Analytik vs. Data-Engineering/ML) | tatsächliche Nutzungsmuster des Teams gegen die ursprünglichen Annahmen bei der Plattformwahl prüfen |
| ein geplanter Plattformwechsel ist deutlich aufwendiger als erwartet | starke Nutzung proprietärer, nicht-portabler Features statt offener Standards | genutzte Features auf proprietäre versus offene Standard-Komponenten kategorisieren |
| Compute-Kosten sind höher als erwartet trotz Compute-/Storage-Trennung | Compute-Ressourcen werden nicht aktiv bei Inaktivität herunterskaliert oder pausiert | Auto-Suspend-/Auto-Scaling-Konfiguration gegen tatsächliche Nutzungsmuster prüfen |
| unterschiedliche Teams auf derselben Plattform beeinträchtigen sich gegenseitig | fehlende Workloadisolation zwischen Teams | Ressourcenisolationsmechanismen (separate Compute-Cluster/Warehouses) gegen tatsächliche Team-Trennung prüfen |

Security: beide Plattformen bieten Datenaustausch-Mechanismen zwischen Organisationen oder Teams, deren Zugriffskontrolle sorgfältig konfiguriert werden muss, da versehentlich zu breite Freigaben sensible Daten unautorisierten Parteien zugänglich machen können. Observability: Compute-Auslastung und -Kosten pro Team/Workload, Nutzung proprietärer versus offener Features und Auto-Scaling-Effektivität sind zentrale Metriken für beide Plattformen.

## Trade-offs und Entscheidungen

**Staff** nutzt Compute-Skalierungsmechanismen (Auto-Suspend, Auto-Scaling) aktiv, um den Kostenvorteil der Architektur zu realisieren. **Principal** macht die Unterscheidung zwischen offenen und proprietären Features für das Team bei Architekturentscheidungen explizit sichtbar. **Chief** positioniert die Plattformwahl als Entscheidung über dominantes Arbeitsmodell und Portabilitätsanforderungen, nicht als rein technischen Feature-Vergleich zu einem Momentaufnahme-Zeitpunkt.

Anti-Patterns: Plattform ausschließlich nach aktuellem Feature-Vergleich ohne Berücksichtigung des tatsächlichen Team-Arbeitsmodells wählen; proprietäre Features unreflektiert nutzen, ohne die entstehende Portabilitätseinschränkung zu bedenken; Compute-Skalierungsmechanismen nicht aktiv nutzen und dadurch den Kostenvorteil der Compute-/Storage-Trennung verschenken.

## Production Checklist

- [ ] Plattformwahl ist gegen das tatsächliche dominante Arbeitsmodell des Teams geprüft.
- [ ] Nutzung proprietärer versus offener Standard-Features ist bewusst dokumentiert.
- [ ] Compute-Skalierungsmechanismen (Auto-Suspend/Auto-Scaling) sind aktiv genutzt.
- [ ] Workloadisolation zwischen Teams ist konfiguriert und geprüft.

## Interviewfragen

### 1. Was ist das gemeinsame architektonische Grundprinzip von Snowflake und Databricks?

**Antwort:** Beide trennen Compute und Storage, sodass Rechenleistung und Speicherkapazität unabhängig voneinander skaliert werden können, statt an eine gemeinsam dimensionierte Infrastruktur gekoppelt zu sein.

### 2. Warum ist die Unterscheidung zwischen offenen und proprietären Features bei der Plattformwahl wichtig?

**Antwort:** Je stärker proprietäre, nicht-portable Features genutzt werden, desto schwieriger und teurer wird ein späterer Plattformwechsel — bewusste Nutzung offener Tabellenformate erhält Portabilität, auch wenn proprietäre Features kurzfristig praktisch erscheinen.

### 3. Wie diagnostizierst du, dass Compute-/Storage-Trennung ihren Kostenvorteil nicht realisiert?

**Antwort:** Ich prüfe die Auto-Suspend-/Auto-Scaling-Konfiguration gegen tatsächliche Nutzungsmuster — wenn Compute-Ressourcen bei Inaktivität nicht aktiv herunterskaliert werden, wird der potenzielle Kostenvorteil der unabhängigen Skalierung nicht realisiert.

### 4. Warum sollte die Plattformwahl nicht rein anhand eines aktuellen Feature-Vergleichs getroffen werden?

**Antwort:** Beide Plattformen entwickeln sich schnell weiter und konvergieren technisch zunehmend; ein Feature-Vergleich zu einem bestimmten Zeitpunkt kann schnell veralten, während das dominante Team-Arbeitsmodell und Portabilitätsanforderungen stabilere Entscheidungsgrundlagen bieten.

### 5. Was passiert, wenn ein Team ohne Prüfung des dominanten Arbeitsmodells eine Plattform wählt?

**Antwort:** Das Team kann im täglichen Workflow unnötige Reibung erleben, wenn die gewählte Plattform nicht zum tatsächlichen Nutzungsschwerpunkt (z. B. primär SQL-Analytik versus primär Data-Engineering-Pipelines) passt.

### 6. Widersprüchliche Anforderung: Team will maximale Nutzung plattformspezifischer Premium-Features für bestmögliche aktuelle Performance UND maximale zukünftige Portabilität zwischen Plattformen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass dies ein struktureller Zielkonflikt ist — proprietäre Premium-Features bieten oft bessere aktuelle Performance, reduzieren aber Portabilität; ich würde vorschlagen, die primäre Datenspeicherung konsequent auf offenen Tabellenformaten zu belassen und proprietäre Features selektiv nur für nicht-kritische, leicht ersetzbare Komponenten zu nutzen, um einen bewussten Kompromiss zwischen aktueller Performance und zukünftiger Flexibilität zu erreichen.

## Praktische Labs

~~~python
# Independent compute/storage scaling cost model
storage_gb = 10_000
storage_cost_per_gb = 0.02

def compute_cost(active_hours, compute_units, cost_per_unit_hour=2.0):
    return active_hours * compute_units * cost_per_unit_hour

# Scenario A: compute always running (no auto-suspend)
always_on_cost = compute_cost(active_hours=24 * 30, compute_units=4)

# Scenario B: compute auto-suspended during inactivity (only 8 active hours/day)
auto_suspend_cost = compute_cost(active_hours=8 * 30, compute_units=4)

storage_monthly_cost = storage_gb * storage_cost_per_gb

print(f"Storage cost (independent of compute usage): ${storage_monthly_cost:.2f}/month")
print(f"Compute cost, always-on: ${always_on_cost:.2f}/month")
print(f"Compute cost, auto-suspend (8h/day active): ${auto_suspend_cost:.2f}/month")
assert auto_suspend_cost < always_on_cost
savings = always_on_cost - auto_suspend_cost
print(f"Auto-suspend saves ${savings:.2f}/month - storage cost is unaffected by compute scaling decisions.")
~~~

## Dependencies, Cross-References und Quellen

1. Snowflake: [Snowflake Architecture Overview](https://docs.snowflake.com/en/user-guide/intro-key-concepts), abgerufen 2026-09-17.
2. Databricks: [Databricks Lakehouse Platform Architecture](https://www.databricks.com/product/data-lakehouse), abgerufen 2026-09-17.
3. Snowflake: [Data Sharing Documentation](https://docs.snowflake.com/en/user-guide/data-sharing-intro), abgerufen 2026-09-17.

Lakehouse- und Data-Warehouse-Grundlagen sind kanonisch in [KB-0230](12-lakehouse-architektur.md) und [KB-0231](13-data-warehouses.md) behandelt. Beide Plattformen entwickeln sich schnell weiter — Feature- und Preisdetails vor Einsatz zwingend an aktueller Dokumentation prüfen.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende gegenseitige Unterstützung offener Tabellenformate (Iceberg-Lesbarkeit auf beiden Plattformen) | Adopting | Für Multi-Plattform-Umgebungen als Interoperabilitätsbrücke gegen aktuelle Dokumentation prüfen. |
| Integrierte KI-/ML-Plattformfunktionen direkt in der Analyseplattform (statt separater ML-Infrastruktur) | Adopting | Integrationsgewinn gegen Kopplung an plattformspezifische ML-Werkzeuge abwägen. |

Ein Team akzeptiert eine Snowflake- oder Databricks-Entscheidung erst, wenn dominantes Arbeitsmodell und Portabilitätsanforderungen nachweisbar gegen aktuelle Plattformfähigkeiten geprüft sind.
