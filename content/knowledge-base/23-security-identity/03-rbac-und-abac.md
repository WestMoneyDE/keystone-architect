---
{"id": "KB-0539", "title": "RBAC und ABAC", "domain": "23", "sequence": 3, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0538", "concepts": ["IAM und Identitätslebenszyklen"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Rollenbasierte (RBAC) und attributbasierte (ABAC) Zugriffsentscheidungen anhand konkreter Ressourcenmodelle korrekt gestalten können, mit Bewusstsein für Rechteexplosion und Policykonflikte.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit entscheiden, wann RBAC ausreicht und wann dynamische, kontextabhängige Zugriffsanforderungen ABAC erfordern, statt pauschal ein Modell für alle Anwendungsfälle zu nutzen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine unüberschaubar gewordene Rollenlandschaft (Rechteexplosion) auf zu granulare, für jede Kombination aus Ressource und Zugriffsart einzeln erstellte Rollen zurückführen können, statt auf inhärente RBAC-Grenzen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für die bewusste Wahl zwischen RBAC und ABAC anhand tatsächlicher Zugriffskomplexität statt einer pauschalen Modellpräferenz festlegen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailimplementierung spezifischer Policy-Engines (z. B. OPA/Rego) im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der strukturellen Unterschiede zwischen RBAC und ABAC sowie deren jeweiliger Grenzen, nicht die Policy-Engine-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0539-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation von Rechteexplosion bei granularer Rollen-Kombinatorik, kein produktives IAM-System verwendet", "evidence": "Ein lokales Skript simuliert, wie die Anzahl benötigter Rollen kombinatorisch mit der Anzahl unterschiedlicher Ressourcentypen und Zugriffsarten wächst, wenn für jede Kombination eine eigene, granulare Rolle erstellt wird, und zeigt damit quantitativ, wie RBAC bei hoher Kombinatorik in eine unüberschaubare Rechteexplosion mündet, während ein ABAC-Modell dieselbe Anforderung mit einer kleinen Anzahl attributbasierter Regeln abdecken kann.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Ressourcenmodell einer produktiven Organisation."}]}
---
# RBAC und ABAC

> **Ziel:** RBAC (Role-Based Access Control) ordnet Berechtigungen über **Rollen** zu — eine Person erhält eine oder mehrere Rollen, und jede Rolle bündelt eine feste Menge an Berechtigungen. ABAC (Attribute-Based Access Control) trifft Zugriffsentscheidungen dagegen dynamisch anhand von **Attributen** (Eigenschaften des Nutzers, der Ressource, der Umgebung — etwa Abteilung, Ressourcen-Sensitivitätsstufe, Tageszeit, Standort), ausgewertet gegen eine Policy zur Laufzeit der Anfrage, statt anhand einer statisch vorab zugewiesenen Rolle. Der zentrale Punkt dieses Kapitels ist, dass **Rechteexplosion** (eine unüberschaubar wachsende Anzahl an Rollen) typischerweise kein inhärentes RBAC-Problem ist, sondern das Ergebnis des Versuchs, mit RBAC eine tatsächlich hochgradig kombinatorische, kontextabhängige Zugriffsanforderung abzubilden — wird für jede Kombination aus Ressourcentyp, Zugriffsart und Kontextbedingung eine eigene, granulare Rolle erstellt, wächst die Anzahl benötigter Rollen kombinatorisch mit der Anzahl dieser Dimensionen, während ABAC dieselbe Anforderung mit einer deutlich kleineren Anzahl attributbasierter Regeln abdecken kann, da es Kombinationen zur Laufzeit auswertet statt sie vorab als diskrete Rollen zu enumerieren.

## Zweck, Mental Model und Dependencies

