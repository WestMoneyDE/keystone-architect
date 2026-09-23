---
{"id": "KB-0528", "title": "Artifact Registries", "domain": "22", "sequence": 16, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0518", "concepts": ["Pipeline-Architektur"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Unveränderliche Artefakte mit Digest-basierter Identität, Retention-Richtlinien und Zugriffsgrenzen in einer Artifact Registry anhand offizieller Dokumentation korrekt konfigurieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Lieferarchitektur explizit entscheiden, wie Promotion zwischen Registries oder Repositories (Staging zu Produktion) nachvollziehbar gestaltet wird, statt Artefakte informell zu kopieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartet unterschiedliches Verhalten zwischen einem in Staging getesteten und einem in Produktion deployten Container auf eine Tag-basierte statt Digest-basierte Artefaktreferenzierung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Artifact-Registry-Nutzung anhand von Digest-basierter Unveränderlichkeit, expliziter Retention und nachvollziehbarer Promotion statt informeller Tag-Verwaltung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Registry-Speicher-Backends im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Digest-basierter Unveränderlichkeit, Retention und nachvollziehbarer Promotion als Entscheidungsgrundlage, nicht die Speicher-Interna."}}, "lab_validation": [{"lab_id": "KB-0528-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller OCI- und Registry-Dokumentation zu Digests, Tags und Retention, kein aktives Registry-System verwendet", "evidence": "Anhand offizieller Dokumentation wird nachvollzogen, wie ein Container-Image-Digest (kryptographischer Hash des Inhalts) eine unveränderliche, eindeutige Referenz auf ein spezifisches Artefakt darstellt, während ein Tag (z. B. 'latest' oder 'v1.2') eine veränderliche, auf einen beliebigen Digest umleitbare Bezeichnung ist, wodurch dieselbe Tag-Referenz zu unterschiedlichen Zeitpunkten auf unterschiedliche tatsächliche Artefakte verweisen kann, und wie Promotion zwischen Repositories über die explizite Übertragung eines spezifischen Digests statt einer erneuten Erstellung nachvollziehbar gestaltet wird.", "limitations": "Kein aktives Registry-System verwendet, keine reale Artefaktverwaltung konfiguriert."}]}
---
# Artifact Registries

> **Ziel:** Eine Artifact Registry verwaltet Container-Images, Pakete und Modelle über zwei fundamental unterschiedliche Referenzierungsmechanismen: **Digests** (ein kryptographischer Hash des tatsächlichen Inhalts, der ein Artefakt eindeutig und unveränderlich identifiziert — derselbe Digest verweist stets auf exakt denselben Inhalt) und **Tags** (eine menschenlesbare, aber veränderliche Bezeichnung wie `latest` oder `v1.2`, die jederzeit auf einen anderen Digest umgeleitet werden kann). **Retention**-Richtlinien steuern, wie lange Artefakte aufbewahrt werden, bevor sie automatisch gelöscht werden. Der zentrale Punkt dieses Kapitels ist, dass ein unerwartet unterschiedliches Verhalten zwischen einem in Staging getesteten und einem in Produktion deployten Container typischerweise auf eine Tag-basierte statt Digest-basierte Artefaktreferenzierung zurückzuführen ist — wird ein Deployment über einen Tag (`myapp:latest`) statt einen spezifischen Digest referenziert, kann zwischen dem Zeitpunkt des Tests in Staging und dem tatsächlichen Deployment in Produktion ein neuer, anderer Build denselben Tag überschrieben haben, wodurch in Produktion tatsächlich ein anderes Artefakt läuft als das, was in Staging getestet wurde, obwohl dieselbe symbolische Referenz verwendet wurde.

## Zweck, Mental Model und Dependencies

