---
{"id": "KB-0564", "title": "Kryptografische Agilität und PQ-Migration", "domain": "23", "sequence": 28, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0551", "concepts": ["PKI und Zertifikatslebenszyklen"], "needed_for": "understanding"}, {"id": "KB-0554", "concepts": ["KMS und HSM"], "needed_for": "understanding"}, {"id": "KB-0563", "concepts": ["MITRE ATT&CK und Angriffsketten"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Kryptoabhängigkeiten systematisch inventarisieren und Austauschbarkeit anhand aktueller NIST-Standardquellen für eine spätere Post-Quantum-Migration korrekt planen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit priorisieren, welche Datenklassen aufgrund von Harvest-Now-Decrypt-Later-Risiko besonders dringend hybride, quantenresistente Verfahren benötigen, statt eine PQ-Migration pauschal und unpriorisiert für alle Systeme gleichzeitig anzugehen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine verzögerte, unter Zeitdruck fehleranfällige PQ-Migration auf eine fehlende, frühzeitig aufgebaute kryptografische Agilität zurückführen können, statt eine grundsätzlich fehlende Verfügbarkeit quantenresistenter Algorithmen zu vermuten.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für priorisierte, risikobasierte Post-Quantum-Migrationsplanung festlegen, die Harvest-Now-Decrypt-Later-Exposition explizit als Priorisierungskriterium nutzt.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die mathematische Detailkonstruktion spezifischer Post-Quantum-Algorithmen im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis von kryptografischer Agilität, Harvest-Now-Decrypt-Later-Risikopriorisierung und hybriden Migrationsverfahren, nicht die algorithmische Detailkonstruktion."}}, "lab_validation": [{"lab_id": "KB-0564-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation priorisierter Harvest-Now-Decrypt-Later-Risikobewertung nach Datenklassifikation, kein produktives Kryptografiesystem verwendet", "evidence": "Ein lokales Skript simuliert, wie zwei verschlüsselte Datenklassen mit identischem aktuellem Schutzniveau unterschiedliche tatsächliche Dringlichkeit für eine Post-Quantum-Migration darstellen, abhängig von ihrer erforderlichen Vertraulichkeitsdauer (eine Datenklasse mit jahrzehntelanger Vertraulichkeitsanforderung ist durch Harvest-Now-Decrypt-Later erheblich stärker gefährdet als eine mit kurzer, bereits in wenigen Jahren ablaufender Relevanz), und zeigt damit, warum eine risikobasierte statt pauschale Priorisierung notwendig ist.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Kryptografiesystem mit tatsächlicher Algorithmus-Migrationsdynamik."}]}
---
# Kryptografische Agilität und PQ-Migration

> **Ziel:** Dieses Abschlusskapitel der Security/Identity-Domain führt die bereits behandelten kryptografischen Grundlagen (PKI und Zertifikatslebenszyklen, siehe [KB-0551](15-pki-und-zertifikatslebenszyklen.md); KMS und HSM, siehe [KB-0554](18-kms-und-hsm.md)) zu einer vollständigen Migrationsstrategie zusammen: **Kryptografische Agilität** (die Fähigkeit, einen kryptografischen Algorithmus auszutauschen, ohne die zugrunde liegende Systemarchitektur grundlegend umbauen zu müssen — bereits als frühzeitige Notwendigkeit in [KB-0551](15-pki-und-zertifikatslebenszyklen.md) eingeführt), **Harvest-Now-Decrypt-Later** (das Risiko, dass ein Angreifer bereits heute verschlüsselte Daten abfängt und speichert, in der Erwartung, sie später mit einem zukünftigen, ausreichend leistungsfähigen Quantencomputer zu entschlüsseln — dieses Risiko besteht bereits jetzt, unabhängig davon, wann ein solcher Quantencomputer tatsächlich verfügbar wird), und **hybride Verfahren** (die parallele Nutzung klassischer und quantenresistenter Algorithmen während der Übergangsphase, um sowohl gegen klassische als auch potenzielle künftige Quantenangriffe abgesichert zu sein). Der zentrale Punkt dieses Kapitels ist, dass eine verzögerte, unter Zeitdruck fehleranfällige PQ-Migration typischerweise nicht auf eine grundsätzlich fehlende Verfügbarkeit quantenresistenter Algorithmen zurückzuführen ist, sondern auf eine fehlende, frühzeitig aufgebaute kryptografische Agilität — eine Organisation, die ihre kryptografischen Abhängigkeiten nie systematisch inventarisiert und ihre Systeme nie auf tatsächliche Algorithmus-Austauschbarkeit ausgelegt hat, steht bei einer später tatsächlich notwendigen, dringenden Migration vor einer weitaus größeren, unter Zeitdruck fehleranfälligeren Aufgabe als eine Organisation, die diese Agilität bereits vorab strukturell verankert hat.

