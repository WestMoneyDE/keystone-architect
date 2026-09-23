---
{"id": "KB-0003", "title": "Vollständiger Abhängigkeitsgraph", "domain": "00", "sequence": 3, "document_type": "navigation", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-14", "technical_reviewed_at": null, "research_cutoff": "2026-09-14", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [{"id": "KB-0001", "concepts": ["stabile IDs", "Statusmodell", "geplante Verweise"], "needed_for": "understanding"}], "related": ["KB-0002", "KB-0007", "KB-0008", "KB-0010"], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein Graphgenerator liest reale Artikelmetadaten, validiert Ziel-IDs und erkennt Requires-Zyklen.", "rationale": "Abhängigkeiten müssen maschinell überprüfbar sein, damit manuelle Linklisten nicht zur einzigen Wahrheit werden."}, "ARCHITECT-TARGET": {"active": true, "scope": "Harte Voraussetzungen, hilfreiche Beziehungen und Anwendungsbeziehungen passend zum Lern- und Entscheidungszweck modellieren.", "rationale": "Falsch modellierte Abhängigkeiten erzeugen unnötige Lernblockaden oder verdecken kritische Sicherheitsgrundlagen."}, "STAFF-TARGET": {"active": true, "scope": "Graphqualität, Ownership und Änderungen über mehrere Autoren und Domains hinweg steuern.", "rationale": "Teamübergreifende Arbeit braucht transparente, überprüfbare Übergaben statt implizites Wissen."}, "CHIEF-TARGET": {"active": true, "scope": "Portfolioabhängigkeiten, Risiko-Cluster und Ausnahmeregeln für strategische Kompetenzinvestitionen bewerten.", "rationale": "Ein Chief priorisiert Fähigkeiten und Risiken über Wertströme, nicht nur einzelne Kapitel."}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Graphdatenbanken, zentrale Abhängigkeitsanalyse und formale Graphalgorithmen können bei größerer Organisations- oder Systemkomplexität vertieft werden.", "rationale": "Der Kern benötigt einen klaren DAG und gute Semantik; spezialisierte Graphinfrastruktur ist erst bei belegtem Nutzen nötig."}}, "lab_validation": [{"lab_id": "KB-0003-LAB-01", "status": "executed", "checked_at": "2026-09-14", "environment": "Lokaler Arbeitsordner, JSON-Manifest, reale Markdown-Artikel und Node.js", "evidence": "Der Generator erstellt einen 720-Knoten-Graphen, extrahiert reale Kanten, prüft unbekannte Ziele und Requires-Zyklen.", "limitations": "Noch nicht geschriebene Artikel behalten bewusst einen ungelösten Dependency-Status; der Graph beansprucht noch keine vollständige fachliche Kantenauflösung."}]}
---
# Vollständiger Abhängigkeitsgraph

## Zweck, Definition und Scope

Der Abhängigkeitsgraph macht sichtbar, welches Wissen oder welches Arbeitsartefakt ein Kapitel wirklich benötigt. Er schützt die Bibliothek vor zwei gegensätzlichen Fehlern: einer künstlich linearen Lernfolge, die jede höhere ID als Voraussetzung behandelt, und einer unstrukturierten Linkwolke, in der kritische Grundlagen nicht mehr erkennbar sind.

Vollständig bedeutet in diesem Kapitel zuerst vollständig im Bestand: Alle 720 geplanten Kapitel sind als Knoten mit stabiler ID, Domain, Pfad, Lernwelle und Bearbeitungsstatus vorhanden. Die fachlichen Kanten wachsen nur, wenn ihr Quellkapitel ausgearbeitet wird. Eine noch nicht geschriebene Datei erhält keine erfundene Voraussetzung, nur damit der Graph dicht aussieht. Der aktuelle Graph ist deshalb ein vollständiger Knotenbestand mit einem schrittweise validierten Kantenbestand.

Nach diesem Kapitel kann der Leser:

1. requires, related und applies semantisch sauber unterscheiden;
2. eine fachliche Voraussetzung als minimale Begriffstiefe formulieren;
3. Vorwärtsreferenzen zulassen und trotzdem Zyklen verhindern;
4. einen Graphen auf unbekannte IDs, Selbstbezug und harte Zyklen prüfen;
5. aus einer Änderung betroffene Kapitel und Reviews ableiten, ohne die numerische Dateireihenfolge mit Lernlogik zu verwechseln.

