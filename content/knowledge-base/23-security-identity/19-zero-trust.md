---
{"id": "KB-0555", "title": "Zero Trust", "domain": "23", "sequence": 19, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0537", "concepts": ["Threat Modeling und Vertrauensgrenzen"], "needed_for": "understanding"}, {"id": "KB-0539", "concepts": ["RBAC und ABAC"], "needed_for": "understanding"}, {"id": "KB-0545", "concepts": ["Microsoft Entra ID und Föderation"], "needed_for": "context"}, {"id": "KB-0552", "concepts": ["MTLS und Dienstauthentifizierung"], "needed_for": "context"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Zero-Trust-Prinzipien (explizite Verifikation, minimale Rechte, kontinuierliche Bewertung) anhand etablierter Praktiken operationalisieren und Identität, Gerätezustand sowie Ressourcenpolicy kombinieren können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine konkrete Organisation explizit gestalten, wie Zero-Trust-Prinzipien die bereits behandelten Bausteine (Threat Modeling, IAM, Conditional Access, mTLS) zu einem kohärenten Sicherheitsmodell zusammenführen, statt pauschales Netzwerkvertrauen fortzuführen.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Eine laterale Bewegung eines Angreifers innerhalb eines vermeintlich 'sicheren' internen Netzwerks auf implizites Netzvertrauen statt kontinuierlicher, expliziter Verifikation zurückführen können.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Zero-Trust-Standards festlegen, die explizite Verifikation und minimale Rechte konsequent statt eines Netzwerkperimeter-basierten Sicherheitsmodells durchsetzen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die Detailkonfiguration spezifischer Zero-Trust-Netzwerkzugriffswerkzeuge im Detail ist Vertiefung.", "rationale": "Kern ist das Verständnis der drei Zero-Trust-Prinzipien als integrierendes Rahmenwerk für bereits behandelte Bausteine, nicht die werkzeugspezifische Implementierung."}}, "lab_validation": [{"lab_id": "KB-0555-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales deterministisches Python-Modell zur Simulation lateraler Bewegung bei implizitem Netzvertrauen gegenüber kontinuierlicher Zero-Trust-Verifikation, kein produktives Netzwerksystem verwendet", "evidence": "Ein lokales Skript simuliert, wie ein Angreifer, der Zugriff auf eine einzelne Ressource innerhalb eines Netzwerks mit implizitem Perimeter-Vertrauen erlangt, sich ungehindert lateral zu weiteren Ressourcen bewegen kann, während ein Zero-Trust-Modell mit kontinuierlicher, expliziter Verifikation jeder einzelnen Anfrage (unabhängig von der Netzwerkherkunft) diese laterale Bewegung strukturell verhindert, da jede Ressource die Anfrage unabhängig prüft, statt implizitem Netzwerkvertrauen zu folgen.", "limitations": "Simulation mit synthetischen, deterministischen Daten, kein reales Netzwerksystem mit tatsächlicher Angriffsdynamik."}]}
---
# Zero Trust