## Zweck, Mental Model und Dependencies

Kryptografische Agilität ist keine PQ-spezifische Eigenschaft, sondern eine grundlegende Architektureigenschaft, die bereits unabhängig von der Post-Quantum-Bedrohung wertvoll ist — sie ermöglicht es, auf jede zukünftige kryptografische Schwächung eines aktuell genutzten Algorithmus (durch klassische kryptoanalytische Fortschritte, nicht nur durch Quantencomputer) zeitnah zu reagieren, statt eine Systemarchitektur zu betreiben, die einen bestimmten Algorithmus so tief eingebettet hat, dass ein Austausch faktisch einem vollständigen Neubau gleichkäme. Die konkrete Grundlage kryptografischer Agilität ist eine vollständige, systematisch gepflegte Inventarisierung aller kryptografischen Abhängigkeiten — welche Algorithmen werden an welchen Stellen der Architektur tatsächlich genutzt (TLS-Verbindungen, Zertifikate, Datenverschlüsselung, digitale Signaturen), und wie tief sind diese Algorithmen in die jeweilige Implementierung eingebettet (eine konfigurierbare Algorithmus-Auswahl versus eine fest im Code verankerte, spezifische Implementierung). Harvest-Now-Decrypt-Later begründet, warum diese Migrationsplanung nicht erst beginnen sollte, wenn ein tatsächlich kryptografisch relevanter Quantencomputer existiert, sondern bereits heute: Ein Angreifer, der heute verschlüsselte, aber besonders langfristig sensible Daten (etwa Staatsgeheimnisse, langfristige medizinische Daten, oder geistiges Eigentum mit jahrzehntelanger Relevanz) abfängt und speichert, benötigt die Entschlüsselungsfähigkeit nicht sofort — er kann abwarten, bis ein ausreichend leistungsfähiger Quantencomputer verfügbar wird, und die heute bereits gesammelten, verschlüsselten Daten rückwirkend entschlüsseln. Dies bedeutet, dass die tatsächliche Dringlichkeit einer PQ-Migration nicht gleichmäßig über alle Datenklassen verteilt ist, sondern explizit nach der erforderlichen Vertraulichkeitsdauer priorisiert werden muss — Daten, deren Vertraulichkeitsanforderung bereits in wenigen Jahren erlischt, sind durch Harvest-Now-Decrypt-Later erheblich weniger gefährdet als Daten, die noch in Jahrzehnten vertraulich bleiben müssen. Hybride Verfahren adressieren die praktische Übergangsphase: Da quantenresistente Algorithmen vergleichsweise neu standardisiert sind und ihre langfristige kryptografische Robustheit noch nicht dieselbe jahrzehntelange Prüfungshistorie wie etablierte klassische Verfahren aufweist, kombinieren hybride Ansätze einen klassischen und einen quantenresistenten Algorithmus parallel — ein Angreifer müsste beide Verfahren gleichzeitig brechen, um tatsächlich Zugriff zu erlangen, was sowohl gegen bekannte klassische als auch potenzielle künftige Quantenangriffe während der Übergangsphase Schutz bietet, bis quantenresistente Verfahren allein als ausreichend erprobt gelten.

