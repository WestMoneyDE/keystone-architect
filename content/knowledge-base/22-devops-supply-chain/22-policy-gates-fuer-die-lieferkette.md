---
{"id": "KB-0534", "title": "Policy Gates für die Lieferkette", "domain": "22", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0530", "concepts": ["SLSA und Build-Provenienz"], "needed_for": "understanding"}, {"id": "KB-0533", "concepts": ["Dependency Security und Scanning"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Policy Gates, die Signaturen, Scans und Tests zu verbindlichen Freigaberegeln verbinden, anhand offizieller Praktiken korrekt konfigurieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Lieferkette explizit gestalten, wie zeitlich begrenzte Ausnahmen von Policy Gates dokumentiert werden, und wie unabhängige Belege statt bloßer formaler grüner Statusanzeigen als Freigabekriterium durchgesetzt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine fälschlich freigegebene, tatsächlich fehlerhafte Änderung auf einen formal grünen, aber inhaltlich nicht aussagekräftigen Gate-Status zurückführen können, der keine unabhängige, belastbare Prüfung tatsächlich durchgesetzt hat.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Policy Gates festlegen, die unabhängige, belastbare Belege statt formaler grüner Statusanzeigen als Freigabekriterium verbindlich vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailkonfiguration spezifischer Policy-Gate-Werkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Unterscheidung zwischen formalem grünen Status und tatsächlich belastbarer, unabhängiger Prüfung, nicht die werkzeugspezifische Konfiguration."}}, "lab_validation": [{"lab_id": "KB-0534-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation eines formal grünen, aber inhaltlich nicht aussagekräftigen Gate-Status, kein produktives Policy-Gate-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein Policy Gate, der lediglich prüft, ob ein Test-Schritt 'erfolgreich' beendet wurde (Exit-Code 0), auch dann grün anzeigt, wenn die zugrunde liegenden Tests aufgrund eines Konfigurationsfehlers gar nicht tatsächlich ausgeführt wurden, und zeigt damit, warum ein Gate zusätzlich die tatsächliche Ausführung und inhaltliche Aussagekraft des Belegs prüfen muss, nicht nur den formalen Erfolgsstatus.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Policy-Gate-System."}]}
---
# Policy Gates für die Lieferkette

> **Ziel:** Ein Policy Gate verbindet mehrere Sicherheits- und Qualitätsprüfungen (Signaturverifikation, siehe [KB-0530](18-slsa-und-build-provenienz.md); Dependency-Scans, siehe [KB-0533](21-dependency-security-und-scanning.md); Tests) zu einer verbindlichen Freigaberegel, die vor einem kritischen Schritt (Merge, Deployment) durchgesetzt wird. Der zentrale Punkt dieses Kapitels ist die Unterscheidung zwischen einem **formalen grünen Statusanzeige** (ein Prüfschritt hat technisch mit Erfolgscode geendet) und einem **tatsächlich belastbaren, unabhängigen Beleg** (der Prüfschritt hat tatsächlich das geprüft, was er zu prüfen vorgibt, und liefert ein inhaltlich aussagekräftiges Ergebnis) — ein Gate, das lediglich auf den formalen Erfolgsstatus eines Prüfschritts reagiert, kann fälschlich grün anzeigen, wenn der Prüfschritt selbst fehlkonfiguriert ist (etwa Tests, die aufgrund eines Konfigurationsfehlers gar nicht tatsächlich ausgeführt werden, aber dennoch mit Erfolgscode enden) — dies ist dieselbe strukturelle Falle wie das allgemeine "grün, aber blind"-Problem bei automatisierten Prüfungen: Ein formal erfolgreicher Status ersetzt nicht die Verifikation, dass tatsächlich etwas Aussagekräftiges geprüft wurde.

## Zweck, Mental Model und Dependencies

