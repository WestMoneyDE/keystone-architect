---
{"id": "KB-0371", "title": "Shadow Deployments für AI", "domain": "15", "sequence": 21, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI", "MLOPS"], "requires": [{"id": "KB-0370", "concepts": ["AI-Canary-Releases"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Shadow-Deployment-Pipeline simulieren, die reale Anfragen parallel an einen neuen Modellstand sendet, ohne dessen Antworten an Nutzer auszuliefern.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Shadow-Deployment-Architektur gestalten, die Vergleichbarkeit zwischen Produktions- und Shadow-Antworten sicherstellt und zusätzliche Datenweitergabe sowie Kosten explizit kontrolliert.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Entscheiden, wann ein Shadow Deployment gegenüber einem Canary-Release die geeignetere Methode zur Qualitätsprüfung eines neuen Modellstands ist.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Transparente Kontrolle von Datenweitergabe und Kosten als verpflichtenden Bestandteil jeder Shadow-Deployment-Praxis im Unternehmen etablieren.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Fortgeschrittene Techniken zur Reduktion der doppelten Rechenkosten bei Shadow Deployments sind Vertiefung.", "rationale": "Kern ist das Verständnis von Vergleichbarkeit, Datenweitergabe- und Kostenkontrolle, nicht eine spezifische Kostenoptimierungstechnik."}}, "lab_validation": [{"lab_id": "KB-0371-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokal simuliertes Shadow-Deployment, das reale Anfragen parallel an einen bisherigen und einen neuen Modellstand sendet", "evidence": "Eine simulierte Anfrage wird parallel an den produktiven und den Shadow-Modellstand gesendet; nur die Antwort des produktiven Stands wird an den simulierten Nutzer ausgeliefert, während die Shadow-Antwort ausschließlich zu Vergleichszwecken protokolliert wird, wodurch ein Qualitätsvergleich ohne jegliche Nutzerauswirkung möglich wird.", "limitations": "Kein produktives Shadow-System, kein realer Geschäftsdatensatz, kleine simulierte Anfragenmenge."}]}
---
# Shadow Deployments für AI

> **Ziel:** Ein Shadow Deployment verarbeitet reale Produktionsanfragen parallel mit einem neuen Modellstand, ohne dass dessen Antworten jemals an tatsächliche Nutzer ausgeliefert werden, als Alternative bzw. Ergänzung zu gestuften Canary-Releases (siehe [KB-0370](20-ai-canary-releases.md)). Der zentrale Punkt dieses Kapitels ist, dass diese scheinbar risikofreie Methode drei spezifische, transparent zu kontrollierende Aspekte mit sich bringt: die Vergleichbarkeit der Shadow-Antworten mit den produktiven Antworten, die zusätzliche Datenweitergabe an den Shadow-Stand, und die zusätzlichen Kosten durch die parallele Verarbeitung.

## Zweck, Mental Model und Dependencies

Bei einem Shadow Deployment erhält der neue Modellstand eine Kopie jeder realen Produktionsanfrage und verarbeitet sie parallel zum produktiven Stand, jedoch wird ausschließlich die Antwort des produktiven Stands tatsächlich an den Nutzer ausgeliefert — die Shadow-Antwort wird nur protokolliert und zu Vergleichszwecken analysiert. Dies eliminiert im Gegensatz zu einem Canary-Release (bei dem ein Teil echter Nutzer tatsächlich die neue Version erhält) das Expositionsrisiko vollständig, da kein Nutzer jemals eine Shadow-Antwort sieht. Diese scheinbare Risikofreiheit hat jedoch drei konkrete Kehrseiten: erstens ist die Vergleichbarkeit zwischen Shadow- und produktiver Antwort nicht immer gegeben, wenn die Shadow-Verarbeitung nicht exakt dieselben Bedingungen (Kontext, Zeitpunkt, nachgelagerte Zustandsänderungen) wie die produktive Verarbeitung erfährt — insbesondere bei zustandsbehafteten Systemen (z. B. mit persistenter Konversationshistorie) kann eine parallele Shadow-Verarbeitung den Zustand anders fortschreiben als die tatsächliche produktive Verarbeitung, was den Vergleich verzerrt. Zweitens bedeutet ein Shadow Deployment zusätzliche Datenweitergabe: reale, potenziell sensible Nutzeranfragen werden an ein zusätzliches System (den Shadow-Stand) weitergegeben, was gesondert unter Datenschutzgesichtspunkten geprüft werden muss, auch wenn keine Antwort an den Nutzer zurückfließt. Drittens verursacht die parallele Verarbeitung tatsächliche zusätzliche Rechenkosten (der Shadow-Stand verarbeitet jede Anfrage zusätzlich zum produktiven Stand), die trotz fehlender Nutzerauswirkung real anfallen und explizit budgetiert werden müssen.

