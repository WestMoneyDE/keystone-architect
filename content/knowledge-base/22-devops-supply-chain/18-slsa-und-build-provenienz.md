---
{"id": "KB-0530", "title": "SLSA und Build-Provenienz", "domain": "22", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0518", "concepts": ["Pipeline-Architektur"], "needed_for": "understanding"}, {"id": "KB-0529", "concepts": ["SBOM und Komponenteninventare"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Build-Provenienz-Attestations anhand offizieller SLSA-Dokumentation für einen isolierten, überprüfbaren Build-Prozess korrekt einordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Lieferkette explizit entscheiden, welche SLSA-Nachweisstufe für welche Artefakte angemessen ist, und die Grenzen dessen, was Provenienz tatsächlich nachweist, korrekt kommunizieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine falsche Annahme, dass eine hohe SLSA-Nachweisstufe automatisch Schwachstellenfreiheit garantiert, auf eine Verwechslung von Build-Integrität mit Code-Qualität zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Supply-Chain-Sicherheitsstandards anhand realistischer SLSA-Nachweisstufen-Ziele statt einer missverstandenen, umfassenden Sicherheitsgarantie festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne kryptographische Implementierung spezifischer Attestation-Signaturmechanismen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der Nachweisstufen und deren tatsächlichem Aussagebereich, nicht die kryptographische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0530-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand offizieller SLSA-Spezifikation zu Nachweisstufen, isolierten Buildern und Attestations, kein aktives SLSA-Tooling verwendet", "evidence": "Anhand der offiziellen SLSA-Spezifikation wird nachvollzogen, wie aufsteigende SLSA-Stufen zunehmend strengere Anforderungen an Build-Isolation, Reproduzierbarkeit und Nachweisbarkeit der Build-Herkunft stellen, wie eine Attestation kryptographisch bestätigt, dass ein Artefakt von einem bestimmten, überprüfbaren Build-Prozess aus einem bestimmten Quellcode-Commit erzeugt wurde, und dass SLSA explizit nur die Integrität und Nachvollziehbarkeit des Build-Prozesses selbst nachweist, nicht die Abwesenheit von Schwachstellen im Code oder in Abhängigkeiten.", "limitations": "Kein aktives SLSA-Tooling verwendet, keine reale Attestation erstellt."}]}
---
# SLSA und Build-Provenienz

> **Ziel:** SLSA (Supply-chain Levels for Software Artifacts) definiert aufsteigende **Nachweisstufen**, die zunehmend strengere Anforderungen an die Nachvollziehbarkeit und Integrität eines Build-Prozesses stellen — von grundlegender Dokumentation der Build-Herkunft bis zu vollständig isolierten, reproduzierbaren Buildern, deren Ausgabe kryptographisch signierte **Attestations** trägt. Eine Attestation bestätigt kryptographisch überprüfbar, dass ein spezifisches Artefakt tatsächlich von einem bestimmten, nachvollziehbaren Build-Prozess aus einem bestimmten Quellcode-Commit erzeugt wurde. Der zentrale Punkt dieses Kapitels ist eine häufige, folgenreiche Fehlinterpretation: SLSA weist ausschließlich die **Integrität und Nachvollziehbarkeit des Build-Prozesses selbst** nach — dass ein Artefakt tatsächlich aus dem behaupteten Quellcode über den behaupteten, nicht manipulierten Build-Prozess entstanden ist — nicht aber die **Abwesenheit von Schwachstellen** im Code oder in dessen Abhängigkeiten. Eine hohe SLSA-Stufe garantiert, dass niemand den Build-Prozess unbemerkt manipuliert hat, sagt aber nichts darüber aus, ob der ursprüngliche Code selbst fehlerfrei oder frei von Schwachstellen ist — diese Frage adressiert die SBOM-basierte Schwachstellenprüfung (siehe [KB-0529](17-sbom-und-komponenteninventare.md)), ein separates, komplementäres Anliegen.

## Zweck, Mental Model und Dependencies

