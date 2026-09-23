---
{"id": "KB-0466", "title": "AWS Transit Gateway", "domain": "19", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0451", "concepts": ["Hub-Spoke und Transitarchitekturen"], "needed_for": "understanding"}, {"id": "KB-0465", "concepts": ["Amazon VPC und Endpunkte"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Transit Gateway mit mehreren VPC-Attachments und segmentierten Routentabellen anhand offizieller Dokumentation strukturieren können und erklären, wie Routentabellen-Segmentierung unbeabsichtigte gegenseitige Erreichbarkeit zwischen Attachments verhindert.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Transit-Gateway-Architektur für mehrere AWS-Accounts und eine On-Premises-Anbindung gestalten, die explizit segmentierte Routentabellen nutzt, statt alle Attachments standardmäßig gegenseitig erreichbar zu machen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, gegenseitige Erreichbarkeit zwischen zwei eigentlich isoliert gedachten VPCs auf eine fehlende Routentabellen-Segmentierung im Transit Gateway zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Transit-Gateway-Segmentierungsrichtlinien im Unternehmen anhand expliziter, dokumentierter Routentabellen-Zuordnungen statt anhand einer einzigen, gemeinsamen Standard-Routentabelle für alle Attachments festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die konkreten BGP-Routing-Details zwischen Transit Gateway und On-Premises-Netzwerk im Detail sind Vertiefung.", "rationale": "Ein Lernziel wird erst durch ein überprüfbares Artefakt glaubwürdig."}}, "lab_validation": [{"lab_id": "KB-0466-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-Transit-Gateway-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie ein Transit Gateway mehrere VPCs, VPN-Verbindungen und Direct-Connect-Anbindungen über Attachments zentral verbindet, wie standardmäßig alle Attachments über eine gemeinsame Routentabelle gegenseitig erreichbar sind, und wie segmentierte, mehrere Routentabellen genutzt werden, um bestimmte Attachments gezielt voneinander zu isolieren.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale Transit-Gateway-Konfiguration erstellt."}]}
---
# AWS Transit Gateway

> **Ziel:** AWS Transit Gateway ist die konkrete AWS-Implementierung einer Hub-Spoke-Transitarchitektur (siehe [KB-0451](../18-cloud-foundations/11-hub-spoke-und-transitarchitekturen.md)), die mehrere VPCs (siehe [KB-0465](03-amazon-vpc-und-endpunkte.md)), VPN-Verbindungen und Direct-Connect-Anbindungen zu On-Premises-Rechenzentren über Attachments zentral verbindet. Der zentrale Punkt dieses Kapitels ist, dass ein Transit Gateway standardmäßig eine einzige, gemeinsame Routentabelle nutzt, über die alle angeschlossenen Attachments gegenseitig erreichbar sind — für Umgebungen mit mehreren AWS-Accounts oder einer On-Premises-Anbindung, bei denen bestimmte VPCs bewusst voneinander isoliert bleiben sollen (z. B. Produktions- und Testumgebungen unterschiedlicher Teams), muss diese Standard-Erreichbarkeit explizit durch segmentierte, mehrere Routentabellen eingeschränkt werden, statt sich auf eine implizite Isolation durch getrennte VPCs allein zu verlassen, die durch das Transit Gateway ohne zusätzliche Konfiguration tatsächlich aufgehoben wird.

## Zweck, Mental Model und Dependencies

