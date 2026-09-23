---
{"id": "KB-0379", "title": "Docker und OCI", "domain": "16", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["PLATFORM", "GENAI", "CLOUD"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Image mit reproduzierbarem Build erstellen, dessen Digest referenzieren statt eines veränderlichen Tags, und den Container rootless ausführen.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Entscheiden, wann Container-Runtime-Grenzen (Docker/OCI) ausreichen und wann eine Orchestrierungsebene (Kubernetes) tatsächlich benötigt wird.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Ein Produktionsproblem auf die Verwendung eines veränderlichen Image-Tags statt eines unveränderlichen Digests zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unveränderliche Image-Referenzierung über Digests als Standard für produktive Deployments im Unternehmen etablieren, gegenüber veränderlichen Tags.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Detaillierte OCI-Registry-Protokollimplementierungen sind Vertiefung.", "rationale": "Kern ist das Verständnis von Image-Layern, Tags vs. Digests und Runtime-Grenzen, nicht die Registry-Protokolldetails."}}, "lab_validation": [{"lab_id": "KB-0379-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal gebautes Docker-Image mit Vergleich von Tag- und Digest-Referenzierung", "evidence": "Ein Image wird zweimal unter demselben Tag gebaut und gepusht, wobei sich der Inhalt zwischen den Builds ändert; eine Referenzierung über den Tag liefert bei erneutem Pull den jeweils neuesten, potenziell unerwarteten Inhalt, während eine Referenzierung über den unveränderlichen Digest stets exakt den ursprünglich geprüften Inhalt liefert.", "limitations": "Keine produktive Registry-Infrastruktur, kein realer Geschäftsdatensatz, lokale Docker-Umgebung."}]}
---
# Docker und OCI

> **Ziel:** Docker implementiert die Open Container Initiative (OCI)-Spezifikationen für Image-Layer (geschichtete, wiederverwendbare Dateisystemebenen), Registryformate (wie Images gespeichert und verteilt werden) und Runtime-Grenzen (wie ein Container von Host und anderen Containern isoliert wird). Der zentrale Punkt dieses Kapitels ist die technische Unterscheidung zwischen Docker/OCI als Container-Runtime-Ebene und Kubernetes als Orchestrierungsebene, sowie die praktisch entscheidende Unterscheidung zwischen veränderlichen Image-Tags und unveränderlichen Image-Digests für reproduzierbare, sichere Deployments.

## Zweck, Mental Model und Dependencies

Ein OCI-Image besteht aus mehreren übereinandergelegten, unveränderlichen Layern (jede Layer repräsentiert eine Dateisystemänderung, z. B. das Hinzufügen einer Bibliothek); diese Layer-Struktur ermöglicht effiziente Speicherung und Übertragung, da gemeinsame Layer zwischen mehreren Images wiederverwendet werden können. Ein Image-Tag (z. B. "myapp:latest") ist ein menschenlesbarer, aber veränderlicher Name, der jederzeit auf ein anderes Image umgelenkt werden kann — ein erneuter Build unter demselben Tag ersetzt die vorherige Zuordnung. Ein Image-Digest (ein kryptografischer Hash des Image-Inhalts) identifiziert dagegen ein exaktes, unveränderliches Image eindeutig — derselbe Digest referenziert immer exakt denselben Inhalt, unabhängig davon, wie viele neue Images später unter demselben Tag veröffentlicht werden. Docker/OCI definiert die Runtime-Grenzen eines einzelnen Containers (Prozessisolation, Dateisystem-Namespace, Ressourcenlimits), löst aber nicht die Frage, wie viele Container-Instanzen über mehrere Maschinen hinweg koordiniert, skaliert und bei Ausfall neu gestartet werden — dies ist die Aufgabe einer Orchestrierungsebene wie Kubernetes, die auf der Docker/OCI-Runtime-Ebene aufbaut, aber ein grundsätzlich anderes Problem (Verteilung und Koordination vieler Container statt Isolation eines einzelnen) löst.

~~~text
OCI image: stacked, IMMUTABLE layers (each = a filesystem change) -> efficient storage/transfer via layer reuse
Image tag (e.g. "myapp:latest"): human-readable but MUTABLE -- can be repointed to a different image anytime
Image digest: cryptographic hash of image content -- IMMUTABLE, identifies an exact image uniquely, forever
  same digest = same content, regardless of how many new images get published under the same tag later
Docker/OCI runtime: defines a SINGLE container's boundaries (process isolation, filesystem namespace, resource limits)
  does NOT solve: coordinating/scaling/restarting MANY containers across MANY machines
  -> that's Kubernetes' job -- builds ON TOP of Docker/OCI, solves a DIFFERENT problem (distribution/coordination, not isolation)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Eigenschaft | Praktische Konsequenz |
|---|---|---|
| Image-Layer | geschichtet, unveränderlich, wiederverwendbar | effiziente Speicherung/Übertragung durch geteilte Layer |
| Image-Tag | menschenlesbar, veränderlich | kann jederzeit auf anderen Inhalt umgelenkt werden — nicht reproduzierbar |
| Image-Digest | kryptografischer Hash, unveränderlich | referenziert immer exakt denselben, geprüften Inhalt — reproduzierbar |
| Docker/OCI-Runtime | isoliert einen einzelnen Container | löst nicht Koordination/Skalierung mehrerer Container (Kubernetes-Aufgabe) |

Implementierung: Für reproduzierbare Builds wird ein Image deterministisch aus einem versionierten Dockerfile mit fixierten Basis-Image-Digests (nicht Tags) gebaut. Produktive Deployments referenzieren Images ausschließlich über ihren unveränderlichen Digest, nie über einen veränderlichen Tag wie "latest", um sicherzustellen, dass exakt das geprüfte Image tatsächlich deployt wird. Container werden, wo möglich, rootless betrieben (der Container-Prozess läuft nicht mit Root-Rechten auf dem Host), um die Auswirkung eines Container-Ausbruchs zu begrenzen. Die Entscheidung, ob eine reine Docker/OCI-Runtime ausreicht oder eine Orchestrierungsebene wie Kubernetes benötigt wird, richtet sich danach, ob mehrere Container-Instanzen über mehrere Maschinen koordiniert, automatisch skaliert oder bei Ausfall automatisch neu gestartet werden müssen.

## Scalability, Reliability, Security und Observability

Docker/OCI-Runtime-Grenzen skalieren Isolation pro Container unabhängig von der Anzahl der Instanzen; die Reliability-Grenze liegt darin, dass eine Referenzierung über veränderliche Tags proportional zur Häufigkeit neuer Image-Veröffentlichungen das Risiko unbeabsichtigter, nicht reproduzierbarer Deployments erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Deployment verhält sich nach einem erneuten Pull plötzlich anders, obwohl keine Konfigurationsänderung vorgenommen wurde | das Deployment referenziert einen veränderlichen Tag, der inzwischen auf ein anderes Image zeigt | das Deployment auf Referenzierung über den unveränderlichen Digest umstellen |
| ein Container-Ausbruch verschafft einem Angreifer Root-Zugriff auf den Host | der Container wurde nicht rootless betrieben | den Container so konfigurieren, dass der Prozess nicht mit Root-Rechten auf dem Host läuft |
| ein Team benötigt manuelle Skripte, um mehrere Container-Ausfälle über verschiedene Maschinen hinweg zu erkennen und neu zu starten | eine reine Docker/OCI-Runtime ohne Orchestrierungsebene wird für ein Problem verwendet, das Koordination über mehrere Maschinen erfordert | eine Orchestrierungsebene wie Kubernetes einführen, die genau dieses Koordinationsproblem löst |

Security: Rootless-Betrieb und die Verwendung unveränderlicher Digests statt veränderlicher Tags sind zentrale Sicherheitsmaßnahmen, die sowohl die Auswirkung eines Container-Ausbruchs begrenzen als auch verhindern, dass ein manipuliertes oder unbeabsichtigt geändertes Image unter demselben Tag unbemerkt in Produktion gelangt. Observability: Der Anteil produktiver Deployments, die über Digest statt Tag referenzieren, sowie der Anteil rootless betriebener Container, sind zentrale Sicherheitsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Digest-basierte Image-Referenzierung und rootless-Betrieb für produktive Container. **Principal** macht die Unterscheidung zwischen Tag und Digest für das Team nachvollziehbar. **Chief** etabliert unveränderliche Image-Referenzierung über Digests als Standard für produktive Deployments im Unternehmen.

Anti-Patterns: produktive Deployments über veränderliche Tags wie "latest" statt unveränderlicher Digests referenzieren; Container standardmäßig mit Root-Rechten statt rootless betreiben; eine Orchestrierungsebene wie Kubernetes einführen, obwohl eine einzelne Docker/OCI-Runtime für den tatsächlichen Bedarf ausreichen würde.

## Production Checklist

- [ ] Produktive Deployments referenzieren Images über unveränderliche Digests, nicht veränderliche Tags.
- [ ] Container werden, wo möglich, rootless betrieben.
- [ ] Basis-Images in Dockerfiles sind über Digest, nicht Tag, fixiert, für reproduzierbare Builds.
- [ ] Die Entscheidung für/gegen eine Orchestrierungsebene basiert auf tatsächlichem Koordinations-/Skalierungsbedarf.

## Interviewfragen

### 1. Was ist der Unterschied zwischen einem Image-Tag und einem Image-Digest?

**Antwort:** Ein Tag ist ein menschenlesbarer, aber veränderlicher Name, der jederzeit auf ein anderes Image umgelenkt werden kann; ein Digest ist ein kryptografischer Hash, der ein exaktes, unveränderliches Image eindeutig identifiziert.

### 2. Warum sollten produktive Deployments über Digest statt Tag referenzieren?

**Antwort:** Ein Digest garantiert, dass immer exakt derselbe, geprüfte Inhalt deployt wird, während ein Tag jederzeit unbemerkt auf ein anderes, ungeprüftes Image umgelenkt werden kann.

### 3. Welches Problem löst Docker/OCI nicht, das Kubernetes löst?

**Antwort:** Docker/OCI definiert die Isolationsgrenzen eines einzelnen Containers, löst aber nicht die Koordination, Skalierung und automatische Wiederherstellung vieler Container-Instanzen über mehrere Maschinen hinweg.

### 4. Warum ist Rootless-Betrieb eine wichtige Sicherheitsmaßnahme?

**Antwort:** Er begrenzt die Auswirkung eines Container-Ausbruchs, da der Container-Prozess ohne Root-Rechte auf dem Host läuft.

### 5. Wie gehst du vor, wenn sich ein Deployment nach einem erneuten Pull unerwartet anders verhält?

**Antwort:** Ich prüfe, ob das Deployment einen veränderlichen Tag statt eines unveränderlichen Digests referenziert, und stelle bei Bedarf auf Digest-Referenzierung um.

### 6. Widersprüchliche Anforderung: Team will einfache, menschenlesbare Image-Referenzen UND garantiert reproduzierbare, unveränderliche Deployments — wie gehst du vor?

**Antwort:** Ich würde beide Referenzen kombinieren: einen menschenlesbaren Tag für die Kommunikation und Dokumentation verwenden, aber das tatsächliche Deployment technisch über den zugehörigen, zum Build-Zeitpunkt festgehaltenen Digest referenzieren, sodass Lesbarkeit und Reproduzierbarkeit nicht gegeneinander ausgespielt werden müssen.

## Praktische Labs

~~~python
# Konzeptioneller Ablauf typischer Docker-Kommandos (nicht in dieser Umgebung ausgeführt):
commands_demonstrating_tag_mutability = [
    "docker build -t myapp:latest .",       # build 1
    "docker push myapp:latest",
    "docker inspect --format='{{.Id}}' myapp:latest",  # note digest_1
    # ... code changes ...
    "docker build -t myapp:latest .",       # build 2, SAME tag, DIFFERENT content
    "docker push myapp:latest",
    "docker inspect --format='{{.Id}}' myapp:latest",  # digest_2 -- DIFFERENT from digest_1!
    # Production referencing by TAG would now silently get build 2's content.
    # Production referencing by DIGEST (myapp@sha256:digest_1) would STILL get build 1's exact content.
]

for step, cmd in enumerate(commands_demonstrating_tag_mutability, 1):
    print(f"{step}. {cmd}")

print("\nKEY TAKEAWAY: 'myapp:latest' is a moving pointer; 'myapp@sha256:<digest>' is a fixed, verifiable identity.")
~~~

## Dependencies, Cross-References und Quellen

1. Open Container Initiative: [OCI Image Format Specification](https://github.com/opencontainers/image-spec), abgerufen 2026-09-17.
2. Docker-Dokumentation: [Best practices for writing Dockerfiles](https://docs.docker.com/build/building/best-practices/), abgerufen 2026-09-17.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Digest-Pinning-Werkzeuge, die Tags in Deployment-Manifesten automatisch durch aktuelle Digests ersetzen | Adopting | Gegenüber manuellem Digest-Nachschlagen für konsistentere, weniger fehleranfällige Referenzierung bevorzugen. |
| Rootless-Container-Runtimes als Standardkonfiguration statt optionaler Härtungsmaßnahme | Adopting | Gegenüber Root-Standardbetrieb für konsequent reduzierte Angriffsfläche bevorzugen. |

Ein Team akzeptiert ein produktives Deployment erst, wenn es über einen unveränderlichen Digest statt eines veränderlichen Tags referenziert.