Policy Gates adressieren das Problem, dass einzelne Sicherheits- und Qualitätsprüfungen (Signaturverifikation, Schwachstellen-Scans, Tests) isoliert betrachtet lückenhaften Schutz bieten, wenn nicht sichergestellt ist, dass alle relevanten Prüfungen tatsächlich vor einem kritischen Schritt bestanden wurden — ein Gate bündelt diese einzelnen Signale zu einer einzigen, verbindlichen Freigaberegel, die einen Merge oder ein Deployment blockiert, solange nicht alle konfigurierten Bedingungen erfüllt sind. Die entscheidende Fallgrube liegt jedoch darin, was ein Gate tatsächlich als "erfüllt" interpretiert: Ein naiv implementiertes Gate prüft lediglich, ob ein vorgelagerter Prüfschritt mit einem formalen Erfolgscode (etwa Exit-Code 0) beendet wurde, ohne zu verifizieren, dass dieser Prüfschritt tatsächlich das inhaltlich Beabsichtigte geprüft hat. Ein Testlauf, der aufgrund eines Konfigurationsfehlers (etwa ein falscher Testpfad, eine fehlende Testdatenbank-Verbindung) tatsächlich null Tests ausführt, kann dennoch mit Erfolgscode enden — formal "grün", aber inhaltlich bedeutungslos, da nichts tatsächlich geprüft wurde. Ein belastbares Gate muss daher über die reine Erfolgscode-Prüfung hinausgehen und explizit verifizieren, dass der Prüfschritt tatsächlich eine aussagekräftige Anzahl an Prüfungen durchgeführt hat (etwa eine Mindestanzahl ausgeführter Tests, eine tatsächlich vorhandene Signatur statt eines übersprungenen Verifikationsschritts, ein tatsächlich vollständiger statt abgebrochener Scan). Zeitlich begrenzte Ausnahmen von einem Gate (etwa für einen dringenden Hotfix, bei dem eine vollständige Prüfung den Zeitrahmen sprengen würde) müssen explizit als solche dokumentiert werden — mit einem konkreten Grund, einer verantwortlichen Person, und einem festen Ablaufdatum — statt als dauerhafte, unbegründete Umgehung des Gates zu bestehen, was strukturell dieselbe Lücken-Problematik erzeugt wie die bereits behandelten Admission-Policy-Ausnahmen (siehe [KB-0532](20-image-signing-und-admission-vertrauen.md)).

~~~text
Policy Gate: bundles multiple checks (signature verification KB-0530, dependency scans KB-0533, tests)
  -> single, binding release rule blocking merge/deployment until ALL configured conditions met
CRITICAL PITFALL: what does a gate actually count as "passed"?
  naive gate: checks ONLY formal success code (exit 0) of an upstream check step
    -> test run failing to execute ANY tests due to misconfig (wrong path, missing DB conn)
       CAN STILL end with success code -> formally GREEN, but meaningless -- NOTHING was actually checked
  same structural trap as general "green-but-blind" problem with automated checks
BELASTBARES gate MUST go beyond success-code check
  -> verify MEANINGFUL execution: min. number of tests actually run, signature actually present (not skipped),
     scan actually completed (not aborted)
Time-limited EXCEPTIONS (e.g. urgent hotfix, full check would blow deadline)
  MUST be explicitly documented: concrete reason, responsible person, FIXED expiry date
  -> NOT a permanent, unexplained bypass (same gap pattern as Admission Policy exceptions, KB-0532)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Formaler grüner Status | technisches Erfolgssignal eines Prüfschritts | allein unzureichend, kann bei Fehlkonfiguration trügen |
| Unabhängiger, belastbarer Beleg | inhaltlich aussagekräftiges Prüfergebnis | tatsächliches Freigabekriterium |
| Gate-Bündelung | verbindliche Verknüpfung mehrerer Prüfungen | verhindert lückenhaften Schutz durch isolierte Einzelprüfungen |
| Zeitlich begrenzte Ausnahmen | dokumentierte, terminierte Umgehung mit Begründung | verhindert dauerhafte, unbegründete Gate-Umgehung |

Implementierung: Für jeden Prüfschritt innerhalb eines Gates wird explizit verifiziert, dass er inhaltlich aussagekräftig ausgeführt wurde (Mindestanzahl an Tests, tatsächlich vorhandene Signatur, vollständiger Scan), nicht nur, dass er formal mit Erfolgscode endete. Ausnahmen vom Gate werden explizit mit Grund, verantwortlicher Person und festem Ablaufdatum dokumentiert, statt dauerhaft und unbegründet zu bestehen. Das Gate wird regelmäßig darauf geprüft, ob abgelaufene Ausnahmen tatsächlich entfernt wurden.

