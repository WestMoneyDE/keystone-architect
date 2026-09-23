---
{"id": "KB-0634", "title": "Regulatorische Architektur und Residency", "domain": "26", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0618", "concepts": ["GDPR und Datenschutzarchitektur"], "needed_for": "understanding"}, {"id": "KB-0633", "concepts": ["Policy as Code für Governance"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Anwendbare Regelwerke, Jurisdiktionen und Datenstandorte für ein konkretes System anhand aktueller Primärquellen zusammenführen und widersprüchliche regulatorische Anforderungen technisch nachvollziehbar bearbeiten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete, international tätige Organisation explizit gestalten, wie regulatorische Architektur die zuvor in diesem Domain behandelten Bausteine (EU AI Act, GDPR, NIS2, DORA, Policy as Code) zu einer kohärenten, jurisdiktionsübergreifenden Systemarchitektur zusammenführt.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn zwei anwendbare Regelwerke tatsächlich widersprüchliche Anforderungen an dieselbe Systemarchitektur stellen, und dies von einer bloß scheinbaren, tatsächlich auflösbaren Unstimmigkeit unterscheiden können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für regulatorische Architektur festlegen, die widersprüchliche Anforderungen, Rechtsänderungen und kontrollierte Architektur-Anpassungen systematisch statt reaktiv bearbeiten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, juristische Detailauslegung einzelner, jurisdiktionsspezifischer Regelwerke im Detail ist Vertiefung und erfordert juristische Fachberatung in der jeweiligen Jurisdiktion.", "rationale": "Kern ist die technische Zusammenführung anwendbarer Anforderungen in eine kohärente Architektur, nicht die abschließende, juristische Auslegung einzelner Regelwerke."}}, "lab_validation": [{"lab_id": "KB-0634-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Erkennung widersprüchlicher Datenstandort-Anforderungen zwischen zwei Jurisdiktionen, kein produktives Compliance-Tool verwendet", "evidence": "Ein lokales Skript prüft für ein System mit Nutzern in zwei unterschiedlichen Jurisdiktionen, ob deren jeweilige Datenstandort-Anforderungen gleichzeitig erfüllbar sind, und identifiziert Fälle, die eine architektonische Trennung statt einer einzigen, gemeinsamen Lösung erfordern.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Compliance-Tool und keine juristische Beratung."}]}
---
# Regulatorische Architektur und Residency

> **Ziel:** Dieses abschließende Kapitel von Domain 26 führt die zuvor behandelten, regulatorischen Bausteine — EU AI Act ([KB-0617](01-eu-ai-act-und-systemklassifikation.md)), GDPR ([KB-0618](02-gdpr-und-datenschutzarchitektur.md)), NIS2, DORA, Policy as Code ([KB-0633](17-policy-as-code-fuer-governance.md)) — zu einer kohärenten, jurisdiktionsübergreifenden **regulatorischen Architektur** zusammen, die anwendbare Regelwerke, Jurisdiktionen und **Datenstandorte** (Data Residency — wo Daten tatsächlich physisch gespeichert und verarbeitet werden) systematisch verbindet. Der zentrale Punkt dieses Kapitels ist, dass eine international tätige Organisation häufig tatsächlich **widersprüchlichen** Anforderungen aus unterschiedlichen Jurisdiktionen gegenübersteht, die sich nicht durch eine einzige, universelle Systemarchitektur gleichzeitig erfüllen lassen — eine solche tatsächliche Widersprüchlichkeit erfordert eine bewusste, architektonische Trennung (etwa regionsspezifische Datenverarbeitung) statt des Versuchs, eine einzige, globale Lösung zu erzwingen, die keine der widersprüchlichen Anforderungen tatsächlich vollständig erfüllt.

## Zweck, Mental Model und Dependencies

