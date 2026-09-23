---
{"id": "KB-0561", "title": "AI Security im Sicherheitsprogramm", "domain": "23", "sequence": 25, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0537", "concepts": ["Threat Modeling und Vertrauensgrenzen"], "needed_for": "understanding"}, {"id": "KB-0260", "concepts": ["Prompt Injection und Instruktionsgrenzen"], "needed_for": "understanding"}, {"id": "KB-0560", "concepts": ["CSPM und CNAPP"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Modell-, Retrieval- und Agentenbedrohungen anhand des bereits kanonisch behandelten Prompt-Injection-Artikels in bestehende Threat-Modeling- und Security-Prozesse integrieren können, statt AI-Bedrohungen isoliert zu behandeln.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gemeinsame Verantwortungsgrenzen zwischen etabliertem Sicherheitsteam und AI-/ML-Entwicklungsteam für Modell-, Retrieval- und Agentenbedrohungen festlegen, statt AI-Systeme außerhalb des regulären Sicherheitsprogramms zu betreiben.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unentdeckte AI-spezifische Schwachstelle auf deren fehlende Integration in bestehende Threat-Modeling- und CSPM-/CNAPP-Prozesse zurückführen können, statt eine grundsätzlich neue, isolierte Sicherheitsdisziplin für AI-Systeme aufzubauen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards festlegen, die AI-Security als integralen Bestandteil des bestehenden Sicherheitsprogramms statt einer separaten, isolierten Disziplin behandeln, mit klaren Verantwortungsgrenzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte technische Mechanik von Prompt Injection selbst ist im kanonischen Artikel (KB-0260) behandelt und hier bewusst nicht wiederholt.", "rationale": "Kern dieses Kapitels ist die Integration von AI-Bedrohungen in bestehende Sicherheitsprozesse und Verantwortungsgrenzen, nicht die Wiederholung der Injection-Mechanik selbst."}}, "lab_validation": [{"lab_id": "KB-0561-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-18", "environment": "Konzeptuelle Integration von AI-spezifischen Bedrohungskategorien in bestehende Threat-Modeling- und CSPM-/CNAPP-Prozesse, kein produktives Sicherheitsprogramm verwendet", "evidence": "Anhand der bereits behandelten Threat-Modeling-Methodik (STRIDE, Vertrauensgrenzen, siehe KB-0537) und CSPM-/CNAPP-Priorisierungsprinzipien (siehe KB-0560) wird nachvollzogen, wie Modell-, Retrieval- und Agentenbedrohungen (mit Prompt Injection als kanonischem Beispiel, siehe KB-0260) systematisch als zusätzliche Vertrauensgrenzen und Bedrohungskategorien in bestehende Sicherheitsprozesse integriert werden können, statt eine vollständig neue, isolierte Sicherheitsdisziplin aufzubauen.", "limitations": "Keine reale Integration in ein produktives Sicherheitsprogramm durchgeführt."}]}
---
# AI Security im Sicherheitsprogramm

> **Ziel:** Dieses Kapitel integriert AI-spezifische Bedrohungskategorien — **Modellbedrohungen** (etwa Prompt Injection, kanonisch behandelt in [KB-0260](../11-genai-architecture/20-prompt-injection-und-instruktionsgrenzen.md)), **Retrieval-Bedrohungen** (Manipulation oder Vergiftung der Wissensquellen, die ein System für Retrieval-Augmented Generation nutzt) und **Agentenbedrohungen** (Missbrauch der Handlungsfähigkeit eines autonomen Agenten, etwa durch manipulierte Zwischenergebnisse, die zu unbeabsichtigten Aktionen führen) — in das bereits etablierte Sicherheitsprogramm dieser Domain (Threat Modeling, siehe [KB-0537](01-threat-modeling-und-vertrauensgrenzen.md); CSPM/CNAPP, siehe [KB-0560](24-cspm-und-cnapp.md)), statt AI-Sicherheit als vollständig neue, isolierte Disziplin zu behandeln. Der zentrale Punkt dieses Kapitels ist, dass eine unentdeckte AI-spezifische Schwachstelle typischerweise nicht auf eine grundsätzlich neue, unbekannte Angriffsklasse zurückzuführen ist, sondern auf deren **fehlende Integration** in bereits etablierte, bewährte Sicherheitsprozesse — ein AI-System, das außerhalb des regulären Threat-Modeling-Prozesses entwickelt und betrieben wird, oder dessen Infrastruktur nicht in die bestehende CSPM-/CNAPP-Überwachung einbezogen wird, verliert die Schutzwirkung etablierter Prozesse, nicht weil diese für AI-Systeme ungeeignet wären, sondern weil sie schlicht nicht angewendet wurden.