Der Unterschied zwischen Digest und Tag ist die zentrale, häufig unterschätzte konzeptionelle Grundlage für verlässliche Artefaktverwaltung: Ein Digest ist inhaltsadressiert — er wird direkt aus dem tatsächlichen Inhalt des Artefakts berechnet, wodurch zwei Artefakte mit identischem Digest garantiert identischen Inhalt haben, und ein Digest niemals nachträglich auf einen anderen Inhalt "umgeleitet" werden kann, ohne dass sich der Digest selbst ändert. Ein Tag ist dagegen eine reine, veränderliche Zuordnung (ein Alias), die zu jedem Zeitpunkt neu auf einen beliebigen Digest zeigen kann — wenn ein neuer Build denselben Tag wie ein vorheriger Build erhält (etwa, weil jeder Build automatisch mit `latest` markiert wird), verweist dieser Tag ab diesem Zeitpunkt auf einen anderen, neuen Digest, während alle bereits gezogenen Kopien des vorherigen Artefakts unverändert bleiben. Dies hat eine direkte Konsequenz für Pipeline-Architektur (siehe [KB-0518](06-pipeline-architektur.md)): Um sicherzustellen, dass genau das in Test- und Gate-Phasen verifizierte Artefakt auch tatsächlich deployt wird, muss die Referenzierung über den spezifischen Digest erfolgen, nicht über einen Tag, der sich zwischen Verifikation und Deployment ändern könnte. Promotion — die kontrollierte Weitergabe eines Artefakts von einer Umgebung oder einem Repository zur nächsten (etwa von einem internen Staging-Repository zu einem Produktions-Repository) — sollte über die explizite Übertragung des spezifischen, bereits verifizierten Digests erfolgen, statt das Artefakt für die Zielumgebung erneut zu bauen (was, wie in [KB-0518](06-pipeline-architektur.md) behandelt, ein potenziell unterschiedliches Artefakt erzeugen könnte) oder sich auf eine Tag-Referenz zu verlassen, die sich zwischenzeitlich geändert haben könnte. Retention-Richtlinien müssen diese Unterscheidung berücksichtigen: Ein aggressives Löschen älterer Artefakte anhand ihres Tags kann versehentlich ein Artefakt löschen, auf das noch eine aktive, digest-basierte Produktionsreferenz zeigt, selbst wenn dieses Artefakt keinen "aktuellen" Tag mehr trägt.

~~~text
Artifact Registry: 2 fundamentally different referencing mechanisms
  Digest: cryptographic hash of ACTUAL content -> content-addressed
    -> identical digest = GUARANTEED identical content, NEVER redirects to different content
  Tag: human-readable but MUTABLE alias -> can point to ANY digest at ANY time
    -> new build tagged 'latest' -> tag now points to NEW digest, previously-pulled copies unchanged
CONSEQUENCE for pipeline architecture (KB-0518):
  to guarantee tested artifact == deployed artifact -> MUST reference by specific DIGEST, not tag
    (tag could have moved between test-time verification and deploy-time)
PROMOTION (staging repo -> prod repo): transfer the SPECIFIC, already-verified DIGEST
  NOT: rebuild for target env (potentially different artifact, see KB-0518)
  NOT: rely on a tag reference (could have changed in between)
Retention policies MUST account for this:
  aggressive tag-based deletion of "old" artifacts
    -> can accidentally delete an artifact a digest-based PRODUCTION REFERENCE still points to
       even if it no longer carries a "current" tag
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Digest | inhaltsadressierte, unveränderliche Artefaktidentität | garantiert identisches Artefakt bei jeder Referenzierung |
| Tag | menschenlesbare, veränderliche Bezeichnung | kann sich zwischen zwei Zugriffszeitpunkten ändern |
| Digest-basierte Deployment-Referenzierung | garantiert getestetes = deploytes Artefakt | verhindert Tag-Drift zwischen Test und Deployment |
| Digest-basierte Promotion | kontrollierte Weitergabe des verifizierten Artefakts | vermeidet erneuten Build oder Tag-Abhängigkeit |
| Retention | automatische Löschung nach Aufbewahrungsrichtlinie | muss aktive Digest-Referenzen berücksichtigen |