~~~text
Crypto-Agility (introduced in KB-0551, deepened here): ability to swap algorithm WITHOUT fundamental arch rebuild
  NOT PQ-specific -- valuable independently for ANY future algorithm weakening (classical cryptanalysis too)
  foundation: SYSTEMATIC inventory of ALL crypto dependencies
    which algorithms, WHERE (TLS/certs/data encryption/signatures), HOW DEEPLY embedded
    (configurable algo choice vs hardcoded specific implementation)
Harvest-Now-Decrypt-Later: attacker intercepts+stores TODAY's encrypted data
  -> doesn't need decryption capability NOW -- waits for future sufficiently-powerful quantum computer
  -> means URGENCY is NOT evenly distributed across data classes
  -> PRIORITIZE by required CONFIDENTIALITY DURATION
     short-lived relevance data: much less exposed than decades-long-confidential data (state secrets, long-term medical, IP)
Hybrid approaches: run CLASSICAL + quantum-resistant algorithm IN PARALLEL during transition
  -> attacker must break BOTH simultaneously
  -> protects against BOTH known classical AND potential future quantum attacks
  -> bridges gap while PQ algorithms accumulate the decades-long scrutiny classical algorithms already have
DELAYED, error-prone-under-pressure PQ migration
  -> usually NOT lack of available quantum-resistant algorithms
  -> usually = MISSING crypto-agility built EARLY, before urgency forced a rushed, larger-scope migration
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Kryptoabhängigkeits-Inventar | systematische Erfassung aller genutzten Algorithmen und Einbettungstiefe | Grundlage jeder Migrationsplanung |
| Harvest-Now-Decrypt-Later | Risiko heute abgefangener, später entschlüsselter Daten | begründet risikobasierte statt pauschale Priorisierung |
| Vertraulichkeitsdauer als Priorisierungskriterium | langfristig sensible Daten dringender als kurzlebige | steuert Reihenfolge der Migration |
| Hybride Verfahren | parallele klassische und quantenresistente Absicherung | schützt während Übergangsphase gegen beide Bedrohungsklassen |

Implementierung: Eine vollständige, regelmäßig aktualisierte Inventarisierung aller kryptografischen Abhängigkeiten wird geführt, mit expliziter Bewertung der Austauschbarkeit jedes genutzten Algorithmus. Datenklassen werden explizit nach ihrer erforderlichen Vertraulichkeitsdauer bewertet, um die PQ-Migrationsreihenfolge risikobasiert statt pauschal zu priorisieren. Für besonders langfristig sensible Daten werden hybride, klassisch-plus-quantenresistente Verfahren bereits vor einer vollständigen PQ-Migration eingeführt.

## Scalability, Reliability, Security und Observability

Kryptografische Agilität und PQ-Migrationsplanung skalieren die tatsächliche, langfristige Sicherheit proportional zur frühzeitig aufgebauten Austauschbarkeit kryptografischer Algorithmen; die Reliability-Grenze liegt darin, dass eine fehlende, frühzeitig etablierte Agilität proportional zur Dringlichkeit einer später notwendigen Migration das Risiko fehleranfälliger, unter Zeitdruck durchgeführter Änderungen erhöht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine PQ-Migration verzögert sich erheblich und ist unter Zeitdruck fehleranfällig | keine frühzeitige kryptografische Agilität wurde aufgebaut, Algorithmen sind tief in die Implementierung eingebettet | eine systematische Kryptoabhängigkeits-Inventarisierung und Austauschbarkeitsbewertung nachträglich, aber priorisiert einführen |
| besonders langfristig sensible Daten werden nicht priorisiert gegen Harvest-Now-Decrypt-Later geschützt | die Migrationsplanung erfolgt pauschal statt risikobasiert nach tatsächlicher Vertraulichkeitsdauer | Datenklassen explizit nach erforderlicher Vertraulichkeitsdauer bewerten und die Migrationsreihenfolge entsprechend anpassen |
| die Sicherheit während der PQ-Übergangsphase ist unklar | keine hybriden, klassisch-plus-quantenresistenten Verfahren sind für besonders kritische Daten eingeführt | hybride Verfahren für die identifizierten, höchstpriorisierten Datenklassen einführen |

