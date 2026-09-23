---
{"id": "KB-0465", "title": "Amazon VPC und Endpunkte", "domain": "19", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0443", "concepts": ["Cloud-Netzwerkmodelle"], "needed_for": "understanding"}, {"id": "KB-0393", "concepts": ["NetworkPolicy und Netzwerkisolation"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein VPC mit Subnetzen, Route Tables, Security Groups und NACLs anhand offizieller AWS-Dokumentation strukturieren können und den Unterschied zwischen zustandsbehafteten Security Groups und zustandslosen NACLs erklären.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Anwendung entscheiden, wann ein VPC-Endpoint gegenüber einem Datenpfad über das öffentliche Internet angemessen ist, und eine Security-Group-/NACL-Kombination gestalten, die beide Kontrollebenen sinnvoll nutzt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Konnektivitätsstörung auf eine fehlerhafte Interaktion zwischen zustandsbehafteten Security Groups und zustandslosen NACLs zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "VPC-Sicherheitsrichtlinien im Unternehmen anhand einer bewussten Kombination aus Security Groups, NACLs und VPC-Endpoints statt anhand einer einzigen, pauschalen Kontrollebene festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der AWS-Hypervisor-Netzwerkschicht im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Subnetzen, Routing, Security Groups, NACLs und Endpoints als Entscheidungsgrundlage, nicht die Hypervisor-Netzwerk-Interna."}}, "lab_validation": [{"lab_id": "KB-0465-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-VPC-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie Subnetze, Route Tables und VPC-Endpoints (Gateway- und Interface-Endpoints) private Datenpfade zu AWS-Diensten ermöglichen, ohne über das öffentliche Internet zu laufen, und wie sich zustandsbehaftete Security Groups (Antwortverkehr automatisch erlaubt) von zustandslosen Network ACLs (Antwortverkehr muss explizit erlaubt werden) in ihrem Filterverhalten unterscheiden.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale VPC-Konfiguration erstellt."}]}
---
# Amazon VPC und Endpunkte

> **Ziel:** Amazon VPC (Virtual Private Cloud, siehe Cloud-Netzwerkmodelle, [KB-0443](../18-cloud-foundations/03-cloud-netzwerkmodelle.md)) strukturiert Subnetze und Route Tables (die festlegen, wohin Datenverkehr aus einem Subnetz weitergeleitet wird) und stellt zwei unterschiedliche Filterebenen bereit — Security Groups (zustandsbehaftet, auf Instanzebene, Antwortverkehr auf eine erlaubte, ausgehende Verbindung wird automatisch zugelassen) und Network ACLs (NACLs, zustandslos, auf Subnetzebene, Antwortverkehr muss explizit durch eine eigene Regel erlaubt werden, unabhängig von der ursprünglichen, ausgehenden Verbindung). Der zentrale Punkt dieses Kapitels ist, dass VPC-Endpoints (Gateway-Endpoints für S3/DynamoDB, Interface-Endpoints für die meisten anderen AWS-Dienste) private Datenpfade zu AWS-Diensten ermöglichen, ohne dass der Datenverkehr über das öffentliche Internet laufen muss — dies reduziert sowohl die Angriffsfläche als auch potenzielle Datenübertragungskosten, ist jedoch nur dann relevant, wenn tatsächlich sensible oder umfangreiche Kommunikation zwischen VPC-Ressourcen und AWS-Diensten stattfindet, die den zusätzlichen Konfigurationsaufwand rechtfertigt.

## Zweck, Mental Model und Dependencies

Ein Subnetz innerhalb eines VPC ist einer bestimmten Availability Zone zugeordnet und wird über eine Route Table gesteuert, die festlegt, wohin Datenverkehr aus diesem Subnetz weitergeleitet wird — ein Subnetz mit einer Route zu einem Internet Gateway gilt als "öffentlich" (kann direkt mit dem Internet kommunizieren), während ein Subnetz ohne eine solche Route als "privat" gilt und für ausgehende Internetverbindungen typischerweise einen NAT Gateway benötigt. Security Groups filtern Datenverkehr auf Ebene einzelner Instanzen und sind zustandsbehaftet — wenn eine ausgehende Verbindung durch eine Security-Group-Regel erlaubt ist, wird der zugehörige Antwortverkehr automatisch zugelassen, ohne dass eine separate, eingehende Regel dafür nötig ist. Network ACLs filtern Datenverkehr auf Ebene ganzer Subnetze und sind zustandslos — jede Richtung des Datenverkehrs muss explizit durch eine eigene Regel erlaubt werden, auch der Antwortverkehr auf eine bereits erlaubte, ausgehende Verbindung, was bei einer Fehlkonfiguration zu Verbindungsproblemen führen kann, die auf den ersten Blick unerklärlich wirken (eine ausgehende Verbindung scheint erfolgreich, aber die Antwort kommt nie an, weil die NACL den eingehenden Antwortverkehr nicht explizit erlaubt). Ein VPC-Endpoint ermöglicht es, dass Ressourcen innerhalb eines VPC mit bestimmten AWS-Diensten (z. B. S3, DynamoDB über Gateway-Endpoints, oder die meisten anderen Dienste über Interface-Endpoints) kommunizieren, ohne dass der Datenverkehr über ein Internet Gateway oder NAT Gateway und damit über das öffentliche Internet laufen muss — dies ist insbesondere relevant für private Subnetze, die andernfalls für die Kommunikation mit AWS-Diensten einen Umweg über einen NAT Gateway (mit entsprechenden Kosten) oder gar keine Internetverbindung hätten. Der zentrale methodische Punkt ist, dass Security Groups und NACLs komplementäre, nicht redundante Kontrollebenen darstellen — Security Groups bieten granulare, instanzspezifische Kontrolle mit einfacherer, zustandsbehafteter Regelverwaltung, während NACLs eine zusätzliche, subnetzweite Kontrollebene bieten, die auch bei einer Fehlkonfiguration einzelner Security Groups noch greift, jedoch aufgrund ihrer Zustandslosigkeit sorgfältiger konfiguriert werden muss.

~~~text
Subnet: assigned to ONE Availability Zone, controlled by a route table
  route to Internet Gateway -> "public" subnet (direct internet)
  no such route -> "private" subnet (typically needs NAT Gateway for outbound internet)
Security Groups: instance-level, STATEFUL
  outbound allowed by a rule -> RETURN traffic AUTOMATICALLY allowed, no separate inbound rule needed
Network ACLs (NACLs): subnet-level, STATELESS
  EVERY direction needs an EXPLICIT rule, including return traffic on an already-allowed outbound connection
  -> misconfiguration: outbound "succeeds" but response never arrives (NACL blocks inbound return traffic)
VPC Endpoint: private path to AWS services (S3/DynamoDB via Gateway, most others via Interface)
  NO traffic over Internet/NAT Gateway -> relevant for private subnets otherwise needing a costly NAT detour
KEY METHODOLOGICAL POINT: Security Groups and NACLs are COMPLEMENTARY, not redundant
  Security Groups: granular, instance-specific, simpler stateful rules
  NACLs: additional subnet-wide layer, still effective even if a Security Group is misconfigured
    BUT requires more careful config due to statelessness
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Subnetz/Route Table | bestimmt öffentliche versus private Konnektivität | Route-Konfiguration bestimmt, ob ein Subnetz Internetzugriff hat |
| Security Group | zustandsbehaftete, instanzbezogene Filterung | Antwortverkehr automatisch erlaubt, einfachere Regelverwaltung |
| Network ACL | zustandslose, subnetzbezogene Filterung | jede Richtung muss explizit erlaubt werden, zusätzliche Kontrollebene |
| VPC-Endpoint | privater Pfad zu AWS-Diensten ohne öffentliches Internet | relevant bei sensibler oder umfangreicher Kommunikation mit AWS-Diensten |

Implementierung: Subnetze werden explizit als öffentlich oder privat klassifiziert, basierend auf ihrer tatsächlichen Route-Table-Konfiguration, statt implizit anzunehmen, dass ein Subnetz privat ist, ohne dessen Routing zu prüfen. Security Groups werden für die granulare, instanzspezifische Filterung genutzt, während NACLs als zusätzliche, subnetzweite Sicherheitsebene eingesetzt werden, wobei bei deren Konfiguration explizit sowohl aus- als auch eingehender Antwortverkehr berücksichtigt wird. Für private Subnetze mit häufiger, sensibler oder umfangreicher Kommunikation zu AWS-Diensten wird geprüft, ob ein VPC-Endpoint gegenüber einem Umweg über einen NAT Gateway und das öffentliche Internet sinnvoll ist.

## Scalability, Reliability, Security und Observability

Amazon VPC mit bewusst genutzten Security Groups, NACLs und VPC-Endpoints skaliert die Netzwerksicherheit proportional zur Sorgfalt der Konfiguration jeder Kontrollebene; die Reliability-Grenze liegt darin, dass eine fehlerhaft konfigurierte, zustandslose NACL proportional zu den betroffenen Kommunikationsrichtungen zu schwer diagnostizierbaren Konnektivitätsproblemen führt, die auf den ersten Blick wie ein anderes Problem (z. B. eine fehlerhafte Anwendungslogik) wirken können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine ausgehende Verbindung scheint erfolgreich, aber die Antwort kommt nie an | die NACL des Subnetzes erlaubt den eingehenden Antwortverkehr nicht explizit | die NACL-Regeln für eingehenden Verkehr auf dem relevanten, dynamischen Port-Bereich prüfen |
| eine Ressource in einem privaten Subnetz kann nicht mit einem AWS-Dienst kommunizieren | es fehlt sowohl ein NAT Gateway als auch ein passender VPC-Endpoint für diesen Dienst | prüfen, ob ein VPC-Endpoint für den benötigten Dienst eingerichtet werden sollte |
| die Datenübertragungskosten für Kommunikation mit AWS-Diensten aus privaten Subnetzen sind höher als erwartet | der Datenverkehr läuft über einen NAT Gateway statt über einen kostengünstigeren VPC-Endpoint | einen VPC-Endpoint für die betroffenen AWS-Dienste einrichten, um den NAT-Gateway-Umweg zu vermeiden |

Security: Security Groups sollten nach dem Prinzip geringster Berechtigung konfiguriert werden (nur die tatsächlich benötigten Ports und Quellen erlauben), während NACLs als zusätzliche, grobkörnigere Verteidigungslinie auf Subnetzebene dienen, die auch bei einer fehlerhaften Security-Group-Konfiguration eine gewisse Schutzwirkung behält. Observability: Die tatsächliche Nutzung von VPC-Endpoints versus NAT-Gateway-Datenverkehr, VPC-Flow-Logs zur Analyse tatsächlicher Kommunikationsmuster, und die Konsistenz zwischen Security-Group- und NACL-Konfiguration sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** konfiguriert NACLs unter expliziter Berücksichtigung der Zustandslosigkeit, inklusive Antwortverkehr. **Principal** macht die komplementäre Nutzung von Security Groups und NACLs für das Team nachvollziehbar. **Chief** legt VPC-Sicherheitsrichtlinien im Unternehmen anhand einer bewussten Kombination beider Kontrollebenen fest.

Anti-Patterns: NACLs ohne Berücksichtigung ihrer Zustandslosigkeit konfigurieren und dadurch unerklärliche Konnektivitätsprobleme riskieren; private Subnetze ohne Prüfung von VPC-Endpoints ausschließlich über NAT Gateway mit AWS-Diensten kommunizieren lassen; Security Groups als einzige Kontrollebene ohne zusätzliche, subnetzweite NACL-Absicherung betrachten.

## Production Checklist

- [ ] Subnetze sind explizit als öffentlich oder privat anhand ihrer tatsächlichen Route-Table-Konfiguration klassifiziert.
- [ ] Security Groups sind nach dem Prinzip geringster Berechtigung konfiguriert.
- [ ] NACL-Konfigurationen berücksichtigen explizit sowohl aus- als auch eingehenden Verkehr aufgrund ihrer Zustandslosigkeit.
- [ ] VPC-Endpoints sind für private Subnetze mit relevanter AWS-Dienst-Kommunikation eingerichtet.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen Security Groups und Network ACLs?

**Antwort:** Security Groups sind zustandsbehaftet und wirken auf Instanzebene, wobei Antwortverkehr automatisch erlaubt wird; NACLs sind zustandslos und wirken auf Subnetzebene, wobei jede Richtung explizit erlaubt werden muss.

### 2. Warum kann eine NACL-Fehlkonfiguration zu einem scheinbar erfolgreichen, aber tatsächlich fehlgeschlagenen Verbindungsversuch führen?

**Antwort:** Weil die NACL zustandslos ist und den eingehenden Antwortverkehr auf eine ausgehende Verbindung explizit erlauben muss — fehlt diese Regel, kommt die Antwort trotz erfolgreicher ausgehender Verbindung nie an.

### 3. Was ermöglicht ein VPC-Endpoint, und warum ist er relevant?

**Antwort:** Er ermöglicht privaten Datenverkehr zu AWS-Diensten ohne den Umweg über das öffentliche Internet oder einen NAT Gateway, was Sicherheit erhöht und potenziell Kosten reduziert.

### 4. Warum sind Security Groups und NACLs komplementäre statt redundante Kontrollebenen?

**Antwort:** Security Groups bieten granulare, instanzspezifische Kontrolle mit einfacherer Verwaltung, während NACLs eine zusätzliche, subnetzweite Schutzebene bieten, die auch bei einer fehlerhaften Security-Group-Konfiguration noch wirksam sein kann.

### 5. Wie gehst du vor, wenn eine ausgehende Verbindung scheinbar erfolgreich ist, aber keine Antwort ankommt?

**Antwort:** Ich prüfe die NACL-Regeln für eingehenden Verkehr auf dem relevanten, dynamischen Port-Bereich, da eine fehlende explizite Regel für den Antwortverkehr eine typische Ursache für dieses Symptom ist.

### 6. Widersprüchliche Anforderung: Team will maximale Netzwerkisolation (keine Internetverbindung für private Subnetze) UND zuverlässige Kommunikation mit AWS-Diensten wie S3 — wie gehst du vor?

**Antwort:** Ich würde VPC-Endpoints für die benötigten AWS-Dienste (z. B. S3 über einen Gateway-Endpoint) einrichten, sodass die Kommunikation privat innerhalb der AWS-Infrastruktur erfolgt, ohne dass das private Subnetz eine tatsächliche Internetverbindung benötigt.

## Praktische Labs

~~~python
# Conceptual stateful vs stateless connection filtering illustration (not executed against a real AWS account):

def check_return_traffic_allowed(rule_type, outbound_allowed, explicit_inbound_return_rule):
    if rule_type == "security_group":
        return outbound_allowed  # stateful: return traffic automatically allowed
    if rule_type == "nacl":
        return outbound_allowed and explicit_inbound_return_rule  # stateless: needs explicit rule
    raise ValueError("unknown rule type")

sg_result = check_return_traffic_allowed("security_group", outbound_allowed=True, explicit_inbound_return_rule=False)
nacl_result_missing_rule = check_return_traffic_allowed("nacl", outbound_allowed=True, explicit_inbound_return_rule=False)
nacl_result_with_rule = check_return_traffic_allowed("nacl", outbound_allowed=True, explicit_inbound_return_rule=True)

print(f"Security Group (stateful): return traffic allowed = {sg_result}")
print(f"NACL without explicit return rule: return traffic allowed = {nacl_result_missing_rule}")
print(f"NACL with explicit return rule: return traffic allowed = {nacl_result_with_rule}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon VPC — Security Groups vs. Network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-comparison.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [VPC Endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html), abgerufen 2026-09-18.

Cloud-Netzwerkmodelle sind kanonisch in [KB-0443](../18-cloud-foundations/03-cloud-netzwerkmodelle.md) behandelt; NetworkPolicy und Netzwerkisolation in [KB-0393](../16-kubernetes-platform/15-networkpolicy-und-netzwerkisolation.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte VPC-Flow-Log-Analysewerkzeuge, die automatisiert ungenutzte oder übermäßig weit gefasste Security-Group-/NACL-Regeln identifizieren | Adopting | Gegenüber manueller Regelprüfung bevorzugen, sobald die tatsächliche Genauigkeit der Analyse für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert eine VPC-Netzwerkarchitektur erst, wenn Security Groups nach dem Prinzip geringster Berechtigung konfiguriert, NACL-Regeln explizit für beide Verkehrsrichtungen geprüft, und VPC-Endpoints für relevante AWS-Dienst-Kommunikation eingerichtet sind.
