---
{"id": "KB-0549", "title": "Workload Identity", "domain": "23", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0540", "concepts": ["OAuth2 und delegierter Zugriff"], "needed_for": "understanding"}, {"id": "KB-0548", "concepts": ["PAM und privilegierte Zugriffe"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Workload-Identity-Föderation anhand der bereits behandelten cloud-spezifischen Implementierungen (AWS IRSA, Azure Workload Identity, GKE Workload Identity) als gemeinsames, providerübergreifendes Muster einordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Workload-Architektur explizit entscheiden, wie Föderation statt statischer, geteilter Schlüssel für Maschinenzugriff gestaltet wird, und diese klar von Nutzerdelegation abgrenzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartetes Sicherheitsrisiko auf geteilte, statische Zugangsschlüssel für Workloads zurückführen können, wo eine kurzlebige, föderierte Workload Identity stattdessen genutzt werden sollte.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für konsequente Workload-Identity-Föderation statt statischer, geteilter Maschinen-Credentials über alle Plattformen hinweg festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die plattformspezifische Detailimplementierung (AWS IRSA, Azure Workload Identity, GKE Workload Identity) ist in den jeweiligen Domain-Kapiteln behandelt.", "rationale": "Kern dieses Kapitels ist das providerübergreifende, gemeinsame Muster der Workload-Identity-Föderation, nicht die plattformspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0549-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation des Risikounterschieds zwischen statischen, geteilten Schlüsseln und föderierten, kurzlebigen Workload-Identitäten, kein produktives Cloud-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein statischer, geteilter Zugangsschlüssel bei Kompromittierung dauerhaft gültig bleibt, bis er manuell rotiert wird, während eine föderierte, kurzlebige Workload-Identity-Credential nach ihrer kurzen Gültigkeitsdauer automatisch verfällt, und zeigt damit quantitativ den Sicherheitsgewinn der Föderation gegenüber statischen Schlüsseln.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Cloud-System mit tatsächlicher Föderationsinfrastruktur."}]}
---
# Workload Identity

> **Ziel:** Workload Identity ist das providerübergreifende, gemeinsame Muster hinter den bereits in dieser Wissensdatenbank behandelten, plattformspezifischen Implementierungen (AWS IRSA, siehe [KB-0470](../19-aws/08-amazon-eks.md); Azure Workload Identity, siehe [KB-0487](../20-azure/07-azure-kubernetes-service.md); GKE Workload Identity, siehe [KB-0503](../21-gcp-multicloud/05-google-kubernetes-engine.md)): Ein **Workload** (eine Anwendung, ein Dienst, ein Prozess — keine Person) erhält über **Föderation** kurzlebige, automatisch rotierte Credentials, statt einen statischen, langlebigen Zugangsschlüssel als Datei oder Secret gespeichert zu bekommen. Der zentrale Punkt dieses Kapitels ist die strukturelle Abgrenzung von Nutzerdelegation (siehe OAuth2/OIDC, [KB-0540](04-oauth2-und-delegierter-zugriff.md)/[KB-0541](../23-security-identity/05-openid-connect.md)): Während Nutzerdelegation eine menschliche Autorisierung im Namen eines spezifischen Nutzers abbildet, autorisiert Workload Identity eine Maschine im eigenen, technischen Namen, ohne dass ein menschlicher Nutzer im Prozess beteiligt ist — die Vermischung beider Konzepte, etwa die Nutzung eines statischen, für Maschinen bestimmten Schlüssels anstelle einer föderierten Workload Identity, stellt ein unnötiges, vermeidbares Sicherheitsrisiko dar, das über alle Cloud-Plattformen hinweg dieselbe strukturelle Ursache hat.

## Zweck, Mental Model und Dependencies

