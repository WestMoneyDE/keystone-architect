---
{"id": "KB-0531", "title": "Sigstore und Cosign", "domain": "22", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0530", "concepts": ["SLSA und Build-Provenienz"], "needed_for": "understanding"}, {"id": "KB-0528", "concepts": ["Artifact Registries"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Schlüssellose Signaturen über Sigstore/Cosign anhand offizieller Dokumentation korrekt erstellen und mit festgelegten Issuer- und Subject-Regeln vor Deployment verifizieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Lieferkette explizit entscheiden, welche Identitäts- und Issuer-Einschränkungen eine Signaturverifikation durchsetzen muss, statt jede gültig signierte Artefakt-Signatur unabhängig vom tatsächlichen Signierenden zu akzeptieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet akzeptierte, aber nicht autorisierte Artefaktsignatur auf eine Verifikationskonfiguration ohne explizite Issuer-/Subject-Einschränkung zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Signaturverifikation anhand expliziter Identitäts- und Issuer-Regeln statt bloßer Signaturgültigkeitsprüfung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung des Sigstore-Transparenzlog-Merkle-Baums im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der schlüssellosen Signatur, Identitätsbindung und Issuer-/Subject-Verifikation als Entscheidungsgrundlage, nicht die Transparenzlog-Interna."}}, "lab_validation": [{"lab_id": "KB-0531-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller Sigstore- und Cosign-Dokumentation zu schlüssellosen Signaturen, kein aktives Sigstore-System verwendet", "evidence": "Anhand offizieller Dokumentation wird nachvollzogen, wie Sigstore statische, langfristig zu verwaltende Signaturschlüssel durch kurzlebige, an eine OpenID-Connect-Identität gebundene Zertifikate ersetzt, wie Cosign diese Signaturen konkret auf Artefakte in einer Artifact Registry anwendet, wie das Transparenzlog jede Signaturausstellung öffentlich und überprüfbar protokolliert, und wie eine Verifikation explizit auf einen erwarteten Issuer und ein erwartetes Subject (die Identität des Signierenden) eingeschränkt werden muss, um zu verhindern, dass jede beliebige, technisch gültige Signatur unabhängig vom tatsächlichen Signierenden akzeptiert wird.", "limitations": "Kein aktives Sigstore-System verwendet, keine reale Signaturverifikation durchgeführt."}]}
---
# Sigstore und Cosign

> **Ziel:** Sigstore ersetzt statische, langfristig zu verwaltende Signaturschlüssel (mit den bekannten Risiken von Schlüsselverlust, -diebstahl und aufwendiger Rotation) durch **schlüssellose Signaturen** — kurzlebige, kryptographische Zertifikate, die an eine überprüfbare **Identität** (etwa eine OpenID-Connect-Identität eines CI/CD-Systems oder einer Person) gebunden sind und nur für die Dauer eines einzelnen Signaturvorgangs existieren. Cosign ist das konkrete Werkzeug, das diese Signaturen auf Artefakte in einer Artifact Registry (siehe [KB-0528](16-artifact-registries.md)) anwendet und verifiziert. Jede Signaturausstellung wird in einem öffentlichen, unveränderlichen **Transparenzlog** protokolliert, was nachträgliche Manipulation oder heimliche Ausstellung unbemerkter Signaturen erkennbar macht. Der zentrale Punkt dieses Kapitels ist, dass eine unerwartet akzeptierte, aber nicht autorisierte Artefaktsignatur typischerweise nicht auf einen Fehler im kryptographischen Signaturmechanismus selbst zurückzuführen ist, sondern auf eine Verifikationskonfiguration ohne explizite Issuer- und Subject-Einschränkung — eine Verifikation, die lediglich prüft, ob "irgendeine gültige Sigstore-Signatur" vorliegt, akzeptiert jede technisch valide Signatur unabhängig davon, wer sie tatsächlich ausgestellt hat, was jedem Inhaber einer beliebigen, für Sigstore akzeptierten Identität erlaubt, ein scheinbar vertrauenswürdig signiertes, aber nicht autorisiertes Artefakt zu erzeugen.

## Zweck, Mental Model und Dependencies

