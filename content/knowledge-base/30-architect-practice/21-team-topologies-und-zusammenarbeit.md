---
{"id": "KB-0697", "title": "Team Topologies und Zusammenarbeit", "domain": "30", "sequence": 21, "document_type": "case", "content_version": "0.1.0", "status": "technical_review", "written_at": "2026-09-18", "technical_reviewed_at": null, "research_cutoff": "2026-09-18", "primary_roles": ["STAFF", "PRINCIPAL", "CHIEF", "GENAI", "PLATFORM", "ENTERPRISE", "CLOUD"], "requires": [{"id": "KB-0696", "concepts": ["Teamlast-Bewertung", "Abhängigkeitsbewertung"], "needed_for": "Team Topologies konkretisiert die in KB-0696 beschriebene Teamlast- und Abhängigkeitsbewertung auf konkrete Teamtypen und Interaktionsmodi"}], "related": [], "applies": [], "dependency_status": "resolved", "competencies": {"CURRENT-EVIDENCE": {"active": false, "scope": "Eigener aktueller Nachweis des Lernenden: vor dem Kapitel festhalten, welche Praxis zu diesem Thema bereits belegbar ist (Projekt, Zeitraum, Evidenzart, Grenze).", "rationale": "Die Selbsteinschätzung trennt belegte Erfahrung von Lernzielen; ohne Nachweis bleibt der Marker offen."}, "HANDS-ON-TARGET": {"active": true, "scope": "Für ein gegebenes, reales Lieferproblem die passenden Teamtypen und Interaktionsmodi anwenden und dabei kognitive Last explizit berücksichtigen können.", "rationale": null}, "ARCHITEKT-TARGET": {"active": true, "scope": "Für eine komplexe Organisationsstruktur mehrere Interaktionsmodi zwischen Teams gegeneinander abwägen und begründen, wann eine zeitlich begrenzte statt dauerhafte Zusammenarbeitsform angemessen ist.", "rationale": null}, "STAFF-TARGET": {"active": true, "scope": "Erkennen, wenn ein Team Topologies-Muster unreflektiert als starre Schablone angewendet wird, ohne es tatsächlich gegen das reale Lieferproblem zu prüfen.", "rationale": null}, "CHIEF-TARGET": {"active": true, "scope": "Unternehmensweite Standards für Team-Interaktionsmodi festlegen, die kognitive Last explizit als Grenze für Teamverantwortung berücksichtigen.", "rationale": null}, "SPECIALIST-OPTIONAL": {"active": true, "scope": "Die vollständige, formale Team-Topologies-Musterklassifikation mit allen Teamtypen im Detail ist Vertiefung.", "rationale": "Kern ist die praktische Anwendung der Kernprinzipien auf reale Lieferprobleme, nicht die vollständige, formale Musterklassifikation."}}, "lab_validation": [{"lab_id": "KB-0697-LAB-01", "status": "local_execution", "checked_at": "2026-09-18", "environment": "Lokales, deterministisches Rollenfallbeispiel zur Veranschaulichung kognitiver Überlastung bei unpassendem Teamtyp, keine reale Organisation involviert", "evidence": "Ein strukturiertes Fallbeispiel zeigt, wie ein Team, das als reines Stream-aligned-Team mit zu vielen, komplexen Zusatzverantwortungen (etwa vollständiger Plattformbetrieb) behandelt wird, kognitiv überlastet ist, während eine Aufteilung mit einem unterstützenden Platform-Team die Last tatsächlich reduziert.", "limitations": "Fiktives Rollenfallbeispiel als Übungsfall; keine reale Organisation."}]}
---
# Team Topologies und Zusammenarbeit