RBAC löst das ursprüngliche Problem effizient, wenn die tatsächliche Zugriffslogik einer Organisation relativ stabil und mit einer überschaubaren Anzahl klar abgegrenzter Rollen (Administrator, Redakteur, Betrachter) modellierbar ist — die Zuweisung einer Rolle zu einer Person ist einfach zu verstehen, zu prüfen und zu auditieren, da die Berechtigungen einer Rolle vorab bekannt und statisch sind. Die strukturelle Grenze von RBAC zeigt sich, sobald Zugriffsentscheidungen tatsächlich von Kontextbedingungen abhängen, die sich nicht sinnvoll als feste Rolle vorab enumerieren lassen — etwa "ein Mitarbeiter darf ein Dokument nur einsehen, wenn er derselben Abteilung wie das Dokument angehört, und das Dokument keine höhere Sensitivitätsstufe als seine Freigabestufe hat, und der Zugriff während der Geschäftszeiten erfolgt". Eine solche Anforderung ließe sich mit RBAC nur durch eine explosionsartig wachsende Anzahl von Rollen abbilden (eine Rolle pro Kombination aus Abteilung, Sensitivitätsstufe und Zeitfenster), was schnell unüberschaubar wird. ABAC löst dies, indem es die Zugriffsentscheidung nicht anhand einer vorab zugewiesenen, statischen Rolle trifft, sondern zur Laufzeit der tatsächlichen Anfrage die relevanten Attribute (Abteilung des Nutzers, Sensitivitätsstufe der Ressource, aktuelle Zeit) gegen eine vergleichsweise kompakte Policy auswertet — dieselbe komplexe Anforderung lässt sich mit wenigen, kombinierbaren Regeln statt mit Hunderten oder Tausenden granularer Rollen abbilden. Diese Flexibilität hat jedoch einen Preis: ABAC-Policies sind schwerer statisch zu überblicken (welche konkreten Zugriffe eine Policy zu einem gegebenen Zeitpunkt tatsächlich erlaubt, hängt von der dynamischen Auswertung der Attribute ab, nicht von einer vorab bekannten Rollenliste), und Policykonflikte (mehrere Regeln, die für dieselbe Anfrage widersprüchliche Entscheidungen treffen könnten) erfordern eine explizite Konfliktauflösungsstrategie (etwa "explizite Ablehnung hat Vorrang vor expliziter Erlaubnis"), die bei RBAC in dieser Form nicht auftritt, da jede Rolle eine feste, nicht dynamisch kombinierte Berechtigungsmenge hat. Die praktische Konsequenz ist, dass RBAC und ABAC keine sich gegenseitig ausschließenden, sondern für unterschiedliche Komplexitätsgrade geeignete Modelle sind — viele reale Systeme kombinieren beide: RBAC für die grobe, stabile Rollenstruktur, ABAC für feingranulare, kontextabhängige Verfeinerungen innerhalb dieser Struktur.

~~~text
RBAC: permissions bundled into ROLES, person assigned one or more roles
  -> simple, auditable when access logic is STABLE + fits SMALL number of clear roles
ABAC: dynamic decision based on ATTRIBUTES (user/resource/environment)
  -> evaluated against policy AT REQUEST TIME, not pre-assigned static role
STRUCTURAL RBAC LIMIT: access decisions depending on context NOT enumerable as fixed roles
  e.g. "same department AS resource" AND "sensitivity <= clearance" AND "during business hours"
  -> forcing this into RBAC -> ROLE COUNT GROWS COMBINATORIALLY with dimension count
     -> RECHTEEXPLOSION (permission explosion) is usually NOT inherent RBAC weakness
        -> usually = trying to model HIGH-COMBINATORICS, context-dependent requirement with RBAC