Die Zusammenführung anwendbarer Regelwerke beginnt mit der systematischen Identifikation, welche Regelwerke für ein konkretes System in welcher Jurisdiktion tatsächlich gelten — dieselbe methodische Sorgfalt, die bereits bei der EU-AI-Act-Betroffenheitsprüfung (siehe [KB-0617](01-eu-ai-act-und-systemklassifikation.md)) und der NIS2-Betroffenheitsprüfung angewendet wurde, muss hier auf die gesamte, tatsächlich relevante regulatorische Landschaft ausgeweitet werden, statt sich auf eine einzelne, bekannte Regulierung zu beschränken. Data Residency ist der technisch konkreteste Ausdruck regulatorischer Anforderungen: Bestimmte Jurisdiktionen verlangen, dass Daten ihrer Bürger oder Unternehmen tatsächlich innerhalb bestimmter geografischer oder rechtlicher Grenzen gespeichert und verarbeitet werden — diese Anforderung übersetzt sich direkt in eine technische Architekturentscheidung über die tatsächliche, physische Platzierung von Datenspeichern und Verarbeitungssystemen, nicht nur in eine juristische Dokumentation. Der entscheidende, praktische Fall widersprüchlicher Anforderungen entsteht, wenn zwei tatsächlich anwendbare Jurisdiktionen einander ausschließende Data-Residency- oder Verarbeitungsanforderungen stellen (etwa eine Jurisdiktion, die Datenzugriff durch inländische Behörden auch bei im Ausland gespeicherten Daten verlangt, während eine andere Jurisdiktion genau diesen Zugriff für ihre Bürger ausschließt) — eine solche Konstellation lässt sich nicht durch eine einzige, gemeinsame technische Architektur auflösen, sondern erfordert eine bewusste, architektonische Trennung (etwa vollständig getrennte, regionsspezifische Datenverarbeitungspfade für Nutzer unterschiedlicher Jurisdiktionen). Rechtsänderungen erfordern zusätzlich einen kontrollierten Anpassungsprozess: Regulatorische Anforderungen ändern sich über die Zeit, und eine regulatorische Architektur, die einmalig für den zum Entwicklungszeitpunkt geltenden Rechtsstand entworfen wurde, ohne einen Prozess für die Erkennung und kontrollierte Umsetzung künftiger Rechtsänderungen, driftet zunehmend von der tatsächlichen, aktuellen Rechtslage ab — dieselbe methodische Notwendigkeit kontinuierlicher Aktualisierung, die bereits bei ISO 27001 und ISO 42001 (siehe [KB-0621](05-iso-27001-und-informationssicherheit.md) und [KB-0622](06-iso-42001-und-ai-managementsysteme.md)) behandelt wurde, gilt auch für die regulatorische Architektur als Ganzes.

~~~text
Final Domain 26 chapter: joins prior regulatory building blocks (EU AI Act KB-0617, GDPR KB-0618,
  NIS2, DORA, Policy as Code KB-0633) into coherent, cross-jurisdictional REGULATORY ARCHITECTURE
  systematically connecting applicable regulations, jurisdictions, and DATA RESIDENCY
  (where data is actually physically stored+processed)
KEY POINT: internationally operating org often faces ACTUALLY CONTRADICTORY requirements from
  different jurisdictions, not simultaneously satisfiable by a single, universal system architecture
  such actual contradiction requires deliberate, ARCHITECTURAL SEPARATION (region-specific
    data processing) instead of forcing a single, global solution that fully satisfies
    NONE of the contradictory requirements
CONNECTING applicable regulations starts w/ systematic identification of which regulations
  actually apply to a concrete system in which jurisdiction
  same methodological rigor as EU AI Act (KB-0617) and NIS2 applicability checks
  must extend to WHOLE, actually-relevant regulatory landscape, not limited to a single,
    known regulation
DATA RESIDENCY = most technically concrete expression of regulatory requirements
  certain jurisdictions require citizens'/companies' data actually stored+processed within
    certain geographic/legal boundaries
  translates DIRECTLY into technical architecture decision about actual, physical placement
    of data stores+processing systems, not just legal documentation
DECISIVE, PRACTICAL CASE of contradictory requirements: two actually-applicable jurisdictions
  impose mutually EXCLUSIVE data-residency/processing requirements
  (jurisdiction requiring domestic authority access even to data stored abroad,
   while another jurisdiction EXCLUDES exactly this access for its citizens)
  such constellation NOT resolvable via single, shared technical architecture
  requires deliberate, ARCHITECTURAL SEPARATION (fully separate, region-specific processing
    paths for users of different jurisdictions)
LEGAL CHANGES additionally require CONTROLLED ADAPTATION PROCESS
  regulatory requirements change over time
  regulatory architecture designed once for legal status at development time, w/o process for
    detecting+controlled-implementing future legal changes
  -> increasingly drifts from actual, current legal situation
  SAME methodological necessity of continual updating as ISO 27001/42001 (KB-0621, KB-0622)
  applies to regulatory architecture as a WHOLE
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Regelwerksidentifikation | ermittelt tatsächlich anwendbare Regulierungen je Jurisdiktion | Grundlage für vollständige regulatorische Bewertung |
| Data Residency | verlangt physische Datenplatzierung innerhalb bestimmter Grenzen | übersetzt sich direkt in technische Architekturentscheidung |
| Architektonische Trennung | löst tatsächlich widersprüchliche Jurisdiktionsanforderungen | ersetzt untaugliche, universelle Einheitslösung |
| Kontrollierter Anpassungsprozess | erfasst und setzt Rechtsänderungen systematisch um | verhindert Drift von der aktuellen Rechtslage |

