---
{"id": "KB-0258", "title": "AI Gateways und Inhalts-Policies", "domain": "11", "sequence": 18, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0250", "concepts": ["Model Gateways"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Policy-Enforcement-Modell implementieren, das Modellverkehr auf Tenant-, Daten- und Sicherheitsregeln prüft, getrennt von reinem API-Routing.", "rationale": "Der Unterschied zwischen allgemeinem API-Routing und fachlicher Inhaltsprüfung wird erst durch konkrete Trennung beider Schichten greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "AI-Gateway-Policy-Architektur für einen konkreten Multi-Tenant-Anwendungsfall begründet gestalten, mit expliziter Trennung von Routing und Inhaltsbewertung.", "rationale": "Policy Enforcement (was darf verarbeitet/ausgeliefert werden) ist konzeptionell und implementierungstechnisch von reinem Routing (wohin geht die Anfrage) zu trennen."}, "STAFF-TARGET": {"active": true, "scope": "Eine übersehene Policy-Verletzung auf fehlende fachliche Antwortbewertung statt auf ein allgemeines Gateway-Problem zurückführen können.", "rationale": "Ein Gateway kann technisch korrekt routen, aber trotzdem eine inhaltlich unzulässige Antwort durchlassen, wenn keine dedizierte Inhaltsprüfung erfolgt."}, "CHIEF-TARGET": {"active": true, "scope": "AI Gateways mit Policy Enforcement als eigenständige, von reinem API-Gateway-Routing zu unterscheidende Sicherheitsschicht positionieren.", "rationale": "Modellverkehr erfordert fachliche Inhaltsbewertung (Tenant-Trennung, Datensensitivität, Sicherheitsregeln), die über generisches API-Routing hinausgeht."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Content-Filtering-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist die konzeptionelle Trennung von Routing und Policy Enforcement, nicht die Filterimplementierung."}}, "lab_validation": [{"lab_id": "KB-0258-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für getrenntes Routing und Policy Enforcement bei Modellverkehr", "evidence": "Eine Anfrage kann technisch korrekt an einen Modellanbieter geroutet werden, während eine separate Policy-Enforcement-Schicht die resultierende Antwort auf Tenant-Trennung, Datensensitivität und Sicherheitsregeln prüft, bevor sie ausgeliefert wird.", "limitations": "Kein echtes AI-Gateway-System, keine reale Multi-Tenant-Umgebung, keine Produktion."}]}
---
# AI Gateways und Inhalts-Policies

> **Ziel:** AI Gateways erweitern Model Gateways (siehe [KB-0250](10-model-gateways.md)) um fachliche Policy-Enforcement-Funktionen: Prüfung von Modellverkehr auf Tenant-Trennung, Datensensitivität und Sicherheitsregeln. Diese Policy-Enforcement-Ebene ist konzeptionell von reinem API-Routing (wohin geht die Anfrage) zu unterscheiden — ein Gateway kann technisch korrekt routen und trotzdem eine inhaltlich unzulässige Antwort durchlassen, wenn keine dedizierte fachliche Prüfung erfolgt.

## Zweck, Mental Model und Dependencies

Ein Model Gateway (siehe [KB-0250](10-model-gateways.md)) zentralisiert primär Zugriff, Authentifizierung und Routing zwischen Anwendungen und Modellanbietern — diese Funktionen sind primär infrastrukturell und betreffen, wohin eine Anfrage geleitet wird und ob sie überhaupt autorisiert ist. Ein AI Gateway mit Policy Enforcement geht darüber hinaus und prüft den tatsächlichen Inhalt des Modellverkehrs (sowohl Anfragen als auch Antworten) auf fachliche Regeln: Tenant-Regeln stellen sicher, dass ein Mandant nur auf für ihn bestimmte Daten und Antworten zugreift; Datenregeln prüfen, ob Anfragen oder Antworten sensible Datenkategorien enthalten, die besondere Behandlung erfordern (z. B. Maskierung, Blockierung); Sicherheitsregeln prüfen auf potenziell schädliche Inhalte (z. B. Prompt-Injection-Muster in Anfragen, unangemessene Inhalte in Antworten). Diese Unterscheidung ist wichtig, weil beide Schichten unterschiedliche Fehlerklassen abdecken: ein Routing-Fehler bedeutet, dass eine Anfrage den falschen Anbieter erreicht; ein Policy-Enforcement-Fehler bedeutet, dass eine inhaltlich unzulässige Anfrage oder Antwort trotz korrektem Routing verarbeitet oder ausgeliefert wird. Ein Gateway, das nur Routing, aber keine fachliche Inhaltsbewertung implementiert, bietet keinen Schutz gegen diese zweite, oft kritischere Fehlerklasse.

