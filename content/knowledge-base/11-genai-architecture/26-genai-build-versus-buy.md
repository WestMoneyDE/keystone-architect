---
{"id": "KB-0266", "title": "GenAI Build-versus-Buy", "domain": "11", "sequence": 26, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0265", "concepts": ["Modellauswahl"], "needed_for": "understanding"}, {"id": "KB-0256", "concepts": ["Lokale und verwaltete Inferenz"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Entscheidungsmodell implementieren, das Eigenentwicklung, API-Nutzung und fertige Produkte anhand Datenkontrolle und Lieferfähigkeit vergleicht.", "rationale": "Der Trade-off zwischen Kontrolle und Time-to-Market wird erst durch konkrete Kriterien-Abwägung über mehrere Optionen greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Build-versus-Buy-Entscheidung für einen konkreten GenAI-Anwendungsfall begründet gestalten, mit expliziter Lizenz-, IP- und Exit-Analyse.", "rationale": "Eine Build-versus-Buy-Entscheidung ohne Berücksichtigung von IP-Eigentum und Exit-Szenarien kann zu unerwarteten rechtlichen oder operativen Problemen führen."}, "STAFF-TARGET": {"active": true, "scope": "Ein unerwartetes IP-Problem nach Integration eines fertigen Produkts auf eine unzureichende ursprüngliche Lizenzprüfung statt auf ein allgemeines Vertragsproblem zurückführen können.", "rationale": "IP-Eigentumsfragen bei GenAI-Produkten (z. B. wem gehören mit dem Tool erzeugte Inhalte) sind spezifisch prüfbare Vertragsdetails, keine allgemeinen rechtlichen Unsicherheiten."}, "CHIEF-TARGET": {"active": true, "scope": "Build-versus-Buy als Entscheidung über Datenkontrolle, Lieferfähigkeit und Exit-Optionen positionieren, nicht als reinen Kosten- oder Zeitvergleich.", "rationale": "Datenkontrolle und Exit-Fähigkeit sind oft langfristig entscheidender als kurzfristige Kosten- oder Geschwindigkeitsvorteile."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Lizenzvertragsdetails einzelner Anbieter sind Vertiefung, die sich schnell ändern kann.", "rationale": "Kern ist das Entscheidungsframework über Datenkontrolle, Lieferfähigkeit und Exit, nicht die aktuellen Vertragsdetails einzelner Anbieter."}}, "lab_validation": [{"lab_id": "KB-0266-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Build-versus-Buy-Entscheidung anhand Datenkontrolle, Lieferfähigkeit und Exit-Optionen", "evidence": "Ein Entscheidungsmodell, das Eigenentwicklung, API-Nutzung und fertige Produkte anhand mehrerer Kriterien (Kontrolle, Lieferfähigkeit, Exit-Aufwand) bewertet, kann systematisch zwischen den Optionen unterscheiden, statt eine pauschale Präferenz anzunehmen.", "limitations": "Kein echtes produktives Bewertungssystem, keine reale Vertragsprüfung, keine Produktion."}]}
---
# GenAI Build-versus-Buy

> **Ziel:** Die Entscheidung zwischen Eigenentwicklung, direkter API-Nutzung (aufbauend auf Modellauswahl, siehe [KB-0265](25-modellauswahl-durch-aufgabenevidenz.md)) und fertigen GenAI-Produkten sollte anhand Datenkontrolle und Lieferfähigkeit abgewogen werden, nicht als reiner Kosten- oder Zeitvergleich — mit expliziter Erfassung von Lizenz-, IP- und Exit-Folgen, die oft langfristig entscheidender sind als kurzfristige Vorteile.

## Zweck, Mental Model und Dependencies

Eigenentwicklung (vollständig selbst gebaute AI-Funktionalität, oft unter Nutzung von APIs oder lokaler Inferenz, siehe [KB-0256](16-lokale-und-verwaltete-inferenz.md)) bietet maximale Kontrolle über Datenverarbeitung und Anpassungsfähigkeit, erfordert aber signifikante eigene Entwicklungs- und Betriebsressourcen. Direkte API-Nutzung (Aufbau eigener Anwendungslogik auf Basis externer Modell-APIs) bietet einen Mittelweg — weniger Kontrolle als vollständige Eigenentwicklung von Grund auf, aber schnellere Time-to-Market als der Aufbau eigener Modellinfrastruktur. Fertige GenAI-Produkte (vollständige, einsatzbereite Lösungen eines Drittanbieters) bieten die schnellste Lieferfähigkeit, aber die geringste Kontrolle über Datenverarbeitung, Anpassungsfähigkeit und langfristige Abhängigkeit vom Anbieter. Lizenzfolgen betreffen, unter welchen Bedingungen eine Lösung genutzt, angepasst oder in eigene Produkte integriert werden darf. IP-Folgen (Intellectual Property) betreffen, wem die mit dem Tool erzeugten Inhalte oder Ergebnisse rechtlich gehören — bei manchen fertigen GenAI-Produkten ist dies nicht selbstverständlich zugunsten des nutzenden Unternehmens geregelt. Exit-Folgen betreffen, wie aufwendig ein späterer Wechsel weg von der gewählten Option wäre (verwandt mit Providerabstraktions-Portabilitätsüberlegungen) — ein fertiges Produkt mit proprietären Datenformaten oder tiefer Integration kann einen Exit erheblich erschweren.

~~~text
Build (own development):  maximum data control + customization, HIGH resource requirement
API usage:                  moderate control, faster time-to-market than full build
Buy (finished product):    fastest delivery, LOWEST control + potential vendor lock-in
License terms:  under what conditions can it be used/modified/integrated?
IP terms:        who legally OWNS the outputs generated with the tool?
Exit terms:       how hard would it be to LEAVE this option later? (data formats, integration depth)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Datenkontrolle-Anforderung | erfordert der Anwendungsfall ein bestimmtes Maß an Kontrolle über Datenverarbeitung? | eine Buy-Entscheidung für Anwendungsfälle mit strengen Datenkontrollanforderungen kann Compliance-Probleme erzeugen |
| Lieferfähigkeits-Zeitrahmen | ist der tatsächliche Zeitrahmen für die Lieferfähigkeit realistisch gegen die gewählte Option geprüft? | eine Build-Entscheidung ohne realistische Zeitplanung kann zu erheblichen Verzögerungen führen |
| IP-Eigentumsklärung | ist explizit geklärt, wem die mit dem Tool erzeugten Inhalte rechtlich gehören? | ungeklärtes IP-Eigentum kann spätere rechtliche Konflikte oder Nutzungseinschränkungen erzeugen |
| Exit-Aufwand-Einschätzung | ist der Aufwand eines späteren Wechsels weg von der gewählten Option realistisch eingeschätzt? | unterschätzter Exit-Aufwand erzeugt faktischen Vendor-Lock-in trotz formal möglicher Kündigung |

Implementierung: Datenkontrollanforderungen werden vor der Build-versus-Buy-Entscheidung explizit geklärt (ähnlich der Datenhoheitsprüfung bei lokaler versus verwalteter Inferenz), da sie bestimmte Optionen (insbesondere Buy-Lösungen mit unklaren Datenverarbeitungsbedingungen) ausschließen können. Lieferfähigkeitszeitrahmen werden realistisch für jede Option geschätzt, inklusive tatsächlicher Entwicklungs- und Integrationszeit, nicht nur optimistischer Bestcase-Annahmen. IP-Eigentumsbedingungen werden vor Vertragsabschluss explizit geprüft und dokumentiert, insbesondere für Anwendungsfälle, bei denen die mit dem Tool erzeugten Inhalte einen geschäftlichen Wert darstellen. Exit-Aufwand wird für jede Option explizit eingeschätzt (Datenformat-Portabilität, Integrationstiefe, Vertragskündigungsbedingungen), bevor eine langfristige Verpflichtung eingegangen wird.

## Scalability, Reliability, Security und Observability

Build-versus-Buy-Entscheidungen skalieren organisatorische Ressourcennutzung unterschiedlich — Eigenentwicklung bindet mehr interne Entwicklungskapazität, während Buy-Lösungen diese Kapazität für andere Zwecke freihält, aber wiederkehrende Lizenzkosten und Abhängigkeit erzeugen. Reliability-Grenze: eine Buy-Entscheidung ohne geklärte Exit-Bedingungen ist ein latentes organisatorisches Risiko, das erst sichtbar wird, wenn ein tatsächlicher Wechsel notwendig wird (z. B. durch Preisänderung, Qualitätsverschlechterung oder Geschäftsaufgabe des Anbieters) und sich als deutlich aufwendiger herausstellt als ursprünglich angenommen.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein IP-Konflikt entsteht über die Eigentumsrechte an mit dem Tool erzeugten Inhalten | IP-Eigentumsbedingungen wurden vor Vertragsabschluss nicht ausreichend geprüft | ursprüngliche Lizenzvertragsprüfung auf explizite IP-Eigentumsklärung durchsuchen |
| ein geplanter Anbieterwechsel erweist sich als deutlich aufwendiger als erwartet | Exit-Aufwand wurde bei der ursprünglichen Build-versus-Buy-Entscheidung nicht realistisch eingeschätzt | ursprüngliche Entscheidungsdokumentation auf Exit-Aufwand-Einschätzung prüfen |
| ein Buy-Produkt erweist sich als unvereinbar mit Datenkontrollanforderungen | Datenkontrollanforderungen wurden vor der Entscheidung nicht ausreichend geklärt | Datenverarbeitungsbedingungen des gewählten Produkts gegen die tatsächlichen Compliance-Anforderungen prüfen |
| eine Eigenentwicklung dauert deutlich länger als ursprünglich geplant | Lieferfähigkeitszeitrahmen wurde bei der ursprünglichen Entscheidung zu optimistisch geschätzt | ursprüngliche Zeitschätzung gegen tatsächlichen Entwicklungsfortschritt vergleichen |

Security: bei Buy-Entscheidungen sollte die Sicherheitsarchitektur des Drittanbieterprodukts (Zugriffskontrolle, Datenverschlüsselung, Incident-Response-Prozesse) genauso geprüft werden wie bei einer Eigenentwicklung, da die Verantwortung für Datensicherheit auch bei externer Bereitstellung nicht vollständig entfällt. Observability: Zeitrahmen-Genauigkeit (geplant versus tatsächlich) pro Build-versus-Buy-Entscheidung, dokumentierte IP-/Lizenzklärungen und tatsächlicher Exit-Aufwand bei vergangenen Wechseln sind zentrale Metriken zur Verbesserung künftiger Entscheidungen.

## Trade-offs und Entscheidungen

**Staff** prüft Lieferfähigkeitszeitrahmen realistisch für jede Option, nicht nur optimistische Bestcase-Annahmen. **Principal** macht IP-Eigentumsbedingungen für das Team vor Vertragsabschluss explizit dokumentiert. **Chief** positioniert Build-versus-Buy als Entscheidung über Datenkontrolle, Lieferfähigkeit und Exit-Optionen, nicht als reinen Kosten- oder Zeitvergleich.

Anti-Patterns: Build-versus-Buy-Entscheidung ausschließlich nach kurzfristigen Kosten- oder Zeitvergleichen treffen, ohne Datenkontrolle und Exit-Aufwand zu berücksichtigen; IP-Eigentumsbedingungen erst nach Vertragsabschluss prüfen; Exit-Aufwand systematisch unterschätzen und dadurch faktischen Vendor-Lock-in eingehen.

## Production Checklist

- [ ] Datenkontrollanforderungen sind vor der Build-versus-Buy-Entscheidung explizit geklärt.
- [ ] Lieferfähigkeitszeitrahmen sind realistisch für jede Option geschätzt.
- [ ] IP-Eigentumsbedingungen sind vor Vertragsabschluss explizit geklärt und dokumentiert.
- [ ] Exit-Aufwand ist für jede Option realistisch eingeschätzt.

## Interviewfragen

### 1. Warum sollte Build-versus-Buy nicht als reiner Kosten- oder Zeitvergleich betrachtet werden?

**Antwort:** Datenkontrolle und Exit-Fähigkeit sind oft langfristig entscheidender als kurzfristige Kosten- oder Geschwindigkeitsvorteile — eine Buy-Entscheidung, die kurzfristig günstiger erscheint, kann langfristig durch fehlende Kontrolle oder erschwerten Exit teurer werden.

### 2. Warum ist die Klärung von IP-Eigentum bei GenAI-Produkten besonders wichtig?

**Antwort:** Bei manchen fertigen GenAI-Produkten ist nicht selbstverständlich geregelt, wem die mit dem Tool erzeugten Inhalte rechtlich gehören; ohne explizite Klärung vor Vertragsabschluss können spätere rechtliche Konflikte oder unerwartete Nutzungseinschränkungen entstehen.

### 3. Was bedeutet Exit-Aufwand im Kontext einer Build-versus-Buy-Entscheidung?

**Antwort:** Exit-Aufwand beschreibt, wie schwierig ein späterer Wechsel weg von der gewählten Option wäre, z. B. durch proprietäre Datenformate oder tiefe Integration — ein unterschätzter Exit-Aufwand erzeugt faktischen Vendor-Lock-in, auch wenn eine Kündigung formal möglich wäre.

### 4. Wie diagnostizierst du, dass eine geplante Anbieterwechsel-Entscheidung deutlich aufwendiger als erwartet ist?

**Antwort:** Ich prüfe die ursprüngliche Entscheidungsdokumentation auf eine tatsächliche Exit-Aufwand-Einschätzung — wenn diese fehlte oder zu optimistisch war, erklärt das die unerwartete Komplexität des tatsächlichen Wechsels.

### 5. Warum sollte Sicherheitsarchitektur eines Drittanbieterprodukts genauso geprüft werden wie bei Eigenentwicklung?

**Antwort:** Die Verantwortung für Datensicherheit entfällt nicht vollständig durch externe Bereitstellung; eine Buy-Entscheidung ohne Sicherheitsprüfung des Anbieters kann Sicherheitsrisiken einführen, die bei einer selbst kontrollierten Eigenentwicklung vermeidbar gewesen wären.

### 6. Widersprüchliche Anforderung: Team will schnellste mögliche Lieferfähigkeit (fertiges Produkt kaufen) UND vollständige Datenkontrolle sowie maximale Anpassungsfähigkeit — wie gehst du vor?

**Antwort:** Ich würde erklären, dass schnellste Lieferfähigkeit und vollständige Kontrolle strukturell im Konflikt stehen, da fertige Produkte per Definition weniger Anpassungsfähigkeit und Kontrolle bieten; ich würde vorschlagen, zu klären, welche der beiden Anforderungen für den konkreten Anwendungsfall tatsächlich kritischer ist, und gegebenenfalls einen Kompromiss über API-Nutzung zu prüfen, der einen Mittelweg zwischen beiden Zielen bietet.

## Praktische Labs

~~~python
# Build-versus-Buy decision model weighted by data control and delivery requirements
options = {
    "build": {"data_control": 10, "time_to_market_weeks": 20, "exit_effort": "low"},
    "api_usage": {"data_control": 6, "time_to_market_weeks": 8, "exit_effort": "medium"},
    "buy": {"data_control": 2, "time_to_market_weeks": 2, "exit_effort": "high"},
}

def evaluate_option(option, min_data_control, max_weeks_available):
    if option["data_control"] < min_data_control:
        return False, "insufficient data control for compliance requirements"
    if option["time_to_market_weeks"] > max_weeks_available:
        return False, "delivery timeline exceeds available time"
    return True, f"viable option (exit effort: {option['exit_effort']})"

# Scenario: strict data control required, moderate timeline available
for name, option in options.items():
    viable, reason = evaluate_option(option, min_data_control=5, max_weeks_available=12)
    print(f"{name}: {'VIABLE' if viable else 'REJECTED'} - {reason}")

viable_build, _ = evaluate_option(options["build"], min_data_control=5, max_weeks_available=12)
viable_buy, _ = evaluate_option(options["buy"], min_data_control=5, max_weeks_available=12)
assert viable_build is False  # too slow for this timeline
assert viable_buy is False    # insufficient data control
print("\nOnly 'api_usage' meets BOTH the data control requirement AND the timeline constraint in this scenario.")
~~~

## Dependencies, Cross-References und Quellen

1. Gartner: [Build vs Buy Framework for AI Solutions](https://www.gartner.com/en/topics/generative-ai), abgerufen 2026-09-17.
2. WIPO: [AI and Intellectual Property Policy](https://www.wipo.int/about-ip/en/artificial_intelligence/), abgerufen 2026-09-17.
3. OpenAI: [Terms of Use — Ownership of Outputs](https://openai.com/policies/terms-of-use), abgerufen 2026-09-17.

Modellauswahl- und Inferenzstrategie-Grundlagen sind kanonisch in [KB-0265](25-modellauswahl-durch-aufgabenevidenz.md) und [KB-0256](16-lokale-und-verwaltete-inferenz.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte AI-Lizenzvertrags-Frameworks mit klareren IP-Eigentumsklauseln | Adopting | Gegenüber individuell ausgehandelten, uneinheitlichen Verträgen für Rechtssicherheit bevorzugen. |
| Modulare, austauschbare GenAI-Architekturen zur Reduktion des Exit-Aufwands bei Buy-Entscheidungen | Adopting | Für Buy-Entscheidungen mit hohem Vendor-Lock-in-Risiko gegenüber tief integrierten Lösungen bevorzugen. |

Ein Team akzeptiert eine Build-versus-Buy-Entscheidung erst, wenn Datenkontrolle, Lieferfähigkeit, IP-Eigentum und Exit-Aufwand nachweisbar geprüft und dokumentiert sind.
