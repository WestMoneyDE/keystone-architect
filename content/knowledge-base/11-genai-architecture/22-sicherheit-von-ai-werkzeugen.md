---
{"id": "KB-0262", "title": "Sicherheit von AI-Werkzeugen", "domain": "11", "sequence": 22, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0247", "concepts": ["Function Calling"], "needed_for": "understanding"}, {"id": "KB-0260", "concepts": ["Prompt Injection"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell für Zielsystem-Validierung gegen SSRF-Risiken bei einem AI-Werkzeug mit Netzwerkzugriff lokal implementieren.", "rationale": "Der SSRF-Angriffsvektor bei AI-Werkzeugen mit Netzwerkzugriff wird erst durch konkrete Zielsystem-Validierungslogik greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ausführungsrechte und Argumentvalidierung für ein konkretes AI-Werkzeug begründet gestalten, mit expliziter Behandlung von SSRF- und Exfiltrationsrisiken.", "rationale": "AI-Werkzeuge mit Netzwerk- oder Dateisystemzugriff erben klassische Sicherheitsrisiken (SSRF, Exfiltration), die spezifisch für den AI-Kontext behandelt werden müssen."}, "STAFF-TARGET": {"active": true, "scope": "Einen unautorisierten internen Netzwerkzugriff durch ein AI-Werkzeug auf fehlende Zielsystem-Validierung statt auf einen allgemeinen Netzwerkfehler zurückführen können.", "rationale": "SSRF über ein AI-Werkzeug mit Netzwerkzugriff ist ein spezifischer, identifizierbarer Angriffsvektor, der durch fehlende Zielsystem-Validierung entsteht, nicht durch zufällige Netzwerkprobleme."}, "CHIEF-TARGET": {"active": true, "scope": "AI-Werkzeug-Sicherheit als Anwendung klassischer Sicherheitsprinzipien (Eingabevalidierung, Ausführungsrechte-Minimierung) auf den spezifischen AI-Kontext positionieren, nicht als neuartiges, unbekanntes Risiko.", "rationale": "Viele Tool-Sicherheitsrisiken (SSRF, Exfiltration, privilegierte Seiteneffekte) sind klassische Sicherheitsprobleme, die im AI-Kontext durch die zusätzliche Ebene des Modellvorschlags eine neue Angriffsfläche erhalten."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Sandboxing-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist die Anwendung klassischer Sicherheitsprinzipien auf AI-Werkzeuge, nicht die Sandboxing-Implementierung."}}, "lab_validation": [{"lab_id": "KB-0262-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Zielsystem-Validierung gegen SSRF-Risiken bei einem AI-Werkzeug mit Netzwerkzugriff", "evidence": "Ein AI-Werkzeug, das eine vom Modell vorgeschlagene URL ohne Validierung gegen interne Netzwerkadressen aufruft, kann für Server-Side Request Forgery missbraucht werden, wenn die Zielsystem-Validierung fehlt.", "limitations": "Kein echtes produktives Werkzeug, keine reale Netzwerkumgebung, keine Produktion."}]}
---
# Sicherheit von AI-Werkzeugen

> **Ziel:** AI-Werkzeuge (Function Calling, siehe [KB-0247](07-function-calling-und-werkzeugvertraege.md)) mit Netzwerk-, Dateisystem- oder API-Zugriff erben klassische Sicherheitsrisiken — SSRF (Server-Side Request Forgery), Datenexfiltration und privilegierte Seiteneffekte — die im AI-Kontext eine zusätzliche Angriffsfläche durch die Ebene des Modellvorschlags erhalten (verwandt mit Prompt-Injection-Risiken, siehe [KB-0260](20-prompt-injection-und-instruktionsgrenzen.md)). Argumente, Zielsysteme und Ausführungsrechte müssen konkret validiert werden, nicht als abstraktes AI-Risiko behandelt werden.

## Zweck, Mental Model und Dependencies

SSRF (Server-Side Request Forgery) tritt auf, wenn ein System eine vom Nutzer (oder in diesem Fall: vom Modell) kontrollierte URL oder Netzwerkadresse ohne ausreichende Validierung aufruft — ein AI-Werkzeug, das z. B. Webinhalte abruft, könnte dazu gebracht werden, interne, eigentlich nicht extern erreichbare Systeme anzusprechen, wenn keine Zielsystem-Validierung erfolgt. Dieses Risiko ist im AI-Kontext besonders relevant, weil die Zieladresse nicht direkt vom Nutzer, sondern vom Modell basierend auf einer möglicherweise manipulierten Eingabe (siehe Prompt Injection, [KB-0260](20-prompt-injection-und-instruktionsgrenzen.md)) vorgeschlagen werden kann. Datenexfiltration beschreibt das Risiko, dass ein AI-Werkzeug dazu missbraucht wird, sensible Daten an einen vom Angreifer kontrollierten externen Endpunkt zu senden (z. B. über ein manipuliertes Argument bei einem Werkzeugaufruf, der Daten an eine externe URL überträgt). Privilegierte Seiteneffekte entstehen, wenn ein AI-Werkzeug mit höheren Rechten agiert, als für die eigentliche Aufgabe notwendig wäre — dieses Prinzip ist eine Anwendung des klassischen Least-Privilege-Prinzips auf den AI-Werkzeug-Kontext. Alle drei Risikoklassen sind keine neuartigen, AI-spezifischen Probleme, sondern klassische Sicherheitsrisiken, die durch die zusätzliche Indirektionsebene des Modellvorschlags (statt direkter Nutzereingabe) eine neue, komplexere Angriffsfläche erhalten.

~~~text
SSRF:                    tool calls a URL/address SUGGESTED by the model -> without validation, can reach internal-only systems
Data exfiltration:        tool sends data to an EXTERNAL endpoint suggested by the model -> can leak sensitive data if unvalidated
Excessive privilege:      tool operates with MORE rights than the specific task requires -> larger blast radius on compromise
All are CLASSIC security risks, made more complex by the model-proposal indirection layer (vs. direct user input)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Zielsystem-Validierung | werden vom Modell vorgeschlagene Ziel-URLs/Adressen gegen eine Allowlist oder gegen interne Netzwerkbereiche geprüft? | fehlende Validierung erlaubt SSRF-Angriffe über interne, eigentlich nicht erreichbare Systeme |
| Exfiltrationsgrenzen | ist begrenzt, an welche externen Ziele ein Werkzeug tatsächlich Daten senden darf? | fehlende Begrenzung erlaubt Datenexfiltration an beliebige, vom Modell vorgeschlagene externe Endpunkte |
| Ausführungsrechte-Minimierung | agiert jedes AI-Werkzeug nur mit den für seine spezifische Aufgabe minimal notwendigen Rechten? | übermäßige Rechte vergrößern den potenziellen Schaden bei einer erfolgreichen Kompromittierung |
| Argumentvalidierung vor Ausführung | werden alle vom Modell vorgeschlagenen Argumente strukturell und fachlich validiert, bevor sie ausgeführt werden? | ungeprüfte Argumente können zu unbeabsichtigten oder schädlichen Werkzeugaktionen führen |

Implementierung: jedes AI-Werkzeug mit Netzwerkzugriff validiert vorgeschlagene Zieladressen explizit gegen eine Allowlist erlaubter Domains oder gegen bekannte interne Netzwerkbereiche (die grundsätzlich blockiert werden), analog zu klassischer SSRF-Abwehr in jeder anderen Anwendung mit nutzergesteuerten URLs. Exfiltrationsgrenzen werden durch explizite Beschränkung möglicher Zielendpunkte für Datenübertragungen durchgesetzt, statt beliebige, vom Modell vorgeschlagene externe Ziele zu erlauben. Jedes AI-Werkzeug wird mit dem für seine spezifische Aufgabe minimal notwendigen Berechtigungsumfang konfiguriert (Least Privilege), statt aus Bequemlichkeit breite, übermäßige Rechte zu vergeben. Alle vom Modell vorgeschlagenen Argumente durchlaufen dieselbe strukturelle und fachliche Validierung, die bei jeder anderen extern gesteuerten Eingabe angewendet würde (analog zur Argumentvalidierung bei Function Calling), bevor eine tatsächliche Ausführung erfolgt.

## Scalability, Reliability, Security und Observability

Sicheres AI-Werkzeug-Design skaliert Schutz über wachsende Anzahl integrierter Werkzeuge, wenn dieselben klassischen Sicherheitsprinzipien (Zielsystem-Validierung, Exfiltrationsgrenzen, Least Privilege) konsequent für jedes neue Werkzeug angewendet werden, statt für jedes Werkzeug individuelle, möglicherweise inkonsistente Sicherheitsansätze zu entwickeln. Reliability-Grenze: ein AI-Werkzeug ohne angemessene Sicherheitsvalidierung ist ein kritisches, oft unterschätztes Risiko, weil die Indirektionsebene des Modellvorschlags Angreifern erlaubt, Angriffe über manipulierte Eingaben statt direkter Systeminteraktion auszuführen, was klassische, direkte Sicherheitsmaßnahmen leicht übersehen können.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein AI-Werkzeug hat auf ein internes, eigentlich nicht erreichbares System zugegriffen | fehlende Zielsystem-Validierung, SSRF über eine vom Modell vorgeschlagene interne Adresse | prüfen, ob das Werkzeug vorgeschlagene Zieladressen gegen eine Allowlist oder interne Netzwerkbereiche validiert |
| sensible Daten wurden an einen unerwarteten externen Endpunkt gesendet | fehlende Exfiltrationsgrenzen, Werkzeug hat einer vom Modell vorgeschlagenen externen Zieladresse ungeprüft vertraut | Zielendpunkt-Begrenzung des betroffenen Werkzeugs auf tatsächliche Durchsetzung prüfen |
| ein kompromittiertes AI-Werkzeug konnte unerwartet weitreichenden Schaden anrichten | Werkzeug agierte mit übermäßigen, nicht auf die spezifische Aufgabe beschränkten Rechten | tatsächlich vergebene Berechtigungen des Werkzeugs gegen die minimal notwendigen Rechte für seine Aufgabe prüfen |
| ein Werkzeugaufruf mit unplausiblen Argumenten wurde trotzdem ausgeführt | fehlende oder unzureichende Argumentvalidierung vor Ausführung | Validierungslogik des betroffenen Werkzeugs auf tatsächliche Prüfung vorgeschlagener Argumente prüfen |

Security: AI-Werkzeug-Sicherheit sollte in dasselbe Sicherheitsreview-Verfahren wie jede andere Anwendungskomponente mit externem Zugriff einbezogen werden, nicht als separates, weniger streng geprüftes "AI-Feature" behandelt werden. Observability: blockierte Zielsystem-Zugriffsversuche, erkannte Exfiltrationsversuche und Häufigkeit von Argumentvalidierungsfehlschlägen sind zentrale Metriken für AI-Werkzeug-Sicherheitsgesundheit.

## Trade-offs und Entscheidungen

**Staff** validiert Zielsysteme und Argumente jedes AI-Werkzeugs konsequent gegen klassische Sicherheitsprinzipien. **Principal** macht Ausführungsrechte-Minimierung für jedes Werkzeug für das Team nachvollziehbar dokumentiert. **Chief** positioniert AI-Werkzeug-Sicherheit als Anwendung etablierter Sicherheitsprinzipien auf den spezifischen AI-Kontext, nicht als neuartiges, unbekanntes Risiko ohne bewährte Lösungsansätze.

Anti-Patterns: AI-Werkzeuge mit Netzwerkzugriff ohne Zielsystem-Validierung gegen SSRF betreiben; Datenübertragungen an beliebige, vom Modell vorgeschlagene externe Ziele ohne Begrenzung erlauben; AI-Werkzeuge mit übermäßigen, über die eigentliche Aufgabe hinausgehenden Rechten konfigurieren.

## Production Checklist

- [ ] Vom Modell vorgeschlagene Zieladressen werden gegen eine Allowlist oder interne Netzwerkbereiche validiert.
- [ ] Exfiltrationsgrenzen begrenzen mögliche Zielendpunkte für Datenübertragungen.
- [ ] Jedes AI-Werkzeug agiert mit minimal notwendigen Rechten für seine spezifische Aufgabe.
- [ ] Alle vorgeschlagenen Argumente werden strukturell und fachlich validiert.

## Interviewfragen

### 1. Was ist SSRF im Kontext von AI-Werkzeugen, und warum ist es dort eine spezifische Herausforderung?

**Antwort:** SSRF tritt auf, wenn ein Werkzeug eine vom Modell vorgeschlagene, nicht ausreichend validierte URL oder Netzwerkadresse aufruft und dadurch interne, eigentlich nicht erreichbare Systeme kontaktiert; im AI-Kontext ist die Zieladresse nicht direkt vom Nutzer, sondern vom Modell basierend auf einer möglicherweise manipulierten Eingabe vorgeschlagen, was eine zusätzliche Indirektionsebene darstellt.

### 2. Warum sind SSRF, Exfiltration und privilegierte Seiteneffekte keine neuartigen, AI-spezifischen Risiken?

**Antwort:** Es sind klassische Sicherheitsrisiken, die in jeder Anwendung mit extern gesteuerten Eingaben (URLs, Zielsystemen) auftreten können; im AI-Kontext erhalten sie eine zusätzliche, komplexere Angriffsfläche durch die Indirektionsebene des Modellvorschlags, sind aber grundsätzlich mit bewährten Sicherheitsprinzipien adressierbar.

### 3. Was bedeutet Least Privilege im Kontext von AI-Werkzeugen?

**Antwort:** Jedes AI-Werkzeug sollte nur mit den für seine spezifische Aufgabe minimal notwendigen Rechten agieren, statt aus Bequemlichkeit breite, übermäßige Berechtigungen zu erhalten — das begrenzt den potenziellen Schaden, falls das Werkzeug kompromittiert oder durch eine Injection manipuliert wird.

### 4. Wie diagnostizierst du, dass ein AI-Werkzeug auf ein internes System zugegriffen hat, das es nicht erreichen sollte?

**Antwort:** Ich prüfe, ob das Werkzeug vorgeschlagene Zieladressen gegen eine Allowlist erlaubter Domains oder gegen bekannte interne Netzwerkbereiche validiert — fehlende Zielsystem-Validierung ist die wahrscheinlichste Ursache für einen solchen unautorisierten internen Zugriff.

### 5. Warum ist Argumentvalidierung bei AI-Werkzeugen besonders wichtig, verglichen mit klassischer Nutzereingabevalidierung?

**Antwort:** Vom Modell vorgeschlagene Argumente können durch eine manipulierte Eingabe (Prompt Injection) beeinflusst sein, ohne dass ein Nutzer direkt eine schädliche Eingabe gemacht hat; die Validierung muss deshalb konsequent und unabhängig vom Modellvorschlag erfolgen, genau wie bei jeder anderen extern gesteuerten Eingabe.

### 6. Widersprüchliche Anforderung: Team will AI-Werkzeuge mit maximaler Flexibilität (beliebige URLs, beliebige externe Ziele) UND garantierten Schutz vor SSRF und Datenexfiltration — wie gehst du vor?

**Antwort:** Ich würde erklären, dass maximale Flexibilität ohne Einschränkung direkt dem Schutzziel widerspricht; ich würde eine explizite Allowlist erlaubter Ziele vorschlagen, die die tatsächlich benötigte Flexibilität für den Anwendungsfall abdeckt, statt beliebige, ungeprüfte Ziele zuzulassen — Flexibilität wird innerhalb definierter, sicherer Grenzen ermöglicht, nicht durch deren Aufhebung.

## Praktische Labs

~~~python
import ipaddress
from urllib.parse import urlparse

# Target validation against SSRF for a model-proposed URL
ALLOWED_DOMAINS = {"api.example.com", "data.example.com"}

def is_internal_address(hostname):
    try:
        ip = ipaddress.ip_address(hostname)
        return ip.is_private or ip.is_loopback
    except ValueError:
        return False  # not a raw IP, treat as domain name

def validate_target(url):
    parsed = urlparse(url)
    hostname = parsed.hostname
    if hostname is None:
        return False, "invalid URL"
    if is_internal_address(hostname):
        return False, f"BLOCKED: internal/private address '{hostname}' (SSRF risk)"
    if hostname not in ALLOWED_DOMAINS:
        return False, f"BLOCKED: '{hostname}' not in allowed domains"
    return True, "target validated"

test_urls = [
    "https://api.example.com/data",       # allowed
    "http://169.254.169.254/latest/meta-data/",  # SSRF - cloud metadata endpoint
    "http://192.168.1.1/admin",           # SSRF - internal network
    "https://attacker-controlled.com/exfil",  # not in allowlist
]

for url in test_urls:
    ok, message = validate_target(url)
    print(f"{url}: {'ALLOWED' if ok else 'BLOCKED'} - {message}")

ok, _ = validate_target("http://169.254.169.254/latest/meta-data/")
assert ok is False
print("\nThe model-proposed metadata endpoint URL was blocked BEFORE the tool made any actual network call.")
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [Server-Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html), abgerufen 2026-09-17.
2. OWASP: [LLM Top 10 — Excessive Agency](https://owasp.org/www-project-top-10-for-large-language-model-applications/), abgerufen 2026-09-17.
3. Anthropic: [Tool Use Security Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/tool-use), abgerufen 2026-09-17.

Function-Calling- und Prompt-Injection-Grundlagen sind kanonisch in [KB-0247](07-function-calling-und-werkzeugvertraege.md) und [KB-0260](20-prompt-injection-und-instruktionsgrenzen.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Sandboxed Tool-Execution-Umgebungen mit netzwerkseitig durchgesetzten Zielsystem-Beschränkungen | Established | Für Werkzeuge mit Netzwerkzugriff standardmäßig gegenüber ungeschützter direkter Ausführung bevorzugen. |
| Standardisierte Tool-Sicherheits-Schemata mit deklarativer Rechte- und Zielsystem-Definition | Adopting | Gegenüber individuell programmierter Sicherheitslogik für konsistente, auditierbare Konfiguration bevorzugen. |

Ein Team akzeptiert eine AI-Werkzeug-Integration erst, wenn Zielsystem-Validierung, Exfiltrationsgrenzen und Ausführungsrechte-Minimierung nachweisbar implementiert sind.