~~~text
Model gateway (routing layer):    WHERE does the request go? -> auth, access, provider routing
AI gateway (policy layer):        WHAT is in the request/response? -> tenant rules, data sensitivity, security rules
Correct routing + no content policy check = technically correct delivery of a POLICY-VIOLATING response
Both layers needed - routing correctness does NOT imply content correctness
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Trennung Routing/Policy-Schicht | sind Routing-Entscheidung und Inhaltsprüfung konzeptionell und implementierungstechnisch getrennt? | vermischte Schichten erschweren unabhängige Weiterentwicklung und Prüfung beider Aspekte |
| Tenant-Regeldurchsetzung | wird geprüft, dass Anfragen/Antworten korrekt einem Mandantenkontext zugeordnet bleiben? | fehlende Tenant-Prüfung ermöglicht Datenvermischung zwischen Mandanten trotz korrektem Routing |
| Datensensitivitätsprüfung | werden Anfragen/Antworten auf sensible Datenkategorien geprüft, die besondere Behandlung erfordern? | unerkannte sensible Daten in Anfragen/Antworten werden ohne angemessenen Schutz verarbeitet oder ausgeliefert |
| Sicherheitsregelprüfung | werden Anfragen/Antworten auf potenziell schädliche Muster geprüft? | Prompt-Injection oder unangemessene Inhalte werden ohne dedizierte Prüfung nicht erkannt |

Implementierung: die Policy-Enforcement-Schicht wird architektonisch getrennt von der reinen Routing-Schicht implementiert, sodass beide unabhängig weiterentwickelt, getestet und geprüft werden können. Tenant-Regeln werden für jede Anfrage und Antwort explizit durchgesetzt, mit Prüfung, dass der Mandantenkontext über die gesamte Verarbeitungskette konsistent bleibt. Datensensitivitätsprüfung erfolgt sowohl auf eingehende Anfragen (was wird an das Modell gesendet) als auch auf ausgehende Antworten (was wird an den Nutzer zurückgegeben), mit definierten Reaktionen (Maskierung, Blockierung, Eskalation) bei erkannter Sensitivität. Sicherheitsregeln prüfen sowohl auf bekannte Angriffsmuster in Anfragen als auch auf unangemessene oder schädliche Inhalte in Antworten, als eigenständige, dedizierte Prüfschicht.

## Scalability, Reliability, Security und Observability

AI Gateways mit getrennter Policy-Enforcement-Schicht skalieren fachliche Kontrolle über wachsenden Modellverkehr, weil Policy-Regeln zentral definiert und durchgesetzt werden, statt in jeder einzelnen Anwendung separat implementiert zu werden. Reliability-Grenze: ein Gateway, das Routing-Korrektheit mit Inhaltskorrektheit verwechselt, ist ein trügerisches Sicherheitsrisiko — es kann als "sicher" wahrgenommen werden, weil es technisch fehlerfrei funktioniert (korrektes Routing, keine Verbindungsfehler), während inhaltlich unzulässige Anfragen oder Antworten unbemerkt durchgelassen werden.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Antwort mit unzulässigem Inhalt wurde trotz funktionierendem Gateway ausgeliefert | Gateway implementiert nur Routing, keine dedizierte Inhalts-Policy-Prüfung | prüfen, ob eine separate Policy-Enforcement-Schicht tatsächlich Inhalte, nicht nur Routing, prüft |
| Daten eines Mandanten erscheinen im Kontext eines anderen Mandanten trotz korrektem technischem Routing | fehlende oder unzureichende Tenant-Regeldurchsetzung auf Inhaltsebene | Tenant-Kontext-Konsistenz über die gesamte Verarbeitungskette (nicht nur Routing) prüfen |
| sensible Daten erscheinen unmaskiert in einer Modellantwort | fehlende Datensensitivitätsprüfung auf ausgehende Antworten | Antwort-Policy-Prüfung auf tatsächliche Erkennung und Behandlung sensibler Datenkategorien prüfen |
| ein Prompt-Injection-Versuch wurde nicht erkannt, obwohl das Gateway aktiv ist | fehlende dedizierte Sicherheitsregelprüfung, nur Routing-Funktionalität aktiv | prüfen, ob eine spezifische Sicherheitsregel-Prüfschicht für Anfragen existiert, nicht nur Zugriffskontrolle |