Ohne ein Transit Gateway müssten mehrere VPCs, die miteinander kommunizieren sollen, über individuelles VPC-Peering paarweise verbunden werden, was bei wachsender Anzahl von VPCs schnell unübersichtlich wird (die Anzahl benötigter Peering-Verbindungen wächst quadratisch mit der Anzahl der VPCs, ähnlich der allgemeinen Hub-Spoke-Problematik). Ein Transit Gateway löst dieses Problem, indem jede VPC (sowie VPN-Verbindungen und Direct-Connect-Anbindungen) nur ein einziges Attachment zum zentralen Transit Gateway benötigt, statt individuelle Verbindungen zu jeder anderen VPC zu unterhalten. Die Routentabelle des Transit Gateway bestimmt, welche Attachments tatsächlich miteinander kommunizieren können — in der einfachsten Konfiguration nutzen alle Attachments dieselbe, gemeinsame Routentabelle, wodurch jede angeschlossene VPC standardmäßig jede andere angeschlossene VPC erreichen kann, sobald beide demselben Transit Gateway zugeordnet sind. Dies kann zu einer unbeabsichtigten, unerwünschten gegenseitigen Erreichbarkeit führen, wenn zwei VPCs (z. B. eine Produktions- und eine Testumgebung, oder VPCs unterschiedlicher, voneinander unabhängiger Teams) bewusst voneinander isoliert bleiben sollten, aber ohne explizite Konfiguration über dasselbe Transit Gateway dennoch gegenseitig erreichbar sind. Segmentierte Routentabellen adressieren dieses Problem, indem für unterschiedliche Gruppen von Attachments separate Routentabellen definiert werden, die jeweils nur die tatsächlich gewünschten Kommunikationspfade enthalten — ein Attachment wird einer bestimmten Routentabelle zugeordnet, und nur die in dieser spezifischen Tabelle enthaltenen Routen bestimmen, welche anderen Attachments tatsächlich erreichbar sind, statt der pauschalen, gemeinsamen Erreichbarkeit der Standardkonfiguration. Der zentrale methodische Punkt ist, dass die Isolation zwischen VPCs, die über ein gemeinsames Transit Gateway verbunden sind, nicht implizit durch die getrennte VPC-Struktur selbst gegeben ist, sondern explizit durch eine bewusst gestaltete Routentabellen-Segmentierung hergestellt werden muss.

~~~text
WITHOUT Transit Gateway: multiple VPCs needing connectivity -> individual pairwise VPC peering
  -> connections grow QUADRATICALLY with VPC count (same hub-spoke problem, see KB-0451)
Transit Gateway: EACH VPC/VPN/Direct-Connect needs only ONE attachment to the central gateway
Default (single shared route table): ALL attachments REACHABLE from each other by default
  -> UNINTENDED reachability if two VPCs (e.g. prod vs. test, or independent teams) SHOULD be isolated
     but are attached to the SAME Transit Gateway without explicit config
Segmented route tables: SEPARATE route tables for different attachment groups
  attachment ASSIGNED to a specific table -> ONLY routes IN THAT table determine actual reachability
KEY METHODOLOGICAL POINT: isolation between VPCs sharing a Transit Gateway is NOT implicit
  from the separate VPC structure alone -- it must be EXPLICITLY established
  through deliberately designed route table segmentation
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Attachment | verbindet VPC/VPN/Direct-Connect mit dem Transit Gateway | jedes Attachment benötigt nur eine Verbindung zum zentralen Gateway |
| Gemeinsame Standard-Routentabelle | macht alle Attachments standardmäßig gegenseitig erreichbar | kann zu unbeabsichtigter Erreichbarkeit führen, wenn nicht explizit segmentiert |
| Segmentierte Routentabellen | isolieren definierte Gruppen von Attachments voneinander | zentrale Voraussetzung für bewusste, gewollte Isolation zwischen VPCs |
| On-Premises-Anbindung | VPN/Direct-Connect als Attachment integriert | muss ebenfalls in die Routentabellen-Segmentierung einbezogen werden |

Implementierung: Vor der Zuordnung von VPCs zu einem gemeinsamen Transit Gateway wird explizit geklärt, welche Gruppen von VPCs tatsächlich miteinander kommunizieren sollen und welche voneinander isoliert bleiben müssen. Für jede identifizierte Isolationsgruppe wird eine dedizierte Routentabelle im Transit Gateway erstellt, und jedes Attachment wird explizit der für seine tatsächlichen Kommunikationsanforderungen passenden Routentabelle zugeordnet, statt die Standard-Routentabelle für alle Attachments zu verwenden. Die On-Premises-Anbindung (VPN oder Direct Connect) wird ebenfalls explizit in die Routentabellen-Segmentierung einbezogen, um sicherzustellen, dass nur die tatsächlich vorgesehenen VPCs über diese Anbindung erreichbar sind.

## Scalability, Reliability, Security und Observability