Statische Signaturschlüssel stellen ein operatives und sicherheitstechnisches Dauerproblem dar: Sie müssen sicher gespeichert, regelmäßig rotiert, und bei Verdacht auf Kompromittierung widerrufen werden, wobei ein kompromittierter, langlebiger Schlüssel es einem Angreifer ermöglicht, beliebig viele scheinbar legitime Signaturen zu erzeugen, solange die Kompromittierung unbemerkt bleibt. Sigstore löst dieses Problem strukturell, indem es keine langlebigen Schlüssel mehr benötigt — stattdessen wird für jeden einzelnen Signaturvorgang ein kurzlebiges Zertifikat ausgestellt, dessen Gültigkeit an eine über einen etablierten Identitätsanbieter (OpenID Connect) verifizierte Identität gebunden ist (etwa: "diese Signatur wurde von genau dieser GitHub-Actions-Workflow-Ausführung in genau diesem Repository ausgestellt"), wodurch das Risiko eines dauerhaft kompromittierten, wiederverwendbaren Schlüssels entfällt. Das Transparenzlog protokolliert jede Signaturausstellung öffentlich und unveränderlich (in einer append-only Struktur), was zwei wichtige Eigenschaften sicherstellt: Erstens kann jede ausgestellte Signatur nachträglich überprüft und nachvollzogen werden, wer sie zu welchem Zeitpunkt ausgestellt hat; zweitens würde eine heimliche, nicht im Log erfasste Signaturausstellung durch einen kompromittierten Zertifizierungsprozess auffallen, da eine gültige Verifikation üblicherweise die Existenz eines entsprechenden Log-Eintrags voraussetzt. Die entscheidende, häufig übersehene Konfigurationsanforderung liegt bei der Verifikation: Eine korrekte Verifikation muss nicht nur prüfen, ob die kryptographische Signatur technisch valide ist (was jede über Sigstore signierte Signatur, unabhängig vom Signierenden, erfüllen würde), sondern explizit einschränken, welcher **Issuer** (welcher Identitätsanbieter wird als vertrauenswürdig akzeptiert) und welches **Subject** (welche spezifische Identität, etwa ein bestimmtes CI/CD-Repository oder eine bestimmte Workflow-Datei) als autorisierter Signierender akzeptiert wird — ohne diese Einschränkung würde die Verifikation jede technisch gültige, aber von einem beliebigen, nicht autorisierten Sigstore-Nutzer ausgestellte Signatur ebenfalls akzeptieren.

~~~text
Sigstore: replaces STATIC, long-lived signing keys (key loss/theft/rotation risk)
  -> KEYLESS signatures: short-lived cert per signing operation, bound to VERIFIABLE IDENTITY (OIDC)
    e.g. "this signature came from THIS EXACT GitHub Actions run in THIS EXACT repo"
  -> no more long-lived, reusable-if-compromised key risk
Cosign: concrete tool applying/verifying these signatures on artifacts (in Artifact Registry, KB-0528)
Transparency Log: PUBLIC, IMMUTABLE (append-only) record of EVERY signature issuance
  -> any signature verifiably traceable to who/when issued it
  -> covert, off-log signature issuance via compromised cert process would be DETECTABLE
    (valid verification usually requires corresponding log entry)
CRITICAL, often-overlooked VERIFICATION requirement: ISSUER + SUBJECT restriction
  checking ONLY "is this a technically valid Sigstore signature" -> ACCEPTS ANY signer
  MUST explicitly restrict:
    Issuer: which identity provider is trusted
    Subject: which SPECIFIC identity (repo, workflow file) is authorized signer
  WITHOUT this -> verification accepts technically valid but UNAUTHORIZED signer's signature too
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Schlüssellose Signatur | kurzlebiges Zertifikat statt statischem Schlüssel | eliminiert Risiko dauerhaft kompromittierter Schlüssel |
| Identitätsbindung (OIDC) | Signatur an überprüfbare Identität gebunden | Grundlage für Issuer-/Subject-Einschränkung bei Verifikation |
| Transparenzlog | öffentliche, unveränderliche Protokollierung jeder Signaturausstellung | macht heimliche Signaturausstellung erkennbar |
| Issuer-/Subject-Einschränkung | explizite Autorisierung des akzeptierten Signierenden | verhindert Akzeptanz beliebiger, technisch gültiger Signaturen |