SLSA adressiert eine spezifische Klasse von Supply-Chain-Angriffen: die Manipulation des Build-Prozesses selbst, unabhängig von Schwachstellen im ursprünglichen Quellcode — ein Angreifer, der Zugriff auf die Build-Infrastruktur erlangt, könnte ein Artefakt erzeugen, das scheinbar aus einem legitimen, geprüften Quellcode-Commit stammt, tatsächlich aber zusätzlichen, bösartigen Code enthält, der während des Build-Prozesses unbemerkt eingeschleust wurde. Niedrigere SLSA-Stufen verlangen grundlegende Dokumentation, welcher Build-Prozess ein Artefakt erzeugt hat (Provenienz-Metadaten), während höhere Stufen zunehmend striktere technische Garantien fordern: ein isolierter Builder (der Build-Prozess läuft in einer Umgebung, die nicht von anderen, potenziell manipulierten Builds beeinflusst werden kann), Nicht-Fälschbarkeit der Provenienz-Metadaten (kryptographisch signiert, sodass eine nachträgliche Manipulation der Metadaten selbst erkennbar wäre), und in den höchsten Stufen reproduzierbare Builds (derselbe Quellcode erzeugt bei wiederholter, unabhängiger Ausführung des Build-Prozesses stets ein bitweise identisches Artefakt, was eine unabhängige Verifikation ohne Vertrauen in die ursprüngliche Build-Infrastruktur ermöglicht). Eine Attestation ist das konkrete, überprüfbare Artefakt dieser Garantien — ein signiertes Dokument, das kryptographisch verifizierbar bestätigt, welcher Build-Prozess, mit welcher Konfiguration, aus welchem Quellcode-Commit, welches Artefakt erzeugt hat. Die entscheidende konzeptionelle Grenze ist, dass all dies ausschließlich Aussagen über den **Build-Prozess** trifft — SLSA verifiziert nicht, ob der Quellcode selbst korrekt, fehlerfrei, oder frei von bekannten Schwachstellen in seinen Abhängigkeiten ist. Ein Artefakt kann eine höchste SLSA-Stufe mit vollständiger, kryptographisch verifizierter Build-Provenienz aufweisen und gleichzeitig eine kritische, bekannte Schwachstelle in einer Abhängigkeit enthalten — beide Eigenschaften (Build-Integrität und Code-/Abhängigkeitssicherheit) sind unabhängig voneinander und müssen getrennt adressiert werden, wobei letztere durch SBOM-basierte, kontinuierliche Schwachstellenprüfung abgedeckt wird (siehe [KB-0529](17-sbom-und-komponenteninventare.md)).

~~~text
SLSA (Supply-chain Levels for Software Artifacts): ascending PROVENANCE/BUILD-INTEGRITY levels
  addresses: manipulation of the BUILD PROCESS itself (not source code quality)
    attacker with build infra access -> could inject malicious code during build, undetected
  lower levels: basic provenance documentation (which build process produced this artifact)
  higher levels: isolated builder (build env unaffected by other/manipulated builds)
              + tamper-resistant, cryptographically SIGNED provenance metadata
              + (highest levels) REPRODUCIBLE builds -> same source = bitwise-identical artifact
                -> independent verification WITHOUT trusting original build infra
Attestation: concrete, verifiable artifact of these guarantees
  signed document cryptographically confirming: WHICH build process, WHICH config, WHICH source commit -> WHICH artifact
CRITICAL CONCEPTUAL BOUNDARY: SLSA verifies ONLY the BUILD PROCESS
  does NOT verify: source code correctness, absence of known vulnerabilities in dependencies
  -> highest SLSA level + verified build provenance CAN COEXIST with a critical known vulnerability in a dependency
  -> BUILD INTEGRITY and CODE/DEPENDENCY SECURITY are independent, both must be addressed separately
     (latter = SBOM-based continuous vulnerability checking, see KB-0529)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| SLSA-Nachweisstufen | aufsteigende Anforderungen an Build-Nachvollziehbarkeit/Integrität | müssen anhand tatsächlicher Risikolage der Artefakte gewählt werden |
| Isolierter Builder | Build-Umgebung unbeeinflusst von anderen/manipulierten Builds | verhindert Cross-Contamination zwischen Builds |
| Attestation | kryptographisch signierter Provenienz-Nachweis | verifiziert Build-Herkunft, nicht Code-Qualität |
| Grenze zur Schwachstellenprüfung | SLSA und SBOM adressieren unabhängige Risiken | beide müssen getrennt, komplementär adressiert werden |