> **Ziel:** Zero Trust ist kein einzelnes Werkzeug, sondern ein integrierendes Sicherheitsmodell, das drei Prinzipien konsequent durchsetzt: **explizite Verifikation** (jede Anfrage wird unabhängig geprüft, basierend auf tatsächlich verfügbaren Signalen — Identität, Gerätezustand, Ressourcen-Sensitivität — statt implizitem Vertrauen aufgrund der Netzwerkherkunft), **minimale Rechte** (Zugriff wird auf das tatsächlich benötigte Minimum begrenzt, konsistent mit den bereits behandelten RBAC-/ABAC-Prinzipien, siehe [KB-0539](03-rbac-und-abac.md)), und **kontinuierliche Bewertung** (Vertrauen ist keine einmalige, dauerhafte Feststellung bei der ersten Authentifizierung, sondern wird fortlaufend neu bewertet, etwa bei Änderungen des Gerätezustands oder erkannten Risikosignalen). Der zentrale Punkt dieses Kapitels ist, dass eine laterale Bewegung eines Angreifers innerhalb eines vermeintlich "sicheren" internen Netzwerks typischerweise nicht auf eine einzelne, fehlerhafte Kontrolle zurückzuführen ist, sondern auf implizites Netzwerkvertrauen — ein klassisches Perimeter-Sicherheitsmodell, das eine Ressource innerhalb des internen Netzwerks als grundsätzlich vertrauenswürdiger behandelt als eine externe, ermöglicht einem Angreifer, der einmal Zugriff auf eine einzelne interne Ressource erlangt hat, sich ungehindert zu weiteren internen Ressourcen zu bewegen, da diese die interne Netzwerkherkunft implizit als ausreichenden Vertrauensnachweis akzeptieren, statt jede einzelne Anfrage explizit und unabhängig zu verifizieren.

## Zweck, Mental Model und Dependencies

Zero Trust ist die konsequente, praktische Zusammenführung der in dieser Domain bereits behandelten Bausteine zu einem kohärenten Sicherheitsmodell, das explizit gegen das klassische Perimeter-Sicherheitsmodell antritt: Ein Perimeter-Modell etabliert eine harte Grenze (etwa eine Firewall) zwischen einem als vertrauenswürdig behandelten internen Netzwerk und einem als nicht vertrauenswürdig behandelten externen Netzwerk — sobald eine Anfrage diese Grenze einmal erfolgreich passiert hat, wird sie innerhalb des internen Netzwerks weitgehend implizit vertraut, was strukturell riskant ist, sobald ein Angreifer diese Grenze einmal überwindet (etwa durch einen kompromittierten internen Rechner oder gestohlene interne Credentials) — ab diesem Punkt kann sich der Angreifer relativ ungehindert lateral zu weiteren internen Ressourcen bewegen, da diese die interne Netzwerkherkunft implizit als ausreichenden Vertrauensnachweis akzeptieren. Zero Trust ersetzt dieses implizite, herkunftsbasierte Vertrauen durch explizite Verifikation jeder einzelnen Anfrage, unabhängig davon, ob sie aus dem internen oder externen Netzwerk stammt — dies baut direkt auf den bereits behandelten Vertrauensgrenzen aus dem Threat Modeling (siehe [KB-0537](01-threat-modeling-und-vertrauensgrenzen.md)) auf, wobei Zero Trust diese Vertrauensgrenzen nicht länger primär an Netzwerksegmenten, sondern an jeder einzelnen Ressourcenanfrage zieht. Die tatsächliche Verifikationsentscheidung kombiniert mehrere Signale — die verifizierte Identität des anfragenden Nutzers oder Workloads (aufbauend auf den bereits behandelten IAM- und Conditional-Access-Mechanismen, siehe [KB-0545](09-microsoft-entra-id-und-foederation.md)), den tatsächlichen Zustand des anfragenden Geräts (ist es verwaltet, aktuell gepatcht, frei von bekannten Kompromittierungsindikatoren), und die Sensitivität sowie tatsächliche Zugriffsrichtlinie der angefragten Ressource — statt einer einzelnen, binären "innerhalb versus außerhalb des Perimeters"-Entscheidung. Kontinuierliche Bewertung erweitert dies zeitlich: Eine einmal getroffene Vertrauensentscheidung (etwa bei der initialen Authentifizierung) bleibt nicht dauerhaft gültig, sondern wird fortlaufend neu bewertet, sodass eine nachträgliche Änderung relevanter Signale (ein Gerät wird als kompromittiert erkannt, ein ungewöhnliches Zugriffsmuster wird beobachtet) unmittelbar zu einer Anpassung des gewährten Zugriffs führen kann, statt bis zur nächsten regulären Authentifizierung unentdeckt zu bleiben — dies ist strukturell dieselbe Logik wie die bereits behandelte kontinuierliche Reconciliation bei GitOps (siehe Domain 22), nur angewendet auf Zugriffsentscheidungen statt Infrastrukturzustand: Vertrauen wird nicht einmalig gewährt und dann angenommen, sondern fortlaufend gegen den tatsächlichen, aktuellen Zustand geprüft.