Implementierung: Jede Signaturverifikation wird explizit mit Issuer- und Subject-Einschränkungen konfiguriert, die genau festlegen, welche Identität als autorisierter Signierender akzeptiert wird, statt lediglich die technische Signaturgültigkeit zu prüfen. Vor Deployment wird die Signatur jedes Artefakts gegen diese explizite Autorisierungsregel verifiziert, nicht nur gegen eine allgemeine "ist signiert"-Prüfung. Das Transparenzlog wird bei Bedarf explizit konsultiert, um die Herkunft einer Signatur nachzuvollziehen.

## Scalability, Reliability, Security und Observability

Sigstore/Cosign skaliert die Vertrauenswürdigkeit der Artefaktverifikation proportional zur Präzision der Issuer-/Subject-Einschränkung; die Reliability-Grenze liegt darin, dass eine Verifikation ohne explizite Einschränkung proportional zur Anzahl nicht autorisierter Sigstore-Nutzer das Risiko akzeptierter, aber nicht autorisierter Signaturen erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine nicht autorisierte, aber technisch gültige Signatur wird vor Deployment akzeptiert | die Verifikationskonfiguration prüft nur allgemeine Signaturgültigkeit, ohne Issuer-/Subject-Einschränkung | die Verifikationskonfiguration explizit auf den erwarteten Issuer und das erwartete Subject einschränken |
| die Herkunft einer verdächtigen Signatur ist unklar | das Transparenzlog wurde nicht konsultiert, um die tatsächliche Ausstellungshistorie nachzuvollziehen | die Signatur explizit gegen den entsprechenden Transparenzlog-Eintrag prüfen |
| eine legitime, autorisierte Signatur wird unerwartet abgelehnt | die Issuer-/Subject-Einschränkung entspricht nicht der tatsächlichen, aktuellen Identität des signierenden Systems (z. B. nach einer Repository-Umbenennung) | die Verifikationskonfiguration gegen die tatsächliche, aktuelle Identität des signierenden Systems aktualisieren |

Security: Deployment-Prozesse sollten konsequent nur Artefakte akzeptieren, deren Signatur explizit gegen einen definierten Issuer und ein definiertes Subject verifiziert wurde, nicht nur gegen allgemeine Signaturgültigkeit. Observability: Die tatsächliche Abdeckung der Signaturverifikation über alle Deployment-Pfade hinweg, sowie die Konsistenz der Issuer-/Subject-Konfiguration mit den tatsächlich autorisierten Signierenden, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** signiert und verifiziert ein Artefakt korrekt mit Cosign für einen gegebenen Anwendungsfall. **Principal** entwirft die Issuer-/Subject-Verifikationsregeln für eine vollständige Lieferkette. **Chief** legt unternehmensweite Standards für Signaturverifikation mit expliziter Identitätseinschränkung statt bloßer Gültigkeitsprüfung fest.

Anti-Patterns: Signaturverifikation nur auf technische Gültigkeit statt explizite Issuer-/Subject-Einschränkung konfigurieren; Deployment-Entscheidungen ohne Signaturverifikation vor jedem Rollout treffen; die Verifikationskonfiguration nicht an tatsächliche Änderungen der signierenden Identität (z. B. Repository-Umbenennung) anpassen.

## Production Checklist

- [ ] Jede Signaturverifikation ist explizit auf einen erwarteten Issuer und ein erwartetes Subject eingeschränkt.
- [ ] Deployment-Prozesse verifizieren Signaturen vor jedem Rollout, nicht nur stichprobenartig.
- [ ] Die Verifikationskonfiguration wird bei Änderungen der signierenden Identität aktuell gehalten.
- [ ] Das Transparenzlog wird bei Verdachtsfällen explizit zur Herkunftsnachvollziehung konsultiert.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen Sigstore-Signaturen und klassischen, statischen Signaturschlüsseln?

**Antwort:** Sigstore nutzt kurzlebige Zertifikate pro Signaturvorgang, gebunden an eine überprüfbare Identität, statt langlebiger, dauerhaft zu verwaltender Schlüssel, was das Risiko eines dauerhaft kompromittierten Schlüssels eliminiert.

### 2. Wofür dient das Transparenzlog?

**Antwort:** Es protokolliert öffentlich und unveränderlich jede Signaturausstellung, wodurch jede Signatur nachträglich nachvollziehbar ist und heimliche, nicht protokollierte Signaturausstellung erkennbar wird.

