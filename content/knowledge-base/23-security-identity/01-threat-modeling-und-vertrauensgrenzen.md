---
{"id": "KB-0537", "title": "Threat Modeling und Vertrauensgrenzen", "domain": "23", "sequence": 1, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Assets, Angreiferziele und Datenflüsse erfassen und STRIDE sowie Angriffsbäume anhand offizieller Methodik auf konkrete Vertrauensgrenzen anwenden können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Architektur explizit Vertrauensgrenzen identifizieren und Kontrollen gezielt überprüfbaren, konkret identifizierten Bedrohungen zuordnen, statt generische Sicherheitsmaßnahmen ohne Bedrohungsbezug einzusetzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine Sicherheitslücke auf eine nicht identifizierte oder falsch gezogene Vertrauensgrenze im ursprünglichen Threat-Modeling-Prozess zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für systematisches Threat Modeling als verbindlichen Bestandteil des Architekturprozesses statt einer optionalen, nachträglichen Übung festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailanwendung spezifischer Threat-Modeling-Werkzeuge (Diagrammierungssoftware, automatisierte STRIDE-Vorschläge) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von Vertrauensgrenzen, STRIDE-Kategorien und Angriffsbäumen als methodische Grundlage, nicht die werkzeugspezifische Unterstützung."}}, "lab_validation": [{"lab_id": "KB-0537-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation eines STRIDE-basierten Threat-Modeling-Durchlaufs für einen einfachen Datenfluss, kein produktives System analysiert", "evidence": "Ein lokales Skript simuliert einen Datenfluss über eine definierte Vertrauensgrenze hinweg und ordnet systematisch jede der sechs STRIDE-Kategorien (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) diesem Datenfluss zu, um zu zeigen, wie eine strukturierte Bedrohungsidentifikation systematisch statt ad hoc erfolgt.", "limitations": "Simulation mit synthetischem, vereinfachtem Datenfluss, keine reale Systemarchitektur analysiert."}]}
---
# Threat Modeling und Vertrauensgrenzen

> **Ziel:** Threat Modeling identifiziert systematisch **Assets** (schützenswerte Werte — Daten, Funktionalität, Verfügbarkeit), **Angreiferziele** (was ein Angreifer erreichen will), und **Datenflüsse** (wie Informationen zwischen Systemkomponenten fließen), um darauf aufbauend **Vertrauensgrenzen** zu identifizieren — die Punkte, an denen Daten oder Kontrolle von einer weniger vertrauenswürdigen zu einer stärker vertrauenswürdigen Zone übergehen (etwa von einem öffentlichen Internet-Client zu einem internen Backend-Dienst). **STRIDE** (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) ist eine strukturierte Kategorisierung, die systematisch auf jede identifizierte Vertrauensgrenze angewendet wird, um relevante Bedrohungskategorien nicht zu übersehen. **Angriffsbäume** modellieren, über welche konkreten Schrittfolgen ein Angreifer ein bestimmtes Ziel tatsächlich erreichen könnte. Der zentrale Punkt dieses Kapitels ist, dass eine Sicherheitslücke häufig nicht auf eine fehlende einzelne Kontrolle zurückzuführen ist, sondern auf eine im ursprünglichen Threat-Modeling-Prozess nicht identifizierte oder falsch gezogene Vertrauensgrenze — Kontrollen, die überprüfbaren, konkret identifizierten Bedrohungen zugeordnet sind, sind wirksamer als generische Sicherheitsmaßnahmen, die ohne systematische Bedrohungsanalyse angewendet werden.

## Zweck, Mental Model und Dependencies

Threat Modeling löst das Problem, dass Sicherheitsmaßnahmen ohne systematische Grundlage entweder redundant (mehrere Kontrollen gegen dieselbe, bereits ausreichend adressierte Bedrohung) oder lückenhaft (eine reale Bedrohung bleibt vollständig unadressiert) angewendet werden. Der Prozess beginnt mit der Erfassung der Assets (was ist schützenswert?) und der plausiblen Angreiferziele (was würde ein Angreifer mit Zugriff auf welches Asset erreichen wollen?), bevor Datenflussdiagramme erstellt werden, die zeigen, wie Informationen und Kontrolle tatsächlich zwischen Systemkomponenten fließen. Vertrauensgrenzen werden explizit in diesen Datenflussdiagrammen markiert — jeder Punkt, an dem Daten von einer Komponente mit einem Vertrauensniveau zu einer Komponente mit einem anderen Vertrauensniveau übergehen (ein externer API-Endpunkt, eine Datenbankverbindung, eine Interprozesskommunikation zwischen unterschiedlich privilegierten Diensten), ist ein Kandidat für gezielte Sicherheitskontrollen. STRIDE wird systematisch auf jede identifizierte Vertrauensgrenze angewendet, um sicherzustellen, dass keine relevante Bedrohungskategorie übersehen wird: Spoofing (Vortäuschen einer falschen Identität), Tampering (unbefugte Veränderung von Daten), Repudiation (Abstreiten einer durchgeführten Aktion ohne Nachweismöglichkeit), Information Disclosure (unbefugte Offenlegung von Informationen), Denial of Service (Verhinderung legitimer Nutzung), und Elevation of Privilege (unbefugte Erlangung höherer Berechtigungen) — für jede Grenze wird explizit geprüft, welche dieser Kategorien tatsächlich relevant ist, statt eine Kategorie implizit zu übergehen. Angriffsbäume vertiefen diese Analyse für besonders kritische Ziele, indem sie explizit modellieren, über welche konkreten, aufeinanderfolgenden Schritte (etwa: zunächst Zugriff auf ein weniger kritisches System erlangen, dann von dort aus laterale Bewegung zum eigentlichen Ziel) ein Angreifer ein bestimmtes Ziel tatsächlich erreichen könnte, was hilft, Kontrollen an den kritischsten Punkten der Angriffskette statt gleichmäßig verteilt über alle theoretisch möglichen Schritte zu priorisieren. Die entscheidende methodische Disziplin ist, jede eingeführte Sicherheitskontrolle explizit einer konkret identifizierten Bedrohung zuzuordnen — eine Kontrolle ohne erkennbaren Bezug zu einer im Threat Model identifizierten Bedrohung ist entweder überflüssig oder deutet darauf hin, dass das Threat Model selbst unvollständig ist.

~~~text
Threat Modeling: systematic identification of ASSETS + ATTACKER GOALS + DATA FLOWS
  -> identifies TRUST BOUNDARIES: points where data/control crosses trust levels
     (external client -> internal backend, DB connection, IPC between differently-privileged services)
STRIDE: systematic categorization applied to EVERY identified trust boundary
  Spoofing (fake identity) / Tampering (unauthorized data change) / Repudiation (denying an action, no proof)
  Information Disclosure (unauthorized exposure) / Denial of Service (prevents legitimate use)
  Elevation of Privilege (unauthorized higher permissions)
  -> explicitly check EACH category per boundary, don't implicitly skip any
Attack Trees: model CONCRETE step sequences an attacker could use to reach a critical goal
  -> e.g. compromise less-critical system FIRST -> lateral movement to actual target
  -> helps prioritize controls at MOST CRITICAL chain points, not evenly across all theoretical steps
KEY METHODOLOGICAL DISCIPLINE: every introduced control MUST map to a concretely identified threat
  control WITHOUT clear threat-model link -> either redundant, OR threat model itself incomplete
Security gap usually != single missing control
  -> usually = trust boundary NOT identified or WRONGLY drawn in the original threat modeling process
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Assets und Angreiferziele | schützenswerte Werte und plausible Angreifermotivation | Grundlage für priorisierte Bedrohungsanalyse |
| Datenflussdiagramme | zeigen tatsächlichen Informations-/Kontrollfluss | Basis zur Identifikation von Vertrauensgrenzen |
| STRIDE | systematische Bedrohungskategorisierung pro Grenze | verhindert Übersehen relevanter Bedrohungskategorien |
| Angriffsbäume | konkrete Schrittfolgen zu kritischen Zielen | priorisiert Kontrollen an kritischsten Kettenpunkten |
| Kontroll-Bedrohungs-Zuordnung | jede Kontrolle einer konkreten Bedrohung zugeordnet | verhindert redundante oder lückenhafte Kontrollen |

Implementierung: Für jede neue Architektur oder signifikante Änderung wird ein Datenflussdiagramm mit explizit markierten Vertrauensgrenzen erstellt, bevor Sicherheitskontrollen festgelegt werden. STRIDE wird systematisch, nicht selektiv, auf jede identifizierte Vertrauensgrenze angewendet. Für besonders kritische Ziele werden Angriffsbäume erstellt, um Kontrollen an den kritischsten Punkten der Angriffskette zu priorisieren. Jede eingeführte Kontrolle wird explizit mit der Bedrohung verknüpft, die sie adressiert.

## Scalability, Reliability, Security und Observability

Threat Modeling skaliert die tatsächliche Sicherheitsabdeckung proportional zur Vollständigkeit der identifizierten Vertrauensgrenzen und der systematischen STRIDE-Anwendung; die Reliability-Grenze liegt darin, dass eine nicht identifizierte oder falsch gezogene Vertrauensgrenze proportional zu ihrer Kritikalität eine unentdeckte, unadressierte Sicherheitslücke darstellt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Sicherheitslücke wird trotz vorhandener Kontrollen ausgenutzt | die zugrunde liegende Vertrauensgrenze wurde im ursprünglichen Threat Model nicht identifiziert oder falsch gezogen | das Datenflussdiagramm und die Vertrauensgrenzen für den betroffenen Bereich erneut, vollständig prüfen |
| eine Kontrolle existiert, ohne dass ihr Zweck klar ist | die Kontrolle wurde ohne explizite Zuordnung zu einer im Threat Model identifizierten Bedrohung eingeführt | prüfen, ob die Kontrolle einer konkreten Bedrohung zugeordnet werden kann, oder ob sie entfernt werden sollte |
| eine bestimmte Bedrohungskategorie wird systematisch übersehen | STRIDE wurde nicht vollständig, sondern nur selektiv auf die Vertrauensgrenzen angewendet | STRIDE systematisch und vollständig auf alle identifizierten Vertrauensgrenzen erneut anwenden |

Security: Threat Modeling sollte als verbindlicher, wiederkehrender Bestandteil des Architekturprozesses etabliert werden, nicht als einmalige, nachträgliche Übung. Observability: Die Vollständigkeit der Vertrauensgrenzenidentifikation, die tatsächliche Kontroll-Bedrohungs-Zuordnungsrate, und die Häufigkeit von Sicherheitsvorfällen, die auf nicht identifizierte Vertrauensgrenzen zurückzuführen sind, sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** erstellt ein Datenflussdiagramm mit korrekt identifizierten Vertrauensgrenzen für eine gegebene Komponente. **Principal** führt einen vollständigen STRIDE-basierten Threat-Modeling-Prozess für eine Architektur durch und priorisiert Kontrollen anhand von Angriffsbäumen. **Chief** legt unternehmensweite Standards fest, die Threat Modeling als verbindlichen Architekturprozess-Bestandteil vorschreiben.

Anti-Patterns: Sicherheitskontrollen ohne systematisches Threat Modeling generisch einführen; STRIDE nur selektiv statt vollständig auf identifizierte Vertrauensgrenzen anwenden; Threat Modeling als einmalige, nachträgliche Übung statt wiederkehrenden Architekturprozess-Bestandteil behandeln.

## Production Checklist

- [ ] Ein Datenflussdiagramm mit explizit markierten Vertrauensgrenzen existiert für jede signifikante Architektur.
- [ ] STRIDE wird systematisch und vollständig auf jede identifizierte Vertrauensgrenze angewendet.
- [ ] Angriffsbäume priorisieren Kontrollen für besonders kritische Ziele.
- [ ] Jede eingeführte Sicherheitskontrolle ist explizit einer konkret identifizierten Bedrohung zugeordnet.

## Interviewfragen

### 1. Was ist eine Vertrauensgrenze im Kontext von Threat Modeling?

**Antwort:** Ein Punkt, an dem Daten oder Kontrolle von einer weniger vertrauenswürdigen zu einer stärker vertrauenswürdigen Zone übergehen, etwa von einem externen Client zu einem internen Backend-Dienst.

### 2. Wofür steht STRIDE, und wofür wird es genutzt?

**Antwort:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege — eine systematische Kategorisierung, die auf jede identifizierte Vertrauensgrenze angewendet wird, um relevante Bedrohungskategorien nicht zu übersehen.

### 3. Wofür werden Angriffsbäume genutzt?

**Antwort:** Um konkrete, aufeinanderfolgende Schrittfolgen zu modellieren, über die ein Angreifer ein bestimmtes Ziel tatsächlich erreichen könnte, was hilft, Kontrollen an den kritischsten Punkten der Angriffskette zu priorisieren.

### 4. Warum sollte jede Sicherheitskontrolle explizit einer konkreten Bedrohung zugeordnet werden?

**Antwort:** Weil eine Kontrolle ohne erkennbaren Bezug zu einer identifizierten Bedrohung entweder überflüssig ist oder darauf hindeutet, dass das zugrunde liegende Threat Model unvollständig ist.

### 5. Wie gehst du vor, wenn eine Sicherheitslücke trotz vorhandener Kontrollen ausgenutzt wird?

**Antwort:** Ich prüfe zuerst, ob die zugrunde liegende Vertrauensgrenze im ursprünglichen Threat Model nicht identifiziert oder falsch gezogen wurde, da dies die häufigste Ursache für eine solche Lücke ist, nicht ein Fehler in einer einzelnen Kontrolle.

### 6. Widersprüchliche Anforderung: Team will schnelle Feature-Entwicklung ohne Verzögerung durch aufwendige Sicherheitsanalyse UND vollständige, systematische Bedrohungsabdeckung für jede neue Architektur — wie gehst du vor?

**Antwort:** Ich würde ein leichtgewichtiges, aber verbindliches Threat-Modeling-Format vorschlagen (etwa ein kurzes Datenflussdiagramm mit STRIDE-Checkliste pro signifikanter Architekturänderung), das in den regulären Architekturprozess integriert statt als separater, zeitaufwendiger Schritt behandelt wird — systematische Abdeckung und Entwicklungsgeschwindigkeit lassen sich durch ein schlankes, aber konsequent angewendetes Verfahren statt durch den Verzicht auf Threat Modeling vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of systematic STRIDE application to a data flow (executed locally, no real system analyzed):

STRIDE_CATEGORIES = ["Spoofing", "Tampering", "Repudiation", "Information Disclosure", "Denial of Service", "Elevation of Privilege"]

def apply_stride(trust_boundary_name):
    return {category: f"assess relevance of {category} at boundary '{trust_boundary_name}'" for category in STRIDE_CATEGORIES}

boundary = "external-client-to-internal-api"
assessment = apply_stride(boundary)
for category, action in assessment.items():
    print(f"{category}: {action}")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft-Dokumentation: [Threat Modeling Overview — STRIDE](https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats), abgerufen 2026-09-18.
2. OWASP-Dokumentation: [Threat Modeling Process](https://owasp.org/www-community/Threat_Modeling_Process), abgerufen 2026-09-18.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, KI-gestützte automatische Vorschläge für Vertrauensgrenzen und STRIDE-Kategorien basierend auf Architekturdiagrammen | Evaluating | Gegenüber vollständig manuellem Threat Modeling erst nach Prüfung der tatsächlichen Vollständigkeit und Genauigkeit automatisierter Vorschläge bevorzugen, nicht als Ersatz für menschliche Überprüfung. |

Ein Team akzeptiert eine Architektur erst, wenn ein vollständiges Threat Model mit identifizierten Vertrauensgrenzen, systematischer STRIDE-Anwendung, und expliziter Kontroll-Bedrohungs-Zuordnung existiert.
