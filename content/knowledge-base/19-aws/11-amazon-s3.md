---
{"id": "KB-0473", "title": "Amazon S3", "domain": "19", "sequence": 11, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "GENAI"], "requires": [{"id": "KB-0208", "concepts": ["Object Storage, Versionierung"], "needed_for": "understanding"}, {"id": "KB-0459", "concepts": ["Cloud-Backup-Strategien"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine S3-Bucket-Policy mit Versionierung und einer Lifecycle-Regel anhand offizieller Dokumentation konfigurieren können und erklären, warum Versionierung eine Voraussetzung für zuverlässige Objektwiederherstellung ist.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine S3-Zugriffs- und Replikationsstrategie für Unternehmensdaten gestalten, die Bucket-Policies, Versionierung und regionsübergreifende Replikation explizit gegen tatsächliche Wiederherstellungs- und Compliance-Anforderungen abstimmt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Einen unerwarteten, öffentlichen Zugriff auf einen S3-Bucket auf eine fehlerhafte oder zu weit gefasste Bucket-Policy zurückführen können, statt anzunehmen, dass S3 standardmäßig unsicher konfiguriert ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "S3-Governance-Richtlinien im Unternehmen anhand konsequenter Versionierung, restriktiver Bucket-Policies und dokumentierter Lifecycle-Regeln statt anhand einer pauschalen, unreflektierten Standardkonfiguration festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung der S3-Speicherklassen-Übergangslogik im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Bucket-Policies, Versionierung, Lifecycle-Regeln und Replikation als Entscheidungsgrundlage, nicht die Speicherklassen-Interna."}}, "lab_validation": [{"lab_id": "KB-0473-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Amazon-S3-Dokumentation, kein aktives AWS-Konto verwendet", "evidence": "Anhand offizieller AWS-Dokumentation wird nachvollzogen, wie Bucket-Policies den Zugriff auf S3-Buckets regeln, wie Versionierung mehrere Versionen desselben Objekts erhält und damit eine Voraussetzung für zuverlässige Wiederherstellung nach versehentlicher Löschung oder Überschreibung darstellt, und wie Lifecycle-Regeln automatisiert Objekte zwischen Speicherklassen übergehen oder nach einer definierten Zeit löschen.", "limitations": "Kein aktives AWS-Konto verwendet, keine reale S3-Bucket-Konfiguration erstellt."}]}
---
# Amazon S3

> **Ziel:** Amazon S3 ist AWS' Object-Storage-Dienst (siehe Object Storage, [KB-0208](../09-databases-storage/14-object-storage.md)), bei dem Bucket-Policies den Zugriff regeln, Versionierung mehrere Versionen desselben Objekts erhält, und Lifecycle-Regeln automatisiert Objekte zwischen Speicherklassen übergehen oder nach einer definierten Zeit löschen. Der zentrale Punkt dieses Kapitels ist, dass Versionierung eine grundlegende technische Voraussetzung für zuverlässige Wiederherstellung ist — ohne aktivierte Versionierung überschreibt oder löscht ein Schreibvorgang ein Objekt unwiederbringlich, während mit aktivierter Versionierung eine vorherige Version weiterhin abrufbar bleibt, selbst wenn ein Objekt versehentlich überschrieben oder "gelöscht" wurde (eine Löschung erzeugt bei aktivierter Versionierung lediglich einen neuen "Delete Marker" als aktuelle Version, ohne die vorherigen Objektversionen tatsächlich zu entfernen).

## Zweck, Mental Model und Dependencies