Implementierung: Deployment-Konfigurationen referenzieren Artefakte explizit über ihren spezifischen Digest statt über einen veränderlichen Tag, insbesondere für Produktionsumgebungen. Promotion zwischen Repositories oder Umgebungen erfolgt über die explizite Übertragung des bereits verifizierten Digests, nicht über einen erneuten Build oder eine Tag-basierte Kopie. Retention-Richtlinien werden explizit gegen aktive, digest-basierte Referenzen geprüft, bevor Artefakte anhand ihres Alters oder fehlender aktueller Tags gelöscht werden.

## Scalability, Reliability, Security und Observability

Artifact Registries skalieren die Verlässlichkeit von Deployments proportional zur konsequenten Nutzung digest-basierter statt tag-basierter Referenzierung; die Reliability-Grenze liegt darin, dass eine Tag-basierte Referenzierung proportional zur Häufigkeit neuer Builds mit demselben Tag zu Diskrepanzen zwischen getestetem und deploytem Artefakt führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein in Produktion deployter Container verhält sich anders als der in Staging getestete | die Deployment-Konfiguration referenziert einen Tag statt eines spezifischen Digests, der sich zwischenzeitlich geändert hat | die Deployment-Referenz explizit auf den in Staging verifizierten Digest umstellen |
| ein noch aktiv referenziertes Artefakt wird unerwartet durch eine Retention-Richtlinie gelöscht | die Retention-Richtlinie berücksichtigt nur Tag-Aktualität, nicht aktive Digest-Referenzen | die Retention-Richtlinie explizit gegen aktive Produktionsreferenzen prüfen, bevor Artefakte gelöscht werden |
| eine Promotion zwischen Umgebungen erzeugt ein unerwartet anderes Artefakt | das Artefakt wurde für die Zielumgebung erneut gebaut statt den verifizierten Digest zu übertragen | die Promotion auf explizite Digest-Übertragung statt erneuten Build umstellen |

Security: Zugriffsgrenzen sollten Push-Berechtigungen (wer darf neue Artefakte veröffentlichen) von Pull-Berechtigungen (wer darf Artefakte konsumieren) klar trennen, mit minimalen, zweckgebundenen Berechtigungen pro Repository. Observability: Die tatsächliche Nutzung von Digest- versus Tag-basierter Referenzierung über alle Deployment-Konfigurationen hinweg, sowie die Häufigkeit von Retention-bedingten Löschungen aktiv referenzierter Artefakte, sind zentrale Betriebssignale.

## Trade-offs und Entscheidungen

**Staff** referenziert Artefakte in Deployment-Konfigurationen korrekt über spezifische Digests. **Principal** entwirft die Promotion- und Retention-Strategie für eine vollständige Artefakt-Lieferkette. **Chief** legt unternehmensweite Standards für Digest-basierte Unveränderlichkeit und nachvollziehbare Promotion fest.

Anti-Patterns: Produktions-Deployments über veränderliche Tags statt spezifischer Digests referenzieren; Artefakte für eine Zielumgebung erneut bauen, statt den bereits verifizierten Digest zu übertragen; Retention-Richtlinien ohne Berücksichtigung aktiver Digest-Referenzen ausschließlich anhand von Tag-Aktualität konfigurieren.

## Production Checklist

- [ ] Produktions-Deployment-Konfigurationen referenzieren Artefakte über spezifische Digests, nicht veränderliche Tags.
- [ ] Promotion zwischen Umgebungen erfolgt über explizite Digest-Übertragung, nicht erneuten Build.
- [ ] Retention-Richtlinien berücksichtigen aktive, digest-basierte Produktionsreferenzen.
- [ ] Push- und Pull-Berechtigungen sind pro Repository klar getrennt und minimal konfiguriert.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen einem Digest und einem Tag in einer Artifact Registry?

**Antwort:** Ein Digest ist ein inhaltsadressierter, unveränderlicher kryptographischer Hash, der eindeutig auf exakt einen Inhalt verweist; ein Tag ist eine veränderliche, menschenlesbare Bezeichnung, die jederzeit auf einen anderen Digest umgeleitet werden kann.

### 2. Warum ist Tag-basierte Referenzierung in Produktions-Deployments riskant?