Dieses Kapitel enthält kein erfundenes Gesamt-DAG. Es liefert den realen Generator, das Datenmodell, die Validierungsregeln und den heutigen Status. Die vollständige fachliche Auflösung der Kanten ist erst nach Ausarbeitung der 720 Kapitel möglich und bleibt bis dahin ausdrücklich offen.

## Kompetenzmarker und Evidenz

| Marker | Status | Bedeutung |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Der Graph wird aus realen Metadaten generiert und gegen fehlerhafte IDs oder Zyklen geprüft. |
| ARCHITECT-TARGET | aktiv | Die kleinste fachlich notwendige Voraussetzung wird von einem hilfreichen Verweis getrennt. |
| STAFF-TARGET | aktiv | Änderungen an Kanten, Reviews und Ownership werden domänenübergreifend nachvollziehbar gemacht. |
| CHIEF-TARGET | aktiv | Kompetenz- und Risikocluster können als Portfolioabhängigkeiten sichtbar werden. |
| SPECIALIST-OPTIONAL | aktiv | Formale Graphanalyse und Graphspeicher sind Erweiterungen, nicht Voraussetzung für eine korrekte Basiskarte. |

## Mental Model: Straßennetz, nicht Warteschlange

Ein Dependency Graph ist ein gerichtetes Straßennetz. Eine Kante A requires B bedeutet: Um A zu verstehen oder sein Lab sinnvoll auszuführen, muss der Leser genau den an der Kante benannten Teil von B beherrschen. Die Kante zeigt von A zum benötigten B. Für eine Lernreihenfolge wird diese Perspektive umgedreht: B ist der Vorgänger, der vor A gelernt wird.

Die Richtung ist nicht nur Notation. Sie verhindert unklare Sätze wie „Kubernetes hängt von Networking ab“. Die Graphkante muss präzisieren: Welches Kubernetes-Kapitel benötigt welchen Netzwerkbegriff für Verständnis, Lab oder beides? Ein Beispiel wäre: Ein CNI-Kapitel benötigt aus dem TCP/IP-Kapitel Paketadressierung, Routing und Portsemantik. Es benötigt nicht zwingend alle Themen von Enterprise BGP.

Der Graph unterscheidet drei Beziehungen:

| Beziehung | Aussage | Zyklus erlaubt? | Beispiel |
|---|---|---:|---|
| requires | Notwendige minimale Grundlage für Verständnis oder Lab. | nein | Ein Tool-Delegationskapitel benötigt Token Audience und Least Privilege. |
| related | Sinnvolle Vertiefung, Vergleich oder Rückverweis. | ja | Event Sourcing ist mit Datenreplikation verwandt. |
| applies | Anwendung eines kanonisch erklärten Mechanismus in einem anderen Kontext. | ja | Cloud Landing Zone wendet Identity- und Netzprinzipien an. |

Die harte Kerninvariante ist der DAG: Der requires-Teil darf keine gerichteten Zyklen enthalten. Wenn A B benötigt, B C und C wieder A, gibt es keine sinnvolle vollständige Reihenfolge. Ein solcher Befund zeigt meistens eine falsche Abstraktionsgrenze, einen zu groben Begriff oder eine fehlende Grundlagenzerlegung.

## Prerequisites und Dependencies

Dieses Kapitel benötigt aus [KB-0001](01-master-index-und-wegweiser.md) die stabile Identität der Knoten, die Statussemantik und die Regel für geplante Ziele. Es ergänzt die Navigation mit folgenden Beziehungen:

| Beziehung | Ziel | Zweck |
|---|---|---|
| requires | [KB-0001](01-master-index-und-wegweiser.md) | IDs, Pfade und Status im Graphen eindeutig interpretieren. |
| related | [KB-0002](02-rollen-kompetenz-matrix.md) | Kompetenzcluster und Rollenlücken als Graph-Impact lesen. |
| related | [KB-0007](01-master-index-und-wegweiser.md#kb-0007) | Lernwellen getrennt vom harten Dependency Graph halten. |
| related | [KB-0008](01-master-index-und-wegweiser.md#kb-0008) | Revisionen und Prüfauslöser an Graphänderungen binden. |
| related | [KB-0010](01-master-index-und-wegweiser.md#kb-0010) | Einheitliche Begriffe und Kantenbeschreibung verwenden. |

## Core Concepts und Algorithmen

### Datenmodell

Ein Knoten enthält ID, Titel, Domain, Pfad, Lernwelle, Artikelstatus und Dependency-Status. Eine Kante enthält Ursprung, Ziel, Beziehungstyp und, bei requires, die konkreten Begriffe sowie den Zweck understanding, lab oder both. Ohne diesen Begriffssatz wird aus einer Kante eine kaum prüfbare Behauptung.

Der Graphgenerator liest nur reale Artikelmetadaten. Das Manifest liefert den Sollbestand von 720 Knoten. Dadurch sind zwei Wahrheiten klar getrennt:

- Das Manifest sagt, welche Kapitel existieren sollen.
- Die Artikel sagen, welche fachlichen Kanten bereits konkret begründet wurden.

Ein Knoten mit dependency_status unresolved ist kein Knoten ohne Voraussetzung. Er zeigt, dass die fachliche Kantenauflösung noch nicht erfolgt ist. Ein Knoten mit none_required ist nur bei echten Einstiegskapiteln zulässig. resolved heißt, dass die geschriebenen Kanten inhaltlich formuliert und maschinell geprüft wurden; es ist kein Ersatz für einen unabhängigen Fachreview.

### Zyklusprüfung und topologische Ordnung

Die Graphprüfung durchläuft jede requires-Kante mit einer Tiefensuche. Ein Knoten ist zunächst unbesucht, während der aktuellen Suche visiting und nach Abschluss visited. Eine Kante auf einen visiting-Knoten schließt einen Zyklus. Die Laufzeit ist O(V + E): Jeder Knoten und jede Kante wird höchstens konstant oft betrachtet. Bei 720 Knoten ist die Laufzeit unkritisch; die Qualität der Semantik ist der Engpass.

Eine topologische Ordnung existiert nur für einen azyklischen gerichteten Graphen. Da die Bibliothek requires als „Konsument zeigt auf Voraussetzung“ speichert, wird für eine Lernreihenfolge die Kante logisch umgedreht: Die Voraussetzung muss vor ihrem Konsumenten kommen. Mehrere gültige Ordnungen können existieren. Das ist erwünscht; sie ermöglichen unterschiedliche Lernpfade für GenAI, Plattform oder Cloud, ohne die fachliche Gültigkeit zu verlieren.

## Architecture und Data Flow

Der Datenfluss beginnt beim Manifest. Der Generator erzeugt daraus die 720 Knoten. Danach scannt er echte Markdown-Dateien, parst ihr JSON-Frontmatter und extrahiert requires, related und applies. Jede Ziel-ID wird gegen das Manifest validiert. Der requires-Teil wird separat auf Selbstbezug und Zyklen geprüft; die weichen Kanten bleiben für Navigation erhalten, dürfen aber den DAG nicht blockieren.

Das Ergebnis liegt als work/dependency-graph.json vor. Es enthält alle Knoten, die realen Kanten, Zähler pro Kantenart, Zyklen, Validierungsbefunde und die Liste der noch nicht fachlich aufgelösten Knoten. Der Master Index bleibt die menschliche Navigation; das Graphartefakt ist die maschinenlesbare Prüfbasis.

Beispiel: KB-0002 benötigt die stabile ID- und Statussemantik aus KB-0001. Diese Kante ist hart, weil die Kompetenzmatrix sonst nicht entscheiden kann, ob eine Ziel-ID geplant, im Review oder angenommen ist. KB-0002 ist mit KB-0007 lediglich related: Lernwellen helfen bei der Nutzung, sind aber keine Voraussetzung, um die Matrix zu verstehen. Die Unterscheidung macht einen späteren Lernplan brauchbar.

## Protocols, Standards und Tools

Der Graph verwendet kein Netzwerkprotokoll. Seine öffentliche Schnittstelle ist ein versioniertes JSON-Artefakt mit stabilen IDs und überprüfbaren Kanten. Die Artikelmetadaten folgen dem Frontmatter-Schema; der Graphgenerator erzwingt zusätzlich die fachlich relevanten Regeln für IDs, Selbstbezug und Zyklusfreiheit.

Für größere Automatisierung können Standardbibliotheken wie [Python graphlib](https://docs.python.org/3/library/graphlib.html), Build-Graph-Werkzeuge oder Graphdatenbanken genutzt werden. Sie ersetzen nicht die Entscheidung, ob eine Kante semantisch richtig ist. Ein TopologicalSorter kann eine falsche Voraussetzung technisch sauber sortieren.

## Konfiguration und Implementierung

Der lokale Generator folgt diesen Schritten:

1. Manifest und Wiederaufnahme-Register laden.
2. Alle vorhandenen Markdown-Kapitel rekursiv lesen und das JSON-Frontmatter parsen.
3. Knoten aus allen 720 Manifest-Einträgen erzeugen.
4. Reale Kanten aus requires, related und applies übernehmen.
5. Jede Kante gegen die ID-Menge prüfen, Selbstbezüge ablehnen und requires separat auf Zyklen prüfen.
6. Das Graphartefakt und eine kompakte Prüfausgabe schreiben.

Eine neue Datei darf erst dependency_status resolved setzen, wenn ihre requires-Kanten die minimale Begriffstiefe benennen. Eine Änderung an einer Kante ist eine fachliche Änderung: Sie braucht eine neue Artikelrevision, eine Graphprüfung und eine Einschätzung, welche abhängigen Kapitel oder Labs erneut geprüft werden müssen.

## Scalability und Performance

Der aktuelle Graph hat 720 Knoten. Selbst bei mehreren tausend Kanten bleibt die Validierung mit Tiefensuche und Hash-basierten ID-Lookups klein gegenüber Recherche und Review. Ein Graphspeicher ist daher kein Performancebedarf, solange die Bibliothek lokal und versioniert bleibt.

Skalierbarkeit betrifft stattdessen Ownership. Mit zunehmender Anzahl paralleler Autoren steigen Risiken durch Kantenkonflikte, fachlich ähnliche Begriffe und überlappende Updates. Der Generator verhindert Syntaxfehler; Regeln zur kanonischen Zuständigkeit und ein Reviewowner verhindern semantische Fehler. Für jede Domain sollte klar sein, wer Kanten aus dem Domainkontext vorschlagen und wer sie akzeptieren darf.

## Reliability und Failure Modes

| Fehlerbild | Symptom | Detektion | Recovery |
|---|---|---|---|
| Unbekannte Ziel-ID | Eine Kante zeigt auf einen nicht geplanten oder falsch geschriebenen Knoten. | ID-Validierung schlägt fehl. | ID gegen Manifest korrigieren oder den Scope fachlich neu entscheiden. |
| Selbstbezug | Ein Kapitel erklärt sich als eigene Voraussetzung. | Selbstbezugstest. | Voraussetzung in einen kleineren Grundlagenbegriff auslagern oder entfernen. |
| Hard Cycle | Keine gültige Lernreihenfolge für einen Teilgraphen. | DFS meldet Zykluspfad. | Kanten begrenzen, Begriffe zerlegen oder einen kanonischen Basisartikel schaffen. |
| Weiche Kante als harte Kante | Lernpfad wird unnötig blockiert. | Review der needed_for-Begründung. | Nach related oder applies verschieben. |
| Fehlende Kante | Lab scheitert, weil eine Grundlage nicht genannt ist. | Lab-Gegenprobe, Review oder Nutzerfeedback. | Konkrete requires-Kante mit minimalem Konzept ergänzen. |
| Stale Graph | Artikel und Graphartefakt haben unterschiedliche Revisionen. | Hash- und Änderungsprüfung. | Generator nach jeder Metadatenänderung erneut ausführen. |

Der sichere Fehlerfall ist Abbruch mit Befund. Ein Generator darf nie stillschweigend eine unbekannte ID ignorieren oder einen Zyklus nur als Hinweis protokollieren. Eine weiche Linkbeziehung darf dagegen keinen Build blockieren.

## Security, Governance und Observability

Der Graph enthält keine Secrets. Er kann aber sensible Strukturinformationen verraten, etwa welche Sicherheits- oder Governancekapitel kritische Grundlagen für ein Produktbereich sind. Öffentliche Weitergabe braucht daher dieselbe Prüfung wie andere Architekturartefakte: keine Kundennamen, keine internen Schwachstellen, keine persönlichen Bewertungsdaten.

Governance verlangt drei Entscheidungen: Wer darf Kanten vorschlagen? Wer entscheidet bei cross-domain Konflikten? Welche Änderung macht einen Review erneut nötig? Ein sinnvoller Standard sieht vor, dass der Artikelowner die Kante beschreibt, der kanonische Domainowner widersprüchliche Zuständigkeiten prüft und der Maintainer den Graphcheck ausführt.

Zu beobachten sind mindestens Knotenanzahl, autorisierte Knoten, ungelöste Dependency-Knoten, Kanten nach Typ, Zykluszahl, ungültige IDs und die seit der letzten Graphprüfung geänderten Artikel. Ein Graph mit null Zyklen kann trotzdem schlecht sein, wenn fast alle Knoten ungelöst bleiben. Deshalb gehört der Anteil semantisch aufgelöster Knoten in jede Fortschrittsansicht.

## Cost, FinOps und Trade-offs

Die Rechenkosten des Graphchecks sind vernachlässigbar. Die wirtschaftlich relevante Größe ist die Kostenersparnis durch weniger falsche Lerninvestitionen und weniger doppelte Erklärungen. Eine fehlende Security-Voraussetzung in einem Agentenlab kann mehr Zeit kosten als das sorgfältige Modellieren einer Kante.

| Wahl | Vorteil | Preis |
|---|---|---|
| Kleiner, begründeter DAG | Klare Lern- und Reviewgrenzen. | Benötigt sorgfältige Semantik. |
| Dichte Verweiswolke | Gute Entdeckung verwandter Themen. | Schwerer zu priorisieren; darf nicht als Lernreihenfolge missverstanden werden. |
| Vollautomatische Kantenableitung aus Text | Schnell und breit. | Hohe Gefahr semantisch falscher Voraussetzungen. |
| Menschlich begründete Kanten plus Generator | Nachvollziehbar und prüfbar. | Mehr redaktioneller Aufwand. |
| Graphdatenbank | Reichhaltige Abfragen bei großem Bestand. | Betrieb, Migration, Berechtigung und zusätzliche Statuswahrheit. |

## Staff-, Principal- und Chief-Entscheidungen

Staff-Level entscheidet, wie ein Team Kanten in Pull Requests oder Reviews dokumentiert und welche Gegenprobe ein Lab für eine fehlende Voraussetzung liefert. Principal-Level harmonisiert Kanten an Domainrändern, etwa Retrieval zu Identity oder GPU Serving zu FinOps. Chief-Level entscheidet, welche Kompetenzcluster strategisch kritische Pfade bilden und wo bewusste Redundanz erlaubt ist, etwa für Security oder Resilienz.

Eine Chief-Entscheidung darf nicht aus dem Graphen allein kommen. Der Graph zeigt Abhängigkeit, nicht Geschäftswert. Investitionsentscheidungen brauchen zusätzlich Risiko, Nachfrage, Kosten, regulatorischen Kontext und verfügbare Ownership.

## Production Checklist

- [x] Der Graphbestand enthält alle 720 Manifest-Knoten.
- [x] Reale Artikelkanten werden aus Frontmatter statt aus Nummern geraten.
- [x] Unbekannte IDs, Selbstbezüge und requires-Zyklen brechen die Prüfung ab.
- [x] related und applies bleiben außerhalb der harten DAG-Regel.
- [x] Offene Kantenauflösung wird als partial_acyclic und nicht als vollständiger DAG ausgegeben.
- [x] Das lokale Generator-Lab wurde ausgeführt.
- [ ] Jeder der 720 Artikel hat fachlich begründete, unabhängige reviewed requires-Kanten.
- [ ] Eine unabhängige technische Prüfung bestätigt dieses Kapitel und seine Graphsemantik.

## Interviewfragen mit Antwortleitfäden

1. **Warum ist die numerische Dateireihenfolge kein Dependency Graph?**  
   Sie ordnet Arbeit, nicht fachliches Verständnis. Gute Antworten nennen Vorwärtsreferenzen und minimal benötigte Konzepte.

2. **Wann ist ein Zyklus ein Fehler und wann nur ein nützlicher Zusammenhang?**  
   Ein requires-Zyklus blockiert eine Lern- oder Ausführungsreihenfolge. related und applies dürfen zyklisch sein, weil sie keine harte Voraussetzung behaupten.

3. **Wie erkennen Sie eine zu grobe Voraussetzung?**  
   Wenn sie ein ganzes Fachgebiet fordert, obwohl das Lab nur einen konkreten Begriff braucht. Die Kante wird auf die kleinste ausreichende Begriffstiefe reduziert.

4. **Warum genügt ein zyklusfreier Graph nicht als Qualitätsnachweis?**  
   Er kann unvollständig, semantisch falsch oder fachlich zu dicht sein. Reviews, Labs und kanonische Ownership prüfen die Aussagequalität.

5. **Wie behandeln Sie eine Änderung am Sicherheitsmodell?**  
   Betroffene Artikel über Kanten und Quellenrecords finden, Scope und Kanten aktualisieren, Labs oder Reviews erneut prüfen und den Status transparent zurücksetzen.

6. **Wann wäre eine Graphdatenbank gerechtfertigt?**  
   Wenn Versionierung plus JSON keine nachvollziehbare Impact-Analyse oder parallele Ownership mehr zulassen. Betriebskosten und eine zweite Statuswahrheit müssen vorher bewertet werden.

## Praktisches Lab: 720 Knoten und echte Kanten prüfen

**Ziel.** Generiere den Dependency Graph aus Manifest und vorhandenen Artikeln. Verifiziere, dass der Knotenbestand vollständig ist, die realen requires-Kanten gültige Ziele haben und kein Zyklus entsteht.

1. Führe den lokalen Graphgenerator aus.
2. Prüfe node_count, authored_node_count, unresolved_dependency_nodes, requires_edge_count und cycles.
3. Ergänze in einer temporären Kopie eines Artikels eine requires-Kante auf eine ungültige ID. Der Generator muss fehlschlagen.
4. Ergänze in einer temporären Kopie zwei Kanten, die einen geschlossenen requires-Zyklus bilden. Der Generator muss den Zykluspfad ausgeben.
5. Verwirf die temporären Änderungen und führe den Generator erneut aus. Der echte Graph muss wieder PASS und partial_acyclic anzeigen.

**Erwartete Beobachtung.** Alle 720 Knoten sind sichtbar; nur die Kanten real geschriebener Artikel sind enthalten. Die ungeschriebenen Kapitel bleiben ungelöst, statt mit künstlichen Kanten versehen zu werden. **Cleanup.** Temporäre Gegenproben werden nicht in die Bibliothek übernommen. Der Generator erzeugt keine Cloud-Ressourcen.

## Dependencies, Cross-References und Quellen

Die stabile Identität und Statusnavigation liegt in [KB-0001](01-master-index-und-wegweiser.md). Rollen- und Fähigkeitswirkung liegt in [KB-0002](02-rollen-kompetenz-matrix.md). Lernwellen, Revisionen und Notation werden später von [KB-0007](01-master-index-und-wegweiser.md#kb-0007), [KB-0008](01-master-index-und-wegweiser.md#kb-0008) und [KB-0010](01-master-index-und-wegweiser.md#kb-0010) vertieft.

**Verwendete Quellen, Stand 2026-09-14.**

- Masterplan: Kantenarten und erst spätere fachliche Auflösung
- Kanonische Themen und Dependency-Modell
- Artikelvertrag: Anforderungen an Dependencies und Review
- [Python graphlib und TopologicalSorter](https://docs.python.org/3/library/graphlib.html)

## Bonus: New Tech and Innovations

**Stand: 2026-09-14.** Graphanalyse ist ein etablierter Baustein von Build- und Workflow-Systemen; für eine Wissensbasis ist die relevante Weiterentwicklung die Kombination aus versionierten Metadaten, Impact-Analyse und klar ausgewiesener Unsicherheit. Der Reifegrad des lokalen DAG-Checks ist **Established**: Eine topologische Ordnung ist nur für azyklische harte Kanten möglich, wie die Python-Standardbibliothek für Graphverarbeitung dokumentiert.

Semantische Graphen und AI-gestützte Kanten-Vorschläge sind hier **Emerging**. Sie können bei 720 Kapiteln verwandte Themen finden, dürfen aber keine fachliche Voraussetzung ohne menschliche Begründung in das harte Graphmodell schreiben. Ein Pilot wäre erst erfolgreich, wenn vorgeschlagene Kanten eine nachvollziehbare Begründung, ein Quellsegment und eine Reviewentscheidung enthalten; seine Präzision muss gegen von Domainowner akzeptierte Kanten gemessen werden.
