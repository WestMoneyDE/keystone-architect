---
{"id": "KB-0312", "title": "Metadatenfilter und Zugriffsschranken", "domain": "13", "sequence": 8, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0309", "concepts": ["Vektorspeicher für Retrieval-Pipelines"], "needed_for": "understanding"}, {"id": "KB-0311", "concepts": ["Hybrid Retrieval"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Eine Vorfilterung implementieren, die Zugriffsschranken vor der Ähnlichkeitsberechnung anwendet, und diese mit einer Nachfilterung vergleichen, die dieselben Schranken erst nach dem Retrieval anwendet.", "rationale": "Der Unterschied zwischen Vor- und Nachfilterung bei begrenzten Ergebnismengen wird erst durch konkreten Vergleich greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Retrieval-Architektur gestalten, die ACLs, Zeitstände und Mandantengrenzen konsistent durchsetzt, ohne dabei versteckte Ergebnisausfälle (weniger Ergebnisse als von der Anwendung erwartet) zu erzeugen.", "rationale": "Nachfilterung nach einem begrenzten Top-K-Retrieval kann dazu führen, dass zu wenige oder gar keine autorisierten Ergebnisse übrig bleiben, ohne dass dies für die Anwendung offensichtlich ist."}, "STAFF-TARGET": {"active": true, "scope": "Eine unerwartet leere oder unvollständige Suchergebnisliste auf eine Nachfilterung nach begrenztem Top-K-Retrieval statt auf ein allgemeines Datenproblem zurückführen können.", "rationale": "Wird eine Zugriffsschranke erst nach einem auf eine feste Anzahl begrenzten Retrieval angewendet, können alle zurückgegebenen Top-K-Kandidaten durch die Filterung entfernt werden, ohne dass ein Fehler sichtbar ist."}, "CHIEF-TARGET": {"active": true, "scope": "Zugriffsschrankendurchsetzung beim Retrieval als sicherheitskritischen, architektonisch bevorzugt vorgelagerten Schritt positionieren, nicht als nachträgliche Filterung.", "rationale": "Vorfilterung vermeidet sowohl versteckte Ergebnisausfälle als auch das Risiko, dass nicht autorisierte Inhalte überhaupt erst Teil der berechneten Kandidatenliste werden."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete ACL-Modellierungsdetails (RBAC, ABAC) sind Vertiefung.", "rationale": "Kern ist das Prinzip von Vor- versus Nachfilterung und versteckten Ergebnisausfällen, nicht das konkrete Berechtigungsmodell."}}, "lab_validation": [{"lab_id": "KB-0312-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell einer Retrieval-Pipeline mit Vor- und Nachfilterung, das versteckte Ergebnisausfälle bei Nachfilterung demonstriert", "evidence": "Ein Top-3-Retrieval, dessen Ergebnisse anschließend per ACL-Nachfilterung reduziert werden, kann bei ungünstiger Verteilung der Berechtigungen null autorisierte Ergebnisse übrig lassen, obwohl im Gesamtbestand tatsächlich autorisierte, relevante Dokumente existieren; eine Vorfilterung vor der Top-K-Begrenzung vermeidet dies.", "limitations": "Keine echte Vektordatenbank, kein produktives System, keine reale Zugriffsinfrastruktur."}]}
---
# Metadatenfilter und Zugriffsschranken

> **Ziel:** Zugriffsschranken (ACLs, Zeitstände, Mandantengrenzen) müssen beim Retrieval (aufbauend auf Vektorspeichern, siehe [KB-0309](05-vektorspeicher-fuer-retrieval-pipelines.md), und Hybrid Retrieval, siehe [KB-0311](07-hybrid-retrieval.md)) konsequent durchgesetzt werden. Der zentrale technische Unterschied ist Vorfilterung (Zugriffsschranken werden vor der Top-K-Begrenzung angewendet) versus Nachfilterung (Zugriffsschranken werden erst nach einem bereits auf eine feste Anzahl begrenzten Retrieval angewendet) — Nachfilterung kann zu versteckten Ergebnisausfällen führen, bei denen scheinbar keine relevanten Ergebnisse gefunden werden, obwohl im Gesamtbestand tatsächlich autorisierte, relevante Dokumente existieren.

## Zweck, Mental Model und Dependencies

ACLs (Access Control Lists) definieren, welche Nutzer oder Rollen Zugriff auf ein bestimmtes Dokument haben. Zeitstände definieren, ob ein Dokument zu einem bestimmten Zeitpunkt gültig oder bereits abgelaufen ist. Mandantengrenzen definieren, welchem Mandanten ein Dokument zugeordnet ist (siehe Mandantenisolation, [KB-0309](05-vektorspeicher-fuer-retrieval-pipelines.md)). Der zentrale, oft übersehene technische Fehler liegt in der Reihenfolge der Filteranwendung: Nachfilterung bedeutet, dass zunächst eine feste Anzahl (Top-K) der semantisch oder lexikalisch relevantesten Kandidaten ermittelt wird, und erst danach die Zugriffsschranken angewendet werden, um nicht autorisierte Ergebnisse zu entfernen. Das Problem dabei: wenn von den ursprünglichen Top-K-Kandidaten die meisten oder alle für den anfragenden Nutzer nicht autorisiert sind, bleiben nach der Nachfilterung nur wenige oder gar keine Ergebnisse übrig — obwohl im Gesamtbestand durchaus relevante, tatsächlich autorisierte Dokumente existieren, die einfach nicht unter die ursprünglichen Top-K fielen. Dieser "versteckte Ergebnisausfall" ist für die Anwendung nicht ohne Weiteres von einem echten Mangel an relevanten Dokumenten zu unterscheiden. Vorfilterung vermeidet dieses Problem, indem die Zugriffsschranken bereits vor oder während der Ähnlichkeitsberechnung angewendet werden, sodass nur unter den tatsächlich autorisierten Dokumenten die Top-K relevantesten ermittelt werden — dies erfordert typischerweise, dass der zugrunde liegende Vektorspeicher effiziente kombinierte Filterung unterstützt (siehe [KB-0309](05-vektorspeicher-fuer-retrieval-pipelines.md)).

~~~text
ACLs: which users/roles have access to a given document
Time validity: is the document currently valid or already expired
Tenant boundaries: which tenant owns a document (KB-0309)
POST-FILTERING: get top-K relevant candidates FIRST, THEN remove unauthorized ones
  -> PROBLEM: if most/all top-K happen to be unauthorized for this user, result set shrinks to near-empty
  -> HIDDEN RESULT LOSS: indistinguishable from "genuinely no relevant docs exist" without investigation
PRE-FILTERING: apply access boundaries BEFORE/DURING similarity computation
  -> top-K computed ONLY among authorized docs -> avoids hidden result loss
  -> requires vector store with efficient combined filtering support (KB-0309)
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Vorfilterung statt Nachfilterung | werden Zugriffsschranken vor oder während der Ähnlichkeitsberechnung angewendet, statt erst nach einer festen Top-K-Begrenzung? | Nachfilterung kann bei ungünstiger Verteilung zu versteckten, für die Anwendung nicht erklärbaren Ergebnisausfällen führen |
| Kombinierte Effizienz von Zugriffsfilterung und Ähnlichkeit | unterstützt der zugrunde liegende Vektorspeicher effiziente kombinierte Filterung von Zugriffsschranken und Vektorähnlichkeit? | ohne diese Fähigkeit kann Vorfilterung ineffizient oder gar nicht praktikabel sein |
| Konsistente Durchsetzung über alle Filterdimensionen | werden ACLs, Zeitstände und Mandantengrenzen konsistent und vollständig angewendet, nicht nur eine dieser Dimensionen? | eine unvollständige Filterung (z. B. nur Mandantengrenzen, aber nicht Zeitstände) kann veraltete oder nicht autorisierte Inhalte durchlassen |
| Diagnostizierbarkeit von Ergebnisausfällen | ist nachvollziehbar, ob eine leere oder kleine Ergebnisliste durch echten Relevanzmangel oder durch Filterung entstanden ist? | fehlende Diagnostizierbarkeit erschwert die Unterscheidung zwischen einem echten Wissenslücken-Fall (siehe KB-0305) und einem versteckten Filterungsartefakt |

Implementierung: Zugriffsschranken (ACLs, Zeitstände, Mandantengrenzen) werden, wo technisch möglich, als Vorfilter vor oder während der Ähnlichkeitsberechnung angewendet, sodass die Top-K-Begrenzung ausschließlich unter bereits autorisierten Kandidaten erfolgt. Dies setzt voraus, dass der Vektorspeicher effiziente kombinierte Filterung unterstützt (siehe [KB-0309](05-vektorspeicher-fuer-retrieval-pipelines.md)); ist dies technisch nicht möglich, wird zumindest eine ausreichend große initiale Kandidatenmenge vor der Top-K-Begrenzung gezogen, um das Risiko eines vollständigen Ergebnisausfalls durch Nachfilterung zu reduzieren. Alle relevanten Filterdimensionen (ACLs, Zeitstände, Mandantengrenzen) werden konsistent und vollständig angewendet, nicht nur eine Teilmenge. Bei einer leeren oder unerwartet kleinen Ergebnisliste wird protokolliert, ob dies durch tatsächlichen Relevanzmangel oder durch Filterung entstanden ist, um eine Unterscheidung von echten Wissenslücken (siehe [KB-0305](01-rag-pipelines-und-grounding.md)) zu ermöglichen.

## Scalability, Reliability, Security und Observability

Zugriffsschrankendurchsetzung beim Retrieval skaliert Sicherheit proportional zur Konsequenz der Vorfilterung; die Reliability-Grenze liegt in Nachfilterung nach begrenztem Top-K-Retrieval, die mit wachsender Mandanten- oder Berechtigungsgranularität proportional mehr versteckte Ergebnisausfälle erzeugen kann.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| eine Suchanfrage liefert unerwartet wenige oder keine Ergebnisse, obwohl relevante, autorisierte Dokumente existieren sollten | die Zugriffsschranken wurden nachträglich nach einer bereits begrenzten Top-K-Kandidatenliste angewendet | prüfen, ob die Filterung vor oder nach der Top-K-Begrenzung stattfand |
| ein Nutzer erhält ein veraltetes, eigentlich abgelaufenes Dokument als Suchergebnis | Zeitstände wurden nicht konsistent als Filterdimension angewendet | prüfen, ob die Zeitgültigkeitsprüfung als vollständige Filterdimension implementiert war |
| die Ursache einer leeren Ergebnisliste (echte Wissenslücke vs. Filterungsartefakt) ist unklar | fehlende Diagnoseinformation, ob die leere Liste durch Relevanzmangel oder durch Filterung entstand | prüfen, ob protokolliert wurde, wie viele Kandidaten vor und nach der Zugriffsfilterung vorhanden waren |

Security: Die zentrale Sicherheitsregel ist, Zugriffsschranken niemals ausschließlich als nachgelagerte Filterung zu implementieren, wenn Vorfilterung technisch möglich ist — Vorfilterung reduziert sowohl das Risiko versteckter Ergebnisausfälle als auch das Risiko, dass nicht autorisierte Inhalte überhaupt Teil der berechneten Kandidatenliste (und damit potenziell in Zwischenprotokollen oder Debug-Ausgaben) werden. Observability: Verhältnis von Vor- zu Nachfilterungsanteil in der Architektur, Häufigkeit stark reduzierter oder leerer Ergebnislisten nach Filterung und Vollständigkeit der Filterdimensionsabdeckung (ACL, Zeit, Mandant) sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** implementiert Zugriffsschranken bevorzugt als Vorfilterung vor der Top-K-Begrenzung. **Principal** macht die Diagnostizierbarkeit von Ergebnisausfällen (Relevanzmangel vs. Filterung) für das Team nachvollziehbar dokumentiert. **Chief** positioniert Zugriffsschrankendurchsetzung als sicherheitskritischen, architektonisch bevorzugt vorgelagerten Schritt.

Anti-Patterns: Zugriffsschranken ausschließlich als Nachfilterung nach einer bereits begrenzten Top-K-Kandidatenliste implementieren; nur eine Teilmenge der relevanten Filterdimensionen (z. B. nur Mandant, nicht Zeitstände) durchsetzen; eine leere Ergebnisliste ohne Diagnoseinformation als "keine relevanten Dokumente" interpretieren, ohne Filterungsartefakte auszuschließen.

## Production Checklist

- [ ] Zugriffsschranken werden bevorzugt als Vorfilterung vor der Top-K-Begrenzung angewendet.
- [ ] Alle relevanten Filterdimensionen (ACLs, Zeitstände, Mandantengrenzen) sind konsistent implementiert.
- [ ] Der Vektorspeicher unterstützt effiziente kombinierte Filterung, wo Vorfilterung eingesetzt wird.
- [ ] Ergebnisausfälle sind diagnostizierbar zwischen echtem Relevanzmangel und Filterungsartefakt.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Vor- und Nachfilterung beim Retrieval?

**Antwort:** Vorfilterung wendet Zugriffsschranken vor oder während der Ähnlichkeitsberechnung an, sodass die Top-K-Begrenzung nur unter autorisierten Kandidaten erfolgt; Nachfilterung berechnet zunächst Top-K unabhängig von Berechtigung und entfernt nicht autorisierte Ergebnisse erst danach.

### 2. Warum kann Nachfilterung zu einem versteckten Ergebnisausfall führen?

**Antwort:** Wenn die meisten oder alle ursprünglichen Top-K-Kandidaten für den anfragenden Nutzer nicht autorisiert sind, bleiben nach der Filterung nur wenige oder keine Ergebnisse übrig, obwohl im Gesamtbestand tatsächlich relevante, autorisierte Dokumente existieren könnten.

### 3. Warum ist die Diagnostizierbarkeit von Ergebnisausfällen wichtig?

**Antwort:** Ohne sie lässt sich nicht unterscheiden, ob eine leere Ergebnisliste durch eine echte Wissenslücke (siehe KB-0305) oder durch ein Filterungsartefakt nach Nachfilterung entstanden ist, was die Fehlerdiagnose erheblich erschwert.

### 4. Warum ist konsistente Anwendung aller Filterdimensionen (ACL, Zeit, Mandant) notwendig?

**Antwort:** Eine unvollständige Filterung (z. B. nur Mandantengrenzen ohne Zeitstände) kann veraltete oder anderweitig nicht autorisierte Inhalte durchlassen, selbst wenn eine der Dimensionen korrekt durchgesetzt wird.

### 5. Wie diagnostizierst du eine unerwartet leere Suchergebnisliste bei erwarteten relevanten Dokumenten?

**Antwort:** Ich prüfe, ob die Filterung vor oder nach der Top-K-Begrenzung stattfand und wie viele Kandidaten vor der Zugriffsfilterung vorhanden waren — eine Nachfilterung nach begrenztem Top-K ist die wahrscheinlichste Ursache für einen versteckten Ergebnisausfall.

### 6. Widersprüchliche Anforderung: Team will maximale Retrieval-Geschwindigkeit ohne den zusätzlichen Aufwand für Vorfilterung UND garantiert keine versteckten Ergebnisausfälle durch Nachfilterung — wie gehst du vor?

**Antwort:** Ich würde erklären, dass diese Ziele sich direkt widersprechen, wenn Nachfilterung beibehalten wird; ich würde vorschlagen, einen Vektorspeicher mit nativer, effizienter kombinierter Filterung einzusetzen, sodass Vorfilterung ohne signifikanten zusätzlichen Geschwindigkeitsverlust möglich wird, statt bei der Nachfilterung zu bleiben.

## Praktische Labs

~~~python
# Pre-filtering vs post-filtering demonstrating hidden result loss
documents = [
    {"id": "doc1", "similarity": 0.95, "tenant": "tenant_b"},
    {"id": "doc2", "similarity": 0.93, "tenant": "tenant_b"},
    {"id": "doc3", "similarity": 0.91, "tenant": "tenant_b"},
    {"id": "doc4", "similarity": 0.70, "tenant": "tenant_a"},  # lower similarity, but the ONLY authorized doc
]

def post_filter_retrieve(docs, requesting_tenant, top_k=3):
    top_k_docs = sorted(docs, key=lambda d: -d["similarity"])[:top_k]
    return [d for d in top_k_docs if d["tenant"] == requesting_tenant]

def pre_filter_retrieve(docs, requesting_tenant, top_k=3):
    authorized_only = [d for d in docs if d["tenant"] == requesting_tenant]
    return sorted(authorized_only, key=lambda d: -d["similarity"])[:top_k]

print("Post-filtering result (hidden result loss):")
print(f"  {post_filter_retrieve(documents, 'tenant_a')}")

print("Pre-filtering result (correctly finds the authorized document):")
print(f"  {pre_filter_retrieve(documents, 'tenant_a')}")
~~~

## Dependencies, Cross-References und Quellen

1. Pinecone: [Metadata Filtering in Vector Search](https://www.pinecone.io/learn/vector-search-filtering/), abgerufen 2026-09-17.
2. NIST: [SP 800-207 — Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final), abgerufen 2026-09-17.
3. OWASP: [OWASP Top 10 for LLM Applications — Sensitive Information Disclosure](https://genai.owasp.org/llmrisk/llm02-sensitive-information-disclosure/), abgerufen 2026-09-17.

Vektorspeicher für Retrieval-Pipelines sind kanonisch in [KB-0309](05-vektorspeicher-fuer-retrieval-pipelines.md) behandelt; Hybrid Retrieval in [KB-0311](07-hybrid-retrieval.md); RAG-Pipelines und Grounding in [KB-0305](01-rag-pipelines-und-grounding.md).

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Native Pre-Filter-Unterstützung in ANN-Indexalgorithmen (Filterung während der Graphtraversierung statt vor-/nachgelagert) | Adopting | Gegenüber reiner Post-Filter-Architektur für effiziente, versteckte-Ausfälle-vermeidende Filterung bevorzugen. |
| Automatisierte Diagnose-Dashboards, die Ergebnisausfälle nach Ursache (Relevanzmangel vs. Filterung) klassifizieren | Emerging | Beobachten; würde Fehlerdiagnose erleichtern, aber noch nicht breit etabliert. |

Ein Team akzeptiert eine Retrieval-Architektur mit Zugriffsschranken erst, wenn Vorfilterung (wo technisch möglich) und vollständige Filterdimensionsabdeckung dokumentiert und getestet sind.