Statische, geteilte Zugangsschlüssel für Workloads (ein API-Schlüssel oder Zugangsschlüsselpaar, das als Datei oder Umgebungsvariable in einer Anwendung gespeichert wird) stellen ein strukturelles, dauerhaftes Risiko dar: Ein solcher Schlüssel bleibt gültig, bis er manuell rotiert oder widerrufen wird, unabhängig davon, ob er zwischenzeitlich kompromittiert wurde — ein Angreifer, der Zugriff auf diesen Schlüssel erlangt (etwa durch versehentliches Einchecken in ein Versionskontrollsystem, ein kompromittiertes Deployment-Artefakt, oder eine Schwachstelle in der Anwendung selbst), hat damit dauerhaften, unentdeckten Zugriff, bis die Kompromittierung bemerkt und der Schlüssel manuell widerrufen wird. Workload Identity löst dieses Problem durch Föderation: Statt eines statischen Schlüssels weist eine vertrauenswürdige Plattform (ein Kubernetes-Cluster, eine CI/CD-Pipeline, siehe die Sigstore-Föderation in [KB-0531](../22-devops-supply-chain/19-sigstore-und-cosign.md) als verwandtes Muster) die Identität eines Workloads über einen etablierten Föderationsmechanismus (typischerweise OpenID Connect) nach, woraufhin die Zielplattform (die Cloud-API, die der Workload nutzen möchte) kurzlebige, automatisch nach Ablauf ungültige Credentials ausstellt — ein kompromittiertes Credential ist dadurch nur für das kurze, automatisch begrenzte Gültigkeitsfenster gültig, nicht dauerhaft. Diese Struktur ist über alle Cloud-Plattformen hinweg strukturell identisch, auch wenn die konkrete technische Implementierung unterschiedlich benannt und konfiguriert wird: AWS IRSA verknüpft einen Kubernetes-Service-Account über OIDC-Föderation mit einer IAM-Rolle; Azure Workload Identity verknüpft einen Kubernetes-Service-Account mit einer Microsoft-Entra-Anwendungsidentität; GKE Workload Identity verknüpft einen Kubernetes-Service-Account mit einem GCP-IAM-Service-Account — in allen drei Fällen ist die grundlegende Logik identisch: Eine vertrauenswürdige Plattform bestätigt kryptographisch, welcher spezifische Workload eine Anfrage stellt, und die Zielplattform stellt darauf basierend kurzlebige Credentials aus, statt einen dauerhaften, statischen Schlüssel zu benötigen. Die klare Trennung von Nutzerdelegation ist konzeptionell wichtig: Workload Identity autorisiert eine Maschine im eigenen technischen Namen für ihre eigene, definierte Funktion, während Nutzerdelegation (OAuth2 mit menschlicher Autorisierung) eine Aktion im Namen eines spezifischen, zustimmenden Nutzers autorisiert — beide Konzepte lösen unterschiedliche Delegationsprobleme und sollten nicht vermischt werden, etwa indem eine Maschine fälschlich persönliche Nutzer-Credentials statt einer dedizierten Workload Identity nutzt.

~~~text
Workload Identity: CROSS-PROVIDER PATTERN behind AWS IRSA (KB-0470), Azure Workload Identity (KB-0487),
                    GKE Workload Identity (KB-0503)
Workload (app/service/process, NOT a person) -> FEDERATION -> short-lived, auto-rotated credentials
  vs STATIC, shared key stored as file/env var:
    stays valid until MANUALLY rotated/revoked, REGARDLESS of compromise -> attacker gets PERSISTENT access
SAME structure across ALL providers, different naming:
  AWS IRSA: K8s Service Account <-federated via OIDC-> IAM Role
  Azure Workload Identity: K8s Service Account <-> Entra app identity
  GKE Workload Identity: K8s Service Account <-> GCP IAM Service Account
  -> trusted platform CRYPTOGRAPHICALLY confirms WHICH workload is requesting
     -> target platform issues SHORT-LIVED creds based on that -- no static key needed
CLEAR SEPARATION from user delegation (OAuth2 human auth, KB-0540/KB-0541):
  Workload Identity: machine authorized in ITS OWN technical name, for ITS OWN defined function
  User delegation: action authorized ON BEHALF OF a specific, consenting user
  -> mixing both (e.g. machine using personal user creds instead of dedicated workload identity)
     = unnecessary, avoidable risk, SAME root cause across all platforms
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Föderation | kryptographischer Nachweis der Workload-Identität durch vertrauenswürdige Plattform | Grundlage für kurzlebige Credential-Ausstellung |
| Kurzlebige Credentials | automatisch nach Ablauf ungültig | begrenzt Kompromittierungsrisiko zeitlich |
| Providerübergreifendes Muster | strukturell identisch bei AWS/Azure/GCP, nur unterschiedlich benannt | ermöglicht Wiedererkennung des Konzepts über Plattformen hinweg |
| Abgrenzung zu Nutzerdelegation | Maschine im eigenen Namen versus Aktion im Namen eines Nutzers | Vermischung ist strukturelles Sicherheitsrisiko |

