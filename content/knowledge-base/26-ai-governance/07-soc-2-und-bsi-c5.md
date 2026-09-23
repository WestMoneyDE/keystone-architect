---
{"id": "KB-0623", "title": "SOC 2 und BSI C5", "domain": "26", "sequence": 7, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0442", "concepts": ["Shared Responsibility"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "SOC-2-Berichtsarten und BSI-C5-Kriterienkataloge anhand offizieller Quellen korrekt unterscheiden und den Geltungsbereich sowie verbleibende Kundenpflichten für einen konkreten Cloud-Dienst einordnen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie SOC-2- oder BSI-C5-Berichte eines Cloud-Anbieters mit der bereits in KB-0442 behandelten Shared-Responsibility-Grenze verbunden werden, um verbleibende, eigene Kundenpflichten korrekt zu identifizieren.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Organisation ein Zertifizierungslogo eines Cloud-Anbieters als vollständigen Sicherheitsnachweis für den eigenen Dienst missversteht, statt den tatsächlichen Geltungsbereich und die verbleibenden, eigenen Kundenpflichten zu prüfen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für die Bewertung von Anbieter-Zertifizierungen (SOC 2, BSI C5) festlegen, die Geltungsbereich und verbleibende Kundenpflichten verbindlich statt pauschales Vertrauen in Zertifizierungslogos vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, detaillierte Prüfmethodik eines SOC-2- oder BSI-C5-Audits im Detail ist Vertiefung.", "rationale": "Kern ist die korrekte Interpretation von Geltungsbereich und verbleibenden Kundenpflichten, nicht die detaillierte Auditmethodik selbst."}}, "lab_validation": [{"lab_id": "KB-0623-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Prüfung, ob eine Anbieterzertifizierung den tatsächlich genutzten Dienst abdeckt, kein produktives Compliance-Tool verwendet", "evidence": "Ein lokales Skript vergleicht den dokumentierten Geltungsbereich einer SOC-2- oder BSI-C5-Zertifizierung mit dem tatsächlich genutzten Cloud-Dienst und markiert Diskrepanzen, bei denen der genutzte Dienst außerhalb des zertifizierten Geltungsbereichs liegt.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Compliance-Tool."}]}
---
# SOC 2 und BSI C5

> **Ziel:** SOC 2 (ein US-amerikanischer Prüfstandard) und BSI C5 (ein deutscher Kriterienkatalog des Bundesamts für Sicherheit in der Informationstechnik) sind beides Nachweisformate, mit denen Cloud-Anbieter ihre Sicherheitskontrollen extern prüfen lassen — der zentrale Punkt dieses Kapitels ist, dass ein solches Zertifizierungslogo oder ein solcher Prüfbericht niemals pauschales, unbegrenztes Vertrauen rechtfertigt, sondern explizit gegen den tatsächlichen **Geltungsbereich** (welche konkreten Dienste und Rechenzentren tatsächlich geprüft wurden) und gegen die bereits in [KB-0442](../18-cloud-foundations/02-shared-responsibility.md) behandelte Shared-Responsibility-Grenze geprüft werden muss, um die tatsächlich **verbleibenden Kundenpflichten** zu identifizieren. Ein Zertifizierungslogo eines Cloud-Anbieters belegt, dass bestimmte, im Bericht definierte Kontrollen des Anbieters extern geprüft wurden — es belegt nicht automatisch, dass der eigene, tatsächlich genutzte Dienst vollständig innerhalb dieses geprüften Geltungsbereichs liegt, und es entbindet die nutzende Organisation nicht von ihren eigenen, in der Shared-Responsibility-Aufteilung verbleibenden Pflichten.

## Zweck, Mental Model und Dependencies

SOC-2-Berichte existieren in unterschiedlichen Typen mit unterschiedlicher Aussagekraft: Ein Typ-1-Bericht bestätigt, dass bestimmte Kontrollen zu einem bestimmten Zeitpunkt formal existieren (eine Momentaufnahme), während ein Typ-2-Bericht bestätigt, dass diese Kontrollen über einen bestimmten Zeitraum tatsächlich wirksam betrieben wurden (eine Wirksamkeitsprüfung über die Zeit) — ein Typ-1-Bericht liefert damit eine deutlich schwächere Aussage über tatsächliche, betriebliche Wirksamkeit als ein Typ-2-Bericht, auch wenn beide formal als "SOC-2-Bericht" bezeichnet werden. BSI C5 ist demgegenüber ein deutscher, öffentlich definierter Kriterienkatalog, der spezifisch auf Cloud-Dienste zugeschnittene Anforderungen formuliert und von unabhängigen Prüfern gegen diese Kriterien bewertet wird — die tatsächliche Aussagekraft hängt ähnlich wie bei SOC 2 vom tatsächlichen Prüfumfang und -zeitraum ab, nicht von der bloßen Existenz eines C5-Testats. Der entscheidende, praktische Fehler bei der Bewertung solcher Zertifizierungen ist, ein Zertifizierungslogo als pauschalen, vollständigen Sicherheitsnachweis für den eigenen, genutzten Dienst zu interpretieren, ohne den tatsächlichen Geltungsbereich zu prüfen: Ein Cloud-Anbieter kann für bestimmte Dienste oder Regionen zertifiziert sein, während ein tatsächlich genutzter, anderer Dienst desselben Anbieters außerhalb dieses geprüften Geltungsbereichs liegt — eine Organisation, die das allgemeine Zertifizierungslogo des Anbieters sieht, aber nicht prüft, ob der konkret genutzte Dienst tatsächlich im zertifizierten Geltungsbereich enthalten ist, kann fälschlich annehmen, umfassend abgesichert zu sein. Die Verbindung zur Shared-Responsibility-Grenze (siehe [KB-0442](../18-cloud-foundations/02-shared-responsibility.md)) ist ebenso entscheidend: Selbst ein vollständig zutreffender, gültiger SOC-2- oder BSI-C5-Bericht deckt ausschließlich die Kontrollen ab, für die der Cloud-Anbieter selbst verantwortlich ist — die eigenen, in der Shared-Responsibility-Aufteilung verbleibenden Pflichten der nutzenden Organisation (etwa Konfiguration, Zugriffsverwaltung, Anwendungssicherheit) werden durch die Zertifizierung des Anbieters nicht abgedeckt und müssen weiterhin eigenständig erfüllt und nachgewiesen werden.

~~~text
SOC 2 (US audit standard) + BSI C5 (German Federal Office for Information Security criteria catalog):
  both are EVIDENCE FORMATS letting cloud providers have their security controls externally audited
KEY POINT: such a certification logo/audit report NEVER justifies blanket, unlimited trust
  must be explicitly checked against ACTUAL SCOPE (which concrete services/datacenters actually audited)
  and against KB-0442's shared-responsibility boundary
  to identify ACTUALLY REMAINING customer obligations
  provider certification logo proves: certain, report-defined controls of the PROVIDER were
    externally audited
  does NOT automatically prove: own, actually-used service lies fully within this audited scope
  does NOT relieve using org of its OWN obligations remaining in shared-responsibility split
SOC 2 REPORTS exist in different types w/ different evidentiary strength:
  Type 1: confirms certain controls formally EXIST at a specific point in time (snapshot)
  Type 2: confirms these controls were ACTUALLY operated effectively over a specific period
    (effectiveness check over time)
  Type 1 -> substantially weaker statement about actual operational effectiveness than Type 2
    even though both formally called "SOC 2 report"
BSI C5: German, publicly-defined criteria catalog, cloud-service-specific requirements,
  assessed by independent auditors against these criteria
  actual evidentiary strength similarly depends on actual audit scope+period, not mere existence
    of a C5 attestation
DECISIVE, PRACTICAL ERROR in evaluating such certifications: interpreting a certification logo
  as blanket, complete security proof for own, used service, WITHOUT checking actual scope
  provider CAN be certified for certain services/regions, while an actually-used DIFFERENT service
    of same provider lies OUTSIDE this audited scope
  org seeing provider's general certification logo, but NOT checking whether concretely-used
    service is actually within certified scope -> can falsely assume comprehensive coverage
CONNECTION to shared-responsibility boundary (KB-0442) equally decisive
  even a fully-accurate, valid SOC 2/BSI C5 report ONLY covers controls the CLOUD PROVIDER itself
    is responsible for
  using org's OWN remaining obligations in shared-responsibility split
    (configuration, access management, application security)
  NOT covered by provider's certification -> must still be independently fulfilled+demonstrated
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| SOC-2-Typ 1 vs. Typ 2 | Momentaufnahme vs. Wirksamkeitsprüfung über Zeitraum | Typ 2 liefert stärkere Aussage über tatsächliche Wirksamkeit |
| BSI C5 | deutscher, cloud-spezifischer Kriterienkatalog | Aussagekraft hängt von tatsächlichem Prüfumfang ab |
| Geltungsbereich | konkret geprüfte Dienste/Regionen | muss gegen tatsächlich genutzten Dienst geprüft werden |
| Verbleibende Kundenpflichten | Verantwortung, die nicht durch Anbieterzertifizierung abgedeckt ist | ergibt sich aus der Shared-Responsibility-Grenze |

Implementierung: Für jeden genutzten Cloud-Dienst wird explizit geprüft, ob dieser Dienst tatsächlich innerhalb des zertifizierten Geltungsbereichs des jeweiligen SOC-2- oder BSI-C5-Berichts liegt. Der SOC-2-Berichtstyp (Typ 1 oder Typ 2) wird explizit berücksichtigt, da beide unterschiedliche Aussagekraft haben. Die eigenen, in der Shared-Responsibility-Aufteilung verbleibenden Pflichten werden unabhängig von der Anbieterzertifizierung eigenständig erfüllt und nachgewiesen.

## Scalability, Reliability, Security und Observability

Die Bewertung von SOC-2- und BSI-C5-Zertifizierungen skaliert die tatsächliche Sicherheitsverlässlichkeit proportional zur Konsequenz, mit der Geltungsbereich und verbleibende Kundenpflichten tatsächlich geprüft statt pauschal angenommen werden; die Reliability-Grenze liegt darin, dass pauschales Vertrauen in ein Zertifizierungslogo ohne Geltungsbereichsprüfung eine unentdeckte Sicherheitslücke im tatsächlich genutzten Dienst verdecken kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Sicherheitsvorfall betrifft einen Cloud-Dienst, der als "zertifiziert" galt | der tatsächlich genutzte Dienst lag außerhalb des tatsächlich geprüften Geltungsbereichs der Zertifizierung | den Geltungsbereich des Zertifizierungsberichts explizit gegen den tatsächlich genutzten Dienst prüfen |
| eine Organisation erfüllt ihre eigenen Sicherheitspflichten nicht, obwohl der Cloud-Anbieter zertifiziert ist | die verbleibenden, eigenen Pflichten aus der Shared-Responsibility-Aufteilung wurden fälschlich als durch die Anbieterzertifizierung abgedeckt angesehen | die eigenen, verbleibenden Pflichten explizit identifizieren und unabhängig von der Anbieterzertifizierung erfüllen |
| ein SOC-2-Bericht wird als vollständiger Wirksamkeitsnachweis interpretiert, obwohl er nur eine Momentaufnahme ist | der Berichtstyp (Typ 1 statt Typ 2) wurde nicht beachtet | prüfen, ob ein Typ-2-Bericht mit tatsächlichem Wirksamkeitsnachweis über einen Zeitraum vorliegt |

Security: Der tatsächliche Prüfzeitraum eines Typ-2-Berichts sollte gegen die eigene, tatsächliche Nutzungsdauer des Dienstes abgeglichen werden, da ein veralteter Bericht keine aktuelle Aussage über die tatsächliche Wirksamkeit liefert. Observability: Die tatsächliche Übereinstimmung zwischen dokumentiertem Geltungsbereich einer Zertifizierung und tatsächlich genutzten Diensten ist ein zentrales Signal zur Bewertung der Verlässlichkeit der Compliance-Annahme.

## Trade-offs und Entscheidungen

**Staff** prüft für einen gegebenen Cloud-Dienst korrekt, ob dieser innerhalb des zertifizierten Geltungsbereichs liegt. **Principal** entwirft die vollständige Bewertungsstrategie für Anbieterzertifizierungen mit Geltungsbereichs- und Shared-Responsibility-Prüfung für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für die Bewertung von SOC-2- und BSI-C5-Zertifizierungen fest, die pauschales Vertrauen in Zertifizierungslogos ausschließen.

Anti-Patterns: ein Zertifizierungslogo eines Cloud-Anbieters als vollständigen, pauschalen Sicherheitsnachweis interpretieren, ohne Geltungsbereich zu prüfen; einen SOC-2-Typ-1-Bericht als gleichwertig zu einem Typ-2-Bericht behandeln; eigene, in der Shared-Responsibility-Aufteilung verbleibende Pflichten als durch die Anbieterzertifizierung abgedeckt annehmen.

## Production Checklist

- [ ] Der Geltungsbereich jeder genutzten Anbieterzertifizierung ist gegen den tatsächlich genutzten Dienst geprüft.
- [ ] Der SOC-2-Berichtstyp (Typ 1 oder Typ 2) wird explizit berücksichtigt.
- [ ] Die eigenen, verbleibenden Pflichten aus der Shared-Responsibility-Aufteilung sind explizit identifiziert und eigenständig erfüllt.
- [ ] Der Prüfzeitraum eines Typ-2-Berichts ist gegen die tatsächliche Nutzungsdauer aktuell.

## Interviewfragen

### 1. Was unterscheidet einen SOC-2-Typ-1- von einem Typ-2-Bericht?

**Antwort:** Ein Typ-1-Bericht bestätigt, dass Kontrollen zu einem bestimmten Zeitpunkt formal existieren; ein Typ-2-Bericht bestätigt, dass diese Kontrollen über einen bestimmten Zeitraum tatsächlich wirksam betrieben wurden.

### 2. Warum belegt ein Zertifizierungslogo eines Cloud-Anbieters nicht automatisch die Sicherheit des eigenen, genutzten Dienstes?

**Antwort:** Weil der genutzte Dienst außerhalb des tatsächlich geprüften Geltungsbereichs der Zertifizierung liegen kann, selbst wenn der Anbieter allgemein zertifiziert ist.

### 3. Warum entbindet eine Anbieterzertifizierung die nutzende Organisation nicht von eigenen Pflichten?

**Antwort:** Weil die Zertifizierung ausschließlich die Kontrollen abdeckt, für die der Anbieter selbst verantwortlich ist, während die eigenen, in der Shared-Responsibility-Aufteilung verbleibenden Pflichten weiterhin eigenständig erfüllt werden müssen.

### 4. Was ist BSI C5?

**Antwort:** Ein deutscher, cloud-spezifischer Kriterienkatalog des Bundesamts für Sicherheit in der Informationstechnik, dessen Aussagekraft wie bei SOC 2 vom tatsächlichen Prüfumfang und -zeitraum abhängt.

### 5. Wie gehst du vor, wenn ein Sicherheitsvorfall einen Cloud-Dienst betrifft, der als "zertifiziert" galt?

**Antwort:** Ich prüfe, ob der tatsächlich genutzte Dienst tatsächlich innerhalb des geprüften Geltungsbereichs der Zertifizierung lag, statt die Zertifizierung pauschal als vollständigen Schutz zu interpretieren.

### 6. Widersprüchliche Anforderung: Die Beschaffungsabteilung will Cloud-Anbieter schnell anhand vorhandener Zertifizierungslogos freigeben UND die Sicherheitsabteilung will vollständige Prüfung von Geltungsbereich und verbleibenden Pflichten — wie gehst du vor?

**Antwort:** Ich würde einen standardisierten, schnellen Prüfprozess etablieren, der für jeden konkret genutzten Dienst explizit den Geltungsbereich der Anbieterzertifizierung und die verbleibenden, eigenen Pflichten abgleicht, statt entweder auf Basis des bloßen Zertifizierungslogos freizugeben oder jede Beschaffung durch eine langwierige, vollständige Einzelprüfung zu verzögern.

## Praktische Labs

~~~python
# Local, deterministic simulation of checking whether a used service falls within a certification's audited scope (executed locally, no real compliance tool):

def check_certification_scope(used_service, certified_scope):
    return {"service": used_service, "within_certified_scope": used_service in certified_scope}

certified_scope = {"compute-service-eu", "storage-service-eu"}
used_services = ["compute-service-eu", "ai-inference-service-us"]

for s in used_services:
    print(check_certification_scope(s, certified_scope))
~~~

## Dependencies, Cross-References und Quellen

1. American Institute of CPAs (AICPA): [SOC 2 — System and Organization Controls Report Overview](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2), abgerufen 2026-09-18.
2. Bundesamt für Sicherheit in der Informationstechnik (BSI): [Cloud Computing Compliance Criteria Catalogue (C5)](https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Empfehlungen-nach-Angriffszielen/Cloud-Computing/Kriterienkatalog-C5/kriterienkatalog-c5_node.html), abgerufen 2026-09-18.

Shared Responsibility ist kanonisch in [KB-0442](../18-cloud-foundations/02-shared-responsibility.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Abgleichung genutzter Cloud-Dienste gegen aktuelle Zertifizierungsgeltungsbereiche zur frühzeitigen Erkennung von Abdeckungslücken | Evaluating | Als ergänzendes Überwachungswerkzeug einführen, jedoch die abschließende Bewertung, ob eine Zertifizierung tatsächlich ausreichende Sicherheitsanforderungen erfüllt, weiterhin menschlich mit fachlicher Prüfung treffen. |

Ein Team akzeptiert eine Anbieterzertifizierung als Sicherheitsnachweis erst, wenn der Geltungsbereich nachweislich gegen den tatsächlich genutzten Dienst geprüft ist und die eigenen, verbleibenden Pflichten aus der Shared-Responsibility-Aufteilung explizit identifiziert sind.
