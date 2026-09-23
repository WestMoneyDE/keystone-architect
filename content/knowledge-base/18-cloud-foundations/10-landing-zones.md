---
{"id": "KB-0450", "title": "Landing Zones", "domain": "18", "sequence": 10, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "ENTERPRISE"], "requires": [{"id": "KB-0444", "concepts": ["Cloud-IAM-Grundarchitektur"], "needed_for": "understanding"}, {"id": "KB-0443", "concepts": ["Cloud-Netzwerkmodelle"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine minimale Landing Zone (Organisationsstruktur, Basisnetzwerk, grundlegende Schutzvorgaben) anhand offizieller Cloud-Anbieter-Dokumentation als Ausgangsumgebung für neue Workloads definieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Landing-Zone-Architektur für ein konkretes Unternehmen gestalten, die Bootstrap-Reihenfolge, Erweiterbarkeit für neue Teams und Ownership-Grenzen explizit und nachvollziehbar dokumentiert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartete Governance-Lücke bei einem neuen Cloud-Workload auf eine unvollständig definierte oder nicht durchgesetzte Landing-Zone-Vorgabe zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Landing-Zone-Standards im Unternehmen als verbindliche Ausgangsumgebung für jeden neuen Cloud-Workload etablieren, statt jedem Team eine eigene, inkonsistente Ausgangskonfiguration zu überlassen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die interne Implementierung spezifischer Landing-Zone-Automatisierungswerkzeuge eines Cloud-Anbieters im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Organisationsstruktur, Bootstrap und Ownership als Entscheidungsgrundlage, nicht die anbieterspezifische Automatisierungswerkzeug-Interna."}}, "lab_validation": [{"lab_id": "KB-0450-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Einordnung anhand öffentlich verfügbarer Landing-Zone-Dokumentation großer Cloud-Anbieter, kein aktives Cloud-Konto verwendet", "evidence": "Anhand öffentlich verfügbarer Dokumentation wird nachvollzogen, wie eine Landing Zone Organisationsstruktur (siehe Cloud-IAM-Grundarchitektur, KB-0444), Basisnetzwerke (siehe Cloud-Netzwerkmodelle, KB-0443) und grundlegende Schutzvorgaben als konsistente Ausgangsumgebung für neue Workloads definiert, und warum eine klare Ownership-Zuordnung für die Landing Zone selbst notwendig ist.", "limitations": "Kein aktives Cloud-Deployment getestet, keine reale Landing Zone erstellt."}]}
---
# Landing Zones

> **Ziel:** Eine Landing Zone ist eine vordefinierte, konsistente Ausgangsumgebung für neue Cloud-Workloads, die Organisationsstruktur (siehe Cloud-IAM-Grundarchitektur, [KB-0444](04-cloud-iam-grundarchitektur.md)), Basisnetzwerke (siehe Cloud-Netzwerkmodelle, [KB-0443](03-cloud-netzwerkmodelle.md)) und grundlegende Schutzvorgaben (z. B. verpflichtende Sicherheitsrichtlinien, Protokollierungsanforderungen) bereits vor der ersten Nutzung durch ein Team etabliert, statt jedem Team zu überlassen, diese Grundlagen individuell und potenziell inkonsistent selbst aufzubauen. Der zentrale Punkt dieses Kapitels ist, dass eine Landing Zone drei Eigenschaften gleichzeitig erfüllen muss, um ihren Zweck zu erfüllen — ein nachvollziehbarer Bootstrap-Prozess (wie die Landing Zone selbst erstellt und initialisiert wird), Erweiterbarkeit (wie neue Teams oder Workloads innerhalb der etablierten Struktur aufgenommen werden, ohne die Landing Zone bei jeder Erweiterung grundlegend neu zu gestalten), und eine klare Ownership-Zuordnung (wer für die Landing Zone selbst, im Unterschied zu den darin betriebenen Workloads, verantwortlich ist) — das Fehlen einer dieser drei Eigenschaften führt typischerweise zu Governance-Lücken, selbst wenn die anderen beiden gut umgesetzt sind.

## Zweck, Mental Model und Dependencies

Ohne eine Landing Zone müsste jedes Team, das einen neuen Cloud-Workload einführt, eigenständig grundlegende Entscheidungen treffen — welche Organisationsstruktur und IAM-Hierarchie genutzt wird, wie Netzwerke isoliert und verbunden werden, welche Sicherheits- und Protokollierungsrichtlinien gelten — was bei mehreren Teams zu inkonsistenten, potenziell unsicheren oder schwer zu überwachenden Ausgangskonfigurationen führt. Eine Landing Zone etabliert diese Grundlagen zentral und im Voraus, sodass ein neues Team eine bereits konsistente, sichere Ausgangsumgebung vorfindet, in der es seinen Workload einführen kann, ohne diese grundlegenden Entscheidungen selbst treffen zu müssen. Der Bootstrap-Prozess beschreibt, wie die Landing Zone selbst erstellt wird — dieser Prozess sollte nachvollziehbar und idealerweise automatisiert (z. B. über Infrastructure as Code) sein, damit die Landing Zone selbst reproduzierbar und versioniert ist, statt als einmalig manuell erstellte, nicht dokumentierte Konfiguration zu existieren. Erweiterbarkeit bedeutet, dass die Landing Zone so gestaltet ist, dass neue Teams oder Workloads innerhalb der etablierten Struktur (z. B. als neues Konto/Projekt innerhalb der Organisationshierarchie) aufgenommen werden können, ohne die Kernstruktur der Landing Zone bei jeder Erweiterung grundlegend zu verändern. Der zentrale methodische Punkt ist, dass eine klare Ownership-Zuordnung für die Landing Zone selbst (getrennt von der Ownership der darin betriebenen einzelnen Workloads) notwendig ist — ohne ein klar zuständiges Team für die Landing-Zone-Infrastruktur selbst (Basisnetzwerke, übergreifende Sicherheitsrichtlinien, Organisationsstruktur) kann diese über die Zeit inkonsistent verändert oder unzureichend gepflegt werden, selbst wenn einzelne Workloads innerhalb der Landing Zone gut verwaltet sind.

~~~text
WITHOUT a landing zone: each team introducing a new workload makes foundational decisions INDEPENDENTLY
  -> org structure/IAM, network isolation, security/logging policies -> INCONSISTENT across teams
Landing zone: establishes these foundations CENTRALLY, UPFRONT
  -> new team finds an already-consistent, secure starting environment
THREE properties needed SIMULTANEOUSLY:
  1. Bootstrap process: how the landing zone ITSELF is created (ideally IaC-automated, reproducible, versioned)
  2. Extensibility: new teams/workloads onboarded WITHIN the established structure
     without redesigning the core structure each time
  3. Clear ownership: WHO owns the landing zone ITSELF (separate from workload ownership WITHIN it)
KEY METHODOLOGICAL POINT: missing ANY ONE of these three properties
  -> governance gaps emerge even if the other two are well-implemented
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Bootstrap-Prozess | erstellt die Landing Zone reproduzierbar | sollte automatisiert und versioniert sein, nicht manuell und undokumentiert |
| Erweiterbarkeit | ermöglicht Aufnahme neuer Teams/Workloads | Kernstruktur sollte nicht bei jeder Erweiterung neu gestaltet werden müssen |
| Ownership der Landing Zone | klare Verantwortlichkeit für die Basisinfrastruktur selbst | getrennt von der Ownership einzelner, darin betriebener Workloads |
| Schutzvorgaben | grundlegende Sicherheits-/Protokollierungsrichtlinien | müssen für alle innerhalb der Landing Zone betriebenen Workloads gelten |

Implementierung: Der Bootstrap-Prozess einer Landing Zone wird als Infrastructure-as-Code-Definition umgesetzt, sodass die Landing Zone reproduzierbar, versioniert und nachvollziehbar veränderbar ist, statt als einmalig manuell erstellte Konfiguration zu existieren. Die Erweiterbarkeit wird durch eine klar definierte, wiederholbare Prozedur für die Aufnahme neuer Teams oder Workloads sichergestellt (z. B. ein standardisiertes neues Konto/Projekt innerhalb der Organisationshierarchie mit vordefinierten Basisrichtlinien). Ein konkretes, dediziertes Team wird als Owner der Landing-Zone-Infrastruktur selbst benannt, getrennt von den Teams, die einzelne Workloads innerhalb der Landing Zone betreiben, um eine konsistente Pflege der Basisinfrastruktur über die Zeit sicherzustellen.

## Scalability, Reliability, Security und Observability

Eine gut gestaltete Landing Zone skaliert die Konsistenz und Sicherheit neuer Cloud-Workloads proportional zur Vollständigkeit ihrer Bootstrap-, Erweiterbarkeits- und Ownership-Eigenschaften; die Reliability-Grenze liegt darin, dass eine fehlende oder unklare Ownership-Zuordnung für die Landing Zone selbst proportional zur Anzahl der Teams, die innerhalb der Landing Zone arbeiten, zu einer schleichenden, unkontrollierten Drift der Basisinfrastruktur führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein neuer Cloud-Workload wird ohne die vorgesehenen Basisrichtlinien (Netzwerk, Sicherheit) eingeführt | die Landing Zone bietet keine klar definierte, wiederholbare Aufnahmeprozedur für neue Workloads | die Erweiterbarkeitsprozedur der Landing Zone prüfen und gegebenenfalls standardisieren |
| die Basisinfrastruktur der Landing Zone weist über die Zeit inkonsistente, undokumentierte Änderungen auf | kein klar zuständiges Team besitzt die Ownership für die Landing Zone selbst | ein dediziertes Team als Owner der Landing-Zone-Infrastruktur benennen |
| die Landing Zone lässt sich nicht reproduzierbar in einer neuen Umgebung (z. B. für Disaster Recovery) nachbauen | der Bootstrap-Prozess ist nicht als Infrastructure as Code dokumentiert und automatisiert | den Bootstrap-Prozess in versionierte, automatisierte Infrastructure-as-Code-Definitionen überführen |

Security: Eine Landing Zone sollte grundlegende, verpflichtende Sicherheitsrichtlinien (z. B. Protokollierung, Netzwerkisolation-Standards) für alle darin betriebenen Workloads durchsetzen, statt diese als optionale Empfehlungen zu behandeln, die einzelne Teams möglicherweise nicht umsetzen. Observability: Die Konsistenz der Basisinfrastruktur über alle innerhalb der Landing Zone betriebenen Konten/Projekte hinweg, sowie die Einhaltung der Erweiterbarkeitsprozedur bei neuen Team-Aufnahmen, sind zentrale Kontrollpunkte.

## Trade-offs und Entscheidungen

**Staff** implementiert den Bootstrap-Prozess einer Landing Zone als reproduzierbare, versionierte Infrastructure-as-Code-Definition. **Principal** macht die Erweiterbarkeitsprozedur und Ownership-Struktur für das Team nachvollziehbar. **Chief** etabliert Landing-Zone-Standards im Unternehmen als verbindliche Ausgangsumgebung für jeden neuen Cloud-Workload.

Anti-Patterns: jedem Team eine eigene, individuelle Ausgangskonfiguration für neue Cloud-Workloads überlassen, statt eine konsistente Landing Zone zu etablieren; eine Landing Zone ohne dokumentierten, automatisierten Bootstrap-Prozess manuell erstellen; die Ownership der Landing-Zone-Infrastruktur selbst ungeklärt lassen, während einzelne Workload-Teams innerhalb der Landing Zone klar definiert sind.

## Production Checklist

- [ ] Der Bootstrap-Prozess der Landing Zone ist als versionierte, reproduzierbare Infrastructure-as-Code-Definition dokumentiert.
- [ ] Eine klar definierte, wiederholbare Prozedur für die Aufnahme neuer Teams/Workloads existiert.
- [ ] Ein dediziertes Team ist als Owner der Landing-Zone-Infrastruktur selbst benannt.
- [ ] Die Konsistenz der Basisinfrastruktur über alle betriebenen Konten/Projekte hinweg wird überwacht.

## Interviewfragen

### 1. Was ist eine Landing Zone, und welches Problem löst sie?

**Antwort:** Eine vordefinierte, konsistente Ausgangsumgebung (Organisationsstruktur, Basisnetzwerke, Schutzvorgaben) für neue Cloud-Workloads, die verhindert, dass jedes Team diese Grundlagen individuell und potenziell inkonsistent selbst aufbauen muss.

### 2. Welche drei Eigenschaften muss eine Landing Zone gleichzeitig erfüllen?

**Antwort:** Einen nachvollziehbaren Bootstrap-Prozess, Erweiterbarkeit für neue Teams/Workloads, und eine klare Ownership-Zuordnung für die Landing Zone selbst.

### 3. Warum sollte der Bootstrap-Prozess einer Landing Zone automatisiert und versioniert sein?

**Antwort:** Damit die Landing Zone reproduzierbar und nachvollziehbar veränderbar ist, statt als einmalig manuell erstellte, undokumentierte Konfiguration zu existieren, die sich nicht zuverlässig neu erstellen lässt.

### 4. Was passiert, wenn die Ownership der Landing Zone selbst unklar bleibt?

**Antwort:** Die Basisinfrastruktur kann über die Zeit inkonsistent verändert oder unzureichend gepflegt werden, selbst wenn einzelne Workloads innerhalb der Landing Zone gut verwaltet sind.

### 5. Wie gehst du vor, wenn ein neuer Cloud-Workload ohne die vorgesehenen Basisrichtlinien eingeführt wird?

**Antwort:** Ich prüfe, ob die Landing Zone eine klar definierte, wiederholbare Aufnahmeprozedur für neue Workloads bietet, und standardisiere diese gegebenenfalls, um zukünftige Abweichungen zu verhindern.

### 6. Widersprüchliche Anforderung: Ein Team will schnelle, unkomplizierte Einführung neuer Workloads UND die Organisation will strikte, konsistente Governance über alle Workloads hinweg — wie gehst du vor?

**Antwort:** Ich würde die Landing Zone so gestalten, dass die Aufnahme neuer Workloads innerhalb der etablierten Struktur (Erweiterbarkeit) schnell und standardisiert erfolgt, sodass Teams keine grundlegenden Governance-Entscheidungen selbst treffen müssen, wodurch beide Ziele — Geschwindigkeit und Konsistenz — gleichzeitig erreicht werden.

## Praktische Labs

~~~python
# Conceptual landing zone completeness check (not executed against a real cloud account):

def check_landing_zone_completeness(has_iac_bootstrap, has_onboarding_procedure, has_dedicated_owner_team):
    missing = []
    if not has_iac_bootstrap:
        missing.append("bootstrap process not reproducible/automated")
    if not has_onboarding_procedure:
        missing.append("no clear, repeatable extensibility procedure")
    if not has_dedicated_owner_team:
        missing.append("no dedicated ownership for the landing zone itself")
    return {"complete": len(missing) == 0, "gaps": missing}

result = check_landing_zone_completeness(
    has_iac_bootstrap=True,
    has_onboarding_procedure=True,
    has_dedicated_owner_team=False,  # gap: no clear owner
)

print(result)
~~~

## Dependencies, Cross-References und Quellen

1. AWS-Dokumentation: [AWS Control Tower — Landing Zone Concepts](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html), abgerufen 2026-09-18.
2. Google Cloud-Dokumentation: [Landing Zone Design Guide](https://cloud.google.com/architecture/landing-zones), abgerufen 2026-09-18.

Cloud-IAM-Grundarchitektur ist kanonisch in [KB-0444](04-cloud-iam-grundarchitektur.md) behandelt; Cloud-Netzwerkmodelle in [KB-0443](03-cloud-netzwerkmodelle.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, anbieternative Landing-Zone-Automatisierungswerkzeuge mit integrierter Compliance-Prüfung | Adopting | Gegenüber selbst entwickelten Infrastructure-as-Code-Lösungen bevorzugen, sobald deren Abdeckung der eigenen Governance-Anforderungen geprüft ist. |

Ein Team akzeptiert eine Landing-Zone-Architektur erst, wenn ihr Bootstrap-Prozess reproduzierbar dokumentiert, eine klare Erweiterbarkeitsprozedur definiert und eine eindeutige, dedizierte Ownership für die Landing Zone selbst benannt ist.
