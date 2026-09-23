---
{"id": "KB-0701", "title": "Standards einführen und ablösen", "domain": "30", "sequence": 25, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0599", "concepts": ["Technologiestandards und Kataloge"], "needed_for": "Dieses Kapitel konkretisiert die in KB-0599 beschriebene Standardkatalog-Pflege auf die praktische Einführung und Ablösung"}, {"id": "KB-0694", "concepts": ["Stilllegungskriterium"], "needed_for": "Standard-Ablösung nutzt dasselbe explizite Stilllegungsprinzip wie das in KB-0694 beschriebene Altsystem-Stilllegungskriterium"}], "related": ["KB-0695"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für einen gegebenen Technologiestandard die tatsächliche, bestehende Nutzung erfassen und einen konkreten Migrationsplan mit Ausnahmeprozess entwerfen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Standardablösung mehrere Migrationsstrategien gegen die tatsächliche, bestehende Nutzung und Teamkapazität abwägen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein neuer Standard eingeführt wird, ohne die tatsächliche, bestehende Nutzung des abzulösenden Standards vorher zu erfassen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Die Einführung und Ablösung unternehmensweiter Technologiestandards als praktische Veränderungsaufgabe mit Adoption, Migration und klarer Eigentümerschaft steuern und verantworten.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Migrationswerkzeug-Implementierung im Detail ist Vertiefung.", "rationale": "Kern ist die strukturierte Steuerung von Adoption, Migration und Eigentümerschaft, nicht die werkzeugspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0701-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung einer Standardeinführung ohne vorherige Nutzungserfassung, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein neu eingeführter Standard bestehende, unbekannte Nutzungsfälle des alten Standards übersieht, während eine vorherige, systematische Nutzungserfassung diese Fälle sichtbar macht und in die Migrationsplanung einbezieht.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Standards einführen und ablösen

> **Ziel:** Dieses Kapitel konkretisiert die in KB-0599 beschriebene Standardkatalog-Pflege auf die praktische Steuerung der Einführung eines neuen und der Ablösung eines bestehenden Technologiestandards, über vier Elemente: **Bestehende Nutzung** (wer tatsächlich den abzulösenden Standard aktuell verwendet, oft weniger vollständig bekannt als angenommen), **Migration** (der konkrete Weg, wie Nutzer tatsächlich vom alten zum neuen Standard wechseln), **Ausnahmen** (Fälle, die tatsächlich begründet nicht oder nicht sofort migrieren können) und **Adoption** (wie der neue Standard tatsächlich angenommen wird, unabhängig von seiner formalen Verabschiedung). Der zentrale Punkt dieses Kapitels ist, dass Managed-Service-EOL (End-of-Life eines von einem Anbieter betriebenen Dienstes) eine besondere, zeitkritische Form der Standardablösung darstellt: Wenn ein Anbieter einen genutzten Dienst tatsächlich einstellt, ist die Migration nicht mehr optional, sondern tatsächlich erzwungen, mit einer vom Anbieter, nicht von der eigenen Organisation vorgegebenen Frist.

## Zweck, Mental Model und Dependencies

Bestehende Nutzung zu erfassen bedeutet, tatsächlich systematisch zu ermitteln, wer den abzulösenden Standard aktuell verwendet, bevor ein neuer Standard eingeführt oder der alte formal abgelöst wird — diese Nutzung ist tatsächlich häufig unvollständiger bekannt als angenommen, da Teams einen Standard tatsächlich auch außerhalb der offiziell dokumentierten, bekannten Anwendungsfälle einsetzen können; eine Standardablösung ohne diese vorherige Erfassung riskiert tatsächlich, unbekannte, aber tatsächlich betroffene Nutzungsfälle bei der Migrationsplanung zu übersehen. Migration zu planen bedeutet, tatsächlich einen konkreten, nachvollziehbaren Weg zu definieren, wie bestehende Nutzer vom alten zum neuen Standard wechseln — dieser Weg entspricht strukturell dem in KB-0695 beschriebenen Migrationsstrategie-Prinzip, hier jedoch angewendet auf eine unternehmensweite Standardänderung statt eine einzelne Systemmigration; die Migrationsplanung muss tatsächlich die unterschiedliche, tatsächliche Kapazität verschiedener Teams berücksichtigen, statt eine einheitliche Frist für alle zu setzen. Ausnahmen zu handhaben bedeutet, tatsächlich anzuerkennen, dass manche Nutzungsfälle tatsächlich begründet nicht oder nicht innerhalb der regulären Frist migrieren können (etwa weil ein System bereits für eine ohnehin geplante, größere Modernisierung, siehe KB-0694, vorgesehen ist) — dieser Ausnahmeprozess entspricht direkt dem in KB-0699 beschriebenen Governance-Ausnahmeprinzip. Adoption zu fördern bedeutet, tatsächlich zu erkennen, dass die formale Verabschiedung eines neuen Standards allein tatsächlich keine Nutzung garantiert — ein neuer Standard, der formal verabschiedet, aber tatsächlich nicht aktiv beworben, dokumentiert oder mit tatsächlicher Unterstützung (etwa Migrationswerkzeugen) versehen wird, wird tatsächlich langsamer oder gar nicht angenommen, unabhängig von seiner formalen Gültigkeit. Managed-Service-EOL als besondere, zeitkritische Ablöseform zu behandeln bedeutet, tatsächlich zu erkennen, dass bei einem vom Anbieter erzwungenen End-of-Life die Migrationsfrist tatsächlich nicht von der eigenen Organisation, sondern vom Anbieter bestimmt wird — diese fehlende Kontrolle über den Zeitpunkt erfordert tatsächlich eine proaktive, kontinuierliche Beobachtung von Anbieter-EOL-Ankündigungen, statt reaktiv erst nach der tatsächlichen Ankündigung mit der Migrationsplanung zu beginnen.

~~~text
This chapter concretizes KB-0599's standard-catalog maintenance onto practical steering
  of introducing a new + retiring an existing technology standard, via 4 elements
  EXISTING USAGE: who ACTUALLY currently uses standard being retired, often less fully
  known than assumed
  MIGRATION: concrete path how users ACTUALLY transition from old to new standard
  EXCEPTIONS: cases ACTUALLY justifiably unable to migrate not/not immediately
  ADOPTION: how new standard ACTUALLY gets accepted, independent of formal ratification
KEY POINT: Managed-Service-EOL (end-of-life of a vendor-operated service) = special,
  time-critical form of standard retirement: when vendor ACTUALLY discontinues a used
  service, migration no longer optional but ACTUALLY forced, w/ deadline set by vendor,
  not by own org
CAPTURING EXISTING USAGE means ACTUALLY systematically determining who currently uses
  standard being retired before new standard introduced/old formally retired -- this
  usage ACTUALLY often less fully known than assumed, since teams CAN ACTUALLY use a
  standard beyond officially documented, known use cases
  standard retirement w/o this prior capture ACTUALLY risks overlooking unknown but
  ACTUALLY affected use cases in migration planning
PLANNING MIGRATION means ACTUALLY defining a concrete, traceable path how existing users
  transition from old to new standard -- structurally corresponds to KB-0695's
  migration-strategy principle, here applied to org-wide standard change instead of
  single system migration
  migration planning must ACTUALLY consider different teams' different, ACTUAL capacity
  instead of setting a uniform deadline for all
HANDLING EXCEPTIONS means ACTUALLY acknowledging some use cases ACTUALLY justifiably
  can't migrate not or not within regular deadline (system already scheduled for larger
  modernization anyway, see KB-0694) -- this exception process directly corresponds to
  KB-0699's governance exception principle
