---
{"id": "KB-0500", "title": "GCP VPC", "domain": "21", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0443", "concepts": ["Cloud-Netzwerkmodelle"], "needed_for": "understanding"}, {"id": "KB-0465", "concepts": ["Amazon VPC und Endpunkte"], "needed_for": "context"}, {"id": "KB-0499", "concepts": ["GCP-Organisation und IAM"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Globale GCP-VPC-Netzmodelle, regionale Subnetze und Firewallregeln anhand offizieller Dokumentation konfigurieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Multi-Projekt-Architektur explizit entscheiden, ob eine Shared VPC oder separate VPCs mit Peering genutzt werden, und wie private Serviceanbindung über Projektgrenzen hinweg gestaltet wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Netzwerkisolationslücke auf ein Missverständnis des globalen (nicht regionalen) VPC-Modells von GCP zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Netzwerkgovernance-Standards im Unternehmen anhand einer bewussten Shared-VPC- oder Multi-VPC-Strategie über alle GCP-Projekte hinweg festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der GCP-Netzwerk-Fabric im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis des globalen VPC-Modells und der Shared-VPC-Struktur als Entscheidungsgrundlage, nicht die Fabric-Interna."}}, "lab_validation": [{"lab_id": "KB-0500-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu VPC, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie eine GCP-VPC als globale Ressource über mehrere Regionen hinweg besteht, wie Subnetze regional (nicht zonal) angelegt werden, wie Firewallregeln auf VPC-Ebene statt pro Subnetz gelten, und wie Shared VPC mehreren Projekten Zugriff auf ein zentrales Netzwerk ermöglicht, im Vergleich zur regionalen AWS-VPC-Logik.", "limitations": "Kein aktives GCP-Konto verwendet, keine reale VPC konfiguriert."}]}
---
# GCP VPC

> **Ziel:** Eine GCP-VPC ist im Gegensatz zu einer AWS-VPC (siehe [KB-0465](../19-aws/03-amazon-vpc-und-endpunkte.md)) eine **globale**, nicht regionale Ressource — eine einzelne VPC kann Subnetze in mehreren Regionen weltweit enthalten, ohne dass ein explizites Peering zwischen Regionen nötig ist. **Subnetze** werden regional (nicht zonal) angelegt und automatisch über alle Zonen einer Region verteilt. **Firewallregeln** gelten auf VPC-Ebene (nicht pro Subnetz), mit Tags oder Service Accounts als Zielkriterium statt reiner IP-Adressbereiche. **Shared VPC** ermöglicht es, dass mehrere GCP-Projekte ein zentrales, von einem Host-Projekt verwaltetes Netzwerk gemeinsam nutzen, was Netzwerkverwaltung zentralisiert, während einzelne Projektteams weiterhin ihre eigenen Ressourcen innerhalb der geteilten Netzwerktopologie verwalten. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartete Netzwerkisolationslücke häufig auf ein Missverständnis des globalen VPC-Modells zurückzuführen ist — wer aus einer AWS-Denkweise kommt und annimmt, dass eine GCP-VPC regional isoliert ist, könnte übersehen, dass Ressourcen in verschiedenen Regionen derselben VPC standardmäßig ohne zusätzliches Peering direkt kommunizieren können.

## Zweck, Mental Model und Dependencies

Das globale VPC-Modell von GCP unterscheidet sich strukturell von der regionalen AWS-VPC-Logik (siehe [KB-0465](../19-aws/03-amazon-vpc-und-endpunkte.md)): Während in AWS jede VPC an eine einzelne Region gebunden ist und eine Multi-Region-Architektur explizites VPC-Peering oder Transit Gateway über mehrere regionale VPCs hinweg benötigt, ist eine GCP-VPC von Natur aus global — Subnetze in verschiedenen Regionen derselben VPC können direkt und privat über das globale Google-Netzwerk-Backbone kommunizieren, ohne dass eine zusätzliche Peering-Konfiguration nötig ist. Dies vereinfacht Multi-Region-Architekturen strukturell, bedeutet aber auch, dass eine Isolationsgrenze, die in AWS implizit durch getrennte regionale VPCs entstehen würde, in GCP explizit über getrennte VPCs oder Firewallregeln hergestellt werden muss. Firewallregeln in GCP gelten auf VPC-Ebene und nutzen typischerweise Netzwerk-Tags oder Service-Account-Identitäten als Zielkriterium statt ausschließlich IP-Adressbereiche, was eine dynamischere, identitätsbasiertere Segmentierung ermöglicht als eine rein IP-basierte Firewall-Konfiguration. Shared VPC adressiert das organisatorische Problem, dass mehrere Teams oder Projekte ein gemeinsames Netzwerk benötigen, ohne dass jedes Projekt eine eigene, redundante Netzwerktopologie aufbauen muss — ein zentrales Host-Projekt verwaltet das Netzwerk, während Service-Projekte Ressourcen innerhalb dieses geteilten Netzwerks erstellen können, was analog zur AWS-Transit-Gateway-Logik (siehe [KB-0466](../19-aws/04-aws-transit-gateway.md)) eine zentrale Netzwerkverwaltung über Projektgrenzen hinweg ermöglicht, jedoch mit einer direkteren Ressourcenfreigabe statt einer reinen Routing-Verbindung zwischen unabhängigen Netzwerken.