## Zweck, Mental Model und Dependencies

AI-Sicherheit als integraler statt isolierter Bestandteil des Sicherheitsprogramms bedeutet konkret, die bereits etablierte Threat-Modeling-Methodik (siehe [KB-0537](01-threat-modeling-und-vertrauensgrenzen.md)) explizit auf AI-spezifische Vertrauensgrenzen anzuwenden: Ein AI-Modell, das Nutzereingaben verarbeitet, stellt eine Vertrauensgrenze dar, an der STRIDE-Kategorien (insbesondere Tampering und Elevation of Privilege) systematisch geprüft werden müssen — Prompt Injection (kanonisch behandelt in [KB-0260](../11-genai-architecture/20-prompt-injection-und-instruktionsgrenzen.md)) ist ein konkretes Beispiel für Tampering an dieser Grenze, bei dem eine manipulierte Eingabe die beabsichtigte Verarbeitungslogik des Modells verändert. Retrieval-Bedrohungen erweitern diese Analyse auf eine zusätzliche Vertrauensgrenze: Ein System, das externe oder interne Wissensquellen für Retrieval-Augmented Generation nutzt, muss diese Quellen selbst als potenziell manipulierbare Eingabe behandeln — wird eine Wissensquelle vergiftet (etwa durch das Einschleusen manipulierter Dokumente in eine durchsuchbare Wissensdatenbank), kann dies dieselbe strukturelle Wirkung wie eine direkte Prompt Injection haben, nur über einen indirekten, weniger offensichtlichen Weg. Agentenbedrohungen betreffen die zusätzliche Vertrauensgrenze, die entsteht, wenn ein AI-System nicht nur Text generiert, sondern tatsächliche Aktionen ausführt (etwa API-Aufrufe, Dateisystemänderungen) — hier verschärft sich die Konsequenz einer erfolgreichen Manipulation erheblich, da sie nicht nur zu einer fehlerhaften Textausgabe, sondern zu einer tatsächlichen, potenziell schädlichen Aktion führen kann, weshalb dieselben Prinzipien minimaler Rechte und expliziter Autorisierungsprüfung (siehe [KB-0539](03-rbac-und-abac.md) und [KB-0559](23-api-security.md) für die analoge API-Objektzugriffsprüfung) konsequent auch auf agentische Handlungsfähigkeit angewendet werden müssen. Ebenso kritisch ist die Integration in CSPM/CNAPP (siehe [KB-0560](24-cspm-und-cnapp.md)): Die Infrastruktur, auf der AI-Modelle laufen (GPU-Cluster, Modell-Serving-Endpunkte, Vektordatenbanken für Retrieval), unterliegt denselben Cloudfehlkonfigurations- und Berechtigungsrisiken wie jede andere Cloud-Ressource und sollte daher nicht als separate, unbeobachtete Kategorie außerhalb der bestehenden Überwachung behandelt werden. Die architektonisch zentrale Entscheidung ist die explizite Festlegung gemeinsamer Verantwortungsgrenzen: Welche AI-spezifischen Bedrohungen (etwa die inhaltliche Qualität von Modellausgaben) fallen in die Verantwortung des AI-/ML-Entwicklungsteams, und welche (etwa die zugrunde liegende Infrastruktursicherheit, Zugriffskontrolle, Netzwerksegmentierung) fallen in die Verantwortung des etablierten Sicherheitsteams — ohne diese explizite Klärung entstehen dieselben Verantwortungslücken, die bereits bei Shared Responsibility im Cloud-Kontext (siehe Domain 18) behandelt wurden, nur zwischen internen Teams statt zwischen Organisation und Cloud-Anbieter.

