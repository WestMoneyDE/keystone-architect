---
{"id": "KB-0474", "title": "RDS und Aurora", "domain": "19", "sequence": 12, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0215", "concepts": ["Datenbank-Hochverfügbarkeit, Promotion, Clientumschaltung"], "needed_for": "understanding"}, {"id": "KB-0447", "concepts": ["Verwaltete Cloud-Datenbanken"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine RDS-Multi-AZ-Instanz und einen Aurora-Cluster mit Cluster-Endpunkten anhand offizieller Dokumentation konzeptionell strukturieren können und den strukturellen Unterschied zwischen beiden Hochverfügbarkeitsmodellen erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Anwendungsfall begründet zwischen RDS Multi-AZ und Aurora entscheiden, basierend auf tatsächlichen Failover-Zeit-, Lesekapazitäts- und Kostenanforderungen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Leseinkonsistenz nach einem Failover auf eine fehlerhafte Nutzung des Cluster- statt des Leser-Endpunkts, oder auf replikationsbedingte Verzögerung, zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Datenbankplattform-Richtlinien im Unternehmen anhand tatsächlicher Konsistenz- und Betriebsanforderungen statt anhand einer pauschalen Präferenz für eine bestimmte Technologie festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Storage-Engine-Implementierung von Aurora im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Failover-Verhalten, Endpunkt-Nutzung und Wartungsoptionen als Entscheidungsgrundlage, nicht die Aurora-Storage-Interna."}}, "lab_validation": [{"lab_id": "KB-0474-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-RDS- und Aurora-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie RDS Multi-AZ eine synchron replizierte Standby-Instanz für Failover bereitstellt, wie Aurora stattdessen ein verteiltes, mehrfach über Availability Zones repliziertes Storage-Layer nutzt, und warum die korrekte Nutzung von Cluster- versus Leser-Endpunkten bei Aurora für konsistentes Anwendungsverhalten nach einem Failover entscheidend ist.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale RDS- oder Aurora-Konfiguration erstellt."}]}
---
# RDS und Aurora

> **Ziel:** Amazon RDS und Amazon Aurora sind beide verwaltete relationale Datenbankdienste (siehe verwaltete Cloud-Datenbanken, [KB-0447](../18-cloud-foundations/07-verwaltete-cloud-datenbanken.md)), unterscheiden sich jedoch grundlegend in ihrem Hochverfügbarkeitsmodell (siehe Datenbank-Hochverfügbarkeit, [KB-0215](../09-databases-storage/21-datenbank-hochverfuegbarkeit.md)) — RDS Multi-AZ betreibt eine synchron replizierte Standby-Instanz in einer anderen Availability Zone, die bei einem Ausfall der primären Instanz übernimmt, während Aurora ein verteiltes Storage-Layer nutzt, das Daten automatisch über mehrere Availability Zones repliziert, unabhängig von den Compute-Instanzen, die auf dieses Storage zugreifen. Der zentrale Punkt dieses Kapitels ist, dass Aurora-Cluster mehrere unterschiedliche Endpunkt-Typen bereitstellen (Cluster-Endpunkt für Schreibzugriffe zur aktuellen primären Instanz, Leser-Endpunkt für lastverteilte Lesezugriffe über mehrere Lese-Replikate), und die fehlerhafte Nutzung des falschen Endpunkt-Typs (z. B. eine Anwendung, die konsequent den Cluster-Endpunkt auch für Lesezugriffe nutzt, statt Lesezugriffe über den Leser-Endpunkt zu verteilen) zu unnötiger Lastkonzentration auf einer einzigen Instanz oder zu unerwarteter Leseinkonsistenz nach einem Failover führen kann.

## Zweck, Mental Model und Dependencies