Implementierung: Für jedes System wird systematisch geprüft, welche Regelwerke in welchen Jurisdiktionen tatsächlich anwendbar sind. Data-Residency-Anforderungen werden direkt in die technische Platzierung von Datenspeichern und Verarbeitungssystemen übersetzt. Bei tatsächlich widersprüchlichen Anforderungen wird eine bewusste, architektonische Trennung statt einer erzwungenen, universellen Lösung eingeführt. Ein kontrollierter Prozess erfasst Rechtsänderungen und setzt sie systematisch in Architekturanpassungen um.

## Scalability, Reliability, Security und Observability

Regulatorische Architektur skaliert die tatsächliche, jurisdiktionsübergreifende Compliance proportional zur Konsequenz, mit der widersprüchliche Anforderungen durch architektonische Trennung statt erzwungener Einheitslösungen aufgelöst werden; die Reliability-Grenze liegt darin, dass eine regulatorische Architektur ohne kontrollierten Anpassungsprozess zunehmend von der tatsächlichen, aktuellen Rechtslage abdriftet.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein System erfüllt die Data-Residency-Anforderung einer Jurisdiktion, verletzt aber die einer anderen | eine erzwungene, universelle Architektur versucht, widersprüchliche Anforderungen gleichzeitig zu erfüllen | eine bewusste, architektonische Trennung mit regionsspezifischen Verarbeitungspfaden einführen |
| eine regulatorische Architektur entspricht nicht mehr der tatsächlichen, aktuellen Rechtslage | kein kontrollierter Prozess erfasst und setzt Rechtsänderungen systematisch um | einen wiederkehrenden Überprüfungsprozess für regulatorische Änderungen einführen |
| unklar ist, welche Regelwerke für ein bestimmtes System tatsächlich gelten | keine systematische Regelwerksidentifikation über alle relevanten Jurisdiktionen wurde durchgeführt | eine vollständige, systematische Prüfung der tatsächlich anwendbaren Regelwerke durchführen |

Security: Regionsspezifische, architektonisch getrennte Verarbeitungspfade sollten mit konsistenten, aber jurisdiktionsgerecht angepassten Sicherheitskontrollen versehen sein. Observability: Die tatsächliche Aktualität der regulatorischen Architektur gegenüber der aktuellen Rechtslage ist ein zentrales Signal zur Bewertung der Compliance-Verlässlichkeit.

## Trade-offs und Entscheidungen

**Staff** setzt eine gegebene Data-Residency-Anforderung korrekt in eine technische Platzierungsentscheidung um. **Principal** entwirft die vollständige, regulatorische Architektur mit architektonischer Trennung für widersprüchliche Jurisdiktionsanforderungen für eine international tätige Organisation. **Chief** legt unternehmensweite Standards für regulatorische Architektur fest, die kontrollierte Anpassung an Rechtsänderungen verbindlich machen.

Anti-Patterns: eine einzige, universelle Systemarchitektur erzwingen, die widersprüchliche, jurisdiktionsspezifische Anforderungen gleichzeitig zu erfüllen versucht; regulatorische Architektur einmalig entwerfen, ohne einen Prozess für die Erfassung künftiger Rechtsänderungen; Data-Residency-Anforderungen als rein juristische Dokumentation statt als technische Architekturentscheidung behandeln.

## Production Checklist

- [ ] Für jedes System ist systematisch geprüft, welche Regelwerke in welchen Jurisdiktionen tatsächlich anwendbar sind.
- [ ] Data-Residency-Anforderungen sind in konkrete, technische Platzierungsentscheidungen übersetzt.
- [ ] Tatsächlich widersprüchliche Jurisdiktionsanforderungen sind durch architektonische Trennung statt erzwungener Einheitslösung gelöst.
- [ ] Ein kontrollierter Prozess erfasst Rechtsänderungen und setzt sie systematisch in Architekturanpassungen um.

## Interviewfragen

### 1. Was bedeutet Data Residency, und wie übersetzt sie sich in eine technische Anforderung?

**Antwort:** Data Residency verlangt, dass Daten tatsächlich innerhalb bestimmter geografischer oder rechtlicher Grenzen gespeichert und verarbeitet werden, was sich direkt in eine Architekturentscheidung über die physische Platzierung von Datenspeichern und Verarbeitungssystemen übersetzt.