~~~text
Shadow deployment: new model version receives a COPY of every real production request, processes it in parallel
  ONLY the production model's response is delivered to the user; shadow response is logged/compared only
  -> ELIMINATES exposure risk entirely (unlike canary, where real users DO see the new version)
THREE CONCRETE DOWNSIDES despite apparent risk-freedom:
  1. Comparability: stateful systems (e.g. persistent conversation history) -- shadow processing may diverge
     from production's actual state progression, skewing the comparison
  2. Additional data exposure: real, potentially sensitive requests are forwarded to an EXTRA system (the shadow)
     -> needs separate privacy review, even though no response reaches the user
  3. Real extra compute cost: shadow processes every request IN ADDITION to production
     -> genuine cost, despite zero user-facing impact, must be explicitly budgeted
~~~

## Core Concepts, Architektur und Implementierung

| Aspekt | Charakteristik | Erforderliche Kontrolle |
|---|---|---|
| Expositionsrisiko | vollständig eliminiert, kein Nutzer sieht die Shadow-Antwort | (Vorteil gegenüber Canary, keine zusätzliche Kontrolle nötig) |
| Vergleichbarkeit | kann bei zustandsbehafteten Systemen verzerrt sein | sicherstellen, dass Shadow- und Produktionsverarbeitung denselben Ausgangszustand und Kontext erhalten |
| Datenweitergabe | reale Anfragen werden an ein zusätzliches System weitergegeben | separate Datenschutzprüfung für den Shadow-Stand, unabhängig von fehlender Nutzerauswirkung |
| Kosten | zusätzliche parallele Verarbeitung jeder Anfrage | explizite Budgetierung der Shadow-Verarbeitungskosten |

Implementierung: Jede reale Produktionsanfrage wird dupliziert und parallel an den produktiven und den Shadow-Modellstand gesendet; nur die produktive Antwort erreicht den Nutzer. Bei zustandsbehafteten Systemen wird sichergestellt, dass die Shadow-Verarbeitung denselben Kontext- und Zustandsstand wie die produktive Verarbeitung zum jeweiligen Zeitpunkt erhält, um verzerrte Vergleiche zu vermeiden. Vor Einführung eines Shadow Deployments wird eine separate Datenschutzprüfung durchgeführt, die die zusätzliche Weitergabe realer Anfragen an den Shadow-Stand explizit bewertet. Die durch die parallele Verarbeitung entstehenden zusätzlichen Rechenkosten werden explizit budgetiert und zeitlich begrenzt (Shadow Deployments laufen typischerweise nur für einen definierten Beobachtungszeitraum, nicht dauerhaft).

## Scalability, Reliability, Security und Observability