~~~text
GCP VPC: GLOBAL resource (not regional, unlike AWS VPC, see KB-0465)
  -> single VPC can span subnets across MULTIPLE regions worldwide
  -> NO explicit peering needed between regions of the SAME VPC (direct comms over global backbone)
Subnets: REGIONAL (not zonal), auto-distributed across all zones in that region
Firewall rules: apply at VPC LEVEL (not per-subnet)
  -> target criteria: tags/service accounts (not just IP ranges) -> more dynamic, identity-based segmentation
Shared VPC: multiple projects share ONE centrally-managed network (host project)
  -> service projects create resources WITHIN shared network
  (parallel to AWS Transit Gateway, KB-0466 -- but more direct resource sharing, not just routing between separate networks)
COMMON PITFALL (coming from AWS mental model):
  assuming GCP VPC is region-isolated like AWS VPC
  -> miss that same-VPC resources in DIFFERENT regions communicate directly by default, no extra peering
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Globale VPC | eine VPC umspannt mehrere Regionen ohne explizites Peering | zentraler Unterschied zur regionalen AWS-VPC |
| Regionale Subnetze | Subnetze automatisch über Zonen einer Region verteilt | vereinfacht Hochverfügbarkeit innerhalb einer Region |
| VPC-weite Firewallregeln | Tag-/Service-Account-basierte Zielkriterien | dynamischere Segmentierung als reine IP-Filterung |
| Shared VPC | zentrales Host-Projekt, mehrere Service-Projekte | zentralisierte Netzwerkverwaltung über Projektgrenzen |

Implementierung: Für jede Multi-Region-Architektur wird explizit geprüft, ob die standardmäßige direkte Kommunikation zwischen Regionen derselben VPC gewünscht ist, oder ob eine bewusste Isolation über separate VPCs hergestellt werden muss. Firewallregeln werden mit Tags oder Service-Account-Identitäten statt ausschließlich IP-Adressbereichen konfiguriert, um eine wartbare, identitätsbasierte Segmentierung zu ermöglichen. Für mehrere Projekte mit gemeinsamem Netzwerkbedarf wird explizit geprüft, ob eine Shared-VPC-Topologie mit zentralem Host-Projekt sinnvoll ist.

## Scalability, Reliability, Security und Observability

Die GCP-VPC-Architektur skaliert Multi-Region-Konnektivität proportional zum globalen VPC-Modell ohne zusätzlichen Peering-Aufwand; die Reliability-Grenze liegt darin, dass eine unbewusste, aus einem regionalen Mental Model übernommene Annahme über Isolationsgrenzen proportional zur tatsächlichen globalen Reichweite der VPC zu unerwarteter Netzwerkerreichbarkeit führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Ressourcen in verschiedenen Regionen kommunizieren unerwartet direkt miteinander | beide Regionen gehören zur selben globalen VPC ohne explizite Isolationsgrenze | prüfen, ob eine bewusste Trennung über separate VPCs oder restriktivere Firewallregeln nötig ist |
| eine Firewallregel wirkt nicht wie erwartet für eine bestimmte Ressourcengruppe | die Regel nutzt IP-Bereiche statt Tags/Service-Accounts und erfasst die tatsächliche Ressourcengruppe nicht präzise | die Firewallregel auf Tag- oder Service-Account-basierte Zielkriterien umstellen |
| mehrere Projekte haben inkonsistente Netzwerkkonfigurationen | keine Shared-VPC-Topologie ist eingerichtet, jedes Projekt verwaltet sein eigenes, redundantes Netzwerk | prüfen, ob eine Shared-VPC-Konsolidierung für die betroffenen Projekte sinnvoll ist |

Security: Firewallregeln sollten konsequent auf Tags oder Service-Account-Identitäten statt breiter IP-Bereiche aufbauen, um eine präzise, wartbare Segmentierung zu gewährleisten. Observability: Die tatsächliche Cross-Region-Kommunikationsrate innerhalb derselben VPC, sowie die Konsistenz der Firewallregel-Zielkriterien über Projekte hinweg, sind relevante Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Subnetze und Firewallregeln für eine gegebene VPC korrekt. **Principal** entscheidet, ob eine Shared-VPC-Topologie oder separate VPCs für eine Multi-Projekt-Architektur geeignet sind. **Chief** legt Netzwerkgovernance-Standards für die gesamte GCP-Organisation fest.

Anti-Patterns: ein aus AWS übernommenes Mental Model einer regionalen VPC-Isolation ungeprüft auf GCP übertragen; Firewallregeln ausschließlich mit IP-Bereichen statt Tags/Service-Accounts konfigurieren; jedes Projekt mit einer eigenen, redundanten Netzwerktopologie betreiben, obwohl eine Shared-VPC-Konsolidierung sinnvoll wäre.