> **Ziel:** Team Topologies bietet einen Vokabular aus Teamtypen (etwa Stream-aligned Teams, die direkt an einem fachlichen Fluss arbeiten, und Platform Teams, die gemeinsame Fähigkeiten bereitstellen, siehe KB-0688) und Interaktionsmodi (wie Teams tatsächlich zusammenarbeiten — etwa "Collaboration" für zeitlich begrenzte, enge Zusammenarbeit, oder "X-as-a-Service" für eine klar abgegrenzte, service-artige Schnittstelle). Dieses Kapitel konkretisiert die in KB-0696 beschriebene Teamlast- und Abhängigkeitsbewertung auf diese konkreten Muster. Der zentrale Punkt dieses Kapitels ist, dass diese Muster auf tatsächliche, reale Lieferprobleme angewendet werden müssen, statt sie als starre Organisationsschablone unreflektiert einzuführen — ein Team-Topologies-Muster, das ohne Bezug zum tatsächlichen, konkreten Lieferproblem eingeführt wird, löst tatsächlich kein reales Problem und kann tatsächlich neue, unnötige Reibung erzeugen.

## Zweck, Mental Model und Dependencies

Kognitive Last als zentrales Kriterium zu nutzen bedeutet, tatsächlich zu bewerten, wie viel ein Team tatsächlich gleichzeitig verstehen und pflegen kann, bevor die Qualität tatsächlich leidet — ein Team, dem zu viele, komplexe Verantwortungsbereiche gleichzeitig zugewiesen sind, ist tatsächlich kognitiv überlastet, selbst wenn die formale Teamgröße ausreichend erscheint; diese kognitive Last, nicht die reine Teamgröße, ist tatsächlich das entscheidende Kriterium für die Frage, ob ein Team eine zusätzliche Verantwortung tatsächlich übernehmen sollte. Interaktionsmodi bewusst zu wählen bedeutet, tatsächlich zu entscheiden, wie zwei Teams zusammenarbeiten sollen, statt dies implizit und unstrukturiert geschehen zu lassen — "Collaboration" (enge, gemeinsame Arbeit, typischerweise zeitlich begrenzt, etwa während der initialen Entwicklung einer neuen Fähigkeit) unterscheidet sich fundamental von "X-as-a-Service" (eine klar abgegrenzte Schnittstelle, bei der ein Team eine Fähigkeit als tatsächlich nutzbaren Service bereitstellt, ohne dass eine enge, fortlaufende Abstimmung notwendig ist); die Wahl des Interaktionsmodus muss tatsächlich zum konkreten Zusammenarbeitsbedarf passen. Zeitlich begrenzte Zusammenarbeit bewusst zu planen bedeutet, tatsächlich zu erkennen, dass eine enge "Collaboration" häufig nur für eine bestimmte Phase sinnvoll ist (etwa während ein Platform-Team und ein Stream-aligned-Team gemeinsam eine neue Plattformfähigkeit entwickeln) und danach tatsächlich in einen weniger engen Modus (etwa "X-as-a-Service", sobald die Fähigkeit stabil nutzbar ist) übergehen sollte — eine dauerhaft enge Zusammenarbeit, die eigentlich nur für eine Übergangsphase notwendig war, bindet tatsächlich unnötig Koordinationsaufwand über die tatsächlich benötigte Zeit hinaus. Die Anwendung auf reale Lieferprobleme statt starre Schablonen bedeutet, tatsächlich vom konkreten, beobachteten Lieferproblem (etwa häufige, blockierende Abhängigkeiten zwischen zwei Teams) auszugehen und das passende Muster tatsächlich daraus abzuleiten, statt ein Team-Topologies-Muster als vermeintliche Blaupause unreflektiert auf die gesamte Organisation zu übertragen, unabhängig davon, ob die tatsächlichen Lieferprobleme dies tatsächlich rechtfertigen.

~~~text
Team Topologies offers vocabulary of team types (stream-aligned teams working directly
  on a business flow, platform teams providing shared capabilities, see KB-0688) +
  interaction modes (how teams ACTUALLY collaborate -- "Collaboration" for time-bounded,
  close collaboration, "X-as-a-Service" for clearly bounded, service-like interface)
  this chapter concretizes KB-0696's team-load+dependency assessment onto these concrete
  patterns