Shadow Deployments skalieren risikofreie Qualitätsvergleiche proportional zur Menge der real dupliziert verarbeiteten Anfragen; die Reliability-Grenze liegt darin, dass unentdeckte Vergleichbarkeitsprobleme bei zustandsbehafteten Systemen proportional zur Komplexität des Zustands zunehmend irreführende Vergleichsergebnisse erzeugen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Shadow- und Produktionsantworten für dieselbe Anfrage unterscheiden sich unerwartet stark, obwohl beide Modellstände identisch sein sollten | die Shadow-Verarbeitung erhält einen anderen Kontext- oder Zustandsstand als die produktive Verarbeitung | den Kontext- und Zustandsabgleich zwischen Shadow- und Produktionsverarbeitung prüfen und synchronisieren |
| ein Shadow Deployment verursacht unerwartet hohe zusätzliche Infrastrukturkosten | die Kosten der parallelen Verarbeitung wurden vor Einführung nicht explizit budgetiert | die Shadow-Verarbeitungskosten explizit messen und den Beobachtungszeitraum entsprechend begrenzen |
| eine nachträgliche Datenschutzprüfung stellt fest, dass sensible Anfragedaten unangemessen an den Shadow-Stand weitergegeben wurden | keine separate Datenschutzprüfung für den Shadow-Stand wurde vor Einführung durchgeführt | eine nachträgliche Datenschutzprüfung durchführen und bei Bedarf sensible Felder vor Weitergabe an den Shadow-Stand maskieren |

Security: Die zusätzliche Datenweitergabe an den Shadow-Stand erfordert dieselbe Sorgfalt bei der Prüfung sensibler Inhalte wie die produktive Verarbeitung selbst, da reale Nutzerdaten unabhängig von der fehlenden Nutzerauswirkung tatsächlich verarbeitet werden. Observability: Die Vergleichbarkeitsrate (Anteil der Anfragen mit korrekt synchronisiertem Kontext zwischen Shadow und Produktion), die tatsächlichen Zusatzkosten der Shadow-Verarbeitung, und der Umfang der an den Shadow-Stand weitergegebenen Daten sind zentrale Steuerungsmetriken.

## Trade-offs und Entscheidungen

**Staff** implementiert eine separate Datenschutzprüfung und explizite Kostenbudgetierung vor jedem Shadow Deployment. **Principal** macht Vergleichbarkeitsprobleme und Kosten für das Team nachvollziehbar. **Chief** etabliert transparente Kontrolle von Datenweitergabe und Kosten als verpflichtenden Bestandteil jeder Shadow-Deployment-Praxis im Unternehmen.

Anti-Patterns: ein Shadow Deployment ohne separate Datenschutzprüfung der zusätzlichen Datenweitergabe einführen; die zusätzlichen Rechenkosten der parallelen Verarbeitung nicht explizit budgetieren; bei zustandsbehafteten Systemen die Vergleichbarkeit zwischen Shadow- und Produktionsverarbeitung nicht sicherstellen.

## Production Checklist

- [ ] Eine separate Datenschutzprüfung bewertet die zusätzliche Datenweitergabe an den Shadow-Stand.
- [ ] Die zusätzlichen Rechenkosten der Shadow-Verarbeitung sind explizit budgetiert und zeitlich begrenzt.
- [ ] Bei zustandsbehafteten Systemen ist die Vergleichbarkeit zwischen Shadow- und Produktionsverarbeitung sichergestellt.
- [ ] Shadow-Antworten erreichen unter keinen Umständen tatsächliche Nutzer.

## Interviewfragen

### 1. Was ist der zentrale Vorteil eines Shadow Deployments gegenüber einem Canary-Release?

**Antwort:** Es eliminiert das Expositionsrisiko vollständig, da kein echter Nutzer jemals eine Antwort des neuen Modellstands sieht — nur die produktive Antwort wird tatsächlich ausgeliefert.

### 2. Welche drei konkreten Kehrseiten hat ein Shadow Deployment trotz fehlendem Expositionsrisiko?

**Antwort:** Mögliche Vergleichbarkeitsprobleme bei zustandsbehafteten Systemen, zusätzliche Datenweitergabe an ein weiteres System, und real anfallende zusätzliche Rechenkosten durch die parallele Verarbeitung.