FOSTERING ADOPTION means ACTUALLY recognizing formal ratification of new standard alone
  ACTUALLY guarantees no usage -- new standard formally ratified but ACTUALLY not
  actively promoted, documented, or equipped w/ actual support (migration tools)
  ACTUALLY gets adopted slower or not at all, independent of its formal validity
TREATING MANAGED-SERVICE-EOL AS SPECIAL, TIME-CRITICAL RETIREMENT FORM means ACTUALLY
  recognizing vendor-forced EOL means migration deadline ACTUALLY determined by vendor,
  not own org -- this lack of timing control ACTUALLY requires proactive, continuous
  monitoring of vendor EOL announcements, instead of reactively starting migration
  planning only after ACTUAL announcement
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Systematische Nutzungserfassung | deckt unbekannte, betroffene Nutzungsfälle auf | verhindert übersehene Fälle bei Migrationsplanung |
| Kapazitätsdifferenzierte Migrationsplanung | berücksichtigt unterschiedliche Teamkapazität | verhindert einheitliche, unrealistische Fristen |
| Ausnahmeprozess für Standardablösung | erlaubt begründete Nicht-Migration | konsistent mit generellem Governance-Ausnahmeprinzip |
| Aktive Adoptionsförderung | unterstützt Nutzung über formale Verabschiedung hinaus | verhindert langsame oder ausbleibende Annahme |
| Proaktive Managed-Service-EOL-Beobachtung | erkennt anbietergetriebene Fristen frühzeitig | verhindert reaktive, verspätete Migrationsplanung |