Security: Die PQ-Migrationsplanung sollte explizit risikobasiert nach Harvest-Now-Decrypt-Later-Exposition priorisiert werden, nicht gleichmäßig über alle Systeme verteilt. Observability: Die tatsächliche Vollständigkeit der Kryptoabhängigkeits-Inventarisierung, die Priorisierung nach Vertraulichkeitsdauer, und der Fortschritt hybrider Verfahren für höchstpriorisierte Datenklassen sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** identifiziert und dokumentiert eine kryptografische Abhängigkeit für eine gegebene Systemkomponente korrekt. **Principal** entwirft die vollständige, risikobasierte PQ-Migrationsstrategie mit priorisierten hybriden Verfahren für höchstsensible Datenklassen. **Chief** legt unternehmensweite Standards für priorisierte, risikobasierte PQ-Migrationsplanung fest.

Anti-Patterns: kryptografische Algorithmen tief in Implementierungen einbetten, ohne Austauschbarkeit zu berücksichtigen; PQ-Migrationsplanung erst beginnen, wenn ein Quantencomputer tatsächlich verfügbar ist, statt bereits heute aufgrund von Harvest-Now-Decrypt-Later-Risiko; alle Datenklassen pauschal gleich priorisieren, ohne tatsächliche Vertraulichkeitsdauer zu berücksichtigen.

## Production Checklist

- [ ] Eine vollständige, regelmäßig aktualisierte Kryptoabhängigkeits-Inventarisierung existiert.
- [ ] Datenklassen sind explizit nach erforderlicher Vertraulichkeitsdauer für die Migrationspriorisierung bewertet.
- [ ] Hybride Verfahren sind für höchstpriorisierte, langfristig sensible Datenklassen eingeführt.
- [ ] Die kryptografische Agilität wird regelmäßig gegen tatsächliche Austauschbarkeit aller genutzten Algorithmen geprüft.

## Interviewfragen

### 1. Was ist kryptografische Agilität, und warum ist sie nicht ausschließlich PQ-spezifisch?

**Antwort:** Die Fähigkeit, einen kryptografischen Algorithmus ohne grundlegenden Architekturumbau auszutauschen — sie ist wertvoll für jede zukünftige Algorithmusschwächung, nicht nur für Post-Quantum-Bedrohungen.

### 2. Was ist Harvest-Now-Decrypt-Later, und warum begründet es bereits heute dringenden Handlungsbedarf?

**Antwort:** Das Risiko, dass ein Angreifer heute verschlüsselte Daten abfängt und speichert, um sie später mit einem künftigen Quantencomputer zu entschlüsseln — die Bedrohung besteht bereits jetzt, unabhängig davon, wann ein solcher Quantencomputer tatsächlich verfügbar wird.

### 3. Warum sollte PQ-Migrationspriorisierung nach Vertraulichkeitsdauer erfolgen?

**Antwort:** Weil Daten mit langfristiger Vertraulichkeitsanforderung (Jahrzehnte) durch Harvest-Now-Decrypt-Later erheblich stärker gefährdet sind als Daten mit kurzfristiger Relevanz, die bereits vor Verfügbarkeit eines relevanten Quantencomputers irrelevant werden.

### 4. Wofür werden hybride Verfahren während der PQ-Übergangsphase genutzt?

**Antwort:** Sie kombinieren klassische und quantenresistente Algorithmen parallel, sodass ein Angreifer beide gleichzeitig brechen müsste, was Schutz gegen bekannte klassische und potenzielle künftige Quantenangriffe während der Übergangsphase bietet.