~~~text
Zero Trust: INTEGRATING security model, 3 core principles, ties together previously covered building blocks
  1. EXPLICIT VERIFICATION: every request checked INDEPENDENTLY, based on ACTUAL signals
     (identity + device state + resource sensitivity) -- NOT implicit trust from network origin
  2. MINIMAL RIGHTS: access limited to actual need (consistent with RBAC/ABAC, KB-0539)
  3. CONTINUOUS EVALUATION: trust is NOT a one-time decision at initial auth
     -> ongoing re-evaluation (device state change, detected risk signal) -> immediate access adjustment
REPLACES classic PERIMETER model: hard boundary (firewall) trusted-internal vs untrusted-external
  once boundary crossed -> internal network LARGELY IMPLICITLY TRUSTED
  -> attacker who breaches boundary once (compromised internal machine/stolen internal creds)
     -> can move LATERALLY relatively unhindered (internal network origin = implicit sufficient trust proof)
Zero Trust ties trust boundaries (Threat Modeling, KB-0537) to EVERY SINGLE REQUEST, not network segments
  combines: verified identity (IAM/Conditional Access, KB-0545) + device state + resource policy
  vs single binary "inside vs outside perimeter" decision
CONTINUOUS evaluation = structurally SAME logic as GitOps continuous reconciliation (Domain 22)
  applied to ACCESS decisions instead of infrastructure state
LATERAL MOVEMENT within "secure" internal network
  -> usually NOT single faulty control -> usually IMPLICIT network trust (perimeter model)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Explizite Verifikation | jede Anfrage unabhängig, signalbasiert geprüft | ersetzt implizites, herkunftsbasiertes Netzwerkvertrauen |
| Minimale Rechte | konsistent mit RBAC/ABAC | begrenzt Zugriff auf tatsächlich benötigtes Minimum |
| Kontinuierliche Bewertung | fortlaufende, nicht einmalige Vertrauensentscheidung | erkennt nachträgliche Risikosignale unmittelbar |
| Signalkombination (Identität/Gerät/Ressourcenpolicy) | mehrdimensionale statt binäre Zugriffsentscheidung | ersetzt "innerhalb/außerhalb Perimeter"-Logik |

Implementierung: Jede Ressourcenzugriffsentscheidung wird explizit anhand tatsächlicher Signale (verifizierte Identität, Gerätezustand, Ressourcensensitivität) getroffen, unabhängig davon, ob die Anfrage aus dem internen oder externen Netzwerk stammt. Zugriffsrechte werden konsequent nach dem Prinzip minimaler Rechte vergeben, aufbauend auf den bereits etablierten RBAC-/ABAC-Mechanismen. Eine fortlaufende, nicht nur einmalige Bewertung des gewährten Vertrauens wird eingerichtet, sodass nachträgliche Risikosignale unmittelbar zu einer Anpassung führen.

## Scalability, Reliability, Security und Observability

