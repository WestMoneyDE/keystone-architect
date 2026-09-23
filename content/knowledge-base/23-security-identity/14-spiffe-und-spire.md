---
{"id": "KB-0550", "title": "SPIFFE und SPIRE", "domain": "23", "sequence": 14, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0549", "concepts": ["Workload Identity"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "SPIFFE-Trust-Domains, SVIDs und Attestation-Mechanismen anhand offizieller Spezifikation korrekt für plattformunabhängige Workload-Identität einordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Multi-Plattform- oder Multi-Cloud-Architektur explizit entscheiden, ob eine plattformunabhängige SPIFFE/SPIRE-Identitätsschicht gegenüber anbieterspezifischen Workload-Identity-Mechanismen einen tatsächlichen Interoperabilitätsvorteil bietet.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine fehlgeschlagene Workload-Identitätsverifikation zwischen zwei unterschiedlichen Plattformen auf fehlende gemeinsame Trust-Domain-Konfiguration statt einen grundlegenden Protokollfehler zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für plattformunabhängige Workload-Identität in Multi-Cloud-/Multi-Plattform-Umgebungen anhand einer expliziten Kosten-Nutzen-Bewertung gegenüber anbieterspezifischen Mechanismen festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne SPIRE-Server-/Agent-Implementierungsmechanik im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Trust Domains, SVIDs und Attestation als Entscheidungsgrundlage, nicht die Server-/Agent-Interna."}}, "lab_validation": [{"lab_id": "KB-0550-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller SPIFFE-Spezifikation zu Trust Domains, SVIDs und Attestation, kein aktives SPIRE-System verwendet", "evidence": "Anhand offizieller SPIFFE-Spezifikation wird nachvollzogen, wie eine Trust Domain den Vertrauensbereich definiert, innerhalb dessen ausgestellte Identitäten als gültig anerkannt werden, wie ein SVID (SPIFFE Verifiable Identity Document) eine kryptographisch überprüfbare, kurzlebige Workload-Identität analog zu den plattformspezifischen Workload-Identity-Mechanismen (siehe KB-0549) darstellt, jedoch plattformunabhängig, und wie Attestation (Node- und Workload-Attestation) den Prozess beschreibt, durch den SPIRE die tatsächliche Identität eines Workloads verifiziert, bevor ein SVID ausgestellt wird.", "limitations": "Kein aktives SPIRE-System verwendet, keine reale Trust-Domain-Konfiguration erstellt."}]}
---
# SPIFFE und SPIRE

> **Ziel:** SPIFFE (Secure Production Identity Framework For Everyone) ist ein offener Standard für plattformunabhängige Workload-Identität, der das in [KB-0549](13-workload-identity.md) behandelte Föderationsmuster verallgemeinert — statt einer anbieterspezifischen Implementierung (AWS IRSA, Azure Workload Identity, GKE Workload Identity), die jeweils nur innerhalb ihrer eigenen Plattform funktioniert, definiert SPIFFE eine **Trust Domain** (den Vertrauensbereich, innerhalb dessen ausgestellte Identitäten als gültig anerkannt werden) und **SVIDs** (SPIFFE Verifiable Identity Documents — kryptographisch überprüfbare, kurzlebige Workload-Identitäten). SPIRE ist die konkrete, produktionsreife Referenzimplementierung dieses Standards, die über **Attestation** (die Verifikation, dass ein Workload tatsächlich der ist, für den er sich ausgibt, basierend auf Plattform-spezifischen Nachweisen wie Kubernetes-Pod-Metadaten oder Cloud-Instanz-Metadaten) SVIDs ausstellt. Der zentrale Punkt dieses Kapitels ist, dass eine fehlgeschlagene Workload-Identitätsverifikation zwischen zwei unterschiedlichen Plattformen (etwa ein Workload in einem AWS-EKS-Cluster, der sich gegenüber einem Dienst in einem GCP-GKE-Cluster identitätsbasiert authentifizieren möchte) typischerweise nicht auf einen grundlegenden SPIFFE-Protokollfehler zurückzuführen ist, sondern auf eine fehlende gemeinsame Trust-Domain-Konfiguration zwischen den beteiligten Plattformen — ohne eine explizit etablierte, gemeinsame oder föderierte Vertrauensbeziehung zwischen den Trust Domains beider Plattformen bleibt eine plattformübergreifende Identitätsverifikation technisch unmöglich, unabhängig davon, wie korrekt SPIFFE innerhalb jeder einzelnen Plattform konfiguriert ist.

## Zweck, Mental Model und Dependencies

SPIFFE adressiert eine Lücke, die durch die in [KB-0549](13-workload-identity.md) behandelten, anbieterspezifischen Workload-Identity-Mechanismen offenbleibt: Jede dieser Implementierungen funktioniert nur innerhalb ihrer eigenen Plattform (AWS IRSA nur für AWS-IAM-Ziele, Azure Workload Identity nur für Entra-ID-Ziele, GKE Workload Identity nur für GCP-IAM-Ziele) — für Architekturen, die tatsächlich Workload-Identität über Plattformgrenzen hinweg benötigen (etwa eine Multi-Cloud-Architektur, in der ein Workload in einer Cloud einen Dienst in einer anderen Cloud identitätsbasiert authentifizieren möchte, ohne auf einen statischen, geteilten Schlüssel zurückzugreifen), bietet keine der plattformspezifischen Implementierungen eine native Lösung. SPIFFE definiert dafür einen plattformunabhängigen Identitätsstandard: Eine Trust Domain repräsentiert eine administrative Vertrauensgrenze (typischerweise eine Organisation oder einen klar abgegrenzten Teilbereich), innerhalb derer ausgestellte SVIDs als vertrauenswürdig gelten — ein SVID ist strukturell vergleichbar mit den in [KB-0549](13-workload-identity.md) behandelten kurzlebigen, föderierten Credentials, jedoch in einem standardisierten, plattformunabhängigen Format, das theoretisch von jeder SPIFFE-konformen Zielplattform verifiziert werden kann, unabhängig davon, auf welcher zugrunde liegenden Cloud-Infrastruktur der Workload tatsächlich läuft. SPIRE, die Referenzimplementierung, übernimmt die praktische Ausstellung dieser SVIDs über Attestation: Ein SPIRE-Agent, der auf demselben Host wie der Workload läuft, sammelt plattformspezifische Nachweise (etwa Kubernetes-Pod-Metadaten, Cloud-Instanz-Metadaten, oder Prozessattribute) und übermittelt diese an den SPIRE-Server, der basierend auf vorab konfigurierten Registrierungsregeln entscheidet, welche Identität (welches SVID) dem attestierten Workload zugewiesen wird. Die kritische operative Voraussetzung für tatsächliche, funktionierende Plattformübergreifung ist eine explizit etablierte Vertrauensbeziehung zwischen den Trust Domains der beteiligten Plattformen (Föderation zwischen Trust Domains, analog zur bereits behandelten Cross-Cloud-Governance-Problematik, siehe [KB-0512](../21-gcp-multicloud/14-cross-cloud-governance.md)) — ohne diese explizite Föderation zwischen Trust Domains bleibt eine SVID, die in einer Trust Domain ausgestellt wurde, für eine andere, nicht föderierte Trust Domain schlicht nicht verifizierbar, unabhängig von der technischen Korrektheit der SPIFFE-Implementierung innerhalb jeder einzelnen Plattform.

~~~text
SPIFFE: open standard for PLATFORM-INDEPENDENT workload identity, generalizes pattern from KB-0549
  fills gap: AWS IRSA/Azure WI/GKE WI each work ONLY within their OWN platform
  Trust Domain: administrative trust boundary (org or clearly scoped subarea)
    -> SVIDs issued within it are considered trustworthy
  SVID (SPIFFE Verifiable Identity Document): short-lived, cryptographically verifiable workload identity
    -> structurally like federated creds from KB-0549, but STANDARDIZED, PLATFORM-INDEPENDENT format
SPIRE: reference implementation
  Agent (runs on same host as workload) collects platform-specific evidence (K8s pod metadata, cloud instance metadata, process attrs)
  -> sent to Server -> decides which SVID to issue based on pre-configured registration rules (ATTESTATION)
CRITICAL OPERATIONAL PREREQUISITE for cross-platform use: EXPLICIT trust relationship BETWEEN trust domains
  (federation between trust domains, parallel to Cross-Cloud-Governance, KB-0512)
  -> WITHOUT this: SVID issued in one trust domain simply NOT VERIFIABLE by a non-federated other trust domain
     REGARDLESS of technically-correct SPIFFE config within each individual platform
FAILED cross-platform identity verification -- usually != fundamental SPIFFE protocol error
  -> usually = MISSING trust-domain federation between the involved platforms
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Trust Domain | administrative Vertrauensgrenze für ausgestellte Identitäten | Grundlage jeder SVID-Vertrauensentscheidung |
| SVID | plattformunabhängiges, kurzlebiges Identitätsdokument | verallgemeinert das Workload-Identity-Muster aus KB-0549 |
| Attestation | Verifikation der tatsächlichen Workload-Identität vor SVID-Ausstellung | bestimmt, welche Identität einem Workload zugewiesen wird |
| Trust-Domain-Föderation | explizite Vertrauensbeziehung zwischen Trust Domains | notwendige Voraussetzung für plattformübergreifende Verifikation |

Implementierung: Für Multi-Plattform-Architekturen wird explizit geprüft, ob eine plattformunabhängige SPIFFE/SPIRE-Identitätsschicht gegenüber isolierten, anbieterspezifischen Workload-Identity-Mechanismen einen tatsächlichen Interoperabilitätsvorteil bietet, bevor die zusätzliche Komplexität eingeführt wird. Für tatsächliche plattformübergreifende Identitätsverifikation wird eine explizite Trust-Domain-Föderation zwischen allen beteiligten Plattformen eingerichtet. Attestation-Regeln werden präzise auf die tatsächlich vorhandenen, verifizierbaren Plattform-Nachweise abgestimmt.

## Scalability, Reliability, Security und Observability

SPIFFE/SPIRE skaliert die tatsächliche plattformübergreifende Interoperabilität proportional zur expliziten Trust-Domain-Föderation zwischen beteiligten Plattformen; die Reliability-Grenze liegt darin, dass eine fehlende Föderation zwischen Trust Domains unabhängig von der technischen SPIFFE-Korrektheit innerhalb jeder einzelnen Plattform eine plattformübergreifende Verifikation vollständig verhindert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Workload-Identitätsverifikation zwischen zwei Plattformen schlägt fehl, obwohl beide SPIFFE korrekt implementieren | keine explizite Föderation zwischen den Trust Domains der beiden Plattformen ist eingerichtet | die Trust-Domain-Föderationskonfiguration zwischen den beteiligten Plattformen prüfen und einrichten |
| ein Workload erhält ein unerwartetes oder falsches SVID | die Attestation-Registrierungsregeln entsprechen nicht der tatsächlichen, verifizierbaren Workload-Identität | die Attestation-Regeln gegen die tatsächlich vorhandenen Plattform-Nachweise prüfen und anpassen |
| die Einführung von SPIFFE/SPIRE erhöht die operative Komplexität ohne erkennbaren Nutzen | keine tatsächliche plattformübergreifende Anforderung rechtfertigt die zusätzliche Abstraktionsschicht gegenüber anbieterspezifischen Mechanismen | prüfen, ob isolierte, anbieterspezifische Workload-Identity-Mechanismen für den tatsächlichen Anwendungsfall ausreichen |

Security: SVIDs sollten mit möglichst kurzer Gültigkeitsdauer konfiguriert werden, konsistent mit dem allgemeinen Prinzip kurzlebiger Workload-Credentials (siehe [KB-0549](13-workload-identity.md)), und Trust-Domain-Föderation sollte auf tatsächlich benötigte, explizit dokumentierte Beziehungen beschränkt bleiben. Observability: Die tatsächliche Nutzung und der Erfolg von Attestation-Vorgängen, die Konsistenz der Trust-Domain-Föderationskonfiguration, und die durchschnittliche SVID-Gültigkeitsdauer sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert Attestation-Regeln für einen gegebenen Workload innerhalb einer Trust Domain korrekt. **Principal** entscheidet, ob SPIFFE/SPIRE für eine konkrete Multi-Plattform-Architektur einen tatsächlichen Interoperabilitätsvorteil bietet, und entwirft die Trust-Domain-Föderationsstrategie. **Chief** legt unternehmensweite Standards für plattformunabhängige Workload-Identität anhand expliziter Kosten-Nutzen-Bewertung fest.

Anti-Patterns: SPIFFE/SPIRE ohne tatsächliche plattformübergreifende Anforderung als zusätzliche, unnötige Komplexitätsschicht einführen; Trust-Domain-Föderation implizit annehmen, statt sie explizit einzurichten; Attestation-Regeln ohne Abstimmung auf tatsächlich vorhandene, verifizierbare Plattform-Nachweise konfigurieren.

## Production Checklist

- [ ] Die Einführung von SPIFFE/SPIRE ist explizit gegen einen tatsächlichen, plattformübergreifenden Interoperabilitätsbedarf begründet.
- [ ] Trust-Domain-Föderation ist explizit für alle tatsächlich benötigten plattformübergreifenden Beziehungen eingerichtet.
- [ ] Attestation-Regeln entsprechen den tatsächlich vorhandenen, verifizierbaren Plattform-Nachweisen.
- [ ] SVID-Gültigkeitsdauer ist möglichst kurz konfiguriert.

## Interviewfragen

### 1. Welches strukturelle Problem löst SPIFFE gegenüber anbieterspezifischen Workload-Identity-Mechanismen?

**Antwort:** SPIFFE bietet plattformunabhängige Workload-Identität, während anbieterspezifische Mechanismen wie AWS IRSA, Azure Workload Identity oder GKE Workload Identity jeweils nur innerhalb ihrer eigenen Plattform funktionieren.

### 2. Was ist eine Trust Domain im SPIFFE-Kontext?

**Antwort:** Eine administrative Vertrauensgrenze, innerhalb derer ausgestellte SVIDs als vertrauenswürdig gelten.

### 3. Was ist die Voraussetzung dafür, dass eine SVID über Plattformgrenzen hinweg verifiziert werden kann?

**Antwort:** Eine explizit etablierte Föderationsbeziehung zwischen den Trust Domains der beteiligten Plattformen — ohne diese ist eine plattformübergreifende Verifikation technisch nicht möglich.

### 4. Welche Rolle spielt Attestation in SPIRE?

**Antwort:** Sie ist der Prozess, durch den SPIRE die tatsächliche Identität eines Workloads anhand plattformspezifischer Nachweise verifiziert, bevor ein SVID ausgestellt wird.

### 5. Wie gehst du vor, wenn eine Workload-Identitätsverifikation zwischen zwei Plattformen fehlschlägt, obwohl beide SPIFFE korrekt implementieren?

**Antwort:** Ich prüfe zuerst, ob eine explizite Föderation zwischen den Trust Domains beider Plattformen eingerichtet ist, da dies die häufigste Ursache für eine fehlgeschlagene plattformübergreifende Verifikation ist, nicht ein grundlegender Protokollfehler.

### 6. Widersprüchliche Anforderung: Team will maximale Interoperabilität für Workload-Identität über alle zukünftig möglichen Cloud-Plattformen hinweg UND minimale zusätzliche operative Komplexität gegenüber den bereits etablierten, anbieterspezifischen Mechanismen — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, SPIFFE/SPIRE gezielt nur für tatsächlich bestehende, konkrete plattformübergreifende Anforderungen einzuführen, statt es präventiv für hypothetische zukünftige Interoperabilität zu etablieren, und für Workloads ohne tatsächlichen plattformübergreifenden Bedarf weiterhin die etablierten, einfacheren, anbieterspezifischen Mechanismen zu nutzen — Interoperabilität und minimale Komplexität lassen sich durch bedarfsgerechte, statt pauschale Einführung vereinbaren.

## Praktische Labs

~~~python
# Conceptual trust-domain federation check for cross-platform SVID verification (not executed against a real SPIRE deployment):

def verify_cross_platform(svid_trust_domain, verifier_trust_domain, federated_domains):
    if svid_trust_domain == verifier_trust_domain:
        return "verified: same trust domain"
    if svid_trust_domain in federated_domains.get(verifier_trust_domain, []):
        return "verified: federated trust domain"
    return "REJECTED: no trust relationship between trust domains"

federated_domains = {"cluster-b.example.org": ["cluster-a.example.org"]}

print(verify_cross_platform("cluster-a.example.org", "cluster-b.example.org", federated_domains))
print(verify_cross_platform("cluster-c.example.org", "cluster-b.example.org", federated_domains))
~~~

## Dependencies, Cross-References und Quellen

1. SPIFFE-Dokumentation: [SPIFFE Concepts](https://spiffe.io/docs/latest/spiffe-about/spiffe-concepts/), abgerufen 2026-09-18.
2. SPIRE-Dokumentation: [SPIRE Concepts — Attestation](https://spiffe.io/docs/latest/spire-about/spire-concepts/), abgerufen 2026-09-18.

Workload Identity ist kanonisch in [KB-0549](13-workload-identity.md) behandelt; Cross-Cloud-Governance in [KB-0512](../21-gcp-multicloud/14-cross-cloud-governance.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende native Integration von SPIFFE/SPIRE-Identitäten in Service-Mesh-Implementierungen für automatische, identitätsbasierte mTLS-Verschlüsselung zwischen Diensten | Evaluating | Gegenüber manuell konfigurierter Dienst-zu-Dienst-Verschlüsselung erst nach Prüfung der tatsächlichen Integrationsreife für die konkrete Service-Mesh-Toolchain bevorzugen. |

Ein Team akzeptiert eine SPIFFE/SPIRE-Implementierung erst, wenn ein tatsächlicher, plattformübergreifender Interoperabilitätsbedarf nachweislich besteht und Trust-Domain-Föderation explizit für alle benötigten Beziehungen eingerichtet ist.