KEY POINT: these patterns must be applied to ACTUAL, real delivery problems instead of
  being introduced unreflectively as rigid organizational template -- pattern
  introduced w/o reference to ACTUAL, concrete delivery problem ACTUALLY solves no real
  problem, CAN ACTUALLY create new, unnecessary friction
USING COGNITIVE LOAD AS CENTRAL CRITERION means ACTUALLY assessing how much a team can
  ACTUALLY simultaneously understand+maintain before quality ACTUALLY suffers -- team
  ACTUALLY assigned too many, complex responsibility areas simultaneously is ACTUALLY
  cognitively overloaded, even if formal team size appears sufficient
  this cognitive load, not raw team size, is ACTUALLY the decisive criterion for whether
  a team should ACTUALLY take on additional responsibility
DELIBERATELY CHOOSING INTERACTION MODES means ACTUALLY deciding how two teams should
  collaborate instead of letting it happen implicitly+unstructured -- "Collaboration"
  (close, joint work, typically time-bounded, e.g. during initial development of a new
  capability) fundamentally differs from "X-as-a-Service" (clearly bounded interface,
  team provides a capability as ACTUALLY usable service, w/o close, ongoing coordination
  needed) -- interaction mode choice must ACTUALLY fit concrete collaboration need
DELIBERATELY PLANNING TIME-BOUNDED COLLABORATION means ACTUALLY recognizing close
  "Collaboration" often only sensible for a specific phase (platform team + stream-
  aligned team jointly developing a new platform capability) then ACTUALLY should
  transition to a less-close mode (X-as-a-Service once capability stably usable) --
  permanently close collaboration actually only needed for a transition phase ACTUALLY
  unnecessarily binds coordination effort beyond ACTUALLY needed time
APPLYING TO REAL DELIVERY PROBLEMS INSTEAD OF RIGID TEMPLATES means ACTUALLY starting
  from concrete, observed delivery problem (frequent, blocking dependencies between two
  teams), ACTUALLY deriving fitting pattern from it, instead of transferring a Team
  Topologies pattern as supposed blueprint unreflectively onto entire org, independent
  of whether ACTUAL delivery problems ACTUALLY justify this
~~~

## Core Concepts, Architektur und Implementierung

| Konzept | Zweck | Prüfrelevanz |
|---|---|---|
| Kognitive Last als Kriterium | entscheidet, ob Team zusätzliche Verantwortung übernehmen sollte | wichtiger als reine Teamgröße |
| Bewusste Interaktionsmodus-Wahl (Collaboration vs. X-as-a-Service) | passt Zusammenarbeitsform an tatsächlichen Bedarf an | verhindert unstrukturierte, implizite Zusammenarbeit |
| Zeitlich begrenzte Collaboration | plant Übergang zu loserem Modus nach Übergangsphase | verhindert dauerhaft unnötigen Koordinationsaufwand |
| Anwendung auf reale Lieferprobleme | leitet Muster aus konkretem, beobachtetem Problem ab | verhindert unreflektierte Schablonenübertragung |

Implementierung: Die kognitive Last jedes Teams wird explizit gegen seine zugewiesenen Verantwortungsbereiche geprüft. Interaktionsmodi zwischen Teams werden bewusst gewählt und dokumentiert, mit explizit geplantem Übergang von Collaboration zu X-as-a-Service, sobald eine Fähigkeit stabil nutzbar ist.

## Scalability, Reliability, Security und Observability

Eine Team-Topologies-Praxis skaliert über die Anzahl der Teams und deren Interaktionsbeziehungen; die Reliability-Grenze liegt darin, dass eine kognitiv überlastete Teamzuweisung tatsächlich zu Qualitätseinbußen in allen zugewiesenen Verantwortungsbereichen führt.