AWS Transit Gateway skaliert die Verwaltbarkeit einer Multi-VPC-Netzwerktopologie proportional zur Anzahl der über ein einziges Attachment angeschlossenen VPCs; die Reliability- und Security-Grenze liegt darin, dass eine fehlende Routentabellen-Segmentierung proportional zur Anzahl angeschlossener, eigentlich zu isolierender VPCs zu unbeabsichtigter, potenziell sicherheitsrelevanter gegenseitiger Erreichbarkeit führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| zwei VPCs, die eigentlich isoliert sein sollten, sind unerwartet gegenseitig erreichbar | beide VPCs nutzen dieselbe, gemeinsame Transit-Gateway-Routentabelle ohne explizite Segmentierung | eine dedizierte, segmentierte Routentabelle für die zu isolierenden VPCs erstellen und die Attachments entsprechend zuordnen |
| eine On-Premises-Ressource kann unerwartet auf eine VPC zugreifen, die nicht dafür vorgesehen war | die On-Premises-Anbindung ist derselben Routentabelle wie diese VPC zugeordnet, ohne dass dies beabsichtigt war | die Routentabellen-Zuordnung der On-Premises-Anbindung gegen die tatsächlich vorgesehenen Zielnetzwerke prüfen |
| eine neue VPC ist nach dem Anschluss an das Transit Gateway nicht wie erwartet mit den benötigten anderen VPCs verbunden | die neue VPC wurde einer Routentabelle zugeordnet, die die benötigten Routen nicht enthält | die Routentabellen-Zuordnung der neuen VPC gegen deren tatsächlichen Kommunikationsbedarf prüfen |

Security: Die Routentabellen-Segmentierung im Transit Gateway sollte als primäres Isolationswerkzeug zwischen unterschiedlich vertrauenswürdigen VPCs behandelt werden, ergänzt durch Security Groups und NACLs innerhalb jeder VPC als zusätzliche Verteidigungslinie. Observability: Die tatsächliche Routentabellen-Zuordnung jedes Attachments, sowie regelmäßige Prüfungen der tatsächlichen Erreichbarkeit zwischen VPCs gegen die beabsichtigte Isolationsstruktur, sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** ordnet jedes Attachment explizit einer für seine tatsächlichen Kommunikationsanforderungen passenden Routentabelle zu, statt die Standardkonfiguration unreflektiert zu übernehmen. **Principal** macht die Routentabellen-Segmentierung und ihre Begründung für das Team nachvollziehbar. **Chief** legt Transit-Gateway-Segmentierungsrichtlinien im Unternehmen anhand expliziter, dokumentierter Routentabellen-Zuordnungen fest.

Anti-Patterns: mehrere VPCs unterschiedlicher Teams oder Umgebungen an ein gemeinsames Transit Gateway mit der Standard-Routentabelle anschließen, ohne die resultierende, unbeabsichtigte gegenseitige Erreichbarkeit zu prüfen; die On-Premises-Anbindung ohne explizite Routentabellen-Zuordnung in die Transit-Gateway-Struktur integrieren; sich ausschließlich auf die getrennte VPC-Struktur verlassen, ohne die tatsächliche Erreichbarkeit über das Transit Gateway zu verifizieren.

## Production Checklist

- [ ] Isolationsgruppen zwischen VPCs sind explizit identifiziert, bevor Attachments dem Transit Gateway zugeordnet werden.
- [ ] Segmentierte Routentabellen sind für jede identifizierte Isolationsgruppe eingerichtet.
- [ ] Die On-Premises-Anbindung ist explizit in die Routentabellen-Segmentierung einbezogen.
- [ ] Die tatsächliche Erreichbarkeit zwischen VPCs wird regelmäßig gegen die beabsichtigte Isolationsstruktur geprüft.

## Interviewfragen

### 1. Welches Problem löst ein Transit Gateway gegenüber individuellem VPC-Peering?

**Antwort:** Es reduziert die Anzahl benötigter Verbindungen von quadratisch (bei paarweisem Peering) auf linear, da jede VPC nur ein einziges Attachment zum zentralen Transit Gateway benötigt.

### 2. Warum kann die Standardkonfiguration eines Transit Gateway zu unbeabsichtigter Erreichbarkeit führen?