Implementierung: Für jeden Workload wird explizit geprüft, ob eine Föderationsbasierte Workload Identity statt eines statischen, geteilten Schlüssels genutzt werden kann, unabhängig von der konkreten Cloud-Plattform. Bestehende statische Schlüssel werden systematisch identifiziert und auf Föderation umgestellt, wo dies technisch möglich ist. Nutzerdelegation und Workload Identity werden strikt getrennt gehalten, ohne dass eine Maschine persönliche Nutzer-Credentials nutzt.

## Scalability, Reliability, Security und Observability

Workload Identity skaliert die tatsächliche Sicherheit proportional zum Anteil föderierter statt statischer Workload-Credentials; die Reliability-Grenze liegt darin, dass ein verbleibender, statischer Schlüssel proportional zu seiner Gültigkeitsdauer und Verbreitung das Risiko einer dauerhaften, unentdeckten Kompromittierung erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein kompromittierter Workload-Zugang bleibt über einen langen Zeitraum unentdeckt gültig | der Workload nutzt einen statischen, geteilten Schlüssel statt einer föderierten, kurzlebigen Workload Identity | prüfen, ob eine Umstellung auf Föderation für den betroffenen Workload technisch möglich ist |
| ein automatisierter Dienst nutzt unerwartet persönliche Nutzer-Credentials | Nutzerdelegation und Workload Identity wurden vermischt, statt eine dedizierte Workload Identity einzurichten | eine dedizierte, föderierte Workload Identity für den automatisierten Dienst einrichten |
| ein Team versteht die plattformspezifische Workload-Identity-Implementierung nicht als Teil eines gemeinsamen Musters | fehlende explizite Vermittlung des providerübergreifenden Konzepts hinter den plattformspezifischen Implementierungen | das gemeinsame Föderationsmuster explizit vermitteln, unabhängig von der jeweiligen Plattform-Terminologie |

Security: Statische, geteilte Schlüssel für Workloads sollten systematisch identifiziert und, wo technisch möglich, durch föderierte Workload Identity ersetzt werden. Observability: Der tatsächliche Anteil föderierter versus statischer Workload-Credentials, sowie die durchschnittliche Gültigkeitsdauer verbleibender statischer Schlüssel, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert eine föderierte Workload Identity für einen gegebenen Workload auf einer spezifischen Plattform korrekt. **Principal** entwirft die Migrationsstrategie von statischen Schlüsseln zu föderierter Workload Identity für eine vollständige Architektur. **Chief** legt unternehmensweite Standards für konsequente Workload-Identity-Föderation über alle Plattformen hinweg fest.

Anti-Patterns: statische, geteilte Zugangsschlüssel für Workloads nutzen, wo Föderation technisch möglich wäre; persönliche Nutzer-Credentials für automatisierte Dienste statt dedizierter Workload Identity nutzen; die plattformspezifischen Workload-Identity-Implementierungen isoliert statt als gemeinsames Muster verstehen.

## Production Checklist

- [ ] Workloads nutzen konsequent föderierte, kurzlebige Credentials statt statischer, geteilter Schlüssel.
- [ ] Bestehende statische Schlüssel sind systematisch identifiziert und auf Föderation migriert, wo technisch möglich.
- [ ] Nutzerdelegation und Workload Identity sind strikt getrennt, ohne Vermischung.
- [ ] Der Anteil föderierter versus statischer Workload-Credentials wird aktiv überwacht.

## Interviewfragen

### 1. Was ist der zentrale Sicherheitsvorteil von Workload Identity gegenüber statischen, geteilten Schlüsseln?

**Antwort:** Föderierte Credentials sind kurzlebig und verfallen automatisch, wodurch ein kompromittiertes Credential nur für ein kurzes Zeitfenster gültig bleibt, während ein statischer Schlüssel bei Kompromittierung dauerhaft gültig bleibt, bis er manuell widerrufen wird.

### 2. Wie ist das Workload-Identity-Muster über AWS, Azure und GCP hinweg strukturell vergleichbar?

**Antwort:** In allen drei Fällen bestätigt eine vertrauenswürdige Plattform kryptographisch die Identität eines Workloads über Föderation, woraufhin die Zielplattform darauf basierend kurzlebige Credentials ausstellt — die konkrete Implementierung (IRSA, Azure Workload Identity, GKE Workload Identity) unterscheidet sich nur in Benennung und Detailkonfiguration.

### 3. Warum sollte Workload Identity strikt von Nutzerdelegation getrennt bleiben?

