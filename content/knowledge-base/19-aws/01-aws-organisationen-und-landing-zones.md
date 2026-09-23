---
{"id": "KB-0463", "title": "AWS-Organisationen und Landing Zones", "domain": "19", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0450", "concepts": ["Landing Zones"], "needed_for": "understanding"}, {"id": "KB-0444", "concepts": ["Cloud-IAM-Grundarchitektur"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine AWS-Organisationsstruktur mit mehreren Accounts und einer Service Control Policy (SCP) anhand offizieller Dokumentation konzeptionell strukturieren können und erklären, wie SCPs die maximal mögliche Berechtigung innerhalb eines Accounts begrenzen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Enterprise-Landing-Zone-Architektur mit getrennten Sicherheits- und Workload-Accounts gestalten, die AWS Organizations und Control Tower zur konsistenten Durchsetzung von Governance-Richtlinien nutzt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete, dennoch erfolgreiche Berechtigungsausweitung auf eine fehlende oder unzureichend restriktive SCP zurückführen können, obwohl die IAM-Policies innerhalb des Accounts korrekt konfiguriert waren.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "AWS-Organisationsrichtlinien im Unternehmen anhand klarer Konten-Trennungsprinzipien (Sicherheit versus Workload) statt anhand einer gewachsenen, undifferenzierten Kontenlandschaft festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Control-Tower-Guardrail-Mechanismus im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Accounts, Organizations, Control Tower und SCPs als Entscheidungsgrundlage für Landing-Zone-Architektur, nicht die Control-Tower-Interna."}}, "lab_validation": [{"lab_id": "KB-0463-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller AWS-Dokumentation zu Organizations und Control Tower, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie AWS Organizations mehrere Accounts in einer Hierarchie verwaltet, wie Service Control Policies (SCPs) die maximal mögliche Berechtigung innerhalb eines Accounts begrenzen (unabhängig von innerhalb des Accounts gewährten IAM-Policies), und wie AWS Control Tower diese Bausteine zu einer vorkonfigurierten Landing Zone mit getrennten Sicherheits- und Workload-Accounts zusammenfasst.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale Organisationsstruktur erstellt."}]}
---
# AWS-Organisationen und Landing Zones

> **Ziel:** AWS Organizations verwaltet mehrere AWS-Accounts in einer hierarchischen Struktur (siehe Landing Zones, [KB-0450](../18-cloud-foundations/10-landing-zones.md)) und ermöglicht die Durchsetzung von Service Control Policies (SCPs) — Richtlinien, die die maximal mögliche Berechtigung innerhalb eines Accounts begrenzen, unabhängig davon, welche IAM-Policies (siehe Cloud-IAM-Grundarchitektur, [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md)) innerhalb dieses Accounts selbst gewährt werden. AWS Control Tower baut auf Organizations auf und stellt eine vorkonfigurierte, mit Best-Practice-Guardrails ausgestattete Landing Zone bereit, die typischerweise getrennte Sicherheits-Accounts (für zentrale Protokollierung, Audit-Zugriff) und Workload-Accounts (für tatsächliche Anwendungen) vorsieht. Der zentrale Punkt dieses Kapitels ist, dass SCPs eine fundamental andere Wirkungsebene haben als IAM-Policies — eine SCP setzt eine harte Obergrenze, die selbst durch eine großzügige IAM-Policy innerhalb des Accounts nicht überschritten werden kann, weshalb eine unerwartete Berechtigungsausweitung, die trotz korrekt restriktiver IAM-Policies auftritt, häufig auf eine fehlende oder unzureichend konfigurierte SCP zurückzuführen ist, nicht auf einen Fehler in den IAM-Policies selbst.

## Zweck, Mental Model und Dependencies

Innerhalb eines einzelnen AWS-Accounts bestimmt IAM (Identity and Access Management), welche konkreten Identitäten welche konkreten Aktionen auf welchen Ressourcen ausführen dürfen — dies ist die "normale" Berechtigungsebene, mit der die meisten alltäglichen Zugriffsentscheidungen getroffen werden. Eine Service Control Policy wirkt auf einer übergeordneten Ebene innerhalb von AWS Organizations und definiert die absolute Obergrenze dessen, was innerhalb eines Accounts (oder einer Gruppe von Accounts, einer sogenannten Organizational Unit) überhaupt jemals erlaubt sein kann — selbst ein Account-Administrator mit vollständigen IAM-Rechten kann keine Aktion ausführen, die eine übergeordnete SCP explizit verbietet, unabhängig davon, wie die IAM-Policies innerhalb des Accounts konfiguriert sind. Dies macht SCPs zu einem besonders wirksamen Governance-Werkzeug für Enterprise-Umgebungen: Eine zentrale Governance-Funktion kann über SCPs sicherstellen, dass bestimmte, als riskant eingestufte Aktionen (z. B. das Deaktivieren zentraler Protokollierung, das Verlassen der Organisation) in keinem untergeordneten Account jemals möglich sind, unabhängig davon, welche IAM-Berechtigungen einzelne Teams innerhalb ihrer Accounts selbst verwalten. AWS Control Tower automatisiert die Einrichtung einer solchen Struktur, indem es eine Landing Zone mit vordefinierten Guardrails (vorkonfigurierte SCPs und weitere Kontrollen) sowie einer empfohlenen Kontenstruktur bereitstellt — typischerweise mit einem dedizierten Log-Archive-Account (zentrale, unveränderliche Speicherung von Protokollen über alle Accounts hinweg) und einem Audit-Account (zentraler, eingeschränkter Zugriff für Sicherheits- und Compliance-Prüfungen), getrennt von den eigentlichen Workload-Accounts, in denen Anwendungsteams operieren. Der zentrale methodische Punkt ist, dass eine unerwartete, tatsächlich erfolgte Berechtigungsausweitung innerhalb eines Accounts, die trotz sorgfältig konfigurierter, restriktiver IAM-Policies auftritt, häufig nicht auf einen Fehler in den IAM-Policies selbst zurückzuführen ist, sondern auf eine fehlende oder unzureichend restriktive SCP, die diese Ausweitung auf der übergeordneten Ebene nicht verhindert hat.

~~~text
Within ONE account: IAM decides WHICH identity can do WHAT on WHICH resource ("normal" permission layer)
Service Control Policy (SCP): acts at a HIGHER level within AWS Organizations
  defines the ABSOLUTE CEILING of what's EVER possible within an account (or OU)
  -> even a FULL IAM admin CANNOT exceed what an SCP explicitly forbids
  -> central governance ensures certain risky actions (disable logging, leave org)
     are NEVER possible in ANY sub-account, regardless of team-managed IAM permissions
AWS Control Tower: automates this setup
  pre-configured guardrails (SCPs + more) + recommended account structure
  typically: dedicated Log Archive account (central, immutable cross-account logging)
             + Audit account (restricted security/compliance access)
             SEPARATE from actual workload accounts
KEY METHODOLOGICAL POINT: unexpected permission escalation DESPITE correctly restrictive IAM
  -> often NOT an IAM policy bug, but a MISSING or insufficiently restrictive SCP
     that failed to cap it at the higher, organization-wide level
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| AWS Organizations | verwaltet mehrere Accounts hierarchisch | Grundlage für zentrale Governance über Account-Grenzen hinweg |
| Service Control Policy (SCP) | setzt absolute Obergrenze für Berechtigungen im Account | wirkt unabhängig von und zusätzlich zu IAM-Policies innerhalb des Accounts |
| Control Tower | automatisiert Landing-Zone-Einrichtung mit Guardrails | vordefinierte SCPs und Kontenstruktur, nicht manuell nachgebaut werden müssen |
| Getrennte Sicherheits-/Workload-Accounts | isolieren zentrale Protokollierung/Audit von Anwendungsbetrieb | verhindert, dass ein kompromittierter Workload-Account Zugriff auf zentrale Protokolle erlangt |

Implementierung: Vor der Einrichtung einer AWS-Organisationsstruktur wird geklärt, welche Aktionen unternehmensweit in keinem Account jemals erlaubt sein sollen, um entsprechende SCPs auf der Organisationsebene zu definieren, statt sich ausschließlich auf accountspezifische IAM-Policies zu verlassen. Ein dedizierter Log-Archive-Account und ein Audit-Account werden getrennt von den Workload-Accounts eingerichtet, um zentrale Protokollierung und Audit-Zugriff vor einer Kompromittierung einzelner Workload-Accounts zu isolieren. Bei einer unerwarteten Berechtigungsausweitung wird zunächst geprüft, ob eine übergeordnete SCP diese Aktion hätte verhindern sollen, bevor ausschließlich die accountspezifischen IAM-Policies untersucht werden.

## Scalability, Reliability, Security und Observability

AWS-Organisationsstrukturen skalieren die Governance-Konsistenz proportional zur Vollständigkeit der auf Organisationsebene definierten SCPs; die Reliability-Grenze liegt darin, dass eine fehlende oder unzureichend restriktive SCP proportional zur Anzahl der Accounts, die diese SCP betreffen sollte, zu einer unternehmensweiten, nicht auf einzelne Accounts begrenzten Governance-Lücke führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine als riskant eingestufte Aktion wurde trotz restriktiver IAM-Policies innerhalb eines Accounts erfolgreich ausgeführt | eine übergeordnete SCP, die diese Aktion hätte verhindern sollen, fehlt oder ist unzureichend restriktiv konfiguriert | die relevanten SCPs auf Organisationsebene für den betroffenen Account oder die Organizational Unit prüfen |
| zentrale Protokolle sind nach der Kompromittierung eines Workload-Accounts betroffen oder manipuliert | die Protokollierung ist nicht ausreichend vom Workload-Account isoliert, z. B. ohne dedizierten Log-Archive-Account | eine strikte Trennung zwischen Log-Archive-, Audit- und Workload-Accounts herstellen |
| ein neu erstellter Account weicht von der etablierten Governance-Struktur ab | der Account wurde außerhalb des Control-Tower-Prozesses erstellt, ohne die vordefinierten Guardrails zu erben | den Account-Erstellungsprozess auf konsistente Nutzung von Control Tower prüfen |

Security: Die SCP-Konfiguration selbst sollte mit besonders restriktivem Zugriff versehen werden, da eine Kompromittierung der Organisationsebene potenziell alle untergeordneten Accounts betrifft. Observability: Die Vollständigkeit der SCP-Abdeckung für kritische, unternehmensweit zu verbietende Aktionen, die tatsächliche Isolation zwischen Sicherheits- und Workload-Accounts, und die Konsistenz der Account-Erstellung über Control Tower sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** prüft bei unerwarteten Berechtigungsausweitungen zunächst die übergeordnete SCP-Ebene, nicht nur die accountspezifischen IAM-Policies. **Principal** macht die Trennung zwischen SCP- und IAM-Ebene für das Team nachvollziehbar. **Chief** legt AWS-Organisationsrichtlinien im Unternehmen anhand klarer Konten-Trennungsprinzipien fest.

Anti-Patterns: sich ausschließlich auf accountspezifische IAM-Policies verlassen, ohne unternehmensweite SCPs für kritische, niemals erlaubte Aktionen zu definieren; zentrale Protokollierung und Audit-Zugriff im selben Account wie Workloads verwalten; neue Accounts außerhalb des etablierten Control-Tower-Prozesses erstellen und dadurch Governance-Guardrails umgehen.

## Production Checklist

- [ ] SCPs auf Organisationsebene definieren die absolute Obergrenze für unternehmensweit verbotene Aktionen.
- [ ] Zentrale Protokollierung und Audit-Zugriff sind in dedizierten, von Workload-Accounts getrennten Accounts isoliert.
- [ ] Neue Accounts werden konsistent über Control Tower erstellt und erben die etablierten Guardrails.
- [ ] Die SCP-Abdeckung wird regelmäßig gegen tatsächliche, unternehmensweite Governance-Anforderungen geprüft.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einer IAM-Policy und einer Service Control Policy?

**Antwort:** Eine IAM-Policy gewährt konkrete Berechtigungen innerhalb eines Accounts; eine SCP setzt eine übergeordnete, absolute Obergrenze dessen, was innerhalb eines Accounts überhaupt jemals möglich sein kann, unabhängig von den dort gewährten IAM-Policies.

### 2. Warum kann selbst ein vollständiger IAM-Administrator eine durch eine SCP verbotene Aktion nicht ausführen?

**Antwort:** Weil eine SCP auf einer höheren Organisationsebene wirkt und die absolute Obergrenze definiert, die von keiner innerhalb des Accounts gewährten IAM-Berechtigung überschritten werden kann.

### 3. Welche Kontenstruktur empfiehlt AWS Control Tower typischerweise?

**Antwort:** Eine Trennung zwischen einem dedizierten Log-Archive-Account, einem Audit-Account, und separaten Workload-Accounts für die eigentlichen Anwendungsteams.

### 4. Warum sollte zentrale Protokollierung in einem separaten Account vom Workload-Betrieb erfolgen?

**Antwort:** Um zu verhindern, dass eine Kompromittierung eines Workload-Accounts auch die zentral gesammelten Protokolle betrifft oder manipulierbar macht.

### 5. Wie gehst du vor, wenn eine als riskant eingestufte Aktion trotz restriktiver IAM-Policies erfolgreich ausgeführt wurde?

**Antwort:** Ich prüfe zunächst, ob eine übergeordnete SCP diese Aktion hätte verhindern sollen und ob sie fehlt oder unzureichend restriktiv konfiguriert ist, statt ausschließlich die accountspezifischen IAM-Policies zu untersuchen.

### 6. Widersprüchliche Anforderung: Teams wollen maximale Autonomie über ihre eigenen AWS-Accounts UND die Organisation will garantiert, dass bestimmte kritische Aktionen niemals möglich sind — wie gehst du vor?

**Antwort:** Ich würde SCPs auf Organisationsebene für die kritischen, niemals erlaubten Aktionen definieren, während innerhalb dieser Grenze den Teams volle Autonomie über ihre eigenen IAM-Konfigurationen belassen wird, sodass beide Anforderungen durch die unterschiedlichen Wirkungsebenen von SCP und IAM gleichzeitig erfüllt werden.

## Praktische Labs

~~~python
# Conceptual SCP vs IAM effective-permission check (not executed against a real AWS account):

def is_action_allowed(action, scp_denied_actions, iam_allowed_actions):
    if action in scp_denied_actions:
        return False  # SCP ceiling overrides ANY IAM grant
    return action in iam_allowed_actions

scp_denied_actions = {"organizations:LeaveOrganization", "cloudtrail:StopLogging"}
iam_allowed_actions = {"cloudtrail:StopLogging", "ec2:StartInstances"}  # IAM grants this, but SCP forbids it

print(f"cloudtrail:StopLogging allowed? {is_action_allowed('cloudtrail:StopLogging', scp_denied_actions, iam_allowed_actions)}")
print(f"ec2:StartInstances allowed? {is_action_allowed('ec2:StartInstances', scp_denied_actions, iam_allowed_actions)}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [AWS Organizations — Service Control Policies (SCPs)](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [AWS Control Tower — Landing Zone Overview](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html), abgerufen 2026-09-18.

Landing Zones sind kanonisch in [KB-0450](../18-cloud-foundations/10-landing-zones.md) behandelt; Cloud-IAM-Grundarchitektur in [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Guardrail-Empfehlungen innerhalb von Control Tower, die neue, branchenspezifische Compliance-Anforderungen automatisch als SCP-Vorschläge bereitstellen | Evaluating | Gegenüber manuell entwickelten SCPs erst nach Prüfung der tatsächlichen Passgenauigkeit für die eigenen Compliance-Anforderungen bevorzugen. |

Ein Team akzeptiert eine AWS-Organisationsstruktur erst, wenn kritische, unternehmensweit zu verbietende Aktionen durch SCPs auf Organisationsebene abgedeckt sind und Sicherheits-Accounts nachweislich von Workload-Accounts isoliert sind.