### 3. Warum kann die Vergleichbarkeit zwischen Shadow- und Produktionsantwort bei zustandsbehafteten Systemen verzerrt sein?

**Antwort:** Wenn die Shadow-Verarbeitung nicht denselben Kontext- und Zustandsstand wie die produktive Verarbeitung zum jeweiligen Zeitpunkt erhält, können die Antworten aus unterschiedlichen, nicht vergleichbaren Ausgangsbedingungen resultieren.

### 4. Warum erfordert ein Shadow Deployment eine separate Datenschutzprüfung, obwohl keine Antwort an Nutzer ausgeliefert wird?

**Antwort:** Reale, potenziell sensible Nutzeranfragen werden dennoch tatsächlich an ein zusätzliches System weitergegeben und dort verarbeitet, was unabhängig von der fehlenden Nutzerauswirkung ein Datenschutzrisiko darstellt.

### 5. Wie gehst du vor, wenn ein Shadow Deployment unerwartet hohe zusätzliche Infrastrukturkosten verursacht?

**Antwort:** Ich messe die tatsächlichen Kosten der parallelen Verarbeitung explizit und begrenze den Beobachtungszeitraum des Shadow Deployments entsprechend, statt es unbegrenzt weiterlaufen zu lassen.

### 6. Widersprüchliche Anforderung: Team will risikofreie, vollständige Qualitätsprüfung eines neuen Modellstands UND minimale zusätzliche Kosten und Datenschutzrisiken — wie gehst du vor?

**Antwort:** Ich würde ein zeitlich begrenztes Shadow Deployment mit einer reduzierten, repräsentativen Stichprobe des realen Verkehrs statt des vollständigen Verkehrs einsetzen, um sowohl die zusätzlichen Kosten als auch die zusätzliche Datenweitergabe zu begrenzen, während weiterhin eine aussagekräftige Qualitätsprüfung ohne jegliches Nutzerrisiko möglich bleibt.

## Praktische Labs

~~~python
def production_model(request):
    return f"production response to: {request}"

def shadow_model(request):
    return f"shadow response to: {request}"

shadow_log = []

def handle_request(request):
    production_response = production_model(request)  # ONLY this reaches the user

    shadow_response = shadow_model(request)  # processed in parallel, NEVER delivered
    shadow_log.append({"request": request, "production": production_response, "shadow": shadow_response})

    return production_response  # user only ever sees this

requests = ["What is the capital of France?", "Summarize this document."]
for req in requests:
    user_facing_response = handle_request(req)
    print(f"User received: {user_facing_response}")

print("\nShadow comparison log (never shown to users):")
for entry in shadow_log:
    match = entry["production"] == entry["shadow"]
    print(f"  request={entry['request']!r}, match={match}")
~~~

## Dependencies, Cross-References und Quellen

1. Google Cloud-Dokumentation: [Shadow Testing for ML Models](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning), abgerufen 2026-09-17.
2. Sculley et al.: [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html), abgerufen 2026-09-17.

AI-Canary-Releases sind kanonisch in [KB-0370](20-ai-canary-releases.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte Stichproben-Shadow-Deployments, die nur einen konfigurierbaren Anteil des Verkehrs duplizieren, um Kosten zu senken | Adopting | Gegenüber vollständiger Verkehrsduplizierung für kosteneffizientere, aber weiterhin aussagekräftige Vergleiche bevorzugen. |
| Automatisierte Zustandssynchronisationswerkzeuge für Shadow Deployments bei zustandsbehafteten Systemen | Evaluating | Gegenüber manueller Zustandsabstimmung abwägen, sobald das Werkzeug nachweislich zuverlässige Vergleichbarkeit sicherstellt. |

Ein Team akzeptiert die Ergebnisse eines Shadow Deployments erst, wenn Datenweitergabe geprüft, Kosten budgetiert und Vergleichbarkeit bei zustandsbehafteten Systemen sichergestellt sind.