**Antwort:** Weil standardmäßig alle Attachments dieselbe, gemeinsame Routentabelle nutzen, wodurch jede angeschlossene VPC jede andere angeschlossene VPC erreichen kann, auch wenn dies nicht beabsichtigt war.

### 3. Wie stellen segmentierte Routentabellen Isolation zwischen VPCs sicher?

**Antwort:** Indem Attachments spezifischen, dedizierten Routentabellen zugeordnet werden, die nur die tatsächlich gewünschten Kommunikationspfade enthalten, statt der pauschalen Erreichbarkeit der gemeinsamen Standardtabelle.

### 4. Warum ist Isolation zwischen VPCs, die ein gemeinsames Transit Gateway nutzen, nicht implizit gegeben?

**Antwort:** Weil die getrennte VPC-Struktur allein keine Isolation garantiert — das Transit Gateway macht alle angeschlossenen Attachments standardmäßig gegenseitig erreichbar, sofern keine explizite Routentabellen-Segmentierung vorgenommen wird.

### 5. Wie gehst du vor, wenn zwei VPCs, die eigentlich isoliert sein sollten, unerwartet gegenseitig erreichbar sind?

**Antwort:** Ich prüfe, ob beide VPCs dieselbe, gemeinsame Transit-Gateway-Routentabelle nutzen, und erstelle gegebenenfalls eine dedizierte, segmentierte Routentabelle, um die gewünschte Isolation herzustellen.

### 6. Widersprüchliche Anforderung: Team will zentrale, einfache Netzwerkverwaltung über ein einziges Transit Gateway UND strikte Isolation zwischen Produktions- und Testumgebungen unterschiedlicher Teams — wie gehst du vor?

**Antwort:** Ich würde ein einziges Transit Gateway mit mehreren, explizit segmentierten Routentabellen einrichten, sodass zentrale Verwaltung und strikte Isolation gleichzeitig erreicht werden, statt für jede Isolationsanforderung ein separates Transit Gateway zu betreiben.

## Praktische Labs

~~~python
# Conceptual Transit Gateway route table segmentation check (not executed against a real AWS account):

def check_reachability(attachment_a, attachment_b, route_table_assignments):
    table_a = route_table_assignments.get(attachment_a)
    table_b = route_table_assignments.get(attachment_b)
    reachable = table_a == table_b
    return reachable

route_table_assignments = {
    "vpc_prod_team_a": "route_table_prod",
    "vpc_prod_team_b": "route_table_prod",
    "vpc_test_team_a": "route_table_test",  # isolated from prod
    "onprem_vpn": "route_table_prod",
}

print(f"prod team A <-> prod team B reachable: {check_reachability('vpc_prod_team_a', 'vpc_prod_team_b', route_table_assignments)}")
print(f"prod team A <-> test team A reachable: {check_reachability('vpc_prod_team_a', 'vpc_test_team_a', route_table_assignments)}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [AWS Transit Gateway — Route Tables](https://docs.aws.amazon.com/vpc/latest/tgw/tgw-route-tables.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [AWS Transit Gateway — Network Isolation Best Practices](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html), abgerufen 2026-09-18.

Hub-Spoke und Transitarchitekturen sind kanonisch in [KB-0451](../18-cloud-foundations/11-hub-spoke-und-transitarchitekturen.md) behandelt; Amazon VPC und Endpunkte in [KB-0465](03-amazon-vpc-und-endpunkte.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Erreichbarkeits-Analysewerkzeuge, die die tatsächliche Netzwerkerreichbarkeit über Transit-Gateway-Routentabellen hinweg automatisch visualisieren und auf unbeabsichtigte Pfade prüfen | Adopting | Gegenüber manueller Routentabellen-Prüfung bevorzugen, sobald die tatsächliche Genauigkeit für die eigene Topologie verifiziert ist. |

Ein Team akzeptiert eine Transit-Gateway-Architektur mit mehreren VPCs erst, wenn die Routentabellen-Segmentierung nachweislich alle beabsichtigten Isolationsanforderungen zwischen VPCs und der On-Premises-Anbindung erfüllt.