Eine Bucket-Policy definiert, welche Principals (siehe AWS IAM und Rollenmodell, [KB-0464](02-aws-iam-und-rollenmodell.md)) welche Aktionen auf einem Bucket oder bestimmten Objekten darin ausführen dürfen — eine unerwartete, öffentliche Zugänglichkeit eines Buckets ist praktisch immer auf eine tatsächlich vorhandene, zu weit gefasste Bucket-Policy (oder eine fehlerhafte Kombination aus Bucket-Policy und Objekt-ACLs) zurückzuführen, nicht auf eine unsichere Standardkonfiguration, da S3-Buckets standardmäßig privat sind und öffentlicher Zugriff eine explizite, aktive Konfiguration erfordert. Versionierung ändert das grundlegende Verhalten von Schreiboperationen auf einem Bucket: Ohne Versionierung überschreibt ein erneuter Schreibvorgang mit demselben Objektschlüssel das vorherige Objekt vollständig und unwiederbringlich, und eine Löschoperation entfernt das Objekt endgültig; mit aktivierter Versionierung wird jede Schreiboperation als neue, zusätzliche Version gespeichert, während vorherige Versionen erhalten bleiben und über ihre Versions-ID weiterhin abrufbar sind, und eine "Löschung" erzeugt lediglich einen neuen Delete Marker als aktuelle, sichtbare Version, ohne die vorherigen, tatsächlichen Objektversionen zu entfernen (eine permanente Löschung erfordert eine explizite Angabe der spezifischen Versions-ID). Dies macht Versionierung zu einer grundlegenden technischen Voraussetzung für zuverlässige Objektwiederherstellung nach versehentlicher Überschreibung oder Löschung, konsistent mit der allgemeinen Anforderung an unveränderliche Backups (siehe Cloud-Backup-Strategien, [KB-0459](../18-cloud-foundations/19-cloud-backup-strategien.md)). Lifecycle-Regeln automatisieren zwei unterschiedliche Arten von Übergängen: Speicherklassenübergänge (Objekte werden nach einer definierten Zeit automatisch in eine kostengünstigere, für seltenen Zugriff optimierte Speicherklasse verschoben) und Ablaufregeln (Objekte oder alte Versionen werden nach einer definierten Zeit automatisch permanent gelöscht) — beide Arten von Regeln müssen sorgfältig gegen die tatsächlichen Zugriffs- und Aufbewahrungsanforderungen der jeweiligen Daten geprüft werden, da eine zu aggressive Ablaufregel wichtige Daten unwiederbringlich löschen kann, bevor ihr tatsächlicher Aufbewahrungsbedarf endet.

~~~text
Bucket Policy: defines WHICH principals can do WHAT on a bucket/objects
  S3 buckets are PRIVATE by default -> unexpected public access is ALWAYS traceable to an
    ACTUAL, overly broad bucket policy (or misconfigured combination with object ACLs)
    NEVER an inherently insecure default
Versioning: changes write/delete behavior fundamentally
  WITHOUT: overwrite = PERMANENT, irrecoverable loss of previous object
  WITH: EACH write = NEW version, previous versions RETAINED and retrievable by version ID
    "delete" = new DELETE MARKER as current visible version, actual previous versions NOT removed
    (permanent deletion requires EXPLICIT specific version ID)
  -> versioning = fundamental TECHNICAL prerequisite for reliable object recovery
Lifecycle rules: TWO distinct types
  storage class transitions (move to cheaper, infrequent-access tier after a defined time)
  expiration rules (objects/old versions PERMANENTLY deleted after a defined time)
  -> BOTH must be carefully checked against ACTUAL access/retention needs
     overly aggressive expiration -> irreversible loss of data before its real retention need ends
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Bucket-Policy | regelt Zugriff auf Bucket/Objekte | Buckets sind standardmäßig privat, öffentlicher Zugriff erfordert explizite Konfiguration |
| Versionierung | erhält frühere Objektversionen | grundlegende Voraussetzung für Wiederherstellung nach versehentlicher Überschreibung/Löschung |
| Lifecycle-Regeln (Speicherklassenübergänge) | verschieben Objekte in kostengünstigere Klassen | müssen gegen tatsächliches Zugriffsmuster geprüft werden |
| Lifecycle-Regeln (Ablauf) | löschen Objekte/Versionen automatisch | zu aggressive Konfiguration riskiert irreversiblen Datenverlust |