Zero Trust skaliert die tatsächliche Angriffseindämmung proportional zur Konsequenz expliziter, signalbasierter Verifikation über alle Ressourcenzugriffe hinweg; die Reliability-Grenze liegt darin, dass verbleibendes, implizites Netzwerkvertrauen proportional zur Anzahl betroffener Ressourcen laterale Bewegung eines Angreifers innerhalb des Netzwerks ermöglicht.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Angreifer bewegt sich innerhalb des internen Netzwerks ungehindert zu weiteren Ressourcen | interne Ressourcen vertrauen implizit der Netzwerkherkunft statt jede Anfrage explizit zu verifizieren | Ressourcenzugriff auf explizite, signalbasierte Verifikation unabhängig von der Netzwerkherkunft umstellen |
| ein Gerät, das nach der initialen Authentifizierung kompromittiert wird, behält weiterhin vollen Zugriff | keine kontinuierliche Bewertung des Gerätezustands nach der initialen Authentifizierung erfolgt | eine kontinuierliche Neubewertung basierend auf aktuellem Gerätezustand und Risikosignalen einrichten |
| ein Nutzer hat Zugriff auf Ressourcen, die nicht seinem tatsächlichen, minimalen Bedarf entsprechen | das Prinzip minimaler Rechte wird nicht konsequent über RBAC/ABAC durchgesetzt | die Zugriffsrechte explizit gegen den tatsächlichen, minimalen Bedarf prüfen und anpassen |

Security: Explizite Verifikation, minimale Rechte und kontinuierliche Bewertung sollten für alle Ressourcenzugriffe konsistent durchgesetzt werden, unabhängig von der Netzwerkherkunft der Anfrage. Observability: Die tatsächliche Abdeckung expliziter Verifikation über alle Ressourcen hinweg, die Häufigkeit erkannter Risikosignale und daraus resultierender Zugriffsanpassungen, sowie verbleibende Bereiche impliziten Netzwerkvertrauens sind zentrale Sicherheitssignale.

## Trade-offs und Entscheidungen

**Staff** konfiguriert eine explizite Verifikationsregel für eine einzelne Ressource korrekt. **Principal** entwirft die vollständige Zero-Trust-Architektur, die Threat Modeling, IAM, Conditional Access und mTLS zu einem kohärenten Modell verbindet. **Chief** legt unternehmensweite Zero-Trust-Standards fest, die explizite Verifikation konsequent statt eines Perimeter-basierten Modells durchsetzen.

Anti-Patterns: interne Netzwerkressourcen implizit als vertrauenswürdiger als externe behandeln, ohne explizite Verifikation; eine einmalige Authentifizierung als dauerhaft gültig annehmen, ohne kontinuierliche Neubewertung; Zugriffsrechte breiter als tatsächlich benötigt vergeben, entgegen dem Prinzip minimaler Rechte.

## Production Checklist

- [ ] Jede Ressourcenzugriffsentscheidung erfolgt explizit, signalbasiert, unabhängig von der Netzwerkherkunft.
- [ ] Zugriffsrechte sind konsequent nach dem Prinzip minimaler Rechte vergeben.
- [ ] Eine kontinuierliche, nicht nur einmalige Bewertung des gewährten Vertrauens ist eingerichtet.
- [ ] Verbleibende Bereiche impliziten Netzwerkvertrauens sind identifiziert und werden aktiv reduziert.

## Interviewfragen

### 1. Was sind die drei Kernprinzipien von Zero Trust?

**Antwort:** Explizite Verifikation jeder Anfrage, minimale Rechte, und kontinuierliche Bewertung des gewährten Vertrauens.

### 2. Was ist der zentrale Unterschied zwischen Zero Trust und einem klassischen Perimeter-Sicherheitsmodell?

**Antwort:** Ein Perimeter-Modell vertraut einer Ressource implizit aufgrund ihrer internen Netzwerkherkunft; Zero Trust verifiziert jede einzelne Anfrage explizit anhand tatsächlicher Signale, unabhängig von der Netzwerkherkunft.

### 3. Warum ermöglicht ein Perimeter-Modell laterale Bewegung eines Angreifers?

**Antwort:** Weil ein Angreifer, der einmal Zugriff auf eine interne Ressource erlangt hat, sich aufgrund des impliziten internen Netzwerkvertrauens relativ ungehindert zu weiteren internen Ressourcen bewegen kann.

### 4. Was bedeutet kontinuierliche Bewertung im Zero-Trust-Modell?