### 2. Warum lässt sich ein tatsächlicher Widerspruch zwischen zwei Jurisdiktionsanforderungen nicht durch eine einzige, universelle Architektur lösen?

**Antwort:** Weil eine solche Konstellation eine bewusste, architektonische Trennung (etwa regionsspezifische Verarbeitungspfade) erfordert, statt eine erzwungene Einheitslösung, die keine der widersprüchlichen Anforderungen tatsächlich vollständig erfüllt.

### 3. Warum benötigt regulatorische Architektur einen kontrollierten Anpassungsprozess?

**Antwort:** Weil sich regulatorische Anforderungen über die Zeit ändern, und eine einmalig entworfene Architektur ohne systematische Erfassung künftiger Rechtsänderungen zunehmend von der tatsächlichen, aktuellen Rechtslage abdriftet.

### 4. Wie beginnt die systematische Zusammenführung anwendbarer Regelwerke?

**Antwort:** Mit der systematischen Identifikation, welche Regelwerke für ein konkretes System in welcher Jurisdiktion tatsächlich gelten, ausgeweitet auf die gesamte, tatsächlich relevante regulatorische Landschaft.

### 5. Wie gehst du vor, wenn ein System die Data-Residency-Anforderung einer Jurisdiktion erfüllt, aber die einer anderen verletzt?

**Antwort:** Ich prüfe, ob eine erzwungene, universelle Architektur versucht, tatsächlich widersprüchliche Anforderungen gleichzeitig zu erfüllen, und führe stattdessen eine bewusste, architektonische Trennung mit regionsspezifischen Verarbeitungspfaden ein.

### 6. Widersprüchliche Anforderung: Die Organisation will eine einzige, kosteneffiziente, globale Systemarchitektur UND vollständige Compliance mit tatsächlich widersprüchlichen, jurisdiktionsspezifischen Anforderungen — wie gehst du vor?

**Antwort:** Ich würde zunächst systematisch prüfen, ob die Anforderungen tatsächlich widersprüchlich sind oder nur scheinbar, und bei tatsächlichem Widerspruch eine gezielte, architektonische Trennung nur für die tatsächlich betroffenen Komponenten einführen, statt entweder die gesamte Architektur zu fragmentieren oder eine Compliance-Verletzung zu riskieren.

## Praktische Labs

~~~python
# Local, deterministic simulation of detecting contradictory data residency requirements (executed locally, no real compliance tool):

def check_residency_conflict(jurisdiction_a, jurisdiction_b):
    conflict = jurisdiction_a["requires_domestic_access"] and jurisdiction_b["prohibits_foreign_access"]
    return {"conflict_detected": conflict, "resolution": "architectural separation required" if conflict else "shared architecture viable"}

jurisdiction_a = {"name": "JurisdictionA", "requires_domestic_access": True}
jurisdiction_b = {"name": "JurisdictionB", "prohibits_foreign_access": True}

print(check_residency_conflict(jurisdiction_a, jurisdiction_b))
~~~

## Dependencies, Cross-References und Quellen

1. Europäische Kommission: [Data Governance and Cross-Border Data Flows Overview](https://digital-strategy.ec.europa.eu/en/policies/data-governance), abgerufen 2026-09-18.
2. Cloud Security Alliance (CSA): [Data Residency and Sovereignty in the Cloud](https://cloudsecurityalliance.org/research/topics/cloud-data-governance), abgerufen 2026-09-18.

EU AI Act und Systemklassifikation sind kanonisch in [KB-0617](01-eu-ai-act-und-systemklassifikation.md) behandelt; GDPR und Datenschutzarchitektur in [KB-0618](02-gdpr-und-datenschutzarchitektur.md); Policy as Code für Governance in [KB-0633](17-policy-as-code-fuer-governance.md); ISO 27001 und ISO 42001 in [KB-0621](05-iso-27001-und-informationssicherheit.md) und [KB-0622](06-iso-42001-und-ai-managementsysteme.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Überwachung regulatorischer Änderungen in relevanten Jurisdiktionen mit automatischer Benachrichtigung der verantwortlichen Governance-Instanz | Evaluating | Als Frühwarnsystem einführen, jedoch die abschließende, juristische Bewertung und architektonische Anpassungsentscheidung weiterhin menschlich mit fachlicher Prüfung treffen. |

Ein Team akzeptiert eine regulatorische Architektur erst, wenn anwendbare Regelwerke systematisch identifiziert sind, tatsächlich widersprüchliche Anforderungen durch architektonische Trennung gelöst sind und ein kontrollierter Prozess Rechtsänderungen systematisch erfasst. Damit ist Domain 26 (AI Governance) vollständig ausgearbeitet.