Bei RDS Multi-AZ wird eine physische, synchron replizierte Standby-Instanz in einer anderen Availability Zone betrieben — bei einem Ausfall der primären Instanz erkennt RDS dies automatisch und leitet einen Failover ein, bei dem die Standby-Instanz zur neuen primären Instanz wird, wobei der DNS-Name der Datenbank-Instanz unverändert bleibt (die zugrunde liegende IP-Adresse ändert sich, aber die Anwendung muss nur eine erneute DNS-Auflösung durchführen, keine Konfigurationsänderung). Aurora verfolgt einen strukturell anderen Ansatz: Statt einer klassischen, dedizierten Standby-Instanz nutzt Aurora ein verteiltes Storage-Layer, das Datenänderungen automatisch über mehrere Availability Zones repliziert, unabhängig von der Anzahl oder dem Zustand der Compute-Instanzen, die auf dieses Storage zugreifen — dies ermöglicht potenziell schnellere Failover-Zeiten (da kein vollständiger Neustart einer separaten Standby-Instanz erforderlich ist, sondern lediglich eine vorhandene Lese-Replik-Instanz zur neuen primären Instanz befördert wird) und ermöglicht mehrere gleichzeitige Lese-Replikate, die alle auf dasselbe, konsistent replizierte Storage zugreifen. Ein Aurora-Cluster stellt daher unterschiedliche Endpunkt-Typen bereit: Der Cluster-Endpunkt verweist immer auf die aktuelle primäre (Schreib-)Instanz und sollte für alle Schreibzugriffe sowie für Lesezugriffe genutzt werden, die unmittelbare Konsistenz mit den zuletzt geschriebenen Daten benötigen; der Leser-Endpunkt verteilt Leseanfragen automatisch über die verfügbaren Lese-Replikate, was für Lesezugriffe geeignet ist, die eine gewisse Replikationsverzögerung tolerieren können, dafür aber von der zusätzlichen, verteilten Lesekapazität profitieren. Der zentrale methodische Punkt ist, dass eine Anwendung, die konsequent den Cluster-Endpunkt für alle Zugriffe (auch Lesezugriffe) nutzt, die verfügbare, verteilte Lesekapazität der Lese-Replikate ungenutzt lässt und die gesamte Last unnötig auf der primären Instanz konzentriert, während eine Anwendung, die für lesekonsistenzkritische Vorgänge fälschlich den Leser-Endpunkt nutzt, aufgrund von Replikationsverzögerung potenziell veraltete Daten lesen kann, obwohl bereits eine neuere, konsistente Version über den Cluster-Endpunkt verfügbar wäre.

~~~text
RDS Multi-AZ: DEDICATED, synchronously-replicated STANDBY instance in another AZ
  primary failure -> automatic failover, standby becomes new primary
  DNS name unchanged (underlying IP changes, app just needs fresh DNS resolution, no config change)
Aurora: STRUCTURALLY different -- distributed STORAGE LAYER replicated across multiple AZs
  independent of compute instance count/state
  -> potentially FASTER failover (promote an EXISTING read replica, no full standby restart)
  -> enables MULTIPLE simultaneous read replicas, all accessing the SAME consistently replicated storage
Aurora cluster endpoint TYPES:
  Cluster endpoint: ALWAYS points to CURRENT primary (write) instance
    -> use for writes AND reads needing IMMEDIATE consistency with latest writes
  Reader endpoint: load-balances reads across AVAILABLE read replicas
    -> use for reads tolerating some replication lag, benefiting from distributed capacity
KEY METHODOLOGICAL POINT: app using ONLY cluster endpoint for everything
  -> wastes distributed read capacity, unnecessarily concentrates load on primary
  app using reader endpoint for consistency-critical reads
  -> risk of reading STALE data due to replication lag, despite newer data being available via cluster endpoint
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| RDS Multi-AZ | dedizierte, synchron replizierte Standby-Instanz | klassisches Failover-Modell mit unveränderter DNS-Adressierung |
| Aurora-Storage-Layer | verteilte, AZ-übergreifende Speicherreplikation | unabhängig von Compute-Instanzen, ermöglicht schnelleres Failover |
| Cluster-Endpunkt | verweist auf aktuelle primäre Instanz | für Schreibzugriffe und konsistenzkritische Lesezugriffe |
| Leser-Endpunkt | verteilt Lesezugriffe über Replikate | für lastverteilte Lesezugriffe mit Toleranz für Replikationsverzögerung |