**Antwort:** Eine einmal getroffene Vertrauensentscheidung bleibt nicht dauerhaft gültig, sondern wird fortlaufend gegen aktuelle Signale (Gerätezustand, Risikoindikatoren) neu bewertet, sodass nachträgliche Änderungen unmittelbar zu einer Anpassung des Zugriffs führen.

### 5. Wie gehst du vor, wenn ein Angreifer sich innerhalb des internen Netzwerks ungehindert zu weiteren Ressourcen bewegt?

**Antwort:** Ich prüfe, ob interne Ressourcen implizit der Netzwerkherkunft vertrauen, statt jede Anfrage explizit zu verifizieren, und stelle den Ressourcenzugriff auf signalbasierte Verifikation unabhängig von der Netzwerkherkunft um.

### 6. Widersprüchliche Anforderung: Nutzer wollen nahtlosen, unterbrechungsfreien Zugriff ohne wiederholte Authentifizierungsaufforderungen UND das Unternehmen will garantiert kontinuierliche, aktuelle Vertrauensbewertung für jede Ressource — wie gehst du vor?

**Antwort:** Ich würde vorschlagen, kontinuierliche Bewertung primär im Hintergrund, basierend auf passiv verfügbaren Signalen (Gerätezustand, Verhaltensmuster) durchzuführen, sodass Nutzer nur bei tatsächlich erkannten Risikoänderungen zu einer erneuten, expliziten Authentifizierung aufgefordert werden, statt routinemäßig und unterbrechend — nahtloser Zugriff und kontinuierliche Bewertung lassen sich durch risikobasierte, statt pauschal wiederholte Interaktionsanforderungen vereinbaren.

## Praktische Labs

~~~python
# Local, deterministic simulation of lateral movement: perimeter trust vs Zero Trust explicit verification (executed locally, no real network):

def perimeter_model_access(is_internal_network_origin):
    return "ACCESS GRANTED (implicit trust from internal network origin)" if is_internal_network_origin else "verification required"

def zero_trust_access(identity_verified, device_healthy, resource_policy_allows):
    if identity_verified and device_healthy and resource_policy_allows:
        return "ACCESS GRANTED (explicit verification passed)"
    return "ACCESS DENIED (explicit verification failed)"

print("perimeter model, attacker with internal foothold:", perimeter_model_access(is_internal_network_origin=True))
print("Zero Trust, same attacker without valid identity/device:", zero_trust_access(identity_verified=False, device_healthy=True, resource_policy_allows=True))
~~~

## Dependencies, Cross-References und Quellen

1. NIST-Dokumentation: [Zero Trust Architecture — SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-18.
2. CISA-Dokumentation: [Zero Trust Maturity Model](https://www.cisa.gov/zero-trust-maturity-model), abgerufen 2026-09-18.

Threat Modeling und Vertrauensgrenzen sind kanonisch in [KB-0537](01-threat-modeling-und-vertrauensgrenzen.md) behandelt; RBAC und ABAC in [KB-0539](03-rbac-und-abac.md); Microsoft Entra ID und Föderation in [KB-0545](09-microsoft-entra-id-und-foederation.md); MTLS und Dienstauthentifizierung in [KB-0552](16-mtls-und-dienstauthentifizierung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Erweiterte, KI-gestützte Risikobewertung, die kontinuierliche Zero-Trust-Entscheidungen basierend auf komplexen Verhaltensmustern statt statischer Regelsätze trifft | Evaluating | Gegenüber regelbasierter, transparenter Risikobewertung erst nach Prüfung der tatsächlichen Nachvollziehbarkeit und Fehlerrate für den konkreten Anwendungsfall bevorzugen. |

Ein Team akzeptiert eine Zero-Trust-Implementierung erst, wenn explizite Verifikation, minimale Rechte und kontinuierliche Bewertung nachweislich konsistent über alle Ressourcenzugriffe hinweg durchgesetzt werden, unabhängig von der Netzwerkherkunft.
