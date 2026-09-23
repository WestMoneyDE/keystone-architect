---
{"id": "KB-0617", "title": "EU AI Act und Systemklassifikation", "domain": "26", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein konkretes AI-System anhand der Rollen- und Risikoklassifikation des EU AI Act korrekt einordnen und die daraus resultierenden Dokumentations- und Nachweisanforderungen in technische Verantwortungsgrenzen übersetzen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie AI-Systeme nach Rolle (Anbieter, Betreiber) und Risikoklasse klassifiziert werden und welche technischen Verantwortungsgrenzen sich daraus für die jeweilige Rolle ergeben.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein AI-System fälschlich einer niedrigeren Risikoklasse zugeordnet wird, als seine tatsächliche Nutzung nahelegt, und die Klassifikation anhand der tatsächlichen Funktion statt der beabsichtigten Nutzung korrigieren können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für EU-AI-Act-Systemklassifikation festlegen, die Rollen- und Risikoeinordnung nachvollziehbar mit technischen Dokumentations- und Nachweispflichten verbinden.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, juristische Detailauslegung des EU AI Act im Detail ist Vertiefung und erfordert juristische Fachberatung.", "rationale": "Kern ist die technische Übersetzung von Rollen- und Risikoklassifikation in Verantwortungsgrenzen, nicht die abschließende, juristische Auslegung des Rechtstextes."}}, "lab_validation": [{"lab_id": "KB-0617-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Klassifikation eines AI-Systems nach Rolle und Risikoklasse, kein produktives Compliance-Tool verwendet", "evidence": "Ein lokales Skript ordnet ein beschriebenes AI-System anhand seiner tatsächlichen Funktion (statt der beabsichtigten Nutzung) einer Risikoklasse zu und leitet daraus die entsprechenden Dokumentations- und Nachweisanforderungen ab.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Compliance-Tool und keine juristische Beratung."}]}
---
# EU AI Act und Systemklassifikation

> **Ziel:** Der EU AI Act ordnet AI-Systeme nach zwei zentralen Dimensionen ein: der **Rolle** eines Akteurs (etwa Anbieter, der ein AI-System entwickelt und in Verkehr bringt, oder Betreiber, der ein AI-System unter eigener Verantwortung einsetzt) und der **Risikoklasse** des Systems (von unannehmbarem Risiko über hohes Risiko bis zu minimalem Risiko). Der zentrale Punkt dieses Kapitels ist, dass diese regulatorische Klassifikation in konkrete, technische **Verantwortungsgrenzen** übersetzt werden muss — die Dokumentations-, Aufsichts- und Nachweisanforderungen unterscheiden sich erheblich je nach Rolle und Risikoklasse, und eine Organisation muss explizit klären, welche technischen Maßnahmen (etwa Protokollierung, menschliche Aufsicht, Robustheitsnachweise) tatsächlich zu welcher regulatorischen Anforderung gehören, statt die Klassifikation als rein juristische, von der technischen Umsetzung losgelöste Formalität zu behandeln.

## Zweck, Mental Model und Dependencies

Die Rolle eines Akteurs bestimmt, welche Pflichten tatsächlich zu erfüllen sind: Ein Anbieter, der ein AI-System entwickelt und auf den Markt bringt, trägt andere Pflichten (etwa umfassende technische Dokumentation, Konformitätsbewertung vor Markteinführung) als ein Betreiber, der ein bereits entwickeltes AI-System unter eigener Verantwortung in einem konkreten Anwendungskontext einsetzt (etwa Pflichten zur angemessenen menschlichen Aufsicht während des Betriebs) — eine Organisation kann für unterschiedliche Systeme gleichzeitig in unterschiedlichen Rollen auftreten, weshalb die Rollenzuordnung für jedes konkrete System einzeln geprüft werden muss, statt eine pauschale, organisationsweite Rollenannahme zu treffen. Die Risikoklasse bestimmt die Intensität der regulatorischen Anforderungen: Systeme mit unannehmbarem Risiko (etwa bestimmte Formen biometrischer Kategorisierung oder Social Scoring) sind grundsätzlich verboten; Hochrisiko-Systeme (etwa AI-Systeme in kritischer Infrastruktur, Bildung oder Beschäftigung) unterliegen umfangreichen Dokumentations-, Risikomanagement- und Aufsichtsanforderungen; Systeme mit minimalem Risiko unterliegen deutlich geringeren formalen Anforderungen. Die entscheidende, praktische Herausforderung ist, dass die Risikoklassifikation sich an der **tatsächlichen Funktion und dem tatsächlichen Einsatzkontext** eines Systems orientieren muss, nicht an der ursprünglich beabsichtigten Nutzung — ein System, das ursprünglich für eine risikoarme Anwendung konzipiert wurde, aber tatsächlich in einem risikoreicheren Kontext eingesetzt wird (etwa ein allgemeines Sprachmodell, das tatsächlich für Personalentscheidungen genutzt wird), muss entsprechend seiner tatsächlichen Nutzung klassifiziert werden, nicht entsprechend seiner ursprünglichen Konzeption. Die Übersetzung dieser regulatorischen Klassifikation in technische Verantwortungsgrenzen bedeutet konkret, dass für jede Kombination aus Rolle und Risikoklasse explizit festgelegt werden muss, welche technischen Maßnahmen (Protokollierungsumfang, menschliche Aufsichtsmechanismen, Robustheits- und Genauigkeitsnachweise, Dokumentationsumfang) tatsächlich zur Erfüllung der jeweiligen regulatorischen Anforderung notwendig sind, statt diese Anforderungen als abstrakte, rein juristische Kategorien unübersetzt zu belassen.

~~~text
EU AI Act: classifies AI systems along TWO central dimensions
  ROLE of an actor (provider developing+placing AI system on market, vs deployer using AI system
    under own responsibility)
  RISK CLASS of the system (unacceptable risk -> high risk -> minimal risk)
KEY POINT: this regulatory classification must translate into concrete, TECHNICAL RESPONSIBILITY BOUNDARIES
  documentation/oversight/evidence requirements differ substantially by role+risk class
  org must explicitly clarify which technical measures (logging, human oversight, robustness evidence)
    actually belong to which regulatory requirement
  instead of treating classification as purely legal formality detached from technical implementation
ROLE determines which obligations actually apply:
  PROVIDER (develops+places system on market): different obligations
    (comprehensive technical documentation, conformity assessment before market entry)
  DEPLOYER (uses already-developed system under own responsibility in concrete context):
    different obligations (adequate human oversight during operation)
  org can simultaneously act in DIFFERENT roles for different systems
    -> role assignment must be checked per concrete system, not assumed org-wide uniformly
RISK CLASS determines intensity of regulatory requirements:
  unacceptable risk (certain biometric categorization, social scoring) -> fundamentally PROHIBITED
  high-risk systems (critical infra, education, employment) -> extensive documentation/risk-mgmt/
    oversight requirements
  minimal-risk systems -> substantially lower formal requirements
DECISIVE, PRACTICAL CHALLENGE: risk classification must orient on ACTUAL FUNCTION + ACTUAL DEPLOYMENT CONTEXT
  NOT originally-intended use
  system originally designed for low-risk application, but ACTUALLY deployed in higher-risk context
    (general LLM actually used for hiring decisions)
  -> must be classified per ACTUAL use, not original conception
TRANSLATION into technical responsibility boundaries: for every role+risk-class combination,
  must explicitly define which technical measures (logging scope, human oversight mechanisms,
   robustness/accuracy evidence, documentation scope)
  are actually necessary to fulfill respective regulatory requirement
  instead of leaving these as abstract, purely legal categories, untranslated
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Rolle (Anbieter/Betreiber) | bestimmt geltende Pflichten je Akteurstyp | muss je System, nicht pauschal organisationsweit, geprüft werden |
| Risikoklasse | bestimmt Intensität regulatorischer Anforderungen | orientiert sich an tatsächlicher Funktion, nicht ursprünglicher Absicht |
| Tatsächlicher Einsatzkontext | maßgeblich für Risikoklassifikation | verhindert Unterklassifikation bei zweckentfremdeter Nutzung |
| Technische Übersetzung | verbindet regulatorische Anforderung mit konkreter Maßnahme | macht abstrakte Vorgaben operativ umsetzbar |

Implementierung: Für jedes AI-System wird explizit geprüft, in welcher Rolle die Organisation tatsächlich auftritt (Anbieter, Betreiber, oder beides für unterschiedliche Systeme). Die Risikoklassifikation orientiert sich an der tatsächlichen, aktuellen Nutzung des Systems, nicht an dessen ursprünglicher Konzeption, und wird bei Änderung des Einsatzkontexts erneut geprüft. Für jede Rolle-Risikoklasse-Kombination werden konkrete technische Maßnahmen (Protokollierung, menschliche Aufsicht, Dokumentation) explizit festgelegt.

## Scalability, Reliability, Security und Observability

EU-AI-Act-Systemklassifikation skaliert die tatsächliche Compliance-Verlässlichkeit proportional zur Konsequenz, mit der die Risikoklassifikation an tatsächlicher Nutzung statt ursprünglicher Absicht ausgerichtet wird; die Reliability-Grenze liegt darin, dass ein zweckentfremdet genutztes, aber ursprünglich niedrig klassifiziertes System unentdeckt regulatorische Anforderungen verfehlen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein AI-System wird tatsächlich für eine risikoreichere Anwendung genutzt als ursprünglich vorgesehen | die Risikoklassifikation wurde nicht an die tatsächliche, geänderte Nutzung angepasst | den tatsächlichen Einsatzkontext des Systems regelmäßig prüfen und die Klassifikation entsprechend aktualisieren |
| unklar ist, welche technischen Maßnahmen für ein bestimmtes System tatsächlich erforderlich sind | die regulatorische Anforderung wurde nicht explizit in konkrete technische Maßnahmen übersetzt | für die jeweilige Rolle-Risikoklasse-Kombination explizite, technische Maßnahmen festlegen |
| eine Organisation ist sich ihrer Rolle für ein bestimmtes System unsicher | keine systemspezifische Rollenprüfung wurde durchgeführt, sondern eine pauschale Annahme getroffen | die Rollenzuordnung für das konkrete System einzeln anhand der tatsächlichen Tätigkeit prüfen |

Security: Hochrisiko-AI-Systeme erfordern typischerweise robuste technische Sicherheitsmaßnahmen als Teil ihrer regulatorischen Nachweispflicht. Observability: Die tatsächliche Übereinstimmung zwischen dokumentierter Risikoklassifikation und tatsächlichem, aktuellem Einsatzkontext ist ein zentrales Signal zur Bewertung der Compliance-Verlässlichkeit.

## Trade-offs und Entscheidungen

**Staff** klassifiziert ein gegebenes AI-System korrekt nach Rolle und Risikoklasse und identifiziert die zugehörigen technischen Anforderungen. **Principal** entwirft die vollständige Klassifikations- und Übersetzungsstruktur für die AI-System-Landschaft einer Organisation. **Chief** legt unternehmensweite Standards für EU-AI-Act-Systemklassifikation fest, die regulatorische Anforderungen nachvollziehbar in technische Maßnahmen übersetzen.

Anti-Patterns: ein AI-System nach seiner ursprünglich beabsichtigten statt seiner tatsächlichen Nutzung klassifizieren; eine pauschale, organisationsweite Rollenzuordnung statt einer systemspezifischen Prüfung vornehmen; regulatorische Anforderungen als abstrakte, juristische Kategorien belassen, ohne sie in konkrete technische Maßnahmen zu übersetzen.

## Production Checklist

- [ ] Jedes AI-System ist explizit nach Rolle (Anbieter/Betreiber) und Risikoklasse klassifiziert.
- [ ] Die Risikoklassifikation basiert auf der tatsächlichen, aktuellen Nutzung, nicht der ursprünglichen Konzeption.
- [ ] Konkrete technische Maßnahmen sind für jede Rolle-Risikoklasse-Kombination explizit festgelegt.
- [ ] Die Klassifikation wird bei Änderung des tatsächlichen Einsatzkontexts erneut geprüft.

## Interviewfragen

### 1. Welche zwei zentralen Dimensionen nutzt der EU AI Act zur Klassifikation von AI-Systemen?

**Antwort:** Die Rolle des Akteurs (Anbieter oder Betreiber) und die Risikoklasse des Systems (von unannehmbarem bis minimalem Risiko).

### 2. Warum kann eine Organisation für unterschiedliche Systeme gleichzeitig unterschiedliche Rollen einnehmen?

**Antwort:** Weil die Rolle davon abhängt, ob die Organisation ein System selbst entwickelt und in Verkehr bringt (Anbieter) oder ein bereits entwickeltes System unter eigener Verantwortung nutzt (Betreiber) — dies kann für verschiedene Systeme unterschiedlich sein.

### 3. Woran sollte sich die Risikoklassifikation eines AI-Systems orientieren?

**Antwort:** An der tatsächlichen Funktion und dem tatsächlichen Einsatzkontext des Systems, nicht an der ursprünglich beabsichtigten Nutzung.

### 4. Was bedeutet die "technische Übersetzung" regulatorischer Anforderungen in diesem Kapitel?

**Antwort:** Für jede Rolle-Risikoklasse-Kombination wird explizit festgelegt, welche konkreten technischen Maßnahmen (Protokollierung, menschliche Aufsicht, Dokumentation) tatsächlich zur Erfüllung der jeweiligen Anforderung notwendig sind.

### 5. Wie gehst du vor, wenn ein AI-System tatsächlich für eine risikoreichere Anwendung genutzt wird als ursprünglich vorgesehen?

**Antwort:** Ich prüfe den tatsächlichen, aktuellen Einsatzkontext und aktualisiere die Risikoklassifikation entsprechend, statt die ursprüngliche, inzwischen überholte Klassifikation beizubehalten.

### 6. Widersprüchliche Anforderung: Ein Geschäftsbereich will ein AI-System schnell und unbürokratisch für einen neuen Anwendungsfall nutzen UND die Organisation will vollständige regulatorische Konformität sicherstellen — wie gehst du vor?

**Antwort:** Ich würde vor jeder neuen Nutzung eines AI-Systems eine schnelle, standardisierte Prüfung des tatsächlichen Einsatzkontexts gegen die Risikoklassifikation durchführen, um frühzeitig zu erkennen, ob sich die regulatorischen Anforderungen ändern, statt entweder die Nutzung unkontrolliert zu erlauben oder jede neue Nutzung mit vollem regulatorischem Prüfaufwand zu verzögern.

## Praktische Labs

~~~python
# Local, deterministic simulation of classifying an AI system by actual use, not intended use (executed locally, no real compliance tool):

def classify_risk(intended_use_risk, actual_use_risk):
    effective_risk = max(intended_use_risk, actual_use_risk, key=lambda r: ["minimal", "high", "unacceptable"].index(r))
    return {"intended": intended_use_risk, "actual": actual_use_risk, "effective_classification": effective_risk}

print(classify_risk(intended_use_risk="minimal", actual_use_risk="high"))
~~~

## Dependencies, Cross-References und Quellen

1. Europäische Kommission: [EU Artificial Intelligence Act — Official Text](https://artificialintelligenceact.eu/the-act/), abgerufen 2026-09-18.
2. Europäische Kommission: [High-Level Summary of the AI Act](https://artificialintelligenceact.eu/high-level-summary/), abgerufen 2026-09-18.

Dies ist das erste Kapitel von Domain 26 (AI Governance); es hat keine kapitelinternen Vorgängerabhängigkeiten innerhalb dieses Domains.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Überwachung des tatsächlichen Einsatzkontexts eines AI-Systems zur frühzeitigen Erkennung einer Risikoklassenänderung | Evaluating | Als ergänzendes Frühwarnsystem einsetzen, jedoch die abschließende, regulatorische Klassifikationsentscheidung weiterhin mit juristischer Fachberatung menschlich treffen. |

Ein Team akzeptiert eine EU-AI-Act-Systemklassifikation erst, wenn Rolle und Risikoklasse nachweislich anhand der tatsächlichen Nutzung bestimmt sind und die zugehörigen technischen Maßnahmen explizit festgelegt sind.