Implementierung: Für jede Artefaktkategorie wird explizit die angemessene SLSA-Nachweisstufe anhand ihrer tatsächlichen Kritikalität und Angriffsflächen-Exposition gewählt, statt pauschal die höchste oder niedrigste Stufe für alle Artefakte anzustreben. SLSA-Attestations werden konsequent mit SBOM-basierter, kontinuierlicher Schwachstellenprüfung kombiniert, statt eine der beiden als ausreichenden alleinigen Sicherheitsnachweis zu behandeln. Kommunikation zu SLSA-Konformität wird explizit auf deren tatsächlichen Aussagebereich (Build-Integrität) begrenzt, ohne implizit Code-Qualität oder Schwachstellenfreiheit zu suggerieren.

## Scalability, Reliability, Security und Observability

SLSA skaliert den Schutz vor Build-Prozess-Manipulation proportional zur gewählten Nachweisstufe; die Reliability-Grenze liegt darin, dass eine Fehlinterpretation von SLSA als umfassender Sicherheitsnachweis (statt spezifisch Build-Integrität) proportional zur Verwechslungshäufigkeit zu einer falschen Risikobewertung führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Artefakt mit höchster SLSA-Stufe enthält dennoch eine bekannte, kritische Schwachstelle | SLSA und SBOM-basierte Schwachstellenprüfung wurden fälschlich als austauschbar oder redundant behandelt | explizit prüfen, ob eine kontinuierliche SBOM-Schwachstellenprüfung zusätzlich zur SLSA-Attestation existiert |
| eine Compliance-Anforderung wird fälschlich als "vollständig erfüllt" durch SLSA-Konformität allein eingestuft | die Kommunikation zu SLSA vermischt Build-Integrität mit umfassender Sicherheitsgarantie | die tatsächliche Aussagegrenze von SLSA (Build-Prozess-Integrität) explizit von Code-/Abhängigkeitssicherheit trennen |
| eine Attestation kann für ein Artefakt nicht verifiziert werden | der Build-Prozess erfüllt die für die angestrebte SLSA-Stufe erforderliche Isolation oder Signatur-Infrastruktur nicht | die tatsächliche Build-Infrastruktur-Konfiguration gegen die Anforderungen der angestrebten SLSA-Stufe prüfen |

Security: SLSA-Attestations sollten kryptographisch verifiziert werden, bevor ein Artefakt als vertrauenswürdig hinsichtlich seiner Build-Herkunft behandelt wird, und diese Verifikation ersetzt nicht die separate, kontinuierliche Schwachstellenprüfung. Observability: Die tatsächliche SLSA-Stufenabdeckung über alle Artefaktkategorien hinweg, sowie die Konsistenz der Attestation-Verifikation in Deployment-Prozessen, sind zentrale Supply-Chain-Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert einen Build-Prozess, der die Anforderungen einer gegebenen SLSA-Stufe erfüllt. **Principal** entscheidet, welche SLSA-Nachweisstufe für welche Artefaktkategorie angemessen ist, basierend auf tatsächlicher Kritikalität. **Chief** legt unternehmensweite Supply-Chain-Sicherheitsstandards fest, die SLSA und SBOM-basierte Schwachstellenprüfung als komplementäre, nicht austauschbare Anforderungen definieren.

Anti-Patterns: SLSA-Konformität als vollständigen Sicherheitsnachweis kommunizieren, ohne die Begrenzung auf Build-Integrität zu klären; eine pauschale, höchste SLSA-Stufe für alle Artefakte anstreben, ohne die tatsächliche Kritikalität zu differenzieren; SLSA-Attestations ohne begleitende, kontinuierliche SBOM-Schwachstellenprüfung als ausreichend betrachten.

## Production Checklist

- [ ] Die SLSA-Nachweisstufe pro Artefaktkategorie ist explizit anhand tatsächlicher Kritikalität gewählt.
- [ ] SLSA-Attestations werden vor Deployment kryptographisch verifiziert.
- [ ] SLSA-Konformität wird kommuniziert mit expliziter Klarstellung, dass sie nur Build-Integrität, nicht Code-Sicherheit, nachweist.
- [ ] SLSA-Attestations werden konsequent mit kontinuierlicher SBOM-Schwachstellenprüfung kombiniert.

## Interviewfragen

### 1. Welche Klasse von Angriffen adressiert SLSA primär?

