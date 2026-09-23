---
{"id": "KB-0306", "title": "Chunking und Dokumentstrukturen", "domain": "13", "sequence": 2, "document_type": "technical", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-17", "technical_reviewed_at": null, "research_cutoff": "2026-09-17", "primary_roles": ["GENAI"], "requires": [{"id": "KB-0305", "concepts": ["RAG-Pipelines und Grounding"], "needed_for": "understanding"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Verschiedene Chunking-Strategien (Struktur-, Satz-, Token-basiert) implementieren und deren Auswirkung auf Retrievalpräzision anhand desselben Dokuments vergleichen.", "rationale": "Die Unterschiede zwischen Chunking-Strategien werden erst durch konkreten Vergleich anhand desselben Dokuments greifbar."}, "ARCHITEKT-TARGET": {"active": true, "scope": "Eine Chunking-Strategie für einen konkreten Dokumenttyp (z. B. Dokumente mit Tabellen oder hierarchischen Überschriften) begründet auswählen, statt eine generische Strategie unabhängig vom Inhalt anzuwenden.", "rationale": "Unterschiedliche Dokumentstrukturen (Fließtext, Tabellen, hierarchische Überschriften) profitieren von unterschiedlichen Chunking-Ansätzen."}, "STAFF-TARGET": {"active": true, "scope": "Eine schlechte Retrievalpräzision auf eine ungeeignete Chunking-Strategie statt auf ein allgemeines Embedding- oder Modellproblem zurückführen können.", "rationale": "Eine Chunk-Grenze, die eine relevante Information mitten durchtrennt oder eine Tabelle unstrukturiert zerlegt, kann Retrieval-Ergebnisse unabhängig von der Qualität des Embedding-Modells beeinträchtigen."}, "CHIEF-TARGET": {"active": true, "scope": "Chunking-Strategie als bewusste Architekturentscheidung mit direktem Einfluss auf Retrievalpräzision und Kontextverbrauch positionieren, nicht als nachrangiges Implementierungsdetail.", "rationale": "Eine suboptimale Chunking-Strategie kann die Qualität einer gesamten RAG-Pipeline (siehe KB-0305) unabhängig von der Qualität nachgelagerter Komponenten begrenzen."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Konkrete Chunking-Bibliotheks-Implementierungsdetails sind Vertiefung.", "rationale": "Kern ist das Prinzip der Abwägung zwischen Chunk-Typ, Struktur und Überlappung, nicht die konkrete Bibliothek."}}, "lab_validation": [{"lab_id": "KB-0306-LAB-01", "status": "reviewed_only", "checked_at": "2026-09-17", "environment": "Lokales Python-Modell verschiedener Chunking-Strategien mit Vergleich der Retrievalpräzision anhand eines strukturierten Testdokuments", "evidence": "Ein reines Token-Chunking, das eine Tabelle mitten durchtrennt, liefert bei einer tabellenbezogenen Anfrage unvollständige Retrieval-Ergebnisse; ein struktur-bewusstes Chunking, das die Tabelle als zusammenhängende Einheit behandelt, liefert vollständige Ergebnisse.", "limitations": "Kein echtes Embedding-Modell, kein produktives Retrieval-System, keine reale Dokumentenvielfalt getestet."}]}
---
# Chunking und Dokumentstrukturen

> **Ziel:** Struktur-Chunks (entlang natürlicher Dokumentgrenzen wie Abschnitte), Satz-Chunks (entlang sprachlicher Grenzen) und Token-Chunks (entlang fester Tokenanzahl) haben unterschiedliche Auswirkungen auf Retrievalpräzision und Kontextverbrauch in einer RAG-Pipeline (siehe [KB-0305](01-rag-pipelines-und-grounding.md)). Tabellen, Überschriften und die Überlappung zwischen benachbarten Chunks erfordern jeweils bewusste Entscheidungen, da eine ungeeignete Chunking-Strategie relevante Informationen unvollständig oder fragmentiert für das Retrieval bereitstellen kann.

## Zweck, Mental Model und Dependencies

Token-Chunks teilen ein Dokument in Segmente fester Tokenanzahl auf — dies ist einfach zu implementieren, ignoriert aber die inhaltliche Struktur des Dokuments und kann eine zusammenhängende Information (z. B. eine Tabelle oder einen Absatz) mitten durchtrennen. Satz-Chunks respektieren sprachliche Grenzen (Sätze werden nicht mitten durchtrennt), lösen aber nicht das Problem, dass mehrere zusammengehörige Sätze (z. B. ein mehrsätziger Absatz mit einer zusammenhängenden Aussage) über mehrere Chunks verteilt werden könnten. Struktur-Chunks orientieren sich an der natürlichen Gliederung des Dokuments (Abschnitte, Überschriften, Tabellen als eigenständige Einheiten) und bewahren damit inhaltliche Zusammenhänge besser, erfordern aber eine Dokumentanalyse, die die tatsächliche Struktur erkennt. Tabellen sind ein besonders kritischer Sonderfall: werden sie wie Fließtext in feste Token- oder Satzgrenzen zerlegt, verlieren einzelne Zeilen oder Spalten den Bezug zur zugehörigen Kopfzeile, was eine Tabellen-bezogene Anfrage beim Retrieval unvollständig beantworten lässt — Tabellen sollten daher, wo möglich, als zusammenhängende Einheit behandelt werden. Überschriften liefern wichtigen Kontext für die darunterliegenden Inhalte und sollten, wo sinnvoll, den zugehörigen Chunks als Metadaten oder Präfix mitgegeben werden, statt isoliert zu stehen. Überlappung zwischen benachbarten Chunks (ein Teil des vorherigen Chunks wird im nächsten wiederholt) reduziert das Risiko, dass eine relevante Information genau an einer Chunk-Grenze verloren geht, erhöht aber den Kontextverbrauch durch redundante Inhalte.

~~~text
Token chunks: fixed token count -> simple, but IGNORES content structure -> can split a table/paragraph mid-way
Sentence chunks: respect sentence boundaries -> but multi-sentence coherent statements can still be split across chunks
Structural chunks: follow document's natural structure (sections, headings, tables as units) -> preserves coherence, needs structure detection
Tables: SPECIAL CASE -> splitting like plain text breaks row/column-to-header association -> keep as coherent unit where possible
Headings: provide context for content below -> attach as metadata/prefix to chunks, don't leave isolated
Overlap: repeats part of previous chunk in next -> reduces boundary-loss risk, INCREASES context consumption via redundancy
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Frage | Risiko |
|---|---|---|
| Struktur-bewusste Chunk-Grenzen | folgen Chunk-Grenzen der natürlichen Dokumentstruktur (Abschnitte, Tabellen) statt fester Token- oder Satzgrenzen? | struktur-ignorierende Chunk-Grenzen können zusammenhängende Informationen fragmentieren |
| Tabellen als zusammenhängende Einheit | werden Tabellen, wo möglich, als eigenständige, nicht weiter zerteilte Chunk-Einheit behandelt? | eine wie Fließtext zerlegte Tabelle verliert den Bezug zwischen Zeilen/Spalten und Kopfzeile |
| Überschriften-Kontext in Chunks | erhalten Chunks die relevante übergeordnete Überschrift als Kontext, statt isoliert zu stehen? | ein Chunk ohne Überschriftskontext kann für das Retrieval schwerer der richtigen Anfrage zugeordnet werden |
| Abgewogene Überlappung | ist die Überlappung zwischen Chunks bewusst zwischen Grenzverlustrisiko und Kontextverbrauch abgewogen? | zu geringe Überlappung erhöht Grenzverlustrisiko, zu hohe Überlappung erhöht unnötig den Kontextverbrauch |

Implementierung: Für Dokumente mit erkennbarer Struktur (Abschnitte, Überschriften, Tabellen) wird eine struktur-bewusste Chunking-Strategie eingesetzt, die diese natürlichen Grenzen respektiert, statt pauschal feste Token- oder Satzgrenzen anzuwenden. Tabellen werden, wo technisch möglich, als zusammenhängende Einheit erhalten, statt zeilenweise oder token-basiert zerlegt zu werden. Jedem Chunk wird die relevante übergeordnete Überschrift als Metadaten oder Präfix mitgegeben, um den Kontext für das Retrieval zu verbessern. Die Überlappung zwischen benachbarten Chunks wird bewusst festgelegt, basierend auf einer Abwägung zwischen dem Risiko, eine relevante Information an einer Chunk-Grenze zu verlieren, und dem zusätzlichen Kontextverbrauch durch redundante Inhalte.

## Scalability, Reliability, Security und Observability

Chunking-Strategien skalieren Retrievalpräzision proportional zur Übereinstimmung zwischen Chunk-Grenzen und tatsächlicher Dokumentstruktur; die Reliability-Grenze liegt in einer generischen, struktur-ignorierenden Chunking-Strategie, die bei strukturreichen Dokumenten (Tabellen, hierarchische Gliederung) proportional mehr fragmentierte, unvollständige Retrieval-Ergebnisse erzeugt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| Retrieval-Ergebnisse zu tabellenbezogenen Anfragen sind unvollständig oder fehlen relevante Zeilen | Tabellen wurden wie Fließtext zerlegt statt als zusammenhängende Einheit behandelt | prüfen, ob die betroffene Tabelle als eigenständiger, nicht fragmentierter Chunk vorliegt |
| eine relevante Information wird beim Retrieval nicht gefunden, obwohl sie im Dokument vorhanden ist | die Information wurde durch eine Chunk-Grenze mitten durchtrennt, ohne ausreichende Überlappung | prüfen, ob die betroffene Information an einer Chunk-Grenze lag und die Überlappung diese nicht abdeckte |
| der Kontextverbrauch einer RAG-Pipeline ist unerwartet hoch | die Überlappung zwischen Chunks ist größer als für das Grenzverlustrisiko notwendig | Überlappungsgröße gegen das tatsächliche Grenzverlustrisiko für den betroffenen Dokumenttyp prüfen |

Security: Chunking-Metadaten (z. B. mitgegebene Überschriften oder Dokumentherkunft) können bei zugriffsbeschränkten Dokumenten unbeabsichtigt Informationen preisgeben, wenn sie nicht denselben Zugriffskontrollen wie der eigentliche Inhalt unterliegen. Observability: Retrievalpräzision nach Dokumenttyp und Chunking-Strategie, Häufigkeit fragmentierter Tabellen-Retrieval-Ergebnisse und durchschnittlicher Kontextverbrauch pro Chunking-Konfiguration sind zentrale Metriken.

## Trade-offs und Entscheidungen

**Staff** wählt Chunking-Strategien anhand der tatsächlichen Dokumentstruktur, nicht generisch für alle Dokumenttypen gleich. **Principal** macht Überlappungsentscheidungen und deren Kontextverbrauchs-Trade-off für das Team nachvollziehbar dokumentiert. **Chief** positioniert Chunking-Strategie als Architekturentscheidung mit direktem Einfluss auf RAG-Qualität, nicht als nachrangiges Implementierungsdetail.

Anti-Patterns: Tabellen wie Fließtext mit fester Token- oder Satzgrenze zerlegen; Chunks ohne Überschriftskontext isoliert lassen; eine einzige generische Chunking-Konfiguration unabhängig von der tatsächlichen Dokumentstruktur für alle Dokumenttypen verwenden.

## Production Checklist

- [ ] Chunking-Strategie ist an die tatsächliche Struktur der jeweiligen Dokumenttypen angepasst.
- [ ] Tabellen werden, wo möglich, als zusammenhängende Einheit behandelt.
- [ ] Chunks erhalten relevanten Überschriftskontext als Metadaten.
- [ ] Überlappungsgröße ist bewusst zwischen Grenzverlustrisiko und Kontextverbrauch abgewogen.

## Interviewfragen

### 1. Was ist der Unterschied zwischen Token-, Satz- und Struktur-Chunking?

**Antwort:** Token-Chunking teilt nach fester Tokenanzahl ohne Rücksicht auf Inhalt; Satz-Chunking respektiert sprachliche Grenzen; Struktur-Chunking folgt der natürlichen Dokumentgliederung (Abschnitte, Tabellen) und bewahrt inhaltliche Zusammenhänge am besten.

### 2. Warum sind Tabellen ein besonderer Sonderfall beim Chunking?

**Antwort:** Werden sie wie Fließtext zerlegt, verlieren einzelne Zeilen oder Spalten den Bezug zur zugehörigen Kopfzeile, was Retrieval-Ergebnisse zu tabellenbezogenen Anfragen unvollständig macht.

### 3. Warum sollten Chunks Überschriftskontext erhalten?

**Antwort:** Überschriften liefern wichtigen Kontext für die darunterliegenden Inhalte; ohne diesen Kontext kann ein isolierter Chunk für das Retrieval schwerer der richtigen Anfrage zugeordnet werden.

### 4. Welchen Trade-off löst Überlappung zwischen Chunks?

**Antwort:** Überlappung reduziert das Risiko, dass eine relevante Information genau an einer Chunk-Grenze verloren geht, erhöht aber den Kontextverbrauch durch redundante Inhalte — die Größe muss bewusst abgewogen werden.

### 5. Wie diagnostizierst du unvollständige Retrieval-Ergebnisse zu tabellenbezogenen Anfragen?

**Antwort:** Ich prüfe, ob die betroffene Tabelle als eigenständiger, zusammenhängender Chunk vorliegt oder ob sie wie Fließtext zerlegt wurde — Letzteres ist die wahrscheinlichste Ursache für unvollständige Ergebnisse.

### 6. Widersprüchliche Anforderung: Team will minimalen Kontextverbrauch durch möglichst wenig Chunk-Überlappung UND garantiert keinen Informationsverlust an Chunk-Grenzen — wie gehst du vor?

**Antwort:** Ich würde erklären, dass minimale Überlappung und garantierter Grenzschutz sich direkt widersprechen; ich würde vorschlagen, struktur-bewusstes Chunking als primäre Maßnahme einzusetzen, das die Notwendigkeit für Überlappung durch inhaltlich sinnvolle Grenzen strukturell reduziert, statt allein über die Überlappungsgröße zu kompensieren.

## Praktische Labs

~~~python
# Structural chunking vs naive token chunking for tables
document = {
    "sections": [
        {"heading": "Pricing", "content": "Standard tier costs $10/month."},
        {"heading": "Comparison Table", "table": [["Tier", "Price"], ["Standard", "$10"], ["Pro", "$30"]]},
    ]
}

def naive_token_chunk(text, chunk_size=20):
    words = text.split()
    return [" ".join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

def structural_chunk(document):
    chunks = []
    for section in document["sections"]:
        if "table" in section:
            table_str = "; ".join([", ".join(row) for row in section["table"]])
            chunks.append(f"[{section['heading']}] TABLE: {table_str}")
        else:
            chunks.append(f"[{section['heading']}] {section['content']}")
    return chunks

flattened_table_as_text = "Tier Price Standard $10 Pro $30"
print("Naive token chunks (loses row/header association):")
for c in naive_token_chunk(flattened_table_as_text, chunk_size=4):
    print(f"  {c}")

print("\nStructural chunks (table preserved as coherent unit with heading context):")
for c in structural_chunk(document):
    print(f"  {c}")
~~~

## Dependencies, Cross-References und Quellen

1. Pinecone: [Chunking Strategies for LLM Applications](https://www.pinecone.io/learn/chunking-strategies/), abgerufen 2026-09-17.
2. Anthropic: [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval), abgerufen 2026-09-17.
3. LlamaIndex: [Node Parsers and Text Splitters Documentation](https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/), abgerufen 2026-09-17.

RAG-Pipelines und Grounding sind kanonisch in [KB-0305](01-rag-pipelines-und-grounding.md) behandelt.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| Layout-bewusste Dokumentparser, die Tabellen, Überschriften und Fließtext automatisch strukturell erkennen (statt reiner Textextraktion) | Adopting | Gegenüber reiner Plaintext-Extraktion für strukturerhaltende Chunking-Grundlage bevorzugen. |
| Kontextangereicherte Chunks (z. B. automatisch generierte Kurzzusammenfassung des Dokuments als Präfix pro Chunk) | Adopting | Gegenüber isolierten Chunks ohne Dokumentkontext für verbesserte Retrievalpräzision bevorzugen. |

Ein Team akzeptiert eine Chunking-Strategie erst, wenn sie anhand der tatsächlichen Dokumentstruktur begründet und gegen Retrievalpräzision und Kontextverbrauch getestet ist.
