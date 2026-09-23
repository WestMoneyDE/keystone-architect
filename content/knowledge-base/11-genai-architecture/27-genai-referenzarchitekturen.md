---
{"id": "KB-0267", "title": "GenAI-Referenzarchitekturen", "domain": "11", "sequence": 27, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0257", "concepts": ["GenAI in Unternehmensprozessen"], "needed_for": "understanding"}, {"id": "KB-0253", "concepts": ["Fallback und Abstention"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Modell implementieren, das Datenpfad, Vertrauensgrenzen und Kontrollpunkte für drei unterschiedliche Referenzmuster (Chat, Extraktion, Aktion) vergleicht.", "rationale": "Der Unterschied zwischen den Referenzmustern wird erst durch konkreten Vergleich ihrer jeweiligen Datenpfade und Kontrollpunkte greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein passendes Referenzmuster für einen konkreten GenAI-Anwendungsfall begründet auswählen, statt eine universelle Blaupause unreflektiert zu übernehmen.", "rationale": "Chat-, Extraktions- und Aktionslösungen haben strukturell unterschiedliche Vertrauens- und Kontrollanforderungen, die eine bewusste Musterauswahl erfordern."}, "STAFF-TARGET": {"active": true, "scope": "Ein unpassendes Sicherheits- oder Kontrolldesign auf die Anwendung eines falschen Referenzmusters statt auf ein grundsätzliches Implementierungsproblem zurückführen können.", "rationale": "Ein Aktionsmuster-Anwendungsfall, der mit Chat-Muster-Kontrollen behandelt wird, kann strukturell unzureichende Autorisierung erhalten."}, "CHIEF-TARGET": {"active": true, "scope": "GenAI-Referenzarchitekturen als musterspezifische Blaupausen mit unterschiedlichen Vertrauens-/Kontrollanforderungen positionieren, nicht als universelle, austauschbare Lösung.", "rationale": "Die Wahl des richtigen Referenzmusters ist eine bewusste Architekturentscheidung, keine triviale Implementierungsdetail-Frage."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Produktspezifische Referenzarchitektur-Implementierungen einzelner Anbieter sind Vertiefung.", "rationale": "Kern ist das Prinzip unterschiedlicher Vertrauens-/Kontrollanforderungen je Muster, nicht die Implementierung einzelner Anbieter-Blaupausen."}}, "lab_validation": [{"lab_id": "KB-0267-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell für Vergleich von Datenpfaden und Kontrollpunkten über drei GenAI-Referenzmuster", "evidence": "Ein Chat-Muster benötigt primär Ausgabeprüfung, ein Extraktionsmuster benötigt primär strukturelle Validierung der extrahierten Daten, und ein Aktionsmuster benötigt primär unabhängige Autorisierung vor Ausführung — jedes Muster hat einen anderen kritischen Kontrollpunkt.", "limitations": "Kein echtes produktives System, keine reale Anwendungsintegration, keine Produktion."}]}
---
# GenAI-Referenzarchitekturen

> **Ziel:** Chat-, Extraktions- und Aktionslösungen sind strukturell unterschiedliche GenAI-Referenzmuster mit unterschiedlichen Datenpfaden, Vertrauensanforderungen und kritischen Kontrollpunkten — keine universelle Blaupause deckt alle drei gleichermaßen gut ab. Die Wahl und Anpassung des richtigen Musters für einen konkreten Anwendungsfall ist eine bewusste Architekturentscheidung.

## Zweck, Mental Model und Dependencies

Ein Chat-Muster ist die direkteste Interaktionsform — Nutzereingabe, Modellverarbeitung, Textantwort — bei dem der kritische Kontrollpunkt primär die Ausgabeprüfung ist (siehe Fallback-/Abstentions-Prinzipien, [KB-0253](13-fallback-und-degradierte-ai-antworten.md)): die Antwort selbst muss auf Angemessenheit und Korrektheit geprüft werden, da sie direkt an den Nutzer geht und typischerweise keine automatisierten Seiteneffekte auslöst. Ein Extraktionsmuster nimmt unstrukturierte Eingabe (z. B. ein Dokument) und produziert strukturierte Ausgabe (z. B. JSON-Felder) — der kritische Kontrollpunkt ist hier primär strukturelle und semantische Validierung der extrahierten Daten (verwandt mit strukturierten Modellausgaben), da die extrahierten Werte oft direkt in nachgelagerte automatisierte Systeme fließen, ohne dass ein Mensch jeden einzelnen extrahierten Wert prüft. Ein Aktionsmuster nutzt Modellvorschläge, um tatsächliche Geschäftsaktionen auszulösen (verwandt mit Function Calling und Prozessintegration, siehe [KB-0257](17-genai-in-unternehmensprozessen.md)) — der kritische Kontrollpunkt ist hier primär unabhängige Autorisierung vor Ausführung, da hier reale Seiteneffekte entstehen, die bei einem Fehler potenziell schwerwiegende Konsequenzen haben können. Der zentrale Denkfehler ist, ein einzelnes, für ein Muster entwickeltes Kontrolldesign unreflektiert auf ein anderes Muster zu übertragen — ein Aktionsmuster-Anwendungsfall, der nur mit den für ein Chat-Muster angemessenen Kontrollen (reine Ausgabeprüfung) behandelt wird, hat strukturell unzureichende Autorisierung.

~~~text
Chat pattern:        user input -> model -> TEXT response -> critical control: OUTPUT REVIEW (see KB-0253)
Extraction pattern:   unstructured input -> model -> STRUCTURED data -> critical control: VALIDATION of extracted values
Action pattern:       input -> model proposes -> ACTUAL business action -> critical control: INDEPENDENT AUTHORIZATION (see KB-0257)
Applying Chat-pattern controls to an Action-pattern use case = structurally insufficient authorization
No universal blueprint - the pattern determines which control point is critical
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Musteridentifikation | ist klar erkannt, welches Referenzmuster (Chat, Extraktion, Aktion) für den Anwendungsfall zutrifft? | unklares oder falsch identifiziertes Muster führt zu unpassendem, unzureichendem Kontrolldesign |
| Musterspezifischer Kontrollpunkt | ist der für das jeweilige Muster kritische Kontrollpunkt tatsächlich implementiert? | ein Aktionsmuster ohne Autorisierungsschicht oder ein Extraktionsmuster ohne Validierung übernimmt Kontrollen des falschen Musters |
| Datenpfad-Bewusstsein | ist bekannt, wohin die Modellausgabe tatsächlich fließt (Nutzer, strukturiertes System, Aktion)? | fehlendes Bewusstsein über den Datenpfad führt zu unangemessener Kontrolltiefe für das tatsächliche Risiko |
| Musterkombination | ist bei hybriden Anwendungsfällen (z. B. Chat, der auch Aktionen auslöst) jeder Teilpfad mit dem jeweils passenden Muster behandelt? | eine Vermischung ohne klare Trennung kann dazu führen, dass der Aktionsteil fälschlich nur Chat-Muster-Kontrollen erhält |

Implementierung: für jeden GenAI-Anwendungsfall wird explizit identifiziert, welches Referenzmuster (oder welche Kombination) tatsächlich zutrifft, bevor ein Kontrolldesign entworfen wird. Für Chat-Muster wird der Fokus auf Ausgabeprüfung und Abstentions-Design gelegt (siehe [KB-0253](13-fallback-und-degradierte-ai-antworten.md)). Für Extraktionsmuster wird der Fokus auf strukturelle und semantische Validierung der extrahierten Werte gelegt, bevor diese in nachgelagerte Systeme fließen. Für Aktionsmuster wird der Fokus auf unabhängige Autorisierung vor tatsächlicher Ausführung gelegt (siehe [KB-0257](17-genai-in-unternehmensprozessen.md)). Bei hybriden Anwendungsfällen, die mehrere Muster kombinieren (z. B. ein Chat-Interface, das auch Aktionen auslösen kann), wird jeder Teilpfad separat mit dem für ihn jeweils passenden Kontrolldesign behandelt, statt ein einheitliches, für den gesamten hybriden Fall unzureichendes Kontrollmodell zu verwenden.

## Scalability, Reliability, Security und Observability

Musterbasierte Referenzarchitekturen skalieren Wiederverwendbarkeit über wachsende Anzahl von GenAI-Anwendungsfällen, weil ein bereits erprobtes, musterspezifisches Kontrolldesign für neue Anwendungsfälle desselben Musters wiederverwendet werden kann, statt jedes Mal von Grund auf neu entworfen zu werden. Reliability-Grenze: die falsche Anwendung eines Musters (z. B. Chat-Muster-Kontrollen für einen tatsächlichen Aktionsanwendungsfall) ist ein besonders gefährliches, oft unbemerktes Risiko, weil das System oberflächlich funktioniert, aber strukturell unzureichende Sicherheitskontrollen für die tatsächlichen Konsequenzen bietet.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Aktion wird ohne angemessene Autorisierungsprüfung ausgeführt | Anwendungsfall folgt tatsächlich einem Aktionsmuster, wurde aber mit Chat-Muster-Kontrollen (nur Ausgabeprüfung) behandelt | prüfen, welches Referenzmuster tatsächlich zutrifft, gegen das tatsächlich implementierte Kontrolldesign |
| extrahierte Daten mit fachlichen Fehlern fließen ungeprüft in nachgelagerte Systeme | Anwendungsfall folgt einem Extraktionsmuster, aber es fehlt strukturelle/semantische Validierung | Validierungsschicht des Extraktionspfads auf tatsächliche Prüfung extrahierter Werte prüfen |
| ein hybrider Anwendungsfall (Chat mit Aktionsfähigkeit) hat den Aktionsteil unzureichend abgesichert | der Aktionsteil des hybriden Falls wurde nicht separat mit Aktionsmuster-Kontrollen behandelt | prüfen, ob jeder Teilpfad eines hybriden Anwendungsfalls sein eigenes, musterspezifisches Kontrolldesign hat |
| ein Team versucht, ein einzelnes, universelles Kontrolldesign für alle GenAI-Anwendungsfälle zu etablieren | fehlende Musterdifferenzierung, Annahme einer universellen Blaupause | prüfen, ob unterschiedliche Anwendungsfälle tatsächlich unterschiedliche Referenzmuster darstellen |

Security: die Musteridentifikation sollte Teil des Sicherheitsreviews für jeden neuen GenAI-Anwendungsfall sein, da eine falsche Musterzuordnung strukturell zu unzureichenden Sicherheitskontrollen führen kann, ohne dass dies bei oberflächlicher Betrachtung offensichtlich wäre. Observability: Verteilung der Anwendungsfälle nach Referenzmuster, Vollständigkeit der musterspezifischen Kontrollen pro Anwendungsfall und Häufigkeit hybrider, musterübergreifender Fälle sind zentrale Metriken für architektonische Konsistenz.

## Trade-offs und Entscheidungen

**Staff** identifiziert das zutreffende Referenzmuster explizit, bevor ein Kontrolldesign entworfen wird. **Principal** macht musterspezifische kritische Kontrollpunkte für das Team nachvollziehbar dokumentiert. **Chief** positioniert GenAI-Referenzarchitekturen als musterspezifische Blaupausen mit unterschiedlichen Vertrauensanforderungen, nicht als universelle, austauschbare Lösung.

Anti-Patterns: ein einzelnes, universelles Kontrolldesign für alle GenAI-Anwendungsfälle unabhängig vom tatsächlichen Muster anwenden; ein Aktionsmuster mit reinen Chat-Muster-Kontrollen (nur Ausgabeprüfung, keine Autorisierung) behandeln; bei hybriden Anwendungsfällen keine musterspezifische Trennung der Teilpfade vornehmen.

## Production Checklist

- [ ] Das zutreffende Referenzmuster (Chat, Extraktion, Aktion) ist für jeden Anwendungsfall explizit identifiziert.
- [ ] Der musterspezifische kritische Kontrollpunkt ist tatsächlich implementiert.
- [ ] Der Datenpfad der Modellausgabe (Nutzer, System, Aktion) ist bekannt und dokumentiert.
- [ ] Hybride Anwendungsfälle behandeln jeden Teilpfad mit dem jeweils passenden Muster.

## Interviewfragen

### 1. Was sind die drei grundlegenden GenAI-Referenzmuster, und was ist ihr jeweils kritischer Kontrollpunkt?

**Antwort:** Chat-Muster (kritischer Kontrollpunkt: Ausgabeprüfung), Extraktionsmuster (kritischer Kontrollpunkt: strukturelle/semantische Validierung extrahierter Daten), und Aktionsmuster (kritischer Kontrollpunkt: unabhängige Autorisierung vor Ausführung) — jedes Muster hat einen anderen primären Risikopunkt.

### 2. Warum ist es riskant, ein einzelnes Kontrolldesign universell auf alle GenAI-Anwendungsfälle anzuwenden?

**Antwort:** Unterschiedliche Muster haben unterschiedliche kritische Kontrollpunkte; ein für ein Chat-Muster entwickeltes Kontrolldesign (primär Ausgabeprüfung) bietet für ein Aktionsmuster strukturell unzureichende Autorisierung, auch wenn es oberflächlich funktioniert.

### 3. Warum unterscheidet sich der kritische Kontrollpunkt zwischen Extraktions- und Aktionsmustern?

**Antwort:** Bei Extraktionsmustern fließen strukturierte Daten oft ungeprüft in nachgelagerte Systeme, weshalb Validierung kritisch ist; bei Aktionsmustern entstehen reale Seiteneffekte, weshalb unabhängige Autorisierung vor Ausführung kritisch ist — beide Risiken sind unterschiedlicher Natur.

### 4. Wie diagnostizierst du, dass eine Aktion ohne angemessene Autorisierung ausgeführt wurde?

**Antwort:** Ich prüfe, welches Referenzmuster für den Anwendungsfall tatsächlich zutrifft, gegen das tatsächlich implementierte Kontrolldesign — häufig stellt sich heraus, dass ein Aktionsmuster-Anwendungsfall fälschlich nur mit Chat-Muster-Kontrollen (reine Ausgabeprüfung ohne Autorisierung) behandelt wurde.

### 5. Warum sind hybride Anwendungsfälle (z. B. Chat mit Aktionsfähigkeit) besonders anspruchsvoll zu gestalten?

**Antwort:** Ein hybrider Fall kombiniert mehrere Muster in einer Anwendung; jeder Teilpfad (der reine Chat-Teil und der Aktionsteil) benötigt sein jeweils eigenes, musterspezifisches Kontrolldesign, statt ein einheitliches Kontrollmodell für den gesamten hybriden Fall zu verwenden, das für einen der Teile unzureichend wäre.

### 6. Widersprüchliche Anforderung: Team will eine einzige, konsistente Architektur-Blaupause für alle GenAI-Anwendungsfälle im Unternehmen UND angemessene, musterspezifische Sicherheitskontrollen für jeden einzelnen Anwendungsfall — wie gehst du vor?

**Antwort:** Ich würde erklären, dass eine einzige universelle Blaupause und angemessene musterspezifische Kontrollen im Konflikt stehen, da unterschiedliche Muster unterschiedliche kritische Kontrollpunkte benötigen; ich würde vorschlagen, eine konsistente Meta-Architektur zu etablieren, die für jedes der drei Referenzmuster ein eigenes, aber standardisiertes Kontrolldesign definiert, statt ein einzelnes Kontrollmodell für alle Muster zu erzwingen — Konsistenz auf der Meta-Ebene, Differenzierung auf der Muster-Ebene.

## Praktische Labs

~~~python
# Pattern-specific control point comparison
patterns = {
    "chat": {"data_destination": "user", "critical_control": "output_review"},
    "extraction": {"data_destination": "downstream_system", "critical_control": "structural_semantic_validation"},
    "action": {"data_destination": "business_action", "critical_control": "independent_authorization"},
}

def check_control_adequacy(use_case_pattern, implemented_controls):
    required_control = patterns[use_case_pattern]["critical_control"]
    if required_control not in implemented_controls:
        return False, f"MISSING critical control '{required_control}' for pattern '{use_case_pattern}'"
    return True, "adequate controls for this pattern"

# Scenario: an ACTION pattern use case, but only CHAT pattern controls were implemented
use_case = "action"
implemented = {"output_review"}  # only chat-pattern control applied

ok, message = check_control_adequacy(use_case, implemented)
print(f"Use case pattern: {use_case}, implemented controls: {implemented}")
print(f"Adequacy check: {message}")
assert ok is False
print("\nApplying chat-pattern controls to an action-pattern use case leaves it structurally under-protected.")
~~~

## Dependencies, Cross-References und Quellen

1. Microsoft: [Azure OpenAI Reference Architectures](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/), abgerufen 2026-09-17.
2. AWS: [Generative AI Application Patterns](https://aws.amazon.com/blogs/machine-learning/), abgerufen 2026-09-17.
3. Anthropic: [Building Effective AI Agents — Workflow Patterns](https://www.anthropic.com/engineering/building-effective-agents), abgerufen 2026-09-17.

Prozessintegrations- und Fallback-Grundlagen sind kanonisch in [KB-0257](17-genai-in-unternehmensprozessen.md) und [KB-0253](13-fallback-und-degradierte-ai-antworten.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Standardisierte, anbieterseitige Referenzarchitektur-Vorlagen für gängige Muster (Chat, RAG, Agenten) | Adopting | Als Ausgangspunkt gegenüber vollständig eigenständiger Architekturentwicklung nutzen, mit Anpassung an eigene Kontrollanforderungen. |
| Musterklassifikations-Werkzeuge zur automatisierten Erkennung, welches Referenzmuster ein neuer Anwendungsfall darstellt | Adopting | Als Unterstützung für Architekturreviews gegenüber rein manueller Klassifikation evaluieren. |

Ein Team akzeptiert eine GenAI-Architektur erst, wenn das zutreffende Referenzmuster identifiziert und der jeweils kritische Kontrollpunkt nachweisbar implementiert ist.