| Symptom | Hypothese | Gegenprobe |
|---|---|---|
| ein Team liefert in mehreren Bereichen niedrige Qualität | das Team ist kognitiv überlastet durch zu viele, komplexe Verantwortungsbereiche | die Teamverantwortung reduzieren oder ein unterstützendes Platform-Team einführen |
| zwei Teams bleiben dauerhaft in enger, aufwändiger Abstimmung, obwohl die ursprüngliche Übergangsphase abgeschlossen ist | kein expliziter Übergang von Collaboration zu einem loseren Interaktionsmodus wurde geplant | den Interaktionsmodus explizit auf X-as-a-Service umstellen, sobald die Fähigkeit stabil nutzbar ist |
| ein eingeführtes Team-Topologies-Muster löst kein tatsächliches Problem | das Muster wurde als starre Schablone ohne Bezug zu einem konkreten Lieferproblem eingeführt | das Muster gegen ein tatsächlich beobachtetes, konkretes Lieferproblem neu bewerten |

Security: Teams mit X-as-a-Service-Interaktionsmodus sollten klare, dokumentierte Schnittstellenverträge einschließlich Sicherheitsanforderungen bereitstellen. Observability: Die tatsächliche Häufigkeit und Dauer von Collaboration-Phasen zwischen Teams ist ein zentrales Signal zur Bewertung, ob Übergänge zu loseren Interaktionsmodi tatsächlich rechtzeitig erfolgen.

## Trade-offs und Entscheidungen

**Staff** arbeitet innerhalb eines gegebenen Interaktionsmodus mit einem anderen Team zusammen. **Principal** entwirft die vollständige Interaktionsmodus-Struktur mit geplanten Übergängen für einen komplexen Zusammenarbeitsbedarf. **Chief** legt unternehmensweite Standards für Team-Interaktionsmodi fest, die kognitive Last als verbindliches Kriterium vorschreiben.

Anti-Patterns: ein Team-Topologies-Muster unreflektiert als Organisationsschablone ohne Bezug zu einem realen Lieferproblem einführen; einem Team zu viele, kognitiv überlastende Verantwortungsbereiche zuweisen; eine ursprünglich zeitlich begrenzte Collaboration dauerhaft fortführen, ohne einen Übergang zu einem loseren Modus zu planen.

## Production Checklist

- [ ] Die kognitive Last jedes Teams ist explizit gegen seine Verantwortungsbereiche geprüft.
- [ ] Interaktionsmodi zwischen Teams sind bewusst gewählt und dokumentiert.
- [ ] Ein expliziter Übergang von Collaboration zu einem loseren Modus ist geplant, sobald eine Fähigkeit stabil nutzbar ist.
- [ ] Jedes eingeführte Muster ist gegen ein konkretes, beobachtetes Lieferproblem begründet.

## Interviewfragen

### 1. Warum ist kognitive Last ein wichtigeres Kriterium als reine Teamgröße?

**Antwort:** Weil ein Team mit ausreichender formaler Größe dennoch kognitiv überlastet sein kann, wenn ihm zu viele, komplexe Verantwortungsbereiche gleichzeitig zugewiesen sind, was die Qualität in allen Bereichen beeinträchtigt.

### 2. Was unterscheidet den Interaktionsmodus "Collaboration" von "X-as-a-Service"?

**Antwort:** Collaboration ist enge, typischerweise zeitlich begrenzte, gemeinsame Arbeit, während X-as-a-Service eine klar abgegrenzte Schnittstelle ist, bei der eine Fähigkeit als nutzbarer Service ohne enge, fortlaufende Abstimmung bereitgestellt wird.

### 3. Warum sollte eine enge Collaboration-Phase zeitlich begrenzt geplant werden?

**Antwort:** Weil eine dauerhaft enge Zusammenarbeit, die eigentlich nur für eine Übergangsphase notwendig war, unnötig Koordinationsaufwand über die tatsächlich benötigte Zeit hinaus bindet.

### 4. Warum sollten Team-Topologies-Muster nicht als starre Schablone unreflektiert eingeführt werden?

**Antwort:** Weil ein Muster ohne Bezug zum tatsächlichen, konkreten Lieferproblem kein reales Problem löst und tatsächlich neue, unnötige Reibung erzeugen kann.

### 5. Wie gehst du vor, wenn ein Team in mehreren Bereichen niedrige Qualität liefert?

