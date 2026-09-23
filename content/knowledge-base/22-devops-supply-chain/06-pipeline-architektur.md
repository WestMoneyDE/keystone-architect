---
{"id": "KB-0518", "title": "Pipeline-Architektur", "domain": "22", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["PLATFORM", "MLOPS", "CLOUD"], "requires": [{"id": "KB-0515", "concepts": ["GitHub Actions"], "needed_for": "context"}, {"id": "KB-0517", "concepts": ["Jenkins im Bestandsumfeld"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Build-, Test- und Deployment-Phasen einer Pipeline getrennt modellieren und Trust Boundaries zwischen ihnen korrekt einrichten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für einen konkreten Lieferpfad explizit entscheiden, wo Trust Boundaries liegen müssen und wie Wiederholbarkeit sowie belastbare Gate-Ergebnisse über den gesamten Pipeline-Verlauf sichergestellt werden.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartet unterschiedliches Verhalten zwischen einem lokal getesteten Artefakt und dem tatsächlich deployten Artefakt auf eine verletzte Wiederholbarkeit oder eine fehlende Artefakt-Identität über die Pipeline-Phasen hinweg zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Pipeline-Architektur-Standards anhand klarer Trust-Boundary-Trennung zwischen Build, Test und Deployment sowie verifizierbarer Gate-Ergebnisse festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailkonfiguration spezifischer Pipeline-Werkzeuge (GitHub Actions, GitLab CI, Jenkins) im Detail ist in den jeweiligen Kapiteln behandelt.", "rationale": "Kern dieses Kapitels ist die werkzeugunabhängige Architekturebene (Phasentrennung, Trust Boundaries, Wiederholbarkeit), nicht die werkzeugspezifische Konfiguration."}}, "lab_validation": [{"lab_id": "KB-0518-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Artefakt-Identität über Pipeline-Phasen, kein produktives Pipeline-System verwendet", "evidence": "Ein lokales Skript simuliert, wie ein einmal gebautes Artefakt mit eindeutiger Identität (z. B. Content-Hash) über Test- und Deployment-Phasen hinweg unverändert weitergegeben werden muss, um sicherzustellen, dass genau das getestete Artefakt auch deployt wird, statt ein Artefakt jeder Phase neu zu bauen, was zu Abweichungen zwischen getesteter und deployter Version führen kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Pipeline-System mit tatsächlicher Build-Umgebungsdynamik."}]}
---
# Pipeline-Architektur

> **Ziel:** Eine belastbare Pipeline-Architektur trennt **Build** (Kompilierung/Paketierung des Codes zu einem eindeutig identifizierbaren Artefakt), **Test** (Verifikation des Artefakts, nicht erneuter Build) und **Deployment** (Bereitstellung genau desselben, bereits getesteten Artefakts) als drei getrennte, aufeinanderfolgende Phasen mit klaren **Trust Boundaries** dazwischen. Der zentrale Punkt dieses Kapitels ist, dass ein unerwartet unterschiedliches Verhalten zwischen einem lokal getesteten Artefakt und dem tatsächlich deployten Artefakt fast immer auf eine verletzte Wiederholbarkeit hindeutet — typischerweise, weil das Artefakt in der Test- und der Deployment-Phase jeweils neu gebaut wurde (statt ein einmal gebautes, eindeutig identifiziertes Artefakt unverändert durch die Pipeline weiterzugeben), wodurch subtile Unterschiede in der Build-Umgebung (Abhängigkeitsversionen, Compiler-Flags, Zeitstempel) zwischen den beiden separaten Builds ein Artefakt erzeugen können, das sich vom getesteten Artefakt unterscheidet, obwohl beide aus demselben Quellcode stammen.

## Zweck, Mental Model und Dependencies

Die Trennung von Build, Test und Deployment adressiert ein fundamentales Vertrauensproblem: Ein Gate-Ergebnis (etwa "alle Tests bestanden") ist nur dann belastbar, wenn es sich tatsächlich auf das Artefakt bezieht, das später deployt wird — wird das Artefakt zwischen Test und Deployment erneut gebaut, bezieht sich das Testergebnis streng genommen auf ein anderes, wenn auch aus demselben Quellcode erzeugtes Artefakt, dessen tatsächliches Verhalten aufgrund von Build-Umgebungsunterschieden (unterschiedliche Abhängigkeitsversionen bei erneuter Dependency-Auflösung, unterschiedliche Compiler- oder Interpreter-Versionen, nicht deterministische Build-Schritte) potenziell abweichen kann. Die korrekte Architektur baut das Artefakt genau einmal, versieht es mit einer eindeutigen, überprüfbaren Identität (etwa einem kryptographischen Content-Hash oder einer unveränderlichen Versionskennung), und reicht exakt dieses Artefakt unverändert durch Test- und Deployment-Phasen weiter — das Testergebnis bezieht sich dadurch garantiert auf genau das Artefakt, das letztlich deployt wird. Trust Boundaries markieren die Punkte, an denen die Pipeline explizit unterschiedlichen Vertrauensstufen unterliegt — etwa der Übergang von einer Build-Umgebung, die potenziell Code aus einem nicht vollständig vertrauenswürdigen Kontext verarbeitet (siehe die `pull_request`-versus-`pull_request_target`-Unterscheidung bei GitHub Actions, [KB-0515](03-github-actions.md)), zu einer Deployment-Umgebung mit Zugriff auf Produktions-Credentials — jede Grenze sollte explizit definieren, welche Daten und Berechtigungen sie überschreiten dürfen und welche nicht. Belastbare Gate-Ergebnisse erfordern zusätzlich, dass ein Gate (Test bestanden, Sicherheits-Scan bestanden, Genehmigung erteilt) untrennbar an die spezifische Artefakt-Identität gebunden ist, nicht nur an einen Commit-Hash oder Branch-Namen, da letztere sich auf mehrere, potenziell unterschiedlich gebaute Artefakte beziehen könnten.

~~~text
Pipeline architecture: Build -> Test -> Deployment, SEPARATE phases, clear TRUST BOUNDARIES between them
  Build: compile/package code to a UNIQUELY IDENTIFIABLE artifact (e.g. content hash)
  Test: verify the ARTIFACT (not a re-build)
  Deployment: deploy EXACTLY the same, already-tested artifact
CORE PRINCIPLE: build ONCE, carry the SAME artifact unchanged through test + deployment
  -> gate result ("tests passed") is only trustworthy if it refers to the ARTIFACT ACTUALLY DEPLOYED
  re-building between test and deploy -> subtle build-env differences (dep versions, compiler flags, timestamps)
    -> tested artifact != deployed artifact, even from SAME source code
Trust boundaries: explicit points where pipeline crosses trust levels
  e.g. build env handling potentially untrusted code (see pull_request vs pull_request_target, KB-0515)
       -> deployment env with production credential access
  -> each boundary MUST explicitly define what data/permissions may cross it
Gate results MUST bind to specific ARTIFACT IDENTITY, not just commit hash/branch name
  (commit/branch could correspond to MULTIPLE, differently-built artifacts)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Build-einmal-Prinzip | Artefakt wird genau einmal gebaut, eindeutig identifiziert | verhindert Abweichung zwischen getestetem und deploytem Artefakt |
| Artefakt-Identität | eindeutige, überprüfbare Kennung (z. B. Content-Hash) | bindet Gate-Ergebnisse an das tatsächliche Artefakt |
| Trust Boundaries | explizite Grenzen zwischen Vertrauensstufen | definieren, welche Daten/Berechtigungen sie überschreiten dürfen |
| Gate-Bindung | Gate-Ergebnisse an Artefakt-Identität statt Commit/Branch gebunden | verhindert Fehlinterpretation eines Testergebnisses für ein anderes Artefakt |

Implementierung: Jedes Artefakt wird in der Build-Phase genau einmal erzeugt und mit einer eindeutigen, überprüfbaren Identität versehen, die unverändert durch alle nachfolgenden Pipeline-Phasen weitergegeben wird, statt in jeder Phase neu gebaut zu werden. Trust Boundaries werden explizit dokumentiert, mit klaren Regeln, welche Daten und Berechtigungen jede Grenze überschreiten dürfen. Gate-Ergebnisse werden explizit an die Artefakt-Identität gebunden, statt sich implizit nur auf einen Commit-Hash oder Branch-Namen zu beziehen.

## Scalability, Reliability, Security und Observability

Pipeline-Architektur skaliert die Verlässlichkeit von Gate-Ergebnissen proportional zur konsequenten Einhaltung des Build-einmal-Prinzips; die Reliability-Grenze liegt darin, dass eine Verletzung dieses Prinzips (erneutes Bauen zwischen Test und Deployment) proportional zur Build-Umgebungsvolatilität zu unerwarteten Verhaltensabweichungen zwischen getestetem und deploytem Artefakt führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein deployter Dienst verhält sich anders als in der Testphase erwartet | das Artefakt wurde zwischen Test und Deployment erneut gebaut, statt unverändert weitergegeben zu werden | prüfen, ob dieselbe Artefakt-Identität (Content-Hash) über Test- und Deployment-Phase hinweg konsistent ist |
| ein Gate-Ergebnis erscheint für einen Deployment-Kandidaten fälschlich als bestanden | das Gate-Ergebnis ist an einen Commit-Hash statt an die spezifische Artefakt-Identität gebunden, und mehrere Artefakte stammen vom selben Commit | die Gate-Bindung explizit auf Artefakt-Identität statt Commit-Hash umstellen |
| sensible Produktions-Credentials sind in einer Build-Phase mit potenziell nicht vertrauenswürdigem Code zugänglich | keine explizite Trust Boundary trennt die Build-Phase von der Deployment-Phase mit Credential-Zugriff | eine explizite Trust Boundary einführen, die Credential-Zugriff auf die Deployment-Phase beschränkt |

Security: Trust Boundaries sollten explizit verhindern, dass potenziell nicht vertrauenswürdiger Code (etwa aus externen Pull Requests) in derselben Phase wie Produktions-Credentials ausgeführt wird. Observability: Die Konsistenz der Artefakt-Identität über alle Pipeline-Phasen hinweg, sowie die tatsächliche Bindung von Gate-Ergebnissen an spezifische Artefakte, sind zentrale Vertrauenssignale.

## Trade-offs und Entscheidungen

**Staff** implementiert eine Pipeline-Phase mit korrekter Artefakt-Weitergabe. **Principal** entwirft die vollständige Pipeline-Architektur mit expliziten Trust Boundaries zwischen Build, Test und Deployment. **Chief** legt unternehmensweite Pipeline-Architektur-Standards fest, die belastbare, artefaktgebundene Gate-Ergebnisse vorschreiben.

Anti-Patterns: ein Artefakt in jeder Pipeline-Phase erneut bauen statt einmal gebaut unverändert weiterzugeben; Gate-Ergebnisse an einen Commit-Hash oder Branch-Namen statt an eine spezifische Artefakt-Identität binden; Trust Boundaries zwischen potenziell nicht vertrauenswürdigem Code und Produktions-Credentials fehlen lassen.

## Production Checklist

- [ ] Jedes Artefakt wird genau einmal gebaut und mit eindeutiger Identität versehen.
- [ ] Dieselbe Artefakt-Identität wird unverändert durch Test- und Deployment-Phase weitergegeben.
- [ ] Gate-Ergebnisse sind explizit an die Artefakt-Identität, nicht nur an Commit-Hash oder Branch, gebunden.
- [ ] Trust Boundaries zwischen potenziell nicht vertrauenswürdigem Code und Produktions-Credentials sind explizit dokumentiert.

## Interviewfragen

### 1. Was ist das zentrale Prinzip einer belastbaren Pipeline-Architektur bezüglich Artefakten?

**Antwort:** Ein Artefakt wird genau einmal gebaut, mit eindeutiger Identität versehen, und unverändert durch Test- und Deployment-Phasen weitergegeben, statt in jeder Phase erneut gebaut zu werden.

### 2. Warum ist ein Gate-Ergebnis, das an einen Commit-Hash statt an eine Artefakt-Identität gebunden ist, potenziell unzuverlässig?

**Antwort:** Weil derselbe Commit-Hash mehreren, potenziell unterschiedlich gebauten Artefakten entsprechen könnte, wodurch das Gate-Ergebnis sich nicht eindeutig auf das tatsächlich deployte Artefakt bezieht.

### 3. Was ist eine Trust Boundary in einer Pipeline?

**Antwort:** Ein expliziter Punkt, an dem die Pipeline unterschiedliche Vertrauensstufen überschreitet, mit klar definierten Regeln, welche Daten und Berechtigungen diese Grenze überschreiten dürfen.

### 4. Warum kann ein erneut gebautes Artefakt sich vom ursprünglich getesteten Artefakt unterscheiden, obwohl beide aus demselben Quellcode stammen?

**Antwort:** Weil subtile Build-Umgebungsunterschiede (unterschiedliche Abhängigkeitsversionen, Compiler-Versionen, nicht deterministische Build-Schritte) zwischen zwei separaten Builds zu einem tatsächlich unterschiedlichen Artefakt führen können.

### 5. Wie gehst du vor, wenn ein deployter Dienst sich anders verhält als in der Testphase erwartet?

**Antwort:** Ich prüfe zuerst, ob dieselbe Artefakt-Identität über Test- und Deployment-Phase hinweg konsistent ist, da eine Verletzung des Build-einmal-Prinzips die häufigste Ursache für solche Abweichungen ist.

### 6. Widersprüchliche Anforderung: Team will maximale Pipeline-Geschwindigkeit durch parallele, umgebungsspezifische Builds für jede Zielumgebung UND garantiert, dass genau das getestete Artefakt deployt wird — wie gehst du vor?

**Antwort:** Ich würde erklären, dass umgebungsspezifische Builds und garantierte Artefakt-Konsistenz sich widersprechen, wenn der Build-Schritt pro Zielumgebung wiederholt wird, und vorschlagen, ein einziges, umgebungsunabhängiges Artefakt (z. B. ein Container-Image) einmal zu bauen und dieses unverändert mit umgebungsspezifischer Konfiguration (nicht umgebungsspezifischem Neu-Build) in jede Zielumgebung zu deployen.

## Praktische Labs

~~~python
# Local, deterministic simulation of artifact identity consistency across pipeline phases (executed locally, no real pipeline):

import hashlib

def build_artifact(source_code, build_env_version):
    content = f"{source_code}-{build_env_version}"
    return hashlib.sha256(content.encode()).hexdigest()

source_code = "app-v1"
tested_artifact = build_artifact(source_code, build_env_version="env-2026.09")
redeployed_artifact_different_env = build_artifact(source_code, build_env_version="env-2026.10")

print(f"tested artifact hash:    {tested_artifact}")
print(f"redeployed artifact hash: {redeployed_artifact_different_env}")
print(f"identical? {tested_artifact == redeployed_artifact_different_env}")
~~~

## Dependencies, Cross-References und Quellen

1. Google-Dokumentation: [DevOps Tech: Continuous Delivery](https://cloud.google.com/architecture/devops/devops-tech-continuous-delivery), abgerufen 2026-09-18.
2. SLSA-Dokumentation: [Build Requirements — Build as Code and Ephemeral Environment](https://slsa.dev/spec/v1.0/requirements), abgerufen 2026-09-18.

GitHub Actions ist kanonisch in [KB-0515](03-github-actions.md) behandelt; Jenkins im Bestandsumfeld in [KB-0517](05-jenkins-im-bestandsumfeld.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte Artefakt-Provenienz-Nachweise (z. B. SLSA-Attestierungen) zur kryptographisch überprüfbaren Bindung von Gate-Ergebnissen an spezifische Artefakte | Evaluating | Gegenüber informeller Artefakt-Identitätsverfolgung erst nach Prüfung des tatsächlichen Integrationsaufwands für die konkrete Pipeline-Toolchain bevorzugen. |

Ein Team akzeptiert eine Pipeline-Architektur erst, wenn nachweislich dasselbe, einmal gebaute Artefakt unverändert durch Test- und Deployment-Phasen läuft und Gate-Ergebnisse eindeutig an dessen Identität gebunden sind.