~~~text
AI Security = INTEGRATION into EXISTING security program, not a new isolated discipline
  Model threats: e.g. Prompt Injection (canonical: KB-0260)
    -> apply EXISTING STRIDE Threat Modeling (KB-0537) to the model's input trust boundary
       (Tampering/Elevation of Privilege categories especially relevant)
  Retrieval threats: knowledge sources (RAG) = ADDITIONAL trust boundary
    -> poisoned knowledge source = structurally SAME effect as prompt injection, INDIRECT path
  Agent threats: ADDITIONAL trust boundary when AI system EXECUTES actions (not just generates text)
    -> consequence of successful manipulation ESCALATES (not just bad text output -> actual harmful action)
    -> SAME minimal-rights/explicit-authorization principles (KB-0539, KB-0559's object-check analog)
       MUST apply to agentic action capability
  Infrastructure: GPU clusters/model serving endpoints/vector DBs = subject to SAME CSPM/CNAPP risks (KB-0560)
    -> NOT a separate, unmonitored category
KEY ARCHITECTURAL DECISION: explicit shared responsibility boundary
  AI/ML dev team: model output quality, application-level AI behavior
  established security team: underlying infra security, access control, network segmentation
  -> WITHOUT this explicit split: SAME responsibility gaps as cloud Shared Responsibility (Domain 18),
     just between INTERNAL teams instead of org-vs-cloud-provider
UNDETECTED AI-specific vulnerability
  -> usually NOT a fundamentally new, unknown attack class
  -> usually = MISSING integration into already-established, proven security processes
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Modellbedrohungen als Vertrauensgrenze | Anwendung bestehender STRIDE-Methodik auf AI-Eingaben | Prompt Injection als konkretes Tampering-Beispiel |
| Retrieval-Bedrohungen | Wissensquellen als zusätzliche, manipulierbare Eingabe | indirekter Weg mit struktureller Ähnlichkeit zu direkter Injection |
| Agentenbedrohungen | eskalierte Konsequenz bei tatsächlicher Handlungsfähigkeit | minimale Rechte/explizite Autorisierung wie bei API-Objektzugriff |
| Gemeinsame Verantwortungsgrenzen | explizite Aufteilung AI-Team versus Sicherheitsteam | verhindert Verantwortungslücken analog zu Shared Responsibility |

Implementierung: AI-Modelleingaben werden explizit als Vertrauensgrenze im bestehenden Threat-Modeling-Prozess behandelt, mit systematischer STRIDE-Anwendung. Retrieval-Wissensquellen werden gegen Manipulation und Vergiftung geprüft, mit denselben Prinzipien wie andere externe Eingabequellen. Agentische Handlungsfähigkeit wird mit minimalen Rechten und expliziter Autorisierungsprüfung pro Aktion ausgestattet. AI-Infrastruktur wird explizit in bestehende CSPM-/CNAPP-Überwachung einbezogen, statt separat und unbeobachtet zu bleiben. Verantwortungsgrenzen zwischen AI-Team und Sicherheitsteam werden explizit dokumentiert.

## Scalability, Reliability, Security und Observability

AI-Security im Sicherheitsprogramm skaliert die tatsächliche Schutzwirkung proportional zur Vollständigkeit der Integration in bestehende Prozesse; die Reliability-Grenze liegt darin, dass eine isoliert, außerhalb etablierter Prozesse betriebene AI-Komponente proportional zu ihrer Kritikalität eine unentdeckte, unadressierte Sicherheitslücke darstellt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine AI-spezifische Schwachstelle bleibt trotz etabliertem Sicherheitsprogramm unentdeckt | das betroffene AI-System wurde nicht in den bestehenden Threat-Modeling-Prozess einbezogen | ein explizites Threat Model für das AI-System mit Modell-, Retrieval- und Agentenbedrohungen erstellen |
| eine Cloudfehlkonfiguration in der AI-Infrastruktur wird nicht erkannt | die AI-Infrastruktur ist nicht in die bestehende CSPM-/CNAPP-Überwachung einbezogen | die AI-Infrastruktur explizit in die bestehende Cloud-Sicherheitsüberwachung integrieren |
| unklar, wer für ein AI-Sicherheitsproblem tatsächlich verantwortlich ist | keine explizite Verantwortungsgrenze zwischen AI-Team und Sicherheitsteam ist dokumentiert | eine explizite, dokumentierte Verantwortungsaufteilung analog zum Shared-Responsibility-Modell einführen |

Security: AI-spezifische Bedrohungen sollten konsequent in bestehende Threat-Modeling- und CSPM-/CNAPP-Prozesse integriert werden, statt eine separate, potenziell lückenhafte AI-Sicherheitsdisziplin parallel aufzubauen. Observability: Die tatsächliche Integration von AI-Systemen in bestehende Threat-Modeling-Dokumentation und CSPM-/CNAPP-Überwachung, sowie die Klarheit dokumentierter Verantwortungsgrenzen, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** wendet die bestehende STRIDE-Methodik korrekt auf ein einzelnes AI-Modell-Eingabeszenario an. **Principal** entwirft die vollständige Integration von Modell-, Retrieval- und Agentenbedrohungen in das bestehende Sicherheitsprogramm. **Chief** legt unternehmensweite Standards fest, die AI-Security als integralen Bestandteil statt isolierter Disziplin mit expliziten Verantwortungsgrenzen behandeln.

Anti-Patterns: AI-Systeme außerhalb des regulären Threat-Modeling-Prozesses entwickeln und betreiben; AI-Infrastruktur von bestehender CSPM-/CNAPP-Überwachung ausnehmen; agentische Handlungsfähigkeit ohne dieselben Prinzipien minimaler Rechte wie andere privilegierte Operationen ausstatten; Verantwortungsgrenzen zwischen AI-Team und Sicherheitsteam unklar lassen.

## Production Checklist

- [ ] AI-Modelleingaben sind explizit als Vertrauensgrenze im Threat-Modeling-Prozess dokumentiert.
- [ ] Retrieval-Wissensquellen sind gegen Manipulation und Vergiftung geprüft.
- [ ] Agentische Handlungsfähigkeit ist mit minimalen Rechten und expliziter Autorisierung pro Aktion ausgestattet.
- [ ] AI-Infrastruktur ist vollständig in bestehende CSPM-/CNAPP-Überwachung einbezogen.
- [ ] Verantwortungsgrenzen zwischen AI-Team und Sicherheitsteam sind explizit dokumentiert.

## Interviewfragen

### 1. Warum sollte AI-Security als integraler Bestandteil des bestehenden Sicherheitsprogramms statt isolierter Disziplin behandelt werden?

**Antwort:** Weil unentdeckte AI-spezifische Schwachstellen typischerweise nicht auf grundsätzlich neue Angriffsklassen zurückzuführen sind, sondern auf deren fehlende Integration in bereits etablierte, bewährte Sicherheitsprozesse wie Threat Modeling und CSPM/CNAPP.

### 2. Wie hängt Prompt Injection mit der bestehenden STRIDE-Threat-Modeling-Methodik zusammen?

**Antwort:** Prompt Injection ist ein konkretes Beispiel für Tampering an der Vertrauensgrenze der Modelleingabe, das systematisch mit derselben STRIDE-Methodik geprüft werden sollte, die bereits für andere Vertrauensgrenzen etabliert ist.

### 3. Warum verschärft sich die Konsequenz erfolgreicher Manipulation bei Agentenbedrohungen im Vergleich zu reiner Textgenerierung?

**Antwort:** Weil ein AI-System, das tatsächliche Aktionen ausführt, bei erfolgreicher Manipulation nicht nur eine fehlerhafte Textausgabe erzeugt, sondern eine tatsächliche, potenziell schädliche Aktion durchführen kann.

### 4. Warum sollte AI-Infrastruktur explizit in bestehende CSPM-/CNAPP-Überwachung einbezogen werden?

**Antwort:** Weil GPU-Cluster, Modell-Serving-Endpunkte und Vektordatenbanken denselben Cloudfehlkonfigurations- und Berechtigungsrisiken unterliegen wie jede andere Cloud-Ressource und nicht als separate, unbeobachtete Kategorie behandelt werden sollten.

### 5. Wie gehst du vor, wenn eine AI-spezifische Schwachstelle trotz etabliertem Sicherheitsprogramm unentdeckt bleibt?

**Antwort:** Ich prüfe, ob das betroffene AI-System tatsächlich in den bestehenden Threat-Modeling-Prozess und die CSPM-/CNAPP-Überwachung einbezogen wurde, da eine fehlende Integration die häufigste Ursache für unentdeckte AI-spezifische Schwachstellen ist.

### 6. Widersprüchliche Anforderung: AI-Entwicklungsteam will schnelle, unabhängige Iteration ohne Verzögerung durch klassische Sicherheitsprozesse UND das Sicherheitsteam will vollständige Integration jedes AI-Systems in etablierte Threat-Modeling- und Überwachungsprozesse — wie gehst du vor?

**Antwort:** Ich würde ein leichtgewichtiges, für AI-Systeme angepasstes Threat-Modeling-Format vorschlagen (analog zum bereits etablierten schlanken STRIDE-Checklisten-Ansatz), das in den regulären AI-Entwicklungsprozess integriert statt als separater, verzögernder Schritt behandelt wird, kombiniert mit automatisierter Einbindung der AI-Infrastruktur in bestehende CSPM-/CNAPP-Überwachung ohne manuellen Zusatzaufwand — schnelle Iteration und vollständige Integration lassen sich durch schlanke, automatisierte Prozessintegration statt durch separate, parallele Sicherheitswege vereinbaren.

## Praktische Labs

~~~python
# Conceptual integration check: is an AI system covered by existing security processes? (not executed against a real security program)

def check_ai_security_integration(has_threat_model, infra_in_cspm_cnapp, responsibility_boundary_documented):
    gaps = []
    if not has_threat_model:
        gaps.append("AI system missing from Threat Modeling process (model/retrieval/agent trust boundaries)")
    if not infra_in_cspm_cnapp:
        gaps.append("AI infrastructure not covered by CSPM/CNAPP monitoring")
    if not responsibility_boundary_documented:
        gaps.append("no documented responsibility boundary between AI team and security team")
    return gaps if gaps else ["AI system fully integrated into existing security program"]

for gap in check_ai_security_integration(has_threat_model=False, infra_in_cspm_cnapp=True, responsibility_boundary_documented=False):
    print(gap)
~~~

## Dependencies, Cross-References und Quellen

1. OWASP-Dokumentation: [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-18.
2. NIST-Dokumentation: [AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework), abgerufen 2026-09-18.

Threat Modeling und Vertrauensgrenzen sind kanonisch in [KB-0537](01-threat-modeling-und-vertrauensgrenzen.md) behandelt; Prompt Injection und Instruktionsgrenzen kanonisch in [KB-0260](../11-genai-architecture/20-prompt-injection-und-instruktionsgrenzen.md); CSPM und CNAPP in [KB-0560](24-cspm-und-cnapp.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, standardisierte AI-spezifische Bedrohungsklassifikationsrahmen (etwa OWASP LLM Top 10), die systematisch in bestehende Threat-Modeling-Checklisten integriert werden können | Evaluating | Gegenüber ad hoc entwickelten, unternehmensspezifischen AI-Bedrohungskatalogen erst nach Prüfung der tatsächlichen Abdeckung für den konkreten Anwendungskontext bevorzugen. |

Ein Team akzeptiert eine AI-Security-Integration erst, wenn Modell-, Retrieval- und Agentenbedrohungen nachweislich in bestehende Threat-Modeling- und CSPM-/CNAPP-Prozesse integriert sind, mit expliziten, dokumentierten Verantwortungsgrenzen.