Implementierung: Für Anwendungsfälle mit tatsächlichem Bedarf an mehreren, gleichzeitig genutzten Lese-Replikaten und potenziell schnellerem Failover wird Aurora gegenüber klassischem RDS Multi-AZ evaluiert. Bei Aurora wird jede Anwendungskomponente explizit dem passenden Endpunkt-Typ zugeordnet — Schreibzugriffe und konsistenzkritische Lesezugriffe über den Cluster-Endpunkt, lastverteilte, replikationsverzögerungstolerante Lesezugriffe über den Leser-Endpunkt. Vor einer produktiven Migration wird die tatsächliche Failover-Zeit beider Optionen unter realistischen Bedingungen getestet, statt sich auf theoretische, dokumentierte Zeitangaben zu verlassen.

## Scalability, Reliability, Security und Observability

RDS und Aurora skalieren die effektive Lesekapazität proportional zur korrekten Nutzung der jeweiligen Endpunkt-Typen (bei Aurora) beziehungsweise zur Anzahl konfigurierter Lese-Replikate; die Reliability-Grenze liegt darin, dass eine fehlerhafte Endpunkt-Nutzung proportional zum Anteil betroffener Lesezugriffe entweder zu unnötiger Lastkonzentration auf der primären Instanz oder zu unerwarteter Leseinkonsistenz durch Replikationsverzögerung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die primäre Datenbankinstanz zeigt unerwartet hohe Last trotz verfügbarer Lese-Replikate | die Anwendung nutzt konsequent den Cluster-Endpunkt auch für Lesezugriffe, statt den Leser-Endpunkt zu verwenden | die Anwendung so anpassen, dass lastverteilungstaugliche Lesezugriffe über den Leser-Endpunkt erfolgen |
| nach einem Schreibvorgang liest eine nachfolgende Anfrage veraltete Daten | die nachfolgende Anfrage nutzt den Leser-Endpunkt, obwohl unmittelbare Konsistenz mit dem zuvor geschriebenen Wert benötigt wird | konsistenzkritische Lesezugriffe auf den Cluster-Endpunkt umstellen |
| ein Failover dauert deutlich länger als erwartet | die tatsächliche Failover-Zeit wurde nie unter realistischen Bedingungen getestet, nur die dokumentierte, theoretische Zeit angenommen | einen echten Failover-Test durchführen und die tatsächliche Zeit messen |

Security: Verbindungen zu RDS- und Aurora-Instanzen sollten über dedizierte, eng gefasste Security Groups (siehe [KB-0465](03-amazon-vpc-und-endpunkte.md)) abgesichert werden, mit Zugriff nur von den tatsächlich berechtigten Anwendungsinstanzen. Observability: Die tatsächliche Lastverteilung zwischen Cluster- und Leser-Endpunkt-Nutzung, die gemessene Replikationsverzögerung, und die tatsächliche Failover-Zeit bei simulierten Tests sind zentrale Metriken zur Bewertung der Datenbankarchitektur.

## Trade-offs und Entscheidungen

**Staff** ordnet jede Anwendungskomponente explizit dem passenden Aurora-Endpunkt-Typ zu, basierend auf tatsächlichen Konsistenzanforderungen. **Principal** macht die Wahl zwischen RDS Multi-AZ und Aurora für das Team nachvollziehbar. **Chief** legt Datenbankplattform-Richtlinien im Unternehmen anhand tatsächlicher Konsistenz- und Betriebsanforderungen fest.

Anti-Patterns: bei Aurora konsequent nur den Cluster-Endpunkt nutzen und dadurch verfügbare, verteilte Lesekapazität ungenutzt lassen; konsistenzkritische Lesezugriffe fälschlich über den Leser-Endpunkt durchführen und dadurch veraltete Daten riskieren; die tatsächliche Failover-Zeit nie unter realistischen Bedingungen testen und sich ausschließlich auf dokumentierte, theoretische Werte verlassen.

## Production Checklist

- [ ] Anwendungskomponenten nutzen explizit den für ihre Konsistenzanforderung passenden Endpunkt-Typ.
- [ ] Die tatsächliche Failover-Zeit wurde unter realistischen Bedingungen getestet.
- [ ] Die Wahl zwischen RDS Multi-AZ und Aurora ist anhand tatsächlicher Lesekapazitäts- und Kostenanforderungen begründet.
- [ ] Die Lastverteilung zwischen Cluster- und Leser-Endpunkt wird überwacht.