Implementierung: Bucket-Policies werden nach dem Prinzip geringster Berechtigung konfiguriert, mit expliziter Prüfung, ob öffentlicher Zugriff tatsächlich beabsichtigt ist, bevor eine entsprechend weit gefasste Policy eingerichtet wird. Versionierung wird für Buckets mit wichtigen, potenziell versehentlich überschreibbaren Daten aktiviert, um eine zuverlässige Wiederherstellungsmöglichkeit sicherzustellen. Lifecycle-Regeln für Ablauf werden erst nach expliziter Prüfung der tatsächlichen Aufbewahrungsanforderungen der betroffenen Daten konfiguriert, statt pauschale, unreflektierte Standardzeiträume zu übernehmen.

## Scalability, Reliability, Security und Observability

Amazon S3 skaliert die Datenzugänglichkeit und -haltbarkeit proportional zur korrekten Konfiguration von Bucket-Policies und Versionierung; die Reliability-Grenze liegt darin, dass eine zu aggressive Lifecycle-Ablaufregel proportional zur Diskrepanz zwischen konfigurierter und tatsächlich benötigter Aufbewahrungsdauer zu irreversiblem, vermeidbarem Datenverlust führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein S3-Bucket ist unerwartet öffentlich zugänglich | eine tatsächlich vorhandene, zu weit gefasste Bucket-Policy oder Objekt-ACL erlaubt diesen Zugriff | die Bucket-Policy und relevanten Objekt-ACLs explizit auf öffentliche Zugriffsrechte prüfen |
| ein versehentlich überschriebenes Objekt kann nicht wiederhergestellt werden | Versionierung war für diesen Bucket nicht aktiviert, wodurch die vorherige Version unwiederbringlich überschrieben wurde | für zukünftige, wichtige Daten Versionierung aktivieren, um diese Situation zu vermeiden |
| wichtige Daten wurden unerwartet automatisch gelöscht | eine Lifecycle-Ablaufregel wurde ohne ausreichende Prüfung der tatsächlichen Aufbewahrungsanforderungen konfiguriert | die Lifecycle-Regeln des betroffenen Buckets gegen die tatsächlichen Aufbewahrungsanforderungen prüfen und anpassen |

Security: S3-Buckets mit sensiblen Daten sollten zusätzlich zur Bucket-Policy mit Verschlüsselung im Ruhezustand und regelmäßiger Prüfung auf unbeabsichtigte öffentliche Zugänglichkeit abgesichert werden. Observability: Die tatsächliche Zugriffshistorie (über Zugriffsprotokolle oder CloudTrail), der Versionierungsstatus jedes kritischen Buckets, und die Auswirkung aktiver Lifecycle-Regeln auf tatsächlich gespeicherte Daten sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** aktiviert Versionierung für Buckets mit wichtigen, potenziell versehentlich überschreibbaren Daten. **Principal** macht Bucket-Policy- und Lifecycle-Entscheidungen für das Team nachvollziehbar. **Chief** legt S3-Governance-Richtlinien im Unternehmen anhand konsequenter Versionierung und restriktiver Bucket-Policies fest.

Anti-Patterns: Bucket-Policies ohne explizite Prüfung auf unbeabsichtigten öffentlichen Zugriff konfigurieren; wichtige Daten ohne aktivierte Versionierung speichern und dadurch das Risiko unwiederbringlichen Verlusts bei versehentlicher Überschreibung eingehen; Lifecycle-Ablaufregeln ohne Prüfung der tatsächlichen Aufbewahrungsanforderungen konfigurieren.

## Production Checklist

- [ ] Bucket-Policies sind nach dem Prinzip geringster Berechtigung konfiguriert und regelmäßig auf unbeabsichtigten öffentlichen Zugriff geprüft.
- [ ] Versionierung ist für Buckets mit wichtigen, potenziell überschreibbaren Daten aktiviert.
- [ ] Lifecycle-Ablaufregeln sind explizit gegen die tatsächlichen Aufbewahrungsanforderungen der jeweiligen Daten geprüft.
- [ ] Die Zugriffshistorie kritischer Buckets wird protokolliert und überwacht.

## Interviewfragen

### 1. Sind S3-Buckets standardmäßig öffentlich oder privat zugänglich?

**Antwort:** Standardmäßig privat; öffentlicher Zugriff erfordert eine explizite, aktive Konfiguration über Bucket-Policy oder Objekt-ACLs.