Security: die Policy-Enforcement-Schicht selbst ist ein sicherheitskritischer Bestandteil und sollte regelmäßig gegen bekannte Angriffsmuster getestet werden, da eine unzureichend gepflegte Regelbasis ein falsches Sicherheitsgefühl erzeugen kann. Observability: Policy-Verletzungsrate nach Kategorie (Tenant, Datensensitivität, Sicherheit), Anzahl blockierter versus durchgelassener Anfragen/Antworten und Latenz-Overhead der Policy-Prüfung sind zentrale Metriken für AI-Gateway-Gesundheit.

## Trade-offs und Entscheidungen

**Staff** implementiert Policy Enforcement als eigenständige, von Routing getrennte Schicht. **Principal** macht Tenant-, Daten- und Sicherheitsregeln für das Team explizit dokumentiert und testbar. **Chief** positioniert AI Gateways mit Policy Enforcement als eigenständige Sicherheitsschicht, die über reines API-Routing hinausgeht.

Anti-Patterns: Model Gateway ohne dedizierte Inhalts-Policy-Prüfung als vollständig "sicher" behandeln; Tenant-Trennung nur auf Routing-Ebene statt auch auf Inhaltsebene durchsetzen; Policy-Regeln nie gegen bekannte Angriffsmuster testen und veraltet lassen.

## Production Checklist

- [ ] Policy Enforcement ist architektonisch getrennt von reinem Routing implementiert.
- [ ] Tenant-Regeln werden auf Inhaltsebene, nicht nur Routing-Ebene, durchgesetzt.
- [ ] Datensensitivitätsprüfung erfolgt auf Anfragen und Antworten.
- [ ] Sicherheitsregeln werden regelmäßig gegen bekannte Angriffsmuster getestet.

## Interviewfragen

### 1. Was ist der konzeptionelle Unterschied zwischen einem Model Gateway und einem AI Gateway mit Policy Enforcement?

**Antwort:** Ein Model Gateway zentralisiert primär Zugriff, Authentifizierung und Routing (wohin geht die Anfrage); ein AI Gateway mit Policy Enforcement prüft zusätzlich den tatsächlichen Inhalt auf Tenant-, Daten- und Sicherheitsregeln (was ist in der Anfrage/Antwort) — beide Schichten decken unterschiedliche Fehlerklassen ab.

### 2. Warum kann ein Gateway "technisch korrekt" funktionieren und trotzdem ein Sicherheitsrisiko darstellen?

**Antwort:** Korrektes Routing bedeutet nur, dass eine Anfrage den richtigen Anbieter erreicht; ohne dedizierte Inhalts-Policy-Prüfung kann eine inhaltlich unzulässige Anfrage oder Antwort trotzdem verarbeitet oder ausgeliefert werden, was technisch fehlerfrei, aber fachlich riskant ist.

### 3. Warum reicht Tenant-Trennung auf Routing-Ebene allein nicht aus?

**Antwort:** Korrektes Routing stellt sicher, dass eine Anfrage den richtigen Kanal nutzt, garantiert aber nicht, dass der tatsächliche Inhalt (Daten, Antworten) konsistent einem Mandantenkontext zugeordnet bleibt — eine zusätzliche inhaltsbasierte Tenant-Regeldurchsetzung ist notwendig.