## Interviewfragen

### 1. Was ist der strukturelle Unterschied zwischen RDS Multi-AZ und Aurora?

**Antwort:** RDS Multi-AZ nutzt eine dedizierte, synchron replizierte Standby-Instanz; Aurora nutzt ein verteiltes Storage-Layer, das über mehrere Availability Zones repliziert wird, unabhängig von der Anzahl der Compute-Instanzen.

### 2. Wofür sollte der Cluster-Endpunkt eines Aurora-Clusters genutzt werden?

**Antwort:** Für Schreibzugriffe und für Lesezugriffe, die unmittelbare Konsistenz mit den zuletzt geschriebenen Daten benötigen, da er immer auf die aktuelle primäre Instanz verweist.

### 3. Wofür ist der Leser-Endpunkt geeignet, und welches Risiko birgt seine falsche Nutzung?

**Antwort:** Er ist für lastverteilte Lesezugriffe mit Toleranz für Replikationsverzögerung geeignet; wird er fälschlich für konsistenzkritische Lesezugriffe genutzt, kann die Anwendung veraltete Daten lesen.

### 4. Warum kann eine Aurora-Migration potenziell schnellere Failover-Zeiten bieten?

**Antwort:** Weil ein vorhandenes Lese-Replikat zur neuen primären Instanz befördert werden kann, statt eine vollständig separate Standby-Instanz neu zu starten, wie es bei klassischem RDS Multi-AZ der Fall ist.

### 5. Wie gehst du vor, wenn die primäre Datenbankinstanz unerwartet hohe Last zeigt, obwohl Lese-Replikate verfügbar sind?

**Antwort:** Ich prüfe, ob die Anwendung konsequent den Cluster-Endpunkt auch für Lesezugriffe nutzt, statt lastverteilungstaugliche Lesezugriffe über den Leser-Endpunkt zu verteilen, und passe die Anwendung entsprechend an.

### 6. Widersprüchliche Anforderung: Team will maximale Lesekapazität (viele Lese-Replikate über den Leser-Endpunkt) UND garantiert konsistente Leseergebnisse für jede Anfrage — wie gehst du vor?

**Antwort:** Ich würde eine differenzierte Zuordnung vornehmen: konsistenzkritische Lesezugriffe explizit über den Cluster-Endpunkt, während unkritische, lastverteilungstaugliche Lesezugriffe über den Leser-Endpunkt erfolgen, statt eine pauschale Lösung für alle Anfragen zu verwenden.

## Praktische Labs

~~~python
# Conceptual Aurora endpoint routing decision (not executed against a real AWS account):

def choose_endpoint(needs_immediate_consistency, is_write_operation):
    if is_write_operation or needs_immediate_consistency:
        return "cluster_endpoint"
    return "reader_endpoint"

operations = {
    "insert_order": {"needs_immediate_consistency": False, "is_write_operation": True},
    "read_order_confirmation_immediately_after_insert": {"needs_immediate_consistency": True, "is_write_operation": False},
    "generate_monthly_report": {"needs_immediate_consistency": False, "is_write_operation": False},
}

for name, attrs in operations.items():
    print(f"{name}: use {choose_endpoint(**attrs)}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon RDS Multi-AZ Deployments](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Amazon Aurora — Endpoints](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html), abgerufen 2026-09-18.

Datenbank-Hochverfügbarkeit ist kanonisch in [KB-0215](../09-databases-storage/21-datenbank-hochverfuegbarkeit.md) behandelt; verwaltete Cloud-Datenbanken in [KB-0447](../18-cloud-foundations/07-verwaltete-cloud-datenbanken.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, serverlose Aurora-Kapazitätsmodelle, die Compute-Kapazität automatisch an tatsächliche Last anpassen | Adopting | Gegenüber statisch dimensionierten Instanzen bevorzugen, sobald das tatsächliche Lastmuster für unvorhersehbare, schwankende Workloads geprüft ist. |

Ein Team akzeptiert eine RDS- oder Aurora-Architektur erst, wenn die tatsächliche Failover-Zeit getestet und die Endpunkt-Nutzung (bei Aurora) nachweislich den tatsächlichen Konsistenzanforderungen jeder Anwendungskomponente entspricht.