### 2. Was ändert Versionierung am Verhalten von Schreib- und Löschoperationen auf einem S3-Bucket?

**Antwort:** Ohne Versionierung überschreibt oder löscht eine Operation ein Objekt unwiederbringlich; mit Versionierung wird jede Schreiboperation als neue Version gespeichert und eine Löschung erzeugt nur einen Delete Marker, während frühere Versionen erhalten bleiben.

### 3. Warum ist Versionierung eine Voraussetzung für zuverlässige Objektwiederherstellung?

**Antwort:** Weil ohne Versionierung ein überschriebenes oder gelöschtes Objekt permanent verloren ist, während mit Versionierung frühere Versionen über ihre Versions-ID weiterhin abrufbar bleiben.

### 4. Was unterscheidet Lifecycle-Speicherklassenübergänge von Lifecycle-Ablaufregeln?

**Antwort:** Speicherklassenübergänge verschieben Objekte in eine kostengünstigere Speicherklasse, ohne sie zu löschen; Ablaufregeln löschen Objekte oder alte Versionen nach einer definierten Zeit permanent.

### 5. Wie gehst du vor, wenn ein S3-Bucket unerwartet öffentlich zugänglich ist?

**Antwort:** Ich prüfe die Bucket-Policy und relevante Objekt-ACLs explizit, da eine tatsächlich vorhandene, zu weit gefasste Konfiguration die Ursache sein muss, da S3-Buckets nie standardmäßig unsicher konfiguriert sind.

### 6. Widersprüchliche Anforderung: Team will minimale Speicherkosten (aggressive Ablaufregeln) UND garantiert keine unwiederbringlichen Datenverluste — wie gehst du vor?

**Antwort:** Ich würde die tatsächlichen Aufbewahrungsanforderungen der Daten explizit klären und Ablaufregeln erst nach dieser Klärung konfigurieren, statt aggressive Regeln aus Kostengründen ohne Prüfung der tatsächlichen Anforderungen einzuführen, da ein irreversibler Datenverlust nicht durch spätere Kosteneinsparung wettgemacht werden kann.

## Praktische Labs

~~~python
# Conceptual versioning-based recovery simulation (not executed against a real S3 bucket):

def simulate_object_state(versioning_enabled, operations):
    """operations: list of ("write", content) or ("delete",) tuples."""
    versions = []  # each entry: content, or None for a delete marker
    for op in operations:
        if op[0] == "write":
            if versioning_enabled:
                versions.append(op[1])
            else:
                versions = [op[1]]  # overwrite, previous content LOST
        elif op[0] == "delete":
            if versioning_enabled:
                versions.append(None)  # delete marker, previous versions still present
            else:
                versions = []  # permanent, irrecoverable deletion
    return versions

without_versioning = simulate_object_state(False, [("write", "v1"), ("write", "v2"), ("delete",)])
with_versioning = simulate_object_state(True, [("write", "v1"), ("write", "v2"), ("delete",)])

print(f"Without versioning, recoverable versions: {without_versioning}")
print(f"With versioning, recoverable versions (None = delete marker): {with_versioning}")
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [Amazon S3 — Bucket Policies and Access Control](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Amazon S3 — Using Versioning](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html), abgerufen 2026-09-18.

Object Storage ist kanonisch in [KB-0208](../09-databases-storage/14-object-storage.md) behandelt; Cloud-Backup-Strategien in [KB-0459](../18-cloud-foundations/19-cloud-backup-strategien.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, automatisierte Bucket-Policy-Analysewerkzeuge, die unbeabsichtigten öffentlichen Zugriff proaktiv erkennen und melden | Adopting | Gegenüber manueller Policy-Prüfung bevorzugen, sobald die tatsächliche Erkennungsgenauigkeit für die eigene Umgebung verifiziert ist. |

Ein Team akzeptiert eine S3-Bucket-Konfiguration erst, wenn die Bucket-Policy nachweislich keinen unbeabsichtigten öffentlichen Zugriff erlaubt, Versionierung für wichtige Daten aktiviert ist, und Lifecycle-Regeln gegen tatsächliche Aufbewahrungsanforderungen geprüft sind.
