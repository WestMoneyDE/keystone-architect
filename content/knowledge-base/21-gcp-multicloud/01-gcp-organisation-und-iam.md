---
{"id": "KB-0499", "title": "GCP-Organisation und IAM", "domain": "21", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0444", "concepts": ["Cloud-IAM-Grundarchitektur"], "needed_for": "understanding"}, {"id": "KB-0464", "concepts": ["AWS IAM und Rollenmodell"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Organisation, Folder und Projekte in GCP anhand offizieller Dokumentation strukturieren und Service Accounts von menschlichen Identitäten klar abgrenzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Unternehmensarchitektur explizit entscheiden, wie die Organisation-Folder-Projekt-Hierarchie gestaltet wird und wie IAM-Policy-Vererbung über diese Hierarchie hinweg funktioniert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet weitreichende Berechtigung auf eine unbeabsichtigte Policy-Vererbung von einer übergeordneten Organisation- oder Folder-Ebene zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "IAM-Governance-Richtlinien im Unternehmen anhand klarer Trennung menschlicher und maschineller Identitäten sowie bewusster Policy-Vererbungsgestaltung über die GCP-Ressourcenhierarchie festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der IAM-Policy-Evaluierungs-Engine im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Organisation-Folder-Projekt-Struktur und der Vererbungslogik als Entscheidungsgrundlage, nicht die Evaluierungs-Interna."}}, "lab_validation": [{"lab_id": "KB-0499-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Google-Cloud-Dokumentation zu Organisation, Folder, Projekten und IAM, kein aktives GCP-Konto verwendet", "evidence": "Anhand offizieller Google-Cloud-Dokumentation wird nachvollzogen, wie die Ressourcenhierarchie (Organisation, Folder, Projekt) IAM-Policies über Vererbung von oberen zu unteren Ebenen weitergibt, wie Service Accounts als maschinelle Identitäten strukturell von menschlichen Nutzerkonten getrennt sind, und wie Rollen (primitive, vordefinierte, benutzerdefinierte) unterschiedliche Granularität der Berechtigungsvergabe ermöglichen.", "limitations": "Kein aktives GCP-Konto verwendet, keine reale Organisationsstruktur konfiguriert."}]}
---
# GCP-Organisation und IAM

> **Ziel:** GCP strukturiert Ressourcen in einer dreistufigen Hierarchie — **Organisation** (die oberste Ebene, typischerweise an eine Unternehmensdomäne gebunden), **Folder** (optionale Zwischenebenen zur Gruppierung von Projekten nach Team, Umgebung oder Geschäftsbereich) und **Projekt** (die grundlegende Einheit, der tatsächliche Ressourcen wie Compute-Instanzen oder Datenbanken zugeordnet werden). IAM-Policies werden auf jeder dieser Ebenen vergeben und **vererben sich von oben nach unten** — eine auf Organisationsebene vergebene Rolle gilt automatisch für alle darunterliegenden Folder und Projekte, sofern nicht explizit anders eingeschränkt. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartet weitreichende Berechtigung in einem einzelnen Projekt häufig nicht auf eine falsch konfigurierte Projekt-IAM-Policy zurückzuführen ist, sondern auf eine unbeabsichtigte Vererbung von einer übergeordneten Organisation- oder Folder-Ebene, die bei der Fehlersuche leicht übersehen wird, wenn nur die Projekt-Ebene isoliert betrachtet wird.

## Zweck, Mental Model und Dependencies

Die Organisation-Folder-Projekt-Hierarchie adressiert das strukturelle Problem, dass Unternehmen mit vielen GCP-Projekten sonst jede IAM-Policy redundant auf Projektebene konfigurieren müssten, was zu inkonsistenten Berechtigungen zwischen Projekten führt. Durch die Vererbung kann eine auf Organisationsebene vergebene Rolle (z. B. eine Sicherheitsrichtlinie, die für das gesamte Unternehmen gilt) zentral einmal definiert werden, statt in jedem einzelnen Projekt wiederholt zu werden, was strukturell parallel zur AWS-Organizations-SCP-Logik ist (siehe [KB-0464](../19-aws/02-aws-iam-und-rollenmodell.md)), jedoch mit dem wichtigen Unterschied, dass GCP-IAM-Rollen direkt Berechtigungen gewähren, während AWS SCPs nur die maximal mögliche Berechtigung begrenzen, ohne selbst Berechtigungen zu gewähren — eine geerbte GCP-IAM-Rolle auf Organisationsebene gewährt also tatsächlich Zugriff in allen darunterliegenden Projekten, nicht nur eine obere Schranke. Service Accounts sind maschinelle Identitäten, die strukturell von menschlichen Nutzerkonten getrennt sind — sie werden von Anwendungen und Diensten genutzt, um mit GCP-APIs zu interagieren, und sollten mit minimalen, für ihren spezifischen Zweck notwendigen Berechtigungen ausgestattet werden, statt breite, für menschliche Administratoren gedachte Rollen zu übernehmen. Rollen existieren in drei Granularitätsstufen: primitive Rollen (Owner/Editor/Viewer, sehr breit und für Produktionsumgebungen meist ungeeignet), vordefinierte Rollen (dienstspezifisch, granularer) und benutzerdefinierte Rollen (exakt auf den tatsächlichen Bedarf zugeschnitten), wobei die Wahl der Granularität einen direkten Trade-off zwischen Verwaltungsaufwand und Prinzip der geringsten Berechtigung darstellt.

~~~text
GCP Resource Hierarchy: Organization (top, org domain) -> Folder (optional, team/env/business unit grouping)
                                                        -> Project (base unit, actual resources live here)
IAM Policy: vergeben on ANY level -> INHERITS top-down automatically to lower levels
  (unless explicitly restricted)
KEY DIFFERENCE from AWS SCPs (see KB-0464):
  GCP IAM role at org level -> DIRECTLY GRANTS access in all lower projects
  AWS SCP -> only BOUNDS max possible permission, does NOT itself grant access
  -> inherited GCP role = ACTUAL access, not just an upper bound
Service Accounts: MACHINE identities, structurally separate from human user accounts
  -> used by apps/services to call GCP APIs -> minimal, purpose-specific permissions (not broad admin roles)
Role granularity: primitive (Owner/Editor/Viewer, too broad for prod)
                 < predefined (service-specific, more granular)
                 < custom (exact fit to actual need)
  -> trade-off: management overhead vs. least-privilege precision
COMMON PITFALL: unexpectedly broad permission in a project
  -> often NOT a misconfigured project-level policy
  -> often UNINTENDED INHERITANCE from org/folder level, easily missed if only project level is checked
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Organisation/Folder/Projekt | dreistufige Ressourcenhierarchie | bestimmt Vererbungsreichweite von IAM-Policies |
| IAM-Policy-Vererbung | Rollen vererben sich top-down und gewähren direkt Zugriff | Unterschied zu AWS SCPs (nur Schranke, kein direkter Zugriff) |
| Service Accounts | maschinelle Identitäten, getrennt von menschlichen Nutzern | sollten minimale, zweckgebundene Berechtigungen haben |
| Rollengranularität | primitiv/vordefiniert/benutzerdefiniert | Trade-off zwischen Verwaltungsaufwand und Least Privilege |

Implementierung: Für jede IAM-Policy-Zuweisung wird explizit geprüft, auf welcher Hierarchieebene sie vergeben wird und welche darunterliegenden Projekte davon betroffen sind, statt Berechtigungen isoliert auf Projektebene zu betrachten. Service Accounts werden mit benutzerdefinierten oder minimal notwendigen vordefinierten Rollen ausgestattet, nicht mit primitiven Owner/Editor-Rollen. Die Folder-Struktur wird anhand tatsächlicher organisatorischer Grenzen (Team, Umgebung, Geschäftsbereich) gestaltet, um Policy-Vererbung sinnvoll zu bündeln.

## Scalability, Reliability, Security und Observability

Die GCP-IAM-Struktur skaliert die Governance-Konsistenz proportional zur bewussten Nutzung der Vererbungshierarchie; die Reliability-Grenze liegt darin, dass eine unbeabsichtigte, nicht nachvollzogene Vererbung proportional zur Tiefe der Hierarchie zu unerwartet weitreichenden Berechtigungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Projekt hat unerwartet weitreichende Berechtigungen | eine Rolle wird von der Organisation- oder Folder-Ebene vererbt, nicht direkt im Projekt vergeben | die effektiven IAM-Policies über alle Hierarchieebenen hinweg prüfen, nicht nur die Projekt-Ebene |
| ein Service Account hat mehr Zugriff als für seinen Zweck nötig | dem Service Account wurde eine primitive oder zu breite vordefinierte Rolle zugewiesen | prüfen, ob eine benutzerdefinierte, minimal notwendige Rolle stattdessen genutzt werden kann |
| Policy-Änderungen auf Organisationsebene haben unerwartete Auswirkungen auf einzelne Teams | die Folder-Struktur bündelt Projekte nicht entlang tatsächlicher organisatorischer Grenzen | die Folder-Struktur gegen die tatsächliche Team-/Umgebungsorganisation prüfen |

Security: Menschliche und maschinelle Identitäten sollten strukturell getrennt verwaltet werden, wobei Service Accounts ausschließlich minimale, zweckgebundene Berechtigungen erhalten. Observability: Die tatsächliche Verteilung effektiver (inklusive vererbter) Berechtigungen pro Projekt, sowie die Häufigkeit der Nutzung primitiver Rollen, sind zentrale Metriken zur Bewertung der IAM-Governance.

## Trade-offs und Entscheidungen

**Staff** konfiguriert IAM-Policies auf Projektebene korrekt unter Berücksichtigung möglicher Vererbung. **Principal** entwirft die Organisation-Folder-Projekt-Hierarchie so, dass Policy-Vererbung sinnvoll und nachvollziehbar bleibt. **Chief** legt unternehmensweite IAM-Governance-Richtlinien mit klarer Trennung menschlicher und maschineller Identitäten fest.

Anti-Patterns: primitive Owner/Editor-Rollen für Service Accounts oder in Produktionsumgebungen unreflektiert verwenden; IAM-Berechtigungen nur auf Projektebene prüfen, ohne vererbte Berechtigungen von Organisation/Folder zu berücksichtigen; eine Folder-Struktur ohne Rücksicht auf tatsächliche organisatorische Grenzen gestalten.

## Production Checklist

- [ ] Für jede IAM-Policy-Zuweisung ist die betroffene Vererbungsreichweite über die Hierarchie geprüft.
- [ ] Service Accounts nutzen benutzerdefinierte oder minimal notwendige vordefinierte Rollen, keine primitiven Rollen.
- [ ] Die Folder-Struktur bündelt Projekte entlang tatsächlicher organisatorischer Grenzen.
- [ ] Effektive (inklusive vererbter) Berechtigungen werden regelmäßig über alle Projekte geprüft.

## Interviewfragen

### 1. Aus welchen drei Ebenen besteht die GCP-Ressourcenhierarchie?

**Antwort:** Organisation, Folder (optional) und Projekt.

### 2. Wie unterscheidet sich vererbte GCP-IAM-Berechtigung von einer AWS-SCP?

**Antwort:** Eine vererbte GCP-IAM-Rolle gewährt direkt tatsächlichen Zugriff in allen darunterliegenden Projekten; eine AWS-SCP begrenzt nur die maximal mögliche Berechtigung, gewährt aber selbst keinen Zugriff.

### 3. Warum sollten Service Accounts keine primitiven Rollen erhalten?

**Antwort:** Weil primitive Rollen (Owner/Editor/Viewer) sehr breite Berechtigungen gewähren, die dem Prinzip der geringsten Berechtigung widersprechen und für maschinelle Identitäten mit spezifischem Zweck ungeeignet sind.

### 4. Welche drei Granularitätsstufen von IAM-Rollen gibt es in GCP?

**Antwort:** Primitive Rollen (sehr breit), vordefinierte Rollen (dienstspezifisch, granularer) und benutzerdefinierte Rollen (exakt auf den tatsächlichen Bedarf zugeschnitten).

### 5. Wie gehst du vor, wenn ein Projekt unerwartet weitreichende Berechtigungen zeigt?

**Antwort:** Ich prüfe zuerst die effektiven IAM-Policies über alle Hierarchieebenen hinweg (Organisation, Folder, Projekt), da die Ursache häufig eine unbeabsichtigte Vererbung von einer übergeordneten Ebene ist, nicht eine falsch konfigurierte Projekt-Policy.

### 6. Widersprüchliche Anforderung: Unternehmen will zentrale, konsistente Sicherheitsrichtlinien für alle Projekte UND maximale Autonomie einzelner Teams bei der Projektverwaltung — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, unveränderliche Sicherheitsgrundlagen (z. B. verbindliche Sicherheitsrollen) auf Organisationsebene zu vererben, während Teams innerhalb ihrer Folder/Projekte volle Autonomie über nicht-sicherheitskritische Konfiguration behalten, statt zentrale Kontrolle und Team-Autonomie als sich ausschließende Ziele zu behandeln.

## Praktische Labs

~~~python
# Conceptual effective-permission resolution across the org/folder/project hierarchy (not executed against a real GCP account):

def resolve_effective_roles(hierarchy_roles, project_id):
    effective = set()
    for level in ["organization", "folder", "project"]:
        effective |= set(hierarchy_roles.get(level, {}).get(project_id, hierarchy_roles.get(level, {}).get("_all", [])))
    return effective

hierarchy_roles = {
    "organization": {"_all": ["roles/iam.securityReviewer"]},
    "folder": {"_all": ["roles/logging.viewer"]},
    "project": {"proj-a": ["roles/storage.objectViewer"]},
}

effective = resolve_effective_roles(hierarchy_roles, "proj-a")
print(f"effective roles for proj-a: {effective}")
~~~

## Dependencies, Cross-References und Quellen

1. Google-Cloud-Dokumentation: [Resource Hierarchy for Cloud IAM](https://cloud.google.com/resource-manager/docs/cloud-platform-resource-hierarchy), abgerufen 2026-09-18.
2. Google-Cloud-Dokumentation: [Understanding IAM Policy Inheritance](https://cloud.google.com/iam/docs/resource-hierarchy-access-control), abgerufen 2026-09-18.

Cloud-IAM-Grundarchitektur ist kanonisch in [KB-0444](../18-cloud-foundations/04-cloud-iam-grundarchitektur.md) behandelt; AWS IAM und Rollenmodell in [KB-0464](../19-aws/02-aws-iam-und-rollenmodell.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende Nutzung von IAM Deny Policies zur expliziten Einschränkung geerbter Berechtigungen unabhängig von Allow-Policies | Evaluating | Gegenüber ausschließlicher Nutzung von Allow-Policies erst nach Prüfung, ob explizite Deny-Regeln für kritische Ressourcen einen belegbaren Sicherheitsgewinn bieten, bevorzugen. |

Ein Team akzeptiert eine GCP-IAM-Konfiguration erst, wenn die effektiven Berechtigungen inklusive Vererbung über die gesamte Organisation-Folder-Projekt-Hierarchie nachweislich geprüft und dem Prinzip der geringsten Berechtigung entsprechen.