## Production Checklist

- [ ] Die Isolationsgrenzen zwischen Regionen derselben VPC sind explizit geprüft und bewusst gestaltet.
- [ ] Firewallregeln nutzen Tag- oder Service-Account-basierte Zielkriterien statt ausschließlich IP-Bereiche.
- [ ] Für Multi-Projekt-Architekturen ist geprüft, ob eine Shared-VPC-Topologie sinnvoll ist.
- [ ] Subnetzplanung berücksichtigt die regionale (nicht zonale) Natur von GCP-Subnetzen.

## Interviewfragen

### 1. Was ist der zentrale strukturelle Unterschied zwischen einer GCP-VPC und einer AWS-VPC?

**Antwort:** Eine GCP-VPC ist eine globale Ressource, die Subnetze über mehrere Regionen hinweg ohne explizites Peering verbindet, während eine AWS-VPC an eine einzelne Region gebunden ist.

### 2. Auf welcher Ebene gelten GCP-Firewallregeln, und welche Zielkriterien nutzen sie typischerweise?

**Antwort:** Firewallregeln gelten auf VPC-Ebene und nutzen typischerweise Tags oder Service-Account-Identitäten als Zielkriterium statt ausschließlich IP-Adressbereiche.

### 3. Wofür wird eine Shared VPC genutzt?

**Antwort:** Damit mehrere GCP-Projekte ein zentral von einem Host-Projekt verwaltetes Netzwerk gemeinsam nutzen können, statt jeweils eine eigene, redundante Netzwerktopologie zu betreiben.

### 4. Welcher häufige Fehler entsteht, wenn man mit einem AWS-Mental-Model an GCP-VPCs herangeht?

**Antwort:** Man nimmt fälschlich an, dass die VPC regional isoliert ist, und übersieht, dass Ressourcen in verschiedenen Regionen derselben GCP-VPC standardmäßig ohne zusätzliches Peering direkt kommunizieren.

### 5. Wie gehst du vor, wenn Ressourcen in verschiedenen Regionen unerwartet direkt miteinander kommunizieren?

**Antwort:** Ich prüfe, ob beide Regionen zur selben globalen VPC gehören, da dies standardmäßig direkte Kommunikation ohne explizite Isolationsgrenze ermöglicht, und richte bei Bedarf eine bewusste Trennung ein.

### 6. Widersprüchliche Anforderung: Team will maximale Netzwerkeinfachheit durch eine einzige globale VPC UND strikte Isolation zwischen verschiedenen Umgebungen (Dev/Prod) — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, für Dev und Prod bewusst getrennte VPCs (oder getrennte Shared-VPC-Service-Projekte mit restriktiven Firewallregeln) einzurichten, statt eine einzige globale VPC für alle Umgebungen zu nutzen, da die globale Reichweite einer VPC strikte Isolation zwischen Umgebungen sonst untergräbt.

## Praktische Labs

~~~python
# Conceptual cross-region same-VPC reachability check (not executed against a real GCP account):

def check_reachability(vpc_map, resource_a_vpc, resource_a_region, resource_b_vpc, resource_b_region):
    if resource_a_vpc == resource_b_vpc:
        return f"reachable by default (same global VPC '{resource_a_vpc}', regions {resource_a_region}/{resource_b_region} need no peering)"
    return "not reachable without explicit VPC peering or Shared VPC setup"

print(check_reachability({}, "vpc-prod", "us-central1", "vpc-prod", "europe-west1"))
print(check_reachability({}, "vpc-dev", "us-central1", "vpc-prod", "europe-west1"))
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [VPC Network Overview](https://cloud.google.com/vpc/docs/vpc), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [Shared VPC Overview](https://cloud.google.com/vpc/docs/shared-vpc), abgerufen 2026-09-18.

Cloud-Netzwerkmodelle sind kanonisch in [KB-0443](../18-cloud-foundations/03-cloud-netzwerkmodelle.md) behandelt; Amazon VPC und Endpunkte in [KB-0465](../19-aws/03-amazon-vpc-und-endpunkte.md); GCP-Organisation und IAM in [KB-0499](01-gcp-organisation-und-iam.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Network-Policy-Integration zwischen GCP-VPC-Firewallregeln und Kubernetes-nativen Netzwerkrichtlinien in GKE | Evaluating | Gegenüber getrennter Verwaltung von VPC-Firewall und Kubernetes-Netzwerkrichtlinien erst nach Prüfung der tatsächlichen Integrationsreife bevorzugen. |

Ein Team akzeptiert eine GCP-VPC-Konfiguration erst, wenn Isolationsgrenzen zwischen Regionen und Projekten nachweislich bewusst gestaltet sind, statt sich implizit auf ein aus anderen Cloud-Anbietern übernommenes Mental Model zu verlassen.
