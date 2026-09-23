---
{"id": "KB-0418", "title": "NVCR und GPU-Artefakte", "domain": "17", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "MLOPS"], "requires": [{"id": "KB-0379", "concepts": ["Docker und OCI"], "needed_for": "understanding"}, {"id": "KB-0414", "concepts": ["CUDA und Ausführungsmodelle"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein GPU-optimiertes Container-Image aus dem NVIDIA Container Registry (NVCR) referenzieren und dessen deklarierte Treiber-Kompatibilitätsanforderungen gegen die tatsächliche Host-Treiberversion prüfen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine GPU-Container-Versionsstrategie gestalten, die Herkunft und Versionsbindung von GPU-Images explizit nachvollziehbar hält, um reproduzierbare Laufzeitumgebungen sicherzustellen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein fehlgeschlagenes GPU-Container-Deployment auf eine konkrete Treiber-Inkompatibilität zwischen Container-Image und Host-System zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Nachvollziehbare Herkunfts- und Versionsprüfung für GPU-Container-Artefakte als Standard für reproduzierbare, produktive GPU-Laufzeiten im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte Lizenz-/Nutzungsbedingungsprüfung jedes einzelnen NVCR-Image-Typs im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Treiberkompatibilität und Versionsbindung, nicht jede spezifische Lizenzbedingung."}}, "lab_validation": [{"lab_id": "KB-0418-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Modell mit einer Treiberversionsinkompatibilität zwischen GPU-Container-Image und Host-System", "evidence": "Ein simuliertes GPU-Container-Image mit einer deklarierten Mindestanforderung an die Host-Treiberversion schlägt beim Start korrekt fehl, wenn die tatsächliche Host-Treiberversion diese Anforderung nicht erfüllt, während ein Image mit kompatibler Anforderung erfolgreich startet.", "limitations": "Kein reales GPU-Hardware-Deployment, kein produktives Containersystem, konzeptionelles Kompatibilitätsmodell."}]}
---
# NVCR und GPU-Artefakte

> **Ziel:** Der NVIDIA Container Registry (NVCR) ist ein spezialisierter Container-Katalog für GPU-optimierte Images, die auf den Docker/OCI-Grundlagen (siehe [KB-0379](../16-kubernetes-platform/01-docker-und-oci.md)) und den CUDA-Ausführungsgrundlagen (siehe [KB-0414](02-cuda-und-ausfuehrungsmodelle.md)) aufbauen. Der zentrale Punkt dieses Kapitels ist die praktische Prüfung dreier Aspekte für reproduzierbare GPU-Laufzeiten: Treiberkompatibilität (funktioniert das Container-Image tatsächlich mit der auf dem Host installierten GPU-Treiberversion), Herkunft und Versionsbindung (welches exakte Image mit welchen enthaltenen Bibliotheksversionen wird tatsächlich verwendet), und Nutzungsbedingungen (welche Lizenzeinschränkungen für die enthaltene GPU-Software gelten).

## Zweck, Mental Model und Dependencies

GPU-optimierte Container-Images unterscheiden sich von gewöhnlichen Container-Images durch eine zusätzliche, kritische Abhängigkeit: sie enthalten typischerweise vorinstallierte CUDA-Bibliotheken und andere GPU-Software, deren Funktionsfähigkeit von der auf dem Host-System installierten GPU-Treiberversion abhängt — im Gegensatz zu den meisten anderen Container-Abhängigkeiten, die vollständig im Image gekapselt sind, muss der GPU-Treiber selbst auf dem Host-System vorhanden sein und mit den im Container erwarteten CUDA-Bibliotheksversionen kompatibel sein. Ein Container-Image, das eine neuere CUDA-Version voraussetzt als der auf dem Host installierte Treiber unterstützt, schlägt beim Start oder bei der tatsächlichen GPU-Nutzung fehl, unabhängig davon, ob das Image selbst korrekt aufgebaut ist. Herkunft und Versionsbindung sind bei GPU-Images besonders wichtig, da unterschiedliche Image-Varianten desselben Basisnamens (z. B. unterschiedliche CUDA-Versionen, unterschiedliche Frameworks) leicht verwechselt werden können — eine explizite, nachvollziehbare Referenzierung über Digests statt Tags (analog zu den allgemeinen Docker/OCI-Grundlagen) ist bei GPU-Images noch kritischer, da eine unbeabsichtigte Versionsänderung nicht nur funktionale, sondern auch Treiberkompatibilitätsprobleme verursachen kann. Nutzungsbedingungen für NVCR-Images können spezifische Lizenzeinschränkungen enthalten (z. B. bezüglich kommerzieller Nutzung bestimmter enthaltener Software-Komponenten), die vor dem produktiven Einsatz explizit geprüft werden müssen, statt implizit anzunehmen, dass alle Container-Images gleichermaßen frei nutzbar sind.

~~~text
GPU-optimized container images: UNIQUE, CRITICAL dependency vs. regular images
  contain pre-installed CUDA libraries + other GPU software
  their functionality depends on the HOST's installed GPU driver version
  -> unlike most container dependencies (fully encapsulated in the image), the GPU driver MUST exist on the HOST
     and be COMPATIBLE with the CUDA library versions expected inside the container
  -> image requiring a NEWER CUDA version than the host driver supports FAILS at start/actual GPU use,
     regardless of whether the image itself is correctly built
Provenance/version pinning: ESPECIALLY critical for GPU images
  different image variants of the same base name (different CUDA versions, frameworks) easily confused
  -> digest-based referencing (not tags) even MORE critical than for regular images
  -> an unintended version change can cause BOTH functional AND driver compatibility problems
Usage terms: NVCR images can carry SPECIFIC licensing restrictions -- must be explicitly checked, not assumed uniform
~~~

## Core Concepts, Architektur und Implementierung

| Aspekt | Was zu prüfen ist | Risiko bei Vernachlässigung |
|---|---|---|
| Treiberkompatibilität | erforderliche CUDA-Version des Images gegen tatsächliche Host-Treiberversion | Start- oder Laufzeitfehler bei inkompatiblem Treiber |
| Herkunft/Versionsbindung | exakte Image-Identität über Digest statt Tag | unbeabsichtigte Versionsänderung kann funktionale und Treiberkompatibilitätsprobleme verursachen |
| Nutzungsbedingungen | spezifische Lizenzeinschränkungen der enthaltenen GPU-Software | rechtliche Risiken bei unerlaubter kommerzieller Nutzung bestimmter Komponenten |

Implementierung: Vor der Verwendung eines NVCR-Images wird die deklarierte, erforderliche CUDA-/Treiberversion explizit gegen die tatsächliche Host-Treiberversion geprüft, bevor das Deployment produktiv eingesetzt wird. Produktive GPU-Deployments referenzieren Images ausschließlich über ihren unveränderlichen Digest, analog zu den allgemeinen Docker/OCI-Grundlagen, um unbeabsichtigte Versionsänderungen mit potenziellen Treiberkompatibilitätsproblemen zu vermeiden. Nutzungsbedingungen der verwendeten NVCR-Images werden vor produktivem, insbesondere kommerziellem Einsatz explizit geprüft, statt implizit anzunehmen, dass keine Einschränkungen bestehen.

## Scalability, Reliability, Security und Observability

Digest-basierte, versionsgebundene GPU-Container-Referenzierung skaliert reproduzierbare Laufzeitumgebungen proportional zur Konsequenz ihrer Anwendung; die Reliability-Grenze liegt darin, dass eine unentdeckte Treiberinkompatibilität proportional zur Häufigkeit von Image- oder Host-Treiber-Updates zu unerwarteten Deployment-Fehlern führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein GPU-Container startet, kann aber tatsächlich nicht auf die GPU zugreifen oder liefert Fehler bei GPU-Operationen | die im Image erwartete CUDA-Version ist mit dem tatsächlichen Host-Treiber nicht kompatibel | die deklarierte CUDA-Anforderung des Images gegen die tatsächliche Host-Treiberversion prüfen |
| ein zuvor funktionierendes GPU-Deployment schlägt nach einem scheinbar unveränderten Image-Tag plötzlich fehl | das referenzierte Tag wurde unbemerkt auf ein anderes, inkompatibles Image aktualisiert | das Deployment auf Digest-basierte statt Tag-basierte Referenzierung umstellen |
| eine kommerzielle Nutzung eines NVCR-Images wird nachträglich als lizenzrechtlich problematisch identifiziert | die Nutzungsbedingungen des Images wurden vor dem produktiven Einsatz nicht geprüft | die Nutzungsbedingungen aller produktiv eingesetzten NVCR-Images nachträglich prüfen |

Security: Unklare Herkunft oder Versionsbindung von GPU-Container-Images kann dazu führen, dass unbeabsichtigt manipulierte oder veraltete, sicherheitsrelevante Software-Komponenten in Produktion gelangen; Digest-basierte Referenzierung ist auch hier eine zentrale Schutzmaßnahme. Observability: Der Anteil der GPU-Deployments mit Digest- statt Tag-basierter Referenzierung, sowie die dokumentierte Treiberkompatibilitätsprüfung pro Deployment, sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Digest-basierte Referenzierung und explizite Treiberkompatibilitätsprüfung für jedes produktive GPU-Container-Deployment. **Principal** macht Herkunft und Versionsbindung verwendeter GPU-Images für das Team nachvollziehbar. **Chief** etabliert nachvollziehbare Herkunfts- und Versionsprüfung für GPU-Container-Artefakte als Standard für reproduzierbare, produktive GPU-Laufzeiten im Unternehmen.

Anti-Patterns: GPU-Container-Images über veränderliche Tags statt unveränderlicher Digests referenzieren; die Treiberkompatibilität eines Images nicht vor dem produktiven Einsatz prüfen; Nutzungsbedingungen von NVCR-Images bei kommerziellem Einsatz ignorieren.

## Production Checklist

- [ ] Produktive GPU-Deployments referenzieren Images über unveränderliche Digests.
- [ ] Die erforderliche CUDA-/Treiberversion jedes Images ist gegen die tatsächliche Host-Treiberversion geprüft.
- [ ] Nutzungsbedingungen der verwendeten NVCR-Images sind vor produktivem Einsatz geprüft.
- [ ] Eine Aktualisierung des Host-Treibers wird gegen die Kompatibilitätsanforderungen bestehender GPU-Images geprüft.

## Interviewfragen

### 1. Warum ist Treiberkompatibilität bei GPU-Container-Images eine besondere, kritische Abhängigkeit?

**Antwort:** Im Gegensatz zu den meisten Container-Abhängigkeiten, die vollständig im Image gekapselt sind, muss der GPU-Treiber auf dem Host-System vorhanden und mit den im Container erwarteten CUDA-Bibliotheksversionen kompatibel sein.

### 2. Warum ist Digest-basierte statt Tag-basierte Referenzierung bei GPU-Images noch kritischer als bei gewöhnlichen Images?

**Antwort:** Eine unbeabsichtigte Versionsänderung kann bei GPU-Images nicht nur funktionale Probleme, sondern zusätzlich Treiberkompatibilitätsprobleme verursachen, die schwerer zu diagnostizieren sind.

### 3. Was passiert, wenn ein GPU-Container-Image eine neuere CUDA-Version voraussetzt als der Host-Treiber unterstützt?

**Antwort:** Der Container schlägt beim Start oder bei der tatsächlichen GPU-Nutzung fehl, unabhängig davon, ob das Image selbst korrekt aufgebaut ist.

### 4. Warum müssen Nutzungsbedingungen von NVCR-Images explizit geprüft werden?

**Antwort:** Sie können spezifische Lizenzeinschränkungen (z. B. bezüglich kommerzieller Nutzung bestimmter Komponenten) enthalten, die nicht implizit als einheitlich frei nutzbar angenommen werden dürfen.

### 5. Wie gehst du vor, wenn ein GPU-Container startet, aber tatsächlich nicht auf die GPU zugreifen kann?

**Antwort:** Ich prüfe die im Image deklarierte, erforderliche CUDA-Version gegen die tatsächliche, auf dem Host installierte Treiberversion, um eine Inkompatibilität zu identifizieren.

### 6. Widersprüchliche Anforderung: Team will schnelle, unkomplizierte GPU-Image-Updates UND garantiert keine Treiberkompatibilitätsprobleme in Produktion — wie gehst du vor?

**Antwort:** Ich würde eine automatisierte Kompatibilitätsprüfung als festen Bestandteil der Deployment-Pipeline etablieren, die die im neuen Image deklarierte CUDA-Anforderung automatisch gegen die tatsächliche Host-Treiberversion prüft, bevor ein Deployment produktiv fortgesetzt wird, sodass Updates schnell bleiben, aber inkompatible Kombinationen automatisch blockiert werden.

## Praktische Labs

~~~python
def check_driver_compatibility(image_required_cuda_version, host_driver_max_cuda_version):
    if image_required_cuda_version > host_driver_max_cuda_version:
        return False, (
            f"INCOMPATIBLE: image requires CUDA {image_required_cuda_version}, "
            f"but host driver only supports up to CUDA {host_driver_max_cuda_version}."
        )
    return True, f"Compatible: image requires CUDA {image_required_cuda_version}, host supports up to {host_driver_max_cuda_version}."

images = [
    {"name": "nvcr.io/nvidia/pytorch:24.01-py3", "required_cuda": 12.3},
    {"name": "nvcr.io/nvidia/pytorch:25.06-py3", "required_cuda": 12.8},
]

host_driver_max_cuda = 12.4

for image in images:
    compatible, message = check_driver_compatibility(image["required_cuda"], host_driver_max_cuda)
    status = "OK" if compatible else "BLOCKED"
    print(f"[{status}] {image['name']}: {message}")
~~~

## Dependencies, Cross-References und Quellen

1. NVIDIA-Dokumentation: [NGC Catalog — Container Images](https://catalog.ngc.nvidia.com/containers), abgerufen 2026-09-17.
2. NVIDIA-Dokumentation: [CUDA Compatibility](https://docs.nvidia.com/deploy/cuda-compatibility/index.html), abgerufen 2026-09-17.

Docker und OCI sind kanonisch in [KB-0379](../16-kubernetes-platform/01-docker-und-oci.md) behandelt; CUDA und Ausführungsmodelle in [KB-0414](02-cuda-und-ausfuehrungsmodelle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte CUDA-Forward-Compatibility-Mechanismen, die neuere CUDA-Versionen auf älteren Treibern teilweise unterstützen | Evaluating | Gegenüber striktem Versions-Matching abwägen, sobald die konkrete Forward-Compatibility-Unterstützung für den Anwendungsfall ausreichend verifiziert ist. |
| Automatisierte Treiberkompatibilitäts-Validierungswerkzeuge als fester Bestandteil der CI/CD-Pipeline für GPU-Deployments | Adopting | Gegenüber manueller Kompatibilitätsprüfung für zuverlässigere, automatisierte Erkennung vor Produktivsetzung bevorzugen. |

Ein Team akzeptiert ein GPU-Container-Deployment erst, wenn Treiberkompatibilität, Digest-basierte Versionsbindung und Nutzungsbedingungen geprüft sind.
