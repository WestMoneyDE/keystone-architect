---
{"id": "KB-0668", "title": "B2B-Unternehmenskonten und Budgets", "domain": "29", "sequence": 6, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "ENTERPRISE"], "requires": [{"id": "KB-0665", "concepts": ["Fachliche Guards"], "needed_for": "Budgetgrenzen und Einkaufsfreigaben nutzen dasselbe Guard-Prinzip wie in KB-0665 für Zustandsübergänge beschrieben"}], "related": ["KB-0663"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Organisationen, Rollen und Einkaufsfreigaben korrekt gestalten und für ein gegebenes B2B-Szenario kundenspezifische Preise und Budgetgrenzen als überprüfbare Geschäftsregeln implementieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für ein B2B-Commerce-Vorhaben explizit entwerfen, wie Kostenstellen, Budgetgrenzen und mehrstufige Einkaufsfreigaben als konsistentes, überprüfbares Regelwerk zusammenwirken.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Bestellung ein Budgetlimit überschreitet, ohne dass eine erforderliche Freigabestufe tatsächlich durchlaufen wurde.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für B2B-Unternehmenskonten festlegen, die Budgetgrenzen und Einkaufsfreigaben als verbindliche, überprüfbare Geschäftsregeln vorschreiben.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte Integration mit spezifischen ERP-Freigabeworkflows im Detail ist Vertiefung.", "rationale": "Kern ist die strukturelle Modellierung von Organisationen, Rollen, Budgets und Freigaben, nicht die produktspezifische ERP-Freigabeworkflow-Integration."}}, "lab_validation": [{"lab_id": "KB-0668-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Veranschaulichung mehrstufiger Einkaufsfreigaben bei Budgetüberschreitung, kein reales B2B-Commerce-System verwendet", "evidence": "Ein lokales Skript prüft eine simulierte Bestellung gegen ein Kostenstellenbudget und zeigt, dass eine Bestellung, die das Budget überschreitet, korrekt eine zusätzliche Freigabestufe erfordert, bevor sie tatsächlich abgeschlossen werden kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales B2B-Commerce-System oder reale Freigabeworkflows getestet."}]}
---
# B2B-Unternehmenskonten und Budgets

> **Ziel:** B2B-Unternehmenskonten unterscheiden sich strukturell von B2C-Kundenkonten durch drei zusätzliche Konzepte: **Organisationen** (ein Unternehmenskonto repräsentiert tatsächlich eine ganze Organisation mit mehreren Nutzern, nicht eine einzelne Person), **Rollen** (unterschiedliche Nutzer innerhalb derselben Organisation haben tatsächlich unterschiedliche Berechtigungen, etwa Einkäufer, Freigeber, Administrator) und **Einkaufsfreigaben** (Bestellungen, die bestimmte Kriterien erfüllen, etwa ein Budgetlimit überschreiten, müssen tatsächlich eine zusätzliche Freigabe durchlaufen, bevor sie abgeschlossen werden). Der zentrale Punkt dieses Kapitels ist, dass Budgetgrenzen und Freigabeprozesse als überprüfbare, systemseitig durchgesetzte Geschäftsregeln implementiert werden müssen, statt sich auf organisatorische Prozesse außerhalb des Systems zu verlassen — eine Budgetgrenze, die nur als Richtlinie dokumentiert, aber nicht tatsächlich im System durchgesetzt wird, kann tatsächlich überschritten werden, ohne dass das System dies verhindert oder auch nur bemerkt.

## Zweck, Mental Model und Dependencies

Organisationen als Kontostruktur bedeuten, dass ein B2B-Unternehmenskonto tatsächlich mehrere Nutzer, mehrere Lieferadressen und potenziell mehrere Kostenstellen umfassen kann, die gemeinsam einer Organisation zugeordnet sind — dies unterscheidet sich fundamental von einem B2C-Konto, das tatsächlich genau eine Person mit einer Identität repräsentiert. Rollen innerhalb einer Organisation legen fest, welche Aktion ein bestimmter Nutzer tatsächlich ausführen darf: Ein Einkäufer kann typischerweise Bestellungen anlegen, aber nicht notwendigerweise final abschließen, während ein Freigeber Bestellungen, die bestimmte Kriterien erfüllen, tatsächlich autorisieren muss, bevor sie verarbeitet werden — diese Rollentrennung entspricht strukturell dem Prinzip minimaler, tatsächlich benötigter Berechtigungen, das auch in anderen Domains dieses Curriculums als etabliertes Sicherheitsprinzip auftritt. Kundenspezifische Preise sind ein B2B-typisches Konzept: Anders als im B2C-Bereich, wo üblicherweise ein einheitlicher Katalogpreis für alle Kunden gilt, können im B2B-Bereich unterschiedliche Organisationen tatsächlich unterschiedliche, vertraglich vereinbarte Preise für dieselben Produkte haben — diese Preislogik muss explizit an die Organisation gebunden sein, statt als Sonderfall in der allgemeinen Preisbildung behandelt zu werden. Kostenstellen und Budgetgrenzen ermöglichen es einer Organisation, Einkäufe auf interne Budgeteinheiten aufzuteilen und für jede Kostenstelle eine tatsächliche Obergrenze zu definieren — eine Bestellung, die das Budget einer Kostenstelle überschreiten würde, muss dies vor Abschluss tatsächlich erkennen und eine zusätzliche Freigabestufe erfordern, statt die Überschreitung erst nachträglich, etwa in einem Finanzbericht, sichtbar zu machen. Einkaufsfreigaben müssen als überprüfbare, systemseitig durchgesetzte Geschäftsregel implementiert sein, ähnlich den in KB-0665 beschriebenen fachlichen Guards für Zustandsübergänge — eine Bestellung, die eine Freigabe benötigt, darf tatsächlich nicht abgeschlossen werden, bevor diese Freigabe tatsächlich erteilt wurde, unabhängig davon, ob dies organisatorisch ohnehin erwartet wird.

~~~text
B2B enterprise accounts structurally differ from B2C customer accounts via 3 additional
  concepts
  ORGANIZATIONS: enterprise account ACTUALLY represents entire organization w/ multiple
  users, not single person
  ROLES: different users within same org ACTUALLY have different permissions (buyer,
  approver, admin)
  PURCHASE APPROVALS: orders meeting certain criteria (exceeding budget limit) must
  ACTUALLY go through additional approval before completing
KEY POINT: budget limits + approval processes must be implemented as verifiable,
  system-enforced business rules instead of relying on organizational processes outside
  the system
  budget limit documented only as policy but not ACTUALLY enforced in system CAN
  ACTUALLY be exceeded w/o system preventing or even noticing it
ORGANIZATIONS as account structure means B2B enterprise account ACTUALLY can span
  multiple users, multiple delivery addresses, potentially multiple cost centers jointly
  assigned to an organization
  fundamentally differs from B2C account ACTUALLY representing exactly one person w/ one
  identity
ROLES within an org fix what action a given user ACTUALLY may perform
  buyer typically creates orders but not necessarily finally completes them; approver
  must ACTUALLY authorize orders meeting certain criteria before processing
  this role separation structurally corresponds to minimal, actually-needed-permissions
  principle established elsewhere in this curriculum as security principle
CUSTOMER-SPECIFIC PRICING = B2B-typical concept: unlike B2C where uniform catalog price
  typically applies to all customers, B2B different orgs CAN ACTUALLY have different,
  contractually agreed prices for same products
  this pricing logic must be explicitly bound to organization, not treated as special
  case in general pricing
COST CENTERS + BUDGET LIMITS let an org split purchases across internal budget units,
  define an ACTUAL ceiling per cost center
  order that would exceed a cost center's budget must ACTUALLY detect this before
  completion + require additional approval stage, instead of exceedance becoming visible
  only after the fact (financial report)
PURCHASE APPROVALS must be implemented as verifiable, system-enforced business rule,
  similar to KB-0665's business guards for state transitions
  order needing approval must ACTUALLY not complete before that approval ACTUALLY
  granted, regardless of organizational expectation outside the system
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Organisationsstruktur | ein Konto repräsentiert mehrere Nutzer/Kostenstellen | Grundlage für Rollen-, Preis- und Budgetlogik |
| Rollen (Einkäufer/Freigeber/Admin) | begrenzen erlaubte Aktionen pro Nutzer | entspricht Prinzip minimaler, tatsächlich benötigter Berechtigungen |
| Kundenspezifische Preise | an Organisation gebundene, vertraglich vereinbarte Preise | verhindert Sonderfallbehandlung in genereller Preisbildung |
| Kostenstellen und Budgetgrenzen | Obergrenzen pro interner Budgeteinheit | ermöglicht Erkennung von Überschreitung vor Bestellabschluss |
| Systemseitig durchgesetzte Freigaben | Bestellung blockiert bis Freigabe tatsächlich erteilt | verhindert Umgehung durch rein organisatorische Erwartung |

Implementierung: Organisationen werden als eigenständige Kontostruktur mit mehreren zugeordneten Nutzern modelliert. Rollen begrenzen explizit erlaubte Aktionen pro Nutzer. Budgetgrenzen pro Kostenstelle werden vor Bestellabschluss systemseitig geprüft, mit erzwungener Freigabestufe bei Überschreitung.

## Scalability, Reliability, Security und Observability

Eine B2B-Unternehmenskonten-Architektur skaliert über die Anzahl der Organisationen, Rollen und Kostenstellen; die Reliability-Grenze liegt darin, dass eine nur organisatorisch, nicht systemseitig durchgesetzte Budgetgrenze tatsächlich überschritten werden kann, ohne dass das System dies verhindert.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Bestellung überschreitet ein Kostenstellenbudget, ohne dass eine Freigabe erforderlich war | die Budgetprüfung erfolgt nicht systemseitig vor Bestellabschluss | eine systemseitige Budgetprüfung mit erzwungener Freigabestufe bei Überschreitung implementieren |
| ein Einkäufer kann Bestellungen final abschließen, obwohl dies nicht seiner Rolle entspricht | die Rollentrennung zwischen Einkäufer und Freigeber ist nicht durchgesetzt | die Rollenberechtigung für den Bestellabschluss-Schritt explizit prüfen |
| unterschiedliche Organisationen sehen fälschlich denselben Katalogpreis statt ihres vertraglich vereinbarten Preises | die kundenspezifische Preislogik ist nicht korrekt an die Organisation gebunden | die Preisbildung explizit an die Organisationszuordnung koppeln |

Security: Die Rollentrennung zwischen Einkäufer, Freigeber und Administrator sollte dem Prinzip minimaler, tatsächlich benötigter Berechtigungen folgen. Observability: Die tatsächliche Häufigkeit erforderlicher, aber nicht erteilter Freigaben ist ein zentrales Signal zur Bewertung, ob Budgetgrenzen realistisch bemessen sind.

## Trade-offs und Entscheidungen

**Staff** implementiert eine korrekte Rollenprüfung für einen gegebenen Einkaufsprozess-Schritt. **Principal** entwirft die vollständige Organisations-, Rollen- und Budgetarchitektur für ein B2B-Commerce-Vorhaben. **Chief** legt unternehmensweite Standards für Budgetgrenzen und Einkaufsfreigaben als verbindliche Geschäftsregeln fest.

Anti-Patterns: Budgetgrenzen nur als organisatorische Richtlinie ohne systemseitige Durchsetzung dokumentieren; Rollentrennung zwischen Einkäufer und Freigeber nicht tatsächlich im System erzwingen; kundenspezifische Preise als Sonderfall statt als organisationsgebundene Regel implementieren.

## Production Checklist

- [ ] Organisationen sind als eigenständige Kontostruktur mit mehreren Nutzern modelliert.
- [ ] Rollen begrenzen explizit, tatsächlich durchgesetzt, die erlaubten Aktionen pro Nutzer.
- [ ] Budgetgrenzen pro Kostenstelle werden systemseitig vor Bestellabschluss geprüft.
- [ ] Kundenspezifische Preise sind explizit an die Organisation gebunden.

## Interviewfragen

### 1. Was unterscheidet ein B2B-Unternehmenskonto strukturell von einem B2C-Kundenkonto?

**Antwort:** Ein B2B-Konto repräsentiert eine ganze Organisation mit mehreren Nutzern, Rollen und potenziell mehreren Kostenstellen, während ein B2C-Konto genau eine Person mit einer Identität repräsentiert.

### 2. Warum müssen Budgetgrenzen systemseitig statt nur organisatorisch durchgesetzt werden?

**Antwort:** Weil eine nur als Richtlinie dokumentierte, aber nicht systemseitig durchgesetzte Budgetgrenze tatsächlich überschritten werden kann, ohne dass das System dies verhindert oder bemerkt.

### 3. Wie unterscheiden sich B2B-Preise typischerweise von B2C-Preisen?

**Antwort:** Im B2B-Bereich können unterschiedliche Organisationen unterschiedliche, vertraglich vereinbarte Preise für dieselben Produkte haben, während im B2C-Bereich üblicherweise ein einheitlicher Katalogpreis für alle Kunden gilt.

### 4. Welche Rolle spielt die Rollentrennung zwischen Einkäufer und Freigeber?

**Antwort:** Sie stellt sicher, dass Bestellungen, die bestimmte Kriterien erfüllen, tatsächlich von einer autorisierten Person freigegeben werden müssen, bevor sie verarbeitet werden, statt dass ein Einkäufer allein final entscheiden kann.

### 5. Wie gehst du vor, wenn eine Bestellung ein Kostenstellenbudget überschreitet, ohne dass eine Freigabe erforderlich war?

**Antwort:** Ich prüfe, ob die Budgetprüfung systemseitig vor Bestellabschluss erfolgt, und implementiere eine erzwungene Freigabestufe bei Überschreitung, falls dies fehlt.

### 6. Widersprüchliche Anforderung: Das Einkaufsteam will schnelle, unterbrechungsfreie Bestellabwicklung ohne Freigabeverzögerung UND die Organisation will strikte Budgetkontrolle mit verpflichtender Freigabe bei Überschreitung — wie gehst du vor?

**Antwort:** Ich würde die Freigabepflicht ausschließlich für tatsächlich budgetüberschreitende Bestellungen aktivieren, während Bestellungen innerhalb des Budgets ohne Verzögerung durchlaufen, sodass beide Ziele gleichzeitig erreicht werden, statt eine pauschale Freigabepflicht für alle Bestellungen einzuführen.

## Praktische Labs

~~~python
# Local, deterministic B2B budget check with forced approval on overrun (executed locally, no real B2B commerce system):

def check_order(order_total, cost_center_budget_remaining, has_approval):
    if order_total > cost_center_budget_remaining and not has_approval:
        return "blocked: requires approval, budget exceeded"
    return "order completed"

print(check_order(order_total=5000, cost_center_budget_remaining=3000, has_approval=False))
print(check_order(order_total=5000, cost_center_budget_remaining=3000, has_approval=True))
~~~

## Dependencies, Cross-References und Quellen

1. Medusa: [Medusa B2B Companies and Approvals Documentation](https://docs.medusajs.com/resources/commerce-modules), abgerufen 2026-09-18.
2. OASIS: [XACML — eXtensible Access Control Markup Language, Rule-Based Authorization](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-os-en.html), abgerufen 2026-09-18.

Dieses Kapitel nutzt das in KB-0665 (Order State Machines) beschriebene Guard-Prinzip für Budgetgrenzen und Einkaufsfreigaben.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Dynamische, richtlinienbasierte Freigabestufen (Policy-as-Code für Einkaufsfreigaben) statt fest kodierter Rollenprüfungen | Growing Adoption | Bei künftigen Neuvorhaben mit komplexen, wechselnden Freigaberegeln evaluieren, jedoch bei einfachen, stabilen Regelwerken weiterhin auf direkt implementierte Rollenprüfungen setzen. |

Ein Team akzeptiert eine B2B-Unternehmenskonten-Implementierung erst, wenn Rollen, Budgetgrenzen und Einkaufsfreigaben nachweislich systemseitig durchgesetzt sind.