### 4. Wie diagnostizierst du, dass eine Antwort mit unzulässigem Inhalt trotz funktionierendem Gateway ausgeliefert wurde?

**Antwort:** Ich prüfe, ob das Gateway tatsächlich eine dedizierte Policy-Enforcement-Schicht für Inhalte implementiert, oder ob es nur Routing-Funktionalität bietet — häufig fehlt die separate fachliche Inhaltsprüfung, obwohl das Routing selbst einwandfrei funktioniert.

### 5. Warum sollten Sicherheitsregeln regelmäßig getestet werden, statt einmalig implementiert zu bleiben?

**Antwort:** Angriffsmuster (z. B. Prompt-Injection-Techniken) entwickeln sich weiter; eine einmalig implementierte, nie aktualisierte Regelbasis kann neue Angriffsvarianten nicht erkennen, was ein falsches Sicherheitsgefühl erzeugt, wenn die Regeln nicht regelmäßig gegen aktuelle Bedrohungen getestet werden.

### 6. Widersprüchliche Anforderung: Team will minimalen Latenz-Overhead durch das Gateway UND umfassende Inhalts-Policy-Prüfung jeder Anfrage und Antwort — wie gehst du vor?

**Antwort:** Ich würde erklären, dass umfassende Inhaltsprüfung zwangsläufig Verarbeitungszeit kostet; ich würde vorschlagen, Policy-Prüfungen nach Risikograd zu staffeln — schnelle, leichtgewichtige Prüfungen für alle Anfragen, während aufwendigere, tiefere Prüfungen nur für als risikoreich eingestufte Anfragen/Antworten ausgeführt werden, um einen bewussten Kompromiss zwischen Latenz und Prüftiefe zu erreichen.

## Praktische Labs

~~~python
# Separate routing layer and policy enforcement layer
def route_request(request, provider_config):
    # ROUTING layer: only decides WHERE the request goes
    return {"routed_to": provider_config["primary_provider"], "request": request}

def enforce_policy(response, tenant_id, sensitivity_rules):
    # POLICY layer: checks WHAT is in the response
    violations = []
    if response.get("tenant_id") != tenant_id:
        violations.append("tenant mismatch: response does not belong to requesting tenant")
    for pattern in sensitivity_rules:
        if pattern in response.get("content", ""):
            violations.append(f"sensitive pattern detected: '{pattern}'")
    return violations

# Simulate correct routing but a policy violation in content
routed = route_request({"query": "get account balance"}, {"primary_provider": "provider_a"})
print(f"Routing result: {routed}")  # routing succeeded

simulated_response = {"tenant_id": "tenant_b", "content": "Account SSN: 123-45-6789"}
violations = enforce_policy(simulated_response, tenant_id="tenant_a", sensitivity_rules=["SSN"])

print(f"Policy violations detected: {violations}")
assert len(violations) == 2  # tenant mismatch AND sensitive data
print("\nRouting was technically correct, but the SEPARATE policy layer caught both a tenant leak and sensitive data exposure.")
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [LLM Top 10 — Sensitive Information Disclosure](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-17.
2. Microsoft: [Azure AI Content Safety](https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview), abgerufen 2026-09-17.
3. Portkey: [AI Gateway Guardrails](https://portkey.ai/docs/product/guardrails), abgerufen 2026-09-17.

Model-Gateway-Grundlagen sind kanonisch in [KB-0250](10-model-gateways.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, deklarative Guardrail-Frameworks für konfigurierbare Policy-Regeln ohne Custom-Code | Adopting | Gegenüber selbstgebauter Policy-Logik für schnellere Regel-Iteration bevorzugen. |
| Echtzeitfähige, ML-basierte Inhaltsklassifikation für Sicherheits- und Sensitivitätsprüfung mit geringer Latenz | Adopting | Gegenüber rein regelbasierten Mustern für die Erkennung neuartiger, nicht vordefinierter Risikomuster ergänzend einsetzen. |

Ein Team akzeptiert ein AI-Gateway-Design erst, wenn Policy Enforcement nachweisbar als eigenständige, getrennte Schicht von reinem Routing implementiert und getestet ist.
