---
{"id": "KB-0624", "title": "Datenklassifikation und Schutzbedarf", "domain": "26", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["ENTERPRISE", "GENAI", "CHIEF"], "requires": [{"id": "KB-0592", "concepts": ["Enterprise Data Architecture"], "needed_for": "understanding"}, {"id": "KB-0618", "concepts": ["GDPR und Datenschutzarchitektur"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Datenklassen mit nachvollziehbarer Kritikalitätsbewertung und benanntem Eigentümer für eine konkrete Organisation anhand etablierter Praxis korrekt festlegen und daraus Speicher-, Zugriffs- und AI-Nutzungsregeln ableiten können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Datenklassifikation aus tatsächlichem, nachvollziehbarem Schutzbedarf statt pauschaler Geheimhaltung abgeleitet wird, verbunden mit der bereits in KB-0592 behandelten Stammdatenverantwortung und der bereits in KB-0618 behandelten Zweckbindung.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn eine Datenklassifikation pauschal auf höchster Vertraulichkeitsstufe erfolgt, ohne den tatsächlichen Schutzbedarf zu differenzieren, und die daraus resultierende, unangemessene Zugriffs- oder AI-Nutzungsbeschränkung einordnen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Datenklassifikation festlegen, die Schutzbedarf nachvollziehbar differenzieren, statt pauschale Geheimhaltung als Ersatz für tatsächliche Risikobewertung einzusetzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die detaillierte, technische Implementierung spezifischer Datenklassifizierungswerkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist die nachvollziehbare Ableitung von Schutzbedarf und daraus resultierenden Regeln, nicht die technische Werkzeugimplementierung."}}, "lab_validation": [{"lab_id": "KB-0624-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Ableitung von AI-Nutzungsregeln aus differenziertem Schutzbedarf, kein produktives Klassifizierungs-Tool verwendet", "evidence": "Ein lokales Skript bewertet eine Liste von Datenklassen anhand ihrer tatsächlichen Kritikalität und leitet daraus differenzierte Regeln für Speicherung, Zugriff und AI-Nutzung ab, statt pauschal dieselbe, restriktivste Regel auf alle Datenklassen anzuwenden.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Klassifizierungs-Tool."}]}
---
# Datenklassifikation und Schutzbedarf

> **Ziel:** Datenklassifikation ordnet Datenobjekte (aufbauend auf der bereits in [KB-0592](../25-enterprise-architecture/04-enterprise-data-architecture.md) behandelten Enterprise Data Architecture) nach ihrem tatsächlichen **Schutzbedarf** in **Datenklassen** ein, mit benanntem **Eigentümer** je Klasse — der zentrale Punkt dieses Kapitels ist, dass Speicher-, Zugriffs- und AI-Nutzungsregeln aus diesem tatsächlich differenzierten, nachvollziehbaren Schutzbedarf abgeleitet werden müssen, statt pauschal die restriktivste, höchste Geheimhaltungsstufe auf alle Daten anzuwenden. Eine Organisation, die aus Vorsicht sämtliche Daten pauschal als "streng vertraulich" klassifiziert, ohne tatsächlichen Schutzbedarf zu differenzieren, erzeugt keine tatsächlich höhere Sicherheit, sondern lediglich unangemessene, praktisch hinderliche Beschränkungen für Daten, die tatsächlich einen deutlich geringeren Schutzbedarf hätten — insbesondere bei der Frage, welche Daten für AI-Systeme (etwa Trainingsdaten oder Kontextdaten für Retrieval-Systeme) tatsächlich genutzt werden dürfen.

## Zweck, Mental Model und Dependencies

Der tatsächliche Schutzbedarf eines Datenobjekts ergibt sich aus der konkreten Konsequenz eines Vertraulichkeits-, Integritäts- oder Verfügbarkeitsverlusts für die Organisation und die betroffenen Personen — nicht aus einer pauschalen Vermutung, dass "mehr Geheimhaltung immer sicherer ist". Ein Datenobjekt mit geringem tatsächlichem Schutzbedarf (etwa öffentlich verfügbare Produktinformationen) unterscheidet sich fundamental von einem Datenobjekt mit hohem tatsächlichem Schutzbedarf (etwa Gesundheitsdaten oder Geschäftsgeheimnisse), und diese Unterscheidung muss sich in unterschiedlichen, tatsächlich angemessenen Regeln niederschlagen, statt beide Datenklassen mit derselben, pauschal höchsten Schutzstufe zu behandeln. Die praktische Konsequenz für AI-Nutzungsregeln ist besonders bedeutsam: Ein AI-System, das für Trainingsdaten oder als Kontextquelle für ein Retrieval-System (siehe die bereits in Domain 13 behandelte Retrieval-Architektur) auf Unternehmensdaten zugreift, benötigt explizite, aus dem tatsächlichen Schutzbedarf abgeleitete Regeln, welche Datenklassen tatsächlich für welche AI-Nutzung freigegeben sind — Daten mit hohem Schutzbedarf (etwa personenbezogene Daten, deren Verarbeitungszweck bereits in [KB-0618](02-gdpr-und-datenschutzarchitektur.md) behandelt wurde) dürfen nicht ohne explizite, zweckgebundene Prüfung für ein allgemeines AI-Training verwendet werden, während Daten mit geringem Schutzbedarf deutlich freizügiger für AI-Anwendungsfälle nutzbar sein können. Die pauschale Geheimhaltung als vermeintlich "sichere" Alternative zu differenzierter Klassifikation erzeugt in der Praxis ein doppeltes Problem: Sie beschränkt legitime, tatsächlich risikoarme Nutzung unnötig (was Innovation und Effizienz behindert), während sie gleichzeitig keine tatsächlich höhere Sicherheit für die wirklich schutzbedürftigen Daten bewirkt, da eine pauschale Regel nicht zwischen tatsächlich hohem und tatsächlich niedrigem Risiko unterscheidet und dadurch keine gezielte, verstärkte Kontrolle für die tatsächlich kritischen Daten ermöglicht.

~~~text
Data classification: orders data objects (building on KB-0592 enterprise data architecture)
  by ACTUAL PROTECTION NEED into DATA CLASSES, with named OWNER per class
KEY POINT: storage/access/AI-usage rules must be derived from this actually-differentiated,
  traceable protection need
  instead of applying blanket, most-restrictive, highest secrecy level to ALL data
  org classifying ALL data blanket as "strictly confidential" out of caution, w/o differentiating
    actual protection need
  -> creates NO actually higher security, only inappropriate, practically hindering restrictions
     for data that would actually have SUBSTANTIALLY LOWER protection need
  ESPECIALLY relevant for: which data may actually be used for AI systems
    (training data, context data for retrieval systems)
ACTUAL protection need = derived from CONCRETE CONSEQUENCE of confidentiality/integrity/availability loss
  for org + affected persons -- NOT from blanket assumption "more secrecy = always safer"
  data object w/ low actual protection need (public product info)
  differs FUNDAMENTALLY from data object w/ high actual protection need (health data, trade secrets)
  this distinction must translate into DIFFERENT, actually-appropriate rules
    instead of treating both classes w/ same, blanket-highest protection level
PRACTICAL CONSEQUENCE for AI usage rules especially significant:
  AI system accessing company data as training data or context source for retrieval system
    (Domain 13 retrieval architecture)
  needs explicit rules, derived from actual protection need, of WHICH data classes are
    ACTUALLY cleared for WHICH AI usage
  high-protection-need data (personal data, whose processing purpose already covered in KB-0618)
    may NOT be used for general AI training w/o explicit, purpose-bound check
  low-protection-need data -> can be substantially more freely usable for AI use cases
BLANKET SECRECY as supposedly "safe" alternative to differentiated classification creates
  DOUBLE problem in practice:
  unnecessarily restricts legitimate, actually low-risk use (hinders innovation+efficiency)
  while providing NO actually higher security for genuinely protection-needing data
  (blanket rule doesn't distinguish actual high vs low risk -> no targeted, strengthened
   control for actually critical data)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Datenklasse | kategorisiert Daten nach tatsächlichem Schutzbedarf | Grundlage differenzierter statt pauschaler Regeln |
| Schutzbedarfsbewertung | leitet Kritikalität aus konkreter Verlustkonsequenz ab | verhindert pauschale, unbegründete Geheimhaltung |
| Benannter Eigentümer | verantwortliche Person/Rolle je Datenklasse | stellt Klassifikationsaktualität sicher |
| AI-Nutzungsregel | leitet zulässige AI-Nutzung aus Schutzbedarf ab | verhindert unangemessene Trainingsdaten-Nutzung hochsensibler Daten |

Implementierung: Datenklassen werden mit expliziter, nachvollziehbarer Schutzbedarfsbewertung anhand konkreter Verlustkonsequenzen definiert, nicht pauschal auf höchster Stufe. Jede Datenklasse erhält einen benannten, verantwortlichen Eigentümer. Speicher-, Zugriffs- und AI-Nutzungsregeln werden explizit aus dem jeweiligen, tatsächlichen Schutzbedarf abgeleitet, mit besonderer Sorgfalt bei AI-Trainings- und Retrieval-Kontextdaten.

## Scalability, Reliability, Security und Observability

Datenklassifikation skaliert die tatsächliche Sicherheits- und Innovationsbalance proportional zur Konsequenz differenzierter statt pauschaler Schutzbedarfsbewertung; die Reliability-Grenze liegt darin, dass pauschale Geheimhaltung weder legitime, risikoarme Nutzung ermöglicht noch tatsächlich kritische Daten gezielt stärker schützt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein AI-Trainingsvorhaben wird pauschal blockiert, obwohl die genutzten Daten tatsächlich geringen Schutzbedarf haben | keine differenzierte Datenklassifikation unterscheidet zwischen tatsächlich hohem und niedrigem Schutzbedarf | die Datenklassifikation anhand tatsächlicher Verlustkonsequenzen differenzieren |
| Daten mit tatsächlich hohem Schutzbedarf werden für ein AI-System genutzt, ohne dass dies auffällt | keine explizite, aus dem Schutzbedarf abgeleitete AI-Nutzungsregel existiert | eine explizite AI-Nutzungsregel je Datenklasse einführen, die hochsensible Daten von unkontrollierter Nutzung ausschließt |
| eine Datenklassifikation ist veraltet und entspricht nicht mehr dem tatsächlichen Schutzbedarf | kein benannter Eigentümer prüft die Klassifikation regelmäßig | einen benannten, verantwortlichen Eigentümer je Datenklasse mit regelmäßiger Überprüfungspflicht einführen |

Security: Datenklassen mit hohem Schutzbedarf sollten mit entsprechend verstärkten, technischen Zugriffskontrollen verbunden sein, während Datenklassen mit geringem Schutzbedarf nicht unnötig restriktiv behandelt werden sollten. Observability: Die tatsächliche Übereinstimmung zwischen dokumentierter Datenklasse und tatsächlicher, beobachteter Nutzung (etwa in AI-Trainingsdatensätzen) ist ein zentrales Signal zur Bewertung, ob Klassifikation und Regelanwendung tatsächlich konsistent sind.

## Trade-offs und Entscheidungen

**Staff** klassifiziert ein gegebenes Datenobjekt korrekt nach tatsächlichem Schutzbedarf und wendet die entsprechenden Regeln an. **Principal** entwirft die vollständige Datenklassifikationsstruktur mit differenzierten Speicher-, Zugriffs- und AI-Nutzungsregeln für einen Geschäftsbereich. **Chief** legt unternehmensweite Standards für Datenklassifikation fest, die differenzierten statt pauschalen Schutzbedarf verbindlich vorschreiben.

Anti-Patterns: alle Daten pauschal auf der höchsten Vertraulichkeitsstufe klassifizieren, ohne tatsächlichen Schutzbedarf zu differenzieren; Daten mit hohem Schutzbedarf ohne explizite, zweckgebundene Prüfung für AI-Training verwenden; eine Datenklassifikation ohne benannten, verantwortlichen Eigentümer führen und dadurch veraltete Klassifikationen unentdeckt lassen.

## Production Checklist

- [ ] Datenklassen sind mit nachvollziehbarer Schutzbedarfsbewertung anhand konkreter Verlustkonsequenzen definiert.
- [ ] Jede Datenklasse hat einen benannten, verantwortlichen Eigentümer.
- [ ] Speicher-, Zugriffs- und AI-Nutzungsregeln sind explizit aus dem jeweiligen Schutzbedarf abgeleitet.
- [ ] Hochsensible Datenklassen sind explizit von unkontrollierter AI-Trainingsnutzung ausgeschlossen.

## Interviewfragen

### 1. Warum reicht pauschale Geheimhaltung nicht als Ersatz für differenzierte Datenklassifikation?

**Antwort:** Weil sie legitime, risikoarme Nutzung unnötig einschränkt, ohne tatsächlich kritische Daten gezielt stärker zu schützen, da eine pauschale Regel nicht zwischen tatsächlich hohem und niedrigem Risiko unterscheidet.

### 2. Woraus sollte sich der tatsächliche Schutzbedarf eines Datenobjekts ergeben?

**Antwort:** Aus der konkreten Konsequenz eines Vertraulichkeits-, Integritäts- oder Verfügbarkeitsverlusts für die Organisation und betroffene Personen, nicht aus einer pauschalen Vermutung.

### 3. Warum ist die Verbindung von Datenklassifikation und AI-Nutzungsregeln besonders bedeutsam?

**Antwort:** Weil ein AI-System, das auf Unternehmensdaten für Training oder Retrieval zugreift, explizite, aus dem tatsächlichen Schutzbedarf abgeleitete Regeln benötigt, welche Datenklassen für welche AI-Nutzung tatsächlich freigegeben sind.

### 4. Wofür wird ein benannter Eigentümer je Datenklasse benötigt?

**Antwort:** Um sicherzustellen, dass die Klassifikation regelmäßig überprüft und aktualisiert wird, da eine Klassifikation ohne verantwortliche Person veraltet und unentdeckt bleiben kann.

### 5. Wie gehst du vor, wenn ein AI-Trainingsvorhaben pauschal blockiert wird, obwohl die genutzten Daten tatsächlich geringen Schutzbedarf haben?

**Antwort:** Ich prüfe, ob eine differenzierte Datenklassifikation den tatsächlichen Schutzbedarf dieser Daten korrekt erfasst, und passe die Regel entsprechend an, statt die pauschale Blockade unverändert beizubehalten.

### 6. Widersprüchliche Anforderung: Data-Science-Teams wollen maximale Freiheit bei der Datennutzung für AI-Trainingszwecke UND die Organisation will strikten Schutz sensibler Daten — wie gehst du vor?

**Antwort:** Ich würde eine differenzierte Datenklassifikation mit explizit abgeleiteten AI-Nutzungsregeln je Klasse einführen, die für Daten mit geringem Schutzbedarf tatsächlich maximale Freiheit ermöglicht, während Daten mit hohem Schutzbedarf gezielt und nachvollziehbar eingeschränkt bleiben, statt entweder pauschale Freigabe oder pauschale Blockade zu erzwingen.

## Praktische Labs

~~~python
# Local, deterministic simulation of deriving differentiated AI usage rules from protection need (executed locally, no real classification tool):

def derive_ai_usage_rule(data_class):
    if data_class["protection_need"] == "high":
        return "requires explicit, purpose-bound approval before any AI training use"
    elif data_class["protection_need"] == "low":
        return "freely usable for AI use cases"
    return "review required"

data_classes = [
    {"name": "public_product_catalog", "protection_need": "low"},
    {"name": "employee_health_records", "protection_need": "high"},
]

for dc in data_classes:
    print(dc["name"], "->", derive_ai_usage_rule(dc))
~~~

## Dependencies, Cross-References und Quellen

1. NIST: [SP 800-60 — Guide for Mapping Types of Information and Information Systems to Security Categories](https://csrc.nist.gov/pubs/sp/800/60/v1/r1/final), abgerufen 2026-09-18.
2. Bundesamt für Sicherheit in der Informationstechnik (BSI): [IT-Grundschutz — Schutzbedarfsfeststellung](https://www.bsi.bund.de/DE/Themen/Unternehmen-und-Organisationen/Standards-und-Zertifizierung/IT-Grundschutz/it-grundschutz_node.html), abgerufen 2026-09-18.

Enterprise Data Architecture ist kanonisch in [KB-0592](../25-enterprise-architecture/04-enterprise-data-architecture.md) behandelt; GDPR und Datenschutzarchitektur in [KB-0618](02-gdpr-und-datenschutzarchitektur.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, KI-gestützte Erkennung und Vorklassifikation sensibler Daten (etwa personenbezogener Daten) in unstrukturierten Datenbeständen | Evaluating | Als Vorklassifikations-Werkzeug einsetzen, das der benannten Eigentümerrolle Vorschläge liefert, jedoch die abschließende Klassifikationsentscheidung weiterhin menschlich treffen lassen. |

Ein Team akzeptiert eine Datenklassifikationsstruktur erst, wenn Schutzbedarf nachvollziehbar differenziert ist, benannte Eigentümer existieren und AI-Nutzungsregeln explizit aus dem jeweiligen Schutzbedarf abgeleitet sind.
