---
{"id": "KB-0001", "title": "Master Index und Wegweiser", "domain": "00", "sequence": 1, "document_type": "navigation", "content_version": "0.1.633", "status": "technical_review", "written_at": "2026-09-14", "technical_reviewed_at": null, "research_cutoff": "2026-09-15", "primary_roles": ["GENAI", "PLATFORM", "ENTERPRISE", "CLOUD", "STAFF", "PRINCIPAL", "CHIEF"], "requires": [], "related": ["KB-0002", "KB-0003", "KB-0004", "KB-0007", "KB-0008", "KB-0009", "KB-0010"], "applies": [], "dependency_status": "none_required", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Ein maschinenlesbares Register, ein konsistenter Index und überprüfbare Statusübergänge werden selbst erzeugt und validiert.", "rationale": "Navigation wird erst belastbar, wenn IDs, Pfade, Status und Referenzen nachvollziehbar zusammengeführt werden."}, "ARCHITECT-TARGET": {"active": true, "scope": "Informationsarchitektur, kanonische Verantwortlichkeiten und Abhängigkeitsarten für eine große technische Bibliothek begründen.", "rationale": "Architekturarbeit benötigt eine zuverlässige Karte der Entscheidungen und ihrer Nachweise."}, "STAFF-TARGET": {"active": true, "scope": "Ein teamübergreifendes System für Fortschritt, Review, Evidenz und fachliche Ownership betreiben.", "rationale": "Mehrere Autoren oder Reviewer brauchen einen gemeinsamen, auditierbaren Arbeitszustand."}, "CHIEF-TARGET": {"active": true, "scope": "Standards für Portfolioabdeckung, Statuswahrheit, Ausnahmen und regelmäßige Neubewertung festlegen.", "rationale": "Chief-Level-Verantwortung besteht in Governance und Risikotransparenz, nicht in der bloßen Zahl geschriebener Seiten."}, "SPECIALIST-OPTIONAL": {"active": false, "scope": "Graphdatenbanken, semantische Suche und automatisierte Knowledge-Graph-Analyse sind hier nicht Kernumfang.", "rationale": "Für 720 kontrollierte Einträge genügt ein versioniertes Manifest; zusätzliche Graph-Infrastruktur muss erst einen belegten Nutzen haben."}}, "lab_validation": [{"lab_id": "KB-0001-LAB-01", "status": "executed", "checked_at": "2026-09-14", "environment": "Lokaler Arbeitsordner mit Node.js und dem geprüften JSON-Manifest", "evidence": "Das Initialisierungsskript erzeugt Register, Quellenregister, Reviewregister und 720 navigierbare Indexeinträge aus dem Manifest.", "limitations": "Der Lauf prüft Planungskonsistenz und erzeugt keine fachlich getesteten Infrastruktur-, Cloud- oder Produktionsartefakte."}]}
---
# Master Index und Wegweiser

## Zweck, Definition und Scope

Diese Datei ist die Eingangstür zur Staff/Principal/Chief Technical Knowledge Base. Sie verbindet die 720 vorgesehenen Kapitel mit stabilen IDs, Domainordnern, Rollenprioritäten, Lernwellen, kanonischen Zuständigkeiten und ihrem tatsächlichen Bearbeitungsstatus. Ein Index ist kein dekoratives Inhaltsverzeichnis. Er ist ein Steuerungsartefakt: Er beantwortet, welche Aussage an welcher Stelle gehört, welche Datei fachlich angenommen wurde und welche lediglich geplant ist.

Die Bibliothek verfolgt vier Zielrichtungen. GenAI Solution Architecture und Engineering haben Priorität, Platform- und Enterprise-Architecture folgen, Cloud Architecture bildet die dritte tragende Richtung; MLOps/LLMOps stützt alle vier. Die 720 Slots sind eine absichtliche Begrenzung. Sie zeigen Breite und erlauben Tiefe, beweisen aber weder Kompetenz noch Aktualität. Erst ein überprüfbares Kapitel, zugeordnete Evidenz und ein dokumentiertes Review können einen Status verändern.

Nach diesem Kapitel kann der Leser:

1. eine Anforderung über ID, Domain, Rollenfokus und kanonische Zuständigkeit zum richtigen Kapitel führen;
2. zwischen Schreibreihenfolge, Lernpfad und fachlicher Voraussetzung unterscheiden;
3. die Status planned, technical_review und accepted korrekt interpretieren;
4. einen geplanten Verweis von einem existierenden Kapitel unterscheiden;
5. bei einer Curriculumänderung erkennen, welche Register, Quellen, Kanten und Reviews erneut geprüft werden müssen.

Der Scope ist Navigation und Governance der Bibliothek. Dieses Kapitel erklärt nicht erneut TCP, Kubernetes, RAG oder TOGAF. Es erklärt, wie ihre kanonischen Kapitel auffindbar bleiben und wie Wiederholung verhindert wird. Die technische Erklärung eines Begriffs gehört in die in der Abgrenzungsmatrix bestimmte Heimatdatei.

## Aktueller, ehrlicher Fortschrittsstand

| Kennzahl | Stand |
|---|---:|
| Geplante Domains | 31 |
| Geplante Lehrdateien | 720 |
| Fachlich angenommene Lehrdateien | 0 |
| Dateien in technischer Selbstprüfung | 719 |
| Nächste Schreibposition | KB-0106 |
| Aktive Lernwelle | 1 — Target roles & career architecture |

Dateierzeugung und Annahme sind getrennt. Die zehn Dateien der Domain 00 liegen als echte Artikel vor und befinden sich in technical_review, weil nur Selbstprüfungen dokumentiert wurden. Sie werden deshalb nicht als angenommen gezählt. Eine leere Datei, eine Kopie aus dem Katalog oder ein nicht geprüfter Entwurf wäre ebenfalls keine Annahme.

## Kompetenzmarker und Evidenz

| Marker | Status | Bedeutung für dieses Kapitel |
|---|---|---|
| CURRENT-EVIDENCE | offen | Eigene Selbsteinschätzung: belegte Praxis zu diesem Thema festhalten, Lücken als Lernziel markieren. |
| HANDS-ON-TARGET | aktiv | Register, Statusmodell und Linkprüfung werden als lokales, reproduzierbares Artefakt umgesetzt. |
| ARCHITECT-TARGET | aktiv | Informationsgrenzen, Zuständigkeiten und Verweisarten werden bewusst entworfen. |
| STAFF-TARGET | aktiv | Fortschritt, Reviews und Evidenz können über Autorengrenzen hinweg nachvollzogen werden. |
| CHIEF-TARGET | aktiv | Der Index macht Portfolioabdeckung, Risiken, Standards und Ausnahmen steuerbar. |
| SPECIALIST-OPTIONAL | deaktiviert | Eine dedizierte Graphdatenbank wäre erst bei nachgewiesenem Bedarf gerechtfertigt. |

Die Selbsteinschätzung wird in dieser Bibliothek nicht als Labelmaschine verwendet. Die bloße Erwähnung eines Tools in einem Profil ist nicht dasselbe wie Betriebserfahrung. Wer aus einem eigenen Projektbeleg eine begrenzte Ist-Aussage ableitet, führt dazu Quelle/Artefakt, Zeitraum, Aussagegrenze und Evidenzart (siehe [KB-0004](#kb-0004)). Diese Indexdatei verlinkt auf die Regeln; sie zieht keine persönlichen Schlussfolgerungen.

## Mental Model: Karte, Register und Beweiskette

Stelle dir die Bibliothek wie eine Stadt vor. Die Kapitel sind Gebäude, die ID ist die Grundstücksnummer und der Domainordner das Viertel. Ein Link ohne ID ist eine Wegbeschreibung wie „in der Nähe vom Bahnhof“: manchmal hilfreich, aber nicht belastbar. Das Manifest ist dagegen das amtliche Register. Es definiert, dass KB-0382 zu einem bestimmten Pfad und Scope gehört, unabhängig davon, ob der Titel später redaktionell angepasst wird.

Die Analogie hat eine wichtige Grenze. Eine technische Bibliothek ist keine statische Stadtkarte. Neue Standards, Service-Abkündigungen und korrigierte Architekturentscheidungen verändern Kapitel. Deshalb besteht ihre Wahrheit nicht nur aus dem aktuellen Text, sondern aus einer Beweiskette:

Original-Masterplan → Manifest → Artikel → Quellen-/Evidenzrecord → Reviewrecord → akzeptierter Status.

Folgende Invarianten schützen diese Kette:

- Jede der 720 IDs kommt genau einmal vor und führt zu höchstens einem kanonischen Pfad.
- Ein Kapitelstatus wird im Register geführt; die bloße Existenz einer Markdown-Datei verändert ihn nicht.
- requires bedeutet fachliche Voraussetzung und muss als harter Graph azyklisch bleiben. related und applies dürfen Zyklen bilden.
- Ein noch nicht geschriebenes Ziel bleibt im Index als geplant sichtbar; ein Link darf seine Existenz nicht vortäuschen.
- Belegte Ist-Aussagen und Lernziele bleiben getrennte Datenarten.
- Eine größere Revision kann eine frühere Annahme entwerten, bis das Kapitel erneut geprüft ist.

## Voraussetzungen und Dependencies

Dieses Kapitel hat keine fachlichen Voraussetzungen. Es ist absichtlich der erste Einstiegspunkt. Es zeigt jedoch Verweise auf spätere Navigationskapitel:

| Beziehung | Ziel | Wofür sie gebraucht wird |
|---|---|---|
| related | [KB-0002](#kb-0002) | Rollenprioritäten und die konkrete Kompetenzmatrix. |
| related | [KB-0003](#kb-0003) | Der fachlich aufgelöste, zyklusgeprüfte Abhängigkeitsgraph. |
| related | [KB-0004](#kb-0004) | Selbsteinschätzung und Evidenzgrenzen: claim-begrenztes Istbild und Zielkompetenzen. |
| related | [KB-0007](#kb-0007) | Die neun Lernwellen, die nicht mit der Schreibreihenfolge verwechselt werden dürfen. |
| related | [KB-0008](#kb-0008) | Revisions- und Aktualitätsregeln. |
| related | [KB-0009](#kb-0009) | Laborstatus und Beweisartefakte. |
| related | [KB-0010](#kb-0010) | Begriffe, Abkürzungen und Notation. |

Ein Artikel in einer späteren Domain darf auf eine noch nicht geschriebene Ziel-ID verweisen. Der Link führt dann zu dem entsprechenden Anker im Vollregister dieses Dokuments und markiert das Ziel als geplant. Erst nach Annahme wird er auf die konkrete Datei umgestellt. Diese Regel verhindert sowohl fachlich falsche Rückwärtszwänge als auch Scheinkapitel.

## Core Concepts und Mechanismen

### Drei Ordnungen, drei Fragen

Die Schreibreihenfolge ist numerisch: Domain 00, dann 01 bis 30, jeweils in Katalogreihenfolge. Sie beantwortet die Redaktionsfrage: Welche Datei wird als Nächstes erstellt?

Die Lernwellen gruppieren die Domains nach didaktischem Nutzen. Sie beantworten die Lernfrage: Welche Themenkombination baut für die Zielrollen sinnvolle Fähigkeit auf? Welle 3 konzentriert beispielsweise GenAI, Agenten und Retrieval, während Welle 4 Plattform und Cloud verbindet.

Der Dependency Graph beantwortet die fachliche Frage: Welches Mindestverständnis ist für diese Erklärung oder dieses Lab nötig? Er darf auf spätere IDs zeigen. Ein Agenten-Lab kann etwa nur OAuth/OIDC: Token und Audience aus einem späteren Identity-Kapitel benötigen; es fordert nicht zwangsläufig den gesamten Cloud-Tenant-Track.

Wenn diese drei Ordnungen vermischt werden, entstehen typische Fehlentscheidungen. Ein Autor könnte eine Datei zurückhalten, weil ihre Voraussetzung eine höhere Nummer trägt; ein Lernender könnte anhand der numerischen Reihenfolge eine falsche Lernempfehlung erhalten; ein Reviewer könnte related-Links irrtümlich als Zyklen bewerten.

### Statusmodell

| Status | Bedeutung | Zähler „angenommen“ |
|---|---|---:|
| planned | Katalogeintrag ohne ausgearbeitetes Kapitel. | nein |
| researching | Scope und Quellen werden geprüft. | nein |
| draft | Fachtext existiert, ist aber nicht reif für Review. | nein |
| technical_review | Der Entwurf wird gegen Scope, Quellen, Kanten und Labs geprüft. | nein |
| accepted | Wesentliche Befunde sind behoben; Schreib-, Recherche- und Prüfdaten liegen vor. | ja |
| packaged | Angenommen und in ein final verifiziertes Archiv aufgenommen. | ja |

Die Statusdaten liegen im Wiederaufnahme-Register. Ein Reviewrecord ergänzt die Entscheidung um Revision/Hash, Prüfmethode, Quellenprüfung, Labstatus, Befunde und Grenzen. Ein Selbstreview ist nützlich, aber als not_independent zu kennzeichnen; es wird nicht als unabhängige technische Prüfung ausgegeben.

## Architecture und Data Flow

Der Kontrollpfad ist: Original-Masterplan führt zum Manifest mit IDs, Pfaden und Scopes. Das Manifest erzeugt sowohl den Master Index als auch das Wiederaufnahme-Register. Ein Artikelentwurf führt zu Quellen- und Evidenzrecords sowie zu Review- und Befundrecords. Erst ein Review mit behobenen wesentlichen Befunden setzt den Status auf accepted und aktualisiert wieder Index und Register.

Als durchgängiges Beispiel dient eine mandantenfähige Enterprise-Agent-Anwendung. Ein Autor benötigt eine Antwort auf „Wie sichere ich Tool-Aufrufe?“. Der Index führt zu Domain 12 für Agentenmechanik und zu Domain 23 für Identity und Delegation. Der Kanon verhindert, dass Domain 12 OAuth/OIDC vollständig dupliziert. Werden später neue MCP-Authentisierungsregeln veröffentlicht, findet das Quellenregister die betroffenen Kapitel; der Reviewstatus wird gezielt erneut geöffnet, statt 720 Dateien pauschal als aktuell zu bezeichnen.

## Protocols, Standards und Tools

Das technische Protokoll dieses Indexes ist bewusst klein:

- Stable ID: KB-0001 bis KB-0720. Eine ID wird nie wiederverwendet.
- Pfadkonvention: DD-domain-slug/NN-topic-slug.md, relativ zum Wissensbasis-Root.
- Artikelmetadaten: YAML-Frontmatter, geprüft gegen das JSON Schema.
- Arbeitsregister: JSON als maschinenlesbare Quelle für Status und Revisionen.
- Quellen-/Evidenzregister: pro zeitabhängiger oder erfahrungsbezogener Aussage mit Geltungsbereich und Prüfauslöser.
- Reviewregister: Revision, Prüfmethode, Befunde und Entscheidungsstatus.

JSON ist für 720 Einträge zweckmäßig: es ist versionskontrollierbar, ohne Spezialdatenbank durchsuchbar und kann zuverlässig validiert werden. Markdown bleibt für die menschliche Navigation. Wird später Multi-Autor-Parallelität, differenzierte Freigabe oder umfangreiche Analytics erforderlich, kann ein Issue-Tracker oder eine kleine Datenbank ergänzt werden. Das ersetzt jedoch nicht den kanonischen Artikelinhalt und seine Quelllinks.

## Konfiguration und Implementierung

Die Initialisierung erfolgt aus dem geprüften Manifest; die 720 Einträge werden nicht von Hand abgetippt. Der lokale Initialisierungslauf erzeugt ein Wiederaufnahme-Register mit Status, Pfad, Revision und nächster Aktion, ein Quellenregister für die verwendeten Planquellen, ein Reviewregister mit der explizit nicht unabhängigen Selbstprüfung und die vollständige ID- und Pfadnavigation in diesem Artikel.

Das ist kein Ersatz für die fachliche Ausarbeitung. Der Generator darf nur mechanische Daten aus dem Manifest übertragen. Lernziele, Quelleninterpretation, Architekturentscheidungen, Labs, Sicherheit und Reviewbefunde entstehen pro Artikel und müssen inhaltlich geprüft werden.

Eine minimale Wiederaufnahmeprüfung beantwortet zuerst: Gibt es die Ziel-Datei bereits? Stimmen ihre ID und ihr Pfad mit dem Register? Ist der letzte Status angenommen oder ein Entwurf? Welche wesentlichen Befunde sind offen? Erst danach darf ein Autor eine neue Revision beginnen. Dieses Verfahren verhindert, dass eine frühere Datei unbemerkt überschrieben oder eine Parallelserie gestartet wird.

## Scalability und Performance

Ein Register mit 720 kleinen Objekten und ein Markdown-Index mit 720 Zeilen sind für lokale Werkzeuge trivial. Die maßgeblichen Engpässe sind redaktionell, nicht rechnerisch:

- Kontextwechsel zwischen Domains erhöht die Gefahr von widersprüchlichen Entscheidungen.
- Gleichzeitige Bearbeitung ohne eindeutige Ownership führt zu Statusrennen.
- Große manuelle Indexdiffs erschweren Review und Merge.
- Eine Volltextsuche findet Wörter, kann aber keine kanonische Zuständigkeit bewerten.

Die Gegenmaßnahmen sind stabiler ID-Schlüssel, manifestbasierte mechanische Generierung, getrennte Register und kurze, fachliche Reviewrecords. Bei paralleler Bearbeitung werden Änderungen an einem Artikel und seinem Registereintrag als eine logische Revision behandelt. Ein globaler Index wird deterministisch aus dem Register erzeugt; er sollte nicht unabhängig manuell gepflegt werden.

## Reliability und Failure Modes

| Fehlerbild | Symptom | Erkennung | Schutz und Recovery |
|---|---|---|---|
| ID-Kollision | Zwei Inhalte beanspruchen dieselbe Nummer. | Eindeutigkeitsprüfung im Manifest und Register. | Zweiten Entwurf stoppen; nie durch Umbenennen ohne Katalogrevision reparieren. |
| Verwaister Link | Ein Kapitel verweist auf einen nicht vorhandenen Pfad. | Linkcheck und Vergleich mit Manifest. | Bis zur Annahme auf den Indexanker verweisen; Zielstatus sichtbar planned lassen. |
| Scheinfortschritt | Viele Dateien existieren, aber keine ist angenommen. | Statuszähler gegen Reviewregister vergleichen. | Status nur nach dokumentierter Entscheidung ändern. |
| Scope-Duplikat | Gleicher Mechanismus wird in mehreren Domains vollständig erklärt. | Kanonische Matrix und Review. | Einen primären Owner festlegen; andere Kapitel auf Anwendung und Verweis reduzieren. |
| Stale Claim | Veraltete Release- oder Rechtsaussage bleibt im Text. | research_cutoff, Quellenrecord und Revisionsauslöser prüfen. | Betroffene Kapitel auf researching oder technical_review zurücksetzen. |
| Unbelegte Erfahrungsaussage | Ein Tool wird als Erfahrung dargestellt, obwohl nur erwähnt. | Quelle/Artefakt und Evidenzart prüfen. | Marker deaktivieren oder Aussage auf belegten Umfang begrenzen. |

Der sichere Wiederanlauf beginnt immer beim Register, nicht beim Gefühl „ich weiß ungefähr, wo ich war“. Der Registereintrag benennt aktive ID, letzte Revision, offene Befunde und nächste Aktion. Das reduziert Fehler nach Unterbrechungen oder Modellwechseln.

## Security und Governance

Der Index enthält keine Secrets. Trotzdem ist er ein Governance-Asset, weil er Aussagen über Kompetenz, Sicherheitsgrenzen und Reifegrad navigiert. Keine Zugangsdaten, Kundeninformationen, unredigierten Logs oder personenbezogenen Details aus Selbsteinschätzungen oder Profilen gehören in Kapitel- oder Registerdateien. Beispiele verwenden fiktive Mandanten, Lasten und Budgets und markieren sie als Annahmen.

Quellenrecords verweisen auf Primärquellen oder kontrollierte interne Artefakte; ein Link allein ist keine Vertrauensgarantie. Statusänderungen werden versioniert. Wer eine Ausnahme genehmigt, dokumentiert Owner, Risiko, Ablaufdatum und Rückkehrkriterium. Für regulierte Themen ist der Index ein Wegweiser, kein Compliance-Nachweis: Ein Link zu AI Governance beweist keine EU-AI-Act-Konformität.

## Observability und Troubleshooting

Sinnvolle Signale sind die Anzahl nach Status und Domain, accepted geteilt durch 720, offene blockierende und wesentliche Befunde, ungültige IDs oder Pfade, verbliebene Links auf geplante Ziele, überzogene Research-Cutoffs sowie aktivierte CURRENT-EVIDENCE-Marker ohne zulässigen Evidenzrecord.

Wenn eine Suche ein Kapitel nicht findet, erfolgt die Diagnose in dieser Reihenfolge:

1. ID oder Begriff im Manifest suchen; Titel können sich redaktionell ändern.
2. Den Sollpfad im Register mit dem realen Pfad vergleichen.
3. planned von fehlender Datei unterscheiden.
4. Die kanonische Themenmatrix prüfen, falls mehrere Domains plausibel wirken.
5. Bei Voraussetzungen den Dependency Graph statt der Nummerierung konsultieren.
6. Bei Statuskonflikten den letzten Reviewrecord und dessen Revision/Hash prüfen.

„Im Ordner ist etwas Ähnliches“ ist keine ausreichende Diagnose. Sie führt bei Identity, Kafka, Retrieval, GPU-Scheduling oder Governance leicht zu falschen Querverweisen.

## Cost und FinOps

Die direkten Betriebskosten dieser Navigation sind gering: Textdateien, JSON und lokale Validierung. Die relevanten Kosten sind Arbeitszeit, Reviewzeit und die Kosten falscher Entscheidungen. Ein schlechter Index erzeugt Doppelrecherche, widersprüchliche Standards und spätere Umbauten; ein zu kompliziertes Governance-System erzeugt dagegen Pflegekosten, die bei 720 Artikeln nicht gerechtfertigt sein müssen.

Ein sinnvolles Kostenmodell misst nicht Kosten pro Markdown-Datei, sondern Kosten pro akzeptiertem, aktuell belegtem Lernziel. Sie setzen sich aus Autorenzeit, Reviewzeit, reproduzierbaren Labkosten und anteiliger Recherchezeit zusammen. GPU-, Cloud- oder SaaS-Kosten gehören in die jeweiligen Fachlabs. Ein Index-Lab provisioniert keine Ressourcen.

## Trade-offs, Alternativen und Anti-Patterns

| Entscheidung | Bevorzugte Wahl | Wann eine Alternative passt | Anti-Pattern |
|---|---|---|---|
| Identität | Stabile ID plus lesbarer Pfad | Ein Wiki kann zusätzlich Tags anbieten | Titel als einziger Schlüssel. |
| Status | Register als Quelle, Text als Darstellung | Issue-Tracker bei vielen externen Reviewern | Dateidatum als Fortschrittsnachweis. |
| Abhängigkeiten | Kleine, begründete requires-Kanten | Freie related-Links für Entdeckungslernen | Jede verwandte Datei als harte Voraussetzung. |
| Aktualität | Quellenrecord mit Prüfauslöser | Automatisierte Link- oder Release-Watches später | Ein allgemeines Stand-2026 ohne konkrete Quelle. |
| Automatisierung | Manifestbasierte Generierung mechanischer Listen | Datenbank bei klarer Mehrbenutzer-Anforderung | Generierte Platzhalter als fertige Lehrdateien. |
| Erfahrungsbezug | Claim-begrenzte Evidenz | Zusätzliche Arbeitsproben bei Einwilligung | Tool-Liste als umfassende Erfahrungsbehauptung. |

Ein besonders schädliches Muster ist der vollständige leere Ordner: 720 Dateien werden vorab erzeugt und die Bibliothek wirkt fertig, obwohl Inhalt, Quellen und Reviews fehlen. Die Bibliothek erstellt ausschließlich ausgearbeitete Kapitel. Der Katalog, das Manifest und dieses Register zeigen geplante Ziele ohne sie als Wissen auszugeben.

## Staff-, Principal- und Chief-Entscheidungen

| Ebene | Entscheidung | Erforderliche Evidenz | Neubewertungsauslöser |
|---|---|---|---|
| Staff | Wie Status, Review und Befunde im Team gepflegt werden. | Fehlermuster, Durchlaufzeit, Reviewqualität, Nutzerfeedback. | Wiederkehrende Statuskonflikte oder unklare Ownership. |
| Principal | Welche Querschnittsthemen einen kanonischen Owner erhalten und welche Ausnahmen erlaubt sind. | Scope-Duplikate, Schnittstellenkosten, Lehrpfadwirkung. | Neue Plattformstrategie oder anhaltende Doppelarbeit. |
| Chief | Welche Kompetenzdomänen strategisch verpflichtend sind, welche Investitionen gerechtfertigt sind und wer Risikoausnahmen akzeptiert. | Portfolioabdeckung, Marktänderung, Capability Gaps, Kosten und Risiko. | Unternehmensstrategie, Regulierung, größere Migration oder Sicherheitsereignis. |

Der Chief standardisiert nicht zwangsläufig ein Tool. Er standardisiert Entscheidungsregeln: wann ein Tool als Plattformstandard zugelassen ist, welche Evidenz eine Ausnahme benötigt, wer Lifecycle und Exit verantwortet und wie die Wirkung gemessen wird. Das schützt vor einem Katalog, der neue Technologien mit verpflichtenden Standards verwechselt.

## Production Checklist

- [x] KB-0001 stimmt mit ID, Pfad, Scope und Rollenfokus des Manifests überein.
- [x] Der Artikel enthält alle sechs Kompetenzmarker und trennt belegtes Istbild von Lernziel.
- [x] Das Statusmodell markiert diese Datei nicht voreilig als accepted.
- [x] Das Vollregister enthält 720 eindeutige IDs, Pfade und sichtbare geplante Ziele.
- [x] Das Wiederaufnahme-, Quellen- und Reviewregister werden aus dem Manifest erzeugt.
- [x] Der Lablauf ist lokal ausgeführt und seine Grenze dokumentiert.
- [ ] Eine unabhängige fachliche Prüfung bestätigt Navigation, Links und Statusmodell.
- [ ] Der offene Befund „keine angenommene Datei“ wird erst nach echter Annahme geschlossen.

Ein Rollback dieser Revision besteht darin, die erzeugte Index- und Registerrevision über die Versionshistorie zurückzunehmen und den vorherigen konsistenten Registerzustand wiederherzustellen. Ein manuelles Löschen einzelner Zeilen wäre kein kontrollierter Rollback, weil Referenzen und Status auseinanderlaufen können.

## Interviewfragen mit Antwortleitfäden

1. **Warum reicht ein Inhaltsverzeichnis nicht für eine technische Wissensbasis?**  
   Eine gute Antwort trennt Auffindbarkeit von Governance: IDs, Status, Quellen und Reviews machen Aussagen prüfbar. Rückfrage: Wie wird verhindert, dass ein Entwurf als angenommen erscheint?

2. **Warum dürfen fachliche Voraussetzungen auf spätere IDs zeigen?**  
   Nummern ordnen Redaktionsarbeit; fachliche Abhängigkeit folgt dem Mechanismus. Eine gute Antwort nennt einen konkreten Mindestbegriff und fordert einen azyklischen requires-Graph.

3. **Wann wird ein Begriff in mehreren Domains erklärt und wann nur verlinkt?**  
   Der Mechanismus hat eine kanonische Heimat. Eine zweite Datei erklärt nur die eigene Anwendung, Entscheidung oder Betriebsfolge. Eine gute Antwort nennt etwa Kafka-Brokersemantik versus Streaming Data Product.

4. **Wie messen Sie Fortschritt ohne Goodhart-Effekt?**  
   Nicht Dateien oder Wortzahl zählen, sondern angenommene Kapitel, geschlossene Befunde, reproduzierbare Labs und aktualitätsgeprüfte Entscheidungen. Frage nach: Welche Metrik könnte das Verhalten verzerren?

5. **Wie behandeln Sie Erfahrungsangaben von Lernenden in einer Lernbibliothek?**  
   Pro Claim werden Quelle, Zeitraum, Evidenzart und Grenze dokumentiert. Produktiver Betrieb, Umsetzung, Prototyp, Konzept und Lab sind unterschiedliche Aussagen. Eine Tool-Nennung allein aktiviert keinen Erfahrungsmarker.

6. **Wann wäre eine Graphdatenbank für die Bibliothek sinnvoll?**  
   Erst wenn die vorhandenen JSON- und Markdown-Workflows nachweislich bei Navigation, Impact-Analyse oder Mehrbenutzerarbeit scheitern. Die Antwort sollte Datenmigration, Schreibownership und Betriebsaufwand einschließen.

## Praktisches Lab: Index und Wiederaufnahmezustand validieren

**Ziel.** Erzeuge aus dem geprüften Manifest einen vollständigen, aber ehrlichen Navigationsstand. Dabei wird keine Cloud-Infrastruktur erstellt und kein Kapitelinhalt vorgetäuscht.

**Voraussetzungen.** Lokaler Zugriff auf das Planpaket, Node.js und Schreibrechte im vorgesehenen Wissensbasis-Root. Keine Secrets, Konten oder externen Dienste sind nötig.

**Ablauf.**

1. Stelle sicher, dass das Manifest 31 Domains und 720 Items enthält.
2. Generiere das Wiederaufnahme-, Quellen- und Reviewregister aus dem Manifest.
3. Schreibe für jede ID einen stabilen Anker, Titel, Sollpfad und Status in das Vollregister.
4. Markiere nur den aktuell ausgearbeiteten Index als technical_review; alle übrigen Einträge bleiben planned.
5. Prüfe die Anzahl der generierten Einträge, die Einzigkeit der IDs und die Differenz zwischen geplantem und angenommenem Zähler.

**Erwartete Beobachtung.** Es erscheinen 720 navigierbare ID-Einträge, 31 Domainabschnitte, null angenommene Artikel und ein offener Hinweis auf die fehlende unabhängige Prüfung. Das ist Erfolg, weil der Zustand wahr ist.

**Gegenprobe.** Ändere in einer temporären Kopie des Manifests die Anzahl eines Eintrags oder entferne eine ID. Der Initialisierungslauf muss den Fehler melden oder eine spätere Konsistenzprüfung muss die Abweichung finden. Die echte Manifestquelle wird nicht verändert.

**Auswertung und Cleanup.** Vergleiche die erzeugten Zähler mit dem Manifest und bewahre die Register als Arbeitsartefakte auf. Es gibt keine Cloud-Ressourcen oder lokalen Container zu löschen. Jede nachträgliche Änderung an einer Kapitel-ID muss über eine explizite Planrevision erfolgen.

## Dependencies, Cross-References und Quellen

**Kanonische Nachbarn.** [KB-0002](#kb-0002) konkretisiert Rollenkompetenzen. [KB-0003](#kb-0003) löst die Dependency-Hinweise in fachliche Kanten auf. [KB-0004](#kb-0004) führt Selbsteinschätzung, Evidenzgrenzen und Lernziele. [KB-0007](#kb-0007) zeigt die Lernwellen. [KB-0008](#kb-0008) verantwortet Revisionspolitik. [KB-0009](#kb-0009) definiert Labnachweise. [KB-0010](#kb-0010) vereinheitlicht Sprache und Notation.

**Verwendete Quellen, Stand 2026-09-14.**

- Geprüftes Manifest: IDs, Pfade und Status
- Masterplan: Domainquoten, Schreibreihenfolge und Lernwellen
- Artikelvertrag: Struktur, Review und Labstatus
- Kanonische Themen und Dependency-Modell

## Vollständiges Register der 720 Kapitel

Der folgende Abschnitt wird mechanisch aus dem geprüften Manifest erzeugt. planned bedeutet: Die ID ist reserviert und navigierbar, aber das Fachkapitel existiert noch nicht als angenommener Inhalt.

### 00 — Navigation, competency model & dependency graph

**10 Dateien · Lernwelle 0** — Die Navigation verbindet Nachweise und Lernziele, ohne bereits erreichte Kompetenz zu unterstellen.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0001"></a>| KB-0001 | Master Index und Wegweiser | [00-navigation-governance/01-master-index-und-wegweiser.md](./01-master-index-und-wegweiser.md) | technical_review |
<a id="kb-0002"></a>| KB-0002 | Rollen-Kompetenz-Matrix | `00-navigation-governance/02-rollen-kompetenz-matrix.md` | technical_review |
<a id="kb-0003"></a>| KB-0003 | Vollständiger Abhängigkeitsgraph | `00-navigation-governance/03-vollstaendiger-abhaengigkeitsgraph.md` | technical_review |
<a id="kb-0004"></a>| KB-0004 | Selbsteinschätzung: Istbild und Zielkompetenzen | `00-navigation-governance/04-cv-istbild-und-zielkompetenzen.md` | technical_review |
<a id="kb-0005"></a>| KB-0005 | Kompetenzmodell für Staff, Principal und Chief | `00-navigation-governance/05-kompetenzmodell-fuer-staff-principal-und-chief.md` | technical_review |
<a id="kb-0006"></a>| KB-0006 | Praktische und architektonische Lerntiefe | `00-navigation-governance/06-praktische-und-architektonische-lerntiefe.md` | technical_review |
<a id="kb-0007"></a>| KB-0007 | Lernwellen und Fortschrittssteuerung | `00-navigation-governance/07-lernwellen-und-fortschrittssteuerung.md` | technical_review |
<a id="kb-0008"></a>| KB-0008 | Revisionen und Versionierungsstrategie | `00-navigation-governance/08-revisionen-und-versionierungsstrategie.md` | technical_review |
<a id="kb-0009"></a>| KB-0009 | Laborstrategie und Beweisartefakte | `00-navigation-governance/09-laborstrategie-und-beweisartefakte.md` | technical_review |
<a id="kb-0010"></a>| KB-0010 | Glossar und Notationsregeln | `00-navigation-governance/10-glossar-und-notationsregeln.md` | technical_review |

### 01 — Target roles & career architecture

**20 Dateien · Lernwelle 1** — Projektbelege und Kompetenzziele bleiben getrennt; Titel allein ersetzen keine nachgewiesene Entscheidungsverantwortung.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0011"></a>| KB-0011 | GenAI Solution Architect als Zielrolle | `01-target-roles/01-genai-solution-architect-als-zielrolle.md` | technical_review |
<a id="kb-0012"></a>| KB-0012 | GenAI Engineer als Zielrolle | `01-target-roles/02-genai-engineer-als-zielrolle.md` | technical_review |
<a id="kb-0013"></a>| KB-0013 | AI Platform Architect als Zielrolle | `01-target-roles/03-ai-platform-architect-als-zielrolle.md` | technical_review |
<a id="kb-0014"></a>| KB-0014 | Platform Architect als Zielrolle | `01-target-roles/04-platform-architect-als-zielrolle.md` | technical_review |
<a id="kb-0015"></a>| KB-0015 | Enterprise Architect als Zielrolle | `01-target-roles/05-enterprise-architect-als-zielrolle.md` | technical_review |
<a id="kb-0016"></a>| KB-0016 | Cloud Architect als Zielrolle | `01-target-roles/06-cloud-architect-als-zielrolle.md` | technical_review |
<a id="kb-0017"></a>| KB-0017 | Solution Architect als Zielrolle | `01-target-roles/07-solution-architect-als-zielrolle.md` | technical_review |
<a id="kb-0018"></a>| KB-0018 | System Architect als Zielrolle | `01-target-roles/08-system-architect-als-zielrolle.md` | technical_review |
<a id="kb-0019"></a>| KB-0019 | Software Architect als Zielrolle | `01-target-roles/09-software-architect-als-zielrolle.md` | technical_review |
<a id="kb-0020"></a>| KB-0020 | MLOps Architect als Zielrolle | `01-target-roles/10-mlops-architect-als-zielrolle.md` | technical_review |
<a id="kb-0021"></a>| KB-0021 | LLMOps Architect als Zielrolle | `01-target-roles/11-llmops-architect-als-zielrolle.md` | technical_review |
<a id="kb-0022"></a>| KB-0022 | Staff Engineer als Zielrolle | `01-target-roles/12-staff-engineer-als-zielrolle.md` | technical_review |
<a id="kb-0023"></a>| KB-0023 | Principal Engineer als Zielrolle | `01-target-roles/13-principal-engineer-als-zielrolle.md` | technical_review |
<a id="kb-0024"></a>| KB-0024 | Distinguished Engineer als Rollenmodell | `01-target-roles/14-distinguished-engineer-als-rollenmodell.md` | technical_review |
<a id="kb-0025"></a>| KB-0025 | Chief Architect als Zielrolle | `01-target-roles/15-chief-architect-als-zielrolle.md` | technical_review |
<a id="kb-0026"></a>| KB-0026 | Grenzen zwischen Enterprise, Solution und Platform | `01-target-roles/16-grenzen-zwischen-enterprise-solution-und-platform.md` | technical_review |
<a id="kb-0027"></a>| KB-0027 | Architekturartefakte nach Rollenbedarf | `01-target-roles/17-architekturartefakte-nach-rollenbedarf.md` | technical_review |
<a id="kb-0028"></a>| KB-0028 | Stakeholdermodelle für Architekturrollen | `01-target-roles/18-stakeholdermodelle-fuer-architekturrollen.md` | technical_review |
<a id="kb-0029"></a>| KB-0029 | Interviewanforderungen der Zielrollen | `01-target-roles/19-interviewanforderungen-der-zielrollen.md` | technical_review |
<a id="kb-0030"></a>| KB-0030 | Roadmap für den Rollenübergang | `01-target-roles/20-roadmap-fuer-den-rollenuebergang.md` | technical_review |

### 02 — Computer systems, Linux & OS foundations

**18 Dateien · Lernwelle 1** — Die Anschlusswirkung auf Container und Anwendungsprozesse steht im Vordergrund, keine Kernel-Entwicklerausbildung.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0031"></a>| KB-0031 | Linux Kernel und Systemaufrufe | `02-linux-systems/01-linux-kernel-und-systemaufrufe.md` | technical_review |
<a id="kb-0032"></a>| KB-0032 | Prozesse und Lebenszyklen | `02-linux-systems/02-prozesse-und-lebenszyklen.md` | technical_review |
<a id="kb-0033"></a>| KB-0033 | Threads und Parallelität | `02-linux-systems/03-threads-und-parallelitaet.md` | technical_review |
<a id="kb-0034"></a>| KB-0034 | Virtueller Speicher und Paging | `02-linux-systems/04-virtueller-speicher-und-paging.md` | technical_review |
<a id="kb-0035"></a>| KB-0035 | Dateisysteme und Persistenzpfade | `02-linux-systems/05-dateisysteme-und-persistenzpfade.md` | technical_review |
<a id="kb-0036"></a>| KB-0036 | Sockets und Netzwerk-I/O | `02-linux-systems/06-sockets-und-netzwerk-i-o.md` | technical_review |
<a id="kb-0037"></a>| KB-0037 | Namespaces und Isolation | `02-linux-systems/07-namespaces-und-isolation.md` | technical_review |
<a id="kb-0038"></a>| KB-0038 | Cgroups und Ressourcenbegrenzung | `02-linux-systems/08-cgroups-und-ressourcenbegrenzung.md` | technical_review |
<a id="kb-0039"></a>| KB-0039 | Linux-Netzwerkstack und Paketpfade | `02-linux-systems/09-linux-netzwerkstack-und-paketpfade.md` | technical_review |
<a id="kb-0040"></a>| KB-0040 | Systemd und Dienstverwaltung | `02-linux-systems/10-systemd-und-dienstverwaltung.md` | technical_review |
<a id="kb-0041"></a>| KB-0041 | Signale und kontrolliertes Herunterfahren | `02-linux-systems/11-signale-und-kontrolliertes-herunterfahren.md` | technical_review |
<a id="kb-0042"></a>| KB-0042 | CPU-Scheduling und Lastverteilung | `02-linux-systems/12-cpu-scheduling-und-lastverteilung.md` | technical_review |
<a id="kb-0043"></a>| KB-0043 | NUMA und Speicherlokalität | `02-linux-systems/13-numa-und-speicherlokalitaet.md` | technical_review |
<a id="kb-0044"></a>| KB-0044 | Block-I/O und Engpässe | `02-linux-systems/14-block-i-o-und-engpaesse.md` | technical_review |
<a id="kb-0045"></a>| KB-0045 | EBPF und Kernelbeobachtung | `02-linux-systems/15-ebpf-und-kernelbeobachtung.md` | technical_review |
<a id="kb-0046"></a>| KB-0046 | Linux-Fehlersuche und Performance-Debugging | `02-linux-systems/16-linux-fehlersuche-und-performance-debugging.md` | technical_review |
<a id="kb-0047"></a>| KB-0047 | Linux-Sicherheitsgrundlagen | `02-linux-systems/17-linux-sicherheitsgrundlagen.md` | technical_review |
<a id="kb-0048"></a>| KB-0048 | Container als Betriebssystemsubstrat | `02-linux-systems/18-container-als-betriebssystemsubstrat.md` | technical_review |

### 03 — Networking foundations & protocols

**28 Dateien · Lernwelle 2** — Paketmechanismen werden am Host erklärt; unternehmensweite Routing-Policy bleibt im Enterprise-Networking-Track.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0049"></a>| KB-0049 | OSI und TCP-IP als Analysemodelle | `03-network-foundations/01-osi-und-tcp-ip-als-analysemodelle.md` | technical_review |
<a id="kb-0050"></a>| KB-0050 | Ethernet und MAC-Weiterleitung | `03-network-foundations/02-ethernet-und-mac-weiterleitung.md` | technical_review |
<a id="kb-0051"></a>| KB-0051 | ARP und Neighbor Discovery | `03-network-foundations/03-arp-und-neighbor-discovery.md` | technical_review |
<a id="kb-0052"></a>| KB-0052 | IPv4-Adressierung | `03-network-foundations/04-ipv4-adressierung.md` | technical_review |
<a id="kb-0053"></a>| KB-0053 | IPv6-Adressierung und Übergang | `03-network-foundations/05-ipv6-adressierung-und-uebergang.md` | technical_review |
<a id="kb-0054"></a>| KB-0054 | Subnetting und CIDR | `03-network-foundations/06-subnetting-und-cidr.md` | technical_review |
<a id="kb-0055"></a>| KB-0055 | ICMP und Pfadfehler | `03-network-foundations/07-icmp-und-pfadfehler.md` | technical_review |
<a id="kb-0056"></a>| KB-0056 | TCP-Verbindungen und Überlastkontrolle | `03-network-foundations/08-tcp-verbindungen-und-ueberlastkontrolle.md` | technical_review |
<a id="kb-0057"></a>| KB-0057 | UDP und Datagrammverhalten | `03-network-foundations/09-udp-und-datagrammverhalten.md` | technical_review |
<a id="kb-0058"></a>| KB-0058 | DNS-Auflösung und Caches | `03-network-foundations/10-dns-aufloesung-und-caches.md` | technical_review |
<a id="kb-0059"></a>| KB-0059 | DHCP und Adressvergabe | `03-network-foundations/11-dhcp-und-adressvergabe.md` | technical_review |
<a id="kb-0060"></a>| KB-0060 | NTP und Zeitsynchronisation | `03-network-foundations/12-ntp-und-zeitsynchronisation.md` | technical_review |
<a id="kb-0061"></a>| KB-0061 | VLAN und Broadcast-Segmentierung | `03-network-foundations/13-vlan-und-broadcast-segmentierung.md` | technical_review |
<a id="kb-0062"></a>| KB-0062 | Trunks und VLAN-Transport | `03-network-foundations/14-trunks-und-vlan-transport.md` | technical_review |
<a id="kb-0063"></a>| KB-0063 | STP und Schleifenvermeidung | `03-network-foundations/15-stp-und-schleifenvermeidung.md` | technical_review |
<a id="kb-0064"></a>| KB-0064 | Routingtabellen und Weiterleitung | `03-network-foundations/16-routingtabellen-und-weiterleitung.md` | technical_review |
<a id="kb-0065"></a>| KB-0065 | NAT und Verbindungszustand | `03-network-foundations/17-nat-und-verbindungszustand.md` | technical_review |
<a id="kb-0066"></a>| KB-0066 | ACL und Paketfilterlogik | `03-network-foundations/18-acl-und-paketfilterlogik.md` | technical_review |
<a id="kb-0067"></a>| KB-0067 | TLS-Verbindungen und Zertifikatsprüfung | `03-network-foundations/19-tls-verbindungen-und-zertifikatspruefung.md` | technical_review |
<a id="kb-0068"></a>| KB-0068 | HTTP-1.1 und Verbindungsnutzung | `03-network-foundations/20-http-1-1-und-verbindungsnutzung.md` | technical_review |
<a id="kb-0069"></a>| KB-0069 | HTTP-2 und Multiplexing | `03-network-foundations/21-http-2-und-multiplexing.md` | technical_review |
<a id="kb-0070"></a>| KB-0070 | HTTP-3 und Webtransport | `03-network-foundations/22-http-3-und-webtransport.md` | technical_review |
<a id="kb-0071"></a>| KB-0071 | QUIC und Transportmigration | `03-network-foundations/23-quic-und-transportmigration.md` | technical_review |
<a id="kb-0072"></a>| KB-0072 | Forward und Reverse Proxies | `03-network-foundations/24-forward-und-reverse-proxies.md` | technical_review |
<a id="kb-0073"></a>| KB-0073 | Load Balancing auf Layer 4 und 7 | `03-network-foundations/25-load-balancing-auf-layer-4-und-7.md` | technical_review |
<a id="kb-0074"></a>| KB-0074 | Paketmitschnitte mit Wireshark und Tcpdump | `03-network-foundations/26-paketmitschnitte-mit-wireshark-und-tcpdump.md` | technical_review |
<a id="kb-0075"></a>| KB-0075 | Netzwerkdiagnose entlang des Anfragepfads | `03-network-foundations/27-netzwerkdiagnose-entlang-des-anfragepfads.md` | technical_review |
<a id="kb-0076"></a>| KB-0076 | MTU, Fragmentierung und QoS-Grundlagen | `03-network-foundations/28-mtu-fragmentierung-und-qos-grundlagen.md` | technical_review |

### 04 — Enterprise networking, SDN & network automation

**24 Dateien · Lernwelle 2** — Der Schwerpunkt ist der überprüfbare Betrieb unternehmensweiter Netze; allgemeine Paketgrundlagen werden nur referenziert.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0077"></a>| KB-0077 | OSPF und interne Konvergenz | `04-enterprise-networking/01-ospf-und-interne-konvergenz.md` | technical_review |
<a id="kb-0078"></a>| KB-0078 | BGP-Policy und Route Reflection | `04-enterprise-networking/02-bgp-policy-und-route-reflection.md` | technical_review |
<a id="kb-0079"></a>| KB-0079 | VRF und Routing-Isolation | `04-enterprise-networking/03-vrf-und-routing-isolation.md` | technical_review |
<a id="kb-0080"></a>| KB-0080 | MPLS und Label-Switching | `04-enterprise-networking/04-mpls-und-label-switching.md` | technical_review |
<a id="kb-0081"></a>| KB-0081 | EVPN und VXLAN-Fabrics | `04-enterprise-networking/05-evpn-und-vxlan-fabrics.md` | technical_review |
<a id="kb-0082"></a>| KB-0082 | ECMP und BFD | `04-enterprise-networking/06-ecmp-und-bfd.md` | technical_review |
<a id="kb-0083"></a>| KB-0083 | Campus-Netzarchitektur | `04-enterprise-networking/07-campus-netzarchitektur.md` | technical_review |
<a id="kb-0084"></a>| KB-0084 | Datacenter-Netzarchitektur | `04-enterprise-networking/08-datacenter-netzarchitektur.md` | technical_review |
<a id="kb-0085"></a>| KB-0085 | WAN und Standortanbindung | `04-enterprise-networking/09-wan-und-standortanbindung.md` | technical_review |
<a id="kb-0086"></a>| KB-0086 | SD-WAN und Pfadsteuerung | `04-enterprise-networking/10-sd-wan-und-pfadsteuerung.md` | technical_review |
<a id="kb-0087"></a>| KB-0087 | SDN und programmierbare Netze | `04-enterprise-networking/11-sdn-und-programmierbare-netze.md` | technical_review |
<a id="kb-0088"></a>| KB-0088 | Cloud-Netzwerkanbindung | `04-enterprise-networking/12-cloud-netzwerkanbindung.md` | technical_review |
<a id="kb-0089"></a>| KB-0089 | NetBox als Source of Truth | `04-enterprise-networking/13-netbox-als-source-of-truth.md` | technical_review |
<a id="kb-0090"></a>| KB-0090 | Nautobot und Netzwerkdatenprodukte | `04-enterprise-networking/14-nautobot-und-netzwerkdatenprodukte.md` | technical_review |
<a id="kb-0091"></a>| KB-0091 | Netzwerk und ServiceNow-Beziehungen | `04-enterprise-networking/15-netzwerk-und-servicenow-beziehungen.md` | technical_review |
<a id="kb-0092"></a>| KB-0092 | IP Fabric und Pfadvalidierung | `04-enterprise-networking/16-ip-fabric-und-pfadvalidierung.md` | technical_review |
<a id="kb-0093"></a>| KB-0093 | SNMP und Geräteüberwachung | `04-enterprise-networking/17-snmp-und-geraeteueberwachung.md` | technical_review |
<a id="kb-0094"></a>| KB-0094 | NetFlow und IPFIX | `04-enterprise-networking/18-netflow-und-ipfix.md` | technical_review |
<a id="kb-0095"></a>| KB-0095 | NETCONF, RESTCONF und YANG | `04-enterprise-networking/19-netconf-restconf-und-yang.md` | technical_review |
<a id="kb-0096"></a>| KB-0096 | GNMI und GNOI | `04-enterprise-networking/20-gnmi-und-gnoi.md` | technical_review |
<a id="kb-0097"></a>| KB-0097 | Ansible für Netzwerkänderungen | `04-enterprise-networking/21-ansible-fuer-netzwerkaenderungen.md` | technical_review |
<a id="kb-0098"></a>| KB-0098 | Python und Nornir für NetOps | `04-enterprise-networking/22-python-und-nornir-fuer-netops.md` | technical_review |
<a id="kb-0099"></a>| KB-0099 | Network Discovery und Inventarqualität | `04-enterprise-networking/23-network-discovery-und-inventarqualitaet.md` | technical_review |
<a id="kb-0100"></a>| KB-0100 | Netzwerkvalidierung und PyATS | `04-enterprise-networking/24-netzwerkvalidierung-und-pyats.md` | technical_review |

### 05 — Distributed systems & system design

**28 Dateien · Lernwelle 1** — Die Mechanismen werden produktunabhängig hergeleitet; konkrete Broker, Datenbanken und Cloud-Dienste erhalten eigene technische Artikel.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0101"></a>| KB-0101 | CAP und PACELC | `05-distributed-systems/01-cap-und-pacelc.md` | technical_review |
<a id="kb-0102"></a>| KB-0102 | Konsistenzmodelle verteilter Systeme | `05-distributed-systems/02-konsistenzmodelle-verteilter-systeme.md` | technical_review |
<a id="kb-0103"></a>| KB-0103 | Replikationsmodelle und Konflikte | `05-distributed-systems/03-replikationsmodelle-und-konflikte.md` | technical_review |
<a id="kb-0104"></a>| KB-0104 | Konsens und Quoren | `05-distributed-systems/04-konsens-und-quoren.md` | technical_review |
<a id="kb-0105"></a>| KB-0105 | Leader Election und Fencing | `05-distributed-systems/05-leader-election-und-fencing.md` | technical_review |
<a id="kb-0106"></a>| KB-0106 | Partitionierung und Datenverteilung | geplant: `05-distributed-systems/06-partitionierung-und-datenverteilung.md` | planned |
<a id="kb-0107"></a>| KB-0107 | Sharding und Mandantenplatzierung | `05-distributed-systems/07-sharding-und-mandantenplatzierung.md` | technical_review |
<a id="kb-0108"></a>| KB-0108 | Verteilte Transaktionen | `05-distributed-systems/08-verteilte-transaktionen.md` | technical_review |
<a id="kb-0109"></a>| KB-0109 | Sagas und Kompensation | `05-distributed-systems/09-sagas-und-kompensation.md` | technical_review |
<a id="kb-0110"></a>| KB-0110 | CQRS und getrennte Datenmodelle | `05-distributed-systems/10-cqrs-und-getrennte-datenmodelle.md` | technical_review |
<a id="kb-0111"></a>| KB-0111 | Event Sourcing und Rekonstruktion | `05-distributed-systems/11-event-sourcing-und-rekonstruktion.md` | technical_review |
<a id="kb-0112"></a>| KB-0112 | Zustandsautomaten und Invarianten | `05-distributed-systems/12-zustandsautomaten-und-invarianten.md` | technical_review |
<a id="kb-0113"></a>| KB-0113 | Idempotenz als Systemgarantie | `05-distributed-systems/13-idempotenz-als-systemgarantie.md` | technical_review |
<a id="kb-0114"></a>| KB-0114 | Retries und Wiederholungsstürme | `05-distributed-systems/14-retries-und-wiederholungsstuerme.md` | technical_review |
<a id="kb-0115"></a>| KB-0115 | Timeouts und Deadline-Budgets | `05-distributed-systems/15-timeouts-und-deadline-budgets.md` | technical_review |
<a id="kb-0116"></a>| KB-0116 | Circuit Breaker und Fehlereindämmung | `05-distributed-systems/16-circuit-breaker-und-fehlereindaemmung.md` | technical_review |
<a id="kb-0117"></a>| KB-0117 | Backpressure und Überlast | `05-distributed-systems/17-backpressure-und-ueberlast.md` | technical_review |
<a id="kb-0118"></a>| KB-0118 | Verteilte Cache-Muster | `05-distributed-systems/18-verteilte-cache-muster.md` | technical_review |
<a id="kb-0119"></a>| KB-0119 | Verteilte Locks und Leases | `05-distributed-systems/19-verteilte-locks-und-leases.md` | technical_review |
<a id="kb-0120"></a>| KB-0120 | Rate Limiting und Quotenmodelle | `05-distributed-systems/20-rate-limiting-und-quotenmodelle.md` | technical_review |
<a id="kb-0121"></a>| KB-0121 | Service Discovery und Erreichbarkeit | `05-distributed-systems/21-service-discovery-und-erreichbarkeit.md` | technical_review |
<a id="kb-0122"></a>| KB-0122 | Fehlerdomänen und Bulkheads | `05-distributed-systems/22-fehlerdomaenen-und-bulkheads.md` | technical_review |
<a id="kb-0123"></a>| KB-0123 | Multi-Region-Systementwurf | `05-distributed-systems/23-multi-region-systementwurf.md` | technical_review |
<a id="kb-0124"></a>| KB-0124 | Verfügbarkeit und Abhängigkeitsrechnung | `05-distributed-systems/24-verfuegbarkeit-und-abhaengigkeitsrechnung.md` | technical_review |
<a id="kb-0125"></a>| KB-0125 | Latenzverteilungen und Fan-out | `05-distributed-systems/25-latenzverteilungen-und-fan-out.md` | technical_review |
<a id="kb-0126"></a>| KB-0126 | Methodik für Systemdesign | `05-distributed-systems/26-methodik-fuer-systemdesign.md` | technical_review |
<a id="kb-0127"></a>| KB-0127 | Nichtfunktionale Anforderungen operationalisieren | `05-distributed-systems/27-nichtfunktionale-anforderungen-operationalisieren.md` | technical_review |
<a id="kb-0128"></a>| KB-0128 | Trade-off-Modelle für Systementscheidungen | `05-distributed-systems/28-trade-off-modelle-fuer-systementscheidungen.md` | technical_review |

### 06 — Software architecture, DDD & architecture patterns

**24 Dateien · Lernwelle 1** — Entwurfsgrenzen und Änderungsfolgen sind kanonisch hier; konkrete Laufzeitprodukte und Organisationsprogramme werden nur angeschlossen.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0129"></a>| KB-0129 | Domain-Driven Design und Fachmodelle | `06-software-architecture/01-domain-driven-design-und-fachmodelle.md` | technical_review |
<a id="kb-0130"></a>| KB-0130 | Bounded Contexts und Context Maps | `06-software-architecture/02-bounded-contexts-und-context-maps.md` | technical_review |
<a id="kb-0131"></a>| KB-0131 | Aggregate und Konsistenzgrenzen | `06-software-architecture/03-aggregate-und-konsistenzgrenzen.md` | technical_review |
<a id="kb-0132"></a>| KB-0132 | Domain Events und Fachereignisse | `06-software-architecture/04-domain-events-und-fachereignisse.md` | technical_review |
<a id="kb-0133"></a>| KB-0133 | Hexagonal Architecture und Ports | `06-software-architecture/05-hexagonal-architecture-und-ports.md` | technical_review |
<a id="kb-0134"></a>| KB-0134 | Clean Architecture und Abhängigkeitsrichtung | `06-software-architecture/06-clean-architecture-und-abhaengigkeitsrichtung.md` | technical_review |
<a id="kb-0135"></a>| KB-0135 | Schichtenarchitektur und Durchgriffe | `06-software-architecture/07-schichtenarchitektur-und-durchgriffe.md` | technical_review |
<a id="kb-0136"></a>| KB-0136 | Modularer Monolith | `06-software-architecture/08-modularer-monolith.md` | technical_review |
<a id="kb-0137"></a>| KB-0137 | Microservices und Servicegrenzen | `06-software-architecture/09-microservices-und-servicegrenzen.md` | technical_review |
<a id="kb-0138"></a>| KB-0138 | Event-Driven Architecture als Strukturprinzip | `06-software-architecture/10-event-driven-architecture-als-strukturprinzip.md` | technical_review |
<a id="kb-0139"></a>| KB-0139 | Dependency Inversion und Schnittstellenbesitz | `06-software-architecture/11-dependency-inversion-und-schnittstellenbesitz.md` | technical_review |
<a id="kb-0140"></a>| KB-0140 | API-Grenzen und fachliche Verträge | `06-software-architecture/12-api-grenzen-und-fachliche-vertraege.md` | technical_review |
<a id="kb-0141"></a>| KB-0141 | Schema Evolution und Kompatibilität | `06-software-architecture/13-schema-evolution-und-kompatibilitaet.md` | technical_review |
<a id="kb-0142"></a>| KB-0142 | Architecture Fitness Functions | `06-software-architecture/14-architecture-fitness-functions.md` | technical_review |
<a id="kb-0143"></a>| KB-0143 | C4 und Architekturvisualisierung | `06-software-architecture/15-c4-und-architekturvisualisierung.md` | technical_review |
<a id="kb-0144"></a>| KB-0144 | ADR und RFC als Entscheidungsprotokolle | `06-software-architecture/16-adr-und-rfc-als-entscheidungsprotokolle.md` | technical_review |
<a id="kb-0145"></a>| KB-0145 | Architekturschulden und Änderungsreibung | `06-software-architecture/17-architekturschulden-und-aenderungsreibung.md` | technical_review |
<a id="kb-0146"></a>| KB-0146 | Architekturrefactoring und sichere Schritte | `06-software-architecture/18-architekturrefactoring-und-sichere-schritte.md` | technical_review |
<a id="kb-0147"></a>| KB-0147 | Strangler Pattern und Ablösung | `06-software-architecture/19-strangler-pattern-und-abloesung.md` | technical_review |
<a id="kb-0148"></a>| KB-0148 | Modularität und Informationsverbergung | `06-software-architecture/20-modularitaet-und-informationsverbergung.md` | technical_review |
<a id="kb-0149"></a>| KB-0149 | Kohäsion und Kopplungsarten | `06-software-architecture/21-kohaesion-und-kopplungsarten.md` | technical_review |
<a id="kb-0150"></a>| KB-0150 | Conway's Law und Architekturstruktur | `06-software-architecture/22-conway-s-law-und-architekturstruktur.md` | technical_review |
<a id="kb-0151"></a>| KB-0151 | Architekturtests und Testportfolios | `06-software-architecture/23-architekturtests-und-testportfolios.md` | technical_review |
<a id="kb-0152"></a>| KB-0152 | Architektur-Anti-Patterns | `06-software-architecture/24-architektur-anti-patterns.md` | technical_review |

### 07 — Backend, APIs & enterprise integration

**24 Dateien · Lernwelle 2** — Die Perspektive ist die konkrete Schnittstellenimplementierung; verteilte Grundgarantien und organisationsweite Governance werden referenziert.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0153"></a>| KB-0153 | Python für robuste Backends | `07-backend-integration/01-python-fuer-robuste-backends.md` | technical_review |
<a id="kb-0154"></a>| KB-0154 | FastAPI und Request-Lebenszyklen | `07-backend-integration/02-fastapi-und-request-lebenszyklen.md` | technical_review |
<a id="kb-0155"></a>| KB-0155 | TypeScript und Node.js im Backend | `07-backend-integration/03-typescript-und-node-js-im-backend.md` | technical_review |
<a id="kb-0156"></a>| KB-0156 | Asynchrone Programmierung und Abbruch | `07-backend-integration/04-asynchrone-programmierung-und-abbruch.md` | technical_review |
<a id="kb-0157"></a>| KB-0157 | REST und Ressourcenmodellierung | `07-backend-integration/05-rest-und-ressourcenmodellierung.md` | technical_review |
<a id="kb-0158"></a>| KB-0158 | GraphQL und Abfragekontrolle | `07-backend-integration/06-graphql-und-abfragekontrolle.md` | technical_review |
<a id="kb-0159"></a>| KB-0159 | GRPC und Protobuf-Verträge | `07-backend-integration/07-grpc-und-protobuf-vertraege.md` | technical_review |
<a id="kb-0160"></a>| KB-0160 | WebSockets und bidirektionale Sitzungen | `07-backend-integration/08-websockets-und-bidirektionale-sitzungen.md` | technical_review |
<a id="kb-0161"></a>| KB-0161 | SSE und AI-Client-Streaming | `07-backend-integration/09-sse-und-ai-client-streaming.md` | technical_review |
<a id="kb-0162"></a>| KB-0162 | OpenAPI und Vertragswerkzeuge | `07-backend-integration/10-openapi-und-vertragswerkzeuge.md` | technical_review |
<a id="kb-0163"></a>| KB-0163 | AsyncAPI und Ereignisschnittstellen | `07-backend-integration/11-asyncapi-und-ereignisschnittstellen.md` | technical_review |
<a id="kb-0164"></a>| KB-0164 | Authentifizierung in Backend-Diensten | `07-backend-integration/12-authentifizierung-in-backend-diensten.md` | technical_review |
<a id="kb-0165"></a>| KB-0165 | Autorisierung an API-Grenzen | `07-backend-integration/13-autorisierung-an-api-grenzen.md` | technical_review |
<a id="kb-0166"></a>| KB-0166 | API Gateways und Request-Policies | `07-backend-integration/14-api-gateways-und-request-policies.md` | technical_review |
<a id="kb-0167"></a>| KB-0167 | API-Quoten und Client-Fairness | `07-backend-integration/15-api-quoten-und-client-fairness.md` | technical_review |
<a id="kb-0168"></a>| KB-0168 | Idempotente API-Operationen | `07-backend-integration/16-idempotente-api-operationen.md` | technical_review |
<a id="kb-0169"></a>| KB-0169 | API-Versionierung und Deprecation | `07-backend-integration/17-api-versionierung-und-deprecation.md` | technical_review |
<a id="kb-0170"></a>| KB-0170 | Webhooks und Zustellverträge | `07-backend-integration/18-webhooks-und-zustellvertraege.md` | technical_review |
<a id="kb-0171"></a>| KB-0171 | API Management als Produktgrenze | `07-backend-integration/19-api-management-als-produktgrenze.md` | technical_review |
<a id="kb-0172"></a>| KB-0172 | ERP-Adapter und Integrationsgrenzen | `07-backend-integration/20-erp-adapter-und-integrationsgrenzen.md` | technical_review |
<a id="kb-0173"></a>| KB-0173 | SAP-Schnittstellen im Backend | `07-backend-integration/21-sap-schnittstellen-im-backend.md` | technical_review |
<a id="kb-0174"></a>| KB-0174 | ServiceNow-Integration über APIs | `07-backend-integration/22-servicenow-integration-ueber-apis.md` | technical_review |
<a id="kb-0175"></a>| KB-0175 | Backend-Sicherheit und Eingabegrenzen | `07-backend-integration/23-backend-sicherheit-und-eingabegrenzen.md` | technical_review |
<a id="kb-0176"></a>| KB-0176 | Integrations- und Vertragstests | `07-backend-integration/24-integrations-und-vertragstests.md` | technical_review |

### 08 — Messaging, event-driven systems & durable workflows

**18 Dateien · Lernwelle 2** — Brokermechanik und Prozessfortschritt sind kanonisch hier; Data Products und Geschäftsdomänen nutzen diese Garantien über Querverweise.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0177"></a>| KB-0177 | Queues und Logs im Vergleich | `08-messaging-workflows/01-queues-und-logs-im-vergleich.md` | technical_review |
<a id="kb-0178"></a>| KB-0178 | Zustellsemantik und Verarbeitungsgarantien | `08-messaging-workflows/02-zustellsemantik-und-verarbeitungsgarantien.md` | technical_review |
<a id="kb-0179"></a>| KB-0179 | Kafka und partitionierte Ereignislogs | `08-messaging-workflows/03-kafka-und-partitionierte-ereignislogs.md` | technical_review |
<a id="kb-0180"></a>| KB-0180 | RabbitMQ und Routingtopologien | `08-messaging-workflows/04-rabbitmq-und-routingtopologien.md` | technical_review |
<a id="kb-0181"></a>| KB-0181 | NATS und JetStream | `08-messaging-workflows/05-nats-und-jetstream.md` | technical_review |
<a id="kb-0182"></a>| KB-0182 | Amazon SQS und SNS | `08-messaging-workflows/06-amazon-sqs-und-sns.md` | technical_review |
<a id="kb-0183"></a>| KB-0183 | Azure Service Bus | `08-messaging-workflows/07-azure-service-bus.md` | technical_review |
<a id="kb-0184"></a>| KB-0184 | Azure Event Hubs | `08-messaging-workflows/08-azure-event-hubs.md` | technical_review |
<a id="kb-0185"></a>| KB-0185 | Google Pub/Sub | `08-messaging-workflows/09-google-pub-sub.md` | technical_review |
<a id="kb-0186"></a>| KB-0186 | Consumer Groups und Partitionseigentum | `08-messaging-workflows/10-consumer-groups-und-partitionseigentum.md` | technical_review |
<a id="kb-0187"></a>| KB-0187 | Ordering und Ereigniszeit | `08-messaging-workflows/11-ordering-und-ereigniszeit.md` | technical_review |
<a id="kb-0188"></a>| KB-0188 | Dead Letter Queues und Reparaturpfade | `08-messaging-workflows/12-dead-letter-queues-und-reparaturpfade.md` | technical_review |
<a id="kb-0189"></a>| KB-0189 | Outbox und Inbox | `08-messaging-workflows/13-outbox-und-inbox.md` | technical_review |
<a id="kb-0190"></a>| KB-0190 | CDC als Ereignisbrücke | `08-messaging-workflows/14-cdc-als-ereignisbruecke.md` | technical_review |
<a id="kb-0191"></a>| KB-0191 | Temporal und deterministische Workflows | `08-messaging-workflows/15-temporal-und-deterministische-workflows.md` | technical_review |
<a id="kb-0192"></a>| KB-0192 | Durable Workflows und Wartezustände | `08-messaging-workflows/16-durable-workflows-und-wartezustaende.md` | technical_review |
<a id="kb-0193"></a>| KB-0193 | Workflow-Retries und Recovery | `08-messaging-workflows/17-workflow-retries-und-recovery.md` | technical_review |
<a id="kb-0194"></a>| KB-0194 | Schema Registry und Stream-Grenzen | `08-messaging-workflows/18-schema-registry-und-stream-grenzen.md` | technical_review |

### 09 — Databases, storage, search & caching

**24 Dateien · Lernwelle 2** — Speichermechanik und Datenhaltung sind kanonisch hier; Retrieval-Pipelines und Kubernetes-Orchestrierung werden in ihren eigenen Domains vertieft.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0195"></a>| KB-0195 | PostgreSQL und interne Datenpfade | `09-databases-storage/01-postgresql-und-interne-datenpfade.md` | technical_review |
<a id="kb-0196"></a>| KB-0196 | Indizes und Zugriffskosten | `09-databases-storage/02-indizes-und-zugriffskosten.md` | technical_review |
<a id="kb-0197"></a>| KB-0197 | Query Planner und SQL-Analyse | `09-databases-storage/03-query-planner-und-sql-analyse.md` | technical_review |
<a id="kb-0198"></a>| KB-0198 | Datenbanktransaktionen und Isolation | `09-databases-storage/04-datenbanktransaktionen-und-isolation.md` | technical_review |
<a id="kb-0199"></a>| KB-0199 | Datenbankreplikation und Read Replicas | `09-databases-storage/05-datenbankreplikation-und-read-replicas.md` | technical_review |
<a id="kb-0200"></a>| KB-0200 | Tabellenpartitionierung und Datenpflege | `09-databases-storage/06-tabellenpartitionierung-und-datenpflege.md` | technical_review |
<a id="kb-0201"></a>| KB-0201 | Redis und In-Memory-Datenstrukturen | `09-databases-storage/07-redis-und-in-memory-datenstrukturen.md` | technical_review |
<a id="kb-0202"></a>| KB-0202 | Cachebetrieb und Invalidierungspraxis | `09-databases-storage/08-cachebetrieb-und-invalidierungspraxis.md` | technical_review |
<a id="kb-0203"></a>| KB-0203 | Elasticsearch und OpenSearch | `09-databases-storage/09-elasticsearch-und-opensearch.md` | technical_review |
<a id="kb-0204"></a>| KB-0204 | Graphdatenbanken und Traversierung | `09-databases-storage/10-graphdatenbanken-und-traversierung.md` | technical_review |
<a id="kb-0205"></a>| KB-0205 | Vektordatenbanken und ANN-Indizes | `09-databases-storage/11-vektordatenbanken-und-ann-indizes.md` | technical_review |
<a id="kb-0206"></a>| KB-0206 | NoSQL-Kategorien und Datenmodelle | `09-databases-storage/12-nosql-kategorien-und-datenmodelle.md` | technical_review |
<a id="kb-0207"></a>| KB-0207 | Distributed SQL | `09-databases-storage/13-distributed-sql.md` | technical_review |
<a id="kb-0208"></a>| KB-0208 | Object Storage | `09-databases-storage/14-object-storage.md` | technical_review |
<a id="kb-0209"></a>| KB-0209 | Block Storage | `09-databases-storage/15-block-storage.md` | technical_review |
<a id="kb-0210"></a>| KB-0210 | File Storage | `09-databases-storage/16-file-storage.md` | technical_review |
<a id="kb-0211"></a>| KB-0211 | Ceph und verteilte Speicherpools | `09-databases-storage/17-ceph-und-verteilte-speicherpools.md` | technical_review |
<a id="kb-0212"></a>| KB-0212 | Kubernetes-Speicherentscheidungen | `09-databases-storage/18-kubernetes-speicherentscheidungen.md` | technical_review |
<a id="kb-0213"></a>| KB-0213 | Backup und Restore auf Datenebene | `09-databases-storage/19-backup-und-restore-auf-datenebene.md` | technical_review |
<a id="kb-0214"></a>| KB-0214 | Datenhaltbarkeit und Korruptionsschutz | `09-databases-storage/20-datenhaltbarkeit-und-korruptionsschutz.md` | technical_review |
<a id="kb-0215"></a>| KB-0215 | Datenbank-Hochverfügbarkeit | `09-databases-storage/21-datenbank-hochverfuegbarkeit.md` | technical_review |
<a id="kb-0216"></a>| KB-0216 | Storage-Performance und Benchmarks | `09-databases-storage/22-storage-performance-und-benchmarks.md` | technical_review |
<a id="kb-0217"></a>| KB-0217 | Zeitreihendatenbanken und zeitbasierte Suche | `09-databases-storage/23-zeitreihendatenbanken.md` | technical_review |
<a id="kb-0218"></a>| KB-0218 | Datenlebenszyklus im Speicher | `09-databases-storage/24-datenlebenszyklus-im-speicher.md` | technical_review |

### 10 — Data engineering & enterprise data platforms

**22 Dateien · Lernwelle 7** — Datenprodukte und Verarbeitungspipelines stehen im Mittelpunkt; Broker- und Datenbankinternas werden über kanonische Artikel angeschlossen.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0219"></a>| KB-0219 | ETL und ELT | `10-data-platforms/01-etl-und-elt.md` | technical_review |
<a id="kb-0220"></a>| KB-0220 | Kafka für Streaming Data Products | `10-data-platforms/02-kafka-fuer-streaming-data-products.md` | technical_review |
<a id="kb-0221"></a>| KB-0221 | Flink und zustandsbehaftete Streams | `10-data-platforms/03-flink-und-zustandsbehaftete-streams.md` | technical_review |
<a id="kb-0222"></a>| KB-0222 | Spark und verteilte Verarbeitung | `10-data-platforms/04-spark-und-verteilte-verarbeitung.md` | technical_review |
<a id="kb-0223"></a>| KB-0223 | Dbt und analytische Modelle | `10-data-platforms/05-dbt-und-analytische-modelle.md` | technical_review |
<a id="kb-0224"></a>| KB-0224 | Airflow und Workflow-Scheduling | `10-data-platforms/06-airflow-und-workflow-scheduling.md` | technical_review |
<a id="kb-0225"></a>| KB-0225 | Dagster und datenorientierte Orchestrierung | `10-data-platforms/07-dagster-und-datenorientierte-orchestrierung.md` | technical_review |
<a id="kb-0226"></a>| KB-0226 | Debezium und CDC-Betrieb | `10-data-platforms/08-debezium-und-cdc-betrieb.md` | technical_review |
<a id="kb-0227"></a>| KB-0227 | Parquet und spaltenorientierte Dateien | `10-data-platforms/09-parquet-und-spaltenorientierte-dateien.md` | technical_review |
<a id="kb-0228"></a>| KB-0228 | Apache Iceberg | `10-data-platforms/10-apache-iceberg.md` | technical_review |
<a id="kb-0229"></a>| KB-0229 | Delta Lake | `10-data-platforms/11-delta-lake.md` | technical_review |
<a id="kb-0230"></a>| KB-0230 | Lakehouse-Architektur | `10-data-platforms/12-lakehouse-architektur.md` | technical_review |
<a id="kb-0231"></a>| KB-0231 | Data Warehouses | `10-data-platforms/13-data-warehouses.md` | technical_review |
<a id="kb-0232"></a>| KB-0232 | Microsoft Fabric als Datenplattform | `10-data-platforms/14-microsoft-fabric-als-datenplattform.md` | technical_review |
<a id="kb-0233"></a>| KB-0233 | BigQuery als Analyseplattform | `10-data-platforms/15-bigquery-als-analyseplattform.md` | technical_review |
<a id="kb-0234"></a>| KB-0234 | Snowflake und Databricks im Vergleich | `10-data-platforms/16-snowflake-und-databricks-im-vergleich.md` | technical_review |
<a id="kb-0235"></a>| KB-0235 | Data Contracts | `10-data-platforms/17-data-contracts.md` | technical_review |
<a id="kb-0236"></a>| KB-0236 | Data Lineage | `10-data-platforms/18-data-lineage.md` | technical_review |
<a id="kb-0237"></a>| KB-0237 | Datenkataloge und Auffindbarkeit | `10-data-platforms/19-datenkataloge-und-auffindbarkeit.md` | technical_review |
<a id="kb-0238"></a>| KB-0238 | Microsoft Purview und Metadatengovernance | `10-data-platforms/20-microsoft-purview-und-metadatengovernance.md` | technical_review |
<a id="kb-0239"></a>| KB-0239 | Data Mesh und Datenprodukte | `10-data-platforms/21-data-mesh-und-datenprodukte.md` | technical_review |
<a id="kb-0240"></a>| KB-0240 | Datenqualität und Pipeline-Abnahme | `10-data-platforms/22-datenqualitaet-und-pipeline-abnahme.md` | technical_review |

### 11 — GenAI / LLM solution architecture

**34 Dateien · Lernwelle 3** — Der Fokus ist die vollständige AI-Anwendung; Agentenorchestrierung, Retrievalmechanik und Serving-Kernel bleiben eigenen Domains zugeordnet.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0241"></a>| KB-0241 | Transformer für Lösungsarchitekten | `11-genai-architecture/01-transformer-fuer-loesungsarchitekten.md` | technical_review |
<a id="kb-0242"></a>| KB-0242 | Tokenisierung und Tokenbudgets | `11-genai-architecture/02-tokenisierung-und-tokenbudgets.md` | technical_review |
<a id="kb-0243"></a>| KB-0243 | Kontextfenster und Informationsgrenzen | `11-genai-architecture/03-kontextfenster-und-informationsgrenzen.md` | technical_review |
<a id="kb-0244"></a>| KB-0244 | Prompt Design und Anweisungsstruktur | `11-genai-architecture/04-prompt-design-und-anweisungsstruktur.md` | technical_review |
<a id="kb-0245"></a>| KB-0245 | Context Engineering | `11-genai-architecture/05-context-engineering.md` | technical_review |
<a id="kb-0246"></a>| KB-0246 | Strukturierte Modellausgaben | `11-genai-architecture/06-strukturierte-modellausgaben.md` | technical_review |
<a id="kb-0247"></a>| KB-0247 | Function Calling und Werkzeugverträge | `11-genai-architecture/07-function-calling-und-werkzeugvertraege.md` | technical_review |
<a id="kb-0248"></a>| KB-0248 | Multimodale Modellintegration | `11-genai-architecture/08-multimodale-modellintegration.md` | technical_review |
<a id="kb-0249"></a>| KB-0249 | Reasoning Models und Aufgabenwahl | `11-genai-architecture/09-reasoning-models-und-aufgabenwahl.md` | technical_review |
<a id="kb-0250"></a>| KB-0250 | Model Gateways | `11-genai-architecture/10-model-gateways.md` | technical_review |
<a id="kb-0251"></a>| KB-0251 | Providerabstraktion und Portabilität | `11-genai-architecture/11-providerabstraktion-und-portabilitaet.md` | technical_review |
<a id="kb-0252"></a>| KB-0252 | Modellrouting und Aufgabenklassen | `11-genai-architecture/12-modellrouting-und-aufgabenklassen.md` | technical_review |
<a id="kb-0253"></a>| KB-0253 | Fallback und degradierte AI-Antworten | `11-genai-architecture/13-fallback-und-degradierte-ai-antworten.md` | technical_review |
<a id="kb-0254"></a>| KB-0254 | LLM-Response-Caching | `11-genai-architecture/14-llm-response-caching.md` | technical_review |
<a id="kb-0255"></a>| KB-0255 | Qualität, Latenz und Kosten | `11-genai-architecture/15-qualitaet-latenz-und-kosten.md` | technical_review |
<a id="kb-0256"></a>| KB-0256 | Lokale und verwaltete Inferenz | `11-genai-architecture/16-lokale-und-verwaltete-inferenz.md` | technical_review |
<a id="kb-0257"></a>| KB-0257 | GenAI in Unternehmensprozessen | `11-genai-architecture/17-genai-in-unternehmensprozessen.md` | technical_review |
<a id="kb-0258"></a>| KB-0258 | AI Gateways und Inhalts-Policies | `11-genai-architecture/18-ai-gateways-und-inhalts-policies.md` | technical_review |
<a id="kb-0259"></a>| KB-0259 | Guardrails und mehrstufige Kontrolle | `11-genai-architecture/19-guardrails-und-mehrstufige-kontrolle.md` | technical_review |
<a id="kb-0260"></a>| KB-0260 | Prompt Injection und Instruktionsgrenzen | `11-genai-architecture/20-prompt-injection-und-instruktionsgrenzen.md` | technical_review |
<a id="kb-0261"></a>| KB-0261 | Datenabfluss und Privacy in AI-Anwendungen | `11-genai-architecture/21-datenabfluss-und-privacy-in-ai-anwendungen.md` | technical_review |
<a id="kb-0262"></a>| KB-0262 | Sicherheit von AI-Werkzeugen | `11-genai-architecture/22-sicherheit-von-ai-werkzeugen.md` | technical_review |
<a id="kb-0263"></a>| KB-0263 | Mandantenisolation für GenAI | `11-genai-architecture/23-mandantenisolation-fuer-genai.md` | technical_review |
<a id="kb-0264"></a>| KB-0264 | Human Gates in AI-Produkten | `11-genai-architecture/24-human-gates-in-ai-produkten.md` | technical_review |
<a id="kb-0265"></a>| KB-0265 | Modellauswahl durch Aufgabenevidenz | `11-genai-architecture/25-modellauswahl-durch-aufgabenevidenz.md` | technical_review |
<a id="kb-0266"></a>| KB-0266 | GenAI Build-versus-Buy | `11-genai-architecture/26-genai-build-versus-buy.md` | technical_review |
<a id="kb-0267"></a>| KB-0267 | GenAI-Referenzarchitekturen | `11-genai-architecture/27-genai-referenzarchitekturen.md` | technical_review |
<a id="kb-0268"></a>| KB-0268 | Verwaltete Modellplattformen | `11-genai-architecture/28-verwaltete-modellplattformen.md` | technical_review |
<a id="kb-0269"></a>| KB-0269 | Enterprise Chat und AI-UX | `11-genai-architecture/29-enterprise-chat-und-ai-ux.md` | technical_review |
<a id="kb-0270"></a>| KB-0270 | Reasoning-Architekturen mit Verifikation | `11-genai-architecture/30-reasoning-architekturen-mit-verifikation.md` | technical_review |
<a id="kb-0271"></a>| KB-0271 | Voice-AI und Echtzeitinteraktion | `11-genai-architecture/31-voice-ai-und-echtzeitinteraktion.md` | technical_review |
<a id="kb-0272"></a>| KB-0272 | Beobachtbarkeit von AI-Anwendungen | `11-genai-architecture/32-beobachtbarkeit-von-ai-anwendungen.md` | technical_review |
<a id="kb-0273"></a>| KB-0273 | Threat Models für GenAI-Lösungen | `11-genai-architecture/33-threat-models-fuer-genai-loesungen.md` | technical_review |
<a id="kb-0274"></a>| KB-0274 | GenAI-Betriebsmodell und Ownership | `11-genai-architecture/34-genai-betriebsmodell-und-ownership.md` | technical_review |

### 12 — Agentic AI & autonomous systems

**30 Dateien · Lernwelle 3** — Deterministische Zustände begrenzen probabilistische Auswahl; Aktionen benötigen minimale Autorität und nachvollziehbare Recovery-Grenzen im Enterprise-Einsatz.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0275"></a>| KB-0275 | Agentenschleifen und Zustandsübergänge | `12-agentic-ai/01-agentenschleifen-und-zustandsuebergaenge.md` | technical_review |
<a id="kb-0276"></a>| KB-0276 | Planner-Executor-Architekturen | `12-agentic-ai/02-planner-executor-architekturen.md` | technical_review |
<a id="kb-0277"></a>| KB-0277 | Supervisor und Aufgabenrouting | `12-agentic-ai/03-supervisor-und-aufgabenrouting.md` | technical_review |
<a id="kb-0278"></a>| KB-0278 | Multi-Agent-Zusammenarbeit | `12-agentic-ai/04-multi-agent-zusammenarbeit.md` | technical_review |
<a id="kb-0279"></a>| KB-0279 | LangGraph und explizite Graphzustände | `12-agentic-ai/05-langgraph-und-explizite-graphzustaende.md` | technical_review |
<a id="kb-0280"></a>| KB-0280 | AutoGen als Orchestrierungskonzept | `12-agentic-ai/06-autogen-als-orchestrierungskonzept.md` | technical_review |
<a id="kb-0281"></a>| KB-0281 | Semantic Kernel und Enterprise-Orchestrierung | `12-agentic-ai/07-semantic-kernel-und-enterprise-orchestrierung.md` | technical_review |
<a id="kb-0282"></a>| KB-0282 | OpenAI Agents SDK und Harness | `12-agentic-ai/08-openai-agents-sdk-und-harness.md` | technical_review |
<a id="kb-0283"></a>| KB-0283 | Tool Use und Ergebnisverträge | `12-agentic-ai/09-tool-use-und-ergebnisvertraege.md` | technical_review |
<a id="kb-0284"></a>| KB-0284 | Dauerhafter Agentenzustand | `12-agentic-ai/10-dauerhafter-agentenzustand.md` | technical_review |
<a id="kb-0285"></a>| KB-0285 | Checkpoints und Wiederaufnahme | `12-agentic-ai/11-checkpoints-und-wiederaufnahme.md` | technical_review |
<a id="kb-0286"></a>| KB-0286 | Agenten-Sandboxing | `12-agentic-ai/12-agenten-sandboxing.md` | technical_review |
<a id="kb-0287"></a>| KB-0287 | Agent Identity und Service Identity | `12-agentic-ai/13-agent-identity-und-service-identity.md` | technical_review |
<a id="kb-0288"></a>| KB-0288 | Autorität und minimale Berechtigungen | `12-agentic-ai/14-autoritaet-und-minimale-berechtigungen.md` | technical_review |
<a id="kb-0289"></a>| KB-0289 | Human Gates für Agentenaktionen | `12-agentic-ai/15-human-gates-fuer-agentenaktionen.md` | technical_review |
<a id="kb-0290"></a>| KB-0290 | Autonome Coding Agents | `12-agentic-ai/16-autonome-coding-agents.md` | technical_review |
<a id="kb-0291"></a>| KB-0291 | Parallele Agentenworker | `12-agentic-ai/17-parallele-agentenworker.md` | technical_review |
<a id="kb-0292"></a>| KB-0292 | MCP und Enterprise-Bereitstellung | `12-agentic-ai/18-mcp-und-enterprise-bereitstellung.md` | technical_review |
<a id="kb-0293"></a>| KB-0293 | A2A und Interoperabilität | `12-agentic-ai/19-a2a-und-interoperabilitaet.md` | technical_review |
<a id="kb-0294"></a>| KB-0294 | Agent Discovery, Cards und Registries | `12-agentic-ai/20-agent-discovery-cards-und-registries.md` | technical_review |
<a id="kb-0295"></a>| KB-0295 | Vertrauensgrenzen zwischen Agenten | `12-agentic-ai/21-vertrauensgrenzen-zwischen-agenten.md` | technical_review |
<a id="kb-0296"></a>| KB-0296 | Langlebige Agententasks | `12-agentic-ai/22-langlebige-agententasks.md` | technical_review |
<a id="kb-0297"></a>| KB-0297 | Agent Memory als Laufzeitintegration | `12-agentic-ai/23-agent-memory-als-laufzeitintegration.md` | technical_review |
<a id="kb-0298"></a>| KB-0298 | Agentenorchestrierung und Prozessintegration | `12-agentic-ai/24-agentenorchestrierung-und-prozessintegration.md` | technical_review |
<a id="kb-0299"></a>| KB-0299 | Tool Permissions und Capability-Grenzen | `12-agentic-ai/25-tool-permissions-und-capability-grenzen.md` | technical_review |
<a id="kb-0300"></a>| KB-0300 | Rollback und kompensierbare Aktionen | `12-agentic-ai/26-rollback-und-kompensierbare-aktionen.md` | technical_review |
<a id="kb-0301"></a>| KB-0301 | Fehlerbehandlung und Agenten-Recovery | `12-agentic-ai/27-fehlerbehandlung-und-agenten-recovery.md` | technical_review |
<a id="kb-0302"></a>| KB-0302 | Agentenbeobachtung und Trace Replay | `12-agentic-ai/28-agentenbeobachtung-und-trace-replay.md` | technical_review |
<a id="kb-0303"></a>| KB-0303 | Agentenevaluation und Erfolgsbelege | `12-agentic-ai/29-agentenevaluation-und-erfolgsbelege.md` | technical_review |
<a id="kb-0304"></a>| KB-0304 | Verwaltete Agentenruntimes im Unternehmen | `12-agentic-ai/30-verwaltete-agentenruntimes-im-unternehmen.md` | technical_review |

### 13 — RAG, retrieval, knowledge & memory

**26 Dateien · Lernwelle 3** — Wissenszugriff und Gedächtnisqualität sind kanonisch hier; Indexinternas, allgemeine Agentensteuerung und Compliance werden über Querverweise verbunden.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0305"></a>| KB-0305 | RAG-Pipelines und Grounding | `13-retrieval-memory/01-rag-pipelines-und-grounding.md` | technical_review |
<a id="kb-0306"></a>| KB-0306 | Chunking und Dokumentstrukturen | `13-retrieval-memory/02-chunking-und-dokumentstrukturen.md` | technical_review |
<a id="kb-0307"></a>| KB-0307 | Embeddings für Retrieval | `13-retrieval-memory/03-embeddings-fuer-retrieval.md` | technical_review |
<a id="kb-0308"></a>| KB-0308 | Semantische Suche | `13-retrieval-memory/04-semantische-suche.md` | technical_review |
<a id="kb-0309"></a>| KB-0309 | Vektorspeicher für Retrieval-Pipelines | `13-retrieval-memory/05-vektorspeicher-fuer-retrieval-pipelines.md` | technical_review |
<a id="kb-0310"></a>| KB-0310 | BM25 und lexikalische Suche | `13-retrieval-memory/06-bm25-und-lexikalische-suche.md` | technical_review |
<a id="kb-0311"></a>| KB-0311 | Hybrid Retrieval | `13-retrieval-memory/07-hybrid-retrieval.md` | technical_review |
<a id="kb-0312"></a>| KB-0312 | Metadatenfilter und Zugriffsschranken | `13-retrieval-memory/08-metadatenfilter-und-zugriffsschranken.md` | technical_review |
<a id="kb-0313"></a>| KB-0313 | Query Rewriting und Expansion | `13-retrieval-memory/09-query-rewriting-und-expansion.md` | technical_review |
<a id="kb-0314"></a>| KB-0314 | Reranking und Kandidatenauswahl | `13-retrieval-memory/10-reranking-und-kandidatenauswahl.md` | technical_review |
<a id="kb-0315"></a>| KB-0315 | Retrieval-Evaluation | `13-retrieval-memory/11-retrieval-evaluation.md` | technical_review |
<a id="kb-0316"></a>| KB-0316 | Kontextzusammenstellung | `13-retrieval-memory/12-kontextzusammenstellung.md` | technical_review |
<a id="kb-0317"></a>| KB-0317 | Zitationen und Provenienz | `13-retrieval-memory/13-zitationen-und-provenienz.md` | technical_review |
<a id="kb-0318"></a>| KB-0318 | GraphRAG | `13-retrieval-memory/14-graphrag.md` | technical_review |
<a id="kb-0319"></a>| KB-0319 | Knowledge Graphs | `13-retrieval-memory/15-knowledge-graphs.md` | technical_review |
<a id="kb-0320"></a>| KB-0320 | Working Memory | `13-retrieval-memory/16-working-memory.md` | technical_review |
<a id="kb-0321"></a>| KB-0321 | Episodisches Gedächtnis | `13-retrieval-memory/17-episodisches-gedaechtnis.md` | technical_review |
<a id="kb-0322"></a>| KB-0322 | Langzeitgedächtnis | `13-retrieval-memory/18-langzeitgedaechtnis.md` | technical_review |
<a id="kb-0323"></a>| KB-0323 | Memory Consolidation | `13-retrieval-memory/19-memory-consolidation.md` | technical_review |
<a id="kb-0324"></a>| KB-0324 | Semantischer Cache | `13-retrieval-memory/20-semantischer-cache.md` | technical_review |
<a id="kb-0325"></a>| KB-0325 | Memory Poisoning | `13-retrieval-memory/21-memory-poisoning.md` | technical_review |
<a id="kb-0326"></a>| KB-0326 | Autoritätserhalt im Wissenssystem | `13-retrieval-memory/22-autoritaetserhalt-im-wissenssystem.md` | technical_review |
<a id="kb-0327"></a>| KB-0327 | Kontextkompression | `13-retrieval-memory/23-kontextkompression.md` | technical_review |
<a id="kb-0328"></a>| KB-0328 | Enterprise Search | `13-retrieval-memory/24-enterprise-search.md` | technical_review |
<a id="kb-0329"></a>| KB-0329 | Retrieval Security | `13-retrieval-memory/25-retrieval-security.md` | technical_review |
<a id="kb-0330"></a>| KB-0330 | Wissenslebenszyklus | `13-retrieval-memory/26-wissenslebenszyklus.md` | technical_review |

### 14 — ML engineering

**20 Dateien · Lernwelle 6** — Mathematische und experimentelle Grundlagen werden für Modellentscheidungen erklärt; große Forschungstrainings bleiben optionale Vertiefung ohne vorausgesetzte Produktionserfahrung.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0331"></a>| KB-0331 | Neuronale Netze und Repräsentationen | `14-ml-engineering/01-neuronale-netze-und-repraesentationen.md` | technical_review |
<a id="kb-0332"></a>| KB-0332 | Transformer-Architekturen im ML | `14-ml-engineering/02-transformer-architekturen-im-ml.md` | technical_review |
<a id="kb-0333"></a>| KB-0333 | Attention und Positionsinformation | `14-ml-engineering/03-attention-und-positionsinformation.md` | technical_review |
<a id="kb-0334"></a>| KB-0334 | Embedding-Repräsentationen im Training | `14-ml-engineering/04-embedding-repraesentationen-im-training.md` | technical_review |
<a id="kb-0335"></a>| KB-0335 | Loss Functions und Lernziele | `14-ml-engineering/05-loss-functions-und-lernziele.md` | technical_review |
<a id="kb-0336"></a>| KB-0336 | Optimierer und Gradienten | `14-ml-engineering/06-optimierer-und-gradienten.md` | technical_review |
<a id="kb-0337"></a>| KB-0337 | Trainingsloops und Checkpoints | `14-ml-engineering/07-trainingsloops-und-checkpoints.md` | technical_review |
<a id="kb-0338"></a>| KB-0338 | Fine-Tuning und Aufgabenanpassung | `14-ml-engineering/08-fine-tuning-und-aufgabenanpassung.md` | technical_review |
<a id="kb-0339"></a>| KB-0339 | PEFT und LoRA | `14-ml-engineering/09-peft-und-lora.md` | technical_review |
<a id="kb-0340"></a>| KB-0340 | Quantisierung und Genauigkeitsverluste | `14-ml-engineering/10-quantisierung-und-genauigkeitsverluste.md` | technical_review |
<a id="kb-0341"></a>| KB-0341 | ML-Inferenz und Ausführung | `14-ml-engineering/11-ml-inferenz-und-ausfuehrung.md` | technical_review |
<a id="kb-0342"></a>| KB-0342 | Batching aus Modellsicht | `14-ml-engineering/12-batching-aus-modellsicht.md` | technical_review |
<a id="kb-0343"></a>| KB-0343 | Modellbewertung und Fehlertypen | `14-ml-engineering/13-modellbewertung-und-fehlertypen.md` | technical_review |
<a id="kb-0344"></a>| KB-0344 | Kalibrierung und Unsicherheit | `14-ml-engineering/14-kalibrierung-und-unsicherheit.md` | technical_review |
<a id="kb-0345"></a>| KB-0345 | Robustheit und Verteilungsänderung | `14-ml-engineering/15-robustheit-und-verteilungsaenderung.md` | technical_review |
<a id="kb-0346"></a>| KB-0346 | Datensplits und Leakage | `14-ml-engineering/16-datensplits-und-leakage.md` | technical_review |
<a id="kb-0347"></a>| KB-0347 | Overfitting und Regularisierung | `14-ml-engineering/17-overfitting-und-regularisierung.md` | technical_review |
<a id="kb-0348"></a>| KB-0348 | Hyperparameter und Suchräume | `14-ml-engineering/18-hyperparameter-und-suchraeume.md` | technical_review |
<a id="kb-0349"></a>| KB-0349 | Experimentdesign für ML | `14-ml-engineering/19-experimentdesign-fuer-ml.md` | technical_review |
<a id="kb-0350"></a>| KB-0350 | Trade-offs von Modellarchitekturen | `14-ml-engineering/20-trade-offs-von-modellarchitekturen.md` | technical_review |

### 15 — MLOps, LLMOps & AI evaluation

**28 Dateien · Lernwelle 6** — Lebenszyklus und Qualitätsnachweise sind kanonisch hier; Modellmathematik, Serving-Kernel und allgemeiner SRE-Betrieb werden nur angebunden.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0351"></a>| KB-0351 | MLflow und Modelllebenszyklen | `15-mlops-evaluation/01-mlflow-und-modelllebenszyklen.md` | technical_review |
<a id="kb-0352"></a>| KB-0352 | Weights and Biases | `15-mlops-evaluation/02-weights-and-biases.md` | technical_review |
<a id="kb-0353"></a>| KB-0353 | DVC und Datenversionierung | `15-mlops-evaluation/03-dvc-und-datenversionierung.md` | technical_review |
<a id="kb-0354"></a>| KB-0354 | Optuna und adaptive Suche | `15-mlops-evaluation/04-optuna-und-adaptive-suche.md` | technical_review |
<a id="kb-0355"></a>| KB-0355 | Ray Tune und verteilte Experimente | `15-mlops-evaluation/05-ray-tune-und-verteilte-experimente.md` | technical_review |
<a id="kb-0356"></a>| KB-0356 | Model Registries und Freigabestatus | `15-mlops-evaluation/06-model-registries-und-freigabestatus.md` | technical_review |
<a id="kb-0357"></a>| KB-0357 | Experiment Tracking als Datenmodell | `15-mlops-evaluation/07-experiment-tracking-als-datenmodell.md` | technical_review |
<a id="kb-0358"></a>| KB-0358 | AI-Lineage und Abhängigkeiten | `15-mlops-evaluation/08-ai-lineage-und-abhaengigkeiten.md` | technical_review |
<a id="kb-0359"></a>| KB-0359 | Daten-, Modell- und Promptversionen | `15-mlops-evaluation/09-daten-modell-und-promptversionen.md` | technical_review |
<a id="kb-0360"></a>| KB-0360 | Langfuse-Instrumentierung | `15-mlops-evaluation/10-langfuse-instrumentierung.md` | technical_review |
<a id="kb-0361"></a>| KB-0361 | LangSmith und LLM-Entwicklung | `15-mlops-evaluation/11-langsmith-und-llm-entwicklung.md` | technical_review |
<a id="kb-0362"></a>| KB-0362 | Arize Phoenix und Traceanalyse | `15-mlops-evaluation/12-arize-phoenix-und-traceanalyse.md` | technical_review |
<a id="kb-0363"></a>| KB-0363 | Promptfoo und Konfigurationstests | `15-mlops-evaluation/13-promptfoo-und-konfigurationstests.md` | technical_review |
<a id="kb-0364"></a>| KB-0364 | DeepEval und Bewertungsmetriken | `15-mlops-evaluation/14-deepeval-und-bewertungsmetriken.md` | technical_review |
<a id="kb-0365"></a>| KB-0365 | Evaluationsdatensätze | `15-mlops-evaluation/15-evaluationsdatensaetze.md` | technical_review |
<a id="kb-0366"></a>| KB-0366 | Synthetische Evaluationen | `15-mlops-evaluation/16-synthetische-evaluationen.md` | technical_review |
<a id="kb-0367"></a>| KB-0367 | AI-Regressionsprüfungen | `15-mlops-evaluation/17-ai-regressionspruefungen.md` | technical_review |
<a id="kb-0368"></a>| KB-0368 | Offline- und Online-Evaluation | `15-mlops-evaluation/18-offline-und-online-evaluation.md` | technical_review |
<a id="kb-0369"></a>| KB-0369 | Drift und Qualitätsänderung | `15-mlops-evaluation/19-drift-und-qualitaetsaenderung.md` | technical_review |
<a id="kb-0370"></a>| KB-0370 | AI-Canary-Releases | `15-mlops-evaluation/20-ai-canary-releases.md` | technical_review |
<a id="kb-0371"></a>| KB-0371 | Shadow Deployments für AI | `15-mlops-evaluation/21-shadow-deployments-fuer-ai.md` | technical_review |
<a id="kb-0372"></a>| KB-0372 | Modell- und Prompt-Rollback | `15-mlops-evaluation/22-modell-und-prompt-rollback.md` | technical_review |
<a id="kb-0373"></a>| KB-0373 | Model Governance im Delivery-Prozess | `15-mlops-evaluation/23-model-governance-im-delivery-prozess.md` | technical_review |
<a id="kb-0374"></a>| KB-0374 | Reproduzierbarkeit und Umgebungskontrolle | `15-mlops-evaluation/24-reproduzierbarkeit-und-umgebungskontrolle.md` | technical_review |
<a id="kb-0375"></a>| KB-0375 | Model Cards und Nutzungsgrenzen | `15-mlops-evaluation/25-model-cards-und-nutzungsgrenzen.md` | technical_review |
<a id="kb-0376"></a>| KB-0376 | Approval Workflows für AI-Releases | `15-mlops-evaluation/26-approval-workflows-fuer-ai-releases.md` | technical_review |
<a id="kb-0377"></a>| KB-0377 | AI-Lifecycle und Stilllegung | `15-mlops-evaluation/27-ai-lifecycle-und-stilllegung.md` | technical_review |
<a id="kb-0378"></a>| KB-0378 | AI Quality Gates | `15-mlops-evaluation/28-ai-quality-gates.md` | technical_review |

### 16 — Kubernetes, containers & platform engineering

**34 Dateien · Lernwelle 4** — Cluster- und Plattformmechanik sind kanonisch hier; allgemeine Linux-, Speicher-, GitOps- und IAM-Grundlagen werden gezielt referenziert.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0379"></a>| KB-0379 | Docker und OCI | `16-kubernetes-platform/01-docker-und-oci.md` | technical_review |
<a id="kb-0380"></a>| KB-0380 | CRI und Container-Runtimes | `16-kubernetes-platform/02-cri-und-container-runtimes.md` | technical_review |
<a id="kb-0381"></a>| KB-0381 | CNI und Pod-Netzwerke | `16-kubernetes-platform/03-cni-und-pod-netzwerke.md` | technical_review |
<a id="kb-0382"></a>| KB-0382 | CSI und Volume-Lifecycle im Cluster | `16-kubernetes-platform/04-csi-volume-lifecycle.md` | technical_review |
<a id="kb-0383"></a>| KB-0383 | Kubernetes Control Plane | `16-kubernetes-platform/05-kubernetes-control-plane.md` | technical_review |
<a id="kb-0384"></a>| KB-0384 | Pods und Lebenszyklen | `16-kubernetes-platform/06-pods-und-lebenszyklen.md` | technical_review |
<a id="kb-0385"></a>| KB-0385 | Deployments und ReplicaSets | `16-kubernetes-platform/07-deployments-und-replicasets.md` | technical_review |
<a id="kb-0386"></a>| KB-0386 | StatefulSets und stabile Identität | `16-kubernetes-platform/08-statefulsets-und-stabile-identitaet.md` | technical_review |
<a id="kb-0387"></a>| KB-0387 | DaemonSets und Node-Dienste | `16-kubernetes-platform/09-daemonsets-und-node-dienste.md` | technical_review |
<a id="kb-0388"></a>| KB-0388 | Jobs und Batchausführung | `16-kubernetes-platform/10-jobs-und-batchausfuehrung.md` | technical_review |
<a id="kb-0389"></a>| KB-0389 | Services und Cluster-DNS | `16-kubernetes-platform/11-services-und-cluster-dns.md` | technical_review |
<a id="kb-0390"></a>| KB-0390 | Ingress und Gateway API | `16-kubernetes-platform/12-ingress-und-gateway-api.md` | technical_review |
<a id="kb-0391"></a>| KB-0391 | ConfigMaps und Secrets | `16-kubernetes-platform/13-configmaps-und-secrets.md` | technical_review |
<a id="kb-0392"></a>| KB-0392 | RBAC und Service Accounts | `16-kubernetes-platform/14-rbac-und-service-accounts.md` | technical_review |
<a id="kb-0393"></a>| KB-0393 | NetworkPolicy und Netzwerkisolation | `16-kubernetes-platform/15-networkpolicy-und-netzwerkisolation.md` | technical_review |
<a id="kb-0394"></a>| KB-0394 | Scheduling und Platzierungsregeln | `16-kubernetes-platform/16-scheduling-und-platzierungsregeln.md` | technical_review |
<a id="kb-0395"></a>| KB-0395 | Ressourcenmanagement im Cluster | `16-kubernetes-platform/17-ressourcenmanagement-im-cluster.md` | technical_review |
<a id="kb-0396"></a>| KB-0396 | Autoscaling für Workloads | `16-kubernetes-platform/18-autoscaling-fuer-workloads.md` | technical_review |
<a id="kb-0397"></a>| KB-0397 | Helm und Paketverwaltung | `16-kubernetes-platform/19-helm-und-paketverwaltung.md` | technical_review |
<a id="kb-0398"></a>| KB-0398 | Controller und Operatoren | `16-kubernetes-platform/20-controller-und-operatoren.md` | technical_review |
<a id="kb-0399"></a>| KB-0399 | Custom Resource Definitions | `16-kubernetes-platform/21-custom-resource-definitions.md` | technical_review |
<a id="kb-0400"></a>| KB-0400 | Admission Control | `16-kubernetes-platform/22-admission-control.md` | technical_review |
<a id="kb-0401"></a>| KB-0401 | OPA, Gatekeeper und Kyverno | `16-kubernetes-platform/23-opa-gatekeeper-und-kyverno.md` | technical_review |
<a id="kb-0402"></a>| KB-0402 | Cilium und EBPF-Netzwerke | `16-kubernetes-platform/24-cilium-und-ebpf-netzwerke.md` | technical_review |
<a id="kb-0403"></a>| KB-0403 | Karpenter und Node-Provisionierung | `16-kubernetes-platform/25-karpenter-und-node-provisionierung.md` | technical_review |
<a id="kb-0404"></a>| KB-0404 | Cluster API | `16-kubernetes-platform/26-cluster-api.md` | technical_review |
<a id="kb-0405"></a>| KB-0405 | Argo CD im Plattformbetrieb | `16-kubernetes-platform/27-argo-cd-im-plattformbetrieb.md` | technical_review |
<a id="kb-0406"></a>| KB-0406 | Argo Workflows | `16-kubernetes-platform/28-argo-workflows.md` | technical_review |
<a id="kb-0407"></a>| KB-0407 | Crossplane und Infrastruktur-APIs | `16-kubernetes-platform/29-crossplane-und-infrastruktur-apis.md` | technical_review |
<a id="kb-0408"></a>| KB-0408 | Backstage und Internal Developer Platforms | `16-kubernetes-platform/30-backstage-und-internal-developer-platforms.md` | technical_review |
<a id="kb-0409"></a>| KB-0409 | Golden Paths und Paved Roads | `16-kubernetes-platform/31-golden-paths-und-paved-roads.md` | technical_review |
<a id="kb-0410"></a>| KB-0410 | Multi-Cluster-Plattformen und Federation | `16-kubernetes-platform/32-multi-cluster-plattformen-und-federation.md` | technical_review |
<a id="kb-0411"></a>| KB-0411 | Platform Scorecards und Produktwirkung | `16-kubernetes-platform/33-platform-scorecards-und-produktwirkung.md` | technical_review |
<a id="kb-0412"></a>| KB-0412 | Plattformverträge und Self-Service | `16-kubernetes-platform/34-plattformvertraege-und-self-service.md` | technical_review |

### 17 — GPU systems, AI infrastructure & inference serving

**28 Dateien · Lernwelle 6** — Hardware- und Servingmechanik sind kanonisch hier; ökonomische Portfoliobewertung und allgemeine Modellgrundlagen werden in den jeweiligen Domains vertieft.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0413"></a>| KB-0413 | GPU-Architektur und Rechenpfade | `17-gpu-inference/01-gpu-architektur-und-rechenpfade.md` | technical_review |
<a id="kb-0414"></a>| KB-0414 | CUDA und Ausführungsmodelle | `17-gpu-inference/02-cuda-und-ausfuehrungsmodelle.md` | technical_review |
<a id="kb-0415"></a>| KB-0415 | VRAM und Speicherbudgets | `17-gpu-inference/03-vram-und-speicherbudgets.md` | technical_review |
<a id="kb-0416"></a>| KB-0416 | MIG und MPS | `17-gpu-inference/04-mig-und-mps.md` | technical_review |
<a id="kb-0417"></a>| KB-0417 | NVIDIA Device Plugin | `17-gpu-inference/05-nvidia-device-plugin.md` | technical_review |
<a id="kb-0418"></a>| KB-0418 | NVCR und GPU-Artefakte | `17-gpu-inference/06-nvcr-und-gpu-artefakte.md` | technical_review |
<a id="kb-0419"></a>| KB-0419 | NVIDIA Triton | `17-gpu-inference/07-nvidia-triton.md` | technical_review |
<a id="kb-0420"></a>| KB-0420 | VLLM | `17-gpu-inference/08-vllm.md` | technical_review |
<a id="kb-0421"></a>| KB-0421 | SGLang | `17-gpu-inference/09-sglang.md` | technical_review |
<a id="kb-0422"></a>| KB-0422 | TensorRT-LLM | `17-gpu-inference/10-tensorrt-llm.md` | technical_review |
<a id="kb-0423"></a>| KB-0423 | NVIDIA Dynamo | `17-gpu-inference/11-nvidia-dynamo.md` | technical_review |
<a id="kb-0424"></a>| KB-0424 | Disaggregated Prefill und Decode | `17-gpu-inference/12-disaggregated-prefill-und-decode.md` | technical_review |
<a id="kb-0425"></a>| KB-0425 | KV Caches und speicherbewusstes Routing | `17-gpu-inference/13-kv-caches-und-speicherbewusstes-routing.md` | technical_review |
<a id="kb-0426"></a>| KB-0426 | Continuous Batching | `17-gpu-inference/14-continuous-batching.md` | technical_review |
<a id="kb-0427"></a>| KB-0427 | Dynamic Batching | `17-gpu-inference/15-dynamic-batching.md` | technical_review |
<a id="kb-0428"></a>| KB-0428 | Speculative Decoding | `17-gpu-inference/16-speculative-decoding.md` | technical_review |
<a id="kb-0429"></a>| KB-0429 | KServe | `17-gpu-inference/17-kserve.md` | technical_review |
<a id="kb-0430"></a>| KB-0430 | Ray Serve | `17-gpu-inference/18-ray-serve.md` | technical_review |
<a id="kb-0431"></a>| KB-0431 | BentoML | `17-gpu-inference/19-bentoml.md` | technical_review |
<a id="kb-0432"></a>| KB-0432 | Kueue und Volcano | `17-gpu-inference/20-kueue-und-volcano.md` | technical_review |
<a id="kb-0433"></a>| KB-0433 | GPU-Scheduling und Topologie | `17-gpu-inference/21-gpu-scheduling-und-topologie.md` | technical_review |
<a id="kb-0434"></a>| KB-0434 | NVLink und NVSwitch | `17-gpu-inference/22-nvlink-und-nvswitch.md` | technical_review |
<a id="kb-0435"></a>| KB-0435 | InfiniBand und RoCE | `17-gpu-inference/23-infiniband-und-roce.md` | technical_review |
<a id="kb-0436"></a>| KB-0436 | PCIe und Host-Anbindung | `17-gpu-inference/24-pcie-und-host-anbindung.md` | technical_review |
<a id="kb-0437"></a>| KB-0437 | NIXL und Datentransport | `17-gpu-inference/25-nixl-und-datentransport.md` | technical_review |
<a id="kb-0438"></a>| KB-0438 | Verteilte Inferenz und Parallelisierung | `17-gpu-inference/26-verteilte-inferenz-und-parallelisierung.md` | technical_review |
<a id="kb-0439"></a>| KB-0439 | Inferenzkapazität und Lastprofile | `17-gpu-inference/27-inferenzkapazitaet-und-lastprofile.md` | technical_review |
<a id="kb-0440"></a>| KB-0440 | Serving-Benchmarks und Produktionsfreigabe | `17-gpu-inference/28-serving-benchmarks-und-produktionsfreigabe.md` | technical_review |

### 18 — Cloud architecture foundations, hybrid & multi-cloud

**22 Dateien · Lernwelle 4** — Providerübergreifende Architekturentscheidungen sind kanonisch hier; konkrete Servicekonfigurationen werden in den getrennten AWS-, Azure- und GCP-Tracks behandelt.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0441"></a>| KB-0441 | Cloud-Regionen und Availability Zones | `18-cloud-foundations/01-cloud-regionen-und-availability-zones.md` | technical_review |
<a id="kb-0442"></a>| KB-0442 | Shared Responsibility | `18-cloud-foundations/02-shared-responsibility.md` | technical_review |
<a id="kb-0443"></a>| KB-0443 | Cloud-Netzwerkmodelle | `18-cloud-foundations/03-cloud-netzwerkmodelle.md` | technical_review |
<a id="kb-0444"></a>| KB-0444 | Cloud-IAM-Grundarchitektur | `18-cloud-foundations/04-cloud-iam-grundarchitektur.md` | technical_review |
<a id="kb-0445"></a>| KB-0445 | Cloud-Compute-Modelle | `18-cloud-foundations/05-cloud-compute-modelle.md` | technical_review |
<a id="kb-0446"></a>| KB-0446 | Cloud-Speicherauswahl | `18-cloud-foundations/06-cloud-speicherauswahl.md` | technical_review |
<a id="kb-0447"></a>| KB-0447 | Verwaltete Cloud-Datenbanken | `18-cloud-foundations/07-verwaltete-cloud-datenbanken.md` | technical_review |
<a id="kb-0448"></a>| KB-0448 | Serverless-Architekturen | `18-cloud-foundations/08-serverless-architekturen.md` | technical_review |
<a id="kb-0449"></a>| KB-0449 | Containerdienste in der Cloud | `18-cloud-foundations/09-containerdienste-in-der-cloud.md` | technical_review |
<a id="kb-0450"></a>| KB-0450 | Landing Zones | `18-cloud-foundations/10-landing-zones.md` | technical_review |
<a id="kb-0451"></a>| KB-0451 | Hub-Spoke und Transitarchitekturen | `18-cloud-foundations/11-hub-spoke-und-transitarchitekturen.md` | technical_review |
<a id="kb-0452"></a>| KB-0452 | Hybride Cloud-Anbindung | `18-cloud-foundations/12-hybride-cloud-anbindung.md` | technical_review |
<a id="kb-0453"></a>| KB-0453 | VPN und verschlüsselte Tunnel | `18-cloud-foundations/13-vpn-und-verschluesselte-tunnel.md` | technical_review |
<a id="kb-0454"></a>| KB-0454 | Dedizierte Cloud-Verbindungen | `18-cloud-foundations/14-dedizierte-cloud-verbindungen.md` | technical_review |
<a id="kb-0455"></a>| KB-0455 | Hybrides DNS | `18-cloud-foundations/15-hybrides-dns.md` | technical_review |
<a id="kb-0456"></a>| KB-0456 | Multi-Region-Cloudmuster | `18-cloud-foundations/16-multi-region-cloudmuster.md` | technical_review |
<a id="kb-0457"></a>| KB-0457 | Hochverfügbarkeit in der Cloud | `18-cloud-foundations/17-hochverfuegbarkeit-in-der-cloud.md` | technical_review |
<a id="kb-0458"></a>| KB-0458 | Cloud-Disaster-Recovery-Architekturen | `18-cloud-foundations/18-cloud-disaster-recovery-architekturen.md` | technical_review |
<a id="kb-0459"></a>| KB-0459 | Cloud-Backup-Strategien | `18-cloud-foundations/19-cloud-backup-strategien.md` | technical_review |
<a id="kb-0460"></a>| KB-0460 | Datenresidenz und Cloud-Platzierung | `18-cloud-foundations/20-datenresidenz-und-cloud-platzierung.md` | technical_review |
<a id="kb-0461"></a>| KB-0461 | Cloud-Migrationsstrategien | `18-cloud-foundations/21-cloud-migrationsstrategien.md` | technical_review |
<a id="kb-0462"></a>| KB-0462 | Cloud-Betriebsmodelle und Well-Architected | `18-cloud-foundations/22-cloud-betriebsmodelle-und-well-architected.md` | technical_review |

### 19 — AWS architecture

**18 Dateien · Lernwelle 4** — AWS-Serviceentscheidungen und Integrationsgrenzen werden konkretisiert; Protokoll-, Datenbank- und Messagingmechanik bleiben in ihren kanonischen Fachartikeln.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0463"></a>| KB-0463 | AWS-Organisationen und Landing Zones | `19-aws/01-aws-organisationen-und-landing-zones.md` | technical_review |
<a id="kb-0464"></a>| KB-0464 | AWS IAM und Rollenmodell | `19-aws/02-aws-iam-und-rollenmodell.md` | technical_review |
<a id="kb-0465"></a>| KB-0465 | Amazon VPC und Endpunkte | `19-aws/03-amazon-vpc-und-endpunkte.md` | technical_review |
<a id="kb-0466"></a>| KB-0466 | AWS Transit Gateway | `19-aws/04-aws-transit-gateway.md` | technical_review |
<a id="kb-0467"></a>| KB-0467 | Amazon Route 53 | `19-aws/05-amazon-route-53.md` | technical_review |
<a id="kb-0468"></a>| KB-0468 | EC2 und Auto Scaling | `19-aws/06-ec2-und-auto-scaling.md` | technical_review |
<a id="kb-0469"></a>| KB-0469 | Elastic Load Balancing | `19-aws/07-elastic-load-balancing.md` | technical_review |
<a id="kb-0470"></a>| KB-0470 | Amazon EKS | `19-aws/08-amazon-eks.md` | technical_review |
<a id="kb-0471"></a>| KB-0471 | ECS und Fargate | `19-aws/09-ecs-und-fargate.md` | technical_review |
<a id="kb-0472"></a>| KB-0472 | AWS Lambda | `19-aws/10-aws-lambda.md` | technical_review |
<a id="kb-0473"></a>| KB-0473 | Amazon S3 | `19-aws/11-amazon-s3.md` | technical_review |
<a id="kb-0474"></a>| KB-0474 | RDS und Aurora | `19-aws/12-rds-und-aurora.md` | technical_review |
<a id="kb-0475"></a>| KB-0475 | Amazon DynamoDB | `19-aws/13-amazon-dynamodb.md` | technical_review |
<a id="kb-0476"></a>| KB-0476 | AWS-Ereignisarchitektur mit EventBridge | `19-aws/14-aws-ereignisarchitektur-mit-eventbridge.md` | technical_review |
<a id="kb-0477"></a>| KB-0477 | Amazon API Gateway | `19-aws/15-amazon-api-gateway.md` | technical_review |
<a id="kb-0478"></a>| KB-0478 | CloudWatch und AWS-Betriebssignale | `19-aws/16-cloudwatch-und-aws-betriebssignale.md` | technical_review |
<a id="kb-0479"></a>| KB-0479 | Amazon Bedrock | `19-aws/17-amazon-bedrock.md` | technical_review |
<a id="kb-0480"></a>| KB-0480 | SageMaker und AWS-ML-Plattformen | `19-aws/18-sagemaker-und-aws-ml-plattformen.md` | technical_review |

### 20 — Microsoft Azure architecture

**18 Dateien · Lernwelle 4** — Die Perspektive ist Azure-Tenant- und Lösungsdesign; Entra-Protokolle, Datenplattforminternas und Brokersemantik werden in den kanonischen Domains vertieft.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0481"></a>| KB-0481 | Azure-Organisation und Enterprise Landing Zones | `20-azure/01-azure-organisation-und-enterprise-landing-zones.md` | technical_review |
<a id="kb-0482"></a>| KB-0482 | Entra-Tenant-Design für Azure | `20-azure/02-entra-tenant-design-fuer-azure.md` | technical_review |
<a id="kb-0483"></a>| KB-0483 | Azure Policy und Schutzvorgaben | `20-azure/03-azure-policy-und-schutzvorgaben.md` | technical_review |
<a id="kb-0484"></a>| KB-0484 | Azure VNets und Private Link | `20-azure/04-azure-vnets-und-private-link.md` | technical_review |
<a id="kb-0485"></a>| KB-0485 | ExpressRoute und hybride Anbindung | `20-azure/05-expressroute-und-hybride-anbindung.md` | technical_review |
<a id="kb-0486"></a>| KB-0486 | Application Gateway und Front Door | `20-azure/06-application-gateway-und-front-door.md` | technical_review |
<a id="kb-0487"></a>| KB-0487 | Azure Kubernetes Service | `20-azure/07-azure-kubernetes-service.md` | technical_review |
<a id="kb-0488"></a>| KB-0488 | Azure Container Apps | `20-azure/08-azure-container-apps.md` | technical_review |
<a id="kb-0489"></a>| KB-0489 | Azure Functions | `20-azure/09-azure-functions.md` | technical_review |
<a id="kb-0490"></a>| KB-0490 | Azure App Service | `20-azure/10-azure-app-service.md` | technical_review |
<a id="kb-0491"></a>| KB-0491 | Azure Storage | `20-azure/11-azure-storage.md` | technical_review |
<a id="kb-0492"></a>| KB-0492 | Azure SQL und Cosmos DB | `20-azure/12-azure-sql-und-cosmos-db.md` | technical_review |
<a id="kb-0493"></a>| KB-0493 | Azure-Ereignisarchitektur | `20-azure/13-azure-ereignisarchitektur.md` | technical_review |
<a id="kb-0494"></a>| KB-0494 | Azure API Management | `20-azure/14-azure-api-management.md` | technical_review |
<a id="kb-0495"></a>| KB-0495 | Azure Monitor und Application Insights | `20-azure/15-azure-monitor-und-application-insights.md` | technical_review |
<a id="kb-0496"></a>| KB-0496 | Microsoft Foundry für AI-Lösungen | `20-azure/16-microsoft-foundry-fuer-ai-loesungen.md` | technical_review |
<a id="kb-0497"></a>| KB-0497 | Fabric im Azure-Unternehmenskontext | `20-azure/17-fabric-im-azure-unternehmenskontext.md` | technical_review |
<a id="kb-0498"></a>| KB-0498 | Azure-Lösungsintegration und Betriebsübergabe | `20-azure/18-azure-loesungsintegration-und-betriebsuebergabe.md` | technical_review |

### 21 — GCP & multi-cloud architecture

**14 Dateien · Lernwelle 4** — GCP-Ressourcen und konkrete Cloudübergänge stehen im Mittelpunkt; generische Multi-Cloud-Muster und Protokollgrundlagen werden gezielt referenziert.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0499"></a>| KB-0499 | GCP-Organisation und IAM | `21-gcp-multicloud/01-gcp-organisation-und-iam.md` | technical_review |
<a id="kb-0500"></a>| KB-0500 | GCP VPC | `21-gcp-multicloud/02-gcp-vpc.md` | technical_review |
<a id="kb-0501"></a>| KB-0501 | Cloud Load Balancing und Cloud DNS | `21-gcp-multicloud/03-cloud-load-balancing-und-cloud-dns.md` | technical_review |
<a id="kb-0502"></a>| KB-0502 | Compute Engine | `21-gcp-multicloud/04-compute-engine.md` | technical_review |
<a id="kb-0503"></a>| KB-0503 | Google Kubernetes Engine | `21-gcp-multicloud/05-google-kubernetes-engine.md` | technical_review |
<a id="kb-0504"></a>| KB-0504 | Cloud Run | `21-gcp-multicloud/06-cloud-run.md` | technical_review |
<a id="kb-0505"></a>| KB-0505 | Cloud Storage | `21-gcp-multicloud/07-cloud-storage.md` | technical_review |
<a id="kb-0506"></a>| KB-0506 | Cloud SQL und Spanner | `21-gcp-multicloud/08-cloud-sql-und-spanner.md` | technical_review |
<a id="kb-0507"></a>| KB-0507 | Pub/Sub im GCP-Lösungsdesign | `21-gcp-multicloud/09-pub-sub-im-gcp-loesungsdesign.md` | technical_review |
<a id="kb-0508"></a>| KB-0508 | BigQuery im GCP-Organisationsmodell | `21-gcp-multicloud/10-bigquery-im-gcp-organisationsmodell.md` | technical_review |
<a id="kb-0509"></a>| KB-0509 | Vertex AI | `21-gcp-multicloud/11-vertex-ai.md` | technical_review |
<a id="kb-0510"></a>| KB-0510 | Hybride GCP-Architekturen | `21-gcp-multicloud/12-hybride-gcp-architekturen.md` | technical_review |
<a id="kb-0511"></a>| KB-0511 | Cross-Cloud-Integration | `21-gcp-multicloud/13-cross-cloud-integration.md` | technical_review |
<a id="kb-0512"></a>| KB-0512 | Cross-Cloud-Governance | `21-gcp-multicloud/14-cross-cloud-governance.md` | technical_review |

### 22 — DevOps, IaC, GitOps & software supply chain

**24 Dateien · Lernwelle 5** — Delivery-Mechanik und Artefaktvertrauen sind kanonisch hier; Clusterkonfiguration und übergreifende Sicherheitsgovernance werden durch klar benannte Querverweise angeschlossen.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0513"></a>| KB-0513 | Git und nachvollziehbare Änderungen | `22-devops-supply-chain/01-git-und-nachvollziehbare-aenderungen.md` | technical_review |
<a id="kb-0514"></a>| KB-0514 | Branching und Integrationsmodelle | `22-devops-supply-chain/02-branching-und-integrationsmodelle.md` | technical_review |
<a id="kb-0515"></a>| KB-0515 | GitHub Actions | `22-devops-supply-chain/03-github-actions.md` | technical_review |
<a id="kb-0516"></a>| KB-0516 | GitLab CI | `22-devops-supply-chain/04-gitlab-ci.md` | technical_review |
<a id="kb-0517"></a>| KB-0517 | Jenkins im Bestandsumfeld | `22-devops-supply-chain/05-jenkins-im-bestandsumfeld.md` | technical_review |
<a id="kb-0518"></a>| KB-0518 | Pipeline-Architektur | `22-devops-supply-chain/06-pipeline-architektur.md` | technical_review |
<a id="kb-0519"></a>| KB-0519 | Terraform und OpenTofu | `22-devops-supply-chain/07-terraform-und-opentofu.md` | technical_review |
<a id="kb-0520"></a>| KB-0520 | IaC State und Locking | `22-devops-supply-chain/08-iac-state-und-locking.md` | technical_review |
<a id="kb-0521"></a>| KB-0521 | IaC-Module und Wiederverwendung | `22-devops-supply-chain/09-iac-module-und-wiederverwendung.md` | technical_review |
<a id="kb-0522"></a>| KB-0522 | IaC-Provider und Lifecycle | `22-devops-supply-chain/10-iac-provider-und-lifecycle.md` | technical_review |
<a id="kb-0523"></a>| KB-0523 | Ansible und Konfigurationsmanagement | `22-devops-supply-chain/11-ansible-und-konfigurationsmanagement.md` | technical_review |
<a id="kb-0524"></a>| KB-0524 | GitOps und deklarative Delivery | `22-devops-supply-chain/12-gitops-und-deklarative-delivery.md` | technical_review |
<a id="kb-0525"></a>| KB-0525 | Argo CD und Releasekontrolle | `22-devops-supply-chain/13-argo-cd-und-releasekontrolle.md` | technical_review |
<a id="kb-0526"></a>| KB-0526 | Release-Strategien | `22-devops-supply-chain/14-release-strategien.md` | technical_review |
<a id="kb-0527"></a>| KB-0527 | Feature Flags | `22-devops-supply-chain/15-feature-flags.md` | technical_review |
<a id="kb-0528"></a>| KB-0528 | Artifact Registries | `22-devops-supply-chain/16-artifact-registries.md` | technical_review |
<a id="kb-0529"></a>| KB-0529 | SBOM und Komponenteninventare | `22-devops-supply-chain/17-sbom-und-komponenteninventare.md` | technical_review |
<a id="kb-0530"></a>| KB-0530 | SLSA und Build-Provenienz | `22-devops-supply-chain/18-slsa-und-build-provenienz.md` | technical_review |
<a id="kb-0531"></a>| KB-0531 | Sigstore und Cosign | `22-devops-supply-chain/19-sigstore-und-cosign.md` | technical_review |
<a id="kb-0532"></a>| KB-0532 | Image Signing und Admission-Vertrauen | `22-devops-supply-chain/20-image-signing-und-admission-vertrauen.md` | technical_review |
<a id="kb-0533"></a>| KB-0533 | Dependency Security und Scanning | `22-devops-supply-chain/21-dependency-security-und-scanning.md` | technical_review |
<a id="kb-0534"></a>| KB-0534 | Policy Gates für die Lieferkette | `22-devops-supply-chain/22-policy-gates-fuer-die-lieferkette.md` | technical_review |
<a id="kb-0535"></a>| KB-0535 | Deployment-Rollback und Datenfolgen | `22-devops-supply-chain/23-deployment-rollback-und-datenfolgen.md` | technical_review |
<a id="kb-0536"></a>| KB-0536 | Environment Promotion | `22-devops-supply-chain/24-environment-promotion.md` | technical_review |

### 23 — Security, IAM, Zero Trust & cloud security

**28 Dateien · Lernwelle 5** — Identitätsprotokolle und Sicherheitsmechanismen sind kanonisch hier; AI-Angriffsflächen, Lieferkettenimplementierung und regulatorische Pflichten erhalten abgegrenzte Querverweise.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0537"></a>| KB-0537 | Threat Modeling und Vertrauensgrenzen | `23-security-identity/01-threat-modeling-und-vertrauensgrenzen.md` | technical_review |
<a id="kb-0538"></a>| KB-0538 | IAM und Identitätslebenszyklen | `23-security-identity/02-iam-und-identitaetslebenszyklen.md` | technical_review |
<a id="kb-0539"></a>| KB-0539 | RBAC und ABAC | `23-security-identity/03-rbac-und-abac.md` | technical_review |
<a id="kb-0540"></a>| KB-0540 | OAuth2 und delegierter Zugriff | `23-security-identity/04-oauth2-und-delegierter-zugriff.md` | technical_review |
<a id="kb-0541"></a>| KB-0541 | OpenID Connect | `23-security-identity/05-openid-connect.md` | technical_review |
<a id="kb-0542"></a>| KB-0542 | SAML und Enterprise Federation | `23-security-identity/06-saml-und-enterprise-federation.md` | technical_review |
<a id="kb-0543"></a>| KB-0543 | JWT und Tokenvalidierung | `23-security-identity/07-jwt-und-tokenvalidierung.md` | technical_review |
<a id="kb-0544"></a>| KB-0544 | Active Directory | `23-security-identity/08-active-directory.md` | technical_review |
<a id="kb-0545"></a>| KB-0545 | Microsoft Entra ID und Föderation | `23-security-identity/09-microsoft-entra-id-und-foederation.md` | technical_review |
<a id="kb-0546"></a>| KB-0546 | LDAP und Verzeichniszugriff | `23-security-identity/10-ldap-und-verzeichniszugriff.md` | technical_review |
<a id="kb-0547"></a>| KB-0547 | SCIM und Provisionierung | `23-security-identity/11-scim-und-provisionierung.md` | technical_review |
<a id="kb-0548"></a>| KB-0548 | PAM und privilegierte Zugriffe | `23-security-identity/12-pam-und-privilegierte-zugriffe.md` | technical_review |
<a id="kb-0549"></a>| KB-0549 | Workload Identity | `23-security-identity/13-workload-identity.md` | technical_review |
<a id="kb-0550"></a>| KB-0550 | SPIFFE und SPIRE | `23-security-identity/14-spiffe-und-spire.md` | technical_review |
<a id="kb-0551"></a>| KB-0551 | PKI und Zertifikatslebenszyklen | `23-security-identity/15-pki-und-zertifikatslebenszyklen.md` | technical_review |
<a id="kb-0552"></a>| KB-0552 | MTLS und Dienstauthentifizierung | `23-security-identity/16-mtls-und-dienstauthentifizierung.md` | technical_review |
<a id="kb-0553"></a>| KB-0553 | Secrets und Vault | `23-security-identity/17-secrets-und-vault.md` | technical_review |
<a id="kb-0554"></a>| KB-0554 | KMS und HSM | `23-security-identity/18-kms-und-hsm.md` | technical_review |
<a id="kb-0555"></a>| KB-0555 | Zero Trust | `23-security-identity/19-zero-trust.md` | technical_review |
<a id="kb-0556"></a>| KB-0556 | Sicherheitssegmentierung | `23-security-identity/20-sicherheitssegmentierung.md` | technical_review |
<a id="kb-0557"></a>| KB-0557 | Container- und Kubernetes-Sicherheit | `23-security-identity/21-container-und-kubernetes-sicherheit.md` | technical_review |
<a id="kb-0558"></a>| KB-0558 | WAF und DDoS-Abwehr | `23-security-identity/22-waf-und-ddos-abwehr.md` | technical_review |
<a id="kb-0559"></a>| KB-0559 | API Security | `23-security-identity/23-api-security.md` | technical_review |
<a id="kb-0560"></a>| KB-0560 | CSPM und CNAPP | `23-security-identity/24-cspm-und-cnapp.md` | technical_review |
<a id="kb-0561"></a>| KB-0561 | AI Security im Sicherheitsprogramm | `23-security-identity/25-ai-security-im-sicherheitsprogramm.md` | technical_review |
<a id="kb-0562"></a>| KB-0562 | Security Incident Response | `23-security-identity/26-security-incident-response.md` | technical_review |
<a id="kb-0563"></a>| KB-0563 | MITRE ATT&CK und Angriffsketten | `23-security-identity/27-mitre-att-ck-und-angriffsketten.md` | technical_review |
<a id="kb-0564"></a>| KB-0564 | Kryptografische Agilität und PQ-Migration | `23-security-identity/28-kryptografische-agilitaet-und-pq-migration.md` | technical_review |

### 24 — Observability, SRE, resilience & disaster recovery

**24 Dateien · Lernwelle 5** — Zuverlässigkeit und betriebliche Nachweise sind kanonisch hier; Sicherheitsforensik, Datenbankinternas und einzelne AI-Instrumentierungswerkzeuge werden über Querverweise verbunden.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0565"></a>| KB-0565 | SLI, SLO und SLA | `24-observability-sre/01-sli-slo-und-sla.md` | technical_review |
<a id="kb-0566"></a>| KB-0566 | Error Budgets | `24-observability-sre/02-error-budgets.md` | technical_review |
<a id="kb-0567"></a>| KB-0567 | Metriken und Zeitreihen | `24-observability-sre/03-metriken-und-zeitreihen.md` | technical_review |
<a id="kb-0568"></a>| KB-0568 | Strukturierte Logs | `24-observability-sre/04-strukturierte-logs.md` | technical_review |
<a id="kb-0569"></a>| KB-0569 | Distributed Tracing | `24-observability-sre/05-distributed-tracing.md` | technical_review |
<a id="kb-0570"></a>| KB-0570 | OpenTelemetry | `24-observability-sre/06-opentelemetry.md` | technical_review |
<a id="kb-0571"></a>| KB-0571 | Prometheus | `24-observability-sre/07-prometheus.md` | technical_review |
<a id="kb-0572"></a>| KB-0572 | Grafana und Betriebsdashboards | `24-observability-sre/08-grafana-und-betriebsdashboards.md` | technical_review |
<a id="kb-0573"></a>| KB-0573 | Loki und Logpipelines | `24-observability-sre/09-loki-und-logpipelines.md` | technical_review |
<a id="kb-0574"></a>| KB-0574 | OpenSearch für Betriebslogs | `24-observability-sre/10-opensearch-fuer-betriebslogs.md` | technical_review |
<a id="kb-0575"></a>| KB-0575 | Netdata und Hostdiagnose | `24-observability-sre/11-netdata-und-hostdiagnose.md` | technical_review |
<a id="kb-0576"></a>| KB-0576 | DCGM und GPU-Telemetrie | `24-observability-sre/12-dcgm-und-gpu-telemetrie.md` | technical_review |
<a id="kb-0577"></a>| KB-0577 | AI-SLO-Korrelation mit Langfuse | `24-observability-sre/13-ai-slo-korrelation-mit-langfuse.md` | technical_review |
<a id="kb-0578"></a>| KB-0578 | Tracekorrelation über Ereignisgrenzen | `24-observability-sre/14-tracekorrelation-ueber-ereignisgrenzen.md` | technical_review |
<a id="kb-0579"></a>| KB-0579 | Alerting und Bereitschaftsdienst | `24-observability-sre/15-alerting-und-bereitschaftsdienst.md` | technical_review |
<a id="kb-0580"></a>| KB-0580 | SRE Incident Response | `24-observability-sre/16-sre-incident-response.md` | technical_review |
<a id="kb-0581"></a>| KB-0581 | Postmortems und Lernschleifen | `24-observability-sre/17-postmortems-und-lernschleifen.md` | technical_review |
<a id="kb-0582"></a>| KB-0582 | Betriebliche Kapazitätssteuerung | `24-observability-sre/18-betriebliche-kapazitaetssteuerung.md` | technical_review |
<a id="kb-0583"></a>| KB-0583 | Chaos Engineering | `24-observability-sre/19-chaos-engineering.md` | technical_review |
<a id="kb-0584"></a>| KB-0584 | RTO und RPO | `24-observability-sre/20-rto-und-rpo.md` | technical_review |
<a id="kb-0585"></a>| KB-0585 | Backup-Betrieb und Wiederherstellungsnachweise | `24-observability-sre/21-backup-betrieb-und-wiederherstellungsnachweise.md` | technical_review |
<a id="kb-0586"></a>| KB-0586 | Disaster Recovery und Übungen | `24-observability-sre/22-disaster-recovery-und-uebungen.md` | technical_review |
<a id="kb-0587"></a>| KB-0587 | Multi-Region-Failover im Betrieb | `24-observability-sre/23-multi-region-failover-im-betrieb.md` | technical_review |
<a id="kb-0588"></a>| KB-0588 | Operational Readiness | `24-observability-sre/24-operational-readiness.md` | technical_review |

### 25 — Enterprise Architecture, ITSM, CMDB & governance

**28 Dateien · Lernwelle 5** — Formale Modelle und Governance-Mechanismen sind kanonisch hier; strategische Führung und Fallarbeit in Domain 30 wenden diese Instrumente an.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0589"></a>| KB-0589 | Enterprise Architecture als Disziplin | `25-enterprise-architecture/01-enterprise-architecture-als-disziplin.md` | technical_review |
<a id="kb-0590"></a>| KB-0590 | Business Architecture | `25-enterprise-architecture/02-business-architecture.md` | technical_review |
<a id="kb-0591"></a>| KB-0591 | Application Architecture im Unternehmen | `25-enterprise-architecture/03-application-architecture-im-unternehmen.md` | technical_review |
<a id="kb-0592"></a>| KB-0592 | Enterprise Data Architecture | `25-enterprise-architecture/04-enterprise-data-architecture.md` | technical_review |
<a id="kb-0593"></a>| KB-0593 | Technology Architecture | `25-enterprise-architecture/05-technology-architecture.md` | technical_review |
<a id="kb-0594"></a>| KB-0594 | Capability Mapping | `25-enterprise-architecture/06-capability-mapping.md` | technical_review |
<a id="kb-0595"></a>| KB-0595 | Value Streams | `25-enterprise-architecture/07-value-streams.md` | technical_review |
<a id="kb-0596"></a>| KB-0596 | TOGAF und Architekturentwicklung | `25-enterprise-architecture/08-togaf-und-architekturentwicklung.md` | technical_review |
<a id="kb-0597"></a>| KB-0597 | ArchiMate und Modellbeziehungen | `25-enterprise-architecture/09-archimate-und-modellbeziehungen.md` | technical_review |
<a id="kb-0598"></a>| KB-0598 | Enterprise-Referenzarchitekturen | `25-enterprise-architecture/10-enterprise-referenzarchitekturen.md` | technical_review |
<a id="kb-0599"></a>| KB-0599 | Technologiestandards und Kataloge | `25-enterprise-architecture/11-technologiestandards-und-kataloge.md` | technical_review |
<a id="kb-0600"></a>| KB-0600 | Technology Radar | `25-enterprise-architecture/12-technology-radar.md` | technical_review |
<a id="kb-0601"></a>| KB-0601 | Application Portfolio Management | `25-enterprise-architecture/13-application-portfolio-management.md` | technical_review |
<a id="kb-0602"></a>| KB-0602 | Architekturprinzipien | `25-enterprise-architecture/14-architekturprinzipien.md` | technical_review |
<a id="kb-0603"></a>| KB-0603 | Enterprise-Integrationsarchitektur | `25-enterprise-architecture/15-enterprise-integrationsarchitektur.md` | technical_review |
<a id="kb-0604"></a>| KB-0604 | ServiceNow CMDB | `25-enterprise-architecture/16-servicenow-cmdb.md` | technical_review |
<a id="kb-0605"></a>| KB-0605 | Configuration Items und Beziehungen | `25-enterprise-architecture/17-configuration-items-und-beziehungen.md` | technical_review |
<a id="kb-0606"></a>| KB-0606 | Dependency und Service Mapping | `25-enterprise-architecture/18-dependency-und-service-mapping.md` | technical_review |
<a id="kb-0607"></a>| KB-0607 | ITIL und Service Management | `25-enterprise-architecture/19-itil-und-service-management.md` | technical_review |
<a id="kb-0608"></a>| KB-0608 | Incident, Problem und Change | `25-enterprise-architecture/20-incident-problem-und-change.md` | technical_review |
<a id="kb-0609"></a>| KB-0609 | Discovery und CMDB-Datenqualität | `25-enterprise-architecture/21-discovery-und-cmdb-datenqualitaet.md` | technical_review |
<a id="kb-0610"></a>| KB-0610 | Erfolgskriterien und PoC-Governance | `25-enterprise-architecture/22-erfolgskriterien-und-poc-governance.md` | technical_review |
<a id="kb-0611"></a>| KB-0611 | Value Narratives für Architekturvorhaben | `25-enterprise-architecture/23-value-narratives-fuer-architekturvorhaben.md` | technical_review |
<a id="kb-0612"></a>| KB-0612 | Architecture Review Boards | `25-enterprise-architecture/24-architecture-review-boards.md` | technical_review |
<a id="kb-0613"></a>| KB-0613 | Architekturgovernance und Entscheidungsrechte | `25-enterprise-architecture/25-architekturgovernance-und-entscheidungsrechte.md` | technical_review |
<a id="kb-0614"></a>| KB-0614 | Enterprise Operating Models | `25-enterprise-architecture/26-enterprise-operating-models.md` | technical_review |
<a id="kb-0615"></a>| KB-0615 | Modernisierungsportfolio | `25-enterprise-architecture/27-modernisierungsportfolio.md` | technical_review |
<a id="kb-0616"></a>| KB-0616 | Architekturrepository und Modellpflege | `25-enterprise-architecture/28-architekturrepository-und-modellpflege.md` | technical_review |

### 26 — AI governance, compliance, privacy & regulatory architecture

**18 Dateien · Lernwelle 5** — Die Artikel planen technische und organisatorische Umsetzung anhand aktueller Primärquellen; Rechtsanwendung und versionsabhängige Pflichten müssen später gesondert verifiziert werden.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0617"></a>| KB-0617 | EU AI Act und Systemklassifikation | `26-ai-governance/01-eu-ai-act-und-systemklassifikation.md` | technical_review |
<a id="kb-0618"></a>| KB-0618 | GDPR und Datenschutzarchitektur | `26-ai-governance/02-gdpr-und-datenschutzarchitektur.md` | technical_review |
<a id="kb-0619"></a>| KB-0619 | NIS2 und Sicherheitsorganisation | `26-ai-governance/03-nis2-und-sicherheitsorganisation.md` | technical_review |
<a id="kb-0620"></a>| KB-0620 | DORA und digitale Resilienz | `26-ai-governance/04-dora-und-digitale-resilienz.md` | technical_review |
<a id="kb-0621"></a>| KB-0621 | ISO 27001 und Informationssicherheit | `26-ai-governance/05-iso-27001-und-informationssicherheit.md` | technical_review |
<a id="kb-0622"></a>| KB-0622 | ISO 42001 und AI-Managementsysteme | `26-ai-governance/06-iso-42001-und-ai-managementsysteme.md` | technical_review |
<a id="kb-0623"></a>| KB-0623 | SOC 2 und BSI C5 | `26-ai-governance/07-soc-2-und-bsi-c5.md` | technical_review |
<a id="kb-0624"></a>| KB-0624 | Datenklassifikation und Schutzbedarf | `26-ai-governance/08-datenklassifikation-und-schutzbedarf.md` | technical_review |
<a id="kb-0625"></a>| KB-0625 | DPIA und Privacy-Risikobewertung | `26-ai-governance/09-dpia-und-privacy-risikobewertung.md` | technical_review |
<a id="kb-0626"></a>| KB-0626 | Privacy by Design | `26-ai-governance/10-privacy-by-design.md` | technical_review |
<a id="kb-0627"></a>| KB-0627 | Retention und Löscharchitektur | `26-ai-governance/11-retention-und-loescharchitektur.md` | technical_review |
<a id="kb-0628"></a>| KB-0628 | Auditierbarkeit und Nachweisführung | `26-ai-governance/12-auditierbarkeit-und-nachweisfuehrung.md` | technical_review |
<a id="kb-0629"></a>| KB-0629 | AI-Provenienz und Contentrechte | `26-ai-governance/13-ai-provenienz-und-contentrechte.md` | technical_review |
<a id="kb-0630"></a>| KB-0630 | Unternehmensweite Model Governance | `26-ai-governance/14-unternehmensweite-model-governance.md` | technical_review |
<a id="kb-0631"></a>| KB-0631 | Vendor Risk für AI-Dienste | `26-ai-governance/15-vendor-risk-fuer-ai-dienste.md` | technical_review |
<a id="kb-0632"></a>| KB-0632 | Responsible AI und Auswirkungen | `26-ai-governance/16-responsible-ai-und-auswirkungen.md` | technical_review |
<a id="kb-0633"></a>| KB-0633 | Policy as Code für Governance | `26-ai-governance/17-policy-as-code-fuer-governance.md` | technical_review |
<a id="kb-0634"></a>| KB-0634 | Regulatorische Architektur und Residency | `26-ai-governance/18-regulatorische-architektur-und-residency.md` | technical_review |

### 27 — FinOps, capacity, performance & architecture economics

**14 Dateien · Lernwelle 5** — Quantitative Entscheidungsmodelle und Kostenmechanismen sind kanonisch hier; strategische Portfoliowahl und produktabhängige Abrechnung werden in ihren Anwendungsartikeln genutzt.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0635"></a>| KB-0635 | FinOps und gemeinsame Kostenverantwortung | `27-finops-economics/01-finops-und-gemeinsame-kostenverantwortung.md` | technical_review |
<a id="kb-0636"></a>| KB-0636 | Tagging und Kostenallokation | `27-finops-economics/02-tagging-und-kostenallokation.md` | technical_review |
<a id="kb-0637"></a>| KB-0637 | Budgets und Forecasting | `27-finops-economics/03-budgets-und-forecasting.md` | technical_review |
<a id="kb-0638"></a>| KB-0638 | Cloud Unit Economics | `27-finops-economics/04-cloud-unit-economics.md` | technical_review |
<a id="kb-0639"></a>| KB-0639 | GPU Economics | `27-finops-economics/05-gpu-economics.md` | technical_review |
<a id="kb-0640"></a>| KB-0640 | Token- und Agentenlaufkosten | `27-finops-economics/06-token-und-agentenlaufkosten.md` | technical_review |
<a id="kb-0641"></a>| KB-0641 | Kapazitätsplanung und Reserven | `27-finops-economics/07-kapazitaetsplanung-und-reserven.md` | technical_review |
<a id="kb-0642"></a>| KB-0642 | Lastmodelle und Nachfrageverteilung | `27-finops-economics/08-lastmodelle-und-nachfrageverteilung.md` | technical_review |
<a id="kb-0643"></a>| KB-0643 | Latenz und Durchsatz als Kostenentscheidung | `27-finops-economics/09-latenz-und-durchsatz-als-kostenentscheidung.md` | technical_review |
<a id="kb-0644"></a>| KB-0644 | Autoscaling Economics | `27-finops-economics/10-autoscaling-economics.md` | technical_review |
<a id="kb-0645"></a>| KB-0645 | Reserved und Spot Economics | `27-finops-economics/11-reserved-und-spot-economics.md` | technical_review |
<a id="kb-0646"></a>| KB-0646 | Total Cost of Ownership | `27-finops-economics/12-total-cost-of-ownership.md` | technical_review |
<a id="kb-0647"></a>| KB-0647 | Build-versus-Buy-Ökonomie | `27-finops-economics/13-build-versus-buy-oekonomie.md` | technical_review |
<a id="kb-0648"></a>| KB-0648 | Ökonomische Sensitivität von Architekturen | `27-finops-economics/14-oekonomische-sensitivitaet-von-architekturen.md` | technical_review |

### 28 — IoT, edge, Smart Building & physical-system integration

**14 Dateien · Lernwelle 7** — Geräte-, Gebäude- und Edgeintegration werden vertieft; Konzeptwissen und elektrotechnische Praxis bleiben von noch nachzuweisender Protokoll- oder Produktbetriebserfahrung getrennt.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0649"></a>| KB-0649 | IoT-Referenzarchitektur | `28-iot-edge/01-iot-referenzarchitektur.md` | technical_review |
<a id="kb-0650"></a>| KB-0650 | MQTT und Gerätetelemetrie | `28-iot-edge/02-mqtt-und-geraetetelemetrie.md` | technical_review |
<a id="kb-0651"></a>| KB-0651 | OPC UA und industrielle Semantik | `28-iot-edge/03-opc-ua-und-industrielle-semantik.md` | technical_review |
<a id="kb-0652"></a>| KB-0652 | KNX und Gebäudeautomation | `28-iot-edge/04-knx-und-gebaeudeautomation.md` | technical_review |
<a id="kb-0653"></a>| KB-0653 | Loxone und Automationsintegration | `28-iot-edge/05-loxone-und-automationsintegration.md` | technical_review |
<a id="kb-0654"></a>| KB-0654 | Edge Gateways | `28-iot-edge/06-edge-gateways.md` | technical_review |
<a id="kb-0655"></a>| KB-0655 | Device Identity | `28-iot-edge/07-device-identity.md` | technical_review |
<a id="kb-0656"></a>| KB-0656 | Device Lifecycle | `28-iot-edge/08-device-lifecycle.md` | technical_review |
<a id="kb-0657"></a>| KB-0657 | IoT-Telemetriepipelines | `28-iot-edge/09-iot-telemetriepipelines.md` | technical_review |
<a id="kb-0658"></a>| KB-0658 | Digital Twins | `28-iot-edge/10-digital-twins.md` | technical_review |
<a id="kb-0659"></a>| KB-0659 | IoT Security | `28-iot-edge/11-iot-security.md` | technical_review |
<a id="kb-0660"></a>| KB-0660 | Azure IoT-Muster | `28-iot-edge/12-azure-iot-muster.md` | technical_review |
<a id="kb-0661"></a>| KB-0661 | Edge AI | `28-iot-edge/13-edge-ai.md` | technical_review |
<a id="kb-0662"></a>| KB-0662 | Smart-Building-Gesamtintegration | `28-iot-edge/14-smart-building-gesamtintegration.md` | technical_review |

### 29 — Commerce, ERP, WMS & business-system integration

**14 Dateien · Lernwelle 7** — Geschäftsinvarianten und konkrete Commerce-Integrationsgrenzen werden vertieft; generische API-, Messaging- und Konsistenzmechanismen werden über ihre Hauptartikel angeschlossen.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0663"></a>| KB-0663 | Headless-Commerce-Architektur | `29-commerce-integration/01-headless-commerce-architektur.md` | technical_review |
<a id="kb-0664"></a>| KB-0664 | Medusa und modulare Commerce-Dienste | `29-commerce-integration/02-medusa-und-modulare-commerce-dienste.md` | technical_review |
<a id="kb-0665"></a>| KB-0665 | Order State Machines | `29-commerce-integration/03-order-state-machines.md` | technical_review |
<a id="kb-0666"></a>| KB-0666 | Inventory Consistency | `29-commerce-integration/04-inventory-consistency.md` | technical_review |
<a id="kb-0667"></a>| KB-0667 | Reservierungen und Allocation | `29-commerce-integration/05-reservierungen-und-allocation.md` | technical_review |
<a id="kb-0668"></a>| KB-0668 | B2B-Unternehmenskonten und Budgets | `29-commerce-integration/06-b2b-unternehmenskonten-und-budgets.md` | technical_review |
<a id="kb-0669"></a>| KB-0669 | Commerce-Webhooks | `29-commerce-integration/07-commerce-webhooks.md` | technical_review |
<a id="kb-0670"></a>| KB-0670 | Event-Driven Commerce | `29-commerce-integration/08-event-driven-commerce.md` | technical_review |
<a id="kb-0671"></a>| KB-0671 | ERP-Integration im Handelsprozess | `29-commerce-integration/09-erp-integration-im-handelsprozess.md` | technical_review |
<a id="kb-0672"></a>| KB-0672 | WMS-Integration und Fulfillment | `29-commerce-integration/10-wms-integration-und-fulfillment.md` | technical_review |
<a id="kb-0673"></a>| KB-0673 | SAP im Commerce-Kontext | `29-commerce-integration/11-sap-im-commerce-kontext.md` | technical_review |
<a id="kb-0674"></a>| KB-0674 | Eventual Consistency im Handel | `29-commerce-integration/12-eventual-consistency-im-handel.md` | technical_review |
<a id="kb-0675"></a>| KB-0675 | Zahlungsgrenzen und Idempotenz | `29-commerce-integration/13-zahlungsgrenzen-und-idempotenz.md` | technical_review |
<a id="kb-0676"></a>| KB-0676 | Operativer Abgleich und Reconciliation | `29-commerce-integration/14-operativer-abgleich-und-reconciliation.md` | technical_review |

### 30 — Staff / Principal / Chief Architect practice, cases & interviews

**44 Dateien · Lernwelle 8** — Anwendungsfälle und Führungspraxis synthetisieren die kanonischen Fachartikel. Formale Zielrollen sind Lernziele; belastbare Portfolioevidenz muss tatsächliche Verantwortung und Wirkung belegen.

| ID | Kapitel | Pfad | Status |
|---|---|---|---|
<a id="kb-0677"></a>| KB-0677 | Architektur-Discovery in der Praxis | `30-architect-practice/01-architektur-discovery-in-der-praxis.md` | technical_review |
<a id="kb-0678"></a>| KB-0678 | NFR-Workshops moderieren | `30-architect-practice/02-nfr-workshops-moderieren.md` | technical_review |
<a id="kb-0679"></a>| KB-0679 | Stakeholder Mapping und Einfluss | `30-architect-practice/03-stakeholder-mapping-und-einfluss.md` | technical_review |
<a id="kb-0680"></a>| KB-0680 | Executive Communication | `30-architect-practice/04-executive-communication.md` | technical_review |
<a id="kb-0681"></a>| KB-0681 | Whiteboarding unter Unsicherheit | `30-architect-practice/05-whiteboarding-unter-unsicherheit.md` | technical_review |
<a id="kb-0682"></a>| KB-0682 | Design Docs als Arbeitsinstrument | `30-architect-practice/06-design-docs-als-arbeitsinstrument.md` | technical_review |
<a id="kb-0683"></a>| KB-0683 | ADRs in langfristigen Programmen | `30-architect-practice/07-adrs-in-langfristigen-programmen.md` | technical_review |
<a id="kb-0684"></a>| KB-0684 | Architekturreviews durchführen | `30-architect-practice/08-architekturreviews-durchfuehren.md` | technical_review |
<a id="kb-0685"></a>| KB-0685 | Trade-off-Narrative | `30-architect-practice/09-trade-off-narrative.md` | technical_review |
<a id="kb-0686"></a>| KB-0686 | Technologiestrategie entwickeln | `30-architect-practice/10-technologiestrategie-entwickeln.md` | technical_review |
<a id="kb-0687"></a>| KB-0687 | Technologieroadmaps steuern | `30-architect-practice/11-technologieroadmaps-steuern.md` | technical_review |
<a id="kb-0688"></a>| KB-0688 | Plattformstrategie | `30-architect-practice/12-plattformstrategie.md` | technical_review |
<a id="kb-0689"></a>| KB-0689 | Build-versus-Buy als Führungsentscheidung | `30-architect-practice/13-build-versus-buy-als-fuehrungsentscheidung.md` | technical_review |
<a id="kb-0690"></a>| KB-0690 | Vendor Evaluation | `30-architect-practice/14-vendor-evaluation.md` | technical_review |
<a id="kb-0691"></a>| KB-0691 | Technical Due Diligence | `30-architect-practice/15-technical-due-diligence.md` | technical_review |
<a id="kb-0692"></a>| KB-0692 | PoCs und Erfolgskriterien | `30-architect-practice/16-pocs-und-erfolgskriterien.md` | technical_review |
<a id="kb-0693"></a>| KB-0693 | Wertbeiträge von Architektur belegen | `30-architect-practice/17-wertbeitraege-von-architektur-belegen.md` | technical_review |
<a id="kb-0694"></a>| KB-0694 | Modernisierungsprogramme leiten | `30-architect-practice/18-modernisierungsprogramme-leiten.md` | technical_review |
<a id="kb-0695"></a>| KB-0695 | Migrationsstrategie und Cutover | `30-architect-practice/19-migrationsstrategie-und-cutover.md` | technical_review |
<a id="kb-0696"></a>| KB-0696 | Organisationsdesign für technische Systeme | `30-architect-practice/20-organisationsdesign-fuer-technische-systeme.md` | technical_review |
<a id="kb-0697"></a>| KB-0697 | Team Topologies und Zusammenarbeit | `30-architect-practice/21-team-topologies-und-zusammenarbeit.md` | technical_review |
<a id="kb-0698"></a>| KB-0698 | Conway's Law in Transformationsprogrammen | `30-architect-practice/22-conway-s-law-in-transformationsprogrammen.md` | technical_review |
<a id="kb-0699"></a>| KB-0699 | Architekturgovernance praktisch führen | `30-architect-practice/23-architekturgovernance-praktisch-fuehren.md` | technical_review |
<a id="kb-0700"></a>| KB-0700 | Architecture Review Boards moderieren | `30-architect-practice/24-architecture-review-boards-moderieren.md` | technical_review |
<a id="kb-0701"></a>| KB-0701 | Standards einführen und ablösen | `30-architect-practice/25-standards-einfuehren-und-abloesen.md` | technical_review |
<a id="kb-0702"></a>| KB-0702 | Technische Risikoregister | `30-architect-practice/26-technische-risikoregister.md` | technical_review |
<a id="kb-0703"></a>| KB-0703 | Architekturschulden priorisieren | `30-architect-practice/27-architekturschulden-priorisieren.md` | technical_review |
<a id="kb-0704"></a>| KB-0704 | Technologieportfolio und Governance | `30-architect-practice/28-technologieportfolio-und-governance.md` | technical_review |
<a id="kb-0705"></a>| KB-0705 | Architekturökonomie für Entscheider | `30-architect-practice/29-architekturoekonomie-fuer-entscheider.md` | technical_review |
<a id="kb-0706"></a>| KB-0706 | Operating Models und Finanzierung | `30-architect-practice/30-operating-models-und-finanzierung.md` | technical_review |
<a id="kb-0707"></a>| KB-0707 | Mentoring und technische Multiplikation | `30-architect-practice/31-mentoring-und-technische-multiplikation.md` | technical_review |
<a id="kb-0708"></a>| KB-0708 | Einfluss ohne Weisungsbefugnis | `30-architect-practice/32-einfluss-ohne-weisungsbefugnis.md` | technical_review |
<a id="kb-0709"></a>| KB-0709 | Technische Führung bei Incidents | `30-architect-practice/33-technische-fuehrung-bei-incidents.md` | technical_review |
<a id="kb-0710"></a>| KB-0710 | Staff-Interviewfälle | `30-architect-practice/34-staff-interviewfaelle.md` | technical_review |
<a id="kb-0711"></a>| KB-0711 | Principal-Interviewfälle | `30-architect-practice/35-principal-interviewfaelle.md` | technical_review |
<a id="kb-0712"></a>| KB-0712 | Chief-Architect-Interviewfälle | `30-architect-practice/36-chief-architect-interviewfaelle.md` | technical_review |
<a id="kb-0713"></a>| KB-0713 | Cloud-Architekturfall | `30-architect-practice/37-cloud-architekturfall.md` | technical_review |
<a id="kb-0714"></a>| KB-0714 | GenAI-Architekturfall | `30-architect-practice/38-genai-architekturfall.md` | technical_review |
<a id="kb-0715"></a>| KB-0715 | Enterprise-Plattformfall | `30-architect-practice/39-enterprise-plattformfall.md` | technical_review |
<a id="kb-0716"></a>| KB-0716 | Enterprise-Networking-Fall | `30-architect-practice/40-enterprise-networking-fall.md` | technical_review |
<a id="kb-0717"></a>| KB-0717 | Security-Architekturfall | `30-architect-practice/41-security-architekturfall.md` | technical_review |
<a id="kb-0718"></a>| KB-0718 | Migrationsfall mit Geschäftsfortführung | `30-architect-practice/42-migrationsfall-mit-geschaeftsfortfuehrung.md` | technical_review |
<a id="kb-0719"></a>| KB-0719 | Architekturpräsentationen und Verteidigung | `30-architect-practice/43-architekturpraesentationen-und-verteidigung.md` | technical_review |
<a id="kb-0720"></a>| KB-0720 | Portfolioevidenz und Reifemodelle | `30-architect-practice/44-portfolioevidenz-und-reifemodelle.md` | technical_review |

## Bonus: New Tech and Innovations

**Stand: 2026-09-14.** Für den Index selbst ist die wichtigste Innovation kein neues Produkt, sondern ein belastbares Arbeitsmuster: maschinenlesbares Manifest, inhaltliche Markdown-Kapitel, explizite Evidenz- und Reviewrecords sowie ein generierter Navigationslayer. Dieses Muster ist **Established** für überschaubare, versionierte Dokumentationsbestände. Es löst das Problem widersprüchlicher Tabellen und stiller Statusänderungen, führt aber eine neue Abhängigkeit ein: Der Generator und das Manifest müssen selbst geprüft und versioniert werden.

Eine semantische Suche oder ein Knowledge Graph kann später die Entdeckung über die 720 Kapitel verbessern. Der Reifegrad für diese Erweiterung ist hier **Emerging** bis **Adopting**: Er kann Nutzen für Impact-Analysen liefern, ersetzt aber keine von Menschen verantwortete kanonische Zuständigkeit, keine Quellenevidenz und keinen Review. Ein Pilot wäre erst sinnvoll, wenn Abfragen wie „welche angenommenen Kapitel sind von einer MCP-Spezifikationsänderung betroffen?“ mit Manifest und Volltextsuche nachweislich zu langsam oder unzuverlässig werden. Das Pilot-Abnahmekriterium lautet: vollständige, erklärbare Treffer mit einer Verknüpfung zum bestehenden Register, ohne eine zweite Statuswahrheit einzuführen.