**Antwort:** Ich prüfe, ob das Team kognitiv überlastet ist durch zu viele, komplexe Verantwortungsbereiche, und reduziere die Verantwortung oder führe ein unterstützendes Platform-Team ein.

### 6. Widersprüchliche Anforderung: Zwei Teams wollen aus Gewohnheit die enge Zusammenarbeitsform beibehalten, obwohl die ursprüngliche Übergangsphase abgeschlossen ist, UND die Organisation will reduzierten Koordinationsaufwand durch klarere Schnittstellen — wie gehst du vor?

**Antwort:** Ich würde gemeinsam mit beiden Teams prüfen, ob die zugrunde liegende Fähigkeit tatsächlich stabil genug für eine X-as-a-Service-Schnittstelle ist, und bei Bestätigung einen expliziten, schrittweisen Übergang einleiten, statt die enge Zusammenarbeit aus reiner Gewohnheit unbegrenzt fortzuführen.

## Praktische Labs / Fallarbeit

**Hinweis:** Das folgende Fallbeispiel ist fiktiv und dient ausschließlich als Übungsfall.

Aufgabe: Ein Stream-aligned Team für eine GenAI-Anwendung (angelehnt an Domain 11) übernimmt zusätzlich den vollständigen Betrieb der zugrunde liegenden GPU-Infrastruktur (angelehnt an Domain 17), obwohl kein dediziertes Platform-Team existiert.

~~~python
# Local, deterministic illustration of cognitive load assessment for team responsibility assignment (fictional lab example, no real organization):

def assess_cognitive_load(responsibilities, complexity_weights, max_capacity):
    total_load = sum(complexity_weights.get(r, 1) for r in responsibilities)
    return {"total_load": total_load, "overloaded": total_load > max_capacity}

responsibilities = ["genai_feature_development", "gpu_cluster_operations", "model_deployment_pipeline"]
weights = {"genai_feature_development": 3, "gpu_cluster_operations": 4, "model_deployment_pipeline": 3}

print(assess_cognitive_load(responsibilities, weights, max_capacity=6))
~~~

Erwartete Beobachtung: Die Bewertung zeigt eine kognitive Überlastung des Teams an, da die Gesamtlast die angenommene Kapazitätsgrenze überschreitet. Auswertung: Ein dediziertes Platform-Team für die GPU-Infrastruktur würde die kognitive Last des Stream-aligned-Teams reduzieren und es ihm ermöglichen, sich auf die eigentliche fachliche Funktionsentwicklung zu konzentrieren.

## Dependencies, Cross-References und Quellen

1. Matthew Skelton, Manuel Pais: [Team Topologies — Organizing Business and Technology Teams for Fast Flow](https://teamtopologies.com/), abgerufen 2026-09-18.
2. Matthew Skelton: [Team Topologies — Interaction Modes Explained](https://teamtopologies.com/key-concepts), abgerufen 2026-09-18.

Dieses Kapitel konkretisiert die in KB-0696 (Organisationsdesign für technische Systeme) beschriebene Teamlast- und Abhängigkeitsbewertung auf konkrete Teamtypen und Interaktionsmodi.

## Bonus: New Tech and Innovations

| Entwicklung | Reifegrad | Entscheidung |
|---|---|---|
| KI-gestützte, kontinuierliche Erfassung tatsächlicher Cross-Team-Interaktionsmuster (Kommunikationshäufigkeit, gemeinsame Deployments) zur datengestützten Bewertung, ob ein Interaktionsmoduswechsel angebracht ist | Emerging | Bei künftigen, größeren Organisationen als Ergänzung evaluieren, jedoch die finale Entscheidung über Interaktionsmoduswechsel weiterhin gemeinsam mit den betroffenen Teams treffen. |

Ein Team akzeptiert eine Team-Topologies-Anwendung erst, wenn kognitive Last explizit bewertet, Interaktionsmodi bewusst gewählt und gegen ein konkretes, reales Lieferproblem begründet sind.
