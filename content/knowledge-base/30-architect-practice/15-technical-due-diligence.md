---
{"id": "KB-0691", "title": "Technical Due Diligence", "domain": "30", "sequence": 15, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0677", "concepts": ["Fakten-/Annahmen-Trennung"], "needed_for": "Technical Due Diligence ist eine Discovery unter Zeitdruck, die auf der in KB-0677 beschriebenen Fakten-/Annahmen-Trennung aufbaut"}, {"id": "KB-0684", "concepts": ["Evidenzbasierte Reviewfeststellungen"], "needed_for": "Due Diligence nutzt dieselbe Evidenzpflicht wie das in KB-0684 beschriebene Architekturreview"}], "related": ["KB-0690"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes Zielunternehmen Architektur, Code, Betrieb und Teamfähigkeit anhand zugänglicher Evidenz untersuchen und die Ergebnisse zu einer verdichteten Risikoeinschätzung zusammenfassen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Due-Diligence-Prüfung mehrere Untersuchungsbereiche priorisieren und explizit benennen, welche Aussagen aufgrund begrenzter Zeit und Zugänglichkeit tatsächlich Annahmen statt gesicherter Fakten bleiben.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Due-Diligence-Einschätzung auf unzugänglicher oder unvollständiger Evidenz eine unbegründete Gewissheit vortäuscht.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Eine Investitions- oder Übernahmeentscheidung anhand einer verdichteten, evidenzbasierten Due-Diligence-Einschätzung mit expliziter Unsicherheitsdarstellung treffen und verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, vertragsrechtliche oder finanzielle Due-Diligence-Prüfung im Detail ist außerhalb des technischen Fokus dieses Kapitels und erfordert entsprechende Fachbereiche.", "rationale": "Kern ist die technische Untersuchung von Architektur, Code, Betrieb und Teamfähigkeit, nicht die finanzielle oder rechtliche Due Diligence."}}, "lab_validation": [{"lab_id": "KB-0691-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung einer zeitkritischen, evidenzbasierten Due-Diligence-Verdichtung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie eine begrenzte Zugänglichkeit zu Code und Betriebsdaten während einer Due Diligence explizit als Unsicherheit statt als vollständig geprüfter Fakt dokumentiert wird, und wie dies die abschließende Risikoeinschätzung beeinflusst.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Technical Due Diligence

> **Ziel:** Technical Due Diligence ist eine Discovery (siehe KB-0677) unter erheblichem Zeitdruck und begrenzter Zugänglichkeit, im Kontext einer Investitions- oder Übernahmeentscheidung — sie untersucht vier Bereiche eines Zielunternehmens: **Architektur** (wie das System tatsächlich strukturiert ist und welche technischen Risiken tatsächlich bestehen), **Code** (die tatsächliche Codequalität, soweit tatsächlich zugänglich), **Betrieb** (wie das System tatsächlich betrieben wird, einschließlich Ausfallhistorie und operativer Reife) und **Teamfähigkeit** (ob das bestehende Team tatsächlich in der Lage ist, das System weiterzuentwickeln und zu betreiben). Der zentrale Punkt dieses Kapitels ist, dass Unsicherheit und wesentliche Risiken zu einer verdichteten Einschätzung zusammengeführt werden müssen, die explizit zwischen tatsächlich geprüften Fakten und aufgrund begrenzter Zeit oder Zugänglichkeit unvermeidlichen Annahmen unterscheidet — eine Due-Diligence-Einschätzung, die eine unbegründete Gewissheit vortäuscht, weil tatsächlich nicht zugängliche Bereiche stillschweigend als unkritisch behandelt wurden, kann tatsächlich zu einer fehlerhaften Investitionsentscheidung führen.

## Zweck, Mental Model und Dependencies

Architektur zu untersuchen bedeutet, tatsächlich zu verstehen, wie das Zielsystem strukturiert ist, welche technischen Abhängigkeiten bestehen und welche architektonischen Risiken tatsächlich vorliegen (etwa eine monolithische Architektur, die tatsächlich schwer zu skalieren ist, oder eine kritische Abhängigkeit von einer veralteten Technologie) — diese Untersuchung entspricht methodisch dem in KB-0684 beschriebenen Architekturreview, jedoch unter der zusätzlichen Einschränkung, dass die Zeit und der Zugriff auf interne Dokumentation und Personal tatsächlich begrenzt sind. Code zu untersuchen bedeutet, tatsächlich so weit wie zugänglich die Codequalität zu bewerten (etwa Testabdeckung, Komplexität, technische Schuld) — bei begrenztem Zugriff (etwa nur auf einen Ausschnitt der Codebasis) muss die Einschränkung der Aussage explizit benannt werden, statt aus einem begrenzten Ausschnitt fälschlich auf die Qualität der gesamten Codebasis zu schließen. Betrieb zu untersuchen bedeutet, tatsächlich die operative Reife zu bewerten — etwa die tatsächliche Ausfallhistorie, ob Incident-Response-Prozesse (siehe KB-0580) tatsächlich etabliert sind, und ob das System tatsächlich beobachtbar und diagnostizierbar ist; ein System, das funktional beeindruckt, aber tatsächlich operativ fragil ist, stellt ein Risiko dar, das eine rein funktionale Prüfung nicht aufdecken würde. Teamfähigkeit zu untersuchen bedeutet, tatsächlich zu bewerten, ob das bestehende Team über das notwendige Wissen verfügt, um das System nach der Transaktion tatsächlich weiterzuentwickeln — ein technisch exzellentes System, dessen Wissen tatsächlich auf wenige, nach der Transaktion potenziell abwandernde Schlüsselpersonen konzentriert ist, stellt ein erhebliches, oft unterschätztes Risiko dar (entsprechend der in KB-0683 beschriebenen Bedeutung von Wissenserhalt). Die verdichtete Einschätzung zusammenzuführen bedeutet, alle vier Untersuchungsbereiche zu einer abschließenden Risikobewertung zu kombinieren, die explizit zwischen tatsächlich geprüften Fakten und aufgrund begrenzter Zeit oder Zugänglichkeit unvermeidlichen Annahmen unterscheidet — diese Unterscheidung entspricht direkt dem in KB-0677 eingeführten Prinzip, hier jedoch unter der besonderen Dringlichkeit einer zeitkritischen Investitionsentscheidung, bei der eine Fehleinschätzung tatsächlich erhebliche finanzielle Konsequenzen haben kann.

~~~text
Technical Due Diligence = a Discovery (see KB-0677) under substantial time pressure +
  limited accessibility, in context of investment/acquisition decision -- examines 4
  areas of target company
  ARCHITECTURE: how system ACTUALLY structured + what technical risks ACTUALLY exist
  CODE: ACTUAL code quality, as far as ACTUALLY accessible
  OPERATIONS: how system ACTUALLY operated, incl. outage history + operational maturity
  TEAM CAPABILITY: whether existing team ACTUALLY capable of further developing +
  operating system
KEY POINT: uncertainty + material risks must be brought together into a compressed
  assessment explicitly distinguishing ACTUALLY checked facts from unavoidable
  assumptions due to limited time/accessibility -- due diligence assessment faking
  unfounded certainty because ACTUALLY inaccessible areas were silently treated as
  uncritical CAN ACTUALLY lead to a flawed investment decision
EXAMINING ARCHITECTURE means ACTUALLY understanding how target system structured, what
  technical dependencies exist, what architectural risks ACTUALLY present (monolithic
  architecture ACTUALLY hard to scale, critical dependency on outdated tech) --
  methodically corresponds to KB-0684's architecture review, under additional
  constraint that time + access to internal docs/staff ACTUALLY limited
EXAMINING CODE means ACTUALLY assessing code quality as far as accessible (test
  coverage, complexity, technical debt) -- under limited access (only a slice of
  codebase), limitation of statement must be explicitly named, instead of falsely
  inferring entire codebase's quality from a limited slice
EXAMINING OPERATIONS means ACTUALLY assessing operational maturity -- ACTUAL outage
  history, whether incident response processes (see KB-0580) ACTUALLY established, is
  system ACTUALLY observable+diagnosable -- system functionally impressive but ACTUALLY
  operationally fragile = risk a purely functional check wouldn't uncover
EXAMINING TEAM CAPABILITY means ACTUALLY assessing whether existing team has knowledge
  necessary to ACTUALLY further develop system post-transaction -- technically excellent
  system whose knowledge ACTUALLY concentrated in few, post-transaction potentially
  departing key people = substantial, often underestimated risk (per KB-0683's
  knowledge-retention importance)
COMBINING COMPRESSED ASSESSMENT means combining all 4 examination areas into final risk
  assessment explicitly distinguishing ACTUALLY checked facts from unavoidable
  assumptions due to limited time/accessibility -- directly corresponds to KB-0677's
  principle, here under special urgency of a time-critical investment decision where a
  misjudgment CAN ACTUALLY have substantial financial consequences
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Architekturuntersuchung unter Zeitdruck | identifiziert strukturelle, technische Risiken | angewandtes Architekturreview mit begrenzter Zeit/Zugänglichkeit |
| Code-Stichprobenprüfung mit expliziter Einschränkung | verhindert Fehlschluss von Ausschnitt auf Gesamtqualität | Aussagen müssen tatsächlichen Zugriffsumfang widerspiegeln |
| Betriebliche Reifebewertung | deckt operative Fragilität auf, die Funktionsprüfung nicht zeigt | Ausfallhistorie, Incident-Response, Beobachtbarkeit |
| Teamfähigkeits- und Wissenskonzentrationsrisiko | bewertet Weiterentwicklungsfähigkeit nach Transaktion | schützt vor Wissensverlust bei Schlüsselpersonenabwanderung |
| Verdichtete, fakten-/annahmenbasierte Gesamteinschätzung | trennt tatsächlich Geprüftes von unvermeidlichen Annahmen | verhindert vorgetäuschte Gewissheit bei Investitionsentscheidung |

Implementierung: Die Untersuchung priorisiert die vier Bereiche nach tatsächlich verfügbarer Zeit und Zugänglichkeit. Jede Aussage wird explizit als tatsächlich geprüfter Fakt oder als Annahme mit benannter Einschränkung gekennzeichnet. Die abschließende Einschätzung verdichtet alle Bereiche zu einer nachvollziehbaren Risikobewertung für die Investitionsentscheidung.

## Scalability, Reliability, Security und Observability

Eine Technical-Due-Diligence-Praxis skaliert über die Anzahl der parallel zu prüfenden Investitionskandidaten; die Reliability-Grenze liegt darin, dass eine unter Zeitdruck vorgetäuschte Gewissheit über tatsächlich nicht geprüfte Bereiche zu einer fehlerhaften Investitionsentscheidung führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| nach einer Übernahme zeigen sich unerwartete, technische Altlasten | die Codeprüfung basierte auf einer zu kleinen, nicht repräsentativen Stichprobe, ohne dies explizit zu kennzeichnen | künftige Prüfungen um eine explizite Kennzeichnung des tatsächlichen Stichprobenumfangs ergänzen |
| Schlüsselpersonal verlässt das Unternehmen kurz nach der Transaktion, und die Weiterentwicklung stockt | die Wissenskonzentration im Team wurde vor der Entscheidung nicht bewertet | für künftige Due Diligence eine explizite Teamfähigkeits- und Wissenskonzentrationsbewertung durchführen |
| eine Due-Diligence-Einschätzung erwies sich nachträglich als zu optimistisch | Unsicherheiten aufgrund begrenzter Zugänglichkeit wurden nicht explizit dargestellt | die Einschätzung um eine explizite Trennung von Fakten und Annahmen ergänzen |

Security: Sicherheitsrelevante Aspekte des Zielsystems (etwa bekannte Sicherheitslücken oder fehlende Zertifizierungen) sollten explizit als eigener Untersuchungsbereich behandelt werden. Observability: Die tatsächliche Übereinstimmung zwischen der Due-Diligence-Einschätzung und dem später tatsächlich beobachteten Systemverhalten nach der Transaktion ist ein zentrales Signal zur Bewertung der Prüfungsqualität.

## Trade-offs und Entscheidungen

**Staff** untersucht für einen begrenzten Bereich (etwa eine Code-Stichprobe) und dokumentiert die tatsächliche Einschränkung der Aussage. **Principal** führt die vollständige, vierteilige Due-Diligence-Untersuchung mit verdichteter Risikoeinschätzung durch. **Chief** trifft die Investitions- oder Übernahmeentscheidung auf Basis der verdichteten, evidenzbasierten Einschätzung und verantwortet diese.

Anti-Patterns: aus einer begrenzten Code-Stichprobe fälschlich auf die Qualität der gesamten Codebasis schließen; die Wissenskonzentration im Team nicht bewerten; eine Due-Diligence-Einschätzung ohne explizite Trennung von Fakten und Annahmen präsentieren.

## Production Checklist

- [ ] Architektur, Code, Betrieb und Teamfähigkeit sind alle vier untersucht, mit explizit dokumentiertem Zugriffsumfang.
- [ ] Aussagen sind explizit als tatsächlich geprüfte Fakten oder als Annahmen mit Einschränkung gekennzeichnet.
- [ ] Die Wissenskonzentration im Team ist explizit bewertet.
- [ ] Die abschließende Einschätzung verdichtet alle Bereiche zu einer nachvollziehbaren, fakten-/annahmenbasierten Risikobewertung.

## Interviewfragen

### 1. Warum ist Technical Due Diligence eine Discovery unter besonderem Zeitdruck?

**Antwort:** Weil sie im Kontext einer Investitions- oder Übernahmeentscheidung mit begrenzter Zeit und begrenzter Zugänglichkeit zu internen Systemen und Personal durchgeführt werden muss.

### 2. Warum darf aus einer begrenzten Code-Stichprobe nicht fälschlich auf die Qualität der gesamten Codebasis geschlossen werden?

**Antwort:** Weil der geprüfte Ausschnitt möglicherweise nicht repräsentativ für die tatsächliche Gesamtqualität ist, und diese Einschränkung explizit benannt werden muss.

### 3. Warum ist die Bewertung der Teamfähigkeit und Wissenskonzentration besonders wichtig bei einer Übernahmeentscheidung?

**Antwort:** Weil ein technisch exzellentes System, dessen Wissen auf wenige, potenziell abwandernde Schlüsselpersonen konzentriert ist, nach der Transaktion ein erhebliches Weiterentwicklungsrisiko darstellt.

### 4. Warum muss die abschließende Due-Diligence-Einschätzung zwischen Fakten und Annahmen unterscheiden?

**Antwort:** Weil eine vorgetäuschte Gewissheit über tatsächlich nicht geprüfte Bereiche zu einer fehlerhaften, finanziell folgenreichen Investitionsentscheidung führen kann.

### 5. Wie gehst du vor, wenn sich nach einer Übernahme unerwartete, technische Altlasten zeigen?

**Antwort:** Ich prüfe, ob die ursprüngliche Codeprüfung auf einer zu kleinen, nicht repräsentativen Stichprobe basierte, ohne dies explizit zu kennzeichnen, und ergänze künftige Prüfungen um eine explizite Kennzeichnung des tatsächlichen Untersuchungsumfangs.

### 6. Widersprüchliche Anforderung: Der Investor will eine schnelle Entscheidung innerhalb weniger Tage UND die Organisation will vollständige technische Sicherheit über Architektur, Code, Betrieb und Team — wie gehst du vor?

**Antwort:** Ich würde die verfügbare Zeit auf die tatsächlich risikorelevantesten Bereiche konzentrieren und für die übrigen Bereiche explizit dokumentieren, dass sie aufgrund der begrenzten Zeit nur eingeschränkt oder gar nicht geprüft werden konnten, statt eine vollständige Prüfung vorzutäuschen, die tatsächlich nicht stattgefunden hat.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Investor plant die Übernahme eines Unternehmens mit einer GenAI-gestützten Plattform (angelehnt an Domain 11). Die Due Diligence erhält nur eingeschränkten Zugriff auf 20% der Codebasis und keinen direkten Zugang zu den Kernentwicklern.

~~~python
# Local, deterministic illustration of compressing due diligence findings with explicit fact/assumption separation (fictional lab example, no real target company):

findings = [
    {"area": "architecture", "statement": "monolithic core with tight coupling", "type": "fact", "access_scope": "full architecture docs reviewed"},
    {"area": "code", "statement": "moderate test coverage observed", "type": "assumption", "access_scope": "only 20% of codebase accessible"},
    {"area": "team", "statement": "knowledge concentration unknown", "type": "open_question", "access_scope": "no access to core developers"},
]

def compress_assessment(findings):
    facts = [f for f in findings if f["type"] == "fact"]
    assumptions = [f for f in findings if f["type"] != "fact"]
    return {"confirmed_risks": facts, "unresolved_uncertainty": assumptions}

print(compress_assessment(findings))
~~~

Erwartete Beobachtung: Die verdichtete Einschätzung zeigt klar, dass die Team-Wissenskonzentration eine offene, ungeklärte Unsicherheit bleibt, statt fälschlich als geprüft dargestellt zu werden. Auswertung: Der Investor kann die Entscheidung auf Basis der tatsächlich vorliegenden Evidenz treffen und das ungeklärte Teamrisiko explizit in die Kaufpreisverhandlung oder vertragliche Absicherung einbeziehen.

## Dependencies, Cross-References und Quellen

1. ThoughtWorks: [Technology Due Diligence — A Practical Guide](https://www.thoughtworks.com/insights), abgerufen 2026-09-18.
2. Software Engineering Institute (SEI), Carnegie Mellon University: [Architecture Tradeoff Analysis Method (ATAM)](https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/), abgerufen 2026-09-18.

Dieses Kapitel wendet die in KB-0677 (Architektur-Discovery) beschriebene Fakten-/Annahmen-Trennung und die in KB-0684 (Architekturreviews) beschriebene Evidenzpflicht auf den zeitkritischen Kontext von Investitionsentscheidungen an.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, automatisierte Codebasis-Analyse zur beschleunigten Bewertung von Testabdeckung und technischer Schuld unter Zeitdruck | Growing Adoption | Bei künftigen, zeitkritischen Due-Diligence-Prüfungen als Ergänzung evaluieren, jedoch die finale, verdichtete Risikoeinschätzung weiterhin durch menschliche Experten mit expliziter Fakten-/Annahmen-Trennung treffen lassen. |

Ein Team akzeptiert eine Technical-Due-Diligence-Einschätzung erst, wenn alle vier Untersuchungsbereiche behandelt und die abschließende Bewertung nachweislich zwischen tatsächlich geprüften Fakten und Annahmen unterscheidet.