**Antwort:** Weil sich der Tag zwischen dem Zeitpunkt der Verifikation (z. B. in Staging) und dem tatsächlichen Deployment auf einen neuen, anderen Build verschoben haben kann, wodurch ein anderes Artefakt als das getestete deployt wird.

### 3. Wie sollte Promotion zwischen Repositories oder Umgebungen erfolgen?

**Antwort:** Über die explizite Übertragung des bereits verifizierten, spezifischen Digests, statt das Artefakt für die Zielumgebung erneut zu bauen oder sich auf eine Tag-Referenz zu verlassen.

### 4. Welches Risiko besteht bei einer ausschließlich Tag-basierten Retention-Richtlinie?

**Antwort:** Sie kann versehentlich ein Artefakt löschen, auf das noch eine aktive, digest-basierte Produktionsreferenz zeigt, selbst wenn dieses Artefakt keinen aktuellen Tag mehr trägt.

### 5. Wie gehst du vor, wenn ein in Produktion deployter Container sich unerwartet anders verhält als der in Staging getestete?

**Antwort:** Ich prüfe, ob die Deployment-Konfiguration einen Tag statt eines spezifischen Digests referenziert, da dies die häufigste Ursache für eine Diskrepanz zwischen getestetem und tatsächlich deploytem Artefakt ist.

### 6. Widersprüchliche Anforderung: Team will menschenlesbare, leicht verständliche Versionsreferenzen (Tags) in Deployment-Konfigurationen UND garantiert, dass exakt das getestete Artefakt deployt wird — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, Tags weiterhin für menschenlesbare Kommunikation und Dokumentation zu nutzen, während die tatsächliche Deployment-Konfiguration den zum Tag-Zeitpunkt gehörenden spezifischen Digest referenziert — beide Anforderungen lassen sich vereinbaren, indem der Tag als lesbare Referenz dient, während der Digest die tatsächliche, unveränderliche technische Bindung sicherstellt.

## Praktische Labs

~~~python
# Conceptual digest-vs-tag drift simulation (not executed against a real registry):

def resolve_reference(registry_state, reference, reference_type):
    if reference_type == "digest":
        return registry_state.get(reference, "NOT FOUND")
    return registry_state.get(f"tag:{reference}", "NOT FOUND")

registry_state = {
    "tag:latest": "sha256:aaa111",
    "sha256:aaa111": "build-v1-content",
}

staging_resolved = resolve_reference(registry_state, "latest", "tag")

registry_state["tag:latest"] = "sha256:bbb222"
registry_state["sha256:bbb222"] = "build-v2-content"

prod_resolved_via_tag = resolve_reference(registry_state, "latest", "tag")
prod_resolved_via_digest = resolve_reference(registry_state, "sha256:aaa111", "digest")

print(f"staging tested: {staging_resolved}")
print(f"prod via tag (DRIFTED): {prod_resolved_via_tag}")
print(f"prod via digest (SAFE, unchanged): {prod_resolved_via_digest}")
~~~

## Dependencies, Cross-References und Quellen

1. OCI-Dokumentation: [OCI Distribution Specification — Content Digests](https://github.com/opencontainers/distribution-spec/blob/main/spec.md), abgerufen 2026-09-18.
2. Docker-Dokumentation: [Image Digests and Tags](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier), abgerufen 2026-09-18.

Pipeline-Architektur ist kanonisch in [KB-0518](06-pipeline-architektur.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte Artefakt-Provenienz-Nachweise (Signaturen, Attestierungen) direkt in Registry-Metadaten zur kryptographisch überprüfbaren Herkunftsverfolgung | Evaluating | Gegenüber rein digest-basierter Identität ohne zusätzliche Provenienz-Nachweise erst nach Prüfung des tatsächlichen Integrationsaufwands und Sicherheitsgewinns für die konkrete Lieferkette bevorzugen. |

Ein Team akzeptiert eine Artifact-Registry-Konfiguration erst, wenn Produktions-Deployments nachweislich über spezifische Digests statt veränderlicher Tags referenziert werden und Retention-Richtlinien aktive Produktionsreferenzen respektieren.