### 3. Warum reicht die Prüfung "ist die Signatur technisch gültig" allein nicht aus?

**Antwort:** Weil eine solche Prüfung jede über Sigstore signierte, technisch gültige Signatur unabhängig vom tatsächlichen Signierenden akzeptiert, ohne zu prüfen, ob der Signierende tatsächlich autorisiert ist.

### 4. Was müssen Issuer- und Subject-Einschränkungen bei der Verifikation leisten?

**Antwort:** Sie schränken explizit ein, welcher Identitätsanbieter als vertrauenswürdig gilt (Issuer) und welche spezifische Identität als autorisierter Signierender akzeptiert wird (Subject), statt jede beliebige gültige Signatur zu akzeptieren.

### 5. Wie gehst du vor, wenn eine nicht autorisierte, aber technisch gültige Signatur vor Deployment akzeptiert wird?

**Antwort:** Ich prüfe, ob die Verifikationskonfiguration eine explizite Issuer-/Subject-Einschränkung enthält, und ergänze diese, da eine fehlende Einschränkung die häufigste Ursache für die Akzeptanz nicht autorisierter, aber technisch gültiger Signaturen ist.

### 6. Widersprüchliche Anforderung: Team will maximale Flexibilität, dass verschiedene interne Teams und CI/CD-Systeme Artefakte signieren können, UND garantiert, dass nur tatsächlich autorisierte Systeme akzeptierte Signaturen erzeugen können — wie gehst du vor?

**Antwort:** Ich würde eine explizite Liste autorisierter Issuer/Subject-Kombinationen (etwa: bestimmte Repositories oder Workflow-Dateien) pflegen, die bei Bedarf erweitert werden kann, statt entweder eine einzelne starre Identität zu erzwingen oder jede beliebige Sigstore-Identität zu akzeptieren — Flexibilität und Autorisierungskontrolle lassen sich durch eine explizit gepflegte, erweiterbare Autorisierungsliste statt durch den Verzicht auf Einschränkung vereinbaren.

## Praktische Labs

~~~python
# Conceptual issuer/subject-restricted signature verification (not executed against a real Sigstore instance):

def verify_signature(signature_valid, issuer, subject, authorized_issuer, authorized_subjects):
    if not signature_valid:
        return "REJECTED: signature not cryptographically valid"
    if issuer != authorized_issuer:
        return "REJECTED: untrusted issuer"
    if subject not in authorized_subjects:
        return "REJECTED: subject not authorized, even though signature is technically valid"
    return "ACCEPTED: valid signature from authorized issuer and subject"

authorized_issuer = "https://token.actions.githubusercontent.com"
authorized_subjects = ["repo:my-org/my-repo:ref:refs/heads/main"]

print(verify_signature(True, authorized_issuer, "repo:my-org/my-repo:ref:refs/heads/main", authorized_issuer, authorized_subjects))
print(verify_signature(True, authorized_issuer, "repo:attacker/malicious-repo:ref:refs/heads/main", authorized_issuer, authorized_subjects))
~~~

## Dependencies, Cross-References und Quellen

1. Sigstore-Dokumentation: [Sigstore Overview](https://docs.sigstore.dev/about/overview/), abgerufen 2026-09-18.
2. Cosign-Dokumentation: [Cosign Verification with Certificate Identity](https://docs.sigstore.dev/cosign/verifying/verify/), abgerufen 2026-09-18.

SLSA und Build-Provenienz sind kanonisch in [KB-0530](18-slsa-und-build-provenienz.md) behandelt; Artifact Registries in [KB-0528](16-artifact-registries.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte Policy-as-Code-Werkzeuge zur zentralen, deklarativen Verwaltung von Issuer-/Subject-Autorisierungsregeln über mehrere Deployment-Pfade hinweg | Evaluating | Gegenüber verteilter, pro Deployment-Pfad konfigurierter Verifikation erst nach Prüfung der tatsächlichen Konsistenzgewinne für die konkrete Lieferkette bevorzugen. |

Ein Team akzeptiert eine Sigstore/Cosign-Implementierung erst, wenn jede Signaturverifikation nachweislich explizite Issuer- und Subject-Einschränkungen durchsetzt, statt lediglich technische Signaturgültigkeit zu prüfen.