ABAC handles SAME complex requirement with compact, combinable RULES instead of thousands of granular roles
  COST: harder to STATICALLY overview (what's allowed depends on dynamic attribute eval, not a known role list)
        + POLICY CONFLICTS need explicit resolution strategy (e.g. "explicit deny beats explicit allow")
          -- RBAC doesn't have this issue (each role = fixed, non-dynamically-combined permission set)
PRACTICAL CONCLUSION: NOT mutually exclusive -- many real systems COMBINE both
  RBAC for coarse, stable role structure + ABAC for fine-grained, context-dependent refinement within it
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| RBAC | statische Rollen mit fester Berechtigungsmenge | einfach auditierbar, ungeeignet für hohe Kombinatorik |
| ABAC | dynamische, attributbasierte Zugriffsentscheidung | kompakt für komplexe, kontextabhängige Anforderungen |
| Rechteexplosion | kombinatorisches Wachstum granularer RBAC-Rollen | typischerweise Fehlanwendung von RBAC auf zu komplexe Anforderung |
| Policykonflikte | widersprüchliche ABAC-Regeln für dieselbe Anfrage | erfordern explizite Konfliktauflösungsstrategie |

Implementierung: Für jede Zugriffsanforderung wird explizit geprüft, ob sie sich mit einer überschaubaren Anzahl stabiler Rollen (RBAC geeignet) oder nur durch eine kombinatorisch wachsende Rollenanzahl (ABAC geeignet) abbilden lässt. Bei ABAC-Nutzung wird eine explizite, dokumentierte Konfliktauflösungsstrategie für widersprüchliche Regeln festgelegt. RBAC und ABAC werden kombiniert genutzt, wo eine grobe, stabile Rollenstruktur mit feingranularer, kontextabhängiger Verfeinerung sinnvoll ist.

## Scalability, Reliability, Security und Observability

RBAC und ABAC skalieren die Überschaubarkeit beziehungsweise Flexibilität von Zugriffsentscheidungen proportional zur Passung zwischen Modellwahl und tatsächlicher Zugriffskomplexität; die Reliability-Grenze liegt darin, dass eine RBAC-Nutzung für hochgradig kombinatorische Anforderungen proportional zur Kombinatorik zu unüberschaubarer Rechteexplosion führt, während eine ABAC-Nutzung ohne explizite Konfliktauflösung proportional zur Regelanzahl zu unvorhersehbaren Zugriffsentscheidungen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| die Anzahl an Rollen wird unüberschaubar groß und schwer wartbar | RBAC wird für eine tatsächlich hochgradig kombinatorische, kontextabhängige Zugriffsanforderung genutzt | prüfen, ob ein Wechsel zu ABAC oder einer RBAC-ABAC-Kombination die Kombinatorik reduzieren kann |
| widersprüchliche Zugriffsentscheidungen treten bei ABAC-Policies auf | keine explizite Konfliktauflösungsstrategie für widersprüchliche Regeln ist definiert | eine explizite, dokumentierte Konfliktauflösungsstrategie (z. B. "Deny überstimmt Allow") einführen |
| unklar, welche Zugriffe eine ABAC-Policy zu einem gegebenen Zeitpunkt tatsächlich erlaubt | die Policy wurde nicht gegen konkrete, repräsentative Anfrageszenarien getestet | die Policy explizit gegen repräsentative Testfälle prüfen, um tatsächliches Verhalten nachzuvollziehen |

Security: ABAC-Konfliktauflösungsstrategien sollten standardmäßig konservativ sein (explizite Ablehnung überstimmt explizite Erlaubnis), um im Zweifelsfall restriktiveren statt großzügigeren Zugriff zu gewähren. Observability: Die tatsächliche Rollenanzahl relativ zur Organisationsgröße, die Häufigkeit von Policykonflikten bei ABAC, und die Testabdeckung repräsentativer Zugriffsszenarien sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** weist eine Rolle oder definiert eine ABAC-Regel für einen gegebenen Anwendungsfall korrekt zu. **Principal** entscheidet, ob RBAC, ABAC oder eine Kombination für eine konkrete Zugriffsanforderung geeignet ist, basierend auf tatsächlicher Kombinatorik. **Chief** legt unternehmensweite Standards für die bewusste Modellwahl anhand tatsächlicher Zugriffskomplexität fest.

Anti-Patterns: hochgradig kombinatorische, kontextabhängige Zugriffsanforderungen mit granularen RBAC-Rollen statt ABAC abbilden und dadurch Rechteexplosion riskieren; ABAC-Policies ohne explizite Konfliktauflösungsstrategie betreiben; RBAC und ABAC unreflektiert vermischen, ohne klare Aufgabenteilung zwischen grober Rollenstruktur und feingranularer Verfeinerung.

## Production Checklist

- [ ] Die Modellwahl (RBAC/ABAC/Kombination) entspricht der tatsächlichen Kombinatorik der Zugriffsanforderungen.
- [ ] ABAC-Policies haben eine explizite, dokumentierte Konfliktauflösungsstrategie.
- [ ] ABAC-Policies sind gegen repräsentative Testfälle geprüft, um tatsächliches Verhalten nachzuvollziehen.
- [ ] Die Rollenanzahl wird regelmäßig auf Anzeichen von Rechteexplosion überprüft.

## Interviewfragen

### 1. Was ist der zentrale strukturelle Unterschied zwischen RBAC und ABAC?

**Antwort:** RBAC ordnet Berechtigungen über statische Rollen mit fester Berechtigungsmenge zu; ABAC trifft Zugriffsentscheidungen dynamisch zur Laufzeit anhand von Attributen des Nutzers, der Ressource und der Umgebung.

### 2. Warum ist Rechteexplosion typischerweise kein inhärentes RBAC-Problem?

**Antwort:** Weil sie meist entsteht, wenn RBAC für eine tatsächlich hochgradig kombinatorische, kontextabhängige Anforderung genutzt wird, die durch eine explosionsartig wachsende Anzahl granularer Rollen statt eines geeigneteren Modells abgebildet wird.

### 3. Was ist der Nachteil von ABAC gegenüber RBAC?

**Antwort:** ABAC-Policies sind schwerer statisch zu überblicken, da das tatsächlich erlaubte Verhalten von dynamischer Attributauswertung abhängt, und erfordern eine explizite Konfliktauflösungsstrategie für widersprüchliche Regeln.

### 4. Wann ist eine Kombination aus RBAC und ABAC sinnvoll?

**Antwort:** Wenn eine grobe, stabile Rollenstruktur (RBAC) mit feingranularer, kontextabhängiger Verfeinerung innerhalb dieser Struktur (ABAC) benötigt wird.

### 5. Wie gehst du vor, wenn die Anzahl an Rollen unüberschaubar groß und schwer wartbar wird?

**Antwort:** Ich prüfe, ob RBAC für eine tatsächlich hochgradig kombinatorische, kontextabhängige Zugriffsanforderung genutzt wird, und evaluiere einen Wechsel zu ABAC oder einer RBAC-ABAC-Kombination, um die Kombinatorik zu reduzieren.

### 6. Widersprüchliche Anforderung: Team will einfach auditierbare, statisch überschaubare Zugriffsrechte UND flexible, kontextabhängige Zugriffsentscheidungen für komplexe Anforderungen — wie gehst du vor?

**Antwort:** Ich würde eine kombinierte Architektur vorschlagen: eine grobe, stabile RBAC-Struktur für die statische, leicht auditierbare Grundzuordnung, ergänzt um gezielte ABAC-Regeln für die spezifischen, tatsächlich kontextabhängigen Anforderungen — statt ein einzelnes Modell für alle Anforderungen zu erzwingen, was entweder die Auditierbarkeit oder die notwendige Flexibilität opfern würde.

## Praktische Labs

~~~python
# Local, deterministic simulation of RBAC role-count explosion vs ABAC compactness (executed locally, no real IAM system):

def rbac_role_count(resource_types, access_types, context_dimensions):
    return resource_types * access_types * context_dimensions

def abac_rule_count(resource_types, access_types, context_dimensions):
    return resource_types + access_types + context_dimensions

resource_types, access_types, context_dimensions = 10, 4, 5

print(f"RBAC roles needed (combinatorial): {rbac_role_count(resource_types, access_types, context_dimensions)}")
print(f"ABAC rules needed (compact): {abac_rule_count(resource_types, access_types, context_dimensions)}")
~~~

## Dependencies, Cross-References und Quellen

1. NIST-Dokumentation: [Guide to Attribute Based Access Control (ABAC) — SP 800-162](https://csrc.nist.gov/pubs/sp/800/162/final), abgerufen 2026-09-18.
2. NIST-Dokumentation: [Role-Based Access Control Overview](https://csrc.nist.gov/projects/role-based-access-control), abgerufen 2026-09-18.

IAM und Identitätslebenszyklen sind kanonisch in [KB-0538](02-iam-und-identitaetslebenszyklen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte Policy-as-Code-Werkzeuge (z. B. OPA/Rego), die ABAC-Policies deklarativ, testbar und versionierbar statt in verstreuter Anwendungslogik verwalten | Evaluating | Gegenüber in Anwendungslogik eingebetteten ABAC-Entscheidungen erst nach Prüfung der tatsächlichen Integrationskomplexität für den konkreten Anwendungsfall bevorzugen. |

Ein Team akzeptiert eine RBAC-/ABAC-Konfiguration erst, wenn die Modellwahl nachweislich der tatsächlichen Zugriffskombinatorik entspricht und ABAC-Konflikte explizit aufgelöst werden.