## Scalability, Reliability, Security und Observability

Policy Gates skalieren die tatsächliche Schutzwirkung proportional zur inhaltlichen Aussagekraft der geprüften Bedingungen; die Reliability-Grenze liegt darin, dass ein Gate, der nur formale Erfolgscodes statt inhaltlich belastbarer Belege prüft, proportional zur Häufigkeit stiller Fehlkonfigurationen fälschlich freigegebene, tatsächlich fehlerhafte Änderungen zulässt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine tatsächlich fehlerhafte Änderung wird trotz grünem Gate freigegeben | ein zugrunde liegender Prüfschritt endete formal erfolgreich, ohne inhaltlich aussagekräftig geprüft zu haben (z. B. null tatsächlich ausgeführte Tests) | die inhaltliche Aussagekraft jedes Prüfschritts explizit verifizieren, nicht nur den formalen Erfolgscode |
| eine Gate-Ausnahme besteht seit langer Zeit ohne erkennbaren aktuellen Grund | die Ausnahme wurde für einen temporären Zweck eingerichtet und nie wieder entfernt, ohne festes Ablaufdatum | ein festes Ablaufdatum für jede Ausnahme durchsetzen und abgelaufene Ausnahmen automatisch entfernen |
| verschiedene Prüfungen (Signatur, Scan, Tests) werden isoliert statt als verbindliches Gate durchgesetzt | keine gebündelte Gate-Regel verknüpft alle relevanten Prüfungen zu einer einzigen Freigabebedingung | ein zentrales Policy Gate einrichten, das alle relevanten Prüfungen verbindlich verknüpft |

Security: Gates sollten explizit gegen Umgehungsversuche (etwa das absichtliche Erzeugen eines formal erfolgreichen, aber inhaltlich leeren Prüfschritts) abgesichert werden, indem sie Mindestanforderungen an die tatsächliche Prüfausführung durchsetzen. Observability: Die Anzahl aktiver Gate-Ausnahmen und deren Alter, die tatsächliche inhaltliche Aussagekraft (nicht nur Erfolgscode) der Gate-Prüfschritte, und die Häufigkeit nachträglich entdeckter, fälschlich freigegebener Änderungen sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert einen einzelnen Prüfschritt innerhalb eines Gates korrekt. **Principal** entwirft die vollständige Gate-Bündelung mit inhaltlicher Aussagekraftsprüfung und Ausnahmeprozess für eine Lieferkette. **Chief** legt unternehmensweite Standards für Policy Gates fest, die unabhängige, belastbare Belege statt formaler grüner Statusanzeigen verbindlich vorschreiben.

Anti-Patterns: ein Gate ausschließlich auf formale Erfolgscodes statt inhaltlich belastbare Prüfergebnisse stützen; Ausnahmen von einem Gate ohne festes Ablaufdatum und Begründung dauerhaft bestehen lassen; einzelne Sicherheits- oder Qualitätsprüfungen isoliert statt zu einer verbindlichen, gebündelten Gate-Regel verknüpft betreiben.

## Production Checklist

- [ ] Jeder Prüfschritt innerhalb eines Gates wird auf inhaltliche Aussagekraft, nicht nur formalen Erfolgscode, verifiziert.
- [ ] Ausnahmen vom Gate sind explizit mit Grund, verantwortlicher Person und festem Ablaufdatum dokumentiert.
- [ ] Abgelaufene Gate-Ausnahmen werden regelmäßig identifiziert und entfernt.
- [ ] Alle relevanten Prüfungen (Signatur, Scan, Tests) sind zu einer verbindlichen, gebündelten Gate-Regel verknüpft.

## Interviewfragen

### 1. Was ist der zentrale Unterschied zwischen einem formalen grünen Status und einem unabhängigen, belastbaren Beleg?

**Antwort:** Ein formaler grüner Status zeigt lediglich, dass ein Prüfschritt technisch mit Erfolgscode endete; ein unabhängiger, belastbarer Beleg bestätigt, dass tatsächlich inhaltlich aussagekräftig geprüft wurde.

### 2. Wie kann ein Gate trotz fehlerhafter Änderung grün anzeigen?

