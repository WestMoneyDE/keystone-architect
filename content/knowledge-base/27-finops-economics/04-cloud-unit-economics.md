---
{"id": "KB-0638", "title": "Cloud Unit Economics", "domain": "27", "sequence": 4, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["CLOUD", "PLATFORM", "GENAI", "CHIEF"], "requires": [{"id": "KB-0636", "concepts": ["Tagging und Kostenallokation"], "needed_for": "understanding"}, {"id": "KB-0637", "concepts": ["Budgets und Forecasting"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Kosten je Kunde, Transaktion oder Produktfunktion für ein konkretes System anhand der bereits in KB-0636 behandelten Kostenallokation berechnen und dabei gemeinsame Infrastruktur sowie variable Last korrekt berücksichtigen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Cloud Unit Economics gemeinsame Infrastrukturkosten und variable Lastmuster in vergleichbare, wirtschaftliche Kennzahlen überführt, statt Gesamtkosten unreflektiert durch Gesamtvolumen zu teilen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine vereinfachte Unit-Economics-Berechnung gemeinsame Infrastrukturkosten oder variable Lastanteile ignoriert und dadurch eine irreführende, nicht vergleichbare Kennzahl erzeugt, statt einer tatsächlich aussagekräftigen Kosten-pro-Einheit-Kennzahl.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Cloud Unit Economics festlegen, die gemeinsame Infrastruktur und variable Last korrekt in vergleichbare, wirtschaftliche Entscheidungsgrundlagen einbeziehen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, produktspezifische Kostenrechnungssoftware im Detail ist Vertiefung.", "rationale": "Kern ist das methodische Verständnis, wie gemeinsame Infrastruktur und variable Last korrekt in Unit-Economics-Berechnungen einbezogen werden, nicht die produktspezifische Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0638-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Berechnung von Kosten-pro-Kunde unter Berücksichtigung gemeinsamer Infrastruktur, kein produktives Kostenrechnungs-Tool verwendet", "evidence": "Ein lokales Skript berechnet Kosten pro Kunde sowohl durch naive Gleichverteilung der Gesamtkosten als auch durch nutzungsbasierte Zuordnung gemeinsamer Infrastruktur und zeigt, wie beide Methoden zu unterschiedlichen, wirtschaftlich unterschiedlich aussagekräftigen Ergebnissen führen.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Kostenrechnungs-Tool."}]}
---
# Cloud Unit Economics

> **Ziel:** Cloud Unit Economics berechnet Kosten je Kunde, Transaktion oder Produktfunktion, aufbauend auf der bereits in [KB-0636](02-tagging-und-kostenallokation.md) behandelten Kostenallokation und der bereits in [KB-0637](03-budgets-und-forecasting.md) behandelten Forecasting-Praxis. Der zentrale Punkt dieses Kapitels ist, dass eine aussagekräftige, vergleichbare Unit-Economics-Kennzahl **gemeinsame Infrastruktur** und **variable Last** korrekt berücksichtigen muss — eine naive Berechnung, die Gesamtkosten unreflektiert durch die Gesamtzahl der Kunden oder Transaktionen teilt, ohne gemeinsam genutzte Infrastrukturkosten und unterschiedliche, tatsächliche Lastanteile pro Kunde zu berücksichtigen, erzeugt eine irreführende Kennzahl, die für tatsächliche, wirtschaftliche Entscheidungen (etwa Preisgestaltung, Priorisierung von Produktinvestitionen) keine verlässliche Grundlage bietet.

## Zweck, Mental Model und Dependencies

Die naive Berechnung "Gesamtkosten geteilt durch Gesamtzahl der Kunden" ignoriert zwei zentrale, strukturelle Realitäten moderner Cloud-Systeme: Erstens teilen sich viele Kunden gemeinsame Infrastrukturkomponenten (etwa eine geteilte Datenbank oder ein gemeinsames Compute-Cluster), deren Kosten nicht gleichmäßig, sondern proportional zur tatsächlichen Nutzung jedes einzelnen Kunden anfallen — dieselbe methodische Herausforderung, die bereits bei Shared Costs in [KB-0636](02-tagging-und-kostenallokation.md) behandelt wurde, gilt hier auf der Ebene einzelner Kunden statt einzelner Teams. Zweitens verursachen unterschiedliche Kunden tatsächlich unterschiedliche Lastanteile — ein Kunde mit hohem Transaktionsvolumen verursacht tatsächlich höhere, variable Kosten als ein Kunde mit geringem Transaktionsvolumen, und eine Gleichverteilung der Gesamtkosten würde den geringnutzenden Kunden fälschlich mit den tatsächlich durch den hochnutzenden Kunden verursachten Kosten belasten. Eine methodisch korrekte Unit-Economics-Berechnung trennt deshalb die Kostenstruktur explizit in einen **fixen, gemeinsamen Anteil** (Infrastrukturkosten, die unabhängig von der individuellen Kundennutzung anfallen und anteilig nach einer nachvollziehbaren Verteilregel zugeordnet werden) und einen **variablen, nutzungsproportionalen Anteil** (Kosten, die direkt mit der tatsächlichen, individuellen Nutzung eines Kunden skalieren) — nur diese Trennung ermöglicht eine tatsächlich vergleichbare, wirtschaftlich aussagekräftige Kennzahl, die für unterschiedliche Kunden oder Produktfunktionen tatsächlich unterscheidbare, korrekte Werte liefert. Diese korrekt berechnete Unit-Economics-Kennzahl ist die Grundlage für tatsächlich fundierte, wirtschaftliche Entscheidungen: Eine Preisgestaltung, die auf einer irreführenden, gleichverteilten Kostenkennzahl basiert, kann dazu führen, dass geringnutzende Kunden überteuert und hochnutzende Kunden subventioniert werden, während eine korrekt berechnete Kennzahl eine tatsächlich verursachungsgerechte, wirtschaftlich sinnvolle Preisgestaltung ermöglicht.

~~~text
Cloud Unit Economics: calculates cost per customer/transaction/product feature
  builds on KB-0636 cost allocation + KB-0637 forecasting practice
KEY POINT: meaningful, comparable unit-economics metric must correctly account for
  SHARED INFRASTRUCTURE and VARIABLE LOAD
  naive calculation (total cost / total customer count), ignoring shared infra costs +
  different actual load shares per customer -> creates MISLEADING metric
  provides NO reliable basis for actual economic decisions (pricing, product investment prioritization)
NAIVE "total cost / total customer count" IGNORES two central, structural realities of
  modern cloud systems
  1) many customers SHARE common infra components (shared DB, shared compute cluster)
     costs NOT evenly distributed, but proportional to each individual customer's ACTUAL usage
     SAME methodological challenge as KB-0636's shared costs, here at CUSTOMER level not team level
  2) different customers ACTUALLY cause different load shares
     high-transaction-volume customer actually causes higher, variable costs than
       low-volume customer
     even distribution of total cost -> wrongly burdens low-usage customer with costs
       actually caused by high-usage customer
METHODICALLY CORRECT unit-economics calculation explicitly separates cost structure into:
  FIXED, SHARED portion (infra costs independent of individual customer usage,
    allocated proportionally via traceable distribution rule)
  VARIABLE, usage-proportional portion (costs scaling directly w/ actual, individual customer usage)
  ONLY this separation enables an actually comparable, economically meaningful metric
  yielding actually distinguishable, correct values for different customers/product features
this correctly-calculated metric = basis for actually informed economic decisions
  pricing based on misleading, evenly-distributed cost metric
  -> can overcharge low-usage customers, subsidize high-usage customers
  correctly-calculated metric -> enables actually causally-accurate, economically sound pricing
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Fixer, gemeinsamer Kostenanteil | Infrastrukturkosten unabhängig von individueller Nutzung | proportionale Zuordnung nach nachvollziehbarer Verteilregel |
| Variabler, nutzungsproportionaler Anteil | Kosten skalierend mit tatsächlicher, individueller Nutzung | direkt der verursachenden Einheit (Kunde, Transaktion) zuordenbar |
| Kosten je Einheit | vergleichbare Kennzahl (Kosten pro Kunde/Transaktion/Feature) | Grundlage für Preisgestaltung und Investitionspriorisierung |
| Verursachungsgerechte Trennung | trennt fixen von variablem Anteil methodisch korrekt | verhindert Subventionierung hochnutzender durch geringnutzende Kunden |

Implementierung: Kostenstrukturen werden explizit in fixe, gemeinsame Infrastrukturanteile und variable, nutzungsproportionale Anteile getrennt. Fixe Anteile werden anhand einer nachvollziehbaren Verteilregel proportional zur tatsächlichen Nutzung zugeordnet. Variable Anteile werden direkt der verursachenden Einheit (Kunde, Transaktion, Produktfunktion) zugeordnet. Die resultierende Kosten-pro-Einheit-Kennzahl wird für Preisgestaltungs- und Investitionsentscheidungen herangezogen.

## Scalability, Reliability, Security und Observability

Cloud Unit Economics skaliert die tatsächliche Aussagekraft wirtschaftlicher Entscheidungen proportional zur methodisch korrekten Trennung von fixen und variablen Kostenanteilen; die Reliability-Grenze liegt darin, dass eine naive, gleichverteilte Kostenberechnung irreführende Kennzahlen erzeugt, die zu wirtschaftlich fehlgeleiteten Preisgestaltungs- oder Investitionsentscheidungen führen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Preisgestaltung auf Basis der Unit-Economics-Kennzahl erscheint für geringnutzende Kunden unangemessen hoch | Gesamtkosten wurden gleichverteilt statt nutzungsproportional berechnet | die Berechnung in fixen und variablen Anteil trennen und variable Kosten verursachungsgerecht zuordnen |
| Unit-Economics-Kennzahlen unterschiedlicher Kunden erscheinen unplausibel ähnlich, obwohl die tatsächliche Nutzung stark variiert | keine Trennung zwischen fixem, gemeinsamem und variablem, nutzungsproportionalem Kostenanteil wurde vorgenommen | die Kostenstruktur explizit in fixen und variablen Anteil aufteilen |
| eine Investitionsentscheidung basiert auf einer irreführenden Kosten-pro-Feature-Kennzahl | gemeinsame Infrastrukturkosten wurden nicht korrekt anteilig zugeordnet | eine nachvollziehbare Verteilregel für gemeinsame Infrastrukturkosten je Produktfunktion einführen |

Security: Kosten-pro-Kunde-Kennzahlen können implizit Rückschlüsse auf Nutzungsmuster ermöglichen und sollten entsprechend vertraulich behandelt werden. Observability: Die tatsächliche Stabilität und Plausibilität der Unit-Economics-Kennzahlen über die Zeit ist ein zentrales Signal zur Bewertung, ob die zugrunde liegende Kostentrennung methodisch korrekt bleibt.

## Trade-offs und Entscheidungen

**Staff** berechnet eine gegebene Unit-Economics-Kennzahl korrekt mit Trennung von fixem und variablem Anteil. **Principal** entwirft die vollständige Unit-Economics-Methodik mit Verteilregeln für gemeinsame Infrastruktur für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Cloud Unit Economics fest, die korrekte Kostentrennung für wirtschaftliche Entscheidungsgrundlagen verbindlich machen.

Anti-Patterns: Gesamtkosten unreflektiert gleichverteilt durch die Gesamtzahl der Kunden oder Transaktionen teilen; gemeinsame Infrastrukturkosten ohne nachvollziehbare Verteilregel einem einzelnen Kunden oder Produktfeature zuordnen; Preisgestaltungsentscheidungen auf Basis irreführender, nicht verursachungsgerechter Unit-Economics-Kennzahlen treffen.

## Production Checklist

- [ ] Kostenstrukturen sind explizit in fixe, gemeinsame und variable, nutzungsproportionale Anteile getrennt.
- [ ] Fixe, gemeinsame Anteile werden anhand einer nachvollziehbaren Verteilregel zugeordnet.
- [ ] Variable Anteile werden direkt der verursachenden Einheit zugeordnet.
- [ ] Unit-Economics-Kennzahlen werden für Preisgestaltungs- und Investitionsentscheidungen tatsächlich herangezogen.

## Interviewfragen

### 1. Warum ist eine naive Berechnung "Gesamtkosten geteilt durch Gesamtzahl der Kunden" problematisch?

**Antwort:** Weil sie weder gemeinsam genutzte Infrastrukturkosten noch unterschiedliche, tatsächliche Lastanteile einzelner Kunden berücksichtigt und dadurch eine irreführende, nicht verursachungsgerechte Kennzahl erzeugt.

### 2. Welche zwei Kostenanteile trennt eine methodisch korrekte Unit-Economics-Berechnung?

**Antwort:** Einen fixen, gemeinsamen Anteil (Infrastrukturkosten unabhängig von individueller Nutzung) und einen variablen, nutzungsproportionalen Anteil (Kosten, die direkt mit der tatsächlichen, individuellen Nutzung skalieren).

### 3. Was passiert, wenn Preisgestaltung auf einer gleichverteilten statt verursachungsgerechten Kostenkennzahl basiert?

**Antwort:** Geringnutzende Kunden können überteuert und hochnutzende Kunden subventioniert werden, da die tatsächliche, individuelle Kostenverursachung nicht korrekt abgebildet wird.

### 4. Wie werden fixe, gemeinsame Infrastrukturkosten korrekt zugeordnet?

**Antwort:** Anhand einer nachvollziehbaren Verteilregel proportional zur tatsächlichen Nutzung, analog zur Shared-Cost-Verteilung aus der Tagging- und Kostenallokationspraxis.

### 5. Wie gehst du vor, wenn eine Preisgestaltung auf Basis der Unit-Economics-Kennzahl für geringnutzende Kunden unangemessen hoch erscheint?

**Antwort:** Ich prüfe, ob die zugrunde liegende Berechnung Gesamtkosten gleichverteilt statt nutzungsproportional berechnet hat, und trenne die Berechnung entsprechend in fixen und variablen Anteil.

### 6. Widersprüchliche Anforderung: Die Vertriebsabteilung will eine einfache, einheitliche Preisstruktur UND das FinOps-Team will verursachungsgerechte, differenzierte Unit-Economics-Kennzahlen — wie gehst du vor?

**Antwort:** Ich würde die verursachungsgerechte Unit-Economics-Berechnung als interne Entscheidungsgrundlage beibehalten und daraus eine vereinfachte, für den Vertrieb handhabbare Preisstruktur ableiten, die dennoch die wesentlichen, tatsächlichen Kostenunterschiede berücksichtigt, statt entweder die interne Genauigkeit oder die externe Handhabbarkeit vollständig zu opfern.

## Praktische Labs

~~~python
# Local, deterministic simulation of naive vs correct unit economics calculation (executed locally, no real cost accounting tool):

def naive_cost_per_customer(total_cost, customer_count):
    return total_cost / customer_count

def correct_cost_per_customer(fixed_shared_cost, customers):
    total_usage = sum(c["usage"] for c in customers)
    results = {}
    for c in customers:
        shared_share = fixed_shared_cost * (c["usage"] / total_usage)
        results[c["name"]] = round(shared_share + c["variable_cost"], 2)
    return results

customers = [
    {"name": "LowUsageCustomer", "usage": 10, "variable_cost": 50},
    {"name": "HighUsageCustomer", "usage": 90, "variable_cost": 450},
]

print("naive:", naive_cost_per_customer(1000, len(customers)))
print("correct:", correct_cost_per_customer(500, customers))
~~~

## Dependencies, Cross-References und Quellen

1. FinOps Foundation: [Unit Economics — FinOps Capability](https://www.finops.org/framework/capabilities/unit-economics/), abgerufen 2026-09-18.
2. AWS-Dokumentation: [Cost Optimization Pillar — Unit Cost Metrics](https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html), abgerufen 2026-09-18.

Tagging und Kostenallokation sind kanonisch in [KB-0636](02-tagging-und-kostenallokation.md) behandelt; Budgets und Forecasting in [KB-0637](03-budgets-und-forecasting.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, kontinuierliche Unit-Economics-Berechnung direkt aus Nutzungstelemetrie statt periodischer, manueller Auswertung | Evaluating | Als kontinuierliches Dashboard-Werkzeug einführen, jedoch die grundlegende Trennung von fixem und variablem Kostenanteil weiterhin explizit, methodisch fundiert definieren, statt sich allein auf automatisierte Zuordnungslogik zu verlassen. |

Ein Team akzeptiert eine Cloud-Unit-Economics-Berechnung erst, wenn gemeinsame Infrastruktur und variable Last nachweislich korrekt getrennt und verursachungsgerecht zugeordnet sind.