Implementierung: Vor jeder Standardablösung wird die tatsächliche, bestehende Nutzung systematisch erfasst. Die Migrationsplanung berücksichtigt unterschiedliche Teamkapazitäten. Ein Ausnahmeprozess für begründete Nicht-Migration existiert. Anbieter-EOL-Ankündigungen für genutzte Managed Services werden proaktiv beobachtet.

## Scalability, Reliability, Security und Observability

Eine Standard-Einführungs- und Ablösungspraxis skaliert über die Anzahl der parallel zu steuernden Standardänderungen; die Reliability-Grenze liegt darin, dass eine nicht erfasste, bestehende Nutzung bei der Ablösung eines Standards tatsächlich zu unerwarteten, produktiven Ausfällen führen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Standardablösung führt zu unerwarteten Ausfällen bei bisher unbekannten Nutzungsfällen | die bestehende Nutzung wurde vor der Ablösung nicht systematisch erfasst | für künftige Ablösungen eine systematische Nutzungserfassung verpflichtend durchführen |
| ein neuer Standard wird trotz formaler Verabschiedung kaum genutzt | keine aktive Adoptionsförderung (Dokumentation, Migrationswerkzeuge) wurde bereitgestellt | den neuen Standard aktiv mit Dokumentation und Migrationsunterstützung bewerben |
| ein Managed-Service-EOL führt zu einer überstürzten, unter Zeitdruck durchgeführten Migration | keine proaktive Beobachtung von Anbieter-EOL-Ankündigungen fand statt | einen proaktiven Prozess zur kontinuierlichen Beobachtung von EOL-Ankündigungen genutzter Managed Services einführen |

Security: Bei der Ablösung sicherheitsrelevanter Standards (etwa Verschlüsselungsstandards) sollte die Migrationsfrist besonders sorgfältig gegen das tatsächliche Risiko fortgesetzter Nutzung des alten Standards abgewogen werden. Observability: Die tatsächliche Adoptionsrate eines neuen Standards über die Zeit ist ein zentrales Signal zur Bewertung, ob die Adoptionsförderung tatsächlich wirksam ist.

## Trade-offs und Entscheidungen

**Staff** migriert einen begrenzten, konkreten Nutzungsfall vom alten zum neuen Standard. **Principal** entwirft die vollständige Migrationsstrategie mit Ausnahmeprozess für eine unternehmensweite Standardablösung. **Chief** steuert und verantwortet die Einführung und Ablösung unternehmensweiter Technologiestandards.

Anti-Patterns: einen Standard formal ablösen, ohne die tatsächliche, bestehende Nutzung vorher zu erfassen; eine einheitliche Migrationsfrist ohne Rücksicht auf unterschiedliche Teamkapazität setzen; Managed-Service-EOL-Ankündigungen erst reaktiv nach deren Veröffentlichung zur Kenntnis nehmen.

## Production Checklist

- [ ] Die bestehende Nutzung des abzulösenden Standards ist systematisch erfasst.
- [ ] Die Migrationsplanung berücksichtigt unterschiedliche, tatsächliche Teamkapazitäten.
- [ ] Ein Ausnahmeprozess für begründete Nicht-Migration existiert.
- [ ] Anbieter-EOL-Ankündigungen für genutzte Managed Services werden proaktiv beobachtet.

## Interviewfragen

### 1. Warum ist die systematische Erfassung bestehender Nutzung vor einer Standardablösung wichtig?

**Antwort:** Weil Teams einen Standard auch außerhalb offiziell dokumentierter Anwendungsfälle nutzen können, und eine Ablösung ohne diese Erfassung riskiert, unbekannte, aber betroffene Nutzungsfälle zu übersehen.