**Antwort:** Wenn ein zugrunde liegender Prüfschritt (z. B. ein Testlauf) aufgrund einer Fehlkonfiguration tatsächlich nichts prüft, aber dennoch mit Erfolgscode endet, wodurch das Gate formal, aber nicht inhaltlich, "bestanden" wird.

### 3. Was muss ein belastbares Gate zusätzlich zur Erfolgscode-Prüfung verifizieren?

**Antwort:** Die tatsächliche, inhaltlich aussagekräftige Ausführung des Prüfschritts, etwa eine Mindestanzahl tatsächlich ausgeführter Tests oder eine tatsächlich vorhandene, nicht übersprungene Signaturverifikation.

### 4. Was muss eine zeitlich begrenzte Gate-Ausnahme enthalten, um nicht zu einer dauerhaften Lücke zu werden?

**Antwort:** Einen konkreten Grund, eine verantwortliche Person, und ein festes Ablaufdatum, statt unbegründet und dauerhaft zu bestehen.

### 5. Wie gehst du vor, wenn eine tatsächlich fehlerhafte Änderung trotz grünem Gate freigegeben wurde?

**Antwort:** Ich prüfe, ob der zugrunde liegende Prüfschritt formal erfolgreich endete, ohne inhaltlich aussagekräftig zu prüfen, und ergänze das Gate um eine explizite Verifikation der tatsächlichen, inhaltlichen Prüfausführung.

### 6. Widersprüchliche Anforderung: Team will schnelle, unblockierte Deployments ohne Verzögerung durch strenge Gates UND garantiert, dass keine tatsächlich fehlerhafte Änderung jemals freigegeben wird — wie gehst du vor?

**Antwort:** Ich würde erklären, dass Geschwindigkeit und garantierte Fehlerfreiheit sich nicht durch ein schwächeres, oberflächliches Gate vereinbaren lassen, sondern durch ein Gate, das effizient, aber inhaltlich belastbar prüft — und für tatsächliche Notfälle einen expliziten, terminierten Ausnahmeprozess statt eines dauerhaft geschwächten Gates vorschlagen.

## Praktische Labs

~~~python
# Local, deterministic simulation of a formally-green but meaningless gate check (executed locally, no real gate system):

def evaluate_gate(exit_code, tests_actually_run, min_required_tests):
    formally_passed = exit_code == 0
    meaningfully_passed = formally_passed and tests_actually_run >= min_required_tests
    return {
        "formally_green": formally_passed,
        "meaningfully_passed": meaningfully_passed,
    }

print(evaluate_gate(exit_code=0, tests_actually_run=0, min_required_tests=50))
print(evaluate_gate(exit_code=0, tests_actually_run=120, min_required_tests=50))
~~~

## Dependencies, Cross-References und Quellen

1. OpenSSF-Dokumentation: [Supply-chain Levels for Software Artifacts (SLSA) — Verification Summary Attestations](https://slsa.dev/spec/v1.0/verification_summary), abgerufen 2026-09-18.
2. Google-Dokumentation: [DevOps Tech: Continuous Testing](https://cloud.google.com/architecture/devops/devops-tech-test-automation), abgerufen 2026-09-18.

SLSA und Build-Provenienz sind kanonisch in [KB-0530](18-slsa-und-build-provenienz.md) behandelt; Dependency Security und Scanning in [KB-0533](21-dependency-security-und-scanning.md); Image Signing und Admission-Vertrauen (Ausnahme-Lücken-Parallele) in [KB-0532](20-image-signing-und-admission-vertrauen.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte Verification Summary Attestations, die inhaltliche Prüfergebnisse statt nur formaler Erfolgscodes kryptographisch bezeugen | Evaluating | Gegenüber eigenentwickelter, inhaltlicher Gate-Verifikationslogik erst nach Prüfung der tatsächlichen Standardisierungsreife und Toolchain-Unterstützung bevorzugen. |

Ein Team akzeptiert ein Policy Gate erst, wenn nachweislich inhaltlich belastbare Belege statt bloßer formaler grüner Statusanzeigen als Freigabekriterium durchgesetzt werden und alle Ausnahmen zeitlich begrenzt sowie begründet sind.
