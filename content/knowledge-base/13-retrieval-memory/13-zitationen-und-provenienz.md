---
{"id": "KB-0317", "title": "Zitationen und Provenienz", "domain": "13", "sequence": 13, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0305", "concepts": ["RAG-Pipelines und Grounding"], "needed_for": "understanding"}, {"id": "KB-0316", "concepts": ["Kontextzusammenstellung"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Zitationsprüfung implementieren, die jede generierte Aussage einzeln gegen die zugrunde liegende Quellenstelle validiert, statt Zitate pauschal für die gesamte Antwort zu akzeptieren.", "rationale": "Der Wert granularer, aussagenbezogener Zitationsprüfung wird erst durch konkrete Implementierung greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Ein cite-or-decline-System gestalten, das eine Antwort ohne belastbare Quellenstelle für eine konkrete Aussage explizit verweigert, statt eine unbelegte Aussage stillschweigend zu generieren.", "rationale": "Cite-or-decline erfordert eine architektonische Entscheidung an jeder einzelnen Aussage, nicht nur eine pauschale Quellenangabe am Ende der gesamten Antwort."}, "STAFF-TARGET": {"active": true, "scope": "Eine falsche oder erfundene Zitation auf eine fehlende aussagenbezogene Validierung statt auf ein allgemeines Modellproblem zurückführen können.", "rationale": "Ein Sprachmodell kann eine plausibel klingende, aber tatsächlich falsche oder nicht existierende Quellenangabe generieren, wenn keine explizite Validierung jeder einzelnen Zitation stattfindet."}, "CHIEF-TARGET": {"active": true, "scope": "Cite-or-decline als überprüfbare Anforderung positionieren, die granular auf Ebene einzelner Aussagen durchgesetzt wird, nicht als pauschale Quellenliste am Ende einer Antwort.", "rationale": "Eine pauschale Quellenliste am Ende einer Antwort belegt nicht, dass jede einzelne darin enthaltene Aussage tatsächlich durch eine der Quellen gestützt wird."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Implementierungsdetails des Retrieval-Generation-Validation-Repair-Zyklus sind Vertiefung.", "rationale": "Kern ist das Prinzip aussagenbezogener Zitationsprüfung und Abstention bei fehlendem Beleg, nicht die konkrete Zyklusimplementierung."}}, "lab_validation": [{"lab_id": "KB-0317-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer aussagenbezogenen Zitationsprüfung mit cite-or-decline-Verhalten bei fehlendem Beleg", "evidence": "Eine generierte Aussage ohne belastbare Quellenstelle wird durch eine explizite Validierung erkannt und die Antwort entsprechend verweigert oder markiert, statt die Aussage unbelegt an den Nutzer weiterzugeben.", "limitations": "Kein echtes Sprachmodell, kein produktives System, keine reale Nutzerinteraktion."}]}
---
# Zitationen und Provenienz

> **Ziel:** Cite-or-decline ist eine überprüfbare Anforderung, die jede generierte Textaussage (aufbauend auf Grounding, siehe [KB-0305](01-rag-pipelines-und-grounding.md), und Kontextzusammenstellung, siehe [KB-0316](12-kontextzusammenstellung.md)) mit einer belastbaren Quellenstelle verbindet — kann für eine konkrete Aussage keine belastbare Quelle gefunden werden, wird die Aussage explizit verweigert (decline), statt sie unbelegt zu generieren. Der zentrale technische Punkt ist, dass diese Prüfung granular auf Ebene jeder einzelnen Aussage erfolgen muss, nicht nur als pauschale Quellenliste am Ende der gesamten Antwort.

## Zweck, Mental Model und Dependencies

Eine belastbare Quellenstelle ist ein konkreter, überprüfbarer Verweis auf einen tatsächlichen Abschnitt einer Quelle (z. B. ein bestimmter Absatz eines Dokuments), nicht nur ein allgemeiner Verweis auf das gesamte Dokument oder eine plausibel klingende, aber nicht überprüfte Behauptung einer Quelle. Der zentrale, oft übersehene architektonische Fehler ist, Zitationsprüfung nur auf Ebene der gesamten Antwort statt auf Ebene jeder einzelnen enthaltenen Aussage durchzuführen: eine Antwort kann eine pauschale Liste von drei Quellen am Ende enthalten, obwohl nur eine der mehreren enthaltenen Aussagen tatsächlich durch diese Quellen gestützt wird — die übrigen Aussagen könnten unbelegt oder sogar durch die Quellen widerlegt sein, ohne dass die pauschale Quellenliste dies erkennen lässt. Cite-or-decline fordert stattdessen, dass jede einzelne Aussage separat gegen ihre spezifische Quellenstelle geprüft wird: findet sich für eine bestimmte Aussage keine belastbare Quellenstelle, wird diese Aussage explizit verweigert (durch Umformulierung, Auslassung oder eine explizite Unsicherheitsmarkierung), statt sie unbelegt in die finale Antwort aufzunehmen. Ein Retrieval-Generation-Validation-Repair-Zyklus setzt dies um: nach der initialen Generierung wird jede Aussage gegen die abgerufenen Quellen validiert, und bei fehlendem Beleg wird die Antwort repariert (Repair), etwa durch erneute Generierung mit engerer Bindung an die Quellen oder durch explizite Kennzeichnung der unbelegten Aussage.

~~~text
Belastbare Quellenstelle (reliable source location): a CONCRETE, verifiable reference to an actual passage
  NOT just a general document reference, NOT an unverified plausible-sounding claim
CRITICAL ARCHITECTURE ERROR: citation checking only at WHOLE-RESPONSE level
  -> a response can list 3 sources at the end while only ONE of several claims is actually supported
  -> remaining claims could be unsupported or even CONTRADICTED, invisible behind the blanket source list
Cite-or-decline: EACH individual claim checked SEPARATELY against its specific source location
  -> no reliable source for a claim -> DECLINE that claim (rephrase, omit, or flag uncertainty)
Retrieval-Generation-Validation-Repair cycle: generate -> validate EACH claim -> repair unsupported ones
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Aussagenbezogene statt antwortweite Zitationsprüfung | wird jede einzelne Aussage separat gegen ihre spezifische Quellenstelle geprüft, statt nur eine pauschale Quellenliste am Ende bereitzustellen? | eine pauschale Quellenliste kann unbelegte oder sogar widerlegte Einzelaussagen hinter scheinbarer Gesamtbelegtheit verbergen |
| Explizite Verweigerung bei fehlendem Beleg | wird eine Aussage ohne belastbare Quellenstelle tatsächlich verweigert oder markiert, statt trotzdem generiert zu werden? | ohne explizite Verweigerung kann eine unbelegte, aber plausibel klingende Aussage unerkannt in die finale Antwort gelangen |
| Konkrete statt allgemeine Quellenstellenreferenz | verweist eine Zitation auf einen konkreten, überprüfbaren Abschnitt einer Quelle, nicht nur allgemein auf das gesamte Dokument? | eine zu allgemeine Referenz erschwert die tatsächliche Verifikation, ob die Aussage wirklich durch die Quelle gestützt wird |
| Validation-Repair-Zyklus statt einmaliger Generierung | wird die generierte Antwort nach der initialen Erstellung validiert und bei fehlendem Beleg repariert? | ohne diesen Zyklus bleibt eine initial fehlerhaft unbelegte Aussage in der finalen Antwort unkorrigiert bestehen |

Implementierung: Jede generierte Aussage wird nach der initialen Generierung einzeln gegen die tatsächlich abgerufenen Quellenstellen validiert, nicht nur als pauschale Antwortquelle betrachtet. Findet sich für eine spezifische Aussage keine belastbare, konkrete Quellenstelle, wird diese Aussage explizit repariert — durch Umformulierung mit expliziter Unsicherheitsmarkierung, durch Auslassung der unbelegten Aussage oder durch vollständige Verweigerung der Antwort, falls die unbelegte Aussage zentral für die Anfrage ist. Zitationen verweisen auf konkrete, überprüfbare Abschnitte der Quelle (z. B. einen spezifischen Absatz), nicht nur allgemein auf das gesamte Dokument. Dieser Retrieval-Generation-Validation-Repair-Zyklus wird als fester Bestandteil der Pipeline implementiert, nicht als optionale Nachprüfung.

## Scalability, Reliability, Security und Observability

Cite-or-decline skaliert die Vertrauenswürdigkeit generierter Antworten proportional zur Granularität der Zitationsprüfung; die Reliability-Grenze liegt in einer nur antwortweiten statt aussagenbezogenen Prüfung, die mit wachsender Antwortlänge proportional mehr unentdeckte, unbelegte Einzelaussagen hinter einer pauschalen Quellenliste verbergen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Antwort listet plausible Quellen, enthält aber Aussagen, die diese Quellen nicht tatsächlich stützen | die Zitationsprüfung erfolgte nur antwortweit, nicht aussagenbezogen | prüfen, ob jede einzelne Aussage separat gegen ihre spezifische Quellenstelle validiert wurde |
| eine generierte Zitation verweist auf eine Quelle, die die zitierte Aussage tatsächlich nicht enthält | fehlende Validierung der konkreten Zitationsstelle gegen den tatsächlichen Quelleninhalt | die referenzierte konkrete Quellenstelle direkt gegen den Inhalt der zitierten Aussage prüfen |
| eine unbelegte Aussage erscheint in der finalen Antwort, obwohl die Pipeline cite-or-decline implementiert | der Validation-Repair-Zyklus wurde nicht konsequent für jede Aussage durchlaufen | prüfen, ob die betroffene Aussage tatsächlich den Validierungsschritt durchlaufen hat, bevor sie in die finale Antwort aufgenommen wurde |

Security: Zitationsprüfung ist auch ein Schutz gegen Fehlinformation und Manipulation — eine Pipeline ohne aussagenbezogene Validierung könnte durch manipulierte oder fehlerhafte Quelleninhalte (siehe indirekte Injection, Domain 12) zu unbelegten, aber überzeugend formulierten Falschaussagen verleitet werden. Observability: Anteil aussagenbezogen validierter gegenüber unvalidierter generierter Aussagen, Häufigkeit ausgelöster Repair-Zyklen bei fehlendem Beleg und Häufigkeit erkannter falscher oder nicht überprüfbarer Zitationen sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Zitationsprüfung immer aussagenbezogen, nie nur als pauschale Quellenliste am Ende der Antwort. **Principal** macht den Validation-Repair-Zyklus für das Team nachvollziehbar dokumentiert. **Chief** positioniert cite-or-decline als überprüfbare, granulare Anforderung, die auf Ebene einzelner Aussagen durchgesetzt wird.

Anti-Patterns: Zitationsprüfung nur auf Ebene der gesamten Antwort statt jeder einzelnen Aussage durchführen; eine unbelegte Aussage trotz fehlender konkreter Quellenstelle generieren lassen; Zitationen mit allgemeinen Dokumentreferenzen statt konkreten, überprüfbaren Abschnittsverweisen versehen.

## Production Checklist

- [ ] Jede generierte Aussage wird einzeln gegen ihre spezifische Quellenstelle validiert.
- [ ] Aussagen ohne belastbare Quellenstelle werden explizit verweigert oder markiert.
- [ ] Zitationen verweisen auf konkrete, überprüfbare Abschnitte, nicht nur allgemeine Dokumentreferenzen.
- [ ] Ein Validation-Repair-Zyklus ist als fester Bestandteil der Pipeline implementiert.

## Interviewfragen

### 1. Was ist cite-or-decline, und warum muss die Prüfung aussagenbezogen erfolgen?

**Antwort:** Cite-or-decline erfordert, dass jede Aussage mit einer belastbaren Quellenstelle verbunden ist oder explizit verweigert wird; eine nur antwortweite Prüfung kann unbelegte Einzelaussagen hinter einer pauschalen Quellenliste verbergen, während eine aussagenbezogene Prüfung dies verhindert.

### 2. Was unterscheidet eine belastbare Quellenstelle von einer allgemeinen Dokumentreferenz?

**Antwort:** Eine belastbare Quellenstelle verweist auf einen konkreten, überprüfbaren Abschnitt einer Quelle; eine allgemeine Dokumentreferenz belegt nicht, dass die spezifische Aussage tatsächlich in diesem Abschnitt enthalten ist.

### 3. Was passiert im Retrieval-Generation-Validation-Repair-Zyklus?

**Antwort:** Nach der initialen Generierung wird jede Aussage gegen die abgerufenen Quellen validiert; bei fehlendem Beleg wird die Antwort repariert, etwa durch Umformulierung, Auslassung oder explizite Verweigerung der unbelegten Aussage.

### 4. Warum ist eine falsche Zitation ein spezifisches, erkennbares Risiko, nicht nur ein allgemeines Modellproblem?

**Antwort:** Ein Modell kann eine plausibel klingende, aber tatsächlich falsche oder nicht existierende Quellenangabe generieren; eine explizite Validierung jeder Zitation gegen den tatsächlichen Quelleninhalt erkennt diesen spezifischen Fehlertyp.

### 5. Wie diagnostizierst du eine Antwort mit plausiblen, aber nicht tatsächlich zutreffenden Quellenangaben?

**Antwort:** Ich prüfe, ob jede einzelne Aussage der Antwort separat gegen ihre spezifische Quellenstelle validiert wurde, statt nur eine pauschale Quellenliste zu prüfen — fehlt die aussagenbezogene Validierung, ist dies die wahrscheinlichste Ursache.

### 6. Widersprüchliche Anforderung: Team will schnelle, flüssige Antwortgenerierung ohne den zusätzlichen Aufwand für aussagenbezogene Zitationsprüfung UND garantiert cite-or-decline-Konformität für jede Aussage — wie gehst du vor?

**Antwort:** Ich würde erklären, dass cite-or-decline-Konformität ohne aussagenbezogene Prüfung nicht erreichbar ist; ich würde vorschlagen, die Validierung effizient zu gestalten (z. B. durch parallele Prüfung mehrerer Aussagen oder durch ein spezialisiertes, schnelles Validierungsmodell), statt die Prüfung selbst auszulassen.

## Praktische Labs

~~~python
# Claim-level citation validation with cite-or-decline behavior
sources = {
    "src1": "Standard tier pricing is $10 per month, billed annually.",
    "src2": "Enterprise tier includes custom SLAs and dedicated support.",
}

def validate_claim(claim_text, cited_source_id, sources):
    source_content = sources.get(cited_source_id, "")
    key_terms = [t for t in claim_text.lower().split() if len(t) > 3]
    matched_terms = sum(1 for t in key_terms if t in source_content.lower())
    return matched_terms / len(key_terms) if key_terms else 0

def generate_with_cite_or_decline(claim_text, cited_source_id, sources, min_support=0.5):
    support_score = validate_claim(claim_text, cited_source_id, sources)
    if support_score < min_support:
        return f"[DECLINED — insufficient support (score={support_score:.2f})]: '{claim_text}' not adopted"
    return f"[CITED: {cited_source_id}] {claim_text}"

well_supported_claim = "Standard tier costs $10 per month."
print(generate_with_cite_or_decline(well_supported_claim, "src1", sources))

fabricated_claim = "Standard tier includes unlimited free consulting hours."
print(generate_with_cite_or_decline(fabricated_claim, "src1", sources))
~~~

## Dependencies, Cross-References und Quellen

1. OWASP: [OWASP Top 10 for LLM Applications — Misinformation](https://genai.owasp.org/llmrisk/llm09-misinformation/), abgerufen 2026-09-17.
2. Gao et al.: [RARR — Researching and Revising What Language Models Say, Using Language Models](https://arxiv.org/abs/2210.08726), abgerufen 2026-09-17.
3. Anthropic: [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval), abgerufen 2026-09-17.

RAG-Pipelines und Grounding sind kanonisch in [KB-0305](01-rag-pipelines-und-grounding.md) behandelt; Kontextzusammenstellung in [KB-0316](12-kontextzusammenstellung.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Automatisierte, aussagenbezogene Attribution-Modelle, die jede generierte Aussage einer spezifischen Quellenstelle zuordnen (statt nachträglicher heuristischer Prüfung) | Adopting | Gegenüber nachträglicher Heuristik-basierter Zitationsprüfung für präzisere, native Attribution bevorzugen. |
| Kontinuierliche Validation-Repair-Pipelines mit automatischer Eskalation bei wiederholt unbelegten Aussagetypen | Emerging | Beobachten; würde systematische Schwächen der zugrunde liegenden Wissensquellen sichtbar machen, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine cite-or-decline-Architektur erst, wenn aussagenbezogene Validierung, konkrete Quellenstellenreferenzen und ein Validation-Repair-Zyklus dokumentiert und getestet sind.