**Antwort:** Die Manipulation des Build-Prozesses selbst, etwa durch einen Angreifer mit Zugriff auf die Build-Infrastruktur, der unbemerkt bösartigen Code während des Builds einschleust.

### 2. Was bestätigt eine SLSA-Attestation konkret?

**Antwort:** Kryptographisch verifizierbar, welcher Build-Prozess mit welcher Konfiguration aus welchem Quellcode-Commit ein bestimmtes Artefakt erzeugt hat.

### 3. Was verifiziert SLSA explizit nicht?

**Antwort:** Die Korrektheit des Quellcodes selbst oder die Abwesenheit bekannter Schwachstellen in Abhängigkeiten — dies ist die Aufgabe separater, SBOM-basierter Schwachstellenprüfung.

### 4. Kann ein Artefakt gleichzeitig höchste SLSA-Konformität und eine bekannte kritische Schwachstelle aufweisen?

**Antwort:** Ja, da Build-Integrität (SLSA) und Code-/Abhängigkeitssicherheit (SBOM-Schwachstellenprüfung) unabhängige Eigenschaften sind, die getrennt adressiert werden müssen.

### 5. Wie gehst du vor, wenn ein Artefakt mit höchster SLSA-Stufe dennoch eine bekannte, kritische Schwachstelle enthält?

**Antwort:** Ich prüfe, ob SLSA und SBOM-basierte Schwachstellenprüfung fälschlich als austauschbar behandelt wurden, und stelle sicher, dass eine kontinuierliche Schwachstellenprüfung zusätzlich zur SLSA-Attestation existiert, da beide unterschiedliche, komplementäre Risiken adressieren.

### 6. Widersprüchliche Anforderung: Compliance-Team will SLSA-Konformität als vollständigen, alleinigen Nachweis für Supply-Chain-Sicherheit UND tatsächlich umfassenden Schutz vor bekannten Software-Schwachstellen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass SLSA ausschließlich Build-Prozess-Integrität nachweist, nicht Code- oder Abhängigkeitssicherheit, und vorschlagen, den Compliance-Nachweis explizit um kontinuierliche SBOM-basierte Schwachstellenprüfung zu ergänzen — beide Ziele erfordern getrennte, komplementäre Maßnahmen, die nicht durch SLSA-Konformität allein erfüllt werden können.

## Praktische Labs

~~~python
# Conceptual separation of build provenance verification and vulnerability status (not executed against a real SLSA/SBOM system):

def assess_artifact(slsa_level, provenance_verified, has_known_vulnerability):
    build_integrity_ok = provenance_verified and slsa_level >= 3
    return {
        "build_integrity_verified": build_integrity_ok,
        "code_dependency_security_ok": not has_known_vulnerability,
        "overall_safe_to_deploy": build_integrity_ok and not has_known_vulnerability,
    }

print(assess_artifact(slsa_level=4, provenance_verified=True, has_known_vulnerability=True))
print(assess_artifact(slsa_level=4, provenance_verified=True, has_known_vulnerability=False))
~~~

## Dependencies, Cross-References und Quellen

1. SLSA-Dokumentation: [SLSA Specification — Levels](https://slsa.dev/spec/v1.0/levels), abgerufen 2026-09-18.
2. SLSA-Dokumentation: [SLSA Specification — Provenance](https://slsa.dev/spec/v1.0/provenance), abgerufen 2026-09-18.

Pipeline-Architektur ist kanonisch in [KB-0518](06-pipeline-architektur.md) behandelt; SBOM und Komponenteninventare in [KB-0529](17-sbom-und-komponenteninventare.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte In-Toto-basierte Layout-Verifikation für vollständige, mehrstufige Lieferkettenabschnitte über einzelne Build-Provenienz hinaus | Evaluating | Gegenüber isolierter SLSA-Attestation pro Build-Schritt erst nach Prüfung der tatsächlichen Integrationskomplexität für die konkrete, mehrstufige Lieferkette bevorzugen. |

Ein Team akzeptiert eine SLSA-Implementierung erst, wenn deren Aussagebereich (Build-Integrität) klar von Code-/Abhängigkeitssicherheit abgegrenzt kommuniziert wird und beide Aspekte durch komplementäre Maßnahmen abgedeckt sind.