### 2. Warum reicht die formale Verabschiedung eines neuen Standards allein nicht für seine tatsächliche Nutzung aus?

**Antwort:** Weil ein Standard, der nicht aktiv beworben, dokumentiert oder mit tatsächlicher Unterstützung wie Migrationswerkzeugen versehen wird, tatsächlich langsamer oder gar nicht angenommen wird.

### 3. Was unterscheidet Managed-Service-EOL von einer regulären Standardablösung?

**Antwort:** Bei Managed-Service-EOL wird die Migrationsfrist vom Anbieter, nicht von der eigenen Organisation bestimmt, was proaktive Beobachtung statt reaktive Planung erfordert.

### 4. Warum sollte die Migrationsplanung unterschiedliche Teamkapazitäten berücksichtigen?

**Antwort:** Weil eine einheitliche Frist für alle Teams unrealistisch sein kann, wenn Teams tatsächlich unterschiedliche Kapazität für die Migration parallel zur laufenden Arbeit haben.

### 5. Wie gehst du vor, wenn eine Standardablösung zu unerwarteten Ausfällen bei bisher unbekannten Nutzungsfällen führt?

**Antwort:** Ich prüfe, ob die bestehende Nutzung vor der Ablösung systematisch erfasst wurde, und führe für künftige Ablösungen eine verpflichtende, systematische Nutzungserfassung ein.

### 6. Widersprüchliche Anforderung: Das Plattformteam will eine schnelle, unternehmensweite Standardablösung zur Vereinfachung UND einzelne Teams wollen ausreichend Zeit für eine sorgfältige Migration ohne Störung laufender Arbeit — wie gehst du vor?

**Antwort:** Ich würde eine differenzierte Migrationsfrist mit einem definierten Ausnahmeprozess für begründete Fälle einführen, statt eine einheitliche, für alle Teams gleich schnelle Frist zu erzwingen, sodass die Ablösung vorankommt, ohne einzelne Teams unrealistisch unter Druck zu setzen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Cloud-Anbieter kündigt das End-of-Life eines genutzten Managed-Message-Broker-Dienstes (angelehnt an Domain 18, Cloud Foundations) mit einer Frist von sechs Monaten an. Mehrere Teams nutzen den Dienst, aber nicht alle sind dem Plattformteam bekannt.

~~~python
# Local, deterministic illustration of usage capture before a forced service EOL migration (fictional lab example, no real organization):

known_usage = ["order_service", "notification_service"]
discovered_usage_via_audit = ["order_service", "notification_service", "legacy_reporting_job"]

def plan_migration(discovered_usage, eol_deadline_months):
    return [{"service": u, "migration_deadline_months": eol_deadline_months} for u in discovered_usage]

plan = plan_migration(discovered_usage_via_audit, eol_deadline_months=6)
print(plan)
~~~

Erwartete Beobachtung: Die systematische Erfassung deckt einen zusätzlichen, dem Plattformteam zuvor unbekannten Nutzungsfall auf. Auswertung: Ohne die vorherige, systematische Erfassung hätte der "legacy_reporting_job" die EOL-Frist möglicherweise verpasst und wäre bei der tatsächlichen Abschaltung des Dienstes unerwartet ausgefallen.

## Dependencies, Cross-References und Quellen

1. ThoughtWorks: [Technology Radar — Techniques for Standard Adoption and Retirement](https://www.thoughtworks.com/radar), abgerufen 2026-09-18.
2. Amazon Web Services: [AWS Service Lifecycle and End-of-Support Policy](https://aws.amazon.com/premiumsupport/technology/product-lifecycle/), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0599 (Technologiestandards und Kataloge) beschriebene Katalogpflege und nutzt das in KB-0694 (Modernisierungsprogramme) beschriebene Stilllegungsprinzip.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Erfassung genutzter Managed Services und deren EOL-Status über Cloud-Provider-APIs zur frühzeitigen Warnung | Growing Adoption | Bei künftigen, umfangreichen Cloud-Landschaften evaluieren, jedoch die finale Migrationsplanung weiterhin durch die verantwortlichen Teams mit vollständiger Nutzungskenntnis durchführen. |

Ein Team akzeptiert eine Standardablösung erst, wenn bestehende Nutzung systematisch erfasst, Migrationsplanung kapazitätsdifferenziert und ein Ausnahmeprozess nachweislich etabliert sind.