**Antwort:** Weil beide unterschiedliche Delegationsprobleme lösen — Workload Identity autorisiert eine Maschine im eigenen technischen Namen, während Nutzerdelegation eine Aktion im Namen eines spezifischen, zustimmenden Nutzers autorisiert; eine Vermischung führt zu unklarer Verantwortlichkeit und unnötigem Risiko.

### 4. Was ist der Unterschied zwischen einem statischen Schlüssel und einer föderierten Workload Identity bezüglich Kompromittierungsrisiko?

**Antwort:** Ein statischer Schlüssel bleibt bei Kompromittierung dauerhaft gültig, bis er manuell widerrufen wird; eine föderierte Workload Identity verfällt automatisch nach ihrem kurzen Gültigkeitsfenster, wodurch das Kompromittierungsrisiko zeitlich begrenzt ist.

### 5. Wie gehst du vor, wenn ein kompromittierter Workload-Zugang über einen langen Zeitraum unentdeckt gültig bleibt?

**Antwort:** Ich prüfe, ob der Workload einen statischen, geteilten Schlüssel statt einer föderierten, kurzlebigen Workload Identity nutzt, da dies die häufigste strukturelle Ursache für lang anhaltende, unentdeckte Kompromittierung ist, und evaluiere eine Umstellung auf Föderation.

### 6. Widersprüchliche Anforderung: Ein Legacy-System kann technisch keine moderne Föderation unterstützen und benötigt weiterhin statische Zugangsschlüssel, UND das Unternehmen will garantiert minimales Kompromittierungsrisiko über alle Workloads hinweg — wie gehst du vor?

**Antwort:** Ich würde für das Legacy-System eine kompensierende Kontrolle einrichten, etwa besonders kurze, erzwungene Rotationsintervalle für den statischen Schlüssel, strikte Netzwerksegmentierung, und aktives Monitoring auf ungewöhnliche Nutzung, während gleichzeitig eine mittelfristige Migration oder Ablösung des Legacy-Systems zugunsten föderationsfähiger Alternativen priorisiert wird — minimales Risiko trotz technischer Einschränkung lässt sich durch kompensierende Kontrollen statt durch Ignorieren der Einschränkung erreichen.

## Praktische Labs

~~~python
# Local, deterministic simulation of compromise exposure window: static key vs federated workload identity (executed locally, no real cloud system):

def compromise_exposure_hours(is_federated, credential_lifetime_hours, time_to_manual_revocation_hours):
    if is_federated:
        return credential_lifetime_hours  # auto-expires
    return time_to_manual_revocation_hours  # stays valid until manually revoked

print(f"federated workload identity exposure: {compromise_exposure_hours(True, credential_lifetime_hours=1, time_to_manual_revocation_hours=720)} hours")
print(f"static key exposure: {compromise_exposure_hours(False, credential_lifetime_hours=1, time_to_manual_revocation_hours=720)} hours")
~~~

## Dependencies, Cross-References und Quellen

1. CNCF-Dokumentation: [SPIFFE/SPIRE — Workload Identity Standard](https://spiffe.io/docs/latest/spiffe-about/overview/), abgerufen 2026-09-18.
2. Kubernetes-Dokumentation: [Service Account Token Volume Projection](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection), abgerufen 2026-09-18.

OAuth2 und delegierter Zugriff sind kanonisch in [KB-0540](04-oauth2-und-delegierter-zugriff.md) behandelt; PAM und privilegierte Zugriffe in [KB-0548](12-pam-und-privilegierte-zugriffe.md); plattformspezifische Implementierungen in [KB-0470](../19-aws/08-amazon-eks.md) (AWS IRSA), [KB-0487](../20-azure/07-azure-kubernetes-service.md) (Azure Workload Identity), [KB-0503](../21-gcp-multicloud/05-google-kubernetes-engine.md) (GKE Workload Identity).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte, plattformunabhängige Workload-Identity-Standards (SPIFFE/SPIRE), die eine konsistente Identität über mehrere Cloud-Anbieter hinweg statt anbieterspezifischer Föderationsmechanismen ermöglichen | Evaluating | Gegenüber anbieterspezifischen Workload-Identity-Mechanismen erst nach Prüfung der tatsächlichen Interoperabilitätsanforderungen und des Integrationsaufwands für die konkrete Multi-Cloud-Architektur bevorzugen. |

Ein Team akzeptiert eine Workload-Identity-Implementierung erst, wenn nachweislich föderierte, kurzlebige Credentials statische, geteilte Schlüssel ersetzen und Workload Identity klar von Nutzerdelegation getrennt bleibt.