### 5. Wie gehst du vor, wenn eine PQ-Migration sich erheblich verzögert und unter Zeitdruck fehleranfällig wird?

**Antwort:** Ich prüfe, ob keine frühzeitige kryptografische Agilität aufgebaut wurde und Algorithmen tief in die Implementierung eingebettet sind, da dies die häufigste Ursache für verzögerte, fehleranfällige Migrationen ist, nicht eine grundsätzlich fehlende Verfügbarkeit quantenresistenter Algorithmen.

### 6. Widersprüchliche Anforderung: Unternehmen will minimale, sofortige Investition in PQ-Migration, da noch kein relevanter Quantencomputer existiert, UND garantiert, dass langfristig sensible Daten nicht durch Harvest-Now-Decrypt-Later kompromittiert werden — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese beiden Ziele sich nicht grundsätzlich widersprechen, wenn die Investition gezielt priorisiert wird: minimale, aber gezielte Investition in kryptografische Agilität und Kryptoabhängigkeits-Inventarisierung jetzt, kombiniert mit hybriden Verfahren ausschließlich für die identifizierten, höchstpriorisierten, langfristig sensiblen Datenklassen — statt einer teuren, pauschalen Migration aller Systeme, die weder finanzierbar noch für die tatsächliche Risikolage notwendig wäre.

## Praktische Labs

~~~python
# Local, deterministic simulation of risk-based PQ migration prioritization by confidentiality duration (executed locally, no real crypto system):

def assess_harvest_now_risk(required_confidentiality_years, years_until_quantum_threat_estimate):
    if required_confidentiality_years > years_until_quantum_threat_estimate:
        return "HIGH PRIORITY: data confidentiality outlasts estimated quantum threat timeline -- migrate/hybrid now"
    return "LOWER PRIORITY: data relevance likely expires before quantum threat materializes"

data_classes = [
    {"name": "state-secrets", "required_confidentiality_years": 40},
    {"name": "quarterly-marketing-report", "required_confidentiality_years": 1},
]
years_until_quantum_threat_estimate = 15

for d in data_classes:
    print(f"{d['name']}: {assess_harvest_now_risk(d['required_confidentiality_years'], years_until_quantum_threat_estimate)}")
~~~

## Dependencies, Cross-References und Quellen

1. NIST-Dokumentation: [Post-Quantum Cryptography Standardization](https://csrc.nist.gov/projects/post-quantum-cryptography), abgerufen 2026-09-18.
2. NSA-Dokumentation: [Announcing the Commercial National Security Algorithm Suite 2.0 (CNSA 2.0, Migrationszeitplan)](https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF), abgerufen 2026-09-18.

PKI und Zertifikatslebenszyklen sind kanonisch in [KB-0551](15-pki-und-zertifikatslebenszyklen.md) behandelt; KMS und HSM in [KB-0554](18-kms-und-hsm.md); MITRE ATT&CK und Angriffsketten in [KB-0563](27-mitre-att-ck-und-angriffsketten.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Zunehmende Standardisierung und Toolchain-Unterstützung für NIST-Post-Quantum-Algorithmen (ML-KEM, ML-DSA) in gängiger PKI- und TLS-Infrastruktur | Evaluating | Gegenüber ausschließlich klassischen Algorithmen erst nach Prüfung der tatsächlichen, aktuellen Toolchain- und Interoperabilitätsreife für die konkrete Umgebung bevorzugen; frühzeitige Kryptoagilität und Inventarisierung bleiben unabhängig davon sofort sinnvoll. |

Ein Team akzeptiert eine kryptografische Agilitäts- und PQ-Migrationsstrategie erst, wenn eine vollständige Kryptoabhängigkeits-Inventarisierung existiert und die Migrationspriorisierung nachweislich risikobasiert nach Harvest-Now-Decrypt-Later-Exposition statt pauschal erfolgt — damit ist Domain 23 (Security/Identity) mit allen 28 Dateien vollständig ausgearbeitet.
